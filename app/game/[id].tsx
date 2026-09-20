import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { BottomNavBar } from '../../src/components/BottomNavBar';
import { LevelSelectModal } from '../../src/components/LevelSelectModal';
import { GameOverlayModal } from '../../src/components/GameOverlayModal';
import { InGameControlBar } from '../../src/components/InGameControlBar';
import { BubbleShooterView } from '../../src/engines/BubbleShooter/BubbleShooterView';
import { Match3View } from '../../src/engines/Match3/Match3View';
import { PuzzleView } from '../../src/engines/Puzzle/PuzzleView';
import { GameCatalogService } from '../../src/services/catalog';
import { getLocalProgress, saveLocalProgress } from '../../src/storage/gameProgress';
import { getFavorites, toggleFavorite } from '../../src/storage/settings';
import { GameItem, GameContentPackage } from '../../src/types/game';
import { LocalGameProgress } from '../../src/types/progress';
import { StarIcon, PlayIcon, ListIcon, LockIcon } from '../../src/components/SvgIcons';

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [game, setGame] = useState<GameItem | null>(null);
  const [contentPkg, setContentPkg] = useState<GameContentPackage | null>(null);
  const [progress, setProgress] = useState<LocalGameProgress | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  // Play Mode State
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [overlayType, setOverlayType] = useState<'victory' | 'gameover' | 'pause' | null>(null);
  const [lastScore, setLastScore] = useState(0);
  const [lastStars, setLastStars] = useState(0);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const item = await GameCatalogService.getGame(id as string);
      const pkg = await GameCatalogService.getGameContent(id as string);
      const prog = await getLocalProgress(id as string);
      const favs = await getFavorites();

      setGame(item);
      setContentPkg(pkg);
      setProgress(prog);
      setIsFav(favs.includes(id as string));
      setSelectedLevel(prog.currentLevel || 1);
    } catch (error) {
      console.error('Error loading game detail:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownloadPackage = async () => {
    if (!id || isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(15);
    try {
      setTimeout(() => setDownloadProgress(50), 250);
      setTimeout(() => setDownloadProgress(80), 550);

      await GameCatalogService.downloadGamePackage(id as string, (p) => {
        setDownloadProgress(p);
      });

      setTimeout(async () => {
        setIsDownloading(false);
        await loadData();
      }, 750);
    } catch (error) {
      console.error('Failed to download game:', error);
      setIsDownloading(false);
    }
  };

  const handleToggleFav = async () => {
    if (!id) return;
    const updated = await toggleFavorite(id as string);
    setIsFav(updated.includes(id as string));
  };

  const handleStartGame = (lvl?: number) => {
    const levelToPlay = lvl || selectedLevel;
    setSelectedLevel(levelToPlay);
    setShowLevelModal(false);
    setOverlayType(null);
    setIsPlaying(true);
  };

  const handleWin = async (score: number, stars: number) => {
    if (!id) return;
    setLastScore(score);
    setLastStars(stars);
    setOverlayType('victory');

    const updated = await saveLocalProgress(id as string, selectedLevel, score, stars);
    setProgress(updated);
  };

  const handleGameOver = (score: number) => {
    setLastScore(score);
    setOverlayType('gameover');
  };

  const handleNextLevel = () => {
    if (selectedLevel < 5) {
      const nextLvl = selectedLevel + 1;
      setSelectedLevel(nextLvl);
      setOverlayType(null);
    }
  };

  if (loading || !game || !contentPkg || !progress) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadingText}>Loading game content...</Text>
      </View>
    );
  }

  const levelConfig = contentPkg.levels.find((l) => l.level === selectedLevel) || contentPkg.levels[0];

  return (
    <View style={styles.container}>
      <Header title={game.title} subtitle={game.category} showBack={true} />

      {isPlaying ? (
        // Active Game Canvas View
        <View style={styles.gameViewContainer}>
          {game.engineType === 'bubble-shooter' ? (
            <BubbleShooterView
              levelConfig={levelConfig}
              onWin={handleWin}
              onGameOver={handleGameOver}
              onPause={() => setOverlayType('pause')}
            />
          ) : game.engineType === 'match-3' ? (
            <Match3View
              levelConfig={levelConfig}
              onWin={handleWin}
              onGameOver={handleGameOver}
              onPause={() => setOverlayType('pause')}
            />
          ) : (
            <PuzzleView
              levelConfig={levelConfig}
              onWin={handleWin}
              onGameOver={handleGameOver}
              onPause={() => setOverlayType('pause')}
            />
          )}

          {/* Floating In-Game Bar for Help (?) & Info (i) */}
          <InGameControlBar
            game={game}
            currentLevel={selectedLevel}
            progress={progress}
          />

          {/* Victory / Game Over / Pause Overlay */}
          {overlayType ? (
            <GameOverlayModal
              visible={true}
              type={overlayType}
              score={lastScore}
              stars={lastStars}
              currentLevel={selectedLevel}
              totalLevels={5}
              onNextLevel={handleNextLevel}
              onRetry={() => {
                setOverlayType(null);
              }}
              onResume={() => setOverlayType(null)}
              onHome={() => {
                setOverlayType(null);
                setIsPlaying(false);
              }}
            />
          ) : null}
        </View>
      ) : (
        // Direct Level Selection Screen
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Compact Game Banner Card */}
          <View style={styles.gameBannerCard}>
            <Image source={{ uri: game.thumbnailUrl }} style={styles.bannerThumbnail} />
            <View style={styles.bannerInfo}>
              <Text style={styles.bannerTitle} numberOfLines={1}>{game.title}</Text>
              <Text style={styles.bannerMeta}>{game.category} • {game.downloadSize}</Text>

              <View style={styles.bannerStatsRow}>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatLabel}>UNLOCKED</Text>
                  <Text style={styles.miniStatValue}>{progress.completedLevels.length + 1}/5</Text>
                </View>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatLabel}>HIGH SCORE</Text>
                  <Text style={styles.miniStatValue}>{progress.highScore}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.favBtn} onPress={handleToggleFav}>
              <StarIcon size={20} color="#F59E0B" filled={isFav} />
            </TouchableOpacity>
          </View>

          {/* Package Download Bar if Not Downloaded */}
          {!game.isDownloaded ? (
            <View style={styles.downloadSection}>
              {isDownloading ? (
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ color: '#0284C7', fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>
                    Downloading Game Package ({downloadProgress}%)...
                  </Text>
                  <View style={{ height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                    <View style={{ height: '100%', width: `${downloadProgress}%`, backgroundColor: '#0284C7' }} />
                  </View>
                </View>
              ) : null}

              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={handleDownloadPackage}
                disabled={isDownloading}
              >
                <Text style={styles.downloadBtnText}>
                  {isDownloading ? `DOWNLOADING ${downloadProgress}%...` : `DOWNLOAD GAME PACKAGE (${game.downloadSize})`}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Main Level Picker Grid */}
          <View style={styles.levelSection}>
            <Text style={styles.levelSectionTitle}>SELECT LEVEL</Text>
            <Text style={styles.levelSectionSub}>
              Level 1 is unlocked. Complete levels to unlock the next!
            </Text>

            <View style={styles.levelGrid}>
              {[1, 2, 3, 4, 5].map((lvl) => {
                const isUnlocked = lvl === 1 || progress.completedLevels.includes(lvl - 1);
                const stars = progress.stars[lvl] || 0;
                const isCompleted = progress.completedLevels.includes(lvl);

                return (
                  <TouchableOpacity
                    key={`level-card-${lvl}`}
                    style={[
                      styles.levelGridCard,
                      isUnlocked ? styles.unlockedGridCard : styles.lockedGridCard,
                    ]}
                    disabled={!isUnlocked || !game.isDownloaded}
                    activeOpacity={0.8}
                    onPress={() => handleStartGame(lvl)}
                  >
                    {isUnlocked ? (
                      <>
                        <View style={styles.cardHeaderRow}>
                          <Text style={styles.cardLevelBadge}>LVL {lvl}</Text>
                          <View style={styles.playTagMini}>
                            <PlayIcon size={9} color="#FFFFFF" />
                          </View>
                        </View>

                        <Text style={styles.cardStatusText}>{isCompleted ? 'Cleared' : 'Play'}</Text>

                        <View style={styles.starsRowMini}>
                          {[1, 2, 3].map((s) => (
                            <StarIcon
                              key={`star-${lvl}-${s}`}
                              size={11}
                              color="#F59E0B"
                              filled={isCompleted && s <= Math.max(1, stars)}
                            />
                          ))}
                        </View>
                      </>
                    ) : (
                      <View style={styles.lockedCardContent}>
                        <View style={styles.lockIconCircle}>
                          <LockIcon size={16} color="#94A3B8" />
                        </View>
                        <Text style={styles.lockedLevelBadge}>LVL {lvl}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}

      {!isPlaying ? <BottomNavBar /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#64748B',
    marginTop: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  gameBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bannerThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerMeta: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 6,
  },
  bannerStatsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniStatLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: 'bold',
  },
  miniStatValue: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
  },
  favBtn: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  downloadSection: {
    backgroundColor: '#E0F2FE',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  downloadBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  levelSection: {
    marginTop: 4,
  },
  levelSectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  levelSectionSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  levelGridCard: {
    width: '31%',
    height: 96,
    borderRadius: 16,
    padding: 10,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    shadowColor: '#0F172A',
  },
  unlockedGridCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedGridCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.7,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLevelBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  playTagMini: {
    backgroundColor: '#0284C7',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  starsRowMini: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  lockedCardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  lockIconCircle: {
    backgroundColor: '#E2E8F0',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedLevelBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
  },
  gameViewContainer: {
    flex: 1,
  },
});
