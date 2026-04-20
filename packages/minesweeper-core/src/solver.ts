import type { MineGrid, CellPosition } from './types';

export interface HintResult {
  safeCells: CellPosition[];
  mineCells: CellPosition[];
}

export interface MineHintDetail {
  type: 'safe' | 'mine';
  position: CellPosition;
  technique: string;
  explanation: string;
  relatedCell: CellPosition;
}

function cellName(r: number, c: number): string {
  return `R${r + 1}C${c + 1}`;
}

export function getHint(grid: MineGrid): HintResult {
  const rows = grid.length;
  const cols = grid[0].length;
  const safeCells: CellPosition[] = [];
  const mineCells: CellPosition[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (cell.state !== 'revealed' || cell.adjacentMines === 0) continue;

      const hiddenNeighbors: CellPosition[] = [];
      let flaggedCount = 0;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const neighbor = grid[nr][nc];
            if (neighbor.state === 'flagged') {
              flaggedCount++;
            } else if (neighbor.state === 'hidden' || neighbor.state === 'questioned') {
              hiddenNeighbors.push({ row: nr, col: nc });
            }
          }
        }
      }

      const remainingMines = cell.adjacentMines - flaggedCount;

      if (remainingMines === 0 && hiddenNeighbors.length > 0) {
        for (const pos of hiddenNeighbors) {
          if (!safeCells.some((s) => s.row === pos.row && s.col === pos.col)) {
            safeCells.push(pos);
          }
        }
      }

      if (remainingMines === hiddenNeighbors.length && hiddenNeighbors.length > 0) {
        for (const pos of hiddenNeighbors) {
          if (!mineCells.some((s) => s.row === pos.row && s.col === pos.col)) {
            mineCells.push(pos);
          }
        }
      }
    }
  }

  return { safeCells, mineCells };
}

export function getLogicalMineHint(grid: MineGrid): MineHintDetail | null {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (cell.state !== 'revealed' || cell.adjacentMines === 0) continue;

      const hiddenNeighbors: CellPosition[] = [];
      let flaggedCount = 0;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const neighbor = grid[nr][nc];
            if (neighbor.state === 'flagged') {
              flaggedCount++;
            } else if (neighbor.state === 'hidden' || neighbor.state === 'questioned') {
              hiddenNeighbors.push({ row: nr, col: nc });
            }
          }
        }
      }

      if (hiddenNeighbors.length === 0) continue;

      const remainingMines = cell.adjacentMines - flaggedCount;

      if (remainingMines === 0) {
        const target = hiddenNeighbors[0];
        const neighborNames = hiddenNeighbors.map((p) => cellName(p.row, p.col)).join('、');
        return {
          type: 'safe',
          position: target,
          technique: '排除法（安全格）',
          explanation: `${cellName(r, c)} 的数字为 ${cell.adjacentMines}，周围已标旗 ${flaggedCount} 个，剩余雷数 = ${cell.adjacentMines} - ${flaggedCount} = 0。因此其周围的隐藏格子 ${neighborNames} 都是安全的，可以放心揭开。`,
          relatedCell: { row: r, col: c },
        };
      }

      if (remainingMines === hiddenNeighbors.length) {
        const target = hiddenNeighbors[0];
        const neighborNames = hiddenNeighbors.map((p) => cellName(p.row, p.col)).join('、');
        return {
          type: 'mine',
          position: target,
          technique: '确定法（标雷）',
          explanation: `${cellName(r, c)} 的数字为 ${cell.adjacentMines}，周围已标旗 ${flaggedCount} 个，剩余雷数 = ${cell.adjacentMines} - ${flaggedCount} = ${remainingMines}，而周围未揭开的格子恰好也是 ${hiddenNeighbors.length} 个。因此 ${neighborNames} 全部是雷，应该标旗。`,
          relatedCell: { row: r, col: c },
        };
      }
    }
  }

  return null;
}

export function getSafeCellHint(grid: MineGrid): CellPosition | null {
  const { safeCells } = getHint(grid);
  if (safeCells.length > 0) {
    return safeCells[Math.floor(Math.random() * safeCells.length)];
  }

  const safeHiddenCells: CellPosition[] = [];
  const rows = grid.length;
  const cols = grid[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].state === 'hidden' && !grid[r][c].isMine) {
        safeHiddenCells.push({ row: r, col: c });
      }
    }
  }
  if (safeHiddenCells.length > 0) {
    return safeHiddenCells[Math.floor(Math.random() * safeHiddenCells.length)];
  }
  return null;
}
