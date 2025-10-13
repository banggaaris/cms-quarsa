import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
import { useHeroContent } from '@/hooks/useHeroContent'
import { Save, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react'

interface HeroData {
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

export function HeroPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const navigate = useNavigate()
  const { heroes, updateHero, createHero } = useHeroContent()
  const [isCreating, setIsCreating] = useState(false)
  const [heroData, setHeroData] = useState<HeroData>({
    id: "",
    title: "New Hero Section",
    subtitle: "",
    description: "",
    trusted_text: "New Content",
    status: 'draft',
    colors: {
      titleColor: "#111827",
      subtitleColor: "#dc2626",
      descriptionColor: "#4b5563",
      trustedBadgeTextColor: "#1e40af",
      trustedBadgeBgColor: "#dbeafe"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Initialize based on whether we're creating or editing
  useEffect(() => {
    if (uuid === 'new') {
      setIsCreating(true)
      setHeroData({
        id: "",
        title: "New Hero Section",
        subtitle: "",
        description: "",
        trusted_text: "New Content",
        status: 'draft',
        colors: {
          titleColor: "#111827",
          subtitleColor: "#dc2626",
          descriptionColor: "#4b5563",
          trustedBadgeTextColor: "#1e40af",
          trustedBadgeBgColor: "#dbeafe"
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } else {
      // Find the hero with the matching UUID
      const hero = heroes?.find(h => h.id === uuid)
      if (hero) {
        setIsCreating(false)
        setHeroData({
          id: hero.id,
          title: hero.title,
          subtitle: hero.subtitle,
          description: hero.description,
          trusted_text: hero.trusted_text,
          status: hero.status,
          colors: hero.colors || {
            titleColor: "#111827",
            subtitleColor: "#dc2626",
            descriptionColor: "#4b5563",
            trustedBadgeTextColor: "#1e40af",
            trustedBadgeBgColor: "#dbeafe"
          },
          created_at: hero.created_at,
          updated_at: hero.updated_at
        })
      }
    }
  }, [uuid, heroes])

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      if (isCreating) {
        const newHero = await createHero(heroData)
        if (newHero) {
          setSaveStatus('success')
          setSuccessMessage('Hero section created successfully!')

          // Show success notification and redirect to hero list
          setTimeout(() => {
            setSaveStatus('idle')
            setShowSuccessNotification(true)

            // Redirect to hero list after showing notification
            setTimeout(() => {
              navigate('/admin/hero')
            }, 2000)
          }, 1000)
        }
      } else {
        await updateHero(heroData, uuid)
        setSaveStatus('success')
        setSuccessMessage('Hero section updated successfully!')

        // Show success notification and redirect to hero list
        setTimeout(() => {
          setSaveStatus('idle')
          setShowSuccessNotification(true)

          // Redirect to hero list after showing notification
          setTimeout(() => {
            navigate('/admin/hero')
          }, 2000)
        }, 1000)
      }
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setHeroData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleColorChange = (colorField: string, value: string) => {
    setHeroData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorField]: value
      }
    }))
  }

  const handleBack = () => {
    navigate('/admin/hero')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hero Sections
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isCreating ? 'Create New Hero Section' : 'Edit Hero Section'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isCreating
                ? 'New sections will be created as draft status by default'
                : 'Changes will be saved immediately'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Hero Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              placeholder="Enter main title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={heroData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              placeholder="Enter subtitle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={heroData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trusted Badge Text
            </label>
            <input
              type="text"
              value={heroData.trusted_text}
              onChange={(e) => handleInputChange('trusted_text', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              placeholder="Enter trusted badge text"
            />
          </div>

          {/* Color Settings Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Title Color"
                value={heroData.colors?.titleColor || "#111827"}
                onChange={(e) => handleColorChange('titleColor', e.target.value)}
              />

              <ColorPicker
                label="Subtitle Color"
                value={heroData.colors?.subtitleColor || "#dc2626"}
                onChange={(e) => handleColorChange('subtitleColor', e.target.value)}
              />

              <ColorPicker
                label="Description Color"
                value={heroData.colors?.descriptionColor || "#4b5563"}
                onChange={(e) => handleColorChange('descriptionColor', e.target.value)}
              />

              <ColorPicker
                label="Trusted Badge Text Color"
                value={heroData.colors?.trustedBadgeTextColor || "#1e40af"}
                onChange={(e) => handleColorChange('trustedBadgeTextColor', e.target.value)}
              />

              <ColorPicker
                label="Trusted Badge Background Color"
                value={heroData.colors?.trustedBadgeBgColor || "#dbeafe"}
                onChange={(e) => handleColorChange('trustedBadgeBgColor', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={saving} className="bg-sky-600 hover:bg-sky-700">
                <Save className="w-4 h-4 mr-2" />
                {saving ? (isCreating ? 'Creating...' : 'Saving...') : (isCreating ? 'Create Hero' : 'Save Changes')}
              </Button>

              <Button variant="outline" onClick={handleBack}>
                Cancel
              </Button>

              {/* Error Status Indicator Only */}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Failed to save</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Toast */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">{successMessage}</p>
            <p className="text-sm text-green-600">Changes have been saved to the database</p>
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