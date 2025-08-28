import React from 'react';
import { Plane, Zap, User, LogOut, Settings } from 'lucide-react';
import { User as UserType } from '../types/auth';

interface HeaderProps {
  user: UserType | null;
  onShowAuth: () => void;
  onLogout: () => void;
  onShowAdmin?: () => void;
}

export function Header({ user, onShowAuth, onLogout, onShowAdmin }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
            <Plane className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AviatorCasino</h1>
            <div className="text-gray-400 text-sm">Crash Game Platform</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-yellow-400">
                <Zap size={16} />
                <span className="text-sm font-medium">Live</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-white font-medium">{user.username}</div>
                  <div className="text-yellow-400 text-sm">৳{user.balance.toFixed(2)}</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {user.isAdmin && onShowAdmin && (
                    <button
                      onClick={onShowAdmin}
                      className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      title="Admin Panel"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  
                  <button
                    onClick={onLogout}
                    className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-yellow-400">
                <Zap size={16} />
                <span className="text-sm font-medium">Live</span>
              </div>
              
              <button
                onClick={onShowAuth}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
              >
                <User size={16} />
                <span>Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}