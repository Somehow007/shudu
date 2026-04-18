import { useGameStore } from '../stores/gameStore';
import { DIFFICULTY_LABELS, formatTime } from '@shudu/shared';
import type { Difficulty } from '@shudu/core';

export function SudokuStatsPanel() {
  const statistics = useGameStore((s) => s.statistics);

  const winRate = statistics.gamesPlayed > 0
    ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
    : 0;

  const difficultyStats = (['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((d) => {
    const played = statistics.difficultyDistribution[d];
    const won = statistics.difficultyWins[d];
    return {
      difficulty: d,
      label: DIFFICULTY_LABELS[d],
      played,
      won,
      winRate: played > 0 ? Math.round((won / played) * 100) : 0,
      bestTime: statistics.bestTimes[d],
    };
  });

  return (
    <div className="stats-panel">
      <div className="stats-panel__overview">
        <div className="stats-panel__card">
          <span className="stats-panel__card-value">{statistics.gamesPlayed}</span>
          <span className="stats-panel__card-label">总局数</span>
        </div>
        <div className="stats-panel__card">
          <span className="stats-panel__card-value stats-panel__card-value--win">{statistics.gamesWon}</span>
          <span className="stats-panel__card-label">胜利</span>
        </div>
        <div className="stats-panel__card">
          <span className="stats-panel__card-value">{winRate}%</span>
          <span className="stats-panel__card-label">胜率</span>
        </div>
        <div className="stats-panel__card">
          <span className="stats-panel__card-value">{statistics.currentStreak}</span>
          <span className="stats-panel__card-label">当前连胜</span>
        </div>
        <div className="stats-panel__card">
          <span className="stats-panel__card-value">{statistics.bestStreak}</span>
          <span className="stats-panel__card-label">最佳连胜</span>
        </div>
      </div>

      <div className="stats-panel__section">
        <h3 className="stats-panel__section-title">各难度统计</h3>
        <div className="stats-panel__difficulty-table">
          <div className="stats-panel__table-header">
            <span>难度</span>
            <span>局数</span>
            <span>胜率</span>
            <span>最佳</span>
          </div>
          {difficultyStats.map((ds) => (
            <div key={ds.difficulty} className="stats-panel__table-row">
              <span className="stats-panel__table-difficulty">{ds.label}</span>
              <span>{ds.played}</span>
              <span>{ds.winRate}%</span>
              <span>{formatTime(ds.bestTime!, true)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-panel__section">
        <h3 className="stats-panel__section-title">难度分布</h3>
        {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((d) => (
          <div key={d} className="stats-panel__distribution-item">
            <span className="stats-panel__distribution-label">{DIFFICULTY_LABELS[d]}</span>
            <div className="stats-panel__distribution-bar-container">
              <div
                className="stats-panel__distribution-bar"
                style={{
                  width: `${statistics.gamesPlayed > 0 ? (statistics.difficultyDistribution[d] / statistics.gamesPlayed) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="stats-panel__distribution-count">{statistics.difficultyDistribution[d]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
