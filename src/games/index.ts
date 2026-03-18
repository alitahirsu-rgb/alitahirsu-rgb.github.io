import { PongGame } from './Pong';
import { SnakeGame } from './Snake';
import { RockPaperScissors } from './RockPaperScissors';
import { TicTacToe } from './TicTacToe';
import { NumberGuessing } from './NumberGuessing';
import { MemoryMatch } from './MemoryMatch';
import { Blackjack } from './Blackjack';
import { ConnectFour } from './ConnectFour';
import { Game2048 } from './Game2048';
import { SimonSays } from './SimonSays';
import { Hangman } from './Hangman';
import { WhackAMole } from './WhackAMole';
import { ReactionTime } from './ReactionTime';
import { ColorMatch } from './ColorMatch';
import { Dodge } from './Dodge';
import { FlappyBird } from './FlappyBird';
import { Breakout } from './Breakout';
import { Minesweeper } from './Minesweeper';
import { SpaceInvaders } from './SpaceInvaders';
import { CatchTheBall } from './CatchTheBall';
import type { Game } from '../types';

export {
  PongGame,
  SnakeGame,
  RockPaperScissors,
  TicTacToe,
  NumberGuessing,
  MemoryMatch,
  Blackjack,
  ConnectFour,
  Game2048,
  SimonSays,
  Hangman,
  WhackAMole,
  ReactionTime,
  ColorMatch,
  Dodge,
  FlappyBird,
  Breakout,
  Minesweeper,
  SpaceInvaders,
  CatchTheBall,
};

export const GAMES: Game[] = [
  {
    id: 'pong',
    name: 'Pong',
    description: 'Classic Pong game against the computer',
    category: 'arcade',
    difficulty: 'medium',
    icon: '🏓',
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Eat food and avoid hitting walls',
    category: 'arcade',
    difficulty: 'easy',
    icon: '🐍',
  },
  {
    id: 'rps',
    name: 'Rock Paper Scissors',
    description: 'Best of 5 rounds against the computer',
    category: 'puzzle',
    difficulty: 'easy',
    icon: '✊',
  },
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Classic X and O game with AI opponent',
    category: 'puzzle',
    difficulty: 'hard',
    icon: '⭕',
  },
  {
    id: 'numberguessing',
    name: 'Number Guessing',
    description: 'Guess the number before the computer',
    category: 'puzzle',
    difficulty: 'medium',
    icon: '🎯',
  },
  {
    id: 'memorymatch',
    name: 'Memory Match',
    description: 'Match all pairs of symbols',
    category: 'puzzle',
    difficulty: 'easy',
    icon: '🧠',
  },
  {
    id: 'blackjack',
    name: 'Blackjack',
    description: 'Card game against the dealer',
    category: 'card',
    difficulty: 'medium',
    icon: '🃏',
  },
  {
    id: 'connectfour',
    name: 'Connect Four',
    description: 'Get 4 in a row before the computer',
    category: 'puzzle',
    difficulty: 'hard',
    icon: '🔴',
  },
  {
    id: '2048',
    name: '2048',
    description: 'Combine tiles to reach 2048',
    category: 'puzzle',
    difficulty: 'hard',
    icon: '2️⃣',
  },
  {
    id: 'simonsays',
    name: 'Simon Says',
    description: 'Repeat the color sequences',
    category: 'reflex',
    difficulty: 'hard',
    icon: '🎮',
  },
  {
    id: 'hangman',
    name: 'Hangman',
    description: 'Guess the word letter by letter',
    category: 'puzzle',
    difficulty: 'easy',
    icon: '🎈',
  },
  {
    id: 'whackamole',
    name: 'Whack-A-Mole',
    description: 'Click the moles as fast as you can',
    category: 'reflex',
    difficulty: 'easy',
    icon: '🔨',
  },
  {
    id: 'reactiontime',
    name: 'Reaction Time',
    description: 'Test your reaction speed',
    category: 'reflex',
    difficulty: 'easy',
    icon: '⚡',
  },
  {
    id: 'colormatch',
    name: 'Color Match',
    description: 'Match the color of the word',
    category: 'reflex',
    difficulty: 'medium',
    icon: '🎨',
  },
  {
    id: 'dodge',
    name: 'Dodge',
    description: 'Avoid falling obstacles',
    category: 'arcade',
    difficulty: 'medium',
    icon: '🚗',
  },
  {
    id: 'flappybird',
    name: 'Flappy Bird',
    description: 'Navigate through the pipes',
    category: 'arcade',
    difficulty: 'hard',
    icon: '🐦',
  },
  {
    id: 'breakout',
    name: 'Breakout',
    description: 'Destroy all the bricks',
    category: 'arcade',
    difficulty: 'medium',
    icon: '🧱',
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    description: 'Reveal all non-mine squares',
    category: 'puzzle',
    difficulty: 'hard',
    icon: '💣',
  },
  {
    id: 'spaceinvaders',
    name: 'Space Invaders',
    description: 'Shoot down all the enemies',
    category: 'arcade',
    difficulty: 'hard',
    icon: '👽',
  },
  {
    id: 'catchtheball',
    name: 'Catch the Ball',
    description: 'Catch falling balls in your bucket',
    category: 'reflex',
    difficulty: 'easy',
    icon: '🎾',
  },
];
