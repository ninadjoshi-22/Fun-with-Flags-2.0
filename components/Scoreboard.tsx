
import React from 'react';

interface ScoreboardProps {
  score: number;
  currentQuestion: number;
  totalQuestions: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, currentQuestion, totalQuestions }) => {
  return (
    <div className="w-full flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="text-lg">
        <span className="font-bold text-blue-400">Score:</span> {score}
      </div>
      <div className="text-lg">
        <span className="font-semibold text-gray-400">Question:</span> {currentQuestion} / {totalQuestions}
      </div>
    </div>
  );
};

export default Scoreboard;
