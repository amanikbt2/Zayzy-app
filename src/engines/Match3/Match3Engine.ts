import { BaseGameEngine } from '../base/GameEngine';

export interface TileItem {
  id: string;
  type: string; // 'apple' | 'berry' | 'flower' | 'grape' | 'sunflower'
}

export class Match3Engine extends BaseGameEngine {
  public gridRows: number = 8;
  public gridCols: number = 8;
  public grid: (TileItem | null)[][] = [];
  public availableItems: string[] = ['apple', 'berry', 'flower'];
  public movesLeft: number = 25;
  public targetScore: number = 1000;
  public selectedTile: { r: number; c: number } | null = null;

  public initialize(levelConfig: any): void {
    this.state.level = levelConfig.level || 1;
    this.movesLeft = levelConfig.maxMoves || 25;
    this.targetScore = levelConfig.targetScore || 1000;
    this.availableItems = levelConfig.items || ['apple', 'berry', 'flower'];

    this.grid = [];
    for (let r = 0; r < this.gridRows; r++) {
      const row: (TileItem | null)[] = [];
      for (let c = 0; c < this.gridCols; c++) {
        row.push(this.getRandomTile());
      }
      this.grid.push(row);
    }

    // Ensure initial board has no automatic matches
    this.clearInitialMatches();

    this.selectedTile = null;
    this.state.score = 0;
    this.state.movesLeft = this.movesLeft;
    this.state.isGameOver = false;
    this.state.isVictory = false;
    this.state.isPaused = false;
  }

  public start(): void {
    this.state.isPaused = false;
  }

  private getRandomTile(): TileItem {
    const type = this.availableItems[Math.floor(Math.random() * this.availableItems.length)];
    return {
      id: `tile_${Math.random().toString(36).substr(2, 9)}`,
      type,
    };
  }

  private clearInitialMatches(): void {
    let hasMatches = true;
    let attempts = 0;
    while (hasMatches && attempts < 20) {
      attempts++;
      hasMatches = false;
      for (let r = 0; r < this.gridRows; r++) {
        for (let c = 0; c < this.gridCols; c++) {
          const current = this.grid[r][c]?.type;
          if (!current) continue;

          // Horizontal match check
          if (c >= 2 && this.grid[r][c - 1]?.type === current && this.grid[r][c - 2]?.type === current) {
            this.grid[r][c] = this.getRandomTile();
            hasMatches = true;
          }
          // Vertical match check
          if (r >= 2 && this.grid[r - 1][c]?.type === current && this.grid[r - 2][c]?.type === current) {
            this.grid[r][c] = this.getRandomTile();
            hasMatches = true;
          }
        }
      }
    }
  }

  public selectOrSwap(r: number, c: number): boolean {
    if (this.state.isGameOver || this.state.isVictory || this.movesLeft <= 0) {
      return false;
    }

    if (!this.selectedTile) {
      this.selectedTile = { r, c };
      return false;
    }

    const prev = this.selectedTile;
    // Check adjacency
    const isAdjacent = Math.abs(prev.r - r) + Math.abs(prev.c - c) === 1;

    if (!isAdjacent) {
      this.selectedTile = { r, c };
      return false;
    }

    // Perform tile swap
    this.swapTiles(prev.r, prev.c, r, c);
    const matches = this.checkMatches();

    if (matches.length > 0) {
      this.movesLeft -= 1;
      this.state.movesLeft = this.movesLeft;
      this.processMatches(matches);
      this.selectedTile = null;
      this.checkLevelStatus();
      return true;
    } else {
      // Revert invalid swap
      this.swapTiles(prev.r, prev.c, r, c);
      this.selectedTile = null;
      return false;
    }
  }

  private swapTiles(r1: number, c1: number, r2: number, c2: number): void {
    const temp = this.grid[r1][c1];
    this.grid[r1][c1] = this.grid[r2][c2];
    this.grid[r2][c2] = temp;
  }

  private checkMatches(): { r: number; c: number }[] {
    const matchedSet = new Set<string>();

    // Horizontal check
    for (let r = 0; r < this.gridRows; r++) {
      for (let c = 0; c < this.gridCols - 2; c++) {
        const type = this.grid[r][c]?.type;
        if (type && this.grid[r][c + 1]?.type === type && this.grid[r][c + 2]?.type === type) {
          matchedSet.add(`${r},${c}`);
          matchedSet.add(`${r},${c + 1}`);
          matchedSet.add(`${r},${c + 2}`);
        }
      }
    }

    // Vertical check
    for (let c = 0; c < this.gridCols; c++) {
      for (let r = 0; r < this.gridRows - 2; r++) {
        const type = this.grid[r][c]?.type;
        if (type && this.grid[r + 1][c]?.type === type && this.grid[r + 2][c]?.type === type) {
          matchedSet.add(`${r},${c}`);
          matchedSet.add(`${r + 1},${c}`);
          matchedSet.add(`${r + 2},${c}`);
        }
      }
    }

    return Array.from(matchedSet).map((key) => {
      const [r, c] = key.split(',').map(Number);
      return { r, c };
    });
  }

  private processMatches(matches: { r: number; c: number }[]): void {
    const points = matches.length * 40;
    this.state.score += points;

    // Remove matched tiles
    matches.forEach(({ r, c }) => {
      this.grid[r][c] = null;
    });

    // Apply cascading gravity fill
    this.applyGravity();
  }

  private applyGravity(): void {
    for (let c = 0; c < this.gridCols; c++) {
      let emptyRow = this.gridRows - 1;
      for (let r = this.gridRows - 1; r >= 0; r--) {
        if (this.grid[r][c] !== null) {
          if (r !== emptyRow) {
            this.grid[emptyRow][c] = this.grid[r][c];
            this.grid[r][c] = null;
          }
          emptyRow--;
        }
      }
      // Refill top empty cells
      for (let r = emptyRow; r >= 0; r--) {
        this.grid[r][c] = this.getRandomTile();
      }
    }

    // Check secondary cascade matches
    const cascadeMatches = this.checkMatches();
    if (cascadeMatches.length > 0) {
      this.processMatches(cascadeMatches);
    }
  }

  public handleInput(eventData: any): void {
    if (eventData.action === 'select') {
      this.selectOrSwap(eventData.r, eventData.c);
    }
  }

  public update(deltaTime: number): void {
    // Engine loop updates if needed
  }

  private checkLevelStatus(): void {
    if (this.state.score >= this.targetScore) {
      this.state.isVictory = true;
      this.state.starsEarned = this.calculateStars(this.state.score, this.targetScore);
    } else if (this.movesLeft <= 0) {
      this.state.isGameOver = true;
    }
  }
}
