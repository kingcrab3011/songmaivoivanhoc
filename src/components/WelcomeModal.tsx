import React from 'react';
import { BookOpen, Award, GraduationCap, School, Phone, Heart, Sparkles, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-apple-fade">
      <div 
        className="relative w-full max-w-2xl bg-[#F6F0E4] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] rounded-2xl shadow-2xl overflow-hidden my-8 transition-all duration-300"
      >
        {/* Decorative corner bookmarks */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
          <div className="absolute transform rotate-45 bg-[#7A263A] dark:bg-[#C24A64] text-white font-semibold py-1 right-[-40px] top-[24px] w-[140px] text-center text-xs tracking-wider shadow">
            2026–2027
          </div>
        </div>

        {/* Header banner */}
        <div className="bg-gradient-to-r from-[#7A263A] via-[#8F2E45] to-[#7A263A] dark:from-[#A8324F] dark:to-[#7A263A] px-6 py-6 text-center text-[#F6F0E4] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-black/20 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm mb-3 border border-white/20">
            <BookOpen className="w-6 h-6 text-[#F6F0E4]" />
          </div>
          
          <p className="text-xs tracking-widest uppercase font-semibold text-amber-200/90 mb-1">
            SẢN PHẨM HỌC TẬP SỐ
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-white">
            MÔN NGỮ VĂN
          </h1>
          <p className="text-xs text-amber-100/80 mt-1 italic font-serif">
            Dành cho học sinh THPT — Chuyên sâu Nghị luận xã hội
          </p>
        </div>

        {/* Content body with literary styling */}
        <div className="p-6 sm:p-8 space-y-6 text-[#29241F] dark:text-[#F5EFEB]">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFE4D0]/70 dark:bg-[#1E1A17]/80 border border-[#D9C9AE]/70 dark:border-[#3D352D]">
              <div className="p-2 rounded-lg bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#847768] dark:text-[#A89F91] font-medium">Năm học</p>
                <p className="font-semibold text-[#29241F] dark:text-[#F5EFEB]">2026–2027</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFE4D0]/70 dark:bg-[#1E1A17]/80 border border-[#D9C9AE]/70 dark:border-[#3D352D]">
              <div className="p-2 rounded-lg bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#847768] dark:text-[#A89F91] font-medium">Giáo viên hướng dẫn</p>
                <p className="font-semibold text-[#29241F] dark:text-[#F5EFEB]">Võ Thị Mỹ Ngà</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFE4D0]/70 dark:bg-[#1E1A17]/80 border border-[#D9C9AE]/70 dark:border-[#3D352D]">
              <div className="p-2 rounded-lg bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#847768] dark:text-[#A89F91] font-medium">Học sinh thực hiện</p>
                <p className="font-semibold text-[#29241F] dark:text-[#F5EFEB]">Nguyễn Anh Tuấn, Đỗ Thị Ánh Chinh</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFE4D0]/70 dark:bg-[#1E1A17]/80 border border-[#D9C9AE]/70 dark:border-[#3D352D]">
              <div className="p-2 rounded-lg bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E]">
                <School className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#847768] dark:text-[#A89F91] font-medium">Lớp / Khóa / Trường</p>
                <p className="font-semibold text-[#29241F] dark:text-[#F5EFEB]">Lớp 12A2 — Khóa: 2024–2027</p>
                <p className="text-xs text-[#7A263A] dark:text-[#E88E9E] font-medium">Trường THPT Yên Lãng</p>
              </div>
            </div>
          </div>

          {/* Exact required statement */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF6EE] dark:bg-[#1E1A17]/60 border border-[#D9C9AE] dark:border-[#3D352D] relative">
            <div className="text-xs sm:text-sm text-[#29241F] dark:text-[#F5EFEB] leading-relaxed font-sans text-justify">
              <p className="mb-2">
                Sản phẩm được tạo ra nhằm mục đích làm quen với dự án học tập số đồng thời hỗ trợ các bạn trong quá trình học tập, không nhằm mục đích kinh doanh.
              </p>
              <p>
                Nội dung được tham khảo từ nhiều nguồn trên mạng Internet kết hợp AI và sự sáng tạo của nhóm, nếu có bất kì vấn đề gì liên quan đến nội dung vui lòng liên hệ: <span className="font-semibold text-[#7A263A] dark:text-[#E88E9E] inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5 inline" /> 0975083274</span>. Xin cảm ơn !
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 flex flex-col items-center">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              <span>Bắt đầu hành trình học tập</span>
            </button>
            <p className="text-xs text-[#847768] dark:text-[#A89F91] mt-3 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#7A263A] dark:text-[#E88E9E]" />
              Không cần đăng nhập • Trải nghiệm đầy đủ trên máy tính và điện thoại
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
