import { useMinesweeperStore } from '../stores/minesweeperStore';

export function MineCounter() {
  const config = useMinesweeperStore((s) => s.config);
  const flagCount = useMinesweeperStore((s) => s.flagCount);

  if (!config) return null;

  const remaining = Math.max(0, config.mineCount - flagCount);

  const display = String(remaining).padStart(3, '0');

  return (
    <div className="mine-counter">
      <span className="mine-counter__icon">💣</span>
      <span className="mine-counter__display">{display}</span>
    </div>
  );
}
