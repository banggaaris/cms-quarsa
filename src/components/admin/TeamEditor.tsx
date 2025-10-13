import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAdminContent } from '@/hooks/useAdminContent'
import { TeamMember } from '@/types/content'
import { Save, Plus, Edit, Trash2, Eye, User, CheckCircle, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function TeamEditor() {
  const { content, updateTeam } = useAdminContent()
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

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

  const handleSave = async () => {
    setSaveStatus('saving')
    const success = await updateTeam(content.team)
    if (success) {
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } else {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleAddMember = () => {
    setEditingMember({ ...emptyMember, id: `temp-${Date.now().toString()}` })
    setIsDialogOpen(true)
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setIsDialogOpen(true)
  }

  const handleDeleteMember = async (id: string) => {
    const updatedTeam = content.team.filter(member => member.id !== id)
    await updateTeam(updatedTeam)
  }

  const handleSaveMember = async (member: TeamMember) => {
    const existingIndex = content.team.findIndex(m => m.id === member.id)
    let updatedTeam: TeamMember[]

    if (existingIndex >= 0) {
      updatedTeam = [...content.team]
      updatedTeam[existingIndex] = member
    } else {
      updatedTeam = [...content.team, member]
    }

    await updateTeam(updatedTeam)
    setIsDialogOpen(false)
    setEditingMember(null)
  }

  const handleArrayFieldChange = (field: 'specializations' | 'achievements', value: string) => {
    if (!editingMember) return

    const items = value.split(',').map(item => item.trim()).filter(item => item)
    setEditingMember({
      ...editingMember,
      [field]: items
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage team member profiles</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/" target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : saveStatus === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : saveStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Error
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.team.map((member) => (
          <Card key={member.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-red-600 font-medium">{member.position}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditMember(member)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteMember(member.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Expertise:</span>
                  <p className="text-gray-600">{member.expertise}</p>
                </div>
                <div>
                  <span className="font-medium">Experience:</span>
                  <p className="text-gray-600">{member.experience}</p>
                </div>
                <div>
                  <span className="font-medium">Education:</span>
                  <p className="text-gray-600">{member.education}</p>
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
        ))}

        {/* Add New Member Card */}
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="flex items-center justify-center h-full min-h-[200px]">
            <Button variant="ghost" onClick={handleAddMember} className="flex flex-col items-center gap-2 h-auto py-8">
              <Plus className="w-8 h-8" />
              <span>Add Team Member</span>
            </Button>
          </CardContent>
        </Card>
      </div>

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
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSaveMember(editingMember)}>
                  Save Member
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}