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

export interface UserProfile {
  userId: string;
  googleId?: string;
  username: string;
  email?: string;
  avatar?: string;
  phoneNumber?: string;
  course?: string;
  campus?: string;
  bio?: string;
  isProfileComplete?: boolean;
  isLoggedIn?: boolean;
}
