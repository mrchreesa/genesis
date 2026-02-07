import { useState, useEffect, useRef, useCallback } from 'react';
import { BootSequence } from './components/BootSequence';
import { EraContainer } from './components/EraContainer';
import { ProgressBar } from './components/ProgressBar';
import { TimelineMap } from './components/timeline';
import { useTimelineStore } from './store/timelineStore';
import { ERAS } from './data/eras';
import { Map } from 'lucide-react';
import './index.css';

function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [currentEraIndex, setCurrentEraIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Timeline store
  const { setCurrentEra, visitEra, openMap, toggleMap } = useTimelineStore();

  // Handle scroll to determine current era
  useEffect(() => {
    if (!bootComplete) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const eraHeight = windowHeight; // Each era is full viewport height
      
      const newIndex = Math.min(
        Math.floor(scrollY / eraHeight),
        ERAS.length - 1
      );
      
      if (newIndex !== currentEraIndex && newIndex >= 0) {
        setCurrentEraIndex(newIndex);
        setCurrentEra(ERAS[newIndex].id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bootComplete, currentEraIndex, setCurrentEra]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 'M' key toggles map
      if (e.key === 'm' || e.key === 'M') {
        if (bootComplete) {
          toggleMap();
        }
      }
      // ESC closes map (handled in TimelineMap)
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bootComplete, toggleMap]);

  // Prevent scrolling during boot sequence
  useEffect(() => {
    if (!bootComplete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [bootComplete]);

  // Visit eras as user scrolls
  useEffect(() => {
    if (bootComplete && ERAS[currentEraIndex]) {
      visitEra(ERAS[currentEraIndex].id);
    }
  }, [bootComplete, currentEraIndex, visitEra]);

  const handleBootComplete = () => {
    setBootComplete(true);
    // Smooth scroll to first era after boot
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Jump to specific era from timeline map
  const handleJumpToEra = useCallback((eraId: string) => {
    const eraIndex = ERAS.findIndex(e => e.id === eraId);
    if (eraIndex >= 0) {
      const targetY = eraIndex * window.innerHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      setCurrentEraIndex(eraIndex);
      setCurrentEra(eraId);
    }
  }, [setCurrentEra]);

  return (
    <div ref={containerRef} className="relative">
      {/* Boot Sequence Overlay */}
      {!bootComplete && (
        <BootSequence onComplete={handleBootComplete} />
      )}
      
      {/* Progress Bar - only show after boot */}
      {bootComplete && (
        <ProgressBar 
          currentEra={currentEraIndex} 
          totalEras={ERAS.length}
        />
      )}
      
      {/* Main Content */}
      {bootComplete && <EraContainer />}
      
      {/* Timeline Map */}
      {bootComplete && (
        <TimelineMap onJumpToEra={handleJumpToEra} />
      )}
      
      {/* Floating Map Button */}
      {bootComplete && (
        <button
          onClick={openMap}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          aria-label="Open Timeline Map"
        >
          <Map className="w-6 h-6 text-white group-hover:text-cyan-400 transition-colors" />
          <span className="absolute -top-10 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Timeline [M]
          </span>
        </button>
      )}
    </div>
  );
}

export default App;
