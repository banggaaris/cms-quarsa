import { Helmet } from 'react-helmet-async'
import { useContent } from '@/hooks/useContent'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  favicon?: string
  structuredData?: Record<string, any>
}

export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  favicon,
  structuredData
}: SEOProps) {
  const { content } = useContent()

  // Default SEO values
  const defaultTitle = title || 'PT Quasar Capital - Investment Advisory Excellence Since 1994'
  const defaultDescription = description || content?.hero?.description ||
    'Leading investment advisory firm in Indonesia since 1994. Expert financial consulting, M&A advisory, corporate restructuring, and comprehensive investment solutions.'
  const defaultKeywords = keywords ||
    'investment advisory, financial consulting, PT Quasar Capital, M&A advisory, corporate restructuring, Indonesia investment, financial services, investment management, capital advisory'
  const defaultCanonical = canonical || 'https://quasarcapital.co.id'
  const defaultOgImage = ogImage || '/og-image.jpg'

  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PT Quasar Capital",
    "url": "https://quasarcapital.co.id",
    "logo": "https://quasarcapital.co.id/logo.png",
    "description": defaultDescription,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ID",
      "addressLocality": "Jakarta",
      "addressRegion": "DKI Jakarta"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-21-1234-5678",
      "contactType": "customer service",
      "email": "info@quasarcapital.co.id"
    },
    "foundingDate": "1994",
    "sameAs": [
      "https://linkedin.com/company/pt-quasar-capital",
      "https://facebook.com/ptquasarcapital"
    ]
  }

  // Hero section structured data
  const heroStructuredData = structuredData || {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": defaultTitle,
    "description": defaultDescription,
    "provider": {
      "@type": "Organization",
      "name": "PT Quasar Capital",
      "url": "https://quasarcapital.co.id"
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
    ]
  }

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{defaultTitle}</title>
      <meta name="description" content={defaultDescription} />
      <meta name="keywords" content={defaultKeywords} />
      <meta name="author" content="PT Quasar Capital" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={defaultCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={defaultCanonical} />
      <meta property="og:title" content={defaultTitle} />
      <meta property="og:description" content={defaultDescription} />
      <meta property="og:image" content={defaultOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="PT Quasar Capital" />
      <meta property="og:locale" content="en_ID" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={defaultCanonical} />
      <meta property="twitter:title" content={defaultTitle} />
      <meta property="twitter:description" content={defaultDescription} />
      <meta property="twitter:image" content={defaultOgImage} />
      <meta property="twitter:site" content="@QuasarCapitalID" />
      <meta property="twitter:creator" content="@QuasarCapitalID" />

      {/* Favicon */}
      {favicon && <link rel="icon" href={favicon} />}
      {favicon && <link rel="apple-touch-icon" href={favicon} />}

      {/* Additional SEO Meta */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="ID-JK" />
      <meta name="geo.placename" content="Jakarta" />
      <meta name="geo.position" content="-6.2088;106.8456" />
      <meta name="ICBM" content="-6.2088, 106.8456" />
      <meta name="category" content="business, finance, investment" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(heroStructuredData)}
      </script>
    </Helmet>
  )
}