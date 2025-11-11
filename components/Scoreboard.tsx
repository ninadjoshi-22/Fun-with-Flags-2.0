import React from 'react';

interface ScoreboardProps {
  score: number;
  currentQuestion: number;
  hintsRemaining: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, currentQuestion, hintsRemaining }) => {
  return (
    <div className="w-full grid grid-cols-3 items-center text-center bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="text-lg">
        <span className="font-bold text-blue-400">Score:</span> {score}
      </div>
      <div className="text-lg flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a1 1 0 011 1v1.172l3.243 3.243a1 1 0 01.293.707V13a1 1 0 01-1 1h-1v2a1 1 0 01-2 0v-2H8v2a1 1 0 01-2 0v-2H5a1 1 0 01-1-1v-4.879a1 1 0 01.293-.707L7.536 6.172V3a1 1 0 011-1h.001zM10 6a2 2 0 100 4 2 2 0 000-4z" />
            <path d="M10 18a.5.5 0 00.5-.5V16h-1v1.5a.5.5 0 00.5.5z" />
        </svg>
        <span className="font-bold text-yellow-400">Hints:</span> {hintsRemaining}
      </div>
      <div className="text-lg">
        <span className="font-semibold text-gray-400">Question:</span> {currentQuestion}
      </div>
    </div>
  );
};

export default Scoreboard;