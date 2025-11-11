
import React from 'react';
import type { Country } from '../types';
import { GameState } from '../types';

interface OptionsProps {
  options: Country[];
  onSelect: (country: Country) => void;
  gameState: GameState;
  correctAnswer: Country;
  selectedAnswer: Country | null;
}

const Options: React.FC<OptionsProps> = ({ options, onSelect, gameState, correctAnswer, selectedAnswer }) => {
  
  const getButtonClass = (option: Country) => {
    const baseClass = "w-full text-left p-4 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out transform disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";

    if (gameState === GameState.Answered) {
      if (option.code === correctAnswer.code) {
        return `${baseClass} bg-green-600 text-white ring-2 ring-green-400 shadow-lg`;
      }
      if (option.code === selectedAnswer?.code) {
        return `${baseClass} bg-red-600 text-white ring-2 ring-red-400 shadow-lg`;
      }
      return `${baseClass} bg-gray-700 text-gray-400`;
    }

    return `${baseClass} bg-gray-800 hover:bg-blue-600 hover:scale-105 focus:ring-blue-500`;
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option.code}
          onClick={() => onSelect(option)}
          disabled={gameState === GameState.Answered}
          className={getButtonClass(option)}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
};

export default Options;
