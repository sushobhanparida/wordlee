import React from 'react';
import Tile from './Tile';

const Row = ({ guess, solution, isSubmitted, isWinner }) => {
  const tiles = [];
  for (let i = 0; i < 6; i++) {
    const char = guess[i];
    let status = 'empty';

    if (isSubmitted) {
        if (char === solution[i]) {
            status = 'correct';
        } else if (solution.includes(char)) {
            status = 'present';
        } else {
            status = 'absent';
        }
    }

    tiles.push(<Tile key={i} value={char} status={status} style={{ '--i': i }} />);
  }

  const className = `row ${isWinner ? 'winner' : ''}`;

  return <div className={className}>{tiles}</div>;
};

export default Row;