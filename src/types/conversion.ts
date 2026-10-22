export type CategoryId = 'images' | 'video' | 'audio' | 'documents' | 'data';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  badgeBg: string;
  accentBg: string;
  formats: string[];
}

export type ConversionStatus = 'idle' | 'analyzing' | 'converting' | 'success' | 'error';

export interface ConversionOptions {
  // Image options
  imageQuality?: number; // 0.1 to 1.0
  transparentBgFill?: string; // e.g. '#ffffff' for transparent PNG -> JPEG
  maxWidth?: number;
  maxHeight?: number;

  // Data options
  csvDelimiter?: string;
  prettyPrint?: boolean;
  indentSpaces?: number;

  // Document options
  pdfPageSize?: 'a4' | 'letter';
  pdfOrientation?: 'portrait' | 'landscape';

  // Audio options
  audioBitrate?: 128 | 192 | 256 | 320;
}

export interface CompatibilityEntry {
  inputFormat: string;
  outputFormat: string;
  category: CategoryId;
  engine: 'browser-canvas' | 'papaparse' | 'js-yaml' | 'jspdf' | 'marked' | 'webaudio' | 'custom-dom';
  label: string;
  verified: boolean;
  description?: string;
}

export interface ConvertedResult {
  blob: Blob;
  downloadUrl: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface FileMetadata {
  file: File;
  name: string;
  size: number;
  formattedSize: string;
  extension: string;
  mimeType: string;
  category: CategoryId;
  previewUrl?: string;
  dimensions?: { width: number; height: number };
  duration?: number;
  lineCount?: number;
}
