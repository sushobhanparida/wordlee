import React from 'react';

const Tile = ({ value, status, style }) => {
  const className = `tile ${status}`;
  return <div className={className} style={style}>{value}</div>;
};

export default Tile;