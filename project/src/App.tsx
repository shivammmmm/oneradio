import { useState, useEffect } from 'react';
import Globe from './components/Globe';
import AudioPlayer from './components/AudioPlayer';
import LoadingScreen from './components/LoadingScreen';
import SearchBar from './components/SearchBar';
import { RadioStation } from './types';
import { fetchRadioStations } from './services/radioApi';

function App() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<RadioStation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStations() {
      const data = await fetchRadioStations(); // Default limit (Hybrid)
      setStations(data);
      setLoading(false);
    }
    loadStations();
  }, []);

  const handleStationSelect = (station: RadioStation) => {
    setSelectedStation(station);
  };

  // ⏭️ PLAY NEXT STATION LOGIC
  const handleNext = () => {
    if (!selectedStation || stations.length === 0) return;
    const currentIndex = stations.findIndex(s => s.stationuuid === selectedStation.stationuuid);
    const nextIndex = (currentIndex + 1) % stations.length; // Loop back to start
    setSelectedStation(stations[nextIndex]);
  };

  // ⏮️ PLAY PREVIOUS STATION LOGIC
  const handlePrev = () => {
    if (!selectedStation || stations.length === 0) return;
    const currentIndex = stations.findIndex(s => s.stationuuid === selectedStation.stationuuid);
    const prevIndex = (currentIndex - 1 + stations.length) % stations.length; // Loop back to end
    setSelectedStation(stations[prevIndex]);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      <div className="absolute top-0 left-0 z-50 p-4">
        <SearchBar stations={stations} onStationSelect={handleStationSelect} />
      </div>

      <div className="absolute inset-0 z-0">
        <Globe stations={stations} onStationSelect={handleStationSelect} selectedStation={selectedStation} />
      </div>

      <AudioPlayer
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
        onNext={handleNext} // 👈 Pass Next Function
        onPrev={handlePrev} // 👈 Pass Prev Function
      />

      <div className="fixed bottom-4 right-4 z-30 text-xs text-white/50 bg-black/40 backdrop-blur-md px-3 py-2 rounded-lg hidden md:block border border-white/10 pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}

export default App;