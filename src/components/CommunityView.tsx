import React, { useState, useMemo } from 'react';
import { CommunityEssay, CommunityPrompt } from '../types';
import { ESSAY_TOPICS } from '../data/prompts';
import { formatVietnameseDateTime, matchesSearch } from '../utils/text';
import { EssayComments } from './EssayComments';
import {
  Sparkles,
  Search,
  Heart,
  Share2,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  AlertOctagon,
  FileText,
  User,
  Clock,
  ExternalLink,
  X,
  ShieldCheck,
} from 'lucide-react';

interface CommunityViewProps {
  essays: CommunityEssay[];
  prompts: CommunityPrompt[];
  savedItemIds: Set<string>;
  onLikeEssay: (id: string) => void;
  onToggleSaveEssay: (essay: CommunityEssay) => void;
  onSelectPrompt: (prompt: CommunityPrompt) => void;
  onOpenUpload: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  essays,
  prompts,
  savedItemIds,
  onLikeEssay,
  onToggleSaveEssay,
  onSelectPrompt,
  onOpenUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'essays' | 'prompts'>('essays');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');
  const [readingEssay, setReadingEssay] = useState<CommunityEssay | null>(null);
  const [reportingItem, setReportingItem] = useState<{ id: string; title: string } | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredEssays = useMemo(() => {
    return essays.filter((e) => {
      if (selectedTopic !== 'Tất cả' && e.topic !== selectedTopic) return false;
      if (searchQuery.trim()) {
        const text = `${e.title} ${e.promptTitle} ${e.authorDisplayName} ${e.content}`;
        return matchesSearch(text, searchQuery);
      }
      return true;
    });
  }, [essays, selectedTopic, searchQuery]);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      if (selectedTopic !== 'Tất cả' && p.topic !== selectedTopic) return false;
      if (searchQuery.trim()) {
        const text = `${p.title} ${p.content} ${p.authorDisplayName} ${p.keywords.join(' ')}`;
        return matchesSearch(text, searchQuery);
      }
      return true;
    });
  }, [prompts, selectedTopic, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportingItem(null);
      setReportSubmitted(false);
      setReportReason('');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-apple-fade">
      {/* Header */}
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-sm transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Góc học tập & trao đổi kinh nghiệm</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#29241F] dark:text-[#F5EFEB]">
              Bài Viết & Đề Thi Cộng Đồng
            </h2>
            <p className="text-sm text-[#847768] dark:text-[#A89F91] mt-1 max-w-2xl">
              Nơi chia sẻ các bài văn đạt điểm cao, góc nhìn phản biện mới lạ và các đề bài sáng tạo do học sinh và giáo viên đóng góp.
            </p>
          </div>

          <button
            onClick={onOpenUpload}
            className="px-4 py-2.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 self-start sm:self-auto cursor-pointer"
          >
            + Đóng góp bài hoặc đề mới
          </button>
        </div>

        {/* Tab & Search */}
        <div className="mt-6 pt-5 border-t border-[#D9C9AE]/70 dark:border-[#3D352D] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-[#EFE4D0] dark:bg-[#1E1A17] p-1 rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-xs font-medium w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('essays')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                activeTab === 'essays'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white font-semibold shadow-xs'
                  : 'text-[#29241F] dark:text-[#F5EFEB] hover:bg-[#FAF6EE] dark:hover:bg-[#2C2621]'
              }`}
            >
              Bài văn tham khảo ({essays.length})
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                activeTab === 'prompts'
                  ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white font-semibold shadow-xs'
                  : 'text-[#29241F] dark:text-[#F5EFEB] hover:bg-[#FAF6EE] dark:hover:bg-[#2C2621]'
              }`}
            >
              Đề cộng đồng ({prompts.length})
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#847768] dark:text-[#A89F91]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài viết, tác giả hoặc từ khóa..."
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#1E1A17] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-xs sm:text-sm text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30"
              />
            </div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-2.5 py-2 bg-white dark:bg-[#1E1A17] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-xs text-[#29241F] dark:text-[#F5EFEB] focus:outline-none max-w-[150px]"
            >
              <option value="Tất cả">Mọi chủ đề</option>
              {ESSAY_TOPICS.filter((t) => t !== 'Tất cả').map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'essays' ? (
        /* Essays Grid */
        filteredEssays.length === 0 ? (
          <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-12 text-center rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D]">
            <FileText className="w-12 h-12 text-[#847768]/50 dark:text-[#A89F91]/40 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#29241F] dark:text-[#F5EFEB] mb-1">
              Chưa có bài văn nào phù hợp
            </h3>
            <p className="text-sm text-[#847768] dark:text-[#A89F91] mb-4">
              Hãy là người đầu tiên chia sẻ bài văn nghị luận xã hội của bạn tới cộng đồng!
            </p>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 bg-[#7A263A] dark:bg-[#C24A64] text-white text-sm font-medium rounded-xl hover:bg-[#5C1826] dark:hover:bg-[#A8324F] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            >
              Chia sẻ bài viết ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredEssays.map((essay) => {
              const isSaved = savedItemIds.has(essay.id);
              return (
                <div
                  key={essay.id}
                  className="bg-[#FAF6EE] dark:bg-[#25201C] rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] p-5 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.025] hover:-translate-y-0.5 hover:shadow-xl hover:bg-white dark:hover:bg-[#2C2621] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] bg-[#EFE4D0] dark:bg-[#1E1A17] text-[#7A263A] dark:text-[#E88E9E] font-semibold px-2.5 py-0.5 rounded-full border border-[#D9C9AE]/40 dark:border-[#3D352D]/60">
                        {essay.topic}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onLikeEssay(essay.id)}
                          className="flex items-center gap-1 text-xs text-[#847768] dark:text-[#A89F91] hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-all duration-150 hover:scale-110 active:scale-95"
                          title="Thả tim bài viết"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          <span>{essay.likes || 0}</span>
                        </button>
                        <button
                          onClick={() => onToggleSaveEssay(essay)}
                          className="p-1 text-[#847768] dark:text-[#A89F91] hover:text-[#7A263A] dark:hover:text-[#E88E9E] cursor-pointer transition-all duration-150 hover:scale-110 active:scale-95"
                          title={isSaved ? 'Bỏ lưu' : 'Lưu bài tham khảo'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 fill-[#7A263A] text-[#7A263A] dark:fill-[#C24A64] dark:text-[#C24A64]" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <h3
                      onClick={() => setReadingEssay(essay)}
                      className="font-serif font-bold text-lg text-[#29241F] dark:text-[#F5EFEB] hover:text-[#7A263A] dark:hover:text-[#E88E9E] transition-colors cursor-pointer mb-1.5 line-clamp-2"
                    >
                      {essay.title}
                    </h3>

                    <p className="text-xs text-[#7A263A] dark:text-[#E88E9E] italic font-serif mb-2 line-clamp-1">
                      Đề bài: {essay.promptTitle}
                    </p>

                    <p className="text-xs sm:text-sm text-[#554C42] dark:text-[#C5BCB0] line-clamp-4 leading-relaxed mb-4 font-serif">
                      {essay.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D9C9AE]/70 dark:border-[#3D352D] flex items-center justify-between text-xs text-[#847768] dark:text-[#A89F91]">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#7A263A] dark:text-[#E88E9E]" />
                      <span className="text-[#29241F] dark:text-[#F5EFEB]">{essay.authorDisplayName}</span>
                      <span>•</span>
                      <span>{essay.wordCount} từ</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReportingItem({ id: essay.id, title: essay.title })}
                        className="text-[#847768] dark:text-[#A89F91] hover:text-rose-700 dark:hover:text-rose-400 cursor-pointer p-1 transition-colors"
                        title="Báo cáo nội dung không phù hợp"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setReadingEssay(essay)}
                        className="px-3.5 py-1.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-xs shadow-xs"
                      >
                        Đọc toàn bộ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Community Prompts Grid */
        filteredPrompts.length === 0 ? (
          <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-12 text-center rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D]">
            <Sparkles className="w-12 h-12 text-[#847768]/50 dark:text-[#A89F91]/40 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#29241F] dark:text-[#F5EFEB] mb-1">
              Chưa có đề bài cộng đồng nào phù hợp
            </h3>
            <p className="text-sm text-[#847768] dark:text-[#A89F91] mb-4">
              Hãy tải lên đề bài bạn tâm đắc để mọi người cùng thảo luận và rèn luyện.
            </p>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 bg-[#7A263A] dark:bg-[#C24A64] text-white text-sm font-medium rounded-xl hover:bg-[#5C1826] dark:hover:bg-[#A8324F] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            >
              Tải lên đề mới
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPrompts.map((p) => (
              <div
                key={p.id}
                className="bg-[#FAF6EE] dark:bg-[#25201C] rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] p-5 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.025] hover:-translate-y-0.5 hover:shadow-xl hover:bg-white dark:hover:bg-[#2C2621] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-semibold px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                      Đề cộng đồng
                    </span>
                    <span className="text-xs text-[#847768] dark:text-[#A89F91] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#7A263A] dark:text-[#E88E9E]" />
                      {formatVietnameseDateTime(p.createdAt)}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectPrompt(p)}
                    className="font-serif font-bold text-base sm:text-lg text-[#29241F] dark:text-[#F5EFEB] hover:text-[#7A263A] dark:hover:text-[#E88E9E] transition-colors cursor-pointer mb-2"
                  >
                    {p.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#554C42] dark:text-[#C5BCB0] leading-relaxed mb-3 line-clamp-3">
                    {p.content}
                  </p>

                  {p.suggestedOutline && (
                    <div className="p-2.5 rounded-lg bg-[#EFE4D0]/60 dark:bg-[#1E1A17]/80 border border-[#D9C9AE]/60 dark:border-[#3D352D]/80 text-xs text-[#29241F] dark:text-[#F5EFEB] mb-3">
                      <strong className="text-[#7A263A] dark:text-[#E88E9E] block mb-0.5">Gợi ý dàn ý:</strong>
                      <p className="line-clamp-2">{p.suggestedOutline}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs text-[#847768] dark:text-[#A89F91]">
                  <span>Đóng góp bởi: <b className="text-[#29241F] dark:text-[#F5EFEB]">{p.authorDisplayName}</b></span>
                  <button
                    onClick={() => onSelectPrompt(p)}
                    className="px-3 py-1.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  >
                    Xem & Viết bài
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Full Reading Modal for Shared Essay */}
      {readingEssay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-apple-fade">
          <div className="bg-[#FAF6EE] dark:bg-[#25201C] max-w-3xl w-full rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-2xl p-6 sm:p-8 space-y-5 my-8 relative">
            <button
              onClick={() => setReadingEssay(null)}
              className="absolute top-5 right-5 text-[#847768] dark:text-[#A89F91] hover:text-[#7A263A] dark:hover:text-[#E88E9E] p-1.5 rounded-full hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#D9C9AE]/70 dark:border-[#3D352D] pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E]">
                  {readingEssay.topic}
                </span>
                <span className="text-xs text-[#847768] dark:text-[#A89F91]">
                  Tác giả: <b className="text-[#29241F] dark:text-[#F5EFEB]">{readingEssay.authorDisplayName}</b> • {readingEssay.wordCount} từ
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#29241F] dark:text-[#F5EFEB] leading-snug">
                {readingEssay.title}
              </h2>
              <p className="text-xs text-[#7A263A] dark:text-[#E88E9E] italic font-serif mt-1">
                Theo đề bài: {readingEssay.promptTitle}
              </p>
            </div>

            {/* Essay Paragraphs */}
            <div className="p-4 sm:p-6 bg-white/80 dark:bg-[#1E1A17]/80 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] max-h-[55vh] overflow-y-auto leading-relaxed text-[#29241F] dark:text-[#F5EFEB] font-serif text-sm sm:text-base space-y-4 text-justify">
              {readingEssay.content
                .split(/\n\s*\n/)
                .map((p) => p.trim())
                .filter((p) => p.length > 0)
                .map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#D9C9AE] dark:border-[#3D352D] flex items-center justify-between">
              <button
                onClick={() => handleCopy(readingEssay.id, readingEssay.content)}
                className="px-3.5 py-2 border border-[#D9C9AE] dark:border-[#3D352D] bg-white dark:bg-[#1E1A17] rounded-xl text-xs sm:text-sm font-medium hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer text-[#29241F] dark:text-[#F5EFEB] shadow-xs"
              >
                {copiedId === readingEssay.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400">Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#7A263A] dark:text-[#E88E9E]" />
                    <span>Sao chép bài viết</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLikeEssay(readingEssay.id)}
                  className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>Hữu ích ({readingEssay.likes || 0})</span>
                </button>
                <button
                  onClick={() => setReadingEssay(null)}
                  className="px-4 py-2 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* Discussion & Comments Section */}
            <EssayComments essayId={readingEssay.id} />
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-apple-fade">
          <div className="bg-[#FAF6EE] dark:bg-[#25201C] max-w-md w-full rounded-2xl border-2 border-rose-300 dark:border-rose-900/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                <AlertOctagon className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-[#29241F] dark:text-[#F5EFEB]">
                  Báo cáo nội dung
                </h3>
              </div>
              <button
                onClick={() => setReportingItem(null)}
                className="text-[#847768] dark:text-[#A89F91] hover:text-black dark:hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-xl text-center text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <p className="font-semibold">Cảm ơn bạn đã gửi phản ánh!</p>
                <p>Ban biên tập sẽ kiểm duyệt lại nội dung này trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-3 text-xs text-[#29241F] dark:text-[#F5EFEB]">
                <p className="text-[#554C42] dark:text-[#C5BCB0]">
                  Bạn đang báo cáo bài: <b>{reportingItem.title}</b>
                </p>
                <div>
                  <label className="block font-semibold mb-1 text-[#29241F] dark:text-[#F5EFEB]">Lý do báo cáo:</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1E1A17] text-[#29241F] dark:text-[#F5EFEB] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl focus:outline-none"
                    required
                  >
                    <option value="">-- Chọn lý do --</option>
                    <option value="spam">Nội dung rác hoặc quảng cáo</option>
                    <option value="hate">Ngôn từ công kích, thù hằn, sai lệch chuẩn mực</option>
                    <option value="copyright">Vi phạm bản quyền</option>
                    <option value="other">Lý do khác</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingItem(null)}
                    className="px-3.5 py-1.5 border border-[#D9C9AE] dark:border-[#3D352D] bg-white dark:bg-[#1E1A17] text-[#29241F] dark:text-[#F5EFEB] rounded-lg hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-rose-700 dark:bg-rose-800 text-white font-medium rounded-lg hover:bg-rose-800 dark:hover:bg-rose-700 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  >
                    Gửi báo cáo
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
