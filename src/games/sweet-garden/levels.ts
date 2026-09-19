import { GameContentPackage } from '../../types/game';

export const SWEET_GARDEN_FALLBACK_PACKAGE: GameContentPackage = {
  gameId: 'sweet-garden',
  version: 1,
  configuration: {
    gridRows: 8,
    gridCols: 8,
  },
  levels: [
    {
      level: 1,
      items: ['apple', 'berry', 'flower'],
      maxMoves: 25,
      targetScore: 1000,
    },
    {
      level: 2,
      items: ['apple', 'berry', 'flower', 'grape'],
      maxMoves: 22,
      targetScore: 1800,
    },
    {
      level: 3,
      items: ['apple', 'berry', 'flower', 'grape', 'sunflower'],
      maxMoves: 20,
      targetScore: 3000,
    },
    {
      level: 4,
      items: ['apple', 'berry', 'flower', 'grape', 'sunflower'],
      maxMoves: 18,
      targetScore: 4500,
    },
    {
      level: 5,
      items: ['apple', 'berry', 'flower', 'grape', 'sunflower'],
      maxMoves: 15,
      targetScore: 6500,
    },
  ],
};
