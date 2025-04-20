export interface WeatherData {
  current: {
    time: Date;
    temperature2m: number;
    relativeHumidity2m: number;
    apparentTemperature: number;
    isDay: number;
    windSpeed10m: number;
    windDirection10m: number;
    windGusts10m: number;
    rain: number;
    precipitation: number;
    showers: number;
    snowfall: number;
    cloudCover: number;
    pressureMsl: number;
    surfacePressure: number;
  };
  minutely15: {
    time: Date[];
    precipitation: Float32Array;
    rain: Float32Array;
    snowfall: Float32Array;
  };
  hourly: {
    time: Date[];
    temperature2m: Float32Array;
    relativeHumidity2m: Float32Array;
    dewPoint2m: Float32Array;
    apparentTemperature: Float32Array;
    precipitation: Float32Array;
    rain: Float32Array;
    showers: Float32Array;
    snowfall: Float32Array;
    snowDepth: Float32Array;
    pressureMsl: Float32Array;
    surfacePressure: Float32Array;
    cloudCover: Float32Array;
    cloudCoverLow: Float32Array;
    cloudCoverMid: Float32Array;
    cloudCoverHigh: Float32Array;
    visibility: Float32Array;
    windSpeed10m: Float32Array;
    windDirection10m: Float32Array;
    windGusts10m: Float32Array;
    isDay: Float32Array;
    lightningPotential: Float32Array;
    sunshineDuration: Float32Array;
  };
  daily: {
    time: Date[];
    temperature2mMax: Float32Array;
    temperature2mMin: Float32Array;
    apparentTemperatureMax: Float32Array;
    apparentTemperatureMin: Float32Array;
    windSpeed10mMax: Float32Array;
    windGusts10mMax: Float32Array;
    windDirection10mDominant: Float32Array;
    sunrise: Date[];
    sunset: Date[];
    daylightDuration: Float32Array;
    sunshineDuration: Float32Array;
    rainSum: Float32Array;
    showersSum: Float32Array;
    snowfallSum: Float32Array;
    precipitationSum: Float32Array;
    precipitationHours: Float32Array;
    precipitationProbabilityMax: Float32Array;
  };
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
    timezoneAbbreviation: string;
    utcOffsetSeconds: number;
  };
}

export interface WeatherParams {
  latitude: number;
  longitude: number;
  daily?: string[];
  hourly?: string[];
  models?: string;
  current?: string[];
  minutely_15?: string[];
  timezone?: string;
  past_days?: number;
  timeformat?: string;
  forecast_days?: number;
}