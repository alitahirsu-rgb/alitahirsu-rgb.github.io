import { useState } from 'react';
import { getTicTacToeMove } from '../utils/aiPlayer';

interface TicTacToeProps {
  onGameEnd: (result: 'win' | 'loss' | 'draw', score: number) => void;
  onBack: () => void;
}

export const TicTacToe: React.FC<TicTacToeProps> = ({ onGameEnd, onBack }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [gameMessage, setGameMessage] = useState('');

  const checkWinner = (squares: (string | null)[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handlePlayerMove = (index: number) => {
    if (board[index] !== null) return;

    const newBoard = [...board];
    newBoard[index] = 'player';

    const winner = checkWinner(newBoard);
    if (winner === 'player') {
      setPlayerWins(prev => prev + 1);
      setGameMessage('🎉 You Win!');
      setBoard(newBoard);
      return;
    }

    if (newBoard.every(cell => cell !== null)) {
      setGameMessage('Draw!');
      setBoard(newBoard);
      return;
    }

    // Computer move
    let computerMoveIndex = getTicTacToeMove(newBoard);
    if (computerMoveIndex !== -1) {
      newBoard[computerMoveIndex] = 'computer';

      const computerWinner = checkWinner(newBoard);
      if (computerWinner === 'computer') {
        setComputerWins(prev => prev + 1);
        setGameMessage('💀 Computer Wins!');
        setBoard(newBoard);
        return;
      }

      if (newBoard.every(cell => cell !== null)) {
        setGameMessage('Draw!');
      }
    }

    setBoard(newBoard);
  };

  const handleEndGame = () => {
    const finalResult = playerWins > computerWins ? 'win' : playerWins < computerWins ? 'loss' : 'draw';
    onGameEnd(finalResult, playerWins);
    onBack();
  };

  const handleNewGame = () => {
    setBoard(Array(9).fill(null));
    setGameMessage('');
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>⭕ Tic Tac Toe</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>You: {playerWins}</span>
        <span>Computer: {computerWins}</span>
      </div>
      <div className="tictactoe">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`ttt-cell ${cell ? 'filled' : ''}`}
            onClick={() => handlePlayerMove(index)}
            disabled={gameMessage !== ''}
          >
            {cell === 'player' ? '✕' : cell === 'computer' ? '○' : ''}
          </button>
        ))}
      </div>
      {gameMessage && (
        <div className="game-message">
          <p>{gameMessage}</p>
          {playerWins + computerWins < 3 ? (
            <button onClick={handleNewGame} className="primary-btn">Next Round</button>
          ) : (
            <button onClick={handleEndGame} className="primary-btn">Finish</button>
          )}
        </div>
      )}
    </div>
  );
};
