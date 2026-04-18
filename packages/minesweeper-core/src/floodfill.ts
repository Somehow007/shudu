import type { MineGrid, CellPosition } from './types';

export function floodFill(
  grid: MineGrid,
  startRow: number,
  startCol: number,
): CellPosition[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const revealed: CellPosition[] = [];
  const visited = new Set<string>();
  const queue: CellPosition[] = [{ row: startRow, col: startCol }];

  while (queue.length > 0) {
    const { row, col } = queue.shift()!;
    const key = `${row},${col}`;

    if (visited.has(key)) continue;
    if (row < 0 || row >= rows || col < 0 || col >= cols) continue;

    const cell = grid[row][col];
    if (cell.state === 'revealed' || cell.state === 'flagged') continue;

    visited.add(key);
    cell.state = 'revealed';
    revealed.push({ row, col });

    if (cell.adjacentMines === 0 && !cell.isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = row + dr;
          const nc = col + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            queue.push({ row: nr, col: nc });
          }
        }
      }
    }
  }

  return revealed;
}

export function chordReveal(
  grid: MineGrid,
  row: number,
  col: number,
): { revealed: CellPosition[]; hitMine: boolean } {
  const cell = grid[row][col];
  if (cell.state !== 'revealed' || cell.adjacentMines === 0) {
    return { revealed: [], hitMine: false };
  }

  const rows = grid.length;
  const cols = grid[0].length;
  let adjacentFlagCount = 0;
  const hiddenNeighbors: CellPosition[] = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const neighbor = grid[nr][nc];
        if (neighbor.state === 'flagged') {
          adjacentFlagCount++;
        } else if (neighbor.state === 'hidden' || neighbor.state === 'questioned') {
          hiddenNeighbors.push({ row: nr, col: nc });
        }
      }
    }
  }

  if (adjacentFlagCount !== cell.adjacentMines) {
    return { revealed: [], hitMine: false };
  }

  const allRevealed: CellPosition[] = [];
  let hitMine = false;

  for (const pos of hiddenNeighbors) {
    const neighborCell = grid[pos.row][pos.col];
    if (neighborCell.isMine) {
      hitMine = true;
      neighborCell.state = 'revealed';
      allRevealed.push(pos);
    } else {
      const revealed = floodFill(grid, pos.row, pos.col);
      allRevealed.push(...revealed);
    }
  }

  return { revealed: allRevealed, hitMine };
}
