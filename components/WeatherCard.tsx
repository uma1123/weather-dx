import { Cloud, CloudRain, Snowflake, Sun } from "lucide-react";
import React from "react";
import { Card } from "./ui/card";

interface WeatherCardProps {
  weather: {
    location: string;
    temperature: number;
    condition: string;
    description: string;
  };
}

const getSeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny":
      return <Sun className="h-24 w-24 text-yellow-500" />;
    case "cloudy":
      return <Cloud className="h-24 w-24 text-gray-500" />;
    case "rainy":
      return <CloudRain className="h-24 w-24 text-blue-500" />;
    case "snowy":
      return <Snowflake className="h-24 w-24 text-white" />;
    default:
      return <Sun className="h-24 w-24 text-yellow-500" />;
  }
};

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <Card className="p-8 bg-white/20 backdrop-blur-md border-0 shadow-2xl text-white">
      <div className="text-center space-y-6">
        {/* Weather Icon */}
        <div className="flex items-center justify-center">
          {getSeatherIcon(weather.condition)}
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
