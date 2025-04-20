import React from 'react';
import { WeatherData } from '@/types/weather';
import Card from '../ui/Card';
import { formatTime } from '@/lib/weather';

interface PrecipitationForecastProps {
  data: WeatherData;
}

// 格式化显示数值
const formatDisplayNumber = (value: number): string => {
  return value.toFixed(1);
};

export default function PrecipitationForecast({ data }: PrecipitationForecastProps) {
  // 只获取未来3小时的降水数据
  const currentTime = new Date().getTime();
  const next3Hours = data.minutely15.time
    .map((time, index) => ({
      time,
      precipitation: data.minutely15.precipitation[index],
      rain: data.minutely15.rain[index],
      snowfall: data.minutely15.snowfall[index]
    }))
    .filter(item => item.time.getTime() >= currentTime)
    .slice(0, 12); // 取近3小时（15分钟×12=180分钟）
  
  // 检查是否有降水
  const hasPrecipitation = next3Hours.some(item => item.precipitation > 0);
  
  return (
    <Card title="短时降水预报" className="mb-6">
      {hasPrecipitation ? (
        <div className="overflow-x-auto">
          <div className="flex space-x-4 min-w-max pb-2">
            {next3Hours.map((item) => (
              <div key={item.time.getTime()} className="flex flex-col items-center w-14">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(item.time)}
                </div>
                <div className="my-2">
                  {item.precipitation > 3 ? '🌧️' : 
                   item.precipitation > 0.5 ? '🌦️' : 
                   item.snowfall > 0.5 ? '❄️' : '🌤️'}
                </div>
                <div className="text-sm font-medium">
                  {formatDisplayNumber(item.precipitation)} mm
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p>未来3小时内无降水</p>
        </div>
      )}
    </Card>
  );
}