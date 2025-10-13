import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { useHeroContent } from '@/hooks/useHeroContent'
import { Eye, Upload, Download, Plus, Edit, Trash2, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HeroEditor() {
  const { heroes, loading, deleteHero, publishHero, unpublishHero } = useHeroContent()
  const [publishing, setPublishing] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [heroToDelete, setHeroToDelete] = useState<string | null>(null)
  const [heroToDeleteTitle, setHeroToDeleteTitle] = useState<string>('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string>('')

  const handleDeleteHero = (heroId: string, heroTitle: string) => {
    setHeroToDelete(heroId)
    setHeroToDeleteTitle(heroTitle)
    setDeleteError('') // Clear any previous errors
    setDeleteModalOpen(true)
  }

  const confirmDeleteHero = async () => {
    if (!heroToDelete) return

    console.log(`=== DELETE CONFIRMATION STARTED ===`)
    console.log(`Attempting to delete hero with ID: "${heroToDelete}"`)
    console.log(`Hero title: "${heroToDeleteTitle}"`)

    setDeleting(true)
    setDeleteError('')
    try {
      await deleteHero(heroToDelete)
      console.log(`Successfully deleted hero: "${heroToDeleteTitle}" (ID: ${heroToDelete})`)
      setDeleteModalOpen(false)
      setHeroToDelete(null)
      setHeroToDeleteTitle('')
      console.log(`=== DELETE CONFIRMATION COMPLETED ===`)
    } catch (error) {
      console.error('Error deleting hero:', error)
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete hero section')
    } finally {
      setDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setHeroToDelete(null)
    setHeroToDeleteTitle('')
    setDeleteError('')
  }

  const handleEditHero = (hero: any) => {
    window.location.href = `/admin/hero/${hero.id}`
  }

  const handleNewHero = () => {
    window.location.href = `/admin/hero/new`
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Hero Sections</h1>
          <p className="text-gray-600 mt-1">Manage all hero section versions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/" target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              Preview Website
            </Link>
          </Button>
          <Button onClick={handleNewHero} className="bg-sky-600 hover:bg-sky-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Hero
          </Button>
        </div>
      </div>

      {/* Hero Sections List */}
      <Card>
        <CardHeader>
          <CardTitle>All Hero Sections</CardTitle>
          <p className="text-sm text-gray-600">
            Total: {heroes?.length || 0} hero section{(heroes?.length || 0) !== 1 ? 's' : ''}
          </p>
        </CardHeader>
        <CardContent>
          {heroes?.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No hero sections yet</p>
              <p className="text-sm">Create your first hero section to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Subtitle</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Updated</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {heroes
                    .sort((a, b) => {
                      // Sort by status (published first) then by updated date (newest first)
                      if (a.status === 'published' && b.status !== 'published') return -1
                      if (a.status !== 'published' && b.status === 'published') return 1
                      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                    })
                    .map((hero) => (
                    <tr
                      key={hero.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            hero.status === 'published'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }
                        >
                          {hero.status === 'published' ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{hero.title}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600 truncate max-w-xs">{hero.subtitle}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-500">
                          {new Date(hero.updated_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditHero(hero)}
                            disabled={publishing}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>

                          {hero.status === 'published' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                console.log(`=== UNPUBLISH ACTION STARTED ===`)
                                console.log(`Unpublishing hero: "${hero.title}" (ID: ${hero.id})`)
                                console.log(`Current status: ${hero.status}`)
                                console.log(`Current heroes order:`, heroes.map((h, i) => ({
                                  index: i,
                                  id: h.id,
                                  title: h.title,
                                  status: h.status,
                                  updated: h.updated_at
                                })))

                                setPublishing(true)
                                try {
                                  await unpublishHero(hero.id)
                                  console.log(`Successfully unpublished hero: "${hero.title}"`)
                                  console.log(`Hero status changed from 'published' to 'draft'`)
                                } catch (error) {
                                  console.error('Error unpublishing hero:', error)
                                } finally {
                                  setPublishing(false)
                                  console.log(`=== UNPUBLISH ACTION COMPLETED ===`)
                                }
                              }}
                              disabled={publishing}
                              className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 h-8 w-8 p-0"
                              title="Unpublish"
                            >
                              {publishing ? (
                                <div className="animate-spin rounded-full h-3 w-3 border border-yellow-600 border-t-transparent"></div>
                              ) : (
                                <Download className="w-3 h-3" />
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                console.log(`=== PUBLISH ACTION STARTED ===`)
                                console.log(`Publishing hero: "${hero.title}" (ID: ${hero.id})`)
                                console.log(`Current status: ${hero.status}`)
                                console.log(`Current heroes order:`, heroes.map((h, i) => ({
                                  index: i,
                                  id: h.id,
                                  title: h.title,
                                  status: h.status,
                                  updated: h.updated_at
                                })))

                                setPublishing(true)
                                try {
                                  await publishHero(hero.id)
                                  console.log(`Successfully published hero: "${hero.title}"`)
                                  console.log(`Hero status changed from 'draft' to 'published'`)
                                } catch (error) {
                                  console.error('Error publishing hero:', error)
                                } finally {
                                  setPublishing(false)
                                  console.log(`=== PUBLISH ACTION COMPLETED ===`)
                                }
                              }}
                              disabled={publishing}
                              className="border-green-600 text-green-600 hover:bg-green-50 h-8 w-8 p-0"
                              title="Publish"
                            >
                              {publishing ? (
                                <div className="animate-spin rounded-full h-3 w-3 border border-green-600 border-t-transparent"></div>
                              ) : (
                                <Upload className="w-3 h-3" />
                              )}
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteHero(hero.id, hero.title)}
                            className="border-red-600 text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDeleteHero}
        title="Delete Hero Section"
        description="Are you sure you want to delete this hero section? This action cannot be undone and will permanently remove this hero section from the database."
        itemName={heroToDeleteTitle}
        loading={deleting}
        error={deleteError}
      />
    </div>
  )
}