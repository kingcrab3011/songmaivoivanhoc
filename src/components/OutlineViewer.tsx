import React, { useState } from 'react';
import { Outline, EssayPrompt } from '../types';
import {
  Sparkles,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  PenLine,
  Compass,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  GraduationCap,
  Flag,
  Share2,
} from 'lucide-react';

interface OutlineViewerProps {
  outline: Outline;
  prompt?: EssayPrompt;
  isSaved: boolean;
  onToggleSaveOutline: (outline: Outline) => void;
  onStartWritingWithOutline: (outline: Outline, prompt?: EssayPrompt) => void;
  onOpenEvidenceForTopic: (topic: string) => void;
  onBackToPrompts: () => void;
}

export const OutlineViewer: React.FC<OutlineViewerProps> = ({
  outline,
  prompt,
  isSaved,
  onToggleSaveOutline,
  onStartWritingWithOutline,
  onOpenEvidenceForTopic,
  onBackToPrompts,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyOutline = () => {
    const text = `DÀN Ý NGHỊ LUẬN XÃ HỘI: ${outline.promptTitle}
===================================================

A. MỞ BÀI
- Dẫn dắt: ${outline.introduction.leadIn}
- Nêu vấn đề: ${outline.introduction.problemStatement}
- Luận đề: ${outline.introduction.thesis}

B. GIẢI THÍCH KHÁI NIỆM & VẤN ĐỀ
- Giải thích từ khóa: ${outline.explanations.keyTerms}
- Vấn đề trọng tâm: ${outline.explanations.centralIssue}

C. HỆ THỐNG LUẬN ĐIỂM
${outline.arguments
  .map(
    (arg, i) =>
      `Luận điểm ${i + 1}: ${arg.title}
  + Lý lẽ: ${arg.reasoning}
  + Triển khai: ${arg.elaboration}
  + Gợi ý dẫn chứng: ${arg.suggestedEvidence}`
  )
  .join('\n\n')}

D. DẪN CHỨNG TIÊU BIỂU
${outline.evidence
  .map(
    (ev, i) =>
      `Dẫn chứng ${i + 1}: ${ev.title}
  + Tóm tắt: ${ev.description}
  + Cách vận dụng: ${ev.applicationNote}`
  )
  .join('\n\n')}

E. PHẢN BIỆN VÀ MỞ RỘNG
- Quan điểm đối lập: ${outline.counterargument.oppositeView}
- Phê phán / Lập luận: ${outline.counterargument.critique}
- Giới hạn vấn đề: ${outline.counterargument.boundary}

F. BÀI HỌC NHẬN THỨC VÀ HÀNH ĐỘNG
- Nhận thức bản thân: ${outline.lessons.selfAwareness}
- Hành động thiết thực: ${outline.lessons.concreteAction}
- Liên hệ học sinh THPT: ${outline.lessons.highSchoolContext}

G. KẾT BÀI
- Khẳng định vấn đề: ${outline.conclusion.synthesis}
- Thông điệp gửi gắm: ${outline.conclusion.finalMessage}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToPrompts}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#29241F] bg-[#FAF6EE] hover:bg-[#EFE4D0] border border-[#D9C9AE] rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại kho đề</span>
        </button>

        {/* Action Buttons as required */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyOutline}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#29241F] bg-[#FAF6EE] hover:bg-[#EFE4D0] border border-[#D9C9AE] rounded-xl transition-colors cursor-pointer"
            title="Sao chép toàn bộ dàn ý vào bộ nhớ tạm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#7A263A] dark:text-[#C24A64]" />
                <span>Sao chép dàn ý</span>
              </>
            )}
          </button>

          <button
            onClick={() => onToggleSaveOutline(outline)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
              isSaved
                ? 'bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#C24A64] border-[#7A263A] dark:border-[#C24A64]'
                : 'bg-[#FAF6EE] dark:bg-[#25201C] text-[#29241F] dark:text-[#F5EFEB] border-[#D9C9AE] dark:border-[#3D352D] hover:bg-white dark:hover:bg-[#2E2823]'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 fill-[#7A263A] dark:fill-[#C24A64]" />
                <span>Đã lưu dàn ý</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-[#7A263A] dark:text-[#C24A64]" />
                <span>Lưu dàn ý</span>
              </>
            )}
          </button>

          <button
            onClick={() => onStartWritingWithOutline(outline, prompt)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#9E354B] rounded-xl shadow-xs hover:shadow hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <PenLine className="w-4 h-4" />
            <span>Bắt đầu viết theo dàn ý</span>
          </button>
        </div>
      </div>

      {/* Header card */}
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 sm:p-8 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#C24A64] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dàn ý mẫu chuẩn mực 7 phần (A - G)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#29241F] dark:text-[#F5EFEB] leading-snug">
          {outline.promptTitle}
        </h1>
        {prompt && (
          <div className="mt-3 p-3.5 rounded-xl bg-[#EFE4D0]/60 dark:bg-[#1E1A17] border border-[#D9C9AE]/70 dark:border-[#3D352D] text-sm text-[#554C42] dark:text-[#D9C9AE]">
            <p className="font-semibold text-xs text-[#7A263A] dark:text-[#C24A64] uppercase tracking-wider mb-1">
              Đề bài đầy đủ:
            </p>
            <p className="italic font-serif">"{prompt.content}"</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] text-xs text-[#847768] dark:text-[#A89B8E]">
          <p>
            * Dàn ý mang tính định hướng phương pháp, khuyến khích sáng tạo cá nhân, không bắt buộc viết rập khuôn.
          </p>
          {prompt?.topic && (
            <button
              onClick={() => onOpenEvidenceForTopic(prompt.topic)}
              className="inline-flex items-center gap-1 text-[#7A263A] dark:text-[#C24A64] font-semibold hover:underline cursor-pointer transition-transform hover:translate-x-0.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Xem dẫn chứng chủ đề "{prompt.topic}"</span>
            </button>
          )}
        </div>
      </div>

      {/* 7 Standardized Sections (A - G) */}
      <div className="space-y-5">
        {/* A. Mở bài */}
        <section className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50 hover:shadow-lg transition-all duration-300 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9C9AE]/60 dark:border-[#3D352D]">
            <span className="w-8 h-8 rounded-lg bg-[#7A263A] dark:bg-[#C24A64] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              A
            </span>
            <h2 className="font-serif font-bold text-xl text-[#29241F] dark:text-[#F5EFEB]">Mở bài</h2>
          </div>
          <div className="space-y-3 text-sm text-[#29241F] dark:text-[#F5EFEB] leading-relaxed">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-[#7A263A] dark:text-[#C24A64] block mb-1">1. Dẫn dắt vấn đề:</span>
              <p>{outline.introduction.leadIn}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-[#7A263A] dark:text-[#C24A64] block mb-1">2. Nêu vấn đề nghị luận:</span>
              <p>{outline.introduction.problemStatement}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-[#7A263A] dark:text-[#C24A64] block mb-1">3. Khẳng định quan điểm (Luận đề):</span>
              <p>{outline.introduction.thesis}</p>
            </div>
          </div>
        </section>

        {/* B. Giải thích */}
        <section className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50 hover:shadow-lg transition-all duration-300 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9C9AE]/60 dark:border-[#3D352D]">
            <span className="w-8 h-8 rounded-lg bg-[#7A263A] dark:bg-[#C24A64] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              B
            </span>
            <h2 className="font-serif font-bold text-xl text-[#29241F] dark:text-[#F5EFEB]">Giải thích</h2>
          </div>
          <div className="space-y-3 text-sm text-[#29241F] dark:text-[#F5EFEB] leading-relaxed">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-[#7A263A] dark:text-[#C24A64] block mb-1">Làm rõ khái niệm và từ khóa chính:</span>
              <p>{outline.explanations.keyTerms}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-[#7A263A] dark:text-[#C24A64] block mb-1">Nội dung trọng tâm cần bàn luận:</span>
              <p>{outline.explanations.centralIssue}</p>
            </div>
          </div>
        </section>

        {/* C. Luận điểm */}
        <section className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50 hover:shadow-lg transition-all duration-300 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9C9AE]/60 dark:border-[#3D352D]">
            <span className="w-8 h-8 rounded-lg bg-[#7A263A] dark:bg-[#C24A64] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              C
            </span>
            <h2 className="font-serif font-bold text-xl text-[#29241F] dark:text-[#F5EFEB]">Hệ thống luận điểm</h2>
          </div>
          <div className="space-y-4">
            {outline.arguments.map((arg, idx) => (
              <div
                key={arg.id || idx}
                className="p-4 sm:p-5 rounded-xl bg-white/80 dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] hover:border-[#7A263A]/30 dark:hover:border-[#C24A64]/40 hover:scale-[1.01] transition-all duration-200 space-y-2 text-sm"
              >
                <div className="flex items-start gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#7A263A] dark:bg-[#C24A64] text-white text-xs font-bold font-mono">
                    LĐ {idx + 1}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB]">{arg.title}</h3>
                </div>
                <div className="pl-8 space-y-1.5 text-[#554C42] dark:text-[#D9C9AE]">
                  <p>
                    <strong className="text-[#29241F] dark:text-[#F5EFEB]">Lý lẽ then chốt:</strong> {arg.reasoning}
                  </p>
                  <p>
                    <strong className="text-[#29241F] dark:text-[#F5EFEB]">Gợi ý triển khai:</strong> {arg.elaboration}
                  </p>
                  <p className="text-xs bg-[#EFE4D0]/60 dark:bg-[#2E2823] p-2 rounded text-[#7A263A] dark:text-[#C24A64]">
                    <strong>Gợi ý dẫn chứng kèm theo:</strong> {arg.suggestedEvidence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* D. Dẫn chứng */}
        <section className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50 hover:shadow-lg transition-all duration-300 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D9C9AE]/60 dark:border-[#3D352D]">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#7A263A] dark:bg-[#C24A64] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
                D
              </span>
              <h2 className="font-serif font-bold text-xl text-[#29241F] dark:text-[#F5EFEB]">Dẫn chứng tiêu biểu</h2>
            </div>
            {prompt?.topic && (
              <button
                onClick={() => onOpenEvidenceForTopic(prompt.topic)}
                className="text-xs text-[#7A263A] dark:text-[#C24A64] font-semibold hover:underline flex items-center gap-1 cursor-pointer transition-transform hover:translate-x-0.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Mở kho dẫn chứng</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outline.evidence.map((ev, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/80 dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] hover:scale-[1.01] hover:border-[#7A263A]/30 dark:hover:border-[#C24A64]/40 transition-all duration-200 text-sm space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <BookOpen className="w-4 h-4 text-[#7A263A] dark:text-[#C24A64]" />
                    <h4 className="font-serif font-bold text-[#29241F] dark:text-[#F5EFEB]">{ev.title}</h4>
                  </div>
                  <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed mb-2">{ev.description}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#EFE4D0]/60 dark:bg-[#2E2823] border border-[#D9C9AE]/60 dark:border-[#3D352D] text-[11px] text-[#7A263A] dark:text-[#C24A64]">
                  <strong>Cách đưa vào bài:</strong> {ev.applicationNote}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* E. Phản biện và mở rộng */}
        <section className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50 hover:shadow-lg transition-all duration-300 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9C9AE]/60 dark:border-[#3D352D]">
            <span className="w-8 h-8 rounded-lg bg-[#7A263A] dark:bg-[#C24A64] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              E
            </span>
            <h2 className="font-serif font-bold text-xl text-[#29241F] dark:text-[#F5EFEB]">Phản biện và mở rộng</h2>
          </div>
          <div className="space-y-3 text-sm text-[#29241F] dark:text-[#F5EFEB]">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-rose-700 dark:text-rose-400 block mb-1">Quan điểm sai lệch / hiện tượng đối lập:</span>
              <p>{outline.counterargument.oppositeView}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-[#7A263A] dark:text-[#C24A64] block mb-1">Phân tích tác hại / phê phán:</span>
              <p>{outline.counterargument.critique}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-1">Giới hạn của vấn đề (Tránh cực đoan):</span>
              <p>{outline.counterargument.boundary}</p>
            </div>
          </div>
        </section>

        {/* F. Bài học nhận thức và hành động */}
        <section className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50 hover:shadow-lg transition-all duration-300 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9C9AE]/60 dark:border-[#3D352D]">
            <span className="w-8 h-8 rounded-lg bg-[#7A263A] dark:bg-[#C24A64] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              F
            </span>
            <h2 className="font-serif font-bold text-xl text-[#29241F] dark:text-[#F5EFEB]">Bài học nhận thức và hành động</h2>
          </div>
          <div className="space-y-3 text-sm text-[#29241F] dark:text-[#F5EFEB]">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-[#7A263A] dark:text-[#C24A64] block mb-1">Bài học nhận thức cho bản thân:</span>
              <p>{outline.lessons.selfAwareness}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-[#7A263A] dark:text-[#C24A64] block mb-1">Hành động cụ thể có thể thực hiện:</span>
              <p>{outline.lessons.concreteAction}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-[#7A263A] dark:text-[#C24A64] block mb-1">Liên hệ học sinh THPT (Lớp 12):</span>
              <p>{outline.lessons.highSchoolContext}</p>
            </div>
          </div>
        </section>

        {/* G. Kết bài */}
        <section className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50 hover:shadow-lg transition-all duration-300 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9C9AE]/60 dark:border-[#3D352D]">
            <span className="w-8 h-8 rounded-lg bg-[#7A263A] dark:bg-[#C24A64] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              G
            </span>
            <h2 className="font-serif font-bold text-xl text-[#29241F] dark:text-[#F5EFEB]">Kết bài</h2>
          </div>
          <div className="space-y-3 text-sm text-[#29241F] dark:text-[#F5EFEB]">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-[#7A263A] dark:text-[#C24A64] block mb-1">Khẳng định lại vấn đề nghị luận:</span>
              <p>{outline.conclusion.synthesis}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D]">
              <span className="font-semibold text-[#7A263A] dark:text-[#C24A64] block mb-1">Mở rộng suy nghĩ hoặc gửi gắm thông điệp:</span>
              <p className="italic font-serif">"{outline.conclusion.finalMessage}"</p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 bg-gradient-to-r from-[#7A263A] to-[#5C1826] dark:from-[#25201C] dark:to-[#1E1A17] dark:border dark:border-[#C24A64]/40 rounded-2xl text-white text-center shadow-md">
        <h3 className="font-serif font-bold text-xl mb-2 text-[#F5EFEB]">Đã sẵn sàng chắp bút?</h3>
        <p className="text-xs sm:text-sm text-amber-100/90 dark:text-[#D9C9AE] mb-4 max-w-xl mx-auto">
          Mở trình soạn thảo để bắt đầu rèn luyện lập luận, đếm số từ theo thời gian thực và tự động lưu bài viết.
        </p>
        <button
          onClick={() => onStartWritingWithOutline(outline, prompt)}
          className="px-6 py-3 bg-[#F6F0E4] hover:bg-white text-[#7A263A] dark:text-[#9E354B] font-semibold rounded-xl transition-all duration-200 shadow hover:shadow-lg hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer text-sm"
        >
          <PenLine className="w-4 h-4" />
          <span>Bắt đầu viết bài ngay bây giờ</span>
        </button>
      </div>
    </div>
  );
};
