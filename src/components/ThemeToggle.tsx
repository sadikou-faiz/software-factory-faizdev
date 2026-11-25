import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Theme = 'light' | 'dark'

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Stockage bloqué (navigation privée) : on retombe sur la préférence système.
  }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // Écriture impossible : le thème reste valable pour la session.
    }
  }, [theme])

  const dark = theme === 'dark'
  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label="Thème sombre"
      aria-pressed={dark}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {dark ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </Button>
  )
}
