import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameRound, PlayerBet } from '../types/game';

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>({
    status: 'waiting',
    currentMultiplier: 1.0,
    roundId: Date.now().toString(),
  });
  
  const [gameHistory, setGameHistory] = useState<GameRound[]>([]);
  const [activeBets, setActiveBets] = useState<PlayerBet[]>([]);
  const intervalRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const crashPointRef = useRef<number>();

  // Generate crash point with realistic house edge
  const generateCrashPoint = useCallback(() => {
    const random = Math.random();
    
    if (random < 0.90) {
      // 90% chance: 1.0x - 3.0x (realistic early crashes)
      const subRandom = Math.random();
      if (subRandom < 0.4) {
        // 36% of total: 1.0x - 1.5x (very early crashes)
        return 1.0 + Math.random() * 0.5;
      } else if (subRandom < 0.7) {
        // 27% of total: 1.5x - 2.0x (early crashes)
        return 1.5 + Math.random() * 0.5;
      } else {
        // 27% of total: 2.0x - 3.0x (medium early crashes)
        return 2.0 + Math.random() * 1.0;
      }
    } else {
      // 10% chance: 3.0x+ (higher multipliers)
      const highRandom = Math.random();
      if (highRandom < 0.6) {
        // 6% of total: 3.0x - 10.0x (good wins)
        return 3.0 + Math.random() * 7.0;
      } else if (highRandom < 0.9) {
        // 3% of total: 10.0x - 50.0x (big wins)
        return 10.0 + Math.random() * 40.0;
      } else {
        // 1% of total: 50.0x - 200.0x (massive wins)
        return 50.0 + Math.random() * 150.0;
      }
    }
  }, []);

  // Start new game round
  const startNewRound = useCallback(() => {
    const crashPoint = generateCrashPoint();
    const roundId = Date.now().toString();
    
    console.log('Starting new round with crash point:', crashPoint);
    
    crashPointRef.current = crashPoint;
    setGameState({
      status: 'waiting',
      currentMultiplier: 1.0,
      crashPoint,
      roundId,
    });
    
    // Clear active bets
    setActiveBets([]);
    
    // Start flying after 3 seconds
    setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState(prev => ({
        ...prev,
        status: 'flying',
        startTime: startTimeRef.current,
      }));
    }, 3000);
  }, [generateCrashPoint]);

  // Game loop
  useEffect(() => {
    if (gameState.status === 'flying' && startTimeRef.current && crashPointRef.current) {
      intervalRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current!) / 1000;
        const currentMultiplier = Math.max(1.0, 1 + (elapsed * elapsed * 0.08));
        
        if (currentMultiplier >= crashPointRef.current!) {
          // Game crashed!
          setGameState(prev => ({
            ...prev,
            status: 'crashed',
            currentMultiplier: crashPointRef.current!,
          }));
          
          // Add to history
          const crashedRound: GameRound = {
            id: gameState.roundId,
            multiplier: crashPointRef.current!,
            crashed: true,
            timestamp: Date.now(),
            players: activeBets,
          };
          
          setGameHistory(prev => [crashedRound, ...prev.slice(0, 19)]);
          
          // Start new round after 3 seconds
          setTimeout(() => {
            startNewRound();
          }, 3000);
          
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else {
          setGameState(prev => ({
            ...prev,
            currentMultiplier,
          }));
        }
      }, 50);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState.status, gameState.roundId, activeBets, startNewRound]);

  // Initialize first round
  useEffect(() => {
    startNewRound();
  }, []);

  const placeBet = useCallback((bet: PlayerBet) => {
    if (gameState.status === 'waiting') {
      console.log('Placing bet:', bet);
      setActiveBets(prev => [...prev, bet]);
    }
  }, [gameState.status]);

  const cashOut = useCallback((userId: string) => {
    console.log('Cashing out user:', userId, 'at multiplier:', gameState.currentMultiplier);
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
