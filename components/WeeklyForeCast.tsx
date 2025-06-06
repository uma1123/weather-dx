"use client";
import { Cloud, CloudRain, Snowflake, Sun } from "lucide-react";
import React from "react";
import { Card } from "./ui/card";

interface WeeklyForecastProps {
  weeklyForecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    description: string;
  }>;
}

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny":
      return <Sun className="h-8 w-8 text-yellow-500" />;
    case "cloudy":
      return <Cloud className="h-8 w-8 text-gray-500" />;
    case "rainy":
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    case "snowy":
      return <Snowflake className="h-8 w-8 text-white" />;
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />;
  }
};
function WeeklyForeCast({ weeklyForecast }: WeeklyForecastProps) {
  return (
    <Card className="p-6 bg-white/20 backdrop-blur-md border-0 shadow-2xl text-white">
      <h3 className="text-2xl font-semibold mb-6">週間天気予報</h3>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weeklyForecast.map((day, index) => (
          <div
            key={index}
            className="text-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
          >
            <div className="space-y-3">
              <p className="font-medium text-sm">{day.day}</p>
              <div className="flex justify-center">
                {getWeatherIcon(day.condition)}
              </div>
              <p className="text-white/80 text-sm">{day.description}</p>
              <p className="font-bold text-lg">
                {day.high}℃/{day.low}℃
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default WeeklyForeCast;
