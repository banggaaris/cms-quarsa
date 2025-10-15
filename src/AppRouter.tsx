import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '@/contexts/AuthContext'
import App from './App'
import { Suspense } from 'react'

// Lazy load admin components for code splitting
const AdminApp = React.lazy(() => import('./pages/AdminApp').then(module => ({ default: module.default })))

export default function AppRouter() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/*" element={<App />} />
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={
                  <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading admin panel...</p>
                    </div>
                  </div>
                }>
                  <AdminApp />
                </Suspense>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  )
}