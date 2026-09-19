import { BaseGameEngine } from '../base/GameEngine';

export interface BubbleCell {
  row: number;
  col: number;
  color: string | null;
  id: string;
}

export interface FlyingBubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export class BubbleShooterEngine extends BaseGameEngine {
  public rows: number = 9;
  public cols: number = 8;
  public grid: (string | null)[][] = [];
  public currentBubbleColor: string = '#FF4757';
  public nextBubbleColor: string = '#2ED573';
  public movesLeft: number = 20;
  public targetScore: number = 500;
  public colors: string[] = ['#FF4757', '#2ED573', '#1E90FF'];
  public flyingBubble: FlyingBubble | null = null;
  public aimAngle: number = 0; // angle in degrees from vertical

  public initialize(levelConfig: any): void {
    this.state.level = levelConfig.level || 1;
    this.movesLeft = levelConfig.moves || 20;
    this.targetScore = levelConfig.targetScore || 500;
    this.colors = levelConfig.colors || ['#FF4757', '#2ED573', '#1E90FF'];

    const initialRows = levelConfig.rows || 4;
    this.grid = [];

    for (let r = 0; r < this.rows; r++) {
      const rowArr: (string | null)[] = [];
      for (let c = 0; c < this.cols; c++) {
        if (r < initialRows) {
          const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
          rowArr.push(randomColor);
        } else {
          rowArr.push(null);
        }
      }
      this.grid.push(rowArr);
    }

    this.currentBubbleColor = this.getRandomColor();
    this.nextBubbleColor = this.getRandomColor();

    this.state.score = 0;
    this.state.movesLeft = this.movesLeft;
    this.state.isGameOver = false;
    this.state.isVictory = false;
    this.state.isPaused = false;
  }

  public start(): void {
    this.state.isPaused = false;
  }

  private getRandomColor(): string {
    // Get colors active on current board if any exist, otherwise from palette
    const activeColors: string[] = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) activeColors.push(this.grid[r][c]!);
      }
    }
    const pool = activeColors.length > 0 ? activeColors : this.colors;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  public setAim(angleDegrees: number): void {
    // Clamp angle to safe range (-75 to +75 deg)
    this.aimAngle = Math.max(-75, Math.min(75, angleDegrees));
  }

  public shoot(): boolean {
    if (this.flyingBubble || this.state.isGameOver || this.state.isVictory || this.movesLeft <= 0) {
      return false;
    }

    const speed = 14;
    const rad = (this.aimAngle * Math.PI) / 180;
    const vx = Math.sin(rad) * speed;
    const vy = -Math.cos(rad) * speed;

    this.flyingBubble = {
      x: this.cols * 20 / 2,
      y: (this.rows + 1) * 36,
      vx,
      vy,
      color: this.currentBubbleColor,
    };

    this.movesLeft -= 1;
    this.state.movesLeft = this.movesLeft;
    return true;
  }

  public handleInput(eventData: any): void {
    if (eventData.action === 'aim') {
      this.setAim(eventData.angle);
    } else if (eventData.action === 'shoot') {
      this.shoot();
    }
  }

  public update(deltaTime: number): void {
    if (!this.flyingBubble) return;

    this.flyingBubble.x += this.flyingBubble.vx;
    this.flyingBubble.y += this.flyingBubble.vy;

    const minX = 18;
    const maxX = this.cols * 36 - 18;

    // Bounce off side walls
    if (this.flyingBubble.x <= minX || this.flyingBubble.x >= maxX) {
      this.flyingBubble.vx = -this.flyingBubble.vx;
      this.flyingBubble.x = Math.max(minX, Math.min(maxX, this.flyingBubble.x));
    }

    // Top ceiling collision or bubble grid collision check
    if (this.flyingBubble.y <= 25 || this.checkGridCollision(this.flyingBubble)) {
      this.attachBubble(this.flyingBubble);
      this.flyingBubble = null;

      // Cycle bubble color
      this.currentBubbleColor = this.nextBubbleColor;
      this.nextBubbleColor = this.getRandomColor();

      this.checkLevelStatus();
    }
  }

  private checkGridCollision(b: FlyingBubble): boolean {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) {
          const bubbleX = c * 36 + 18 + (r % 2 === 1 ? 18 : 0);
          const bubbleY = r * 32 + 18;
          const dist = Math.hypot(b.x - bubbleX, b.y - bubbleY);
          if (dist <= 30) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private attachBubble(b: FlyingBubble): void {
    let targetRow = Math.max(0, Math.floor((b.y - 18) / 32));
    if (targetRow >= this.rows) targetRow = this.rows - 1;

    const isOdd = targetRow % 2 === 1;
    let targetCol = Math.floor((b.x - (isOdd ? 18 : 0)) / 36);
    targetCol = Math.max(0, Math.min(this.cols - 1, targetCol));

    // Find nearest open slot if occupied
    if (this.grid[targetRow][targetCol]) {
      const neighbors = this.getNeighbors(targetRow, targetCol);
      const empty = neighbors.find(([nr, nc]) => !this.grid[nr][nc]);
      if (empty) {
        targetRow = empty[0];
        targetCol = empty[1];
      }
    }

    this.grid[targetRow][targetCol] = b.color;

    // Check cluster matches (3 or more)
    const cluster = this.findCluster(targetRow, targetCol, b.color);
    if (cluster.length >= 3) {
      cluster.forEach(([r, c]) => {
        this.grid[r][c] = null;
      });
      const points = cluster.length * 50;
      this.state.score += points;

      // Drop unattached floating orphans
      this.dropOrphans();
    }
  }

  private findCluster(r: number, c: number, color: string): [number, number][] {
    const visited = new Set<string>();
    const matches: [number, number][] = [];
    const queue: [number, number][] = [[r, c]];

    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      const key = `${currR},${currC}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (this.grid[currR][currC] === color) {
        matches.push([currR, currC]);
        const neighbors = this.getNeighbors(currR, currC);
        neighbors.forEach(([nr, nc]) => {
          if (!visited.has(`${nr},${nc}`) && this.grid[nr][nc] === color) {
            queue.push([nr, nc]);
          }
        });
      }
    }
    return matches;
  }

  private dropOrphans(): void {
    const connected = new Set<string>();
    const queue: [number, number][] = [];

    // All bubbles in row 0 are anchored to top ceiling
    for (let c = 0; c < this.cols; c++) {
      if (this.grid[0][c]) {
        queue.push([0, c]);
      }
    }

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const key = `${r},${c}`;
      if (connected.has(key)) continue;
      connected.add(key);

      const neighbors = this.getNeighbors(r, c);
      neighbors.forEach(([nr, nc]) => {
        if (this.grid[nr][nc] && !connected.has(`${nr},${nc}`)) {
          queue.push([nr, nc]);
        }
      });
    }

    // Drop all non-connected bubbles
    let orphanCount = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] && !connected.has(`${r},${c}`)) {
          this.grid[r][c] = null;
          orphanCount++;
        }
      }
    }

    if (orphanCount > 0) {
      this.state.score += orphanCount * 100;
    }
  }

  private getNeighbors(r: number, c: number): [number, number][] {
    const isOdd = r % 2 === 1;
    const offsets = isOdd
      ? [
          [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]
        ]
      : [
          [-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]
        ];

    const result: [number, number][] = [];
    for (const [dr, dc] of offsets) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
        result.push([nr, nc]);
      }
    }
    return result;
  }

  private checkLevelStatus(): void {
    let activeBubbles = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) activeBubbles++;
      }
    }

    if (activeBubbles === 0 || this.state.score >= this.targetScore) {
      this.state.isVictory = true;
      this.state.starsEarned = this.calculateStars(this.state.score, this.targetScore);
    } else if (this.movesLeft <= 0) {
      this.state.isGameOver = true;
    }
  }
}
