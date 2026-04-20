import { useEffect, useCallback } from 'react';
import { useSudokuVariantStore } from '../stores/sudokuVariantStore';
import { useShortcutStore } from '../stores/shortcutStore';
import {
  type ShortcutAction,
  type KeyBinding,
  isKeyBindingMatch,
  SHORTCUT_DEFINITIONS,
} from '@shudu/shared';
import { GRID_SIZE, type CellValue } from '@shudu/core';

interface ShortcutCallbacks {
  onShowShortcuts?: () => void;
  onToast?: (message: string) => void;
}

const SUDOKU_SHORTCUT_ACTIONS: ShortcutAction[] = [
  'input1', 'input2', 'input3', 'input4', 'input5',
  'input6', 'input7', 'input8', 'input9',
  'erase', 'undo', 'redo', 'toggleNote', 'hint', 'pause',
  'moveUp', 'moveDown', 'moveLeft', 'moveRight',
  'showShortcuts',
];

export function useSudokuVariantKeyboardShortcuts(callbacks: ShortcutCallbacks = {}) {
  const platform = useShortcutStore((s) => s.platform);
  const customBindings = useShortcutStore((s) => s.customBindings);
  const getBinding = useShortcutStore((s) => s.getBinding);

  const variant = useSudokuVariantStore((s) => s.variant);
  const grid = useSudokuVariantStore((s) => s.grid);
  const miniGrid = useSudokuVariantStore((s) => s.miniGrid);
  const miniGridSize = useSudokuVariantStore((s) => s.miniGridSize);
  const selectedCell = useSudokuVariantStore((s) => s.selectedCell);
  const isNoteMode = useSudokuVariantStore((s) => s.isNoteMode);
  const isPaused = useSudokuVariantStore((s) => s.isPaused);
  const isCompleted = useSudokuVariantStore((s) => s.isCompleted);
  const selectCell = useSudokuVariantStore((s) => s.selectCell);
  const setValue = useSudokuVariantStore((s) => s.setValue);
  const clearValue = useSudokuVariantStore((s) => s.clearValue);
  const toggleNote = useSudokuVariantStore((s) => s.toggleNote);
  const toggleNoteMode = useSudokuVariantStore((s) => s.toggleNoteMode);
  const undo = useSudokuVariantStore((s) => s.undo);
  const redo = useSudokuVariantStore((s) => s.redo);
  const togglePause = useSudokuVariantStore((s) => s.togglePause);
  const getHint = useSudokuVariantStore((s) => s.getHint);
  const setMiniValue = useSudokuVariantStore((s) => s.setMiniValue);
  const clearMiniValue = useSudokuVariantStore((s) => s.clearMiniValue);

  const hasGrid = variant === 'diagonal' ? grid !== null : miniGrid !== null;
  const currentGridSize = variant === 'mini4' ? 4 : variant === 'mini6' ? 6 : GRID_SIZE;

  const handleAction = useCallback(
    (action: ShortcutAction) => {
      if (!hasGrid && action !== 'showShortcuts') return;
      if (isPaused && action !== 'pause' && action !== 'showShortcuts') return;
      if (isCompleted && action !== 'showShortcuts') return;

      const isMini = variant === 'mini4' || variant === 'mini6';

      switch (action) {
        case 'input1': case 'input2': case 'input3':
        case 'input4': case 'input5': case 'input6':
        case 'input7': case 'input8': case 'input9': {
          const num = parseInt(action.replace('input', ''), 10) as CellValue;
          if (isMini && num > miniGridSize) return;
          if (!selectedCell) {
            callbacks.onToast?.('请先选中一个单元格');
            return;
          }
          if (isMini) {
            const cell = miniGrid![selectedCell.row][selectedCell.col];
            if (cell.isGiven) return;
            if (isNoteMode) {
              callbacks.onToast?.(`笔记: ${num}`);
            } else {
              setMiniValue(selectedCell.row, selectedCell.col, num);
            }
          } else {
            const cell = grid![selectedCell.row][selectedCell.col];
            if (cell.isGiven) return;
            if (isNoteMode) {
              if (cell.value === 0) {
                toggleNote(num);
                callbacks.onToast?.(`笔记: ${num}`);
              }
            } else {
              setValue(num);
            }
          }
          break;
        }
        case 'erase': {
          if (!selectedCell) return;
          if (isMini) {
            clearMiniValue(selectedCell.row, selectedCell.col);
          } else {
            clearValue();
          }
          callbacks.onToast?.('已擦除');
          break;
        }
        case 'undo': {
          undo();
          callbacks.onToast?.('撤销');
          break;
        }
        case 'redo': {
          redo();
          callbacks.onToast?.('重做');
          break;
        }
        case 'toggleNote': {
          toggleNoteMode();
          callbacks.onToast?.(isNoteMode ? '笔记模式: 关' : '笔记模式: 开');
          break;
        }
        case 'hint': {
          getHint();
          break;
        }
        case 'pause': {
          togglePause();
          callbacks.onToast?.(isPaused ? '继续游戏' : '游戏暂停');
          break;
        }
        case 'moveUp': {
          if (!selectedCell) {
            selectCell({ row: 0, col: 0 });
          } else if (selectedCell.row > 0) {
            selectCell({ row: selectedCell.row - 1, col: selectedCell.col });
          }
          break;
        }
        case 'moveDown': {
          if (!selectedCell) {
            selectCell({ row: 0, col: 0 });
          } else if (selectedCell.row < currentGridSize - 1) {
            selectCell({ row: selectedCell.row + 1, col: selectedCell.col });
          }
          break;
        }
        case 'moveLeft': {
          if (!selectedCell) {
            selectCell({ row: 0, col: 0 });
          } else if (selectedCell.col > 0) {
            selectCell({ row: selectedCell.row, col: selectedCell.col - 1 });
          }
          break;
        }
        case 'moveRight': {
          if (!selectedCell) {
            selectCell({ row: 0, col: 0 });
          } else if (selectedCell.col < currentGridSize - 1) {
            selectCell({ row: selectedCell.row, col: selectedCell.col + 1 });
          }
          break;
        }
        case 'showShortcuts': {
          callbacks.onShowShortcuts?.();
          break;
        }
      }
    },
    [hasGrid, variant, grid, miniGrid, miniGridSize, selectedCell, isNoteMode, isPaused, isCompleted, currentGridSize, selectCell, setValue, clearValue, toggleNote, toggleNoteMode, undo, redo, togglePause, getHint, setMiniValue, clearMiniValue, callbacks],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      for (const def of SHORTCUT_DEFINITIONS) {
        if (!SUDOKU_SHORTCUT_ACTIONS.includes(def.id)) continue;
        const binding: KeyBinding = getBinding(def.id);
        if (isKeyBindingMatch(binding, e, platform)) {
          e.preventDefault();
          handleAction(def.id);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [platform, customBindings, getBinding, handleAction]);
}
