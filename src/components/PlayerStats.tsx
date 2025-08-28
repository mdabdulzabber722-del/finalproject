import React, { useState } from 'react';
import { User, Wallet, TrendingUp, Target, Plus, Minus } from 'lucide-react';
import { DepositModal } from './wallet/DepositModal';
import { WithdrawModal } from './wallet/WithdrawModal';
import { User as UserType } from '../types/auth';

interface PlayerStatsProps {
  user: UserType;
  paymentSettings?: any;
  onDeposit: (amount: number, paymentMethod?: string, paymentDetails?: any) => void;
  onWithdraw: (amount: number, paymentMethod?: string, paymentDetails?: any) => void;
}

export function PlayerStats({ user, paymentSettings, onDeposit, onWithdraw }: PlayerStatsProps) {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const winRate = user.gamesPlayed > 0 ? (user.totalWon / (user.totalWon + user.totalLost)) * 100 : 0;
  const netProfit = user.totalWon - user.totalLost;

  return (
    <>
      <div className="bg-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <User className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.username}</h2>
            <div className="text-gray-400 text-sm">Player ID: {user.id.slice(0, 8)}...</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="text-yellow-400" size={16} />
              <span className="text-gray-300 text-sm">Balance</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              ৳{user.balance.toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="text-green-400" size={16} />
              <span className="text-gray-300 text-sm">Net Profit</span>
            </div>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ৳{netProfit.toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="text-blue-400" size={16} />
              <span className="text-gray-300 text-sm">Win Rate</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {winRate.toFixed(1)}%
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <User className="text-purple-400" size={16} />
              <span className="text-gray-300 text-sm">Games</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {user.gamesPlayed}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700 space-y-3">
          <button
            onClick={() => setShowDepositModal(true)}
            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>Deposit</span>
          </button>
          
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={user.balance < 200}
            className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Minus size={16} />
            <span>Withdraw</span>
          </button>
        </div>
      </div>
      
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={onDeposit}
        paymentSettings={paymentSettings}
      />
      
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={onWithdraw}
        balance={user.balance}
      />
    </>
  );
}