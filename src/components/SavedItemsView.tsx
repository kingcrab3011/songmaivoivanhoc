import React, { useState, useMemo } from 'react';
import { SavedItem } from '../types';
import { formatVietnameseDateTime, matchesSearch } from '../utils/text';
import {
  Bookmark,
  Search,
  Trash2,
  ExternalLink,
  FileText,
  Sparkles,
  Compass,
  BookOpen,
} from 'lucide-react';

interface SavedItemsViewProps {
  savedItems: SavedItem[];
  onRemoveSavedItem: (itemId: string) => void;
  onOpenItem: (item: SavedItem) => void;
}

export const SavedItemsView: React.FC<SavedItemsViewProps> = ({
  savedItems,
  onRemoveSavedItem,
  onOpenItem,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return savedItems.filter((item) => {
      if (filterType !== 'all' && item.itemType !== filterType) {
        return false;
      }
      if (searchQuery.trim()) {
        const text = `${item.title} ${item.subtitle || ''} ${item.tag || ''}`;
        return matchesSearch(text, searchQuery);
      }
      return true;
    });
  }, [savedItems, filterType, searchQuery]);

  const getItemTypeBadge = (type: SavedItem['itemType']) => {
    switch (type) {
      case 'prompt':
        return { label: 'Đề bài', icon: FileText, color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'outline':
        return { label: 'Dàn ý', icon: Sparkles, color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
      case 'evidence':
        return { label: 'Dẫn chứng', icon: Compass, color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'community_essay':
        return { label: 'Bài văn tham khảo', icon: BookOpen, color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
      default:
        return { label: 'Mục lưu', icon: Bookmark, color: 'bg-gray-100 dark:bg-stone-800 text-gray-800 dark:text-stone-300 border-gray-200 dark:border-stone-700' };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-apple-fade">
      {/* Header card */}
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-sm transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E] text-xs font-semibold mb-2">
              <Bookmark className="w-3.5 h-3.5 fill-[#7A263A] dark:fill-[#C24A64]" />
              <span>Thư mục tài liệu yêu thích cá nhân</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#29241F] dark:text-[#F5EFEB]">
              Bài Đã Lưu ({savedItems.length})
            </h2>
            <p className="text-sm text-[#847768] dark:text-[#A89F91] mt-1">
              Nơi lưu trữ các đề bài hay, dàn ý mẫu, dẫn chứng đắt giá và bài viết tham khảo để ôn tập lại bất kỳ lúc nào.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#EFE4D0] dark:bg-[#1E1A17] p-1 rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-xs font-medium">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'text-[#29241F] dark:text-[#F5EFEB] hover:bg-[#FAF6EE] dark:hover:bg-[#2C2621]'
              }`}
            >
              Tất cả ({savedItems.length})
            </button>
            <button
              onClick={() => setFilterType('prompt')}
              className={`px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                filterType === 'prompt'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'text-[#29241F] dark:text-[#F5EFEB] hover:bg-[#FAF6EE] dark:hover:bg-[#2C2621]'
              }`}
            >
              Đề thi
            </button>
            <button
              onClick={() => setFilterType('outline')}
              className={`px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                filterType === 'outline'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'text-[#29241F] dark:text-[#F5EFEB] hover:bg-[#FAF6EE] dark:hover:bg-[#2C2621]'
              }`}
            >
              Dàn ý
            </button>
            <button
              onClick={() => setFilterType('evidence')}
              className={`px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                filterType === 'evidence'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white shadow-xs'
                  : 'text-[#29241F] dark:text-[#F5EFEB] hover:bg-[#FAF6EE] dark:hover:bg-[#2C2621]'
              }`}
            >
              Dẫn chứng
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#847768] dark:text-[#A89F91]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm trong các mục đã lưu..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1E1A17] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-sm text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30 transition-all"
          />
        </div>
      </div>

      {/* Items list */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-12 text-center rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D]">
          <Bookmark className="w-12 h-12 text-[#847768]/50 dark:text-[#A89F91]/40 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-[#29241F] dark:text-[#F5EFEB] mb-1">
            Chưa có mục nào được lưu
          </h3>
          <p className="text-sm text-[#847768] dark:text-[#A89F91] max-w-md mx-auto">
            Khi duyệt Kho đề, Dàn ý hoặc Kho dẫn chứng, hãy nhấn vào biểu tượng dấu trang (Bookmark) để lưu lại các nội dung yêu thích tại đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const badge = getItemTypeBadge(item.itemType);
            const Icon = badge.icon;
            return (
              <div
                key={item.id}
                className="bg-[#FAF6EE] dark:bg-[#25201C] rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] p-5 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.025] hover:-translate-y-0.5 hover:shadow-xl hover:bg-white dark:hover:bg-[#2C2621] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.color}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                    <span className="text-[11px] text-[#847768] dark:text-[#A89F91]">
                      Lưu lúc: {formatVietnameseDateTime(item.savedAt)}
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpenItem(item)}
                    className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] hover:text-[#7A263A] dark:hover:text-[#E88E9E] transition-colors cursor-pointer mb-2 line-clamp-2"
                  >
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <p className="text-xs text-[#554C42] dark:text-[#C5BCB0] line-clamp-2 mb-3 leading-relaxed">
                      {item.subtitle}
                    </p>
                  )}

                  {item.tag && (
                    <span className="inline-block text-[11px] bg-[#EFE4D0] dark:bg-[#1E1A17] text-[#7A263A] dark:text-[#E88E9E] font-medium px-2 py-0.5 rounded mb-3 border border-[#D9C9AE]/40 dark:border-[#3D352D]/60">
                      #{item.tag}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs">
                  <button
                    onClick={() => onRemoveSavedItem(item.itemId)}
                    className="text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 flex items-center gap-1 hover:underline cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Bỏ lưu</span>
                  </button>

                  <button
                    onClick={() => onOpenItem(item)}
                    className="px-3 py-1.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>Xem chi tiết</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
