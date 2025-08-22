import React from 'react';

const Keyboard = ({ onKeyPress, guesses, solution }) => {
  const keys1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const keys2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const keys3 = ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'];

  const getKeyStatus = () => {
    const status = {};
    guesses.forEach(guess => {
      if (!guess) return;
      for (let i = 0; i < guess.length; i++) {
        const char = guess[i];
        if (solution[i] === char) {
          status[char] = 'correct';
        } else if (solution.includes(char)) {
          if (status[char] !== 'correct') {
            status[char] = 'present';
          }
        } else {
          if (status[char] !== 'correct' && status[char] !== 'present') {
            status[char] = 'absent';
          }
        }
      }
    });
    return status;
  };

  const keyStatus = getKeyStatus();

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {keys1.map(key => <button key={key} className={keyStatus[key]} onClick={() => onKeyPress(key)}>{key}</button>)}
      </div>
      <div className="keyboard-row">
        {keys2.map(key => <button key={key} className={keyStatus[key]} onClick={() => onKeyPress(key)}>{key}</button>)}
      </div>
      <div className="keyboard-row">
        {keys3.map(key => <button key={key} className={keyStatus[key]} onClick={() => onKeyPress(key)}>{key}</button>)}
      </div>
    </div>
  );
};

export default Keyboard;
