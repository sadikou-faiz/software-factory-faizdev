import type { Forecast } from '@/lib/weather'

export function makeForecast(currentTime = '2026-11-24T10:15', temperature = 12.4): Forecast {
  const hours = Array.from({ length: 24 }, (_, h) => `2026-11-24T${String(h).padStart(2, '0')}:00`)
  const days = Array.from({ length: 7 }, (_, d) => `2026-11-${24 + d}`)
  return {
    current: {
      time: currentTime,
      temperature_2m: temperature,
      apparent_temperature: 9.6,
      relative_humidity_2m: 81,
      wind_speed_10m: 14.8,
      weather_code: 3,
      is_day: 1,
    },
    hourly: {
      time: hours,
      temperature_2m: hours.map((_, h) => h),
      weather_code: hours.map(() => 0),
      is_day: hours.map((_, h) => (h >= 8 && h < 18 ? 1 : 0)),
    },
    daily: {
      time: days,
      weather_code: days.map(() => 61),
      temperature_2m_max: days.map(() => 14),
      temperature_2m_min: days.map(() => 5),
    },
  }
}

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
