import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Save,
  Building,
  Share2,
  Upload,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Settings,
  Search,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Palette,
  Droplet
} from 'lucide-react'
import { useSettingsContent } from '@/hooks/useSettingsContent'

export function SettingsEditor() {
  const { settings, loading, updateCompanyInfo, updateSEOSettings, updateSocialMedia, updateThemeColors, uploadLogo } = useSettingsContent()
  const [activeTab, setActiveTab] = useState('company')
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)

  // Form states
  const [companyInfo, setCompanyInfo] = useState({
    company_name: '',
    company_tagline: '',
    company_description: '',
    logo_url: '',
    favicon_url: '',
    website_url: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  })

  const [seoSettings, setSeoSettings] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_image_url: '',
    twitter_handle: ''
  })

  const [socialMedia, setSocialMedia] = useState({
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: ''
  })

  const [themeColors, setThemeColors] = useState({
    primary_button_color: '#0EA5E9',
    primary_button_hover_color: '#0284C7',
    secondary_button_color: '#64748B',
    secondary_button_hover_color: '#475569',
    badge_color: '#3B82F6',
    badge_hover_color: '#2563EB',
    section_title_badge_color: '#10B981',
    section_title_badge_hover_color: '#059669',
    footer_background_color: '#1F2937',
    footer_text_color: '#F9FAFB',
    footer_link_color: '#D1D5DB',
    footer_link_hover_color: '#F9FAFB'
  })

  // Update form data when settings change
  useEffect(() => {
    if (settings) {
      setCompanyInfo({
        company_name: settings.company_name || '',
        company_tagline: settings.company_tagline || '',
        company_description: settings.company_description || '',
        logo_url: settings.logo_url || '',
        favicon_url: settings.favicon_url || '',
        website_url: settings.website_url || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        address: settings.address || ''
      })

      setSeoSettings({
        meta_title: settings.meta_title || '',
        meta_description: settings.meta_description || '',
        meta_keywords: settings.meta_keywords || '',
        og_image_url: settings.og_image_url || '',
        twitter_handle: settings.twitter_handle || ''
      })

      setSocialMedia({
        facebook_url: settings.facebook_url || '',
        twitter_url: settings.twitter_url || '',
        linkedin_url: settings.linkedin_url || '',
        instagram_url: settings.instagram_url || ''
      })

      setThemeColors({
        primary_button_color: settings.primary_button_color || '#0EA5E9',
        primary_button_hover_color: settings.primary_button_hover_color || '#0284C7',
        secondary_button_color: settings.secondary_button_color || '#64748B',
        secondary_button_hover_color: settings.secondary_button_hover_color || '#475569',
        badge_color: settings.badge_color || '#3B82F6',
        badge_hover_color: settings.badge_hover_color || '#2563EB',
        section_title_badge_color: settings.section_title_badge_color || '#10B981',
        section_title_badge_hover_color: settings.section_title_badge_hover_color || '#059669',
        footer_background_color: settings.footer_background_color || '#1F2937',
        footer_text_color: settings.footer_text_color || '#F9FAFB',
        footer_link_color: settings.footer_link_color || '#D1D5DB',
        footer_link_hover_color: settings.footer_link_hover_color || '#F9FAFB'
      })
    }
  }, [settings])

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingLogo(true)
      const logoUrl = await uploadLogo(file)

      if (logoUrl) {
        setCompanyInfo(prev => ({ ...prev, logo_url: logoUrl }))
        setSuccessMessage('Logo uploaded successfully!')
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 3000)
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSaveCompanyInfo = async () => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      const success = await updateCompanyInfo(companyInfo)

      if (success) {
        setSaveStatus('success')
        setSuccessMessage('Company information updated successfully!')
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 3000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Error saving company info:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSEOSettings = async () => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      const success = await updateSEOSettings(seoSettings)

      if (success) {
        setSaveStatus('success')
        setSuccessMessage('SEO settings updated successfully!')
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 3000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSocialMedia = async () => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      const success = await updateSocialMedia(socialMedia)

      if (success) {
        setSaveStatus('success')
        setSuccessMessage('Social media links updated successfully!')
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 3000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Error saving social media:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveThemeColors = async () => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      const success = await updateThemeColors(themeColors)

      if (success) {
        setSaveStatus('success')
        setSuccessMessage('Theme colors updated successfully!')
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 3000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Error saving theme colors:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Website Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage company information, SEO, and social media</p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Company Info
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            SEO Settings
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Theme Colors
          </TabsTrigger>
        </TabsList>

        {/* Company Information Tab */}
        <TabsContent value="company" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">
                    Company Name *
                  </Label>
                  <Input
                    id="company_name"
                    value={companyInfo.company_name}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, company_name: e.target.value }))}
                    className="mt-1"
                    placeholder="PT Quasar Capital"
                  />
                </div>

                <div>
                  <Label htmlFor="company_tagline" className="text-sm font-medium text-gray-700">
                    Tagline
                  </Label>
                  <Input
                    id="company_tagline"
                    value={companyInfo.company_tagline}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, company_tagline: e.target.value }))}
                    className="mt-1"
                    placeholder="Investment Advisory Excellence"
                  />
                </div>

                <div>
                  <Label htmlFor="company_description" className="text-sm font-medium text-gray-700">
                    Company Description
                  </Label>
                  <Textarea
                    id="company_description"
                    value={companyInfo.company_description}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, company_description: e.target.value }))}
                    className="mt-1 min-h-[100px]"
                    placeholder="Brief description of your company..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="website_url" className="text-sm font-medium text-gray-700">
                    Website URL
                  </Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={companyInfo.website_url}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, website_url: e.target.value }))}
                    className="mt-1"
                    placeholder="https://quasarcapital.co.id"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_email" className="text-sm font-medium text-gray-700">
                    Contact Email
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={companyInfo.contact_email}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, contact_email: e.target.value }))}
                    className="mt-1"
                    placeholder="info@quasarcapital.co.id"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_phone" className="text-sm font-medium text-gray-700">
                    Contact Phone
                  </Label>
                  <Input
                    id="contact_phone"
                    value={companyInfo.contact_phone}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, contact_phone: e.target.value }))}
                    className="mt-1"
                    placeholder="+62 21 1234 5678"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="mt-1 min-h-[80px]"
                    placeholder="Complete company address..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Company Logo</Label>
                <div className="mt-2 flex items-center gap-6">
                  {companyInfo.logo_url && (
                    <div className="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden">
                      <img
                        src={companyInfo.logo_url}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      id="logo_upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('logo_upload')?.click()}
                      disabled={uploadingLogo}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: PNG, JPG, max 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <Label htmlFor="logo_url" className="text-sm font-medium text-gray-700">
                  Logo URL
                </Label>
                <Input
                  id="logo_url"
                  value={companyInfo.logo_url}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, logo_url: e.target.value }))}
                  className="mt-1"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              {/* Favicon URL */}
              <div>
                <Label htmlFor="favicon_url" className="text-sm font-medium text-gray-700">
                  Favicon URL
                </Label>
                <Input
                  id="favicon_url"
                  value={companyInfo.favicon_url}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, favicon_url: e.target.value }))}
                  className="mt-1"
                  placeholder="https://example.com/favicon.ico"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Should be 32x32px or 16x16px, .ico or .png format
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3">
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Failed to save</span>
              </div>
            )}
            <Button
              onClick={handleSaveCompanyInfo}
              disabled={saving || !companyInfo.company_name.trim()}
              className="bg-sky-600 hover:bg-sky-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Company Info'}
            </Button>
          </div>
        </TabsContent>

        {/* SEO Settings Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Engine Optimization
              </CardTitle>
              <p className="text-sm text-gray-600">
                Configure how your website appears in search results
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="meta_title" className="text-sm font-medium text-gray-700">
                  Meta Title
                </Label>
                <Input
                  id="meta_title"
                  value={seoSettings.meta_title}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="mt-1"
                  placeholder="PT Quasar Capital - Investment Advisory Excellence"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended length: 50-60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta_description" className="text-sm font-medium text-gray-700">
                  Meta Description
                </Label>
                <Textarea
                  id="meta_description"
                  value={seoSettings.meta_description}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, meta_description: e.target.value }))}
                  className="mt-1 min-h-[100px]"
                  placeholder="Leading investment advisory firm in Indonesia providing comprehensive financial solutions..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended length: 150-160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta_keywords" className="text-sm font-medium text-gray-700">
                  Meta Keywords
                </Label>
                <Input
                  id="meta_keywords"
                  value={seoSettings.meta_keywords}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, meta_keywords: e.target.value }))}
                  className="mt-1"
                  placeholder="investment advisory, financial consulting, PT Quasar Capital, M&A advisory"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate keywords with commas
                </p>
              </div>

              <div>
                <Label htmlFor="og_image_url" className="text-sm font-medium text-gray-700">
                  Open Graph Image URL
                </Label>
                <Input
                  id="og_image_url"
                  value={seoSettings.og_image_url}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, og_image_url: e.target.value }))}
                  className="mt-1"
                  placeholder="/hero-og-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 1200x630px, .jpg or .png format
                </p>
              </div>

              <div>
                <Label htmlFor="twitter_handle" className="text-sm font-medium text-gray-700">
                  Twitter Handle
                </Label>
                <Input
                  id="twitter_handle"
                  value={seoSettings.twitter_handle}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, twitter_handle: e.target.value }))}
                  className="mt-1"
                  placeholder="@quasarcapital"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include @ symbol
                </p>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-3">
                {saveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Failed to save</span>
                  </div>
                )}
                <Button
                  onClick={handleSaveSEOSettings}
                  disabled={saving}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save SEO Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Social Media Links
              </CardTitle>
              <p className="text-sm text-gray-600">
                Connect your social media profiles
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="facebook_url" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook URL
                </Label>
                <Input
                  id="facebook_url"
                  value={socialMedia.facebook_url}
                  onChange={(e) => setSocialMedia(prev => ({ ...prev, facebook_url: e.target.value }))}
                  className="mt-1"
                  placeholder="https://facebook.com/quasarcapital"
                />
              </div>

              <div>
                <Label htmlFor="twitter_url" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter URL
                </Label>
                <Input
                  id="twitter_url"
                  value={socialMedia.twitter_url}
                  onChange={(e) => setSocialMedia(prev => ({ ...prev, twitter_url: e.target.value }))}
                  className="mt-1"
                  placeholder="https://twitter.com/quasarcapital"
                />
              </div>

              <div>
                <Label htmlFor="linkedin_url" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin_url"
                  value={socialMedia.linkedin_url}
                  onChange={(e) => setSocialMedia(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  className="mt-1"
                  placeholder="https://linkedin.com/company/quasarcapital"
                />
              </div>

              <div>
                <Label htmlFor="instagram_url" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram URL
                </Label>
                <Input
                  id="instagram_url"
                  value={socialMedia.instagram_url}
                  onChange={(e) => setSocialMedia(prev => ({ ...prev, instagram_url: e.target.value }))}
                  className="mt-1"
                  placeholder="https://instagram.com/quasarcapital"
                />
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-3">
                {saveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Failed to save</span>
                  </div>
                )}
                <Button
                  onClick={handleSaveSocialMedia}
                  disabled={saving}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Social Media'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Colors Tab */}
        <TabsContent value="theme" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Button Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Droplet className="w-5 h-5" />
                  Button Colors
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Primary and secondary button colors
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="primary_button_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    Primary Button
                    <span className="text-xs text-gray-500">Main CTA</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="primary_button_color"
                      type="color"
                      value={themeColors.primary_button_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, primary_button_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.primary_button_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, primary_button_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#0EA5E9"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="primary_button_hover_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    Primary Hover
                    <span className="text-xs text-gray-500">Mouse over</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="primary_button_hover_color"
                      type="color"
                      value={themeColors.primary_button_hover_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, primary_button_hover_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.primary_button_hover_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, primary_button_hover_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#0284C7"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary_button_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    Secondary Button
                    <span className="text-xs text-gray-500">Alternative</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="secondary_button_color"
                      type="color"
                      value={themeColors.secondary_button_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, secondary_button_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.secondary_button_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, secondary_button_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#64748B"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary_button_hover_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    Secondary Hover
                    <span className="text-xs text-gray-500">Mouse over</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="secondary_button_hover_color"
                      type="color"
                      value={themeColors.secondary_button_hover_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, secondary_button_hover_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.secondary_button_hover_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, secondary_button_hover_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#475569"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badge Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Droplet className="w-5 h-5" />
                  Badge Colors
                </CardTitle>
                <p className="text-sm text-gray-600">
                  UI badges and section titles
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="badge_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    General Badge
                    <span className="text-xs text-gray-500">Default</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="badge_color"
                      type="color"
                      value={themeColors.badge_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, badge_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.badge_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, badge_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="badge_hover_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    Badge Hover
                    <span className="text-xs text-gray-500">Mouse over</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="badge_hover_color"
                      type="color"
                      value={themeColors.badge_hover_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, badge_hover_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.badge_hover_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, badge_hover_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#2563EB"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="section_title_badge_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    Section Title Badge
                    <span className="text-xs text-gray-500">Headers</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="section_title_badge_color"
                      type="color"
                      value={themeColors.section_title_badge_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, section_title_badge_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.section_title_badge_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, section_title_badge_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#10B981"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="section_title_badge_hover_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    Section Title Hover
                    <span className="text-xs text-gray-500">Mouse over</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="section_title_badge_hover_color"
                      type="color"
                      value={themeColors.section_title_badge_hover_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, section_title_badge_hover_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.section_title_badge_hover_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, section_title_badge_hover_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#059669"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Droplet className="w-5 h-5" />
                  Footer Colors
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Footer appearance
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="footer_background_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    Footer Background
                    <span className="text-xs text-gray-500">Base color</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="footer_background_color"
                      type="color"
                      value={themeColors.footer_background_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, footer_background_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.footer_background_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, footer_background_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#1F2937"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="footer_text_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    Footer Text
                    <span className="text-xs text-gray-500">Content</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="footer_text_color"
                      type="color"
                      value={themeColors.footer_text_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, footer_text_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.footer_text_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, footer_text_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#F9FAFB"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="footer_link_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    Footer Links
                    <span className="text-xs text-gray-500">Default</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="footer_link_color"
                      type="color"
                      value={themeColors.footer_link_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, footer_link_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.footer_link_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, footer_link_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#D1D5DB"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="footer_link_hover_color" className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                    Footer Links Hover
                    <span className="text-xs text-gray-500">Mouse over</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="footer_link_hover_color"
                      type="color"
                      value={themeColors.footer_link_hover_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, footer_link_hover_color: e.target.value }))}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                      style={{ padding: '2px' }}
                    />
                    <Input
                      type="text"
                      value={themeColors.footer_link_hover_color}
                      onChange={(e) => setThemeColors(prev => ({ ...prev, footer_link_hover_color: e.target.value }))}
                      className="flex-1"
                      placeholder="#F9FAFB"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3">
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Failed to save</span>
              </div>
            )}
            <Button
              onClick={handleSaveThemeColors}
              disabled={saving}
              className="bg-sky-600 hover:bg-sky-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Theme Colors'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Success Notification Toast */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">{successMessage}</p>
            <p className="text-sm text-green-600">Changes have been saved successfully</p>
          </div>
          <button
            onClick={() => setShowSuccessNotification(false)}
            className="ml-4 text-green-600 hover:text-green-800 transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}