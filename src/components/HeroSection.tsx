import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, RefreshCw, Sparkles, Compass } from 'lucide-react';
import { FileCard } from './FileCard';

interface HeroSectionProps {
  onStartConvertingClick: () => void;
  onExploreFormatsClick: () => void;
}

// 16 full format cards as specified
const CARDS_DATA = [
  { id: 'png', format: 'PNG' },
  { id: 'jpg', format: 'JPG' },
  { id: 'webp', format: 'WEBP' },
  { id: 'svg', format: 'SVG' },
  { id: 'mp4', format: 'MP4' },
  { id: 'webm', format: 'WEBM' },
  { id: 'mp3', format: 'MP3' },
  { id: 'wav', format: 'WAV' },
  { id: 'pdf', format: 'PDF' },
  { id: 'docx', format: 'DOCX' },
  { id: 'xlsx', format: 'XLSX' },
  { id: 'csv', format: 'CSV' },
  { id: 'json', format: 'JSON' },
  { id: 'xml', format: 'XML' },
  { id: 'html', format: 'HTML' },
  { id: 'txt', format: 'TXT' },
];

function smoothStep(x: number): number {
  const clamped = Math.max(0, Math.min(1, x));
  return clamped * clamped * (3 - 2 * clamped);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartConvertingClick,
  onExploreFormatsClick,
}) => {
  const [currentPhaseLabel, setCurrentPhaseLabel] = useState<'parade' | 'orbit'>('parade');
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const lastPhaseRef = useRef<'parade' | 'orbit'>('parade');

  // Main 60 FPS Continuous Motion Engine
  useEffect(() => {
    const PARADE_DURATION = 3500;
    const TRANSITION_A_TO_B = 1000;
    const ORBIT_DURATION = 3500;
    const TRANSITION_B_TO_A = 1000;
    const CYCLE_DURATION = PARADE_DURATION + TRANSITION_A_TO_B + ORBIT_DURATION + TRANSITION_B_TO_A; // 9000ms

    const totalCards = CARDS_DATA.length;

    const updateAnimation = (now: number) => {
      const elapsed = (now - startTimeRef.current) % CYCLE_DURATION;

      let t = 0;
      let phaseName: 'parade' | 'orbit' = 'parade';

      if (elapsed < PARADE_DURATION) {
        // Phase A: Pure Horizontal Parade
        t = 0;
        phaseName = 'parade';
      } else if (elapsed < PARADE_DURATION + TRANSITION_A_TO_B) {
        // Transition A -> B (Parade -> Orbit)
        const progress = (elapsed - PARADE_DURATION) / TRANSITION_A_TO_B;
        t = smoothStep(progress);
        phaseName = progress > 0.5 ? 'orbit' : 'parade';
      } else if (elapsed < PARADE_DURATION + TRANSITION_A_TO_B + ORBIT_DURATION) {
        // Phase B: Pure Anticlockwise Orbit
        t = 1;
        phaseName = 'orbit';
      } else {
        // Transition B -> A (Orbit -> Parade)
        const progress = (elapsed - (PARADE_DURATION + TRANSITION_A_TO_B + ORBIT_DURATION)) / TRANSITION_B_TO_A;
        t = 1 - smoothStep(progress);
        phaseName = progress > 0.5 ? 'parade' : 'orbit';
      }

      // Update badge only when phase strictly changes to avoid unnecessary React re-renders
      if (lastPhaseRef.current !== phaseName) {
        lastPhaseRef.current = phaseName;
        setCurrentPhaseLabel(phaseName);
      }

      const isMobile = window.innerWidth < 640;
      const orbitRadiusX = isMobile ? 125 : 185;
      const orbitRadiusY = isMobile ? 105 : 150;

      const paradeSpeed = 0.075;
      const paradeOffset = now * paradeSpeed;
      const trackWidth = isMobile ? 500 : 750;

      for (let i = 0; i < totalCards; i++) {
        const el = cardElementsRef.current[i];
        if (!el) continue;

        // 1. Orbital position: Anticlockwise circular motion (negative angle over time)
        const baseAngle = (i / totalCards) * 2 * Math.PI;
        const orbitAngle = baseAngle - now * 0.0009; // Negative = Anticlockwise
        const orbitX = Math.cos(orbitAngle) * orbitRadiusX;
        const orbitY = Math.sin(orbitAngle) * orbitRadiusY;
        const orbitRot = ((orbitAngle * 180) / Math.PI + 90) * 0.12 + Math.sin(now * 0.002 + i) * 6;
        const orbitScale = 0.88 + 0.18 * ((Math.sin(orbitAngle) + 1) / 2);

        // 2. Parade position: Continuous left-to-right flowing wave tracks
        const row = i % 2 === 0 ? -1 : 1;
        const rowIndex = Math.floor(i / 2); // 8 cards per row (0..7)
        const cardsPerRow = totalCards / 2;
        const cardSpacing = trackWidth / cardsPerRow;
        const stagger = i % 2 === 0 ? 0 : cardSpacing / 2;
        const rawX = ((rowIndex * cardSpacing + stagger + paradeOffset) % trackWidth) - trackWidth / 2;
        const paradeX = rawX;
        const paradeY = row * (isMobile ? 85 : 110) + Math.sin(rawX * 0.015 + now * 0.0025) * 20;
        const paradeRot = Math.sin(rawX * 0.01 + i) * 9;
        const paradeScale = 0.95;

        // 3. Interpolate between Parade and Orbit
        const posX = lerp(paradeX, orbitX, t);
        const posY = lerp(paradeY, orbitY, t);
        const rot = lerp(paradeRot, orbitRot, t);
        const scale = lerp(paradeScale, orbitScale, t);

        // Always positive Z-Index so cards NEVER sink beneath background!
        // Range: ~20 to ~250. Hub is 50. Foreground cards (>50) float above hub.
        const zIndex = Math.max(10, Math.round(100 + posY));

        el.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0px) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(2)})`;
        el.style.zIndex = String(zIndex);
      }

      animFrameRef.current = requestAnimationFrame(updateAnimation);
    };

    animFrameRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <section id="hero" className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden select-none">
      {/* Background playful Neo-Brutalism geometric accents */}
      <div className="absolute top-12 left-8 w-6 h-6 bg-[#FFE66D] brutal-border rotate-12 hidden lg:block animate-bounce" style={{ animationDuration: '4s' }} />
      <div className="absolute top-32 right-12 w-8 h-8 rounded-full bg-[#52C7E8] brutal-border hidden lg:block animate-pulse" />
      <div className="absolute bottom-10 left-1/3 w-7 h-7 bg-[#FF6B6B] brutal-border -rotate-6 hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand, Headline, Value Props & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start z-30">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white brutal-border brutal-shadow-sm mb-6 transition-transform hover:-rotate-1">
              <Sparkles className="w-4 h-4 text-[#FF6B6B] fill-[#FF6B6B]" />
              <span className="font-bold text-xs md:text-sm tracking-wide text-black">
                ✦ Free · Fast · Local · No Upload
              </span>
            </div>

            {/* Giant DOC-SHIFT Display Title */}
            <h1 className="font-heading font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight text-black neo-3d-text uppercase leading-none mb-4 select-none">
              DOC-SHIFT
            </h1>

            {/* Subtitle Pill Banner */}
            <div className="inline-block bg-[#FFE66D] brutal-border rounded-xl px-4 py-2 brutal-shadow mb-6 transition-transform hover:rotate-1">
              <span className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-black">
                Your files. A whole new format.
              </span>
            </div>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-black/85 max-w-xl font-medium leading-relaxed mb-8">
              Convert images, video, audio, documents and data — right in your browser.{' '}
              <strong className="text-black font-bold">Fast, private and completely free.</strong> No server uploads ever.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onStartConvertingClick}
                className="w-full sm:w-auto brutal-btn bg-[#FF6B6B] text-black font-heading font-extrabold text-base sm:text-lg px-7 py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#ff5555]"
              >
                Start Converting
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>

              <button
                onClick={onExploreFormatsClick}
                className="w-full sm:w-auto brutal-btn bg-white text-black font-heading font-extrabold text-base sm:text-lg px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#FFF6EC]"
              >
                <Compass className="w-5 h-5 stroke-[2.5]" />
                Explore Formats
              </button>
            </div>

            {/* Trust Micro-Badges */}
            <div className="mt-8 pt-6 border-t-[2.5px] border-black/10 flex items-center gap-6 text-xs sm:text-sm font-bold text-black/75">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#43D1BE] brutal-border" />
                Zero Cloud Uploads
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFE66D] brutal-border" />
                Runs in Browser RAM
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B79BFA] brutal-border" />
                Instant Local Download
              </span>
            </div>
          </div>

          {/* Right Column: Signature Animated File-Format Showcase Stage */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[460px] sm:min-h-[520px]">
            
            {/* Playful Floating Badges */}
            <div className="absolute top-2 right-4 bg-[#FFE66D] brutal-border rounded-xl px-3 py-1.5 brutal-shadow-sm rotate-6 z-40 select-none hidden sm:block">
              <span className="font-heading font-black text-xs text-black tracking-wider uppercase flex items-center gap-1">
                100% IN BROWSER ⚡
              </span>
            </div>

            <div className="absolute bottom-4 right-6 bg-[#B79BFA] brutal-border rounded-xl px-3 py-1.5 brutal-shadow-sm -rotate-3 z-40 select-none hidden sm:block">
              <span className="font-heading font-black text-xs text-black tracking-wider uppercase">
                {currentPhaseLabel === 'parade' ? '🌊 Flowing Parade' : '🔄 Anticlockwise Orbit'}
              </span>
            </div>

            {/* Central Animated Sync / Refresh Hub (Z-Index: 50) */}
            <div className="relative z-[50] w-24 h-24 md:w-28 md:h-28 bg-white brutal-border-thick rounded-2xl brutal-shadow-lg flex flex-col items-center justify-center transition-transform hover:scale-105 select-none">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#43D1BE] brutal-border flex items-center justify-center shadow-inner">
                <RefreshCw
                  className="w-7 h-7 md:w-8 md:h-8 text-black stroke-[3] animate-spin"
                  style={{ animationDuration: '6s' }}
                />
              </div>
            </div>

            {/* 16 Orbiting / Parading Cards Stage */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {CARDS_DATA.map((card, idx) => (
                <div
                  key={card.id}
                  ref={(el) => {
                    cardElementsRef.current[idx] = el;
                  }}
                  className="absolute pointer-events-auto will-change-transform"
                >
                  <FileCard format={card.format} size="sm" />
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
