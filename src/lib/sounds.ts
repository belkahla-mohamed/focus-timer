import { Howl } from 'howler';
import type { SoundName } from '@/types';

const createTone = (frequency: number, durationMs: number) => {
  const sampleRate = 8000;
  const samples = Math.floor((sampleRate * durationMs) / 1000);
  const dataSize = samples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let index = 0; index < samples; index += 1) {
    const envelope = 1 - index / samples;
    const sample = Math.sin((2 * Math.PI * frequency * index) / sampleRate) * envelope * 0.22;
    view.setInt16(44 + index * 2, sample * 32767, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return `data:audio/wav;base64,${window.btoa(binary)}`;
};

const soundSources: Record<SoundName, string> = {
  countdown: createTone(880, 140),
  'work-start': createTone(660, 220),
  'break-start': createTone(520, 260),
  'break-end': createTone(760, 240)
};

const sounds = new Map<SoundName, Howl>();

const getSound = (name: SoundName) => {
  const existingSound = sounds.get(name);

  if (existingSound) {
    return existingSound;
  }

  const sound = new Howl({
    src: [soundSources[name]],
    volume: name === 'countdown' ? 0.55 : 0.7,
    html5: false
  });

  sounds.set(name, sound);
  return sound;
};

export const playSound = (name: SoundName) => {
  try {
    getSound(name).play();
  } catch {
    // Audio should never block the timer state machine.
  }
};
