import { useState, useEffect } from 'react';

interface DodgeProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const Dodge: React.FC<DodgeProps> = ({ onGameEnd, onBack }) => {
  const [playerX, setPlayerX] = useState(175);
  const [obstacles, setObstacles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [obstacleId, setObstacleId] = useState(0);

  const GAME_WIDTH = 400;
  const PLAYER_WIDTH = 50;
  const OBSTACLE_SIZE = 40;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.querySelector('.dodge-game');
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, e.clientX - rect.left - PLAYER_WIDTH / 2));
        setPlayerX(x);
      }
    };

    if (gameActive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const spawnInterval = setInterval(() => {
      const newObstacle = {
        id: obstacleId + 1,
        x: Math.random() * (GAME_WIDTH - OBSTACLE_SIZE),
        y: -OBSTACLE_SIZE,
      };
      setObstacleId(prev => prev + 1);
      setObstacles(prev => [...prev, newObstacle]);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [gameActive, obstacleId]);

  useEffect(() => {
    if (!gameActive) return;

    const moveInterval = setInterval(() => {
      setObstacles(prev => {
        const updated = prev
          .map(obs => ({ ...obs, y: obs.y + 5 }))
          .filter(obs => obs.y < 600);

        // Check collisions
        updated.forEach(obs => {
          if (
            obs.y + OBSTACLE_SIZE > 450 &&
            obs.y < 500 &&
            obs.x < playerX + PLAYER_WIDTH &&
            obs.x + OBSTACLE_SIZE > playerX
          ) {
            setGameActive(false);
            onGameEnd('loss', score);
          }
        });

        // Increase score for obstacles that passed
        const passed = prev.length - updated.length;
        if (passed > 0) {
          setScore(s => s + passed * 10);
        }

        return updated;
      });
    }, 30);

    return () => clearInterval(moveInterval);
  }, [gameActive, playerX, score, onGameEnd]);

  const handleEnd = () => {
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🚗 Dodge</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Score: {score}</span>
      </div>
      <div className="dodge-game">
        {/* Player */}
        <div
          className="player-dodge"
          style={{ left: `${playerX}px` }}
        >
          🛡️
        </div>

        {/* Obstacles */}
        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="obstacle-dodge"
            style={{
              left: `${obs.x}px`,
              top: `${obs.y}px`,
            }}
          >
            ◼️
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
