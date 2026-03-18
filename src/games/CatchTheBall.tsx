import { useState, useEffect } from 'react';

interface CatchTheBallProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const CatchTheBall: React.FC<CatchTheBallProps> = ({ onGameEnd, onBack }) => {
  const [ballX, setBallX] = useState(175);
  const [ballY, setBallY] = useState(100);
  const [ballVelX, setBallVelX] = useState(3);
  const [ballVelY, setBallVelY] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [bucketX, setBucketX] = useState(175);

  const GAME_WIDTH = 350;
  const GAME_HEIGHT = 400;
  const BALL_SIZE = 20;
  const BUCKET_WIDTH = 60;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.querySelector('.catch-game');
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = Math.max(0, Math.min(GAME_WIDTH - BUCKET_WIDTH, e.clientX - rect.left - BUCKET_WIDTH / 2));
        setBucketX(x);
      }
    };

    if (gameActive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameActive]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameActive(false);
      onGameEnd(score > 10 ? 'win' : 'loss', score);
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score, onGameEnd]);

  useEffect(() => {
    if (!gameActive) return;

    const moveInterval = setInterval(() => {
      setBallX(prev => {
        let newX = prev + ballVelX;
        if (newX < 0 || newX + BALL_SIZE > GAME_WIDTH) {
          setBallVelX(vel => -vel);
          return Math.max(0, Math.min(GAME_WIDTH - BALL_SIZE, newX));
        }
        return newX;
      });

      setBallY(prev => {
        let newY = prev + ballVelY;

        if (newY < 0) {
          setBallVelY(vel => -vel);
          return 0;
        }

        // Check if caught
        if (
          newY + BALL_SIZE > GAME_HEIGHT - 20 &&
          newY < GAME_HEIGHT &&
          ballX > bucketX &&
          ballX < bucketX + BUCKET_WIDTH
        ) {
          // Reset ball
          setBallX(Math.random() * (GAME_WIDTH - BALL_SIZE));
          setBallY(0);
          setBallVelX((Math.random() - 0.5) * 6);
          setBallVelY(3);
          setScore(s => s + 1);
          return 0;
        }

        if (newY > GAME_HEIGHT) {
          // Reset ball
          setBallX(Math.random() * (GAME_WIDTH - BALL_SIZE));
          setBallY(0);
          setBallVelX((Math.random() - 0.5) * 6);
          setBallVelY(3);
          return 0;
        }

        return newY;
      });
    }, 30);

    return () => clearInterval(moveInterval);
  }, [gameActive, ballVelX, ballVelY, ballX, bucketX]);

  const handleEnd = () => {
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🎾 Catch the Ball</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>
      <div className="catch-game">
        {/* Ball */}
        <div
          className="catch-ball"
          style={{
            left: `${ballX}px`,
            top: `${ballY}px`,
          }}
        >
          ⚽
        </div>

        {/* Bucket */}
        <div
          className="bucket"
          style={{
            left: `${bucketX}px`,
          }}
        >
          🪣
        </div>
      </div>

      {!gameActive && (
        <div className="game-over">
          <h3>{score > 10 ? '🎉 Victory!' : '💀 Try Again!'}</h3>
          <p>Score: {score}</p>
          <button onClick={handleEnd} className="primary-btn">Back</button>
        </div>
      )}
    </div>
  );
};
