import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Client } from '@/types/content'

export function useClientsContent() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('client_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (fetchError) {
        // Error('Error loading clients:', fetchError)
        setError(fetchError.message)
        return
      }

      if (data) {
        const clientsData: Client[] = data.map((client) => ({
          id: client.id,
          name: client.name,
          industry: client.industry || '',
          description: client.description || '',
          years: '', // This can be added later if needed
          logo_url: client.logo_url || ''
        }))
        setClients(clientsData)
      }
    } catch (err) {
      // Error('Error loading clients:', err)
      setError('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const addClient = async (clientData: Omit<Client, 'id' | 'years'>) => {
    try {
      setError(null)

      // Validate required fields
      if (!clientData.name?.trim()) {
        setError('Client name is required')
        return null
      }

      // Get the highest order_index to append at the end
      const { data: existingClients } = await supabase
        .from('client_content')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = existingClients && existingClients[0] ? existingClients[0].order_index + 1 : 0

      const { data, error: insertError } = await supabase
        .from('client_content')
        .insert({
          name: clientData.name.trim(),
          logo_url: clientData.logo_url?.trim() || null,
          order_index: nextOrderIndex
        })
        .select()
        .single()

      if (insertError) {
        // Error('Error adding client:', insertError)
        setError(insertError.message)
        return null
      }

      if (data) {
        const newClient: Client = {
          id: data.id,
          name: data.name,
          industry: data.industry || '',
          description: data.description || '',
          years: '',
          logo_url: data.logo_url || ''
        }
        setClients(prev => [...prev, newClient])
        return newClient
      }
    } catch (err) {
      // Error('Error adding client:', err)
      setError('Failed to add client')
      return null
    }
  }

  const updateClient = async (id: string, clientData: Partial<Omit<Client, 'id' | 'years'>>) => {
    try {
      setError(null)

      // Validate required fields if they are being updated
      if (clientData.name !== undefined && !clientData.name?.trim()) {
        setError('Client name cannot be empty')
        return null
      }

      const { data, error: updateError } = await supabase
        .from('client_content')
        .update({
          name: clientData.name?.trim(),
          logo_url: clientData.logo_url?.trim() || null
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        // Error('Error updating client:', updateError)
        setError(updateError.message)
        return null
      }

      if (data) {
        const updatedClient: Client = {
          id: data.id,
          name: data.name,
          industry: data.industry || '',
          description: data.description || '',
          years: '',
          logo_url: data.logo_url || ''
        }
        setClients(prev => prev.map(client => client.id === id ? updatedClient : client))
        return updatedClient
      }
    } catch (err) {
      // Error('Error updating client:', err)
      setError('Failed to update client')
      return null
    }
  }

  const deleteClient = async (id: string) => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('client_content')
        .delete()
        .eq('id', id)

      if (deleteError) {
        // Error('Error deleting client:', deleteError)
        setError(deleteError.message)
        return false
      }

      setClients(prev => prev.filter(client => client.id !== id))
      return true
    } catch (err) {
      // Error('Error deleting client:', err)
      setError('Failed to delete client')
      return false
    }
  }

  const reorderClients = async (updatedClients: Client[]) => {
    try {
      setError(null)

      // Update each client individually with all required fields
      for (let index = 0; index < updatedClients.length; index++) {
        const client = updatedClients[index]

        const { error: reorderError } = await supabase
          .from('client_content')
          .update({ order_index: index })
          .eq('id', client.id)

        if (reorderError) {
          // Error('Error reordering client:', reorderError)
          setError(reorderError.message)
          return false
        }
      }

      setClients(updatedClients)
      return true
    } catch (err) {
      // Error('Error reordering clients:', err)
      setError('Failed to reorder clients')
      return false
    }
  }

  return {
    clients,
    loading,
    error,
    loadClients,
    addClient,
    updateClient,
    deleteClient,
    reorderClients
  }
}