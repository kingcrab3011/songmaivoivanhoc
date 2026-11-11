import React, { useState, useMemo } from 'react';
import { EvidenceItem } from '../types';
import { ESSAY_TOPICS } from '../data/prompts';
import { matchesSearch } from '../utils/text';
import {
  Compass,
  Search,
  User,
  Users,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  PenLine,
  Filter,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  X,
} from 'lucide-react';

interface EvidenceBankProps {
  evidenceItems: EvidenceItem[];
  savedItemIds: Set<string>;
  onToggleSaveEvidence: (item: EvidenceItem) => void;
  onUseEvidenceInWriting: (item: EvidenceItem) => void;
  initialTopicFilter?: string;
}

export const EvidenceBank: React.FC<EvidenceBankProps> = ({
  evidenceItems,
  savedItemIds,
  onToggleSaveEvidence,
  onUseEvidenceInWriting,
  initialTopicFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Cá nhân' | 'Cộng đồng'>('all');
  const [topicFilter, setTopicFilter] = useState<string>(initialTopicFilter || 'Tất cả');
  const [activeItemModal, setActiveItemModal] = useState<EvidenceItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return evidenceItems.filter((item) => {
      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }
      // Topic filter
      if (topicFilter !== 'Tất cả' && !item.relatedTopics.includes(topicFilter)) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const text = `${item.title} ${item.summary} ${item.lesson} ${item.keywords.join(' ')}`;
        return matchesSearch(text, searchQuery);
      }
      return true;
    });
  }, [evidenceItems, typeFilter, topicFilter, searchQuery]);

  const handleCopySummary = (item: EvidenceItem) => {
    const text = `DẪN CHỨNG: ${item.title} (${item.type})\n\n- Tóm tắt sự việc: ${item.summary}\n- Phẩm chất / Vấn đề khai thác: ${item.lesson}\n- Hướng dẫn đưa vào bài: ${item.usageGuide}\n- Lưu ý tránh sai sót: ${item.caution}\n- Nguồn: ${item.sourceUrl || 'Tư liệu kiểm chứng'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#C24A64] text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Kho dẫn chứng đa chiều chuẩn mực</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#29241F] dark:text-[#F5EFEB]">
              Kho Dẫn Chứng Thực Tiễn ({evidenceItems.length})
            </h2>
            <p className="text-sm text-[#847768] dark:text-[#A89B8E] mt-1 max-w-2xl">
              Hệ thống dẫn chứng đa tầng gồm cả <b>Cá nhân tiêu biểu</b> và <b>Cộng đồng / Hiện tượng xã hội</b>, có hướng dẫn phân tích sâu và cảnh báo tránh mắc lỗi dùng sai.
            </p>
          </div>

          {/* Quick Category Switcher */}
          <div className="flex items-center gap-2 bg-[#EFE4D0] dark:bg-[#1E1A17] p-1.5 rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-xs font-medium self-start md:self-auto shadow-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                typeFilter === 'all'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'text-[#29241F] dark:text-[#F5EFEB] hover:bg-[#FAF6EE] dark:hover:bg-[#25201C]'
              }`}
            >
              Tất cả ({evidenceItems.length})
            </button>
            <button
              onClick={() => setTypeFilter('Cá nhân')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95 ${
                typeFilter === 'Cá nhân'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'text-[#29241F] dark:text-[#F5EFEB] hover:bg-[#FAF6EE] dark:hover:bg-[#25201C]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Cá nhân cụ thể</span>
            </button>
            <button
              onClick={() => setTypeFilter('Cộng đồng')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95 ${
                typeFilter === 'Cộng đồng'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'text-[#29241F] dark:text-[#F5EFEB] hover:bg-[#FAF6EE] dark:hover:bg-[#25201C]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Cộng đồng / Hiện tượng</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 pt-5 border-t border-[#D9C9AE]/70 dark:border-[#3D352D] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#847768] dark:text-[#A89B8E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên nhân vật, sự việc, từ khóa (không dấu hoặc có dấu)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E1A17] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-sm text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768] dark:placeholder-[#A89B8E]/60 focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30 focus:border-[#7A263A] dark:focus:border-[#C24A64] transition-all"
            />
          </div>

          <div>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-[#1E1A17] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-sm text-[#29241F] dark:text-[#F5EFEB] focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30 transition-all cursor-pointer"
            >
              {ESSAY_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t === 'Tất cả' ? 'Mọi nhóm chủ đề' : `Chủ đề: ${t}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-12 text-center rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-xs">
          <Compass className="w-12 h-12 text-[#847768]/50 dark:text-[#A89B8E]/50 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-[#29241F] dark:text-[#F5EFEB] mb-1">
            Không tìm thấy dẫn chứng phù hợp
          </h3>
          <p className="text-sm text-[#847768] dark:text-[#A89B8E] mb-4">
            Thử tìm kiếm với từ khóa khác hoặc đặt lại bộ lọc phân loại.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
              setTopicFilter('Tất cả');
            }}
            className="px-4 py-2 bg-[#7A263A] dark:bg-[#C24A64] text-white text-sm font-medium rounded-xl hover:bg-[#5C1826] dark:hover:bg-[#9E354B] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            Xem lại tất cả dẫn chứng
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isSaved = savedItemIds.has(item.id);
            const isPersonal = item.type === 'Cá nhân';
            return (
              <div
                key={item.id}
                className="bg-[#FAF6EE] dark:bg-[#25201C] rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] p-5 flex flex-col justify-between hover:bg-white dark:hover:bg-[#2C2621] apple-glow-card active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group"
              >
                <div>
                  {/* Badge & Bookmark */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        isPersonal
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {isPersonal ? <User className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                      <span>{item.type}</span>
                    </span>

                    <button
                      onClick={() => onToggleSaveEvidence(item)}
                      className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer apple-glow-btn ${
                        isSaved
                          ? 'text-[#7A263A] dark:text-[#D2516B] bg-[#7A263A]/10 dark:bg-[#D2516B]/20'
                          : 'text-[#847768] dark:text-[#A89B8E] hover:text-[#7A263A] dark:hover:text-[#D2516B] hover:bg-[#EFE4D0] dark:hover:bg-[#1E1A17]'
                      }`}
                      title={isSaved ? 'Bỏ lưu' : 'Lưu vào Bài đã lưu'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 fill-[#7A263A] dark:fill-[#D2516B]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setActiveItemModal(item)}
                    className="font-serif font-bold text-base sm:text-lg text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors cursor-pointer mb-2 line-clamp-2 glow-text-title"
                  >
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#554C42] dark:text-[#D9C9AE] line-clamp-3 leading-relaxed mb-3 glow-text-sub">
                    {item.summary}
                  </p>

                  {/* Lesson / Quality exploited */}
                  <div className="p-2.5 rounded-xl bg-[#EFE4D0]/60 dark:bg-[#1E1A17] border border-[#D9C9AE]/60 dark:border-[#3D352D] text-xs text-[#29241F] dark:text-[#F5EFEB] mb-3">
                    <strong className="text-[#7A263A] dark:text-[#C24A64] block mb-0.5">Phẩm chất khai thác:</strong>
                    <p className="line-clamp-2">{item.lesson}</p>
                  </div>

                  {/* Related topic tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.relatedTopics.slice(0, 2).map((top, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#EFE4D0] dark:bg-[#1E1A17] text-[#847768] dark:text-[#A89B8E] px-2 py-0.5 rounded font-medium"
                      >
                        {top}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => handleCopySummary(item)}
                    className="px-2.5 py-1.5 bg-white dark:bg-[#1E1A17] hover:bg-[#EFE4D0] dark:hover:bg-[#2E2823] border border-[#D9C9AE] dark:border-[#3D352D] rounded-lg text-[#29241F] dark:text-[#F5EFEB] font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 shadow-xs"
                    title="Sao chép nội dung dẫn chứng"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#7A263A] dark:text-[#C24A64]" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveItemModal(item)}
                      className="px-2.5 py-1.5 bg-[#EFE4D0] dark:bg-[#1E1A17] hover:bg-[#E2D4BD] dark:hover:bg-[#2E2823] border border-transparent dark:border-[#3D352D] rounded-lg text-[#29241F] dark:text-[#F5EFEB] font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => onUseEvidenceInWriting(item)}
                      className="px-2.5 py-1.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#9E354B] text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 shadow-xs"
                      title="Gắn dẫn chứng này vào bài viết hiện tại"
                    >
                      <PenLine className="w-3.5 h-3.5" />
                      <span>Dùng bài viết</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29241F]/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF6EE] dark:bg-[#25201C] max-w-2xl w-full rounded-2xl border-2 border-[#D9C9AE] dark:border-[#3D352D] shadow-2xl p-6 sm:p-8 space-y-5 my-8 relative animate-apple-in">
            <button
              onClick={() => setActiveItemModal(null)}
              className="absolute top-5 right-5 text-[#847768] dark:text-[#A89B8E] hover:text-[#7A263A] dark:hover:text-[#C24A64] p-1.5 rounded-full hover:bg-[#EFE4D0] dark:hover:bg-[#1E1A17] transition-all hover:scale-110 active:scale-90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#C24A64] mb-2 inline-block">
                Dẫn chứng {activeItemModal.type}
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#29241F] dark:text-[#F5EFEB]">
                {activeItemModal.title}
              </h3>
            </div>

            <div className="space-y-4 text-sm text-[#29241F] dark:text-[#F5EFEB]">
              <div className="p-4 rounded-xl bg-white/80 dark:bg-[#1E1A17] border border-[#D9C9AE]/70 dark:border-[#3D352D]">
                <h4 className="font-semibold text-xs text-[#7A263A] dark:text-[#C24A64] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Compass className="w-4 h-4" />
                  <span>Tóm tắt sự việc / Cốt truyện dẫn chứng:</span>
                </h4>
                <p className="leading-relaxed text-[#554C42] dark:text-[#D9C9AE]">{activeItemModal.summary}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-[#1E1A17] border border-[#D9C9AE]/70 dark:border-[#3D352D]">
                <h4 className="font-semibold text-xs text-[#7A263A] dark:text-[#C24A64] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" />
                  <span>Phẩm chất / Vấn đề khai thác:</span>
                </h4>
                <p className="leading-relaxed text-[#554C42] dark:text-[#D9C9AE]">{activeItemModal.lesson}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                <h4 className="font-semibold text-xs text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Cách đưa vào bài văn nghị luận xã hội:</span>
                </h4>
                <p className="leading-relaxed text-amber-950 dark:text-amber-200">{activeItemModal.usageGuide}</p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60">
                <h4 className="font-semibold text-xs text-rose-900 dark:text-rose-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Lưu ý quan trọng để tránh mắc lỗi:</span>
                </h4>
                <p className="leading-relaxed text-rose-950 dark:text-rose-200">{activeItemModal.caution}</p>
              </div>

              {activeItemModal.sourceUrl && (
                <p className="text-xs text-[#847768] dark:text-[#A89B8E] italic">
                  Nguồn kiểm chứng: {activeItemModal.sourceUrl}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#D9C9AE] dark:border-[#3D352D] flex items-center justify-end gap-3">
              <button
                onClick={() => handleCopySummary(activeItemModal)}
                className="px-4 py-2 border border-[#D9C9AE] dark:border-[#3D352D] bg-white dark:bg-[#1E1A17] text-sm font-medium text-[#29241F] dark:text-[#F5EFEB] rounded-xl hover:bg-[#EFE4D0] dark:hover:bg-[#2E2823] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4 text-[#7A263A] dark:text-[#C24A64]" />
                <span>Sao chép toàn bộ</span>
              </button>

              <button
                onClick={() => {
                  onUseEvidenceInWriting(activeItemModal);
                  setActiveItemModal(null);
                }}
                className="px-5 py-2 bg-[#7A263A] dark:bg-[#C24A64] text-white text-sm font-medium rounded-xl hover:bg-[#5C1826] dark:hover:bg-[#9E354B] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <PenLine className="w-4 h-4" />
                <span>Gắn vào bài viết</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
