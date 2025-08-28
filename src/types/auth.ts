export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Optional for demo purposes
  balance: number;
  totalWon: number;
  totalLost: number;
  gamesPlayed: number;
  isAdmin: boolean;
  createdAt: number;
  lastLogin: number;
  isActive: boolean;
  referralCode: string;
  referredBy?: string;
  totalTurnover: number;
  referralBonusEarned: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'loss';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  description: string;
  adminApproved?: boolean;
  paymentDetails?: {
    method: string;
    phoneNumber?: string;
    transactionId?: string;
    binanceId?: string;
    amount?: number;
  };
  referralBonus?: boolean;
  referralUserId?: string;
}

export interface ReferralData {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredUserEmail: string;
  firstDepositAmount: number;
  requiredTurnover: number;
  currentTurnover: number;
  bonusAmount: number;
  bonusPaid: boolean;
  createdAt: number;
  completedAt?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalBets: number;
  houseProfit: number;
  pendingWithdrawals: number;
  totalRevenue: number;
  activeGames: number;
  avgSessionTime: number;
}

export interface PaymentSettings {
  nagadNumber: string;
  bkashNumber: string;
  binanceId: string;
  nagadAccountName: string;
  bkashAccountName: string;
  binanceAccountName: string;
  depositInstructions: {
    nagad: string;
    bkash: string;
    binance: string;
  };
}