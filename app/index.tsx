import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Header } from '../src/components/Header';
import { GameCard } from '../src/components/GameCard';
import { BottomNavBar } from '../src/components/BottomNavBar';
import { GameCatalogService } from '../src/services/catalog';
import { getAllLocalProgress } from '../src/storage/gameProgress';
import { getFavorites, toggleFavorite } from '../src/storage/settings';
import { GameItem } from '../src/types/game';
import { LocalGameProgress } from '../src/types/progress';
import { useFocusEffect, useRouter } from 'expo-router';
import { PlayIcon, FlameIcon, SparkleIcon, StarIcon, DownloadIcon } from '../src/components/SvgIcons';

export default function HomeScreen() {
  const router = useRouter();
  const [games, setGames] = useState<GameItem[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, LocalGameProgress>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const catalog = await GameCatalogService.getGames();
    const progress = await getAllLocalProgress();
    const favs = await getFavorites();

    setGames(catalog);
    setProgressMap(progress);
    setFavorites(favs);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleToggleFav = async (gameId: string) => {
    const updated = await toggleFavorite(gameId);
    setFavorites(updated);
  };

  const installedGames = games.filter((g) => g.isDownloaded);
  const featuredGames = installedGames.filter((g) => g.isFeatured);
  const newGames = installedGames.filter((g) => g.isNew);
  const favoriteGames = installedGames.filter((g) => favorites.includes(g.gameId));

  // Find most recently played game for "Continue Playing"
  const playedGames = Object.values(progressMap)
    .filter((p) => p.completedLevels.length > 0 || p.currentLevel > 1)
    .sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime());

  const lastPlayedGameItem = playedGames.length > 0 ? installedGames.find((g) => g.gameId === playedGames[0].gameId) : null;

  return (
    <View style={styles.container}>
      <Header title="Zayzy Games" subtitle="Zayzy Games - offline" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />}
      >
        {/* Browse & Download More Games Banner */}
        <TouchableOpacity style={styles.downloadBanner} onPress={() => router.push('/downloads')}>
          <View style={styles.bannerRow}>
            <DownloadIcon size={24} color="#0284C7" />
            <View style={{ flex: 1 }}>
              <Text style={styles.downloadBannerTitle}>Download More Offline Games</Text>
              <Text style={styles.downloadBannerSub}>7 new game packages available to download & play offline!</Text>
            </View>
            <View style={styles.downloadBadge}>
              <Text style={styles.downloadBadgeText}>BROWSE</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Continue Playing Banner */}
        {lastPlayedGameItem ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <PlayIcon size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Continue Playing</Text>
            </View>
            <GameCard
              game={lastPlayedGameItem}
              progressText={`Level ${progressMap[lastPlayedGameItem.gameId]?.currentLevel || 1} • High Score: ${progressMap[lastPlayedGameItem.gameId]?.highScore || 0}`}
              isFavorite={favorites.includes(lastPlayedGameItem.gameId)}
              onToggleFavorite={() => handleToggleFav(lastPlayedGameItem.gameId)}
            />
          </View>
        ) : null}

        {/* Featured Section */}
        {featuredGames.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FlameIcon size={20} color="#EF4444" />
              <Text style={styles.sectionTitle}>Featured Games</Text>
            </View>
            <View style={styles.gridContainer}>
              {featuredGames.map((game) => (
                <View key={`feat-${game.gameId}`} style={styles.gridColumn}>
                  <GameCard
                    game={game}
                    progressText={`Level ${progressMap[game.gameId]?.currentLevel || 1}/5`}
                    isFavorite={favorites.includes(game.gameId)}
                    onToggleFavorite={() => handleToggleFav(game.gameId)}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* New Games */}
        {newGames.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SparkleIcon size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>New Games</Text>
            </View>
            <View style={styles.gridContainer}>
              {newGames.map((game) => (
                <View key={`new-${game.gameId}`} style={styles.gridColumn}>
                  <GameCard
                    game={game}
                    progressText={`5 Levels Available`}
                    isFavorite={favorites.includes(game.gameId)}
                    onToggleFavorite={() => handleToggleFav(game.gameId)}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Favorites */}
        {favoriteGames.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <StarIcon size={20} color="#F59E0B" filled />
              <Text style={styles.sectionTitle}>Favorites</Text>
            </View>
            <View style={styles.gridContainer}>
              {favoriteGames.map((game) => (
                <View key={`fav-${game.gameId}`} style={styles.gridColumn}>
                  <GameCard
                    game={game}
                    progressText={`Level ${progressMap[game.gameId]?.currentLevel || 1}/5`}
                    isFavorite={true}
                    onToggleFavorite={() => handleToggleFav(game.gameId)}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* All Installed Catalog Games */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DownloadIcon size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>My Games (Offline Ready)</Text>
          </View>
          <View style={styles.gridContainer}>
            {installedGames.map((game) => (
              <View key={`all-${game.gameId}`} style={styles.gridColumn}>
                <GameCard
                  game={game}
                  progressText={`Level ${progressMap[game.gameId]?.currentLevel || 1}/5`}
                  isFavorite={favorites.includes(game.gameId)}
                  onToggleFavorite={() => handleToggleFav(game.gameId)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  gridColumn: {
    flex: 1,
    minWidth: 0,
  },
  downloadBanner: {
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  downloadBannerTitle: {
    color: '#0369A1',
    fontSize: 14,
    fontWeight: '800',
  },
  downloadBannerSub: {
    color: '#0284C7',
    fontSize: 11,
    marginTop: 2,
  },
  downloadBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  downloadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
