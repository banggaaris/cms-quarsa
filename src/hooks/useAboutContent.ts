import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface AboutContent {
  title: string
  description1: string
  description2: string
  mission: string
  vision: string
  gradientFromColor: string
  gradientToColor: string
}

const defaultAboutContent: AboutContent = {
  title: "Leading Investment Advisory Firm",
  description1: "Founded in 1994, PT Quasar Capital has established itself as Indonesia's premier investment advisory firm, combining deep local expertise with global best practices.",
  description2: "Our team of seasoned professionals brings decades of experience in investment banking, corporate restructuring, and strategic advisory services to help clients navigate complex financial challenges and seize growth opportunities.",
  mission: "To provide exceptional investment advisory services that create sustainable value for our clients through strategic insight, operational excellence, and unwavering commitment to success.",
  vision: "To be the most trusted investment advisory partner in Southeast Asia, recognized for our integrity, expertise, and transformative impact on businesses and economies.",
  gradientFromColor: "#0c4a6e",
  gradientToColor: "#111827"
}

export function useAboutContent() {
  const [about, setAbout] = useState<AboutContent>(defaultAboutContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAboutContent()
  }, [])

  const loadAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        // Error('Error loading about content:', error)
      } else if (data) {
        setAbout({
          title: data.title,
          description1: data.description1,
          description2: data.description2,
          mission: data.mission,
          vision: data.vision,
          gradientFromColor: data.gradient_from_color || "#0c4a6e",
          gradientToColor: data.gradient_to_color || "#111827"
        })
      }
    } catch (error) {
      // Error('Error loading about content:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAbout = async (aboutUpdate: Partial<AboutContent>) => {
        try {
      const aboutPayload = {
        title: aboutUpdate.title || about.title,
        description1: aboutUpdate.description1 || about.description1,
        description2: aboutUpdate.description2 || about.description2,
        mission: aboutUpdate.mission || about.mission,
        vision: aboutUpdate.vision || about.vision,
        gradient_from_color: aboutUpdate.gradientFromColor || about.gradientFromColor,
        gradient_to_color: aboutUpdate.gradientToColor || about.gradientToColor
      }

      // Check if about content already exists
      const { data: existingAbout } = await supabase
        .from('about_content')
        .select('id')
        .limit(1)
        .single()

      let result
      if (existingAbout?.id) {
        // Update existing record
        result = await supabase
          .from('about_content')
          .update(aboutPayload)
          .eq('id', existingAbout.id)
              } else {
        // Insert new record
        result = await supabase
          .from('about_content')
          .insert(aboutPayload)
              }

      if (!result || result.error) {
        // Error('Error updating about content:', result?.error || 'Unknown error')
        return false
      }

      // Update local state
      setAbout(prev => ({ ...prev, ...aboutUpdate }))
            return true
    } catch (error) {
      // Error('Error updating about:', error)
      return false
    }
  }

  return {
    about,
    loading,
    updateAbout,
    reloadAboutContent: loadAboutContent
  }
}