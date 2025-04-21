import { fetchWeatherApi } from 'openmeteo';
import { WeatherData, WeatherParams } from '@/types/weather';

const DEFAULT_PARAMS: WeatherParams = {
  latitude: 39.9042,
  longitude: 116.4074,
  daily: [
    "temperature_2m_max", "temperature_2m_min", "apparent_temperature_max", 
    "apparent_temperature_min", "wind_speed_10m_max", "wind_gusts_10m_max", 
    "wind_direction_10m_dominant", "sunrise", "sunset", "daylight_duration", 
    "sunshine_duration", "rain_sum", "showers_sum", "snowfall_sum", 
    "precipitation_sum", "precipitation_hours", "weather_code" // 修改此行，去掉precipitation_probability_max，添加weather_code
  ],
  hourly: [
    "temperature_2m", "relative_humidity_2m", "dew_point_2m", 
    "apparent_temperature", "precipitation", "rain", "showers", 
    "snowfall", "snow_depth", "pressure_msl", "surface_pressure", 
    "cloud_cover", "cloud_cover_low", "cloud_cover_mid", "cloud_cover_high", 
    "visibility", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m", 
    "is_day", "lightning_potential", "sunshine_duration", "weather_code" // 添加weather_code
  ],
  models: "icon_global",
  current: [
    "temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", 
    "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m", "rain", 
    "precipitation", "showers", "snowfall", "cloud_cover", 
    "pressure_msl", "surface_pressure", "weather_code" // 添加weather_code
  ],
  minutely_15: ["precipitation", "rain", "snowfall"],
  timezone: "Asia/Shanghai", // 明确指定为中国时区
  past_days: 1,
  timeformat: "unixtime"
};

// 添加一个格式化数值的辅助函数，保留一位小数
export function formatNumber(value: number): number {
  return Math.round(value * 10) / 10;
}

// 修复时间处理函数，正确处理时区问题
function createLocalDate(timestamp: number): Date {
  // 使用时间戳直接创建本地日期对象，不需要额外添加时区偏移量
  // 因为API已经返回了考虑时区的UTC时间戳
  return new Date(timestamp * 1000);
}

export async function getWeatherData(params: Partial<WeatherParams> = {}): Promise<WeatherData> {
  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const apiParams = { ...DEFAULT_PARAMS, ...params };
    const responses = await fetchWeatherApi(url, apiParams);
    
    // Process first location
    const response = responses[0];
    
    // 获取时区和位置信息
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone() || "Asia/Shanghai";
    const timezoneAbbreviation = response.timezoneAbbreviation() || "CST";
    const latitude = response.latitude();
    const longitude = response.longitude();
    
    // 获取各种天气数据
    const current = response.current()!;
    const minutely15 = response.minutely15()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;
    
    // 日出日落数据
    const sunrise = daily.variables(7)!;
    const sunset = daily.variables(8)!;
    
    // 构建天气数据对象，使用修复的时间处理
    const weatherData: WeatherData = {
      current: {
        time: createLocalDate(Number(current.time())),
        temperature2m: formatNumber(current.variables(0)!.value()),
        relativeHumidity2m: formatNumber(current.variables(1)!.value()),
        apparentTemperature: formatNumber(current.variables(2)!.value()),
        isDay: current.variables(3)!.value(),
        windSpeed10m: formatNumber(current.variables(4)!.value()),
        windDirection10m: formatNumber(current.variables(5)!.value()),
        windGusts10m: formatNumber(current.variables(6)!.value()),
        rain: formatNumber(current.variables(7)!.value()),
        precipitation: formatNumber(current.variables(8)!.value()),
        showers: formatNumber(current.variables(9)!.value()),
        snowfall: formatNumber(current.variables(10)!.value()),
        cloudCover: formatNumber(current.variables(11)!.value()),
        pressureMsl: formatNumber(current.variables(12)!.value()),
        surfacePressure: formatNumber(current.variables(13)!.value()),
        weatherCode: current.variables(14) ? current.variables(14)!.value() : 0, // 添加weatherCode
      },
      minutely15: {
        time: [...Array((Number(minutely15.timeEnd()) - Number(minutely15.time())) / minutely15.interval())].map(
          (_, i) => createLocalDate(Number(minutely15.time()) + i * minutely15.interval())
        ),
        precipitation: formatFloatArray(minutely15.variables(0)!.valuesArray()!),
        rain: formatFloatArray(minutely15.variables(1)!.valuesArray()!),
        snowfall: formatFloatArray(minutely15.variables(2)!.valuesArray()!),
      },
      hourly: {
        time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
          (_, i) => createLocalDate(Number(hourly.time()) + i * hourly.interval())
        ),
        temperature2m: formatFloatArray(hourly.variables(0)!.valuesArray()!),
        relativeHumidity2m: formatFloatArray(hourly.variables(1)!.valuesArray()!),
        dewPoint2m: formatFloatArray(hourly.variables(2)!.valuesArray()!),
        apparentTemperature: formatFloatArray(hourly.variables(3)!.valuesArray()!),
        precipitation: formatFloatArray(hourly.variables(4)!.valuesArray()!),
        rain: formatFloatArray(hourly.variables(5)!.valuesArray()!),
        showers: formatFloatArray(hourly.variables(6)!.valuesArray()!),
        snowfall: formatFloatArray(hourly.variables(7)!.valuesArray()!),
        snowDepth: formatFloatArray(hourly.variables(8)!.valuesArray()!),
        pressureMsl: formatFloatArray(hourly.variables(9)!.valuesArray()!),
        surfacePressure: formatFloatArray(hourly.variables(10)!.valuesArray()!),
        cloudCover: formatFloatArray(hourly.variables(11)!.valuesArray()!),
        cloudCoverLow: formatFloatArray(hourly.variables(12)!.valuesArray()!),
        cloudCoverMid: formatFloatArray(hourly.variables(13)!.valuesArray()!),
        cloudCoverHigh: formatFloatArray(hourly.variables(14)!.valuesArray()!),
        visibility: formatFloatArray(hourly.variables(15)!.valuesArray()!),
        windSpeed10m: formatFloatArray(hourly.variables(16)!.valuesArray()!),
        windDirection10m: formatFloatArray(hourly.variables(17)!.valuesArray()!),
        windGusts10m: formatFloatArray(hourly.variables(18)!.valuesArray()!),
        isDay: hourly.variables(19)!.valuesArray()!,
        lightningPotential: formatFloatArray(hourly.variables(20)!.valuesArray()!),
        sunshineDuration: formatFloatArray(hourly.variables(21)!.valuesArray()!),
        weatherCode: hourly.variables(22) ? formatIntArray(hourly.variables(22)!.valuesArray()!) : new Int32Array(hourly.variables(0)!.valuesArray()!.length).fill(0), // 添加weatherCode
      },
      daily: {
        time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
          (_, i) => createLocalDate(Number(daily.time()) + i * daily.interval())
        ),
        temperature2mMax: formatFloatArray(daily.variables(0)!.valuesArray()!),
        temperature2mMin: formatFloatArray(daily.variables(1)!.valuesArray()!),
        apparentTemperatureMax: formatFloatArray(daily.variables(2)!.valuesArray()!),
        apparentTemperatureMin: formatFloatArray(daily.variables(3)!.valuesArray()!),
        windSpeed10mMax: formatFloatArray(daily.variables(4)!.valuesArray()!),
        windGusts10mMax: formatFloatArray(daily.variables(5)!.valuesArray()!),
        windDirection10mDominant: formatFloatArray(daily.variables(6)!.valuesArray()!),
        sunrise: [...Array(sunrise.valuesInt64Length())].map(
          (_, i) => createLocalDate(Number(sunrise.valuesInt64(i)))
        ),
        sunset: [...Array(sunset.valuesInt64Length())].map(
          (_, i) => createLocalDate(Number(sunset.valuesInt64(i)))
        ),
        daylightDuration: formatFloatArray(daily.variables(9)!.valuesArray()!),
        sunshineDuration: formatFloatArray(daily.variables(10)!.valuesArray()!),
        rainSum: formatFloatArray(daily.variables(11)!.valuesArray()!),
        showersSum: formatFloatArray(daily.variables(12)!.valuesArray()!),
        snowfallSum: formatFloatArray(daily.variables(13)!.valuesArray()!),
        precipitationSum: formatFloatArray(daily.variables(14)!.valuesArray()!),
        precipitationHours: formatFloatArray(daily.variables(15)!.valuesArray()!),
        weatherCode: daily.variables(16) ? formatIntArray(daily.variables(16)!.valuesArray()!) : new Int32Array(daily.variables(0)!.valuesArray()!.length).fill(0), // 替换precipitation_probability_max为weatherCode
      },
      location: {
        latitude,
        longitude,
        timezone,
        timezoneAbbreviation,
        utcOffsetSeconds
      }
    };
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// 格式化Float32Array中的所有数值，保留一位小数
function formatFloatArray(array: Float32Array): Float32Array {
  const result = new Float32Array(array.length);
  for (let i = 0; i < array.length; i++) {
    result[i] = formatNumber(array[i]);
  }
  return result;
}

// 格式化Int32Array
function formatIntArray(array: Float32Array): Int32Array {
  const result = new Int32Array(array.length);
  for (let i = 0; i < array.length; i++) {
    result[i] = Math.round(array[i]);
  }
  return result;
}

// 辅助函数 - 获取风向文字描述
export function getWindDirection(degrees: number): string {
  const directions = ['北', '东北偏北', '东北', '东北偏东', '东', '东南偏东', '东南', '东南偏南', 
                     '南', '西南偏南', '西南', '西南偏西', '西', '西北偏西', '西北', '西北偏北'];
  return directions[Math.round(degrees / 22.5) % 16];
}

// 根据天气代码获取天气描述
export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return "晴朗";
    case 1:
      return "大部晴朗";
    case 2:
      return "局部多云";
    case 3:
      return "阴天";
    case 45:
    case 48:
      return "雾";
    case 51:
      return "小毛毛雨";
    case 53:
      return "毛毛雨";
    case 55:
      return "浓毛毛雨";
    case 56:
    case 57:
      return "冻雨";
    case 61:
      return "小雨";
    case 63:
      return "中雨";
    case 65:
      return "大雨";
    case 66:
    case 67:
      return "冻雨";
    case 71:
      return "小雪";
    case 73:
      return "中雪";
    case 75:
      return "大雪";
    case 77:
      return "雪粒";
    case 80:
      return "小阵雨";
    case 81:
      return "阵雨";
    case 82:
      return "强阵雨";
    case 85:
      return "小阵雪";
    case 86:
      return "强阵雪";
    case 95:
      return "雷暴";
    case 96:
    case 99:
      return "雷暴伴冰雹";
    default:
      return "未知天气";
  }
}

// 根据天气代码和昼夜状态获取天气图标
export function getWeatherIcon(weatherCode: number, isDay: number): string {
  const dayTime = isDay === 1;
  
  switch (weatherCode) {
    case 0: // 晴朗
      return dayTime ? '☀️' : '🌙';
    case 1: // 大部晴朗
      return dayTime ? '🌤️' : '🌙';
    case 2: // 局部多云
      return dayTime ? '⛅' : '☁️';
    case 3: // 阴天
      return '☁️';
    case 45: // 雾
    case 48: // 雾凇
      return '🌫️';
    case 51: // 小毛毛雨
    case 53: // 毛毛雨
    case 55: // 浓毛毛雨
      return dayTime ? '🌦️' : '🌧️';
    case 56: // 冻雨(轻)
    case 57: // 冻雨(重)
      return '🌨️';
    case 61: // 小雨
    case 63: // 中雨
      return dayTime ? '🌦️' : '🌧️';
    case 65: // 大雨
      return '🌧️';
    case 66: // 冻雨(轻)
    case 67: // 冻雨(重)
      return '🌨️';
    case 71: // 小雪
    case 73: // 中雪
    case 75: // 大雪
    case 77: // 雪粒
      return '❄️';
    case 80: // 小阵雨
    case 81: // 阵雨
      return dayTime ? '🌦️' : '🌧️';
    case 82: // 强阵雨
      return '🌧️';
    case 85: // 小阵雪
    case 86: // 强阵雪
      return '🌨️';
    case 95: // 雷暴
    case 96: // 雷暴伴冰雹
    case 99: // 雷暴伴强冰雹
      return '⛈️';
    default:
      return dayTime ? '☀️' : '🌙'; // 默认图标
  }
}

// 辅助函数 - 格式化日期
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

// 辅助函数 - 格式化时间
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}