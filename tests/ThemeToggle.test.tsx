import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from '@/components/ThemeToggle'

const button = () => screen.getByRole('button', { name: 'Thème sombre' })
const stubColorScheme = (dark: boolean) => vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: dark })))
const isDark = () => document.documentElement.classList.contains('dark')

describe('ThemeToggle', () => {
  it('T20: système clair sans choix mémorisé : thème clair', () => {
    render(<ThemeToggle />)
    expect(button()).toHaveAttribute('aria-pressed', 'false')
    expect(isDark()).toBe(false)
  })

  it('T21: système sombre sans choix mémorisé : thème sombre', () => {
    stubColorScheme(true)
    render(<ThemeToggle />)
    expect(button()).toHaveAttribute('aria-pressed', 'true')
    expect(isDark()).toBe(true)
  })

  it('T22: le choix mémorisé l emporte sur le système', () => {
    stubColorScheme(true)
    localStorage.setItem('theme', 'light')
    render(<ThemeToggle />)
    expect(button()).toHaveAttribute('aria-pressed', 'false')
    expect(isDark()).toBe(false)
  })

  it('T23: un clic bascule en sombre et mémorise, un second revient en clair', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    await user.click(button())
    expect(isDark()).toBe(true)
    expect(button()).toHaveAttribute('aria-pressed', 'true')
    expect(localStorage.getItem('theme')).toBe('dark')
    await user.click(button())
    expect(isDark()).toBe(false)
    expect(button()).toHaveAttribute('aria-pressed', 'false')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('T24: une valeur mémorisée invalide est ignorée', () => {
    stubColorScheme(true)
    localStorage.setItem('theme', 'bleu')
    render(<ThemeToggle />)
    expect(isDark()).toBe(true)
  })

  it('T25: un stockage qui lève une exception ne bloque pas la bascule', async () => {
    stubColorScheme(true)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqué')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqué')
    })
    const user = userEvent.setup()
    render(<ThemeToggle />)
    expect(isDark()).toBe(true)
    await user.click(button())
    expect(isDark()).toBe(false)
    expect(button()).toHaveAttribute('aria-pressed', 'false')
  })
})
