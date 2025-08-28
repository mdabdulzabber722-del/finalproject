import React, { useState } from 'react';
import { Users, Copy, Gift, Share2, DollarSign, Target, CheckCircle, Clock } from 'lucide-react';
import { User, ReferralData } from '../types/auth';

interface ReferralPanelProps {
  user: User;
  referrals: ReferralData[];
}

export function ReferralPanel({ user, referrals }: ReferralPanelProps) {
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}?ref=${user.referralCode}`;
  const userReferrals = referrals.filter(r => r.referrerId === user.id);
  const completedReferrals = userReferrals.filter(r => r.bonusPaid);
  const pendingReferrals = userReferrals.filter(r => !r.bonusPaid);

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard?.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Join AviatorCasino',
          text: 'Join me on AviatorCasino and get a welcome bonus!',
          url: referralLink,
        });
      } catch (err) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <Users className="text-white" size={20} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Referral Program</h2>
        <p className="text-gray-400">Invite friends and earn bonuses!</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="text-purple-400" size={16} />
            <span className="text-gray-300 text-sm">Total Referrals</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{userReferrals.length}</div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Gift className="text-green-400" size={16} />
            <span className="text-gray-300 text-sm">Bonus Earned</span>
          </div>
          <div className="text-2xl font-bold text-green-400">৳{user.referralBonusEarned.toFixed(2)}</div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Your Referral Code</h3>
          <div className="text-sm text-gray-400">Share with friends</div>
        </div>
        
        <div className="bg-slate-600 rounded-lg p-3 mb-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 font-mono">{user.referralCode}</div>
            <div className="text-xs text-gray-400 mt-1">Your unique referral code</div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={copyReferralLink}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <Copy size={16} />
            <span>{copied ? 'Copied!' : 'Copy Referral Link'}</span>
          </button>
          
          <button
            onClick={shareReferralLink}
            className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <Share2 size={16} />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-slate-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">How it Works</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
            <div className="text-gray-300">Share your referral code with friends</div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
            <div className="text-gray-300">They sign up using your code</div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
            <div className="text-gray-300">They make their first deposit</div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
            <div className="text-gray-300">After 10x turnover, you get bonus = their deposit amount!</div>
          </div>
        </div>
      </div>

      {/* Active Referrals */}
      {userReferrals.length > 0 && (
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Your Referrals</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {userReferrals.map((referral) => (
              <div key={referral.id} className="bg-slate-600 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">{referral.referredUserEmail}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    referral.bonusPaid 
                      ? 'bg-green-500 bg-opacity-20 text-green-400' 
                      : 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                  }`}>
                    {referral.bonusPaid ? (
                      <div className="flex items-center space-x-1">
                        <CheckCircle size={12} />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>Pending</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-400">First Deposit</div>
                    <div className="text-green-400 font-medium">৳{referral.firstDepositAmount}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Bonus Amount</div>
                    <div className="text-yellow-400 font-medium">৳{referral.bonusAmount}</div>
                  </div>
                </div>
                
                {!referral.bonusPaid && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Turnover Progress</span>
                      <span className="text-blue-400">
                        ৳{Number(referral.currentTurnover || 0).toFixed(2)} / ৳{Number(referral.requiredTurnover || 1).toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-500 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (Number(referral.currentTurnover || 0) / Number(referral.requiredTurnover || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-400 mt-2">
                  Joined: {new Date(referral.createdAt).toLocaleDateString()}
                  {referral.completedAt && (
                    <span> • Completed: {new Date(referral.completedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}