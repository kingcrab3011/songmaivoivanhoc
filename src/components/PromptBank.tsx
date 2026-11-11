import React, { useState, useMemo } from 'react';
import { EssayPrompt } from '../types';
import { ESSAY_TOPICS } from '../data/prompts';
import { matchesSearch } from '../utils/text';
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  PenLine,
  FileText,
  Sparkles,
  RotateCcw,
  Tag,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface PromptBankProps {
  prompts: EssayPrompt[];
  savedItemIds: Set<string>;
  onToggleSavePrompt: (prompt: EssayPrompt) => void;
  onViewPromptDetail: (prompt: EssayPrompt) => void;
  onViewOutline: (prompt: EssayPrompt) => void;
  onStartWriting: (prompt: EssayPrompt) => void;
}

export const PromptBank: React.FC<PromptBankProps> = ({
  prompts,
  savedItemIds,
  onToggleSavePrompt,
  onViewPromptDetail,
  onViewOutline,
  onStartWriting,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'difficulty'>('id');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter & Search Logic
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      // Topic match
      if (selectedTopic !== 'Tất cả' && p.topic !== selectedTopic) {
        return false;
      }
      // Difficulty match
      if (selectedDifficulty !== 'Tất cả' && p.difficulty !== selectedDifficulty) {
        return false;
      }
      // Search query in title, content, or keywords
      if (searchQuery.trim()) {
        const textToSearch = `${p.title} ${p.content} ${p.keywords.join(' ')}`;
        if (!matchesSearch(textToSearch, searchQuery)) {
          return false;
        }
      }
      return true;
    });
  }, [prompts, searchQuery, selectedTopic, selectedDifficulty]);

  // Sort logic
  const sortedPrompts = useMemo(() => {
    return [...filteredPrompts].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'vi');
      }
      if (sortBy === 'difficulty') {
        const diffWeight = { 'Cơ bản': 1, 'Trung bình': 2, 'Nâng cao': 3 };
        return (diffWeight[a.difficulty] || 0) - (diffWeight[b.difficulty] || 0);
      }
      return a.id.localeCompare(b.id, 'vi', { numeric: true });
    });
  }, [filteredPrompts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedPrompts.length / itemsPerPage);
  const currentPrompts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedPrompts.slice(start, start + itemsPerPage);
  }, [sortedPrompts, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('Tất cả');
    setSelectedDifficulty('Tất cả');
    setSortBy('id');
    setCurrentPage(1);
  };

  const getDifficultyBadge = (diff: EssayPrompt['difficulty']) => {
    switch (diff) {
      case 'Cơ bản':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Trung bình':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Nâng cao':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      default:
        return 'bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7A263A] dark:bg-[#C24A64] text-white">
                Bộ sưu tập chuẩn
              </span>
              <span className="text-xs text-[#847768] dark:text-[#A89B8E]">Ôn thi Tốt nghiệp THPT & ĐGNL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#29241F] dark:text-[#F5EFEB]">
              Kho 100 Đề Nghị Luận Xã Hội
            </h2>
            <p className="text-sm text-[#847768] dark:text-[#A89B8E] mt-1">
              Tuyển tập 100 đề bài thực tế thuộc 20 nhóm chủ đề trọng tâm, chuẩn bị sẵn sàng dàn ý và gợi ý dẫn chứng.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-[#EFE4D0] dark:bg-[#1E1A17] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-center shadow-xs">
              <p className="text-xs text-[#847768] dark:text-[#A89B8E] font-medium">Tổng số đề</p>
              <p className="text-xl font-bold text-[#7A263A] dark:text-[#C24A64] font-serif">{prompts.length}</p>
            </div>
            <div className="px-4 py-2 bg-[#EFE4D0] dark:bg-[#1E1A17] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-center shadow-xs">
              <p className="text-xs text-[#847768] dark:text-[#A89B8E] font-medium">Kết quả lọc</p>
              <p className="text-xl font-bold text-[#29241F] dark:text-[#F5EFEB] font-serif">{sortedPrompts.length}</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 pt-5 border-t border-[#D9C9AE]/70 dark:border-[#3D352D] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box with accent-insensitive hint */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#847768] dark:text-[#A89B8E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm kiếm theo từ khóa (gõ có dấu hoặc không dấu)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E1A17] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-sm text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768] dark:placeholder-[#A89B8E]/60 focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30 focus:border-[#7A263A] dark:focus:border-[#C24A64] transition-all"
            />
          </div>

          {/* Difficulty filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-white dark:bg-[#1E1A17] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-sm text-[#29241F] dark:text-[#F5EFEB] focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30 transition-all cursor-pointer"
            >
              <option value="Tất cả">Mọi mức độ</option>
              <option value="Cơ bản">Mức độ: Cơ bản</option>
              <option value="Trung bình">Mức độ: Trung bình</option>
              <option value="Nâng cao">Mức độ: Nâng cao</option>
            </select>
          </div>

          {/* Sort selector */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-white dark:bg-[#1E1A17] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-sm text-[#29241F] dark:text-[#F5EFEB] focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30 transition-all cursor-pointer"
            >
              <option value="id">Sắp xếp: Mã đề (1 - 100)</option>
              <option value="title">Sắp xếp: Tên đề (A - Z)</option>
              <option value="difficulty">Sắp xếp: Độ khó tăng dần</option>
            </select>
          </div>
        </div>

        {/* Topic Pills Carousel / Wrap */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-[#847768] dark:text-[#A89B8E] shrink-0 mr-1" />
          {ESSAY_TOPICS.map((topic) => {
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => {
                  setSelectedTopic(topic);
                  setCurrentPage(1);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border apple-glow-pill ${
                  isSelected
                    ? 'bg-[#7A263A] dark:bg-[#D2516B] text-white border-[#7A263A] dark:border-[#D2516B] shadow-xs'
                    : 'bg-[#FAF6EE] dark:bg-[#25201C] text-[#554C42] dark:text-[#D9C9AE] border-[#D9C9AE] dark:border-[#3D352D] hover:bg-white dark:hover:bg-[#2E2823] hover:text-[#7A263A] dark:hover:text-[#D2516B]'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {/* Active filter summary & reset button */}
        {(searchQuery || selectedTopic !== 'Tất cả' || selectedDifficulty !== 'Tất cả') && (
          <div className="mt-3 flex items-center justify-between text-xs text-[#847768] dark:text-[#A89B8E] pt-2 border-t border-[#D9C9AE]/40 dark:border-[#3D352D]">
            <span>
              Đang lọc theo:{' '}
              {selectedTopic !== 'Tất cả' && <b className="text-[#7A263A] dark:text-[#C24A64]">[{selectedTopic}] </b>}
              {selectedDifficulty !== 'Tất cả' && <b className="text-[#7A263A] dark:text-[#C24A64]">[{selectedDifficulty}] </b>}
              {searchQuery && <span>Từ khóa: "{searchQuery}"</span>}
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[#7A263A] dark:text-[#C24A64] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-transform hover:scale-105"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        )}
      </div>

      {/* Prompts Grid */}
      {currentPrompts.length === 0 ? (
        <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-12 text-center rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-xs">
          <FileText className="w-12 h-12 text-[#847768]/60 dark:text-[#A89B8E]/60 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-[#29241F] dark:text-[#F5EFEB] mb-1">
            Không tìm thấy đề bài phù hợp
          </h3>
          <p className="text-sm text-[#847768] dark:text-[#A89B8E] max-w-md mx-auto mb-4">
            Không có đề nào khớp với từ khóa hoặc bộ lọc hiện tại. Hãy thử tìm bằng từ khóa khác hoặc xóa bộ lọc.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#7A263A] dark:bg-[#C24A64] text-white text-sm font-medium rounded-xl hover:bg-[#5C1826] dark:hover:bg-[#9E354B] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentPrompts.map((prompt) => {
            const isSaved = savedItemIds.has(prompt.id);
            return (
              <div
                key={prompt.id}
                className="bg-[#FAF6EE] dark:bg-[#25201C] rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] p-5 flex flex-col justify-between hover:bg-white dark:hover:bg-[#2C2621] apple-glow-card active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group relative"
              >
                <div>
                  {/* Card top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-semibold text-[#847768] dark:text-[#A89B8E] bg-[#EFE4D0] dark:bg-[#1E1A17] px-2 py-0.5 rounded">
                      #{prompt.id.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getDifficultyBadge(
                          prompt.difficulty
                        )}`}
                      >
                        {prompt.difficulty}
                      </span>
                      {prompt.sourceType === 'Đề cộng đồng' && (
                        <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                          Đề cộng đồng
                        </span>
                      )}
                      {/* Save/Bookmark Button */}
                      <button
                        onClick={() => onToggleSavePrompt(prompt)}
                        className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer apple-glow-btn ${
                          isSaved
                            ? 'text-[#7A263A] dark:text-[#D2516B] bg-[#7A263A]/10 dark:bg-[#D2516B]/20'
                            : 'text-[#847768] dark:text-[#A89B8E] hover:text-[#7A263A] dark:hover:text-[#D2516B] hover:bg-[#EFE4D0] dark:hover:bg-[#1E1A17]'
                        }`}
                        title={isSaved ? 'Bỏ lưu đề này' : 'Lưu vào Bài đã lưu'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 fill-[#7A263A] dark:fill-[#D2516B]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Topic tag */}
                  <p className="text-xs text-[#7A263A] dark:text-[#D2516B] font-semibold mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{prompt.topic}</span>
                  </p>

                  {/* Title with Text Glow */}
                  <h3
                    onClick={() => onViewPromptDetail(prompt)}
                    className="font-serif font-bold text-lg text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors cursor-pointer mb-2 line-clamp-2 glow-text-title"
                  >
                    {prompt.title}
                  </h3>

                  {/* Content snippet with Subtitle Glow */}
                  <p className="text-sm text-[#554C42] dark:text-[#D9C9AE] line-clamp-3 leading-relaxed mb-4 glow-text-sub">
                    {prompt.content}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {prompt.keywords.slice(0, 3).map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-[#EFE4D0]/80 dark:bg-[#1E1A17] text-[#847768] dark:text-[#A89B8E] px-2 py-0.5 rounded"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons with Glow Effects */}
                <div className="pt-4 border-t border-[#D9C9AE]/70 dark:border-[#3D352D] grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onViewPromptDetail(prompt)}
                    className="px-2 py-2 text-xs font-medium text-[#29241F] dark:text-[#F5EFEB] bg-[#EFE4D0]/60 dark:bg-[#1E1A17] hover:bg-[#EFE4D0] dark:hover:bg-[#2E2823] rounded-xl text-center transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 apple-glow-btn"
                    title="Xem chi tiết đề bài"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#7A263A] dark:text-[#D2516B]" />
                    <span>Xem đề</span>
                  </button>

                  <button
                    onClick={() => onViewOutline(prompt)}
                    className="px-2 py-2 text-xs font-medium text-[#7A263A] dark:text-[#D2516B] bg-[#FAF6EE] dark:bg-[#25201C] hover:bg-[#EFE4D0] dark:hover:bg-[#2E2823] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-center transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 apple-glow-btn"
                    title="Xem dàn ý mẫu 7 phần chi tiết"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Xem dàn ý</span>
                  </button>

                  <button
                    onClick={() => onStartWriting(prompt)}
                    className="px-2 py-2 text-xs font-medium text-white bg-[#7A263A] dark:bg-[#D2516B] hover:bg-[#5C1826] dark:hover:bg-[#A83248] rounded-xl text-center shadow-xs hover:shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 apple-glow-btn"
                    title="Mở trình soạn thảo bắt đầu viết bài"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>Viết bài</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] bg-[#FAF6EE] dark:bg-[#25201C] text-[#29241F] dark:text-[#F5EFEB] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-[#2E2823] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 px-3 py-1 bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-sm font-medium text-[#29241F] dark:text-[#F5EFEB] shadow-xs">
            <span>Trang {currentPage} / {totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] bg-[#FAF6EE] dark:bg-[#25201C] text-[#29241F] dark:text-[#F5EFEB] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-[#2E2823] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
            aria-label="Trang sau"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
