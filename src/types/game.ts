export interface GameItem {
  gameId: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  iconUrl: string;
  engineType: 'bubble-shooter' | 'match-3' | 'puzzle' | string;
  version: string;
  packageVersion: string;
  contentVersion: number;
  isPublished: boolean;
  isFeatured: boolean;
  isNew: boolean;
  downloadSize: string;
  isDownloaded?: boolean;
}

export interface GameLevelConfig {
  level: number;
  [key: string]: any;
}

export interface GameContentPackage {
  gameId: string;
  version: number;
  configuration: Record<string, any>;
  levels: GameLevelConfig[];
  assetsMetadata?: Record<string, any>;
  audioMetadata?: Record<string, any>;
  checksum?: string;
}
