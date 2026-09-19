import { GameContentPackage } from '../types/game';

export const DOWNLOADABLE_PACKAGES: Record<string, GameContentPackage> = {
  'cosmic-pop': {
    gameId: 'cosmic-pop',
    version: 1,
    configuration: { theme: 'cosmic', gridCols: 8 },
    levels: [
      {
        level: 1,
        targetScore: 400,
        maxMoves: 16,
        bubbleGrid: [
          ['#8B5CF6', '#8B5CF6', '#EC4899', '#EC4899', '#8B5CF6', '#8B5CF6', '#EC4899', '#EC4899'],
          ['#3B82F6', '#3B82F6', '#8B5CF6', '#8B5CF6', '#3B82F6', '#3B82F6', '#8B5CF6', '#8B5CF6'],
          ['#EC4899', '#EC4899', '#3B82F6', '#3B82F6', '#EC4899', '#EC4899', '#3B82F6', '#3B82F6'],
        ],
      },
      {
        level: 2,
        targetScore: 650,
        maxMoves: 14,
        bubbleGrid: [
          ['#EC4899', '#3B82F6', '#8B5CF6', '#10B981', '#10B981', '#8B5CF6', '#3B82F6', '#EC4899'],
          ['#3B82F6', '#8B5CF6', '#10B981', '#10B981', '#10B981', '#10B981', '#8B5CF6', '#3B82F6'],
          ['#8B5CF6', '#10B981', '#EC4899', '#EC4899', '#EC4899', '#EC4899', '#10B981', '#8B5CF6'],
        ],
      },
      {
        level: 3,
        targetScore: 900,
        maxMoves: 12,
        bubbleGrid: [
          ['#10B981', '#F59E0B', '#10B981', '#F59E0B', '#10B981', '#F59E0B', '#10B981', '#F59E0B'],
          ['#F59E0B', '#10B981', '#F59E0B', '#10B981', '#F59E0B', '#10B981', '#F59E0B', '#10B981'],
          ['#8B5CF6', '#8B5CF6', '#EC4899', '#EC4899', '#8B5CF6', '#8B5CF6', '#EC4899', '#EC4899'],
        ],
      },
      {
        level: 4,
        targetScore: 1200,
        maxMoves: 11,
        bubbleGrid: [
          ['#EC4899', '#EC4899', '#F59E0B', '#F59E0B', '#EC4899', '#EC4899', '#F59E0B', '#F59E0B'],
          ['#3B82F6', '#3B82F6', '#10B981', '#10B981', '#3B82F6', '#3B82F6', '#10B981', '#10B981'],
          ['#8B5CF6', '#8B5CF6', '#3B82F6', '#3B82F6', '#8B5CF6', '#8B5CF6', '#3B82F6', '#3B82F6'],
        ],
      },
      {
        level: 5,
        targetScore: 1600,
        maxMoves: 10,
        bubbleGrid: [
          ['#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#3B82F6', '#10B981'],
          ['#10B981', '#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#F59E0B'],
          ['#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6'],
        ],
      },
    ],
  },
  'fruit-blast': {
    gameId: 'fruit-blast',
    version: 1,
    configuration: { theme: 'tropical', gridRows: 6, gridCols: 6 },
    levels: [
      {
        level: 1,
        targetScore: 500,
        maxMoves: 18,
        allowedTypes: ['apple', 'berry', 'flower', 'grape'],
      },
      {
        level: 2,
        targetScore: 800,
        maxMoves: 15,
        allowedTypes: ['apple', 'berry', 'flower', 'grape', 'sunflower'],
      },
      {
        level: 3,
        targetScore: 1200,
        maxMoves: 14,
        allowedTypes: ['apple', 'berry', 'flower', 'grape', 'sunflower'],
      },
      {
        level: 4,
        targetScore: 1600,
        maxMoves: 12,
        allowedTypes: ['apple', 'berry', 'flower', 'grape', 'sunflower'],
      },
      {
        level: 5,
        targetScore: 2200,
        maxMoves: 10,
        allowedTypes: ['apple', 'berry', 'flower', 'grape', 'sunflower'],
      },
    ],
  },
  'number-slide': {
    gameId: 'number-slide',
    version: 1,
    configuration: { theme: 'classic-wood' },
    levels: [
      { level: 1, gridSize: 3, maxMoves: 30, timeLimit: 120 },
      { level: 2, gridSize: 3, maxMoves: 25, timeLimit: 90 },
      { level: 3, gridSize: 4, maxMoves: 50, timeLimit: 180 },
      { level: 4, gridSize: 4, maxMoves: 40, timeLimit: 150 },
      { level: 5, gridSize: 4, maxMoves: 35, timeLimit: 120 },
    ],
  },
  'candy-crush-land': {
    gameId: 'candy-crush-land',
    version: 1,
    configuration: { theme: 'candy-kingdom', gridRows: 6, gridCols: 6 },
    levels: [
      { level: 1, targetScore: 600, maxMoves: 20, allowedTypes: ['apple', 'berry', 'flower'] },
      { level: 2, targetScore: 900, maxMoves: 18, allowedTypes: ['apple', 'berry', 'flower', 'grape'] },
      { level: 3, targetScore: 1400, maxMoves: 15, allowedTypes: ['apple', 'berry', 'flower', 'grape', 'sunflower'] },
      { level: 4, targetScore: 1800, maxMoves: 13, allowedTypes: ['apple', 'berry', 'flower', 'grape', 'sunflower'] },
      { level: 5, targetScore: 2500, maxMoves: 11, allowedTypes: ['apple', 'berry', 'flower', 'grape', 'sunflower'] },
    ],
  },
  'gem-match-legend': {
    gameId: 'gem-match-legend',
    version: 1,
    configuration: { theme: 'jewels', gridRows: 6, gridCols: 6 },
    levels: [
      { level: 1, targetScore: 550, maxMoves: 19, allowedTypes: ['grape', 'flower', 'sunflower'] },
      { level: 2, targetScore: 850, maxMoves: 16, allowedTypes: ['apple', 'grape', 'flower', 'sunflower'] },
      { level: 3, targetScore: 1300, maxMoves: 14, allowedTypes: ['apple', 'berry', 'grape', 'flower', 'sunflower'] },
      { level: 4, targetScore: 1750, maxMoves: 12, allowedTypes: ['apple', 'berry', 'grape', 'flower', 'sunflower'] },
      { level: 5, targetScore: 2400, maxMoves: 10, allowedTypes: ['apple', 'berry', 'grape', 'flower', 'sunflower'] },
    ],
  },
  'picture-puzzle-pro': {
    gameId: 'picture-puzzle-pro',
    version: 1,
    configuration: { theme: 'gallery' },
    levels: [
      { level: 1, gridSize: 3, maxMoves: 35, timeLimit: 140 },
      { level: 2, gridSize: 3, maxMoves: 28, timeLimit: 100 },
      { level: 3, gridSize: 4, maxMoves: 55, timeLimit: 200 },
      { level: 4, gridSize: 4, maxMoves: 45, timeLimit: 160 },
      { level: 5, gridSize: 4, maxMoves: 38, timeLimit: 130 },
    ],
  },
  'bubble-blast-mania': {
    gameId: 'bubble-blast-mania',
    version: 1,
    configuration: { theme: 'neon-arcade', gridCols: 8 },
    levels: [
      {
        level: 1,
        targetScore: 450,
        maxMoves: 15,
        bubbleGrid: [
          ['#EF4444', '#EF4444', '#10B981', '#10B981', '#EF4444', '#EF4444', '#10B981', '#10B981'],
          ['#3B82F6', '#3B82F6', '#F59E0B', '#F59E0B', '#3B82F6', '#3B82F6', '#F59E0B', '#F59E0B'],
        ],
      },
      {
        level: 2,
        targetScore: 750,
        maxMoves: 14,
        bubbleGrid: [
          ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
          ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#10B981'],
        ],
      },
      {
        level: 3,
        targetScore: 1100,
        maxMoves: 12,
        bubbleGrid: [
          ['#8B5CF6', '#8B5CF6', '#10B981', '#10B981', '#8B5CF6', '#8B5CF6', '#10B981', '#10B981'],
          ['#F59E0B', '#F59E0B', '#EF4444', '#EF4444', '#F59E0B', '#F59E0B', '#EF4444', '#EF4444'],
        ],
      },
      {
        level: 4,
        targetScore: 1500,
        maxMoves: 11,
        bubbleGrid: [
          ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#3B82F6', '#10B981'],
          ['#8B5CF6', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#F59E0B', '#10B981'],
        ],
      },
      {
        level: 5,
        targetScore: 2000,
        maxMoves: 10,
        bubbleGrid: [
          ['#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6'],
          ['#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'],
        ],
      },
    ],
  },
};
