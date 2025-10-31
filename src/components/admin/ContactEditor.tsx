import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'
import { useAdminContent } from '@/hooks/useAdminContent'

export function ContactEditor() {
  const { content, updateContact } = useAdminContent()
  const [formData, setFormData] = useState({
    address: content.contact?.address || '',
    phone: content.contact?.phone || '',
    email: content.contact?.email || '',
    businessHours: {
      weekdays: content.contact?.businessHours?.weekdays || '',
      saturday: content.contact?.businessHours?.saturday || '',
      sunday: content.contact?.businessHours?.sunday || ''
    }
  })

  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Update form data when content changes
  useEffect(() => {
    setFormData({
      address: content.contact?.address || '',
      phone: content.contact?.phone || '',
      email: content.contact?.email || '',
      businessHours: {
        weekdays: content.contact?.businessHours?.weekdays || '',
        saturday: content.contact?.businessHours?.saturday || '',
        sunday: content.contact?.businessHours?.sunday || ''
      }
    })
  }, [content.contact])

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      // Update contact content to database
      const success = await updateContact({
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        businessHours: {
          weekdays: formData.businessHours.weekdays,
          saturday: formData.businessHours.saturday,
          sunday: formData.businessHours.sunday
        }
      })

      if (success) {
        setSaveStatus('success')
        setSuccessMessage('Contact information updated successfully!')
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
      // Error updating contact
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBusinessHoursChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [field]: value
      }
    }))
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    // Simple phone validation - allows numbers, +, -, spaces, and parentheses
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phoneRegex.test(phone)
  }

  const isValid =
    formData.address.trim() !== '' &&
    validateEmail(formData.email) &&
    validatePhone(formData.phone) &&
    formData.businessHours.weekdays.trim() !== '' &&
    formData.businessHours.saturday.trim() !== '' &&
    formData.businessHours.sunday.trim() !== ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Information</h1>
          <p className="text-gray-600 mt-1">Manage company contact details and business hours</p>
        </div>
      </div>

      {/* Main Content Editor */}
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Address */}
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Office Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter the complete office address..."
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="min-h-[100px] mt-1"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+62 21 1234 5678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                />
                {formData.phone && !validatePhone(formData.phone) && (
                  <p className="text-sm text-red-600 mt-1">Please enter a valid phone number</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@quasarcapital.co.id"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                />
                {formData.email && !validateEmail(formData.email) && (
                  <p className="text-sm text-red-600 mt-1">Please enter a valid email address</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-gray-600 mb-4">
                Set your operating hours for each day of the week
              </div>

              {/* Weekdays */}
              <div>
                <Label htmlFor="weekdays" className="text-sm font-medium text-gray-700">
                  Monday - Friday
                </Label>
                <Input
                  id="weekdays"
                  placeholder="9:00 AM - 6:00 PM"
                  value={formData.businessHours.weekdays}
                  onChange={(e) => handleBusinessHoursChange('weekdays', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">e.g., "9:00 AM - 6:00 PM"</p>
              </div>

              {/* Saturday */}
              <div>
                <Label htmlFor="saturday" className="text-sm font-medium text-gray-700">
                  Saturday
                </Label>
                <Input
                  id="saturday"
                  placeholder="9:00 AM - 1:00 PM"
                  value={formData.businessHours.saturday}
                  onChange={(e) => handleBusinessHoursChange('saturday', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">e.g., "9:00 AM - 1:00 PM" or "Closed"</p>
              </div>

              {/* Sunday */}
              <div>
                <Label htmlFor="sunday" className="text-sm font-medium text-gray-700">
                  Sunday
                </Label>
                <Input
                  id="sunday"
                  placeholder="Closed"
                  value={formData.businessHours.sunday}
                  onChange={(e) => handleBusinessHoursChange('sunday', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">e.g., "Closed" or "10:00 AM - 2:00 PM"</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving || !isValid} className="bg-sky-600 hover:bg-sky-700">
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