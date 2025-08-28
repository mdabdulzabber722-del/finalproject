import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthState, LoginCredentials, RegisterData, Transaction, ReferralData, PaymentSettings } from '../types/auth';

// Convert database row to User type
const dbUserToUser = (dbUser: any): User => ({
  id: dbUser.id,
  username: dbUser.username,
  email: dbUser.email,
  balance: parseFloat(dbUser.balance || '0'),
  totalWon: parseFloat(dbUser.total_won || '0'),
  totalLost: parseFloat(dbUser.total_lost || '0'),
  gamesPlayed: dbUser.games_played || 0,
  isAdmin: dbUser.is_admin || false,
  createdAt: new Date(dbUser.created_at).getTime(),
  lastLogin: new Date(dbUser.last_login).getTime(),
  isActive: dbUser.is_active !== false,
  referralCode: dbUser.referral_code,
  referredBy: dbUser.referred_by,
  totalTurnover: parseFloat(dbUser.total_turnover || '0'),
  referralBonusEarned: parseFloat(dbUser.referral_bonus_earned || '0'),
});

// Convert database row to Transaction type
const dbTransactionToTransaction = (dbTx: any): Transaction => ({
  id: dbTx.id,
  userId: dbTx.user_id,
  type: dbTx.type,
  amount: parseFloat(dbTx.amount),
  status: dbTx.status,
  timestamp: new Date(dbTx.created_at).getTime(),
  description: dbTx.description,
  adminApproved: dbTx.admin_approved,
  paymentDetails: dbTx.payment_details,
  referralBonus: dbTx.referral_bonus,
  referralUserId: dbTx.referral_user_id,
});

// Convert database row to ReferralData type
const dbReferralToReferral = (dbRef: any): ReferralData => ({
  id: dbRef.id,
  referrerId: dbRef.referrer_id,
  referredUserId: dbRef.referred_user_id,
  referredUserEmail: dbRef.referred_user_email,
  firstDepositAmount: parseFloat(dbRef.first_deposit_amount),
  requiredTurnover: parseFloat(dbRef.required_turnover),
  currentTurnover: parseFloat(dbRef.current_turnover || '0'),
  bonusAmount: parseFloat(dbRef.bonus_amount),
  bonusPaid: dbRef.bonus_paid || false,
  createdAt: new Date(dbRef.created_at).getTime(),
  completedAt: dbRef.completed_at ? new Date(dbRef.completed_at).getTime() : undefined,
});

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      // Load users (admin only)
      if (authState.user?.isAdmin) {
        const { data: usersData } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (usersData) {
          setUsers(usersData.map(dbUserToUser));
        }

        // Load all transactions (admin only)
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (transactionsData) {
          setTransactions(transactionsData.map(dbTransactionToTransaction));
        }

        // Load all referrals (admin only)
        const { data: referralsData } = await supabase
          .from('referrals')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (referralsData) {
          setReferrals(referralsData.map(dbReferralToReferral));
        }
      } else if (authState.user) {
        // Load user's own transactions
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', authState.user.id)
          .order('created_at', { ascending: false });
        
        if (transactionsData) {
          setTransactions(transactionsData.map(dbTransactionToTransaction));
        }

        // Load user's referrals
        const { data: referralsData } = await supabase
          .from('referrals')
          .select('*')
          .or(`referrer_id.eq.${authState.user.id},referred_user_id.eq.${authState.user.id}`)
          .order('created_at', { ascending: false });
        
        if (referralsData) {
          setReferrals(referralsData.map(dbReferralToReferral));
        }
      }

      // Load payment settings (everyone can see)
      const { data: paymentData } = await supabase
        .from('payment_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (paymentData) {
        setPaymentSettings({
          nagadNumber: paymentData.nagad_number,
          bkashNumber: paymentData.bkash_number,
          binanceId: paymentData.binance_id,
          nagadAccountName: paymentData.nagad_account_name,
          bkashAccountName: paymentData.bkash_account_name,
          binanceAccountName: paymentData.binance_account_name,
          depositInstructions: paymentData.deposit_instructions,
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [authState.user]);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user data from database
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userData) {
            const user = dbUserToUser(userData);
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Session check error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userData) {
          const user = dbUserToUser(userData);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        setUsers([]);
        setTransactions([]);
        setReferrals([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data when user changes
  useEffect(() => {
    if (authState.user) {
      loadData();
    }
  }, [authState.user, loadData]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      // First check if user exists in our database
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .single();

      if (!userData) {
        return { success: false, error: 'Invalid email or password' };
      }

      if (!userData.is_active) {
        return { success: false, error: 'Account is banned or inactive' };
      }

      // For demo purposes, accept demo passwords
      if (credentials.password !== 'password123' && credentials.password !== 'bdtraderpassword125') {
        return { success: false, error: 'Invalid email or password' };
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id);

      // Sign in with Supabase Auth (create session)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: 'demo-password', // Use a fixed password for demo
      });

      if (signInError) {
        // If user doesn't exist in auth, create them
        const { error: signUpError } = await supabase.auth.signUp({
          email: credentials.email,
          password: 'demo-password',
          options: {
            data: {
              user_id: userData.id,
            }
          }
        });

        if (signUpError) {
          console.error('Auth error:', signUpError);
        }

        // Try signing in again
        await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: 'demo-password',
        });
      }

      const user = dbUserToUser(userData);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validation
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      if (data.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${data.email},username.eq.${data.username}`)
        .single();

      if (existingUser) {
        return { success: false, error: 'Email or username already exists' };
      }

      // Check referral code if provided
      let referrer: any = null;
      if (data.referralCode) {
        const { data: referrerData } = await supabase
          .from('users')
          .select('*')
          .eq('referral_code', data.referralCode.toUpperCase())
          .single();

        if (!referrerData) {
          return { success: false, error: 'Invalid referral code' };
        }
        referrer = referrerData;
      }

      // Generate unique referral code
      const generateReferralCode = async (): Promise<string> => {
        const code = data.username.toUpperCase().slice(0, 4) + Math.random().toString(36).substr(2, 4).toUpperCase();
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .eq('referral_code', code)
          .single();
        
        return existing ? await generateReferralCode() : code;
      };

      const referralCode = await generateReferralCode();

      // Create user in database
      const { data: newUserData, error: insertError } = await supabase
        .from('users')
        .insert({
          username: data.username,
          email: data.email,
          balance: 100, // Welcome bonus
          referral_code: referralCode,
          referred_by: referrer?.id || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      // Create auth user
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: 'demo-password',
        options: {
          data: {
            user_id: newUserData.id,
          }
        }
      });

      if (signUpError) {
        console.error('Auth signup error:', signUpError);
      }

      // Add welcome bonus transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: newUserData.id,
          type: 'deposit',
          amount: 100,
          status: 'completed',
          description: 'Welcome bonus',
          admin_approved: true,
        });

      // Sign in the user
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: 'demo-password',
      });

      const user = dbUserToUser(newUserData);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    setUsers([]);
    setTransactions([]);
    setReferrals([]);
  }, []);

  const updateUserBalance = useCallback(async (userId: string, amount: number) => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single();

      if (userData) {
        const newBalance = Math.max(0, parseFloat(userData.balance) + amount);
        
        await supabase
          .from('users')
          .update({ balance: newBalance })
          .eq('id', userId);

        // Reload data
        await loadData();
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  }, [loadData]);

  const updateUserTurnover = useCallback(async (userId: string, amount: number) => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('total_turnover')
        .eq('id', userId)
        .single();

      if (userData) {
        const newTurnover = parseFloat(userData.total_turnover || '0') + amount;
        
        await supabase
          .from('users')
          .update({ total_turnover: newTurnover })
          .eq('id', userId);

        // Check and update referral progress
        const { data: referralData } = await supabase
          .from('referrals')
          .select('*')
          .eq('referred_user_id', userId)
          .eq('bonus_paid', false)
          .single();

        if (referralData) {
          const newCurrentTurnover = parseFloat(referralData.current_turnover || '0') + amount;
          
          await supabase
            .from('referrals')
            .update({ current_turnover: newCurrentTurnover })
            .eq('id', referralData.id);

          // Check if turnover requirement is met
          if (newCurrentTurnover >= parseFloat(referralData.required_turnover)) {
            // Pay referral bonus
            await supabase
              .from('users')
              .update({ 
                balance: supabase.raw(`balance + ${referralData.bonus_amount}`),
                referral_bonus_earned: supabase.raw(`referral_bonus_earned + ${referralData.bonus_amount}`)
              })
              .eq('id', referralData.referrer_id);

            // Mark referral as completed
            await supabase
              .from('referrals')
              .update({ 
                bonus_paid: true, 
                completed_at: new Date().toISOString() 
              })
              .eq('id', referralData.id);

            // Add bonus transaction
            await supabase
              .from('transactions')
              .insert({
                user_id: referralData.referrer_id,
                type: 'deposit',
                amount: parseFloat(referralData.bonus_amount),
                status: 'completed',
                description: `Referral bonus from ${referralData.referred_user_email}`,
                referral_bonus: true,
                referral_user_id: userId,
                admin_approved: true,
              });
          }
        }

        // Reload data
        await loadData();
      }
    } catch (error) {
      console.error('Error updating turnover:', error);
    }
  }, [loadData]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: transaction.userId,
          type: transaction.type,
          amount: transaction.amount,
          status: transaction.status,
          description: transaction.description,
          admin_approved: transaction.adminApproved,
          payment_details: transaction.paymentDetails,
          referral_bonus: transaction.referralBonus,
          referral_user_id: transaction.referralUserId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding transaction:', error);
        return null;
      }

      // Reload data
      await loadData();
      
      return dbTransactionToTransaction(data);
    } catch (error) {
      console.error('Error adding transaction:', error);
      return null;
    }
  }, [loadData]);

  const approveTransaction = useCallback(async (transactionId: string) => {
    try {
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (txData && txData.status === 'pending') {
        // Update transaction status
        await supabase
          .from('transactions')
          .update({ 
            status: 'completed', 
            admin_approved: true 
          })
          .eq('id', transactionId);

        // If it's a deposit, add money to user balance
        if (txData.type === 'deposit') {
          await supabase
            .from('users')
            .update({ 
              balance: supabase.raw(`balance + ${txData.amount}`)
            })
            .eq('id', txData.user_id);

          // Check if this is a first deposit for referral system
          const { data: userData } = await supabase
            .from('users')
            .select('referred_by')
            .eq('id', txData.user_id)
            .single();

          if (userData?.referred_by) {
            const { data: existingReferral } = await supabase
              .from('referrals')
              .select('id')
              .eq('referred_user_id', txData.user_id)
              .single();

            if (!existingReferral) {
              // Create referral tracking
              const { data: referredUserData } = await supabase
                .from('users')
                .select('email')
                .eq('id', txData.user_id)
                .single();

              await supabase
                .from('referrals')
                .insert({
                  referrer_id: userData.referred_by,
                  referred_user_id: txData.user_id,
                  referred_user_email: referredUserData?.email || '',
                  first_deposit_amount: parseFloat(txData.amount),
                  required_turnover: parseFloat(txData.amount) * 10,
                  bonus_amount: parseFloat(txData.amount),
                });
            }
          }
        }

        // Reload data
        await loadData();
      }
    } catch (error) {
      console.error('Error approving transaction:', error);
    }
  }, [loadData]);

  const rejectTransaction = useCallback(async (transactionId: string) => {
    try {
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (txData && txData.status === 'pending') {
        // Update transaction status
        await supabase
          .from('transactions')
          .update({ 
            status: 'failed', 
            admin_approved: false 
          })
          .eq('id', transactionId);

        // If it's a withdrawal that was rejected, refund the money
        if (txData.type === 'withdrawal') {
          await supabase
            .from('users')
            .update({ 
              balance: supabase.raw(`balance + ${txData.amount}`)
            })
            .eq('id', txData.user_id);
        }

        // Reload data
        await loadData();
      }
    } catch (error) {
      console.error('Error rejecting transaction:', error);
    }
  }, [loadData]);

  const updateUserStats = useCallback(async (userId: string, stats: Partial<Pick<User, 'totalWon' | 'totalLost' | 'gamesPlayed'>>) => {
    try {
      const updateData: any = {};
      if (stats.totalWon !== undefined) updateData.total_won = stats.totalWon;
      if (stats.totalLost !== undefined) updateData.total_lost = stats.totalLost;
      if (stats.gamesPlayed !== undefined) updateData.games_played = stats.gamesPlayed;

      await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }, [loadData]);

  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    try {
      const updateData: any = {};
      if (updates.username !== undefined) updateData.username = updates.username;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.balance !== undefined) updateData.balance = updates.balance;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
      if (updates.isAdmin !== undefined) updateData.is_admin = updates.isAdmin;

      await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }, [loadData]);

  const updatePaymentSettings = useCallback(async (newSettings: PaymentSettings) => {
    try {
      await supabase
        .from('payment_settings')
        .update({
          nagad_number: newSettings.nagadNumber,
          bkash_number: newSettings.bkashNumber,
          binance_id: newSettings.binanceId,
          nagad_account_name: newSettings.nagadAccountName,
          bkash_account_name: newSettings.bkashAccountName,
          binance_account_name: newSettings.binanceAccountName,
          deposit_instructions: newSettings.depositInstructions,
          updated_at: new Date().toISOString(),
        })
        .eq('id', (await supabase.from('payment_settings').select('id').single()).data?.id);

      setPaymentSettings(newSettings);
    } catch (error) {
      console.error('Error updating payment settings:', error);
    }
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