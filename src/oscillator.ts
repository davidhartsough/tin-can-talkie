let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gain: GainNode | null = null;

export function initOsc() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    audioCtx.resume().catch(() => {});
  }
  if (!oscillator) {
    oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
  }
  if (!gain) {
    gain = audioCtx.createGain();
  }
  oscillator.connect(gain).connect(audioCtx.destination);
}
export function playTone(up = true) {
  if (!audioCtx || !oscillator || !gain) return;
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
  oscillator.start(t);
  oscillator.stop(t + 0.4);
}
