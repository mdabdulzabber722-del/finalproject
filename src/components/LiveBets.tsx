import React from 'react';
import { Users, DollarSign } from 'lucide-react';
import { PlayerBet } from '../types/game';

interface LiveBetsProps {
  activeBets: PlayerBet[];
  currentMultiplier: number;
}

export function LiveBets({ activeBets, currentMultiplier }: LiveBetsProps) {
  const activePlayers = activeBets.filter(bet => bet.active);
  const cashedOutPlayers = activeBets.filter(bet => !bet.active);

  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Live Bets</h3>
        <div className="flex items-center space-x-2 text-gray-400">
          <Users size={16} />
          <span>{activeBets.length} players</span>
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {activePlayers.map((bet) => (
          <div key={`${bet.userId}-${bet.betAmount}`} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {bet.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-white font-medium">{bet.username}</div>
                <div className="text-gray-400 text-sm">৳{bet.betAmount}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-bold">
                ৳{(bet.betAmount * currentMultiplier).toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                +৳{(bet.betAmount * (currentMultiplier - 1)).toFixed(2)}
              </div>
            </div>
          </div>
        ))}

        {cashedOutPlayers.map((bet) => (
          <div key={`${bet.userId}-${bet.betAmount}-cashed`} className="flex items-center justify-between p-3 bg-slate-700 bg-opacity-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <DollarSign className="text-white" size={12} />
              </div>
              <div>
                <div className="text-white font-medium">{bet.username}</div>
                <div className="text-gray-400 text-sm">৳{bet.betAmount}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-bold">
                ৳{(bet.betAmount * bet.cashOutAt!).toFixed(2)}
              </div>
              <div className="text-xs text-green-400">
                Cashed @ {bet.cashOutAt!.toFixed(2)}x
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeBets.length === 0 && (
        <div className="text-gray-400 text-center py-8">
          No active bets this round
        </div>
      )}
    </div>
  );
}