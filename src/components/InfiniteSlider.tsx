import { useState } from 'react'
import { Building, Clock } from 'lucide-react'

interface InfiniteSliderProps {
  items: any[];
  speed?: number;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
}

export const InfiniteSlider = ({
  items,
  speed = 30,
  pauseOnHover = true,
  direction = 'left'
}: InfiniteSliderProps) => {
  const [isPaused, setIsPaused] = useState(false);

  const duplicatedItems = [...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className="flex gap-8"
        style={{
          animation: isPaused ? 'none' : `slide-${direction} ${speed}s linear infinite`,
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-sky-100 rounded-lg flex items-center justify-center">
                <Building className="w-8 h-8 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm font-semibold text-red-600 mt-1">{item.industry}</p>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="inline-flex items-center gap-1 px-3 py-1  rounded-full text-xs font-medium">
                
              </div>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slide-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes slide-right {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }
        `
      }} />
    </div>
  );
};