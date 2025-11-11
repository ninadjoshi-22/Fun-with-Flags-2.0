import React from 'react';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;

  let colorClass = 'bg-green-500';
  if (percentage < 50) {
    colorClass = 'bg-yellow-500';
  }
  if (percentage < 25) {
    colorClass = 'bg-red-600';
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <div className="w-full bg-gray-700 rounded-full h-4 shadow-inner">
        <div
          className={`h-4 rounded-full transition-all duration-200 ease-linear ${colorClass}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={timeLeft}
          aria-valuemin={0}
          aria-valuemax={totalTime}
        ></div>
      </div>
    </div>
  );
};

export default Timer;