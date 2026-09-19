import { GameContentPackage } from '../../types/game';

export const BUBBLE_SHOOTER_FALLBACK_PACKAGE: GameContentPackage = {
  gameId: 'bubble-shooter',
  version: 1,
  configuration: {
    rows: 10,
    cols: 8,
    bubbleRadius: 18,
  },
  levels: [
    {
      level: 1,
      colors: ['#FF4757', '#2ED573', '#1E90FF'],
      rows: 4,
      moves: 25,
      targetScore: 500,
    },
    {
      level: 2,
      colors: ['#FF4757', '#2ED573', '#1E90FF', '#FFA502'],
      rows: 5,
      moves: 22,
      targetScore: 800,
    },
    {
      level: 3,
      colors: ['#FF4757', '#2ED573', '#1E90FF', '#FFA502'],
      rows: 6,
      moves: 20,
      targetScore: 1200,
    },
    {
      level: 4,
      colors: ['#FF4757', '#2ED573', '#1E90FF', '#FFA502', '#9B59B6'],
      rows: 6,
      moves: 18,
      targetScore: 1600,
    },
    {
      level: 5,
      colors: ['#FF4757', '#2ED573', '#1E90FF', '#FFA502', '#9B59B6'],
      rows: 7,
      moves: 16,
      targetScore: 2200,
    },
  ],
};
