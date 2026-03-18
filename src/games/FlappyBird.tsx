import { useState, useEffect } from 'react';

interface FlappyBirdProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const FlappyBird: React.FC<FlappyBirdProps> = ({ onGameEnd, onBack }) => {
  const [birdY, setBirdY] = useState(150);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<Array<{ id: number; x: number }>>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [pipeId, setPipeId] = useState(0);

  const BIRD_SIZE = 20;
  const GRAVITY = 0.6;
  const FLAP_STRENGTH = -10;

  useEffect(() => {
    const handleFlap = (e: KeyboardEvent | MouseEvent) => {
      if (gameActive && (e.type === 'keydown' || e.type === 'click')) {
        setVelocity(FLAP_STRENGTH);
      }
    };

    window.addEventListener('keydown', handleFlap);
    window.addEventListener('click', handleFlap);

    return () => {
      window.removeEventListener('keydown', handleFlap);
      window.removeEventListener('click', handleFlap);
    };
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const gameLoop = setInterval(() => {
      setBirdY(prev => {
        const newY = prev + velocity;
        setVelocity(v => v + GRAVITY);

        if (newY < 0 || newY + BIRD_SIZE > 400) {
          setGameActive(false);
          onGameEnd('loss', score);
        }

        return Math.max(0, Math.min(400 - BIRD_SIZE, newY));
      });
    }, 30);

    return () => clearInterval(gameLoop);
  }, [gameActive, velocity, score, onGameEnd]);

  useEffect(() => {
    if (!gameActive) return;

    const spawnInterval = setInterval(() => {
      // const gapSize = 100;
      // const gapStart = Math.random() * (400 - gapSize);

      const newPipe = {
        id: pipeId + 1,
        x: 400,
      };

      setPipeId(prev => prev + 1);
      setPipes(prev => [...prev, newPipe]);
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [gameActive, pipeId]);

  useEffect(() => {
    if (!gameActive) return;

    const moveInterval = setInterval(() => {
      setPipes(prev => {
        const updated = prev
          .map(pipe => ({ ...pipe, x: pipe.x - 5 }))
          .filter(pipe => pipe.x > -50);

        updated.forEach(pipe => {
          if (pipe.x === 50) {
            setScore(s => s + 1);
          }
        });

        return updated;
      });
    }, 30);

    return () => clearInterval(moveInterval);
  }, [gameActive]);

  const handleEnd = () => {
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🐦 Flappy Bird</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Score: {score}</span>
      </div>
      <div className="flappy-game">
        {/* Bird */}
        <div
          className="bird"
          style={{ top: `${birdY}px` }}
        >
          🐦
        </div>

        {/* Pipes */}
        {pipes.map((pipe) => (
          <div key={pipe.id} className="pipe-container" style={{ left: `${pipe.x}px` }}>
            <div className="pipe-top" style={{ height: '150px' }}></div>
            <div className="pipe-bottom" style={{ height: '150px' }}></div>
          </div>
        ))}
      </div>

      {!gameActive && (
        <div className="game-over">
          <h3>💀 Game Over!</h3>
          <p>Score: {score}</p>
          <button onClick={handleEnd} className="primary-btn">Back</button>
        </div>
      )}
    </div>
  );
};
