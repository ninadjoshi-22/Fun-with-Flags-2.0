import React, { useState, useEffect } from 'react';

interface FlagProps {
  countryCode: string;
  countryName: string;
}

const Flag: React.FC<FlagProps> = ({ countryCode, countryName }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

  // Reset loading state whenever the countryCode changes
  useEffect(() => {
    setImageStatus('loading');
  }, [countryCode]);

  const isLoading = imageStatus === 'loading';
  const hasError = imageStatus === 'error';

  return (
    <div className="w-full max-w-sm bg-gray-800 p-4 rounded-lg shadow-xl aspect-[3/2] flex items-center justify-center">
      {isLoading && (
        <div role="status" aria-label="Loading flag image">
          <svg
            className="animate-spin h-10 w-10 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      
      {hasError && (
        <div className="text-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          <p className="mt-2">Could not load flag</p>
        </div>
      )}

      <img
        src={flagUrl}
        alt={`Flag of ${countryName}`}
        className={`w-full h-full object-contain rounded-md border-2 border-gray-700 ${isLoading || hasError ? 'hidden' : 'block'}`}
        onLoad={() => setImageStatus('loaded')}
        onError={() => setImageStatus('error')}
      />
    </div>
  );
};

export default Flag;
