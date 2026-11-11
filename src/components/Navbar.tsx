import React, { useState } from 'react';
import {
  BookOpen,
  PenLine,
  FileText,
  Compass,
  FileEdit,
  Menu,
  X,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'prompts'
  | 'write'
  | 'outline'
  | 'evidence'
  | 'saved'
  | 'drafts'
  | 'community'
  | 'feedback'
  | 'project-info';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  draftsCount: number;
  onOpenSidebarMobile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  draftsCount,
  onOpenSidebarMobile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 8 Main Core Navigation Items (strictly preserved in order)
  const mainNavItems = [
    { id: 'home' as NavTab, label: 'Trang chủ', icon: BookOpen },
    { id: 'prompts' as NavTab, label: 'Kho đề (100)', icon: FileText },
    { id: 'write' as NavTab, label: 'Viết bài', icon: PenLine },
    { id: 'outline' as NavTab, label: 'Dàn ý mẫu', icon: Sparkles },
    { id: 'evidence' as NavTab, label: 'Kho dẫn chứng', icon: Compass },
    { id: 'drafts' as NavTab, label: 'Bài làm nháp', icon: FileEdit, badge: draftsCount },
    { id: 'community' as NavTab, label: 'Cộng đồng', icon: Sparkles },
    { id: 'feedback' as NavTab, label: 'Góc góp ý', icon: MessageSquare },
  ];

  const handleSelectTab = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F6F0E4]/95 dark:bg-[#181818]/95 backdrop-blur-md border-b border-[#D9C9AE] dark:border-[#2E2E2E] transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[68px] gap-2 lg:gap-6">
          {/* Left: Mobile sidebar menu trigger + Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {onOpenSidebarMobile && (
              <button
                onClick={onOpenSidebarMobile}
                className="md:hidden w-9 h-9 inline-flex items-center justify-center text-[#29241F] dark:text-[#F5F5F5] hover:bg-[#EFE4D0] dark:hover:bg-[#252525] rounded-xl cursor-pointer transition-transform active:scale-95"
                title="Mở thanh công cụ bên trái"
                aria-label="Mở thanh công cụ bên trái"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div
              onClick={() => handleSelectTab('home')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#7A263A] to-[#5C1826] dark:from-[#D2516B] dark:to-[#A83248] flex items-center justify-center text-white shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200 shrink-0">
                <BookOpen className="w-5 h-5 text-[#FAF6EE]" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-serif font-bold text-base sm:text-lg xl:text-xl text-[#29241F] dark:text-[#F5F5F5] tracking-tight group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors whitespace-nowrap">
                    Văn Nghị Luận Lab
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] uppercase font-semibold bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] rounded whitespace-nowrap">
                    Lớp 12
                  </span>
                </div>
                <p className="text-[11px] text-[#847768] dark:text-[#B0B0B0] hidden md:block leading-tight mt-0.5 whitespace-nowrap font-normal">
                  Sản phẩm học tập số môn Ngữ Văn THPT
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Nav Items: Exclusively the 8 core navigation items, balanced and evenly distributed */}
          <nav className="hidden lg:flex items-center justify-end flex-1 space-x-1 xl:space-x-1.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative h-9 px-2.5 xl:px-3 rounded-xl text-[13px] xl:text-[13.5px] font-medium transition-all duration-200 inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap select-none apple-glow-btn ${
                    isActive
                      ? 'text-[#7A263A] dark:text-[#D2516B] bg-[#EFE4D0] dark:bg-[#252525] font-semibold shadow-xs'
                      : 'text-[#29241F]/85 dark:text-[#F5F5F5]/85 hover:text-[#7A263A] dark:hover:text-[#D2516B] hover:bg-[#EFE4D0]/60 dark:hover:bg-[#252525]/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="glow-text-title">{item.label}</span>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10.5px] font-semibold leading-none bg-[#7A263A] dark:bg-[#D2516B] text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-2.5 right-2.5 h-0.5 bg-[#7A263A] dark:bg-[#D2516B] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Right: Hamburger Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 inline-flex items-center justify-center text-[#29241F] dark:text-[#F5F5F5] hover:bg-[#EFE4D0] dark:hover:bg-[#252525] rounded-xl cursor-pointer transition-transform active:scale-95"
              aria-label="Mở danh mục điều hướng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu (8 Main Core Navigation Items) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D9C9AE] dark:border-[#2E2E2E] bg-[#F6F0E4] dark:bg-[#181818] px-4 pt-3 pb-6 space-y-1.5 shadow-lg animate-apple-fade">
          <div className="mb-2 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#847768] dark:text-[#888888]">
              Điều hướng chính
            </span>
          </div>

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between h-10 px-3.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                  isActive
                    ? 'bg-[#7A263A] dark:bg-[#D2516B] text-white font-semibold shadow-xs'
                    : 'text-[#29241F] dark:text-[#F5F5F5] hover:bg-[#EFE4D0] dark:hover:bg-[#242424]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {Boolean(item.badge && item.badge > 0) && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[11px] font-semibold leading-none rounded-full ${
                      isActive ? 'bg-white text-[#7A263A] dark:text-[#D2516B]' : 'bg-[#7A263A] dark:bg-[#D2516B] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
