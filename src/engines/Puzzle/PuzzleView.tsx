import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PuzzleEngine } from './PuzzleEngine';
import { soundService } from '../../services/audio';
import { PauseIcon, PuzzlePieceIcon } from '../../components/SvgIcons';

interface Props {
  levelConfig: any;
  onWin: (score: number, stars: number) => void;
  onGameOver: (score: number) => void;
  onPause: () => void;
}

export const PuzzleView: React.FC<Props> = ({ levelConfig, onWin, onGameOver, onPause }) => {
  const engineRef = useRef(new PuzzleEngine());
  const [board, setBoard] = useState<(number | null)[]>([]);
  const [engineState, setEngineState] = useState(engineRef.current.getState());
  const [timerText, setTimerText] = useState('00:00');
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const engine = engineRef.current;
    engine.initialize(levelConfig);
    engine.start();
    setBoard([...engine.board]);
    setEngineState(engine.getState());

    let lastTime = Date.now();
    const loop = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!engine.getState().isPaused) {
        engine.update(dt);
        setEngineState(engine.getState());

        const remaining = Math.max(0, Math.floor(engine.timeLimit - engine.timeElapsed));
        const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
        const secs = (remaining % 60).toString().padStart(2, '0');
        setTimerText(`${mins}:${secs}`);

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
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [levelConfig]);

  const handleTilePress = (index: number) => {
    const engine = engineRef.current;
    if (engineState.isGameOver || engineState.isVictory) return;

    const didSlide = engine.slideTile(index);
    if (didSlide) {
      soundService.playTap();
      setBoard([...engine.board]);
      setEngineState(engine.getState());

      const state = engine.getState();
      if (state.isVictory) {
        soundService.playVictory();
        onWin(state.score, state.starsEarned);
      } else if (state.isGameOver) {
        soundService.playGameOver();
        onGameOver(state.score);
      }
    }
  };

  const engine = engineRef.current;
  const size = engine.gridSize;

  return (
    <View style={styles.container}>
      {/* HUD Header */}
      <View style={styles.hud}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>MOVES</Text>
          <Text style={styles.statValue}>
            {engine.moveCount}/{engine.maxMoves}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TIME LEFT</Text>
          <Text style={styles.statValue}>{timerText}</Text>
        </View>
        <TouchableOpacity style={styles.pauseBtn} onPress={onPause}>
          <PauseIcon size={18} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      {/* Sliding Puzzle Grid */}
      <View style={[styles.board, { width: size === 3 ? 300 : 320, height: size === 3 ? 300 : 320 }]}>
        {board.map((val, idx) => {
          const tileSize = (size === 3 ? 280 : 300) / size;
          return (
            <TouchableOpacity
              key={`tile-${idx}`}
              style={[
                styles.tile,
                {
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: val !== null ? '#0284C7' : 'transparent',
                  borderColor: val !== null ? '#38BDF8' : 'transparent',
                },
              ]}
              onPress={() => handleTilePress(idx)}
              activeOpacity={val !== null ? 0.7 : 1}
              disabled={val === null}
            >
              {val !== null ? <Text style={styles.tileNumber}>{val}</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Helper Instructions Footer */}
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <PuzzlePieceIcon size={18} color="#8B5CF6" />
          <Text style={styles.footerText}>Tap a tile adjacent to the empty slot to slide!</Text>
        </View>
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
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    borderWidth: 2,
    borderColor: '#334155',
  },
  tile: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    elevation: 4,
  },
  tileNumber: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
});
