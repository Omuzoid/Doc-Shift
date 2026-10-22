import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, 
  Trash2, 
  Settings2, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Sparkles,
  Sliders,
  Copy,
  Check
} from 'lucide-react';
import type { 
  CategoryId, 
  ConversionOptions, 
  ConversionStatus, 
  ConvertedResult, 
  FileMetadata 
} from '../types/conversion';
import { 
  CATEGORIES, 
  detectCategoryFromExtension, 
  formatBytes, 
  getFileExtension 
} from '../utils/formatUtils';
import { executeConversion, getCompatibleOutputs } from '../engines/registry';
import { FileCard } from './FileCard';

interface ConverterWorkspaceProps {
  activeCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
}

const POPULAR_CONVERSIONS = [
  { label: 'JPG → PNG', from: 'jpg', to: 'png', cat: 'images' as CategoryId },
  { label: 'PNG → JPG', from: 'png', to: 'jpg', cat: 'images' as CategoryId },
  { label: 'JPG → WebP', from: 'jpg', to: 'webp', cat: 'images' as CategoryId },
  { label: 'TXT → PDF', from: 'txt', to: 'pdf', cat: 'documents' as CategoryId },
  { label: 'MP4 → MP3', from: 'mp4', to: 'mp3', cat: 'video' as CategoryId },
  { label: 'CSV → JSON', from: 'csv', to: 'json', cat: 'data' as CategoryId },
  { label: 'JSON → CSV', from: 'json', to: 'csv', cat: 'data' as CategoryId },
];

export const ConverterWorkspace: React.FC<ConverterWorkspaceProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [conversionStatus, setConversionStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [convertedResult, setConvertedResult] = useState<ConvertedResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Conversion Options
  const [options, setOptions] = useState<ConversionOptions>({
    imageQuality: 0.92,
    transparentBgFill: '#FFFFFF',
    csvDelimiter: ',',
    prettyPrint: true,
    indentSpaces: 2,
    pdfPageSize: 'a4',
    pdfOrientation: 'portrait',
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load preview and metadata when a file is selected
  const handleFileSelected = (file: File) => {
    if (convertedResult?.downloadUrl) {
      URL.revokeObjectURL(convertedResult.downloadUrl);
    }
    if (fileMetadata?.previewUrl) {
      URL.revokeObjectURL(fileMetadata.previewUrl);
    }

    setConvertedResult(null);
    setErrorMessage(null);
    setConversionStatus('idle');
    setProgress(0);

    const ext = getFileExtension(file.name);
    const cat = detectCategoryFromExtension(ext);
    onSelectCategory(cat);

    let previewUrl: string | undefined = undefined;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
    }

    const meta: FileMetadata = {
      file,
      name: file.name,
      size: file.size,
      formattedSize: formatBytes(file.size),
      extension: ext.toUpperCase(),
      mimeType: file.type || 'application/octet-stream',
      category: cat,
      previewUrl,
    };

    setFileMetadata(meta);

    // Automatically set default compatible output
    const compatible = getCompatibleOutputs(ext, cat);
    if (compatible.length > 0) {
      setTargetFormat(compatible[0]);
    } else {
      setTargetFormat('');
    }

    if (file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        setFileMetadata((prev) =>
          prev ? { ...prev, dimensions: { width: img.naturalWidth, height: img.naturalHeight } } : null
        );
      };
      img.src = previewUrl || '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = () => {
    if (convertedResult?.downloadUrl) {
      URL.revokeObjectURL(convertedResult.downloadUrl);
    }
    if (fileMetadata?.previewUrl) {
      URL.revokeObjectURL(fileMetadata.previewUrl);
    }
    setFileMetadata(null);
    setConvertedResult(null);
    setErrorMessage(null);
    setConversionStatus('idle');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConvert = async () => {
    if (!fileMetadata || !targetFormat) return;

    setConversionStatus('converting');
    setProgress(20);
    setErrorMessage(null);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 85) return prev + 15;
        return prev;
      });
    }, 120);

    try {
      const result = await executeConversion(fileMetadata.file, targetFormat, options);
      clearInterval(timer);
      setProgress(100);
      setConvertedResult(result);
      setConversionStatus('success');

      // Celebratory confetti blast
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#FFE66D', '#FF6B6B', '#43D1BE', '#B79BFA', '#52C7E8'],
      });
    } catch (err: any) {
      clearInterval(timer);
      setConversionStatus('error');
      setErrorMessage(err.message || 'An error occurred during local conversion.');
    }
  };

  // Quick Preset Handlers
  const handlePresetClick = (preset: typeof POPULAR_CONVERSIONS[0]) => {
    onSelectCategory(preset.cat);
    let sampleContent = '';
    let sampleMime = 'text/plain';
    const sampleName = `sample.${preset.from}`;

    if (preset.from === 'json') {
      sampleContent = JSON.stringify([
        { id: 1, name: 'Alex Johnson', role: 'Designer', country: 'Finland' },
        { id: 2, name: 'Maria Garcia', role: 'Developer', country: 'Spain' },
        { id: 3, name: 'Kenji Sato', role: 'Architect', country: 'Japan' },
      ], null, 2);
      sampleMime = 'application/json';
    } else if (preset.from === 'csv') {
      sampleContent = 'id,name,role,country\n1,Alex Johnson,Designer,Finland\n2,Maria Garcia,Developer,Spain\n3,Kenji Sato,Architect,Japan';
      sampleMime = 'text/csv';
    } else if (preset.from === 'txt') {
      sampleContent = 'DOC-SHIFT Sample Document\n\nThis is a sample document converted entirely inside your browser.\nNo data was uploaded to any remote server!\n\nFast. Private. Powerful.';
      sampleMime = 'text/plain';
    }

    if (sampleContent) {
      const sampleBlob = new Blob([sampleContent], { type: sampleMime });
      const sampleFile = new File([sampleBlob], sampleName, { type: sampleMime });
      handleFileSelected(sampleFile);
      setTargetFormat(preset.to.toUpperCase());
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleCopyText = async () => {
    if (!convertedResult?.blob) return;
    try {
      const text = await convertedResult.blob.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const compatibleOutputs = fileMetadata
    ? getCompatibleOutputs(fileMetadata.extension, fileMetadata.category)
    : [];

  return (
    <section id="converter" className="py-12 md:py-20 relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Card Container */}
        <div className="bg-white brutal-border-thick rounded-3xl brutal-shadow-xl overflow-hidden transition-all duration-300">
          
          {/* Top Category Filter Tabs */}
          <div className="border-b-[3px] border-black bg-[#FFF6EC] flex overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  style={{
                    backgroundColor: isActive ? cat.color : 'transparent',
                  }}
                  className={`px-5 py-3.5 sm:px-8 sm:py-4 font-heading font-extrabold text-sm sm:text-base border-r-2 border-black flex items-center gap-2 whitespace-nowrap transition-all duration-150 cursor-pointer select-none ${
                    isActive ? 'text-black brutal-shadow-sm translate-y-[-1px]' : 'text-black/75 hover:bg-black/5'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full border border-black transition-transform ${isActive ? 'scale-125' : ''}`} style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Workspace Body: Upload / Dropzone & Action Panels */}
          <div className="p-6 sm:p-8 lg:p-10">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelected(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {!fileMetadata ? (
                /* EMPTY STATE: Drag & Drop Area */
                <motion.div
                  key="empty-dropzone"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-[3px] border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center select-none ${
                    isDragging
                      ? 'border-[#43D1BE] bg-[#E6FAF7] scale-[0.99] animate-dropzone-pulse'
                      : 'border-black bg-[#FFFDF7] hover:bg-[#FFF6EC]'
                  }`}
                >
                  <div className="w-20 h-20 rounded-2xl bg-[#FFE66D] brutal-border brutal-shadow flex items-center justify-center mb-5 transition-transform hover:scale-110 hover:-rotate-3">
                    <UploadCloud className="w-10 h-10 text-black stroke-[2.5]" />
                  </div>

                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-black mb-2">
                    Drag & drop your file here
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-black/70 mb-6 max-w-md">
                    or click to browse from your device. Everything processes 100% locally in your browser.
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="brutal-btn bg-[#FFE66D] text-black font-heading font-extrabold text-base px-8 py-3 rounded-xl hover:bg-[#ffde59]"
                  >
                    Choose File
                  </button>

                  <span className="text-xs font-bold text-black/50 mt-5">
                    Maximum file size: 500 MB (browser dependent) · No server upload
                  </span>
                </motion.div>
              ) : (
                /* ACTIVE FILE STATE: Conversion Controls & Status */
                <motion.div
                  key="active-converter"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  {/* File Preview Card & Conversion Controls Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Selected File Card */}
                    <div className="lg:col-span-5 bg-[#FFF6EC] brutal-border rounded-2xl p-5 brutal-shadow transition-all hover:brutal-shadow-lg">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <FileCard format={fileMetadata.extension} size="sm" />
                          <div className="min-w-0">
                            <h4 className="font-heading font-black text-base text-black truncate max-w-[200px] sm:max-w-[260px]">
                              {fileMetadata.name}
                            </h4>
                            <span className="text-xs font-bold text-black/60">
                              {fileMetadata.formattedSize}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={handleClearFile}
                          aria-label="Remove file"
                          className="w-9 h-9 rounded-xl bg-white brutal-border brutal-shadow-sm flex items-center justify-center text-black hover:bg-[#FF6B6B] hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Image Preview / Details Thumbnail */}
                      {fileMetadata.previewUrl && (
                        <div className="mt-3 relative rounded-xl brutal-border overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                          <img
                            src={fileMetadata.previewUrl}
                            alt="File Preview"
                            className="max-h-full max-w-full object-contain"
                          />
                          {fileMetadata.dimensions && (
                            <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                              {fileMetadata.dimensions.width} × {fileMetadata.dimensions.height}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center justify-between text-xs font-bold text-black/70">
                        <span>Category: {fileMetadata.category.toUpperCase()}</span>
                        <span className="text-[#10B981] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                          Ready to convert
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Output Selector, Options & Action */}
                    <div className="lg:col-span-7 bg-white brutal-border rounded-2xl p-6 brutal-shadow flex flex-col justify-between">
                      <div>
                        {/* Convert to Format Selector */}
                        <div className="mb-6">
                          <label className="block font-heading font-black text-sm text-black uppercase tracking-wider mb-2">
                            Convert to:
                          </label>

                          {compatibleOutputs.length > 0 ? (
                            <div className="flex items-center gap-3">
                              <div className="relative flex-1">
                                <select
                                  value={targetFormat}
                                  onChange={(e) => setTargetFormat(e.target.value)}
                                  className="w-full bg-[#FFF6EC] brutal-border rounded-xl px-4 py-3 font-heading font-extrabold text-base text-black appearance-none brutal-shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                  {compatibleOutputs.map((fmt) => (
                                    <option key={fmt} value={fmt} className="font-bold">
                                      {fmt} (Compatible)
                                    </option>
                                  ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black font-bold">
                                  ▼
                                </div>
                              </div>

                              {/* Conversion Options Gear Button */}
                              <button
                                onClick={() => setShowOptionsModal(!showOptionsModal)}
                                title="Conversion Options"
                                className={`h-13 px-4 brutal-btn rounded-xl flex items-center gap-2 ${
                                  showOptionsModal ? 'bg-[#FFE66D]' : 'bg-white'
                                }`}
                              >
                                <Sliders className="w-5 h-5 stroke-[2.5]" />
                                <span className="hidden sm:inline font-heading font-extrabold text-sm">
                                  Options
                                </span>
                              </button>
                            </div>
                          ) : (
                            <div className="p-4 bg-[#FFF0F0] brutal-border rounded-xl text-xs font-bold text-[#FF5252]">
                              No compatible browser converters found for this file type. Please try an image, document, audio or data file.
                            </div>
                          )}
                        </div>

                        {/* Expandable Options Tray */}
                        <AnimatePresence>
                          {showOptionsModal && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mb-6 p-4 bg-[#FFF9D2] brutal-border rounded-xl space-y-4 overflow-hidden"
                            >
                              <h5 className="font-heading font-black text-sm text-black flex items-center gap-1.5">
                                <Settings2 className="w-4 h-4" />
                                Conversion Settings
                              </h5>

                              {/* Image Quality Slider */}
                              {fileMetadata.category === 'images' && (
                                <div>
                                  <div className="flex justify-between text-xs font-bold text-black mb-1">
                                    <span>Image Quality</span>
                                    <span>{Math.round((options.imageQuality || 0.92) * 100)}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0.1"
                                    max="1.0"
                                    step="0.05"
                                    value={options.imageQuality || 0.92}
                                    onChange={(e) =>
                                      setOptions({ ...options, imageQuality: parseFloat(e.target.value) })
                                    }
                                    className="w-full accent-black cursor-pointer"
                                  />
                                </div>
                              )}

                              {/* Transparent PNG background fill option */}
                              {fileMetadata.category === 'images' && targetFormat === 'JPG' && (
                                <div>
                                  <label className="block text-xs font-bold text-black mb-1">
                                    Background fill for transparent regions:
                                  </label>
                                  <div className="flex gap-2">
                                    {['#FFFFFF', '#000000', '#FFE66D'].map((color) => (
                                      <button
                                        key={color}
                                        type="button"
                                        onClick={() => setOptions({ ...options, transparentBgFill: color })}
                                        className={`w-7 h-7 rounded brutal-border transition-transform hover:scale-110 ${
                                          options.transparentBgFill === color ? 'ring-2 ring-black' : ''
                                        }`}
                                        style={{ backgroundColor: color }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Data Delimiter Option */}
                              {fileMetadata.category === 'data' && (
                                <div className="flex items-center gap-4">
                                  <label className="text-xs font-bold text-black">CSV Delimiter:</label>
                                  <select
                                    value={options.csvDelimiter}
                                    onChange={(e) => setOptions({ ...options, csvDelimiter: e.target.value })}
                                    className="bg-white brutal-border rounded px-2 py-1 text-xs font-bold"
                                  >
                                    <option value=",">Comma (,)</option>
                                    <option value=";">Semicolon (;)</option>
                                    <option value="|">Pipe (|)</option>
                                    <option value="&#9;">Tab (\t)</option>
                                  </select>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Convert Button & Progress State */}
                        <button
                          onClick={handleConvert}
                          disabled={conversionStatus === 'converting' || !targetFormat}
                          className={`w-full brutal-btn bg-[#FF6B6B] text-black font-heading font-black text-lg py-4 rounded-xl flex items-center justify-center gap-3 ${
                            conversionStatus === 'converting' || !targetFormat ? 'brutal-btn-disabled' : 'hover:bg-[#ff5555]'
                          }`}
                        >
                          {conversionStatus === 'converting' ? (
                            <>
                              <RefreshCw className="w-5 h-5 animate-spin stroke-[3]" />
                              Converting Locally... ({progress}%)
                            </>
                          ) : (
                            <>
                              Convert Now
                              <ArrowRight className="w-5 h-5 stroke-[3]" />
                            </>
                          )}
                        </button>

                        {/* Live Progress Bar */}
                        {conversionStatus === 'converting' && (
                          <div className="mt-4">
                            <div className="w-full bg-[#E2E8F0] brutal-border rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-[#43D1BE] h-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-xs font-bold text-black/70 mt-2 text-center animate-pulse">
                              Processing in browser memory (RAM) · 0% network usage
                            </p>
                          </div>
                        )}

                        {/* Error Banner */}
                        {conversionStatus === 'error' && errorMessage && (
                          <div className="mt-4 p-4 bg-[#FFF0F0] brutal-border rounded-xl flex items-start gap-3 text-black animate-shake">
                            <AlertCircle className="w-5 h-5 text-[#FF5252] flex-shrink-0 mt-0.5" />
                            <div className="text-xs font-bold">
                              <p className="font-heading font-black text-sm text-[#FF5252]">Conversion Failed</p>
                              <p className="mt-0.5">{errorMessage}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Success & Download Box */}
                      {conversionStatus === 'success' && convertedResult && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-6 p-5 bg-[#E6FAF7] brutal-border rounded-2xl brutal-shadow-sm space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-6 h-6 text-[#10B981] stroke-[2.5]" />
                              <span className="font-heading font-black text-base text-black">
                                Conversion Complete!
                              </span>
                            </div>
                            <span className="text-xs font-mono font-bold bg-white px-2 py-1 rounded brutal-border">
                              {formatBytes(convertedResult.size)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <a
                              href={convertedResult.downloadUrl}
                              download={convertedResult.filename}
                              className="flex-1 brutal-btn bg-[#43D1BE] text-black font-heading font-black text-base py-3 px-5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#34c2af]"
                            >
                              <Download className="w-5 h-5 stroke-[3]" />
                              Download {convertedResult.filename}
                            </a>

                            {(fileMetadata.category === 'data' || fileMetadata.category === 'documents') && (
                              <button
                                onClick={handleCopyText}
                                className="brutal-btn bg-white text-black font-heading font-bold text-sm px-4 py-3 rounded-xl flex items-center gap-1.5"
                              >
                                {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy Text'}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>

                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* Popular Conversions Quick Bar */}
            <div className="mt-10 pt-6 border-t-2 border-black/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
                <span className="font-heading font-black text-sm text-black uppercase tracking-wider">
                  Popular Conversions
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {POPULAR_CONVERSIONS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(preset)}
                    className="px-3.5 py-1.5 bg-[#FFF6EC] brutal-border rounded-lg text-xs font-bold text-black brutal-shadow-sm hover:bg-[#FFE66D] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
