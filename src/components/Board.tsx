import { Tile } from './Tile';
import type { Board as BoardType } from '../utils/gameLogic';

interface BoardProps {
  board: BoardType;
}

export function Board({ board }: BoardProps) {
  return (
    <div className="game2048-board">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} value={value} />
        ))
      )}
    </div>
  );
}
