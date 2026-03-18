import { useState } from 'react';

interface ReactionTimeProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const ReactionTime: React.FC<ReactionTimeProps> = ({ onGameEnd, onBack }) => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'done'>('waiting');
  const [time, setTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<number[]>([]);

  const handleStart = () => {
    setGameState('ready');
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds

    setTimeout(() => {
      setGameState('go');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'go' && startTime) {
      const reactionTime = Date.now() - startTime;
      setTime(reactionTime);
      setGameState('done');
      setResults(prev => [...prev, reactionTime]);
    } else if (gameState === 'ready') {
      setGameState('waiting');
      setTime(null);
      alert('Too early! Wait for the signal.');
    }
  };

  const handlePlayAgain = () => {
    setGameState('waiting');
    setTime(null);
    handleStart();
  };

  const handleFinish = () => {
    const average = results.length > 0
      ? Math.round(results.reduce((a, b) => a + b) / results.length)
      : 0;
    onGameEnd(average < 300 ? 'win' : 'loss', average);
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>⚡ Reaction Time</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Attempts: {results.length}</span>
        {results.length > 0 && (
          <span>Avg: {Math.round(results.reduce((a, b) => a + b) / results.length)}ms</span>
        )}
      </div>
      <div className="reaction-game">
        <div className={`reaction-display ${gameState}`}>
          {gameState === 'waiting' && 'Click Start to begin'}
          {gameState === 'ready' && 'Wait for the signal...'}
          {gameState === 'go' && 'CLICK NOW!'}
          {gameState === 'done' && `${time}ms`}
        </div>

        <div className="button-group">
          {gameState === 'waiting' && (
            <button onClick={handleStart} className="primary-btn">Start Game</button>
          )}
          {gameState === 'ready' && (
            <button onClick={handleClick} disabled className="game-btn">Waiting...</button>
          )}
          {gameState === 'go' && (
            <button onClick={handleClick} className="clickable-btn">CLICK!</button>
          )}
          {gameState === 'done' && (
            <>
              {results.length < 3 ? (
                <button onClick={handlePlayAgain} className="primary-btn">Next Round</button>
              ) : (
                <button onClick={handleFinish} className="primary-btn">Finish</button>
              )}
            </>
          )}
        </div>

        {results.length > 0 && (
          <div className="results-list">
            <h4>Your Times:</h4>
            {results.map((r, idx) => <p key={idx}>{idx + 1}. {r}ms</p>)}
          </div>
        )}
      </div>
    </div>
  );
};
