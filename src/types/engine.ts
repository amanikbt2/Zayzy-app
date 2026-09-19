export interface EngineState {
  score: number;
  movesLeft?: number;
  timeElapsed?: number;
  level: number;
  isPaused: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  starsEarned: number;
}

export interface IGameEngine {
  initialize(levelConfig: any): void;
  start(): void;
  pause(): void;
  resume(): void;
  restart(): void;
  handleInput(eventData: any): void;
  update(deltaTime: number): void;
  getState(): EngineState;
  getScore(): number;
  isCompleted(): boolean;
}
