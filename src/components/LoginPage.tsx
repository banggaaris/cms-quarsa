import { useState, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useCompanySettings } from '@/hooks/useCompanySettings'
import { RECAPTCHA_SITE_KEY, RECAPTCHA_ENABLED } from '@/config/recaptcha'
import { Eye, EyeOff, Lock, Mail, Building2, Shield } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'

export function LoginPage() {
  const { user, signIn } = useAuth()
  const { settings: companySettings, loading: settingsLoading } = useCompanySettings()
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  if (user) {
    return <Navigate to="/admin" replace />
  }

  // Show loading state while company settings are being fetched
  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
    setError(null)
  }

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null)
    setError('reCAPTCHA expired. Please verify again.')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate reCAPTCHA if enabled
    if (RECAPTCHA_ENABLED && !recaptchaToken) {
      setError('Please complete the reCAPTCHA verification.')
      setLoading(false)
      return
    }

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      // Reset reCAPTCHA on error
      if (RECAPTCHA_ENABLED && recaptchaRef.current) {
        recaptchaRef.current.reset()
        setRecaptchaToken(null)
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {companySettings?.logo_url ? (
              <img
                src={companySettings.logo_url}
                alt={`${companySettings.company_name} Logo`}
                className="w-12 h-12 object-contain rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-sky-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {companySettings?.company_name?.charAt(0) || 'Q'}
                </span>
              </div>
            )}
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">
                {companySettings?.company_name || 'PT Quasar Capital'}
              </h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>
          <p className="text-gray-600">Sign in to manage your website content</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                    placeholder="admin@quasarcapital.co.id"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* reCAPTCHA */}
              {RECAPTCHA_ENABLED && (
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={handleRecaptchaChange}
                    onExpired={handleRecaptchaExpired}
                    theme="light"
                    size="normal"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Protected admin access</span>
                {RECAPTCHA_ENABLED && (
                  <>
                    <span>•</span>
                    <span>reCAPTCHA protected</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Building2 className="w-4 h-4" />
            <span>
              {companySettings?.company_tagline || 'Investment Advisory Excellence'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}