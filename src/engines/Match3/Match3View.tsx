import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Match3Engine, TileItem } from './Match3Engine';
import { soundService } from '../../services/audio';
import {
  AppleSvg,
  StrawberrySvg,
  FlowerSvg,
  GrapesSvg,
  SunflowerSvg,
  UnknownSvg,
  PauseIcon,
} from '../../components/SvgIcons';

interface Props {
  levelConfig: any;
  onWin: (score: number, stars: number) => void;
  onGameOver: (score: number) => void;
  onPause: () => void;
}

const renderTileSvg = (type: string, size = 26) => {
  switch (type) {
    case 'apple':
      return <AppleSvg size={size} />;
    case 'berry':
      return <StrawberrySvg size={size} />;
    case 'flower':
      return <FlowerSvg size={size} />;
    case 'grape':
      return <GrapesSvg size={size} />;
    case 'sunflower':
      return <SunflowerSvg size={size} />;
    default:
      return <UnknownSvg size={size} />;
  }
};

export const Match3View: React.FC<Props> = ({ levelConfig, onWin, onGameOver, onPause }) => {
  const engineRef = useRef(new Match3Engine());
  const [grid, setGrid] = useState<(TileItem | null)[][]>([]);
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [engineState, setEngineState] = useState(engineRef.current.getState());

  useEffect(() => {
    const engine = engineRef.current;
    engine.initialize(levelConfig);
    engine.start();
    setGrid([...engine.grid]);
    setEngineState(engine.getState());
  }, [levelConfig]);

  const handleTilePress = (r: number, c: number) => {
    const engine = engineRef.current;
    if (engineState.isGameOver || engineState.isVictory) return;

    soundService.playSwap();
    const didMatch = engine.selectOrSwap(r, c);

    setGrid([...engine.grid.map((row) => [...row])]);
    setSelected(engine.selectedTile);
    setEngineState(engine.getState());

    if (didMatch) {
      soundService.playMatch();
    }

    const state = engine.getState();
    if (state.isVictory) {
      soundService.playVictory();
      onWin(state.score, state.starsEarned);
    } else if (state.isGameOver) {
      soundService.playGameOver();
      onGameOver(state.score);
    }
  };

  const engine = engineRef.current;

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

      {/* Match-3 Board */}
      <View style={styles.board}>
        {grid.map((rowArr, r) => (
          <View key={`r-${r}`} style={styles.row}>
            {rowArr.map((tile, c) => {
              const isSelected = selected && selected.r === r && selected.c === c;
              return (
                <TouchableOpacity
                  key={`c-${r}-${c}`}
                  style={[styles.tile, isSelected && styles.tileSelected]}
                  onPress={() => handleTilePress(r, c)}
                  activeOpacity={0.7}
                >
                  {tile ? renderTileSvg(tile.type, 26) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Helper Footer */}
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <StrawberrySvg size={18} />
          <Text style={styles.footerText}>Tap 2 adjacent tiles to swap & match 3!</Text>
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
    color: '#10B981',
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
    width: 290,
    height: 290,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 6,
    justifyContent: 'space-around',
    borderWidth: 2,
    borderColor: '#334155',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tile: {
    width: 32,
    height: 32,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  tileSelected: {
    borderColor: '#F59E0B',
    borderWidth: 2,
    backgroundColor: '#334155',
  },
  tileEmoji: {
    fontSize: 20,
  },
  footer: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 40,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
});
