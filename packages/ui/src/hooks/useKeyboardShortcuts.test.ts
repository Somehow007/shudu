import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useGameStore } from '../stores/gameStore';
import { useShortcutStore } from '../stores/shortcutStore';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    useShortcutStore.setState({
      platform: 'mac',
      customBindings: null,
    });
    useGameStore.setState({
      grid: null,
      selectedCell: null,
      isNoteMode: false,
      isPaused: false,
      isCompleted: false,
    });
  });

  it('should call onShowShortcuts when / is pressed', () => {
    const onShowShortcuts = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onShowShortcuts }));

    const event = new KeyboardEvent('keydown', { key: '/' });
    window.dispatchEvent(event);

    expect(onShowShortcuts).toHaveBeenCalled();
  });

  it('should not trigger shortcuts when focus is in input element', () => {
    const onShowShortcuts = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onShowShortcuts }));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent('keydown', { key: '/', bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    window.dispatchEvent(event);

    expect(onShowShortcuts).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it('should call onToast when number key is pressed without selected cell', () => {
    const onToast = vi.fn();
    useGameStore.setState({
      grid: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({
          value: 0,
          isGiven: false,
          note: { candidates: new Set() },
        }))
      ),
      solution: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => 0)
      ),
    });

    renderHook(() => useKeyboardShortcuts({ onToast }));

    const event = new KeyboardEvent('keydown', { key: '1' });
    window.dispatchEvent(event);

    expect(onToast).toHaveBeenCalledWith('请先选中一个单元格');
  });

  it('should not trigger game shortcuts when paused', () => {
    const onToast = vi.fn();
    useGameStore.setState({
      grid: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({
          value: 0,
          isGiven: false,
          note: { candidates: new Set() },
        }))
      ),
      solution: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => 0)
      ),
      isPaused: true,
    });

    renderHook(() => useKeyboardShortcuts({ onToast }));

    const event = new KeyboardEvent('keydown', { key: '1' });
    window.dispatchEvent(event);

    expect(onToast).not.toHaveBeenCalledWith('请先选中一个单元格');
  });

  it('should trigger undo with Cmd+Z on mac', () => {
    const onToast = vi.fn();
    useGameStore.setState({
      grid: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({
          value: 0,
          isGiven: false,
          note: { candidates: new Set() },
        }))
      ),
      solution: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => 0)
      ),
    });

    renderHook(() => useKeyboardShortcuts({ onToast }));

    const event = new KeyboardEvent('keydown', { key: 'z', metaKey: true });
    window.dispatchEvent(event);

    expect(onToast).toHaveBeenCalledWith('撤销');
  });

  it('should trigger undo with Ctrl+Z on windows', () => {
    useShortcutStore.setState({ platform: 'windows' });
    const onToast = vi.fn();
    useGameStore.setState({
      grid: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({
          value: 0,
          isGiven: false,
          note: { candidates: new Set() },
        }))
      ),
      solution: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => 0)
      ),
    });

    renderHook(() => useKeyboardShortcuts({ onToast }));

    const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
    window.dispatchEvent(event);

    expect(onToast).toHaveBeenCalledWith('撤销');
  });

  it('should trigger toggleNote with N key', () => {
    const onToast = vi.fn();
    useGameStore.setState({
      grid: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({
          value: 0,
          isGiven: false,
          note: { candidates: new Set() },
        }))
      ),
      solution: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => 0)
      ),
    });

    renderHook(() => useKeyboardShortcuts({ onToast }));

    const event = new KeyboardEvent('keydown', { key: 'n' });
    window.dispatchEvent(event);

    expect(onToast).toHaveBeenCalledWith('笔记模式: 开');
  });

  it('should move selection with arrow keys', () => {
    useGameStore.setState({
      grid: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({
          value: 0,
          isGiven: false,
          note: { candidates: new Set() },
        }))
      ),
      solution: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => 0)
      ),
      selectedCell: { row: 4, col: 4 },
    });

    renderHook(() => useKeyboardShortcuts({}));

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    window.dispatchEvent(event);

    expect(useGameStore.getState().selectedCell).toEqual({ row: 3, col: 4 });
  });

  it('should not move selection beyond grid boundaries', () => {
    useGameStore.setState({
      grid: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({
          value: 0,
          isGiven: false,
          note: { candidates: new Set() },
        }))
      ),
      solution: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => 0)
      ),
      selectedCell: { row: 0, col: 0 },
    });

    renderHook(() => useKeyboardShortcuts({}));

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    window.dispatchEvent(event);

    expect(useGameStore.getState().selectedCell).toEqual({ row: 0, col: 0 });
  });

  it('should select first cell when no cell is selected and arrow key is pressed', () => {
    useGameStore.setState({
      grid: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({
          value: 0,
          isGiven: false,
          note: { candidates: new Set() },
        }))
      ),
      solution: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => 0)
      ),
      selectedCell: null,
    });

    renderHook(() => useKeyboardShortcuts({}));

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    window.dispatchEvent(event);

    expect(useGameStore.getState().selectedCell).toEqual({ row: 0, col: 0 });
  });
});
