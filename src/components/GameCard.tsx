import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GameItem } from '../types/game';
import { useRouter } from 'expo-router';
import { StarIcon, PlayIcon } from './SvgIcons';

interface Props {
  game: GameItem;
  progressText?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const GameCard: React.FC<Props> = ({ game, progressText, isFavorite, onToggleFavorite }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/game/${game.gameId}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: game.thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
        {game.isNew ? (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText} numberOfLines={1}>{game.category.toUpperCase()}</Text>
          </View>
          {onToggleFavorite ? (
            <TouchableOpacity onPress={onToggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <StarIcon size={16} color="#F59E0B" filled={isFavorite} />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {game.title}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.progressText} numberOfLines={1}>{progressText || '5 Levels Available'}</Text>
          <View style={styles.playBtn}>
            <Text style={styles.playBtnText}>PLAY</Text>
            <PlayIcon size={10} color="#FFFFFF" style={{ marginLeft: 3 }} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'column',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 95,
    backgroundColor: '#F1F5F9',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  newBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  content: {
    padding: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: '75%',
  },
  categoryText: {
    color: '#0369A1',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  title: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'column',
    gap: 6,
    marginTop: 4,
  },
  progressText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '500',
  },
  playBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
