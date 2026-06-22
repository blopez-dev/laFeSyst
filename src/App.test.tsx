import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the hero section with images', () => {
    render(<App />)
    expect(screen.getByAltText('React logo')).toBeInTheDocument()
    expect(screen.getByAltText('Vite logo')).toBeInTheDocument()
  })

  it('renders the "Get started" heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /get started/i })).toBeInTheDocument()
  })

  it('renders the HMR instruction text', () => {
    render(<App />)
    expect(screen.getByText(/edit/i)).toBeInTheDocument()
    expect(screen.getByText('src/App.tsx')).toBeInTheDocument()
  })

  it('renders the counter button with initial value of 0', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is 0/i })
    expect(button).toBeInTheDocument()
  })

  it('increments the counter when button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /count is 0/i })
    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
  })

  it('increments the counter multiple times', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /count is 0/i })
    await user.click(button)
    await user.click(button)
    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 3/i })).toBeInTheDocument()
  })

  it('renders the Documentation section', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /documentation/i })).toBeInTheDocument()
    expect(screen.getByText('Your questions, answered')).toBeInTheDocument()
  })

  it('renders the Vite documentation link', () => {
    render(<App />)
    const viteLink = screen.getByRole('link', { name: /explore vite/i })
    expect(viteLink).toHaveAttribute('href', 'https://vite.dev/')
    expect(viteLink).toHaveAttribute('target', '_blank')
  })

  it('renders the React documentation link', () => {
    render(<App />)
    const reactLink = screen.getByRole('link', { name: /learn more/i })
    expect(reactLink).toHaveAttribute('href', 'https://react.dev/')
    expect(reactLink).toHaveAttribute('target', '_blank')
  })

  it('renders the Connect with us section', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /connect with us/i })).toBeInTheDocument()
    expect(screen.getByText('Join the Vite community')).toBeInTheDocument()
  })

  it('renders the GitHub link', () => {
    render(<App />)
    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/vitejs/vite')
    expect(githubLink).toHaveAttribute('target', '_blank')
  })

  it('renders the Discord link', () => {
    render(<App />)
    const discordLink = screen.getByRole('link', { name: /discord/i })
    expect(discordLink).toHaveAttribute('href', 'https://chat.vite.dev/')
    expect(discordLink).toHaveAttribute('target', '_blank')
  })

  it('renders the X.com link', () => {
    render(<App />)
    const xLink = screen.getByRole('link', { name: /x\.com/i })
    expect(xLink).toHaveAttribute('href', 'https://x.com/vite_js')
    expect(xLink).toHaveAttribute('target', '_blank')
  })

  it('renders the Bluesky link', () => {
    render(<App />)
    const blueskyLink = screen.getByRole('link', { name: /bluesky/i })
    expect(blueskyLink).toHaveAttribute('href', 'https://bsky.app/profile/vite.dev')
    expect(blueskyLink).toHaveAttribute('target', '_blank')
  })
})
