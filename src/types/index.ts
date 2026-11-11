export interface EssayPrompt {
  id: string;
  title: string;
  content: string;
  topic: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  keywords: string[];
  outlineId?: string;
  sourceType: 'Mẫu chuẩn' | 'Đề cộng đồng';
  createdAt: string;
  authorName?: string;
  viewCount?: number;
}

export interface OutlineSection {
  title: string;
  points: string[];
}

export interface Outline {
  id: string;
  promptId: string;
  promptTitle: string;
  introduction: {
    leadIn: string;
    problemStatement: string;
    thesis: string;
  };
  explanations: {
    keyTerms: string;
    centralIssue: string;
  };
  arguments: Array<{
    id: string;
    title: string;
    reasoning: string;
    elaboration: string;
    suggestedEvidence: string;
  }>;
  evidence: Array<{
    title: string;
    description: string;
    applicationNote: string;
  }>;
  counterargument: {
    oppositeView: string;
    critique: string;
    boundary: string;
  };
  lessons: {
    selfAwareness: string;
    concreteAction: string;
    highSchoolContext: string;
  };
  conclusion: {
    synthesis: string;
    finalMessage: string;
  };
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'Cá nhân' | 'Cộng đồng';
  relatedTopics: string[];
  summary: string;
  lesson: string;
  usageGuide: string;
  caution: string;
  sourceUrl?: string;
  keywords: string[];
}

export interface Draft {
  id: string;
  title: string;
  promptId?: string;
  promptTitle?: string;
  content: string;
  wordCount: number;
  characterCount: number;
  createdAt: string;
  updatedAt: string;
  targetWordCount: number;
  status: 'Đang viết' | 'Hoàn thành' | 'Bản nháp';
}

export interface SavedItem {
  id: string;
  itemType: 'prompt' | 'outline' | 'evidence' | 'community_essay';
  itemId: string;
  title: string;
  subtitle?: string;
  tag?: string;
  savedAt: string;
}

export interface CommunityEssay {
  id: string;
  title: string;
  promptId?: string;
  promptTitle: string;
  content: string;
  topic: string;
  authorDisplayName: string;
  createdAt: string;
  visibility: 'public' | 'private';
  likes: number;
  wordCount: number;
}

export interface CommunityPrompt {
  id: string;
  title: string;
  content: string;
  topic: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  authorDisplayName: string;
  createdAt: string;
  keywords: string[];
  suggestedOutline?: string;
}

export interface CriterionFeedback {
  score: number;
  maxScore: number;
  comment: string;
}

export type GradingMode = 'practice' | 'regular_exam' | 'graduation_exam';
export type AnalysisDepth = 'quick' | 'detailed';
export type PerformanceLevel = 'Cần củng cố' | 'Đang tiến bộ' | 'Đáp ứng tốt' | 'Làm bài tốt';

export interface AiGradingResult {
  overallScore: number;
  performanceLevel: PerformanceLevel;
  mode: GradingMode;
  depth: AnalysisDepth;
  generalAssessment: string;
  strengths: string[];
  priorityImprovements: string[];
  criteriaFeedback: {
    problemIdentification: CriterionFeedback;      // 1.0
    structureAndOrganization: CriterionFeedback;   // 1.0
    argumentsSystem: CriterionFeedback;            // 2.0
    reasoningAndPersuasion: CriterionFeedback;     // 2.0
    evidenceAnalysis: CriterionFeedback;           // 1.5
    counterargumentDepth: CriterionFeedback;       // 0.5
    expressionAndVietnamese: CriterionFeedback;    // 1.0
    spellingAndPunctuation: CriterionFeedback;     // 0.5
    conclusionAndLessons: CriterionFeedback;       // 0.5
  };
  sentenceImprovements?: Array<{
    originalSnippet: string;
    suggestedRevision: string;
    reason: string;
  }>;
  nextSteps: string[];
  disclaimer: string;
  provider?: 'gemini' | 'groq';
  fallbackUsed?: boolean;
}

export interface WebsiteFeedback {
  id: string;
  authorName: string;
  content: string;
  rating?: number;
  category: 'Giao diện' | 'Kho đề' | 'Dàn ý' | 'Kho dẫn chứng' | 'Trình viết bài' | 'Tính năng AI' | 'Góp ý khác';
  createdAt: string;
}

export interface EssayComment {
  id: string;
  essayId: string;
  authorName: string;
  content: string;
  createdAt: string;
  parentId?: string;
  isAuthor?: boolean;
}

export interface ThemeSettings {
  themeMode: 'light' | 'dark' | 'system';
  fontSize: 'normal' | 'medium' | 'large';
  lineHeight: 'normal' | 'relaxed';
  reducedMotion: boolean;
}
