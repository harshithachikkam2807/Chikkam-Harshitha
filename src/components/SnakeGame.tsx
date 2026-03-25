import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const speed = 150; // ms

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const gameLoop = useCallback((time: number) => {
    if (time - lastUpdateTimeRef.current > speed) {
      moveSnake();
      lastUpdateTimeRef.current = time;
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-slate-900/50 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-sm">
      <div className="flex justify-between w-full items-center">
        <h2 className="text-2xl font-bold text-cyan-400 tracking-widest uppercase italic">Snake Protocol</h2>
        <div className="text-xl font-mono text-magenta-400">
          SCORE: <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{score.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div 
        className="relative bg-slate-950 border-2 border-cyan-500/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)]"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid lines for aesthetic */}
        <div className="absolute inset-0 pointer-events-none opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${segment.x}-${segment.y}-${i}`}
            layoutId={i === 0 ? 'snake-head' : undefined}
            className={`rounded-sm ${i === 0 ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-cyan-600/80'}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-magenta-500 rounded-full shadow-[0_0_15px_#d946ef]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center backdrop-blur-md z-10"
            >
              <h3 className="text-4xl font-black text-red-500 mb-4 tracking-tighter uppercase italic">System Failure</h3>
              <p className="text-cyan-400 mb-6 font-mono">Final Score: {score}</p>
              <button 
                onClick={resetGame}
                className="px-8 py-3 bg-cyan-500 text-slate-950 font-bold rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95"
              >
                REBOOT SYSTEM
              </button>
            </motion.div>
          )}

          {isPaused && !isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center backdrop-blur-sm z-10"
            >
              <button 
                onClick={() => setIsPaused(false)}
                className="group flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 rounded-full border-2 border-cyan-400 flex items-center justify-center group-hover:bg-cyan-400/20 transition-all">
                  <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-cyan-400 border-b-[15px] border-b-transparent ml-2" />
                </div>
                <span className="text-cyan-400 font-mono tracking-[0.3em] uppercase">Ready to Sync?</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-xs font-mono text-slate-400 uppercase tracking-widest">
        <span>[Arrows] Move</span>
        <span>[Space] Pause</span>
      </div>
    </div>
  );
};
