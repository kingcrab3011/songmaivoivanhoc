import React from 'react';
import { EssayPrompt } from '../types';
import {
  FileText,
  X,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  PenLine,
  Tag,
  Clock,
  Compass,
} from 'lucide-react';
import { formatVietnameseDateTime } from '../utils/text';

interface PromptDetailModalProps {
  prompt: EssayPrompt | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (prompt: EssayPrompt) => void;
  onViewOutline: (prompt: EssayPrompt) => void;
  onStartWriting: (prompt: EssayPrompt) => void;
  onOpenEvidence: (topic: string) => void;
}

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  prompt,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onViewOutline,
  onStartWriting,
  onOpenEvidence,
}) => {
  if (!isOpen || !prompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-apple-fade">
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] max-w-2xl w-full rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-2xl p-6 sm:p-8 space-y-5 my-8 relative transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#847768] dark:text-[#A89F91] hover:text-[#7A263A] dark:hover:text-[#E88E9E] p-1.5 rounded-full hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold text-[#847768] dark:text-[#A89F91] bg-[#EFE4D0] dark:bg-[#1E1A17] px-2.5 py-0.5 rounded border border-[#D9C9AE]/40 dark:border-[#3D352D]/60">
              #{prompt.id.toUpperCase()}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E]">
              {prompt.topic}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] text-[#554C42] dark:text-[#C5BCB0]">
              Độ khó: {prompt.difficulty}
            </span>
          </div>

          <h3 className="font-serif font-bold text-2xl text-[#29241F] dark:text-[#F5EFEB] leading-snug">
            {prompt.title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] space-y-3">
          <h4 className="font-semibold text-xs text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            <span>Đề bài đầy đủ:</span>
          </h4>
          <p className="text-base sm:text-lg text-[#29241F] dark:text-[#F5EFEB] font-serif leading-relaxed italic">
            "{prompt.content}"
          </p>
        </div>

        {/* Keywords */}
        <div>
          <span className="text-xs font-semibold text-[#847768] dark:text-[#A89F91] block mb-1.5">
            Từ khóa trọng tâm:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {prompt.keywords.map((kw, i) => (
              <span
                key={i}
                className="text-xs bg-[#EFE4D0] dark:bg-[#1E1A17] text-[#7A263A] dark:text-[#E88E9E] font-medium px-2.5 py-1 rounded-lg border border-[#D9C9AE]/40 dark:border-[#3D352D]/60"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Metadata info */}
        <div className="flex items-center justify-between text-xs text-[#847768] dark:text-[#A89F91] pt-2 border-t border-[#D9C9AE]/60 dark:border-[#3D352D]">
          <span>Nguồn: {prompt.sourceType}</span>
          <button
            onClick={() => {
              onClose();
              onOpenEvidence(prompt.topic);
            }}
            className="text-[#7A263A] dark:text-[#E88E9E] font-semibold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tra cứu dẫn chứng chủ đề này</span>
          </button>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-[#D9C9AE] dark:border-[#3D352D] flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => onToggleSave(prompt)}
            className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs ${
              isSaved
                ? 'bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E] border-[#7A263A] dark:border-[#C24A64]'
                : 'bg-white dark:bg-[#1E1A17] text-[#29241F] dark:text-[#F5EFEB] border-[#D9C9AE] dark:border-[#3D352D] hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621]'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 fill-[#7A263A] dark:fill-[#C24A64]" />
                <span>Đã lưu đề này</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-[#7A263A] dark:text-[#E88E9E]" />
                <span>Lưu đề yêu thích</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onViewOutline(prompt);
              }}
              className="px-4 py-2 bg-[#FAF6EE] dark:bg-[#1E1A17] hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] border border-[#D9C9AE] dark:border-[#3D352D] text-[#7A263A] dark:text-[#E88E9E] text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Xem dàn ý 7 phần</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onStartWriting(prompt);
              }}
              className="px-5 py-2 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <PenLine className="w-4 h-4" />
              <span>Bắt đầu viết bài</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
