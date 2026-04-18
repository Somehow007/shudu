import {
  type MineGrid,
  type MineCell,
  type MinefieldConfig,
  type CellPosition,
  DIFFICULTY_CONFIGS,
} from './types';

function createEmptyCell(): MineCell {
  return {
    state: 'hidden',
    content: 0,
    isMine: false,
    adjacentMines: 0,
  };
}

export function createEmptyGrid(rows: number, cols: number): MineGrid {
  const grid: MineGrid = [];
  for (let r = 0; r < rows; r++) {
    const row: MineCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(createEmptyCell());
    }
    grid.push(row);
  }
  return grid;
}

function getNeighbors(pos: CellPosition, rows: number, cols: number): CellPosition[] {
  const neighbors: CellPosition[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = pos.row + dr;
      const nc = pos.col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push({ row: nr, col: nc });
      }
    }
  }
  return neighbors;
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function countAdjacentMines(grid: MineGrid, row: number, col: number): number {
  const { length: rows } = grid;
  const { length: cols } = grid[0];
  let count = 0;
  for (const neighbor of getNeighbors({ row, col }, rows, cols)) {
    if (grid[neighbor.row][neighbor.col].isMine) count++;
  }
  return count;
}

export function generateMinefield(
  config: MinefieldConfig,
  firstClickPos: CellPosition,
): MineGrid {
  const { rows, cols, mineCount } = config;
  const grid = createEmptyGrid(rows, cols);

  const safeZone = new Set<string>();
  safeZone.add(`${firstClickPos.row},${firstClickPos.col}`);
  for (const neighbor of getNeighbors(firstClickPos, rows, cols)) {
    safeZone.add(`${neighbor.row},${neighbor.col}`);
  }

  const candidates: CellPosition[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safeZone.has(`${r},${c}`)) {
        candidates.push({ row: r, col: c });
      }
    }
  }

  const actualMineCount = Math.min(mineCount, candidates.length);
  const minePositions = shuffleArray(candidates).slice(0, actualMineCount);

  for (const pos of minePositions) {
    grid[pos.row][pos.col].isMine = true;
    grid[pos.row][pos.col].content = 'mine';
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].isMine) {
        grid[r][c].adjacentMines = countAdjacentMines(grid, r, c);
        grid[r][c].content = grid[r][c].adjacentMines;
      }
    }
  }

  return grid;
}

export function getConfigForDifficulty(
  difficulty: keyof typeof DIFFICULTY_CONFIGS,
): MinefieldConfig {
  return DIFFICULTY_CONFIGS[difficulty];
}
