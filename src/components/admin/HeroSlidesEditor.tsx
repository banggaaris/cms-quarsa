import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useHeroSlides } from '@/hooks/useHeroSlides'
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Image
} from 'lucide-react'

interface SlideFormData {
  title: string
  description: string
  image_url: string
}

export function HeroSlidesEditor() {
  const { slides, loading, createSlide, updateSlide, deleteSlide, reorderSlides, publishSlide, unpublishSlide } = useHeroSlides()
  const [editingSlide, setEditingSlide] = useState<string | null>(null)
  const [formData, setFormData] = useState<SlideFormData>({
    title: '',
    description: '',
    image_url: ''
  })
  const [isCreating, setIsCreating] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleEdit = (slide: any) => {
    setEditingSlide(slide.id)
    setFormData({
      title: slide.title,
      description: slide.description,
      image_url: slide.image_url
    })
  }

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({
      title: 'New Slide',
      description: '',
      image_url: ''
    })
  }

  const handleSave = async () => {
    setSaveStatus('idle')
    try {
      if (isCreating) {
        await createSlide(formData)
        setIsCreating(false)
        setFormData({ title: '', description: '', image_url: '' })
      } else if (editingSlide) {
        await updateSlide(formData, editingSlide)
        setEditingSlide(null)
      }
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleCancel = () => {
    setEditingSlide(null)
    setIsCreating(false)
    setFormData({ title: '', description: '', image_url: '' })
  }

  const handleDelete = async (slideId: string) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        await deleteSlide(slideId)
      } catch (error) {
        console.error('Error deleting slide:', error)
      }
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const newSlides = [...slides]
    const [movedSlide] = newSlides.splice(index, 1)
    newSlides.splice(index - 1, 0, movedSlide)
    const slideIds = newSlides.map(slide => slide.id)
    await reorderSlides(slideIds)
  }

  const handleMoveDown = async (index: number) => {
    if (index === slides.length - 1) return
    const newSlides = [...slides]
    const [movedSlide] = newSlides.splice(index, 1)
    newSlides.splice(index + 1, 0, movedSlide)
    const slideIds = newSlides.map(slide => slide.id)
    await reorderSlides(slideIds)
  }

  const togglePublishStatus = async (slide: any) => {
    if (slide.status === 'published') {
      await unpublishSlide(slide.id)
    } else {
      await publishSlide(slide.id)
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Slides</h2>
          <p className="text-gray-600 mt-1">
            Manage photo slides for the hero section slider. Published slides will appear on the website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <Save className="w-4 h-4" />
              <span className="text-sm font-medium">Saved successfully</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Save failed</span>
            </div>
          )}
          <Button onClick={handleCreate} className="bg-sky-600 hover:bg-sky-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Slide
          </Button>
        </div>
      </div>

      {/* Create New Slide Form */}
      {isCreating && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Slide</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slide Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                placeholder="Enter slide title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slide Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                placeholder="Enter slide description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSave} className="bg-sky-600 hover:bg-sky-700">
                <Save className="w-4 h-4 mr-2" />
                Create Slide
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Slides List */}
      <div className="space-y-4">
        {slides.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No slides yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first slide to start building the hero photo slider.
            </p>
            <Button onClick={handleCreate} className="bg-sky-600 hover:bg-sky-700">
              <Plus className="w-4 h-4 mr-2" />
              Create First Slide
            </Button>
          </div>
        ) : (
          slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`bg-white rounded-lg border p-6 transition-all duration-200 ${
                slide.status === 'published'
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              {editingSlide === slide.id ? (
                // Edit Form
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Slide</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slide Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slide Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={handleSave} className="bg-sky-600 hover:bg-sky-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 mt-1">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === slides.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {slide.title}
                          {slide.status === 'published' && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Published
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600 mb-3">{slide.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Order: {slide.order_index}</span>
                          <span>Status: {slide.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublishStatus(slide)}
                          title={slide.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {slide.status === 'published' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(slide)}
                          title="Edit slide"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(slide.id)}
                          title="Delete slide"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}