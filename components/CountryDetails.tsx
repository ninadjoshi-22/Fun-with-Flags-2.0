import React from 'react';
import type { Country } from '../types.ts';

interface CountryDetailsProps {
  country: Country;
  details: {
    capital: string;
    funFact: string;
  };
  onNext: () => void;
}

const CountryDetails: React.FC<CountryDetailsProps> = ({ country, details, onNext }) => {
  return (
    <div className="w-full bg-gray-800 p-6 rounded-lg shadow-xl animate-fade-in text-left space-y-4 border border-green-500">
      <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400">
        Correct! It's {country.name}
      </h3>
      <div>
        <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Capital City</p>
        <p className="text-xl text-white">{details.capital}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Fun Fact</p>
        <p className="text-lg text-gray-200 italic">"{details.funFact}"</p>
      </div>
      <button
        onClick={onNext}
        className="w-full mt-4 px-6 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
      >
        Next Question
      </button>
    </div>
  );
};

export default CountryDetails;