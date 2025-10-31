import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Credential } from '@/types/content'

export function useCredentialsContent() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCredentials()
  }, [])

  const loadCredentials = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('credential_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (fetchError) {
        // Error('Error loading credentials:', fetchError)
        setError(fetchError.message)
        return
      }

      if (data) {
        const credentialsData: Credential[] = data.map((cred) => ({
          id: cred.id,
          title: cred.title,
          description: cred.description || '',
          logo_url: cred.logo_url || '',
          order_index: cred.order_index
        }))
        setCredentials(credentialsData)
      }
    } catch (err) {
      // Error('Error loading credentials:', err)
      setError('Failed to load credentials')
    } finally {
      setLoading(false)
    }
  }

  const addCredential = async (credentialData: Omit<Credential, 'id' | 'order_index'>) => {
    try {
      setError(null)

      // Validate required fields
      if (!credentialData.title?.trim()) {
        setError('Title is required')
        return null
      }

      // Get the highest order_index to append at the end
      const { data: existingCredentials } = await supabase
        .from('credential_content')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = existingCredentials && existingCredentials[0] ? existingCredentials[0].order_index + 1 : 0

      const { data, error: insertError } = await supabase
        .from('credential_content')
        .insert({
          title: credentialData.title.trim(),
          description: credentialData.description?.trim() || null,
          logo_url: credentialData.logo_url?.trim() || null,
          order_index: nextOrderIndex
        })
        .select()
        .single()

      if (insertError) {
        // Error('Error adding credential:', insertError)
        setError(insertError.message)
        return null
      }

      if (data) {
        const newCredential: Credential = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          logo_url: data.logo_url || '',
          order_index: data.order_index
        }
        setCredentials(prev => [...prev, newCredential])
        return newCredential
      }
    } catch (err) {
      // Error('Error adding credential:', err)
      setError('Failed to add credential')
      return null
    }
  }

  const updateCredential = async (id: string, credentialData: Partial<Omit<Credential, 'id' | 'order_index'>>) => {
    try {
      setError(null)

      // Validate required fields if they are being updated
      if (credentialData.title !== undefined && !credentialData.title?.trim()) {
        setError('Title cannot be empty')
        return null
      }

      const { data, error: updateError } = await supabase
        .from('credential_content')
        .update({
          title: credentialData.title?.trim(),
          description: credentialData.description?.trim() || null,
          logo_url: credentialData.logo_url?.trim() || null
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        // Error('Error updating credential:', updateError)
        setError(updateError.message)
        return null
      }

      if (data) {
        const updatedCredential: Credential = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          logo_url: data.logo_url || '',
          order_index: data.order_index
        }
        setCredentials(prev => prev.map(cred => cred.id === id ? updatedCredential : cred))
        return updatedCredential
      }
    } catch (err) {
      // Error('Error updating credential:', err)
      setError('Failed to update credential')
      return null
    }
  }

  const deleteCredential = async (id: string) => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('credential_content')
        .delete()
        .eq('id', id)

      if (deleteError) {
        // Error('Error deleting credential:', deleteError)
        setError(deleteError.message)
        return false
      }

      setCredentials(prev => prev.filter(cred => cred.id !== id))
      return true
    } catch (err) {
      // Error('Error deleting credential:', err)
      setError('Failed to delete credential')
      return false
    }
  }

  const reorderCredentials = async (updatedCredentials: Credential[]) => {
    try {
      setError(null)

      // Update each credential individually
      for (let index = 0; index < updatedCredentials.length; index++) {
        const credential = updatedCredentials[index]

        const { error: reorderError } = await supabase
          .from('credential_content')
          .update({ order_index: index })
          .eq('id', credential.id)

        if (reorderError) {
          // Error('Error reordering credential:', reorderError)
          setError(reorderError.message)
          return false
        }
      }

      setCredentials(updatedCredentials)
      return true
    } catch (err) {
      // Error('Error reordering credentials:', err)
      setError('Failed to reorder credentials')
      return false
    }
  }

  return {
    credentials,
    loading,
    error,
    loadCredentials,
    addCredential,
    updateCredential,
    deleteCredential,
    reorderCredentials
  }
}