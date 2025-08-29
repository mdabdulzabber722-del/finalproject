import React, { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { AuthModal } from './components/auth/AuthModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { GameChart } from './components/GameChart';
import { BettingPanel } from './components/BettingPanel';
import { PlayerStats } from './components/PlayerStats';
import { GameHistory } from './components/GameHistory';
import { LiveBets } from './components/LiveBets';
import { MultiplierDisplay } from './components/MultiplierDisplay';
import { ReferralPanel } from './components/ReferralPanel';
import DepositModal from './components/wallet/DepositModal';
import { SupportSection } from './components/SupportSection';
import { useGameEngine } from './hooks/useGameEngine';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';

function App() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
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
    updatePaymentSettings
  } = useFirebaseAuth();
  
  const { gameState, gameHistory, activeBets, placeBet, cashOut } = useGameEngine();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'game' | 'referral'>('game');
  const [showRoundHistory, setShowRoundHistory] = useState(false);

  // Find user's active bet
  const userActiveBet = user ? activeBets.find(bet => bet.userId === user.id) : undefined;

  const handlePlaceBet = useCallback((bet: any) => {
    if (user && user.balance >= bet.betAmount) {
      // Deduct bet amount immediately and wait for it to complete
      updateUserBalance(user.id, -bet.betAmount).then(() => {
        // Force a re-render to show updated balance
        console.log('Bet placed, balance updated');
      });
      updateUserTurnover(user.id, bet.betAmount);
      
      // Add transaction record
      addTransaction({
        userId: user.id,
        type: 'bet',
        amount: bet.betAmount,
        status: 'completed',
        description: 'Game bet',
        adminApproved: true,
      });
      
      // Place the bet
      placeBet(bet);
    }
  }, [user, updateUserBalance, updateUserTurnover, addTransaction, placeBet]);

  const handleCashOut = useCallback(() => {
    if (userActiveBet && user) {
      const winnings = userActiveBet.betAmount * gameState.currentMultiplier;
      
      // Add winnings to balance and wait for completion
      updateUserBalance(user.id, winnings).then(() => {
        console.log('Cash out completed, balance updated');
      });
      
      // Add win transaction
      addTransaction({
        userId: user.id,
        type: 'win',
        amount: winnings,
        status: 'completed',
        description: `Game win at ${gameState.currentMultiplier.toFixed(2)}x`,
        adminApproved: true,
      });
      
      // Cash out the bet
      cashOut(user.id);
    }
  }, [userActiveBet, user, gameState.currentMultiplier, updateUserBalance, addTransaction, cashOut]);

  const handleLogin = useCallback(async (credentials: any) => {
    const result = await login(credentials);
    if (result.success) {
      setShowAuthModal(false);
    }
    return result;
  }, [login]);

  const handleRegister = useCallback(async (data: any) => {
    const result = await register(data);
    if (result.success) {
      setShowAuthModal(false);
    }
    return result;
  }, [register]);

  const handleDeposit = useCallback((amount: number, paymentMethod?: string, paymentDetails?: any) => {
    if (user) {
      // Note: For deposits, we don't update balance immediately
      // Balance is updated only when admin approves the transaction
      console.log('Deposit request created, waiting for admin approval');
      addTransaction({
        userId: user.id,
        type: 'deposit',
        amount,
        status: 'pending',
        description: 'Account deposit',
        adminApproved: false,
        paymentDetails: {
          method: paymentMethod || 'unknown',
          phoneNumber: paymentDetails?.phoneNumber || '',
          transactionId: paymentDetails?.transactionId || '',
          binanceId: paymentDetails?.binanceId || '',
          amount: amount,
        },
      });
    }
  }, [user, addTransaction]);

  const handleWithdraw = useCallback((amount: number, paymentMethod?: string, paymentDetails?: any) => {
    if (user) {
      // Deduct money immediately for withdrawal (will be refunded if rejected)
      updateUserBalance(user.id, -amount).then(() => {
        console.log('Withdrawal amount deducted, pending admin approval');
      });
      addTransaction({
        userId: user.id,
        type: 'withdrawal',
        amount,
        status: 'pending',
        description: 'Account withdrawal',
        adminApproved: false,
        paymentDetails: {
          method: paymentMethod || 'unknown',
          phoneNumber: paymentDetails?.phoneNumber || '',
          transactionId: paymentDetails?.transactionId || '',
          binanceId: paymentDetails?.binanceId || '',
          amount: amount,
        },
      });
    }
  }, [user, updateUserBalance, addTransaction]);

  // Handle game results
  useEffect(() => {
    if (gameState.status === 'crashed' && userActiveBet && user) {
      if (userActiveBet.cashOutAt) {
        // User cashed out - profit already added in handleCashOut
        const profit = userActiveBet.betAmount * (userActiveBet.cashOutAt - 1);
        updateUserStats(user.id, {
          totalWon: user.totalWon + profit,
          gamesPlayed: user.gamesPlayed + 1,
        });
      } else {
        // User didn't cash out - they lost their bet (already deducted)
        updateUserStats(user.id, {
          totalLost: user.totalLost + userActiveBet.betAmount,
          gamesPlayed: user.gamesPlayed + 1,
        });
        
        // Add loss transaction
        addTransaction({
          userId: user.id,
          type: 'loss',
          amount: userActiveBet.betAmount,
          status: 'completed',
          description: `Game loss at ${gameState.currentMultiplier.toFixed(2)}x`,
          adminApproved: true,
        });
      }
    }
  }, [gameState.status, userActiveBet, user, updateUserStats, addTransaction, gameState.currentMultiplier]);

  const handleUpdateUser = useCallback((userId: string, updates: any) => {
    // This function needs to be implemented in useAuth hook
    console.log('Update user:', userId, updates);
  }, []);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Show admin panel if requested
  if (showAdminPanel && user?.isAdmin) {
    return (
      <div>
        <Header 
          user={user} 
          onShowAuth={() => setShowAuthModal(true)} 
          onLogout={logout}
          onShowAdmin={() => setShowAdminPanel(false)}
        />
        <AdminPanel
          users={users}
          transactions={transactions}
          paymentSettings={paymentSettings}
          onUpdateUser={handleUpdateUser}
          onUpdateUserBalance={updateUserBalance}
          onApproveTransaction={approveTransaction}
          onRejectTransaction={rejectTransaction}
          onUpdatePaymentSettings={updatePaymentSettings}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        user={user} 
        onShowAuth={() => setShowAuthModal(true)} 
        onLogout={logout}
        onShowAdmin={user?.isAdmin ? () => setShowAdminPanel(true) : undefined}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {!isAuthenticated ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="text-white text-2xl">🎮</div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Welcome to AviatorCasino</h1>
              <p className="text-gray-400 mb-8">
                Experience the thrill of the crash game. Watch the multiplier rise and cash out before it crashes!
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200"
              >
                Get Started
              </button>
              
              <div className="mt-16">
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tab Navigation */}
            <div className="lg:col-span-3">
              <div className="flex space-x-1 mb-6 bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('game')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'game'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>🎮</span>
                  <span>Game</span>
                </button>
                <button
                  onClick={() => setActiveTab('referral')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'referral'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>👥</span>
                  <span>Referrals</span>
                </button>
              </div>
            </div>

            {/* Main Game Area */}
            {activeTab === 'game' ? (
              <>
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800 rounded-xl p-6">
                    <MultiplierDisplay 
                      multiplier={gameState.currentMultiplier} 
                      status={gameState.status} 
                    />
                  </div>
                  
                  <GameChart 
                    multiplier={gameState.currentMultiplier}
                    status={gameState.status}
                    history={gameHistory}
                    showHistory={showRoundHistory}
                    onToggleHistory={() => setShowRoundHistory(!showRoundHistory)}
                  />
                  
                  {/* Mobile: Show Betting Panel before Live Bets */}
                  <div className="lg:hidden">
                    <BettingPanel
                      user={user}
                      gameStatus={gameState.status}
                      currentMultiplier={gameState.currentMultiplier}
                      activeBet={userActiveBet}
                      onPlaceBet={handlePlaceBet}
                      onCashOut={handleCashOut}
                    />
                  </div>
                  
                  <LiveBets 
                    activeBets={activeBets}
                    currentMultiplier={gameState.currentMultiplier}
                  />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <PlayerStats 
                    user={user} 
                    paymentSettings={paymentSettings}
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                  />
                  
                  {/* Desktop: Show Betting Panel in sidebar */}
                  <div className="hidden lg:block">
                    <BettingPanel
                      user={user}
                      gameStatus={gameState.status}
                      currentMultiplier={gameState.currentMultiplier}
                      activeBet={userActiveBet}
                      onPlaceBet={handlePlaceBet}
                      onCashOut={handleCashOut}
                    />
                  </div>
                  
                  <SupportSection />
                </div>
              </>
            ) : (
              <div className="lg:col-span-3">
                <ReferralPanel user={user} referrals={referrals} />
              </div>
            )}
          </div>
        )}

      </main>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
