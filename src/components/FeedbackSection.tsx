import React, { useState, useMemo } from 'react';
import { WebsiteFeedback } from '../types';
import { StorageService } from '../services/storage';
import { formatVietnameseDateTime, matchesSearch } from '../utils/text';
import {
  MessageSquare,
  Star,
  Search,
  Filter,
  Send,
  Sparkles,
  User,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ThumbsUp,
} from 'lucide-react';

interface FeedbackSectionProps {
  onBackToHome?: () => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ onBackToHome }) => {
  const [feedbackList, setFeedbackList] = useState<WebsiteFeedback[]>(() =>
    StorageService.getFeedback()
  );
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<WebsiteFeedback['category']>('Giao diện');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Tất cả');
  const [filterRating, setFilterRating] = useState<string>('Tất cả');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const categories: WebsiteFeedback['category'][] = [
    'Giao diện',
    'Kho đề',
    'Dàn ý',
    'Kho dẫn chứng',
    'Trình viết bài',
    'Tính năng AI',
    'Góp ý khác',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newFb = StorageService.addFeedback({
      authorName: authorName.trim() || 'Học sinh ẩn danh',
      content: content.trim(),
      rating,
      category,
    });

    setFeedbackList(StorageService.getFeedback());
    setContent('');
    setAuthorName('');
    setSubmittedMessage('Cảm ơn bạn! Lời góp ý của bạn đã được ghi nhận vào chuyên mục.');
    setTimeout(() => setSubmittedMessage(null), 3000);
  };

  const filteredList = useMemo(() => {
    return feedbackList.filter((fb) => {
      if (filterCategory !== 'Tất cả' && fb.category !== filterCategory) return false;
      if (filterRating !== 'Tất cả' && fb.rating !== Number(filterRating)) return false;
      if (searchQuery.trim()) {
        const text = `${fb.authorName} ${fb.content} ${fb.category}`;
        return matchesSearch(text, searchQuery);
      }
      return true;
    });
  }, [feedbackList, filterCategory, filterRating, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-apple-fade">
      {/* Header Banner */}
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 sm:p-8 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-sm transition-all duration-300">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E] text-xs font-semibold mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Góc Góp Ý & Cảm Nhận Người Học</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#29241F] dark:text-[#F5EFEB]">
          Cảm Nhận Về Văn Nghị Luận Lab
        </h2>
        <p className="text-sm text-[#847768] dark:text-[#A89F91] mt-1.5 max-w-2xl">
          Nơi bạn học cùng nhau chia sẻ đánh giá, trải nghiệm thực tế và đóng góp ý kiến để hoàn thiện nền tảng học tập số ngày một hữu ích hơn.
        </p>

        <div className="mt-4 p-3 rounded-xl bg-[#EFE4D0]/60 dark:bg-[#1E1A17]/80 border border-[#D9C9AE]/70 dark:border-[#3D352D] text-xs text-[#554C42] dark:text-[#C5BCB0] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#7A263A] dark:text-[#E88E9E] shrink-0" />
          <span>
            Các nhận xét được lưu trữ và hiển thị trực tiếp. Vui lòng sử dụng ngôn từ văn minh, lịch sự vì môi trường học đường.
          </span>
        </div>
      </div>

      {/* Grid: Left (Form), Right (Feedback List) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Submission */}
        <div className="lg:col-span-5 bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-sm h-fit space-y-4 transition-all duration-300">
          <h3 className="font-serif font-bold text-lg text-[#29241F] dark:text-[#F5EFEB] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7A263A] dark:text-[#E88E9E]" />
            <span>Gửi Cảm Nhận Của Bạn</span>
          </h3>

          {submittedMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
              {submittedMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#847768] dark:text-[#A89F91] font-semibold mb-1">
                Tên hiển thị hoặc biệt danh (tùy chọn)
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ví dụ: Hoàng Long (12A2)..."
                className="w-full px-3 py-2 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-xs text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30"
              />
            </div>

            <div>
              <label className="block text-[#847768] dark:text-[#A89F91] font-semibold mb-1">
                Nhóm chủ đề góp ý
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-xs text-[#29241F] dark:text-[#F5EFEB] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#847768] dark:text-[#A89F91] font-semibold mb-1">
                Đánh giá số sao (tùy chọn):
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setRating(s)}
                    className="p-1 hover:scale-125 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        s <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-[#D9C9AE] dark:text-[#3D352D]'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-mono text-[#847768] dark:text-[#A89F91]">
                  {rating} / 5 sao
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[#847768] dark:text-[#A89F91] font-semibold mb-1">
                Nội dung cảm nhận hoặc góp ý *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ trải nghiệm học tập, những điểm bạn thích hoặc các tính năng mong muốn được bổ sung..."
                rows={4}
                required
                className="w-full px-3 py-2 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-xs text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none leading-relaxed focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi nhận xét công khai</span>
            </button>
          </form>
        </div>

        {/* Feedback List & Filter */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Bar */}
          <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-4 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs transition-all duration-300">
            <div className="relative sm:col-span-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#847768] dark:text-[#A89F91]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhận xét..."
                className="w-full pl-8 pr-2 py-1.5 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-lg text-xs text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none"
              />
            </div>

            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-2 py-1.5 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-lg text-xs text-[#29241F] dark:text-[#F5EFEB] focus:outline-none"
              >
                <option value="Tất cả">Mọi chủ đề</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-2 py-1.5 bg-white dark:bg-[#1E1A17] border border-[#D9C9AE] dark:border-[#3D352D] rounded-lg text-xs text-[#29241F] dark:text-[#F5EFEB] focus:outline-none"
              >
                <option value="Tất cả">Mọi số sao</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredList.length === 0 ? (
              <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-8 text-center rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] text-xs text-[#847768] dark:text-[#A89F91]">
                Chưa có nhận xét nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              filteredList.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-[#FAF6EE] dark:bg-[#25201C] p-4 sm:p-5 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] space-y-2 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.02] hover:shadow-md hover:bg-white dark:hover:bg-[#2C2621] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#EFE4D0] dark:bg-[#2C2621] flex items-center justify-center text-[#7A263A] dark:text-[#E88E9E] font-bold text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-xs text-[#29241F] dark:text-[#F5EFEB]">
                        {fb.authorName}
                      </span>
                      <span className="text-[10px] bg-[#EFE4D0] dark:bg-[#1E1A17] text-[#7A263A] dark:text-[#E88E9E] font-semibold px-2 py-0.5 rounded-full border border-[#D9C9AE]/40 dark:border-[#3D352D]/60">
                        {fb.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {fb.rating && (
                        <div className="flex items-center">
                          {Array.from({ length: fb.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#554C42] dark:text-[#C5BCB0] leading-relaxed">
                    "{fb.content}"
                  </p>

                  <div className="pt-2 border-t border-[#D9C9AE]/40 dark:border-[#3D352D] text-[10px] text-[#847768] dark:text-[#A89F91] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#7A263A] dark:text-[#E88E9E]" />
                      {formatVietnameseDateTime(fb.createdAt)}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      ✓ Đã kiểm duyệt
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
