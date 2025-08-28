import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Smartphone, Building2 } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, paymentMethod: string, paymentDetails: any) => void;
  paymentSettings?: any;
  isLoading?: boolean;
}

const DEPOSIT_PRESETS = [50, 100, 250, 500, 1000, 2500];

const PAYMENT_METHODS = [
  {
    id: 'nagad',
    name: 'Nagad',
    icon: Smartphone,
    description: 'Mobile payment via Nagad',
    processingTime: '2-5 minutes',
    color: 'bg-orange-500',
  },
  {
    id: 'bkash',
    name: 'bKash',
    icon: Smartphone,
    description: 'Mobile payment via bKash',
    processingTime: '2-5 minutes',
    color: 'bg-pink-500',
  },
  {
    id: 'binance',
    name: 'Binance Pay',
    icon: Building2,
    description: 'Cryptocurrency payment via Binance',
    processingTime: '5-15 minutes',
    color: 'bg-yellow-500',
  },
];

export function DepositModal({ isOpen, onClose, onDeposit, paymentSettings, isLoading }: DepositModalProps) {
  const [amount, setAmount] = useState(150);
  const [paymentMethod, setPaymentMethod] = useState('nagad');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: '',
    phoneNumber: '',
    binanceId: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount >= 150 && amount <= 10000) {
      setShowPaymentDetails(true);
    }
  };

  const handleConfirmDeposit = () => {
    onDeposit(amount, paymentMethod, {
      ...paymentDetails,
      method: paymentMethod,
      amount: amount
    });
    setShowPaymentDetails(false);
    setPaymentDetails({ transactionId: '', phoneNumber: '', binanceId: '' });
    onClose();
  };

  const selectedMethod = PAYMENT_METHODS.find(method => method.id === paymentMethod);

  const resetForm = () => {
    setShowPaymentDetails(false);
    setPaymentDetails({ transactionId: '', phoneNumber: '', binanceId: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <DollarSign className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {showPaymentDetails ? 'Payment Details' : 'Deposit Funds'}
          </h2>
          <p className="text-gray-400">Add money to your account</p>
        </div>

        {!showPaymentDetails ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deposit Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">৳</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(10, Math.min(10000, Number(e.target.value))))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  min="150"
                  max="10000"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Minimum: ৳150, Maximum: ৳10,000</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {DEPOSIT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    amount === preset
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  ৳{preset}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Method
              </label>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label 
                      key={method.id} 
                      className={`flex items-center p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors ${
                        paymentMethod === method.id ? 'ring-2 ring-green-500' : ''
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
                        <div className="text-green-400 text-xs">Processing: {method.processingTime}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-3">
              <p className="text-blue-400 text-sm">
                💡 After selecting your payment method, you'll receive payment instructions and need to provide transaction details.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || amount < 10 || amount > 10000}
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : `Continue with ${selectedMethod?.name}`}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-semibold">৳{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Method:</span>
                  <span className="text-white">{selectedMethod?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing Time:</span>
                  <span className="text-green-400">{selectedMethod?.processingTime}</span>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Payment Instructions</h3>
              
              {paymentMethod === 'nagad' && (
                <div className="space-y-4">
                  <div className="bg-orange-500 bg-opacity-20 border border-orange-500 rounded p-3">
                    <p className="text-orange-400 font-semibold mb-2">
                      {paymentSettings?.depositInstructions?.nagad || 'Send money to this Nagad number:'}
                    </p>
                    <div className="text-white font-mono text-lg">
                      {paymentSettings?.nagadNumber || '01712345678'}
                    </div>
                    <p className="text-orange-300 text-sm mt-1">
                      Account Name: {paymentSettings?.nagadAccountName || 'AviatorCasino'}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Nagad Number *
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.phoneNumber}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="01XXXXXXXXX (Your Nagad number)"
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        required
                      />
                      <p className="text-xs text-orange-300 mt-1">
                        📱 This is the number you're sending money FROM (will be shown to admin)
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Transaction ID *
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.transactionId}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, transactionId: e.target.value }))}
                        placeholder="TXN123456789 (Nagad transaction ID)"
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        required
                      />
                      <p className="text-xs text-orange-300 mt-1">
                        🆔 Found in your Nagad transaction history (will be shown to admin)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bkash' && (
                <div className="space-y-4">
                  <div className="bg-pink-500 bg-opacity-20 border border-pink-500 rounded p-3">
                    <p className="text-pink-400 font-semibold mb-2">
                      {paymentSettings?.depositInstructions?.bkash || 'Send money to this bKash number:'}
                    </p>
                    <div className="text-white font-mono text-lg">
                      {paymentSettings?.bkashNumber || '01812345678'}
                    </div>
                    <p className="text-pink-300 text-sm mt-1">
                      Account Name: {paymentSettings?.bkashAccountName || 'AviatorCasino'}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your bKash Number *
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.phoneNumber}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="01XXXXXXXXX (Your bKash number)"
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-pink-500"
                        required
                      />
                      <p className="text-xs text-pink-300 mt-1">
                        📱 This is the number you're sending money FROM (will be shown to admin)
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Transaction ID *
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.transactionId}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, transactionId: e.target.value }))}
                        placeholder="TXN123456789 (bKash transaction ID)"
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-pink-500"
                        required
                      />
                      <p className="text-xs text-pink-300 mt-1">
                        🆔 Found in your bKash transaction history (will be shown to admin)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'binance' && (
                <div className="space-y-4">
                  <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded p-3">
                    <p className="text-yellow-400 font-semibold mb-2">
                      {paymentSettings?.depositInstructions?.binance || 'Send payment to this Binance Pay ID:'}
                    </p>
                    <div className="text-white font-mono text-lg">
                      {paymentSettings?.binanceId || 'aviator_casino_2024'}
                    </div>
                    <p className="text-yellow-300 text-sm mt-1">
                      {paymentSettings?.binanceAccountName || 'Binance Pay Merchant'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Binance ID *
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.binanceId}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, binanceId: e.target.value }))}
                      placeholder="your_binance_username (Your Binance Pay ID)"
                      className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      required
                    />
                    <p className="text-xs text-yellow-300 mt-1">
                      🏦 Your Binance Pay ID for identification (will be shown to admin)
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3">
              <p className="text-red-400 text-sm">
                ⚠️ <strong>Important:</strong> Please complete the payment first, then fill in the required details above. Your deposit will be processed after admin verification.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={resetForm}
                className="flex-1 py-3 px-4 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirmDeposit}
                disabled={
                  (paymentMethod === 'nagad' && (!paymentDetails.phoneNumber || !paymentDetails.transactionId)) ||
                  (paymentMethod === 'bkash' && (!paymentDetails.phoneNumber || !paymentDetails.transactionId)) ||
                  (paymentMethod === 'binance' && !paymentDetails.binanceId)
                }
                className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DepositModal;