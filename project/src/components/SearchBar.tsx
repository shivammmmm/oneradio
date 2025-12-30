import { useState } from 'react';
import { Search, MapPin, Radio } from 'lucide-react';
import { RadioStation } from '../types';

interface SearchBarProps {
  stations: RadioStation[];
  onStationSelect: (station: RadioStation) => void;
}

export default function SearchBar({ stations, onStationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RadioStation[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setQuery(e.target.value);
    
    if (value.length > 1) {
      const filtered = stations.filter(s => 
        // Search by Name, Country, or State (City often falls under these)
        s.name.toLowerCase().includes(value) || 
        s.country.toLowerCase().includes(value) ||
        (s.state && s.state.toLowerCase().includes(value)) ||
        (s.tags && s.tags.includes(value))
      ).slice(0, 8); // Show top 8 results
      
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[100] w-80 font-sans">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl 
                     bg-black/80 backdrop-blur-md text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-green-500 shadow-2xl transition-all"
          placeholder="Search city, station..."
          value={query}
          onChange={handleSearch}
          onFocus={() => { if(query.length > 1) setIsOpen(true); }}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto">
          {results.map((station) => (
            <button
              key={station.stationuuid}
              onClick={() => {
                onStationSelect(station);
                setIsOpen(false);
                setQuery('');
              }}
              className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 group-hover:bg-green-500 transition-colors">
                <Radio className="w-4 h-4 text-green-400 group-hover:text-black" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white truncate group-hover:text-green-400 transition-colors">{station.name}</div>
                <div className="text-xs text-gray-400 truncate flex items-center gap-1">
                  <MapPin size={10} />
                  {station.state ? `${station.state}, ` : ''}{station.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}