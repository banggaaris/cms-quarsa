import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface DashboardStats {
  totalHeroes: number
  publishedHeroes: number
  draftHeroes: number
  totalServices: number
  totalTeamMembers: number
  totalClients: number
  totalCredentials: number
  hasAboutContent: boolean
  hasContactContent: boolean
}

export function useDashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalHeroes: 0,
    publishedHeroes: 0,
    draftHeroes: 0,
    totalServices: 0,
    totalTeamMembers: 0,
    totalClients: 0,
    totalCredentials: 0,
    hasAboutContent: false,
    hasContactContent: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      // Load hero stats
      const { data: heroesData, error: heroesError } = await supabase
        .from('hero_content')
        .select('status')

      if (!heroesError && heroesData) {
        const totalHeroes = heroesData.length
        const publishedHeroes = heroesData.filter(h => h.status === 'published').length
        const draftHeroes = heroesData.filter(h => h.status === 'draft').length

        setStats(prev => ({
          ...prev,
          totalHeroes,
          publishedHeroes,
          draftHeroes
        }))
      }

      // Load other counts
      const [servicesCount, teamCount, clientsCount, credentialsCount] = await Promise.all([
        supabase.from('service_content').select('id', { count: 'exact' }),
        supabase.from('team_content').select('id', { count: 'exact' }),
        supabase.from('client_content').select('id', { count: 'exact' }),
        supabase.from('credential_content').select('id', { count: 'exact' })
      ])

      setStats(prev => ({
        ...prev,
        totalServices: servicesCount.count || 0,
        totalTeamMembers: teamCount.count || 0,
        totalClients: clientsCount.count || 0,
        totalCredentials: credentialsCount.count || 0
      }))

      // Check if about content exists
      const { data: aboutData } = await supabase
        .from('about_content')
        .select('id')
        .limit(1)

      // Check if contact content exists
      const { data: contactData } = await supabase
        .from('contact_content')
        .select('id')
        .limit(1)

      setStats(prev => ({
        ...prev,
        hasAboutContent: !!aboutData?.length,
        hasContactContent: !!contactData?.length
      }))

    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    loading,
    reloadStats: loadDashboardStats
  }
}