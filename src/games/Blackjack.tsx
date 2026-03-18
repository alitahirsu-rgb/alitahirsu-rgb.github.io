import { useState } from 'react';

interface BlackjackProps {
  onGameEnd: (result: 'win' | 'loss' | 'draw', score: number) => void;
  onBack: () => void;
}

export const Blackjack: React.FC<BlackjackProps> = ({ onGameEnd, onBack }) => {
  const [playerHand, setPlayerHand] = useState<number[]>([7, 8]);
  const [dealerHand, setDealerHand] = useState<number[]>([9]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState('');
  const [playerStand, setPlayerStand] = useState(false);

  const getRandomCard = (): number => Math.floor(Math.random() * 13) + 1;
  const cardValue = (card: number): number => (card > 10 ? 10 : card === 1 ? 11 : card);
  
  const calculateScore = (hand: number[]): number => {
    let score = hand.reduce((sum, card) => sum + cardValue(card), 0);
    let aces = hand.filter(c => c === 1).length;
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    return score;
  };

  const handleHit = () => {
    if (gameOver || playerStand) return;
    
    const newHand = [...playerHand, getRandomCard()];
    setPlayerHand(newHand);

    const score = calculateScore(newHand);
    if (score > 21) {
      setGameOver(true);
      setResult('💀 Bust! Computer Wins!');
      onGameEnd('loss', score);
    }
  };

  const handleStand = () => {
    setPlayerStand(true);
    let newDealerHand = [...dealerHand];

    while (calculateScore(newDealerHand) < 17) {
      newDealerHand.push(getRandomCard());
    }

    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(newDealerHand);

    setDealerHand(newDealerHand);
    setGameOver(true);

    if (dealerScore > 21) {
      setResult('🎉 Dealer Bust! You Win!');
      onGameEnd('win', playerScore);
    } else if (playerScore > dealerScore) {
      setResult('🎉 You Win!');
      onGameEnd('win', playerScore);
    } else if (dealerScore > playerScore) {
      setResult('💀 Dealer Wins!');
      onGameEnd('loss', playerScore);
    } else {
      setResult('Draw!');
      onGameEnd('draw', playerScore);
    }
  };

  const handleEnd = () => {
    onBack();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🃏 Blackjack</h2>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
      <div className="blackjack-game">
        <div className="dealer-section">
          <h4>Dealer</h4>
          <div className="cards-display">
            {dealerHand.map((card, idx) => (
              <div key={idx} className="card">{['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][card - 1] || 'J'}</div>
            ))}
          </div>
          {playerStand && <p>Score: {calculateScore(dealerHand)}</p>}
        </div>

        <div className="player-section">
          <h4>You</h4>
          <div className="cards-display">
            {playerHand.map((card, idx) => (
              <div key={idx} className="card">{['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][card - 1] || 'J'}</div>
            ))}
          </div>
          <p>Score: {calculateScore(playerHand)}</p>
        </div>
      </div>

      {!gameOver && (
        <div className="button-group">
          <button onClick={handleHit} className="game-btn">Hit</button>
          <button onClick={handleStand} className="game-btn">Stand</button>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h3>{result}</h3>
          <button onClick={handleEnd} className="primary-btn">Back</button>
        </div>
      )}
    </div>
  );
};
