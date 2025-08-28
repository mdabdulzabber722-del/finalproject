import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameRound, PlayerBet } from '../types/game';

interface CrashSystemState {
  lowCrashStreak: number;
  lastCrashPoints: number[];
  totalRounds: number;
}

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>({
    status: 'waiting',
    currentMultiplier: 1.0,
    roundId: Date.now().toString(),
  });
  
  const [gameHistory, setGameHistory] = useState<GameRound[]>([]);
  const [activeBets, setActiveBets] = useState<PlayerBet[]>([]);
  const [crashSystem, setCrashSystem] = useState<CrashSystemState>({
    lowCrashStreak: 0,
    lastCrashPoints: [],
    totalRounds: 0,
  });
  const intervalRef = useRef<number>();
  const gameStartRef = useRef<number>();

  // Demo user predetermined crash points
  const DEMO_CRASH_SEQUENCE = [12.00, 8.04, 16.02, 6.50, 1.01, 9.02, 2.00, 1.04, 11.72, 1.89];
  const DEMO_USER_EMAIL = 'player1@example.com';

  const generateCrashPoint = useCallback(() => {
    // Calculate total bet amount from all active bets
    const totalBetAmount = activeBets.reduce((sum, bet) => sum + bet.betAmount, 0);
    
    // Check if demo user is playing
    const demoUserBet = activeBets.find(bet => bet.userEmail === DEMO_USER_EMAIL);
    
    if (demoUserBet) {
      // Use predetermined sequence for demo user
      const crashPoint = DEMO_CRASH_SEQUENCE[crashSystem.totalRounds % DEMO_CRASH_SEQUENCE.length];
      return crashPoint;
    }
    
    // Check if we should give a big multiplier after streak of low crashes
    const shouldGiveBigMultiplier = crashSystem.lowCrashStreak >= 8 + Math.floor(Math.random() * 3); // 8-10 rounds
    
    if (shouldGiveBigMultiplier) {
      // Give a big multiplier (10x - 100x)
      return 10.0 + Math.random() * 90.0;
    }
    
    // No bets placed - default low crash
    if (totalBetAmount === 0) {
      return 1.0 + Math.random() * 1.5; // 1.0x - 2.5x
    }
    
    // High total bet amount (users holding large amounts)
    if (totalBetAmount >= 500) {
      // Most crashes between 1.0x - 2.0x (90% chance)
      const random = Math.random();
      if (random < 0.9) {
        return 1.0 + Math.random() * 1.0; // 1.0x - 2.0x
      } else {
        return 2.0 + Math.random() * 3.0; // 2.0x - 5.0x (rare)
      }
    }
    
    // Medium total bet amount
    if (totalBetAmount >= 200) {
      // Crashes between 1.0x - 3.0x (80% chance)
      const random = Math.random();
      if (random < 0.8) {
        return 1.0 + Math.random() * 2.0; // 1.0x - 3.0x
      } else {
        return 3.0 + Math.random() * 7.0; // 3.0x - 10.0x
      }
    }
    
    // Low total bet amount (users holding small amounts)
    if (totalBetAmount < 200) {
      // Higher multipliers more likely
      const random = Math.random();
      if (random < 0.3) {
        return 1.0 + Math.random() * 2.0; // 1.0x - 3.0x (30% chance)
      } else if (random < 0.7) {
        return 3.0 + Math.random() * 7.0; // 3.0x - 10.0x (40% chance)
      } else {
        return 10.0 + Math.random() * 40.0; // 10.0x - 50.0x (30% chance)
      }
    }
    
    // Fallback
    return 1.0 + Math.random() * 1.5;
  }, [activeBets, crashSystem]);

  const startNewRound = useCallback(() => {
    const crashPoint = generateCrashPoint();
    const newRoundId = Date.now().toString();
    
    setGameState({
      status: 'waiting',
      currentMultiplier: 1.0,
      crashPoint,
      roundId: newRoundId,
    });
    
    setActiveBets([]);
    
    // Update crash system state
    setCrashSystem(prev => {
      const isLowCrash = crashPoint <= 3.0;
      const newStreak = isLowCrash ? prev.lowCrashStreak + 1 : 0;
      const newLastCrashes = [crashPoint, ...prev.lastCrashPoints.slice(0, 9)]; // Keep last 10
      
      return {
        lowCrashStreak: newStreak,
        lastCrashPoints: newLastCrashes,
        totalRounds: prev.totalRounds + 1,
      };
    });
    
    // Wait 5 seconds before starting
    setTimeout(() => {
      setGameState(prev => ({ ...prev, status: 'flying', startTime: Date.now() }));
      gameStartRef.current = Date.now();
    }, 5000);
  }, [generateCrashPoint]);

  const updateMultiplier = useCallback(() => {
    if (!gameStartRef.current) return;
    
    const elapsed = (Date.now() - gameStartRef.current) / 1000;
    const newMultiplier = Math.max(1.0, 1 + (elapsed * elapsed * 0.1));
    
    setGameState(prev => {
      if (prev.crashPoint && newMultiplier >= prev.crashPoint) {
        // Game crashed!
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = undefined;
        }
        
        const crashedRound: GameRound = {
          id: prev.roundId,
          multiplier: prev.crashPoint,
          crashed: true,
          timestamp: Date.now(),
          players: activeBets,
        };
        
        setGameHistory(history => [crashedRound, ...history.slice(0, 19)]);
        
        // Start new round after 3 seconds
        setTimeout(() => {
          startNewRound();
        }, 3000);
        
        return {
          ...prev,
          status: 'crashed',
          currentMultiplier: prev.crashPoint!,
        };
      }
      
      return { ...prev, currentMultiplier: newMultiplier };
    });
  }, [activeBets, startNewRound]);

  useEffect(() => {
    if (gameState.status === 'flying') {
      intervalRef.current = setInterval(updateMultiplier, 50);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState.status, updateMultiplier]);

  useEffect(() => {
    startNewRound();
  }, []);

  const placeBet = useCallback((bet: PlayerBet) => {
    if (gameState.status === 'waiting') {
      setActiveBets(prev => [...prev, bet]);
    }
  }, [gameState.status]);

  const cashOut = useCallback((userId: string) => {
    setActiveBets(prev => 
      prev.map(bet => 
        bet.userId === userId && bet.active
          ? { 
              ...bet, 
              active: false, 
              cashOutAt: gameState.currentMultiplier,
              profit: bet.betAmount * (gameState.currentMultiplier - 1)
            }
          : bet
      )
    );
  }, [gameState.currentMultiplier]);

  return {
    gameState,
    gameHistory,
    activeBets,
    placeBet,
    cashOut,
  };
}