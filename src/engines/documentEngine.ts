import { jsPDF } from 'jspdf';
import { marked } from 'marked';
import Papa from 'papaparse';
import type { ConversionOptions, ConvertedResult } from '../types/conversion';
import { getBaseFilename } from '../utils/formatUtils';

export async function convertDocument(
  file: File,
  targetFormat: string,
  options: ConversionOptions = {}
): Promise<ConvertedResult> {
  const target = targetFormat.toLowerCase().replace('.', '');
  const inputExt = file.name.split('.').pop()?.toLowerCase() || '';
  const textContent = await file.text();

  if (!textContent.trim()) {
    throw new Error('The input document is empty.');
  }

  // 1. Plain Text to PDF
  if (target === 'pdf') {
    const doc = new jsPDF({
      orientation: options.pdfOrientation || 'portrait',
      unit: 'pt',
      format: options.pdfPageSize || 'a4',
    });

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxLineWidth = pageWidth - margin * 2;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(textContent, maxLineWidth);
    let cursorY = margin + 15;
    const lineHeight = 16;

    for (let i = 0; i < lines.length; i++) {
      if (cursorY + lineHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin + 15;
      }
      doc.text(lines[i], margin, cursorY);
      cursorY += lineHeight;
    }

    const blob = doc.output('blob');
    const filename = `${getBaseFilename(file.name)}.pdf`;
    const downloadUrl = URL.createObjectURL(blob);

    return {
      blob,
      downloadUrl,
      filename,
      size: blob.size,
      mimeType: 'application/pdf',
    };
  }

  // 2. Markdown to HTML
  if (target === 'html') {
    let bodyHtml = '';

    if (inputExt === 'md' || inputExt === 'markdown') {
      bodyHtml = await marked.parse(textContent);
    } else if (inputExt === 'csv' || inputExt === 'tsv') {
      const parsed = Papa.parse(textContent, { header: true, skipEmptyLines: true });
      if (parsed.data && parsed.data.length > 0) {
        const headers = Object.keys(parsed.data[0] as object);
        let table = '<table border="1" style="border-collapse: collapse; width: 100%; text-align: left; font-family: sans-serif;">\n<thead><tr style="background:#f4f4f4;">';
        headers.forEach((h) => (table += `<th style="padding: 8px;">${h}</th>`));
        table += '</tr></thead>\n<tbody>';
        parsed.data.forEach((row: any) => {
          table += '<tr>';
          headers.forEach((h) => (table += `<td style="padding: 8px; border: 1px solid #ddd;">${row[h] ?? ''}</td>`));
          table += '</tr>';
        });
        table += '</tbody></table>';
        bodyHtml = table;
      }
    } else {
      // Escape text content
      const safe = textContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      bodyHtml = `<pre style="white-space: pre-wrap; font-family: monospace; line-height: 1.5;">${safe}</pre>`;
    }

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${file.name}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      line-height: 1.6;
      color: #171717;
      background: #ffffff;
    }
    h1, h2, h3 { color: #111; }
    code { background: #f4f4f4; padding: 2px 5px; border-radius: 4px; }
    pre { background: #f8f8f8; padding: 15px; border-radius: 6px; overflow-x: auto; }
    blockquote { border-left: 4px solid #43D1BE; margin: 0; padding-left: 16px; color: #555; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const filename = `${getBaseFilename(file.name)}.html`;
    const downloadUrl = URL.createObjectURL(blob);

    return {
      blob,
      downloadUrl,
      filename,
      size: blob.size,
      mimeType: 'text/html',
    };
  }

  // 3. HTML to Markdown
  if (target === 'md' || target === 'markdown') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(textContent, 'text/html');

    function nodeToMarkdown(node: Node): string {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return '';

      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const children = Array.from(el.childNodes).map(nodeToMarkdown).join('');

      switch (tag) {
        case 'h1': return `# ${children}\n\n`;
        case 'h2': return `## ${children}\n\n`;
        case 'h3': return `### ${children}\n\n`;
        case 'h4': return `#### ${children}\n\n`;
        case 'p': return `${children}\n\n`;
        case 'b':
        case 'strong': return `**${children}**`;
        case 'i':
        case 'em': return `*${children}*`;
        case 'code': return `\`${children}\``;
        case 'pre': return `\`\`\`\n${children}\n\`\`\`\n\n`;
        case 'a': return `[${children}](${el.getAttribute('href') || ''})`;
        case 'li': return `- ${children}\n`;
        case 'ul':
        case 'ol': return `${children}\n`;
        case 'br': return `\n`;
        default: return children;
      }
    }

    const md = nodeToMarkdown(doc.body).trim();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const filename = `${getBaseFilename(file.name)}.md`;
    const downloadUrl = URL.createObjectURL(blob);

    return {
      blob,
      downloadUrl,
      filename,
      size: blob.size,
      mimeType: 'text/markdown',
    };
  }

  // 4. Any text document to TXT
  if (target === 'txt') {
    let cleanText = textContent;
    if (inputExt === 'html') {
      const doc = new DOMParser().parseFromString(textContent, 'text/html');
      cleanText = doc.body.textContent || '';
    }

    const blob = new Blob([cleanText], { type: 'text/plain;charset=utf-8' });
    const filename = `${getBaseFilename(file.name)}.txt`;
    const downloadUrl = URL.createObjectURL(blob);

    return {
      blob,
      downloadUrl,
      filename,
      size: blob.size,
      mimeType: 'text/plain',
    };
  }

  throw new Error(`Unsupported document conversion: ${inputExt.toUpperCase()} -> ${target.toUpperCase()}`);
}
