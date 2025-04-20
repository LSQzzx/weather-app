'use client';

import React, { useEffect, useState } from 'react';
import { getWeatherData } from '@/lib/weather';
import { WeatherData } from '@/types/weather';
import useGeolocation from '@/hooks/useGeolocation';
import { loadGeoData, saveLocationToLocalStorage, getLastLocationFromLocalStorage, GeoLocation } from '@/lib/geoData';
import CurrentWeather from '@/components/weather/CurrentWeather';
import HourlyForecast from '@/components/weather/HourlyForecast';
import DailyForecast from '@/components/weather/DailyForecast';
import WeatherDetails from '@/components/weather/WeatherDetails';
import PrecipitationForecast from '@/components/weather/PrecipitationForecast';
import AirConditions from '@/components/weather/AirConditions';
import LocationSearch from '@/components/search/LocationSearch';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { latitude, longitude, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation | null>(null);

  // 初始化时加载地理数据并获取上次保存的位置
  useEffect(() => {
    async function initialize() {
      // 加载地理数据
      await loadGeoData();
      
      // 检查本地存储中是否有上次选择的位置
      const lastLocation = getLastLocationFromLocalStorage();
      if (lastLocation) {
        setSelectedLocation(lastLocation);
        loadWeatherData({
          latitude: lastLocation.latitude,
          longitude: lastLocation.longitude
        });
      } else {
        // 如果没有保存的位置，使用默认位置或地理位置API
        loadWeatherData();
      }
    }
    
    initialize();
  }, []);

  // 当地理位置改变时更新天气数据
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      loadWeatherData({ latitude, longitude });
    }
  }, [latitude, longitude]);

  // 处理请求位置按钮点击
  const handleRequestLocation = () => {
    // 清空选中的位置，这样就会显示坐标而不是城市名
    setSelectedLocation(null);
    // 请求位置
    requestLocation();
  };

  // 处理位置搜索选择
  const handleLocationSelect = (location: GeoLocation) => {
    setSelectedLocation(location);
    saveLocationToLocalStorage(location);
    loadWeatherData({
      latitude: location.latitude,
      longitude: location.longitude
    });
  };

  // 加载天气数据
  async function loadWeatherData(locationParams = {}) {
    try {
      setLoading(true);
      const data = await getWeatherData(locationParams);
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError('无法加载天气数据，请稍后再试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // 获取当前显示位置的名称
  const getDisplayLocationName = () => {
    if (selectedLocation) {
      return selectedLocation.name; // 返回选中城市名
    } else if (latitude && longitude) {
      return `当前位置 (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`; // 明确标明是当前位置
    }
    return "默认位置 (北京)";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-zinc-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌤️</span>
              <h1 className="text-xl font-semibold">Weather</h1>
            </div>
            <button 
              onClick={handleRequestLocation} // 使用新函数
              disabled={geoLoading}
              className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {geoLoading ? "获取中..." : "使用我的位置"}
            </button>
          </div>
          
          <div className="mb-3">
            <LocationSearch onLocationSelect={handleLocationSelect} />
          </div>
          
          <div className="text-sm text-center">
            当前显示: {getDisplayLocationName()}
          </div>
        </div>
        
        {geoError && (
          <div className="max-w-4xl mx-auto px-4 py-2 bg-red-50 dark:bg-red-900/20 text-xs text-red-600 dark:text-red-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {geoError}
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">加载天气数据...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) : weatherData ? (
          <>
            <CurrentWeather data={weatherData} locationName={getDisplayLocationName()} />
            <PrecipitationForecast data={weatherData} />
            <HourlyForecast data={weatherData} />
            <DailyForecast data={weatherData} />
            <AirConditions data={weatherData} />
            <WeatherDetails data={weatherData} />
          </>
        ) : null}
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-6 border-t border-gray-200 dark:border-zinc-800 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>数据来源：OpenMeteo API</p>
        <p>天气模型：DWD Global ICON</p>
        <p>Copyright © 2025 Sp1der</p>
      </footer>
    </div>
  );
}