import React, { useState, useEffect } from 'react';
import Board from './Board';
import Keyboard from './Keyboard';

const words = ['abroad', 'absent', 'accept', 'access', 'action', 'active', 'actual', 'adjust', 'admire', 'advice', 'affair', 'afford', 'agency', 'annual', 'answer', 'anyone', 'anyway', 'appeal', 'basket', 'battle', 'beauty', 'become', 'before', 'behalf', 'behind', 'belief', 'belong', 'border', 'borrow', 'bottle', 'bottom', 'branch', 'breath', 'bridge', 'bright', 'broken', 'budget', 'burden', 'butter', 'cactus', 'carbon', 'career', 'common', 'copper', 'corner', 'costly', 'domain', 'double', 'driven', 'eighth', 'either', 'eleven', 'french', 'future', 'galaxy', 'garden', 'gather', 'gender', 'gently', 'gifted', 'glance', 'global', 'golden', 'ground', 'groups', 'growth', 'guilty', 'higher', 'impact', 'impose', 'income', 'indeed', 'infant', 'inform', 'injury', 'inside', 'insist', 'intend', 'invite', 'island', 'itself', 'method', 'office', 'report', 'single'];

const Game = ({ user }) => {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

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

  const handleKeyPress = (key) => {
    if (isGameOver) return;

    if (key === 'Enter') {
      if (currentGuess.length === 6) {
        // Logic to check guess will go here
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
      }
    } else if (key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 6 && /^[a-zA-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key.toLowerCase());
    }
  };

  return (
    <div>
      <Board guesses={guesses} currentGuess={currentGuess} solution={solution} />
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
};

export default Game;
