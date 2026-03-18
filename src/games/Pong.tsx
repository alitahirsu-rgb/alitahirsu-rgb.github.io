import { useState } from 'react';

interface PongGameProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const PongGame: React.FC<PongGameProps> = ({ onGameEnd, onBack }) => {
  const [playerY, setPlayerY] = useState(150);
  const [computerY] = useState(150);
  const [ballX] = useState(200);
  const [ballY] = useState(150);
  const [playerScore] = useState(2);
  const [computerScore] = useState(1);
  const [gameActive, setGameActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    setPlayerY(Math.max(0, Math.min(300, y - 30)));
  };

  const handleStart = () => {
    setGameActive(true);
    setTimeout(() => {
      onGameEnd(playerScore > computerScore ? 'win' : 'loss', playerScore);
      setGameActive(false);
    }, 3000);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🏓 Pong</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>You: {playerScore}</span>
        <span>Computer: {computerScore}</span>
      </div>
      <div
        className="pong-game"
        onMouseMove={handleMouseMove}
        style={{ cursor: 'none' }}
      >
        {/* Player paddle */}
        <div className="paddle" style={{ left: '10px', top: `${playerY}px` }} />
        {/* Computer paddle */}
        <div className="paddle" style={{ right: '10px', top: `${computerY}px` }} />
        {/* Ball */}
        <div className="ball" style={{ left: `${ballX}px`, top: `${ballY}px` }} />
      </div>
      {!gameActive && (
        <div className="button-group">
          <button onClick={handleStart} className="primary-btn">Start Game</button>
        </div>
      )}
      {gameActive && (
        <div className="game-over">
          <h3>Playing...</h3>
          <button onClick={onBack} className="primary-btn">Back</button>
        </div>
      )}
    </div>
  );
};
