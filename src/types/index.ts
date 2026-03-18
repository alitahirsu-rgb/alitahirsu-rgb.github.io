export interface Game {
  id: string;
  name: string;
  description: string;
  category: 'arcade' | 'card' | 'puzzle' | 'reflex';
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
}

export interface GameStats {
  gameId: string;
  gameName: string;
  wins: number;
  losses: number;
  highScore: number;
  totalGames: number;
  lastPlayed: number;
}

export interface PlayerStats {
  [gameId: string]: GameStats;
}

export interface GameResult {
  gameId: string;
  gameName: string;
  playerScore: number;
  computerScore: number;
  result: 'win' | 'loss' | 'draw';
  timestamp: number;
}
