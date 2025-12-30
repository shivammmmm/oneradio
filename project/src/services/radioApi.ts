import { RadioStation } from '../types';

// Use 'all' alias for better reliability on live sites
const API_BASE_URL = 'https://all.api.radio-browser.info/json/stations/search';

export async function fetchRadioStations(limit: number = 4000): Promise<RadioStation[]> {
  try {
    // Required header to prevent being blocked as a bot
    const headers = {
      'User-Agent': 'RadioWorldwideApp/1.0 (https://radioworldwide.in; admin@radioworldwide.in)'
    };

    // 1️⃣ INDIA: Multiple requests to get 1500+ Indian stations
    const indiaPromises = [
      fetch(`${API_BASE_URL}?countrycode=IN&limit=500&hidebroken=true&order=clickcount&reverse=true`, { headers }),
      fetch(`${API_BASE_URL}?countrycode=IN&limit=500&hidebroken=true&order=votes&reverse=true`, { headers }),
      fetch(`${API_BASE_URL}?countrycode=IN&limit=500&hidebroken=true`, { headers }),
    ];

    // 2️⃣ WORLD: Top stations worldwide
    const worldPromise = fetch(
      `${API_BASE_URL}?limit=${limit}&hidebroken=true&order=clickcount&reverse=true`,
      { headers }
    );

    const indiaResponses = await Promise.all(indiaPromises);
    const worldRes = await worldPromise;
    
    const indiaDataArray = await Promise.all(indiaResponses.map(r => r.json()));
    const worldData = await worldRes.json();

    const allStations = [
      ...indiaDataArray[0],
      ...indiaDataArray[1],
      ...indiaDataArray[2],
      ...worldData
    ];

    // 3️⃣ DEDUPLICATE: Remove duplicates
    const uniqueStations = Array.from(new Map(allStations.map(s => [s.stationuuid, s])).values());

    const filtered = uniqueStations.filter(
      station =>
        station.geo_lat !== null &&
        station.geo_long !== null &&
        station.url_resolved &&
        station.url_resolved.startsWith('http')
    );

    return filtered;
  } catch (error) {
    console.error('Error fetching radio stations:', error);
    return [];
  }
}