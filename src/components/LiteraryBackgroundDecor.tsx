import React from 'react';

export const LiteraryBackgroundDecor: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-0"
      aria-hidden="true"
    >
      {/* 1. TOP-RIGHT: Open Book with Flowing Pages and Scholarly Arcs */}
      <div className="absolute top-10 -right-8 sm:right-6 lg:right-12 w-64 h-64 lg:w-96 lg:h-96 opacity-[0.045] dark:opacity-[0.055] text-[#7A263A] dark:text-[#E0D8D0] transition-colors duration-300">
        <svg
          viewBox="0 0 300 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
        >
          {/* Subtle concentric academic rings */}
          <circle cx="150" cy="150" r="140" strokeDasharray="4 6" strokeWidth="1" />
          <circle cx="150" cy="150" r="115" strokeWidth="0.75" />

          {/* Open Book spine and pages */}
          <path
            d="M 150 90 L 150 215 M 150 215 C 120 205 75 208 45 220 L 45 95 C 75 83 120 80 150 90 C 180 80 225 83 255 95 L 255 220 C 225 208 180 205 150 215"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Page lines */}
          <path d="M 60 115 C 85 107 115 105 138 110" strokeWidth="1" strokeLinecap="round" />
          <path d="M 60 135 C 85 127 115 125 138 130" strokeWidth="1" strokeLinecap="round" />
          <path d="M 60 155 C 85 147 115 145 138 150" strokeWidth="1" strokeLinecap="round" />
          <path d="M 60 175 C 85 167 115 165 138 170" strokeWidth="1" strokeLinecap="round" />

          <path d="M 162 110 C 185 105 215 107 240 115" strokeWidth="1" strokeLinecap="round" />
          <path d="M 162 130 C 185 125 215 127 240 135" strokeWidth="1" strokeLinecap="round" />
          <path d="M 162 150 C 185 145 215 147 240 155" strokeWidth="1" strokeLinecap="round" />
          <path d="M 162 170 C 185 165 215 167 240 175" strokeWidth="1" strokeLinecap="round" />

          {/* Bookmark Ribbon */}
          <path
            d="M 150 90 Q 155 160 162 235 L 150 225 L 138 235 Q 145 160 150 90"
            fill="currentColor"
            fillOpacity="0.3"
          />
        </svg>
      </div>

      {/* 2. LEFT FLANK: Editorial Literary Quotation Mark & Stylized Laurel Leaf */}
      <div className="absolute top-72 -left-10 sm:left-4 lg:left-8 w-56 h-72 lg:w-72 lg:h-96 opacity-[0.04] dark:opacity-[0.05] text-[#847768] dark:text-[#D2516B] transition-colors duration-300">
        <svg
          viewBox="0 0 240 320"
          fill="none"
          stroke="currentColor"
          className="w-full h-full"
        >
          {/* Classical Double Quotation Marks */}
          <g fill="currentColor" stroke="none">
            {/* Quote 1 */}
            <path d="M 65 95 C 65 70 82 50 108 50 C 114 50 118 52 118 58 C 118 80 95 86 95 98 C 95 105 102 110 110 110 C 120 110 128 118 128 128 C 128 140 116 150 102 150 C 80 150 65 130 65 95 Z" />
            {/* Quote 2 */}
            <path d="M 135 95 C 135 70 152 50 178 50 C 184 50 188 52 188 58 C 188 80 165 86 165 98 C 165 105 172 110 180 110 C 190 110 198 118 198 128 C 198 140 186 150 172 150 C 150 150 135 130 135 95 Z" />
          </g>

          {/* Stylized Laurel / Olive Branch representing Wisdom & Literature */}
          <path
            d="M 50 290 Q 75 220 95 170 Q 115 130 130 105"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Leaves along branch */}
          <path d="M 65 255 C 50 250 45 235 55 230 C 65 225 75 240 65 255 Z" fill="currentColor" />
          <path d="M 75 240 C 90 235 95 220 85 215 C 75 210 65 225 75 240 Z" fill="currentColor" />
          <path d="M 80 205 C 65 200 60 185 70 180 C 80 175 90 190 80 205 Z" fill="currentColor" />
          <path d="M 90 190 C 105 185 110 170 100 165 C 90 160 80 175 90 190 Z" fill="currentColor" />
          <path d="M 95 155 C 80 150 75 135 85 130 C 95 125 105 140 95 155 Z" fill="currentColor" />
          <path d="M 105 140 C 120 135 125 120 115 115 C 105 110 95 125 105 140 Z" fill="currentColor" />
        </svg>
      </div>

      {/* 3. MID-RIGHT: Classic Fountain Pen / Nib with Elegant Calligraphy Flow */}
      <div className="absolute top-[750px] -right-6 sm:right-8 lg:right-16 w-60 h-80 lg:w-80 lg:h-96 opacity-[0.045] dark:opacity-[0.05] text-[#7A263A] dark:text-[#E0D8D0] transition-colors duration-300">
        <svg
          viewBox="0 0 260 320"
          fill="none"
          stroke="currentColor"
          className="w-full h-full"
        >
          {/* Fountain Pen Nib Silhouette & Details */}
          <g transform="rotate(-35 130 140)">
            <path
              d="M 130 35 L 148 115 L 140 185 L 120 185 L 112 115 Z"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Nib heart breath hole */}
            <circle cx="130" cy="115" r="3.5" fill="currentColor" stroke="none" />
            {/* Slit line to tip */}
            <line x1="130" y1="35" x2="130" y2="111.5" strokeWidth="1.2" />
            {/* Decorative engravings */}
            <path d="M 122 135 Q 130 142 138 135" strokeWidth="1" />
            <path d="M 120 150 Q 130 158 140 150" strokeWidth="1" />
          </g>

          {/* Flowing Manuscript Flourish / Calligraphy Curve */}
          <path
            d="M 40 260 C 90 280 140 210 180 250 C 210 280 240 260 255 240"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />
          <path
            d="M 20 280 C 80 310 160 260 210 295"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 4. LOWER REGION: Human Connection & Social Discussion Network (Nghị luận xã hội) */}
      <div className="absolute top-[1300px] left-2 sm:left-12 lg:left-24 w-72 h-72 lg:w-96 lg:h-96 opacity-[0.035] dark:opacity-[0.045] text-[#847768] dark:text-[#D2516B] transition-colors duration-300">
        <svg
          viewBox="0 0 320 320"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="w-full h-full"
        >
          {/* Interconnected Community Nodes (representing empathy, shared dialogue & societal solidarity) */}
          <circle cx="160" cy="160" r="14" strokeWidth="1.5" />
          <circle cx="160" cy="160" r="5" fill="currentColor" />

          <circle cx="80" cy="100" r="10" />
          <circle cx="80" cy="100" r="3" fill="currentColor" />

          <circle cx="240" cy="110" r="12" />
          <circle cx="240" cy="110" r="4" fill="currentColor" />

          <circle cx="90" cy="230" r="11" />
          <circle cx="90" cy="230" r="3.5" fill="currentColor" />

          <circle cx="230" cy="225" r="10" />
          <circle cx="230" cy="225" r="3" fill="currentColor" />

          {/* Social connection lines */}
          <line x1="160" y1="160" x2="80" y2="100" strokeWidth="0.8" strokeDasharray="3 4" />
          <line x1="160" y1="160" x2="240" y2="110" strokeWidth="0.8" strokeDasharray="3 4" />
          <line x1="160" y1="160" x2="90" y2="230" strokeWidth="0.8" strokeDasharray="3 4" />
          <line x1="160" y1="160" x2="230" y2="225" strokeWidth="0.8" strokeDasharray="3 4" />
          <line x1="80" y1="100" x2="240" y2="110" strokeWidth="0.6" strokeDasharray="2 4" />
          <line x1="90" y1="230" x2="230" y2="225" strokeWidth="0.6" strokeDasharray="2 4" />

          {/* Gentle orbiting harmony circles */}
          <circle cx="160" cy="160" r="95" strokeWidth="0.5" />
          <circle cx="160" cy="160" r="130" strokeWidth="0.5" strokeDasharray="5 7" />
        </svg>
      </div>

      {/* 5. BOTTOM RIGHT: Vintage Manuscript Ruled Paper Marks */}
      <div className="absolute bottom-16 right-4 sm:right-10 lg:right-20 w-64 h-48 opacity-[0.03] dark:opacity-[0.04] text-[#7A263A] dark:text-[#E0D8D0] transition-colors duration-300">
        <svg viewBox="0 0 240 160" fill="none" stroke="currentColor" className="w-full h-full">
          <line x1="20" y1="25" x2="220" y2="25" strokeWidth="0.75" />
          <line x1="20" y1="55" x2="220" y2="55" strokeWidth="0.75" />
          <line x1="20" y1="85" x2="220" y2="85" strokeWidth="0.75" />
          <line x1="20" y1="115" x2="220" y2="115" strokeWidth="0.75" />
          <line x1="20" y1="145" x2="220" y2="145" strokeWidth="0.75" />
          {/* Vertical margin rule */}
          <line x1="55" y1="10" x2="55" y2="155" strokeWidth="1" strokeDasharray="4 2" />
        </svg>
      </div>
    </div>
  );
};
