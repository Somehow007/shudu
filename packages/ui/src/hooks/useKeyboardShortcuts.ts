import { useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
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

export function useKeyboardShortcuts(callbacks: ShortcutCallbacks = {}) {
  const platform = useShortcutStore((s) => s.platform);
  const customBindings = useShortcutStore((s) => s.customBindings);
  const getBinding = useShortcutStore((s) => s.getBinding);

  const grid = useGameStore((s) => s.grid);
  const selectedCell = useGameStore((s) => s.selectedCell);
  const isNoteMode = useGameStore((s) => s.isNoteMode);
  const isPaused = useGameStore((s) => s.isPaused);
  const isCompleted = useGameStore((s) => s.isCompleted);
  const selectCell = useGameStore((s) => s.selectCell);
  const setValue = useGameStore((s) => s.setValue);
  const clearValue = useGameStore((s) => s.clearValue);
  const toggleNote = useGameStore((s) => s.toggleNote);
  const toggleNoteMode = useGameStore((s) => s.toggleNoteMode);
  const undo = useGameStore((s) => s.undo);
  const redo = useGameStore((s) => s.redo);
  const togglePause = useGameStore((s) => s.togglePause);
  const getHint = useGameStore((s) => s.getHint);

  const handleAction = useCallback(
    (action: ShortcutAction) => {
      if (!grid && action !== 'showShortcuts') return;
      if (isPaused && action !== 'pause' && action !== 'showShortcuts') return;
      if (isCompleted && action !== 'showShortcuts') return;

      switch (action) {
        case 'input1': case 'input2': case 'input3':
        case 'input4': case 'input5': case 'input6':
        case 'input7': case 'input8': case 'input9': {
          const num = parseInt(action.replace('input', ''), 10) as CellValue;
          if (!selectedCell) {
            callbacks.onToast?.('请先选中一个单元格');
            return;
          }
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
          break;
        }
        case 'erase': {
          if (!selectedCell) return;
          clearValue();
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
          callbacks.onToast?.('提示');
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
          } else if (selectedCell.row < GRID_SIZE - 1) {
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
          } else if (selectedCell.col < GRID_SIZE - 1) {
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
    [grid, selectedCell, isNoteMode, isPaused, isCompleted, selectCell, setValue, clearValue, toggleNote, toggleNoteMode, undo, redo, togglePause, getHint, callbacks],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      for (const def of SHORTCUT_DEFINITIONS) {
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
