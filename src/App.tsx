import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { CircleAlert, Loader2, MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CurrentWeather } from '@/components/CurrentWeather'
import { DailyForecast, HourlyForecast } from '@/components/Forecast'
import { cn } from '@/lib/utils'
import { geocode, getForecast, nextHours, type Forecast, type Place } from '@/lib/weather'
import { describe, gradient } from '@/lib/weather-codes'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'notfound'; query: string }
  | { status: 'ok'; place: Place; forecast: Forecast }

export default function App() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState<State>({ status: 'loading' })
  const lastRequest = useRef(0)

  const load = useCallback(async (name: string) => {
    const id = ++lastRequest.current
    setState({ status: 'loading' })
    let next: State
    try {
      const place = await geocode(name)
      next = place
        ? { status: 'ok', place, forecast: await getForecast(place.latitude, place.longitude) }
        : { status: 'notfound', query: name }
    } catch (e) {
      next = { status: 'error', message: e instanceof Error ? e.message : 'Erreur inconnue.' }
    }
    if (id === lastRequest.current) setState(next)
  }, [])

  useEffect(() => {
    load('Paris')
  }, [load])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const name = query.trim()
    if (name) load(name)
  }

  const background =
    state.status === 'ok'
      ? gradient(describe(state.forecast.current.weather_code).category, state.forecast.current.is_day === 1)
      : 'bg-linear-to-br from-slate-500 to-slate-800'

  return (
    <div className={cn('min-h-screen text-white', background)}>
      <main className="mx-auto flex max-w-3xl flex-col gap-6 p-4 sm:p-8">
        <form role="search" onSubmit={onSubmit} className="flex gap-2">
          <Input
            aria-label="Ville"
            placeholder="Rechercher une ville"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-white/30 bg-white/20 text-white placeholder:text-white/70"
          />
          <Button type="submit" variant="secondary" disabled={state.status === 'loading'}>
            <Search />
            Rechercher
          </Button>
        </form>
        {state.status === 'loading' && (
          <p role="status" className="flex items-center justify-center gap-2 py-12 text-lg">
            <Loader2 className="animate-spin" />
            Chargement…
          </p>
        )}
        {state.status === 'notfound' && (
          <p role="alert" className="flex items-center justify-center gap-2 py-12 text-lg">
            <MapPin />
            Ville introuvable : {state.query}
          </p>
        )}
        {state.status === 'error' && (
          <p role="alert" className="flex items-center justify-center gap-2 py-12 text-lg">
            <CircleAlert />
            {state.message}
          </p>
        )}
        {state.status === 'ok' && (
          <>
            <CurrentWeather place={state.place} current={state.forecast.current} />
            <HourlyForecast hours={nextHours(state.forecast)} />
            <DailyForecast daily={state.forecast.daily} />
          </>
        )}
      </main>
    </div>
  )
}
