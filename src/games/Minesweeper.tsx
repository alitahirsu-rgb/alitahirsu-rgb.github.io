import { useState } from 'react';

interface MinesweeperProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const Minesweeper: React.FC<MinesweeperProps> = ({ onGameEnd, onBack }) => {
  const ROWS = 8;
  const COLS = 8;
  const MINES = 10;

  const [board, setBoard] = useState<Array<{ mine: boolean; revealed: boolean; flagged: boolean; adjacent: number }>>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const initializeBoard = () => {
    const newBoard: typeof board = Array(ROWS * COLS).fill(null).map(() => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }));

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const idx = Math.floor(Math.random() * (ROWS * COLS));
      if (!newBoard[idx].mine) {
        newBoard[idx].mine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines
    for (let i = 0; i < ROWS * COLS; i++) {
      if (!newBoard[i].mine) {
        let count = 0;
        const row = Math.floor(i / COLS);
        const col = i % COLS;

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
              const idx2 = nr * COLS + nc;
              if (newBoard[idx2].mine) count++;
            }
          }
        }
        newBoard[i].adjacent = count;
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setWon(false);
  };

  if (board.length === 0) {
    initializeBoard();
    return null;
  }

  const handleReveal = (idx: number) => {
    if (gameOver || won || board[idx].revealed || board[idx].flagged) return;

    const newBoard = [...board];

    if (newBoard[idx].mine) {
      newBoard[idx].revealed = true;
      setBoard(newBoard);
      setGameOver(true);
      onGameEnd('loss', 0);
      return;
    }

    // Flood fill
    const reveal = (i: number) => {
      if (newBoard[i].revealed || newBoard[i].flagged) return;
      newBoard[i].revealed = true;

      if (newBoard[i].adjacent === 0) {
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
              reveal(nr * COLS + nc);
            }
          }
        }
      }
    };

    reveal(idx);
    setBoard(newBoard);

    // Check win
    const unrevealed = newBoard.filter((cell) => !cell.revealed && !cell.mine).length;
    if (unrevealed === 0) {
      setWon(true);
      onGameEnd('win', 100);
    }
  };

  const handleFlag = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    if (gameOver || won || board[idx].revealed) return;

    const newBoard = [...board];
    newBoard[idx].flagged = !newBoard[idx].flagged;
    setBoard(newBoard);
  };

  const handleEnd = () => {
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>💣 Minesweeper</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="minesweeper">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className={`mine-cell ${cell.revealed ? 'revealed' : ''} ${cell.flagged ? 'flagged' : ''}`}
            onClick={() => handleReveal(idx)}
            onContextMenu={(e) => handleFlag(e, idx)}
          >
            {cell.revealed && (cell.mine ? '💣' : cell.adjacent > 0 ? cell.adjacent : '')}
            {cell.flagged && '🚩'}
          </button>
        ))}
      </div>

      {(gameOver || won) && (
        <div className="game-over">
          <h3>{won ? '🎉 Victory!' : '💀 Game Over!'}</h3>
          <button onClick={handleEnd} className="primary-btn">Back</button>
        </div>
      )}
    </div>
  );
};
