import { useState, useEffect } from 'react';

interface ColorMatchProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const ColorMatch: React.FC<ColorMatchProps> = ({ onGameEnd, onBack }) => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const [displayColor, setDisplayColor] = useState(colors[0]);
  const [displayText, setDisplayText] = useState('red');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);

  const generateRound = () => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    let text = colors[Math.floor(Math.random() * colors.length)];
    
    setDisplayColor(color);
    setDisplayText(text);
  };

  useEffect(() => {
    generateRound();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameActive(false);
      onGameEnd(score > 10 ? 'win' : 'loss', score);
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score, onGameEnd]);

  const handleButtonClick = (color: string) => {
    if (!gameActive) return;

    if (color === displayColor) {
      setScore(prev => prev + 1);
      generateRound();
    } else {
      // Wrong answer, generate new round anyway
      generateRound();
    }
  };

  const handleEnd = () => {
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🎨 Color Match</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>
      <div className="color-match">
        <div className="color-display" style={{ backgroundColor: displayColor }}>
          <p style={{ color: displayText }}>{displayText.toUpperCase()}</p>
          <small>Click the color of the word</small>
        </div>
        <div className="color-buttons">
          {colors.map(color => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              className="color-btn"
              onClick={() => handleButtonClick(color)}
              disabled={!gameActive}
            />
          ))}
        </div>
      </div>

      {!gameActive && (
        <div className="game-over">
          <h3>{score > 10 ? '🎉 Victory!' : '💀 Try Again!'}</h3>
          <p>Score: {score}</p>
          <button onClick={handleEnd} className="primary-btn">Back</button>
        </div>
      )}
    </div>
  );
};
