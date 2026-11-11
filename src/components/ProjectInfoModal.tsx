import React from 'react';
import { BookOpen, Award, GraduationCap, School, Phone, Heart, Sparkles, X, ShieldCheck } from 'lucide-react';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-apple-fade">
      <div className="relative w-full max-w-2xl bg-[#F6F0E4] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] rounded-2xl shadow-2xl overflow-hidden my-8 transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A263A] via-[#8F2E45] to-[#7A263A] dark:from-[#A8324F] dark:to-[#7A263A] px-6 py-5 text-center text-[#F6F0E4] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-black/20 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm mb-2 border border-white/20">
            <BookOpen className="w-5 h-5 text-[#F6F0E4]" />
          </div>
          
          <p className="text-[11px] tracking-widest uppercase font-semibold text-amber-200/90 mb-1">
            SẢN PHẨM HỌC TẬP SỐ
          </p>
          <h2 className="text-2xl font-serif font-bold text-white">
            MÔN NGỮ VĂN
          </h2>
          <p className="text-xs text-amber-100/80 italic font-serif">
            Dự án học tập phi thương mại hỗ trợ học sinh THPT
          </p>
        </div>

        {/* Info Grid */}
        <div className="p-6 sm:p-8 space-y-6 text-[#29241F] dark:text-[#F5EFEB]">
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

          {/* Exact Required Disclaimer */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF6EE] dark:bg-[#1E1A17]/60 border border-[#D9C9AE] dark:border-[#3D352D]">
            <h4 className="font-serif font-bold text-sm text-[#7A263A] dark:text-[#E88E9E] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Tuyên bố mục đích và nguồn gốc sản phẩm</span>
            </h4>
            <div className="text-xs sm:text-sm text-[#29241F] dark:text-[#F5EFEB] leading-relaxed text-justify space-y-2">
              <p>
                Sản phẩm được tạo ra nhằm mục đích làm quen với dự án học tập số đồng thời hỗ trợ các bạn trong quá trình học tập, không nhằm mục đích kinh doanh.
              </p>
              <p>
                Nội dung được tham khảo từ nhiều nguồn trên mạng Internet kết hợp AI và sự sáng tạo của nhóm, nếu có bất kì vấn đề gì liên quan đến nội dung vui lòng liên hệ: <span className="font-semibold text-[#7A263A] dark:text-[#E88E9E] inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5 inline" /> 0975083274</span>. Xin cảm ơn !
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-sm shadow-xs"
            >
              Đóng thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
