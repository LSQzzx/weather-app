import React from 'react';
import { WeatherData } from '@/types/weather';
import Card from '../ui/Card';
import { formatTime, getWeatherIcon } from '@/lib/weather';

interface HourlyForecastProps {
  data: WeatherData;
}

// 格式化显示数值
const formatDisplayNumber = (value: number): string => {
  return value.toFixed(1);
};

export default function HourlyForecast({ data }: HourlyForecastProps) {
  // 获取未来24小时的数据
  // const currentHour = new Date().getHours();
  const next24Hours = data.hourly.time
    .map((time, index) => ({
      time,
      temperature: data.hourly.temperature2m[index],
      apparentTemperature: data.hourly.apparentTemperature[index],
      weatherCode: data.hourly.weatherCode[index],
      isDay: data.hourly.isDay[index]
    }))
    .filter(item => {
      // 过滤出当前时间之后的24小时
      return item.time.getTime() >= Date.now();
    })
    .slice(0, 24);
  
  return (
    <Card title="24小时预报" className="mb-6">
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-2 min-w-max">
          {next24Hours.map((hourData) => (
            <div key={hourData.time.getTime()} className="flex flex-col items-center w-16">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(hourData.time)}
              </div>
              <div className="my-2 text-xl">
                {getWeatherIcon(hourData.weatherCode, hourData.isDay)}
              </div>
              <div className="text-sm font-medium">{formatDisplayNumber(hourData.temperature)}°</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                体感 {formatDisplayNumber(hourData.apparentTemperature)}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}