import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { BottomNavBar } from '../../src/components/BottomNavBar';
import { LevelSelectModal } from '../../src/components/LevelSelectModal';
import { GameOverlayModal } from '../../src/components/GameOverlayModal';
import { BubbleShooterView } from '../../src/engines/BubbleShooter/BubbleShooterView';
import { Match3View } from '../../src/engines/Match3/Match3View';
import { PuzzleView } from '../../src/engines/Puzzle/PuzzleView';
import { GameCatalogService } from '../../src/services/catalog';
import { getLocalProgress, saveLocalProgress } from '../../src/storage/gameProgress';
import { getFavorites, toggleFavorite } from '../../src/storage/settings';
import { GameItem, GameContentPackage } from '../../src/types/game';
import { LocalGameProgress } from '../../src/types/progress';
import { StarIcon, PlayIcon, ListIcon } from '../../src/components/SvgIcons';

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
        // Game Detail Overview Screen
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Image source={{ uri: game.thumbnailUrl }} style={styles.heroImage} />

          <View style={styles.detailCard}>
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameMeta}>
                  {game.category} • Version {game.version} • {game.downloadSize}
                </Text>
              </View>

              <TouchableOpacity style={styles.favBtn} onPress={handleToggleFav}>
                <StarIcon size={20} color="#F59E0B" filled={isFav} />
              </TouchableOpacity>
            </View>

            <Text style={styles.description}>{game.description}</Text>

            {/* Progress Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>CURRENT LEVEL</Text>
                <Text style={styles.statVal}>{progress.currentLevel}/5</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>HIGH SCORE</Text>
                <Text style={styles.statVal}>{progress.highScore}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>STATUS</Text>
                <Text style={game.isDownloaded ? styles.statValText : styles.statValTextNot}>
                  {game.isDownloaded ? 'Downloaded (Offline)' : 'Not Downloaded'}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            {game.isDownloaded ? (
              <>
                <TouchableOpacity style={styles.mainPlayBtn} onPress={() => handleStartGame(progress.currentLevel)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.mainPlayText}>PLAY LEVEL {progress.currentLevel}</Text>
                    <PlayIcon size={18} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.levelSelectBtn} onPress={() => setShowLevelModal(true)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.levelSelectText}>SELECT LEVEL (1–5)</Text>
                    <ListIcon size={18} color="#6366F1" />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <View>
                {isDownloading ? (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ color: '#0284C7', fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>
                      Downloading JSON Content Bundle ({downloadProgress}%)...
                    </Text>
                    <View style={{ height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${downloadProgress}%`, backgroundColor: '#0284C7' }} />
                    </View>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[styles.mainPlayBtn, { backgroundColor: '#0284C7' }]}
                  onPress={handleDownloadPackage}
                  disabled={isDownloading}
                >
                  <Text style={styles.mainPlayText}>
                    {isDownloading ? `DOWNLOADING ${downloadProgress}%...` : `DOWNLOAD GAME PACKAGE (${game.downloadSize})`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Level Selection Modal */}
          <LevelSelectModal
            visible={showLevelModal}
            gameTitle={game.title}
            progress={progress}
            totalLevels={5}
            onSelectLevel={(lvl) => handleStartGame(lvl)}
            onClose={() => setShowLevelModal(false)}
          />
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
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  gameTitle: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gameMeta: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  favBtn: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  favText: {
    fontSize: 20,
  },
  description: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statVal: {
    color: '#0284C7',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  statValText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statValTextNot: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  mainPlayBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  mainPlayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  levelSelectBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  levelSelectText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  gameViewContainer: {
    flex: 1,
  },
});
