import React from 'react';
import { loadStats } from '../utils/storage';
import { GAMES } from '../games';
import '../styles/Leaderboard.css';

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const stats = loadStats();

  const gameStats = GAMES.map(game => {
    const stat = stats[game.id];
    return {
      ...game,
      wins: stat?.wins || 0,
      losses: stat?.losses || 0,
      totalGames: stat?.totalGames || 0,
      highScore: stat?.highScore || 0,
      lastPlayed: stat?.lastPlayed || 0,
    };
  }).sort((a, b) => b.totalGames - a.totalGames);

  const totalStats = {
    totalGames: Object.values(stats).reduce((sum, s) => sum + s.totalGames, 0),
    totalWins: Object.values(stats).reduce((sum, s) => sum + s.wins, 0),
    totalLosses: Object.values(stats).reduce((sum, s) => sum + s.losses, 0),
  };

  const winRate = totalStats.totalGames > 0
    ? ((totalStats.totalWins / totalStats.totalGames) * 100).toFixed(1)
    : 0;

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h1>📊 Leaderboard</h1>
        <button onClick={onBack} className="back-btn">← Back to Menu</button>
      </div>

      <div className="overall-stats">
        <div className="stat-box">
          <h3>Total Games Played</h3>
          <p className="stat-value">{totalStats.totalGames}</p>
        </div>
        <div className="stat-box">
          <h3>Total Wins</h3>
          <p className="stat-value">{totalStats.totalWins}</p>
        </div>
        <div className="stat-box">
          <h3>Win Rate</h3>
          <p className="stat-value">{winRate}%</p>
        </div>
        <div className="stat-box">
          <h3>Games Mastered</h3>
          <p className="stat-value">
            {gameStats.filter(g => g.totalGames >= 5).length}/20
          </p>
        </div>
      </div>

      <div className="game-stats-list">
        <h2>Game Statistics</h2>
        <div className="stats-table-header">
          <div className="stat-col stat-rank">Rank</div>
          <div className="stat-col stat-game">Game</div>
          <div className="stat-col stat-number">Plays</div>
          <div className="stat-col stat-number">Wins</div>
          <div className="stat-col stat-number">Losses</div>
          <div className="stat-col stat-number">Win %</div>
          <div className="stat-col stat-number">High Score</div>
        </div>

        {gameStats.map((game, index) => {
          const winRate = game.totalGames > 0
            ? ((game.wins / game.totalGames) * 100).toFixed(0)
            : 0;

          return (
            <div
              key={game.id}
              className={`stats-row ${game.totalGames === 0 ? 'not-played' : ''}`}
            >
              <div className="stat-col stat-rank">
                {game.totalGames > 0 ? index + 1 : '-'}
              </div>
              <div className="stat-col stat-game">
                <span className="game-icon">{game.icon}</span>
                <span>{game.name}</span>
              </div>
              <div className="stat-col stat-number">{game.totalGames}</div>
              <div className="stat-col stat-number" style={{ color: '#4ade80' }}>
                {game.wins}
              </div>
              <div className="stat-col stat-number" style={{ color: '#f87171' }}>
                {game.losses}
              </div>
              <div className="stat-col stat-number">
                {game.totalGames > 0 ? `${winRate}%` : '-'}
              </div>
              <div className="stat-col stat-number">{game.highScore}</div>
            </div>
          );
        })}
      </div>

      <div className="leaderboard-footer">
        <p>Keep playing to improve your stats! 🚀</p>
      </div>
    </div>
  );
};
