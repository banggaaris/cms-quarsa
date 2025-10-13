import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useContent } from '@/hooks/useContent'
import { Service } from '@/types/content'
import { Save, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

const availableIcons = [
  'Target', 'Shield', 'TrendingUp', 'BarChart3', 'Award', 'Users',
  'Building', 'Globe', 'DollarSign', 'CheckCircle'
]

export function ServicesEditor() {
  const { content, updateServices } = useContent()
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const emptyService: Service = {
    id: '',
    title: '',
    description: '',
    icon: 'Target',
    features: []
  }

  const handleSave = () => {
    updateServices(content.services)
  }

  const handleAddService = () => {
    setEditingService({ ...emptyService, id: Date.now().toString() })
    setIsDialogOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleDeleteService = (id: string) => {
    const updatedServices = content.services.filter(service => service.id !== id)
    updateServices(updatedServices)
  }

  const handleSaveService = (service: Service) => {
    const existingIndex = content.services.findIndex(s => s.id === service.id)
    let updatedServices: Service[]

    if (existingIndex >= 0) {
      updatedServices = [...content.services]
      updatedServices[existingIndex] = service
    } else {
      updatedServices = [...content.services, service]
    }

    updateServices(updatedServices)
    setIsDialogOpen(false)
    setEditingService(null)
  }

  const handleFeaturesChange = (value: string) => {
    if (!editingService) return

    const features = value.split(',').map(feature => feature.trim()).filter(feature => feature)
    setEditingService({
      ...editingService,
      features
    })
  }

  const getIconComponent = (iconName: string) => {
    // This would ideally import the actual icon component
    // For now, we'll just show the name
    return <span className="text-2xl">{iconName}</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage service offerings and features</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/" target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Link>
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.services.map((service) => (
          <Card key={service.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600">
                    {getIconComponent(service.icon)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.title}</h3>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteService(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{service.description}</p>
                <div className="space-y-1">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                  {service.features.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{service.features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Service Card */}
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="flex items-center justify-center h-full min-h-[200px]">
            <Button variant="ghost" onClick={handleAddService} className="flex flex-col items-center gap-2 h-auto py-8">
              <Plus className="w-8 h-8" />
              <span>Add Service</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Edit/Add Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService?.title ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>

          {editingService && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  value={editingService.icon}
                  onChange={(e) => setEditingService({...editingService, icon: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  {availableIcons.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (comma-separated)
                </label>
                <textarea
                  value={editingService.features.join(', ')}
                  onChange={(e) => handleFeaturesChange(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="e.g., Portfolio Management, Risk Assessment, Market Analysis"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSaveService(editingService)}>
                  Save Service
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}