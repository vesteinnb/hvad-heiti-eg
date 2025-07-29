import React from 'react';

interface GameHeaderProps {
  description?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ description }) => (
  <header className="w-full flex justify-center pt-12 mb-6 px-6">
    <h1 className="w-full font-heading font-bold text-5xl text-center leading-tight text-neutral-700 drop-shadow-sm tracking-wide" style={{fontWeight: 700}}>
      {description || 'Baby Name Guessing Game'}
    </h1>
  </header>
);

export default GameHeader; 