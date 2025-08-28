import { useState, useCallback } from 'react';
import { User } from '../types/auth';

export function useUser() {
  const [user, setUser] = useState<User>({
    id: 'user-1',
    username: 'Player1',
    balance: 1000,
    totalWon: 0,
    totalLost: 0,
    gamesPlayed: 0,
    isAdmin: false,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    isActive: true,
  });

  const updateBalance = useCallback((amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance + amount),
    }));
  }, []);

  const addWin = useCallback((amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount,
      totalWon: prev.totalWon + amount,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
  }, []);

  const addLoss = useCallback((amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      totalLost: prev.totalLost + amount,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
  }, []);

  const deposit = useCallback((amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount,
    }));
  }, []);

  return {
    user,
    updateBalance,
    addWin,
    addLoss,
    deposit,
  };
}