import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Globe, Search, Copy, CheckCircle, Share2 } from 'lucide-react'

interface SEOData {
  title: string
  description: string
  keywords: string
  ogImage: string
  canonicalUrl: string
  twitterHandle: string
  author: string
  robots: string
}

interface HeroSEOConfigProps {
  heroId: string
  heroData: any
  onSave: (seoData: SEOData) => void
}

export function HeroSEOConfig({ heroId, heroData, onSave }: HeroSEOConfigProps) {
  const [seoData, setSeoData] = useState<SEOData>({
    title: heroData?.title ? `${heroData.title} - PT Quasar Capital` : '',
    description: heroData?.description || '',
    keywords: 'investment advisory, financial consulting, PT Quasar Capital, M&A advisory, corporate restructuring',
    ogImage: '/hero-og-image.jpg',
    canonicalUrl: 'https://quasarcapital.co.id',
    twitterHandle: '@QuasarCapitalID',
    author: 'PT Quasar Capital',
    robots: 'index, follow'
  })
  const [copied, setCopied] = useState<string>('')

  const handleInputChange = (field: keyof SEOData, value: string) => {
    setSeoData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    onSave(seoData)
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  const generateStructuredData = () => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": heroData?.title || "Investment Advisory Excellence",
      "description": seoData.description,
      "provider": {
        "@type": "Organization",
        "name": "PT Quasar Capital",
        "url": seoData.canonicalUrl
      },
      "areaServed": {
        "@type": "Country",
        "name": "Indonesia"
      },
      "serviceType": [
        "Investment Advisory",
        "M&A Advisory",
        "Corporate Restructuring",
        "Financial Consulting"
      ],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${seoData.canonicalUrl}#${heroId}`
      }
    }, null, 2)
  }

  const generateMetaTags = () => {
    return `<title>${seoData.title}</title>
<meta name="description" content="${seoData.description}" />
<meta name="keywords" content="${seoData.keywords}" />
<meta name="author" content="${seoData.author}" />
<meta name="robots" content="${seoData.robots}" />
<link rel="canonical" href="${seoData.canonicalUrl}" />

<!-- Open Graph -->
<meta property="og:title" content="${seoData.title}" />
<meta property="og:description" content="${seoData.description}" />
<meta property="og:image" content="${seoData.ogImage}" />
<meta property="og:url" content="${seoData.canonicalUrl}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="PT Quasar Capital" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${seoData.title}" />
<meta name="twitter:description" content="${seoData.description}" />
<meta name="twitter:image" content="${seoData.ogImage}" />
<meta name="twitter:site" content="${seoData.twitterHandle}" />`
  }

  const seoScore = () => {
    let score = 0
    if (seoData.title && seoData.title.length >= 30 && seoData.title.length <= 60) score += 20
    if (seoData.description && seoData.description.length >= 120 && seoData.description.length <= 160) score += 20
    if (seoData.keywords && seoData.keywords.length > 0) score += 15
    if (seoData.ogImage) score += 15
    if (seoData.canonicalUrl) score += 10
    if (seoData.robots) score += 10
    if (heroData?.title) score += 10
    return score
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Search className="w-5 h-5 text-sky-600" />
            SEO Configuration for Hero Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SEO Score */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">SEO Score</p>
                <p className="text-sm text-gray-600">Optimization completeness</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-sky-600">{seoScore()}%</div>
              <Badge variant={seoScore() >= 80 ? 'default' : seoScore() >= 60 ? 'secondary' : 'destructive'}>
                {seoScore() >= 80 ? 'Excellent' : seoScore() >= 60 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
          </div>

          {/* Basic SEO Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic SEO</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title (30-60 characters)
              </label>
              <Input
                value={seoData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter SEO title"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {seoData.title.length} characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description (120-160 characters)
              </label>
              <Textarea
                value={seoData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter meta description"
                rows={3}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {seoData.description.length} characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (comma-separated)
              </label>
              <Input
                value={seoData.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                placeholder="investment advisory, financial consulting, PT Quasar Capital"
                className="w-full"
              />
            </div>
          </div>

          {/* Social Media Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Social Media</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Graph Image
              </label>
              <Input
                value={seoData.ogImage}
                onChange={(e) => handleInputChange('ogImage', e.target.value)}
                placeholder="/hero-og-image.jpg"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Handle
              </label>
              <Input
                value={seoData.twitterHandle}
                onChange={(e) => handleInputChange('twitterHandle', e.target.value)}
                placeholder="@QuasarCapitalID"
                className="w-full"
              />
            </div>
          </div>

          {/* Technical SEO */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Technical SEO</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canonical URL
              </label>
              <Input
                value={seoData.canonicalUrl}
                onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                placeholder="https://quasarcapital.co.id"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Robots Meta Tag
              </label>
              <select
                value={seoData.robots}
                onChange={(e) => handleInputChange('robots', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="index, follow">Index, Follow (Default)</option>
                <option value="noindex, follow">No Index, Follow</option>
                <option value="index, nofollow">Index, No Follow</option>
                <option value="noindex, nofollow">No Index, No Follow</option>
              </select>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full bg-sky-600 hover:bg-sky-700">
            Save SEO Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Preview and Tools */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Meta Tags Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Meta Tags Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">
              <pre>{generateMetaTags()}</pre>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(generateMetaTags(), 'meta')}
              className="mt-3 w-full"
            >
              {copied === 'meta' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Meta Tags
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Structured Data Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Structured Data (JSON-LD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto">
              <pre>{generateStructuredData()}</pre>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(generateStructuredData(), 'structured')}
              className="mt-3 w-full"
            >
              {copied === 'structured' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Structured Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* SEO Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Title Tag</p>
                <p className="text-gray-600">Keep between 30-60 characters for optimal display in search results</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Meta Description</p>
                <p className="text-gray-600">Keep between 120-160 characters to avoid truncation</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Open Graph Image</p>
                <p className="text-gray-600">Use 1200x630px for best social media display</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Keywords</p>
                <p className="text-gray-600">Use 5-10 relevant keywords separated by commas</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Structured Data</p>
                <p className="text-gray-600">Helps search engines understand your content better</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}