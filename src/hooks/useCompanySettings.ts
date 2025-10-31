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

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        // Error loading company settings
        // Set default values if there's an error
        setSettings({
          id: '',
          company_name: 'PT Quasar Investama',
          company_tagline: 'Investment Advisory Excellence',
          website_url: 'https://quasarcapital.co.id',
          contact_email: 'info@quasarcapital.co.id',
          contact_phone: '+62 21 1234 5678',
          meta_title: 'PT Quasar Investama - Investment Advisory Excellence',
          meta_description: 'Leading investment advisory firm in Indonesia providing comprehensive financial solutions.',
          meta_keywords: 'investment advisory, financial consulting, PT Quasar Investama, M&A advisory, corporate restructuring, Indonesia investment'
        } as CompanySettings)
      } else if (data) {
        setSettings(data as CompanySettings)
      }
    } catch (err) {
      // Error loading company settings
    } finally {
      setLoading(false)
    }
  }

  return {
    settings,
    loading
  }
}