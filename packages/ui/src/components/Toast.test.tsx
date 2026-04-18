import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ToastContainer, showToast } from './Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render nothing when no toasts', () => {
    const { container } = render(<ToastContainer />);
    expect(container.innerHTML).toBe('');
  });

  it('should render toast message', () => {
    render(<ToastContainer />);
    act(() => {
      showToast('测试消息');
    });
    expect(screen.getByText('测试消息')).toBeInTheDocument();
  });

  it('should render multiple toasts', () => {
    render(<ToastContainer />);
    act(() => {
      showToast('消息1');
      showToast('消息2');
    });
    expect(screen.getByText('消息1')).toBeInTheDocument();
    expect(screen.getByText('消息2')).toBeInTheDocument();
  });

  it('should remove toast after duration', () => {
    render(<ToastContainer />);
    act(() => {
      showToast('短暂消息', 1000);
    });
    expect(screen.getByText('短暂消息')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.queryByText('短暂消息')).toBeNull();
  });
});
