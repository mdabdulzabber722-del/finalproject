import React, { useState } from 'react';
import { MessageCircle, ExternalLink, HelpCircle, Clock, Users } from 'lucide-react';

export function SupportSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <HelpCircle className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Support</h3>
            <p className="text-gray-400 text-sm">Get help when you need it</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-slate-700">
          {/* Telegram Support */}
          <a
            href="https://t.me/aviatorfast1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="text-white" size={20} />
              </div>
              <div>
                <div className="text-white font-medium">Telegram Support</div>
                <div className="text-gray-400 text-sm">@aviatorfast1</div>
              </div>
            </div>
            <ExternalLink className="text-gray-400 group-hover:text-white" size={16} />
          </a>

          {/* Support Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="text-green-400" size={14} />
                <span className="text-gray-300 text-sm">Response Time</span>
              </div>
              <div className="text-white font-medium">5-15 minutes</div>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Users className="text-blue-400" size={14} />
                <span className="text-gray-300 text-sm">Available</span>
              </div>
              <div className="text-white font-medium">24/7</div>
            </div>
          </div>

          {/* Quick Help */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Quick Help</h4>
            <div className="space-y-2 text-sm">
              <div className="text-gray-300">• Deposit/Withdrawal issues</div>
              <div className="text-gray-300">• Game technical problems</div>
              <div className="text-gray-300">• Account verification</div>
              <div className="text-gray-300">• Payment method support</div>
            </div>
          </div>
        </div>
      )}

      {/* Always visible quick contact */}
      {!isExpanded && (
        <a
          href="https://t.me/aviatorfast1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <MessageCircle size={16} />
          <span>Contact Support</span>
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}