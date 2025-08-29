import React, { useEffect, useRef } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { RoundHistoryBar } from './RoundHistoryBar';
import { GameRound } from '../types/game';

interface GameChartProps {
  multiplier: number;
  status: 'waiting' | 'flying' | 'crashed';
  history: GameRound[];
  showHistory: boolean;
  onToggleHistory: () => void;
}

export function GameChart({ multiplier, status, history, showHistory, onToggleHistory }: GameChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<{ x: number; y: number; multiplier: number }[]>([]);

  useEffect(() => {
    if (status === 'waiting') {
      pointsRef.current = [];
    } else if (status === 'flying') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = pointsRef.current.length * 3;
      const y = rect.height - (multiplier - 1) * 50;
      
      pointsRef.current.push({ x, y: Math.max(0, y), multiplier });
      
      // Keep only last 200 points for performance
      if (pointsRef.current.length > 200) {
        pointsRef.current = pointsRef.current.slice(-200);
      }
    }
  }, [multiplier, status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw grid
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i <= 10; i++) {
      const y = (rect.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let i = 0; i <= 20; i++) {
      const x = (rect.width / 20) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }

    // Draw multiplier line
    if (pointsRef.current.length > 1) {
      ctx.strokeStyle = status === 'crashed' ? '#EF4444' : '#10B981';
      ctx.lineWidth = 4;
      ctx.beginPath();
      
      const firstPoint = pointsRef.current[0];
      ctx.moveTo(firstPoint.x, firstPoint.y);
      
      for (let i = 1; i < pointsRef.current.length; i++) {
        const point = pointsRef.current[i];
        ctx.lineTo(point.x, point.y);
      }
      
      ctx.stroke();
      
      // Add glow effect
      ctx.shadowColor = status === 'crashed' ? '#EF4444' : '#10B981';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw status indicators
    if (status === 'flying' && pointsRef.current.length > 0) {
      const lastPoint = pointsRef.current[pointsRef.current.length - 1];
      // Draw plane indicator
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 6, 0, 2 * Math.PI);
      ctx.fill();
    }
  });

  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden">
      <RoundHistoryBar
        isOpen={showHistory}
        onClose={onToggleHistory}
        history={history}
      />
      
      {/* Three-dot menu button */}
      <button
        onClick={onToggleHistory}
        className="absolute top-4 right-4 z-30 p-2 bg-slate-800 bg-opacity-80 hover:bg-slate-700 rounded-lg transition-colors"
        title="Round History"
      >
        <MoreHorizontal className="text-white" size={20} />
      </button>
      
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {status === 'waiting' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">✈️ Ready for Takeoff!</div>
            <div className="text-lg text-gray-400">All players place your bets now...</div>
            <div className="mt-4">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      )}
      
      {status === 'crashed' && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20">
          <div className="text-center">
            <div className="text-6xl font-bold text-red-500 mb-2 animate-bounce">💥 CRASHED!</div>
            <div className="text-2xl text-white font-bold">at {multiplier.toFixed(2)}x</div>
            <div className="text-sm text-gray-300 mt-2">Next flight starting soon...</div>
          </div>
        </div>
      )}
    </div>
  );
}