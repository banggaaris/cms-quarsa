import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Badge } from '@/components/ui/badge'

interface ServiceCardProps {
  service: {
    id: string
    title: string
    description: string
    icon: string
    order_list: number
  }
  index: number
  iconComponent: React.ReactNode
  onClick?: () => void
}

// Container untuk stagger animation
export const ServicesContainer = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {children}
    </motion.div>
  )
}

// Service Card dengan multiple animation effects
export const ServiceCard = ({ service, index, iconComponent, onClick }: ServiceCardProps) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9,
      rotateX: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.15,
      },
    },
  }

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        delay: index * 0.15 + 0.3,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
      },
    },
  }

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.15 + 0.4,
      },
    },
  }

  
  const getColorClasses = (index: number) => {
    const colors = [
      { bg: 'bg-sky-600', hover: 'hover:bg-sky-700' },
      { bg: 'bg-red-600', hover: 'hover:bg-red-700' },
      { bg: 'bg-amber-600', hover: 'hover:bg-amber-700' },
      { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
    ]
    return colors[index % colors.length]
  }

  const colorClasses = getColorClasses(index)

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <motion.div
        className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full group"
        initial={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
        whileHover={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: { duration: 0.3 },
        }}
      >
        <div className="bg-white rounded-2xl p-6 h-full flex flex-col relative">
          {/* Icon Container */}
          <motion.div
            className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white ${colorClasses.bg} ${colorClasses.hover} transition-colors duration-300`}
            variants={iconVariants}
            whileHover="hover"
          >
            {iconComponent}
          </motion.div>

          {/* Card Content */}
          <div className="flex-1 flex flex-col space-y-4">
            {/* Title */}
            <motion.div variants={textVariants}>
              <h3 className="text-xl font-bold text-center text-gray-900 group-hover:text-sky-700 transition-colors duration-300">
                {service.title}
              </h3>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={textVariants}
              className="text-gray-600 text-center flex-1 line-clamp-3"
            >
              {service.description}
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-transparent rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

// Background decoration animation
export const ServicesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

// Floating particles animation
export const FloatingParticles = () => {
  const particles = Array.from({ length: 6 }, (_, i) => i)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-sky-400 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

// Section header dengan animasi
interface ServicesHeaderProps {
  title?: string;
  description?: string;
}

export const ServicesHeader = ({ title, description }: ServicesHeaderProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6"
      >
        <Badge className="bg-sky-100 text-sky-800 border-sky-200">Our Services</Badge>
      </motion.div>

      <motion.h2
        className="text-4xl font-bold text-gray-900 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {title || "Comprehensive Financial Solutions"}
      </motion.h2>

      <motion.p
        className="text-xl text-gray-600 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {description || "We offer a full spectrum of investment advisory services designed to meet the diverse needs of our clients across various industries."}
      </motion.p>
    </motion.div>
  )
}