import { useState } from 'react';

interface HangmanProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const Hangman: React.FC<HangmanProps> = ({ onGameEnd, onBack }) => {
  const words = ['JAVASCRIPT', 'TYPESCRIPT', 'REACT', 'COMPUTER', 'ALGORITHM', 'DATABASE', 'ARCADE', 'DEVELOPER'];
  const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState('');

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const maxWrong = 6;

  const handleGuess = (letter: string) => {
    if (guessed.has(letter)) return;

    const newGuessed = new Set([...guessed, letter]);
    setGuessed(newGuessed);

    if (!word.includes(letter)) {
      const newWrong = wrong + 1;
      setWrong(newWrong);

      if (newWrong >= maxWrong) {
        setGameOver(true);
        setResult(`💀 Game Over! Word was: ${word}`);
        onGameEnd('loss', 0);
      }
    } else {
      const wordLetters = new Set(word.split(''));
      const allGuessed = [...wordLetters].every(l => newGuessed.has(l));

      if (allGuessed) {
        setGameOver(true);
        setResult('🎉 You Won!');
        onGameEnd('win', 100 - wrong * 10);
      }
    }
  };

  const handleRestart = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setWord(newWord);
    setGuessed(new Set());
    setWrong(0);
    setGameOver(false);
    setResult('');
  };

  const displayWord = word.split('').map(l => guessed.has(l) ? l : '_').join(' ');

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🎈 Hangman</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Wrong: {wrong}/{maxWrong}</span>
      </div>
      <div className="hangman-game">
        <div className="word-display">{displayWord}</div>
        <div className="guesses">
          {letters.map(letter => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessed.has(letter) || gameOver}
              className={`letter-btn ${guessed.has(letter) ? (word.includes(letter) ? 'correct' : 'wrong') : ''}`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {gameOver && (
        <div className="game-over">
          <h3>{result}</h3>
          <button onClick={handleRestart} className="primary-btn">Play Again</button>
        </div>
      )}
    </div>
  );
};
