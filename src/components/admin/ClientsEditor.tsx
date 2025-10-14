import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { useClientsContent } from '@/hooks/useClientsContent'
import { Client } from '@/types/content'
import { Plus, Edit, Trash2, Eye, Building, Link as LinkIcon, GripVertical, CheckCircle, AlertCircle } from 'lucide-react'
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

// Sortable Client Card Component
function SortableClientCard({ client, onEdit, onDelete }: {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string, name: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: client.id });

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
              {client.logo_url ? (
                <img
                  src={client.logo_url}
                  alt={client.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 flex-shrink-0 hidden">
                <Building className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">{client.name}</h3>
                <p className="text-sm text-gray-500 truncate">{client.industry}</p>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(client)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(client.id, client.name)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 line-clamp-3">{client.description}</p>
            {client.logo_url && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <LinkIcon className="w-3 h-3" />
                <span className="truncate">Logo added</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ClientsEditor() {
  const { clients, loading, error, addClient, updateClient, deleteClient, reorderClients } = useClientsContent()
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Delete confirmation states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<string | null>(null)
  const [clientToDeleteName, setClientToDeleteName] = useState<string>('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string>('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const emptyClient: Client = {
    id: '',
    name: '',
    industry: '',
    description: '',
    years: '',
    logo_url: ''
  }

  const handleAddClient = () => {
    setEditingClient({ ...emptyClient, id: Date.now().toString() })
    setIsDialogOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setIsDialogOpen(true)
  }

  const handleDeleteClient = (id: string, name: string) => {
    setClientToDelete(id)
    setClientToDeleteName(name)
    setDeleteError('') // Clear any previous errors
    setDeleteModalOpen(true)
  }

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return

    setDeleting(true)
    setDeleteError('')
    try {
      const success = await deleteClient(clientToDelete)
      if (success) {
        setDeleteModalOpen(false)
        setClientToDelete(null)
        setClientToDeleteName('')

        // Show success notification
        setSuccessMessage('Client deleted successfully!')
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 3000)
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete client')
    } finally {
      setDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setClientToDelete(null)
    setClientToDeleteName('')
    setDeleteError('')
  }

  const handleSaveClient = async (client: Client) => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      const isEditing = clients.find(c => c.id === client.id)

      if (isEditing) {
        // Update existing client
        const success = await updateClient(client.id, client)
        if (success) {
          setSaveStatus('success')
          setSuccessMessage('Client updated successfully!')
        }
      } else {
        // Add new client
        const { name, industry, description, logo_url } = client
        const success = await addClient({ name, industry, description, logo_url })
        if (success) {
          setSaveStatus('success')
          setSuccessMessage('Client created successfully!')
        }
      }

      if (saveStatus === 'success' || !error) {
        setIsDialogOpen(false)
        setEditingClient(null)

        // Show success notification
        setTimeout(() => {
          setShowSuccessNotification(true)
          setTimeout(() => setShowSuccessNotification(false), 3000)
        }, 100)
      }
    } catch (err) {
      console.error('Error saving client:', err)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = clients.findIndex(client => client.id === active.id);
      const newIndex = clients.findIndex(client => client.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newClients = arrayMove(clients, oldIndex, newIndex);
        await reorderClients(newClients);
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
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Manage client information and logos. Drag to reorder.</p>
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
        <SortableContext items={clients.map(client => client.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <SortableClientCard
                key={client.id}
                client={client}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
              />
            ))}

            {/* Add New Client Card - Not sortable */}
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
              <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                <Button variant="ghost" onClick={handleAddClient} className="flex flex-col items-center gap-2 h-auto py-8">
                  <Plus className="w-8 h-8" />
                  <span>Add Client</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </SortableContext>
      </DndContext>

      {/* Edit/Add Client Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient?.name ? 'Edit Client' : 'Add New Client'}
            </DialogTitle>
          </DialogHeader>

          {editingClient && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={editingClient.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Prevent empty or whitespace-only names
                    if (value.trim() !== '') {
                      setEditingClient({...editingClient, name: value.trim()});
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="e.g., Bank Central Asia"
                  required
                />
                {editingClient.name === '' && (
                  <p className="text-red-500 text-xs mt-1">Client name is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <input
                  type="text"
                  value={editingClient.industry}
                  onChange={(e) => setEditingClient({...editingClient, industry: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="e.g., Banking & Financial Services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={editingClient.description}
                  onChange={(e) => setEditingClient({...editingClient, description: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="Brief description of the client and your relationship with them..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={editingClient.logo_url}
                  onChange={(e) => setEditingClient({...editingClient, logo_url: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid URL for the client's logo image
                </p>
                {editingClient.logo_url && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Logo Preview:</p>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={editingClient.logo_url}
                        alt="Logo preview"
                        className="h-16 mx-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                      <div className="text-center text-gray-400 text-sm hidden">
                        Invalid logo URL
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
                  onClick={() => handleSaveClient(editingClient)}
                  disabled={!editingClient.name?.trim() || !editingClient.industry?.trim() || !editingClient.description?.trim() || saving}
                >
                  {saving ? 'Saving...' : 'Save Client'}
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
        onConfirm={confirmDeleteClient}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone and will permanently remove this client from the database."
        itemName={clientToDeleteName}
        loading={deleting}
        error={deleteError}
      />
    </div>
  )
}