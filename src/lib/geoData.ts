export interface GeoLocation {
  code: string;
  name: string;
  longitude: number;
  latitude: number;
}

let geoLocations: GeoLocation[] = [];
let isDataLoaded = false;

// 从CSV加载地理数据
export async function loadGeoData(): Promise<GeoLocation[]> {
  if (isDataLoaded) {
    return geoLocations;
  }

  try {
    const response = await fetch('/geo_data.csv'); // 假设CSV文件存储在public目录
    const text = await response.text();
    
    // 解析CSV (需要处理GB2312编码)
    const lines = text.split('\n');
    geoLocations = lines
      .filter(line => line.trim() !== '')
      .map(line => {
        const [code, name, longitudeStr, latitudeStr] = line.split(',');
        return {
          code: code.trim(),
          name: name.trim(),
          longitude: parseFloat(longitudeStr.trim()),
          latitude: parseFloat(latitudeStr.trim())
        };
      })
      .filter(loc => !isNaN(loc.latitude) && !isNaN(loc.longitude)); // 过滤无效数据
    
    isDataLoaded = true;
    return geoLocations;
  } catch (error) {
    console.error('加载地理数据失败:', error);
    return [];
  }
}

// 根据输入文本搜索匹配的地点
export function searchLocations(query: string, limit: number = 10): GeoLocation[] {
  if (!query.trim() || !isDataLoaded) {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // 按照匹配度排序
  return geoLocations
    .filter(location => location.name.toLowerCase().includes(normalizedQuery))
    .sort((a, b) => {
      // 优先完全匹配的结果
      const aStartsWithQuery = a.name.toLowerCase().startsWith(normalizedQuery);
      const bStartsWithQuery = b.name.toLowerCase().startsWith(normalizedQuery);
      
      if (aStartsWithQuery && !bStartsWithQuery) return -1;
      if (!aStartsWithQuery && bStartsWithQuery) return 1;
      
      // 其次按名称长度排序（较短的名称优先，更精确的匹配）
      return a.name.length - b.name.length;
    })
    .slice(0, limit);
}

// 保存位置到本地存储
export function saveLocationToLocalStorage(location: GeoLocation): void {
  try {
    localStorage.setItem('lastLocation', JSON.stringify(location));
  } catch (error) {
    console.error('保存位置到本地存储失败:', error);
  }
}

// 从本地存储获取上次的位置
export function getLastLocationFromLocalStorage(): GeoLocation | null {
  try {
    const stored = localStorage.getItem('lastLocation');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('从本地存储获取位置失败:', error);
    return null;
  }
}

// 保存自动获取的位置到本地存储
export function saveAutoLocationToLocalStorage(latitude: number, longitude: number): void {
  try {
    localStorage.setItem('lastAutoLocation', JSON.stringify({ latitude, longitude }));
  } catch (error) {
    console.error('保存自动位置到本地存储失败:', error);
  }
}

// 从本地存储获取上次自动获取的位置
export function getLastAutoLocationFromLocalStorage(): { latitude: number; longitude: number } | null {
  try {
    const stored = localStorage.getItem('lastAutoLocation');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('从本地存储获取自动位置失败:', error);
    return null;
  }
}