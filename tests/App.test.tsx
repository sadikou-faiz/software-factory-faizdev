import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { jsonResponse, makeForecast } from './fixtures'

const PLACES: Record<string, object> = {
  Paris: { name: 'Paris', country: 'France', latitude: 48.85, longitude: 2.35 },
  Tokyo: { name: 'Tokyo', country: 'Japon', latitude: 35.69, longitude: 139.69 },
}

function stubApi() {
  const fetchMock = vi.fn(async (url: string) => {
    const { searchParams } = new URL(url)
    if (url.startsWith('https://geocoding-api.open-meteo.com/')) {
      const place = PLACES[searchParams.get('name') ?? '']
      return jsonResponse(place ? { results: [place] } : {})
    }
    return jsonResponse(makeForecast('2026-11-24T10:15', searchParams.get('latitude') === '35.69' ? 3.2 : 12.4))
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('App', () => {
  it('T10: charge Paris au démarrage avec température, ressenti, humidité et vent', async () => {
    const fetchMock = stubApi()
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Paris' })).toBeInTheDocument()
    expect(fetchMock.mock.calls[0][0]).toContain('name=Paris')
    expect(screen.getByText('France')).toBeInTheDocument()
    expect(screen.getByText('12°C')).toBeInTheDocument()
    expect(screen.getByText('Couvert')).toBeInTheDocument()
    expect(screen.getByText('Ressenti 10°C')).toBeInTheDocument()
    expect(screen.getByText('Humidité 81 %')).toBeInTheDocument()
    expect(screen.getByText('Vent 15 km/h')).toBeInTheDocument()
  })

  it('T11: affiche le chargement et désactive le bouton avant la réponse', async () => {
    let release: () => void = () => {}
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>((resolve) => (release = () => resolve(jsonResponse({}))))),
    )
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent('Chargement…')
    expect(screen.getByRole('button', { name: 'Rechercher' })).toBeDisabled()
    release()
    expect(await screen.findByText('Ville introuvable : Paris')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('T12: rechercher Tokyo puis Entrée affiche Tokyo', async () => {
    stubApi()
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('heading', { name: 'Paris' })
    await user.type(screen.getByRole('textbox', { name: 'Ville' }), 'Tokyo{Enter}')
    expect(await screen.findByRole('heading', { name: 'Tokyo' })).toBeInTheDocument()
    expect(screen.getByText('Japon')).toBeInTheDocument()
    expect(screen.getByText('3°C')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Paris' })).not.toBeInTheDocument()
  })

  it('T13: une ville inconnue affiche Ville introuvable', async () => {
    stubApi()
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('heading', { name: 'Paris' })
    await user.type(screen.getByRole('textbox', { name: 'Ville' }), 'Xyzqwvillex')
    await user.click(screen.getByRole('button', { name: 'Rechercher' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Ville introuvable : Xyzqwvillex')
  })

  it('T14: une erreur réseau affiche un message d erreur', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de joindre le service météo')
  })

  it('T15: une saisie vide ou faite d espaces ne déclenche aucune requête', async () => {
    const fetchMock = stubApi()
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('heading', { name: 'Paris' })
    const calls = fetchMock.mock.calls.length
    await user.click(screen.getByRole('button', { name: 'Rechercher' }))
    await user.type(screen.getByRole('textbox', { name: 'Ville' }), '   {Enter}')
    expect(fetchMock).toHaveBeenCalledTimes(calls)
    expect(screen.getByRole('heading', { name: 'Paris' })).toBeInTheDocument()
  })

  it('T16: rend 12 créneaux horaires et 7 jours', async () => {
    stubApi()
    render(<App />)
    const hourly = await screen.findByRole('list', { name: 'Prévisions horaires' })
    expect(within(hourly).getAllByRole('listitem')).toHaveLength(12)
    expect(within(hourly).getByText('10:00')).toBeInTheDocument()
    const daily = screen.getByRole('list', { name: 'Prévisions sur 7 jours' })
    expect(within(daily).getAllByRole('listitem')).toHaveLength(7)
    expect(within(daily).getByText('mar.')).toBeInTheDocument()
  })
})
