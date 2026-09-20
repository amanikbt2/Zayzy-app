import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameContentPackage } from '../types/game';

const DOWNLOAD_PREFIX = '@pocket_arcade_download_';
const UNINSTALLED_KEY = '@pocket_arcade_uninstalled_ids';

export const saveDownloadedContent = async (gameId: string, content: GameContentPackage): Promise<void> => {
  try {
    await AsyncStorage.setItem(`${DOWNLOAD_PREFIX}${gameId}`, JSON.stringify(content));
    await clearUninstalledMark(gameId);
  } catch (error) {
    console.error(`Error saving download for ${gameId}:`, error);
  }
};

export const getDownloadedContent = async (gameId: string): Promise<GameContentPackage | null> => {
  try {
    const raw = await AsyncStorage.getItem(`${DOWNLOAD_PREFIX}${gameId}`);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.error(`Error fetching downloaded content for ${gameId}:`, error);
  }
  return null;
};

export const deleteDownloadedContent = async (gameId: string): Promise<void> => {
  try {
    await markGameAsUninstalled(gameId);
  } catch (error) {
    console.error(`Error deleting content for ${gameId}:`, error);
  }
};

export const getDownloadedGameIds = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter((k) => k.startsWith(DOWNLOAD_PREFIX)).map((k) => k.replace(DOWNLOAD_PREFIX, ''));
  } catch (error) {
    console.error('Error fetching downloaded game IDs:', error);
    return [];
  }
};

export const getUninstalledGameIds = async (): Promise<string[]> => {
  try {
    const raw = await AsyncStorage.getItem(UNINSTALLED_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading uninstalled game IDs:', error);
  }
  return [];
};

export const markGameAsUninstalled = async (gameId: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${DOWNLOAD_PREFIX}${gameId}`);
    const uninstalled = await getUninstalledGameIds();
    if (!uninstalled.includes(gameId)) {
      uninstalled.push(gameId);
      await AsyncStorage.setItem(UNINSTALLED_KEY, JSON.stringify(uninstalled));
    }
  } catch (error) {
    console.error(`Error uninstalling game ${gameId}:`, error);
  }
};

export const clearUninstalledMark = async (gameId: string): Promise<void> => {
  try {
    const uninstalled = await getUninstalledGameIds();
    const updated = uninstalled.filter((id) => id !== gameId);
    await AsyncStorage.setItem(UNINSTALLED_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error(`Error clearing uninstalled mark for ${gameId}:`, error);
  }
};
