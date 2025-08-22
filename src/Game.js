import React, { useState, useEffect } from 'react';
import Board from './Board';
import Keyboard from './Keyboard';



const Game = ({ user }) => {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
    fetch('https://wordlee-ldyx.onrender.com/api/word-of-the-day')
      .then(res => res.json())
      .then(data => {
        setSolution(data.word);
      });
  }, []);

  const handleKeyPress = (key) => {
    if (isGameOver) return;

    if (key === 'Enter') {
      if (currentGuess.length === 6) {
        fetch('https://wordlee-ldyx.onrender.com/api/validate-word', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ word: currentGuess }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.valid) {
              const newGuesses = [...guesses];
              const guessIndex = guesses.findIndex(val => val === null);
              newGuesses[guessIndex] = currentGuess;
              setGuesses(newGuesses);
              setCurrentGuess('');

              if (currentGuess === solution) {
                setIsGameOver(true);
                alert('You won!');
              } else if (guessIndex === 5) {
                setIsGameOver(true);
                alert(`You lost! The word was ${solution}`);
              }
            } else {
              console.log('Invalid word');
            }
          });
      }
    } else if (key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 6 && /^[a-zA-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key.toLowerCase());
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyPress(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (isGameOver && user) {
      const gameStatus = guesses.includes(solution) ? 'won' : 'lost';
      fetch('https://wordlee-ldyx.onrender.com/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameStatus, user }),
      });
    }
  }, [isGameOver, user, solution, guesses]);

  return (
    <div>
      <Board guesses={guesses} currentGuess={currentGuess} solution={solution} />
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
};

export default Game;
