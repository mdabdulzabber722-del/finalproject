import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { LoginCredentials, RegisterData } from '../../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  onRegister: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export function AuthModal({ isOpen, onClose, onLogin, onRegister, isLoading }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
          disabled={isLoading}
        >
          <X size={16} />
        </button>

        {mode === 'login' ? (
          <LoginForm
            onLogin={onLogin}
            onSwitchToRegister={() => setMode('register')}
            isLoading={isLoading}
          />
        ) : (
          <RegisterForm
            onRegister={onRegister}
            onSwitchToLogin={() => setMode('login')}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}