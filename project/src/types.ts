export interface RadioStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  tags: string;
  votes: number;
  codec: string;
  bitrate: number;
  clickcount: number;
  clicktrend: number;
  geo_lat: number;
  geo_long: number;
}

export interface GlobeMarker {
  lat: number;
  lng: number;
  size: number;
  color: string;
  station: RadioStation;
}
