import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { describe } from '@/lib/weather-codes'
import type { Forecast, Hour } from '@/lib/weather'

export const CARD =
  'border-white/40 bg-white/80 text-slate-900 backdrop-blur dark:border-white/15 dark:bg-slate-950/40 dark:text-white'
export const MUTED = 'text-slate-600 dark:text-white/80'
const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' })

export function HourlyForecast({ hours }: { hours: Hour[] }) {
  return (
    <Card className={CARD}>
      <CardHeader>
        <CardTitle>Prochaines heures</CardTitle>
      </CardHeader>
      <CardContent>
        <ul aria-label="Prévisions horaires" className="flex gap-3 overflow-x-auto pb-2">
          {hours.map((h) => {
            const { label, Icon } = describe(h.weatherCode)
            return (
              <li key={h.time} className="flex min-w-16 flex-col items-center gap-2 rounded-lg bg-slate-900/5 p-3 dark:bg-white/10">
                <span className={`text-sm ${MUTED}`}>{h.time.slice(11, 16)}</span>
                <Icon className="size-7" aria-label={label} />
                <span className="font-medium">{Math.round(h.temperature)}°</span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

export function DailyForecast({ daily }: { daily: Forecast['daily'] }) {
  return (
    <Card className={CARD}>
      <CardHeader>
        <CardTitle>7 jours</CardTitle>
      </CardHeader>
      <CardContent>
        <ul aria-label="Prévisions sur 7 jours" className="divide-y divide-slate-900/10 dark:divide-white/15">
          {daily.time.map((date, i) => {
            const { label, Icon } = describe(daily.weather_code[i])
            return (
              <li key={date} className="grid grid-cols-[4rem_2rem_1fr_auto] items-center gap-3 py-2">
                <span className="capitalize">{weekday.format(new Date(`${date}T00:00`))}</span>
                <Icon className="size-6" aria-label={label} />
                <span className={`truncate text-sm ${MUTED}`}>{label}</span>
                <span>
                  <span className={MUTED}>{Math.round(daily.temperature_2m_min[i])}°</span>
                  {' / '}
                  <span className="font-semibold">{Math.round(daily.temperature_2m_max[i])}°</span>
                </span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
