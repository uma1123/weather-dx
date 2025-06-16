"use client";

import { Droplet, Eye, Gauge, Wind } from "lucide-react";
import React from "react";
import { Card } from "./ui/card";
interface WeatherDetailsProps {
  weather: {
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
  };
}

function WeatherDetails({ weather }: WeatherDetailsProps) {
  //詳細情報を配列で定義
  const details = [
    {
      icon: <Droplet className="h-6 w-6" />,
      label: "湿度",
      value: `${weather.humidity}%`,
    },
    {
      icon: <Wind className="h-6 w-6" />,
      label: "風速",
      value: `${weather.windSpeed}m/s`,
    },
    {
      icon: <Gauge className="h-6 w-6" />,
      label: "気圧",
      value: `${weather.pressure}hPa`,
    },
    {
      icon: <Eye className="h-6 w-6" />,
      label: "視差",
      value: `${weather.visibility}km`,
    },
  ];
  return (
    <Card className="p-6 bg-white/20 backdrop-blur-md border-0 shadow-2xl text-white h-full">
      <h3 className="text-xl font-semibold mb-6">詳細情報</h3>
      <div className="space-y-4">
        {details.map((detail, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white/10 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="text-white/80">{detail.icon}</div>
              <p className="text-white/80">{detail.label}</p>
              <p className="text-white/80 font-semibold">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default WeatherDetails;
