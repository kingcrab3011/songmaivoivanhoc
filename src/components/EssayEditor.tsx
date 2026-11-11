import React, { useState, useEffect, useRef } from 'react';
import { Draft, EssayPrompt, Outline } from '../types';
import { countVietnameseWords, estimateReadingTime } from '../utils/text';
import {
  Save,
  Check,
  Copy,
  Trash2,
  Maximize2,
  Minimize2,
  Sparkles,
  BookOpen,
  PanelRightOpen,
  PanelRightClose,
  Type,
  Target,
  Clock,
  RotateCcw,
  AlertTriangle,
  History,
} from 'lucide-react';

interface EssayEditorProps {
  draft: Draft;
  prompt?: EssayPrompt;
  outline?: Outline;
  onSaveDraft: (updatedDraft: Draft) => void;
  onOpenAiGrading: (draft: Draft) => void;
  onOpenDraftsList: () => void;
  onSelectPrompt: () => void;
}

export const EssayEditor: React.FC<EssayEditorProps> = ({
  draft,
  prompt,
  outline,
  onSaveDraft,
  onOpenAiGrading,
  onOpenDraftsList,
  onSelectPrompt,
}) => {
  const [content, setContent] = useState(draft.content || '');
  const [title, setTitle] = useState(draft.title || '');
  const [targetWords, setTargetWords] = useState<number>(draft.targetWordCount || 600);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showOutlineSidebar, setShowOutlineSidebar] = useState(false);
  const [fontStyle, setFontStyle] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('lg');
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if draft prop changes
  useEffect(() => {
    setContent(draft.content || '');
    setTitle(draft.title || '');
    setTargetWords(draft.targetWordCount || 600);
    setSaveStatus('saved');
  }, [draft.id]);

  // Real-time metrics
  const wordCount = countVietnameseWords(content);
  const charCount = content.length;
  const readingTime = estimateReadingTime(wordCount);
  const progressPercent = Math.min(100, Math.round((wordCount / targetWords) * 100));

  // Auto-save logic with 1.2s debounce
  const triggerAutoSave = (newContent: string, newTitle: string) => {
    setSaveStatus('saving');
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      
      onSaveDraft({
        ...draft,
        title: newTitle,
        content: newContent,
        targetWordCount: targetWords,
      });

      setSaveStatus('saved');
      setLastSavedTime(timeStr);
    }, 1200);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setSaveStatus('dirty');
    triggerAutoSave(val, title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    triggerAutoSave(content, val);
  };

  const handleManualSave = () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    onSaveDraft({
      ...draft,
      title,
      content,
      targetWordCount: targetWords,
    });

    setSaveStatus('saved');
    setLastSavedTime(timeStr);
  };

  const handleCopyContent = () => {
    const fullText = `${title}\n\n${content}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearContent = () => {
    setContent('');
    triggerAutoSave('', title);
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`space-y-4 animate-apple-fade ${isFullScreen ? 'fixed inset-0 z-50 bg-[#F6F0E4] dark:bg-[#161412] p-4 sm:p-6 overflow-y-auto' : ''}`}>
      {/* Top Header & Context bar */}
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-5 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-sm transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Active Prompt Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs">
                {prompt ? `Đề bài #${prompt.id.toUpperCase()}` : 'Bài viết tự do'}
              </span>
              {prompt?.topic && (
                <span className="text-xs text-[#847768] dark:text-[#A89F91] font-medium">Chủ đề: {prompt.topic}</span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#29241F] dark:text-[#F5EFEB] mb-1">
              {prompt ? prompt.title : 'Trình soạn thảo văn nghị luận xã hội'}
            </h2>

            {prompt ? (
              <p className="text-xs sm:text-sm text-[#554C42] dark:text-[#C5BCB0] line-clamp-2 italic">
                "{prompt.content}"
              </p>
            ) : (
              <button
                onClick={onSelectPrompt}
                className="text-xs text-[#7A263A] dark:text-[#E88E9E] font-semibold hover:underline cursor-pointer transition-colors"
              >
                + Gắn đề bài từ Kho 100 đề để có dàn ý và chấm điểm chuẩn xác
              </button>
            )}
          </div>

          {/* Editor Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenDraftsList}
              className="px-3 py-2 bg-[#EFE4D0] dark:bg-[#2C2621] hover:bg-[#E2D4BD] dark:hover:bg-[#352E28] text-[#29241F] dark:text-[#F5EFEB] rounded-xl text-xs sm:text-sm font-medium border border-[#D9C9AE] dark:border-[#3D352D] flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              title="Xem danh sách bài nháp đã lưu"
            >
              <History className="w-4 h-4 text-[#7A263A] dark:text-[#E88E9E]" />
              <span className="hidden sm:inline">Bài nháp khác</span>
            </button>

            {outline && (
              <button
                onClick={() => setShowOutlineSidebar(!showOutlineSidebar)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  showOutlineSidebar
                    ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white border-[#7A263A] dark:border-[#C24A64]'
                    : 'bg-[#FAF6EE] dark:bg-[#25201C] text-[#7A263A] dark:text-[#E88E9E] border-[#D9C9AE] dark:border-[#3D352D] hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621]'
                }`}
                title="Bật/tắt thanh xem dàn ý bên cạnh"
              >
                {showOutlineSidebar ? (
                  <PanelRightClose className="w-4 h-4" />
                ) : (
                  <PanelRightOpen className="w-4 h-4" />
                )}
                <span>Dàn ý</span>
              </button>
            )}

            <button
              onClick={handleManualSave}
              className="px-3 py-2 bg-[#FAF6EE] dark:bg-[#25201C] hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] text-[#29241F] dark:text-[#F5EFEB] rounded-xl text-xs sm:text-sm font-medium border border-[#D9C9AE] dark:border-[#3D352D] flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              title="Lưu thủ công ngay lập tức"
            >
              <Save className="w-4 h-4 text-[#7A263A] dark:text-[#E88E9E]" />
              <span className="hidden sm:inline">Lưu</span>
            </button>

            <button
              onClick={handleCopyContent}
              className="p-2 bg-[#FAF6EE] dark:bg-[#25201C] hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] text-[#29241F] dark:text-[#F5EFEB] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              title="Sao chép toàn bộ bài viết"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 bg-[#FAF6EE] dark:bg-[#25201C] hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] text-[#29241F] dark:text-[#F5EFEB] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              title={isFullScreen ? 'Thu nhỏ giao diện' : 'Toàn màn hình tập trung'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onOpenAiGrading({ ...draft, title, content, targetWordCount: targetWords })}
              disabled={wordCount < 50}
              className="px-3.5 py-2 bg-gradient-to-r from-[#7A263A] to-[#8F2E45] dark:from-[#A8324F] dark:to-[#C24A64] hover:from-[#5C1826] hover:to-[#7A263A] text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={wordCount < 50 ? 'Cần viết ít nhất 50 từ để AI có thể đánh giá' : 'Nhờ AI nhận xét & chấm điểm tham khảo'}
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Chấm bài bằng AI</span>
            </button>
          </div>
        </div>

        {/* Word count & Save Status metrics bar */}
        <div className="mt-4 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex flex-wrap items-center justify-between gap-3 text-xs text-[#847768] dark:text-[#A89F91]">
          {/* Real-time stats */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <strong className="text-[#29241F] dark:text-[#F5EFEB] font-bold text-sm font-mono">{wordCount}</strong> từ
            </span>
            <span className="hidden sm:inline-block">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <strong className="text-[#29241F] dark:text-[#F5EFEB] font-mono">{charCount}</strong> ký tự
            </span>
            <span className="hidden md:inline-block">|</span>
            <span className="hidden md:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#7A263A] dark:text-[#E88E9E]" />
              Khoảng {readingTime} phút đọc
            </span>
          </div>

          {/* Goal Selector & Progress */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#7A263A] dark:text-[#E88E9E]" />
              <span>Mục tiêu:</span>
              <select
                value={targetWords}
                onChange={(e) => setTargetWords(Number(e.target.value))}
                className="bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded px-1.5 py-0.5 text-xs text-[#29241F] dark:text-[#F5EFEB] focus:outline-none"
              >
                <option value={200}>200 từ (Đoạn văn NLXH)</option>
                <option value={600}>600 từ (Bài văn chuẩn THPT)</option>
                <option value={800}>800 từ (Bài văn chuyên sâu)</option>
              </select>
            </div>

            <div className="w-24 bg-[#EFE4D0] dark:bg-[#1E1A17] h-2 rounded-full overflow-hidden border border-[#D9C9AE] dark:border-[#3D352D]">
              <div
                className={`h-full transition-all duration-300 ${
                  progressPercent >= 100 ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-[#7A263A] dark:bg-[#C24A64]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono font-semibold text-[#29241F] dark:text-[#F5EFEB]">{progressPercent}%</span>
          </div>

          {/* Required Explicit Storage Status Display */}
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <span className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1 animate-pulse">
                <span>Đang lưu trên thiết bị...</span>
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Đã lưu trên thiết bị {lastSavedTime ? `lúc ${lastSavedTime}` : ''}</span>
              </span>
            )}
            {saveStatus === 'dirty' && (
              <span className="text-[#847768] dark:text-[#A89F91]">Chưa lưu thay đổi...</span>
            )}
            <span className="text-[10px] bg-[#EFE4D0] dark:bg-[#1E1A17] px-1.5 py-0.5 rounded text-[#847768] dark:text-[#A89F91] border border-[#D9C9AE]/40 dark:border-[#3D352D]/40">
              Chưa đồng bộ lên đám mây (chế độ cục bộ)
            </span>
          </div>
        </div>
      </div>

      {/* Editor Body with optional Outline Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Writing Area */}
        <div className={`transition-all duration-300 ${showOutlineSidebar ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <div className="bg-[#FAF6EE] dark:bg-[#25201C] rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-sm overflow-hidden flex flex-col transition-all duration-300">
            {/* Title input */}
            <div className="p-4 border-b border-[#D9C9AE]/60 dark:border-[#3D352D] bg-white/40 dark:bg-black/20">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Tiêu đề bài viết của bạn..."
                className="w-full font-serif font-bold text-lg sm:text-xl text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/50 dark:placeholder-[#A89F91]/50 bg-transparent focus:outline-none"
              />
            </div>

            {/* Typography control bar */}
            <div className="px-4 py-2 border-b border-[#D9C9AE]/40 dark:border-[#3D352D]/60 bg-[#FAF6EE]/80 dark:bg-[#1E1A17]/80 flex items-center justify-between text-xs text-[#847768] dark:text-[#A89F91]">
              <div className="flex items-center gap-3">
                <span className="font-medium">Phông chữ:</span>
                <button
                  onClick={() => setFontStyle('serif')}
                  className={`px-2 py-1 rounded cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                    fontStyle === 'serif' ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs' : 'hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621]'
                  }`}
                >
                  Lora (Văn học)
                </button>
                <button
                  onClick={() => setFontStyle('sans')}
                  className={`px-2 py-1 rounded cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                    fontStyle === 'sans' ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs' : 'hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621]'
                  }`}
                >
                  Be Vietnam (Hiện đại)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span>Cỡ chữ:</span>
                {(['base', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-0.5 rounded uppercase font-mono cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                      fontSize === sz ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs' : 'hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Writing textarea */}
            <div className="p-4 sm:p-6 flex-1 min-h-[420px] sm:min-h-[520px]">
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Bắt đầu viết bài nghị luận xã hội của bạn tại đây...

Gợi ý cấu trúc:
- Mở bài: Dẫn dắt và nêu vấn đề nghị luận
- Thân bài: Giải thích khái niệm -> Bình luận & hệ thống luận điểm kèm dẫn chứng -> Phản biện & lật ngược vấn đề -> Bài học nhận thức và hành động
- Kết bài: Khẳng định lại ý nghĩa và gửi gắm thông điệp nhân sinh."
                className={`w-full h-full min-h-[400px] sm:min-h-[500px] bg-transparent text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/45 dark:placeholder-[#A89F91]/45 focus:outline-none resize-y leading-relaxed ${
                  fontStyle === 'serif' ? 'font-serif' : 'font-sans'
                } ${
                  fontSize === 'base'
                    ? 'text-sm sm:text-base leading-7'
                    : fontSize === 'lg'
                    ? 'text-base sm:text-lg leading-8'
                    : 'text-lg sm:text-xl leading-9'
                }`}
              />
            </div>

            {/* Bottom editor controls: Clear confirm */}
            <div className="p-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] bg-white/40 dark:bg-black/20 flex items-center justify-between text-xs">
              <span className="text-[#847768] dark:text-[#A89F91]">
                Bản nháp tự động lưu trên trình duyệt của bạn sau mỗi thao tác gõ.
              </span>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 flex items-center gap-1 hover:underline cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa nội dung</span>
              </button>
            </div>
          </div>
        </div>

        {/* Outline Slide-out / Side Panel */}
        {showOutlineSidebar && outline && (
          <div className="lg:col-span-4 bg-[#FAF6EE] dark:bg-[#25201C] rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] p-4 shadow-sm max-h-[720px] overflow-y-auto space-y-4 animate-apple-fade">
            <div className="flex items-center justify-between pb-2 border-b border-[#D9C9AE] dark:border-[#3D352D]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#7A263A] dark:text-[#E88E9E]" />
                <h3 className="font-serif font-bold text-sm text-[#29241F] dark:text-[#F5EFEB]">
                  Dàn ý gợi ý song hành
                </h3>
              </div>
              <button
                onClick={() => setShowOutlineSidebar(false)}
                className="text-xs text-[#847768] dark:text-[#A89F91] hover:text-[#7A263A] dark:hover:text-[#E88E9E] transition-colors"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#29241F] dark:text-[#F5EFEB]">
              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]/80">
                <strong className="text-[#7A263A] dark:text-[#E88E9E] block mb-1">A. Mở bài</strong>
                <p>{outline.introduction.thesis}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]/80">
                <strong className="text-[#7A263A] dark:text-[#E88E9E] block mb-1">B. Giải thích</strong>
                <p>{outline.explanations.keyTerms}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]/80 space-y-1.5">
                <strong className="text-[#7A263A] dark:text-[#E88E9E] block">C. Các luận điểm chính</strong>
                {outline.arguments.map((arg, i) => (
                  <p key={i}>
                    • <b>LĐ {i + 1}:</b> {arg.title}
                  </p>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]/80 space-y-1.5">
                <strong className="text-[#7A263A] dark:text-[#E88E9E] block">D. Dẫn chứng gợi ý</strong>
                {outline.evidence.map((ev, i) => (
                  <p key={i}>
                    • <b>{ev.title}:</b> {ev.description}
                  </p>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]/80">
                <strong className="text-[#7A263A] dark:text-[#E88E9E] block mb-1">E. Phản biện</strong>
                <p>{outline.counterargument.oppositeView}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]/80">
                <strong className="text-[#7A263A] dark:text-[#E88E9E] block mb-1">F. Bài học</strong>
                <p>{outline.lessons.highSchoolContext}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]/80">
                <strong className="text-[#7A263A] dark:text-[#E88E9E] block mb-1">G. Kết bài</strong>
                <p>{outline.conclusion.finalMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-apple-fade">
          <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border-2 border-rose-300 dark:border-rose-900/60 shadow-2xl max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif font-bold text-lg text-[#29241F] dark:text-[#F5EFEB]">
                Xác nhận xóa bài viết?
              </h3>
            </div>
            <p className="text-sm text-[#554C42] dark:text-[#C5BCB0]">
              Hành động này sẽ xóa toàn bộ nội dung bài viết hiện tại. Thao tác này không thể hoàn tác sau khi đã ghi đè bản nháp.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] bg-white dark:bg-[#1E1A17] text-[#29241F] dark:text-[#F5EFEB] text-sm font-medium hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleClearContent}
                className="px-4 py-2 rounded-xl bg-rose-700 dark:bg-rose-800 text-white text-sm font-medium hover:bg-rose-800 dark:hover:bg-rose-700 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
