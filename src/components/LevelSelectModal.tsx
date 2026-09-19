import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LocalGameProgress } from '../types/progress';
import { LockIcon, StarIcon } from './SvgIcons';

interface Props {
  visible: boolean;
  gameTitle: string;
  progress: LocalGameProgress;
  totalLevels?: number;
  onSelectLevel: (level: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<Props> = ({
  visible,
  gameTitle,
  progress,
  totalLevels = 5,
  onSelectLevel,
  onClose,
}) => {
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>SELECT LEVEL</Text>
          <Text style={styles.gameTitle}>{gameTitle}</Text>

          <View style={styles.levelGrid}>
            {levels.map((lvl) => {
              const isUnlocked = lvl === 1 || progress.completedLevels.includes(lvl - 1) || progress.currentLevel >= lvl;
              const stars = progress.stars[lvl] || 0;
              const isCompleted = progress.completedLevels.includes(lvl);

              return (
                <TouchableOpacity
                  key={`lvl-${lvl}`}
                  style={[styles.levelCard, !isUnlocked && styles.lockedCard]}
                  disabled={!isUnlocked}
                  onPress={() => onSelectLevel(lvl)}
                >
                  {isUnlocked ? (
                    <Text style={styles.levelNum}>{lvl}</Text>
                  ) : (
                    <LockIcon size={20} color="#94A3B8" />
                  )}
                  {isUnlocked && isCompleted ? (
                    <View style={{ flexDirection: 'row', gap: 2, marginTop: 2 }}>
                      {Array.from({ length: Math.max(1, stars) }).map((_, idx) => (
                        <StarIcon key={idx} size={10} color="#FBBF24" filled />
                      ))}
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>CLOSE</Text>
          </TouchableOpacity>
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
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
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
  title: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  gameTitle: {
    color: '#0284C7',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 20,
  },
  levelCard: {
    width: 56,
    height: 64,
    backgroundColor: '#0284C7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedCard: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  levelNum: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  lockedText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  starsText: {
    fontSize: 10,
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  closeText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
