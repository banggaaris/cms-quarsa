import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '@/contexts/AuthContext'
import App from './App'
import AdminApp from './pages/AdminApp'

export default function AppRouter() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/*" element={<App />} />
            <Route path="/admin/*" element={<AdminApp />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  )
}