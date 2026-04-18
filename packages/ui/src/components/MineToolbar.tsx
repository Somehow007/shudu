import { useMinesweeperStore } from '../stores/minesweeperStore';
import { MINE_DIFFICULTY_LABELS } from '@shudu/shared';

export function MineToolbar() {
  const grid = useMinesweeperStore((s) => s.grid);
  const difficulty = useMinesweeperStore((s) => s.difficulty);
  const isGameOver = useMinesweeperStore((s) => s.isGameOver);
  const isPaused = useMinesweeperStore((s) => s.isPaused);
  const togglePause = useMinesweeperStore((s) => s.togglePause);
  const getHint = useMinesweeperStore((s) => s.getHint);
  const newGame = useMinesweeperStore((s) => s.newGame);

  return (
    <div className="toolbar">
      <div className="toolbar__info">
        <span className="toolbar__difficulty">
          {MINE_DIFFICULTY_LABELS[difficulty]}
        </span>
      </div>

      <div className="toolbar__actions">
        <button
          className="toolbar__btn"
          onClick={() => newGame(difficulty)}
          title="重新开始 (F2)"
        >
          🔄 重来
        </button>
        <button
          className="toolbar__btn"
          onClick={getHint}
          disabled={!grid || isGameOver}
          title="提示 (H)"
        >
          💡 提示
        </button>
        <button
          className="toolbar__btn"
          onClick={togglePause}
          disabled={!grid || isGameOver}
          title={isPaused ? '继续 (P)' : '暂停 (P)'}
        >
          {isPaused ? '▶️ 继续' : '⏸️ 暂停'}
        </button>
      </div>
    </div>
  );
}
