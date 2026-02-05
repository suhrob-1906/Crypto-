import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { router } from './router'

export default function App() {
  const element = useRoutes(router)
  return (
    <Suspense fallback={<div className="min-h-screen bg-panel flex items-center justify-center text-muted">Loading...</div>}>
      {element}
    </Suspense>
  )
}
