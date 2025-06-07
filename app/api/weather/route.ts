import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  const apiKEY = process.env.OPENWEATHER_API_KEY;

  if (!location || !apiKEY) {
    return NextResponse.json(
      { error: "location is required" },
      { status: 400 }
    );
  }

  // 現在の天気データ
  const currentRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${apiKEY}&units=metric&lang=ja`
  );
  const currentData = await currentRes.json();

  if (!currentRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch current weather" },
      { status: 500 }
    );
  }

  // 5日間の3時間ごとの予報データ
  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      location
    )}&appid=${apiKEY}&units=metric&lang=ja`
  );
  const forecastData = await forecastRes.json();

  if (!forecastRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch forecast" },
      { status: 500 }
    );
  }

  const JST_OFFSET = 9 * 60 * 60 * 1000;

  type ForecastEntry = {
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
    };
    weather: { main: string; description: string }[];
    wind: { speed: number };
    visibility: number;
  };

  // 日別でまとめる
  const dailyMap = new Map<
    string,
    {
      lows: number[];
      highs: number[];
      conditions: string[];
      descriptions: string[];
      hourlyForecast: {
        time: string;
        condition: string;
        temperature: number;
        description: string;
        humidity: number;
      }[];
    }
  >();

  (forecastData.list as ForecastEntry[]).forEach((entry) => {
    const localDate = new Date(entry.dt * 1000 + JST_OFFSET);
    const date = localDate.toLocaleDateString("ja-JP", { weekday: "short" });

    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        lows: [],
        highs: [],
        conditions: [],
        descriptions: [],
        hourlyForecast: [],
      });
    }

    const d = dailyMap.get(date)!;
    d.lows.push(entry.main.temp_min);
    d.highs.push(entry.main.temp_max);
    d.conditions.push(entry.weather[0].main.toLowerCase());
    d.descriptions.push(entry.weather[0].description);
    d.hourlyForecast.push({
      time: localDate.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      condition: entry.weather[0].main.toLowerCase(),
      temperature: Math.round(entry.main.temp),
      description: entry.weather[0].description,
      humidity: entry.main.humidity,
    });
  });

  const dailyForecast = Array.from(dailyMap.entries())
    .slice(0, 5)
    .map(([day, data]) => ({
      day,
      high: Math.round(Math.max(...data.highs)),
      low: Math.round(Math.min(...data.lows)),
      condition: mostFrequent(data.conditions),
      description: mostFrequent(data.descriptions),
      houlryForecast: data.hourlyForecast,
    }));

  // 🟡 todayHourly: 最初のエントリの日付を「今日」とみなす
  const firstForecastDateStr = new Date(
    forecastData.list[0].dt * 1000 + JST_OFFSET
  )
    .toISOString()
    .split("T")[0];

  const todayHourly = (forecastData.list as ForecastEntry[])
    .filter((entry) => {
      const entryDateStr = new Date(entry.dt * 1000 + JST_OFFSET)
        .toISOString()
        .split("T")[0];
      return entryDateStr === firstForecastDateStr;
    })
    .map((entry) => ({
      time: new Date(entry.dt * 1000 + JST_OFFSET).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      condition: entry.weather[0].main.toLowerCase(),
      temperature: Math.round(entry.main.temp),
      description: entry.weather[0].description,
      humidity: entry.main.humidity,
    }));

  return NextResponse.json({
    current: {
      location: `${currentData.name}, ${currentData.sys.country}`,
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main.toLowerCase(),
      description: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed),
      pressure: Math.round(currentData.main.pressure),
      visibility: Math.round(currentData.visibility / 1000),
    },
    weekly: dailyForecast,
    todayHourly,
  });
}

// 最頻値を返す
function mostFrequent(arr: string[]): string {
  const freq: { [key: string]: number } = {};
  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
  }
  return Object.entries(freq).reduce((a, b) => (a[1] >= b[1] ? a : b))[0];
}
