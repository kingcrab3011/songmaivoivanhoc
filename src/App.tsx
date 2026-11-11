import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  EssayPrompt,
  Draft,
  Outline,
  EvidenceItem,
  SavedItem,
  CommunityPrompt,
  CommunityEssay,
} from './types';
import { INITIAL_PROMPTS } from './data/prompts';
import { getOutlineForPrompt } from './data/outlines';
import { INITIAL_EVIDENCE_ITEMS } from './data/evidence';
import { StorageService } from './services/storage';
import { Navbar, NavTab } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LiteraryBackgroundDecor } from './components/LiteraryBackgroundDecor';
import { KnowledgeHorizonHero } from './components/KnowledgeHorizonHero';
import { PromptBank } from './components/PromptBank';
import { OutlineViewer } from './components/OutlineViewer';
import { EssayEditor } from './components/EssayEditor';
import { DraftsManager } from './components/DraftsManager';
import { SavedItemsView } from './components/SavedItemsView';
import { EvidenceBank } from './components/EvidenceBank';
import { UploadCommunityModal } from './components/UploadCommunityModal';
import { CommunityView } from './components/CommunityView';
import { AiGradingModal } from './components/AiGradingModal';
import { WelcomeModal } from './components/WelcomeModal';
import { ProjectInfoModal } from './components/ProjectInfoModal';
import { PromptDetailModal } from './components/PromptDetailModal';
import { FeedbackSection } from './components/FeedbackSection';
import { ThemeModal } from './components/ThemeModal';
import { ThemeSettings } from './types';
import {
  BookOpen,
  PenLine,
  Sparkles,
  Compass,
  FileText,
  Upload,
  ArrowRight,
  Clock,
  CheckCircle,
  Phone,
  Bookmark,
  Quote,
  Layers,
  Heart,
  HelpCircle,
} from 'lucide-react';
import { formatVietnameseDateTime } from './utils/text';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Welcome & Project Info Modals
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    return !StorageService.isIntroSeenInSession();
  });
  const [showProjectInfoModal, setShowProjectInfoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAiGradingModal, setShowAiGradingModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() =>
    StorageService.getThemeSettings()
  );

  // Sync theme, font size, line height and reduced motion with document
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      themeSettings.themeMode === 'dark' ||
      (themeSettings.themeMode === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.setAttribute('data-font-size', themeSettings.fontSize);
    root.setAttribute('data-line-height', themeSettings.lineHeight);

    if (themeSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [themeSettings]);

  const isDarkMode = useMemo(() => {
    return (
      themeSettings.themeMode === 'dark' ||
      (themeSettings.themeMode === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }, [themeSettings.themeMode]);

  const handleToggleTheme = () => {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    const nextMode = isDarkMode ? 'light' : 'dark';
    const updated: ThemeSettings = { ...themeSettings, themeMode: nextMode };
    setThemeSettings(updated);
    StorageService.saveThemeSettings(updated);

    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 350);
  };

  const handleUpdateThemeSettings = (newSettings: ThemeSettings) => {
    setThemeSettings(newSettings);
    StorageService.saveThemeSettings(newSettings);
  };

  // Mobile Sidebar Drawer State
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data Collections State
  const [prompts, setPrompts] = useState<EssayPrompt[]>(INITIAL_PROMPTS);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(INITIAL_EVIDENCE_ITEMS);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [communityPrompts, setCommunityPrompts] = useState<CommunityPrompt[]>([]);
  const [communityEssays, setCommunityEssays] = useState<CommunityEssay[]>([]);

  // Active items for detailed view or writing
  const [activeDraft, setActiveDraft] = useState<Draft | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<EssayPrompt | null>(null);
  const [activeOutline, setActiveOutline] = useState<Outline | null>(null);
  const [detailPrompt, setDetailPrompt] = useState<EssayPrompt | null>(null);
  const [evidenceTopicFilter, setEvidenceTopicFilter] = useState<string>('Tất cả');

  // Load Initial Storage Data on mount
  useEffect(() => {
    const loadedDrafts = StorageService.getDrafts();
    setDrafts(loadedDrafts);

    const activeDraftId = StorageService.getActiveDraftId();
    const current = loadedDrafts.find((d) => d.id === activeDraftId) || loadedDrafts[0] || null;
    setActiveDraft(current);

    if (current && current.promptId) {
      const p = prompts.find((item) => item.id === current.promptId);
      if (p) {
        setSelectedPrompt(p);
        setActiveOutline(getOutlineForPrompt(p));
      }
    }

    setSavedItems(StorageService.getSavedItems());

    const cPrompts = StorageService.getCommunityPrompts();
    setCommunityPrompts(cPrompts);

    // Merge community prompts into searchable prompts list without duplicates
    const combinedPrompts: EssayPrompt[] = [
      ...INITIAL_PROMPTS,
      ...cPrompts.map((cp) => ({
        id: cp.id,
        title: cp.title,
        content: cp.content,
        topic: cp.topic,
        difficulty: cp.difficulty,
        keywords: cp.keywords,
        sourceType: 'Đề cộng đồng' as const,
        createdAt: cp.createdAt,
        authorName: cp.authorDisplayName,
      })),
    ];
    setPrompts(combinedPrompts);

    setCommunityEssays(StorageService.getCommunityEssays());
  }, []);

  // Quick lookup set for saved items
  const savedItemIds = useMemo(() => {
    return new Set(savedItems.map((i) => i.itemId));
  }, [savedItems]);

  const handleCloseWelcomeModal = () => {
    StorageService.setIntroSeenInSession();
    setShowWelcomeModal(false);
  };

  // Switch tabs & scroll to top smoothly
  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ACTIONS: PROMPTS ---
  const handleViewPromptDetail = (prompt: EssayPrompt) => {
    setDetailPrompt(prompt);
  };

  const handleViewOutline = (prompt: EssayPrompt) => {
    setSelectedPrompt(prompt);
    setActiveOutline(getOutlineForPrompt(prompt));
    handleSelectTab('outline');
  };

  const handleStartWritingWithPrompt = (prompt: EssayPrompt) => {
    setSelectedPrompt(prompt);
    setActiveOutline(getOutlineForPrompt(prompt));

    // Check if user already has an existing draft for this prompt
    const existingDraft = drafts.find((d) => d.promptId === prompt.id);
    if (existingDraft) {
      setActiveDraft(existingDraft);
      StorageService.setActiveDraftId(existingDraft.id);
    } else {
      const newDraft = StorageService.createNewDraft(prompt);
      setDrafts(StorageService.getDrafts());
      setActiveDraft(newDraft);
    }
    handleSelectTab('write');
  };

  // --- ACTIONS: OUTLINES ---
  const handleStartWritingWithOutline = (outline: Outline, prompt?: EssayPrompt) => {
    const targetPrompt = prompt || prompts.find((p) => p.id === outline.promptId);
    if (targetPrompt) {
      handleStartWritingWithPrompt(targetPrompt);
    } else {
      handleSelectTab('write');
    }
  };

  const handleOpenEvidenceForTopic = (topic: string) => {
    setEvidenceTopicFilter(topic);
    handleSelectTab('evidence');
  };

  // --- ACTIONS: DRAFTS ---
  const handleSaveDraft = (updatedDraft: Draft) => {
    const saved = StorageService.saveDraft(updatedDraft);
    setDrafts(StorageService.getDrafts());
    setActiveDraft(saved);
  };

  const handleCreateNewDraft = () => {
    const newDraft = StorageService.createNewDraft();
    setDrafts(StorageService.getDrafts());
    setActiveDraft(newDraft);
    setSelectedPrompt(null);
    setActiveOutline(null);
    handleSelectTab('write');
  };

  const handleOpenDraft = (draft: Draft) => {
    setActiveDraft(draft);
    StorageService.setActiveDraftId(draft.id);
    if (draft.promptId) {
      const p = prompts.find((item) => item.id === draft.promptId);
      if (p) {
        setSelectedPrompt(p);
        setActiveOutline(getOutlineForPrompt(p));
      }
    } else {
      setSelectedPrompt(null);
      setActiveOutline(null);
    }
    handleSelectTab('write');
  };

  const handleDeleteDraft = (id: string) => {
    StorageService.deleteDraft(id);
    const updated = StorageService.getDrafts();
    setDrafts(updated);
    if (activeDraft?.id === id) {
      setActiveDraft(updated[0] || null);
    }
  };

  const handleRenameDraft = (id: string, newTitle: string) => {
    StorageService.renameDraft(id, newTitle);
    setDrafts(StorageService.getDrafts());
    if (activeDraft?.id === id) {
      setActiveDraft({ ...activeDraft, title: newTitle });
    }
  };

  // --- ACTIONS: BOOKMARKS / SAVED ITEMS ---
  const handleToggleSavePrompt = (prompt: EssayPrompt) => {
    StorageService.toggleSaveItem({
      itemId: prompt.id,
      itemType: 'prompt',
      title: prompt.title,
      subtitle: prompt.content,
      tag: prompt.topic,
    });
    setSavedItems(StorageService.getSavedItems());
  };

  const handleToggleSaveOutline = (outline: Outline) => {
    StorageService.toggleSaveItem({
      itemId: outline.id,
      itemType: 'outline',
      title: `Dàn ý: ${outline.promptTitle}`,
      subtitle: outline.introduction.thesis,
      tag: 'Dàn ý chuẩn',
    });
    setSavedItems(StorageService.getSavedItems());
  };

  const handleToggleSaveEvidence = (item: EvidenceItem) => {
    StorageService.toggleSaveItem({
      itemId: item.id,
      itemType: 'evidence',
      title: item.title,
      subtitle: item.summary,
      tag: item.relatedTopics[0] || item.type,
    });
    setSavedItems(StorageService.getSavedItems());
  };

  const handleToggleSaveCommunityEssay = (essay: CommunityEssay) => {
    StorageService.toggleSaveItem({
      itemId: essay.id,
      itemType: 'community_essay',
      title: essay.title,
      subtitle: essay.content.slice(0, 150) + '...',
      tag: essay.topic,
    });
    setSavedItems(StorageService.getSavedItems());
  };

  const handleRemoveSavedItem = (itemId: string) => {
    StorageService.removeSavedItem(itemId);
    setSavedItems(StorageService.getSavedItems());
  };

  const handleOpenSavedItem = (savedItem: SavedItem) => {
    if (savedItem.itemType === 'prompt') {
      const p = prompts.find((item) => item.id === savedItem.itemId);
      if (p) {
        setDetailPrompt(p);
      }
    } else if (savedItem.itemType === 'outline') {
      const p = prompts.find((item) => `ol-${item.id}` === savedItem.itemId || item.outlineId === savedItem.itemId);
      if (p) {
        handleViewOutline(p);
      }
    } else if (savedItem.itemType === 'evidence') {
      handleSelectTab('evidence');
    } else if (savedItem.itemType === 'community_essay') {
      handleSelectTab('community');
    }
  };

  // --- ACTIONS: EVIDENCE ---
  const handleUseEvidenceInWriting = (item: EvidenceItem) => {
    // Append evidence quote snippet into active draft
    if (!activeDraft) {
      const newD = StorageService.createNewDraft();
      newD.content = `[Dẫn chứng tham khảo: ${item.title}]\n${item.summary}\n\n`;
      StorageService.saveDraft(newD);
      setActiveDraft(newD);
    } else {
      const snippet = `\n\n(Dẫn chứng: ${item.title} — ${item.lesson})\n`;
      const updated = {
        ...activeDraft,
        content: (activeDraft.content || '') + snippet,
      };
      StorageService.saveDraft(updated);
      setActiveDraft(updated);
    }
    setDrafts(StorageService.getDrafts());
    handleSelectTab('write');
  };

  // --- ACTIONS: COMMUNITY UPLOAD ---
  const handleUploadCommunityPrompt = (pData: Omit<CommunityPrompt, 'id' | 'createdAt'>) => {
    const created = StorageService.addCommunityPrompt(pData);
    setCommunityPrompts(StorageService.getCommunityPrompts());

    // Also inject into active prompts
    const newPromptItem: EssayPrompt = {
      id: created.id,
      title: created.title,
      content: created.content,
      topic: created.topic,
      difficulty: created.difficulty,
      keywords: created.keywords,
      sourceType: 'Đề cộng đồng',
      createdAt: created.createdAt,
      authorName: created.authorDisplayName,
    };
    setPrompts((prev) => [newPromptItem, ...prev]);
  };

  const handleUploadCommunityEssay = (eData: Omit<CommunityEssay, 'id' | 'createdAt' | 'likes' | 'wordCount'>) => {
    StorageService.addCommunityEssay(eData);
    setCommunityEssays(StorageService.getCommunityEssays());
    handleSelectTab('community');
  };

  const handleLikeCommunityEssay = (id: string) => {
    StorageService.likeCommunityEssay(id);
    setCommunityEssays(StorageService.getCommunityEssays());
  };

  return (
    <div className="min-h-screen bg-[#F6F0E4] text-[#29241F] dark:bg-[#121212] dark:text-[#F5F5F5] flex flex-col font-sans selection:bg-[#7A263A]/20 selection:text-[#7A263A] transition-colors duration-300">
      {/* Left Sidebar (Fixed on desktop, Expandable on hover, Drawer on mobile) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenUpload={() => setShowUploadModal(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleTheme}
        onOpenProjectInfo={() => setShowProjectInfoModal(true)}
        onOpenThemeSettings={() => setShowThemeModal(true)}
        savedCount={savedItems.length}
        draftsCount={drafts.length}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area: Offset by md:pl-[68px] for clean desktop balance without overlap */}
      <div className="flex-1 flex flex-col md:pl-[68px] transition-all duration-300 w-full min-w-0">
        {/* 1. Streamlined Navbar with only 8 Core Navigation Items */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          draftsCount={drafts.length}
          onOpenSidebarMobile={() => setMobileSidebarOpen(true)}
        />

        {/* 2. Main Content Container with smooth Apple entry */}
        <main className="flex-1 w-full animate-apple-fade">
        {/* TAB: TRANG CHỦ */}
        {currentTab === 'home' && (
          <div className="animate-apple-in">
            {/* Knowledge Horizon Hero with Scroll Fade Effect */}
            <KnowledgeHorizonHero
              onNavigate={(tab) => handleSelectTab(tab as NavTab)}
              onStartWriting={() => {
                if (activeDraft) {
                  handleSelectTab('write');
                } else {
                  handleCreateNewDraft();
                }
              }}
            />

            {/* Dashboard Content with Literary & Social Background Decor */}
            <div className="relative overflow-hidden">
              <LiteraryBackgroundDecor />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10">
              {/* Literary Quote Card with verified historical source */}
              <div className="p-6 rounded-2xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] relative overflow-hidden shadow-xs hover:shadow-lg apple-glow-card transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] shrink-0">
                    <Quote className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-serif italic text-base sm:text-lg text-[#29241F] dark:text-[#F5EFEB] leading-relaxed glow-text-title">
                      "Kỳ thực trên mặt đất vốn làm gì có đường, người ta đi mãi thì thành đường thôi."
                    </p>
                    <p className="text-xs text-[#847768] dark:text-[#A89B8E] font-medium pt-1 glow-text-sub">
                      — Nhà văn Lỗ Tấn, tác phẩm <i>Cố hương</i> (1921)
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary Feature Hub Cards (10 Function Cards) */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#29241F] dark:text-[#F5EFEB] glow-text-title">
                      Không Gian Luyện Viết Nghị Luận Xã Hội
                    </h2>
                    <p className="text-xs sm:text-sm text-[#847768] dark:text-[#A89B8E] mt-0.5 glow-text-sub">
                      Bấm vào các khu vực chức năng bên dưới để bắt đầu rèn luyện
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Kho 100 đề */}
                  <div
                    onClick={() => handleSelectTab('prompts')}
                    className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] hover:bg-white dark:hover:bg-[#2C2621] apple-glow-card cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors mb-1 glow-text-title">
                        Kho 100 Đề Chuẩn
                      </h3>
                      <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed glow-text-sub">
                        100 đề thi nghị luận xã hội bao quát 20 nhóm chủ đề tư tưởng đạo lý & hiện tượng đời sống.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs text-[#7A263A] dark:text-[#D2516B] font-semibold">
                      <span>Khám phá ngay</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 2: Viết bài */}
                  <div
                    onClick={() => {
                      if (activeDraft) {
                        handleSelectTab('write');
                      } else {
                        handleCreateNewDraft();
                      }
                    }}
                    className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] hover:bg-white dark:hover:bg-[#2C2621] apple-glow-card cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <PenLine className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors mb-1 glow-text-title">
                        Trình Viết Bài Tự Động Lưu
                      </h3>
                      <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed glow-text-sub">
                        Không gian viết chữ thanh tịnh, đếm từ tiếng Việt chuẩn xác, mục tiêu tiến độ và hỗ trợ AI chấm bài.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs text-[#7A263A] dark:text-[#D2516B] font-semibold">
                      <span>Bắt đầu viết</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 3: Kho dẫn chứng */}
                  <div
                    onClick={() => handleSelectTab('evidence')}
                    className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] hover:bg-white dark:hover:bg-[#2C2621] apple-glow-card cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Compass className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors mb-1 glow-text-title">
                        Kho Dẫn Chứng Thực Tiễn
                      </h3>
                      <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed glow-text-sub">
                        Hệ thống dẫn chứng cá nhân & hiện tượng xã hội (Nuôi Em, Bão Yagi, Sài Gòn Xanh) có hướng dẫn khai thác.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs text-[#7A263A] dark:text-[#D2516B] font-semibold">
                      <span>Tra cứu dẫn chứng</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 4: Dàn ý mẫu */}
                  <div
                    onClick={() => {
                      if (!activeOutline) {
                        setActiveOutline(getOutlineForPrompt(prompts[0]));
                      }
                      handleSelectTab('outline');
                    }}
                    className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] hover:bg-white dark:hover:bg-[#2C2621] apple-glow-card cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors mb-1 glow-text-title">
                        Dàn Ý Mẫu 7 Phần (A - G)
                      </h3>
                      <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed glow-text-sub">
                        Cấu trúc lập luận chuẩn mực: Mở bài, Giải thích, Luận điểm, Dẫn chứng, Phản biện, Bài học, Kết bài.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs text-[#7A263A] dark:text-[#D2516B] font-semibold">
                      <span>Xem dàn ý mẫu</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 5: Bài làm nháp gần đây */}
                  <div
                    onClick={() => handleSelectTab('drafts')}
                    className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] hover:bg-white dark:hover:bg-[#2C2621] apple-glow-card cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors mb-1 glow-text-title">
                        Bài Làm Nháp ({drafts.length})
                      </h3>
                      <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed glow-text-sub">
                        Quản lý các bài viết đang thực hiện, khôi phục bài cũ và lưu giữ nhiều bản nháp cùng lúc.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs text-[#7A263A] dark:text-[#D2516B] font-semibold">
                      <span>Quản lý bản nháp</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 6: Bài đã lưu */}
                  <div
                    onClick={() => handleSelectTab('saved')}
                    className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] hover:bg-white dark:hover:bg-[#2C2621] apple-glow-card cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Bookmark className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors mb-1 glow-text-title">
                        Bài Đã Lưu ({savedItems.length})
                      </h3>
                      <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed glow-text-sub">
                        Tập hợp các đề bài tâm đắc, dàn ý chi tiết và dẫn chứng quan trọng bạn đã đánh dấu.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs text-[#7A263A] dark:text-[#D2516B] font-semibold">
                      <span>Xem mục đã lưu</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 7: Bài viết cộng đồng */}
                  <div
                    onClick={() => handleSelectTab('community')}
                    className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] hover:bg-white dark:hover:bg-[#2C2621] apple-glow-card cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Heart className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors mb-1 glow-text-title">
                        Bài Viết Cộng Đồng
                      </h3>
                      <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed glow-text-sub">
                        Học hỏi văn phong, cách đặt vấn đề sáng tạo và nghe đọc bài văn bằng AI giọng nữ truyền cảm.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs text-[#7A263A] dark:text-[#D2516B] font-semibold">
                      <span>Đọc & Nghe bài</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 8: Tải lên */}
                  <div
                    onClick={() => setShowUploadModal(true)}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF6EE] to-[#EFE4D0] dark:from-[#25201C] dark:to-[#2E2823] border border-[#D9C9AE] dark:border-[#3D352D] apple-glow-card cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#7A263A] dark:bg-[#D2516B] text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors mb-1 glow-text-title">
                        Tải Lên Đề Hoặc Bài Văn
                      </h3>
                      <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed glow-text-sub">
                        Đóng góp đề bài do bạn tự nghĩ ra hoặc chia sẻ bài văn hay để cùng bạn bè học tập.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs text-[#7A263A] dark:text-[#D2516B] font-semibold">
                      <span>Đóng góp ngay</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 9: Góc góp ý & Cảm nhận */}
                  <div
                    onClick={() => handleSelectTab('feedback')}
                    className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] hover:bg-white dark:hover:bg-[#2C2621] apple-glow-card cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Quote className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors mb-1 glow-text-title">
                        Góc Góp Ý & Cảm Nhận
                      </h3>
                      <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed glow-text-sub">
                        Gửi lời đánh giá, nhận xét trải nghiệm học tập và đóng góp xây dựng nền tảng số ngày một hoàn thiện.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs text-[#7A263A] dark:text-[#D2516B] font-semibold">
                      <span>Gửi góp ý</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 10: Chế độ đọc thoải mái */}
                  <div
                    onClick={() => setShowThemeModal(true)}
                    className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] hover:bg-white dark:hover:bg-[#2C2621] apple-glow-card cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] group-hover:text-[#7A263A] dark:group-hover:text-[#D2516B] transition-colors mb-1 glow-text-title">
                        Giao Diện Đọc Thoải Mái
                      </h3>
                      <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed glow-text-sub">
                        Tùy biến chế độ Sáng giấy / Than ấm, chỉnh cỡ chữ, giãn dòng và giảm chuyển động khi đọc bài lâu.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-semibold">
                      <span>Tùy chỉnh ngay</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Draft Quick-Resume Card */}
              {activeDraft && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FAF6EE] to-[#EFE4D0] dark:from-[#25201C] dark:to-[#2E2823] border border-[#7A263A]/30 dark:border-[#C24A64]/40 shadow-xs hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#7A263A] dark:text-[#C24A64] uppercase tracking-wider block">
                      TIẾP TỤC BÀI ĐANG VIẾT DỞ
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#29241F] dark:text-[#F5EFEB]">
                      {activeDraft.title}
                    </h3>
                    <p className="text-xs text-[#847768] dark:text-[#A89B8E]">
                      Đã viết {activeDraft.wordCount} từ • Cập nhật lần cuối: {formatVietnameseDateTime(activeDraft.updatedAt)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectTab('write')}
                    className="px-5 py-2.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#9E354B] text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow hover:shadow-md hover:scale-105 active:scale-95 self-start sm:self-auto flex items-center gap-2 cursor-pointer"
                  >
                    <PenLine className="w-4 h-4" />
                    <span>Tiếp tục viết bài</span>
                  </button>
                </div>
              )}

              {/* Featured 3 Prompts Preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#29241F] dark:text-[#F5EFEB]">
                      Đề Nghị Luận Xã Hội Tiêu Biểu Hôm Nay
                    </h3>
                    <p className="text-xs text-[#847768] dark:text-[#A89B8E]">Chọn nhanh một đề bài để bắt đầu luyện viết ngay</p>
                  </div>
                  <button
                    onClick={() => handleSelectTab('prompts')}
                    className="text-xs sm:text-sm text-[#7A263A] dark:text-[#C24A64] font-semibold hover:underline flex items-center gap-1 cursor-pointer transition-transform hover:translate-x-0.5"
                  >
                    <span>Xem đủ 100 đề</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {prompts.slice(0, 3).map((prompt) => (
                    <div
                      key={prompt.id}
                      className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#25201C] border border-[#D9C9AE] dark:border-[#3D352D] hover:border-[#7A263A]/40 dark:hover:border-[#C24A64]/50 hover:bg-white dark:hover:bg-[#2C2621] hover:scale-[1.025] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40 active:scale-[0.985] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[11px] font-semibold text-[#7A263A] dark:text-[#C24A64] bg-[#EFE4D0] dark:bg-[#1E1A17] px-2 py-0.5 rounded-full mb-2 inline-block">
                          {prompt.topic}
                        </span>
                        <h4
                          onClick={() => handleViewPromptDetail(prompt)}
                          className="font-serif font-bold text-base text-[#29241F] dark:text-[#F5EFEB] hover:text-[#7A263A] dark:hover:text-[#C24A64] transition-colors cursor-pointer mb-2 line-clamp-2"
                        >
                          {prompt.title}
                        </h4>
                        <p className="text-xs text-[#554C42] dark:text-[#D9C9AE] leading-relaxed line-clamp-3 mb-4">
                          {prompt.content}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleViewOutline(prompt)}
                          className="text-xs text-[#7A263A] dark:text-[#C24A64] font-semibold hover:underline cursor-pointer"
                        >
                          Xem dàn ý
                        </button>
                        <button
                          onClick={() => handleStartWritingWithPrompt(prompt)}
                          className="px-3 py-1.5 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#9E354B] text-white rounded-lg text-xs font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          Viết bài
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* TAB: KHO 100 ĐỀ */}
        {currentTab === 'prompts' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PromptBank
              prompts={prompts}
              savedItemIds={savedItemIds}
              onToggleSavePrompt={handleToggleSavePrompt}
              onViewPromptDetail={handleViewPromptDetail}
              onViewOutline={handleViewOutline}
              onStartWriting={handleStartWritingWithPrompt}
            />
          </div>
        )}

        {/* TAB: DÀN Ý MẪU */}
        {currentTab === 'outline' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeOutline ? (
              <OutlineViewer
                outline={activeOutline}
                prompt={selectedPrompt || undefined}
                isSaved={savedItemIds.has(activeOutline.id)}
                onToggleSaveOutline={handleToggleSaveOutline}
                onStartWritingWithOutline={handleStartWritingWithOutline}
                onOpenEvidenceForTopic={handleOpenEvidenceForTopic}
                onBackToPrompts={() => handleSelectTab('prompts')}
              />
            ) : (
              <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-12 text-center rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] max-w-md mx-auto shadow-sm">
                <Sparkles className="w-12 h-12 text-[#7A263A] dark:text-[#C24A64] mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg mb-1 text-[#29241F] dark:text-[#F5EFEB]">Chưa chọn đề bài để xem dàn ý</h3>
                <p className="text-xs text-[#847768] dark:text-[#A89B8E] mb-4">
                  Vui lòng chọn một đề bài từ Kho 100 đề để xem dàn ý 7 phần chi tiết.
                </p>
                <button
                  onClick={() => handleSelectTab('prompts')}
                  className="px-4 py-2 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] text-white text-xs font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Mở Kho 100 đề
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: VIẾT BÀI */}
        {currentTab === 'write' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeDraft ? (
              <EssayEditor
                draft={activeDraft}
                prompt={selectedPrompt || undefined}
                outline={activeOutline || undefined}
                onSaveDraft={handleSaveDraft}
                onOpenAiGrading={(draft) => {
                  setActiveDraft(draft);
                  setShowAiGradingModal(true);
                }}
                onOpenDraftsList={() => handleSelectTab('drafts')}
                onSelectPrompt={() => handleSelectTab('prompts')}
              />
            ) : (
              <div className="bg-[#FAF6EE] dark:bg-[#25201C] p-12 text-center rounded-2xl border border-[#D9C9AE] dark:border-[#3D352D] max-w-md mx-auto shadow-sm">
                <PenLine className="w-12 h-12 text-[#7A263A] dark:text-[#C24A64] mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg mb-1 text-[#29241F] dark:text-[#F5EFEB]">Chưa có bài nháp nào</h3>
                <p className="text-xs text-[#847768] dark:text-[#A89B8E] mb-4">
                  Bạn có thể tạo một bản nháp tự do hoặc chọn một đề bài trong kho 100 đề để bắt đầu viết.
                </p>
                <button
                  onClick={handleCreateNewDraft}
                  className="px-4 py-2 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] text-white text-xs font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Tạo bản nháp mới ngay
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: BÀI LÀM NHÁP */}
        {currentTab === 'drafts' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DraftsManager
              drafts={drafts}
              activeDraftId={activeDraft?.id || null}
              onOpenDraft={handleOpenDraft}
              onCreateNewDraft={handleCreateNewDraft}
              onDeleteDraft={handleDeleteDraft}
              onRenameDraft={handleRenameDraft}
            />
          </div>
        )}

        {/* TAB: BÀI ĐÃ LƯU */}
        {currentTab === 'saved' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SavedItemsView
              savedItems={savedItems}
              onRemoveSavedItem={handleRemoveSavedItem}
              onOpenItem={handleOpenSavedItem}
            />
          </div>
        )}

        {/* TAB: KHO DẪN CHỨNG */}
        {currentTab === 'evidence' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EvidenceBank
              evidenceItems={evidenceItems}
              savedItemIds={savedItemIds}
              onToggleSaveEvidence={handleToggleSaveEvidence}
              onUseEvidenceInWriting={handleUseEvidenceInWriting}
              initialTopicFilter={evidenceTopicFilter}
            />
          </div>
        )}

        {/* TAB: CỘNG ĐỒNG */}
        {currentTab === 'community' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CommunityView
              essays={communityEssays}
              prompts={communityPrompts}
              savedItemIds={savedItemIds}
              onLikeEssay={handleLikeCommunityEssay}
              onToggleSaveEssay={handleToggleSaveCommunityEssay}
              onSelectPrompt={(cp) => {
                const asPrompt: EssayPrompt = {
                  id: cp.id,
                  title: cp.title,
                  content: cp.content,
                  topic: cp.topic,
                  difficulty: cp.difficulty,
                  keywords: cp.keywords,
                  sourceType: 'Đề cộng đồng',
                  createdAt: cp.createdAt,
                };
                handleStartWritingWithPrompt(asPrompt);
              }}
              onOpenUpload={() => setShowUploadModal(true)}
            />
          </div>
        )}

        {/* TAB: GÓC GÓP Ý & CẢM NHẬN */}
        {currentTab === 'feedback' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FeedbackSection onBackToHome={() => handleSelectTab('home')} />
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <footer className="mt-16 bg-[#EFE4D0] dark:bg-[#1E1A17] border-t border-[#D9C9AE] dark:border-[#3D352D] py-8 text-[#554C42] dark:text-[#A89B8E] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#7A263A] dark:bg-[#C24A64] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
                V
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#29241F] dark:text-[#F5EFEB]">
                  Văn Nghị Luận Lab
                </h4>
                <p className="text-[11px] text-[#847768] dark:text-[#A89B8E]">
                  Sản phẩm học tập số môn Ngữ Văn — Lớp 12A2, Trường THPT Yên Lãng
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                onClick={() => handleSelectTab('prompts')}
                className="hover:text-[#7A263A] dark:hover:text-[#C24A64] transition-colors cursor-pointer"
              >
                Kho 100 đề
              </button>
              <button
                onClick={() => handleSelectTab('evidence')}
                className="hover:text-[#7A263A] dark:hover:text-[#C24A64] transition-colors cursor-pointer"
              >
                Kho dẫn chứng
              </button>
              <button
                onClick={() => handleSelectTab('drafts')}
                className="hover:text-[#7A263A] dark:hover:text-[#C24A64] transition-colors cursor-pointer"
              >
                Bài làm nháp
              </button>
              <button
                onClick={() => handleSelectTab('community')}
                className="hover:text-[#7A263A] dark:hover:text-[#B3445C] transition-colors cursor-pointer"
              >
                Cộng đồng
              </button>
              <button
                onClick={() => handleSelectTab('feedback')}
                className="hover:text-[#7A263A] dark:hover:text-[#B3445C] transition-colors cursor-pointer"
              >
                Góc góp ý
              </button>
              <button
                onClick={() => setShowProjectInfoModal(true)}
                className="text-[#7A263A] dark:text-[#B3445C] font-semibold hover:underline cursor-pointer"
              >
                Thông tin dự án & Bản quyền
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#D9C9AE]/60 dark:border-[#4A4036] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#847768] dark:text-[#A89B88]">
            <p>
              Năm học 2026–2027 • GV: Võ Thị Mỹ Ngà • HS: Nguyễn Anh Tuấn, Đỗ Thị Ánh Chinh
            </p>
            <p className="flex items-center gap-1">
              <span>Hỗ trợ kỹ thuật:</span>
              <a href="tel:0975083274" className="font-semibold text-[#7A263A] dark:text-[#B3445C] hover:underline">
                0975083274
              </a>
            </p>
          </div>
        </div>
      </footer>
      </div>

      {/* Global Modals */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleCloseWelcomeModal}
      />

      <ProjectInfoModal
        isOpen={showProjectInfoModal}
        onClose={() => setShowProjectInfoModal(false)}
      />

      <PromptDetailModal
        prompt={detailPrompt}
        isOpen={Boolean(detailPrompt)}
        onClose={() => setDetailPrompt(null)}
        isSaved={detailPrompt ? savedItemIds.has(detailPrompt.id) : false}
        onToggleSave={handleToggleSavePrompt}
        onViewOutline={handleViewOutline}
        onStartWriting={handleStartWritingWithPrompt}
        onOpenEvidence={handleOpenEvidenceForTopic}
      />

      <UploadCommunityModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        prompts={prompts}
        onUploadPrompt={handleUploadCommunityPrompt}
        onUploadEssay={handleUploadCommunityEssay}
        currentDraftContent={activeDraft?.content}
        currentDraftTitle={activeDraft?.title}
        currentDraftPromptId={activeDraft?.promptId}
      />

      {activeDraft && (
        <AiGradingModal
          isOpen={showAiGradingModal}
          onClose={() => setShowAiGradingModal(false)}
          draft={activeDraft}
          prompt={selectedPrompt || undefined}
        />
      )}

      {/* Theme Adjustment Modal */}
      <ThemeModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        settings={themeSettings}
        onUpdateSettings={handleUpdateThemeSettings}
      />
    </div>
  );
}
