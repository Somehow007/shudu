import { useMinesweeperStore } from '../stores/minesweeperStore';

export function FaceButton() {
  const isGameOver = useMinesweeperStore((s) => s.isGameOver);
  const isWin = useMinesweeperStore((s) => s.isWin);
  const isPaused = useMinesweeperStore((s) => s.isPaused);
  const newGame = useMinesweeperStore((s) => s.newGame);
  const difficulty = useMinesweeperStore((s) => s.difficulty);

  const getFace = () => {
    if (isWin) return '😎';
    if (isGameOver) return '😵';
    if (isPaused) return '😴';
    return '🙂';
  };

  const handleClick = () => {
    newGame(difficulty);
  };

  return (
    <button className="face-button" onClick={handleClick} title="重新开始">
      {getFace()}
    </button>
  );
}
