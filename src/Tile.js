import React from 'react';

const Tile = ({ value, status, style }) => {
  let bgColor = 'bg-gray-800';
  let borderColor = 'border-gray-600';

  if (status === 'correct') {
    bgColor = 'bg-green-600';
    borderColor = 'border-green-600';
  } else if (status === 'present') {
    bgColor = 'bg-yellow-600';
    borderColor = 'border-yellow-600';
  } else if (status === 'absent') {
    bgColor = 'bg-gray-600';
    borderColor = 'border-gray-600';
  }

  const className = `w-full h-full border-2 text-white uppercase text-2xl font-bold flex items-center justify-center ${bgColor} ${borderColor}`;
  return <div className={className} style={style}>{value}</div>;
};

export default Tile;

export default Tile;
