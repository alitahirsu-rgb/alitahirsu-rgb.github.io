import React, { useState } from 'react';
import { GAMES } from '../games';
import { loadStats } from '../utils/storage';
import '../styles/GameMenu.css';

interface GameMenuProps {
  onGameSelect: (gameId: string) => void;
  onStatsClick: () => void;
}

type FilterCategory = 'all' | 'arcade' | 'card' | 'puzzle' | 'reflex';

export const GameMenu: React.FC<GameMenuProps> = ({ onGameSelect, onStatsClick }) => {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const stats = loadStats();

  const filteredGames = GAMES.filter(game => {
    const matchesFilter = filter === 'all' || game.category === filter;
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="game-menu">
      <div className="menu-header">
        <h1>🎮 Arcade Legends</h1>
        <p>20 Classic Games • User vs Computer</p>
      </div>

      <div className="menu-controls">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={onStatsClick} className="stats-btn">
          📊 Leaderboard
        </button>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Games
        </button>
        <button
          className={`filter-btn ${filter === 'arcade' ? 'active' : ''}`}
          onClick={() => setFilter('arcade')}
        >
          🎯 Arcade
        </button>
        <button
          className={`filter-btn ${filter === 'card' ? 'active' : ''}`}
          onClick={() => setFilter('card')}
        >
          🃏 Cards
        </button>
        <button
          className={`filter-btn ${filter === 'puzzle' ? 'active' : ''}`}
          onClick={() => setFilter('puzzle')}
        >
          🧩 Puzzles
        </button>
        <button
          className={`filter-btn ${filter === 'reflex' ? 'active' : ''}`}
          onClick={() => setFilter('reflex')}
        >
          ⚡ Reflex
        </button>
      </div>

      <div className="games-grid">
        {filteredGames.map((game) => {
          const gameStats = stats[game.id];
          const wins = gameStats?.wins || 0;
          const total = gameStats?.totalGames || 0;

          return (
            <button
              key={game.id}
              className="game-card"
              onClick={() => onGameSelect(game.id)}
            >
              <div className="game-icon">{game.icon}</div>
              <h3>{game.name}</h3>
              <p className="game-description">{game.description}</p>
              <div className="game-meta">
                <span className={`difficulty ${game.difficulty}`}>
                  {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                </span>
                {total > 0 && (
                  <span className="game-stats">
                    {wins}/{total} wins
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="no-results">
          <p>No games found. Try a different search or filter.</p>
        </div>
      )}
    </div>
  );
};
