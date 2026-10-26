export type GameState = 
  | 'TITLE_MENU' 
  | 'PLAYING' 
  | 'PAUSED' 
  | 'LEVEL_COMPLETE' 
  | 'GAME_OVER' 
  | 'VICTORY';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';

export interface GridCoord {
  x: number;
  y: number;
}

export type CellType = 0 | 1; // 0 = Path, 1 = Wall

export type PowerUpType = 'SPEED' | 'SHIELD' | 'FREEZE' | 'MAGNET';

export interface PowerUpItem {
  id: string;
  x: number;
  y: number;
  type: PowerUpType;
  collected: boolean;
}

export interface CoinItem {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

export interface StarItem {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  index: number; // 1, 2, or 3
}

export interface TrapItem {
  id: string;
  x: number;
  y: number;
  type: 'spikes' | 'laser';
  state: 'idle' | 'warning' | 'active';
  timer: number;
  interval: number; // in seconds
  warningTime: number;
  activeTime: number;
}

export interface EnemyItem {
  id: string;
  x: number; // floating coordinate for smooth animation
  y: number;
  gridX: number;
  gridY: number;
  type: 'patrol' | 'drone' | 'hunter';
  direction: Direction;
  patrolPath?: GridCoord[];
  currentPathIndex?: number;
  speed: number; // cells per second
  targetGridX: number;
  targetGridY: number;
}

export interface LevelDefinition {
  id: number;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  grid: number[][]; // 2D array: 1 = wall, 0 = path
  playerStart: GridCoord;
  exitPos: GridCoord;
  timeLimit: number; // in seconds
  coins: GridCoord[];
  stars: GridCoord[];
  enemies: Array<{
    x: number;
    y: number;
    type: 'patrol' | 'drone' | 'hunter';
    patrolPath?: GridCoord[];
    speed?: number;
  }>;
  traps: Array<{
    x: number;
    y: number;
    type: 'spikes' | 'laser';
    interval?: number;
  }>;
  powerUps: Array<{
    x: number;
    y: number;
    type: PowerUpType;
  }>;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
  scale: number;
  life: number; // 0 to 1
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

export interface HighScoreRecord {
  totalScore: number;
  levelStars: Record<number, number>; // levelId -> stars (0-3)
  unlockedLevel: number;
  highScores: Array<{
    date: string;
    score: number;
    level: number;
    coins: number;
  }>;
}
