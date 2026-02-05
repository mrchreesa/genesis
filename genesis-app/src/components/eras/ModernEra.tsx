// Modern Web Era - React, 3D, Glassmorphism

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function ModernEra() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full flex flex-col items-center justify-center p-8"
      style={{ 
        background: '#0D0D0D',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12 z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          MODERN WEB
        </h1>
        
        <p className="text-xl text-gray-400"
        >
          2010 - 2022
        </p>
      </motion.div>

      {/* 3D Glass Cards */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl z-10"
      >
        {[
          { 
            title: 'React', 
            desc: 'Component-based UIs',
            icon: '⚛️',
            gradient: 'from-blue-400 to-cyan-400',
          },
          { 
            title: 'TypeScript', 
            desc: 'Type-safe JavaScript',
            icon: '📘',
            gradient: 'from-blue-500 to-blue-700',
          },
          { 
            title: 'Three.js', 
            desc: '3D in the browser',
            icon: '🎲',
            gradient: 'from-purple-400 to-pink-400',
          },
        ].map((tech, idx) => (
          <motion.div
            key={tech.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="group relative"
            style={{
              perspective: '1000px',
            }}
          >
            <motion.div
              className="relative p-8 rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
                transformStyle: 'preserve-3d',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Glow Effect */}
              <div 
                className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br ${tech.gradient} blur-xl`}
              />
              
              <div className="relative z-10 text-center"
              >
                <div className="text-5xl mb-4"
                >{tech.icon}</div>
                
                <h3 className="text-2xl font-bold text-white mb-2"
                >{tech.title}</h3>
                
                <p className="text-gray-400"
                >{tech.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              width: 400 + i * 100,
              height: 400 + i * 100,
              background: i === 0 ? '#00FFFF' : i === 1 ? '#9D4EDD' : '#FF006E',
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            initial={{
              x: `${20 + i * 30}%`,
              y: `${20 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Feature Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 z-10"
      >
        {['SPA', 'PWA', 'JAMstack', 'Serverless', 'GraphQL', 'WebAssembly', 'WebGL', 'WebRTC'].map((tech) => (
          <div
            key={tech}
            className="px-4 py-2 rounded-lg text-center text-sm text-gray-300 border border-gray-800 hover:border-cyan-500/50 transition-colors"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            {tech}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
