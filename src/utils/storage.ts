import type { PlayerStats } from '../types';

const STORAGE_KEY = 'arcadeGameStats';

export const loadStats = (): PlayerStats => {
  try {
    const stats = localStorage.getItem(STORAGE_KEY);
    return stats ? JSON.parse(stats) : {};
  } catch {
    return {};
  }
};

export const saveStats = (stats: PlayerStats): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    console.error('Failed to save stats');
  }
};

export const updateGameStats = (gameId: string, gameName: string, result: 'win' | 'loss' | 'draw', score: number): void => {
  const stats = loadStats();
  
  if (!stats[gameId]) {
    stats[gameId] = {
      gameId,
      gameName,
      wins: 0,
      losses: 0,
      highScore: 0,
      totalGames: 0,
      lastPlayed: Date.now(),
    };
  }

  stats[gameId].totalGames++;
  stats[gameId].lastPlayed = Date.now();
  stats[gameId].highScore = Math.max(stats[gameId].highScore, score);
  
  if (result === 'win') stats[gameId].wins++;
  if (result === 'loss') stats[gameId].losses++;

  saveStats(stats);
};
