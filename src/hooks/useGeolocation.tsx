import { useState, useEffect, useCallback } from 'react';
import { saveAutoLocationToLocalStorage, getLastAutoLocationFromLocalStorage } from '@/lib/geoData';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export default function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false
  });

  // 初始化时尝试从本地存储获取上次位置
  useEffect(() => {
    const lastAutoLocation = getLastAutoLocationFromLocalStorage();
    if (lastAutoLocation) {
      setLocation({
        latitude: lastAutoLocation.latitude,
        longitude: lastAutoLocation.longitude,
        error: null,
        loading: false
      });
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: '您的浏览器不支持获取地理位置',
        loading: false
      }));
      return;
    }

    setLocation(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // 保存到本地存储
        saveAutoLocationToLocalStorage(latitude, longitude);
        
        setLocation({
          latitude,
          longitude,
          error: null,
          loading: false
        });
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '位置权限被拒绝';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置信息不可用';
            break;
          case error.TIMEOUT:
            errorMessage = '获取位置超时';
            break;
          default:
            errorMessage = '获取位置时发生错误';
        }
        
        // 尝试使用上次保存的位置
        const lastLocation = getLastAutoLocationFromLocalStorage();
        if (lastLocation) {
          setLocation({
            latitude: lastLocation.latitude,
            longitude: lastLocation.longitude,
            error: `${errorMessage}，使用上次已知位置`,
            loading: false
          });
        } else {
          setLocation(prev => ({
            ...prev,
            error: errorMessage,
            loading: false
          }));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  return { ...location, requestLocation };
}