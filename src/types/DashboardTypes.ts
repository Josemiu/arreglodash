export type OpenMeteoResponse = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
  current_units: {
    temperature_2m: string;
    apparent_temperature: string;
    wind_speed_10m: string;
    relative_humidity_2m: string;
  };
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    wind_speed_10m: number[]; 
  };
};
export interface CityCoordinates {
    latitude: number;
    longitude: number;
    timezone: string;
}

export interface City extends CityCoordinates {
    name: string; 
}