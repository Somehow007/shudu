import { describe, it, expect } from 'vitest';
import {
  createEmptyGrid,
  generateMinefield,
  getConfigForDifficulty,
} from './generator';
import { floodFill } from './floodfill';
import { validateMinefield, checkWin } from './validator';
import { getHint } from './solver';
import { DIFFICULTY_CONFIGS } from './types';
import type { CellPosition, MineDifficulty } from './types';

describe('generator', () => {
  describe('createEmptyGrid', () => {
    it('should create grid with correct dimensions', () => {
      const grid = createEmptyGrid(9, 9);
      expect(grid.length).toBe(9);
      expect(grid[0].length).toBe(9);
    });

    it('should create all cells with hidden state', () => {
      const grid = createEmptyGrid(9, 9);
      for (const row of grid) {
        for (const cell of row) {
          expect(cell.state).toBe('hidden');
          expect(cell.isMine).toBe(false);
          expect(cell.adjacentMines).toBe(0);
        }
      }
    });
  });

  describe('generateMinefield', () => {
    it('should generate minefield with correct mine count', () => {
      const config = DIFFICULTY_CONFIGS.beginner;
      const grid = generateMinefield(config, { row: 0, col: 0 });
      let mineCount = 0;
      for (const row of grid) {
        for (const cell of row) {
          if (cell.isMine) mineCount++;
        }
      }
      expect(mineCount).toBe(config.mineCount);
    });

    it('should ensure first click position is safe', () => {
      const config = DIFFICULTY_CONFIGS.beginner;
      const firstClick: CellPosition = { row: 4, col: 4 };
      const grid = generateMinefield(config, firstClick);
      expect(grid[firstClick.row][firstClick.col].isMine).toBe(false);
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = firstClick.row + dr;
          const nc = firstClick.col + dc;
          if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
            expect(grid[nr][nc].isMine).toBe(false);
          }
        }
      }
    });

    it('should calculate correct adjacent mine counts', () => {
      const config = DIFFICULTY_CONFIGS.beginner;
      const grid = generateMinefield(config, { row: 0, col: 0 });
      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.cols; c++) {
          const cell = grid[r][c];
          if (!cell.isMine) {
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
                  if (grid[nr][nc].isMine) count++;
                }
              }
            }
            expect(cell.adjacentMines).toBe(count);
          }
        }
      }
    });
  });

  describe('getConfigForDifficulty', () => {
    it('should return correct config for each difficulty', () => {
      const difficulties: MineDifficulty[] = ['beginner', 'intermediate', 'advanced', 'expert'];
      for (const d of difficulties) {
        const config = getConfigForDifficulty(d);
        expect(config).toEqual(DIFFICULTY_CONFIGS[d]);
      }
    });
  });
});

describe('floodfill', () => {
  it('should reveal starting cell', () => {
    const grid = createEmptyGrid(9, 9);
    const revealed = floodFill(grid, 4, 4);
    expect(revealed.length).toBeGreaterThan(0);
    expect(grid[4][4].state).toBe('revealed');
  });

  it('should reveal all cells in empty grid', () => {
    const grid = createEmptyGrid(9, 9);
    const revealed = floodFill(grid, 0, 0);
    expect(revealed.length).toBe(81);
    for (const row of grid) {
      for (const cell of row) {
        expect(cell.state).toBe('revealed');
      }
    }
  });
});

describe('validator', () => {
  it('should detect incomplete game', () => {
    const grid = createEmptyGrid(9, 9);
    const result = validateMinefield(grid);
    expect(result.isComplete).toBe(false);
  });

  it('should detect win when all safe cells revealed', () => {
    const config = DIFFICULTY_CONFIGS.beginner;
    const grid = generateMinefield(config, { row: 0, col: 0 });
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        if (!grid[r][c].isMine) {
          grid[r][c].state = 'revealed';
        }
      }
    }
    expect(checkWin(grid)).toBe(true);
  });
});

describe('solver', () => {
  it('should return hint result with safe and mine cells', () => {
    const config = DIFFICULTY_CONFIGS.beginner;
    const grid = generateMinefield(config, { row: 0, col: 0 });
    floodFill(grid, 0, 0);
    const hint = getHint(grid);
    expect(hint).toHaveProperty('safeCells');
    expect(hint).toHaveProperty('mineCells');
    expect(Array.isArray(hint.safeCells)).toBe(true);
    expect(Array.isArray(hint.mineCells)).toBe(true);
  });
});
