import React from 'react';

const Keyboard = ({ onKeyPress }) => {
  const keys1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const keys2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const keys3 = ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'];

  return (
    <div className="mt-5">
      <div className="flex justify-center mb-1">
        {keys1.map(key => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded mr-1 uppercase flex-1"
          >
            {key}
          </button>
        ))}
      </div>
      <div className="flex justify-center mb-1">
        {keys2.map(key => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded mr-1 uppercase flex-1"
          >
            {key}
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        {keys3.map(key => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded mr-1 uppercase flex-1"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
