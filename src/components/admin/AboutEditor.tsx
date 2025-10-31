import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { useAboutContent } from '@/hooks/useAboutContent'
import { Save, CheckCircle, AlertCircle, Building, Target, Palette, Eye } from 'lucide-react'

export function AboutEditor() {
  const { about, loading, updateAbout } = useAboutContent()
  const [aboutData, setAboutData] = useState(about)

  // Update aboutData when about changes
  useEffect(() => {
    setAboutData(about)
  }, [about])
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      // Update about content to database
      const success = await updateAbout(aboutData)

      if (success) {
        setSaveStatus('success')
        setSuccessMessage('About section updated successfully!')
        setShowSuccessNotification(true)

        // Hide success notification after 3 seconds
        setTimeout(() => {
          setShowSuccessNotification(false)
        }, 3000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setAboutData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleColorChange = (colorField: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      [colorField]: value
    }))
  }

  // Ensure aboutData has color fields initialized
  useEffect(() => {
    if (aboutData && !aboutData.gradientFromColor) {
      setAboutData(prev => ({
        ...prev,
        gradientFromColor: "#0c4a6e",
        gradientToColor: "#111827"
      }))
    }
  }, [aboutData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border border-sky-600 border-t-transparent"></div>
      </div>
    )
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Section</h1>
          <p className="text-gray-600 mt-1">Manage company information and value proposition</p>
        </div>
      </div>

      {/* Main Content Editor */}
      <div className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-sky-600" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Title
              </label>
              <input
                type="text"
                value={aboutData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                placeholder="Enter main title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Description
              </label>
              <textarea
                value={aboutData.description1}
                onChange={(e) => handleInputChange('description1', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                placeholder="Enter first description paragraph"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Description
              </label>
              <textarea
                value={aboutData.description2}
                onChange={(e) => handleInputChange('description2', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                placeholder="Enter second description paragraph"
              />
            </div>
          </CardContent>
        </Card>

        {/* Visibility Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-sky-600" />
              Visibility Settings
            </CardTitle>
            <p className="text-sm text-gray-600">Control which sections are visible on the About Us page</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleSwitch
              label="Show Mission Statement"
              description="Display the mission statement section on the About Us page"
              checked={aboutData.showMission}
              onChange={(checked) => handleInputChange('showMission', checked)}
            />

            <ToggleSwitch
              label="Show Vision Statement"
              description="Display the vision statement section on the About Us page"
              checked={aboutData.showVision}
              onChange={(checked) => handleInputChange('showVision', checked)}
            />
          </CardContent>
        </Card>

        {/* Vision & Mission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-600" />
              Vision & Mission Content
            </CardTitle>
            <p className="text-sm text-gray-600">
              Edit the content for mission and vision statements. These will only be visible if enabled above.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                value={aboutData.mission}
                onChange={(e) => handleInputChange('mission', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                placeholder="Enter mission statement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision Statement
              </label>
              <textarea
                value={aboutData.vision}
                onChange={(e) => handleInputChange('vision', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                placeholder="Enter vision statement"
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-sky-600" />
              Gradient Background Colors
            </CardTitle>
            <p className="text-sm text-gray-600">Customize the gradient background colors for the mission & vision section</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Gradient Start Color"
                value={aboutData.gradientFromColor || "#0c4a6e"}
                onChange={(e) => handleColorChange('gradientFromColor', e.target.value)}
              />
              <ColorPicker
                label="Gradient End Color"
                value={aboutData.gradientToColor || "#111827"}
                onChange={(e) => handleColorChange('gradientToColor', e.target.value)}
              />
            </div>
            <div className="mt-4 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div
                className="rounded-lg p-4 text-white text-center"
                style={{
                  background: `linear-gradient(to bottom right, ${aboutData.gradientFromColor || "#0c4a6e"}, ${aboutData.gradientToColor || "#111827"})`
                }}
              >
                <p className="text-sm font-medium">Mission & Vision Section</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} className="bg-sky-600 hover:bg-sky-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>

          {/* Save Status Indicator */}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Failed to save</span>
            </div>
          )}
        </div>
      </div>

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
            X
          </button>
        </div>
      )}
    </div>
  )
}