import { useState } from 'react'
import { Building } from 'lucide-react'

interface InfiniteSliderProps {
  items: any[];
  speed?: number;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  loading?: boolean;
}

export const InfiniteSlider = ({
  items,
  speed = 30,
  pauseOnHover = true,
  direction = 'left',
  loading = false
}: InfiniteSliderProps) => {
  const [isPaused, setIsPaused] = useState(false);

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

  const duplicatedItems = [...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className="flex gap-6 sm:gap-8 will-change-transform"
        style={{
          animation: isPaused ? 'none' : `slide-${direction} ${speed}s linear infinite`,
          transform: 'translateZ(0)', // Hardware acceleration
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100"
          >
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-16 h-16 mx-auto bg-sky-100 rounded-lg overflow-hidden flex items-center justify-center">
                {item.logo_url ? (
                  <img
                    src={item.logo_url}
                    alt={`${item.name || 'Client'} logo`}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                    loading="lazy"
                  />
                ) : null}
                <div className={`${item.logo_url ? 'hidden' : ''} w-full h-full flex items-center justify-center`}>
                  <Building className="w-8 h-8 text-sky-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 truncate px-2">
                  {item.name || 'Client Name'}
                </h3>
                <p className="text-sm font-semibold text-red-600 mt-1 truncate px-2">
                  {item.industry || 'Industry'}
                </p>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 px-2">
                {item.description || 'Description not available'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slide-left {
            0% {
              transform: translateX(0) translateZ(0);
            }
            100% {
              transform: translateX(-50%) translateZ(0);
            }
          }

          @keyframes slide-right {
            0% {
              transform: translateX(-50%) translateZ(0);
            }
            100% {
              transform: translateX(0) translateZ(0);
            }
          }
        `
      }} />
    </div>
  );
};