import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface HeroSlide {
  id: string
  title: string
  description: string
  image_url: string
  order_index: number
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [publishedSlides, setPublishedSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHeroSlides()
  }, [])

  const loadHeroSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        // Error('Error loading hero slides:', error)
      } else if (data) {
        setSlides(data)
        // Filter only published slides for display
        const published = data.filter(slide => slide.status === 'published')
        setPublishedSlides(published)
      }
    } catch (error) {
      // Error('Error loading hero slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSlide = async (slide: Partial<HeroSlide>, slideId: string) => {
    try {
      const slidePayload = {
        title: slide.title,
        description: slide.description,
        image_url: slide.image_url,
        order_index: slide.order_index,
        status: slide.status
      }

      const { data, error } = await supabase
        .from('hero_slides')
        .update(slidePayload)
        .eq('id', slideId)
        .select()
        .single()

      if (error) {
        // Error('Error updating slide:', error)
        throw error
      }

      await loadHeroSlides()
      return data
    } catch (error) {
      // Error('Error updating slide:', error)
      throw error
    }
  }

  const createSlide = async (slide: Partial<HeroSlide>) => {
    try {
      // Get the highest order_index to place new slide at the end
      const { data: existingSlides } = await supabase
        .from('hero_slides')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = existingSlides && existingSlides.length > 0
        ? existingSlides[0].order_index + 1
        : 0

      const slidePayload = {
        title: slide.title || "New Slide",
        description: slide.description || "",
        image_url: slide.image_url || "",
        order_index: slide.order_index ?? nextOrderIndex,
        status: 'draft' as const
      }

      const { data, error } = await supabase
        .from('hero_slides')
        .insert(slidePayload)
        .select()
        .single()

      if (error) {
        // Error('Error creating slide:', error)
        throw error
      }

      await loadHeroSlides()
      return data
    } catch (error) {
      // Error('Error creating slide:', error)
      throw error
    }
  }

  const deleteSlide = async (slideId: string) => {
    try {
      // First verify the slide exists
      const { data: existingSlide, error: checkError } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('id', slideId)
        .single()

      if (checkError) {
        // Error('Error checking slide existence:', checkError)
        throw new Error(`Slide not found or check failed: ${checkError.message}`)
      }

      if (!existingSlide) {
        throw new Error(`Slide with ID "${slideId}" not found`)
      }

      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', slideId)

      if (error) {
        // Error('Error deleting slide:', error)
        throw new Error(`Failed to delete slide: ${error.message}`)
      }

      // Verify the delete worked
      const { data: verifyDelete, error: verifyError } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('id', slideId)
        .maybeSingle()

      if (!verifyError && verifyDelete) {
        throw new Error(`Delete operation failed due to database permissions. The slide cannot be deleted because of Row Level Security (RLS) policies in Supabase.`)
      }

      if (verifyError) {
        const notFoundCodes = ['PGRST116', '406', '404']
        if (!notFoundCodes.includes(verifyError.code) &&
            !verifyError.message?.includes('406') &&
            !verifyError.message?.includes('404')) {
          throw new Error(`Delete verification failed: ${verifyError.message}`)
        }
      }

      await loadHeroSlides()
      return { success: true }
    } catch (error) {
      // Error('Error deleting slide:', error)
      throw error
    }
  }

  const reorderSlides = async (slideIds: string[]) => {
    try {
      const updates = slideIds.map((id, index) =>
        supabase
          .from('hero_slides')
          .update({ order_index: index })
          .eq('id', id)
      )

      await Promise.all(updates)
      await loadHeroSlides()
    } catch (error) {
      // Error('Error reordering slides:', error)
      throw error
    }
  }

  const publishSlide = async (slideId: string) => {
    await updateSlide({ status: 'published' }, slideId)
  }

  const unpublishSlide = async (slideId: string) => {
    await updateSlide({ status: 'draft' }, slideId)
  }

  return {
    slides,
    publishedSlides,
    loading,
    updateSlide,
    createSlide,
    deleteSlide,
    reorderSlides,
    publishSlide,
    unpublishSlide,
    reloadHeroSlides: loadHeroSlides
  }
}