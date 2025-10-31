import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface CompanySettings {
  id: string
  company_name: string
  company_tagline: string
  company_description?: string
  logo_url?: string
  favicon_url?: string
  website_url: string
  contact_email: string
  contact_phone: string
  address?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image_url?: string
  twitter_handle?: string
  facebook_url?: string
  twitter_url?: string
  linkedin_url?: string
  instagram_url?: string
  // Theme Colors
  primary_button_color?: string
  primary_button_hover_color?: string
  secondary_button_color?: string
  secondary_button_hover_color?: string
  badge_color?: string
  badge_hover_color?: string
  section_title_badge_color?: string
  section_title_badge_hover_color?: string
  footer_background_color?: string
  footer_text_color?: string
  footer_link_color?: string
  footer_link_hover_color?: string
  created_at?: string
  updated_at?: string
}

export function useSettingsContent() {
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('company_settings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (fetchError) {
        // Error('Error loading settings:', fetchError)
        setError(fetchError.message)
        return
      }

      if (data) {
        setSettings(data as CompanySettings)
      }
    } catch (err) {
      // Error('Error loading settings:', err)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (settingsData: Partial<CompanySettings>) => {
    try {
      setError(null)

      if (!settings?.id) {
        setError('No active settings found')
        return null
      }

      const { data, error: updateError } = await supabase
        .from('company_settings')
        .update({
          ...settingsData,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id)
        .select()
        .single()

      if (updateError) {
        // Error('Error updating settings:', updateError)
        setError(updateError.message)
        return null
      }

      if (data) {
        setSettings(data as CompanySettings)
        return data as CompanySettings
      }
    } catch (err) {
      // Error('Error updating settings:', err)
      setError('Failed to update settings')
      return null
    }
  }

  const updateCompanyInfo = async (companyInfo: {
    company_name: string
    company_tagline: string
    company_description?: string
    logo_url?: string
    favicon_url?: string
    website_url?: string
    contact_email?: string
    contact_phone?: string
    address?: string
  }) => {
    return await updateSettings(companyInfo)
  }

  const updateSEOSettings = async (seoData: {
    meta_title?: string
    meta_description?: string
    meta_keywords?: string
    og_image_url?: string
    twitter_handle?: string
  }) => {
    return await updateSettings(seoData)
  }

  const updateSocialMedia = async (socialData: {
    facebook_url?: string
    twitter_url?: string
    linkedin_url?: string
    instagram_url?: string
  }) => {
    return await updateSettings(socialData)
  }

  const updateThemeColors = async (themeData: {
    primary_button_color?: string
    primary_button_hover_color?: string
    secondary_button_color?: string
    secondary_button_hover_color?: string
    badge_color?: string
    badge_hover_color?: string
    section_title_badge_color?: string
    section_title_badge_hover_color?: string
    footer_background_color?: string
    footer_text_color?: string
    footer_link_color?: string
    footer_link_hover_color?: string
  }) => {
    return await updateSettings(themeData)
  }

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `company-logo-${Date.now()}.${fileExt}`
      const filePath = `company-logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        // Error('Error uploading logo:', uploadError)
        throw uploadError
      }

      const { data: publicUrlData } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath)

      return publicUrlData.publicUrl
    } catch (err) {
      // Error('Error uploading logo:', err)
      throw err
    }
  }

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateSettings,
    updateCompanyInfo,
    updateSEOSettings,
    updateSocialMedia,
    updateThemeColors,
    uploadLogo
  }
}