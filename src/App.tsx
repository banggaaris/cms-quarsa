import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
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
  Image as ImageIcon
} from 'lucide-react'
import { CookieConsent } from '@/components/CookieConsent'
import { BlurText } from '@/components/BlurText'
import { InfiniteSlider } from '@/components/InfiniteSlider'
import { SEO } from '@/components/SEO'
import { useContent } from '@/hooks/useContent'

export default function App() {
  const { content, loading, reloadTeamContent } = useContent()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [scrollY, setScrollY] = useState(0)
  const [selectedMember, setSelectedMember] = useState<any>(null)

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

  if (loading) {
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
        title={content?.hero?.title ? `${content.hero.title} - PT Quasar Capital` : undefined}
        description={content?.hero?.description}
        keywords="investment advisory, financial consulting, PT Quasar Capital, M&A advisory, corporate restructuring, Indonesia investment"
        canonical="https://quasarcapital.co.id"
        ogImage="/hero-og-image.jpg"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": content?.hero?.title || "Investment Advisory Excellence",
          "description": content?.hero?.description,
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
              <div className="w-12 h-12 bg-sky-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PT Quasar Capital</h1>
                <p className="text-xs text-gray-500">Investment Advisory Excellence</p>
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium"
                  style={{
                    backgroundColor: content.hero.colors?.trustedBadgeBgColor || "#dbeafe",
                    borderColor: content.hero.colors?.trustedBadgeTextColor || "#1e40af",
                    color: content.hero.colors?.trustedBadgeTextColor || "#1e40af"
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: content.hero.colors?.trustedBadgeTextColor || "#1e40af" }}
                    ></span>
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: content.hero.colors?.trustedBadgeTextColor || "#1e40af" }}
                    ></span>
                  </span>
                  {content.hero.trustedText}
                </span>
              </motion.div>

              <div className="space-y-6">
                <h1 id="hero-heading">
                  <BlurText
                    text={content.hero.title}
                    delay={50}
                    animateBy="words"
                    direction="bottom"
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                    style={{ color: content.hero.colors?.titleColor || "#111827" }}
                  />
                </h1>

                <h2>
                  <BlurText
                    text={content.hero.subtitle}
                    delay={40}
                    animateBy="words"
                    direction="bottom"
                    className="text-2xl md:text-3xl font-semibold"
                    style={{ color: content.hero.colors?.subtitleColor || "#dc2626" }}
                  />
                </h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-lg max-w-xl"
                  style={{ color: content.hero.colors?.descriptionColor || "#4b5563" }}
                >
                  {content.hero.description}
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

            <div className="space-y-6">
              {[
                { icon: TrendingUp, title: "Investment Strategy", description: "Data-driven investment solutions" },
                { icon: Shield, title: "Risk Management", description: "Comprehensive risk assessment" },
                { icon: Users, title: "Expert Advisory", description: "Seasoned financial professionals" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-sky-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                      <feature.icon className="w-6 h-6 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200">About Us</Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {content.about.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {content.about.description1}
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  {content.about.description2}
                </p>
              </div>

              </div>

            <div className="relative">
              <div
                className="rounded-2xl p-8 text-white"
                style={{
                  background: `linear-gradient(to bottom right, ${content.about.gradientFromColor || '#0c4a6e'}, ${content.about.gradientToColor || '#111827'})`
                }}
              >
                <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
                <p className="text-lg mb-6">
                  {content.about.mission || 'Loading mission...'}
                </p>
                <Separator className="bg-white/20 my-6" />
                <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
                <p className="text-lg">
                  {content.about.vision || 'Loading vision...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200">Our Services</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Financial Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a full spectrum of investment advisory services designed to meet
              the diverse needs of our clients across various industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.services.map((service, index) => {
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
                <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center text-white ${
                      index === 0 ? 'bg-sky-600' :
                      index === 1 ? 'bg-red-600' :
                      index === 2 ? 'bg-amber-600' :
                      'bg-sky-600'
                    }`}>
                      <IconComponent />
                    </div>
                    <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-gray-600">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4 text-sky-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200">Our Team</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Expert Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team brings together decades of experience from leading financial institutions
              and consulting firms worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.team.map((member) => (
              <Card
                key={member.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => setSelectedMember(member)}
              >
                <CardHeader className="text-center">
                  <div className="w-full aspect-square mx-auto mb-4 rounded-lg overflow-hidden border-4 border-sky-100">
                    <img
                      src={member.image}
                      alt={`${member.name} - ${member.position} at PT Quasar Capital`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
                  <CardDescription className="text-red-600 font-semibold">
                    {member.position}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-gray-600">{member.expertise}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>{member.experience} experience</div>
                    <div>{member.education}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Member Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-6 mb-4">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-sky-100 flex-shrink-0">
                    <img
                      src={selectedMember.image}
                      alt={`${selectedMember.name} - ${selectedMember.position} at PT Quasar Capital`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-3xl font-bold mb-2">{selectedMember.name}</DialogTitle>
                    <DialogDescription className="text-red-600 font-semibold text-lg mb-2">
                      {selectedMember.position}
                    </DialogDescription>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge className="bg-sky-100 text-sky-800 border-sky-200">
                        {selectedMember.experience} experience
                      </Badge>
                      <Badge variant="outline" className="border-gray-300">
                        {selectedMember.education}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedMember.bio}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.specializations.map((spec: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-sky-50 text-sky-700 border border-sky-200">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={() => setSelectedMember(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Credentials Section */}
      <section id="credentials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200">Credentials</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Professional Certifications & Awards
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence is reflected in our professional certifications,
              licenses, and industry recognition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {content.credentials.map((credential) => (
              <Card key={credential.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold mb-2">{credential.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {credential.issuer}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-red-200 text-red-800">
                      {credential.type}
                    </Badge>
                    <span className="text-sm text-gray-500">{credential.year}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section with Infinite Slider */}
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are proud to partner with some of the most respected companies
              across various industries in Indonesia and Southeast Asia.
            </p>
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

          <InfiniteSlider
            items={content.clients}
            speed={40}
            pauseOnHover={true}
            direction="left"
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
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200">Gallery</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Journey in Pictures
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our milestones, team events, and the moments that define our commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.gallery.map((item) => (
              <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-amber-200 text-amber-800">
                      {item.category}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
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
                <div className="w-10 h-10 bg-sky-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">PT Quasar Capital</h3>
                  <p className="text-xs text-gray-400">Investment Advisory Excellence</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Leading investment advisory firm in Indonesia since 1994.
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
              <div className="space-y-2 text-sm text-gray-400">
                <div>+62 21 1234 5678</div>
                <div>info@quasarcapital.co.id</div>
                <div>Jakarta, Indonesia</div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-800 my-8" />

          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2024 PT Quasar Capital. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <CookieConsent />

      {/* Admin Access Link */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/admin'}
          className="bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
        >
          Admin
        </Button>
      </div>
    </div>
    </>
  )
}