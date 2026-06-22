import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './ErrorBoundary.tsx'
import { registerGlobalErrorHandlers } from './globalErrorHandlers.ts'

registerGlobalErrorHandlers()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error(
    'Root element not found. Ensure there is a <div id="root"> in index.html.'
  )
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
