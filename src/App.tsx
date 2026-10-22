import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustStrip } from './components/TrustStrip';
import { CategorySelector } from './components/CategorySelector';
import { ConverterWorkspace } from './components/ConverterWorkspace';
import { HowItWorks } from './components/HowItWorks';
import { SupportedFormats } from './components/SupportedFormats';
import { FeatureBanner } from './components/FeatureBanner';
import { Footer } from './components/Footer';
import { FloatingFileBackground } from './components/FloatingFileBackground';
import { FadeIn } from './components/motion/MotionTransitions';
import type { CategoryId } from './types/conversion';

export const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('images');

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (cat: CategoryId) => {
    setActiveCategory(cat);
    scrollToSection('converter');
  };

  return (
    <div className="relative min-h-screen bg-[#FFF6EC] flex flex-col font-sans text-[#171717] overflow-x-hidden">
      {/* Floating Decorative Files Layer */}
      <FloatingFileBackground />

      {/* Navigation */}
      <Navbar
        onStartConvertingClick={() => scrollToSection('converter')}
        onNavigate={scrollToSection}
      />

      {/* Main Page Sections */}
      <main className="relative z-10 flex-1">
        {/* Signature Animated Hero */}
        <HeroSection
          onStartConvertingClick={() => scrollToSection('converter')}
          onExploreFormatsClick={() => scrollToSection('formats')}
        />

        {/* Trust Badges Strip */}
        <FadeIn>
          <TrustStrip />
        </FadeIn>

        {/* Category Cards Selector */}
        <FadeIn delay={0.1}>
          <CategorySelector
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />
        </FadeIn>

        {/* Main Central Converter Workspace */}
        <FadeIn delay={0.15}>
          <ConverterWorkspace
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </FadeIn>

        {/* How It Works Guide */}
        <FadeIn delay={0.1}>
          <HowItWorks />
        </FadeIn>

        {/* Supported Formats Directory */}
        <FadeIn delay={0.1}>
          <SupportedFormats />
        </FadeIn>

        {/* Retro Mascot Feature Banner */}
        <FadeIn delay={0.1}>
          <FeatureBanner
            onStartConvertingClick={() => scrollToSection('converter')}
          />
        </FadeIn>
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
};

export default App;
