export interface GameRound {
  id: string;
  multiplier: number;
  crashed: boolean;
  timestamp: number;
  players: PlayerBet[];
}

export interface PlayerBet {
  userId: string;
  username: string;
  userEmail: string;
  betAmount: number;
  cashOutAt?: number;
  profit: number;
  active: boolean;
}

export interface GameState {
  status: 'waiting' | 'flying' | 'crashed';
  currentMultiplier: number;
  crashPoint?: number;
  startTime?: number;
  roundId: string;
}