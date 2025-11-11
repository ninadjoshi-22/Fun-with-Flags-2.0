
import React, { useState, useEffect, useCallback } from 'react';
import type { Country } from './types';
import { GameState } from './types';
import { COUNTRIES, QUESTIONS_PER_GAME, OPTIONS_PER_QUESTION } from './constants';
import Scoreboard from './components/Scoreboard';
import Flag from './components/Flag';
import Options from './components/Options';
import FinalScore from './components/FinalScore';

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.Playing);
  const [gameCountries, setGameCountries] = useState<Country[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<Country[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<Country | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Country | null>(null);
  const [score, setScore] = useState(0);

  const generateQuestion = useCallback((index: number, countries: Country[]) => {
    if (index >= countries.length) {
      setGameState(GameState.Finished);
      return;
    }

    const correct = countries[index];
    setCorrectAnswer(correct);

    const wrongOptions = shuffleArray(COUNTRIES.filter(c => c.code !== correct.code))
      .slice(0, OPTIONS_PER_QUESTION - 1);
      
    const allOptions = shuffleArray([...wrongOptions, correct]);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setGameState(GameState.Playing);
  }, []);

  const setupGame = useCallback(() => {
    const shuffled = shuffleArray(COUNTRIES).slice(0, QUESTIONS_PER_GAME);
    setGameCountries(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    generateQuestion(0, shuffled);
  }, [generateQuestion]);
  
  useEffect(() => {
    setupGame();
  }, [setupGame]);

  const handleAnswer = (selected: Country) => {
    if (gameState !== GameState.Playing) return;

    setSelectedAnswer(selected);
    setGameState(GameState.Answered);

    if (selected.code === correctAnswer?.code) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < QUESTIONS_PER_GAME) {
        setCurrentQuestionIndex(nextIndex);
        generateQuestion(nextIndex, gameCountries);
      } else {
        setGameState(GameState.Finished);
      }
    }, 1500);
  };

  const restartGame = () => {
    setupGame();
  };

  const renderGame = () => {
    if (gameState === GameState.Finished) {
      return <FinalScore score={score} total={QUESTIONS_PER_GAME} onRestart={restartGame} />;
    }

    if (!correctAnswer) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl">Loading...</p>
        </div>
      );
    }
    
    return (
      <>
        <Scoreboard score={score} currentQuestion={currentQuestionIndex + 1} totalQuestions={QUESTIONS_PER_GAME} />
        <Flag countryCode={correctAnswer.code} countryName={correctAnswer.name} />
        <Options 
          options={options} 
          onSelect={handleAnswer}
          gameState={gameState}
          correctAnswer={correctAnswer}
          selectedAnswer={selectedAnswer}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-8">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Fun with Flags
          </h1>
          <p className="text-gray-400 mt-2 text-lg">How well do you know world flags?</p>
        </header>
        {renderGame()}
      </main>
    </div>
  );
}

export default App;
