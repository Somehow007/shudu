import type { MineGrid, MineValidationResult, CellPosition } from './types';

export function validateMinefield(grid: MineGrid): MineValidationResult {
  const rows = grid.length;
  const cols = grid[0].length;
  const incorrectFlags: CellPosition[] = [];
  const unrevealedMines: CellPosition[] = [];
  let revealedSafeCells = 0;
  let totalSafeCells = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (!cell.isMine) {
        totalSafeCells++;
        if (cell.state === 'revealed') {
          revealedSafeCells++;
        }
      }
      if (cell.state === 'flagged' && !cell.isMine) {
        incorrectFlags.push({ row: r, col: c });
      }
      if (cell.isMine && cell.state !== 'flagged' && cell.state !== 'revealed') {
        unrevealedMines.push({ row: r, col: c });
      }
    }
  }

  const isComplete = revealedSafeCells === totalSafeCells;
  const isValid = incorrectFlags.length === 0;

  return {
    isValid,
    isComplete,
    incorrectFlags,
    unrevealedMines,
  };
}

export function checkWin(grid: MineGrid): boolean {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (!cell.isMine && cell.state !== 'revealed') {
        return false;
      }
    }
  }
  return true;
}

export function revealAllMines(grid: MineGrid): MineGrid {
  const newGrid = grid.map((row) =>
    row.map((cell) => {
      if (cell.isMine && cell.state !== 'flagged') {
        return { ...cell, state: 'revealed' as const };
      }
      if (cell.state === 'flagged' && !cell.isMine) {
        return { ...cell, state: 'revealed' as const };
      }
      return cell;
    }),
  );
  return newGrid;
}
