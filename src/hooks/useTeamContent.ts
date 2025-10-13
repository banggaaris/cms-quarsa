import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface TeamMember {
  id: string
  name: string
  position: string
  expertise: string
  experience: string
  education: string
  image: string
  bio: string
  specializations: string[]
}

export function useTeamContent() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeamContent()
  }, [])

  const loadTeamContent = async () => {
    try {
      const { data, error } = await supabase
        .from('team_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error loading team:', error)
      } else if (data) {
        const teamData: TeamMember[] = data.map(member => ({
          id: member.id,
          name: member.name,
          position: member.position,
          expertise: member.expertise || '',
          experience: member.experience || '',
          education: member.education || '',
          image: member.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
          bio: member.bio || '',
          specializations: member.specializations || []
        }))
        setTeam(teamData)
      }
    } catch (error) {
      console.error('Error loading team:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTeam = (team: TeamMember[]) => {
    setTeam(team)
  }

  return {
    team,
    loading,
    updateTeam,
    reloadTeamContent: loadTeamContent
  }
}