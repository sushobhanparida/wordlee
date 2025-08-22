import React from 'react';

const Keyboard = ({ onKeyPress }) => {
  const keys1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const keys2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const keys3 = ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'];

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {keys1.map(key => <button key={key} onClick={() => onKeyPress(key)}>{key}</button>)}
      </div>
      <div className="keyboard-row">
        {keys2.map(key => <button key={key} onClick={() => onKeyPress(key)}>{key}</button>)}
      </div>
      <div className="keyboard-row">
        {keys3.map(key => <button key={key} onClick={() => onKeyPress(key)}>{key}</button>)}
      </div>
    </div>
  );
};

export default Keyboard;
