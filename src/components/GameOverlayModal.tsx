import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import {
  PauseIcon,
  TrophyIcon,
  BrokenHeartIcon,
  StarIcon,
  PlayIcon,
  NextIcon,
  RefreshIcon,
  HomeIcon,
} from './SvgIcons';

interface Props {
  visible: boolean;
  type: 'victory' | 'gameover' | 'pause';
  score?: number;
  stars?: number;
  currentLevel?: number;
  totalLevels?: number;
  onNextLevel?: () => void;
  onRetry: () => void;
  onResume?: () => void;
  onHome: () => void;
}

export const GameOverlayModal: React.FC<Props> = ({
  visible,
  type,
  score = 0,
  stars = 0,
  currentLevel = 1,
  totalLevels = 5,
  onNextLevel,
  onRetry,
  onResume,
  onHome,
}) => {
  const isVictory = type === 'victory';
  const isPause = type === 'pause';
  const hasNext = isVictory && currentLevel < totalLevels;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.iconHeadContainer}>
            {isPause ? (
              <PauseIcon size={48} color="#0284C7" />
            ) : isVictory ? (
              <TrophyIcon size={48} color="#F59E0B" />
            ) : (
              <BrokenHeartIcon size={48} color="#EF4444" />
            )}
          </View>

          <Text style={[styles.title, isVictory ? styles.winTitle : isPause ? styles.pauseTitle : styles.loseTitle]}>
            {isPause ? 'GAME PAUSED' : isVictory ? 'LEVEL COMPLETE!' : 'TRY AGAIN'}
          </Text>

          {!isPause ? (
            <View style={styles.statsContainer}>
              <Text style={styles.scoreText}>SCORE: {score}</Text>
              {isVictory ? (
                <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
                  {Array.from({ length: Math.max(1, stars) }).map((_, idx) => (
                    <StarIcon key={idx} size={22} color="#FBBF24" filled />
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

          <View style={styles.btnRow}>
            {isPause && onResume ? (
              <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={onResume}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.primaryText}>RESUME</Text>
                  <PlayIcon size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ) : null}

            {hasNext && onNextLevel ? (
              <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={onNextLevel}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.primaryText}>NEXT LEVEL</Text>
                  <NextIcon size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ) : null}

            {!isPause ? (
              <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={onRetry}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.secondaryText}>RETRY</Text>
                  <RefreshIcon size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={[styles.actionBtn, styles.darkBtn]} onPress={onHome}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.darkText}>HOME</Text>
                <HomeIcon size={16} color="#0F172A" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconHeadContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  winTitle: {
    color: '#059669',
  },
  loseTitle: {
    color: '#DC2626',
  },
  pauseTitle: {
    color: '#0284C7',
  },
  statsContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  scoreText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  starsText: {
    fontSize: 24,
    marginTop: 6,
  },
  btnRow: {
    width: '100%',
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  primaryBtn: {
    backgroundColor: '#0284C7',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryBtn: {
    backgroundColor: '#10B981',
  },
  secondaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  darkBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  darkText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
