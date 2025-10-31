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
    showMission: true,
    showVision: true,
    gradientFromColor: "#0c4a6e",
    gradientToColor: "#111827",
    stats: {
      years: "30+",
      deals: "750+",
      value: "$15B+",
      team: "50+"
    }
  },
  servicesSection: {
    title: "Comprehensive Financial Solutions",
    description: "We offer a full spectrum of investment advisory services designed to meet the diverse needs of our clients across various industries."
  },
  services: [
    {
      id: "1",
      title: "Investment Advisory",
      description: "Strategic investment guidance to maximize portfolio returns and minimize risks",
      icon: "Target",
      order_list: 0
    },
    {
      id: "2",
      title: "Corporate Restructuring",
      description: "Comprehensive restructuring solutions for distressed businesses",
      icon: "Shield",
      order_list: 1
    },
    {
      id: "3",
      title: "M&A Advisory",
      description: "End-to-end merger and acquisition services",
      icon: "TrendingUp",
      order_list: 2
    },
    {
      id: "4",
      title: "Financial Consulting",
      description: "Expert financial analysis and planning services",
      icon: "BarChart3",
      order_list: 3
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
      description: "Official license from Indonesia's Financial Services Authority (OJK) to provide professional investment advisory services with the highest standards of compliance and ethics.",
      logo_url: "https://cdn-icons-png.flaticon.com/512/2620/2620679.png",
      order_index: 0
    },
    {
      id: "2",
      title: "ISO 9001:2015 Certified",
      description: "International quality management system certification ensuring excellence in our service delivery processes and client satisfaction standards.",
      logo_url: "https://cdn-icons-png.flaticon.com/512/2620/2620574.png",
      order_index: 1
    }
  ],
  clients: [
    {
      id: "1",
      name: "Bank Central Asia",
      industry: "Banking",
      description: "Long-term strategic advisory partnership",
      years: "10+"
    },
    {
      id: "2",
      name: "Astra International",
      industry: "Automotive & Heavy Equipment",
      description: "M&A and restructuring advisory",
      years: "8+"
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

export function useAdminContent() {
  const [content, setContent] = useState<WebsiteContent>(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      // Load all hero content (all statuses for admin)
      const { data: heroData, error: heroError } = await supabase
        .from('hero_content')
        .select('*')
        .order('updated_at', { ascending: false })

      if (heroError) {
        // Error loading hero content
      } else if (heroData && heroData.length > 0) {

        // Use the most recent hero for display, but store all for admin list
        const latestHero = heroData[0]
        setContent(prev => ({
          ...prev,
          hero: {
            id: latestHero.id,
            title: latestHero.title,
            subtitle: latestHero.subtitle,
            description: latestHero.description,
            trustedText: latestHero.trusted_text,
            status: latestHero.status,
            colors: latestHero.colors || prev.hero.colors,
            stats: prev.hero.stats, // Keep existing stats for now
            created_at: latestHero.created_at,
            updated_at: latestHero.updated_at
          },
          allHeroes: heroData // Store all hero records
        }))
      }

      // Load service content
      const { data: servicesData, error: servicesError } = await supabase
        .from('service_content')
        .select('*')
        .order('order_list', { ascending: true })

      if (servicesError) {
        // Error loading services
      } else if (servicesData) {
        const services: Service[] = servicesData.map(service => ({
          id: service.id,
          title: service.title,
          description: service.description,
          icon: service.icon,
          order_list: service.order_list || 0
        }))
        setContent(prev => ({ ...prev, services }))
      }

      // Load services section content
      const { data: servicesSectionData, error: servicesSectionError } = await supabase
        .from('services_section_content')
        .select('*')
        .limit(1)
        .single()

      if (servicesSectionError && servicesSectionError.code !== 'PGRST116') {
        // Error loading services section content
      } else if (servicesSectionData) {
        setContent(prev => ({
          ...prev,
          servicesSection: {
            title: servicesSectionData.title,
            description: servicesSectionData.description
          }
        }))
      }

      // Load team content
      const { data: teamData, error: teamError } = await supabase
        .from('team_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (teamError) {
        // Error loading team
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
        // Error loading clients
      } else if (clientsData) {
        const clients: Client[] = clientsData.map(client => ({
          id: client.id,
          name: client.name,
          industry: '',
          description: '',
          years: '',
          logoUrl: client.logo_url || ''
        }))
        setContent(prev => ({ ...prev, clients }))
      }

      // Load credential content
      const { data: credentialsData, error: credentialsError } = await supabase
        .from('credential_content')
        .select('*')
        .order('order_index', { ascending: true })

      if (credentialsError) {
        // Error('Error loading credentials:', credentialsError)
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

      // Load about content
      const { data: aboutData, error: aboutError } = await supabase
        .from('about_content')
        .select('*')
        .limit(1)
        .single()

      if (aboutError && aboutError.code !== 'PGRST116') {
        // Error('Error loading about content:', aboutError)
      } else if (aboutData) {
        setContent(prev => ({
          ...prev,
          about: {
            title: aboutData.title,
            description1: aboutData.description1,
            description2: aboutData.description2,
            mission: aboutData.mission,
            vision: aboutData.vision,
            showMission: aboutData.show_mission !== undefined ? aboutData.show_mission : true,
            showVision: aboutData.show_vision !== undefined ? aboutData.show_vision : true,
            gradientFromColor: aboutData.gradient_from_color || "#0c4a6e",
            gradientToColor: aboutData.gradient_to_color || "#111827",
            stats: prev.about.stats // Keep existing stats from default content
          }
        }))
      }

      // Load contact content
      const { data: contactData, error: contactError } = await supabase
        .from('contact_content')
        .select('*')
        .limit(1)
        .single()

      if (contactError && contactError.code !== 'PGRST116') {
        // Error('Error loading contact:', contactError)
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
      // Error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateHero = async (hero: Partial<WebsiteContent['hero']>, heroId?: string) => {
        try {
      let heroPayload: any

      if (heroId && (Object.keys(hero).length === 1 && hero.status)) {
        // If only updating status for a specific hero (publish/unpublish), only update status
                heroPayload = { status: hero.status }
      } else {
        // Full hero update - get current data from database if specific hero
        if (heroId) {
          const { data: currentHero } = await supabase
            .from('hero_content')
            .select('*')
            .eq('id', heroId)
            .single()

          if (currentHero) {
            heroPayload = {
              title: hero.title || currentHero.title,
              subtitle: hero.subtitle || currentHero.subtitle,
              description: hero.description || currentHero.description,
              trusted_text: hero.trustedText || currentHero.trusted_text,
              status: hero.status || currentHero.status || 'draft'
            }
          } else {
            // Error('Hero not found for ID:', heroId)
            return
          }
        } else {
          // Use fallback to content.hero
          heroPayload = {
            title: hero.title || content.hero.title,
            subtitle: hero.subtitle || content.hero.subtitle,
            description: hero.description || content.hero.description,
            trusted_text: hero.trustedText || content.hero.trustedText,
            status: hero.status || content.hero.status || 'draft'
          }
        }
      }

      
      let result
      if (heroId) {
                result = await supabase
          .from('hero_content')
          .update(heroPayload)
          .eq('id', heroId)
              } else {
        // Update the most recent hero
        const { data: latestHero } = await supabase
          .from('hero_content')
          .select('id')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()

        if (latestHero?.id) {
                    result = await supabase
            .from('hero_content')
            .update(heroPayload)
            .eq('id', latestHero.id)
                  }
      }

      if (!result || result.error) {
        // Error('Error updating hero:', result?.error || 'Unknown error')
        return
      }

            // Reload content to get updated list
      await loadContent()
          } catch (error) {
      // Error('Error updating hero:', error)
    }
  }

  const createHero = async (hero: Partial<WebsiteContent['hero']>) => {
    try {
      const heroPayload = {
        title: hero.title || "New Hero Section",
        subtitle: hero.subtitle || "",
        description: hero.description || "",
        trusted_text: hero.trustedText || "New Content",
        status: 'draft' // Always start as draft
      }

      const result = await supabase
        .from('hero_content')
        .insert(heroPayload)
        .select()
        .single()

      if (result.error) {
        // Error('Error creating hero:', result.error)
        return null
      }

      // Reload content to get updated list
      await loadContent()
      return result.data
    } catch (error) {
      // Error('Error creating hero:', error)
      return null
    }
  }

  const deleteHero = async (heroId: string) => {
    try {
      const result = await supabase
        .from('hero_content')
        .delete()
        .eq('id', heroId)

      if (result.error) {
        // Error('Error deleting hero:', result.error)
        return
      }

      // Reload content to get updated list
      await loadContent()
    } catch (error) {
      // Error('Error deleting hero:', error)
    }
  }

  const publishHero = async (heroId?: string) => {
        await updateHero({ status: 'published' }, heroId)
  }

  const unpublishHero = async (heroId?: string) => {
        await updateHero({ status: 'draft' }, heroId)
  }

  const updateAbout = async (about: Partial<WebsiteContent['about']>) => {
        try {
      const aboutPayload = {
        title: about.title || content.about.title,
        description1: about.description1 || content.about.description1,
        description2: about.description2 || content.about.description2,
        mission: about.mission || content.about.mission,
        vision: about.vision || content.about.vision,
        gradient_from_color: about.gradientFromColor || content.about.gradientFromColor,
        gradient_to_color: about.gradientToColor || content.about.gradientToColor
      }

      // Check if about content already exists
      const { data: existingAbout } = await supabase
        .from('about_content')
        .select('id')
        .limit(1)
        .single()

      let result
      if (existingAbout?.id) {
        // Update existing record
        result = await supabase
          .from('about_content')
          .update(aboutPayload)
          .eq('id', existingAbout.id)
              } else {
        // Insert new record
        result = await supabase
          .from('about_content')
          .insert(aboutPayload)
              }

      if (!result || result.error) {
        // Error('Error updating about content:', result?.error || 'Unknown error')
        return false
      }

      // Update local state
      setContent(prev => ({ ...prev, about: { ...prev.about, ...about } }))
            return true
    } catch (error) {
      // Error('Error updating about:', error)
      return false
    }
  }

  const updateServices = (services: Service[]) => {
    setContent(prev => ({ ...prev, services }))
  }

  const updateServicesDatabase = async (services: Service[]) => {
    try {
      // First, clear existing service content
      await supabase
        .from('service_content')
        .delete()
        .neq('id', 'impossible-id') // Delete all records

      // Insert updated services
      if (services.length > 0) {
        const servicesPayload = services.map((service, index) => ({
          id: service.id.startsWith('temp-') ? undefined : service.id,
          title: service.title,
          description: service.description,
          icon: service.icon,
          order_list: service.order_list || index
        }))

        const { error } = await supabase
          .from('service_content')
          .upsert(servicesPayload, { onConflict: 'id' })

        if (error) {
          // Error('Error updating service content:', error)
          return false
        }
      }

      // Update local state
      setContent(prev => ({ ...prev, services }))
      return true
    } catch (error) {
      // Error('Error updating services:', error)
      return false
    }
  }

  const updateTeam = async (team: TeamMember[]) => {
    try {
      // First, clear existing team content
      await supabase
        .from('team_content')
        .delete()
        .neq('id', 'impossible-id') // Delete all records

      // Insert updated team members
      if (team.length > 0) {
        const teamPayload = team.map((member, index) => ({
          id: member.id.startsWith('temp-') ? undefined : member.id,
          name: member.name,
          position: member.position,
          expertise: member.expertise,
          experience: member.experience,
          education: member.education,
          image_url: member.image,
          bio: member.bio,
          specializations: member.specializations,
          order_index: index
        }))

        const { error } = await supabase
          .from('team_content')
          .upsert(teamPayload, { onConflict: 'id' })

        if (error) {
          // Error('Error updating team content:', error)
          return false
        }
      }

      // Update local state
      setContent(prev => ({ ...prev, team }))
            return true
    } catch (error) {
      // Error('Error updating team:', error)
      return false
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

  const updateContact = async (contact: Partial<WebsiteContent['contact']>) => {
    try {
      const contactPayload = {
        address: contact.address || content.contact.address,
        phone: contact.phone || content.contact.phone,
        email: contact.email || content.contact.email,
        business_hours_weekdays: contact.businessHours?.weekdays || content.contact.businessHours.weekdays,
        business_hours_saturday: contact.businessHours?.saturday || content.contact.businessHours.saturday,
        business_hours_sunday: contact.businessHours?.sunday || content.contact.businessHours.sunday
      }

      // Check if contact content already exists
      const { data: existingContact } = await supabase
        .from('contact_content')
        .select('id')
        .limit(1)
        .single()

      let result
      if (existingContact?.id) {
        // Update existing record
        result = await supabase
          .from('contact_content')
          .update(contactPayload)
          .eq('id', existingContact.id)
      } else {
        // Insert new record
        result = await supabase
          .from('contact_content')
          .insert(contactPayload)
      }

      if (!result || result.error) {
        // Error('Error updating contact content:', result?.error || 'Unknown error')
        return false
      }

      // Update local state
      setContent(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          ...contact,
          businessHours: {
            ...prev.contact.businessHours,
            ...contact.businessHours
          }
        }
      }))
      return true
    } catch (error) {
      // Error('Error updating contact:', error)
      return false
    }
  }

  return {
    content,
    loading,
    updateContent: () => {},
    updateHero,
    createHero,
    deleteHero,
    publishHero,
    unpublishHero,
    updateAbout,
    updateServices,
    updateServicesDatabase,
    updateTeam,
    updateCredentials,
    updateClients,
    updateGallery,
    updateContact
  }
}