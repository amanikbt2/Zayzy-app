import { fetchApi } from './api';
import { GameItem, GameContentPackage } from '../types/game';
import { LOCAL_GAME_CATALOG, BUNDLED_CONTENT_PACKAGES } from '../games/localCatalog';
import { DOWNLOADABLE_PACKAGES } from '../games/downloadablePackages';
import { getDownloadedContent, saveDownloadedContent, deleteDownloadedContent, getDownloadedGameIds, getUninstalledGameIds } from '../storage/downloads';

export class GameCatalogService {
  public static async getGames(): Promise<GameItem[]> {
    const downloadedIds = await getDownloadedGameIds();
    const uninstalledIds = await getUninstalledGameIds();

    return LOCAL_GAME_CATALOG.map((item: GameItem) => {
      let isDownloaded = false;
      if (uninstalledIds.includes(item.gameId)) {
        isDownloaded = false;
      } else if (BUNDLED_CONTENT_PACKAGES[item.gameId]) {
        isDownloaded = true;
      } else {
        isDownloaded = downloadedIds.includes(item.gameId);
      }
      return {
        ...item,
        isDownloaded,
      };
    });
  }

  public static async getGame(gameId: string): Promise<GameItem | null> {
    const downloadedIds = await getDownloadedGameIds();
    const uninstalledIds = await getUninstalledGameIds();
    const local = LOCAL_GAME_CATALOG.find((g) => g.gameId === gameId);
    if (!local) return null;

    let isDownloaded = false;
    if (uninstalledIds.includes(gameId)) {
      isDownloaded = false;
    } else if (BUNDLED_CONTENT_PACKAGES[gameId]) {
      isDownloaded = true;
    } else {
      isDownloaded = downloadedIds.includes(gameId);
    }

    return {
      ...local,
      isDownloaded,
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

    throw new Error(`Content package not found for game ${gameId}`);
  }

  public static async downloadGamePackage(
    gameId: string,
    onProgress?: (progress: number) => void
  ): Promise<GameContentPackage> {
    onProgress?.(25);

    let pkg: GameContentPackage | null = null;
    if (DOWNLOADABLE_PACKAGES[gameId]) {
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
