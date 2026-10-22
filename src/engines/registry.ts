import type { CategoryId, CompatibilityEntry, ConversionOptions, ConvertedResult } from '../types/conversion';
import { convertImage } from './imageEngine';
import { convertData } from './dataEngine';
import { convertDocument } from './documentEngine';
import { convertAudio, extractAudioFromVideo } from './audioEngine';
import { detectCategoryFromExtension } from '../utils/formatUtils';

export const COMPATIBILITY_REGISTRY: CompatibilityEntry[] = [
  // Images
  { inputFormat: 'png', outputFormat: 'jpg', category: 'images', engine: 'browser-canvas', label: 'PNG to JPG', verified: true },
  { inputFormat: 'png', outputFormat: 'webp', category: 'images', engine: 'browser-canvas', label: 'PNG to WebP', verified: true },
  { inputFormat: 'png', outputFormat: 'bmp', category: 'images', engine: 'browser-canvas', label: 'PNG to BMP', verified: true },
  { inputFormat: 'png', outputFormat: 'ico', category: 'images', engine: 'browser-canvas', label: 'PNG to ICO', verified: true },
  { inputFormat: 'jpg', outputFormat: 'png', category: 'images', engine: 'browser-canvas', label: 'JPG to PNG', verified: true },
  { inputFormat: 'jpg', outputFormat: 'webp', category: 'images', engine: 'browser-canvas', label: 'JPG to WebP', verified: true },
  { inputFormat: 'jpg', outputFormat: 'bmp', category: 'images', engine: 'browser-canvas', label: 'JPG to BMP', verified: true },
  { inputFormat: 'jpg', outputFormat: 'ico', category: 'images', engine: 'browser-canvas', label: 'JPG to ICO', verified: true },
  { inputFormat: 'jpeg', outputFormat: 'png', category: 'images', engine: 'browser-canvas', label: 'JPEG to PNG', verified: true },
  { inputFormat: 'jpeg', outputFormat: 'webp', category: 'images', engine: 'browser-canvas', label: 'JPEG to WebP', verified: true },
  { inputFormat: 'webp', outputFormat: 'png', category: 'images', engine: 'browser-canvas', label: 'WebP to PNG', verified: true },
  { inputFormat: 'webp', outputFormat: 'jpg', category: 'images', engine: 'browser-canvas', label: 'WebP to JPG', verified: true },
  { inputFormat: 'bmp', outputFormat: 'png', category: 'images', engine: 'browser-canvas', label: 'BMP to PNG', verified: true },
  { inputFormat: 'bmp', outputFormat: 'jpg', category: 'images', engine: 'browser-canvas', label: 'BMP to JPG', verified: true },
  { inputFormat: 'bmp', outputFormat: 'webp', category: 'images', engine: 'browser-canvas', label: 'BMP to WebP', verified: true },
  { inputFormat: 'svg', outputFormat: 'png', category: 'images', engine: 'browser-canvas', label: 'SVG to PNG', verified: true },
  { inputFormat: 'svg', outputFormat: 'jpg', category: 'images', engine: 'browser-canvas', label: 'SVG to JPG', verified: true },
  { inputFormat: 'svg', outputFormat: 'webp', category: 'images', engine: 'browser-canvas', label: 'SVG to WebP', verified: true },
  { inputFormat: 'ico', outputFormat: 'png', category: 'images', engine: 'browser-canvas', label: 'ICO to PNG', verified: true },
  
  // Data
  { inputFormat: 'json', outputFormat: 'csv', category: 'data', engine: 'papaparse', label: 'JSON to CSV', verified: true },
  { inputFormat: 'json', outputFormat: 'tsv', category: 'data', engine: 'papaparse', label: 'JSON to TSV', verified: true },
  { inputFormat: 'json', outputFormat: 'yaml', category: 'data', engine: 'js-yaml', label: 'JSON to YAML', verified: true },
  { inputFormat: 'json', outputFormat: 'xml', category: 'data', engine: 'custom-dom', label: 'JSON to XML', verified: true },
  { inputFormat: 'csv', outputFormat: 'json', category: 'data', engine: 'papaparse', label: 'CSV to JSON', verified: true },
  { inputFormat: 'csv', outputFormat: 'tsv', category: 'data', engine: 'papaparse', label: 'CSV to TSV', verified: true },
  { inputFormat: 'csv', outputFormat: 'yaml', category: 'data', engine: 'js-yaml', label: 'CSV to YAML', verified: true },
  { inputFormat: 'csv', outputFormat: 'xml', category: 'data', engine: 'custom-dom', label: 'CSV to XML', verified: true },
  { inputFormat: 'tsv', outputFormat: 'json', category: 'data', engine: 'papaparse', label: 'TSV to JSON', verified: true },
  { inputFormat: 'tsv', outputFormat: 'csv', category: 'data', engine: 'papaparse', label: 'TSV to CSV', verified: true },
  { inputFormat: 'yaml', outputFormat: 'json', category: 'data', engine: 'js-yaml', label: 'YAML to JSON', verified: true },
  { inputFormat: 'yaml', outputFormat: 'csv', category: 'data', engine: 'papaparse', label: 'YAML to CSV', verified: true },
  { inputFormat: 'yml', outputFormat: 'json', category: 'data', engine: 'js-yaml', label: 'YAML to JSON', verified: true },
  { inputFormat: 'xml', outputFormat: 'json', category: 'data', engine: 'custom-dom', label: 'XML to JSON', verified: true },
  { inputFormat: 'xml', outputFormat: 'csv', category: 'data', engine: 'papaparse', label: 'XML to CSV', verified: true },

  // Documents
  { inputFormat: 'txt', outputFormat: 'pdf', category: 'documents', engine: 'jspdf', label: 'TXT to PDF', verified: true },
  { inputFormat: 'txt', outputFormat: 'html', category: 'documents', engine: 'custom-dom', label: 'TXT to HTML', verified: true },
  { inputFormat: 'md', outputFormat: 'html', category: 'documents', engine: 'marked', label: 'Markdown to HTML', verified: true },
  { inputFormat: 'markdown', outputFormat: 'html', category: 'documents', engine: 'marked', label: 'Markdown to HTML', verified: true },
  { inputFormat: 'html', outputFormat: 'md', category: 'documents', engine: 'custom-dom', label: 'HTML to Markdown', verified: true },
  { inputFormat: 'html', outputFormat: 'txt', category: 'documents', engine: 'custom-dom', label: 'HTML to Text', verified: true },

  // Audio
  { inputFormat: 'wav', outputFormat: 'mp3', category: 'audio', engine: 'webaudio', label: 'WAV to MP3', verified: true },
  { inputFormat: 'mp3', outputFormat: 'wav', category: 'audio', engine: 'webaudio', label: 'MP3 to WAV', verified: true },
  { inputFormat: 'ogg', outputFormat: 'wav', category: 'audio', engine: 'webaudio', label: 'OGG to WAV', verified: true },
  { inputFormat: 'aac', outputFormat: 'wav', category: 'audio', engine: 'webaudio', label: 'AAC to WAV', verified: true },
  { inputFormat: 'm4a', outputFormat: 'wav', category: 'audio', engine: 'webaudio', label: 'M4A to WAV', verified: true },

  // Video Audio Extraction
  { inputFormat: 'mp4', outputFormat: 'wav', category: 'video', engine: 'webaudio', label: 'MP4 to WAV (Audio)', verified: true },
  { inputFormat: 'mp4', outputFormat: 'mp3', category: 'video', engine: 'webaudio', label: 'MP4 to MP3 (Audio)', verified: true },
  { inputFormat: 'webm', outputFormat: 'wav', category: 'video', engine: 'webaudio', label: 'WebM to WAV (Audio)', verified: true },
  { inputFormat: 'webm', outputFormat: 'mp3', category: 'video', engine: 'webaudio', label: 'WebM to MP3 (Audio)', verified: true },
];

/**
 * Get all compatible output formats for a given input format and category
 */
export function getCompatibleOutputs(inputExt: string, category?: CategoryId): string[] {
  const cleanExt = inputExt.toLowerCase().replace('.', '');
  const matches = COMPATIBILITY_REGISTRY.filter((entry) => {
    const extMatch = entry.inputFormat.toLowerCase() === cleanExt;
    if (category) {
      return extMatch && entry.category === category;
    }
    return extMatch;
  });

  const uniqueOutputs = Array.from(new Set(matches.map((m) => m.outputFormat.toUpperCase())));
  return uniqueOutputs;
}

/**
 * Execute file conversion based on file type and target format
 */
export async function executeConversion(
  file: File,
  targetFormat: string,
  options: ConversionOptions = {}
): Promise<ConvertedResult> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const cleanTarget = targetFormat.toLowerCase().replace('.', '');
  const category = detectCategoryFromExtension(ext);

  if (category === 'images') {
    return await convertImage(file, cleanTarget, options);
  }

  if (category === 'data') {
    return await convertData(file, cleanTarget, options);
  }

  if (category === 'documents') {
    return await convertDocument(file, cleanTarget, options);
  }

  if (category === 'audio') {
    return await convertAudio(file, cleanTarget, options);
  }

  if (category === 'video') {
    if (cleanTarget === 'wav' || cleanTarget === 'mp3') {
      return await extractAudioFromVideo(file, cleanTarget);
    }
  }

  throw new Error(`Conversion from .${ext.toUpperCase()} to .${cleanTarget.toUpperCase()} is not currently supported.`);
}
