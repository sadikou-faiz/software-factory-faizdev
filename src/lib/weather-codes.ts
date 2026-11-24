import {
  CircleHelp,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from 'lucide-react'

export type Category = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm'

export interface WeatherInfo {
  label: string
  category: Category
  Icon: LucideIcon
}

const CODES: Record<number, [string, Category, LucideIcon]> = {
  0: ['Ciel dégagé', 'clear', Sun],
  1: ['Plutôt dégagé', 'clear', Sun],
  2: ['Partiellement nuageux', 'cloudy', CloudSun],
  3: ['Couvert', 'cloudy', Cloud],
  45: ['Brouillard', 'fog', CloudFog],
  48: ['Brouillard givrant', 'fog', CloudFog],
  51: ['Bruine légère', 'rain', CloudDrizzle],
  53: ['Bruine modérée', 'rain', CloudDrizzle],
  55: ['Bruine dense', 'rain', CloudDrizzle],
  56: ['Bruine verglaçante légère', 'rain', CloudDrizzle],
  57: ['Bruine verglaçante dense', 'rain', CloudDrizzle],
  61: ['Pluie faible', 'rain', CloudRain],
  63: ['Pluie modérée', 'rain', CloudRain],
  65: ['Pluie forte', 'rain', CloudRain],
  66: ['Pluie verglaçante légère', 'rain', CloudRain],
  67: ['Pluie verglaçante forte', 'rain', CloudRain],
  71: ['Neige faible', 'snow', CloudSnow],
  73: ['Neige modérée', 'snow', CloudSnow],
  75: ['Neige forte', 'snow', CloudSnow],
  77: ['Grains de neige', 'snow', CloudSnow],
  80: ['Averses faibles', 'rain', CloudRain],
  81: ['Averses modérées', 'rain', CloudRain],
  82: ['Averses violentes', 'rain', CloudRain],
  85: ['Averses de neige faibles', 'snow', CloudSnow],
  86: ['Averses de neige fortes', 'snow', CloudSnow],
  95: ['Orage', 'storm', CloudLightning],
  96: ['Orage avec grêle légère', 'storm', CloudLightning],
  99: ['Orage avec grêle forte', 'storm', CloudLightning],
}

export function describe(code: number): WeatherInfo {
  const [label, category, Icon] = CODES[code] ?? ['Conditions inconnues', 'cloudy', CircleHelp]
  return { label, category, Icon }
}

// Class names stay literal so Tailwind detects them at build time.
const GRADIENTS: Record<Category, [day: string, night: string]> = {
  clear: ['from-sky-400 to-blue-600', 'from-indigo-950 to-slate-900'],
  cloudy: ['from-slate-400 to-sky-700', 'from-slate-800 to-gray-950'],
  fog: ['from-gray-400 to-slate-600', 'from-gray-700 to-slate-900'],
  rain: ['from-slate-500 to-blue-800', 'from-slate-900 to-blue-950'],
  snow: ['from-sky-300 to-slate-500', 'from-slate-700 to-indigo-950'],
  storm: ['from-gray-600 to-purple-900', 'from-gray-900 to-purple-950'],
}

export function gradient(category: Category, isDay: boolean): string {
  return `bg-linear-to-br ${GRADIENTS[category][isDay ? 0 : 1]}`
}
