import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { GalleryItem } from '@/types/content'

export function useGalleryContent() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('gallery_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (fetchError) {
        // Error('Error loading gallery:', fetchError)
        setError(fetchError.message)
        return
      }

      if (data) {
        const galleryData: GalleryItem[] = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          category: item.category || 'general',
          imageUrl: item.image_url || ''
        }))
        setGallery(galleryData)
      }
    } catch (err) {
      // Error('Error loading gallery:', err)
      setError('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  const addGalleryItem = async (itemData: Omit<GalleryItem, 'id'>) => {
    try {
      setError(null)

      // Validate required fields
      if (!itemData.title?.trim()) {
        setError('Title is required')
        return null
      }
      if (!itemData.category?.trim()) {
        setError('Category is required')
        return null
      }

      // Get the highest order_index to append at the end
      const { data: existingItems } = await supabase
        .from('gallery_content')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = existingItems && existingItems[0] ? existingItems[0].order_index + 1 : 0

      const { data, error: insertError } = await supabase
        .from('gallery_content')
        .insert({
          title: itemData.title.trim(),
          description: itemData.description?.trim() || null,
          category: itemData.category.trim(),
          image_url: itemData.imageUrl?.trim() || null,
          order_index: nextOrderIndex
        })
        .select()
        .single()

      if (insertError) {
        // Error('Error adding gallery item:', insertError)
        setError(insertError.message)
        return null
      }

      if (data) {
        const newItem: GalleryItem = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          category: data.category || 'general',
          imageUrl: data.image_url || ''
        }
        setGallery(prev => [...prev, newItem])
        return newItem
      }
    } catch (err) {
      // Error('Error adding gallery item:', err)
      setError('Failed to add gallery item')
      return null
    }
  }

  const updateGalleryItem = async (id: string, itemData: Partial<Omit<GalleryItem, 'id'>>) => {
    try {
      setError(null)

      // Validate required fields if they are being updated
      if (itemData.title !== undefined && !itemData.title?.trim()) {
        setError('Title cannot be empty')
        return null
      }
      if (itemData.category !== undefined && !itemData.category?.trim()) {
        setError('Category cannot be empty')
        return null
      }

      const { data, error: updateError } = await supabase
        .from('gallery_content')
        .update({
          title: itemData.title?.trim(),
          description: itemData.description?.trim() || null,
          category: itemData.category?.trim(),
          image_url: itemData.imageUrl?.trim() || null
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        // Error('Error updating gallery item:', updateError)
        setError(updateError.message)
        return null
      }

      if (data) {
        const updatedItem: GalleryItem = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          category: data.category || 'general',
          imageUrl: data.image_url || ''
        }
        setGallery(prev => prev.map(item => item.id === id ? updatedItem : item))
        return updatedItem
      }
    } catch (err) {
      // Error('Error updating gallery item:', err)
      setError('Failed to update gallery item')
      return null
    }
  }

  const deleteGalleryItem = async (id: string) => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('gallery_content')
        .delete()
        .eq('id', id)

      if (deleteError) {
        // Error('Error deleting gallery item:', deleteError)
        setError(deleteError.message)
        return false
      }

      setGallery(prev => prev.filter(item => item.id !== id))
      return true
    } catch (err) {
      // Error('Error deleting gallery item:', err)
      setError('Failed to delete gallery item')
      return false
    }
  }

  const reorderGallery = async (updatedGallery: GalleryItem[]) => {
    try {
      setError(null)

      // Update each item individually
      for (let index = 0; index < updatedGallery.length; index++) {
        const item = updatedGallery[index]

        const { error: reorderError } = await supabase
          .from('gallery_content')
          .update({ order_index: index })
          .eq('id', item.id)

        if (reorderError) {
          // Error('Error reordering gallery item:', reorderError)
          setError(reorderError.message)
          return false
        }
      }

      setGallery(updatedGallery)
      return true
    } catch (err) {
      // Error('Error reordering gallery:', err)
      setError('Failed to reorder gallery')
      return false
    }
  }

  return {
    gallery,
    loading,
    error,
    loadGallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    reorderGallery
  }
}