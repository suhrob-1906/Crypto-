import { lazy, Suspense } from 'react'
import { Navigate, useRoutes, Outlet } from 'react-router-dom'
import { useAuth } from './providers'
import HeaderBar from '../widgets/HeaderBar'

const AuthPage = lazy(() => import('../pages/AuthPage'))
const MarketsPage = lazy(() => import('../pages/MarketsPage'))
const TradePage = lazy(() => import('../pages/TradePage'))
const WalletPage = lazy(() => import('../pages/WalletPage'))

function Protected({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/auth" replace />
  return children
}

function MainLayout() {
  return (
    <>
      <HeaderBar />
      <main className="min-h-screen bg-panel text-white">
        <Outlet />
      </main>
    </>
  )
}

export const router = [
  { path: '/auth', element: <AuthPage /> },
  {
    path: '/',
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),
    children: [
      { index: true, element: <Navigate to="/markets" replace /> },
      { path: 'markets', element: <MarketsPage /> },
      { path: 'trade/:symbol', element: <TradePage /> },
      { path: 'wallet', element: <WalletPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]
