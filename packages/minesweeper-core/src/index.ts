export {
  type CellState,
  type CellContent,
  type CellPosition,
  type MineCell,
  type MineGrid,
  type MineDifficulty,
  type MinefieldConfig,
  type MinefieldData,
  type MineGameMove,
  type MineGameState,
  type MineValidationResult,
  DIFFICULTY_CONFIGS,
  NUMBER_COLORS,
} from './types';

export {
  createEmptyGrid,
  generateMinefield,
  getConfigForDifficulty,
} from './generator';

export {
  floodFill,
  chordReveal,
} from './floodfill';

export {
  validateMinefield,
  checkWin,
  revealAllMines,
} from './validator';

export {
  getHint,
  getSafeCellHint,
  type HintResult,
} from './solver';
