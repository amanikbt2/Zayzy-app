import { GameContentPackage } from '../../types/game';

export const SLIDING_PUZZLE_FALLBACK_PACKAGE: GameContentPackage = {
  gameId: 'sliding-puzzle',
  version: 1,
  configuration: {
    defaultGridSize: 3,
  },
  levels: [
    {
      level: 1,
      gridSize: 3,
      timeLimit: 120,
      maxMoves: 50,
    },
    {
      level: 2,
      gridSize: 3,
      timeLimit: 90,
      maxMoves: 40,
    },
    {
      level: 3,
      gridSize: 4,
      timeLimit: 180,
      maxMoves: 80,
    },
    {
      level: 4,
      gridSize: 4,
      timeLimit: 150,
      maxMoves: 70,
    },
    {
      level: 5,
      gridSize: 4,
      timeLimit: 120,
      maxMoves: 60,
    },
  ],
};
