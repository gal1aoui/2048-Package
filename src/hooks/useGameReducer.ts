import { useReducer, useCallback } from 'react';
import {
  Board,
  initializeBoard,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  spawnTile,
  checkWin,
  checkGameOver
} from '../utils/gameLogic';
import { getBestScore, saveScore } from '../utils/storage';

export type GameState = 'start' | 'playing' | 'won' | 'lost';

export interface State {
  board: Board;
  score: number;
  bestScore: number;
  playerName: string;
  gameState: GameState;
  hasWon: boolean;
}

export type Action =
  | { type: 'START_GAME'; playerName: string }
  | { type: 'MOVE'; direction: 'left' | 'right' | 'up' | 'down' }
  | { type: 'CONTINUE_AFTER_WIN' }
  | { type: 'RESET' };

function getInitialState(): State {
  return {
    board: Array(4).fill(null).map(() => Array(4).fill(0)),
    score: 0,
    bestScore: getBestScore(),
    playerName: '',
    gameState: 'start',
    hasWon: false
  };
}

function gameReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_GAME': {
      return {
        ...state,
        board: initializeBoard(),
        score: 0,
        playerName: action.playerName,
        gameState: 'playing',
        hasWon: false
      };
    }

    case 'MOVE': {
      if (state.gameState !== 'playing') return state;

      let result;
      switch (action.direction) {
        case 'left':
          result = moveLeft(state.board);
          break;
        case 'right':
          result = moveRight(state.board);
          break;
        case 'up':
          result = moveUp(state.board);
          break;
        case 'down':
          result = moveDown(state.board);
          break;
      }

      if (!result.moved) return state;

      const newBoard = spawnTile(result.board);
      const newScore = state.score + result.score;
      const newBestScore = Math.max(state.bestScore, newScore);

      // Check for win (only if not already won)
      if (!state.hasWon && checkWin(newBoard)) {
        saveScore(state.playerName, newScore);
        return {
          ...state,
          board: newBoard,
          score: newScore,
          bestScore: newBestScore,
          gameState: 'won',
          hasWon: true
        };
      }

      // Check for game over
      if (checkGameOver(newBoard)) {
        saveScore(state.playerName, newScore);
        return {
          ...state,
          board: newBoard,
          score: newScore,
          bestScore: newBestScore,
          gameState: 'lost'
        };
      }

      return {
        ...state,
        board: newBoard,
        score: newScore,
        bestScore: newBestScore
      };
    }

    case 'CONTINUE_AFTER_WIN': {
      return {
        ...state,
        gameState: 'playing'
      };
    }

    case 'RESET': {
      return {
        ...getInitialState(),
        bestScore: getBestScore()
      };
    }

    default:
      return state;
  }
}

export function useGameReducer() {
  const [state, dispatch] = useReducer(gameReducer, null, getInitialState);

  const startGame = useCallback((playerName: string) => {
    dispatch({ type: 'START_GAME', playerName });
  }, []);

  const move = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    dispatch({ type: 'MOVE', direction });
  }, []);

  const continueAfterWin = useCallback(() => {
    dispatch({ type: 'CONTINUE_AFTER_WIN' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    startGame,
    move,
    continueAfterWin,
    reset
  };
}
