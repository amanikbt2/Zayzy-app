import { fetchApi } from './api';
import { GameItem, GameContentPackage } from '../types/game';
import { LOCAL_GAME_CATALOG, BUNDLED_CONTENT_PACKAGES } from '../games/localCatalog';
import { DOWNLOADABLE_PACKAGES } from '../games/downloadablePackages';
import { getDownloadedContent, saveDownloadedContent, deleteDownloadedContent, getDownloadedGameIds } from '../storage/downloads';

export class GameCatalogService {
  public static async getGames(): Promise<GameItem[]> {
    const downloadedIds = await getDownloadedGameIds();
    const remote = await fetchApi('/games');

    if (remote && remote.success && Array.isArray(remote.data) && remote.data.length > 0) {
      return remote.data.map((item: GameItem) => ({
        ...item,
        isDownloaded: BUNDLED_CONTENT_PACKAGES[item.gameId] ? true : downloadedIds.includes(item.gameId),
      }));
    }

    // Fallback offline catalog with accurate local download states
    return LOCAL_GAME_CATALOG.map((item: GameItem) => ({
      ...item,
      isDownloaded: BUNDLED_CONTENT_PACKAGES[item.gameId] ? true : downloadedIds.includes(item.gameId),
    }));
  }

  public static async getGame(gameId: string): Promise<GameItem | null> {
    const downloadedIds = await getDownloadedGameIds();
    const remote = await fetchApi(`/games/${gameId}`);
    if (remote && remote.success && remote.data) {
      return {
        ...remote.data,
        isDownloaded: BUNDLED_CONTENT_PACKAGES[gameId] ? true : downloadedIds.includes(gameId),
      };
    }
    const local = LOCAL_GAME_CATALOG.find((g) => g.gameId === gameId);
    if (!local) return null;
    return {
      ...local,
      isDownloaded: BUNDLED_CONTENT_PACKAGES[gameId] ? true : downloadedIds.includes(gameId),
    };
  }

  public static async getFeaturedGames(): Promise<GameItem[]> {
    const all = await this.getGames();
    return all.filter((g) => g.isFeatured);
  }

  public static async getNewGames(): Promise<GameItem[]> {
    const all = await this.getGames();
    return all.filter((g) => g.isNew);
  }

  public static async getGameContent(gameId: string): Promise<GameContentPackage> {
    // 1. Check local download storage first
    const downloaded = await getDownloadedContent(gameId);
    if (downloaded) {
      return downloaded;
    }

    // 2. Check bundled local content fallback
    if (BUNDLED_CONTENT_PACKAGES[gameId]) {
      return BUNDLED_CONTENT_PACKAGES[gameId];
    }

    // 3. Check downloadable packages catalog
    if (DOWNLOADABLE_PACKAGES[gameId]) {
      return DOWNLOADABLE_PACKAGES[gameId];
    }

    // 4. Try fetching from remote API backend if available
    const remote = await fetchApi(`/games/${gameId}/content`);
    if (remote && remote.success && remote.data) {
      await saveDownloadedContent(gameId, remote.data);
      return remote.data;
    }

    throw new Error(`Content package not found for game ${gameId}`);
  }

  public static async downloadGamePackage(
    gameId: string,
    onProgress?: (progress: number) => void
  ): Promise<GameContentPackage> {
    // Report initial downloading
    onProgress?.(10);

    let pkg: GameContentPackage | null = null;

    // 1. Try remote API backend
    const remote = await fetchApi(`/games/${gameId}/content`);
    onProgress?.(40);

    if (remote && remote.success && remote.data) {
      pkg = remote.data;
    } else if (DOWNLOADABLE_PACKAGES[gameId]) {
      pkg = DOWNLOADABLE_PACKAGES[gameId];
    } else if (BUNDLED_CONTENT_PACKAGES[gameId]) {
      pkg = BUNDLED_CONTENT_PACKAGES[gameId];
    }

    onProgress?.(75);

    if (!pkg) {
      throw new Error(`Failed to download package for game ${gameId}`);
    }

    // Save package locally for offline play
    await saveDownloadedContent(gameId, pkg);
    onProgress?.(100);

    return pkg;
  }

  public static async deleteGamePackage(gameId: string): Promise<void> {
    await deleteDownloadedContent(gameId);
  }
}
