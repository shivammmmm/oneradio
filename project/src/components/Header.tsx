import { Radio, Globe as GlobeIcon } from 'lucide-react';

interface HeaderProps {
  stationCount: number;
}

export default function Header({ stationCount }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">One Radio</h1>
              <p className="text-xs text-purple-300">Explore radio stations worldwide</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/30">
            <GlobeIcon className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm font-medium">
              {stationCount.toLocaleString()} stations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
