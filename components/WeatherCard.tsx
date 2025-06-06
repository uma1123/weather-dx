import { Cloud, CloudRain, Snowflake, Sun } from "lucide-react";
import React from "react";
import { Card } from "./ui/card";

interface WeatherCardProps {
  weather: {
    location: string;
    temperature: number;
    condition: string; // OpenWeatherの "Clear", "Clouds", "Rain", "Snow" など
    description: string;
  };
}

// OpenWeather APIの"main"に基づいたマッピング
const getWeatherIcon = (condition: string) => {
  const normalized = condition.toLowerCase();

  switch (normalized) {
    case "clear":
      return <Sun className="h-24 w-24 text-yellow-500" />;
    case "clouds":
      return <Cloud className="h-24 w-24 text-gray-300" />;
    case "rain":
    case "drizzle":
      return <CloudRain className="h-24 w-24 text-blue-400" />;
    case "snow":
      return <Snowflake className="h-24 w-24 text-white" />;
    default:
      return <Sun className="h-24 w-24 text-yellow-500" />;
  }
};

export default function WeatherCard({ weather }: WeatherCardProps) {
  console.log("condition:", weather.condition);
  return (
    <Card className="p-8 bg-white/20 backdrop-blur-md border-0 shadow-2xl text-white h-full">
      <div className="text-center space-y-6">
        {/* Weather Icon */}
        <div className="flex items-center justify-center">
          {getWeatherIcon(weather.condition)}
        </div>

        {/* Weather Details */}
        <div className="space-y-2">
          <h2 className="text-white text-3xl font-semibold">
            {weather.location}
          </h2>
          <div className="text-6xl font-bold">{weather.temperature}°C</div>
          <p className="text-xl text-white/80">{weather.description}</p>
        </div>

        {/* Date */}
        <div className="text-sm text-white/70">
          {new Date().toLocaleDateString("ja-JP", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </Card>
  );
}
