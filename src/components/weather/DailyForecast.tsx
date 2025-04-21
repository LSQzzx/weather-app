import React from 'react';
import { WeatherData } from '@/types/weather';
import Card from '../ui/Card';
import { formatDate, getWeatherIcon, getWeatherDescription } from '@/lib/weather';

interface DailyForecastProps {
  data: WeatherData;
}

// 添加格式化函数，保持数值在显示时保留一位小数
const formatDisplayNumber = (value: number): string => {
  return value.toFixed(1);
};

export default function DailyForecast({ data }: DailyForecastProps) {
  // 确定今天的索引（假定API返回的数据第二个是今天）
  const todayIndex = 1; // 因为第一个是昨天（过去1天）
  
  return (
    <Card title="8天天气预报" className="mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-700">
              <th className="pb-2 text-left">日期</th>
              <th className="pb-2 text-center">天气</th>
              <th className="pb-2 text-right">最高/最低温</th>
            </tr>
          </thead>
          <tbody>
            {data.daily.time.map((time, index) => {
              // 使用天气代码获取图标
              const weatherCode = data.daily.weatherCode[index];
              const icon = getWeatherIcon(weatherCode, 1); // 假设总是白天显示
              const weatherDesc = getWeatherDescription(weatherCode);
              
              return (
                <tr key={time.toString()} className="border-b border-gray-100 dark:border-zinc-700 last:border-0">
                  <td className="py-3">
                    {index === todayIndex - 1 ? '昨天' : 
                     index === todayIndex ? '今天' : 
                     formatDate(time)}
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xl">{icon}</span>
                      <span className="text-xs mt-1">{weatherDesc}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className="font-medium">{formatDisplayNumber(data.daily.temperature2mMax[index])}</span>
                    <span className="text-gray-500 dark:text-gray-400">/{formatDisplayNumber(data.daily.temperature2mMin[index])}°C</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}