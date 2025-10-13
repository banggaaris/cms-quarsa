import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface HeroContent {
  id: string
  title: string
  subtitle: string
  description: string
  trusted_text: string
  status: 'draft' | 'published'
  colors: {
    titleColor: string
    subtitleColor: string
    descriptionColor: string
    trustedBadgeTextColor: string
    trustedBadgeBgColor: string
  }
  created_at: string
  updated_at: string
}

export function useHeroContent() {
  const [heroes, setHeroes] = useState<HeroContent[]>([])
  const [currentHero, setCurrentHero] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHeroContent()
  }, [])

  const loadHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error loading hero content:', error)
      } else if (data) {
        setHeroes(data)
        setCurrentHero(data[0] || null)
      }
    } catch (error) {
      console.error('Error loading hero content:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateHero = async (hero: Partial<HeroContent>, heroId?: string) => {
    console.log(`updateHero called with:`, { heroId, status: hero.status, hero })
    try {
      let heroPayload: any

      if (heroId && (Object.keys(hero).length === 1 && hero.status)) {
        // If only updating status for a specific hero (publish/unpublish), only update status
        console.log('Only updating status for specific hero')
        heroPayload = { status: hero.status }
      } else {
        // Full hero update - get current data from database if specific hero
        if (heroId) {
          const { data: currentHeroData } = await supabase
            .from('hero_content')
            .select('*')
            .eq('id', heroId)
            .single()

          if (currentHeroData) {
            heroPayload = {
              title: hero.title || currentHeroData.title,
              subtitle: hero.subtitle || currentHeroData.subtitle,
              description: hero.description || currentHeroData.description,
              trusted_text: hero.trusted_text || currentHeroData.trusted_text,
              status: hero.status || currentHeroData.status || 'draft'
            }

            // Only include colors if provided (temporary fix for missing column)
            if (hero.colors) {
              heroPayload.colors = hero.colors
            }
          } else {
            console.error('Hero not found for ID:', heroId)
            return
          }
        } else {
          // Use fallback to currentHero
          heroPayload = {
            title: hero.title || currentHero?.title || '',
            subtitle: hero.subtitle || currentHero?.subtitle || '',
            description: hero.description || currentHero?.description || '',
            trusted_text: hero.trusted_text || currentHero?.trusted_text || '',
            status: hero.status || currentHero?.status || 'draft'
          }

          // Only include colors if provided (temporary fix for missing column)
          if (hero.colors) {
            heroPayload.colors = hero.colors
          }
        }
      }

      console.log(`heroPayload:`, heroPayload)

      let result
      if (heroId) {
        console.log(`Updating specific hero with ID: ${heroId}`)
        result = await supabase
          .from('hero_content')
          .update(heroPayload)
          .eq('id', heroId)
        console.log(`Updated hero ${heroId} with payload:`, heroPayload)
      } else {
        // Update the most recent hero
        const { data: latestHero } = await supabase
          .from('hero_content')
          .select('id')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()

        if (latestHero?.id) {
          console.log(`Updating most recent hero with ID: ${latestHero.id}`)
          result = await supabase
            .from('hero_content')
            .update(heroPayload)
            .eq('id', latestHero.id)
          console.log(`Updated most recent hero ${latestHero.id} with payload:`, heroPayload)
        }
      }

      if (!result || result.error) {
        console.error('Error updating hero:', result?.error || 'Unknown error')
        return
      }

      console.log('Hero updated successfully, reloading content...')
      await loadHeroContent()
      console.log('Content reloaded after hero update')
    } catch (error) {
      console.error('Error updating hero:', error)
    }
  }

  const createHero = async (hero: Partial<HeroContent>) => {
    try {
      const heroPayload: any = {
        title: hero.title || "New Hero Section",
        subtitle: hero.subtitle || "",
        description: hero.description || "",
        trusted_text: hero.trusted_text || "New Content",
        status: 'draft' as const
      }

      // Only include colors if the column exists (temporary fix)
      if (hero.colors) {
        heroPayload.colors = hero.colors
      }

      const result = await supabase
        .from('hero_content')
        .insert(heroPayload)
        .select()
        .single()

      if (result.error) {
        console.error('Error creating hero:', result.error)
        return null
      }

      await loadHeroContent()
      return result.data
    } catch (error) {
      console.error('Error creating hero:', error)
      return null
    }
  }

  const deleteHero = async (heroId: string) => {
    console.log(`=== deleteHero FUNCTION STARTED ===`)
    console.log(`Deleting hero with ID: "${heroId}"`)

    try {
      // First, let's verify the hero exists before deleting
      console.log(`Checking if hero exists with ID: "${heroId}"`)
      const { data: existingHero, error: checkError } = await supabase
        .from('hero_content')
        .select('*')
        .eq('id', heroId)
        .single()

      console.log(`Hero existence check result:`, { existingHero, checkError })

      if (checkError) {
        console.error('Error checking hero existence:', checkError)
        throw new Error(`Hero not found or check failed: ${checkError.message}`)
      }

      if (!existingHero) {
        console.error(`Hero with ID "${heroId}" does not exist in database`)
        throw new Error(`Hero with ID "${heroId}" not found`)
      }

      console.log(`Hero found, proceeding with delete:`, existingHero)

      console.log(`Executing Supabase delete operation without .select()...`)
      const result = await supabase
        .from('hero_content')
        .delete()
        .eq('id', heroId)

      console.log(`Supabase delete result:`, result)
      console.log(`Delete error:`, result.error)

      if (result.error) {
        console.error('Error deleting hero:', result.error)
        console.error(`Error details:`, result.error)
        throw new Error(`Failed to delete hero: ${result.error.message}`)
      }

      // Since we removed .select(), we can't check if data was returned
      // But we can verify the delete worked by checking if the hero is gone
      console.log(`Verifying delete by checking if hero still exists...`)
      const { data: verifyDelete, error: verifyError } = await supabase
        .from('hero_content')
        .select('*')
        .eq('id', heroId)
        .maybeSingle() // Use maybeSingle() instead of single() to avoid 406 errors

      console.log(`Verification result:`, { verifyDelete, verifyError })

      if (!verifyError && verifyDelete) {
        console.error(`Hero still exists after delete operation!`)
        console.error(`This indicates a Row Level Security (RLS) policy issue in Supabase.`)
        console.error(`The delete operation returned 204 success but the RLS policy prevented actual deletion.`)
        throw new Error(`Delete operation failed due to database permissions. The hero section cannot be deleted because of Row Level Security (RLS) policies in Supabase. Please check your Supabase RLS policies for the 'hero_content' table.`)
      }

      if (verifyError) {
        // Handle various error codes that indicate the record was not found (which is good)
        const notFoundCodes = ['PGRST116', '406', '404']
        if (notFoundCodes.includes(verifyError.code) || notFoundCodes.includes(verifyError.message?.includes('406') ? '406' : '')) {
          console.log(`Hero successfully deleted (verification shows record not found)`)
        } else {
          console.error(`Unexpected verification error:`, verifyError)
          throw new Error(`Delete verification failed: ${verifyError.message}`)
        }
      }

      console.log(`Delete verified successfully - hero no longer exists`)
      console.log(`Delete operation successful, reloading content...`)
      await loadHeroContent()
      console.log(`Content reloaded after delete operation`)
      console.log(`=== deleteHero FUNCTION COMPLETED ===`)
      return { success: true }
    } catch (error) {
      console.error('Error deleting hero:', error)
      console.error(`Catch error details:`, error)
      throw error
    }
  }

  const publishHero = async (heroId?: string) => {
    console.log(`publishHero called with heroId: ${heroId}`)
    await updateHero({ status: 'published' }, heroId)
  }

  const unpublishHero = async (heroId?: string) => {
    console.log(`unpublishHero called with heroId: ${heroId}`)
    await updateHero({ status: 'draft' }, heroId)
  }

  return {
    heroes,
    currentHero,
    loading,
    updateHero,
    createHero,
    deleteHero,
    publishHero,
    unpublishHero,
    reloadHeroContent: loadHeroContent
  }
}