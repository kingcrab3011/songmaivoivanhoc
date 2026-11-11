import React, { useState } from 'react';
import { EssayComment } from '../types';
import { StorageService } from '../services/storage';
import { formatVietnameseDateTime } from '../utils/text';
import {
  MessageCircle,
  Send,
  User,
  Clock,
  Trash2,
  Reply,
  ShieldCheck,
  AlertCircle,
  Heart,
} from 'lucide-react';

interface EssayCommentsProps {
  essayId: string;
}

export const EssayComments: React.FC<EssayCommentsProps> = ({ essayId }) => {
  const [comments, setComments] = useState<EssayComment[]>(() =>
    StorageService.getComments(essayId)
  );
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    StorageService.addComment({
      essayId,
      authorName: authorName.trim() || 'Bạn học ẩn danh',
      content: content.trim(),
      parentId: replyToId || undefined,
      isAuthor: true,
    });

    setComments(StorageService.getComments(essayId));
    setContent('');
    setReplyToId(null);
  };

  const handleDelete = (id: string) => {
    StorageService.deleteComment(id);
    setComments(StorageService.getComments(essayId));
  };

  return (
    <div className="pt-6 border-t border-[#D9C9AE] dark:border-[#3D352D] space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h4 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#7A263A] dark:text-[#E88E9E]" />
          <span>Trao đổi & Bình luận bài viết ({comments.length})</span>
        </h4>
        <span className="text-xs text-[#847768] dark:text-[#A89F91]">
          Góp ý xây dựng vì sự tiến bộ chung
        </span>
      </div>

      {/* Required Civil Guidance Reminder */}
      <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-950 dark:text-amber-200 leading-relaxed italic font-serif">
        “Hãy góp ý chân thành, tôn trọng người viết và tập trung vào nội dung bài văn. Mỗi nhận xét tích cực, cụ thể đều có thể giúp một người tiến bộ hơn.”
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white/70 dark:bg-[#1E1A17]/80 rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] space-y-3 text-xs">
        {replyToId && (
          <div className="flex items-center justify-between text-[#7A263A] dark:text-[#E88E9E] bg-[#EFE4D0]/50 dark:bg-[#2C2621]/60 p-2 rounded-lg">
            <span>Đang trả lời bình luận...</span>
            <button
              type="button"
              onClick={() => setReplyToId(null)}
              className="font-semibold underline cursor-pointer hover:opacity-80"
            >
              Hủy trả lời
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="sm:col-span-1">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Tên của bạn..."
              className="w-full px-3 py-2 bg-white dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-xs text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhận xét về lập luận, dẫn chứng hoặc cách diễn đạt..."
              required
              className="w-full px-3 py-2 bg-white dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] rounded-xl text-xs text-[#29241F] dark:text-[#F5EFEB] placeholder-[#847768]/60 dark:placeholder-[#A89F91]/50 focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 dark:focus:ring-[#C24A64]/30"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi bình luận</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-xs text-[#847768] dark:text-[#A89F91] italic text-center py-2">
            Chưa có bình luận nào. Hãy là người đầu tiên để lại lời khen và góp ý!
          </p>
        ) : (
          comments.map((cm) => (
            <div
              key={cm.id}
              className="p-3.5 rounded-xl bg-white/60 dark:bg-[#1E1A17]/60 border border-[#D9C9AE]/60 dark:border-[#3D352D] space-y-1.5 text-xs transition-all duration-200 hover:bg-white/90 dark:hover:bg-[#25201C]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#EFE4D0] dark:bg-[#2C2621] text-[#7A263A] dark:text-[#E88E9E] flex items-center justify-center font-bold text-[10px]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-[#29241F] dark:text-[#F5EFEB]">
                    {cm.authorName}
                  </span>
                  <span className="text-[10px] text-[#847768] dark:text-[#A89F91] flex items-center gap-0.5">
                    <Clock className="w-3 h-3 text-[#7A263A] dark:text-[#E88E9E]" />
                    {formatVietnameseDateTime(cm.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReplyToId(cm.id)}
                    className="text-[#847768] dark:text-[#A89F91] hover:text-[#7A263A] dark:hover:text-[#E88E9E] flex items-center gap-0.5 cursor-pointer transition-colors"
                    title="Trả lời bình luận này"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Trả lời</span>
                  </button>
                  <button
                    onClick={() => handleDelete(cm.id)}
                    className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 cursor-pointer p-0.5 transition-colors"
                    title="Xóa bình luận"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-[#554C42] dark:text-[#C5BCB0] leading-relaxed pl-8">
                {cm.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
