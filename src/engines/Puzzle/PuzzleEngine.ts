import { BaseGameEngine } from '../base/GameEngine';

export class PuzzleEngine extends BaseGameEngine {
  public gridSize: number = 3; // 3x3 or 4x4
  public board: (number | null)[] = []; // array of tile values, null represents empty space
  public moveCount: number = 0;
  public timeElapsed: number = 0;
  public maxMoves: number = 50;
  public timeLimit: number = 120;

  public initialize(levelConfig: any): void {
    this.state.level = levelConfig.level || 1;
    this.gridSize = levelConfig.gridSize || 3;
    this.maxMoves = levelConfig.maxMoves || 50;
    this.timeLimit = levelConfig.timeLimit || 120;

    this.moveCount = 0;
    this.timeElapsed = 0;
    this.state.score = 0;
    this.state.isGameOver = false;
    this.state.isVictory = false;
    this.state.isPaused = false;

    this.board = this.generateSolvableBoard();
  }

  public start(): void {
    this.state.isPaused = false;
  }

  private generateSolvableBoard(): (number | null)[] {
    const totalTiles = this.gridSize * this.gridSize;
    let tiles: (number | null)[];

    do {
      tiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
      tiles.push(null); // empty space

      // Shuffle using Fisher-Yates
      for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      }
    } while (!this.isSolvable(tiles));

    return tiles;
  }

  // Solvability check using inversion count
  private isSolvable(tiles: (number | null)[]): boolean {
    const nums = tiles.filter((t) => t !== null) as number[];
    let inversions = 0;
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) inversions++;
      }
    }

    if (this.gridSize % 2 !== 0) {
      // Odd grid size: solvable if inversion count is even
      return inversions % 2 === 0;
    } else {
      // Even grid size: solvable if (empty row index from bottom + inversions) is odd
      const emptyIdx = tiles.indexOf(null);
      const emptyRowFromBottom = this.gridSize - Math.floor(emptyIdx / this.gridSize);
      return (emptyRowFromBottom + inversions) % 2 !== 0;
    }
  }

  public slideTile(index: number): boolean {
    if (this.state.isGameOver || this.state.isVictory) return false;

    const emptyIdx = this.board.indexOf(null);
    const row = Math.floor(index / this.gridSize);
    const col = index % this.gridSize;
    const emptyRow = Math.floor(emptyIdx / this.gridSize);
    const emptyCol = emptyIdx % this.gridSize;

    // Check adjacency (up, down, left, right)
    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      // Swap tile with empty slot
      this.board[emptyIdx] = this.board[index];
      this.board[index] = null;

      this.moveCount += 1;
      this.checkLevelStatus();
      return true;
    }
    return false;
  }

  public handleInput(eventData: any): void {
    if (eventData.action === 'slide') {
      this.slideTile(eventData.index);
    }
  }

  public update(deltaTime: number): void {
    if (!this.state.isPaused && !this.state.isGameOver && !this.state.isVictory) {
      this.timeElapsed += deltaTime;
      if (this.timeElapsed >= this.timeLimit) {
        this.state.isGameOver = true;
      }
    }
  }

  private checkLevelStatus(): void {
    // Check if tiles are in ascending order 1..N-1 with null at end
    const total = this.gridSize * this.gridSize;
    let isSolved = true;
    for (let i = 0; i < total - 1; i++) {
      if (this.board[i] !== i + 1) {
        isSolved = false;
        break;
      }
    }

    if (isSolved) {
      this.state.isVictory = true;
      // Calculate score based on time and moves remaining
      const timeBonus = Math.max(0, Math.floor(this.timeLimit - this.timeElapsed)) * 10;
      const moveBonus = Math.max(0, this.maxMoves - this.moveCount) * 20;
      this.state.score = 1000 + timeBonus + moveBonus;
      this.state.starsEarned = this.calculateStars(this.state.score, 1200);
    } else if (this.moveCount >= this.maxMoves) {
      this.state.isGameOver = true;
    }
  }
}
