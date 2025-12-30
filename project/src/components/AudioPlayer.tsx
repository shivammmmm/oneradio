import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Clock, SkipBack, SkipForward } from 'lucide-react'; // 👈 Import Icons
import { RadioStation } from '../types';
import { getTimezoneFromCoordinates, formatTimeInTimezone, getTimezoneAbbr } from '../services/timezoneService';

interface AudioPlayerProps {
  station: RadioStation | null;
  onClose: () => void;
  onNext: () => void; // 👈 New Prop
  onPrev: () => void; // 👈 New Prop
}

export default function AudioPlayer({ station, onClose, onNext, onPrev }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
  const [stationTimezone, setStationTimezone] = useState<string>('UTC');
  const [stationTime, setStationTime] = useState<string>('');
  const [timezoneLoading, setTimezoneLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
      // Update station time as well
      if (stationTimezone) {
        setStationTime(formatTimeInTimezone(stationTimezone));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [stationTimezone]);

  useEffect(() => {
    if (station && audioRef.current) {
      setIsLoading(true);
      setError(false);
      
      // Fetch timezone based on station coordinates
      setTimezoneLoading(true);
      getTimezoneFromCoordinates(station.geo_lat, station.geo_long)
        .then((tz) => {
          setStationTimezone(tz);
          setStationTime(formatTimeInTimezone(tz));
          setTimezoneLoading(false);
        })
        .catch(() => {
          setTimezoneLoading(false);
        });

      audioRef.current.src = station.url_resolved;
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(() => {
        setError(true);
        setIsLoading(false);
      });
    }
  }, [station]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setError(false);
        }).catch(() => {
          setError(true);
        });
      }
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  if (!station) return null;

  return (
    <div className="fixed bottom-8 left-8 z-50 w-80 font-sans">
      <audio ref={audioRef} />

      <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none" />

        {/* Header: Live & Time */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-red-400 tracking-wider">LIVE</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock size={12} />
              <span className="text-xs font-mono font-medium">{currentTime}</span>
            </div>
            {stationTime && (
              <div className="flex items-center gap-1.5 text-blue-400">
                <Clock size={10} />
                <span className="text-[10px] font-mono font-medium">
                  {stationTime} {!timezoneLoading && getTimezoneAbbr(stationTimezone)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Station Info & Image */}
        <div className="flex items-start gap-4 mb-6">
           <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0 shadow-lg border border-white/10">
              {station.favicon ? (
                <img src={station.favicon} alt={station.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900"><Radio className="w-8 h-8 text-white/20" /></div>
              )}
           </div>
           <div className="min-w-0 flex-1 pt-1">
              <h3 className="text-lg font-bold text-white truncate leading-tight mb-1">{station.name}</h3>
              <p className="text-xs text-gray-400 font-medium truncate">{station.country}</p>
           </div>
        </div>

        {/* Visualizer */}
        <div className="h-8 flex items-end justify-center gap-1 mb-6 px-2 opacity-80">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ease-in-out ${isPlaying ? 'bg-gradient-to-t from-green-400 to-emerald-600 animate-music-bar' : 'bg-white/10 h-1'}`}
              style={{
                height: isPlaying ? `${Math.max(15, Math.random() * 100)}%` : '4px',
                animationDelay: `${i * 0.05}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>

        {/* 🟢 MAIN CONTROLS (Prev | Play | Next) */}
        <div className="flex items-center justify-between gap-2 mb-4">
          {/* Previous */}
          <button onClick={onPrev} className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
            <SkipBack size={24} fill="currentColor" />
          </button>

          {/* Big Play Button */}
          <button
            onClick={togglePlay}
            disabled={error}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/20 relative overflow-hidden"
          >
            {isLoading ? (
               <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" className="ml-1" />
            )}
          </button>

          {/* Next */}
          <button onClick={onNext} className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
        
        {/* Volume Slider */}
        <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-2">
           <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/40 transition-all accent-white"
            />
        </div>

        {error && (
          <div className="absolute bottom-24 left-0 right-0 text-center">
            <span className="text-[10px] text-red-400 bg-red-900/50 px-2 py-1 rounded-full border border-red-500/20 backdrop-blur-md">
              Stream Unavailable
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes music-bar { 0%, 100% { height: 15%; opacity: 0.5; } 50% { height: 100%; opacity: 1; } }
        .animate-music-bar { animation: music-bar 0.5s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
}