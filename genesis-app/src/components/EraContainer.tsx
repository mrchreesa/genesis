import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GenesisEra } from './eras/GenesisEra';
import { AssemblyEra } from './eras/AssemblyEra';
import { CRevolutionEra } from './eras/CRevolutionEra';
import { AlgorithmsEra } from './eras/AlgorithmsEra';
import { EarlyGuiEra } from './eras/EarlyGuiEra';
import { Web1Era } from './eras/Web1Era';
import { Web2Era } from './eras/Web2Era';
import { ModernEra } from './eras/ModernEra';
import { AgiEra } from './eras/AgiEra';
import { PortfolioEra } from './eras/PortfolioEra';
import { ERAS } from '../data/eras';

const eraComponents = [
  GenesisEra,
  AssemblyEra,
  CRevolutionEra,
  AlgorithmsEra,
  EarlyGuiEra,
  Web1Era,
  Web2Era,
  ModernEra,
  AgiEra,
  PortfolioEra,
];

interface EraContainerProps {
  onEraChange?: (index: number) => void;
}

export function EraContainer({ onEraChange }: EraContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentEra, setCurrentEra] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll to era function - defined early to avoid hoisting issues
  const scrollToEra = useCallback((index: number) => {
    if (isScrolling || index < 0 || index >= eraComponents.length) return;
    
    setIsScrolling(true);
    const windowHeight = window.innerHeight;
    
    window.scrollTo({
      top: index * windowHeight,
      behavior: 'smooth'
    });
    
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      setCurrentEra(index);
      onEraChange?.(index);
    }, 800);
  }, [isScrolling, onEraChange]);

  // Track which era is in view
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrolling) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const newEra = Math.round(scrollY / windowHeight);
    
    if (newEra !== currentEra && newEra >= 0 && newEra < eraComponents.length) {
      setCurrentEra(newEra);
      onEraChange?.(newEra);
    }
  }, [currentEra, isScrolling, onEraChange]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextEra = Math.min(currentEra + 1, eraComponents.length - 1);
        scrollToEra(nextEra);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevEra = Math.max(currentEra - 1, 0);
        scrollToEra(prevEra);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToEra(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToEra(eraComponents.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentEra, isScrolling, scrollToEra]);

  return (
    <div ref={containerRef} className="relative"
    >
      {eraComponents.map((EraComponent, index) => {
        const era = ERAS[index + 1];
        const nextEra = ERAS[index + 2];
        const isActive = index === currentEra;
        
        return (
          <section
            key={era.id}
            id={era.id}
            className="min-h-screen w-full relative overflow-hidden snap-start"
            style={{ 
              backgroundColor: era.colorTheme.bg,
              scrollSnapAlign: 'start',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isActive ? 1 : 0.3,
                scale: isActive ? 1 : 0.98,
              }}
              transition={{ duration: 0.6 }}
              className="h-full w-full"
            >
              <EraComponent />
            </motion.div>
            
            {/* Smooth gradient transition to next era */}
            {index < eraComponents.length - 1 && nextEra && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
                style={{
                  background: `linear-gradient(to bottom, transparent 0%, ${nextEra.colorTheme.bg}80 50%, ${nextEra.colorTheme.bg} 100%)`,
                }}
              />
            )}

            {/* Era navigation hint */}
            {index < eraComponents.length - 1 && isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
              >
                <motion.button
                  onClick={() => scrollToEra(index + 1)}
                  className="flex flex-col items-center gap-2 opacity-40 hover:opacity-80 transition-opacity"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-xs uppercase tracking-widest" style={{ color: era.colorTheme.text }}>
                    Continue
                  </span>
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={era.colorTheme.text}
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </section>
        );
      })}

      {/* Era quick navigation dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
      >
        {eraComponents.map((_, index) => {
          const era = ERAS[index + 1];
          return (
            <motion.button
              key={index}
              onClick={() => scrollToEra(index)}
              className="group relative"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div
                className="w-3 h-3 rounded-full border-2 transition-all duration-300"
                style={{
                  backgroundColor: index === currentEra ? era.colorTheme.accent : 'transparent',
                  borderColor: era.colorTheme.accent,
                  opacity: index === currentEra ? 1 : 0.4,
                  boxShadow: index === currentEra ? `0 0 10px ${era.colorTheme.accent}` : 'none',
                }}
              />
              
              {/* Tooltip */}
              <span 
                className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ 
                  backgroundColor: era.colorTheme.bg,
                  color: era.colorTheme.text,
                  border: `1px solid ${era.colorTheme.accent}40`,
                }}
              >
                {era.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
