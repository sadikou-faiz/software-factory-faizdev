import { describe as group, expect, it, vi } from 'vitest'
import { geocode, getForecast, nextHours } from '@/lib/weather'
import { describe, gradient } from '@/lib/weather-codes'
import { jsonResponse, makeForecast } from './fixtures'

function stubFetch(response: Response) {
  const fetchMock = vi.fn<(url: string) => Promise<Response>>(async () => response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const calledUrl = (fetchMock: ReturnType<typeof stubFetch>) => new URL(fetchMock.mock.calls[0][0])

group('geocode', () => {
  it('T1: appelle le géocodage et renvoie nom, pays, lat, lon', async () => {
    const fetchMock = stubFetch(
      jsonResponse({ results: [{ name: 'Paris', country: 'France', latitude: 48.85, longitude: 2.35 }] }),
    )
    await expect(geocode('Paris')).resolves.toEqual({
      name: 'Paris',
      country: 'France',
      latitude: 48.85,
      longitude: 2.35,
    })
    const url = calledUrl(fetchMock)
    expect(url.origin + url.pathname).toBe('https://geocoding-api.open-meteo.com/v1/search')
    expect(url.searchParams.get('name')).toBe('Paris')
    expect(url.searchParams.get('count')).toBe('1')
    expect(url.searchParams.get('language')).toBe('fr')
  })

  it('T2: renvoie null quand results est absent ou vide', async () => {
    stubFetch(jsonResponse({ generationtime_ms: 0.1 }))
    await expect(geocode('Xyz')).resolves.toBeNull()
    stubFetch(jsonResponse({ results: [] }))
    await expect(geocode('Xyz')).resolves.toBeNull()
  })

  it('T3: encode les caractères spéciaux', async () => {
    const fetchMock = stubFetch(jsonResponse({}))
    await geocode('Saint-Étienne du Rouvray&x')
    const raw = fetchMock.mock.calls[0][0]
    expect(raw).toContain('name=Saint-%C3%89tienne%20du%20Rouvray%26x&')
    expect(calledUrl(fetchMock).searchParams.get('name')).toBe('Saint-Étienne du Rouvray&x')
  })
})

group('getForecast', () => {
  it('T4: appelle les prévisions avec current, hourly, daily, timezone=auto et renvoie les données', async () => {
    const forecast = makeForecast()
    const fetchMock = stubFetch(jsonResponse(forecast))
    await expect(getForecast(48.85, 2.35)).resolves.toEqual(forecast)
    const url = calledUrl(fetchMock)
    expect(url.origin + url.pathname).toBe('https://api.open-meteo.com/v1/forecast')
    expect(url.searchParams.get('latitude')).toBe('48.85')
    expect(url.searchParams.get('longitude')).toBe('2.35')
    expect(url.searchParams.get('current')).toContain('temperature_2m')
    expect(url.searchParams.get('hourly')).toContain('weather_code')
    expect(url.searchParams.get('daily')).toContain('temperature_2m_max')
    expect(url.searchParams.get('timezone')).toBe('auto')
  })

  it('T5: lève une erreur si la réponse HTTP n est pas ok', async () => {
    stubFetch(jsonResponse({ error: true }, 500))
    await expect(getForecast(0, 0)).rejects.toThrow('HTTP 500')
  })

  it('T6: lève une erreur si la réponse est mal formée', async () => {
    const missing = makeForecast() as unknown as { current: Record<string, unknown> }
    delete missing.current.temperature_2m
    stubFetch(jsonResponse(missing))
    await expect(getForecast(0, 0)).rejects.toThrow('Réponse invalide')

    const uneven = makeForecast()
    uneven.daily.temperature_2m_min.pop()
    stubFetch(jsonResponse(uneven))
    await expect(getForecast(0, 0)).rejects.toThrow('Réponse invalide')
  })
})

group('nextHours', () => {
  it('T7: 12 créneaux à partir de l heure courante, moins en fin de données', () => {
    const hours = nextHours(makeForecast('2026-11-24T10:15'))
    expect(hours).toHaveLength(12)
    expect(hours[0]).toEqual({ time: '2026-11-24T10:00', temperature: 10, weatherCode: 0, isDay: true })
    expect(hours[11].time).toBe('2026-11-24T21:00')

    const late = nextHours(makeForecast('2026-11-24T20:45'))
    expect(late.map((h) => h.time.slice(11))).toEqual(['20:00', '21:00', '22:00', '23:00'])
  })
})

group('weather-codes', () => {
  it('T8: libellés et catégories des codes WMO, valeur par défaut pour un code inconnu', () => {
    const cases: [number, string, string][] = [
      [0, 'Ciel dégagé', 'clear'],
      [3, 'Couvert', 'cloudy'],
      [45, 'Brouillard', 'fog'],
      [61, 'Pluie faible', 'rain'],
      [71, 'Neige faible', 'snow'],
      [95, 'Orage', 'storm'],
    ]
    for (const [code, label, category] of cases) {
      expect(describe(code)).toMatchObject({ label, category })
    }
    expect(describe(42).label).toBe('Conditions inconnues')
  })

  it('T9: le dégradé diffère entre jour et nuit', () => {
    for (const category of ['clear', 'cloudy', 'fog', 'rain', 'snow', 'storm'] as const) {
      expect(gradient(category, true)).not.toBe(gradient(category, false))
    }
  })
})
