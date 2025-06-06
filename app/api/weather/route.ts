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

  console.log("API key:", process.env.OPENWEATHER_API_KEY);

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

  // 5日間の予報データ（3時間おき）
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

  // データの整形（1日ごとにまとめる）
  const dailyMap = new Map<
    string,
    {
      temps: number[];
      lows: number[];
      highs: number[];
      conditions: string[];
      descriptions: string[];
    }
  >();

  type ForecastEntry = {
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: { main: string; description: string }[];
  };

  forecastData.list.forEach((entry: ForecastEntry) => {
    const date = new Date(entry.dt * 1000).toLocaleDateString("ja-JP", {
      weekday: "short",
    });
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        temps: [],
        lows: [],
        highs: [],
        conditions: [],
        descriptions: [],
      });
    }
    const d = dailyMap.get(date)!;
    d.temps.push(entry.main.temp);
    d.lows.push(entry.main.temp_min);
    d.highs.push(entry.main.temp_max);
    d.conditions.push(entry.weather[0].main.toLowerCase());
    d.descriptions.push(entry.weather[0].description);
  });

  const dailyForecast = Array.from(dailyMap.entries())
    .slice(0, 5)
    .map(([day, data]) => ({
      day,
      high: Math.round(Math.max(...data.highs)),
      low: Math.round(Math.min(...data.lows)),
      condition: mostFrequent(data.conditions),
      description: mostFrequent(data.descriptions),
    }));

  return NextResponse.json({
    current: {
      location: `${currentData.name}, ${currentData.sys.country}`,
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main.toLowerCase(),
      description: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed.toFixed(1)),
      pressure: Math.round(currentData.main.pressure),
      visibility: Math.round(currentData.visibility / 1000),
    },
    weekly: dailyForecast,
  });
}

// 配列の中で最も頻出する要素を返す関数
function mostFrequent(arr: string[]): string {
  const freq: { [key: string]: number } = {};
  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
  }
  return Object.entries(freq).reduce((a, b) => (a[1] >= b[1] ? a : b))[0];
}
