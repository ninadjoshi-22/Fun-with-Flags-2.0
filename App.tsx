import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Country } from './types.ts';
import { GameState } from './types.ts';
import { COUNTRIES, OPTIONS_PER_QUESTION, TIME_PER_QUESTION } from './constants.ts';
import Scoreboard from './components/Scoreboard.js';
import Flag from './components/Flag.js';
import Options from './components/Options.js';
import FinalScore from './components/FinalScore.js';
import CountryDetails from './components/CountryDetails.js';
import Timer from './components/Timer.js';

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.Playing);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [options, setOptions] = useState<Country[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<Country | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Country | null>(null);
  const [score, setScore] = useState(0);

  // Timer-related state
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const timerRef = useRef<number | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const previousCorrectAnswerCode = useRef<string | null>(null);


  // Hint-related state
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [isHintUsed, setIsHintUsed] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);

  // Country details state
  const [countryDetails, setCountryDetails] = useState<{ capital: string; funFact: string } | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const generateQuestion = useCallback(() => {
    // Pick a new country, ensuring it's not the same as the last one
    let newCorrectAnswer;
    do {
      newCorrectAnswer = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    } while (newCorrectAnswer.code === previousCorrectAnswerCode.current);
    
    previousCorrectAnswerCode.current = newCorrectAnswer.code;
    setCorrectAnswer(newCorrectAnswer);

    const wrongOptions = shuffleArray(COUNTRIES.filter(c => c.code !== newCorrectAnswer.code))
      .slice(0, OPTIONS_PER_QUESTION - 1);
      
    const allOptions = shuffleArray([...wrongOptions, newCorrectAnswer]);
    setOptions(allOptions);
    setSelectedAnswer(null);
    
    // Reset state for the new question
    setIsHintUsed(false);
    setHint(null);
    setCountryDetails(null);
    setIsDetailsLoading(false);
    setTimeLeft(TIME_PER_QUESTION);
    setIsTimerPaused(false); // Ensure timer is not paused for new question
    setGameState(GameState.Playing);
  }, []);

  const setupGame = useCallback(() => {
    setScore(0);
    setQuestionNumber(1);
    setHintsRemaining(3);
    setCountryDetails(null);
    setIsDetailsLoading(false);
    previousCorrectAnswerCode.current = null;
    generateQuestion();
  }, [generateQuestion]);
  
  // Initial game setup
  useEffect(() => {
    setupGame();
  }, [setupGame]);

  // Timer logic
  useEffect(() => {
    if (gameState === GameState.Playing && !isTimerPaused) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearTimer();
            setGameState(GameState.Finished);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [gameState, isTimerPaused, clearTimer]);


  const fetchCountryDetails = async (country: Country) => {
    setIsDetailsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide the capital city and one short, interesting fun fact for ${country.name}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              capital: { 
                type: Type.STRING,
                description: 'The capital city of the country.' 
              },
              funFact: { 
                type: Type.STRING,
                description: 'A short, interesting fun fact about the country.' 
              }
            },
            required: ['capital', 'funFact']
          }
        }
      });
      const details = JSON.parse(response.text);
      setCountryDetails(details);
    } catch (error) {
      console.error("Error fetching country details:", error);
      setCountryDetails({ capital: "Not Available", funFact: "Could not load a fun fact at this time." });
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleNextQuestion = useCallback(() => {
    setGameState(GameState.Playing);
    setQuestionNumber(prev => prev + 1);
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (selected: Country) => {
    if (gameState !== GameState.Playing) return;

    clearTimer();
    setSelectedAnswer(selected);
    setGameState(GameState.Answered);

    if (correctAnswer && selected.code === correctAnswer.code) {
      setScore(prev => prev + 1);
      fetchCountryDetails(correctAnswer);
    } else {
      // Game over on wrong answer
      setTimeout(() => {
        setGameState(GameState.Finished);
      }, 2000);
    }
  };

  const handleGetHint = async () => {
    if (hintsRemaining <= 0 || isHintUsed || !correctAnswer || isHintLoading) return;

    setIsTimerPaused(true);
    setIsHintLoading(true);
    setHintsRemaining(prev => prev - 1);
    setIsHintUsed(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Tell me a short, one-sentence, interesting fact about ${correctAnswer.name} that can be used as a hint in a flag quiz. Do not mention the country's name, its cities, or its people's demonym.`,
      });
      setHint(response.text);
    } catch (error) {
      console.error("Error fetching hint:", error);
      setHint("Sorry, couldn't get a hint right now.");
    } finally {
      setIsHintLoading(false);
      setIsTimerPaused(false);
    }
  };

  const renderGame = () => {
    if (!correctAnswer) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl">Loading Game...</p>
        </div>
      );
    }

    if (gameState === GameState.Finished) {
      return <FinalScore score={score} onRestart={setupGame} />;
    }
    
    return (
      <>
        <Scoreboard 
          score={score} 
          currentQuestion={questionNumber} 
          hintsRemaining={hintsRemaining}
        />
        <Timer timeLeft={timeLeft} totalTime={TIME_PER_QUESTION} />
        <Flag countryCode={correctAnswer.code} countryName={correctAnswer.name} />
        
        <div className="w-full max-w-2xl min-h-[7rem] flex flex-col items-center justify-center my-4">
          {gameState === GameState.Answered && selectedAnswer?.code === correctAnswer?.code ? (
            <>
              {isDetailsLoading && (
                <div className="flex items-center gap-2 text-yellow-400 animate-pulse">
                  <svg className="w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Discovering interesting facts...</span>
                </div>
              )}
              {countryDetails && !isDetailsLoading && (
                <CountryDetails
                  country={correctAnswer}
                  details={countryDetails}
                  onNext={handleNextQuestion}
                />
              )}
            </>
          ) : (
            <>
              {isHintLoading && <p className="text-yellow-400">Fetching your hint...</p>}
              {hint && !isHintLoading && (
                <div className="bg-gray-800 p-3 rounded-lg text-center text-gray-300 animate-fade-in shadow-inner">
                  <p><strong className="text-yellow-400">Hint:</strong> {hint}</p>
                </div>
              )}
              {!isHintUsed && !hint && !isHintLoading && gameState === GameState.Playing && (
                <button
                  onClick={handleGetHint}
                  disabled={hintsRemaining === 0}
                  className="px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1.172l3.243 3.243a1 1 0 01.293.707V13a1 1 0 01-1 1h-1v2a1 1 0 01-2 0v-2H8v2a1 1 0 01-2 0v-2H5a1 1 0 01-1-1v-4.879a1 1 0 01.293-.707L7.536 6.172V3a1 1 0 011-1h.001zm0 4a2 2 0 100 4 2 2 0 000-4z" /><path d="M10 18a.5.5 0 00.5-.5V16h-1v1.5a.5.5 0 00.5.5z" /></svg>
                  Get a Hint
                </button>
              )}
            </>
          )}
        </div>

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
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-6">
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