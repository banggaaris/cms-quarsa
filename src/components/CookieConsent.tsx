import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Cookie, Shield } from 'lucide-react'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Cookie className="w-5 h-5 text-amber-600" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cookie Consent
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  We use cookies to enhance your experience, analyze site traffic, and personalize content.
                  By continuing to use our site, you agree to our use of cookies.
                </p>

                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">Cookie Categories:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span><strong>Essential:</strong> Required for basic site functionality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cookie className="w-4 h-4 text-blue-600" />
                        <span><strong>Analytics:</strong> Help us understand how you use our site</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cookie className="w-4 h-4 text-purple-600" />
                        <span><strong>Marketing:</strong> Used to personalize your experience</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={acceptAll}
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={acceptEssential}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Essential Only
                  </button>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-4 py-2 text-sky-600 hover:text-sky-700 transition-colors text-sm font-medium"
                  >
                    {showDetails ? 'Show Less' : 'Learn More'}
                  </button>
                </div>
              </div>

              <button
                onClick={acceptAll}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}