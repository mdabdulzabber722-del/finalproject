import React, { useState } from 'react';
import { Users, DollarSign, TrendingUp, AlertCircle, Eye, Ban, Check, X, Search, Filter, Download, Settings } from 'lucide-react';
import { User, Transaction, AdminStats } from '../../types/auth';
import { UserDetailsModal } from './UserDetailsModal';
import { PaymentSettingsModal } from './PaymentSettingsModal';

interface AdminPanelProps {
  users: User[];
  transactions: Transaction[];
  paymentSettings: any;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onUpdateUserBalance: (userId: string, amount: number) => void;
  onApproveTransaction: (transactionId: string) => void;
  onRejectTransaction: (transactionId: string) => void;
  onUpdatePaymentSettings: (settings: any) => void;
}

export function AdminPanel({ 
  users, 
  transactions, 
  paymentSettings,
  onUpdateUser, 
  onUpdateUserBalance,
  onApproveTransaction, 
  onRejectTransaction,
  onUpdatePaymentSettings
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions'>('overview');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all');

  const stats: AdminStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    totalDeposits: transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    totalBets: transactions.filter(t => t.type === 'bet').reduce((sum, t) => sum + t.amount, 0),
    houseProfit: transactions.filter(t => t.type === 'loss').reduce((sum, t) => sum + t.amount, 0) - 
                 transactions.filter(t => t.type === 'win').reduce((sum, t) => sum + t.amount, 0),
    pendingWithdrawals: transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').length,
    totalRevenue: transactions.filter(t => t.type === 'loss').reduce((sum, t) => sum + t.amount, 0),
    activeGames: users.filter(u => u.isActive).length, // Simplified for demo
    avgSessionTime: 45, // Mock data
  };

  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  
  const filteredUsers = users
    .filter(u => !u.isAdmin)
    .filter(u => {
      if (filterStatus === 'active') return u.isActive;
      if (filterStatus === 'banned') return !u.isActive;
      return true;
    })
    .filter(u => 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleBanUser = (userId: string) => {
    onUpdateUser(userId, { isActive: false });
    setShowUserDetails(false);
  };

  const handleUnbanUser = (userId: string) => {
    onUpdateUser(userId, { isActive: true });
    setShowUserDetails(false);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🎮 AviatorCasino Admin Panel</h1>
          <p className="text-gray-400">Manage users, transactions, and platform settings</p>
          
          {/* Quick Actions */}
          <div className="mt-4">
            <button
              onClick={() => setShowPaymentSettings(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Settings size={16} />
              <span>Payment Settings</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 mb-8 bg-slate-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'transactions', label: 'Transactions', icon: DollarSign },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === id
                  ? 'bg-green-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Total Users</h3>
                  <Users className="text-blue-400" size={24} />
                </div>
                <div className="text-3xl font-bold text-blue-400">{stats.totalUsers}</div>
                <div className="text-sm text-gray-400">{stats.activeUsers} active</div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Total Deposits</h3>
                  <DollarSign className="text-green-400" size={24} />
                </div>
                <div className="text-3xl font-bold text-green-400">${stats.totalDeposits.toFixed(2)}</div>
                <div className="text-sm text-gray-400">Lifetime deposits</div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">House Profit</h3>
                  <TrendingUp className="text-yellow-400" size={24} />
                </div>
                <div className="text-3xl font-bold text-yellow-400">৳{stats.houseProfit.toFixed(2)}</div>
                <div className="text-sm text-gray-400">Net house edge</div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Pending</h3>
                  <AlertCircle className="text-red-400" size={24} />
                </div>
                <div className="text-3xl font-bold text-red-400">{stats.pendingWithdrawals}</div>
                <div className="text-sm text-gray-400">withdrawals</div>
              </div>
            </div>

            {/* Pending Transactions */}
            {pendingTransactions.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Pending Approvals</h3>
                  <div className="text-sm text-gray-400">
                    {pendingTransactions.length} pending transaction{pendingTransactions.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="space-y-3">
                  {pendingTransactions.map((transaction) => {
                    const user = users.find(u => u.id === transaction.userId);
                    return (
                      <div key={transaction.id} className="p-6 bg-slate-700 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              transaction.type === 'deposit' ? 'bg-green-400' : 'bg-yellow-400'
                            }`} />
                            <div>
                              <div className="text-white font-medium text-lg">
                                {transaction.type === 'deposit' ? 'Deposit Request' : 'Withdrawal Request'}: ৳{transaction.amount}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {user?.username} ({user?.email}) • {new Date(transaction.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => onApproveTransaction(transaction.id)}
                              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center space-x-1"
                            >
                              <Check size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => onRejectTransaction(transaction.id)}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center space-x-1"
                            >
                              <X size={14} />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                        
                        {/* Payment Details - Enhanced Display */}
                        {transaction.paymentDetails && (
                          <div className="mt-4 p-6 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl border-2 border-blue-500 shadow-lg">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                transaction.paymentDetails.method === 'nagad' ? 'bg-orange-500' :
                                transaction.paymentDetails.method === 'bkash' ? 'bg-pink-500' :
                                'bg-yellow-500'
                              }`}>
                                {transaction.paymentDetails.method === 'nagad' ? '📱' :
                                 transaction.paymentDetails.method === 'bkash' ? '📱' : '🏦'}
                              </div>
                              <div>
                                <div className="text-white font-bold text-lg capitalize">
                                  {transaction.paymentDetails.method} Payment Details
                                </div>
                                <div className="text-gray-400 text-sm">
                                  {transaction.type === 'deposit' ? 'User sent money from:' : 'User wants money sent to:'}
                                </div>
                              </div>
                            </div>
                            
                            {/* Enhanced Payment Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              {transaction.paymentDetails.phoneNumber && (
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-500">
                                  <div className="text-gray-300 text-sm font-medium mb-2 flex items-center">
                                    📱
                                    {transaction.paymentDetails.method === 'nagad' ? ' Nagad Number:' : ' bKash Number:'}
                                  </div>
                                  <div className="text-white font-mono text-xl font-bold bg-slate-900 px-4 py-3 rounded-lg border-2 border-green-400 text-center">
                                    {transaction.paymentDetails.phoneNumber}
                                  </div>
                                </div>
                              )}
                              {transaction.paymentDetails.transactionId && (
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-500">
                                  <div className="text-gray-300 text-sm font-medium mb-2 flex items-center">
                                    🆔 Transaction ID:
                                  </div>
                                  <div className="text-white font-mono text-lg font-bold bg-slate-900 px-4 py-3 rounded-lg border-2 border-blue-400 text-center break-all">
                                    {transaction.paymentDetails.transactionId}
                                  </div>
                                </div>
                              )}
                              {transaction.paymentDetails.binanceId && (
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-500 md:col-span-2">
                                  <div className="text-gray-300 text-sm font-medium mb-2 flex items-center">
                                    🏦 Binance Pay ID:
                                  </div>
                                  <div className="text-white font-mono text-xl font-bold bg-slate-900 px-4 py-3 rounded-lg border-2 border-yellow-400 text-center">
                                    {transaction.paymentDetails.binanceId}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Quick Copy Buttons */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {transaction.paymentDetails.phoneNumber && (
                                <button
                                  onClick={() => navigator.clipboard?.writeText(transaction.paymentDetails.phoneNumber || '')}
                                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-medium"
                                >
                                  📋 Copy Phone Number
                                </button>
                              )}
                              {transaction.paymentDetails.transactionId && (
                                <button
                                  onClick={() => navigator.clipboard?.writeText(transaction.paymentDetails.transactionId || '')}
                                  className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg font-medium"
                                >
                                  📋 Copy Transaction ID
                                </button>
                              )}
                              {transaction.paymentDetails.binanceId && (
                                <button
                                  onClick={() => navigator.clipboard?.writeText(transaction.paymentDetails.binanceId || '')}
                                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded-lg font-medium"
                                >
                                  📋 Copy Binance ID
                                </button>
                              )}
                            </div>
                            
                            {/* Verification Instructions for Admin */}
                            {transaction.type === 'deposit' && (
                              <div className="p-4 bg-blue-500 bg-opacity-20 border-2 border-blue-400 rounded-lg">
                                <div className="text-blue-400 font-medium text-sm mb-2">📋 Verification Steps:</div>
                                <div className="text-blue-300 text-xs space-y-1">
                                  {transaction.paymentDetails.method === 'nagad' && (
                                    <>
                                      <div>• Check your Nagad account ({paymentSettings.nagadNumber}) for incoming payment</div>
                                      <div>• Verify amount matches: ৳{transaction.amount}</div>
                                      <div>• Confirm sender number: {transaction.paymentDetails.phoneNumber}</div>
                                      <div>• Match transaction ID: {transaction.paymentDetails.transactionId}</div>
                                    </>
                                  )}
                                  {transaction.paymentDetails.method === 'bkash' && (
                                    <>
                                      <div>• Check your bKash account ({paymentSettings.bkashNumber}) for incoming payment</div>
                                      <div>• Verify amount matches: ৳{transaction.amount}</div>
                                      <div>• Confirm sender number: {transaction.paymentDetails.phoneNumber}</div>
                                      <div>• Match transaction ID: {transaction.paymentDetails.transactionId}</div>
                                    </>
                                  )}
                                  {transaction.paymentDetails.method === 'binance' && (
                                    <>
                                      <div>• Check your Binance Pay ({paymentSettings.binanceId}) for incoming payment</div>
                                      <div>• Verify amount matches: ৳{transaction.amount}</div>
                                      <div>• Confirm sender ID: {transaction.paymentDetails.binanceId}</div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {transaction.type === 'withdrawal' && (
                              <div className="p-4 bg-yellow-500 bg-opacity-20 border-2 border-yellow-400 rounded-lg">
                                <div className="text-yellow-400 font-medium text-sm mb-2">💸 Send Payment To:</div>
                                <div className="text-yellow-300 text-xs space-y-1">
                                  {transaction.paymentDetails.method === 'nagad' && (
                                    <>
                                      <div>• Send ৳{transaction.amount} via Nagad</div>
                                      <div>• To number: {transaction.paymentDetails.phoneNumber}</div>
                                      <div>• User: {user?.username} ({user?.email})</div>
                                    </>
                                  )}
                                  {transaction.paymentDetails.method === 'bkash' && (
                                    <>
                                      <div>• Send ৳{transaction.amount} via bKash</div>
                                      <div>• To number: {transaction.paymentDetails.phoneNumber}</div>
                                      <div>• User: {user?.username} ({user?.email})</div>
                                    </>
                                  )}
                                  {transaction.paymentDetails.method === 'binance' && (
                                    <>
                                      <div>• Send ৳{transaction.amount} via Binance Pay</div>
                                      <div>• To ID: {transaction.paymentDetails.binanceId}</div>
                                      <div>• User: {user?.username} ({user?.email})</div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* User Info */}
                        <div className="mt-4 p-4 bg-slate-600 rounded-lg border border-slate-500">
                          <div className="text-sm font-medium text-gray-300 mb-2">User Information:</div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-400">Current Balance:</span>
                              <span className="text-yellow-400 ml-2 font-medium">৳{user?.balance.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Total Deposits:</span>
                              <span className="text-green-400 ml-2 font-medium">
                                ৳{transactions.filter(t => t.userId === user?.id && t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Total Withdrawals:</span>
                              <span className="text-yellow-400 ml-2 font-medium">
                                ৳{transactions.filter(t => t.userId === user?.id && t.type === 'withdrawal' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Games Played:</span>
                              <span className="text-blue-400 ml-2 font-medium">{user?.gamesPlayed || 0}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-slate-500">
                            <div className="text-xs text-gray-400">
                              Account created: {user ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'} • 
                              Last login: {user ? new Date(user.lastLogin).toLocaleDateString() : 'Unknown'} • 
                              Status: <span className={user?.isActive ? 'text-green-400' : 'text-red-400'}>
                                {user?.isActive ? 'Active' : 'Banned'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">User Management</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-500"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Only</option>
                  <option value="banned">Banned Only</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300">User</th>
                    <th className="text-left py-3 px-4 text-gray-300">Balance</th>
                    <th className="text-left py-3 px-4 text-gray-300">Total Deposits</th>
                    <th className="text-left py-3 px-4 text-gray-300">Total Withdrawals</th>
                    <th className="text-left py-3 px-4 text-gray-300">Games</th>
                    <th className="text-left py-3 px-4 text-gray-300">Win Rate</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const userDeposits = transactions.filter(t => t.userId === user.id && t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
                    const userWithdrawals = transactions.filter(t => t.userId === user.id && t.type === 'withdrawal' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
                    const winRate = user.gamesPlayed > 0 ? (user.totalWon / (user.totalWon + user.totalLost)) * 100 : 0;
                    return (
                    <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700">
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-white font-medium">{user.username}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-yellow-400 font-medium">৳{user.balance.toFixed(2)}</td>
                      <td className="py-3 px-4 text-green-400 font-medium">৳{userDeposits.toFixed(2)}</td>
                      <td className="py-3 px-4 text-yellow-400 font-medium">৳{userWithdrawals.toFixed(2)}</td>
                      <td className="py-3 px-4 text-white">{user.gamesPlayed}</td>
                      <td className="py-3 px-4 text-white">{winRate.toFixed(1)}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-500 bg-opacity-20 text-green-400' 
                            : 'bg-red-500 bg-opacity-20 text-red-400'
                        }`}>
                          {user.isActive ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-1 text-gray-400 hover:text-white"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => onUpdateUser(user.id, { isActive: !user.isActive })}
                            className={`p-1 ${
                              user.isActive 
                                ? 'text-red-400 hover:text-red-300' 
                                : 'text-green-400 hover:text-green-300'
                            }`}
                            title={user.isActive ? 'Ban User' : 'Unban User'}
                          >
                            <Ban size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No users found matching your criteria
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">All Transactions</h3>
              <div className="flex items-center space-x-4">
                <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-500">
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits Only</option>
                  <option value="withdrawal">Withdrawals Only</option>
                  <option value="bet">Bets Only</option>
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm">
                  <Download size={16} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-gray-300">User</th>
                    <th className="text-left py-3 px-4 text-gray-300">Type</th>
                    <th className="text-left py-3 px-4 text-gray-300">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-300">Payment Method</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 50).map((transaction) => {
                    const user = users.find(u => u.id === transaction.userId);
                    return (
                      <tr key={transaction.id} className="border-b border-slate-700 hover:bg-slate-700">
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="text-white font-medium">{user?.username || 'Unknown'}</div>
                            <div className="text-gray-400 text-xs">{user?.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'deposit' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                            transaction.type === 'withdrawal' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                            transaction.type === 'bet' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                            transaction.type === 'win' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                            'bg-red-500 bg-opacity-20 text-red-400'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white font-medium">৳{transaction.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-gray-300 text-sm">
                          {transaction.paymentDetails?.method ? (
                            <span className="capitalize">{transaction.paymentDetails.method}</span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                            transaction.status === 'pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                            'bg-red-500 bg-opacity-20 text-red-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-sm max-w-xs truncate">
                          {transaction.paymentDetails?.transactionId && (
                            <div className="font-mono text-xs">ID: {transaction.paymentDetails.transactionId}</div>
                          )}
                          {transaction.paymentDetails?.phoneNumber && (
                            <div className="text-xs">📱 {transaction.paymentDetails.phoneNumber}</div>
                          )}
                          {transaction.description}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
      
      <UserDetailsModal
        isOpen={showUserDetails}
        onClose={() => setShowUserDetails(false)}
        user={selectedUser}
        transactions={transactions}
        onUpdateBalance={onUpdateUserBalance}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
      />
      
      <PaymentSettingsModal
        isOpen={showPaymentSettings}
        onClose={() => setShowPaymentSettings(false)}
        settings={paymentSettings}
        onUpdateSettings={onUpdatePaymentSettings}
      />
    </>
  );
}