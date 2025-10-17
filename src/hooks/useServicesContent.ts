import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  order_list: number
}

export function useServicesContent() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServicesContent()
  }, [])

  const loadServicesContent = async () => {
    try {
      const { data, error } = await supabase
        .from('service_content')
        .select('*')
        .order('order_list', { ascending: true })

      if (error) {
        console.error('Error loading services:', error)
      } else if (data) {
        const servicesData: Service[] = data.map(service => ({
          id: service.id,
          title: service.title,
          description: service.description,
          icon: service.icon,
          order_list: service.order_list || 0
        }))
        setServices(servicesData)
      }
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateServices = (services: Service[]) => {
    setServices(services)
  }

  return {
    services,
    loading,
    updateServices,
    reloadServicesContent: loadServicesContent
  }
}