let audioCtx: AudioContext | null = null;

export async function initOsc() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    await audioCtx.resume();
  }
}
export function playTone(up = true) {
  if (!audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  oscillator.type = "sine";
  const gain = audioCtx.createGain();
  const t = audioCtx.currentTime;
  const low = 880;
  const high = 1175;
  const start = up ? low : high;
  const end = up ? high : low;
  oscillator.frequency.setValueAtTime(start, t);
  oscillator.frequency.setValueAtTime(end, t + 0.12);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  oscillator.connect(gain).connect(audioCtx.destination);
  oscillator.start(t);
  oscillator.stop(t + 0.4);
}
