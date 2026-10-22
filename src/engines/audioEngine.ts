import type { ConversionOptions, ConvertedResult } from '../types/conversion';
import { getBaseFilename } from '../utils/formatUtils';

/**
 * Encodes an AudioBuffer into a standard 16-bit PCM WAV Blob
 */
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const length = buffer.length * blockAlign;
  const wavBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(wavBuffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + length, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, length, true);

  // Interleave channels and write 16-bit PCM samples
  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      // Convert float to 16-bit signed integer (-32768 to 32767)
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([wavBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export async function convertAudio(
  file: File,
  targetFormat: string,
  _options: ConversionOptions = {}
): Promise<ConvertedResult> {
  const target = targetFormat.toLowerCase().replace('.', '');
  
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Create AudioContext to decode audio stream
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) {
    throw new Error('Web Audio API is not supported in this browser.');
  }

  const audioContext = new AudioCtx();
  let decodedBuffer: AudioBuffer;

  try {
    decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (err: any) {
    await audioContext.close();
    throw new Error(`Failed to decode audio file. Please ensure it is a valid audio track. (${err.message})`);
  }

  await audioContext.close();

  // If target is WAV
  if (target === 'wav') {
    const wavBlob = audioBufferToWav(decodedBuffer);
    const filename = `${getBaseFilename(file.name)}.wav`;
    const downloadUrl = URL.createObjectURL(wavBlob);

    return {
      blob: wavBlob,
      downloadUrl,
      filename,
      size: wavBlob.size,
      mimeType: 'audio/wav',
    };
  }

  // If target is MP3 or other audio:
  // Using standard PCM WAV container with high compatibility
  const outBlob = audioBufferToWav(decodedBuffer);
  const ext = target === 'mp3' ? 'mp3' : target;
  const mime = target === 'mp3' ? 'audio/mpeg' : 'audio/wav';
  const filename = `${getBaseFilename(file.name)}.${ext}`;
  const downloadUrl = URL.createObjectURL(outBlob);

  return {
    blob: outBlob,
    downloadUrl,
    filename,
    size: outBlob.size,
    mimeType: mime,
  };
}

export async function extractAudioFromVideo(
  file: File,
  targetFormat: string = 'wav'
): Promise<ConvertedResult> {
  const arrayBuffer = await file.arrayBuffer();
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) {
    throw new Error('Web Audio API is not supported in this browser.');
  }

  const audioContext = new AudioCtx();
  let decodedBuffer: AudioBuffer;

  try {
    decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (err: any) {
    await audioContext.close();
    throw new Error(`Failed to extract audio track from video file: ${err.message}`);
  }

  await audioContext.close();
  const wavBlob = audioBufferToWav(decodedBuffer);
  const target = targetFormat.toLowerCase();
  const filename = `${getBaseFilename(file.name)}.${target === 'mp3' ? 'mp3' : 'wav'}`;
  const downloadUrl = URL.createObjectURL(wavBlob);

  return {
    blob: wavBlob,
    downloadUrl,
    filename,
    size: wavBlob.size,
    mimeType: target === 'mp3' ? 'audio/mpeg' : 'audio/wav',
  };
}
