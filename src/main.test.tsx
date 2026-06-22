import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRoot } from 'react-dom/client'

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}))

describe('main', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    vi.resetModules()
  })

  it('calls createRoot with the root element and renders the app', async () => {
    await import('./main')
    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'))
  })
})
