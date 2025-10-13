import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ColorPicker } from '@/components/ui/color-picker'
import { Save, AlertCircle } from 'lucide-react'

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

interface HeroModalProps {
  isOpen: boolean
  onClose: () => void
  heroData: HeroData
  onInputChange: (field: string, value: string) => void
  onColorChange: (colorField: string, value: string) => void
  onSave: () => Promise<void>
  isCreating: boolean
  saving: boolean
  saveStatus: 'idle' | 'success' | 'error'
}

export function HeroModal({
  isOpen,
  onClose,
  heroData,
  onInputChange,
  onColorChange,
  onSave,
  isCreating,
  saving,
  saveStatus
}: HeroModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isCreating ? 'Create New Hero Section' : 'Edit Hero Section'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isCreating
              ? 'New sections will be created as draft status by default'
              : 'Changes will be saved immediately'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
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
              onChange={(e) => onInputChange('subtitle', e.target.value)}
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
              onChange={(e) => onInputChange('description', e.target.value)}
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
              onChange={(e) => onInputChange('trusted_text', e.target.value)}
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
                onChange={(e) => onColorChange('titleColor', e.target.value)}
              />

              <ColorPicker
                label="Subtitle Color"
                value={heroData.colors?.subtitleColor || "#dc2626"}
                onChange={(e) => onColorChange('subtitleColor', e.target.value)}
              />

              <ColorPicker
                label="Description Color"
                value={heroData.colors?.descriptionColor || "#4b5563"}
                onChange={(e) => onColorChange('descriptionColor', e.target.value)}
              />

              <ColorPicker
                label="Trusted Badge Text Color"
                value={heroData.colors?.trustedBadgeTextColor || "#1e40af"}
                onChange={(e) => onColorChange('trustedBadgeTextColor', e.target.value)}
              />

              <ColorPicker
                label="Trusted Badge Background Color"
                value={heroData.colors?.trustedBadgeBgColor || "#dbeafe"}
                onChange={(e) => onColorChange('trustedBadgeBgColor', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <Button onClick={onSave} disabled={saving} className="bg-sky-600 hover:bg-sky-700">
                <Save className="w-4 h-4 mr-2" />
                {saving ? (isCreating ? 'Creating...' : 'Saving...') : (isCreating ? 'Create Hero' : 'Save Changes')}
              </Button>

              <Button variant="outline" onClick={onClose}>
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
      </DialogContent>
    </Dialog>
  )
}