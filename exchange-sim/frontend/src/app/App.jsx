import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { router } from './router'
import ToastProvider from '../shared/ui/ToastProvider'
import CommandPalette from '../shared/ui/CommandPalette'
import { motion } from 'framer-motion'

export default function App() {
  const element = useRoutes(router)
  return (
    <>
      {/* Toast Notifications */}
      <ToastProvider />

      {/* Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPalette />

      {/* Main App */}
      <Suspense
        fallback={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-bg-0 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-text-2">Loading...</p>
            </div>
          </motion.div>
        }
      >
        {element}
      </Suspense>
    </>
  )
}
