import { useEffect, useCallback } from 'react';
import { useMineVariantStore } from '../stores/mineVariantStore';
import { useShortcutStore } from '../stores/shortcutStore';
import {
  type ShortcutAction,
  type KeyBinding,
  isKeyBindingMatch,
  SHORTCUT_DEFINITIONS,
} from '@shudu/shared';

interface MineVariantShortcutCallbacks {
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

export function useMineVariantKeyboardShortcuts(callbacks: MineVariantShortcutCallbacks = {}) {
  const platform = useShortcutStore((s) => s.platform);
  const customBindings = useShortcutStore((s) => s.customBindings);
  const getBinding = useShortcutStore((s) => s.getBinding);

  const grid = useMineVariantStore((s) => s.grid);
  const isPaused = useMineVariantStore((s) => s.isPaused);
  const isGameOver = useMineVariantStore((s) => s.isGameOver);
  const flagMode = useMineVariantStore((s) => s.flagMode);
  const selectedCell = useMineVariantStore((s) => s.selectedCell);
  const difficulty = useMineVariantStore((s) => s.difficulty);
  const variant = useMineVariantStore((s) => s.variant);
  const handleCellClick = useMineVariantStore((s) => s.handleCellClick);
  const handleCellRightClick = useMineVariantStore((s) => s.handleCellRightClick);
  const handleCellDoubleClick = useMineVariantStore((s) => s.handleCellDoubleClick);
  const toggleFlagMode = useMineVariantStore((s) => s.toggleFlagMode);
  const newGame = useMineVariantStore((s) => s.newGame);
  const getHint = useMineVariantStore((s) => s.getHint);
  const togglePause = useMineVariantStore((s) => s.togglePause);
  const selectCell = useMineVariantStore((s) => s.selectCell);

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
          newGame(difficulty, variant);
          callbacks.onToast?.('新游戏');
          break;
        }
        case 'mineHint': {
          getHint();
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
    [grid, selectedCell, isPaused, isGameOver, flagMode, difficulty, variant, handleCellClick, handleCellRightClick, handleCellDoubleClick, toggleFlagMode, newGame, getHint, togglePause, selectCell, callbacks],
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
