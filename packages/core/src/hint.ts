import { type SudokuGrid, type CellValue, type GridValue, type CellPosition, GRID_SIZE, BOX_SIZE, ALL_VALUES } from './types';

export interface SudokuHint {
  position: CellPosition;
  value: CellValue;
  technique: string;
  explanation: string;
}

function getCandidates(grid: SudokuGrid, row: number, col: number): Set<CellValue> {
  const cell = grid[row][col];
  if (cell.value !== 0 || cell.isGiven) return new Set();

  const used = new Set<GridValue>();

  for (let c = 0; c < GRID_SIZE; c++) {
    if (grid[row][c].value !== 0) used.add(grid[row][c].value);
  }
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r][col].value !== 0) used.add(grid[r][col].value);
  }
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if (grid[r][c].value !== 0) used.add(grid[r][c].value);
    }
  }

  const candidates = new Set<CellValue>();
  for (const v of ALL_VALUES) {
    if (!used.has(v)) candidates.add(v);
  }
  return candidates;
}

function getAllCandidates(grid: SudokuGrid): Map<string, Set<CellValue>> {
  const map = new Map<string, Set<CellValue>>();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c].value === 0 && !grid[r][c].isGiven) {
        const key = `${r},${c}`;
        map.set(key, getCandidates(grid, r, c));
      }
    }
  }
  return map;
}

function cellName(r: number, c: number): string {
  return `R${r + 1}C${c + 1}`;
}

export function findNakedSingle(grid: SudokuGrid): SudokuHint | null {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c].value !== 0 || grid[r][c].isGiven) continue;
      const candidates = getCandidates(grid, r, c);
      if (candidates.size === 1) {
        const value = [...candidates][0];
        return {
          position: { row: r, col: c },
          value,
          technique: '排除法',
          explanation: `${cellName(r, c)} 所在行、列、宫已填入其他8个数字，仅剩 ${value} 可填`,
        };
      }
    }
  }
  return null;
}

export function findHiddenSingle(grid: SudokuGrid): SudokuHint | null {
  const allCandidates = getAllCandidates(grid);

  for (let r = 0; r < GRID_SIZE; r++) {
    for (const v of ALL_VALUES) {
      const positions: CellPosition[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        const key = `${r},${c}`;
        const cands = allCandidates.get(key);
        if (cands && cands.has(v)) {
          positions.push({ row: r, col: c });
        }
      }
      if (positions.length === 1) {
        return {
          position: positions[0],
          value: v,
          technique: '行唯一法',
          explanation: `第${r + 1}行中，${v} 只能放在 ${cellName(positions[0].row, positions[0].col)}`,
        };
      }
    }
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    for (const v of ALL_VALUES) {
      const positions: CellPosition[] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        const key = `${r},${c}`;
        const cands = allCandidates.get(key);
        if (cands && cands.has(v)) {
          positions.push({ row: r, col: c });
        }
      }
      if (positions.length === 1) {
        return {
          position: positions[0],
          value: v,
          technique: '列唯一法',
          explanation: `第${c + 1}列中，${v} 只能放在 ${cellName(positions[0].row, positions[0].col)}`,
        };
      }
    }
  }

  for (let boxR = 0; boxR < BOX_SIZE; boxR++) {
    for (let boxC = 0; boxC < BOX_SIZE; boxC++) {
      for (const v of ALL_VALUES) {
        const positions: CellPosition[] = [];
        for (let r = boxR * BOX_SIZE; r < (boxR + 1) * BOX_SIZE; r++) {
          for (let c = boxC * BOX_SIZE; c < (boxC + 1) * BOX_SIZE; c++) {
            const key = `${r},${c}`;
            const cands = allCandidates.get(key);
            if (cands && cands.has(v)) {
              positions.push({ row: r, col: c });
            }
          }
        }
        if (positions.length === 1) {
          const br = boxR + 1;
          const bc = boxC + 1;
          return {
            position: positions[0],
            value: v,
            technique: '宫唯一法',
            explanation: `第${br}-${bc}宫中，${v} 只能放在 ${cellName(positions[0].row, positions[0].col)}`,
          };
        }
      }
    }
  }

  return null;
}

export function findLogicalHint(grid: SudokuGrid): SudokuHint | null {
  const naked = findNakedSingle(grid);
  if (naked) return naked;

  const hidden = findHiddenSingle(grid);
  if (hidden) return hidden;

  return null;
}
