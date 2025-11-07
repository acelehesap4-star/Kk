import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'sonner'

// Global error handler
export const errorHandler = (error: Error) => {
  console.error('Error:', error)
  toast.error(error.message)
}

// Error boundary fallback
export const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <div role="alert" className="p-4">
      <h2 className="text-red-600">Bir şeyler yanlış gitti!</h2>
      <pre className="text-sm">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Yeniden Dene
      </button>
    </div>
  )
}

// Global error boundary wrapper
export const withErrorBoundary = (Component: React.ComponentType) => {
  return function WithErrorBoundary(props: any) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}