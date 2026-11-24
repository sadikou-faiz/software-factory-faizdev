import { Droplets, MapPin, Thermometer, Wind } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { describe } from '@/lib/weather-codes'
import type { Forecast, Place } from '@/lib/weather'

export function CurrentWeather({ place, current }: { place: Place; current: Forecast['current'] }) {
  const { label, Icon } = describe(current.weather_code)
  return (
    <Card className="border-white/20 bg-white/15 text-white backdrop-blur">
      <CardContent className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h1 className="flex items-center justify-center gap-2 text-3xl font-semibold sm:justify-start">
            <MapPin className="size-6" />
            {place.name}
          </h1>
          {place.country && <p className="text-white/80">{place.country}</p>}
          <p className="mt-4 text-7xl font-light">{Math.round(current.temperature_2m)}°C</p>
          <p className="text-lg">{label}</p>
        </div>
        <Icon className="size-28 sm:size-36" strokeWidth={1.25} />
        <ul className="flex flex-col gap-2 text-white/90">
          <li className="flex items-center gap-2">
            <Thermometer className="size-5" />
            Ressenti {Math.round(current.apparent_temperature)}°C
          </li>
          <li className="flex items-center gap-2">
            <Droplets className="size-5" />
            Humidité {Math.round(current.relative_humidity_2m)} %
          </li>
          <li className="flex items-center gap-2">
            <Wind className="size-5" />
            Vent {Math.round(current.wind_speed_10m)} km/h
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
