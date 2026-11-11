import React, { useState, useEffect } from 'react';
import { Draft, AiGradingResult, EssayPrompt, GradingMode, AnalysisDepth } from '../types';
import {
  Sparkles,
  X,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Info,
  ServerCrash,
  KeyRound,
  Zap,
  GraduationCap,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AiGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: Draft;
  prompt?: EssayPrompt;
}

export const AiGradingModal: React.FC<AiGradingModalProps> = ({
  isOpen,
  onClose,
  draft,
  prompt,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState('Đang đánh giá bài viết theo chuẩn THPT...');
  const [loadingSubtitle, setLoadingSubtitle] = useState('');
  const [result, setResult] = useState<AiGradingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnconfigured, setIsUnconfigured] = useState(false);

  // New Upgrade: Mode & Depth Selectors
  const [mode, setMode] = useState<GradingMode>('practice');
  const [depth, setDepth] = useState<AnalysisDepth>('quick');
  const [expandedCriteria, setExpandedCriteria] = useState(true);

  // Reset or re-evaluate when opened
  useEffect(() => {
    if (isOpen) {
      handleGradeEssay();
    } else {
      setResult(null);
      setErrorMessage(null);
      setIsUnconfigured(false);
    }
  }, [isOpen]);

  const handleGradeEssay = async (overrideMode?: GradingMode, overrideDepth?: AnalysisDepth) => {
    setLoading(true);
    setErrorMessage(null);
    setIsUnconfigured(false);

    const activeMode = overrideMode || mode;
    const activeDepth = overrideDepth || depth;

    const initialSub =
      activeMode === 'practice'
        ? 'Chế độ luyện tập: Tìm kiếm điểm sáng và giải thích hướng dẫn sửa lỗi nhẹ nhàng...'
        : activeMode === 'regular_exam'
        ? 'Chế độ kiểm tra: Đánh giá bố cục, luận điểm và dẫn chứng sát thực tế phổ thông...'
        : 'Chế độ thi tốt nghiệp: Mô phỏng thang điểm 9 tiêu chí chính xác...';

    setLoadingTitle('Đang đánh giá bài viết theo chuẩn THPT...');
    setLoadingSubtitle(initialSub);

    // Timed progression to visually reflect background retry & fallback states
    const timer1 = setTimeout(() => {
      setLoadingTitle('AI đang phân tích lập luận & dẫn chứng...');
      setLoadingSubtitle('Hệ thống đang đối chiếu bài viết với khung rubric 9 tiêu chí THPT...');
    }, 2800);

    const timer2 = setTimeout(() => {
      setLoadingTitle('Đang thử lại kết nối AI...');
      setLoadingSubtitle('Máy chủ AI phản hồi chậm, hệ thống đang tự động thử lại với độ trễ tối ưu...');
    }, 6500);

    const timer3 = setTimeout(() => {
      setLoadingTitle('Đang chuyển sang dịch vụ dự phòng...');
      setLoadingSubtitle('Kích hoạt đường truyền dự phòng (Groq) để hoàn tất nhận xét, bài viết của bạn vẫn được giữ nguyên...');
    }, 12000);

    const timer4 = setTimeout(() => {
      setLoadingTitle('Đang hoàn thiện nhận xét và tính điểm...');
      setLoadingSubtitle('Chuẩn hóa kết quả đánh giá theo đúng cấu trúc rubric...');
    }, 19000);

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 40000);

    try {
      const response = await fetch('/api/ai/grade-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          promptTitle: prompt?.title || draft.promptTitle || draft.title,
          promptContent: prompt?.content || '',
          essayText: draft.content,
          wordCount: draft.wordCount,
          mode: activeMode,
          depth: activeDepth,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.configured === false || response.status === 401 || response.status === 403) {
          setIsUnconfigured(true);
          setErrorMessage(
            data.error ||
              'Chưa cấu hình API Key trên máy chủ hoặc khóa không hợp lệ. Quản trị viên vui lòng kiểm tra lại cấu hình.'
          );
        } else if (response.status === 503) {
          setIsUnconfigured(false);
          setErrorMessage(
            data.error ||
              'AI đang tạm thời quá tải. Bài viết của bạn vẫn được giữ nguyên; vui lòng thử lại sau.'
          );
        } else {
          setIsUnconfigured(false);
          setErrorMessage(data.error || 'Có lỗi xảy ra khi chấm bài. Vui lòng thử lại sau.');
        }
        return;
      }

      if (data.data) {
        setResult(data.data);
      } else {
        setErrorMessage('AI đang tạm thời quá tải. Bài viết của bạn vẫn được giữ nguyên; vui lòng thử lại sau.');
      }
    } catch (err: any) {
      console.error('Grading fetch error:', err);
      if (err.name === 'AbortError') {
        setErrorMessage('AI đang tạm thời quá tải. Bài viết của bạn vẫn được giữ nguyên; vui lòng thử lại sau.');
      } else {
        setErrorMessage('Không thể kết nối với dịch vụ chấm bài phía máy chủ. Bài viết của bạn vẫn được giữ nguyên; vui lòng thử lại sau.');
      }
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getPerformanceBadge = (level?: string) => {
    switch (level) {
      case 'Làm bài tốt':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
      case 'Đáp ứng tốt':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
      case 'Đang tiến bộ':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';
      case 'Cần củng cố':
      default:
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-apple-fade">
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] max-w-4xl w-full rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[90vh] transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A263A] via-[#8F2E45] to-[#7A263A] dark:from-[#A8324F] dark:to-[#7A263A] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg sm:text-xl">
                Cố Vấn AI Nhận Xét & Chấm Điểm THPT
              </h3>
              <p className="text-xs text-amber-100/80">
                Thang điểm 10 chuẩn 9 tiêu chí sư phạm • Phù hợp học sinh phổ thông
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-black/20 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Prominent Disclaimer Banner */}
        <div className="bg-amber-100/90 dark:bg-amber-950/50 border-b border-amber-300 dark:border-amber-800 px-6 py-2.5 flex items-start gap-2 text-xs text-amber-950 dark:text-amber-200 font-medium shrink-0">
          <Info className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>
            <b>THÔNG BÁO THAM KHẢO:</b> Điểm số và nhận xét do AI tạo ra chỉ mang tính tham khảo, phục vụ quá trình tự học. Kết quả không phải điểm chính thức của giáo viên hoặc kỳ thi và có thể khác với cách chấm thực tế.
          </p>
        </div>

        {/* Mode & Depth Config Bar */}
        <div className="px-6 py-3 bg-[#EFE4D0]/70 dark:bg-[#1E1A17]/80 border-b border-[#D9C9AE] dark:border-[#3D352D] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* 3 Grading Modes */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[#847768] dark:text-[#A89F91]">Chế độ:</span>
            <button
              onClick={() => {
                setMode('practice');
                handleGradeEssay('practice', depth);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                mode === 'practice'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'bg-white dark:bg-[#25201C] text-[#29241F] dark:text-[#F5EFEB] border border-[#D9C9AE] dark:border-[#3D352D]'
              }`}
            >
              A. Luyện tập & Sửa bài
            </button>
            <button
              onClick={() => {
                setMode('regular_exam');
                handleGradeEssay('regular_exam', depth);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                mode === 'regular_exam'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'bg-white dark:bg-[#25201C] text-[#29241F] dark:text-[#F5EFEB] border border-[#D9C9AE] dark:border-[#3D352D]'
              }`}
            >
              B. Kiểm tra Giữa / Cuối kỳ
            </button>
            <button
              onClick={() => {
                setMode('graduation_exam');
                handleGradeEssay('graduation_exam', depth);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                mode === 'graduation_exam'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'bg-white dark:bg-[#25201C] text-[#29241F] dark:text-[#F5EFEB] border border-[#D9C9AE] dark:border-[#3D352D]'
              }`}
            >
              C. Luyện thi Tốt nghiệp THPT
            </button>
          </div>

          {/* Analysis Depth */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#847768] dark:text-[#A89F91]">Kiểu xem:</span>
            <button
              onClick={() => {
                setDepth('quick');
                handleGradeEssay(mode, 'quick');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer flex items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95 ${
                depth === 'quick'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'bg-white dark:bg-[#25201C] text-[#29241F] dark:text-[#F5EFEB] border border-[#D9C9AE] dark:border-[#3D352D]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Nhận xét nhanh</span>
            </button>
            <button
              onClick={() => {
                setDepth('detailed');
                handleGradeEssay(mode, 'detailed');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer flex items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95 ${
                depth === 'detailed'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'bg-white dark:bg-[#25201C] text-[#29241F] dark:text-[#F5EFEB] border border-[#D9C9AE] dark:border-[#3D352D]'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Phân tích chi tiết</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-[#29241F] dark:text-[#F5EFEB]">
          {/* Loading */}
          {loading && (
            <div className="py-16 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-[#7A263A] dark:text-[#E88E9E] animate-spin mx-auto" />
              <div className="space-y-1.5 max-w-md mx-auto px-4">
                <h4 className="font-serif font-bold text-lg text-[#29241F] dark:text-[#F5EFEB]">
                  {loadingTitle}
                </h4>
                <p className="text-xs text-[#847768] dark:text-[#A89F91] leading-relaxed">
                  {loadingSubtitle}
                </p>
              </div>
            </div>
          )}

          {/* Unconfigured */}
          {!loading && isUnconfigured && (
            <div className="p-8 rounded-2xl bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto">
                <KeyRound className="w-7 h-7" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h4 className="font-serif font-bold text-xl text-[#29241F] dark:text-[#F5EFEB]">
                  Cấu hình API Key trên máy chủ
                </h4>
                <p className="text-xs sm:text-sm text-[#554C42] dark:text-[#C5BCB0] leading-relaxed">
                  {errorMessage || 'Để tính năng nhận xét AI hoạt động, quản trị viên cần thiết lập biến môi trường GEMINI_API_KEY hoặc GROQ_API_KEY trên máy chủ.'}
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && !isUnconfigured && errorMessage && (
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-center space-y-3">
              <ServerCrash className="w-8 h-8 text-rose-700 dark:text-rose-400 mx-auto" />
              <h4 className="font-serif font-bold text-base text-rose-900 dark:text-rose-200">
                Thông báo từ hệ thống chấm bài
              </h4>
              <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 max-w-md mx-auto leading-relaxed">
                {errorMessage}
              </p>
              <button
                onClick={() => handleGradeEssay()}
                className="px-5 py-2 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#631E2E] dark:hover:bg-[#A8324F] text-white text-xs font-semibold rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại ngay</span>
              </button>
            </div>
          )}

          {/* Results Display */}
          {!loading && result && (
            <div className="space-y-6">
              {/* Score Hero Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FAF6EE] to-[#EFE4D0] dark:from-[#2B2622] dark:to-[#24201D] border-2 border-[#7A263A]/30 dark:border-[#C24A64]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[11px] text-[#7A263A] dark:text-[#E88E9E] font-bold uppercase tracking-wider">
                      ĐIỂM THAM KHẢO THPT
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getPerformanceBadge(result.performanceLevel)}`}>
                      {result.performanceLevel}
                    </span>
                    {result.provider === 'groq' && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        ⚡ Dịch vụ dự phòng Groq
                      </span>
                    )}
                    {result.provider === 'gemini' && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        ✨ Gemini AI
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-serif font-extrabold text-[#7A263A] dark:text-[#E88E9E]">
                      {result.overallScore.toFixed(1)}
                    </span>
                    <span className="text-xl font-bold text-[#847768] dark:text-[#A89F91]">/ 10</span>
                  </div>

                  <p className="text-xs text-[#847768] dark:text-[#A89F91] mt-1">
                    Độ dài bài: {draft.wordCount} từ • {mode === 'practice' ? 'Chế độ luyện tập' : mode === 'regular_exam' ? 'Chế độ kiểm tra' : 'Chế độ thi THPT'}
                  </p>
                </div>

                <div className="sm:max-w-md bg-white/80 dark:bg-[#1E1A17]/80 p-4 rounded-xl border border-[#D9C9AE]/80 dark:border-[#3D352D]">
                  <h5 className="font-serif font-bold text-sm text-[#29241F] dark:text-[#F5EFEB] mb-1">
                    Nhận xét sư phạm:
                  </h5>
                  <p className="text-xs text-[#554C42] dark:text-[#C5BCB0] leading-relaxed italic">
                    "{result.generalAssessment}"
                  </p>
                </div>
              </div>

              {/* Strengths & Priority Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2.5">
                  <h4 className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>Điểm sáng nổi bật của bài</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200">
                    {result.strengths.map((st, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Priority Improvements (Max 3) */}
                <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-2.5">
                  <h4 className="font-serif font-bold text-sm text-rose-900 dark:text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-700 dark:text-rose-400" />
                    <span>3 vấn đề cốt lõi cần nâng cấp</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-rose-950 dark:text-rose-200">
                    {result.priorityImprovements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-700 dark:text-rose-400 font-bold">{i + 1}.</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rubric Breakdown (Collapsible / Full 9 Criteria) */}
              <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#1E1A17]/80 border border-[#D9C9AE] dark:border-[#3D352D] space-y-4">
                <div
                  onClick={() => setExpandedCriteria(!expandedCriteria)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <h4 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#7A263A] dark:text-[#E88E9E]" />
                    <span>Bảng điểm chi tiết 9 tiêu chí THPT (Tổng: {result.overallScore.toFixed(1)} / 10đ)</span>
                  </h4>
                  <div className="text-xs text-[#847768] dark:text-[#A89F91] flex items-center gap-1">
                    <span>{expandedCriteria ? 'Thu gọn' : 'Xem chi tiết'}</span>
                    {expandedCriteria ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {expandedCriteria && (
                  <div className="space-y-2.5 text-xs pt-2 border-t border-[#D9C9AE]/60 dark:border-[#3D352D]">
                    {Object.entries(result.criteriaFeedback).map(([key, item]) => {
                      const criteriaLabels: Record<string, string> = {
                        problemIdentification: '1. Xác định đúng vấn đề, đáp ứng yêu cầu đề (1,0đ)',
                        structureAndOrganization: '2. Bố cục và tổ chức bài viết (1,0đ)',
                        argumentsSystem: '3. Hệ thống luận điểm và triển khai nội dung (2,0đ)',
                        reasoningAndPersuasion: '4. Lý lẽ, phân tích và sức thuyết phục (2,0đ)',
                        evidenceAnalysis: '5. Dẫn chứng và cách phân tích dẫn chứng (1,5đ)',
                        counterargumentDepth: '6. Phản biện, mở rộng và chiều sâu nhận thức (0,5đ)',
                        expressionAndVietnamese: '7. Diễn đạt, liên kết và sử dụng tiếng Việt (1,0đ)',
                        spellingAndPunctuation: '8. Chính tả, ngữ pháp và dấu câu (0,5đ)',
                        conclusionAndLessons: '9. Kết luận, bài học hoặc thông điệp phù hợp (0,5đ)',
                      };

                      const label = criteriaLabels[key] || key;
                      const percent = Math.round((item.score / item.maxScore) * 100);

                      return (
                        <div key={key} className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE]/70 dark:border-[#3D352D] space-y-1">
                          <div className="flex items-center justify-between font-medium">
                            <span className="text-[#29241F] dark:text-[#F5EFEB] font-semibold">{label}</span>
                            <span className="font-mono text-[#7A263A] dark:text-[#E88E9E] font-bold">
                              {item.score} / {item.maxScore}đ ({percent}%)
                            </span>
                          </div>
                          <div className="w-full bg-[#EFE4D0] dark:bg-[#1E1A17] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#7A263A] dark:bg-[#C24A64] h-full rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <p className="text-[#554C42] dark:text-[#C5BCB0] italic pt-0.5">{item.comment}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Detailed Sentence Improvements (Available in detailed view or when provided) */}
              {result.sentenceImprovements && result.sentenceImprovements.length > 0 && (
                <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#1E1A17]/80 border border-[#D9C9AE] dark:border-[#3D352D] space-y-3">
                  <h4 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#7A263A] dark:text-[#E88E9E]" />
                    <span>Ví dụ sửa câu chữ & cách diễn đạt đắt giá</span>
                  </h4>

                  <div className="space-y-3">
                    {result.sentenceImprovements.map((sug, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE]/70 dark:border-[#3D352D] text-xs space-y-2"
                      >
                        <div className="p-2.5 rounded-lg bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-200 font-serif">
                          <strong className="text-rose-900 dark:text-rose-400 block text-[11px] font-sans">
                            Đoạn văn trong bài của bạn:
                          </strong>
                          "{sug.originalSnippet}"
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-200 font-serif">
                          <strong className="text-emerald-900 dark:text-emerald-400 block text-[11px] font-sans">
                            Gợi ý viết lại trau chuốt:
                          </strong>
                          "{sug.suggestedRevision}"
                        </div>

                        <p className="text-[#847768] dark:text-[#A89F91] italic pl-1">
                          <b>Vì sao nên sửa:</b> {sug.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Actionable Steps */}
              {result.nextSteps && result.nextSteps.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#EFE4D0]/80 dark:bg-[#1E1A17]/80 border border-[#D9C9AE] dark:border-[#3D352D] space-y-2.5">
                  <h4 className="font-serif font-bold text-sm text-[#7A263A] dark:text-[#E88E9E] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Lộ trình hành động cho bài viết tiếp theo</span>
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-[#29241F] dark:text-[#F5EFEB]">
                    {result.nextSteps.map((stp, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span>{stp}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#EFE4D0]/80 dark:bg-[#1E1A17]/80 border-t border-[#D9C9AE] dark:border-[#3D352D] flex items-center justify-between text-xs text-[#847768] dark:text-[#A89F91] shrink-0">
          <span>Hệ thống phân tích bởi Google Gemini 3.8 Flash • Chế độ THPT</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#7A263A] dark:bg-[#C24A64] text-white font-medium rounded-xl hover:bg-[#5C1826] dark:hover:bg-[#A8324F] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
          >
            Đóng bảng nhận xét
          </button>
        </div>
      </div>
    </div>
  );
};
