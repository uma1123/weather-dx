import { Search } from "lucide-react";
import { useState } from "react";

const weatherData = {
  current: {
    location: "Tokyo, Japan",
    temperature: 22,
    condition: "Sunny",
    description: "晴れ",
    humidity: 60,
    windSpeed: 12,
    pressure: 1013,
    uvIndex: 6,
    visibility: 10,
  },
  weekly: [
    { day: "今日", high: 24, low: 18, condition: "Sunny", description: "晴れ" },
    {
      day: "明日",
      high: 24,
      low: 18,
      condition: "cloudy",
      description: "晴れ",
    },
    {
      day: "水曜日",
      high: 24,
      low: 18,
      condition: "rainy",
      description: "晴れ",
    },
    {
      day: "木曜日",
      high: 24,
      low: 18,
      condition: "snowy",
      description: "晴れ",
    },
    {
      day: "金曜日",
      high: 24,
      low: 18,
      condition: "Sunny",
      description: "晴れ",
    },
    {
      day: "土曜日",
      high: 24,
      low: 18,
      condition: "cloudy",
      description: "晴れ",
    },
    {
      day: "日曜日",
      high: 24,
      low: 18,
      condition: "Sunny",
      description: "晴れ",
    },
  ],
};

const getBackgroundClass = (condition: string) => {
  switch (condition) {
    case "sunny":
      return "bg-gradient-to-br from-blue-400 via-blue-500 to-yellow-400";
    case "cloudy":
      return "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600";
    case "rainy":
      return "bg-gradient-to-br from-gray-700 via-blue-800 to-gray-900";
    case "snowy":
      return "bg-gradient-to-br from-blue-100 via-white to-gray-200";
    default:
      return "bg-gradient-to-br from-blue-400 via-blue-500 to-yellow-400";
  }
};

export default function WeatherApp() {
  const [currentWeather, setCurrenntWeather] = useState(weatherData.current);
  const [weeklyForecast, setWeeklyForecast] = useState(weatherData.weekly);

  const handleSearch = (location: string) => {
    //API呼び出し
    console.log(`Searching weather for ${location}`);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${getBackgroundClass(
        currentWeather.condition
      )}`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header & Search*/}
          <div className="text-center space-y-6">
            <h1>Weather App</h1>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Current Weather */}
          <div className="grid grid-cols-1 lg:grid-colos-3 gap-8">
            <div className="lg:col-span-2">
              <WeatherCard weather={currentWeather} />
            </div>
            <div>
              <WeatherDetails weather={currentWeather} />
            </div>
          </div>
          {/* Weekly Forecast */}
          <WeeklyForeCast weeklyForecast={weeklyForecast} />
        </div>
      </div>
    </div>
  );
}
