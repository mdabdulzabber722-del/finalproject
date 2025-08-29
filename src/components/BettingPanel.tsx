import React, { useState, useCallback } from 'react';
import { Plane, Plus, Minus } from 'lucide-react';
import { User } from '../types/auth';
import { PlayerBet } from '../types/game';

interface BettingPanelProps {
  user: User;
  gameStatus: 'waiting' | 'flying' | 'crashed';
  currentMultiplier: number;
  activeBet?: PlayerBet;
  onPlaceBet: (bet: PlayerBet) => void;
  onCashOut: () => void;
}

const BET_PRESETS = [10, 25, 50, 100, 250, 500];

export function BettingPanel({
  user,
  gameStatus,
  currentMultiplier,
  activeBet,
  onPlaceBet,
  onCashOut,
}: BettingPanelProps) {
  const [betAmount, setBetAmount] = useState(50);

  const handleBetAmountChange = (amount: number) => {
    const newAmount = Math.min(Math.max(1, Math.floor(amount)), Math.floor(user.balance));
    setBetAmount(newAmount);
  };

  const handlePlaceBet = useCallback(() => {
    if (gameStatus !== 'waiting' || betAmount > user.balance || betAmount < 1) return;
    
    const bet: PlayerBet = {
      userId: user.id,
      username: user.username,
      userEmail: user.email,
      betAmount,
      profit: 0,
      active: true,
    };
    
    onPlaceBet(bet);
  }, [gameStatus, betAmount, user.balance, user.id, user.username, user.email, onPlaceBet]);

  const canPlaceBet = gameStatus === 'waiting' && !activeBet && betAmount <= user.balance && betAmount >= 1;
  const canCashOut = gameStatus === 'flying' && activeBet?.active;

  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-6">
      {/* Bet Amount */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">Bet Amount</label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleBetAmountChange(betAmount - 10)}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            disabled={betAmount <= 10}
          >
            <Minus size={16} className="text-white" />
          </button>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => handleBetAmountChange(Number(e.target.value))}
            className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center focus:outline-none focus:border-green-500"
            min="1"
            max={user.balance}
          />
          <button
            onClick={() => handleBetAmountChange(betAmount + 10)}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            disabled={betAmount >= user.balance}
          >
            <Plus size={16} className="text-white" />
          </button>
        </div>
        
        {/* Bet Presets */}
        <div className="grid grid-cols-3 gap-2">
          {BET_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handleBetAmountChange(preset)}
              disabled={preset > user.balance}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                betAmount === preset
                  ? 'bg-green-500 text-white'
                  : preset <= user.balance
                  ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                  : 'bg-slate-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              ৳{preset}
            </button>
          ))}
        </div>
      </div>

      {/* Current Bet Info */}
      {activeBet && (
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Current Bet</div>
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">৳{activeBet.betAmount}</span>
            <span className="text-green-400 font-bold">
              ৳{(activeBet.betAmount * currentMultiplier).toFixed(2)}
            </span>
          </div>
          {activeBet.active && (
            <div className="text-xs text-gray-400 mt-1">
              Potential profit: ৳{(activeBet.betAmount * (currentMultiplier - 1)).toFixed(2)}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {canPlaceBet && (
          <button
            onClick={handlePlaceBet}
            className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Plane size={20} />
            <span>Place Bet (৳{betAmount})</span>
          </button>
        )}
        
        {canCashOut && (
          <button
            onClick={onCashOut}
            className="w-full py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors"
          >
            Cash Out (৳{(activeBet!.betAmount * currentMultiplier).toFixed(2)})
          </button>
        )}
        
        {gameStatus === 'crashed' && activeBet && (
          <div className="text-center">
            {activeBet.cashOutAt ? (
              <div className="text-green-400 font-bold">
                Won ৳{(activeBet.betAmount * activeBet.cashOutAt).toFixed(2)}
              </div>
            ) : (
              <div className="text-red-400 font-bold">
                Lost ৳{activeBet.betAmount}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
