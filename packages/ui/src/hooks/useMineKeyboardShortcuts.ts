import { useEffect, useCallback } from 'react';
import { useMinesweeperStore } from '../stores/minesweeperStore';
import { useShortcutStore } from '../stores/shortcutStore';
import {
  type ShortcutAction,
  type KeyBinding,
  isKeyBindingMatch,
  SHORTCUT_DEFINITIONS,
} from '@shudu/shared';

interface MineShortcutCallbacks {
  onShowShortcuts?: () => void;
  onToast?: (message: string) => void;
  onBack?: () => void;
}

const MINE_SHORTCUT_ACTIONS: ShortcutAction[] = [
  'mineFlag',
  'mineReveal',
  'mineChord',
  'mineToggleFlagMode',
  'mineNewGame',
  'mineHint',
  'minePause',
  'moveUp',
  'moveDown',
  'moveLeft',
  'moveRight',
  'showShortcuts',
];

export function useMineKeyboardShortcuts(callbacks: MineShortcutCallbacks = {}) {
  const platform = useShortcutStore((s) => s.platform);
  const customBindings = useShortcutStore((s) => s.customBindings);
  const getBinding = useShortcutStore((s) => s.getBinding);

  const grid = useMinesweeperStore((s) => s.grid);
  const isPaused = useMinesweeperStore((s) => s.isPaused);
  const isGameOver = useMinesweeperStore((s) => s.isGameOver);
  const flagMode = useMinesweeperStore((s) => s.flagMode);
  const selectedCell = useMinesweeperStore((s) => s.selectedCell);
  const difficulty = useMinesweeperStore((s) => s.difficulty);
  const handleCellClick = useMinesweeperStore((s) => s.handleCellClick);
  const handleCellRightClick = useMinesweeperStore((s) => s.handleCellRightClick);
  const handleCellDoubleClick = useMinesweeperStore((s) => s.handleCellDoubleClick);
  const toggleFlagMode = useMinesweeperStore((s) => s.toggleFlagMode);
  const newGame = useMinesweeperStore((s) => s.newGame);
  const getHint = useMinesweeperStore((s) => s.getHint);
  const togglePause = useMinesweeperStore((s) => s.togglePause);
  const selectCell = useMinesweeperStore((s) => s.selectCell);

  const handleAction = useCallback(
    (action: ShortcutAction) => {
      if (!grid && action !== 'showShortcuts' && action !== 'mineNewGame') return;
      if (isPaused && action !== 'minePause' && action !== 'showShortcuts' && action !== 'mineNewGame') return;
      if (isGameOver && action !== 'showShortcuts' && action !== 'mineNewGame') return;

      switch (action) {
        case 'mineFlag': {
          if (!selectedCell) {
            callbacks.onToast?.('请先选中一个格子');
            return;
          }
          handleCellRightClick(selectedCell);
          break;
        }
        case 'mineReveal': {
          if (!selectedCell) {
            callbacks.onToast?.('请先选中一个格子');
            return;
          }
          if (flagMode) {
            handleCellRightClick(selectedCell);
          } else {
            handleCellClick(selectedCell);
          }
          break;
        }
        case 'mineChord': {
          if (!selectedCell) {
            callbacks.onToast?.('请先选中一个格子');
            return;
          }
          handleCellDoubleClick(selectedCell);
          break;
        }
        case 'mineToggleFlagMode': {
          toggleFlagMode();
          callbacks.onToast?.(flagMode ? '标旗模式: 关' : '标旗模式: 开');
          break;
        }
        case 'mineNewGame': {
          newGame(difficulty);
          callbacks.onToast?.('新游戏');
          break;
        }
        case 'mineHint': {
          getHint();
          callbacks.onToast?.('提示');
          break;
        }
        case 'minePause': {
          togglePause();
          callbacks.onToast?.(isPaused ? '继续游戏' : '游戏暂停');
          break;
        }
        case 'moveUp': {
          if (!grid) return;
          if (!selectedCell) {
            selectCell({ row: 0, col: 0 });
          } else if (selectedCell.row > 0) {
            selectCell({ row: selectedCell.row - 1, col: selectedCell.col });
          }
          break;
        }
        case 'moveDown': {
          if (!grid) return;
          const rows = grid.length;
          if (!selectedCell) {
            selectCell({ row: 0, col: 0 });
          } else if (selectedCell.row < rows - 1) {
            selectCell({ row: selectedCell.row + 1, col: selectedCell.col });
          }
          break;
        }
        case 'moveLeft': {
          if (!grid) return;
          if (!selectedCell) {
            selectCell({ row: 0, col: 0 });
          } else if (selectedCell.col > 0) {
            selectCell({ row: selectedCell.row, col: selectedCell.col - 1 });
          }
          break;
        }
        case 'moveRight': {
          if (!grid) return;
          const cols = grid[0].length;
          if (!selectedCell) {
            selectCell({ row: 0, col: 0 });
          } else if (selectedCell.col < cols - 1) {
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
    [grid, selectedCell, isPaused, isGameOver, flagMode, difficulty, handleCellClick, handleCellRightClick, handleCellDoubleClick, toggleFlagMode, newGame, getHint, togglePause, selectCell, callbacks],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      for (const def of SHORTCUT_DEFINITIONS) {
        if (!MINE_SHORTCUT_ACTIONS.includes(def.id)) continue;
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
