import React from 'react';

interface FinalScoreProps {
  score: number;
  onRestart: () => void;
}

const FinalScore: React.FC<FinalScoreProps> = ({ score, onRestart }) => {
  let message = "Good effort! Want to try again?";
  if (score > 20) {
    message = "Incredible! You're a true flag master!";
  } else if (score > 10) {
    message = "Great job! You really know your flags.";
  } else if (score > 5) {
    message = "Not bad! A little more practice and you'll be an expert.";
  }


  return (
    <div className="w-full text-center bg-gray-800 p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Game Over!</h2>
      <p className="text-xl text-gray-300">Your final score is:</p>
      <div className="text-6xl font-extrabold text-white">
        {score}
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