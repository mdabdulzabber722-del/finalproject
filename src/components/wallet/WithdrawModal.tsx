import React, { useState } from 'react';
import { X, ArrowUpRight, AlertTriangle, Smartphone, Building2 } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number, paymentMethod: string, paymentDetails: any) => void;
  balance: number;
  isLoading?: boolean;
}

const PAYMENT_METHODS = [
  {
    id: 'nagad',
    name: 'Nagad',
    icon: Smartphone,
    description: 'Withdraw to Nagad mobile wallet',
    color: 'bg-orange-500',
  },
  {
    id: 'bkash',
    name: 'bKash',
    icon: Smartphone,
    description: 'Withdraw to bKash mobile wallet',
    color: 'bg-pink-500',
  },
  {
    id: 'binance',
    name: 'Binance Pay',
    icon: Building2,
    description: 'Withdraw to Binance Pay account',
    color: 'bg-yellow-500',
  },
];

export function WithdrawModal({ isOpen, onClose, onWithdraw, balance, isLoading = false }: WithdrawModalProps) {
  const [amount, setAmount] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState('nagad');
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: '',
    binanceId: '',
  });

  if (!isOpen) return null;

  const maxWithdraw = Math.min(balance, 5000); // Daily limit
  const minWithdraw = 200;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount >= minWithdraw && amount <= maxWithdraw) {
      onWithdraw(amount, paymentMethod, {
        ...paymentDetails,
        method: paymentMethod,
        amount: amount
      });
      setPaymentDetails({ phoneNumber: '', binanceId: '' });
      onClose();
    }
  };

  const selectedMethod = PAYMENT_METHODS.find(method => method.id === paymentMethod);

  const isFormValid = () => {
    if (paymentMethod === 'nagad' || paymentMethod === 'bkash') {
      return paymentDetails.phoneNumber.trim() !== '';
    }
    if (paymentMethod === 'binance') {
      return paymentDetails.binanceId.trim() !== '';
    }
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            setPaymentDetails({ phoneNumber: '', binanceId: '' });
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <ArrowUpRight className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-white">Withdraw Funds</h2>
          <p className="text-gray-400">Available: ৳{balance.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Withdrawal Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">৳</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(minWithdraw, Math.min(maxWithdraw, Number(e.target.value))))}
                className="w-full pl-8 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                min={minWithdraw}
                max={maxWithdraw}
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Min: ৳{minWithdraw}, Max: ৳{maxWithdraw} (daily limit)
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setAmount(Math.min(balance * 0.25, maxWithdraw))}
              className="w-full py-2 px-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm"
              disabled={isLoading}
            >
              25% (৳{Math.min(balance * 0.25, maxWithdraw).toFixed(2)})
            </button>
            <button
              type="button"
              onClick={() => setAmount(Math.min(balance * 0.5, maxWithdraw))}
              className="w-full py-2 px-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm"
              disabled={isLoading}
            >
              50% (৳{Math.min(balance * 0.5, maxWithdraw).toFixed(2)})
            </button>
            <button
              type="button"
              onClick={() => setAmount(Math.min(balance, maxWithdraw))}
              className="w-full py-2 px-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm"
              disabled={isLoading}
            >
              Max (৳{Math.min(balance, maxWithdraw).toFixed(2)})
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Withdrawal Method
            </label>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <label 
                    key={method.id} 
                    className={`flex items-center p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors ${
                      paymentMethod === method.id ? 'ring-2 ring-yellow-500' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                      disabled={isLoading}
                    />
                    <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center mr-3`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{method.name}</div>
                      <div className="text-gray-400 text-sm">{method.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            {(paymentMethod === 'nagad' || paymentMethod === 'bkash') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {paymentMethod === 'nagad' ? 'Nagad' : 'bKash'} Number *
                </label>
                <input
                  type="text"
                  value={paymentDetails.phoneNumber}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder={`01XXXXXXXXX (Your ${paymentMethod === 'nagad' ? 'Nagad' : 'bKash'} number)`}
                  className={`w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none ${
                    paymentMethod === 'nagad' ? 'focus:border-orange-500' : 'focus:border-pink-500'
                  }`}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  📱 This is where you want to receive the money (will be shown to admin)
                </p>
              </div>
            )}

            {paymentMethod === 'binance' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Binance Pay ID *
                </label>
                <input
                  type="text"
                  value={paymentDetails.binanceId}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, binanceId: e.target.value }))}
                  placeholder="your_binance_username (Your Binance Pay ID)"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  🏦 Your Binance Pay ID for receiving payments (will be shown to admin)
                </p>
              </div>
            )}
          </div>

          <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="text-yellow-400 mt-0.5" size={16} />
              <div className="text-yellow-400 text-sm">
                <p className="font-medium mb-1">Withdrawal Policy</p>
                <ul className="text-xs space-y-1">
                  <li>• All withdrawals require admin approval</li>
                  <li>• Processing time: 1-3 business days after approval</li>
                  <li>• Funds are deducted immediately and refunded if rejected</li>
                  <li>• Ensure your payment details are correct</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={
              isLoading || 
              amount < minWithdraw || 
              amount > maxWithdraw || 
              amount > balance ||
              !isFormValid()
            }
            className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : `Withdraw ৳${amount} via ${selectedMethod?.name}`}
          </button>
        </form>
      </div>
    </div>
  );
}