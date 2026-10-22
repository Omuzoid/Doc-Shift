import React from 'react';
import { UploadCloud, Sliders, Download, ArrowRight, Sparkles } from 'lucide-react';

const STEPS = [
  {
    step: '1',
    color: '#FF6B6B', // Coral
    icon: <UploadCloud className="w-8 h-8 stroke-[2.5] text-black" />,
    title: 'Upload File',
    desc: 'Select or drag your file directly into the browser workspace.',
  },
  {
    step: '2',
    color: '#FFE66D', // Yellow
    icon: <Sliders className="w-8 h-8 stroke-[2.5] text-black" />,
    title: 'Choose Format',
    desc: 'Pick your desired output format and fine-tune optional quality parameters.',
  },
  {
    step: '3',
    color: '#43D1BE', // Mint
    icon: <Download className="w-8 h-8 stroke-[2.5] text-black" />,
    title: 'Convert & Download',
    desc: 'Click convert. Your browser generates the new file in memory instantly.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-18 bg-[#FFFDF7] border-y-[2.5px] border-black select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE66D] brutal-border brutal-shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-black">
              Simple 3-Step Process
            </span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-black tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg font-semibold text-black/75 mt-2">
            Convert your files in seconds without waiting in server queues.
          </p>
        </div>

        {/* 3 Step Cards with Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="group bg-white brutal-border-thick rounded-2xl p-6 md:p-8 brutal-shadow relative flex flex-col justify-between hover:brutal-shadow-lg hover:-translate-y-1.5 transition-all duration-200"
            >
              {/* Step Number Badge */}
              <div
                className="w-10 h-10 rounded-full brutal-border flex items-center justify-center font-heading font-black text-lg text-black mb-6 brutal-shadow-sm transition-transform group-hover:scale-110"
                style={{ backgroundColor: step.color }}
              >
                {step.step}
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-[#FFF6EC] brutal-border flex items-center justify-center mb-6 transition-transform group-hover:rotate-6">
                {step.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="font-heading font-black text-xl md:text-2xl text-black mb-2">
                  {step.title}
                </h3>
                <p className="text-sm font-semibold text-black/75 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Arrow Indicator for desktop */}
              {idx < STEPS.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black text-white items-center justify-center animate-pulse">
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
