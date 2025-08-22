import React from 'react';
import Row from './Row';

const Board = ({ guesses, currentGuess, solution }) => {
  return (
    <div className="board">
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex(val => val === null);
        const isWinner = guess === solution;
        return <Row key={i} guess={isCurrentGuess ? currentGuess : guess ?? ''} solution={solution} isSubmitted={!isCurrentGuess && guess !== null} isWinner={isWinner} />;
      })}
    </div>
  );
};

export default Board;