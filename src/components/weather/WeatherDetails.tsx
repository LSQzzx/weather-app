import React from 'react';
import { WeatherData } from '@/types/weather';
import Card from '../ui/Card';
import { formatTime, getWindDirection } from '@/lib/weather';

interface WeatherDetailsProps {
  data: WeatherData;
}

// 格式化显示数值
const formatDisplayNumber = (value: number): string => {
  return value.toFixed(1);
};

// 格式化时间，如 "2小时15分钟"
const formatDuration = (minutes: number): string => {
  // 先将分钟数转为整数
  const totalMinutes = Math.round(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours}小时${mins}分钟`;
  } else if (hours > 0) {
    return `${hours}小时`;
  } else {
    return `${mins}分钟`;
  }
};

export default function WeatherDetails({ data }: WeatherDetailsProps) {
  const current = data.current;
  // 使用正确的索引获取今天的数据
  const todayIndex = 1; // 因为第一个是昨天
  
  const sunrise = data.daily.sunrise?.[todayIndex];
  const sunset = data.daily.sunset?.[todayIndex];
  const daylightDuration = data.daily.daylightDuration?.[todayIndex];
  const windDirection = data.daily.windDirection10mDominant?.[todayIndex]; // 获取风向数据
  
  return (
    <Card title="详细信息" className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">湿度</div>
          <div className="text-xl font-medium mt-1">
            {formatDisplayNumber(current.relativeHumidity2m)}%
          </div>
        </div>
        
        <div className="p-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">气压</div>
          <div className="text-xl font-medium mt-1">
            {formatDisplayNumber(current.pressureMsl)} hPa
          </div>
        </div>
        
        <div className="p-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">云量</div>
          <div className="text-xl font-medium mt-1">
            {formatDisplayNumber(current.cloudCover)}%
          </div>
        </div>
        
        <div className="p-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">风速</div>
          <div className="text-xl font-medium mt-1">
            {formatDisplayNumber(current.windSpeed10m)} km/h
          </div>
        </div>
        
        <div className="p-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">阵风</div>
          <div className="text-xl font-medium mt-1">
            {formatDisplayNumber(current.windGusts10m)} km/h
          </div>
        </div>
        
        <div className="p-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">能见度</div>
          <div className="text-xl font-medium mt-1">
            {formatDisplayNumber(data.hourly.visibility[0])} m
          </div>
        </div>
        
        <div className="p-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">风向</div>
          <div className="text-xl font-medium mt-1">
            {windDirection !== undefined ? getWindDirection(windDirection) : "未知"}
          </div>
        </div>
        
        {sunrise && sunset && (
          <div className="p-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">日出/日落</div>
            <div className="text-sm font-medium mt-1">
              {formatTime(sunrise)} / {formatTime(sunset)}
            </div>
          </div>
        )}
        
        {daylightDuration !== undefined && (
          <div className="p-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">日照时长</div>
            <div className="text-sm font-medium mt-1">
              {formatDuration(Math.round(daylightDuration / 60))} {/* 转换为整数分钟 */}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}