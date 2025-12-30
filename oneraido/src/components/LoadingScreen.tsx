import { Radio } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50 animate-pulse" />
          <Radio className="w-16 h-16 text-purple-400 animate-pulse relative" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">One Radio</h2>
        <p className="text-purple-300">Loading radio stations from around the world...</p>
        <div className="mt-6 flex justify-center gap-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
