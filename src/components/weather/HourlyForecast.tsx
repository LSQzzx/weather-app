import React from 'react';
import { WeatherData } from '@/types/weather';
import Card from '../ui/Card';
import { formatTime, getWeatherIcon } from '@/lib/weather';

interface HourlyForecastProps {
  data: WeatherData;
}

// 添加格式化函数，保持数值在显示时保留一位小数
const formatDisplayNumber = (value: number): string => {
  return value.toFixed(1);
};

export default function HourlyForecast({ data }: HourlyForecastProps) {
  // 只显示未来24小时
  const currentTime = data.current.time.getTime();
  const currentTimeIndex = data.hourly.time.findIndex(
    time => time.getTime() >= currentTime
  );
  
  const nextHours = currentTimeIndex !== -1 
    ? data.hourly.time.slice(currentTimeIndex, currentTimeIndex + 24)
    : data.hourly.time.slice(0, 24);
    
  return (
    <Card title="24小时预报" className="mb-6">
      <div className="overflow-x-auto">
        <div className="flex space-x-6 min-w-max pb-2">
          {nextHours.map((time, i) => {
            const index = currentTimeIndex !== -1 
              ? currentTimeIndex + i 
              : i;
              
            if (index >= data.hourly.time.length) return null;
            
            const cloudCover = data.hourly.cloudCover[index];
            const isDay = data.hourly.isDay[index];
            const precip = data.hourly.precipitation[index];
            const icon = getWeatherIcon(cloudCover, precip, isDay);
            
            return (
              <div key={time.toString()} className="flex flex-col items-center w-14">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {i === 0 ? '现在' : formatTime(time)}
                </div>
                <div className="text-xl my-2">{icon}</div>
                <div className="font-medium">
                  {formatDisplayNumber(data.hourly.temperature2m[index])}°C
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}