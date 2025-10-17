import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import {
  Target,
  Shield,
  TrendingUp,
  BarChart3,
  X,
  Phone,
  Info
} from 'lucide-react'

interface ServiceDetailModalProps {
  service: {
    id: string
    title: string
    description: string
    icon: string
    order_list: number
  } | null
  isOpen: boolean
  onClose: () => void
}

export function ServiceDetailModal({ service, isOpen, onClose }: ServiceDetailModalProps) {
  if (!service) return null

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'Target': return <Target className="w-6 h-6" />
      case 'Shield': return <Shield className="w-6 h-6" />
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />
      case 'BarChart3': return <BarChart3 className="w-6 h-6" />
      default: return <Target className="w-6 h-6" />
    }
  }

  const getColorClasses = (index: number) => {
    const colors = [
      { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200' },
      { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
      { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
    ]
    return colors[index % colors.length]
  }

  const colorClasses = getColorClasses(service.order_list || 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] sm:w-[90vw] lg:w-[70vw] max-h-[85vh] overflow-hidden [&>button:last-child]:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${colorClasses.bg} ${colorClasses.border} border-2`}>
                {getIconComponent(service.icon)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h2>
                <Badge className={`${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}`}>
                  Professional Service
                </Badge>
              </div>
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogClose>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto py-6">
            {/* Service Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="px-1"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-sky-600" />
                Service Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 max-h-[40vh] overflow-y-auto">
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap pr-2 text-justify">
                  {service.description}
                </p>
              </div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6"
              >
                <DialogClose asChild>
                  <Button
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                    onClick={() => {
                      // Scroll to contact section when clicked
                      setTimeout(() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule Consultation
                  </Button>
                </DialogClose>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}