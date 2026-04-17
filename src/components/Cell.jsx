import React from 'react';

export function Cell({ value, skin }) {
  const colors = skin.cellColors[value] || { bg: skin.cellBackground, text: skin.textColor };
  const fontSize = value >= 1000 ? '1.5rem' : value >= 100 ? '1.8rem' : '2rem';
  
  return (
    <div
      className="cell"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize
      }}
    >
      {value || ''}
    </div>
  );
}
