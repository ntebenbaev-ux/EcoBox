let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playEcoSound(kind: 'qr' | 'earn' | 'spend' | 'error' | 'win', enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes =
      kind === 'qr'
        ? [880, 1174.66]
        : kind === 'earn'
          ? [523.25, 659.25, 783.99]
          : kind === 'win'
            ? [523.25, 659.25, 783.99, 1046.5]
            : kind === 'error'
              ? [280, 220]
              : [587.33, 440];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === 'qr' ? 'sine' : kind === 'error' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.075);
      gain.gain.setValueAtTime(0.001, now + idx * 0.075);
      gain.gain.exponentialRampToValueAtTime(kind === 'error' ? 0.05 : 0.09, now + idx * 0.075 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.075 + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.075);
      osc.stop(now + idx * 0.075 + 0.18);
    });
  } catch {
    // Ignore audio context restrictions
  }
}
