import { useState, useEffect } from 'react';

interface SnakeGameProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onGameEnd, onBack }) => {
  const [snake, setSnake] = useState<[number, number][]>([[10, 10]]);
  const [food, setFood] = useState<[number, number]>([15, 15]);
  const [direction, setDirection] = useState<[number, number]>([1, 0]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && direction[1] === 0) setDirection([0, -1]);
      if (e.key === 'ArrowDown' && direction[1] === 0) setDirection([0, 1]);
      if (e.key === 'ArrowLeft' && direction[0] === 0) setDirection([-1, 0]);
      if (e.key === 'ArrowRight' && direction[0] === 0) setDirection([1, 0]);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const newHead: [number, number] = [head[0] + direction[0], head[1] + direction[1]];

        if (newHead[0] < 0 || newHead[0] >= 20 || newHead[1] < 0 || newHead[1] >= 20) {
          setGameOver(true);
          onGameEnd('loss', score);
          return prev;
        }

        if (prev.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
          setGameOver(true);
          onGameEnd('loss', score);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
          setScore(prev => prev + 10);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, food, gameOver, score, onGameEnd]);

  const handleEnd = () => {
    onGameEnd('loss', score);
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🐍 Snake</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Score: {score}</span>
      </div>
      <div className="snake-grid">
        {Array(20).fill(0).map((_, y) =>
          Array(20).fill(0).map((_, x) => (
            <div
              key={`${x}-${y}`}
              className={`cell ${
                snake.some(s => s[0] === x && s[1] === y) ? 'snake' :
                food[0] === x && food[1] === y ? 'food' : ''
              }`}
            />
          ))
        )}
      </div>
      {gameOver && (
        <div className="game-over">
          <h3>Game Over! Score: {score}</h3>
          <button onClick={handleEnd} className="primary-btn">Back</button>
        </div>
      )}
    </div>
  );
};
