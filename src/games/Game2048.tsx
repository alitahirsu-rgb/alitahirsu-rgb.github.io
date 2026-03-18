import { useState, useEffect } from 'react';

interface Game2048Props {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const Game2048: React.FC<Game2048Props> = ({ onGameEnd, onBack }) => {
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    addNewTile(newBoard);
    addNewTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  };

  const addNewTile = (board: number[][]) => {
    const empty = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) empty.push({ i, j });
      }
    }
    if (empty.length > 0) {
      const { i, j } = empty[Math.floor(Math.random() * empty.length)];
      board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = (direction: 'left' | 'right' | 'up' | 'down') => {
    const newBoard = board.map(r => [...r]);
    let moved = false;
    let newScore = score;

    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const row = direction === 'left' ? newBoard[i] : newBoard[i].reverse();
        const result = mergeRow(row);
        if (result.moved) moved = true;
        newScore += result.score;
        newBoard[i] = direction === 'right' ? result.row.reverse() : result.row;
      }
    } else {
      for (let j = 0; j < 4; j++) {
        const col = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        const sorted = direction === 'up' ? col : col.reverse();
        const result = mergeRow(sorted);
        if (result.moved) moved = true;
        newScore += result.score;
        const newCol = direction === 'down' ? result.row.reverse() : result.row;
        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = newCol[i];
        }
      }
    }

    if (moved) {
      addNewTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);

      if (board.every(r => r.every(c => c !== 0))) {
        setGameOver(true);
        onGameEnd('loss', newScore);
      }
    }
  };

  const mergeRow = (row: number[]): { row: number[], score: number, moved: boolean } => {
    let newRow = row.filter(val => val !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow.splice(i + 1, 1);
      }
    }
    while (newRow.length < 4) {
      newRow.push(0);
    }
    return { row: newRow, score: 0, moved: !arraysEqual(row, newRow) };
  };

  const arraysEqual = (a: number[], b: number[]): boolean => a.every((val, idx) => val === b[idx]);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!gameOver) {
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board, gameOver]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>2️⃣0️⃣4️⃣8️⃣</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Score: {score}</span>
      </div>
      <div className="game-2048">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div key={`${i}-${j}`} className={`cell-2048 cell-${cell}`}>
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </div>
      <div className="button-group">
        <button onClick={() => move('up')} className="game-btn">⬆️</button>
        <button onClick={() => move('left')} className="game-btn">⬅️</button>
        <button onClick={() => move('down')} className="game-btn">⬇️</button>
        <button onClick={() => move('right')} className="game-btn">➡️</button>
      </div>
      {gameOver && (
        <div className="game-over">
          <h3>Game Over! Score: {score}</h3>
          <button onClick={initializeBoard} className="primary-btn">Restart</button>
        </div>
      )}
    </div>
  );
};
