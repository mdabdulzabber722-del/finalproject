import React, { useState } from 'react';
import { X, Settings, Smartphone, Building2, Save } from 'lucide-react';
import { PaymentSettings } from '../../types/auth';

interface PaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PaymentSettings;
  onUpdateSettings: (settings: PaymentSettings) => void;
}

export function PaymentSettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdateSettings 
}: PaymentSettingsModalProps) {
  const [formData, setFormData] = useState<PaymentSettings>(() => ({
    nagadNumber: settings?.nagadNumber || '01XXXXXXXXX',
    bkashNumber: settings?.bkashNumber || '01XXXXXXXXX',
    binanceId: settings?.binanceId || 'your_binance_username',
    nagadAccountName: settings?.nagadAccountName || 'AviatorCasino',
    bkashAccountName: settings?.bkashAccountName || 'AviatorCasino',
    binanceAccountName: settings?.binanceAccountName || 'AviatorCasino',
    depositInstructions: {
      nagad: settings?.depositInstructions?.nagad || 'Send money to this Nagad number:',
      bkash: settings?.depositInstructions?.bkash || 'Send money to this bKash number:',
      binance: settings?.depositInstructions?.binance || 'Send payment to this Binance Pay ID:'
    }
  }));
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onUpdateSettings(formData);
    setIsSaving(false);
    onClose();
  };

  const handleReset = () => {
    setFormData({
      nagadNumber: settings?.nagadNumber || '01XXXXXXXXX',
      bkashNumber: settings?.bkashNumber || '01XXXXXXXXX',
      binanceId: settings?.binanceId || 'your_binance_username',
      nagadAccountName: settings?.nagadAccountName || 'AviatorCasino',
      bkashAccountName: settings?.bkashAccountName || 'AviatorCasino',
      binanceAccountName: settings?.binanceAccountName || 'AviatorCasino',
      depositInstructions: {
        nagad: settings?.depositInstructions?.nagad || 'Send money to this Nagad number:',
        bkash: settings?.depositInstructions?.bkash || 'Send money to this bKash number:',
        binance: settings?.depositInstructions?.binance || 'Send payment to this Binance Pay ID:'
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Settings className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Payment Settings</h2>
              <p className="text-gray-400">Configure payment account details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isSaving}
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nagad Settings */}
          <div className="bg-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Smartphone className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Nagad Account</h3>
                <p className="text-gray-400 text-sm">Mobile payment account for deposits/withdrawals</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deposit Instruction Text
                </label>
                <input
                  type="text"
                  value={formData.depositInstructions.nagad}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    depositInstructions: { ...prev.depositInstructions, nagad: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="Send money to this Nagad number:"
                  disabled={isSaving}
                />
                <p className="text-xs text-orange-300 mt-1">
                  💬 Custom text shown to users above your Nagad number
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.nagadAccountName}
                  onChange={(e) => setFormData(prev => ({ ...prev, nagadAccountName: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="AviatorCasino"
                  disabled={isSaving}
                />
                <p className="text-xs text-orange-300 mt-1">
                  👤 Account name shown to users (e.g., "Account Name: AviatorCasino")
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nagad Number *
                </label>
                <input
                  type="text"
                  value={formData.nagadNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, nagadNumber: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="01XXXXXXXXX"
                  required
                  disabled={isSaving}
                />
                <p className="text-xs text-orange-300 mt-1">
                  📱 This number will be shown to users for deposits and used for withdrawals
                </p>
              </div>
            </div>
          </div>

          {/* bKash Settings */}
          <div className="bg-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                <Smartphone className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">bKash Account</h3>
                <p className="text-gray-400 text-sm">Mobile payment account for deposits/withdrawals</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deposit Instruction Text
                </label>
                <input
                  type="text"
                  value={formData.depositInstructions.bkash}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    depositInstructions: { ...prev.depositInstructions, bkash: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-pink-500"
                  placeholder="Send money to this bKash number:"
                  disabled={isSaving}
                />
                <p className="text-xs text-pink-300 mt-1">
                  💬 Custom text shown to users above your bKash number
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.bkashAccountName}
                  onChange={(e) => setFormData(prev => ({ ...prev, bkashAccountName: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-pink-500"
                  placeholder="AviatorCasino"
                  disabled={isSaving}
                />
                <p className="text-xs text-pink-300 mt-1">
                  👤 Account name shown to users (e.g., "Account Name: AviatorCasino")
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  bKash Number *
                </label>
                <input
                  type="text"
                  value={formData.bkashNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, bkashNumber: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-pink-500"
                  placeholder="01XXXXXXXXX"
                  required
                  disabled={isSaving}
                />
                <p className="text-xs text-pink-300 mt-1">
                  📱 This number will be shown to users for deposits and used for withdrawals
                </p>
              </div>
            </div>
          </div>

          {/* Binance Settings */}
          <div className="bg-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Building2 className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Binance Pay Account</h3>
                <p className="text-gray-400 text-sm">Cryptocurrency payment account</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deposit Instruction Text
                </label>
                <input
                  type="text"
                  value={formData.depositInstructions.binance}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    depositInstructions: { ...prev.depositInstructions, binance: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Send payment to this Binance Pay ID:"
                  disabled={isSaving}
                />
                <p className="text-xs text-yellow-300 mt-1">
                  💬 Custom text shown to users above your Binance Pay ID
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.binanceAccountName}
                  onChange={(e) => setFormData(prev => ({ ...prev, binanceAccountName: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="AviatorCasino"
                  disabled={isSaving}
                />
                <p className="text-xs text-yellow-300 mt-1">
                  👤 Account name shown to users (e.g., "Binance Pay Merchant")
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Binance Pay ID *
                </label>
                <input
                  type="text"
                  value={formData.binanceId}
                  onChange={(e) => setFormData(prev => ({ ...prev, binanceId: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="your_binance_username"
                  required
                  disabled={isSaving}
                />
                <p className="text-xs text-yellow-300 mt-1">
                  🏦 This ID will be shown to users for deposits and used for withdrawals
                </p>
              </div>
            </div>
          </div>

          {/* Current Settings Preview */}
          <div className="bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">📋 Current Settings Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-gray-300">Nagad:</div>
                <div className="text-orange-400 font-mono">{formData.nagadNumber}</div>
                <div className="text-orange-300 text-xs">{formData.nagadAccountName}</div>
              </div>
              <div>
                <div className="text-gray-300">bKash:</div>
                <div className="text-pink-400 font-mono">{formData.bkashNumber}</div>
                <div className="text-pink-300 text-xs">{formData.bkashAccountName}</div>
              </div>
              <div>
                <div className="text-gray-300">Binance:</div>
                <div className="text-yellow-400 font-mono">{formData.binanceId}</div>
                <div className="text-yellow-300 text-xs">{formData.binanceAccountName}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 px-4 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors"
              disabled={isSaving}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}