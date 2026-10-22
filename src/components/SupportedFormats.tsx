import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { CATEGORIES } from '../utils/formatUtils';

const ALL_FORMATS = [
  {
    category: 'images',
    name: 'Images',
    bg: '#FFE66D',
    formats: [
      { ext: 'JPG', verified: true },
      { ext: 'PNG', verified: true },
      { ext: 'WEBP', verified: true },
      { ext: 'GIF', verified: true },
      { ext: 'BMP', verified: true },
      { ext: 'SVG', verified: true },
      { ext: 'ICO', verified: true },
      { ext: 'TIFF', verified: false },
      { ext: 'AVIF', verified: false },
    ],
  },
  {
    category: 'video',
    name: 'Video',
    bg: '#FFB4B4',
    formats: [
      { ext: 'MP4', verified: true },
      { ext: 'WEBM', verified: true },
      { ext: 'MKV', verified: false },
      { ext: 'MOV', verified: false },
      { ext: 'AVI', verified: false },
      { ext: 'FLV', verified: false },
      { ext: 'WMV', verified: false },
    ],
  },
  {
    category: 'audio',
    name: 'Audio',
    bg: '#B79BFA',
    formats: [
      { ext: 'MP3', verified: true },
      { ext: 'WAV', verified: true },
      { ext: 'OGG', verified: true },
      { ext: 'AAC', verified: true },
      { ext: 'M4A', verified: true },
      { ext: 'FLAC', verified: false },
      { ext: 'OPUS', verified: false },
    ],
  },
  {
    category: 'documents',
    name: 'Documents',
    bg: '#43D1BE',
    formats: [
      { ext: 'PDF', verified: true },
      { ext: 'TXT', verified: true },
      { ext: 'HTML', verified: true },
      { ext: 'MD', verified: true },
      { ext: 'DOCX', verified: false },
      { ext: 'DOC', verified: false },
      { ext: 'RTF', verified: false },
    ],
  },
  {
    category: 'data',
    name: 'Data',
    bg: '#52C7E8',
    formats: [
      { ext: 'JSON', verified: true },
      { ext: 'CSV', verified: true },
      { ext: 'TSV', verified: true },
      { ext: 'XML', verified: true },
      { ext: 'YAML', verified: true },
      { ext: 'SQL', verified: false },
    ],
  },
];

export const SupportedFormats: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredCategories = ALL_FORMATS.filter((cat) => {
    if (selectedFilter !== 'all' && cat.category !== selectedFilter) {
      return false;
    }
    return true;
  }).map((cat) => {
    if (!searchQuery.trim()) return cat;
    const query = searchQuery.toLowerCase().trim();
    return {
      ...cat,
      formats: cat.formats.filter((f) => f.ext.toLowerCase().includes(query)),
    };
  }).filter((cat) => cat.formats.length > 0);

  return (
    <section id="formats" className="py-14 md:py-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-black tracking-tight">
              Supported Formats
            </h2>
            <p className="text-sm sm:text-base font-semibold text-black/75 mt-1">
              A comprehensive directory of input and output formats processed locally.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search format (e.g. PDF, MP3, JPG...)"
              className="w-full bg-white brutal-border rounded-xl px-4 py-3 pl-11 text-sm font-bold text-black placeholder:text-black/40 brutal-shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:brutal-shadow transition-all"
            />
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/60 stroke-[2.5]" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl brutal-border text-xs font-heading font-extrabold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-black text-white brutal-shadow-sm scale-105'
                : 'bg-white text-black hover:bg-[#FFE66D]'
            }`}
          >
            All Formats
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-4 py-2 rounded-xl brutal-border text-xs font-heading font-extrabold transition-all cursor-pointer ${
                selectedFilter === cat.id
                  ? 'bg-black text-white brutal-shadow-sm scale-105'
                  : 'bg-white text-black hover:bg-[#FFE66D]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.category}
              className="bg-white brutal-border-thick rounded-2xl p-6 brutal-shadow flex flex-col justify-between transition-all hover:brutal-shadow-lg hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-md brutal-border"
                      style={{ backgroundColor: cat.bg }}
                    />
                    <h3 className="font-heading font-black text-xl text-black">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-black/60">
                    {cat.formats.length} formats
                  </span>
                </div>

                {/* Formats Tags */}
                <div className="flex flex-wrap gap-2">
                  {cat.formats.map((f) => (
                    <div
                      key={f.ext}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg brutal-border text-xs font-heading font-bold transition-all hover:scale-105 ${
                        f.verified
                          ? 'bg-[#FFF6EC] text-black hover:bg-[#FFE66D]'
                          : 'bg-gray-100 text-black/50 border-dashed'
                      }`}
                    >
                      <span>{f.ext}</span>
                      {f.verified ? (
                        <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[3]" />
                      ) : (
                        <span className="text-[10px] text-black/40">Planned</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between text-[11px] font-bold text-black/60">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#10B981]" /> Verified local engine
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
