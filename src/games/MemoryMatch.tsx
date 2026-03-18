import { useState, useEffect } from 'react';

interface MemoryMatchProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
  onBack: () => void;
}

export const MemoryMatch: React.FC<MemoryMatchProps> = ({ onGameEnd, onBack }) => {
  const symbols = ['🌟', '🎉', '🎈', '🎁', '🎮', '🎲', '🏆', '🎯'];
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const shuffledCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  }, []);

  useEffect(() => {
    if (matched.size === cards.length && cards.length > 0) {
      setGameComplete(true);
      onGameEnd('win', 100 - moves);
    }
  }, [matched, cards.length, moves, onGameEnd]);

  const handleCardClick = (index: number) => {
    if (flipped.has(index) || matched.has(index) || flipped.size >= 2) return;

    const newFlipped = new Set(flipped);
    newFlipped.add(index);
    setFlipped(newFlipped);

    if (newFlipped.size === 2) {
      const [first, second] = Array.from(newFlipped);
      setMoves(prev => prev + 1);

      setTimeout(() => {
        if (cards[first] === cards[second]) {
          setMatched(prev => new Set([...prev, first, second]));
        }
        setFlipped(new Set());
      }, 800);
    }
  };

  const handleRestart = () => {
    setFlipped(new Set());
    setMatched(new Set());
    setMoves(0);
    setGameComplete(false);
    const shuffledCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🧠 Memory Match</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="game-info">
        <span>Moves: {moves}</span>
        <span>Matched: {matched.size / 2} / {symbols.length}</span>
      </div>
      <div className="memory-grid">
        {cards.map((card, index) => (
          <button
            key={index}
            className={`memory-card ${flipped.has(index) || matched.has(index) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
            disabled={gameComplete}
          >
            {(flipped.has(index) || matched.has(index)) ? card : '?'}
          </button>
        ))}
      </div>
      {gameComplete && (
        <div className="game-over">
          <h3>🎉 You Win!</h3>
          <p>Completed in {moves} moves</p>
          <button onClick={handleRestart} className="primary-btn">Play Again</button>
        </div>
      )}
    </div>
  );
};
