import React, { useEffect, useRef } from 'react';

interface GameChartProps {
  multiplier: number;
  status: 'waiting' | 'flying' | 'crashed';
  history: number[];
}

export function GameChart({ multiplier, status, history }: GameChartProps) {
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
      ctx.lineWidth = 3;
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
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw current multiplier text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${multiplier.toFixed(2)}x`, rect.width / 2, rect.height / 2);
  });

  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {status === 'waiting' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">Ready to Fly!</div>
            <div className="text-lg text-gray-400">Place your bets...</div>
            <div className="mt-4">
              <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      )}
      
      {status === 'crashed' && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20">
          <div className="text-center">
            <div className="text-6xl font-bold text-red-500 mb-2 animate-pulse">CRASHED!</div>
            <div className="text-xl text-white">at {multiplier.toFixed(2)}x</div>
          </div>
        </div>
      )}
    </div>
  );
}