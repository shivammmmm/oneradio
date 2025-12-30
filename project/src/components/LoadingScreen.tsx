import { Radio, Music, Globe } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-green-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="text-center relative z-10 px-6">
        {/* Logo Animation */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-2xl opacity-30 animate-pulse" />
          <div className="relative bg-black p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
            <Radio className="w-20 h-20 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Radio Worldwide
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-400 mb-2">Discover Radio Stations Worldwide</p>
        
        {/* Loading Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
          <Globe size={16} className="animate-spin" />
          <span>Loading 1500+ Indian & World Stations...</span>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-8 border border-white/20">
          <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full animate-loading-bar" />
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-12 text-xs">
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <Music size={16} className="mx-auto mb-2 text-purple-400" />
            <p className="text-gray-400">High Quality</p>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <Globe size={16} className="mx-auto mb-2 text-blue-400" />
            <p className="text-gray-400">Global Coverage</p>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <Radio size={16} className="mx-auto mb-2 text-pink-400" />
            <p className="text-gray-400">Live Streams</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
          }
          50% {
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.8);
          }
          100% {
            width: 100%;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
