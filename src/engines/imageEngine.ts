import type { ConversionOptions, ConvertedResult } from '../types/conversion';
import { getBaseFilename } from '../utils/formatUtils';

export async function convertImage(
  file: File,
  targetFormat: string,
  options: ConversionOptions = {}
): Promise<ConvertedResult> {
  const target = targetFormat.toLowerCase().replace('.', '');
  const quality = options.imageQuality ?? 0.92;
  const bgFill = options.transparentBgFill || '#FFFFFF';

  let mimeType = 'image/png';
  if (target === 'jpg' || target === 'jpeg') {
    mimeType = 'image/jpeg';
  } else if (target === 'webp') {
    mimeType = 'image/webp';
  } else if (target === 'bmp') {
    mimeType = 'image/bmp';
  } else if (target === 'ico') {
    mimeType = 'image/x-icon';
  }

  // Handle SVG to Raster or Raster to Raster
  const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file.'));

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to decode image data. Please ensure it is a valid image.'));

      img.onload = () => {
        try {
          const width = img.naturalWidth || img.width || 800;
          const height = img.naturalHeight || img.height || 600;

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas 2D context is not available.');
          }

          // If converting to JPEG, paint background first to avoid black transparency
          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = bgFill;
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // If converting to ICO (favicon icon format)
          if (target === 'ico') {
            const iconCanvas = document.createElement('canvas');
            iconCanvas.width = 32;
            iconCanvas.height = 32;
            const iconCtx = iconCanvas.getContext('2d');
            if (iconCtx) {
              iconCtx.drawImage(canvas, 0, 0, 32, 32);
              iconCanvas.toBlob((blob) => {
                if (!blob) {
                  reject(new Error('ICO generation failed.'));
                  return;
                }
                const filename = `${getBaseFilename(file.name)}.ico`;
                const downloadUrl = URL.createObjectURL(blob);
                resolve({
                  blob,
                  downloadUrl,
                  filename,
                  size: blob.size,
                  mimeType: 'image/x-icon',
                });
              }, 'image/x-icon');
              return;
            }
          }

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error(`Failed to convert image to ${targetFormat.toUpperCase()}.`));
                return;
              }

              const filename = `${getBaseFilename(file.name)}.${target === 'jpeg' ? 'jpg' : target}`;
              const downloadUrl = URL.createObjectURL(blob);

              resolve({
                blob,
                downloadUrl,
                filename,
                size: blob.size,
                mimeType,
              });
            },
            mimeType,
            quality
          );
        } catch (err: any) {
          reject(new Error(err.message || 'Image conversion error.'));
        }
      };

      if (isSvg) {
        const svgBlob = new Blob([reader.result as string], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
      } else {
        img.src = reader.result as string;
      }
    };

    if (isSvg) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  });
}
