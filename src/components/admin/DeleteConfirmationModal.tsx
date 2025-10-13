import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertTriangle, Trash2 } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  itemName?: string
  loading?: boolean
  error?: string
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description = "This action cannot be undone and will permanently remove this item from the database.",
  itemName,
  loading = false,
  error
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <DialogDescription className="text-gray-600">
            {description}
          </DialogDescription>

          {itemName && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700">Item to delete:</p>
              <p className="text-sm text-gray-900 mt-1 font-medium">{itemName}</p>
            </div>
          )}

          {error && (
            <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-800 mb-2">Error:</p>
              <p className="text-sm text-red-700 mb-3">{error}</p>

              {error.includes('Row Level Security') && (
                <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                  <p className="text-xs font-medium text-yellow-800 mb-1">🔧 How to Fix This:</p>
                  <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                    <li>Go to your Supabase dashboard</li>
                    <li>Navigate to Authentication → Policies</li>
                    <li>Select the 'hero_content' table</li>
                    <li>Enable DELETE policy for authenticated users</li>
                    <li>Or create a custom policy like: <code className="bg-yellow-100 px-1 rounded">auth.uid() = user_id</code></li>
                  </ol>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent"></div>
                  Deleting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </div>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}