import { useState, useCallback, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterData, Transaction, ReferralData, PaymentSettings } from '../types/auth';

// Mock user database - in production, this would be a real database
const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'bdtraderadmin@aviator.com',
    balance: 10000,
    totalWon: 0,
    totalLost: 0,
    gamesPlayed: 0,
    isAdmin: true,
    createdAt: Date.now() - 86400000,
    lastLogin: Date.now(),
    isActive: true,
    referralCode: 'ADMIN001',
    totalTurnover: 0,
    referralBonusEarned: 0,
  },
  {
    id: 'user-1',
    username: 'player1',
    email: 'player1@example.com',
    balance: 500,
    totalWon: 250,
    totalLost: 150,
    gamesPlayed: 25,
    isAdmin: false,
    createdAt: Date.now() - 86400000,
    lastLogin: Date.now() - 3600000,
    isActive: true,
    referralCode: 'PLAYER001',
    totalTurnover: 400,
    referralBonusEarned: 0,
  }
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    userId: 'user-1',
    type: 'deposit',
    amount: 100,
    status: 'completed',
    timestamp: Date.now() - 3600000,
    description: 'Initial deposit',
    adminApproved: true,
  }
];

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  nagadNumber: '01712345678',
  bkashNumber: '01812345678',
  binanceId: 'aviator_casino_2024',
  nagadAccountName: 'AviatorCasino',
  bkashAccountName: 'AviatorCasino',
  binanceAccountName: 'AviatorCasino',
  depositInstructions: {
    nagad: 'Send money to this Nagad number:',
    bkash: 'Send money to this bKash number:',
    binance: 'Send payment to this Binance Pay ID:',
  },
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    const saved = localStorage.getItem('aviator_payment_settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        // Deep merge with default settings to ensure all properties exist
        return {
          ...DEFAULT_PAYMENT_SETTINGS,
          ...parsedSettings,
          depositInstructions: {
            ...DEFAULT_PAYMENT_SETTINGS.depositInstructions,
            ...(parsedSettings.depositInstructions || {}),
          },
        };
      } catch {
        return DEFAULT_PAYMENT_SETTINGS;
      }
    }
    return DEFAULT_PAYMENT_SETTINGS;
  });

  // Check for existing session on mount
  useEffect(() => {
    // Load all users from localStorage for admin
    const savedAllUsers = localStorage.getItem('aviator_all_users');
    if (savedAllUsers) {
      try {
        const allUsers = JSON.parse(savedAllUsers);
        setUsers(allUsers);
      } catch {
        // Keep default users if parsing fails
      }
    }
    
    // Load all transactions from localStorage for admin
    const savedAllTransactions = localStorage.getItem('aviator_all_transactions');
    if (savedAllTransactions) {
      try {
        const allTransactions = JSON.parse(savedAllTransactions);
        setTransactions(allTransactions);
      } catch {
        // Keep default transactions if parsing fails
      }
    }
    
    // Load all users from localStorage for admin
    const savedAllUsers = localStorage.getItem('aviator_all_users');
    if (savedAllUsers) {
      try {
        const allUsers = JSON.parse(savedAllUsers);
        setUsers(allUsers);
      } catch {
        // Keep default users if parsing fails
      }
    }
    
    // Load all transactions from localStorage for admin
    const savedAllTransactions = localStorage.getItem('aviator_all_transactions');
    if (savedAllTransactions) {
      try {
        const allTransactions = JSON.parse(savedAllTransactions);
        setTransactions(allTransactions);
      } catch {
        // Keep default transactions if parsing fails
      }
    }
    
    const savedUser = localStorage.getItem('aviator_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('aviator_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = users.find(u => u.email === credentials.email);
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      if (!user.isActive) {
        return { success: false, error: 'Account is banned or inactive' };
      }

      // For demo purposes, accept the demo password
      if (credentials.password !== 'password123' && credentials.password !== 'bdtraderpassword125') {
        return { success: false, error: 'Invalid email or password' };
      }

      // Update last login
      const updatedUser = { ...user, lastLogin: Date.now() };
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem('aviator_user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }, [users]);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validation
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      if (data.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      if (users.some(u => u.email === data.email)) {
        return { success: false, error: 'Email already exists' };
      }

      if (users.some(u => u.username === data.username)) {
        return { success: false, error: 'Username already exists' };
      }

      // Check referral code if provided
      let referrer: User | undefined;
      if (data.referralCode) {
        referrer = users.find(u => u.referralCode === data.referralCode.toUpperCase());
        if (!referrer) {
          return { success: false, error: 'Invalid referral code' };
        }
      }

      // Generate unique referral code
      const generateReferralCode = () => {
        const code = data.username.toUpperCase().slice(0, 4) + Math.random().toString(36).substr(2, 4).toUpperCase();
        return users.some(u => u.referralCode === code) ? generateReferralCode() : code;
      };

      const newUser: User = {
        id: `user-${Date.now()}`,
        username: data.username,
        email: data.email,
        balance: 100, // Welcome bonus
        totalWon: 0,
        totalLost: 0,
        gamesPlayed: 0,
        isAdmin: false,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        isActive: true,
        referralCode: generateReferralCode(),
        referredBy: referrer?.id,
        totalTurnover: 0,
        referralBonusEarned: 0,
      };

      setUsers(prev => [...prev, newUser]);
      
      // Save to localStorage so admin can see all users
      const allUsers = [...users, newUser];
      localStorage.setItem('aviator_all_users', JSON.stringify(allUsers));
      
      // Save to localStorage so admin can see all users
      const allUsers = [...users, newUser];
      localStorage.setItem('aviator_all_users', JSON.stringify(allUsers));
      
      // Add welcome bonus transaction
      const welcomeTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        userId: newUser.id,
        type: 'deposit',
        amount: 100,
        status: 'completed',
        timestamp: Date.now(),
        description: 'Welcome bonus',
        adminApproved: true,
      };

      setTransactions(prev => [...prev, welcomeTransaction]);
      
      // Save transactions to localStorage
      const allTransactions = [...transactions, welcomeTransaction];
      localStorage.setItem('aviator_all_transactions', JSON.stringify(allTransactions));

      // Save transactions to localStorage
      const allTransactions = [...transactions, welcomeTransaction];
      localStorage.setItem('aviator_all_transactions', JSON.stringify(allTransactions));

      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem('aviator_user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }, [users]);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('aviator_user');
  }, []);

  const checkReferralTurnover = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.referredBy) return;

    const referralData = referrals.find(r => r.referredUserId === userId && !r.bonusPaid);
    if (!referralData) return;

    if (user.totalTurnover >= referralData.requiredTurnover) {
      // Pay referral bonus
      const referrer = users.find(u => u.id === user.referredBy);
      if (referrer) {
        // Update referrer balance
        setUsers(prev => prev.map(u => 
          u.id === referrer.id 
            ? { ...u, balance: u.balance + referralData.bonusAmount, referralBonusEarned: u.referralBonusEarned + referralData.bonusAmount }
            : u
        ));

        // Mark referral as completed
        setReferrals(prev => prev.map(r => 
          r.id === referralData.id 
            ? { ...r, bonusPaid: true, completedAt: Date.now() }
            : r
        ));

        // Add transaction for referral bonus
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: referrer.id,
          type: 'deposit',
          amount: referralData.bonusAmount,
          status: 'completed',
          timestamp: Date.now(),
          description: `Referral bonus from ${user.username}`,
          referralBonus: true,
          referralUserId: userId,
          adminApproved: true,
        };
        setTransactions(prev => [newTransaction, ...prev]);
      }
    }
  }, [users, referrals]);

  const updateUserBalance = useCallback((userId: string, amount: number) => {
    setUsers(prev => {
      const updatedUsers = prev.map(user => 
        user.id === userId 
          ? { ...user, balance: Math.max(0, user.balance + amount) }
          : user
      );
      
      // Update current authenticated user state if it's the same user
      if (authState.user?.id === userId) {
        const updatedUser = updatedUsers.find(u => u.id === userId);
        if (updatedUser) {
          setAuthState(prevAuth => ({ ...prevAuth, user: updatedUser }));
          localStorage.setItem('aviator_user', JSON.stringify(updatedUser));
        }
      }
      
      return updatedUsers;
    });
  }, [authState.user]);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers(prev => {
      const updatedUsers = prev.map(user => 
        user.id === userId 
          ? { ...user, ...updates }
          : user
      );
      
      // Update current authenticated user state if it's the same user
      if (authState.user?.id === userId) {
        const updatedUser = updatedUsers.find(u => u.id === userId);
        if (updatedUser) {
          setAuthState(prevAuth => ({ ...prevAuth, user: updatedUser }));
          localStorage.setItem('aviator_user', JSON.stringify(updatedUser));
        }
      }
      
      return updatedUsers;
    });
  }, [authState.user]);

  const updateUserTurnover = useCallback((userId: string, amount: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, totalTurnover: user.totalTurnover + amount }
        : user
    ));

    if (authState.user?.id === userId) {
      const updatedUser = { ...authState.user, totalTurnover: authState.user.totalTurnover + amount };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('aviator_user', JSON.stringify(updatedUser));
    }

    // Update referral turnover and check for completion
    setReferrals(prev => prev.map(referral => {
      if (referral.referredUserId === userId && !referral.bonusPaid) {
        const newTurnover = referral.currentTurnover + amount;
        const updatedReferral = { ...referral, currentTurnover: newTurnover };
        
        // Check if turnover requirement is met
        if (newTurnover >= referral.requiredTurnover) {
          // Pay referral bonus
          const referrer = users.find(u => u.id === referral.referrerId);
          if (referrer) {
            // Update referrer balance and stats
            setUsers(usersPrev => usersPrev.map(u => 
              u.id === referrer.id 
                ? { 
                    ...u, 
                    balance: u.balance + referral.bonusAmount,
                    referralBonusEarned: u.referralBonusEarned + referral.bonusAmount
                  }
                : u
            ));

            // Update auth state if referrer is current user
            if (authState.user?.id === referrer.id) {
              const updatedReferrer = { 
                ...authState.user, 
                balance: authState.user.balance + referral.bonusAmount,
                referralBonusEarned: authState.user.referralBonusEarned + referral.bonusAmount
              };
              setAuthState(prev => ({ ...prev, user: updatedReferrer }));
              localStorage.setItem('aviator_user', JSON.stringify(updatedReferrer));
            }

            // Add transaction for referral bonus
            const bonusTransaction: Transaction = {
              id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              userId: referrer.id,
              type: 'deposit',
              amount: referral.bonusAmount,
              status: 'completed',
              timestamp: Date.now(),
              description: `Referral bonus from ${users.find(u => u.id === userId)?.username || 'user'}`,
              referralBonus: true,
              referralUserId: userId,
              adminApproved: true,
            };
            setTransactions(prev => [bonusTransaction, ...prev]);
          }
          
          return { ...updatedReferral, bonusPaid: true, completedAt: Date.now() };
        }
        
        return updatedReferral;
      }
      return referral;
    }));
  }, [authState.user, users, referrals, checkReferralTurnover]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Save to localStorage so admin can see all transactions
    const allTransactions = [newTransaction, ...transactions];
    localStorage.setItem('aviator_all_transactions', JSON.stringify(allTransactions));
    
    return newTransaction;
  }, []);

  const approveTransaction = useCallback((transactionId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === transactionId && tx.status === 'pending') {
        // If it's a deposit, add money to user balance
        if (tx.type === 'deposit') {
          setUsers(usersPrev => usersPrev.map(user => 
            user.id === tx.userId 
              ? { ...user, balance: user.balance + tx.amount }
              : user
          ));
          
          // Update auth state if it's the current user
          if (authState.user?.id === tx.userId) {
            const updatedUser = { ...authState.user, balance: authState.user.balance + tx.amount };
            setAuthState(prev => ({ ...prev, user: updatedUser }));
            localStorage.setItem('aviator_user', JSON.stringify(updatedUser));
          }

          // Check if this is a first deposit for referral system
          const user = users.find(u => u.id === tx.userId);
          if (user && user.referredBy) {
            const existingReferral = referrals.find(r => r.referredUserId === user.id);
            if (!existingReferral) {
              // Create referral tracking
              const newReferral: ReferralData = {
                id: `ref-${Date.now()}`,
                referrerId: user.referredBy,
                referredUserId: user.id,
                referredUserEmail: user.email,
                firstDepositAmount: tx.amount,
                requiredTurnover: tx.amount * 10, // 10x turnover requirement
                currentTurnover: 0,
                bonusAmount: tx.amount, // Same as deposit amount
                bonusPaid: false,
                createdAt: Date.now(),
              };
              setReferrals(prev => [...prev, newReferral]);
            }
          }
        }
        
        return { ...tx, status: 'completed' as const, adminApproved: true };
      }
      return tx;
    }));
  }, [authState.user, users, referrals]);

  const rejectTransaction = useCallback((transactionId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === transactionId && tx.status === 'pending') {
        // If it's a withdrawal that was rejected, refund the money
        if (tx.type === 'withdrawal') {
          setUsers(usersPrev => usersPrev.map(user => 
            user.id === tx.userId 
              ? { ...user, balance: user.balance + tx.amount }
              : user
          ));
          
          // Update auth state if it's the current user
          if (authState.user?.id === tx.userId) {
            const updatedUser = { ...authState.user, balance: authState.user.balance + tx.amount };
            setAuthState(prev => ({ ...prev, user: updatedUser }));
            localStorage.setItem('aviator_user', JSON.stringify(updatedUser));
          }
        }
        
        return { ...tx, status: 'failed' as const, adminApproved: false };
      }
      return tx;
    }));
  }, [authState.user, users]);

  const updateUserStats = useCallback((userId: string, stats: Partial<Pick<User, 'totalWon' | 'totalLost' | 'gamesPlayed'>>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, ...stats }
        : user
    ));

    if (authState.user?.id === userId) {
      const updatedUser = { ...authState.user, ...stats };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('aviator_user', JSON.stringify(updatedUser));
    }
  }, [authState.user, users]);

  const updatePaymentSettings = useCallback((newSettings: PaymentSettings) => {
    setPaymentSettings(newSettings);
    localStorage.setItem('aviator_payment_settings', JSON.stringify(newSettings));
  }, []);

  return {
    ...authState,
    users,
    transactions,
    referrals,
    paymentSettings,
    login,
    register,
    logout,
    updateUserBalance,
    updateUserTurnover,
    addTransaction,
    approveTransaction,
    rejectTransaction,
    updateUserStats,
    updateUser,
    updatePaymentSettings,
  };
}