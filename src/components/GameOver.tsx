import React from 'react';
import '../styles/GameOver.css';

interface GameOverProps {
  // gameId: string;
  gameName: string;
  result: 'win' | 'loss' | 'draw';
  playerScore: number;
  computerScore?: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  gameName,
  result,
  playerScore,
  computerScore,
  onPlayAgain,
  onBackToMenu,
}) => {
  const resultEmoji = result === 'win' ? '🎉' : result === 'draw' ? '🤝' : '💀';
  const resultText = result === 'win' ? 'Victory!' : result === 'draw' ? "It's a Draw!" : 'Defeat!';

  return (
    <div className="game-over-modal">
      <div className="game-over-content">
        <div className="result-emoji">{resultEmoji}</div>
        <h2>{resultText}</h2>
        <h3>{gameName}</h3>

        <div className="score-display">
          <div className="score-item">
            <span className="score-label">Your Score</span>
            <span className="score-value">{playerScore}</span>
          </div>
          {computerScore !== undefined && (
            <div className="score-item">
              <span className="score-label">Computer Score</span>
              <span className="score-value">{computerScore}</span>
            </div>
          )}
        </div>

        <div className="button-group">
          <button onClick={onPlayAgain} className="btn-primary">
            Play Again
          </button>
          <button onClick={onBackToMenu} className="btn-secondary">
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
