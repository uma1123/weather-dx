"use client";

import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import WeatherDetails from "@/components/WeatherDetails";
import WeeklyForeCast from "@/components/WeeklyForeCast";
import TodayHourlyForecast from "@/components/TodayHourlyForeCast";
import { useState } from "react";

const getBackgroundClass = (condition: string) => {
  switch (condition) {
    case "clear":
      return "bg-gradient-to-br from-blue-400 via-blue-500 to-yellow-400";
    case "clouds":
      return "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600";
    case "rain":
      return "bg-gradient-to-br from-gray-700 via-blue-800 to-gray-900";
    case "snow":
      return "bg-gradient-to-br from-blue-100 via-white to-gray-200";
    default:
      return "bg-gradient-to-br from-blue-400 via-blue-500 to-yellow-400";
  }
};

// 天気データの型定義
type CurrentWeather = {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
};

// 週間予報の型定義
type WeeklyForecastItem = {
  day: string;
  high: number;
  low: number;
  condition: string;
  description: string;
  houlryForecast: {
    time: string;
    condition: string;
    temperature: number;
    description: string;
    humidity: number;
  }[];
};

export default function WeatherApp() {
  const [currentWeather, setCurrenntWeather] = useState<
    CurrentWeather | undefined
  >();
  const [weeklyForecast, setWeeklyForecast] = useState<
    WeeklyForecastItem[] | undefined
  >();
  const [todayHourly, setTodayHourly] = useState<any[]>([]);

  //天気検索
  const handleSearch = async (location: string) => {
    //API呼び出し
    try {
      const res = await fetch(
        `/api/weather?location=${encodeURIComponent(location)}`
      );
      if (!res.ok) {
        throw new Error("API error");
      }
      const weatherData = await res.json();
      setCurrenntWeather(weatherData.current);
      setWeeklyForecast(weatherData.weekly);
      console.log("todayHourly", weatherData.todayHourly);
      setTodayHourly(weatherData.todayHourly);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
    console.log(`Searching weather for ${location}`);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${getBackgroundClass(
        currentWeather?.condition ?? ""
      )}`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header & Search*/}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-white">Weather App</h1>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* 上段: WeatherCardとWeatherDetailsを横並び */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2">
              {currentWeather && <WeatherCard weather={currentWeather} />}
            </div>
            <div>
              {currentWeather && <WeatherDetails weather={currentWeather} />}
            </div>
          </div>

          {/* 下段: TodayHourlyForecastを横幅いっぱいで */}
          <div>
            {todayHourly.length > 0 && (
              <TodayHourlyForecast forecast={todayHourly} />
            )}
          </div>

          {/* Weekly Forecast */}
          {weeklyForecast && <WeeklyForeCast weeklyForecast={weeklyForecast} />}
        </div>
      </div>
    </div>
  );
}
