/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, User, Cpu, Hash } from 'lucide-react';

type Player = 'X' | 'O' | null;

export default function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });

  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (squares.every((square) => square !== null)) {
      return { winner: 'Draw' as const, line: null };
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (winner || board[i]) return;

    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === 'X') setScores((s) => ({ ...s, X: s.X + 1 }));
      else if (result.winner === 'O') setScores((s) => ({ ...s, O: s.O + 1 }));
      else setScores((s) => ({ ...s, Draws: s.Draws + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, Draws: 0 });
    resetGame();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-4 selection:bg-cyan-500/30">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-black tracking-tighter mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          TIC TAC TOE
        </h1>
        <p className="text-slate-400 font-medium tracking-widest text-xs uppercase">Neon Edition</p>
      </motion.div>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-md">
        <ScoreCard label="Player X" value={scores.X} active={isXNext && !winner} color="cyan" />
        <ScoreCard label="Draws" value={scores.Draws} active={false} color="slate" />
        <ScoreCard label="Player O" value={scores.O} active={!isXNext && !winner} color="blue" />
      </div>

      {/* Game Board */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative grid grid-cols-3 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-2xl">
          {board.map((square, i) => (
            <Square
              key={i}
              value={square}
              onClick={() => handleClick(i)}
              isWinningSquare={winningLine?.includes(i) ?? false}
              disabled={!!winner}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-12 flex gap-4">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg group"
        >
          <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
          RESET BOARD
        </button>
        <button
          onClick={resetScores}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg text-slate-500 hover:text-slate-300"
        >
          CLEAR SCORES
        </button>
      </div>

      {/* Winner Overlay */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center max-w-xs w-full">
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${winner === 'Draw' ? 'text-slate-400' : winner === 'X' ? 'text-cyan-400' : 'text-blue-400'}`} />
              <h2 className="text-3xl font-black mb-2">
                {winner === 'Draw' ? "IT'S A DRAW!" : `PLAYER ${winner} WINS!`}
              </h2>
              <p className="text-slate-400 mb-6 font-medium">Great game! Ready for another round?</p>
              <button
                onClick={resetGame}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-black text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all active:scale-95"
              >
                PLAY AGAIN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreCard({ label, value, active, color }: { label: string; value: number; active: boolean; color: 'cyan' | 'blue' | 'slate' }) {
  const colors = {
    cyan: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/5',
    blue: 'border-blue-500/50 text-blue-400 bg-blue-500/5',
    slate: 'border-slate-700 text-slate-400 bg-slate-800/50',
  };

  return (
    <div className={`relative p-4 rounded-xl border transition-all duration-500 ${colors[color]} ${active ? 'ring-2 ring-offset-2 ring-offset-slate-950 ring-cyan-500/50 scale-105' : 'opacity-60'}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black">{value}</p>
      {active && (
        <motion.div
          layoutId="active-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current"
        />
      )}
    </div>
  );
}

function Square({ value, onClick, isWinningSquare, disabled }: { value: Player; onClick: () => void; isWinningSquare: boolean; disabled: boolean; key?: React.Key }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center text-4xl sm:text-5xl font-black transition-all duration-200
        ${!value && !disabled ? 'hover:bg-slate-800/50 cursor-pointer' : 'cursor-default'}
        ${isWinningSquare ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-slate-800/30 border border-slate-700/50'}
      `}
    >
      <AnimatePresence mode="wait">
        {value === 'X' && (
          <motion.span
            key="X"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
          >
            X
          </motion.span>
        )}
        {value === 'O' && (
          <motion.span
            key="O"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
          >
            O
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
