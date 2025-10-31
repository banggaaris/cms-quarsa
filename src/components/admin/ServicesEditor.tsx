import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { useAdminContent } from '@/hooks/useAdminContent'
import { Service } from '@/types/content'
import { Plus, Edit, Trash2, Eye, CheckCircle, AlertCircle, GripVertical, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'

const availableIcons = [
  'Target', 'Shield', 'TrendingUp', 'BarChart3', 'Award', 'Users',
  'Building', 'Globe', 'DollarSign', 'CheckCircle'
]

// Sortable Service Card Component
function SortableServiceCard({ service, onEdit, onDelete }: {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string, name: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getIconComponent = (iconName: string) => {
    return <span className="text-2xl">{iconName}</span>
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className={`${isDragging ? 'shadow-2xl border-sky-400' : ''} transition-all duration-200`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 flex-shrink-0">
                {getIconComponent(service.icon)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">{service.title}</h3>
                <p className="text-sm text-gray-500">Order: {service.order_list || 0}</p>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(service)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(service.id, service.title)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 line-clamp-3">{service.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Briefcase className="w-3 h-3 mr-1" />
                {service.icon}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ServicesEditor() {
  const { content, updateServicesDatabase } = useAdminContent()
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Delete confirmation states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
  const [serviceToDeleteName, setServiceToDeleteName] = useState<string>('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string>('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort services by order_list for display
  const sortedServices = [...content.services].sort((a, b) => (a.order_list || 0) - (b.order_list || 0))

  const emptyService: Service = {
    id: '',
    title: '',
    description: '',
    icon: 'Target',
    order_list: content.services.length // Auto-increment order
  }

  const handleAddService = () => {
    setEditingService({ ...emptyService, id: Date.now().toString() })
    setIsDialogOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleDeleteService = (id: string, name: string) => {
    setServiceToDelete(id)
    setServiceToDeleteName(name)
    setDeleteError('') // Clear any previous errors
    setDeleteModalOpen(true)
  }

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return

    setDeleting(true)
    setDeleteError('')
    try {
      const updatedServices = content.services.filter(service => service.id !== serviceToDelete)
      const success = await updateServicesDatabase(updatedServices)

      if (success) {
        setDeleteModalOpen(false)
        setServiceToDelete(null)
        setServiceToDeleteName('')

        // Show success notification
        setSuccessMessage('Service deleted successfully!')
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 3000)
      }
    } catch (error) {
      // Error deleting service
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete service')
    } finally {
      setDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setServiceToDelete(null)
    setServiceToDeleteName('')
    setDeleteError('')
  }

  const handleSaveService = async (service: Service) => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      const isEditing = content.services.find(s => s.id === service.id)
      let updatedServices: Service[]

      if (isEditing) {
        // Update existing service
        const existingIndex = content.services.findIndex(s => s.id === service.id)
        updatedServices = [...content.services]
        updatedServices[existingIndex] = service
      } else {
        // Add new service
        updatedServices = [...content.services, service]
      }

      const success = await updateServicesDatabase(updatedServices)

      if (success) {
        setIsDialogOpen(false)
        setEditingService(null)
        setSaveStatus('success')
        setSuccessMessage(isEditing ? 'Service updated successfully!' : 'Service created successfully!')

        // Show success notification
        setTimeout(() => {
          setShowSuccessNotification(true)
          setTimeout(() => setShowSuccessNotification(false), 3000)
        }, 100)
      } else {
        setSaveStatus('error')
      }
    } catch (err) {
      // Error saving service
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedServices.findIndex(service => service.id === active.id);
      const newIndex = sortedServices.findIndex(service => service.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newServices = arrayMove(sortedServices, oldIndex, newIndex);

        // Update order_list for all services
        const updatedServices = newServices.map((service, index) => ({
          ...service,
          order_list: index
        }));

        const success = await updateServicesDatabase(updatedServices);

        if (!success) {
          // If database update failed, reload content to sync
          // Failed to update services order in database
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage service offerings. Drag to reorder.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/" target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Link>
          </Button>
        </div>
      </div>

      {/* Drag and Drop Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortedServices.map(service => service.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedServices.map((service) => (
              <SortableServiceCard
                key={service.id}
                service={service}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
              />
            ))}

            {/* Add New Service Card - Not sortable */}
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
              <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                <Button variant="ghost" onClick={handleAddService} className="flex flex-col items-center gap-2 h-auto py-8">
                  <Plus className="w-8 h-8" />
                  <span>Add Service</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </SortableContext>
      </DndContext>

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
                  Order
                </label>
                <input
                  type="number"
                  value={editingService.order_list || 0}
                  onChange={(e) => setEditingService({...editingService, order_list: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSaveService(editingService)}
                  disabled={!editingService.title?.trim() || !editingService.description?.trim() || saving}
                >
                  {saving ? 'Saving...' : 'Save Service'}
                </Button>

                {/* Error Status Indicator */}
                {saveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Failed to save</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDeleteService}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone and will permanently remove this service from the database."
        itemName={serviceToDeleteName}
        loading={deleting}
        error={deleteError}
      />
    </div>
  )
}