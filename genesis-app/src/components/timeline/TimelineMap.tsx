import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { ERAS } from '../../data/eras';
import { useTimelineStore } from '../../store/timelineStore';
import { EraNode } from './EraNode';

// Animated camera
const AnimatedPerspectiveCamera = animated(PerspectiveCamera);

// Seeded random for stable SSR/hydration
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Curved path component showing the journey
function TimelinePath() {
  const points = useMemo(() => [
    new THREE.Vector3(-6, 0, 0),
    new THREE.Vector3(-4, 0.5, 1),
    new THREE.Vector3(-2, 0, 2),
    new THREE.Vector3(0, -0.5, 1),
    new THREE.Vector3(2, 0, 2),
    new THREE.Vector3(4, 0.5, 1),
    new THREE.Vector3(6, 0, 0),
  ], []);

  const { tubeGeometry, texture } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 64, 0.02, 8, false);
    
    // Create a gradient texture for the path
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 64, 0);
    gradient.addColorStop(0, '#33FF00');    // Boot - green
    gradient.addColorStop(0.15, '#33FF00'); // Genesis - green
    gradient.addColorStop(0.25, '#FFB000'); // Assembly - amber
    gradient.addColorStop(0.35, '#FFFFFF'); // C Revolution - white
    gradient.addColorStop(0.45, '#333333'); // Algorithms - black/white
    gradient.addColorStop(0.55, '#C0C0C0'); // Early GUI - grey
    gradient.addColorStop(0.65, '#0000FF'); // Web 1.0 - blue
    gradient.addColorStop(0.75, '#4A90E2'); // Web 2.0 - sky blue
    gradient.addColorStop(0.85, '#00FFFF'); // Modern - cyan
    gradient.addColorStop(0.95, '#9D4EDD'); // AGI - purple
    gradient.addColorStop(1, '#FFFFFF');    // Portfolio - white
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 1);
    const tex = new THREE.CanvasTexture(canvas);
    
    return { tubeGeometry: geometry, texture: tex };
  }, [points]);

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Glowing particles along path */}
      {points.map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Scene with all era nodes
function TimelineScene({ onSelectEra, selectedEraId }: { onSelectEra: (id: string) => void; selectedEraId: string | null }) {
  const visitedEras = useTimelineStore((state) => state.visitedEras);
  const currentEraId = useTimelineStore((state) => state.currentEra);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  // Calculate positions along a curved path
  const getNodePosition = useCallback((index: number): [number, number, number] => {
    const totalEras = ERAS.length;
    const t = index / (totalEras - 1);
    
    // S-curve layout
    const x = -6 + t * 12;
    const y = Math.sin(t * Math.PI * 2) * 0.5;
    const z = Math.sin(t * Math.PI) * 2;
    
    return [x, y, z];
  }, []);

  // Camera animation when selecting an era
  const { cameraPosition } = useSpring({
    cameraPosition: selectedEraId 
      ? (() => {
          const index = ERAS.findIndex(e => e.id === selectedEraId);
          const pos = getNodePosition(index);
          return [pos[0], pos[1] + 2, pos[2] + 4];
        })()
      : [0, 4, 10],
    config: { tension: 120, friction: 30 }
  });

  useFrame(() => {
    if (cameraRef.current && controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <>
      <AnimatedPerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={cameraPosition as unknown as [number, number, number]}
        fov={50}
      />
      
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        target={[0, 0, 0]}
      />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffffff" />

      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

      <TimelinePath />

      {ERAS.map((era, index) => (
        <EraNode
          key={era.id}
          era={era}
          position={getNodePosition(index)}
          index={index}
          isVisited={visitedEras.has(era.id)}
          isCurrent={currentEraId === era.id}
          onClick={() => onSelectEra(era.id)}
        />
      ))}

      {/* Background particles that shift color */}
      <ParticleField />
    </>
  );
}

// Ambient particle field
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  const particleCount = 200;
  
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (seededRandom(i) - 0.5) * 20;
      arr[i * 3 + 1] = (seededRandom(i + 1000) - 0.5) * 10;
      arr[i * 3 + 2] = (seededRandom(i + 2000) - 0.5) * 10;
    }
    return arr;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#ffffff" 
        transparent 
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main TimelineMap component
export function TimelineMap({ onJumpToEra }: { onJumpToEra: (eraId: string) => void }) {
  const { isMapOpen, closeMap, visitedEras } = useTimelineStore();
  const [selectedEraId, setSelectedEraId] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleSelectEra = useCallback((eraId: string) => {
    setSelectedEraId(eraId);
    setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        onJumpToEra(eraId);
        closeMap();
        setIsClosing(false);
        setSelectedEraId(null);
      }, 500);
    }, 800);
  }, [onJumpToEra, closeMap]);

  // Lock body scroll when map is open
  useEffect(() => {
    if (isMapOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMapOpen]);

  if (!isMapOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)' }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Computing Timeline
          </h1>
          <p className="text-gray-400 text-sm">
            {visitedEras.size} of {ERAS.length} eras explored
          </p>
        </div>
        
        <button
          onClick={closeMap}
          className="pointer-events-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
        >
          Close [ESC]
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
        <div className="text-gray-500 text-sm space-y-1">
          <p>🖱️ Click node to jump to era</p>
          <p>🖱️ Drag to rotate view</p>
          <p>🖱️ Scroll to zoom</p>
        </div>
      </div>

      {/* Legend */}<div className="absolute bottom-6 right-6 z-10 pointer-events-none">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-300">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-white"></div>
            <span className="text-gray-300">Current</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 4, 10], fov: 50 }}
      >
        <TimelineScene onSelectEra={handleSelectEra} selectedEraId={selectedEraId} />
      </Canvas>
    </div>
  );
}
