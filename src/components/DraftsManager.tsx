import React, { useState, useMemo } from 'react';
import { Draft } from '../types';
import { formatVietnameseDateTime, matchesSearch } from '../utils/text';
import {
  FileEdit,
  Plus,
  Search,
  Trash2,
  Edit2,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';

interface DraftsManagerProps {
  drafts: Draft[];
  activeDraftId: string | null;
  onOpenDraft: (draft: Draft) => void;
  onCreateNewDraft: () => void;
  onDeleteDraft: (id: string) => void;
  onRenameDraft: (id: string, newTitle: string) => void;
}

export const DraftsManager: React.FC<DraftsManagerProps> = ({
  drafts,
  activeDraftId,
  onOpenDraft,
  onCreateNewDraft,
  onDeleteDraft,
  onRenameDraft,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  const filteredDrafts = useMemo(() => {
    return drafts
      .filter((d) => {
        if (!searchQuery.trim()) return true;
        const text = `${d.title} ${d.promptTitle || ''} ${d.content}`;
        return matchesSearch(text, searchQuery);
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [drafts, searchQuery]);

  const handleStartRename = (d: Draft) => {
    setEditingId(d.id);
    setEditTitle(d.title);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameDraft(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-apple-fade">
      {/* Header */}
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E] text-xs font-semibold mb-2">
            <FileEdit className="w-3.5 h-3.5" />
            <span>Khu vực độc lập • Quản lý bản thảo</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#29241F] dark:text-[#F5EFEB]">
            Bài Làm Nháp ({drafts.length})
          </h2>
          <p className="text-sm text-[#847768] dark:text-[#A89F91] mt-1">
            Mọi bài viết của bạn được lưu an toàn trên trình duyệt này. Bạn có thể lưu giữ nhiều bản nháp cùng lúc và tiếp tục viết bất cứ lúc nào.
          </p>
        </div>

        <button
          onClick={onCreateNewDraft}
          className="px-4 py-2.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo bản nháp mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#847768] dark:text-[#A89F91]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm trong các bài nháp..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E1A17] rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] text-sm text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30 transition-all"
        />
      </div>

      {/* Drafts List */}
      {filteredDrafts.length === 0 ? (
        <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-12 text-center rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D]">
          <FileEdit className="w-12 h-12 text-[#847768]/50 dark:text-[#A89F91]/40 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-[#29241F] dark:text-[#F5EFEB] mb-1">
            Không tìm thấy bản nháp nào
          </h3>
          <p className="text-sm text-[#847768] dark:text-[#A89F91] mb-4">
            {searchQuery ? 'Thử tìm kiếm với từ khóa khác.' : 'Bạn chưa có bài nháp nào đang viết dở.'}
          </p>
          <button
            onClick={onCreateNewDraft}
            className="px-4 py-2 bg-[#7A263A] dark:bg-[#C24A64] text-white text-sm font-medium rounded-xl hover:bg-[#5C1826] dark:hover:bg-[#A8324F] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
          >
            Tạo bài nháp đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDrafts.map((d) => {
            const isActive = d.id === activeDraftId;
            return (
              <div
                key={d.id}
                className={`bg-[#FAF6EE] dark:bg-[#25201C] rounded-2xl border p-5 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.025] hover:-translate-y-0.5 hover:shadow-xl hover:bg-white dark:hover:bg-[#2C2621] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50 flex flex-col justify-between ${
                  isActive
                    ? 'border-[#7A263A] dark:border-[#C24A64] ring-2 ring-[#7A263A]/20 dark:ring-[#C24A64]/30 shadow-md'
                    : 'border-[#D9C9AE] dark:border-[#3D352D]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono text-[#847768] dark:text-[#A89F91] bg-[#EFE4D0] dark:bg-[#1E1A17] px-2 py-0.5 rounded border border-[#D9C9AE]/40 dark:border-[#3D352D]/60">
                      {d.promptTitle ? 'Theo đề bài' : 'Bài viết tự do'}
                    </span>
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                          Đang mở trong trình soạn
                        </span>
                      )}
                      <span className="text-xs text-[#847768] dark:text-[#A89F91] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#7A263A] dark:text-[#E88E9E]" />
                        {formatVietnameseDateTime(d.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Title or Inline Edit */}
                  {editingId === d.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-sm bg-white dark:bg-[#1E1A17] text-[#29241F] dark:text-[#F5EFEB] border border-[#7A263A] dark:border-[#C24A64] rounded-lg focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRename(d.id)}
                        className="px-2.5 py-1 bg-[#7A263A] dark:bg-[#C24A64] text-white text-xs rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 text-xs text-[#847768] dark:text-[#A89F91] cursor-pointer hover:underline"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        onClick={() => onOpenDraft(d)}
                        className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] hover:text-[#7A263A] dark:hover:text-[#E88E9E] transition-colors cursor-pointer line-clamp-2"
                      >
                        {d.title}
                      </h3>
                      <button
                        onClick={() => handleStartRename(d)}
                        className="p-1 text-[#847768] dark:text-[#A89F91] hover:text-[#7A263A] dark:hover:text-[#E88E9E] cursor-pointer transition-colors"
                        title="Đổi tên bản nháp"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {d.promptTitle && (
                    <p className="text-xs text-[#7A263A] dark:text-[#E88E9E] font-medium mb-2 italic line-clamp-1">
                      Đề: {d.promptTitle}
                    </p>
                  )}

                  <p className="text-xs text-[#554C42] dark:text-[#C5BCB0] line-clamp-3 leading-relaxed mb-4">
                    {d.content || '(Bản nháp chưa có nội dung văn bản)'}
                  </p>
                </div>

                {/* Footer metrics and actions */}
                <div className="pt-3 border-t border-[#D9C9AE]/70 dark:border-[#3D352D] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-[#847768] dark:text-[#A89F91]">
                    <span>
                      <strong className="text-[#29241F] dark:text-[#F5EFEB] font-mono">{d.wordCount}</strong> / {d.targetWordCount || 600} từ
                    </span>
                    <span>•</span>
                    <span>{d.characterCount} ký tự</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteCandidateId(d.id)}
                      className="p-1.5 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      title="Xóa bản nháp này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onOpenDraft(d)}
                      className="px-3 py-1.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <span>Tiếp tục viết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-apple-fade">
          <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-6 rounded-2xl border-2 border-rose-300 dark:border-rose-900/60 shadow-2xl max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif font-bold text-lg text-[#29241F] dark:text-[#F5EFEB]">
                Xóa vĩnh viễn bản nháp?
              </h3>
            </div>
            <p className="text-sm text-[#554C42] dark:text-[#C5BCB0]">
              Bản nháp này sẽ bị xóa khỏi bộ nhớ thiết bị của bạn. Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="px-4 py-2 rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] bg-white dark:bg-[#1E1A17] text-[#29241F] dark:text-[#F5EFEB] text-sm font-medium hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  onDeleteDraft(deleteCandidateId);
                  setDeleteCandidateId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-700 dark:bg-rose-800 text-white text-sm font-medium hover:bg-rose-800 dark:hover:bg-rose-700 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              >
                Xóa bản nháp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
