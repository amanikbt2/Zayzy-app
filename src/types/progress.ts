export interface LocalGameProgress {
  gameId: string;
  currentLevel: number;
  completedLevels: number[];
  highScore: number;
  stars: Record<number, number>; // level -> star count (1..3)
  lastPlayed: string;
}

export interface UserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  userId: string;
  username: string;
}
