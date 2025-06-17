
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentLetter, setCurrentLetter] = useState(0);
  const letters = ['T', 'i', 'M'];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLetter < letters.length - 1) {
        setCurrentLetter(currentLetter + 1);
      } else {
        // Wait a bit more then complete
        setTimeout(onComplete, 1000);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [currentLetter, onComplete]);

  return (
    <div className="fixed inset-0 bg-dark-gradient flex items-center justify-center z-50">
      <div className="flex items-center space-x-2">
        {letters.map((letter, index) => (
          <div
            key={index}
            className={`text-8xl font-bold transition-all duration-500 ${
              index <= currentLetter
                ? 'text-gradient animate-bounce-in opacity-100 scale-100'
                : 'opacity-0 scale-50'
            }`}
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          >
            {letter}
          </div>
        ))}
      </div>
      
      {/* Animated circles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-cyan-500/10 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full bg-purple-500/10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 rounded-full bg-blue-500/10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
