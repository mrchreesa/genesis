import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ERAS } from '../data/eras';

interface ProgressBarProps {
  currentEra: number;
  totalEras: number;
}

export function ProgressBar({ currentEra, totalEras }: ProgressBarProps) {
  const progress = ((currentEra + 1) / totalEras) * 100;
  const era = ERAS[currentEra + 1]; // +1 to skip boot
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide progress bar when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (!era) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          {/* Progress fill with glow effect */}
          <div className="h-1 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              className="h-full relative"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${era?.colorTheme.accent} 0%, ${era?.colorTheme.accent}dd 100%)`,
                boxShadow: `0 0 20px ${era?.colorTheme.accent}80`,
              }}
              layoutId="progress"
            >
              {/* Animated shimmer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>
          
          {/* Era info panel */}
          <motion.div 
            className="px-4 py-2 text-xs flex justify-between items-center backdrop-blur-md border-b"
            style={{ 
              backgroundColor: `${era?.colorTheme.bg}dd`,
              borderColor: `${era?.colorTheme.accent}30`,
              color: era?.colorTheme.text,
            }}
          >
            <div className="flex items-center gap-4"
            >
              <span className="opacity-60 font-mono"
              >
                {String(currentEra + 1).padStart(2, '0')} / {String(totalEras).padStart(2, '0')}
              </span>
              
              <div className="h-4 w-px opacity-20" style={{ backgroundColor: era?.colorTheme.text }} />
              
              <span className="font-bold tracking-wide"
              >
                {era?.name.toUpperCase()}
              </span>
              
              <span className="opacity-50 font-mono hidden sm:inline"
              >
                {era?.yearRange}
              </span>
            </div>
            
            <div className="flex items-center gap-4"
            >
              <span className="opacity-60 hidden md:block max-w-md truncate"
              >
                {era?.description}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
