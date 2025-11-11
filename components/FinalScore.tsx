
import React from 'react';

interface FinalScoreProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const FinalScore: React.FC<FinalScoreProps> = ({ score, total, onRestart }) => {
  const percentage = Math.round((score / total) * 100);
  
  let message = "Good effort! Want to try again?";
  if (percentage > 90) {
    message = "Excellent! You're a flag master!";
  } else if (percentage > 70) {
    message = "Great job! You really know your flags.";
  } else if (percentage > 50) {
    message = "Not bad! A little more practice and you'll be an expert.";
  }

  return (
    <div className="w-full text-center bg-gray-800 p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-6">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Game Over!</h2>
      <p className="text-xl text-gray-300">Your final score is:</p>
      <div className="text-6xl font-extrabold text-white">
        {score} <span className="text-4xl text-gray-400">/ {total}</span>
      </div>
      <p className="text-lg text-gray-400">{message}</p>
      <button
        onClick={onRestart}
        className="mt-4 px-8 py-3 bg-purple-600 text-white font-bold text-lg rounded-lg hover:bg-purple-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
      >
        Play Again
      </button>
    </div>
  );
};

export default FinalScore;
