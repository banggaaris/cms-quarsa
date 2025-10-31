import { useState } from 'react'
import { Building, ChevronLeft, ChevronRight } from 'lucide-react'

interface ManualSliderProps {
  items: any[];
  loading?: boolean;
}

export const ManualSlider = ({
  items,
  loading = false
}: ManualSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle empty state and loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex justify-center items-center py-12 text-gray-500">
        <div className="text-center">
          <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No clients to display</p>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Calculate visible cards based on total number of clients (now showing larger logos)
  const getVisibleCount = () => {
    const totalItems = items.length;

    if (totalItems <= 2) return totalItems;
    if (totalItems === 3) return 3;
    if (totalItems === 4) return 4;
    if (totalItems === 5) return 5;

    // For 6+ items, show max 6 at once for larger logos
    return Math.min(6, totalItems);
  };

  const visibleCount = getVisibleCount();
  const visibleItems = [];

  // Get items for current view (circular)
  for (let i = 0; i < visibleCount; i++) {
    const index = (currentIndex + i) % items.length;
    visibleItems.push(items[index]);
  }

  return (
    <div className="relative">
      <div className="overflow-hidden px-4 sm:px-6 lg:px-8">
        <div
          className="flex gap-6 sm:gap-8 transition-transform duration-500 ease-in-out justify-center"
          style={{
            transform: 'translateX(0)',
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={`${item.name}-${currentIndex}-${index}`}
              className="flex-shrink-0 w-48 h-48 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-gray-100"
            >
              {item.logo_url ? (
                <img
                  src={item.logo_url}
                  alt={`${item.name || 'Client'} logo`}
                  className="w-36 h-36 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                  loading="lazy"
                />
              ) : null}
              <div className={`${item.logo_url ? 'hidden' : ''} flex items-center justify-center`}>
                <Building className="w-20 h-20 text-sky-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - always visible */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-sky-600 hover:bg-sky-50 transition-all duration-300 z-20 border border-gray-200"
        aria-label="Previous clients"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-sky-600 hover:bg-sky-50 transition-all duration-300 z-20 border border-gray-200"
        aria-label="Next clients"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator - only show if more than 1 client */}
      {items.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-sky-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to client ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};