import React, { useState, useEffect } from 'react';
import { PenLine, BookOpen, Sparkles, Compass, ArrowDown } from 'lucide-react';
import horizonImage from '../assets/images/chan_troi_tri_thuc_1792155363262.jpg';

interface KnowledgeHorizonHeroProps {
  onNavigate: (tab: string) => void;
  onStartWriting: () => void;
}

export const KnowledgeHorizonHero: React.FC<KnowledgeHorizonHeroProps> = ({
  onNavigate,
  onStartWriting,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          // Calculate progress over the first 450px of scroll
          const progress = Math.min(1, Math.max(0, currentScrollY / 450));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute smooth opacity and scale based on scroll progress
  // Opacity decreases from 1 to ~0.25 smoothly
  const imageOpacity = Math.max(0.18, 1 - scrollProgress * 0.82);
  const imageScale = 1 + scrollProgress * 0.05;
  const overlayGradientOpacity = Math.min(0.95, 0.45 + scrollProgress * 0.5);

  return (
    <section className="relative w-full overflow-hidden min-h-[480px] sm:min-h-[560px] flex items-center justify-center border-b border-[#D9C9AE]/60 transition-colors">
      {/* Background Horizon Image Container with scroll-driven transform */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none will-change-transform"
        style={{
          transform: `scale(${imageScale})`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <img
          src={horizonImage}
          alt="Chân trời tri thức nhìn từ bàn học ấm áp với trang sách mở"
          className="w-full h-full object-cover object-center filter saturate-[1.08] contrast-[1.02]"
          style={{
            opacity: imageOpacity,
            transition: 'opacity 0.15s ease-out',
          }}
          loading="eager"
        />
      </div>

      {/* Layered literary gradient to blend seamlessly into #F6F0E4 paper background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#29241F]/30 via-[#F6F0E4]/60 to-[#F6F0E4] dark:from-[#1C1917]/50 dark:via-[#1C1917]/80 dark:to-[#1C1917]"
        style={{ opacity: overlayGradientOpacity }}
      />

      {/* Subtle paper vignette edges */}
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(41,36,31,0.25)] dark:shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] pointer-events-none" />

      {/* Hero content container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center flex flex-col items-center animate-apple-fade">
        {/* Literary Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6EE]/90 dark:bg-[#25201C]/90 backdrop-blur-md border border-[#D9C9AE] dark:border-[#3D352D] text-[#7A263A] dark:text-[#E88E9E] text-xs font-medium mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#7A263A] dark:text-[#E88E9E]" />
          <span>Văn Nghị Luận Lab — Không gian học văn số thế hệ mới</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-[#29241F] dark:text-[#F5EFEB] leading-tight sm:leading-snug mb-4 drop-shadow-sm">
          Mở trang sách — chạm tới chân trời.
        </h1>

        {/* Description */}
        <p className="text-base sm:text-xl text-[#554C42] dark:text-[#C5BCB0] font-serif italic max-w-2xl leading-relaxed mb-8">
          “Không chỉ học cách viết một bài văn, mà còn học cách nhìn sâu hơn vào cuộc sống.”
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('prompts')}
            className="w-full sm:w-auto px-6 py-3 bg-[#7A263A] dark:bg-[#C24A64] hover:bg-[#5C1826] dark:hover:bg-[#A8324F] text-white font-medium rounded-xl shadow-md hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <BookOpen className="w-4 h-4" />
            <span>Kho 100 đề thi THPT</span>
          </button>

          <button
            onClick={onStartWriting}
            className="w-full sm:w-auto px-6 py-3 bg-[#FAF6EE] dark:bg-[#25201C] hover:bg-white dark:hover:bg-[#2C2621] text-[#7A263A] dark:text-[#E88E9E] font-medium rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <PenLine className="w-4 h-4" />
            <span>Viết bài ngay</span>
          </button>

          <button
            onClick={() => onNavigate('evidence')}
            className="w-full sm:w-auto px-5 py-3 bg-[#EFE4D0]/80 dark:bg-[#1E1A17]/80 hover:bg-[#EFE4D0] dark:hover:bg-[#2C2621] text-[#29241F] dark:text-[#F5EFEB] font-medium rounded-xl border border-[#D9C9AE] dark:border-[#3D352D] shadow-xs hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <Compass className="w-4 h-4 text-[#7A263A] dark:text-[#E88E9E]" />
            <span>Kho dẫn chứng</span>
          </button>
        </div>

        {/* Gentle scroll indicator */}
        <div className="mt-10 sm:mt-14 flex flex-col items-center text-[#847768] dark:text-[#A89F91] text-xs animate-bounce opacity-80">
          <span>Cuộn xuống để khám phá</span>
          <ArrowDown className="w-4 h-4 mt-1 text-[#7A263A] dark:text-[#E88E9E]" />
        </div>
      </div>
    </section>
  );
};
