import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { useTeamsContent } from '@/hooks/useTeamsContent'
import { TeamMember } from '@/types/content'
import { Plus, Edit, Trash2, Eye, User, CheckCircle, AlertCircle, GripVertical } from 'lucide-react'
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

// Sortable Team Member Card Component
function SortableTeamMemberCard({ member, onEdit, onDelete }: {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string, name: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

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
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <User className="w-6 h-6 text-gray-400 hidden" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                <p className="text-sm text-red-600 font-medium truncate">{member.position}</p>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(member)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(member.id, member.name)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Expertise:</span>
              <p className="text-gray-600 line-clamp-2">{member.expertise}</p>
            </div>
            <div>
              <span className="font-medium">Experience:</span>
              <p className="text-gray-600">{member.experience}</p>
            </div>
            <div>
              <span className="font-medium">Education:</span>
              <p className="text-gray-600 truncate">{member.education}</p>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {member.specializations.slice(0, 2).map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {member.specializations.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{member.specializations.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function TeamEditor() {
  const { team, loading, error, addTeamMember, updateTeamMember, deleteTeamMember, reorderTeam } = useTeamsContent()
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Delete confirmation states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null)
  const [memberToDeleteName, setMemberToDeleteName] = useState<string>('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string>('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const emptyMember: TeamMember = {
    id: '',
    name: '',
    position: '',
    expertise: '',
    experience: '',
    education: '',
    image: '',
    bio: '',
    specializations: [],
    achievements: []
  }

  const handleAddMember = () => {
    setEditingMember({ ...emptyMember, id: Date.now().toString() })
    setIsDialogOpen(true)
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setIsDialogOpen(true)
  }

  const handleDeleteMember = (id: string, name: string) => {
    setMemberToDelete(id)
    setMemberToDeleteName(name)
    setDeleteError('') // Clear any previous errors
    setDeleteModalOpen(true)
  }

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return

    setDeleting(true)
    setDeleteError('')
    try {
      const success = await deleteTeamMember(memberToDelete)
      if (success) {
        setDeleteModalOpen(false)
        setMemberToDelete(null)
        setMemberToDeleteName('')

        // Show success notification
        setSuccessMessage('Team member deleted successfully!')
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 3000)
      }
    } catch (error) {
      console.error('Error deleting team member:', error)
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete team member')
    } finally {
      setDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setMemberToDelete(null)
    setMemberToDeleteName('')
    setDeleteError('')
  }

  const handleSaveMember = async (member: TeamMember) => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      const isEditing = team.find(m => m.id === member.id)

      if (isEditing) {
        // Update existing member
        const success = await updateTeamMember(member.id, member)
        if (success) {
          setSaveStatus('success')
          setSuccessMessage('Team member updated successfully!')
        }
      } else {
        // Add new member
        const success = await addTeamMember(member)
        if (success) {
          setSaveStatus('success')
          setSuccessMessage('Team member created successfully!')
        }
      }

      if (saveStatus === 'success' || !error) {
        setIsDialogOpen(false)
        setEditingMember(null)

        // Show success notification
        setTimeout(() => {
          setShowSuccessNotification(true)
          setTimeout(() => setShowSuccessNotification(false), 3000)
        }, 100)
      }
    } catch (err) {
      console.error('Error saving team member:', err)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = team.findIndex(member => member.id === active.id);
      const newIndex = team.findIndex(member => member.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newTeam = arrayMove(team, oldIndex, newIndex);
        await reorderTeam(newTeam);
      }
    }
  }

  
  const handleArrayFieldChange = (field: 'specializations' | 'achievements', value: string) => {
    if (!editingMember) return

    const items = value.split(',').map(item => item.trim()).filter(item => item)
    setEditingMember({
      ...editingMember,
      [field]: items
    })
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
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage team member profiles. Drag to reorder.</p>
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
        <SortableContext items={team.map(member => member.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <SortableTeamMemberCard
                key={member.id}
                member={member}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
              />
            ))}

            {/* Add New Member Card - Not sortable */}
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
              <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                <Button variant="ghost" onClick={handleAddMember} className="flex flex-col items-center gap-2 h-auto py-8">
                  <Plus className="w-8 h-8" />
                  <span>Add Team Member</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </SortableContext>
      </DndContext>

      {/* Edit/Add Member Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember?.name ? 'Edit Team Member' : 'Add New Team Member'}
            </DialogTitle>
          </DialogHeader>

          {editingMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    value={editingMember.position}
                    onChange={(e) => setEditingMember({...editingMember, position: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expertise
                </label>
                <input
                  type="text"
                  value={editingMember.expertise}
                  onChange={(e) => setEditingMember({...editingMember, expertise: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={editingMember.experience}
                    onChange={(e) => setEditingMember({...editingMember, experience: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                    placeholder="e.g., 20+ years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <input
                    type="text"
                    value={editingMember.education}
                    onChange={(e) => setEditingMember({...editingMember, education: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                    placeholder="e.g., MBA, Harvard Business School"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingMember.image}
                  onChange={(e) => setEditingMember({...editingMember, image: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biography
                </label>
                <textarea
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({...editingMember, bio: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingMember.specializations.join(', ')}
                  onChange={(e) => handleArrayFieldChange('specializations', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="e.g., Investment Banking, M&A, Strategy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievements (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingMember.achievements.join(', ')}
                  onChange={(e) => handleArrayFieldChange('achievements', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="e.g., Led 150+ transactions, Former Goldman Sachs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSaveMember(editingMember)}
                  disabled={!editingMember.name?.trim() || !editingMember.position?.trim() || saving}
                >
                  {saving ? 'Saving...' : 'Save Member'}
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
        onConfirm={confirmDeleteMember}
        title="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone and will permanently remove this team member from the database."
        itemName={memberToDeleteName}
        loading={deleting}
        error={deleteError}
      />
    </div>
  )
}