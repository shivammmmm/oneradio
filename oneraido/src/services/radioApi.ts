import { RadioStation } from '../types';

const API_BASE_URL = 'https://de1.api.radio-browser.info/json/stations/search';

export async function fetchRadioStations(limit: number = 4000): Promise<RadioStation[]> {
  try {
    // 1️⃣ INDIA: Saare India stations mangwao (Density ke liye)
    const indiaPromise = fetch(
      `${API_BASE_URL}?countrycode=IN&hidebroken=true`
    );

    // 2️⃣ WORLD: Duniya ke Top stations mangwao (Taaki globe khali na ho)
    const worldPromise = fetch(
      `${API_BASE_URL}?limit=${limit}&hidebroken=true&order=clickcount&reverse=true`
    );

    // Dono ko wait karo
    const [indiaRes, worldRes] = await Promise.all([indiaPromise, worldPromise]);
    
    const indiaData = await indiaRes.json();
    const worldData = await worldRes.json();

    // 3️⃣ MERGE: Dono list ko jodo
    const allStations = [...indiaData, ...worldData];

    // 4️⃣ DEDUPLICATE: Agar koi station do baar aaya hai toh hata do
    const uniqueStations = Array.from(new Map(allStations.map(s => [s.stationuuid, s])).values());

    return uniqueStations.filter(
      station =>
        station.geo_lat !== null &&
        station.geo_long !== null &&
        station.url_resolved &&
        station.url_resolved.startsWith('http')
    );
  } catch (error) {
    console.error('Error fetching radio stations:', error);
    return [];
  }
}