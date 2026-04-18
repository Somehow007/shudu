import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShortcutHelpPanel } from './ShortcutHelpPanel';
import { useShortcutStore } from '../stores/shortcutStore';
import { getDefaultBindings } from '@shudu/shared';
import type { ShortcutAction, KeyBinding } from '@shudu/shared';

describe('ShortcutHelpPanel', () => {
  beforeEach(() => {
    useShortcutStore.setState({
      platform: 'mac',
      customBindings: null,
    });
  });

  it('should not render when closed', () => {
    render(<ShortcutHelpPanel isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText('⌨️ 键盘快捷键')).toBeNull();
  });

  it('should render when open', () => {
    render(<ShortcutHelpPanel isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('⌨️ 键盘快捷键')).toBeInTheDocument();
  });

  it('should display platform label', () => {
    render(<ShortcutHelpPanel isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('macOS')).toBeInTheDocument();
  });

  it('should display all shortcut categories', () => {
    render(<ShortcutHelpPanel isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('输入')).toBeInTheDocument();
    expect(screen.getByText('导航')).toBeInTheDocument();
    expect(screen.getByText('游戏操作')).toBeInTheDocument();
    expect(screen.getByText('其他')).toBeInTheDocument();
  });

  it('should display shortcut labels', () => {
    render(<ShortcutHelpPanel isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('填入数字 1')).toBeInTheDocument();
    expect(screen.getByText('撤销')).toBeInTheDocument();
    expect(screen.getByText('向上移动')).toBeInTheDocument();
  });

  it('should call onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<ShortcutHelpPanel isOpen={true} onClose={onClose} />);
    const overlay = screen.getByText('⌨️ 键盘快捷键').closest('.shortcut-overlay');
    if (overlay) {
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<ShortcutHelpPanel isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<ShortcutHelpPanel isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('should show Windows platform label', () => {
    useShortcutStore.setState({ platform: 'windows' });
    render(<ShortcutHelpPanel isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Windows')).toBeInTheDocument();
  });

  it('should show custom bindings when available', () => {
    const defaults = getDefaultBindings('mac') as Record<ShortcutAction, KeyBinding>;
    useShortcutStore.setState({
      platform: 'mac',
      customBindings: {
        ...defaults,
        undo: { key: 'z', ctrlKey: true },
      },
    });
    render(<ShortcutHelpPanel isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('⌃Z')).toBeInTheDocument();
  });
});
