import { useState } from 'react';
import { GameMenu } from './components/GameMenu';
import { Leaderboard } from './components/Leaderboard';
import { PongGame, SnakeGame, RockPaperScissors, TicTacToe, NumberGuessing, MemoryMatch, Blackjack, ConnectFour, Game2048, SimonSays, Hangman, WhackAMole, ReactionTime, ColorMatch, Dodge, FlappyBird, Breakout, Minesweeper, SpaceInvaders, CatchTheBall } from './games';
import { updateGameStats } from './utils/storage';
import { GAMES } from './games';
import './App.css';

type AppScreen = 'menu' | 'leaderboard' | string;

function App() {
  const [screen, setScreen] = useState<AppScreen>('menu');

  const gameComponents: { [key: string]: React.ComponentType<any> } = {
    pong: PongGame,
    snake: SnakeGame,
    rps: RockPaperScissors,
    tictactoe: TicTacToe,
    numberguessing: NumberGuessing,
    memorymatch: MemoryMatch,
    blackjack: Blackjack,
    connectfour: ConnectFour,
    '2048': Game2048,
    simonsays: SimonSays,
    hangman: Hangman,
    whackamole: WhackAMole,
    reactiontime: ReactionTime,
    colormatch: ColorMatch,
    dodge: Dodge,
    flappybird: FlappyBird,
    breakout: Breakout,
    minesweeper: Minesweeper,
    spaceinvaders: SpaceInvaders,
    catchtheball: CatchTheBall,
  };

  const handleGameSelect = (gameId: string) => {
    setScreen(gameId);
  };

  const handleGameEnd = (gameId: string, gameName: string) => (result: 'win' | 'loss' | 'draw', score: number) => {
    updateGameStats(gameId, gameName, result, score);
    // Game component will handle navigation back
  };

  const handleBackToMenu = () => {
    setScreen('menu');
  };

  const handleStatsClick = () => {
    setScreen('leaderboard');
  };

  const renderContent = () => {
    if (screen === 'menu') {
      return (
        <GameMenu
          onGameSelect={handleGameSelect}
          onStatsClick={handleStatsClick}
        />
      );
    }

    if (screen === 'leaderboard') {
      return <Leaderboard onBack={handleBackToMenu} />;
    }

    // Find the game
    const game = GAMES.find(g => g.id === screen);
    if (!game) {
      return <GameMenu onGameSelect={handleGameSelect} onStatsClick={handleStatsClick} />;
    }

    const GameComponent = gameComponents[game.id];
    if (!GameComponent) {
      return <GameMenu onGameSelect={handleGameSelect} onStatsClick={handleStatsClick} />;
    }

    return (
      <GameComponent
        onGameEnd={handleGameEnd(game.id, game.name)}
        onBack={handleBackToMenu}
      />
    );
  };

  return (
    <div className="app">
      {renderContent()}
    </div>
  );
}

export default App;
