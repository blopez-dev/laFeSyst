export function registerGlobalErrorHandlers(): void {
  window.addEventListener('error', (event: ErrorEvent) => {
    console.error(
      '[GlobalError] Unhandled error:',
      event.error ?? event.message
    )
  })

  window.addEventListener(
    'unhandledrejection',
    (event: PromiseRejectionEvent) => {
      console.error('[GlobalError] Unhandled promise rejection:', event.reason)
    }
  )
}
