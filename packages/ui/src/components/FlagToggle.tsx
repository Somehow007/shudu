import { useMinesweeperStore } from '../stores/minesweeperStore';

export function FlagToggle() {
  const flagMode = useMinesweeperStore((s) => s.flagMode);
  const toggleFlagMode = useMinesweeperStore((s) => s.toggleFlagMode);

  return (
    <button
      className={`numpad-action-btn ${flagMode ? 'numpad-action-btn--active' : ''}`}
      onClick={toggleFlagMode}
      title={flagMode ? '切换到揭开模式 (N)' : '切换到标旗模式 (N)'}
    >
      {flagMode ? '🚩 标旗' : '👆 揭开'}
    </button>
  );
}
