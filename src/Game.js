import React, { useState, useEffect } from 'react';
import Board from './Board';
import Keyboard from './Keyboard';



const Game = ({ user }) => {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
    if (!user) return; // Don't fetch game state if user is not logged in

    fetch(`https://wordlee-ldyx.onrender.com/api/word-of-the-day?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.gameState) {
          // Load saved game state
          setSolution(data.gameState.solution);
          setGuesses(data.gameState.guesses);
          setIsGameOver(true); // Game is already over for today
        } else {
          // Start a new game
          setSolution(data.word);
          setGuesses(Array(6).fill(null));
          setCurrentGuess('');
          setIsGameOver(false);
        }
      })
      .catch(error => console.error('Error fetching word of the day or game state:', error));
  }, [user]); // Depend on user to refetch when user logs in

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

      // Fetch current game state to check webhookTriggered status
      fetch(`https://wordlee-ldyx.onrender.com/api/game-state?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.webhookTriggered) {
            // Trigger webhook only if it hasn't been triggered for today
            fetch('https://wordlee-ldyx.onrender.com/api/trigger-webhook', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: user.id, gameStatus, user }),
            })
              .then(res => res.text())
              .then(message => console.log(message))
              .catch(error => console.error('Error triggering webhook:', error));
          }
        })
        .catch(error => console.error('Error fetching game state for webhook check:', error));
    }
  }, [isGameOver, user, solution, guesses]);

  useEffect(() => {
    if (isGameOver && user) {
      const gameStatus = guesses.includes(solution) ? 'won' : 'lost';
      fetch('https://wordlee-ldyx.onrender.com/api/save-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, solution, guesses, gameStatus }),
      })
        .then(res => res.text())
        .then(message => console.log(message))
        .catch(error => console.error('Error saving game state:', error));
    }
  }, [isGameOver, user, solution, guesses]);

  return (
    <div>
      <Board guesses={guesses} currentGuess={currentGuess} solution={solution} />
      <Keyboard onKeyPress={handleKeyPress} guesses={guesses} solution={solution} isGameOver={isGameOver} />
    </div>
  );
};

export default Game;
