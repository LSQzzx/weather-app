import React, { useState, useEffect, useRef } from 'react';
import { GeoLocation, searchLocations, loadGeoData } from '@/lib/geoData';

interface LocationSearchProps {
  onLocationSelect: (location: GeoLocation) => void;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  
  // 加载地理位置数据
  useEffect(() => {
    async function initGeoData() {
      setIsLoading(true);
      await loadGeoData();
      setIsDataReady(true);
      setIsLoading(false);
    }
    
    initGeoData();
  }, []);
  
  // 监听点击事件，点击外部时关闭建议列表
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 当用户输入时更新建议
  useEffect(() => {
    if (query && isDataReady) {
      const results = searchLocations(query);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [query, isDataReady]);
  
  // 处理选择建议
  const handleSuggestionClick = (location: GeoLocation) => {
    setQuery(location.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationSelect(location);
  };
  
  return (
    <div ref={searchRef} className="relative w-full max-w-xs">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="搜索城市..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          disabled={!isDataReady || isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((location) => (
            <li
              key={location.code}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
              onClick={() => handleSuggestionClick(location)}
            >
              {location.name}
            </li>
          ))}
        </ul>
      )}
      
      {showSuggestions && query && suggestions.length === 0 && isDataReady && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-md shadow-lg p-4 text-center text-gray-500 dark:text-gray-400">
          未找到匹配的城市
        </div>
      )}
    </div>
  );
}