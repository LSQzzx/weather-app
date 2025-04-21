import React from 'react';
import { WeatherData } from '@/types/weather';
import Card from '../ui/Card';
import { formatTime, getWeatherIcon, getWeatherDescription, getWindDirection } from '@/lib/weather';

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: string;
}

const formatDisplayNumber = (value: number): string => {
  return value.toFixed(1);
};

export default function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const current = data.current;
  const icon = getWeatherIcon(current.weatherCode, current.isDay);
  const weatherDesc = getWeatherDescription(current.weatherCode);
  
  return (
    <Card className="mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}，数据更新时间：
            {formatTime(current.time)}
            <br />
            {locationName || `${data.location.latitude.toFixed(3)}°N, ${data.location.longitude.toFixed(3)}°E`}
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold mt-1">
            {formatDisplayNumber(current.temperature2m)}°C
          </h1>
          <div className="text-lg">
            体感温度: {formatDisplayNumber(current.apparentTemperature)}°C
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-7xl mb-2">{icon}</span>
          <span className="text-xl">{weatherDesc}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-gray-500 dark:text-gray-400">湿度</span>
          <span>{formatDisplayNumber(current.relativeHumidity2m)}%</span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-gray-500 dark:text-gray-400">风速</span>
          <span>{formatDisplayNumber(current.windSpeed10m)} km/h</span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-gray-500 dark:text-gray-400">风向</span>
          <span>{getWindDirection(current.windDirection10m)}</span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-gray-500 dark:text-gray-400">气压</span>
          <span>{formatDisplayNumber(current.pressureMsl)} hPa</span>
        </div>
      </div>
    </Card>
  );
}