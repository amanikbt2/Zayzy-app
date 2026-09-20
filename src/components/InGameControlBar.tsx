import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { HelpCircleIcon, InfoIcon } from './SvgIcons';
import { GameItem } from '../types/game';
import { LocalGameProgress } from '../types/progress';

interface InGameControlBarProps {
  game: GameItem;
  currentLevel: number;
  progress: LocalGameProgress | null;
}

export const InGameControlBar: React.FC<InGameControlBarProps> = ({
  game,
  currentLevel,
  progress,
}) => {
  const [activeModal, setActiveModal] = useState<'help' | 'info' | null>(null);

  const renderHelpContent = () => {
    switch (game.engineType) {
      case 'match-3':
        return (
          <View style={styles.guideContainer}>
            <View style={styles.guideStep}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
              <Text style={styles.stepText}>Swap adjacent items horizontally or vertically to line up <Text style={styles.boldText}>3 or more matching symbols</Text>.</Text>
            </View>

            <View style={styles.guideStep}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
              <Text style={styles.stepText}>Match <Text style={styles.boldText}>4 items</Text> to trigger line blasts, or <Text style={styles.boldText}>5 items</Text> to unlock special power-ups!</Text>
            </View>

            <View style={styles.guideStep}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>3</Text></View>
              <Text style={styles.stepText}>Reach the target score within the limited move limit to clear Level {currentLevel} and earn 3 stars!</Text>
            </View>
          </View>
        );

      case 'bubble-shooter':
        return (
          <View style={styles.guideContainer}>
            <View style={styles.guideStep}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
              <Text style={styles.stepText}>Aim your cannon by tapping or dragging towards target bubbles at the top of the screen.</Text>
            </View>

            <View style={styles.guideStep}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
              <Text style={styles.stepText}>Connect <Text style={styles.boldText}>3 or more bubbles of the same color</Text> to pop them and clear the grid.</Text>
            </View>

            <View style={styles.guideStep}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>3</Text></View>
              <Text style={styles.stepText}>Drop floating bubble clusters for massive extra bonus points before running out of shots!</Text>
            </View>
          </View>
        );

      case 'puzzle':
      default:
        return (
          <View style={styles.guideContainer}>
            <View style={styles.guideStep}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
              <Text style={styles.stepText}>Tap any numbered tile adjacent to the empty square to slide it into the open space.</Text>
            </View>

            <View style={styles.guideStep}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
              <Text style={styles.stepText}>Arrange all tiles in order from <Text style={styles.boldText}>1 to 15</Text> starting top-left to bottom-right.</Text>
            </View>

            <View style={styles.guideStep}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>3</Text></View>
              <Text style={styles.stepText}>Complete the sequence in fewest moves and fastest time possible to achieve maximum stars!</Text>
            </View>
          </View>
        );
    }
  };

  return (
    <>
      {/* Floating Bottom Control Bar */}
      <View style={styles.floatingContainer} pointerEvents="box-none">
        <View style={styles.pillBar}>
          <TouchableOpacity
            style={styles.pillBtn}
            activeOpacity={0.7}
            onPress={() => setActiveModal('help')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <HelpCircleIcon size={18} color="#38BDF8" />
            <Text style={styles.pillBtnText}>Help</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.pillBtn}
            activeOpacity={0.7}
            onPress={() => setActiveModal('info')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <InfoIcon size={18} color="#A855F7" />
            <Text style={styles.pillBtnText}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Help Modal */}
      <Modal
        visible={activeModal === 'help'}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={styles.headerTitleRow}>
                <HelpCircleIcon size={22} color="#38BDF8" />
                <Text style={styles.modalTitle}>How to Play</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBadge}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.closeBadgeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.gameSubtitle}>{game.title} • Rules & Tips</Text>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {renderHelpContent()}
            </ScrollView>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.actionBtnText}>GOT IT!</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Info Modal */}
      <Modal
        visible={activeModal === 'info'}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={styles.headerTitleRow}>
                <InfoIcon size={22} color="#A855F7" />
                <Text style={styles.modalTitle}>Game Details</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBadge}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.closeBadgeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.infoBox}>
                <Text style={styles.infoGameTitle}>{game.title}</Text>
                <Text style={styles.infoGameMeta}>{game.category} • Version {game.version || '1.0.0'}</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>CURRENT LEVEL</Text>
                  <Text style={styles.statVal}>Level {currentLevel}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>HIGH SCORE</Text>
                  <Text style={styles.statVal}>{progress?.highScore || 0}</Text>
                </View>
              </View>

              <View style={styles.detailRowsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Engine Type:</Text>
                  <Text style={styles.detailVal}>{game.engineType.toUpperCase()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Package Size:</Text>
                  <Text style={styles.detailVal}>{game.downloadSize || '1.2 MB'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Offline Status:</Text>
                  <Text style={[styles.detailVal, { color: '#10B981' }]}>✓ Ready & Downloaded</Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#7C3AED' }]}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.actionBtnText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  pillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pillBtnText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  closeBadge: {
    backgroundColor: '#F1F5F9',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBadgeText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: 'bold',
  },
  gameSubtitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalScroll: {
    maxHeight: 280,
  },
  guideContainer: {
    gap: 12,
    paddingVertical: 4,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepBadge: {
    backgroundColor: '#0284C7',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    color: '#334155',
    fontSize: 13,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  infoBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  infoGameTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  infoGameMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#F3E8FF',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    marginBottom: 2,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4C1D95',
  },
  detailRowsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailKey: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  detailVal: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '700',
  },
  actionBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
