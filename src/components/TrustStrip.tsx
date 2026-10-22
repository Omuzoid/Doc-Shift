import React from 'react';
import { ShieldCheck, UserX, Gift, Lock, Zap } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: <ShieldCheck className="w-6 h-6 stroke-[2.5] text-black" />,
    bg: '#43D1BE', // Mint
    title: '100% Local Processing',
    desc: 'Runs entirely in your browser',
  },
  {
    icon: <UserX className="w-6 h-6 stroke-[2.5] text-black" />,
    bg: '#FFE66D', // Yellow
    title: 'No Account Required',
    desc: 'Zero sign-ups or credentials',
  },
  {
    icon: <Gift className="w-6 h-6 stroke-[2.5] text-black" />,
    bg: '#B79BFA', // Purple
    title: 'Completely Free',
    desc: 'No paywalls or hidden limits',
  },
  {
    icon: <Lock className="w-6 h-6 stroke-[2.5] text-black" />,
    bg: '#52C7E8', // Cyan
    title: 'Your Files Stay with You',
    desc: 'Never transmitted across network',
  },
  {
    icon: <Zap className="w-6 h-6 stroke-[2.5] text-black" />,
    bg: '#FF6B6B', // Coral
    title: 'Fast & Easy Conversion',
    desc: 'Instant drag-and-drop workflow',
  },
];

export const TrustStrip: React.FC = () => {
  return (
    <section className="py-6 border-y-[2.5px] border-black bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {TRUST_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-[#FFF6EC] brutal-border rounded-xl brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 transition-all group cursor-default"
            >
              <div
                className="w-11 h-11 rounded-lg brutal-border flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3"
                style={{ backgroundColor: item.bg }}
              >
                {item.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-heading font-extrabold text-sm text-black leading-tight truncate">
                  {item.title}
                </span>
                <span className="text-[11px] font-semibold text-black/70 leading-snug truncate">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
