import React from 'react';

interface MultiplierDisplayProps {
  multiplier: number;
  status: 'waiting' | 'flying' | 'crashed';
}

export function MultiplierDisplay({ multiplier, status }: MultiplierDisplayProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'waiting': return 'text-gray-400';
      case 'flying': return 'text-green-400';
      case 'crashed': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'waiting': return 'Waiting for takeoff...';
      case 'flying': return 'Flying!';
      case 'crashed': return 'Crashed!';
      default: return 'Loading...';
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className={`text-8xl font-bold transition-all duration-300 ${getStatusColor()}`}>
        {multiplier.toFixed(2)}x
      </div>
      <div className={`text-lg font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </div>
    </div>
  );
}