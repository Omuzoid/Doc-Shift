import type { CategoryId } from '../types/conversion';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts[parts.length - 1].toLowerCase();
}

export function getBaseFilename(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return filename;
  return filename.substring(0, lastDot);
}

export function detectCategoryFromExtension(ext: string): CategoryId {
  const cleanExt = ext.toLowerCase().replace('.', '');
  
  const imageExts = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'ico', 'svg', 'tiff', 'avif'];
  const videoExts = ['mp4', 'webm', 'mkv', 'mov', 'avi', 'flv', 'wmv'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'opus'];
  const documentExts = ['pdf', 'docx', 'doc', 'txt', 'rtf', 'html', 'md', 'markdown'];
  const dataExts = ['json', 'csv', 'tsv', 'xml', 'yaml', 'yml', 'sql'];

  if (imageExts.includes(cleanExt)) return 'images';
  if (videoExts.includes(cleanExt)) return 'video';
  if (audioExts.includes(cleanExt)) return 'audio';
  if (documentExts.includes(cleanExt)) return 'documents';
  if (dataExts.includes(cleanExt)) return 'data';

  return 'documents';
}

export const CATEGORIES = [
  {
    id: 'images' as CategoryId,
    name: 'Images',
    shortName: 'IMG',
    description: 'Convert between JPG, PNG, WebP, GIF, BMP, SVG and more.',
    color: '#FFE66D', // Yellow
    badgeBg: '#FFF3B0',
    accentBg: '#FFF9D2',
    formats: ['PNG', 'JPG', 'JPEG', 'WEBP', 'SVG', 'BMP', 'ICO', 'GIF'],
  },
  {
    id: 'video' as CategoryId,
    name: 'Video',
    shortName: 'VID',
    description: 'Extract audio, convert between WebM, MP4, MKV and more.',
    color: '#FFB4B4', // Soft Coral/Pink
    badgeBg: '#FFD6D6',
    accentBg: '#FFF0F0',
    formats: ['MP4', 'WEBM', 'MKV', 'MOV', 'AVI', 'GIF', 'MP3'],
  },
  {
    id: 'audio' as CategoryId,
    name: 'Audio',
    shortName: 'AUDIO',
    description: 'Convert between MP3, WAV, OGG, FLAC and more.',
    color: '#B79BFA', // Purple
    badgeBg: '#DDD0FC',
    accentBg: '#F3EEFF',
    formats: ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'],
  },
  {
    id: 'documents' as CategoryId,
    name: 'Documents',
    shortName: 'DOC',
    description: 'Convert between PDF, DOCX, TXT, HTML, MD and more.',
    color: '#43D1BE', // Mint / Teal
    badgeBg: '#A6EFE5',
    accentBg: '#E6FAF7',
    formats: ['PDF', 'TXT', 'HTML', 'MD', 'CSV', 'JSON'],
  },
  {
    id: 'data' as CategoryId,
    name: 'Data',
    shortName: 'DATA',
    description: 'Convert between JSON, CSV, XML, YAML, TSV and more.',
    color: '#52C7E8', // Cyan
    badgeBg: '#B6EAF8',
    accentBg: '#EBF9FD',
    formats: ['JSON', 'CSV', 'XML', 'YAML', 'TSV'],
  },
];

export const FORMAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PNG: { bg: '#52C7E8', text: '#000000', border: '#000000' },
  JPG: { bg: '#FFE66D', text: '#000000', border: '#000000' },
  JPEG: { bg: '#FFE66D', text: '#000000', border: '#000000' },
  WEBP: { bg: '#B79BFA', text: '#000000', border: '#000000' },
  SVG: { bg: '#FF9F45', text: '#000000', border: '#000000' },
  BMP: { bg: '#E2E8F0', text: '#000000', border: '#000000' },
  ICO: { bg: '#FDE047', text: '#000000', border: '#000000' },
  GIF: { bg: '#FF6B6B', text: '#FFFFFF', border: '#000000' },
  PDF: { bg: '#FF5252', text: '#FFFFFF', border: '#000000' },
  DOCX: { bg: '#3B82F6', text: '#FFFFFF', border: '#000000' },
  DOC: { bg: '#2563EB', text: '#FFFFFF', border: '#000000' },
  TXT: { bg: '#A5F3FC', text: '#000000', border: '#000000' },
  HTML: { bg: '#F97316', text: '#FFFFFF', border: '#000000' },
  MD: { bg: '#10B981', text: '#FFFFFF', border: '#000000' },
  MP4: { bg: '#EC4899', text: '#FFFFFF', border: '#000000' },
  WEBM: { bg: '#8B5CF6', text: '#FFFFFF', border: '#000000' },
  MKV: { bg: '#6366F1', text: '#FFFFFF', border: '#000000' },
  MP3: { bg: '#F59E0B', text: '#000000', border: '#000000' },
  WAV: { bg: '#38BDF8', text: '#000000', border: '#000000' },
  OGG: { bg: '#14B8A6', text: '#FFFFFF', border: '#000000' },
  JSON: { bg: '#FCD34D', text: '#000000', border: '#000000' },
  CSV: { bg: '#43D1BE', text: '#000000', border: '#000000' },
  TSV: { bg: '#6EE7B7', text: '#000000', border: '#000000' },
  XML: { bg: '#FB923C', text: '#FFFFFF', border: '#000000' },
  YAML: { bg: '#C084FC', text: '#000000', border: '#000000' },
  YML: { bg: '#C084FC', text: '#000000', border: '#000000' },
  XLSX: { bg: '#22C55E', text: '#FFFFFF', border: '#000000' },
  PPT: { bg: '#EF4444', text: '#FFFFFF', border: '#000000' },
};
