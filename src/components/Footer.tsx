import React from 'react';
import { FileText, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t-[3px] border-black bg-white py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-black/10">
          
          {/* Logo & Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div 
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-10 bg-[#FFE66D] brutal-border rounded-lg brutal-shadow-sm flex items-center justify-center">
                <FileText className="w-5 h-5 stroke-[2.5] text-black" />
              </div>
              <span className="font-heading font-black text-2xl text-black tracking-tight">
                DOC-SHIFT
              </span>
            </div>
            <span className="hidden sm:inline text-black/30 font-bold">•</span>
            <span className="text-sm font-bold text-black/70">
              Convert Anything. Instantly.
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-black">
            <button onClick={() => onNavigate('hero')} className="hover:underline cursor-pointer">
              Home
            </button>
            <button onClick={() => onNavigate('converter')} className="hover:underline cursor-pointer">
              Convert
            </button>
            <button onClick={() => onNavigate('formats')} className="hover:underline cursor-pointer">
              Formats
            </button>
            <button onClick={() => onNavigate('how-it-works')} className="hover:underline cursor-pointer">
              How It Works
            </button>
          </div>

          {/* Social Icons & Attribution */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Repository"
              className="w-9 h-9 rounded-xl bg-[#FFF6EC] brutal-border brutal-shadow-sm flex items-center justify-center text-black hover:bg-[#FFE66D] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter Profile"
              className="w-9 h-9 rounded-xl bg-[#FFF6EC] brutal-border brutal-shadow-sm flex items-center justify-center text-black hover:bg-[#52C7E8] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-black/60 gap-4">
          <p>© {new Date().getFullYear()} DOC-SHIFT. All conversions run 100% locally in your browser.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-[#FF6B6B] fill-[#FF6B6B]" /> for everyone.
          </p>
        </div>
      </div>
    </footer>
  );
};
