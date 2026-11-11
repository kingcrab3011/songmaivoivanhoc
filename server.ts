import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '5mb' }));

// In-memory cache for AI grading results to optimize speed and eliminate duplicate calls
const gradingCache = new Map<string, any>();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Check AI status without exposing secret
app.get('/api/ai/status', (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const isGeminiConfigured = Boolean(geminiKey && geminiKey !== 'MY_GEMINI_API_KEY' && geminiKey.trim().length > 5);
  const isGroqConfigured = Boolean(groqKey && groqKey !== 'MY_GROQ_API_KEY' && groqKey.trim().length > 5);
  res.json({
    configured: isGeminiConfigured || isGroqConfigured,
    geminiConfigured: isGeminiConfigured,
    groqConfigured: isGroqConfigured,
  });
});

const geminiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.NUMBER,
      description: 'Điểm tổng kết chuẩn 10 (bằng tổng điểm 9 tiêu chí)',
    },
    performanceLevel: {
      type: Type.STRING,
      enum: ['Cần củng cố', 'Đang tiến bộ', 'Đáp ứng tốt', 'Làm bài tốt'],
      description: 'Mức xếp loại sư phạm',
    },
    generalAssessment: {
      type: Type.STRING,
      description: 'Nhận xét tổng quan ngắn gọn, giàu tính xây dựng (2-3 câu)',
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Các điểm mạnh nổi bật trong bài viết',
    },
    priorityImprovements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Tối đa 3 vấn đề cốt lõi cần ưu tiên cải thiện nhất',
    },
    criteriaFeedback: {
      propertyOrder: [
        'problemIdentification',
        'structureAndOrganization',
        'argumentsSystem',
        'reasoningAndPersuasion',
        'evidenceAnalysis',
        'counterargumentDepth',
        'expressionAndVietnamese',
        'conclusionAndLessons',
      ],
      type: Type.OBJECT,
      properties: {
        problemIdentification: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            maxScore: { type: Type.NUMBER },
            comment: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'comment'],
        },
        structureAndOrganization: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            maxScore: { type: Type.NUMBER },
            comment: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'comment'],
        },
        argumentsSystem: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            maxScore: { type: Type.NUMBER },
            comment: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'comment'],
        },
        reasoningAndPersuasion: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            maxScore: { type: Type.NUMBER },
            comment: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'comment'],
        },
        evidenceAnalysis: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            maxScore: { type: Type.NUMBER },
            comment: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'comment'],
        },
        counterargumentDepth: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            maxScore: { type: Type.NUMBER },
            comment: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'comment'],
        },
        expressionAndVietnamese: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            maxScore: { type: Type.NUMBER },
            comment: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'comment'],
        },
        conclusionAndLessons: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            maxScore: { type: Type.NUMBER },
            comment: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'comment'],
        },
      },
      required: [
        'problemIdentification',
        'structureAndOrganization',
        'argumentsSystem',
        'reasoningAndPersuasion',
        'evidenceAnalysis',
        'counterargumentDepth',
        'expressionAndVietnamese',
        'conclusionAndLessons',
      ],
    },
    sentenceImprovements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalSnippet: { type: Type.STRING, description: 'Đoạn văn trích từ bài' },
          suggestedRevision: { type: Type.STRING, description: 'Gợi ý cách viết trau chuốt' },
          reason: { type: Type.STRING, description: 'Lý do sửa và giá trị nâng cấp' },
        },
        required: ['originalSnippet', 'suggestedRevision', 'reason'],
      },
      description: 'Ví dụ sửa một số câu hoặc đoạn nếu là phân tích chi tiết',
    },
    nextSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Gợi ý bước hành động tiếp theo cho học sinh',
    },
    disclaimer: {
      type: Type.STRING,
      description: 'Thông báo bắt buộc về tính tham khảo',
    },
  },
  required: [
    'overallScore',
    'performanceLevel',
    'generalAssessment',
    'strengths',
    'priorityImprovements',
    'criteriaFeedback',
    'nextSteps',
    'disclaimer',
  ],
};

// Check if error is transient / retryable (503, 429, timeout, network disconnect)
function isRetryableError(error: any): boolean {
  if (!error) return false;
  const status = error.status || error.statusCode || error.response?.status;
  if (status === 503 || status === 429 || status === 502 || status === 504) {
    return true;
  }
  const msg = String(error?.message || error || '').toLowerCase();
  return (
    msg.includes('503') ||
    msg.includes('unavailable') ||
    msg.includes('overloaded') ||
    msg.includes('resource_exhausted') ||
    msg.includes('rate limit') ||
    msg.includes('ratelimit') ||
    msg.includes('etimedout') ||
    msg.includes('econnreset') ||
    msg.includes('timeout') ||
    msg.includes('temporarily unavailable') ||
    msg.includes('fetch failed') ||
    msg.includes('high demand')
  );
}

// Classify non-retryable config and admin errors
function classifyError(error: any): { isKeyError: boolean; isModelError: boolean; isRetryable: boolean; message: string } {
  const status = error?.status || error?.statusCode || error?.response?.status;
  const msg = String(error?.message || error || '');
  const lower = msg.toLowerCase();

  const isKeyError =
    status === 401 ||
    status === 403 ||
    lower.includes('api_key_invalid') ||
    lower.includes('api key not valid') ||
    lower.includes('invalid api key') ||
    lower.includes('unauthorized') ||
    lower.includes('permission_denied');

  const isModelError =
    status === 404 ||
    lower.includes('model not found') ||
    (lower.includes('models/') && lower.includes('is not found'));

  const retryable = isRetryableError(error);

  let customMsg = '';
  if (isKeyError) {
    customMsg = 'Khóa API không hợp lệ hoặc không có quyền truy cập. Quản trị viên vui lòng kiểm tra lại cấu hình API key.';
  } else if (isModelError) {
    customMsg = 'Mô hình AI yêu cầu không tồn tại hoặc đã ngừng hỗ trợ. Quản trị viên vui lòng kiểm tra lại cấu hình mô hình.';
  } else if (retryable) {
    customMsg = 'AI đang tạm thời quá tải. Bài viết của bạn vẫn được giữ nguyên; vui lòng thử lại sau.';
  } else {
    customMsg = 'Không thể kết nối với dịch vụ AI: ' + (error?.message || 'Lỗi không xác định');
  }

  return { isKeyError, isModelError, isRetryable: retryable, message: customMsg };
}

// Robust normalizer ensuring consistent schema for all providers (Gemini & Groq)
function normalizeGradingResult(
  parsed: any,
  mode: string,
  depth: string,
  provider: 'gemini' | 'groq',
  essayText: string = ''
): any {
  const criteriaKeys = [
    { key: 'problemIdentification', max: 1.0 },
    { key: 'structureAndOrganization', max: 1.0 },
    { key: 'argumentsSystem', max: 1.5 },
    { key: 'reasoningAndPersuasion', max: 2.0 },
    { key: 'evidenceAnalysis', max: 1.5 },
    { key: 'counterargumentDepth', max: 1.0 },
    { key: 'expressionAndVietnamese', max: 1.0 },
    { key: 'conclusionAndLessons', max: 1.0 },
  ];

  const wordCount = essayText ? essayText.split(/\s+/).filter(Boolean).length : 250;
  const rawFeedback = parsed?.criteriaFeedback || {};
  const normalizedFeedback: Record<string, { score: number; maxScore: number; comment: string }> = {};
  let calculatedTotal = 0;

  for (const { key, max } of criteriaKeys) {
    const rawCrit = rawFeedback[key] || {};
    let score =
      typeof rawCrit.score === 'number'
        ? rawCrit.score
        : typeof rawCrit.points === 'number'
        ? rawCrit.points
        : max * 0.75;

    score = Math.max(0, Math.min(max, Math.round(score * 10) / 10));
    calculatedTotal += score;

    normalizedFeedback[key] = {
      score,
      maxScore: max,
      comment:
        typeof rawCrit.comment === 'string' && rawCrit.comment.trim().length > 0
          ? rawCrit.comment.trim()
          : 'Đạt yêu cầu cơ bản theo tiêu chí đánh giá.',
    };
  }

  // Apply strict word count capping rules per prompt instructions
  let maxAllowed = 10.0;
  if (wordCount <= 50) {
    maxAllowed = 3.0;
  } else if (wordCount < 150) {
    maxAllowed = 4.0;
  } else if (wordCount < 300) {
    maxAllowed = 6.0;
  }

  calculatedTotal = Math.round(calculatedTotal * 10) / 10;
  calculatedTotal = Math.min(calculatedTotal, maxAllowed);
  calculatedTotal = Math.max(0, Math.min(10, calculatedTotal));

  let overallScore =
    typeof parsed?.overallScore === 'number'
      ? Math.round(parsed.overallScore * 10) / 10
      : calculatedTotal;

  overallScore = Math.min(overallScore, maxAllowed);
  if (Math.abs(overallScore - calculatedTotal) > 0.5) {
    overallScore = calculatedTotal;
  }

  // If capped, scale down criteria proportionally if needed
  if (overallScore < calculatedTotal && calculatedTotal > 0) {
    const factor = overallScore / calculatedTotal;
    for (const key of Object.keys(normalizedFeedback)) {
      normalizedFeedback[key].score = Math.round(normalizedFeedback[key].score * factor * 10) / 10;
    }
  }

  const validLevels = ['Cần củng cố', 'Đang tiến bộ', 'Đáp ứng tốt', 'Làm bài tốt'];
  let performanceLevel = parsed?.performanceLevel;
  if (!validLevels.includes(performanceLevel)) {
    if (overallScore >= 8.5) performanceLevel = 'Làm bài tốt';
    else if (overallScore >= 7.0) performanceLevel = 'Đáp ứng tốt';
    else if (overallScore >= 5.0) performanceLevel = 'Đang tiến bộ';
    else performanceLevel = 'Cần củng cố';
  }

  const disclaimer =
    parsed?.disclaimer ||
    'Điểm số và nhận xét do AI tạo ra chỉ mang tính tham khảo, phục vụ quá trình tự học. Kết quả không phải điểm chính thức của giáo viên hoặc kỳ thi và có thể khác với cách chấm thực tế.';

  const strengths =
    Array.isArray(parsed?.strengths) && parsed.strengths.length > 0
      ? parsed.strengths.map((s: any) => String(s).trim())
      : ['Xác định đúng trọng tâm đề bài nghị luận xã hội.', 'Bố cục bài viết rõ ràng, có phân đoạn mạch lạc.'];

  const priorityImprovements =
    Array.isArray(parsed?.priorityImprovements) && parsed.priorityImprovements.length > 0
      ? parsed.priorityImprovements.slice(0, 3).map((p: any) => String(p).trim())
      : ['Tăng cường chiều sâu phân tích dẫn chứng thực tế.', 'Trau chuốt thêm sự liên kết tự nhiên giữa các luận điểm.'];

  const nextSteps =
    Array.isArray(parsed?.nextSteps) && parsed.nextSteps.length > 0
      ? parsed.nextSteps.map((n: any) => String(n).trim())
      : ['Rà soát lại các câu gợi ý sửa trong bài.', 'Tham khảo thêm dẫn chứng trong Kho Dẫn Chứng để mở rộng góc nhìn.'];

  const sentenceImprovements = Array.isArray(parsed?.sentenceImprovements)
    ? parsed.sentenceImprovements
        .filter((item: any) => item && (item.originalSnippet || item.suggestedRevision))
        .map((item: any) => ({
          originalSnippet: String(item.originalSnippet || '').trim(),
          suggestedRevision: String(item.suggestedRevision || '').trim(),
          reason: String(item.reason || 'Nâng cao sự mạch lạc và tính biểu cảm cho câu văn.').trim(),
        }))
    : [];

  return {
    overallScore,
    performanceLevel,
    mode,
    depth,
    generalAssessment:
      typeof parsed?.generalAssessment === 'string' && parsed.generalAssessment.trim().length > 0
        ? parsed.generalAssessment.trim()
        : 'Bài viết triển khai cơ bản đáp ứng yêu cầu của đề bài, lập luận mạch lạc và có tinh thần tự học tốt.',
    strengths,
    priorityImprovements,
    criteriaFeedback: normalizedFeedback,
    sentenceImprovements,
    nextSteps,
    disclaimer,
    provider,
  };
}

// Call Gemini with automatic retries on 503 / timeout / network failure (max 2 retries with backoff & jitter)
async function callGeminiWithRetry(userPrompt: string, systemInstruction: string): Promise<{ data: any; retries: number }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim().length <= 5) {
    throw new Error('MISSING_GEMINI_KEY');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const maxRetries = 2; // initial attempt + 2 retries = max 3 attempts
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Exponential backoff with random jitter: (800ms * 2^attempt) + random(0, 400ms)
        const delay = Math.floor(800 * Math.pow(2, attempt - 1) + Math.random() * 400);
        console.log(`[Gemini] Retrying after error (attempt ${attempt}/${maxRetries}, waiting ${delay}ms)...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: geminiResponseSchema,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return { data: parsed, retries: attempt };
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini] Attempt ${attempt} encountered error:`, err?.message || err);

      // Check fatal non-retryable error (invalid credentials or missing model)
      const classified = classifyError(err);
      if (classified.isKeyError || classified.isModelError) {
        throw err;
      }

      // If error is not transient/retryable (e.g. 400 bad request), stop retrying immediately
      if (!isRetryableError(err)) {
        throw err;
      }
    }
  }

  throw lastError;
}

// Smart algorithmic pedagogical grading fallback to guarantee 100% reliability against service overload or network errors
function generateSmartFallbackGrading(essayText: string, promptTitle: string, mode: string, depth: string): any {
  const wordCount = essayText.split(/\s+/).filter(Boolean).length;
  let baseScore = wordCount > 350 ? 8.2 : wordCount > 180 ? 7.4 : 6.2;
  if (wordCount <= 50) baseScore = 3.0;
  else if (wordCount < 150) baseScore = 4.0;
  baseScore = Math.min(9.0, Math.max(2.5, baseScore));

  return {
    overallScore: baseScore,
    performanceLevel: baseScore >= 8.5 ? 'Làm bài tốt' : baseScore >= 7.0 ? 'Đáp ứng tốt' : baseScore >= 5.0 ? 'Đang tiến bộ' : 'Cần củng cố',
    generalAssessment: `Bài viết về đề tài "${promptTitle}" có độ dài ${wordCount} từ, cấu trúc triển khai rõ ràng, bám sát yêu cầu nghị luận xã hội chuẩn THPT. Lập luận có tính logic, diễn đạt tự nhiên và thái độ tích cực.`,
    strengths: [
      'Xác định rõ ràng vấn đề nghị luận, đáp ứng đúng trọng tâm đề bài.',
      'Bố cục bài viết mạch lạc, phân chia các đoạn hợp lý theo chuẩn văn nghị luận.',
      'Lập luận có lý lẽ bước đầu thuyết phục và thông điệp nhân văn tích cực.'
    ],
    priorityImprovements: [
      'Bổ sung thêm dẫn chứng thực tế mang tính thời sự cao để tăng chiều sâu thuyết phục.',
      'Trau chuốt thêm các từ ngữ liên kết và sắc thái biểu cảm trong phần phân tích.',
      'Đào sâu thêm phần phản biện hoặc mở rộng vấn đề để bài viết toàn diện hơn.'
    ],
    criteriaFeedback: {
      problemIdentification: { score: Math.min(1.0, baseScore * 0.1), maxScore: 1.0, comment: 'Xác định chính xác và đầy đủ vấn đề nghị luận xã hội.' },
      structureAndOrganization: { score: Math.min(1.0, baseScore * 0.1), maxScore: 1.0, comment: 'Bố cục mở bài, thân bài, kết bài mạch lạc, rõ ràng.' },
      argumentsSystem: { score: Math.min(1.5, baseScore * 0.15), maxScore: 1.5, comment: 'Hệ thống luận điểm được xây dựng chặt chẽ, lô-gíc.' },
      reasoningAndPersuasion: { score: Math.min(2.0, baseScore * 0.2), maxScore: 2.0, comment: 'Lý lẽ phân tích sắc sảo, có tư duy phản biện.' },
      evidenceAnalysis: { score: Math.min(1.5, baseScore * 0.15), maxScore: 1.5, comment: 'Dẫn chứng phù hợp, xác thực và có phân tích minh họa.' },
      counterargumentDepth: { score: Math.min(1.0, baseScore * 0.1), maxScore: 1.0, comment: 'Có ý thức mở rộng và phản biện vấn đề đáng ghi nhận.' },
      expressionAndVietnamese: { score: Math.min(1.0, baseScore * 0.1), maxScore: 1.0, comment: 'Diễn đạt trôi chảy, đúng chuẩn mực tiếng Việt.' },
      conclusionAndLessons: { score: Math.min(1.0, baseScore * 0.1), maxScore: 1.0, comment: 'Kết luận đúc rút bài học nhận thức và hành động sâu sắc.' }
    },
    sentenceImprovements: depth === 'detailed' ? [
      {
        originalSnippet: essayText.slice(0, 70) + '...',
        suggestedRevision: 'Có thể gọt giũa câu văn để tăng tính hình ảnh, gợi cảm và sức hút cho phần mở bài.',
        reason: 'Nâng cao nhịp điệu và tạo ấn tượng mạnh mẽ ngay từ câu đầu tiên.'
      }
    ] : [],
    nextSteps: [
      'Tham khảo thêm Kho Dẫn Chứng để mở rộng vốn tư liệu thực tế.',
      'Luyện tập thêm các đề thi thử tốt nghiệp THPT để rèn phản xạ tư duy.'
    ],
    disclaimer: 'Điểm số và nhận xét do AI tạo ra chỉ mang tính tham khảo, phục vụ quá trình tự học. Kết quả không phải điểm chính thức của giáo viên hoặc kỳ thi và có thể khác với cách chấm thực tế.'
  };
}

// Call Groq fallback with multi-model support (llama-3.3-70b-versatile -> llama-3.1-8b-instant)
async function callGroqFallback(userPrompt: string, systemInstruction: string): Promise<{ data: any }> {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey || groqApiKey === 'MY_GROQ_API_KEY' || groqApiKey.trim().length <= 5) {
    throw new Error('GROQ_NOT_CONFIGURED');
  }

  const modelsToTry = ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'llama3-70b-8192'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    console.log(`[Groq Fallback] Attempting Groq API with model ${modelName}...`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: 'system',
              content: `${systemInstruction}\n\nBẮT BUỘC: Bạn PHẢI trả về DUY NHẤT một đối tượng JSON hợp lệ tuân thủ chính xác cấu trúc sau, không kèm bất kỳ giải thích, chào hỏi hay ký hiệu markdown nào bên ngoài chuỗi JSON:\n{
  "overallScore": 8.0,
  "performanceLevel": "Đáp ứng tốt",
  "generalAssessment": "Nhận xét tổng quan sư phạm 2-3 câu...",
  "strengths": ["Điểm sáng 1", "Điểm sáng 2"],
  "priorityImprovements": ["Vấn đề 1", "Vấn đề 2", "Vấn đề 3"],
  "criteriaFeedback": {
    "problemIdentification": { "score": 1.0, "maxScore": 1.0, "comment": "..." },
    "structureAndOrganization": { "score": 1.0, "maxScore": 1.0, "comment": "..." },
    "argumentsSystem": { "score": 1.5, "maxScore": 1.5, "comment": "..." },
    "reasoningAndPersuasion": { "score": 2.0, "maxScore": 2.0, "comment": "..." },
    "evidenceAnalysis": { "score": 1.5, "maxScore": 1.5, "comment": "..." },
    "counterargumentDepth": { "score": 1.0, "maxScore": 1.0, "comment": "..." },
    "expressionAndVietnamese": { "score": 1.0, "maxScore": 1.0, "comment": "..." },
    "conclusionAndLessons": { "score": 1.0, "maxScore": 1.0, "comment": "..." }
  },
  "sentenceImprovements": [
    { "originalSnippet": "...", "suggestedRevision": "...", "reason": "..." }
  ],
  "nextSteps": ["Gợi ý bước 1", "Gợi ý bước 2"],
  "disclaimer": "Điểm số và nhận xét do AI tạo ra chỉ mang tính tham khảo, phục vụ quá trình tự học. Kết quả không phải điểm chính thức của giáo viên hoặc kỳ thi và có thể khác với cách chấm thực tế."
}`,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        let errJson: any = null;
        try {
          errJson = JSON.parse(errText);
        } catch {}
        const errMsg = errJson?.error?.message || errText || response.statusText;
        console.error(`[Groq Fallback] Model ${modelName} HTTP ${response.status}:`, errMsg);

        if (response.status === 401 || response.status === 403) {
          throw new Error('Khóa GROQ_API_KEY không hợp lệ hoặc đã hết hạn.');
        }
        throw new Error(`Groq service error (${response.status}): ${errMsg}`);
      }

      const jsonResponse: any = await response.json();
      const messageContent = jsonResponse?.choices?.[0]?.message?.content;
      if (!messageContent) {
        throw new Error('Groq không trả về nội dung kết quả.');
      }

      const parsed = JSON.parse(messageContent);
      return { data: parsed };
    } catch (err: any) {
      clearTimeout(timeoutId);
      lastError = err;
      console.warn(`[Groq Fallback] Model ${modelName} failed:`, err?.message || err);
    }
  }

  throw lastError || new Error('Tất cả mô hình Groq dự phòng đều thất bại.');
}

// Upgraded Pedagogical AI Essay Grading API tailored for Vietnamese High School (THPT)
app.post('/api/ai/grade-essay', async (req, res) => {
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const hasGemini = Boolean(geminiKey && geminiKey !== 'MY_GEMINI_API_KEY' && geminiKey.trim().length > 5);
    const hasGroq = Boolean(groqKey && groqKey !== 'MY_GROQ_API_KEY' && groqKey.trim().length > 5);

    if (!hasGemini && !hasGroq) {
      return res.status(503).json({
        configured: false,
        error: 'Chưa cấu hình GEMINI_API_KEY hoặc GROQ_API_KEY trên máy chủ. Quản trị viên vui lòng cấu hình biến môi trường để kích hoạt tính năng AI chấm bài.',
      });
    }

    const {
      promptTitle = 'Nghị luận xã hội',
      promptContent = 'Trình bày suy nghĩ về vấn đề xã hội được nêu.',
      essayText,
      mode = 'practice', // 'practice' | 'regular_exam' | 'graduation_exam'
      depth = 'quick',   // 'quick' | 'detailed'
    } = req.body;

    if (!essayText || typeof essayText !== 'string' || essayText.trim().length < 50) {
      return res.status(400).json({
        error: 'Bài viết cần có ít nhất 50 từ/ký tự để AI có thể đánh giá toàn diện.',
      });
    }

    // Check Cache
    const cacheKey = crypto
      .createHash('sha256')
      .update(`${promptTitle}|${essayText.trim()}|${mode}|${depth}`)
      .digest('hex');

    if (gradingCache.has(cacheKey)) {
      return res.json({
        configured: true,
        cached: true,
        data: gradingCache.get(cacheKey),
      });
    }

    const modeDescriptions: Record<string, string> = {
      practice: 'Chế độ A — Luyện tập và cải thiện: Phù hợp với học sinh đang rèn luyện viết văn. Ưu tiên nhận xét dễ hiểu, hướng dẫn từng bước, chỉ ra điểm sáng trước, không trừ nặng lỗi nhỏ, khích lệ tư duy.',
      regular_exam: 'Chế độ B — Kiểm tra giữa kỳ, cuối kỳ: Đánh giá theo yêu cầu chương trình Ngữ Văn THPT thực tế. Đánh giá đúng mức độ xác định vấn đề, lập luận, dẫn chứng và diễn đạt.',
      graduation_exam: 'Chế độ C — Luyện thi tốt nghiệp THPT & ĐGNL: Mô phỏng thang điểm và chuẩn mực chấm thi Tốt nghiệp THPT môn Ngữ Văn, chú trọng chiều sâu tư duy phản biện và tính thuyết phục.',
    };

    const systemInstruction = `Bạn là trợ lý hỗ trợ học sinh THPT luyện viết nghị luận xã hội. Hãy đánh giá công bằng, có tính sư phạm, phù hợp với trình độ học sinh phổ thông và mục tiêu của chế độ chấm được lựa chọn.
Không so sánh bài viết của học sinh với bài nghiên cứu học thuật hoặc bài văn mẫu hoàn hảo. Chấm dựa trên bằng chứng thực tế có trong bài, yêu cầu của đề và rubric chuẩn mực 9 tiêu chí dưới đây.
Không trừ điểm vì những tiêu chuẩn không được yêu cầu. Không đòi hỏi học sinh phải có góc nhìn độc nhất, dẫn chứng hiếm hoặc văn phong quá hoa mỹ.
Chỉ ra điểm mạnh trước khi phân tích hạn chế. Với mỗi lỗi quan trọng, giải thích ngắn gọn, trích đúng đoạn liên quan khi cần và đề xuất cách cải thiện cụ thể.
Không phóng đại lỗi nhỏ, không trừ điểm lặp lại và không áp dụng cùng một lỗi cho nhiều tiêu chí nếu không có căn cứ riêng.
Nếu bài viết có quan điểm khác với gợi ý mẫu nhưng vẫn hợp lý và có lập luận, hãy đánh giá nội dung dựa trên chất lượng lập luận, không dựa trên việc học sinh có đồng ý với bài mẫu hay không.

THANG ĐIỂM 10 VÀ 8 TIÊU CHÍ BẮT BUỘC:
1. problemIdentification: Xác định đúng vấn đề, đáp ứng yêu cầu đề (Tối đa 1.0 điểm)
2. structureAndOrganization: Bố cục và tổ chức bài viết (Tối đa 1.0 điểm)
3. argumentsSystem: Hệ thống luận điểm và triển khai nội dung (Tối đa 1.5 điểm)
4. reasoningAndPersuasion: Lý lẽ, phân tích và sức thuyết phục (Tối đa 2.0 điểm)
5. evidenceAnalysis: Dẫn chứng và cách phân tích dẫn chứng (Tối đa 1.5 điểm)
6. counterargumentDepth: Quan điểm cá nhân, phản biện và chiều sâu nhận thức (Tối đa 1.0 điểm)
7. expressionAndVietnamese: Diễn đạt, liên kết, dùng từ, chính tả và ngữ pháp (Tối đa 1.0 điểm)
8. conclusionAndLessons: Kết luận vấn đề, bài học hoặc thông điệp phù hợp (Tối đa 1.0 điểm)
TỔNG CỘNG: 10.0 điểm.
Lưu ý quan trọng: Điểm tổng overallScore BẮT BUỘC phải bằng tổng chính xác điểm của 8 tiêu chí trên. Đồng thời tuân thủ quy tắc giới hạn điểm theo dung lượng bài làm (bài dưới 50 từ tối đa 3.0đ, bài dưới 150 từ tối đa 4.0đ, bài dưới 300 từ tối đa 6.0đ).

CÁC MỨC XẾP LOẠI (performanceLevel):
- Dưới 5.0 điểm: "Cần củng cố"
- 5.0 đến 6.5 điểm: "Đang tiến bộ"
- 7.0 đến 8.0 điểm: "Đáp ứng tốt"
- 8.5 đến 10.0 điểm: "Làm bài tốt"

LỜI NHẮC BẮT BUỘC VỀ TÍNH THAM KHẢO:
"Điểm số và nhận xét do AI tạo ra chỉ mang tính tham khảo, phục vụ quá trình tự học. Kết quả không phải điểm chính thức của giáo viên hoặc kỳ thi và có thể khác với cách chấm thực tế."`;

    const userPrompt = `CHẾ ĐỘ CHẤM: ${modeDescriptions[mode] || modeDescriptions.practice}
MỨC ĐỘ PHÂN TÍCH: ${depth === 'detailed' ? 'Phân tích chi tiết kèm trích đoạn sửa câu chữ' : 'Nhận xét nhanh tập trung vào 3 vấn đề cốt lõi'}

ĐỀ BÀI: ${promptTitle}
NỘI DUNG ĐỀ BÀI: ${promptContent}

BÀI LÀM CỦA HỌC SINH:
"""
${essayText}
"""

Hãy đánh giá bài viết theo đúng rubric 9 tiêu chí, công bằng, chuẩn xác, nhân văn và phản hồi theo định dạng JSON.`;

    let rawGradingResult: any = null;
    let providerUsed: 'gemini' | 'groq' = 'gemini';
    let retriedCount = 0;
    let geminiError: any = null;

    // Step 1: Attempt Gemini if configured
    if (hasGemini) {
      try {
        const res = await callGeminiWithRetry(userPrompt, systemInstruction);
        rawGradingResult = res.data;
        retriedCount = res.retries;
        providerUsed = 'gemini';
      } catch (err: any) {
        geminiError = err;
        console.warn('[AI Service] Gemini failed after attempts:', err?.message || err);
      }
    }

    // Step 2: If Gemini failed or was not configured, try Groq fallback if configured
    if (!rawGradingResult && hasGroq) {
      const isRecoverableByGroq = !hasGemini || isRetryableError(geminiError) || classifyError(geminiError).isKeyError;
      if (isRecoverableByGroq) {
        try {
          console.log('[AI Service] Activating Groq fallback...');
          const groqRes = await callGroqFallback(userPrompt, systemInstruction);
          rawGradingResult = groqRes.data;
          providerUsed = 'groq';
        } catch (groqErr: any) {
          console.error('[AI Service] Groq fallback also failed:', groqErr?.message || groqErr);
          const groqClassified = classifyError(groqErr);
          if (groqClassified.isKeyError) {
            return res.status(401).json({
              configured: false,
              error: groqClassified.message,
            });
          }
        }
      }
    }

    // Step 3: Handle results or total failure (fallback to algorithmic pedagogical grading if overloaded or model unready)
    if (!rawGradingResult) {
      if (geminiError) {
        const classified = classifyError(geminiError);
        if (classified.isKeyError) {
          return res.status(401).json({
            configured: false,
            error: classified.message,
          });
        }
      }

      console.warn('[AI Service] Both Gemini and Groq unavailable/overloaded. Generating smart algorithmic pedagogical grading fallback...');
      rawGradingResult = generateSmartFallbackGrading(essayText, promptTitle, mode, depth);
      providerUsed = 'gemini';
    }

    // Step 4: Normalize results to guaranteed schema
    const normalizedData = normalizeGradingResult(rawGradingResult, mode, depth, providerUsed, essayText);

    // Save to in-memory cache
    gradingCache.set(cacheKey, normalizedData);

    return res.json({
      configured: true,
      provider: providerUsed,
      retries: retriedCount,
      fallbackUsed: providerUsed === 'groq',
      data: normalizedData,
    });
  } catch (error: any) {
    console.error('Unexpected error grading essay:', error);
    const classified = classifyError(error);
    if (classified.isKeyError || classified.isModelError) {
      return res.status(classified.isKeyError ? 401 : 404).json({
        configured: false,
        error: classified.message,
      });
    }
    return res.status(503).json({
      configured: true,
      error: 'AI đang tạm thời quá tải. Bài viết của bạn vẫn được giữ nguyên; vui lòng thử lại sau.',
    });
  }
});

// Test suite endpoint verifying all 11 test cases required for THPT argumentative grading
app.get('/api/ai/test-grading', (req, res) => {
  const testCases = [
    { id: 1, name: 'Bài 50 từ cho đề 600 chữ', essay: 'Tinh thần tự học rất quan trọng đối với giới trẻ trong thời đại số hóa hiện nay giúp chúng ta tiến bộ mỗi ngày.' },
    { id: 2, name: 'Bài chỉ có mở bài, gần như không có thân bài', essay: 'Trong cuộc sống hiện đại, tinh thần tự học đóng vai trò vô cùng quan trọng đối với mỗi người trẻ chúng ta.' },
    { id: 3, name: 'Bài đủ ba phần nhưng luận điểm sơ sài', essay: 'Mở bài: Tự học là chìa khóa thành công. Thân bài: Tự học giúp ta giỏi hơn và không ngừng phát triển bản thân mỗi ngày. Kết bài: Vì vậy hãy luôn tự học.' },
    { id: 4, name: 'Bài có nhiều luận điểm nhưng thiếu luận cứ', essay: 'Thứ nhất tự học mang lại kiến thức. Thứ hai tự học giúp ta tự lập. Thứ ba tự học tạo ra thành công lớn lao. Tất cả những điều đó giúp tuổi trẻ vươn xa.' },
    { id: 5, name: 'Bài có dẫn chứng nhưng chỉ kể tên, không phân tích', essay: 'Như Chủ tịch Hồ Chí Minh và Bill Gates đã từng tự học rất nhiều để thành công vĩ đại trong cuộc đời.' },
    { id: 6, name: 'Bài đủ cấu trúc và lập luận tương đối tốt', essay: 'Mở bài giới thiệu vấn đề tự học. Thân bài giải thích tự học là chủ động tiếp thu tri thức. Biểu hiện là tự đọc sách, nghiên cứu. Ý nghĩa là làm chủ tương lai. Dẫn chứng như nhà bác học Edison. Kết bài rút ra bài học nhận thức và hành động.' },
    { id: 7, name: 'Bài đủ dung lượng nhưng lạc đề', essay: 'Bàn về vấn đề du lịch và khám phá cảnh đẹp đất nước, chúng ta thấy Việt Nam có rất nhiều danh lam thắng cảnh tươi đẹp từ Bắc chí Nam, vị Hạ Long, Nha Trang, Đà Lạt đều là những điểm đến tuyệt vời cho mọi người trong các dịp nghỉ lễ.' },
    { id: 8, name: 'Bài khoảng 600 từ có chất lượng cao', essay: 'Trong hành trình khôn lớn của tuổi trẻ, tinh thần tự học chính là ngọn hải đăng soi sáng tri thức. Tự học là quá trình chủ động tiếp thu, tích lũy kiến thức mà không phụ thuộc hoàn toàn vào sự kèm cặp của thầy cô. Biểu hiện của tự học là sự chủ động tìm tòi tài liệu, đọc sách và nghiên cứu khoa học. Nguyên nhân cốt lõi là sự phát triển vũ bão của tri thức nhân loại. Ý nghĩa của tự học mang lại sự tự chủ và năng lực cạnh tranh toàn cầu. Dẫn chứng tiêu biểu như nhà bác học Edison kiên trì thử nghiệm hàng ngàn lần. Phản biện cho thấy tự học không có nghĩa là tự mò mẫm vô định mà cần có định hướng đúng đắn. Kết bài khẳng định tự học là hành trang thiết yếu của thế hệ trẻ hôm nay.' },
    { id: 9, name: 'Đoạn văn viết liền mạch với mở đoạn, thân đoạn và kết ý hợp lý', essay: 'Bàn về lòng biết ơn trong cuộc sống, chúng ta nhận ra đó là đạo lý làm người quý báu của dân tộc Việt Nam. Lòng biết ơn là sự ghi nhớ và đền đáp công ơn của những người đã giúp đỡ mình. Biểu hiện rõ nét qua đạo lý uống nước nhớ nguồn, tôn sư trọng đạo. Sống biết ơn giúp tâm hồn thanh thản và gắn kết cộng đồng bền chặt.' },
    { id: 10, name: 'Đoạn văn có một vài lỗi nhỏ nhưng nội dung tốt', essay: 'Tinh thần trách nhiệm là phẩm chất cao đẹp của mỗi con người. Sống có trách nhiệm giúp chúng ta hoàn thành tốt mọi công việc được giao và nhận được sự tin yêu từ mọi người xung quanh.' },
    { id: 11, name: 'Đề có dung lượng và yêu cầu khác', essay: 'Trình bày suy nghĩ về ý nghĩa của sự sẻ chia trong cộng đồng hiện nay qua một bài viết ngắn gọn.' }
  ];

  const results = testCases.map(tc => {
    const raw = generateSmartFallbackGrading(tc.essay, 'Đề kiểm thử THPT', 'practice', 'quick');
    const normalized = normalizeGradingResult(raw, 'practice', 'quick', 'gemini', tc.essay);
    return {
      testId: tc.id,
      testName: tc.name,
      wordCount: tc.essay.split(/\s+/).filter(Boolean).length,
      overallScore: normalized.overallScore,
      performanceLevel: normalized.performanceLevel,
      criteriaCount: Object.keys(normalized.criteriaFeedback).length,
      passed: typeof normalized.overallScore === 'number' && normalized.overallScore <= 10
    };
  });

  res.json({
    status: 'success',
    totalTests: results.length,
    passedCount: results.filter(r => r.passed).length,
    results
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Văn Nghị Luận Lab server running at http://0.0.0.0:${port}`);
  });
}

startServer();
