import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../src/components/Header';
import { GameCard } from '../src/components/GameCard';
import { BottomNavBar } from '../src/components/BottomNavBar';
import { GameCatalogService } from '../src/services/catalog';
import { getFavorites, toggleFavorite } from '../src/storage/settings';
import { GameItem } from '../src/types/game';
import { StarIcon } from '../src/components/SvgIcons';

export default function FavoritesScreen() {
  const [favoriteGames, setFavoriteGames] = useState<GameItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadData = async () => {
    const catalog = await GameCatalogService.getGames();
    const favs = await getFavorites();

    setFavorites(favs);
    setFavoriteGames(catalog.filter((g) => favs.includes(g.gameId)));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFav = async (gameId: string) => {
    const updated = await toggleFavorite(gameId);
    setFavorites(updated);
    setFavoriteGames((prev) => prev.filter((g) => updated.includes(g.gameId)));
  };

  return (
    <View style={styles.container}>
      <Header title="Favorites" subtitle="Your favorite offline games" showBack={true} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {favoriteGames.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <StarIcon size={48} color="#F59E0B" filled />
            </View>
            <Text style={styles.emptyTitle}>No Favorite Games Yet</Text>
            <Text style={styles.emptyText}>Tap the star icon on any game card to bookmark it here for quick offline access!</Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {favoriteGames.map((game) => (
              <View key={`fav-pg-${game.gameId}`} style={styles.gridColumn}>
                <GameCard
                  game={game}
                  isFavorite={true}
                  onToggleFavorite={() => handleToggleFav(game.gameId)}
                />
              </View>
            ))}
          </View>
        )}
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
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridColumn: {
    width: '31.5%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconContainer: {
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#64748B',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
