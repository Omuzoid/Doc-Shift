import React, { useState } from 'react';
import { ArrowRight, Menu, X, FileText, Sparkles, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  onStartConvertingClick: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartConvertingClick,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
    { label: 'Home', target: 'hero' },
    { label: 'Convert', target: 'converter' },
    { label: 'Formats', target: 'formats' },
    { label: 'How It Works', target: 'how-it-works' },
    { label: 'Privacy', target: 'privacy' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFF6EC]/95 backdrop-blur-sm border-b-[2.5px] border-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-12 bg-[#FFE66D] brutal-border rounded-xl brutal-shadow-sm flex items-center justify-center transition-transform group-hover:-rotate-3">
            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-l-2 border-b-2 border-black bg-white/50 rounded-bl" />
            <FileText className="w-6 h-6 stroke-[2.5] text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-black flex items-center gap-1">
              DOC-SHIFT
              <Sparkles className="w-4 h-4 text-[#FF6B6B] fill-[#FF6B6B]" />
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => onNavigate(link.target)}
              className="px-3.5 py-1.5 text-sm font-bold text-black rounded-lg hover:bg-[#FFE66D] transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 bg-white brutal-border rounded-xl brutal-shadow-sm flex items-center justify-center text-black hover:bg-[#FFF3B0] transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            {isDarkMode ? <Sun className="w-5 h-5 stroke-[2.5]" /> : <Moon className="w-5 h-5 stroke-[2.5]" />}
          </button>

          <button
            onClick={onStartConvertingClick}
            className="brutal-btn bg-[#FF6B6B] text-black font-heading font-extrabold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#ff5555]"
          >
            Start Converting
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 bg-[#FFE66D] brutal-border rounded-xl brutal-shadow-sm flex items-center justify-center text-black"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Menu className="w-6 h-6 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FFF6EC] border-b-[2.5px] border-black px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => {
                onNavigate(link.target);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-base font-bold text-black rounded-xl hover:bg-[#FFE66D] border border-black/10 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                onStartConvertingClick();
                setMobileMenuOpen(false);
              }}
              className="w-full brutal-btn bg-[#FF6B6B] text-black font-heading font-extrabold text-base px-5 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              Start Converting
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
