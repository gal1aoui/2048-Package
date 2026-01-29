interface TileProps {
  value: number;
}

export function Tile({ value }: TileProps) {
  if (value === 0) {
    return <div className="game2048-tile game2048-tile-empty" />;
  }

  const tileClass = `game2048-tile game2048-tile-${value > 2048 ? 'super' : value}`;

  return (
    <div className={tileClass}>
      <span className="game2048-tile-value">{value}</span>
    </div>
  );
}
