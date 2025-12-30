import { useEffect, useRef, useState, useMemo } from 'react';
import GlobeGL from 'react-globe.gl';
import { Plus, Minus } from 'lucide-react';
import { GlobeMarker, RadioStation } from '../types';

interface GlobeProps {
  stations: RadioStation[];
  onStationSelect: (station: RadioStation) => void;
  selectedStation: RadioStation | null;
}

// 🏛️ City Names (Labels)
const INDIAN_LOCATIONS = [
  { name: "New Delhi", lat: 28.6139, lng: 77.2090, type: "capital" },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, type: "metro" },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, type: "metro" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, type: "metro" },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, type: "metro" },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, type: "metro" },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, type: "city" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, type: "city" },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, type: "city" },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, type: "city" },
  { name: "Indore", lat: 22.7196, lng: 75.8577, type: "city" }, // Added Indore
  { name: "Bhopal", lat: 23.2599, lng: 77.4126, type: "city" },
  { name: "Patna", lat: 25.5941, lng: 85.1376, type: "city" },
  { name: "Srinagar", lat: 34.0837, lng: 74.7973, type: "city" },
  { name: "Goa", lat: 15.2993, lng: 74.1240, type: "state" }
];

export default function Globe({ stations, onStationSelect, selectedStation }: GlobeProps) {
  const globeEl = useRef<any>();
  const [globeReady, setGlobeReady] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Agar stations bahut zyada hain (7000+), toh Flags band karke Dots dikhayenge (Performance)
  const useDots = stations.length > 7000;

  const markers = useMemo(() => stations.map(station => ({
    lat: station.geo_lat,
    lng: station.geo_long,
    size: useDots ? 0.2 : 0.5,
    color: '#00ffcc',
    station
  })), [stations, useDots]);

  useEffect(() => {
    if (globeEl.current && selectedStation) {
      globeEl.current.controls().autoRotate = false;
      globeEl.current.pointOfView(
        { lat: selectedStation.geo_lat, lng: selectedStation.geo_long, altitude: 0.25 },
        2000
      );
    }
  }, [selectedStation]);

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeEl.current && !globeReady) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = true;
      controls.minDistance = 101; 
      controls.maxDistance = 800;
      
      globeEl.current.pointOfView({ lat: 22, lng: 78, altitude: 1.5 }, 0);
      setGlobeReady(true);
    }
  }, [globeReady]);

  const handleManualZoom = (direction: 'in' | 'out') => {
    if (globeEl.current) {
      const currentPos = globeEl.current.pointOfView();
      const newAltitude = direction === 'in' 
        ? Math.max(0.05, currentPos.altitude - 0.4) 
        : Math.min(4.0, currentPos.altitude + 0.4);
      globeEl.current.pointOfView({ altitude: newAltitude }, 500);
    }
  };

  const handleStationClick = (station: RadioStation) => {
    if (globeEl.current) globeEl.current.controls().autoRotate = false;
    onStationSelect(station);
  };

  return (
    <div className="w-full h-full relative group">
      <GlobeGL
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#000005"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // 🔹 SMALLER TEXT LABELS
        labelsData={INDIAN_LOCATIONS}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        // 👇 SIZE UPDATE: 1.5 se ghatakar 0.9 aur 0.6 kar diya
        labelSize={(d: any) => d.type === 'capital' ? 0.7 : 0.4} 
        labelDotRadius={(d: any) => d.type === 'capital' ? 0.25 : 0.15}
        labelColor={() => 'rgba(255, 255, 255, 0.9)'}
        labelResolution={3}
        labelAltitude={0.01}

        // 🔹 DOTS Logic
        pointsData={useDots ? markers : []}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"
        pointResolution={2}
        onPointClick={(d: any) => handleStationClick(d.station)}

        // 🚩 FLAGS Logic
        htmlElementsData={!useDots ? markers : []}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.01}
        htmlElement={(d: any) => {
          const marker = d as GlobeMarker;
          const countryCode = marker.station.countrycode?.toLowerCase() || 'in';
          const flagUrl = `https://flagcdn.com/w20/${countryCode}.png`;

          const el = document.createElement('div');
          el.style.transform = 'translate(-50%, -50%)';
          el.style.width = '12px';
          el.style.height = '8px';
          el.style.borderRadius = '1px';
          el.style.boxShadow = '0 1px 2px rgba(0,0,0,0.9)';
          el.style.cursor = 'pointer';
          el.style.border = '0.5px solid white';
          el.style.pointerEvents = 'auto';
          el.title = marker.station.name;
          
          const img = document.createElement('img');
          img.src = flagUrl;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          el.appendChild(img);

          el.onclick = (e) => {
            e.stopPropagation();
            handleStationClick(marker.station);
          };
          el.ontouchend = (e) => {
            e.stopPropagation();
            handleStationClick(marker.station);
          };

          return el;
        }}

        ringsData={selectedStation ? [selectedStation] : []}
        ringLat="geo_lat"
        ringLng="geo_long"
        ringColor={() => '#00ffcc'}
        ringMaxRadius={6}
        ringPropagationSpeed={3}
        ringRepeatPeriod={800}

        onGlobeClick={() => {
          if(globeEl.current) globeEl.current.controls().autoRotate = false;
        }}
        
        atmosphereColor="#3a228a"
        atmosphereAltitude={0.15}
      />

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-2 z-50">
        <button onClick={() => handleManualZoom('in')} className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 text-white border border-white/20 shadow-lg">
          <Plus size={24} />
        </button>
        <button onClick={() => handleManualZoom('out')} className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 text-white border border-white/20 shadow-lg">
          <Minus size={24} />
        </button>
      </div>
    </div>
  );
}