
import React from 'react';

interface FlagProps {
  countryCode: string;
  countryName: string;
}

const Flag: React.FC<FlagProps> = ({ countryCode, countryName }) => {
  const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-xl">
      <img
        src={flagUrl}
        alt={`Flag of ${countryName}`}
        className="w-full max-w-sm h-auto object-contain rounded-md border-2 border-gray-700"
      />
    </div>
  );
};

export default Flag;
