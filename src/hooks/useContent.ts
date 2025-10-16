import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { WebsiteContent, TeamMember, Service, Credential, Client, GalleryItem } from '@/types/content'

const defaultContent: WebsiteContent = {
  hero: {
    id: "default",
    title: "Strategic Investment & Restructuring Advisory",
    subtitle: "Transforming Challenges into Opportunities",
    description: "We provide expert guidance in corporate restructuring, financial advisory, and strategic investment solutions to help businesses navigate complex financial landscapes.",
    trustedText: "Trusted by Fortune 500 Companies",
    status: 'published',
    colors: {
      titleColor: "#111827",
      subtitleColor: "#dc2626",
      descriptionColor: "#4b5563",
      trustedBadgeTextColor: "#1e40af",
      trustedBadgeBgColor: "#dbeafe"
    },
    stats: {
      assets: "$2.5B+",
      clients: "150+",
      experience: "25+"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  allHeroes: [],
  about: {
    title: "Leading Investment Advisory Firm",
    description1: "Founded in 1994, PT Quasar Capital has established itself as Indonesia's premier investment advisory firm, combining deep local expertise with global best practices.",
    description2: "Our team of seasoned professionals brings decades of experience in investment banking, corporate restructuring, and strategic advisory services to help clients navigate complex financial challenges and seize growth opportunities.",
    mission: "To provide exceptional investment advisory services that create sustainable value for our clients through strategic insight, operational excellence, and unwavering commitment to success.",
    vision: "To be the most trusted investment advisory partner in Southeast Asia, recognized for our integrity, expertise, and transformative impact on businesses and economies.",
    gradientFromColor: "#0c4a6e",
    gradientToColor: "#111827",
    stats: {
      years: "30+",
      deals: "750+",
      value: "$15B+",
      team: "50+"
    }
  },
  services: [
    {
      id: "1",
      title: "Investment Advisory",
      description: "Strategic investment guidance to maximize portfolio returns and minimize risks",
      icon: "Target",
      features: ["Portfolio Management", "Risk Assessment", "Market Analysis"]
    },
    {
      id: "2",
      title: "Corporate Restructuring",
      description: "Comprehensive restructuring solutions for distressed businesses",
      icon: "Shield",
      features: ["Debt Restructuring", "Operational Efficiency", "Strategic Planning"]
    },
    {
      id: "3",
      title: "M&A Advisory",
      description: "End-to-end merger and acquisition services",
      icon: "TrendingUp",
      features: ["Due Diligence", "Valuation", "Negotiation Support"]
    },
    {
      id: "4",
      title: "Financial Consulting",
      description: "Expert financial analysis and planning services",
      icon: "BarChart3",
      features: ["Financial Modeling", "Budget Planning", "Performance Analysis"]
    }
  ],
  team: [
    {
      id: "1",
      name: "John Anderson",
      position: "Managing Partner",
      expertise: "Investment Strategy, M&A",
      experience: "20+ years",
      education: "MBA, Harvard Business School",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      bio: "John Anderson leads PT Quasar Capital with over two decades of experience in investment strategy and mergers & acquisitions. He has successfully advised on transactions worth over $5 billion across various sectors.",
      specializations: ["Corporate Restructuring", "Investment Banking", "Strategic M&A", "Private Equity"],
      achievements: [
        "Led 150+ successful M&A transactions",
        "Advised Fortune 500 companies on strategic investments",
        "Former Managing Director at Goldman Sachs",
        "Board member of multiple public companies"
      ]
    },
    {
      id: "2",
      name: "Sarah Mitchell",
      position: "Senior Partner",
      expertise: "Restructuring, Turnaround",
      experience: "18+ years",
      education: "PhD, Stanford University",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
      bio: "Dr. Sarah Mitchell specializes in corporate restructuring and turnaround strategies. Her expertise has helped numerous companies navigate financial distress and emerge stronger.",
      specializations: ["Corporate Turnaround", "Debt Restructuring", "Operational Efficiency", "Crisis Management"],
      achievements: [
        "Successfully restructured $3B+ in corporate debt",
        "Saved 10,000+ jobs through strategic turnarounds",
        "Published author on corporate restructuring",
        "Former consultant at McKinsey & Company"
      ]
    }
  ],
  credentials: [
    {
      id: "1",
      title: "Licensed Investment Advisor",
      issuer: "Financial Services Authority (OJK)",
      year: "2010 - Present",
      type: "Professional License"
    },
    {
      id: "2",
      title: "ISO 9001:2015 Certified",
      issuer: "International Organization for Standardization",
      year: "2018 - Present",
      type: "Quality Management"
    }
  ],
  clients: [
    {
      id: "1",
      name: "Bank Central Asia",
      industry: "Banking & Financial Services",
      description: "One of Indonesia's largest private banks and a leading financial institution in Southeast Asia.",
      years: "10+",
      logo_url: ""
    },
    {
      id: "2",
      name: "Astra International",
      industry: "Automotive & Manufacturing",
      description: "A leading automotive company in Indonesia with diversified business interests in manufacturing, finance, and technology.",
      years: "8+",
      logo_url: ""
    }
  ],
  gallery: [
    {
      id: "1",
      title: "Office Headquarters",
      description: "Our modern office in Jakarta",
      category: "Office"
    },
    {
      id: "2",
      title: "Team Building 2024",
      description: "Annual team retreat in Bali",
      category: "Events"
    }
  ],
  contact: {
    address: "PT Quasar Capital\nJakarta Stock Exchange Building\nTower 2, 15th Floor\nJakarta 12190, Indonesia",
    phone: "+62 21 1234 5678",
    email: "info@quasarcapital.co.id",
    businessHours: {
      weekdays: "9:00 AM - 6:00 PM",
      saturday: "9:00 AM - 1:00 PM",
      sunday: "Closed"
    }
  }
}

export function useContent() {
  const [content, setContent] = useState<WebsiteContent>(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000) // 5 second timeout

    return () => clearTimeout(timeout)
  }, [])

  const loadContent = async () => {
    try {
     
      // Load hero content (only published)
      const { data: heroData, error: heroError } = await supabase
        .from('hero_content')
        .select('*')
        .eq('status', 'published')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (heroError && heroError.code !== 'PGRST116') {
        console.error('Error loading hero content:', heroError)
      } else if (heroData) {
        setContent(prev => ({
          ...prev,
          hero: {
            id: heroData.id,
            title: heroData.title,
            subtitle: heroData.subtitle,
            description: heroData.description,
            trustedText: heroData.trusted_text,
            status: heroData.status,
            colors: heroData.colors || prev.hero.colors,
            stats: prev.hero.stats, // Keep existing stats for now
            created_at: heroData.created_at,
            updated_at: heroData.updated_at
          }
        }))
      }

      // Load service content
      const { data: servicesData, error: servicesError } = await supabase
        .from('service_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (servicesError) {
        console.error('Error loading services:', servicesError)
      } else if (servicesData) {
        const services: Service[] = servicesData.map(service => ({
          id: service.id,
          title: service.title,
          description: service.description,
          icon: service.icon,
          features: service.features || []
        }))
        setContent(prev => ({ ...prev, services }))
      }

      // Load team content
      const { data: teamData, error: teamError } = await supabase
        .from('team_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (teamError) {
        console.error('Error loading team:', teamError)
      } else if (teamData) {
        const team: TeamMember[] = teamData.map(member => ({
          id: member.id,
          name: member.name,
          position: member.position,
          expertise: member.expertise || '',
          experience: member.experience || '',
          education: member.education || '',
          image: member.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
          bio: member.bio || '',
          specializations: member.specializations || [],
          achievements: []
        }))
        setContent(prev => ({ ...prev, team }))
      }

      // Load client content
      const { data: clientsData, error: clientsError } = await supabase
        .from('client_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (clientsError) {
        console.error('Error loading clients:', clientsError)
      } else if (clientsData) {
        const clients: Client[] = clientsData.map(client => ({
          id: client.id,
          name: client.name,
          industry: client.industry || '',
          description: client.description || '',
          years: '',
          logo_url: client.logo_url || ''
        }))
        setContent(prev => ({ ...prev, clients }))
      }

      // Load gallery content
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (galleryError) {
        console.error('Error loading gallery:', galleryError)
      } else if (galleryData) {
        const gallery: GalleryItem[] = galleryData.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          category: item.category || 'general',
          imageUrl: item.image_url || ''
        }))
        setContent(prev => ({ ...prev, gallery }))
      }

      // Load about content
      const { data: aboutData, error: aboutError } = await supabase
        .from('about_content')
        .select('*')
        .limit(1)
        .single()

      if (aboutError && aboutError.code !== 'PGRST116') {
        console.error('Error loading about content:', aboutError)
      } else if (aboutData) {
        setContent(prev => ({
          ...prev,
          about: {
            title: aboutData.title,
            description1: aboutData.description1,
            description2: aboutData.description2,
            mission: aboutData.mission,
            vision: aboutData.vision,
            gradientFromColor: aboutData.gradient_from_color || "#0c4a6e",
            gradientToColor: aboutData.gradient_to_color || "#111827",
            stats: prev.about.stats // Keep existing stats from default content
          }
        }))
      }

      // Load credential content
      const { data: credentialsData, error: credentialsError } = await supabase
        .from('credential_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (credentialsError) {
        console.error('Error loading credentials:', credentialsError)
      } else if (credentialsData) {
        const credentials: Credential[] = credentialsData.map(cred => ({
          id: cred.id,
          title: cred.title,
          description: cred.description || '',
          logo_url: cred.logo_url || '',
          order_index: cred.order_index || 0
        }))
        setContent(prev => ({ ...prev, credentials }))
      }

      // Load contact content
      const { data: contactData, error: contactError } = await supabase
        .from('contact_content')
        .select('*')
        .limit(1)
        .single()

      if (contactError && contactError.code !== 'PGRST116') {
        console.error('Error loading contact:', contactError)
      } else if (contactData) {
        setContent(prev => ({
          ...prev,
          contact: {
            address: contactData.address,
            phone: contactData.phone,
            email: contactData.email,
            businessHours: {
              weekdays: contactData.business_hours_weekdays,
              saturday: contactData.business_hours_saturday,
              sunday: contactData.business_hours_sunday
            }
          }
        }))
      }

    } catch (error) {
      console.error('Error loading content:', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const updateHero = async (hero: Partial<WebsiteContent['hero']>) => {
    try {
      const { data: existingData } = await supabase
        .from('hero_content')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      const heroPayload = {
        title: hero.title || content.hero.title,
        subtitle: hero.subtitle || content.hero.subtitle,
        description: hero.description || content.hero.description,
        trusted_text: hero.trustedText || content.hero.trustedText,
        status: hero.status || content.hero.status || 'draft'
      }

      let result
      if (existingData?.id) {
        result = await supabase
          .from('hero_content')
          .update(heroPayload)
          .eq('id', existingData.id)
      } else {
        result = await supabase
          .from('hero_content')
          .insert(heroPayload)
          .select()
          .single()
      }

      if (result.error) {
        console.error('Error updating hero:', result.error)
        return
      }

      setContent(prev => ({
        ...prev,
        hero: { ...prev.hero, ...hero }
      }))
    } catch (error) {
      console.error('Error updating hero:', error)
    }
  }

  const publishHero = async () => {
    await updateHero({ status: 'published' })
  }

  const unpublishHero = async () => {
    await updateHero({ status: 'draft' })
  }

  const updateAbout = (about: Partial<WebsiteContent['about']>) => {
    setContent(prev => ({ ...prev, about: { ...prev.about, ...about } }))
  }

  const updateServices = (services: Service[]) => {
    setContent(prev => ({ ...prev, services }))
  }

  const updateTeam = (team: TeamMember[]) => {
    setContent(prev => ({ ...prev, team }))
  }

  const reloadTeamContent = async () => {
    try {
      const { data: teamData, error: teamError } = await supabase
        .from('team_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (teamError) {
        console.error('Error reloading team:', teamError)
      } else if (teamData) {
        const team: TeamMember[] = teamData.map(member => ({
          id: member.id,
          name: member.name,
          position: member.position,
          expertise: member.expertise || '',
          experience: member.experience || '',
          education: member.education || '',
          image: member.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
          bio: member.bio || '',
          specializations: member.specializations || [],
          achievements: []
        }))
        setContent(prev => ({ ...prev, team }))
      }
    } catch (error) {
      console.error('Error reloading team:', error)
    }
  }

  const updateCredentials = (credentials: Credential[]) => {
    setContent(prev => ({ ...prev, credentials }))
  }

  const updateClients = (clients: Client[]) => {
    setContent(prev => ({ ...prev, clients }))
  }

  const updateGallery = (gallery: GalleryItem[]) => {
    setContent(prev => ({ ...prev, gallery }))
  }

  const updateContact = (contact: Partial<WebsiteContent['contact']>) => {
    setContent(prev => ({ ...prev, contact: { ...prev.contact, ...contact } }))
  }

  return {
    content,
    loading,
    updateContent: () => {},
    updateHero,
    publishHero,
    unpublishHero,
    updateAbout,
    updateServices,
    updateTeam,
    reloadTeamContent,
    updateCredentials,
    updateClients,
    updateGallery,
    updateContact
  }
}