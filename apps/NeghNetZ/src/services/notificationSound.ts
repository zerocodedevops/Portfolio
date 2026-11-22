let messageSoundEnabled = true;
let audioContext: AudioContext | null = null;

export function isMessageSoundEnabled() {
  return messageSoundEnabled;
}

export function setMessageSoundEnabled(enabled: boolean) {
  messageSoundEnabled = enabled;
}

function getAudioContext() {
  if (typeof window === 'undefined' || !window.AudioContext) return null;
  audioContext ||= new window.AudioContext();
  return audioContext;
}

export function unlockMessageSound() {
  const context = getAudioContext();
  if (context?.state === 'suspended') void context.resume().catch(() => undefined);
}

export function playMessageSound() {
  const context = getAudioContext();
  if (!context) return;

  const play = () => {
    const now = context.currentTime;
    [660, 880].forEach((frequency, index) => {
      const start = now + index * 0.12;
      const oscillator = context.createOscillator();
      const volume = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      volume.gain.setValueAtTime(0.0001, start);
      volume.gain.exponentialRampToValueAtTime(0.035, start + 0.015);
      volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.1);
      oscillator.connect(volume);
      volume.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.11);
    });
  };

  if (context.state === 'running') play();
  else void context.resume().then(play).catch(() => undefined);
}
