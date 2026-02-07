import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import type { Era } from '../../data/eras';

interface EraNodeProps {
  era: Era;
  position: [number, number, number];
  index: number;
  isVisited: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

// Animated RoundedBox
const AnimatedRoundedBox = animated(RoundedBox);

// Boot Sequence Node - Green Phosphor Cube with grid pattern
function BootNode({ color }: { color: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 4; i++) {
      const positions = new Float32Array([-0.5, -0.2 + i * 0.13, 0.51, 0.5, -0.2 + i * 0.13, 0.51]);
      lines.push(
        <line key={`h${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={0.6} />
        </line>
      );
    }
    return lines;
  }, [color]);

  return (
    <group>
      <group ref={meshRef}>
        <AnimatedRoundedBox args={[1, 1, 1]} radius={0.05} smoothness={4}>
          <meshStandardMaterial 
            color="#000000" 
            emissive={color} 
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.8}
          />
        </AnimatedRoundedBox>
      </group>
      <group ref={linesRef}>
        {gridLines}
      </group>
    </group>
  );
}

// Seeded random for stable SSR/hydration
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Genesis Node - Punch card cylinder with holes
function GenesisNode({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  const holes = useMemo(() => {
    const holePositions = [];
    let seed = 0;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        if (seededRandom(seed++) > 0.3) {
          holePositions.push([
            -0.35 + col * 0.1,
            0.25 - row * 0.12,
            0.26
          ]);
        }
      }
    }
    return holePositions;
  }, []);

  return (
    <group ref={groupRef}>
      <RoundedBox args={[1, 0.7, 0.5]} radius={0.02} smoothness={2}>
        <meshStandardMaterial 
          color="#1a1a1a" 
          emissive={color} 
          emissiveIntensity={0.15}
          roughness={0.7}
        />
      </RoundedBox>
      {holes.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <circleGeometry args={[0.03, 8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      ))}
      {/* Edge glow */}
      <RoundedBox args={[1.05, 0.75, 0.55]} radius={0.02} smoothness={2}>
        <meshBasicMaterial color={color} transparent opacity={0.1} wireframe />
      </RoundedBox>
    </group>
  );
}

// Assembly Node - Amber terminal with glowing tubes
function AssemblyNode({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main terminal housing */}
      <RoundedBox args={[0.9, 0.7, 0.6]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#2a2520" roughness={0.5} metalness={0.6} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, 0.05, 0.31]}>
        <planeGeometry args={[0.7, 0.45]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Text lines */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[-0.25 + i * 0.05, 0.18 - i * 0.1, 0.33]}>
          <planeGeometry args={[0.3 - i * 0.02, 0.02]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

// C Revolution Node - Unix/C icon - stacked discs
function CRevolutionNode({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.4;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Stacked cylinder discs representing data layers */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, -0.3 + i * 0.2, 0]}>
          <cylinderGeometry args={[0.4 - i * 0.05, 0.4 - i * 0.05, 0.08, 32]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            emissive={color} 
            emissiveIntensity={0.1 + i * 0.05}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      ))}
      {/* C letter glow */}
      <mesh position={[0, 0, 0.35]}>
        <ringGeometry args={[0.15, 0.25, 32, 1, 0, Math.PI * 1.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// Algorithms Node - Flowchart nodes connected by lines
function AlgorithmsNode({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.1;
    }
  });

  const nodes = [
    { pos: [0, 0.3, 0], size: 0.15 },
    { pos: [-0.3, 0, 0], size: 0.12 },
    { pos: [0.3, 0, 0], size: 0.12 },
    { pos: [0, -0.3, 0], size: 0.1 },
  ];

  const linePositions = useMemo(() => {
    return new Float32Array([
      0, 0.3, 0, -0.3, 0, 0,
      0, 0.3, 0, 0.3, 0, 0,
      -0.3, 0, 0, 0, -0.3, 0,
      0.3, 0, 0, 0, -0.3, 0,
    ]);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </line>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos as [number, number, number]}>
          <sphereGeometry args={[node.size, 16, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive={color} 
            emissiveIntensity={0.3}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Early GUI Node - Beveled gray box with window
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function EarlyGuiNode(_props: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main window frame */}
      <RoundedBox args={[1, 0.75, 0.15]} radius={0.02} smoothness={2}>
        <meshStandardMaterial color="#c0c0c0" roughness={0.4} />
      </RoundedBox>
      {/* Title bar */}
      <mesh position={[0, 0.3, 0.08]}>
        <boxGeometry args={[0.96, 0.15, 0.02]} />
        <meshStandardMaterial color="#000080" />
      </mesh>
      {/* Window content */}
      <mesh position={[0, -0.05, 0.08]}>
        <boxGeometry args={[0.9, 0.5, 0.02]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Buttons */}
      {[[0.35, 0.3], [0.22, 0.3], [0.09, 0.3]].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], 0.09]}>
          <boxGeometry args={[0.08, 0.08, 0.01]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>
      ))}
    </group>
  );
}

// Web 1.0 Node - Table structure with marquee
function Web1Node({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Page body */}
      <RoundedBox args={[0.9, 1, 0.05]} radius={0.01} smoothness={2}>
        <meshBasicMaterial color="#cccccc" />
      </RoundedBox>
      {/* Header */}
      <mesh position={[0, 0.35, 0.03]}>
        <boxGeometry args={[0.8, 0.15, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Content blocks */}
      {[[-0.2, 0.1], [0.2, 0.1], [-0.2, -0.15], [0.2, -0.15]].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], 0.03]}>
          <boxGeometry args={[0.3, 0.15, 0.02]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {/* Blue link underlines */}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={i} position={[x, -0.4, 0.03]}>
          <boxGeometry args={[0.25, 0.02, 0.01]} />
          <meshBasicMaterial color="#0000ff" />
        </mesh>
      ))}
    </group>
  );
}

// Web 2.0 Node - Glossy gradients and reflections
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Web2Node(_props: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const shineRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.35) * 0.2;
    }
    if (shineRef.current) {
      shineRef.current.position.x = -0.5 + Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glossy card base */}
      <RoundedBox args={[0.85, 0.85, 0.1]} radius={0.1} smoothness={4}>
        <meshStandardMaterial 
          color="#4a90e2" 
          roughness={0.1}
          metalness={0.1}
        />
      </RoundedBox>
      {/* White shine overlay */}
      <mesh ref={shineRef} position={[0, 0.2, 0.06]}>
        <planeGeometry args={[0.3, 0.15]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      {/* RSS icon hint */}
      <mesh position={[0, -0.1, 0.06]}>
        <circleGeometry args={[0.2, 32, 0, Math.PI * 0.5]} />
        <meshBasicMaterial color="#ff6600" />
      </mesh>
    </group>
  );
}

// Modern Web Node - Glass morphism with depth
function ModernNode({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const floatingRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
    if (floatingRef.current) {
      floatingRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.05;
      floatingRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glass card */}
      <RoundedBox args={[0.9, 0.9, 0.08]} radius={0.15} smoothness={4}>
        <meshPhysicalMaterial 
          color="#0d0d0d"
          transparent
          opacity={0.6}
          transmission={0.3}
          roughness={0.1}
          ior={1.5}
          thickness={0.1}
        />
      </RoundedBox>
      {/* Glowing border */}
      <RoundedBox args={[0.95, 0.95, 0.06]} radius={0.16} smoothness={4}>
        <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
      </RoundedBox>
      {/* Floating 3D element */}
      <group ref={floatingRef}>
        <mesh position={[0, 0, 0.2]}>
          <octahedronGeometry args={[0.15]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  );
}

// AGI Node - Neural network visualization
function AgiNode({ color, secondaryColor }: { color: string; secondaryColor?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
    if (nodesRef.current) {
      nodesRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const offset = i * 0.5;
        mesh.position.y += Math.sin(clock.getElapsedTime() * 2 + offset) * 0.002;
      });
    }
  });

  const neuralNodes = useMemo(() => {
    const positions = [];
    // 3 layers
    for (let layer = 0; layer < 3; layer++) {
      const z = -0.2 + layer * 0.2;
      const count = layer === 1 ? 4 : 3;
      for (let i = 0; i < count; i++) {
        positions.push({
          pos: [
            -0.2 + (i % 2) * 0.4,
            -0.15 + Math.floor(i / 2) * 0.3,
            z
          ],
          layer
        });
      }
    }
    return positions;
  }, []);

  const linePositions = useMemo(() => {
    return new Float32Array([
      0, 0.3, 0, -0.3, 0, 0,
      0, 0.3, 0, 0.3, 0, 0,
      -0.3, 0, 0, 0, -0.3, 0,
      0.3, 0, 0, 0, -0.3, 0,
    ]);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Neural network container */}
      <RoundedBox args={[1, 1, 0.5]} radius={0.05} smoothness={2}>
        <meshStandardMaterial 
          color="#000000" 
          emissive={secondaryColor || color}
          emissiveIntensity={0.1}
        />
      </RoundedBox>
      {/* Nodes */}
      <group ref={nodesRef}>
        {neuralNodes.map((node, i) => (
          <mesh key={i} position={node.pos as [number, number, number]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial 
              color={node.layer === 1 ? (secondaryColor || color) : color}
              emissive={node.layer === 1 ? (secondaryColor || color) : color}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </group>
      {/* Connection glow lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.4} />
      </line>
    </group>
  );
}

// Portfolio Node - Personal brand showcase
function PortfolioNode({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -clock.getElapsedTime() * 0.5;
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central showcase */}
      <RoundedBox args={[0.8, 0.8, 0.1]} radius={0.4} smoothness={8}>
        <meshStandardMaterial 
          color="#1a1a1a"
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.8}
        />
      </RoundedBox>
      {/* Rotating ring */}
      <mesh ref={ringRef} position={[0, 0, 0.1]}>
        <ringGeometry args={[0.35, 0.4, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      {/* Inner glow */}
      <mesh position={[0, 0, 0.05]}>
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Main EraNode component that renders the appropriate visualization
export function EraNode({ era, position, isVisited, isCurrent, onClick }: EraNodeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const { scale } = useSpring({
    scale: isCurrent ? 1.3 : isVisited ? 1.1 : 1,
    config: { tension: 200, friction: 20 }
  });

  useFrame(({ clock }) => {
    if (groupRef.current && isCurrent) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.05;
    }
  });

  const renderVisualization = () => {
    const accentColor = era.colorTheme.accent;
    
    switch (era.id) {
      case 'boot':
        return <BootNode color={accentColor} />;
      case 'genesis':
        return <GenesisNode color={accentColor} />;
      case 'assembly':
        return <AssemblyNode color={accentColor} />;
      case 'c-revolution':
        return <CRevolutionNode color={accentColor} />;
      case 'algorithms':
        return <AlgorithmsNode color={accentColor} />;
      case 'early-gui':
        return <EarlyGuiNode color={accentColor} />;
      case 'web1':
        return <Web1Node color={accentColor} />;
      case 'web2':
        return <Web2Node color={accentColor} />;
      case 'modern':
        return <ModernNode color={accentColor} />;
      case 'agi':
        return <AgiNode color={accentColor} secondaryColor={era.colorTheme.text} />;
      case 'portfolio':
        return <PortfolioNode color={accentColor} />;
      default:
        return <BootNode color={accentColor} />;
    }
  };

  return (
    <group 
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <animated.group scale={scale}>
        {renderVisualization()}
      </animated.group>
      
      {/* Era label */}
      <Html position={[0, -0.8, 0]} center>
        <div className="text-center pointer-events-none select-none whitespace-nowrap"
          style={{ 
            color: isCurrent ? era.colorTheme.accent : isVisited ? '#ffffff' : '#666666',
            textShadow: '0 0 10px rgba(0,0,0,0.8)'
          }}
        >
          <div className="text-lg font-bold">{era.name}</div>
          <div className="text-xs" style={{ color: isVisited ? '#aaaaaa' : '#444444' }}>
            {era.yearRange}
          </div>
        </div>
      </Html>

      {/* Visited indicator */}
      {isVisited && (
        <mesh position={[0.5, 0.5, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      )}

      {/* Current indicator ring */}
      {isCurrent && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshBasicMaterial 
            color={era.colorTheme.accent} 
            transparent 
            opacity={0.5} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
