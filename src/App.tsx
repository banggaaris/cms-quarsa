import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Users,
  Award,
  Briefcase,
  Building,
  TrendingUp,
  Shield,
  Target,
  Globe,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Image as ImageIcon,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react'
import { CookieConsent } from '@/components/CookieConsent'
import { BlurText } from '@/components/BlurText'
import { ManualSlider } from '@/components/InfiniteSlider'
import { HeroImageSlider } from '@/components/HeroImageSlider'
import { SEO } from '@/components/SEO'
import {
  ServicesContainer,
  ServiceCard,
  ServicesHeader
} from '@/components/ServicesMotion'
import { ServiceDetailModal } from '@/components/ServiceDetailModal'
import { useContent } from '@/hooks/useContent'
import { useCompanySettings } from '@/hooks/useCompanySettings'
import { useHeroContent } from '@/hooks/useHeroContent'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  const { content, loading, reloadTeamContent, reloadServicesContent } = useContent()
  const { settings: companySettings, loading: settingsLoading } = useCompanySettings()
  const { currentHero, loading: heroLoading } = useHeroContent()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [scrollY, setScrollY] = useState(0)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [selectedService, setSelectedService] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Reload team content every 30 seconds to pick up database changes
  useEffect(() => {
    const interval = setInterval(() => {
      reloadTeamContent()
    }, 30000)

    return () => clearInterval(interval)
  }, [reloadTeamContent])

  // Reload services content every 30 seconds to pick up database changes
  useEffect(() => {
    const interval = setInterval(() => {
      reloadServicesContent()
    }, 30000)

    return () => clearInterval(interval)
  }, [reloadServicesContent])

  if (loading || settingsLoading || heroLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  const navigation = [
    { id: 'home', label: 'Home', icon: <Globe className="w-4 h-4" /> },
    { id: 'about', label: 'About Us', icon: <Building className="w-4 h-4" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'credentials', label: 'Credentials', icon: <Award className="w-4 h-4" /> },
    { id: 'clients', label: 'Clients', icon: <Users className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact Us', icon: <Phone className="w-4 h-4" /> }
  ]

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <>
      <SEO
        title={currentHero?.title ? `${currentHero.title} - ${companySettings?.company_name || 'PT Quasar Investama'}` : undefined}
        description={currentHero?.description || companySettings?.meta_description}
        keywords={companySettings?.meta_keywords || "Unlocking Local Potential with Global Reach, Indonesia investment"}
        canonical={companySettings?.website_url || "https://quasarinvestama.id"}
        ogImage={companySettings?.og_image_url || "/hero-og-image.jpg"}
        favicon={companySettings?.favicon_url}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": companySettings?.company_name || "PT Quasar Investama",
          "description": companySettings?.company_description || currentHero?.description,
          "provider": {
            "@type": "Organization",
            "name": companySettings?.company_name || "PT Quasar Investama",
            "url": companySettings?.website_url || "https://quasarinvestama.id"
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
        }}
      />
      <div className="min-h-screen bg-white">
        {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white shadow-lg' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              {companySettings?.logo_url ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img
                    src={companySettings.logo_url}
                    alt={companySettings.company_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-sky-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {companySettings?.company_name?.charAt(0) || 'Q'}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {companySettings?.company_name || 'PT Quasar Investama'}
                </h1>
                <p className="text-xs text-gray-500">
                  {companySettings?.company_tagline || 'Investment Advisory Excellence'}
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-sky-900 ${
                    activeSection === item.id
                      ? 'text-sky-900 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Button variant="outline" size="sm" className="border-sky-900 text-sky-900 hover:bg-sky-900 hover:text-white">
                Schedule Consultation
              </Button>
            </div>

            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-sky-50 text-sky-900 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen bg-background overflow-hidden pt-20" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-sky-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Mobile/Tablet: Slider di atas */}
            <div className="lg:hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <HeroImageSlider />
              </motion.div>
            </div>

            {/* Hero Content */}
            <div className="space-y-8">
              {/* Hero Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium"
                  style={{
                    backgroundColor: currentHero?.colors?.trustedBadgeBgColor || "#dbeafe",
                    borderColor: currentHero?.colors?.trustedBadgeTextColor || "#1e40af",
                    color: currentHero?.colors?.trustedBadgeTextColor || "#1e40af"
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: currentHero?.colors?.trustedBadgeTextColor || "#1e40af" }}
                    ></span>
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: currentHero?.colors?.trustedBadgeTextColor || "#1e40af" }}
                    ></span>
                  </span>
                  {currentHero?.trusted_text || 'Trusted by Industry Leaders'}
                </span>
              </motion.div>

              <div className="space-y-4">
                <h1 id="hero-heading">
                  <BlurText
                    text={currentHero?.title || ' '}
                    delay={50}
                    animateBy="words"
                    direction="bottom"
                    className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                    style={{ color: currentHero?.colors?.titleColor || "#111827" }}
                  />
                </h1>

                <h2>
                  <BlurText
                    text={currentHero?.subtitle || ' '}
                    delay={40}
                    animateBy="words"
                    direction="bottom"
                    className="text-xl md:text-2xl font-semibold"
                    style={{ color: currentHero?.colors?.subtitleColor || "#dc2626" }}
                  />
                </h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-base max-w-lg leading-relaxed"
                  style={{ color: currentHero?.colors?.descriptionColor || "#4b5563" }}
                >
                  {currentHero?.description || ' '}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg" className="group bg-sky-600 hover:bg-sky-700" onClick={() => scrollToSection('contact')}>
                  Schedule Consultation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={() => scrollToSection('services')}>
                  Our Services
                </Button>
              </motion.div>
            </div>

            {/* Desktop: Slider di sebelah kanan */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <HeroImageSlider />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-16 items-center ${(content.about.showMission || content.about.showVision) ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200">About Us</Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {content.about.title}
                </h2>
                <p className="text-base text-gray-600 mb-6 text-justify">
                  {content.about.description1}
                </p>
                <p className="text-base text-gray-600 mb-6 text-justify">
                  {content.about.description2}
                </p>
              </div>

              </div>

            {(content.about.showMission || content.about.showVision) && (
              <div className="relative">
                <div
                  className="rounded-2xl p-8 text-white"
                  style={{
                    background: `linear-gradient(to bottom right, ${content.about.gradientFromColor || '#0c4a6e'}, ${content.about.gradientToColor || '#111827'})`
                  }}
                >
                  {content.about.showMission && (
                    <>
                      <h3 className="text-xl font-bold mb-6">Our Mission</h3>
                      <p className="text-base mb-6 text-justify">
                        {content.about.mission || 'Loading mission...'}
                      </p>
                      {content.about.showVision && <Separator className="bg-white/20 my-6" />}
                    </>
                  )}

                  {content.about.showVision && (
                    <>
                      <h3 className="text-xl font-bold mb-6">Our Vision</h3>
                      <p className="text-base text-justify">
                        {content.about.vision || 'Loading vision...'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Animated Header */}
          <ServicesHeader
            title={content.servicesSection.title}
            description={content.servicesSection.description}
          />

          {/* Animated Service Cards */}
          <ServicesContainer>
            {[...content.services].sort((a, b) => (a.order_list || 0) - (b.order_list || 0)).map((service) => {
              const IconComponent = () => {
                switch(service.icon) {
                  case 'Target': return <Target className="w-8 h-8" />
                  case 'Shield': return <Shield className="w-8 h-8" />
                  case 'TrendingUp': return <TrendingUp className="w-8 h-8" />
                  case 'BarChart3': return <BarChart3 className="w-8 h-8" />
                  default: return <Target className="w-8 h-8" />
                }
              }

              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={service.order_list || 0}
                  iconComponent={<IconComponent />}
                  onClick={() => setSelectedService(service)}
                />
              )
            })}
          </ServicesContainer>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200">Our Team</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Expert Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team brings together decades of experience from leading financial institutions
              and consulting firms worldwide.
            </p>
          </motion.div>

          <div className={`grid gap-6 max-w-6xl mx-auto ${
            content.team.length === 1
              ? 'grid-cols-1 max-w-xs'
              : content.team.length === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-lg'
              : content.team.length === 3
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl'
              : content.team.length === 4
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-5xl'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {content.team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{
                  opacity: 0,
                  y: 60,
                  scale: 0.9,
                  rotateX: 15
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateX: 0
                }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: index * 0.15
                }}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMember(member)}
                className="cursor-pointer"
              >
                <motion.div
                  className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full group"
                  whileHover={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="border-0 shadow-none h-full bg-white rounded-2xl overflow-hidden">
                    {/* Image Container with hover effect */}
                    <motion.div
                      className="relative aspect-[3/4] sm:aspect-[2/3] md:aspect-[3/4] lg:aspect-[4/5] overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent z-10"></div>
                      <div className="absolute inset-0 border-3 border-white/20 z-10 rounded-t-2xl"></div>
                      <img
                        src={member.image}
                        alt={`${member.name} - ${member.position} at PT Quasar Investama`}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                        style={{
                          filter: 'brightness(1.05) contrast(1.1)'
                        }}
                      />

                      {/* Hover overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-sky-600/30 via-sky-600/10 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <div className="flex items-end justify-center h-full pb-4">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            whileHover={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="bg-white/95 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-lg"
                          >
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-sky-600" />
                              <span className="text-xs font-medium text-gray-800">View Profile</span>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>

                    <CardHeader className="text-center pb-3 px-3">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.3 }}
                        viewport={{ once: true }}
                      >
                        <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-sky-700 transition-colors duration-300 line-clamp-1">
                          {member.name}
                        </CardTitle>
                        <CardDescription className="text-red-600 font-semibold text-sm">
                          {member.position}
                        </CardDescription>
                      </motion.div>
                    </CardHeader>

                    <CardContent className="text-center space-y-3 px-3 pb-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.4 }}
                        viewport={{ once: true }}
                      >
                        <p className="text-xs text-gray-600 line-clamp-2">{member.expertise}</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.5 }}
                        viewport={{ once: true }}
                        className="text-xs text-gray-500 space-y-1"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs">{member.experience}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs">{member.education}</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.6 }}
                        viewport={{ once: true }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 group-hover:border-sky-400 group-hover:bg-sky-100 transition-all duration-300 text-xs"
                        >
                          View Profile
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Member Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-3xl w-[95vw] sm:w-[90vw] lg:w-[70vw] max-h-[85vh] p-0">
          {selectedMember && (
            <div className="flex flex-col h-[85vh]">
              {/* Header Section - Fixed */}
              <div className="flex-shrink-0 text-center space-y-4 p-6 border-b bg-white">
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {selectedMember.name}
                </DialogTitle>
                <DialogDescription className="text-lg sm:text-xl text-red-600 font-semibold">
                  {selectedMember.position}
                </DialogDescription>

                {/* Quick Info Badges */}
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-sky-100 text-sky-800 border-sky-200 px-3 py-1 text-sm font-medium">
                    💼 {selectedMember.experience}
                  </Badge>
                  <Badge variant="outline" className="border-gray-300 px-3 py-1 text-sm font-medium">
                    🎓 {selectedMember.education}
                  </Badge>
                </div>

                {/* Expertise Summary */}
                {selectedMember.expertise && (
                  <div className="bg-gray-50 rounded-lg p-4 text-left max-w-2xl mx-auto">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Expertise
                    </h4>
                    <p className="text-gray-700">{selectedMember.expertise}</p>
                  </div>
                )}
              </div>

              {/* Scrollable Content Area - Takes remaining space */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* About Section dengan Scroll */}
                {selectedMember.bio && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-sky-600" />
                      Biography
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {selectedMember.bio}
                      </p>
                    </div>
                  </div>
                )}

                {/* Areas of Expertise Section */}
                {selectedMember.specializations && selectedMember.specializations.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-sky-600" />
                      Areas of Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.specializations.map((spec: string, idx: number) => (
                        <Badge
                          key={idx}
                          className="bg-gradient-to-r from-sky-50 to-blue-50 text-sky-800 border-sky-200 px-3 py-1 text-sm font-medium hover:from-sky-100 hover:to-blue-100 transition-colors"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements Section */}
                {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      Key Achievements
                    </h3>
                    <div className="space-y-3">
                      {selectedMember.achievements.map((achievement: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 bg-amber-50 rounded-lg p-4">
                          <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extra padding at bottom for better scroll experience */}
                <div className="h-8"></div>
              </div>

              {/* Close Button - Fixed */}
              <div className="flex-shrink-0 flex justify-end p-6 border-t bg-white">
                <Button
                  variant="outline"
                  onClick={() => setSelectedMember(null)}
                  className="px-6 py-2 text-sm font-medium"
                >
                  Close Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />

      {/* Credentials Section */}
      <section id="credentials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200">Credentials</Badge>
            
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {content.credentials.map((credential, index) => (
              <motion.div
                key={credential.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full group">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {credential.logo_url ? (
                          <img
                            src={credential.logo_url}
                            alt={credential.title}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                        ) : null}
                        <div className={`${credential.logo_url ? 'hidden' : ''} w-full h-full flex items-center justify-center`}>
                          <Award className="w-8 h-8 text-amber-600" />
                        </div>
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <motion.h3
                          className="text-xl font-bold mb-2 group-hover:text-sky-700 transition-colors duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.1 }}
                          viewport={{ once: true }}
                        >
                          {credential.title}
                        </motion.h3>
                        <motion.p
                          className="text-gray-600 mt-2 line-clamp-4"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                          viewport={{ once: true }}
                        >
                          {credential.description}
                        </motion.p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section with Manual Slider */}
      <section id="clients" className="py-24 bg-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200">Our Clients</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by Industry Leaders
            </h2>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-sky-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-sky-50 to-transparent z-10 pointer-events-none" />

          <ManualSlider
            items={content.clients}
            loading={loading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md border border-sky-100">
            <Users className="w-5 h-5 text-sky-600" />
            <span className="text-gray-700 font-medium">
              <span className="text-2xl font-bold text-sky-600">{content.clients.length}</span>+
              <span className="ml-2">Long-term Corporate Partnerships</span>
            </span>
          </div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200">Gallery</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Journey in Pictures
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our milestones, team events, and the moments that define our commitment to excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.gallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full group">
                  <motion.div
                    className="aspect-video bg-gray-200 flex items-center justify-center relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    {item.imageUrl ? (
                      <>
                        <motion.img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                        />
                        {/* Overlay gradient on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        />
                      </>
                    ) : null}
                    <div className={`${item.imageUrl ? 'hidden' : ''} flex items-center justify-center w-full h-full`}>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <CardContent className="p-6">
                    <motion.div
                      className="flex items-center justify-between mb-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                    >
                      <Badge variant="outline" className="border-amber-200 text-amber-800">
                        {item.category}
                      </Badge>
                    </motion.div>
                    <motion.h3
                      className="text-lg font-bold mb-2 group-hover:text-sky-700 transition-colors duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p
                      className="text-sm text-gray-600"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      viewport={{ once: true }}
                    >
                      {item.description}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200">Contact Us</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your business? Contact our team of experts today
              to discuss how we can help you achieve your financial goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                  <select className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600">
                    <option value="">Select Service</option>
                    <option value="investment">Investment Advisory</option>
                    <option value="restructuring">Corporate Restructuring</option>
                    <option value="ma">M&A Advisory</option>
                    <option value="consulting">Financial Consulting</option>
                  </select>
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                  <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 font-semibold">
                    Send Message
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Office Address</h4>
                      <p className="text-gray-600 whitespace-pre-line">
                        {content.contact.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-gray-600">{content.contact.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-gray-600">{content.contact.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-sky-800 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>{content.contact.businessHours.weekdays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>{content.contact.businessHours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>{content.contact.businessHours.sunday}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                {companySettings?.logo_url ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden">
                    <img
                      src={companySettings.logo_url}
                      alt={companySettings.company_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-sky-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {companySettings?.company_name?.charAt(0) || 'Q'}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">
                    {companySettings?.company_name || 'PT Quasar Investama'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {companySettings?.company_tagline || 'Investment Advisory Excellence'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                {companySettings?.company_description || 'Leading investment advisory firm in Indonesia since 1994.'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Investment Advisory</div>
                <div className="text-sm text-gray-400">Corporate Restructuring</div>
                <div className="text-sm text-gray-400">M&A Advisory</div>
                <div className="text-sm text-gray-400">Financial Consulting</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400 mb-4">
                <div>{companySettings?.contact_phone || '+62 21 1234 5678'}</div>
                <div>{companySettings?.contact_email || 'info@quasarcapital.co.id'}</div>
                <div>{companySettings?.address || 'Jakarta, Indonesia'}</div>
              </div>

              {/* Social Media Links */}
              {(companySettings?.facebook_url || companySettings?.twitter_url || companySettings?.linkedin_url || companySettings?.instagram_url) && (
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-300">Follow Us</h5>
                  <div className="flex gap-3">
                    {companySettings?.facebook_url && (
                      <a
                        href={companySettings.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-4 h-4 text-white" />
                      </a>
                    )}
                    {companySettings?.twitter_url && (
                      <a
                        href={companySettings.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="w-4 h-4 text-white" />
                      </a>
                    )}
                    {companySettings?.linkedin_url && (
                      <a
                        href={companySettings.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4 text-white" />
                      </a>
                    )}
                    {companySettings?.instagram_url && (
                      <a
                        href={companySettings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-lg flex items-center justify-center hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 transition-all"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-4 h-4 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-gray-800 my-8" />

          <div className="text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} {companySettings?.company_name || 'PT Quasar Investama'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <CookieConsent />
      <Analytics />
    </div>
    </>
  )
}