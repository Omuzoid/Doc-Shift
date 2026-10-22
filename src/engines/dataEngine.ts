import Papa from 'papaparse';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';
import type { ConversionOptions, ConvertedResult } from '../types/conversion';
import { getBaseFilename } from '../utils/formatUtils';

/**
 * Converts a JSON object/array to formatted XML string
 */
function jsonToXml(obj: any, rootName = 'root', indent = 2): string {
  const spaces = ' '.repeat(indent);

  function toXml(val: any, name: string, level: number): string {
    const currentIndent = ' '.repeat(level * indent);
    if (val === null || val === undefined) {
      return `${currentIndent}<${name}/>\n`;
    }

    if (Array.isArray(val)) {
      return val.map((item) => toXml(item, 'item', level)).join('');
    }

    if (typeof val === 'object') {
      let xml = `${currentIndent}<${name}>\n`;
      for (const key of Object.keys(val)) {
        xml += toXml(val[key], key.replace(/[^a-zA-Z0-9_-]/g, '_'), level + 1);
      }
      xml += `${currentIndent}</${name}>\n`;
      return xml;
    }

    // Escape XML entities
    const str = String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    return `${currentIndent}<${name}>${str}</${name}>\n`;
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<${rootName}>\n`;
  if (Array.isArray(obj)) {
    xml += obj.map((item) => toXml(item, 'item', 1)).join('');
  } else if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      xml += toXml(obj[key], key.replace(/[^a-zA-Z0-9_-]/g, '_'), 1);
    }
  } else {
    xml += `${spaces}<value>${String(obj)}</value>\n`;
  }
  xml += `</${rootName}>`;
  return xml;
}

/**
 * Converts XML DOM element to JavaScript Object
 */
function xmlElementToJson(node: Element): any {
  // If node has only text content
  if (node.children.length === 0) {
    const text = node.textContent?.trim() || '';
    if (text === 'true') return true;
    if (text === 'false') return false;
    if (!isNaN(Number(text)) && text !== '') return Number(text);
    return text;
  }

  const obj: Record<string, any> = {};
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const nodeName = child.nodeName;
    const childData = xmlElementToJson(child);

    if (obj[nodeName] !== undefined) {
      if (!Array.isArray(obj[nodeName])) {
        obj[nodeName] = [obj[nodeName]];
      }
      obj[nodeName].push(childData);
    } else {
      obj[nodeName] = childData;
    }
  }
  return obj;
}

export async function convertData(
  file: File,
  targetFormat: string,
  options: ConversionOptions = {}
): Promise<ConvertedResult> {
  const target = targetFormat.toLowerCase().replace('.', '');
  const inputExt = file.name.split('.').pop()?.toLowerCase() || '';

  const textContent = await file.text();
  if (!textContent.trim()) {
    throw new Error('The input file is empty.');
  }

  let intermediateData: any = null;

  // Step 1: Parse input into JS object/array
  try {
    if (inputExt === 'json') {
      intermediateData = JSON.parse(textContent);
    } else if (inputExt === 'csv' || inputExt === 'tsv') {
      const parsed = Papa.parse(textContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimiter: inputExt === 'tsv' ? '\t' : (options.csvDelimiter || undefined),
      });
      if (parsed.errors && parsed.errors.length > 0 && parsed.data.length === 0) {
        throw new Error(`CSV parsing error: ${parsed.errors[0].message}`);
      }
      intermediateData = parsed.data;
    } else if (inputExt === 'yaml' || inputExt === 'yml') {
      intermediateData = yamlLoad(textContent);
    } else if (inputExt === 'xml') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(textContent, 'application/xml');
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error(`Invalid XML structure: ${parseError.textContent?.slice(0, 150)}`);
      }
      intermediateData = xmlElementToJson(doc.documentElement);
    } else {
      throw new Error(`Unsupported input data format: ${inputExt.toUpperCase()}`);
    }
  } catch (err: any) {
    throw new Error(`Failed to parse ${inputExt.toUpperCase()}: ${err.message}`);
  }

  // Step 2: Serialize intermediateData to targetFormat
  let outputText = '';
  let mimeType = 'text/plain';

  try {
    if (target === 'json') {
      const indent = options.prettyPrint !== false ? (options.indentSpaces || 2) : 0;
      outputText = JSON.stringify(intermediateData, null, indent);
      mimeType = 'application/json';
    } else if (target === 'csv' || target === 'tsv') {
      // If intermediateData is an object but not array, wrap it
      let rowsToUnparse = intermediateData;
      if (!Array.isArray(intermediateData)) {
        rowsToUnparse = [intermediateData];
      }
      outputText = Papa.unparse(rowsToUnparse, {
        delimiter: target === 'tsv' ? '\t' : (options.csvDelimiter || ','),
        quotes: false,
      });
      mimeType = target === 'tsv' ? 'text/tab-separated-values' : 'text/csv';
    } else if (target === 'yaml' || target === 'yml') {
      outputText = yamlDump(intermediateData, {
        indent: options.indentSpaces || 2,
        lineWidth: -1,
      });
      mimeType = 'application/x-yaml';
    } else if (target === 'xml') {
      outputText = jsonToXml(intermediateData, 'root', options.indentSpaces || 2);
      mimeType = 'application/xml';
    } else {
      throw new Error(`Unsupported target data format: ${target.toUpperCase()}`);
    }
  } catch (err: any) {
    throw new Error(`Failed to serialize to ${target.toUpperCase()}: ${err.message}`);
  }

  const blob = new Blob([outputText], { type: `${mimeType};charset=utf-8` });
  const filename = `${getBaseFilename(file.name)}.${target}`;
  const downloadUrl = URL.createObjectURL(blob);

  return {
    blob,
    downloadUrl,
    filename,
    size: blob.size,
    mimeType,
  };
}
