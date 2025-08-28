import { useState, useCallback, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  onSnapshot,
  increment,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User, AuthState, LoginCredentials, RegisterData, Transaction, ReferralData, PaymentSettings } from '../types/auth';

// Convert Firestore timestamp to number
const timestampToNumber = (timestamp: any): number => {
  if (!timestamp) return Date.now();
  if (timestamp.toDate) return timestamp.toDate().getTime();
  if (timestamp.seconds) return timestamp.seconds * 1000;
  return timestamp;
};

// Convert Firestore document to User type
const firestoreUserToUser = (doc: any, docData: any): User => ({
  id: doc.id,
  username: docData.username || '',
  email: docData.email || '',
  balance: parseFloat(docData.balance || '0'),
  totalWon: parseFloat(docData.totalWon || '0'),
  totalLost: parseFloat(docData.totalLost || '0'),
  gamesPlayed: docData.gamesPlayed || 0,
  isAdmin: docData.isAdmin || false,
  createdAt: timestampToNumber(docData.createdAt),
  lastLogin: timestampToNumber(docData.lastLogin),
  isActive: docData.isActive !== false,
  referralCode: docData.referralCode || '',
  referredBy: docData.referredBy || undefined,
  totalTurnover: parseFloat(docData.totalTurnover || '0'),
  referralBonusEarned: parseFloat(docData.referralBonusEarned || '0'),
});

// Convert Firestore document to Transaction type
const firestoreTransactionToTransaction = (doc: any, docData: any): Transaction => ({
  id: doc.id,
  userId: docData.userId || '',
  type: docData.type || 'deposit',
  amount: parseFloat(docData.amount || '0'),
  status: docData.status || 'pending',
  timestamp: timestampToNumber(docData.timestamp),
  description: docData.description || '',
  adminApproved: docData.adminApproved,
  paymentDetails: docData.paymentDetails,
  referralBonus: docData.referralBonus,
  referralUserId: docData.referralUserId,
});

// Convert Firestore document to ReferralData type
const firestoreReferralToReferral = (doc: any, docData: any): ReferralData => ({
  id: doc.id,
  referrerId: docData.referrerId || '',
  referredUserId: docData.referredUserId || '',
  referredUserEmail: docData.referredUserEmail || '',
  firstDepositAmount: parseFloat(docData.firstDepositAmount || '0'),
  requiredTurnover: parseFloat(docData.requiredTurnover || '0'),
  currentTurnover: parseFloat(docData.currentTurnover || '0'),
  bonusAmount: parseFloat(docData.bonusAmount || '0'),
  bonusPaid: docData.bonusPaid || false,
  createdAt: timestampToNumber(docData.createdAt),
  completedAt: docData.completedAt ? timestampToNumber(docData.completedAt) : undefined,
});

export function useFirebaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);

  // Initialize default payment settings
  const initializePaymentSettings = useCallback(async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'paymentSettings', 'default'));
      
      if (!settingsDoc.exists()) {
        const defaultSettings: PaymentSettings = {
          nagadNumber: '01XXXXXXXXX',
          bkashNumber: '01XXXXXXXXX',
          binanceId: 'your_binance_username',
          nagadAccountName: 'AviatorCasino',
          bkashAccountName: 'AviatorCasino',
          binanceAccountName: 'AviatorCasino',
          depositInstructions: {
            nagad: 'Send money to this Nagad number:',
            bkash: 'Send money to this bKash number:',
            binance: 'Send payment to this Binance Pay ID:',
          },
        };
        
        await setDoc(doc(db, 'paymentSettings', 'default'), defaultSettings);
        setPaymentSettings(defaultSettings);
      } else {
        setPaymentSettings(settingsDoc.data() as PaymentSettings);
      }
    } catch (error) {
      console.error('Error initializing payment settings:', error);
    }
  }, []);

  // Initialize default admin user
  const initializeAdminUser = useCallback(async () => {
    try {
      // Check if admin user exists in Firestore
      const adminEmail = 'bdtraderadmin@aviator.com';
      const adminQuery = query(collection(db, 'users'), where('email', '==', adminEmail));
      const adminSnapshot = await getDocs(adminQuery);
      
      if (adminSnapshot.empty) {
        console.log('Creating admin user in Firestore...');
        
        // Create admin user document with a fixed ID
        const adminDocRef = doc(db, 'users', 'admin-user-id');
        await setDoc(adminDocRef, {
          username: 'admin',
          email: adminEmail,
          balance: 10000,
          totalWon: 0,
          totalLost: 0,
          gamesPlayed: 0,
          isAdmin: true,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          isActive: true,
          referralCode: 'ADMIN001',
          totalTurnover: 0,
          referralBonusEarned: 0,
          firebaseUid: 'admin-user-id'
        });
        
        console.log('Admin user created successfully');
      }
    } catch (error) {
      console.error('Error initializing admin user:', error);
    }
  }, []);

  // Load data based on user role
  const loadData = useCallback(async (currentUser: User | null) => {
    if (!currentUser) return;

    try {
      // Load payment settings for everyone
      const settingsDoc = await getDoc(doc(db, 'paymentSettings', 'default'));
      if (settingsDoc.exists()) {
        setPaymentSettings(settingsDoc.data() as PaymentSettings);
      }

      if (currentUser.isAdmin) {
        // Admin: Load all users
        const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
          const usersData = snapshot.docs.map(doc => 
            firestoreUserToUser(doc, doc.data())
          );
          setUsers(usersData);
        });

        // Admin: Load all transactions
        const transactionsQuery = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
        const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
          const transactionsData = snapshot.docs.map(doc => 
            firestoreTransactionToTransaction(doc, doc.data())
          );
          setTransactions(transactionsData);
        });

        // Admin: Load all referrals
        const referralsQuery = query(collection(db, 'referrals'), orderBy('createdAt', 'desc'));
        const unsubscribeReferrals = onSnapshot(referralsQuery, (snapshot) => {
          const referralsData = snapshot.docs.map(doc => 
            firestoreReferralToReferral(doc, doc.data())
          );
          setReferrals(referralsData);
        });

        return () => {
          unsubscribeUsers();
          unsubscribeTransactions();
          unsubscribeReferrals();
        };
      } else {
        // Regular user: Load only their data
        const userTransactionsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', currentUser.id)
        );
        const unsubscribeTransactions = onSnapshot(userTransactionsQuery, (snapshot) => {
          const transactionsData = snapshot.docs
            .map(doc => 
            firestoreTransactionToTransaction(doc, doc.data())
            )
            .sort((a, b) => b.timestamp - a.timestamp);
          setTransactions(transactionsData);
        });

        // Load user's referrals
        const userReferralsQuery = query(
          collection(db, 'referrals'),
          where('referrerId', '==', currentUser.id)
        );
        const unsubscribeReferrals = onSnapshot(userReferralsQuery, (snapshot) => {
          const referralsData = snapshot.docs.map(doc => 
            firestoreReferralToReferral(doc, doc.data())
          );
          setReferrals(referralsData);
        });

        return () => {
          unsubscribeTransactions();
          unsubscribeReferrals();
        };
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Initialize Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = firestoreUserToUser(userDoc, userDoc.data());
            setAuthState({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Load data based on user role
            await loadData(userData);
          } else {
            // User document doesn't exist, sign out
            await signOut(auth);
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
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

    // Initialize default data
    initializePaymentSettings();
    initializeAdminUser();

    return () => unsubscribe();
  }, [loadData, initializePaymentSettings, initializeAdminUser]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      // Special handling for admin account
      if (credentials.email === 'bdtraderadmin@aviator.com') {
        // Check admin password
        if (credentials.password !== 'bdtraderpassword125') {
          return { success: false, error: 'Invalid email or password' };
        }

        // Get admin user from Firestore
        const adminDocRef = doc(db, 'users', 'admin-user-id');
        let adminDoc = await getDoc(adminDocRef);
        
        if (!adminDoc.exists()) {
          // Create admin user if doesn't exist
          await setDoc(adminDocRef, {
            username: 'admin',
            email: 'bdtraderadmin@aviator.com',
            balance: 10000,
            totalWon: 0,
            totalLost: 0,
            gamesPlayed: 0,
            isAdmin: true,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            isActive: true,
            referralCode: 'ADMIN001',
            totalTurnover: 0,
            referralBonusEarned: 0,
            firebaseUid: 'admin-user-id'
          });
          adminDoc = await getDoc(adminDocRef);
        }

        // Update last login
        await updateDoc(adminDocRef, {
          lastLogin: serverTimestamp()
        });

        // Create a mock Firebase user for admin
        const adminUser = firestoreUserToUser(adminDoc, adminDoc.data());
        setAuthState({
          user: adminUser,
          isAuthenticated: true,
          isLoading: false,
        });

        // Load admin data
        await loadData(adminUser);
        
        return { success: true };
      }

      // Regular user login
      const usersQuery = query(collection(db, 'users'), where('email', '==', credentials.email));
      const userSnapshot = await getDocs(usersQuery);
      
      if (userSnapshot.empty) {
        return { success: false, error: 'Invalid email or password' };
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      
      if (!userData.isActive) {
        return { success: false, error: 'Account is banned or inactive' };
      }

      // For demo purposes, accept demo passwords
      if (credentials.password !== 'password123' && credentials.password !== 'bdtraderpassword125') {
        return { success: false, error: 'Invalid email or password' };
      }

      // Update last login
      const userDocRef = doc(db, 'users', userDoc.id);
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });

      // Sign in with Firebase Auth using a demo password
      try {
        await signInWithEmailAndPassword(auth, credentials.email, 'demo-password-123');
      } catch (authError: any) {
        if (authError.code === 'auth/user-not-found') {
          // Create auth user if doesn't exist
          await createUserWithEmailAndPassword(auth, credentials.email, 'demo-password-123');
          
          // Update the user document with the Firebase UID
          await updateDoc(userDocRef, {
            firebaseUid: auth.currentUser?.uid
          });
        } else {
          console.error('Auth error:', authError);
          // Continue without Firebase Auth for demo purposes
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed. Please try again.' };
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
      const emailQuery = query(
        collection(db, 'users'),
        where('email', '==', data.email)
      );
      const emailSnapshot = await getDocs(emailQuery);
      
      if (!emailSnapshot.empty) {
        return { success: false, error: 'Email already exists' };
      }

      const usernameQuery = query(
        collection(db, 'users'),
        where('username', '==', data.username)
      );
      const usernameSnapshot = await getDocs(usernameQuery);
      
      if (!usernameSnapshot.empty) {
        return { success: false, error: 'Username already exists' };
      }

      // Check referral code if provided
      let referrer: any = null;
      if (data.referralCode) {
        const referralQuery = query(
          collection(db, 'users'),
          where('referralCode', '==', data.referralCode.toUpperCase())
        );
        const referralSnapshot = await getDocs(referralQuery);

        if (referralSnapshot.empty) {
          return { success: false, error: 'Invalid referral code' };
        }
        referrer = { id: referralSnapshot.docs[0].id, ...referralSnapshot.docs[0].data() };
      }

      // Generate unique referral code
      const generateReferralCode = async (): Promise<string> => {
        const code = data.username.toUpperCase().slice(0, 4) + Math.random().toString(36).substr(2, 4).toUpperCase();
        const codeQuery = query(
          collection(db, 'users'),
          where('referralCode', '==', code)
        );
        const codeSnapshot = await getDocs(codeQuery);
        
        return codeSnapshot.empty ? code : await generateReferralCode();
      };

      const referralCode = await generateReferralCode();

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, 'demo-password-123');
      const firebaseUser = userCredential.user;

      // Create user document in Firestore
      const newUserData = {
        username: data.username,
        email: data.email,
        balance: 100, // Welcome bonus
        totalWon: 0,
        totalLost: 0,
        gamesPlayed: 0,
        isAdmin: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: true,
        referralCode: referralCode,
        referredBy: referrer?.id || null,
        totalTurnover: 0,
        referralBonusEarned: 0,
        firebaseUid: firebaseUser.uid,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);

      // Add welcome bonus transaction
      await addDoc(collection(db, 'transactions'), {
        userId: firebaseUser.uid,
        type: 'deposit',
        amount: 100,
        status: 'completed',
        timestamp: serverTimestamp(),
        description: 'Welcome bonus',
        adminApproved: true,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateUserBalance = useCallback(async (userId: string, amount: number) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Get current balance first
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const currentBalance = parseFloat(userDoc.data().balance || '0');
        const newBalance = Math.max(0, currentBalance + amount);
        
        // Update in Firebase
        await updateDoc(userRef, {
          balance: newBalance
        });
        
        // Update local auth state if it's the current user
        if (authState.user?.id === userId) {
          const updatedUser = { ...authState.user, balance: newBalance };
          setAuthState(prev => ({
            ...prev,
            user: updatedUser
          }));
          
          // Force re-render by updating the user in the users array
          setUsers(prev => prev.map(u => 
            u.id === userId ? updatedUser : u
          ));
        } else {
          // Update the user in the users array for admin view
          setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, balance: newBalance } : u
          ));
        }
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  }, [authState.user]);

  const updateUserTurnover = useCallback(async (userId: string, amount: number) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalTurnover: increment(amount)
      });

      // Check and update referral progress
      const referralQuery = query(
        collection(db, 'referrals'),
        where('referredUserId', '==', userId),
        where('bonusPaid', '==', false)
      );
      const referralSnapshot = await getDocs(referralQuery);

      if (!referralSnapshot.empty) {
        const referralDoc = referralSnapshot.docs[0];
        const referralData = referralDoc.data();
        const newCurrentTurnover = (referralData.currentTurnover || 0) + amount;

        await updateDoc(doc(db, 'referrals', referralDoc.id), {
          currentTurnover: newCurrentTurnover
        });

        // Check if turnover requirement is met
        if (newCurrentTurnover >= referralData.requiredTurnover) {
          const batch = writeBatch(db);

          // Update referrer balance
          const referrerRef = doc(db, 'users', referralData.referrerId);
          batch.update(referrerRef, {
            balance: increment(referralData.bonusAmount),
            referralBonusEarned: increment(referralData.bonusAmount)
          });

          // Mark referral as completed
          batch.update(doc(db, 'referrals', referralDoc.id), {
            bonusPaid: true,
            completedAt: serverTimestamp()
          });

          // Add bonus transaction
          const bonusTransactionRef = doc(collection(db, 'transactions'));
          batch.set(bonusTransactionRef, {
            userId: referralData.referrerId,
            type: 'deposit',
            amount: referralData.bonusAmount,
            status: 'completed',
            timestamp: serverTimestamp(),
            description: `Referral bonus from ${referralData.referredUserEmail}`,
            referralBonus: true,
            referralUserId: userId,
            adminApproved: true,
          });

          await batch.commit();
        }
      }
    } catch (error) {
      console.error('Error updating turnover:', error);
    }
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    try {
      const transactionData = {
        userId: transaction.userId,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        timestamp: serverTimestamp(),
        description: transaction.description,
        adminApproved: transaction.adminApproved ?? false,
        paymentDetails: transaction.paymentDetails || null,
        referralBonus: transaction.referralBonus ?? false,
        referralUserId: transaction.referralUserId || null,
      };

      const docRef = await addDoc(collection(db, 'transactions'), transactionData);
      return { ...transaction, id: docRef.id, timestamp: Date.now() };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return null;
    }
  }, []);

  const approveTransaction = useCallback(async (transactionId: string) => {
    try {
      const transactionRef = doc(db, 'transactions', transactionId);
      const transactionDoc = await getDoc(transactionRef);
      
      if (transactionDoc.exists()) {
        const transactionData = transactionDoc.data();
        
        if (transactionData.status === 'pending') {
          // Update transaction status first
          await updateDoc(transactionRef, {
            status: 'completed',
            adminApproved: true
          });

          // If it's a deposit, add money to user balance
          if (transactionData.type === 'deposit') {
            // Use the updateUserBalance function to ensure proper state updates
            await updateUserBalance(transactionData.userId, transactionData.amount);

            // Check if this is a first deposit for referral system
            const userRef = doc(db, 'users', transactionData.userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.referredBy) {
                const referralQuery = query(
                  collection(db, 'referrals'),
                  where('referredUserId', '==', transactionData.userId)
                );
                const referralSnapshot = await getDocs(referralQuery);

                if (referralSnapshot.empty) {
                  // Create referral tracking
                  const batch = writeBatch(db);
                  batch.set(referralRef, {
                    referrerId: userData.referredBy,
                    referredUserId: transactionData.userId,
                    referredUserEmail: userData.email,
                    firstDepositAmount: transactionData.amount,
                    requiredTurnover: transactionData.amount * 10,
                    currentTurnover: 0,
                    bonusAmount: transactionData.amount,
                    bonusPaid: false,
                    createdAt: serverTimestamp(),
                  });
                  await batch.commit();
                }
              }
            }
          }
          
          // Reload data to reflect changes
          await loadData(authState.user);
        }
      }
    } catch (error) {
      console.error('Error approving transaction:', error);
    }
  }, []);

  const rejectTransaction = useCallback(async (transactionId: string) => {
    try {
      const transactionRef = doc(db, 'transactions', transactionId);
      const transactionDoc = await getDoc(transactionRef);
      
      if (transactionDoc.exists()) {
        const transactionData = transactionDoc.data();
        
        if (transactionData.status === 'pending') {
          // Update transaction status first
          await updateDoc(transactionRef, {
            status: 'failed',
            adminApproved: false
          });

          // If it's a withdrawal that was rejected, refund the money
          if (transactionData.type === 'withdrawal') {
            // Use the updateUserBalance function to ensure proper state updates
            await updateUserBalance(transactionData.userId, transactionData.amount);
          }
          
          // Reload data to reflect changes
          await loadData(authState.user);
        }
      }
    } catch (error) {
      console.error('Error rejecting transaction:', error);
    }
  }, [updateUserBalance, loadData, authState.user]);

  const updateUserStats = useCallback(async (userId: string, stats: Partial<Pick<User, 'totalWon' | 'totalLost' | 'gamesPlayed'>>) => {
    try {
      const userRef = doc(db, 'users', userId);
      const updateData: any = {};
      
      if (stats.totalWon !== undefined) updateData.totalWon = stats.totalWon;
      if (stats.totalLost !== undefined) updateData.totalLost = stats.totalLost;
      if (stats.gamesPlayed !== undefined) updateData.gamesPlayed = stats.gamesPlayed;

      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }, []);

  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    try {
      const userRef = doc(db, 'users', userId);
      const updateData: any = {};
      
      if (updates.username !== undefined) updateData.username = updates.username;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.balance !== undefined) updateData.balance = updates.balance;
      if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
      if (updates.isAdmin !== undefined) updateData.isAdmin = updates.isAdmin;

      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }, []);

  const updatePaymentSettings = useCallback(async (newSettings: PaymentSettings) => {
    try {
      await setDoc(doc(db, 'paymentSettings', 'default'), newSettings);
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