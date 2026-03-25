import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Cyberpunk Echoes",
    artist: "AI Synth-01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/cyberpunk/400/400"
  },
  {
    id: 2,
    title: "Neon Pulse",
    artist: "AI Synth-02",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon/400/400"
  },
  {
    id: 3,
    title: "Synthwave Dreams",
    artist: "AI Synth-03",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/synthwave/400/400"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md bg-slate-900/80 rounded-3xl border border-magenta-500/30 p-6 shadow-[0_0_30px_rgba(217,70,239,0.1)] backdrop-blur-md">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex flex-col gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-20 h-20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(217,70,239,0.3)]"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex gap-1 items-end h-6">
                  {[1, 2, 3, 4].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 24, 8] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      className="w-1 bg-magenta-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-magenta-400 truncate tracking-tight">{currentTrack.title}</h3>
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">{currentTrack.artist}</p>
          </div>
          
          <div className="p-2 rounded-full bg-magenta-500/10 border border-magenta-500/20">
            <Music className="w-5 h-5 text-magenta-400" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden cursor-pointer group relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-magenta-600 to-magenta-400 shadow-[0_0_10px_#d946ef]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
            <span>Live Sync</span>
            <span>Audio Stream v1.0</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button className="p-2 text-slate-400 hover:text-magenta-400 transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={prevTrack}
              className="p-2 text-slate-300 hover:text-magenta-400 transition-all active:scale-90"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-magenta-500 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(217,70,239,0.6)] hover:bg-magenta-400 transition-all active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            
            <button 
              onClick={nextTrack}
              className="p-2 text-slate-300 hover:text-magenta-400 transition-all active:scale-90"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>
    </div>
  );
};
