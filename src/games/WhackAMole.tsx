import { useState, useEffect } from 'react';

interface WhackAMoleProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const WhackAMole: React.FC<WhackAMoleProps> = ({ onGameEnd, onBack }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameActive(false);
      onGameEnd(score > 15 ? 'win' : 'loss', score);
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score, onGameEnd]);

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      setActiveMole(Math.floor(Math.random() * 9));
    }, 800);

    return () => clearInterval(interval);
  }, [gameActive]);

  const handleWhack = (index: number) => {
    if (index === activeMole) {
      setScore(prev => prev + 1);
      setActiveMole(null);
    }
  };

  const handleEnd = () => {
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🔨 Whack-A-Mole</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>
      <div className="whack-grid">
        {Array(9).fill(0).map((_, idx) => (
          <button
            key={idx}
            className={`mole ${activeMole === idx ? 'active' : ''}`}
            onClick={() => handleWhack(idx)}
            disabled={!gameActive}
          >
            {activeMole === idx ? '🦡' : '🕳️'}
          </button>
        ))}
      </div>

      {!gameActive && (
        <div className="game-over">
          <h3>{score > 15 ? '🎉 Victory!' : '💀 Try Again!'}</h3>
          <p>Score: {score}</p>
          <button onClick={handleEnd} className="primary-btn">Back</button>
        </div>
      )}
    </div>
  );
};
