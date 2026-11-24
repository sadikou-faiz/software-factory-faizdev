export interface Place {
  name: string
  country: string
  latitude: number
  longitude: number
}

export interface Forecast {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
    is_day: number
  }
  hourly: { time: string[]; temperature_2m: number[]; weather_code: number[]; is_day: number[] }
  daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[] }
}

export interface Hour {
  time: string
  temperature: number
  weatherCode: number
  isDay: boolean
}

const INVALID = 'Réponse invalide du service météo.'

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

function hasFields(o: unknown, numbers: string[], strings: string[] = []): boolean {
  return (
    isObject(o) && numbers.every((k) => typeof o[k] === 'number') && strings.every((k) => typeof o[k] === 'string')
  )
}

function hasSeries(o: unknown, keys: string[]): boolean {
  if (!isObject(o) || !Array.isArray(o.time) || !o.time.every((t) => typeof t === 'string')) return false
  const length = o.time.length
  return keys.every((k) => {
    const s = o[k]
    return Array.isArray(s) && s.length === length && s.every((n) => typeof n === 'number')
  })
}

async function getJson(url: string): Promise<unknown> {
  let res: Response
  try {
    res = await fetch(url)
  } catch {
    throw new Error('Impossible de joindre le service météo. Vérifiez votre connexion.')
  }
  if (!res.ok) throw new Error(`Le service météo a renvoyé une erreur (HTTP ${res.status}).`)
  try {
    return await res.json()
  } catch {
    throw new Error(INVALID)
  }
}

export async function geocode(name: string): Promise<Place | null> {
  const data = await getJson(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=fr&format=json`,
  )
  if (!isObject(data)) throw new Error(INVALID)
  if (!Array.isArray(data.results) || data.results.length === 0) return null
  const r: unknown = data.results[0]
  if (!hasFields(r, ['latitude', 'longitude'], ['name'])) throw new Error(INVALID)
  const { name: found, country, latitude, longitude } = r as Record<string, unknown>
  return {
    name: found as string,
    country: typeof country === 'string' ? country : '',
    latitude: latitude as number,
    longitude: longitude as number,
  }
}

export async function getForecast(latitude: number, longitude: number): Promise<Forecast> {
  const data = await getJson(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day' +
      '&hourly=temperature_2m,weather_code,is_day' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7',
  )
  const valid =
    isObject(data) &&
    hasFields(
      data.current,
      ['temperature_2m', 'apparent_temperature', 'relative_humidity_2m', 'wind_speed_10m', 'weather_code', 'is_day'],
      ['time'],
    ) &&
    hasSeries(data.hourly, ['temperature_2m', 'weather_code', 'is_day']) &&
    hasSeries(data.daily, ['weather_code', 'temperature_2m_max', 'temperature_2m_min'])
  if (!valid) throw new Error(INVALID)
  return data as unknown as Forecast
}

export function nextHours(forecast: Forecast, count = 12): Hour[] {
  const { hourly, current } = forecast
  // current.time can fall on a quarter hour; ISO local times compare correctly as strings.
  const hourStart = `${current.time.slice(0, 13)}:00`
  const start = hourly.time.findIndex((t) => t >= hourStart)
  if (start === -1) return []
  return hourly.time.slice(start, start + count).map((time, i) => ({
    time,
    temperature: hourly.temperature_2m[start + i],
    weatherCode: hourly.weather_code[start + i],
    isDay: hourly.is_day[start + i] === 1,
  }))
}
