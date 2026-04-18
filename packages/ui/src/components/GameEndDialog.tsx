import { Dialog } from './Dialog';
import { formatTime } from '@shudu/shared';

interface GameEndDialogProps {
  isOpen: boolean;
  isWin: boolean;
  elapsedTime: number;
  difficulty: string;
  clickCount: number;
  onNewGame: () => void;
  onReview: () => void;
  onBackToMenu: () => void;
}

export function GameEndDialog({
  isOpen,
  isWin,
  elapsedTime,
  difficulty,
  clickCount,
  onNewGame,
  onReview,
  onBackToMenu,
}: GameEndDialogProps) {
  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} title={isWin ? '🎉 恭喜胜利！' : '💥 游戏结束'} onClose={onReview}>
      <div className="game-end-dialog">
        <div className="game-end-dialog__emoji">{isWin ? '😎' : '😵'}</div>
        <div className="game-end-dialog__stats">
          <div className="game-end-dialog__stat">
            <span className="game-end-dialog__label">难度</span>
            <span className="game-end-dialog__value">{difficulty}</span>
          </div>
          <div className="game-end-dialog__stat">
            <span className="game-end-dialog__label">用时</span>
            <span className="game-end-dialog__value">{formatTime(elapsedTime)}</span>
          </div>
          <div className="game-end-dialog__stat">
            <span className="game-end-dialog__label">点击次数</span>
            <span className="game-end-dialog__value">{clickCount}</span>
          </div>
        </div>
        <div className="game-end-dialog__actions">
          <button className="game-end-dialog__btn game-end-dialog__btn--primary" onClick={onNewGame}>
            🔄 再来一局
          </button>
          {!isWin && (
            <button className="game-end-dialog__btn game-end-dialog__btn--secondary" onClick={onReview}>
              👁️ 复盘
            </button>
          )}
          <button className="game-end-dialog__btn game-end-dialog__btn--ghost" onClick={onBackToMenu}>
            🏠 主菜单
          </button>
        </div>
      </div>
    </Dialog>
  );
}
