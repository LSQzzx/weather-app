import React from 'react';
import { WeatherData } from '@/types/weather';
import Card from '../ui/Card';

interface AirConditionsProps {
  data: WeatherData;
}

// 格式化显示数值
const formatDisplayNumber = (value: number): string => {
  return value.toFixed(1);
};

export default function AirConditions({ data }: AirConditionsProps) {
  // 获取当前小时的数据
  const currentHourIndex = 0; // 假设第一个小时数据是当前小时
  
  const dewPoint = data.hourly.dewPoint2m[currentHourIndex];
  const cloudCoverLow = data.hourly.cloudCoverLow[currentHourIndex];
  const cloudCoverMid = data.hourly.cloudCoverMid[currentHourIndex];
  const cloudCoverHigh = data.hourly.cloudCoverHigh[currentHourIndex];
  
  return (
    <Card title="空气状况" className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">露点温度</div>
          <div className="text-xl font-medium mt-1">
            {formatDisplayNumber(dewPoint)}°C
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {dewPoint > 20 ? '闷热' : dewPoint > 10 ? '湿润' : '干燥'}
          </div>
        </div>
        
        <div className="p-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">低云量</div>
          <div className="text-xl font-medium mt-1">
            {formatDisplayNumber(cloudCoverLow)}%
          </div>
        </div>
        
        <div className="p-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">中云量</div>
          <div className="text-xl font-medium mt-1">
            {formatDisplayNumber(cloudCoverMid)}%
          </div>
        </div>
        
        <div className="p-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">高云量</div>
          <div className="text-xl font-medium mt-1">
            {formatDisplayNumber(cloudCoverHigh)}%
          </div>
        </div>
      </div>
    </Card>
  );
}