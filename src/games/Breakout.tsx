import { useState, useEffect } from 'react';

interface BreakoutProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const Breakout: React.FC<BreakoutProps> = ({ onGameEnd, onBack }) => {
  const [paddleX, setPaddleX] = useState(175);
  const [ballX, setBallX] = useState(200);
  const [ballY, setBallY] = useState(150);
  const [ballVelX, setBallVelX] = useState(3);
  const [ballVelY, setBallVelY] = useState(-3);
  const [bricks, setBricks] = useState<Array<{ x: number; y: number; active: boolean }>>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    const newBricks = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        newBricks.push({
          x: col * 80,
          y: row * 20 + 20,
          active: true,
        });
      }
    }
    setBricks(newBricks);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.querySelector('.breakout-game');
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = Math.max(0, Math.min(350, e.clientX - rect.left - 25));
        setPaddleX(x);
      }
    };

    if (gameActive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || bricks.every(b => !b.active)) return;

    const interval = setInterval(() => {
      setBallX(prev => {
        let newX = prev + ballVelX;

        if (newX < 0 || newX > 400) {
          setBallVelX(vel => -vel);
          return Math.max(0, Math.min(400, newX));
        }

        return newX;
      });

      setBallY(prev => {
        let newY = prev + ballVelY;

        // Ceiling collision
        if (newY < 0) {
          setBallVelY(vel => -vel);
          return 0;
        }

        // Paddle collision
        if (
          newY + 10 > 350 &&
          newY < 360 &&
          ballX > paddleX &&
          ballX < paddleX + 50
        ) {
          setBallVelY(vel => -vel);
          return 350;
        }

        // Bottom (lose)
        if (newY > 400) {
          setGameActive(false);
          onGameEnd('loss', score);
          return prev;
        }

        return newY;
      });

      // Brick collision
      setBricks(prev => {
        let hitBrick = false;
        const updated = prev.map(brick => {
          if (
            brick.active &&
            ballX > brick.x &&
            ballX < brick.x + 75 &&
            ballY > brick.y &&
            ballY < brick.y + 15
          ) {
            hitBrick = true;
            setScore(s => s + 10);
            return { ...brick, active: false };
          }
          return brick;
        });

        if (hitBrick) {
          setBallVelY(vel => -vel);
        }

        if (updated.every(b => !b.active)) {
          setGameActive(false);
          onGameEnd('win', score + 100);
        }

        return updated;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [gameActive, ballX, ballY, ballVelX, ballVelY, paddleX, score, bricks, onGameEnd]);

  const handleEnd = () => {
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🧱 Breakout</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Score: {score}</span>
        <span>Bricks: {bricks.filter(b => b.active).length}</span>
      </div>
      <div className="breakout-game">
        {/* Bricks */}
        {bricks.map((brick, idx) =>
          brick.active && (
            <div
              key={idx}
              className="brick"
              style={{
                left: `${brick.x}px`,
                top: `${brick.y}px`,
              }}
            />
          )
        )}

        {/* Ball */}
        <div
          className="breakout-ball"
          style={{
            left: `${ballX}px`,
            top: `${ballY}px`,
          }}
        />

        {/* Paddle */}
        <div
          className="paddle-breakout"
          style={{ left: `${paddleX}px` }}
        />
      </div>

      {!gameActive && (
        <div className="game-over">
          <h3>{bricks.every(b => !b.active) ? '🎉 Victory!' : '💀 Game Over!'}</h3>
          <p>Score: {score}</p>
          <button onClick={handleEnd} className="primary-btn">Back</button>
        </div>
      )}
    </div>
  );
};
