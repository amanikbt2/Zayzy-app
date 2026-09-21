import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import { BubbleShooterEngine } from './BubbleShooterEngine';
import { soundService } from '../../services/audio';
import { PauseIcon, TargetIcon } from '../../components/SvgIcons';

interface Props {
  levelConfig: any;
  onWin: (score: number, stars: number) => void;
  onGameOver: (score: number) => void;
  onPause: () => void;
}

export const BubbleShooterView: React.FC<Props> = ({ levelConfig, onWin, onGameOver, onPause }) => {
  const engineRef = useRef(new BubbleShooterEngine());
  const [engineState, setEngineState] = useState(engineRef.current.getState());
  const [aimAngle, setAimAngle] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const engine = engineRef.current;
    engine.initialize(levelConfig);
    engine.start();
    setEngineState(engine.getState());

    let lastTime = Date.now();
    const loop = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!engine.getState().isPaused) {
        engine.update(dt);
        setEngineState(engine.getState());

        const state = engine.getState();
        if (state.isVictory) {
          soundService.playVictory();
          onWin(state.score, state.starsEarned);
          return;
        } else if (state.isGameOver) {
          soundService.playGameOver();
          onGameOver(state.score);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [levelConfig]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const engine = engineRef.current;
        // Calculate angle based on horizontal drag offset
        const angle = Math.max(-70, Math.min(70, gestureState.dx / 2));
        engine.setAim(angle);
        setAimAngle(angle);
      },
      onPanResponderRelease: () => {
        const engine = engineRef.current;
        const didShoot = engine.shoot();
        if (didShoot) {
          soundService.playPop();
        }
      },
    })
  ).current;

  const engine = engineRef.current;
  const grid = engine.grid;
  const flying = engine.flyingBubble;

  return (
    <View style={styles.container}>
      {/* HUD Header */}
      <View style={styles.hud}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.statValue}>{engineState.score}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TARGET</Text>
          <Text style={styles.statValue}>{engine.targetScore}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>MOVES</Text>
          <Text style={styles.statValue}>{engine.movesLeft}</Text>
        </View>
        <TouchableOpacity style={styles.pauseBtn} onPress={onPause}>
          <PauseIcon size={18} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      {/* Main Game Playing Board */}
      <View style={styles.board} {...panResponder.panHandlers}>
        {grid.map((rowArr, r) => {
          const isOdd = r % 2 === 1;
          return (
            <View key={`row-${r}`} style={[styles.row, { paddingLeft: isOdd ? 16 : 0 }]}>
              {rowArr.map((color, c) => (
                <View key={`cell-${r}-${c}`} style={styles.cell}>
                  {color ? (
                    <View style={[styles.bubble, { backgroundColor: color }]} />
                  ) : null}
                </View>
              ))}
            </View>
          );
        })}

        {/* Flying Bubble */}
        {flying ? (
          <View
            style={[
              styles.flyingBubble,
              {
                left: flying.x - 12,
                top: flying.y - 12,
                backgroundColor: flying.color,
              },
            ]}
          />
        ) : null}

        {/* Aim Line Indicator */}
        <View
          style={[
            styles.aimLine,
            {
              transform: [{ rotate: `${aimAngle}deg` }],
            },
          ]}
        />
      </View>

      {/* Bottom Shooter Controls */}
      <View style={styles.bottomBar}>
        <View style={styles.nextContainer}>
          <Text style={styles.nextText}>NEXT</Text>
          <View style={[styles.bubbleSmall, { backgroundColor: engine.nextBubbleColor }]} />
        </View>

        <TouchableOpacity
          style={[styles.launcher, { backgroundColor: engine.currentBubbleColor }]}
          onPress={() => {
            const didShoot = engine.shoot();
            if (didShoot) soundService.playPop();
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TargetIcon size={18} color="#FFFFFF" />
            <Text style={styles.shootText}>TAP TO SHOOT</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  hud: {
    flexDirection: 'row',
    width: '94%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statValue: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pauseBtn: {
    backgroundColor: '#334155',
    padding: 8,
    borderRadius: 8,
  },
  pauseText: {
    fontSize: 16,
    color: '#F8FAFC',
  },
  board: {
    width: 310,
    height: 310,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 4,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#334155',
  },
  row: {
    flexDirection: 'row',
    height: 26,
  },
  cell: {
    width: 32,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  bubbleSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  flyingBubble: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    zIndex: 10,
  },
  aimLine: {
    position: 'absolute',
    bottom: 15,
    left: 154,
    width: 2,
    height: 65,
    backgroundColor: '#38BDF8',
    opacity: 0.6,
  },
  bottomBar: {
    flexDirection: 'row',
    width: '94%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 40,
  },
  nextContainer: {
    alignItems: 'center',
  },
  nextText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  launcher: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shootText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
