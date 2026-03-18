import { useState } from 'react';

interface NumberGuessingProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const NumberGuessing: React.FC<NumberGuessingProps> = ({ onGameEnd, onBack }) => {
  const [secretNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [playerGuess, setPlayerGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [computerGuess, setComputerGuess] = useState(50);
  const [computerLow, setComputerLow] = useState(1);
  const [computerHigh, setComputerHigh] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string>('');

  const handlePlayerGuess = () => {
    const guess = parseInt(playerGuess);
    if (!playerGuess || guess < 1 || guess > 100) {
      setFeedback('Please enter a number between 1-100');
      return;
    }

    setAttempts(prev => prev + 1);

    if (guess === secretNumber) {
      setWinner('player');
      setGameOver(true);
      setFeedback('🎉 You found the number!');
      return;
    }

    if (guess < secretNumber) {
      setFeedback('Too low! Try higher.');
    } else {
      setFeedback('Too high! Try lower.');
    }

    setPlayerGuess('');

    // Computer makes a guess
    setTimeout(() => {
      const newComputerGuess = Math.floor((computerLow + computerHigh) / 2);
      setComputerGuess(newComputerGuess);

      if (newComputerGuess === secretNumber) {
        setWinner('computer');
        setGameOver(true);
        setFeedback('💀 Computer found the number!');
      } else if (newComputerGuess < secretNumber) {
        setComputerLow(newComputerGuess + 1);
      } else {
        setComputerHigh(newComputerGuess - 1);
      }
    }, 1000);
  };

  const handleEnd = () => {
    const result = winner === 'player' ? 'win' : 'loss';
    onGameEnd(result, attempts);
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🎯 Number Guessing</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Your Attempts: {attempts}</span>
      </div>
      <div className="number-guessing">
        <div className="guess-section">
          <h4>Your Turn</h4>
          <p>Guess the number (1-100)</p>
          <input
            type="number"
            min="1"
            max="100"
            value={playerGuess}
            onChange={(e) => setPlayerGuess(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePlayerGuess()}
            disabled={gameOver}
            placeholder="Enter your guess"
          />
          <button onClick={handlePlayerGuess} disabled={gameOver} className="game-btn">
            Guess
          </button>
        </div>

        {feedback && (
          <div className="feedback-area">
            <p>{feedback}</p>
          </div>
        )}

        <div className="guess-section">
          <h4>Computer's Guess</h4>
          <div className="computer-guess">{computerGuess}</div>
          <p className="range">Range: {computerLow} - {computerHigh}</p>
        </div>
      </div>

      {gameOver && (
        <div className="game-over">
          <h3>{winner === 'player' ? '🎉 Victory!' : '💀 Defeat!'}</h3>
          <button onClick={handleEnd} className="primary-btn">Back</button>
        </div>
      )}
    </div>
  );
};
