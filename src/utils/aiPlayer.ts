// AI Player utilities for various games

export const getRandomMove = (options: string[]): string => {
  return options[Math.floor(Math.random() * options.length)];
};

export const getWeightedMove = (options: string[], weights: number[]): string => {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < options.length; i++) {
    random -= weights[i];
    if (random <= 0) return options[i];
  }
  
  return options[options.length - 1];
};

// Rock Paper Scissors AI
export const getRPSMove = (playerHistory: string[]): string => {
  const moves = ['rock', 'paper', 'scissors'];
  
  if (playerHistory.length === 0) return getRandomMove(moves);
  
  const lastMove = playerHistory[playerHistory.length - 1];
  const counter: { [key: string]: string } = {
    rock: 'paper',
    paper: 'scissors',
    scissors: 'rock',
  };
  
  // 60% counter last move, 40% random
  return Math.random() < 0.6 ? counter[lastMove] : getRandomMove(moves);
};

// Tic Tac Toe AI (Minimax)
export const getTicTacToeMove = (board: (string | null)[]): number => {
  const minimax = (board: (string | null)[], depth: number, isMaximizing: boolean): number => {
    const score = evaluateBoard(board);
    
    if (score !== 0) return score;
    if (board.every(cell => cell !== null)) return 0;
    
    if (isMaximizing) {
      let bestScore = -10;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'computer';
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = 10;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'player';
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };
  
  let bestScore = -10;
  let bestMove = -1;
  
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = 'computer';
      const score = minimax(board, 0, false);
      board[i] = null;
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  
  return bestMove !== -1 ? bestMove : Math.floor(Math.random() * board.length);
};

const evaluateBoard = (board: (string | null)[]): number => {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  for (const [a, b, c] of winCombos) {
    if (board[a] === 'computer' && board[b] === 'computer' && board[c] === 'computer') return 10;
    if (board[a] === 'player' && board[b] === 'player' && board[c] === 'player') return -10;
  }
  
  return 0;
};

// Number Guessing AI
export const getNumberGuessMove = (playerLow: number, playerHigh: number): number => {
  return Math.floor((playerLow + playerHigh) / 2);
};

// Blackjack AI (House rules)
export const shouldBlackjackHit = (handValue: number): boolean => {
  return handValue < 17;
};

// Connect 4 AI - Simple strategy with lookahead
export const getConnect4Move = (board: (string | null)[][]): number => {
  const rows = board.length;
  const cols = board[0].length;
  
  // Check if can win
  for (let col = 0; col < cols; col++) {
    if (board[0][col] === null) {
      const testBoard = board.map(r => [...r]);
      for (let row = rows - 1; row >= 0; row--) {
        if (testBoard[row][col] === null) {
          testBoard[row][col] = 'computer';
          if (checkWin(testBoard, row, col, 'computer')) return col;
          testBoard[row][col] = null;
          break;
        }
      }
    }
  }
  
  // Check if need to block
  for (let col = 0; col < cols; col++) {
    if (board[0][col] === null) {
      const testBoard = board.map(r => [...r]);
      for (let row = rows - 1; row >= 0; row--) {
        if (testBoard[row][col] === null) {
          testBoard[row][col] = 'player';
          if (checkWin(testBoard, row, col, 'player')) {
            testBoard[row][col] = null;
            return col;
          }
          testBoard[row][col] = null;
          break;
        }
      }
    }
  }
  
  // Take center
  const centerCol = Math.floor(cols / 2);
  if (board[0][centerCol] === null) return centerCol;
  
  // Random valid move
  const validMoves: number[] = [];
  for (let col = 0; col < cols; col++) {
    if (board[0][col] === null) validMoves.push(col);
  }
  
  return validMoves[Math.floor(Math.random() * validMoves.length)];
};

const checkWin = (board: (string | null)[][], row: number, col: number, player: string): boolean => {
  const rows = board.length;
  const cols = board[0].length;
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  
  for (const [dr, dc] of directions) {
    let count = 1;
    
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) count++;
    }
    
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) count++;
    }
    
    if (count >= 4) return true;
  }
  
  return false;
};
