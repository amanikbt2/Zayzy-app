import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Header } from '../src/components/Header';
import { BottomNavBar } from '../src/components/BottomNavBar';
import { GameCatalogService } from '../src/services/catalog';
import { GameItem } from '../src/types/game';
import { BoxIcon, DownloadIcon, RefreshIcon, PlayIcon, StarIcon } from '../src/components/SvgIcons';
import { SearchBar } from '../src/components/SearchBar';
import { useRouter } from 'expo-router';

export default function DownloadsScreen() {
  const router = useRouter();
  const [games, setGames] = useState<GameItem[]>([]);
  const [filter, setFilter] = useState<'available' | 'installed' | 'all'>('available');
  const [downloadingMap, setDownloadingMap] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    const catalog = await GameCatalogService.getGames();
    setGames(catalog);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownload = async (gameId: string) => {
    if (downloadingMap[gameId] !== undefined) return; // already downloading

    // Set initial progress
    setDownloadingMap((prev) => ({ ...prev, [gameId]: 15 }));

    try {
      // Simulate real-time progress steps
      setTimeout(() => setDownloadingMap((prev) => ({ ...prev, [gameId]: 45 })), 300);
      setTimeout(() => setDownloadingMap((prev) => ({ ...prev, [gameId]: 80 })), 700);

      await GameCatalogService.downloadGamePackage(gameId, (p) => {
        setDownloadingMap((prev) => ({ ...prev, [gameId]: p }));
      });

      setTimeout(async () => {
        setDownloadingMap((prev) => {
          const next = { ...prev };
          delete next[gameId];
          return next;
        });
        await loadData();
      }, 900);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadingMap((prev) => {
        const next = { ...prev };
        delete next[gameId];
        return next;
      });
    }
  };

  const handleDelete = async (gameId: string) => {
    await GameCatalogService.deleteGamePackage(gameId);
    await loadData();
  };

  const installedCount = games.filter((g) => g.isDownloaded).length;
  const availableCount = games.filter((g) => !g.isDownloaded).length;

  const filteredGames = games.filter((g) => {
    const matchesFilter =
      filter === 'installed' ? g.isDownloaded : filter === 'available' ? !g.isDownloaded : true;
    const matchesSearch =
      searchQuery.trim() === '' ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Header title="Download New Games" subtitle="Explore & Download Offline Games" showBack={false} />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search games by name or category..."
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Banner Card for Download New Games */}
        <View style={styles.banner}>
          <View style={styles.bannerTitleRow}>
            <BoxIcon size={20} color="#0284C7" />
            <Text style={styles.bannerTitle}>Download New Games</Text>
          </View>
          <Text style={styles.bannerText}>
            Browse and download new offline game packages instantly. Downloaded games can be played 100% offline anytime!
          </Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'available' && styles.filterTabActive]}
            onPress={() => setFilter('available')}
          >
            <Text style={[styles.filterText, filter === 'available' && styles.filterTextActive]}>
              Available ({availableCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filter === 'installed' && styles.filterTabActive]}
            onPress={() => setFilter('installed')}
          >
            <Text style={[styles.filterText, filter === 'installed' && styles.filterTextActive]}>
              Installed ({installedCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All ({games.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Empty Search / Filter State */}
        {filteredGames.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Games Found</Text>
            <Text style={styles.emptySub}>
              {searchQuery ? `No games match "${searchQuery}"` : 'No games available in this tab.'}
            </Text>
          </View>
        ) : null}

        {/* Games List */}
        {filteredGames.map((game) => {
          const isDownloading = downloadingMap[game.gameId] !== undefined;
          const progress = downloadingMap[game.gameId] || 0;

          return (
            <View key={`dl-${game.gameId}`} style={styles.downloadCard}>
              <View style={styles.cardMain}>
                <Image source={{ uri: game.thumbnailUrl }} style={styles.thumbnail} />
                <View style={styles.cardInfo}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.gameTitle} numberOfLines={1}>{game.title}</Text>
                    {game.isDownloaded ? (
                      <View style={styles.statusBadgeInstalled}>
                        <Text style={styles.statusTextInstalled}>INSTALLED</Text>
                      </View>
                    ) : (
                      <View style={styles.statusBadgeAvailable}>
                        <Text style={styles.statusTextAvailable}>READY</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.gameDescription} numberOfLines={2}>{game.description}</Text>
                  <Text style={styles.gameMeta}>
                    {game.category} • Size: {game.downloadSize} • Content v{game.contentVersion}
                  </Text>
                </View>
              </View>

              {/* Downloading Progress Bar */}
              {isDownloading ? (
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Downloading JSON Game Bundle...</Text>
                    <Text style={styles.progressPercent}>{progress}%</Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                  </View>
                </View>
              ) : null}

              {/* Card Action Buttons */}
              <View style={styles.cardActions}>
                {game.isDownloaded ? (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.playBtn}
                      onPress={() => router.push(`/game/${game.gameId}`)}
                    >
                      <Text style={styles.playBtnText}>PLAY GAME</Text>
                      <PlayIcon size={12} color="#FFFFFF" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>

                    {/* Allow deleting unbundled games */}
                    {game.gameId !== 'bubble-shooter' && game.gameId !== 'sweet-garden' && game.gameId !== 'sliding-puzzle' ? (
                      <TouchableOpacity style={styles.removeBtn} onPress={() => handleDelete(game.gameId)}>
                        <Text style={styles.removeBtnText}>Remove Package</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() => handleDownload(game.gameId)}
                    disabled={isDownloading}
                  >
                    <DownloadIcon size={16} color="#FFFFFF" />
                    <Text style={styles.downloadBtnText}>
                      {isDownloading ? `Downloading ${progress}%...` : `DOWNLOAD (${game.downloadSize})`}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
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
  banner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  bannerTitle: {
    color: '#0284C7',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bannerText: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 17,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterTabActive: {
    backgroundColor: '#0284C7',
  },
  filterText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  downloadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardMain: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  gameTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  gameDescription: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  gameMeta: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusBadgeInstalled: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusTextInstalled: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '900',
  },
  statusBadgeAvailable: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusTextAvailable: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: '900',
  },
  progressContainer: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  progressPercent: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: 'bold',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 3,
  },
  cardActions: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeBtnText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: 'bold',
  },
  downloadBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
});
