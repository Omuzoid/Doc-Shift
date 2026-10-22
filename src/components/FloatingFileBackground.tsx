import React from 'react';

interface FloatingItem {
  id: number;
  format: string;
  color: string;
  size: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
  animClass: string;
}

const FLOATING_FILES: FloatingItem[] = [
  // Top / Hero Area
  { id: 1, format: 'PNG', color: '#52C7E8', size: 28, left: '4%', top: '8%', duration: 8, delay: 0, animClass: 'animate-drift-up' },
  { id: 2, format: 'PDF', color: '#FF6B6B', size: 26, left: '93%', top: '14%', duration: 9, delay: 1.5, animClass: 'animate-drift-diag-left' },
  { id: 3, format: 'SVG', color: '#FF9F45', size: 24, left: '48%', top: '4%', duration: 10, delay: 3, animClass: 'animate-drift-diag-right' },
  
  // Mid / Converter & Categories Area
  { id: 4, format: 'MP3', color: '#FFE66D', size: 26, left: '2%', top: '28%', duration: 11, delay: 2, animClass: 'animate-drift-diag-right' },
  { id: 5, format: 'CSV', color: '#43D1BE', size: 28, left: '94%', top: '34%', duration: 8.5, delay: 4, animClass: 'animate-drift-up' },
  { id: 6, format: 'JSON', color: '#B79BFA', size: 26, left: '5%', top: '46%', duration: 10, delay: 1, animClass: 'animate-drift-diag-left' },
  { id: 7, format: 'WEBP', color: '#FFE66D', size: 24, left: '92%', top: '52%', duration: 9.5, delay: 3.5, animClass: 'animate-drift-up' },
  
  // Lower / Formats & Banner Area
  { id: 8, format: 'MP4', color: '#EC4899', size: 28, left: '3%', top: '68%', duration: 10.5, delay: 0.5, animClass: 'animate-drift-diag-right' },
  { id: 9, format: 'TXT', color: '#52C7E8', size: 24, left: '95%', top: '74%', duration: 9, delay: 2.5, animClass: 'animate-drift-diag-left' },
  { id: 10, format: 'XML', color: '#FF9F45', size: 26, left: '6%', top: '86%', duration: 11, delay: 4.5, animClass: 'animate-drift-up' },
  { id: 11, format: 'YAML', color: '#B79BFA', size: 24, left: '91%', top: '90%', duration: 8, delay: 1, animClass: 'animate-drift-diag-right' },
  { id: 12, format: 'WAV', color: '#38BDF8', size: 25, left: '50%', top: '94%', duration: 9.5, delay: 3, animClass: 'animate-drift-up' },
];

export const FloatingFileBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {FLOATING_FILES.map((item) => (
        <div
          key={item.id}
          className={`absolute will-change-transform opacity-60 sm:opacity-75 ${item.animClass}`}
          style={{
            left: item.left,
            top: item.top,
            animationDuration: `${item.duration}s`,
            animationDelay: `-${item.delay}s`,
          }}
        >
          <div
            className="flex flex-col justify-between items-center rounded-md brutal-border brutal-shadow-sm transition-transform hover:scale-125"
            style={{
              backgroundColor: item.color,
              width: `${item.size}px`,
              height: `${item.size * 1.25}px`,
            }}
          >
            {/* Folded Top-Right Corner */}
            <div className="w-full flex justify-end">
              <div
                className="w-2 h-2 border-l border-b border-black rounded-bl-[2px]"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
              />
            </div>

            {/* Bold Format Tag */}
            <span
              className="font-heading font-black text-black leading-none text-center pb-1"
              style={{ fontSize: `${Math.max(7, item.size * 0.32)}px` }}
            >
              {item.format}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
