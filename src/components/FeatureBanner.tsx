import React from 'react';
import { ArrowRight, Crown } from 'lucide-react';

interface FeatureBannerProps {
  onStartConvertingClick: () => void;
}

export const FeatureBanner: React.FC<FeatureBannerProps> = ({
  onStartConvertingClick,
}) => {
  return (
    <section className="py-8 md:py-14 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFB4B4] brutal-border-thick rounded-3xl p-6 sm:p-10 brutal-shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 transition-transform hover:brutal-shadow-xl">
          
          {/* Decorative shapes */}
          <div className="absolute top-4 right-10 w-4 h-4 bg-[#FFE66D] brutal-border rotate-45 hidden md:block animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-4 left-1/2 w-6 h-6 rounded-full bg-[#52C7E8] brutal-border hidden md:block animate-pulse" />

          {/* Left: Mascot & Headline */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left z-10">
            
            {/* Retro CRT Computer Mascot with subtle breathing */}
            <div className="relative select-none flex-shrink-0 animate-float-gentle">
              {/* Little Golden Crown */}
              <div className="absolute -top-4 -right-1 z-20 text-[#FFE66D] transition-transform hover:scale-125">
                <Crown className="w-8 h-8 fill-[#FFE66D] stroke-black stroke-[2.5] -rotate-12" />
              </div>

              {/* CRT Body */}
              <div className="w-24 h-22 sm:w-28 sm:h-26 bg-[#52C7E8] brutal-border rounded-2xl brutal-shadow flex flex-col items-center justify-center p-2 relative">
                {/* Screen */}
                <div className="w-full h-full bg-[#FFE66D] brutal-border rounded-xl flex flex-col items-center justify-center">
                  {/* Cute Face with blinking / smile */}
                  <div className="flex items-center gap-4 mb-1">
                    <span className="w-2.5 h-2.5 bg-black rounded-full" />
                    <span className="w-2.5 h-2.5 bg-black rounded-full" />
                  </div>
                  <div className="w-4 h-2 border-b-3 border-black rounded-b-full" />
                </div>
              </div>
            </div>

            {/* Banner Text */}
            <div>
              <h3 className="font-heading font-black text-3xl sm:text-4xl text-black tracking-tight mb-2">
                Fast. Private. Powerful.
              </h3>
              <p className="text-sm sm:text-base font-semibold text-black/85 max-w-xl">
                All your file conversion needs in one place. Built for everyone, with a clean and playful experience. No trackers, no server lag.
              </p>
            </div>

          </div>

          {/* Right: CTA Button */}
          <div className="z-10 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={onStartConvertingClick}
              className="w-full sm:w-auto brutal-btn bg-white text-black font-heading font-black text-base sm:text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#FFF6EC]"
            >
              Start Converting Now
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
