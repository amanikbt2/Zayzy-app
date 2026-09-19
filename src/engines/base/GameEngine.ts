import { IGameEngine, EngineState } from '../../types/engine';

export abstract class BaseGameEngine implements IGameEngine {
  protected state: EngineState = {
    score: 0,
    level: 1,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    starsEarned: 0,
  };

  abstract initialize(levelConfig: any): void;
  abstract start(): void;
  abstract handleInput(eventData: any): void;
  abstract update(deltaTime: number): void;

  public pause(): void {
    this.state.isPaused = true;
  }

  public resume(): void {
    this.state.isPaused = false;
  }

  public restart(): void {
    this.state.isPaused = false;
    this.state.isGameOver = false;
    this.state.isVictory = false;
    this.state.score = 0;
    this.state.starsEarned = 0;
  }

  public getState(): EngineState {
    return { ...this.state };
  }

  public getScore(): number {
    return this.state.score;
  }

  public isCompleted(): boolean {
    return this.state.isVictory;
  }

  protected calculateStars(score: number, targetScore: number): number {
    if (score >= targetScore * 1.5) return 3;
    if (score >= targetScore * 1.1) return 2;
    if (score >= targetScore) return 1;
    return 0;
  }
}
