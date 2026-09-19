import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalGameProgress } from '../types/progress';

const PROGRESS_PREFIX = '@pocket_arcade_progress_';

export const getLocalProgress = async (gameId: string): Promise<LocalGameProgress> => {
  try {
    const raw = await AsyncStorage.getItem(`${PROGRESS_PREFIX}${gameId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error(`Error loading progress for ${gameId}:`, error);
  }

  // Default initial progress (Level 1 unlocked, Levels 2-5 locked)
  return {
    gameId,
    currentLevel: 1,
    completedLevels: [],
    highScore: 0,
    stars: {},
    lastPlayed: new Date().toISOString(),
  };
};

export const saveLocalProgress = async (
  gameId: string,
  level: number,
  score: number,
  starsEarned: number
): Promise<LocalGameProgress> => {
  const current = await getLocalProgress(gameId);

  const completedSet = new Set(current.completedLevels);
  completedSet.add(level);
  const completedLevels = Array.from(completedSet);

  const stars = { ...current.stars };
  stars[level] = Math.max(stars[level] || 0, starsEarned);

  const highScore = Math.max(current.highScore, score);
  const nextLevelUnlock = Math.max(current.currentLevel, level + 1);

  const updated: LocalGameProgress = {
    gameId,
    currentLevel: Math.min(nextLevelUnlock, 5),
    completedLevels,
    highScore,
    stars,
    lastPlayed: new Date().toISOString(),
  };

  try {
    await AsyncStorage.setItem(`${PROGRESS_PREFIX}${gameId}`, JSON.stringify(updated));
  } catch (error) {
    console.error(`Error saving progress for ${gameId}:`, error);
  }

  return updated;
};

export const getAllLocalProgress = async (): Promise<Record<string, LocalGameProgress>> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const progressKeys = keys.filter((k) => k.startsWith(PROGRESS_PREFIX));
    const items = await AsyncStorage.multiGet(progressKeys);

    const result: Record<string, LocalGameProgress> = {};
    for (const [key, val] of items) {
      if (val) {
        const gameId = key.replace(PROGRESS_PREFIX, '');
        result[gameId] = JSON.parse(val);
      }
    }
    return result;
  } catch (error) {
    console.error('Error fetching all progress:', error);
    return {};
  }
};
