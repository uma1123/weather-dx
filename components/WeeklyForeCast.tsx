"use client";
import {
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudRain,
  Droplets,
  Snowflake,
  Sun,
} from "lucide-react";
import React, { useState } from "react";
import { Card } from "./ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface WeeklyForecastProps {
  weeklyForecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    description: string;
    houlryForecast: Array<{
      time: string;
      condition: string;
      temperature: number;
      description: string;
      humidity: number;
    }>;
  }>;
}

//天気アイコン取得
const getWeatherIcon = (condition: string) => {
  const normalized = condition.toLowerCase();

  switch (normalized) {
    case "clear":
      return <Sun className="h-25 w-25 text-white/80" />;
    case "clouds":
      return <Cloud className="h-25 w-25 text-white/80" />;
    case "rain":
      return <CloudRain className="h-25 w-25 text-white/80" />;
    case "snow":
      return <Snowflake className="h-25 w-25 text-white/80" />;
    default:
      return <Sun className="h-25 w-25 text-white/80" />;
  }
};

function WeeklyForeCast({ weeklyForecast }: WeeklyForecastProps) {
  const [hourDetailsForecast, setHourDetailsForecast] = useState<number[]>([]);

  //時間ごとの天気予報をトグルする関数
  //indexは週のインデックスを表す
  const toggleDay = (index: number) => {
    //もしすでにhourDetailsForecastにindexが含まれている場合は削除し、含まれていない場合は追加する
    if (hourDetailsForecast.includes(index)) {
      setHourDetailsForecast(hourDetailsForecast.filter((i) => i !== index));
    } else {
      setHourDetailsForecast([...hourDetailsForecast, index]);
    }
  };

  return (
    <Card className="p-6 bg-white/20 backdrop-blur-md border-0 shadow-2xl text-white">
      <h3 className="text-2xl font-semibold mb-6">
        5日間の天気予報(3時間ごと)
      </h3>
      <div className="space-y-4">
        {weeklyForecast.map((day, index) => (
          <Collapsible key={index} open={hourDetailsForecast.includes(index)}>
            <div className="bg-white/10 rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full p-4 hover:ng-white/20 transition-all text-white justify-between"
                  onClick={() => toggleDay(index)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-20 text-left">
                      <span className="font-medium">{day.day}</span>
                    </div>
                    <div className="flex justify-center w-12">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm text-white/80">
                        {day.description}
                      </span>
                    </div>
                    <div className="flex space-x-4 text-right">
                      <span className="text-lg font-semibold">
                        {day.high}° / {day.low}°
                      </span>
                    </div>
                  </div>
                  {hourDetailsForecast.includes(index) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-4 pb-4">
                  <ScrollArea className="w-full">
                    <div className="flex space-x-3 pb-4 mt-3">
                      {day.houlryForecast.map((hour, hourIndex) => (
                        <div
                          key={hourIndex}
                          className="flex-shrink-0 bg-white/10 rounded-lg p-3 text-center min-w-[100px]"
                        >
                          <div className="space-y-2">
                            <p className="text-sm font-medium">{hour.time}</p>
                            <div className="flex justify-center">
                              {getWeatherIcon(hour.condition)}
                            </div>
                            <p className="text-xs text-white/70">
                              {hour.description}
                            </p>
                            <p className="font-bold">{hour.temperature}°</p>

                            <div className="space-y-1 text-xs text-white/60">
                              <div className="flex items-center justify-center space-x-1">
                                <Droplets className="h-3 w-3" />
                                <span>{hour.humidity}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </Card>
  );
}

export default WeeklyForeCast;
