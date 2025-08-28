import React from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { GameRound } from '../types/game';

interface GameHistoryProps {
  history: GameRound[];
}

export function GameHistory({ history }: GameHistoryProps) {
  // Calculate streak of low crashes
  const lowCrashStreak = history.reduce((streak, round, index) => {
    if (round.multiplier <= 3.0) {
      return streak + 1;
    }
    return 0;
  }, 0);

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Recent Games</h3>
        {lowCrashStreak >= 5 && (
          <div className="flex items-center space-x-1 text-yellow-400">
            <Zap size={16} />
            <span className="text-xs font-medium">Big win coming!</span>
          </div>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No games played yet
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {history.map((round) => (
            <div
              key={round.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                round.multiplier >= 10 ? 'bg-yellow-500 bg-opacity-30 border border-yellow-500' :
                round.multiplier >= 3 ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'
              }`}
            >
              <div className="flex items-center space-x-2">
                {round.multiplier >= 10 ? (
                  <Zap className="text-yellow-400" size={16} />
                ) : round.multiplier >= 3 ? (
                  <TrendingUp className="text-green-400" size={16} />
                ) : (
                  <TrendingDown className="text-red-400" size={16} />
                )}
                <span className={`font-semibold ${
                  round.multiplier >= 10 ? 'text-yellow-400' :
                  round.multiplier >= 3 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {round.multiplier.toFixed(2)}x
                </span>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-gray-400">
                  {new Date(round.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-xs text-gray-400">
                  {round.players.length} players
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {lowCrashStreak > 0 && (
        <div className="mt-4 p-3 bg-slate-700 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-400">Low crash streak</div>
            <div className={`text-lg font-bold ${
              lowCrashStreak >= 8 ? 'text-yellow-400' :
              lowCrashStreak >= 5 ? 'text-orange-400' : 'text-gray-300'
            }`}>
              {lowCrashStreak} rounds
            </div>
            {lowCrashStreak >= 8 && (
              <div className="text-xs text-yellow-400 mt-1">
                🚀 Big multiplier incoming!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}