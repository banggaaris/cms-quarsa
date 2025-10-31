import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TeamMember } from '@/types/content'

export function useTeamsContent() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTeam()
  }, [])

  const loadTeam = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('team_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (fetchError) {
        //error('Error loading team:', fetchError)
        setError(fetchError.message)
        return
      }

      if (data) {
        const teamData: TeamMember[] = data.map((member) => ({
          id: member.id,
          name: member.name,
          position: member.position,
          expertise: member.expertise || '',
          experience: member.experience || '',
          education: member.education || '',
          image: member.image_url || '',
          bio: member.bio || '',
          specializations: member.specializations || [],
          achievements: member.achievements || []
        }))
        setTeam(teamData)
      }
    } catch (err) {
      //error('Error loading team:', err)
      setError('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>) => {
    try {
      setError(null)

      // Validate required fields
      if (!memberData.name?.trim()) {
        setError('Team member name is required')
        return null
      }
      if (!memberData.position?.trim()) {
        setError('Position is required')
        return null
      }

      // Get the highest order_index to append at the end
      const { data: existingMembers } = await supabase
        .from('team_content')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = existingMembers && existingMembers[0] ? existingMembers[0].order_index + 1 : 0

      const { data, error: insertError } = await supabase
        .from('team_content')
        .insert({
          name: memberData.name.trim(),
          position: memberData.position.trim(),
          bio: memberData.bio?.trim() || null,
          image_url: memberData.image?.trim() || null,
          experience: memberData.experience?.trim() || null,
          education: memberData.education?.trim() || null,
          expertise: memberData.expertise?.trim() || null,
          specializations: memberData.specializations || [],
          achievements: memberData.achievements || [],
          order_index: nextOrderIndex
        })
        .select()
        .single()

      if (insertError) {
        //error('Error adding team member:', insertError)
        setError(insertError.message)
        return null
      }

      if (data) {
        const newMember: TeamMember = {
          id: data.id,
          name: data.name,
          position: data.position,
          expertise: data.expertise || '',
          experience: data.experience || '',
          education: data.education || '',
          image: data.image_url || '',
          bio: data.bio || '',
          specializations: data.specializations || [],
          achievements: data.achievements || []
        }
        setTeam(prev => [...prev, newMember])
        return newMember
      }
    } catch (err) {
      //error('Error adding team member:', err)
      setError('Failed to add team member')
      return null
    }
  }

  const updateTeamMember = async (id: string, memberData: Partial<Omit<TeamMember, 'id'>>) => {
    try {
      setError(null)

      // Validate required fields if they are being updated
      if (memberData.name !== undefined && !memberData.name?.trim()) {
        setError('Team member name cannot be empty')
        return null
      }
      if (memberData.position !== undefined && !memberData.position?.trim()) {
        setError('Position cannot be empty')
        return null
      }

      const { data, error: updateError } = await supabase
        .from('team_content')
        .update({
          name: memberData.name?.trim(),
          position: memberData.position?.trim(),
          bio: memberData.bio?.trim() || null,
          image_url: memberData.image?.trim() || null,
          experience: memberData.experience?.trim() || null,
          education: memberData.education?.trim() || null,
          expertise: memberData.expertise?.trim() || null,
          specializations: memberData.specializations || [],
          achievements: memberData.achievements || []
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        //error('Error updating team member:', updateError)
        setError(updateError.message)
        return null
      }

      if (data) {
        const updatedMember: TeamMember = {
          id: data.id,
          name: data.name,
          position: data.position,
          expertise: data.expertise || '',
          experience: data.experience || '',
          education: data.education || '',
          image: data.image_url || '',
          bio: data.bio || '',
          specializations: data.specializations || [],
          achievements: data.achievements || []
        }
        setTeam(prev => prev.map(member => member.id === id ? updatedMember : member))
        return updatedMember
      }
    } catch (err) {
      //error('Error updating team member:', err)
      setError('Failed to update team member')
      return null
    }
  }

  const deleteTeamMember = async (id: string) => {
    try {
      setError(null)
      //log('Attempting to delete team member with ID:', id)

      const { error: deleteError, count } = await supabase
        .from('team_content')
        .delete({ count: 'exact' })
        .eq('id', id)

      //log('Delete operation result:', { error: deleteError, count })

      if (deleteError) {
        //error('Error deleting team member:', deleteError)
        setError(`Delete failed: ${deleteError.message}`)
        return false
      }

      if (count === 0) {
        //warn('No team member found to delete with ID:', id)
        setError('Team member not found')
        return false
      }

      //log('Successfully deleted team member, updating local state')
      setTeam(prev => prev.filter(member => member.id !== id))
      return true
    } catch (err) {
      //error('Error deleting team member:', err)
      setError('Failed to delete team member')
      return false
    }
  }

  const reorderTeam = async (updatedTeam: TeamMember[]) => {
    try {
      setError(null)

      // Update each team member individually with all required fields
      for (let index = 0; index < updatedTeam.length; index++) {
        const member = updatedTeam[index]

        const { error: reorderError } = await supabase
          .from('team_content')
          .update({ order_index: index })
          .eq('id', member.id)

        if (reorderError) {
          //error('Error reordering team member:', reorderError)
          setError(reorderError.message)
          return false
        }
      }

      setTeam(updatedTeam)
      return true
    } catch (err) {
      //error('Error reordering team:', err)
      setError('Failed to reorder team members')
      return false
    }
  }

  return {
    team,
    loading,
    error,
    loadTeam,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    reorderTeam
  }
}