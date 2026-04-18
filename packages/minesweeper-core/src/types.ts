export type CellState = 'hidden' | 'revealed' | 'flagged' | 'questioned';

export type CellContent = 'mine' | number;

export interface CellPosition {
  row: number;
  col: number;
}

export interface MineCell {
  state: CellState;
  content: CellContent;
  isMine: boolean;
  adjacentMines: number;
}

export type MineGrid = MineCell[][];

export type MineDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface MinefieldConfig {
  rows: number;
  cols: number;
  mineCount: number;
}

export interface MinefieldData {
  grid: MineGrid;
  config: MinefieldConfig;
  difficulty: MineDifficulty;
  seed?: number;
  firstClick: boolean;
}

export interface MineGameMove {
  type: 'reveal' | 'flag' | 'unflag' | 'question' | 'unquestion' | 'chord';
  position: CellPosition;
  revealedCells?: CellPosition[];
}

export interface MineGameState {
  minefield: MinefieldData;
  moves: MineGameMove[];
  moveIndex: number;
  elapsedTime: number;
  isPaused: boolean;
  isGameOver: boolean;
  isWin: boolean;
  flagCount: number;
  revealedCount: number;
}

export interface MineValidationResult {
  isValid: boolean;
  isComplete: boolean;
  incorrectFlags: CellPosition[];
  unrevealedMines: CellPosition[];
}

export const DIFFICULTY_CONFIGS: Record<MineDifficulty, MinefieldConfig> = {
  beginner:     { rows: 9,  cols: 9,  mineCount: 10 },
  intermediate: { rows: 16, cols: 16, mineCount: 40 },
  advanced:     { rows: 16, cols: 30, mineCount: 99 },
  expert:       { rows: 20, cols: 30, mineCount: 130 },
};

export const NUMBER_COLORS: Record<number, string> = {
  1: '#0000FF',
  2: '#008000',
  3: '#FF0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};
