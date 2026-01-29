export type Board = number[][];

export interface MoveResult {
  board: Board;
  score: number;
  moved: boolean;
}

export function createEmptyBoard(): Board {
  return Array(4).fill(null).map(() => Array(4).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

function getEmptyCells(board: Board): [number, number][] {
  const empty: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        empty.push([i, j]);
      }
    }
  }
  return empty;
}

export function spawnTile(board: Board): Board {
  const newBoard = cloneBoard(board);
  const emptyCells = getEmptyCells(newBoard);

  if (emptyCells.length === 0) return newBoard;

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;

  return newBoard;
}

export function initializeBoard(): Board {
  let board = createEmptyBoard();
  board = spawnTile(board);
  board = spawnTile(board);
  return board;
}

function slideRow(row: number[]): { newRow: number[]; score: number; moved: boolean } {
  const original = [...row];
  let score = 0;

  // Remove zeros
  let filtered = row.filter(val => val !== 0);

  // Merge adjacent equal values
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      score += filtered[i];
      filtered.splice(i + 1, 1);
    }
  }

  // Pad with zeros
  while (filtered.length < 4) {
    filtered.push(0);
  }

  const moved = !original.every((val, idx) => val === filtered[idx]);

  return { newRow: filtered, score, moved };
}

export function moveLeft(board: Board): MoveResult {
  const newBoard: Board = [];
  let totalScore = 0;
  let anyMoved = false;

  for (let i = 0; i < 4; i++) {
    const { newRow, score, moved } = slideRow(board[i]);
    newBoard.push(newRow);
    totalScore += score;
    if (moved) anyMoved = true;
  }

  return { board: newBoard, score: totalScore, moved: anyMoved };
}

export function moveRight(board: Board): MoveResult {
  const newBoard: Board = [];
  let totalScore = 0;
  let anyMoved = false;

  for (let i = 0; i < 4; i++) {
    const reversed = [...board[i]].reverse();
    const { newRow, score, moved } = slideRow(reversed);
    newBoard.push(newRow.reverse());
    totalScore += score;
    if (moved) anyMoved = true;
  }

  return { board: newBoard, score: totalScore, moved: anyMoved };
}

function transpose(board: Board): Board {
  const transposed: Board = createEmptyBoard();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      transposed[j][i] = board[i][j];
    }
  }
  return transposed;
}

export function moveUp(board: Board): MoveResult {
  const transposed = transpose(board);
  const result = moveLeft(transposed);
  return {
    board: transpose(result.board),
    score: result.score,
    moved: result.moved
  };
}

export function moveDown(board: Board): MoveResult {
  const transposed = transpose(board);
  const result = moveRight(transposed);
  return {
    board: transpose(result.board),
    score: result.score,
    moved: result.moved
  };
}

export function checkWin(board: Board): boolean {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 2048) {
        return true;
      }
    }
  }
  return false;
}

export function canMove(board: Board): boolean {
  // Check for empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return true;
    }
  }

  // Check for adjacent equal values
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = board[i][j];
      // Check right
      if (j < 3 && board[i][j + 1] === current) return true;
      // Check down
      if (i < 3 && board[i + 1][j] === current) return true;
    }
  }

  return false;
}

export function checkGameOver(board: Board): boolean {
  return !canMove(board);
}
