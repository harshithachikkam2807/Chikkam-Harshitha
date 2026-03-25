/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Background Grid & Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_50%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-magenta-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }} 
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 backdrop-blur-md bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic text-white">
                NEON<span className="text-cyan-400">SYNC</span>
              </h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Neural Interface v2.4.0</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Terminal
            </a>
            <a href="#" className="hover:text-magenta-400 transition-colors flex items-center gap-2">
              <Zap className="w-4 h-4" /> Overdrive
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400">SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Sidebar - Stats/Info */}
        <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm"
          >
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">System Status</h3>
            <div className="space-y-4">
              {[
                { label: 'CPU Load', value: '42%', color: 'bg-cyan-500' },
                { label: 'Neural Link', value: 'Stable', color: 'bg-green-500' },
                { label: 'Sync Rate', value: '120Hz', color: 'bg-magenta-500' }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono uppercase">
                    <span className="text-slate-400">{stat.label}</span>
                    <span className="text-white">{stat.value}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: stat.value.includes('%') ? stat.value : '100%' }}
                      className={`h-full ${stat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm"
          >
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Instructions</h3>
            <ul className="space-y-3 text-xs text-slate-400 font-mono leading-relaxed">
              <li className="flex gap-2">
                <span className="text-cyan-400">01</span>
                <span>Use Arrow Keys to navigate the Snake Protocol.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400">02</span>
                <span>Collect Magenta nodes to increase score.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400">03</span>
                <span>Avoid self-collision to maintain neural link.</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Center - Game */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Sidebar - Music */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-8 order-3">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <MusicPlayer />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm"
          >
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">AI Generated Beats</h3>
            <div className="space-y-2">
              {['Cyberpunk Echoes', 'Neon Pulse', 'Synthwave Dreams'].map((track, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500 group-hover:text-magenta-400">
                    0{i + 1}
                  </div>
                  <span className="text-xs font-mono text-slate-300 group-hover:text-white transition-colors">{track}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            © 2026 NEONSYNC PROTOCOL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

