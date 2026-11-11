import React, { useState } from 'react';
import { ESSAY_TOPICS } from '../data/prompts';
import { EssayPrompt, CommunityPrompt, CommunityEssay } from '../types';
import {
  Upload,
  X,
  FileText,
  PenLine,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface UploadCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: EssayPrompt[];
  onUploadPrompt: (promptData: Omit<CommunityPrompt, 'id' | 'createdAt'>) => void;
  onUploadEssay: (essayData: Omit<CommunityEssay, 'id' | 'createdAt' | 'likes' | 'wordCount'>) => void;
  currentDraftContent?: string;
  currentDraftTitle?: string;
  currentDraftPromptId?: string;
}

export const UploadCommunityModal: React.FC<UploadCommunityModalProps> = ({
  isOpen,
  onClose,
  prompts,
  onUploadPrompt,
  onUploadEssay,
  currentDraftContent = '',
  currentDraftTitle = '',
  currentDraftPromptId,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'essay'>('prompt');

  // Form State - Type A: Đề bài mới
  const [promptTitle, setPromptTitle] = useState('');
  const [promptContent, setPromptContent] = useState('');
  const [promptTopic, setPromptTopic] = useState<string>(ESSAY_TOPICS[1]);
  const [promptDifficulty, setPromptDifficulty] = useState<'Cơ bản' | 'Trung bình' | 'Nâng cao'>('Trung bình');
  const [promptKeywords, setPromptKeywords] = useState('');
  const [promptAuthor, setPromptAuthor] = useState('');
  const [promptOutline, setPromptOutline] = useState('');

  // Form State - Type B: Bài văn chia sẻ
  const [essayTitle, setEssayTitle] = useState(currentDraftTitle || '');
  const [essaySelectedPromptId, setEssaySelectedPromptId] = useState(currentDraftPromptId || prompts[0]?.id || '');
  const [essayContent, setEssayContent] = useState(currentDraftContent || '');
  const [essayTopic, setEssayTopic] = useState<string>(ESSAY_TOPICS[1]);
  const [essayAuthor, setEssayAuthor] = useState('');
  const [essayCopyrightAgreed, setEssayCopyrightAgreed] = useState(false);

  // Status message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!promptTitle.trim() || !promptContent.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ Tên đề và Nội dung đề bài.');
      return;
    }

    const keywordsArray = promptKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    onUploadPrompt({
      title: promptTitle.trim(),
      content: promptContent.trim(),
      topic: promptTopic,
      difficulty: promptDifficulty,
      authorDisplayName: promptAuthor.trim() || 'Học sinh THPT ẩn danh',
      keywords: keywordsArray.length > 0 ? keywordsArray : ['nghị luận xã hội', promptTopic.toLowerCase()],
      suggestedOutline: promptOutline.trim() || undefined,
    });

    setSuccessMessage('Đề bài mới đã được tải lên danh mục Đề cộng đồng thành công!');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1800);
  };

  const handleSubmitEssay = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!essayTitle.trim() || !essayContent.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ Tiêu đề và Nội dung bài văn.');
      return;
    }

    if (!essayCopyrightAgreed) {
      setErrorMessage('Vui lòng tích vào ô cam kết quyền tác giả và trách nhiệm chia sẻ nội dung.');
      return;
    }

    const matchedPrompt = prompts.find((p) => p.id === essaySelectedPromptId);

    onUploadEssay({
      title: essayTitle.trim(),
      promptId: essaySelectedPromptId || undefined,
      promptTitle: matchedPrompt ? matchedPrompt.title : 'Nghị luận tự do',
      content: essayContent.trim(),
      topic: essayTopic,
      authorDisplayName: essayAuthor.trim() || 'Học sinh lớp 12',
      visibility: 'public',
    });

    setSuccessMessage('Bài văn đã được chia sẻ lên chuyên mục Bài viết cộng đồng thành công!');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-apple-fade">
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] max-w-2xl w-full rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-2xl overflow-hidden my-8 relative transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A263A] to-[#5C1826] dark:from-[#A8324F] dark:to-[#7A263A] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
              <Upload className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg">Đóng Góp Nội Dung Học Tập</h3>
              <p className="text-xs text-amber-100/80">Chia sẻ đề bài và bài văn vì cộng đồng học sinh THPT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-black/20 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-[#D9C9AE] dark:border-[#3D352D] bg-[#EFE4D0]/60 dark:bg-[#1E1A17]/80 p-2 gap-2">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                : 'bg-white/60 dark:bg-[#25201C] text-[#29241F] dark:text-[#F5EFEB] hover:bg-white dark:hover:bg-[#2C2621]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Loại A: Tải lên đề mới</span>
          </button>
          <button
            onClick={() => setActiveTab('essay')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'essay'
                ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                : 'bg-white/60 dark:bg-[#25201C] text-[#29241F] dark:text-[#F5EFEB] hover:bg-white dark:hover:bg-[#2C2621]'
            }`}
          >
            <PenLine className="w-4 h-4" />
            <span>Loại B: Chia sẻ bài văn đã viết</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {successMessage && (
          <div className="m-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="m-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'prompt' ? (
            /* TYPE A: ĐỀ NGHỊ LUẬN XÃ HỘI MỚI */
            <form onSubmit={handleSubmitPrompt} className="space-y-4 text-sm text-[#29241F] dark:text-[#F5EFEB]">
              <div className="p-3 bg-[#EFE4D0]/50 dark:bg-[#1E1A17]/80 rounded-xl border border-[#D9C9AE]/60 dark:border-[#3D352D] text-xs text-[#847768] dark:text-[#A89F91]">
                * Đề bạn tạo sẽ xuất hiện ngay trong kho đề với nhãn <b>"Đề cộng đồng"</b>, không ghi đè lên 100 đề mẫu chuẩn và được lưu trữ cục bộ trên thiết bị của bạn.
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                  Tên đề bài *
                </label>
                <input
                  type="text"
                  value={promptTitle}
                  onChange={(e) => setPromptTitle(e.target.value)}
                  placeholder="Ví dụ: Ý nghĩa của sự thấu cảm trong gia đình..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                  Nội dung đề bài chi tiết *
                </label>
                <textarea
                  value={promptContent}
                  onChange={(e) => setPromptContent(e.target.value)}
                  placeholder="Nhập toàn bộ yêu cầu đề bài hoặc trích dẫn ngữ liệu đề..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                    Chủ đề
                  </label>
                  <select
                    value={promptTopic}
                    onChange={(e) => setPromptTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] focus:outline-none"
                  >
                    {ESSAY_TOPICS.filter((t) => t !== 'Tất cả').map((top) => (
                      <option key={top} value={top}>
                        {top}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                    Mức độ
                  </label>
                  <select
                    value={promptDifficulty}
                    onChange={(e) => setPromptDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] focus:outline-none"
                  >
                    <option value="Cơ bản">Cơ bản</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Nâng cao">Nâng cao</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                    Từ khóa (cách nhau dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={promptKeywords}
                    onChange={(e) => setPromptKeywords(e.target.value)}
                    placeholder="thấu cảm, gia đình, lắng nghe..."
                    className="w-full px-3.5 py-2 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                    Tên hiển thị người đóng góp
                  </label>
                  <input
                    type="text"
                    value={promptAuthor}
                    onChange={(e) => setPromptAuthor(e.target.value)}
                    placeholder="Ví dụ: Hoàng Long (12A1)..."
                    className="w-full px-3.5 py-2 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                  Dàn ý gợi ý vắn tắt (tùy chọn)
                </label>
                <textarea
                  value={promptOutline}
                  onChange={(e) => setPromptOutline(e.target.value)}
                  placeholder="Gợi ý các ý chính để bạn bè cùng tham khảo..."
                  rows={2}
                  className="w-full px-3.5 py-2 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#D9C9AE] dark:border-[#3D352D] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#D9C9AE] dark:border-[#3D352D] bg-white dark:bg-[#1E1A17] rounded-xl text-sm font-medium hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] text-[#29241F] dark:text-[#F5EFEB] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                >
                  Đăng đề bài
                </button>
              </div>
            </form>
          ) : (
            /* TYPE B: CHIA SẺ BÀI VĂN ĐÃ VIẾT */
            <form onSubmit={handleSubmitEssay} className="space-y-4 text-sm text-[#29241F] dark:text-[#F5EFEB]">
              <div className="p-3 bg-[#EFE4D0]/50 dark:bg-[#1E1A17]/80 rounded-xl border border-[#D9C9AE]/60 dark:border-[#3D352D] text-xs text-[#847768] dark:text-[#A89F91]">
                * Bài viết của bạn sẽ được chia sẻ lên trang <b>Bài viết cộng đồng</b> để các bạn cùng trao đổi học tập. Mặc định bản nháp trên máy bạn vẫn được giữ nguyên an toàn.
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                  Tiêu đề bài văn *
                </label>
                <input
                  type="text"
                  value={essayTitle}
                  onChange={(e) => setEssayTitle(e.target.value)}
                  placeholder="Nhập tiêu đề hoặc đặt nhan đề cho bài viết..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                    Đề bài liên quan
                  </label>
                  <select
                    value={essaySelectedPromptId}
                    onChange={(e) => setEssaySelectedPromptId(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] focus:outline-none text-xs"
                  >
                    {prompts.slice(0, 30).map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.id}: {p.title.slice(0, 35)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                    Chủ đề
                  </label>
                  <select
                    value={essayTopic}
                    onChange={(e) => setEssayTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] focus:outline-none"
                  >
                    {ESSAY_TOPICS.filter((t) => t !== 'Tất cả').map((top) => (
                      <option key={top} value={top}>
                        {top}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                  Nội dung bài văn chia sẻ *
                </label>
                <textarea
                  value={essayContent}
                  onChange={(e) => setEssayContent(e.target.value)}
                  placeholder="Dán hoặc nhập toàn bộ bài văn của bạn..."
                  rows={6}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none leading-relaxed font-serif"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider mb-1">
                  Tên hoặc bút danh hiển thị
                </label>
                <input
                  type="text"
                  value={essayAuthor}
                  onChange={(e) => setEssayAuthor(e.target.value)}
                  placeholder="Ví dụ: Minh Tuệ (12A2)..."
                  className="w-full px-3.5 py-2 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none"
                />
              </div>

              {/* Mandatory copyright & consent confirmation */}
              <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consent"
                  checked={essayCopyrightAgreed}
                  onChange={(e) => setEssayCopyrightAgreed(e.target.checked)}
                  className="mt-1 accent-[#7A263A] dark:accent-[#C24A64] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="consent" className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed cursor-pointer select-none">
                  <span className="font-semibold block">Cam kết quyền chia sẻ học tập:</span>
                  Tôi xác nhận bài viết này do tôi sáng tác hoặc có quyền chia sẻ vì mục đích phi thương mại, tôn trọng các chuẩn mực văn hóa và thuần phong mỹ tục.
                </label>
              </div>

              <div className="pt-3 border-t border-[#D9C9AE] dark:border-[#3D352D] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#D9C9AE] dark:border-[#3D352D] bg-white dark:bg-[#1E1A17] rounded-xl text-sm font-medium hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] text-[#29241F] dark:text-[#F5EFEB] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!essayCopyrightAgreed}
                  className="px-6 py-2 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  Chia sẻ bài văn
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
