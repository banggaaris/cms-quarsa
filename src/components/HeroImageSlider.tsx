import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useHeroSlides } from '@/hooks/useHeroSlides'

interface Slide {
  id: string
  title: string
  description: string
  image: string
}

interface HeroImageSliderProps {
  slides?: Slide[];
  autoPlay?: boolean;
  interval?: number;
}

const defaultSlides: Slide[] = [
  {
    id: "1",
    title: "Investment Strategy",
    description: "Data-driven investment solutions for optimal portfolio performance",
    image: "https://picsum.photos/800/500?random=1&blur=2"
  },
  {
    id: "2",
    title: "Risk Management",
    description: "Comprehensive risk assessment and mitigation strategies",
    image: "https://picsum.photos/800/500?random=2&blur=2"
  },
  {
    id: "3",
    title: "Expert Advisory",
    description: "Seasoned financial professionals guiding your success",
    image: "https://picsum.photos/800/500?random=3&blur=2"
  },
  {
    id: "4",
    title: "Market Analysis",
    description: "Deep market insights and trend analysis for informed decisions",
    image: "https://picsum.photos/800/500?random=4&blur=2"
  },
  {
    id: "5",
    title: "Financial Growth",
    description: "Strategic planning for sustainable business growth",
    image: "https://picsum.photos/800/500?random=5&blur=2"
  }
]

export const HeroImageSlider = ({
  autoPlay = true,
  interval = 10000
}: HeroImageSliderProps) => {
  const { publishedSlides, loading } = useHeroSlides()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Convert database slides to component format
  const slides: Slide[] = publishedSlides.map(slide => ({
    id: slide.id,
    title: slide.title,
    description: slide.description,
    image: slide.image_url
  }))

  // Use default slides if no published slides are available yet
  const displaySlides = slides.length > 0 ? slides : defaultSlides

  // Debug: log when component mounts
  useEffect(() => {
    console.log('HeroImageSlider mounted with slides:', displaySlides.length)
  }, [displaySlides])

  useEffect(() => {
    if (!autoPlay || isPaused || loading) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displaySlides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, isPaused, displaySlides.length, loading])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + displaySlides.length) % displaySlides.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displaySlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const currentSlide = displaySlides[currentIndex]

  return (
    <div
      className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${currentSlide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
              </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div className="rounded-lg p-6 max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-3xl md:text-4xl font-bold leading-tight text-white">
                  {currentSlide.title}
                </h3>
                <p className="text-lg md:text-xl text-white/95">
                  {currentSlide.description}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/20"
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/20"
        onClick={goToNext}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {displaySlides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Pause/Play Indicator */}
      {autoPlay && (
        <div className="absolute top-4 right-4">
          <div className={`w-1 h-1 bg-white rounded-full ${
            isPaused ? 'animate-pulse' : 'animate-ping'
          }`} />
        </div>
      )}

        </div>
  )
}