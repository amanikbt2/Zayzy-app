import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../types/progress';

const SETTINGS_KEY = '@pocket_arcade_settings';
const FAVORITES_KEY = '@pocket_arcade_favorites';

export const getSettings = async (): Promise<UserSettings> => {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }

  // Generate synthetic user ID if none exists
  const defaultUserId = 'user_' + Math.random().toString(36).substring(2, 9);
  return {
    soundEnabled: true,
    musicEnabled: true,
    hapticsEnabled: true,
    userId: defaultUserId,
    username: 'ArcadePlayer',
  };
};

export const saveSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
  return updated;
};

export const getFavorites = async (): Promise<string[]> => {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
  return [];
};

export const toggleFavorite = async (gameId: string): Promise<string[]> => {
  const current = await getFavorites();
  const index = current.indexOf(gameId);
  let updated: string[];
  if (index >= 0) {
    updated = current.filter((id) => id !== gameId);
  } else {
    updated = [...current, gameId];
  }
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
  return updated;
};
