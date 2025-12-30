/**
 * Get timezone from coordinates using API or fallback
 */
export async function getTimezoneFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://timezone.openmeteo.com/api/timezone?latitude=${latitude}&longitude=${longitude}&current_date=2024-01-01`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.timezone || 'UTC';
    }
  } catch (error) {
    console.warn('Failed to fetch timezone API:', error);
  }

  return estimateTimezoneFromLongitude(longitude);
}

/**
 * Accuracy improvements for Serbia and Pakistan
 */
function estimateTimezoneFromLongitude(longitude: number): string {
  if (longitude >= -180 && longitude < -150) return 'Pacific/Honolulu';
  if (longitude >= -150 && longitude < -120) return 'America/Anchorage';
  if (longitude >= -120 && longitude < -105) return 'America/Los_Angeles';
  if (longitude >= -105 && longitude < -90)  return 'America/Chicago';
  if (longitude >= -90 && longitude < -75)   return 'America/New_York';
  if (longitude >= -75 && longitude < -45)   return 'America/Sao_Paulo';
  if (longitude >= -45 && longitude < -22.5) return 'Atlantic/Azores';
  if (longitude >= -22.5 && longitude < 7.5)  return 'Europe/London';
  if (longitude >= 7.5 && longitude < 30)    return 'Europe/Belgrade'; 
  if (longitude >= 30 && longitude < 45)     return 'Europe/Istanbul';
  if (longitude >= 45 && longitude < 60)     return 'Europe/Moscow';
  if (longitude >= 60 && longitude < 82.5)   return 'Asia/Karachi';  
  if (longitude >= 82.5 && longitude < 97.5) return 'Asia/Kolkata';
  if (longitude >= 97.5 && longitude < 112.5) return 'Asia/Bangkok';
  if (longitude >= 112.5 && longitude < 127.5) return 'Asia/Shanghai';
  if (longitude >= 127.5 && longitude < 142.5) return 'Asia/Tokyo';
  if (longitude >= 142.5 && longitude <= 180)  return 'Australia/Sydney';

  return 'UTC';
}

export function formatTimeInTimezone(timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
      hour12: true,
    });
    return formatter.format(new Date());
  } catch (error) {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}

/**
 * Returns empty string to hide place names (Belgrade, etc.) from the player
 */
export function getTimezoneAbbr(timezone: string): string {
  return ""; 
}