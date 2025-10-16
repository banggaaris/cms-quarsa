import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { useGalleryContent } from '@/hooks/useGalleryContent'
import { GalleryItem } from '@/types/content'
import { Plus, Edit, Trash2, Eye, Image as ImageIcon, GripVertical, CheckCircle, AlertCircle, Tag } from 'lucide-react'
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

// Sortable Gallery Card Component
function SortableGalleryCard({ item, onEdit, onDelete }: {
  item: GalleryItem;
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: string, name: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 flex-shrink-0 hidden">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Tag className="w-3 h-3" />
                  <span className="truncate">{item.category}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(item.id, item.title)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
            {item.imageUrl && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <ImageIcon className="w-3 h-3" />
                <span className="truncate">Image added</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function GalleryEditor() {
  const { gallery, loading, error, addGalleryItem, updateGalleryItem, deleteGalleryItem, reorderGallery } = useGalleryContent()
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Delete confirmation states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [itemToDeleteName, setItemToDeleteName] = useState<string>('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string>('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const emptyGalleryItem: GalleryItem = {
    id: '',
    title: '',
    description: '',
    category: 'general',
    imageUrl: ''
  }

  const handleAddItem = () => {
    setEditingItem({ ...emptyGalleryItem, id: Date.now().toString() })
    setIsDialogOpen(true)
  }

  const handleEditItem = (item: GalleryItem) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleDeleteItem = (id: string, name: string) => {
    setItemToDelete(id)
    setItemToDeleteName(name)
    setDeleteError('') // Clear any previous errors
    setDeleteModalOpen(true)
  }

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return

    setDeleting(true)
    setDeleteError('')
    try {
      const success = await deleteGalleryItem(itemToDelete)
      if (success) {
        setDeleteModalOpen(false)
        setItemToDelete(null)
        setItemToDeleteName('')

        // Show success notification
        setSuccessMessage('Gallery item deleted successfully!')
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 3000)
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error)
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete gallery item')
    } finally {
      setDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setItemToDelete(null)
    setItemToDeleteName('')
    setDeleteError('')
  }

  const handleSaveItem = async (item: GalleryItem) => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      const isEditing = gallery.find(i => i.id === item.id)

      if (isEditing) {
        // Update existing item
        const success = await updateGalleryItem(item.id, item)
        if (success) {
          setSaveStatus('success')
          setSuccessMessage('Gallery item updated successfully!')
        }
      } else {
        // Add new item
        const { title, description, category, imageUrl } = item
        const success = await addGalleryItem({ title, description, category, imageUrl })
        if (success) {
          setSaveStatus('success')
          setSuccessMessage('Gallery item created successfully!')
        }
      }

      if (saveStatus === 'success' || !error) {
        setIsDialogOpen(false)
        setEditingItem(null)

        // Show success notification
        setTimeout(() => {
          setShowSuccessNotification(true)
          setTimeout(() => setShowSuccessNotification(false), 3000)
        }, 100)
      }
    } catch (err) {
      console.error('Error saving gallery item:', err)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = gallery.findIndex(item => item.id === active.id);
      const newIndex = gallery.findIndex(item => item.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newGallery = arrayMove(gallery, oldIndex, newIndex);
        await reorderGallery(newGallery);
      }
    }
  };

  const handlePreview = () => {
    window.open('/', '_blank')
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
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600 mt-1">Manage gallery images and descriptions. Drag to reorder.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Drag and Drop Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={gallery.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <SortableGalleryCard
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}

            {/* Add New Gallery Item Card - Not sortable */}
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
              <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                <Button variant="ghost" onClick={handleAddItem} className="flex flex-col items-center gap-2 h-auto py-8">
                  <Plus className="w-8 h-8" />
                  <span>Add Gallery Item</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </SortableContext>
      </DndContext>

      {/* Edit/Add Gallery Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.title ? 'Edit Gallery Item' : 'Add New Gallery Item'}
            </DialogTitle>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty input but show validation error
                    setEditingItem({...editingItem, title: value});
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="e.g., Office Headquarters"
                  required
                />
                {editingItem.title.trim() === '' && (
                  <p className="text-red-500 text-xs mt-1">Title is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  <option value="general">General</option>
                  <option value="office">Office</option>
                  <option value="team">Team</option>
                  <option value="business">Business</option>
                  <option value="events">Events</option>
                  <option value="clients">Clients</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="Brief description of the gallery item..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editingItem.imageUrl}
                  onChange={(e) => setEditingItem({...editingItem, imageUrl: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid URL for the gallery image
                </p>
                {editingItem.imageUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Image Preview:</p>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={editingItem.imageUrl}
                        alt="Image preview"
                        className="h-32 mx-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                      <div className="text-center text-gray-400 text-sm hidden">
                        Invalid image URL
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSaveItem(editingItem)}
                  disabled={!editingItem.title?.trim() || !editingItem.category?.trim() || saving}
                >
                  {saving ? 'Saving...' : 'Save Gallery Item'}
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
        onConfirm={confirmDeleteItem}
        title="Delete Gallery Item"
        description="Are you sure you want to delete this gallery item? This action cannot be undone and will permanently remove this item from the database."
        itemName={itemToDeleteName}
        loading={deleting}
        error={deleteError}
      />
    </div>
  )
}