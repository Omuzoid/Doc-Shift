import React from 'react';
import { 
  Image as ImageIcon, 
  Film, 
  Music, 
  FileText, 
  Database, 
  ArrowRight 
} from 'lucide-react';
import type { CategoryId } from '../types/conversion';
import { CATEGORIES } from '../utils/formatUtils';

interface CategorySelectorProps {
  activeCategory: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'images':
        return <ImageIcon className="w-6 h-6 stroke-[2.5]" />;
      case 'video':
        return <Film className="w-6 h-6 stroke-[2.5]" />;
      case 'audio':
        return <Music className="w-6 h-6 stroke-[2.5]" />;
      case 'documents':
        return <FileText className="w-6 h-6 stroke-[2.5]" />;
      case 'data':
        return <Database className="w-6 h-6 stroke-[2.5]" />;
    }
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-black tracking-tight flex items-center gap-2">
              Explore Categories
            </h2>
            <p className="text-sm md:text-base font-semibold text-black/75 mt-1">
              Select a media or file type to jump straight into targeted conversion.
            </p>
          </div>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{ backgroundColor: cat.color }}
                className={`group brutal-border rounded-2xl p-5 cursor-pointer select-none flex flex-col justify-between transition-all duration-200 ${
                  isSelected
                    ? 'brutal-shadow-lg ring-4 ring-black -translate-y-1.5'
                    : 'brutal-shadow hover:brutal-shadow-lg hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Category Header with Icon Box */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white brutal-border brutal-shadow-sm flex items-center justify-center text-black transition-transform group-hover:scale-110 group-hover:-rotate-3">
                      {getCategoryIcon(cat.id)}
                    </div>
                    {isSelected && (
                      <span className="bg-black text-white text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading font-black text-xl text-black mb-1.5 transition-transform group-hover:translate-x-0.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-semibold text-black/80 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Action Arrow */}
                <div className="pt-3 border-t-2 border-black/20 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-black/70">
                    {cat.formats.slice(0, 3).join(', ')}...
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center transition-all group-hover:scale-110 group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
