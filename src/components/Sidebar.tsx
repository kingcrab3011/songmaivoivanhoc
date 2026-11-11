import React, { useState } from 'react';
import {
  Upload,
  Sun,
  Moon,
  Info,
  BookOpen,
  FileText,
  PenLine,
  Compass,
  Bookmark,
  FileEdit,
  Eye,
  ChevronRight,
  X,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenUpload: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProjectInfo: () => void;
  onOpenThemeSettings?: () => void;
  savedCount: number;
  draftsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenUpload,
  isDarkMode,
  onToggleDarkMode,
  onOpenProjectInfo,
  onOpenThemeSettings,
  savedCount,
  draftsCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Core utility and secondary tools (moved from top navbar to eliminate duplication):
  // 1. Tải lên (Upload)
  // 2. Bài đã lưu (Saved items bookmark)
  // 3. Chuyển đổi sáng/tối (Dark/Light Mode)
  // 4. Giao diện đọc (Eye icon - Cỡ chữ & giãn dòng)
  // 5. Thông tin giới thiệu (Project info)
  // 6. Âm nhạc học tập (Music Player)
  const utilityItems = [
    {
      id: 'upload',
      label: 'Tải lên đề/bài',
      icon: Upload,
      action: onOpenUpload,
      tooltip: 'Tải lên đề văn hoặc bài viết chia sẻ cộng đồng',
      badge: null,
      color: 'text-amber-600 dark:text-amber-400',
      active: false,
    },
    {
      id: 'saved',
      label: 'Bài đã lưu',
      icon: Bookmark,
      action: () => onSelectTab('saved'),
      tooltip: 'Xem danh sách bài văn, đề và dẫn chứng đã lưu',
      badge: savedCount > 0 ? savedCount : null,
      color: 'text-emerald-600 dark:text-emerald-400',
      active: currentTab === 'saved',
    },
    {
      id: 'theme',
      label: isDarkMode ? 'Chế độ Sáng' : 'Chế độ Tối',
      icon: isDarkMode ? Sun : Moon,
      action: onToggleDarkMode,
      tooltip: isDarkMode ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối',
      badge: null,
      color: isDarkMode ? 'text-amber-400' : 'text-[#7A263A] dark:text-[#D2516B]',
      active: false,
    },
    {
      id: 'display',
      label: 'Giao diện đọc',
      icon: Eye,
      action: onOpenThemeSettings || (() => {}),
      tooltip: 'Tùy chỉnh cỡ chữ, độ giãn dòng và giảm chuyển động',
      badge: null,
      color: 'text-indigo-600 dark:text-indigo-400',
      active: false,
    },
    {
      id: 'info',
      label: 'Thông tin giới thiệu',
      icon: Info,
      action: onOpenProjectInfo,
      tooltip: 'Xem thông tin dự án, nhóm tác giả & nhà trường',
      badge: null,
      color: 'text-blue-600 dark:text-blue-400',
      active: false,
    },
  ];

  // Quick navigation items for easy single-click jumps
  const navShortcuts = [
    { id: 'home' as NavTab, label: 'Trang chủ', icon: BookOpen },
    { id: 'prompts' as NavTab, label: 'Kho 100 đề', icon: FileText },
    { id: 'write' as NavTab, label: 'Viết bài', icon: PenLine },
    { id: 'evidence' as NavTab, label: 'Kho dẫn chứng', icon: Compass },
    { id: 'drafts' as NavTab, label: 'Bài nháp', icon: FileEdit, badge: draftsCount },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const handleUtilClick = (action: () => void) => {
    action();
    onCloseMobile();
  };

  return (
    <>
      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR: Fixed left, Collapsed 68px, Expands 245px */}
      {/* ========================================================= */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-[#FAF6EE]/95 dark:bg-[#181818]/95 backdrop-blur-xl border-r border-[#D9C9AE]/70 dark:border-[#2E2E2E] shadow-lg transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] select-none ${
          isHovered ? 'w-[245px] shadow-2xl' : 'w-[68px]'
        }`}
        aria-label="Thanh điều hướng bên trái"
      >
        {/* Top Logo / App Symbol */}
        <div className="h-16 flex items-center px-4 border-b border-[#D9C9AE]/40 dark:border-[#2E2E2E] shrink-0 overflow-hidden">
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group w-full"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7A263A] to-[#5C1826] dark:from-[#D2516B] dark:to-[#A83248] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
              <BookOpen className="w-5 h-5 text-[#FAF6EE]" />
            </div>
            {isHovered && (
              <div className="flex flex-col min-w-0 animate-apple-fade">
                <span className="font-serif font-bold text-sm text-[#29241F] dark:text-[#F5F5F5] truncate leading-tight">
                  Văn Nghị Luận Lab
                </span>
                <span className="text-[10px] text-[#847768] dark:text-[#B0B0B0] truncate">
                  Tiện ích & Công cụ
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-4">
          {/* Section 1: Utility & Tool Items (Moved cleanly from top navbar) */}
          <div className="space-y-1">
            {isHovered && (
              <div className="px-3 pb-1 text-[10.5px] uppercase font-bold tracking-wider text-[#847768] dark:text-[#888888] animate-apple-fade">
                Tiện ích & Công cụ
              </div>
            )}

            {utilityItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleUtilClick(item.action)}
                  className={`relative w-full h-10 rounded-xl flex items-center transition-all duration-200 group cursor-pointer apple-glow-btn ${
                    isHovered ? 'px-3 justify-start gap-3' : 'justify-center px-0'
                  } ${
                    item.active
                      ? 'bg-[#7A263A] dark:bg-[#D2516B] text-white font-semibold shadow-md shadow-[#7A263A]/25 dark:shadow-[#D2516B]/30'
                      : 'text-[#29241F] dark:text-[#F5F5F5] hover:bg-[#EFE4D0]/80 dark:hover:bg-[#252525] dark:hover:border-[#3D3D3D] hover:shadow-xs'
                  }`}
                  title={item.tooltip}
                  aria-label={item.label}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                      item.active
                        ? 'bg-white/20 text-white'
                        : 'bg-white/60 dark:bg-[#222222] border border-[#D9C9AE]/40 dark:border-[#333333]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        item.active
                          ? 'text-white'
                          : item.color || ''
                      } ${
                        item.id === 'theme'
                          ? isDarkMode
                            ? 'animate-sun group-hover:rotate-45 transition-transform duration-300'
                            : 'animate-moon group-hover:-rotate-12 transition-transform duration-300'
                          : ''
                      }`}
                    />
                  </div>

                  {isHovered && (
                    <div className="flex-1 flex items-center justify-between min-w-0 animate-apple-fade">
                      <span className={`text-xs font-medium truncate ${item.active ? 'text-white' : 'text-[#29241F] dark:text-[#F5F5F5]'}`}>
                        {item.label}
                      </span>
                      {item.badge !== null && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            item.active
                              ? 'bg-white text-[#7A263A] dark:text-[#D2516B]'
                              : 'bg-[#7A263A] dark:bg-[#D2516B] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Indicator badge/dot when collapsed */}
                  {!isHovered && item.id === 'saved' && savedCount > 0 && (
                    <span className="absolute top-1 right-2 inline-flex items-center justify-center min-w-[15px] h-[15px] px-0.5 text-[9px] font-bold bg-[#7A263A] dark:bg-[#D2516B] text-white rounded-full">
                      {savedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-[#D9C9AE]/50 dark:border-[#2E2E2E] mx-1" />

          {/* Section 2: Quick Jump to Core Pages */}
          <div className="space-y-1">
            {isHovered && (
              <div className="px-3 pb-1 text-[10.5px] uppercase font-bold tracking-wider text-[#847768] dark:text-[#888888] animate-apple-fade">
                Lối tắt điều hướng
              </div>
            )}

            {navShortcuts.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative w-full h-9 rounded-xl flex items-center transition-all duration-200 group cursor-pointer apple-glow-btn ${
                    isHovered ? 'px-3 justify-start gap-3' : 'justify-center px-0'
                  } ${
                    isActive
                      ? 'bg-[#7A263A] dark:bg-[#D2516B] text-white font-semibold shadow-sm'
                      : 'text-[#29241F]/80 dark:text-[#F5F5F5]/80 hover:bg-[#EFE4D0]/60 dark:hover:bg-[#252525] hover:text-[#7A263A] dark:hover:text-[#D2516B]'
                  }`}
                  title={item.label}
                  aria-label={item.label}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : ''
                    }`}
                  />

                  {isHovered && (
                    <div className="flex-1 flex items-center justify-between min-w-0 animate-apple-fade">
                      <span className="text-xs truncate">{item.label}</span>
                      {Boolean(item.badge && item.badge > 0) && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white text-[#7A263A] dark:text-[#D2516B]'
                              : 'bg-[#7A263A] dark:bg-[#D2516B] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active bar for collapsed state */}
                  {!isHovered && isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#7A263A] dark:bg-[#D2516B] rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Status / Collapse Hint */}
        <div className="p-3 border-t border-[#D9C9AE]/40 dark:border-[#2E2E2E] shrink-0">
          <div className="flex items-center justify-center text-[#847768] dark:text-[#888888] text-[11px]">
            {isHovered ? (
              <span className="truncate">Tự động thu gọn khi rời chuột</span>
            ) : (
              <ChevronRight className="w-4 h-4 text-[#847768] dark:text-[#888888]" />
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE DRAWER: Slide-in navigation for small screens      */}
      {/* ========================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-apple-fade">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="fixed left-0 top-0 bottom-0 w-[285px] bg-[#FAF6EE] dark:bg-[#181818] border-r border-[#D9C9AE] dark:border-[#2E2E2E] shadow-2xl flex flex-col p-4 animate-apple-in text-[#29241F] dark:text-[#F5F5F5]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D9C9AE]/50 dark:border-[#2E2E2E]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#7A263A] dark:bg-[#D2516B] text-white flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#29241F] dark:text-[#F5F5F5]">
                    Văn Nghị Luận Lab
                  </h3>
                  <p className="text-[10.5px] text-[#847768] dark:text-[#B0B0B0]">
                    Công cụ & Tiện ích
                  </p>
                </div>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg hover:bg-[#EFE4D0] dark:hover:bg-[#252525] cursor-pointer"
              >
                <X className="w-5 h-5 text-[#847768]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4">
              <div>
                <p className="text-[11px] uppercase font-bold text-[#847768] dark:text-[#888888] mb-2 px-1">
                  Công cụ & Tiện ích
                </p>
                <div className="space-y-1">
                  {utilityItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleUtilClick(item.action)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium cursor-pointer transition-all ${
                          item.active
                            ? 'bg-[#7A263A] dark:bg-[#D2516B] text-white'
                            : 'hover:bg-[#EFE4D0] dark:hover:bg-[#252525] text-[#29241F] dark:text-[#F5F5F5]'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          item.active
                            ? 'bg-white/20 text-white'
                            : 'bg-white dark:bg-[#242424] border border-[#D9C9AE]/50 dark:border-[#333333]'
                        }`}>
                          <Icon className={`w-4 h-4 ${item.active ? 'text-white' : item.color || ''}`} />
                        </div>
                        <span className="flex-1">{item.label}</span>
                        {item.badge !== null && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            item.active ? 'bg-white text-[#7A263A] dark:text-[#D2516B]' : 'bg-[#7A263A] dark:bg-[#D2516B] text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#D9C9AE]/40 dark:border-[#2E2E2E]" />

              <div>
                <p className="text-[11px] uppercase font-bold text-[#847768] dark:text-[#888888] mb-2 px-1">
                  Điều hướng trang chính
                </p>
                <div className="space-y-1">
                  {navShortcuts.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-medium cursor-pointer ${
                          isActive
                            ? 'bg-[#7A263A] dark:bg-[#D2516B] text-white'
                            : 'hover:bg-[#EFE4D0] dark:hover:bg-[#252525] text-[#29241F] dark:text-[#F5F5F5]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="flex-1">{item.label}</span>
                        {Boolean(item.badge && item.badge > 0) && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/20">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="pt-3 border-t border-[#D9C9AE]/40 dark:border-[#2E2E2E] text-center text-[11px] text-[#847768] dark:text-[#888888]">
              Trường THPT Yên Lãng — Môn Ngữ Văn
            </div>
          </div>
        </div>
      )}
    </>
  );
};
