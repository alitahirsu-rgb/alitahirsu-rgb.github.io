import { useState } from 'react';

interface RockPaperScissorsProps {
  onGameEnd: (result: 'win' | 'loss' | 'draw', score: number) => void;
  onBack: () => void;
}

export const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({ onGameEnd, onBack }) => {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [rounds, setRounds] = useState(0);

  const play = (choice: string) => {
    const choices = ['rock', 'paper', 'scissors'];
    const computer = choices[Math.floor(Math.random() * 3)];
    
    setPlayerChoice(choice);
    setComputerChoice(computer);

    let gameResult = '';
    if (choice === computer) {
      gameResult = 'Draw!';
    } else if (
      (choice === 'rock' && computer === 'scissors') ||
      (choice === 'paper' && computer === 'rock') ||
      (choice === 'scissors' && computer === 'paper')
    ) {
      gameResult = 'You Win!';
      setPlayerScore(prev => prev + 1);
    } else {
      gameResult = 'Computer Wins!';
      setComputerScore(prev => prev + 1);
    }

    setResult(gameResult);
    setRounds(prev => {
      const newRounds = prev + 1;
      if (newRounds === 5) {
        setTimeout(() => {
          const finalResult = computerScore < (playerScore + (gameResult === 'You Win!' ? 1 : 0)) ? 'win' : playerScore > (computerScore + (gameResult === 'Computer Wins!' ? 1 : 0)) ? 'loss' : 'draw';
          onGameEnd(finalResult, playerScore + (gameResult === 'You Win!' ? 1 : 0));
          onBack();
        }, 1500);
      }
      return newRounds;
    });
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>✊ Rock Paper Scissors</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>You: {playerScore}</span>
        <span>Computer: {computerScore}</span>
        <span>Round: {rounds}/5</span>
      </div>
      <div className="rps-game">
        <div className="choices">
          <div className="player">
            <h4>Your Choice</h4>
            <div className="choice-display">{playerChoice?.toUpperCase() || '—'}</div>
          </div>
          <div className="computer">
            <h4>Computer Choice</h4>
            <div className="choice-display">{computerChoice?.toUpperCase() || '—'}</div>
          </div>
        </div>
        {result && <div className="rps-result">{result}</div>}
        {rounds < 5 && (
          <div className="button-group">
            <button onClick={() => play('rock')} className="game-btn">✊ Rock</button>
            <button onClick={() => play('paper')} className="game-btn">📄 Paper</button>
            <button onClick={() => play('scissors')} className="game-btn">✂️ Scissors</button>
          </div>
        )}
      </div>
    </div>
  );
};
