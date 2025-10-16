import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'

// Lazy load admin components for better code splitting
const Dashboard = React.lazy(() => import('@/components/admin/Dashboard').then(module => ({ default: module.Dashboard })))
const HeroEditor = React.lazy(() => import('@/components/admin/HeroEditor').then(module => ({ default: module.HeroEditor })))
const HeroPage = React.lazy(() => import('@/components/admin/HeroPage').then(module => ({ default: module.HeroPage })))
const HeroSlidesEditor = React.lazy(() => import('@/components/admin/HeroSlidesEditor').then(module => ({ default: module.HeroSlidesEditor })))
const TeamEditor = React.lazy(() => import('@/components/admin/TeamEditor').then(module => ({ default: module.TeamEditor })))
const ServicesEditor = React.lazy(() => import('@/components/admin/ServicesEditor').then(module => ({ default: module.ServicesEditor })))
const AboutEditor = React.lazy(() => import('@/components/admin/AboutEditor').then(module => ({ default: module.AboutEditor })))
const ClientsEditor = React.lazy(() => import('@/components/admin/ClientsEditor').then(module => ({ default: module.ClientsEditor })))
const GalleryEditor = React.lazy(() => import('@/components/admin/GalleryEditor').then(module => ({ default: module.GalleryEditor })))
const CredentialsEditor = React.lazy(() => import('@/components/admin/CredentialsEditor').then(module => ({ default: module.CredentialsEditor })))
const ContactEditor = React.lazy(() => import('@/components/admin/ContactEditor').then(module => ({ default: module.ContactEditor })))
const SettingsEditor = React.lazy(() => import('@/components/admin/SettingsEditor').then(module => ({ default: module.SettingsEditor })))

const AdminRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  }>
    {children}
  </Suspense>
)

export default function AdminApp() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminRouteWrapper><Dashboard /></AdminRouteWrapper>} />
          <Route path="/hero" element={<AdminRouteWrapper><HeroEditor /></AdminRouteWrapper>} />
          <Route path="/hero/:uuid" element={<AdminRouteWrapper><HeroPage /></AdminRouteWrapper>} />
          <Route path="/hero-slides" element={<AdminRouteWrapper><HeroSlidesEditor /></AdminRouteWrapper>} />
          <Route path="/about" element={<AdminRouteWrapper><AboutEditor /></AdminRouteWrapper>} />
          <Route path="/team" element={<AdminRouteWrapper><TeamEditor /></AdminRouteWrapper>} />
          <Route path="/services" element={<AdminRouteWrapper><ServicesEditor /></AdminRouteWrapper>} />
          <Route path="/clients" element={<AdminRouteWrapper><ClientsEditor /></AdminRouteWrapper>} />
          <Route path="/gallery" element={<AdminRouteWrapper><GalleryEditor /></AdminRouteWrapper>} />
          <Route path="/credentials" element={<AdminRouteWrapper><CredentialsEditor /></AdminRouteWrapper>} />
          <Route path="/contact" element={<AdminRouteWrapper><ContactEditor /></AdminRouteWrapper>} />
          <Route path="/settings" element={<AdminRouteWrapper><SettingsEditor /></AdminRouteWrapper>} />
          {/* Add more routes as we create more editors */}
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  )
}