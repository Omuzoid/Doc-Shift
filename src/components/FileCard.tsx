import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Film, 
  Music, 
  Database, 
  FileSpreadsheet, 
  FileCode, 
  Presentation 
} from 'lucide-react';
import { FORMAT_COLORS } from '../utils/formatUtils';

interface FileCardProps {
  format: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  showIcon?: boolean;
}

export const FileCard: React.FC<FileCardProps> = ({
  format,
  size = 'md',
  className = '',
  style = {},
  onClick,
  showIcon = true,
}) => {
  const upperFormat = format.toUpperCase();
  const theme = FORMAT_COLORS[upperFormat] || { bg: '#FFE66D', text: '#000000', border: '#000000' };

  // Icon selector based on format
  const getIcon = () => {
    switch (upperFormat) {
      case 'PNG':
      case 'JPG':
      case 'JPEG':
      case 'WEBP':
      case 'SVG':
      case 'BMP':
      case 'ICO':
      case 'GIF':
        return <ImageIcon className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />;
      case 'MP4':
      case 'WEBM':
      case 'MKV':
      case 'MOV':
      case 'AVI':
        return <Film className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />;
      case 'MP3':
      case 'WAV':
      case 'OGG':
      case 'AAC':
      case 'FLAC':
        return <Music className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />;
      case 'JSON':
      case 'CSV':
      case 'TSV':
      case 'XML':
      case 'YAML':
      case 'SQL':
        return <Database className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />;
      case 'XLSX':
      case 'XLS':
        return <FileSpreadsheet className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />;
      case 'PPT':
      case 'PPTX':
        return <Presentation className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />;
      case 'HTML':
      case 'MD':
        return <FileCode className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />;
      default:
        return <FileText className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />;
    }
  };

  const sizeClasses = {
    sm: 'w-14 h-18 text-xs p-1.5',
    md: 'w-18 h-22 md:w-20 md:h-24 text-xs md:text-sm p-2',
    lg: 'w-22 h-28 md:w-24 md:h-30 text-sm md:text-base p-2.5',
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        ...style,
      }}
      className={`relative select-none brutal-border rounded-xl brutal-shadow flex flex-col justify-between items-center transition-transform ${sizeClasses[size]} ${className}`}
    >
      {/* Folded Top-Right Corner */}
      <div 
        className="absolute top-0 right-0 w-4 h-4 border-l-2 border-b-2 border-black rounded-bl"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
      />

      {/* Format Icon */}
      {showIcon && (
        <div className="mt-1 opacity-90">
          {getIcon()}
        </div>
      )}

      {/* Bold Format Text */}
      <div className="font-heading font-extrabold tracking-tight mt-auto pb-1 text-center w-full">
        {upperFormat}
      </div>
    </div>
  );
};
