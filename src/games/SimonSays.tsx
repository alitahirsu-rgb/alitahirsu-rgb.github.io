import { useState } from 'react';

interface SimonSaysProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const SimonSays: React.FC<SimonSaysProps> = ({ onGameEnd, onBack }) => {
  const colors = ['red', 'blue', 'green', 'yellow'];
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Click Start to begin');

  const playSound = (index: number) => {
    // Visual feedback only for demo
    setTimeout(() => {
      const buttons = document.querySelectorAll('.simon-button');
      if (buttons[index]) {
        buttons[index].classList.add('active');
        setTimeout(() => buttons[index].classList.remove('active'), 300);
      }
    }, 100);
  };

  const playSequence = async (seq: number[]) => {
    setGameActive(false);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      playSound(seq[i]);
    }
    setGameActive(true);
  };

  const handleStart = () => {
    const newSequence = [Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setPlayerSequence([]);
    setScore(0);
    setMessage('Simon is playing...');
    playSequence(newSequence);
  };

  const handleButtonClick = (index: number) => {
    if (!gameActive) return;

    playSound(index);
    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setMessage(`Game Over! Final Score: ${score}`);
      setGameActive(false);
      onGameEnd('loss', score);
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      setMessage('Correct! Simon is playing again...');
      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setPlayerSequence([]);
      playSequence(newSequence);
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🎮 Simon Says</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Level: {score + 1}</span>
      </div>
      <div className="simon-game">
        <div className="message">{message}</div>
        <div className="simon-grid">
          {colors.map((color, idx) => (
            <button
              key={color}
              className={`simon-button simon-${color}`}
              onClick={() => handleButtonClick(idx)}
              disabled={!gameActive}
            />
          ))}
        </div>
        <button
          onClick={handleStart}
          disabled={gameActive}
          className="primary-btn"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};
