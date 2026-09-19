import { Platform } from 'react-native';
import { getSettings } from '../storage/settings';

class SoundService {
  private audioCtx: any = null;

  constructor() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  private async isSoundEnabled(): Promise<boolean> {
    const settings = await getSettings();
    return settings.soundEnabled;
  }

  private async isMusicEnabled(): Promise<boolean> {
    const settings = await getSettings();
    return settings.musicEnabled;
  }

  public async playTap(): Promise<void> {
    if (!(await this.isSoundEnabled())) return;
    this.playTone(600, 0.05, 'sine');
  }

  public async playPop(): Promise<void> {
    if (!(await this.isSoundEnabled())) return;
    this.playFrequencySweep(400, 800, 0.08);
  }

  public async playMatch(): Promise<void> {
    if (!(await this.isSoundEnabled())) return;
    this.playTone(523.25, 0.1, 'triangle'); // C5
    setTimeout(() => this.playTone(659.25, 0.1, 'triangle'), 60); // E5
    setTimeout(() => this.playTone(783.99, 0.15, 'triangle'), 120); // G5
  }

  public async playSwap(): Promise<void> {
    if (!(await this.isSoundEnabled())) return;
    this.playFrequencySweep(300, 500, 0.06);
  }

  public async playVictory(): Promise<void> {
    if (!(await this.isSoundEnabled())) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine'), idx * 120);
    });
  }

  public async playGameOver(): Promise<void> {
    if (!(await this.isSoundEnabled())) return;
    const notes = [400, 350, 300, 250];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.25, 'sawtooth'), idx * 150);
    });
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (err) {
      // Audio context error guard
    }
  }

  private playFrequencySweep(startFreq: number, endFreq: number, duration: number) {
    if (!this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.frequency.setValueAtTime(startFreq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (err) {
      // Audio sweep error guard
    }
  }
}

export const soundService = new SoundService();
