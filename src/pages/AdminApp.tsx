import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Dashboard } from '@/components/admin/Dashboard'
import { HeroEditor } from '@/components/admin/HeroEditor'
import { HeroPage } from '@/components/admin/HeroPage'
import { TeamEditor } from '@/components/admin/TeamEditor'
import { ServicesEditor } from '@/components/admin/ServicesEditor'
import { AboutEditor } from '@/components/admin/AboutEditor'
import { ClientsEditor } from '@/components/admin/ClientsEditor'

export default function AdminApp() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hero" element={<HeroEditor />} />
          <Route path="/hero/:uuid" element={<HeroPage />} />
          <Route path="/about" element={<AboutEditor />} />
          <Route path="/team" element={<TeamEditor />} />
          <Route path="/services" element={<ServicesEditor />} />
          <Route path="/clients" element={<ClientsEditor />} />
          {/* Add more routes as we create more editors */}
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  )
}