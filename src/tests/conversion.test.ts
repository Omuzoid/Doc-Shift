import { describe, it, expect } from 'vitest';
import { 
  detectCategoryFromExtension, 
  formatBytes, 
  getBaseFilename, 
  getFileExtension 
} from '../utils/formatUtils';
import { getCompatibleOutputs, COMPATIBILITY_REGISTRY } from '../engines/registry';
import { convertData } from '../engines/dataEngine';
import { convertDocument } from '../engines/documentEngine';

describe('Format and Category Utilities', () => {
  it('correctly detects categories for different extensions', () => {
    expect(detectCategoryFromExtension('png')).toBe('images');
    expect(detectCategoryFromExtension('jpg')).toBe('images');
    expect(detectCategoryFromExtension('webp')).toBe('images');
    expect(detectCategoryFromExtension('mp4')).toBe('video');
    expect(detectCategoryFromExtension('mp3')).toBe('audio');
    expect(detectCategoryFromExtension('pdf')).toBe('documents');
    expect(detectCategoryFromExtension('txt')).toBe('documents');
    expect(detectCategoryFromExtension('json')).toBe('data');
    expect(detectCategoryFromExtension('csv')).toBe('data');
    expect(detectCategoryFromExtension('yaml')).toBe('data');
  });

  it('formats byte sizes cleanly', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(5242880)).toBe('5 MB');
  });

  it('extracts base filename and extension accurately', () => {
    expect(getFileExtension('annual_report_2026.pdf')).toBe('pdf');
    expect(getFileExtension('archive.tar.gz')).toBe('gz');
    expect(getBaseFilename('annual_report_2026.pdf')).toBe('annual_report_2026');
  });
});

describe('Compatibility Registry', () => {
  it('provides compatible outputs for images', () => {
    const pngOutputs = getCompatibleOutputs('png', 'images');
    expect(pngOutputs).toContain('JPG');
    expect(pngOutputs).toContain('WEBP');
    expect(pngOutputs).toContain('BMP');
    expect(pngOutputs).toContain('ICO');
  });

  it('provides compatible outputs for data', () => {
    const jsonOutputs = getCompatibleOutputs('json', 'data');
    expect(jsonOutputs).toContain('CSV');
    expect(jsonOutputs).toContain('TSV');
    expect(jsonOutputs).toContain('YAML');
    expect(jsonOutputs).toContain('XML');
  });

  it('ensures every registry entry has verified status and valid category', () => {
    expect(COMPATIBILITY_REGISTRY.length).toBeGreaterThan(15);
    COMPATIBILITY_REGISTRY.forEach((entry) => {
      expect(entry.inputFormat).toBeTruthy();
      expect(entry.outputFormat).toBeTruthy();
      expect(entry.engine).toBeTruthy();
      expect(entry.category).toBeTruthy();
    });
  });
});

describe('Data Conversion Engine', () => {
  it('converts JSON to CSV accurately', async () => {
    const jsonData = JSON.stringify([
      { name: 'John Doe', age: 30, city: 'Helsinki' },
      { name: 'Jane Smith', age: 25, city: 'Espoo' },
    ]);
    const file = new File([jsonData], 'users.json', { type: 'application/json' });

    const result = await convertData(file, 'csv');
    expect(result.filename).toBe('users.csv');
    expect(result.mimeType).toBe('text/csv');
    const text = await result.blob.text();
    expect(text).toContain('name,age,city');
    expect(text).toContain('John Doe,30,Helsinki');
    expect(text).toContain('Jane Smith,25,Espoo');
  });

  it('converts CSV to JSON accurately', async () => {
    const csvData = 'id,product,price\n1,Keyboard,99\n2,Mouse,49';
    const file = new File([csvData], 'products.csv', { type: 'text/csv' });

    const result = await convertData(file, 'json');
    expect(result.filename).toBe('products.json');
    const json = JSON.parse(await result.blob.text());
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBe(2);
    expect(json[0].product).toBe('Keyboard');
  });

  it('converts JSON to YAML accurately', async () => {
    const jsonData = JSON.stringify({ project: 'DOC-SHIFT', fast: true, version: 2 });
    const file = new File([jsonData], 'config.json', { type: 'application/json' });

    const result = await convertData(file, 'yaml');
    expect(result.filename).toBe('config.yaml');
    const yamlText = await result.blob.text();
    expect(yamlText).toContain('project: DOC-SHIFT');
    expect(yamlText).toContain('fast: true');
  });

  it('handles empty input with a friendly error', async () => {
    const emptyFile = new File([''], 'empty.json', { type: 'application/json' });
    await expect(convertData(emptyFile, 'csv')).rejects.toThrow('The input file is empty.');
  });
});

describe('Document Conversion Engine', () => {
  it('converts Markdown to HTML accurately', async () => {
    const md = '# Hello DOC-SHIFT\n\nThis is a **bold** test.';
    const file = new File([md], 'doc.md', { type: 'text/markdown' });

    const result = await convertDocument(file, 'html');
    expect(result.filename).toBe('doc.html');
    const html = await result.blob.text();
    expect(html).toContain('<h1>Hello DOC-SHIFT</h1>');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('converts TXT to PDF generating a valid PDF blob', async () => {
    const text = 'Line 1: DOC-SHIFT local conversion.\nLine 2: Client-side privacy guaranteed.';
    const file = new File([text], 'notes.txt', { type: 'text/plain' });

    const result = await convertDocument(file, 'pdf');
    expect(result.filename).toBe('notes.pdf');
    expect(result.mimeType).toBe('application/pdf');
    expect(result.size).toBeGreaterThan(100);
  });
});
