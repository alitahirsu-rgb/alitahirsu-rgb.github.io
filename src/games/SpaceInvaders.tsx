import { useState, useEffect } from 'react';

interface SpaceInvadersProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const SpaceInvaders: React.FC<SpaceInvadersProps> = ({ onGameEnd, onBack }) => {
  const [playerX, setPlayerX] = useState(175);
  const [enemies, setEnemies] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [bullets, setBullets] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [enemyId, setEnemyId] = useState(0);
  const [bulletId, setBulletId] = useState(0);
  // const PLAYER_WIDTH = 30;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.querySelector('.space-invaders');
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = Math.max(0, Math.min(370, e.clientX - rect.left - 15));
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
      const newEnemy = {
        id: enemyId + 1,
        x: Math.random() * 370,
        y: 0,
      };
      setEnemyId(prev => prev + 1);
      setEnemies(prev => [...prev, newEnemy]);
    }, 1000);

    return () => clearInterval(spawnInterval);
  }, [gameActive, enemyId]);

  useEffect(() => {
    if (!gameActive) return;

    const handleShoot = () => {
      const newBullet = {
        id: bulletId + 1,
        x: playerX + 15,
        y: 350,
      };
      setBulletId(prev => prev + 1);
      setBullets(prev => [...prev, newBullet]);
    };

    window.addEventListener('click', handleShoot);
    return () => window.removeEventListener('click', handleShoot);
  }, [gameActive, playerX, bulletId]);

  useEffect(() => {
    if (!gameActive) return;

    const moveInterval = setInterval(() => {
      // Move enemies
      setEnemies(prev => {
        const updated = prev
          .map(enemy => ({ ...enemy, y: enemy.y + 3 }))
          .filter(enemy => {
            if (enemy.y > 400) {
              setGameActive(false);
              onGameEnd('loss', score);
              return false;
            }
            return true;
          });

        return updated;
      });

      // Move bullets and check collisions
      setBullets(prev => {
        const updated = prev.map(bullet => ({ ...bullet, y: bullet.y - 5 })).filter(b => b.y > 0);

        setEnemies(enemies => {
          const newEnemies = enemies.filter(enemy => {
            let hit = false;
            updated.forEach((bullet, idx) => {
              if (
                bullet.x > enemy.x &&
                bullet.x < enemy.x + 20 &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + 20
              ) {
                hit = true;
                updated.splice(idx, 1);
                setScore(s => s + 10);
              }
            });
            return !hit;
          });

          return newEnemies;
        });

        return updated;
      });
    }, 30);

    return () => clearInterval(moveInterval);
  }, [gameActive, score, onGameEnd]);

  const handleEnd = () => {
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>👽 Space Invaders</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Score: {score}</span>
        <span>Enemies: {enemies.length}</span>
      </div>
      <div className="space-invaders">
        {/* Player */}
        <div className="space-player" style={{ left: `${playerX}px` }}>
          🚀
        </div>

        {/* Enemies */}
        {enemies.map(enemy => (
          <div
            key={enemy.id}
            className="enemy"
            style={{
              left: `${enemy.x}px`,
              top: `${enemy.y}px`,
            }}
          >
            👾
          </div>
        ))}

        {/* Bullets */}
        {bullets.map(bullet => (
          <div
            key={bullet.id}
            className="bullet-si"
            style={{
              left: `${bullet.x}px`,
              top: `${bullet.y}px`,
            }}
          />
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
