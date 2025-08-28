import React from 'react';
import { X, User, Mail, Calendar, DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { User as UserType, Transaction } from '../../types/auth';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  transactions: Transaction[];
  onUpdateBalance: (userId: string, amount: number) => void;
  onBanUser: (userId: string) => void;
  onUnbanUser: (userId: string) => void;
}

export function UserDetailsModal({ 
  isOpen, 
  onClose, 
  user, 
  transactions, 
  onUpdateBalance,
  onBanUser,
  onUnbanUser 
}: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  const userTransactions = transactions.filter(t => t.userId === user.id);
  const totalDeposits = userTransactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = userTransactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalBets = userTransactions.filter(t => t.type === 'bet').reduce((sum, t) => sum + t.amount, 0);
  const totalWins = userTransactions.filter(t => t.type === 'win').reduce((sum, t) => sum + t.amount, 0);
  const totalLosses = userTransactions.filter(t => t.type === 'loss').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* User Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-700 rounded-xl p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{user.username}</h3>
                  <p className="text-gray-400">{user.email}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    user.isActive 
                      ? 'bg-green-500 bg-opacity-20 text-green-400' 
                      : 'bg-red-500 bg-opacity-20 text-red-400'
                  }`}>
                    {user.isActive ? 'Active' : 'Banned'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="text-gray-400" size={16} />
                    <span className="text-gray-400 text-sm">Joined</span>
                  </div>
                  <div className="text-white font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="text-gray-400" size={16} />
                    <span className="text-gray-400 text-sm">Last Login</span>
                  </div>
                  <div className="text-white font-medium">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4">Account Balance</h4>
              <div className="text-3xl font-bold text-yellow-400 mb-4">
                ৳{user.balance.toFixed(2)}
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const amount = prompt('Enter amount to add (use negative for deduction):');
                    if (amount && !isNaN(Number(amount))) {
                      onUpdateBalance(user.id, Number(amount));
                    }
                  }}
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                >
                  Adjust Balance
                </button>
                
                {user.isActive ? (
                  <button
                    onClick={() => onBanUser(user.id)}
                    className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                  >
                    Ban User
                  </button>
                ) : (
                  <button
                    onClick={() => onUnbanUser(user.id)}
                    className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                  >
                    Unban User
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="text-green-400" size={16} />
                <span className="text-gray-300 text-sm">Total Deposits</span>
              </div>
              <div className="text-xl font-bold text-green-400">৳{totalDeposits.toFixed(2)}</div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="text-yellow-400" size={16} />
                <span className="text-gray-300 text-sm">Total Withdrawals</span>
              </div>
              <div className="text-xl font-bold text-yellow-400">৳{totalWithdrawals.toFixed(2)}</div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="text-blue-400" size={16} />
                <span className="text-gray-300 text-sm">Total Bets</span>
              </div>
              <div className="text-xl font-bold text-blue-400">৳{totalBets.toFixed(2)}</div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="text-purple-400" size={16} />
                <span className="text-gray-300 text-sm">Games Played</span>
              </div>
              <div className="text-xl font-bold text-purple-400">{user.gamesPlayed}</div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-slate-700 rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-4">Transaction History</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-2 px-3 text-gray-300 text-sm">Date</th>
                    <th className="text-left py-2 px-3 text-gray-300 text-sm">Type</th>
                    <th className="text-left py-2 px-3 text-gray-300 text-sm">Amount</th>
                    <th className="text-left py-2 px-3 text-gray-300 text-sm">Status</th>
                    <th className="text-left py-2 px-3 text-gray-300 text-sm">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {userTransactions.slice(0, 20).map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-600">
                      <td className="py-2 px-3 text-gray-400 text-sm">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2 px-3">
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
                      <td className="py-2 px-3 text-white font-medium">
                        ৳{transaction.amount.toFixed(2)}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                          transaction.status === 'pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                          'bg-red-500 bg-opacity-20 text-red-400'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-300 text-sm">
                        {transaction.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {userTransactions.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No transactions found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}