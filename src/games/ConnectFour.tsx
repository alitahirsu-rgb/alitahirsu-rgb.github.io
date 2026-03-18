import { useState } from 'react';

interface ConnectFourProps {
  onGameEnd: (result: 'win' | 'loss' | 'draw', score: number) => void;
  onBack: () => void;
}

export const ConnectFour: React.FC<ConnectFourProps> = ({ onGameEnd, onBack }) => {
  const ROWS = 6;
  const COLS = 7;
  const [board, setBoard] = useState<(string | null)[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState('');

  const checkWin = (board: (string | null)[][], row: number, col: number, player: string): boolean => {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (const [dr, dc] of directions) {
      let count = 1;

      for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) count++;
      }

      for (let i = 1; i < 4; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) count++;
      }

      if (count >= 4) return true;
    }

    return false;
  };

  const dropPiece = (col: number, player: string): boolean => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = player;
        setBoard(newBoard);
        return checkWin(newBoard, row, col, player);
      }
    }
    return false;
  };

  const handlePlayerMove = (col: number) => {
    if (gameOver) return;

    if (dropPiece(col, 'player')) {
      setGameOver(true);
      setResult('🎉 You Win!');
      onGameEnd('win', 1);
      return;
    }

    setTimeout(() => {
      const computerCol = Math.floor(Math.random() * COLS);
      if (dropPiece(computerCol, 'computer')) {
        setGameOver(true);
        setResult('💀 Computer Wins!');
        onGameEnd('loss', 0);
      }
    }, 500);
  };

  const handleEnd = () => {
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🔴 Connect Four</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="connect-four">
        <div className="board">
          {Array(COLS).fill(0).map((_, col) => (
            <button
              key={col}
              onClick={() => handlePlayerMove(col)}
              disabled={gameOver}
              className="drop-btn"
            >
              ⬇️
            </button>
          ))}
        </div>
        <div className="board-grid">
          {board.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`c4-cell ${
                  cell === 'player' ? 'player' :
                  cell === 'computer' ? 'computer' : ''
                }`}
              />
            ))
          )}
        </div>
      </div>

      {gameOver && (
        <div className="game-over">
          <h3>{result}</h3>
          <button onClick={handleEnd} className="primary-btn">Back</button>
        </div>
      )}
    </div>
  );
};
