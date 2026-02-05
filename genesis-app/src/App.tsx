import { useState, useEffect, useRef } from 'react';
import { BootSequence } from './components/BootSequence';
import { EraContainer } from './components/EraContainer';
import { ProgressBar } from './components/ProgressBar';
import { ERAS } from './data/eras';
import './index.css';

function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [currentEraIndex, setCurrentEraIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bootComplete, currentEraIndex]);

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

  const handleBootComplete = () => {
    setBootComplete(true);
    // Smooth scroll to first era after boot
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

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
    </div>
  );
}

export default App;
