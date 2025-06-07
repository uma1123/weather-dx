"use client";

import { Cloud, Sun, CloudRain, Snowflake, Droplets } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HourlyForecastProps {
  forecast: Array<{
    time: string;
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
  }>;
}

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "clear":
      return <Sun className="h-6 w-6 text-white/80" />;
    case "clouds":
      return <Cloud className="h-6 w-6 text-white/80" />;
    case "rain":
      return <CloudRain className="h-6 w-6 text-white/80" />;
    case "snow":
      return <Snowflake className="h-6 w-6 text-white/80" />;
    default:
      return <Sun className="h-6 w-6 text-white/80" />;
  }
};

export default function HourlyForecast({ forecast }: HourlyForecastProps) {
  return (
    <Card className="p-6 bg-white/20 backdrop-blur-md border-0 shadow-2xl text-white w-full">
      <h3 className="text-xl font-semibold mb-4">今日の3時間ごと予報</h3>
      <ScrollArea className="w-full overflow-x-auto">
        <div className="w-full flex justify-center">
          <div className="flex space-x-4 min-w-max">
            {forecast.map((hour, index) => (
              <div
                key={index}
                className="flex-shrink-0 text-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all min-w-[100px] flex flex-col items-center justify-center space-y-2"
              >
                <p className="font-medium text-sm">{hour.time}</p>
                <div className="flex justify-center">
                  {getWeatherIcon(hour.condition)}
                </div>
                <p className="text-xs text-white/70">{hour.description}</p>
                <p className="font-bold text-lg">{hour.temperature}°</p>
                <div className="text-xs text-white/60 flex items-center justify-center space-x-1">
                  <Droplets className="h-3 w-3" />
                  <span>{hour.humidity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
