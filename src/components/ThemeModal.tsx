import React from 'react';
import { ThemeSettings } from '../types';
import {
  Sun,
  Moon,
  Laptop,
  X,
  Eye,
  Sliders,
  Type,
  AlignLeft,
  Check,
} from 'lucide-react';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ThemeSettings;
  onUpdateSettings: (newSettings: ThemeSettings) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleThemeMode = (mode: ThemeSettings['themeMode']) => {
    onUpdateSettings({ ...settings, themeMode: mode });
  };

  const handleFontSize = (size: ThemeSettings['fontSize']) => {
    onUpdateSettings({ ...settings, fontSize: size });
  };

  const handleLineHeight = (lh: ThemeSettings['lineHeight']) => {
    onUpdateSettings({ ...settings, lineHeight: lh });
  };

  const handleToggleReducedMotion = () => {
    onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-apple-fade">
      <div className="bg-[#FAF6EE] dark:bg-[#25201C] max-w-md w-full rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-2xl p-6 space-y-5 relative transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#847768] dark:text-[#A89F91] hover:text-[#7A263A] dark:hover:text-[#E88E9E] p-1.5 rounded-lg hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#7A263A]/10 dark:bg-[#C24A64]/20 text-[#7A263A] dark:text-[#E88E9E]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#29241F] dark:text-[#F5EFEB]">
              Điều Chỉnh Giao Diện Đọc Thoải Mái
            </h3>
            <p className="text-xs text-[#847768] dark:text-[#A89F91]">
              Tùy biến ánh sáng và kiểu chữ phù hợp với đôi mắt của bạn
            </p>
          </div>
        </div>

        {/* 1. Theme Modes: Sáng / Tối / Theo thiết bị */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider">
            1. Chế độ ánh sáng
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Sáng */}
            <button
              onClick={() => handleThemeMode('light')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                settings.themeMode === 'light'
                  ? 'bg-white border-[#7A263A] shadow-md ring-2 ring-[#7A263A]/20'
                  : 'bg-[#FAF6EE] dark:bg-[#1E1A17] border-[#D9C9AE] dark:border-[#3D352D] text-[#847768] dark:text-[#A89F91]'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-semibold text-[#29241F] dark:text-[#F5EFEB]">Sáng giấy</span>
            </button>

            {/* Tối */}
            <button
              onClick={() => handleThemeMode('dark')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                settings.themeMode === 'dark'
                  ? 'bg-[#161412] border-[#C24A64] text-white shadow-md ring-2 ring-[#C24A64]/40'
                  : 'bg-[#FAF6EE] dark:bg-[#1E1A17] border-[#D9C9AE] dark:border-[#3D352D] text-[#847768] dark:text-[#A89F91]'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-semibold text-[#29241F] dark:text-[#F5EFEB]">Than ấm</span>
            </button>

            {/* Hệ thống */}
            <button
              onClick={() => handleThemeMode('system')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                settings.themeMode === 'system'
                  ? 'bg-[#EFE4D0] dark:bg-[#25201C] border-[#7A263A] dark:border-[#C24A64] shadow-md ring-2 ring-[#7A263A]/20 dark:ring-[#C24A64]/30'
                  : 'bg-[#FAF6EE] dark:bg-[#1E1A17] border-[#D9C9AE] dark:border-[#3D352D] text-[#847768] dark:text-[#A89F91]'
              }`}
            >
              <Laptop className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-[#29241F] dark:text-[#F5EFEB]">Tự động</span>
            </button>
          </div>
        </div>

        {/* 2. Font Size: Nhỏ / Vừa / Lớn */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider">
            2. Cỡ chữ bài đọc
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['normal', 'medium', 'large'] as const).map((sz) => {
              const labels = { normal: 'Nhỏ (14px)', medium: 'Vừa (16px)', large: 'Lớn (18px)' };
              const isSelected = settings.fontSize === sz;
              return (
                <button
                  key={sz}
                  onClick={() => handleFontSize(sz)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isSelected
                      ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white border-transparent shadow-xs'
                      : 'bg-white dark:bg-[#1E1A17] border-[#D9C9AE] dark:border-[#3D352D] text-[#29241F] dark:text-[#F5EFEB]'
                  }`}
                >
                  {labels[sz]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Line Spacing: Bình thường / Thoáng */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#7A263A] dark:text-[#E88E9E] uppercase tracking-wider">
            3. Giãn dòng bài viết
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['normal', 'relaxed'] as const).map((lh) => {
              const labels = { normal: 'Bình thường', relaxed: 'Thoáng đãng (1.8x)' };
              const isSelected = settings.lineHeight === lh;
              return (
                <button
                  key={lh}
                  onClick={() => handleLineHeight(lh)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isSelected
                      ? 'bg-[#7A263A] dark:bg-[#C24A64] text-white border-transparent shadow-xs'
                      : 'bg-white dark:bg-[#1E1A17] border-[#D9C9AE] dark:border-[#3D352D] text-[#29241F] dark:text-[#F5EFEB]'
                  }`}
                >
                  {labels[lh]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Reduced Motion Toggle */}
        <div className="p-3 bg-white/70 dark:bg-[#1E1A17]/80 rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#29241F] dark:text-[#F5EFEB] block">
              Giảm hiệu ứng chuyển động
            </span>
            <span className="text-[11px] text-[#847768] dark:text-[#A89F91]">
              Tối ưu cho máy cấu hình thấp hoặc giảm mỏi mắt
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={handleToggleReducedMotion}
            className="w-4 h-4 accent-[#7A263A] dark:accent-[#C24A64] cursor-pointer"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white font-medium rounded-xl text-xs sm:text-sm cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs"
          >
            Áp dụng & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
