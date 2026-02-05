// Portfolio Era - Kreeza's Digital Garden
// The culmination of the journey through computing history

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

interface Skill {
  name: string;
  level: number;
  color: string;
}

export function PortfolioEra() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState<'about' | 'skills' | 'contact'>('about');
  const [typedText, setTypedText] = useState('');
  const fullText = 'Building the future, one line at a time.';

  // Generate stars background
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 3,
    }));
    setStars(newStars);
  }, []);

  // Typing effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const skills: Skill[] = [
    { name: 'React/TypeScript', level: 95, color: '#61DAFB' },
    { name: 'Node.js/Python', level: 90, color: '#339933' },
    { name: 'AI/ML', level: 85, color: '#FF6B6B' },
    { name: 'System Design', level: 80, color: '#9D4EDD' },
    { name: 'Product Strategy', level: 75, color: '#FFD93D' },
  ];

  const projects = [
    { name: 'Genesis', desc: 'This portfolio — an interactive journey through computing history', tech: 'React, Framer Motion, TypeScript' },
    { name: 'AI Assistant', desc: 'Personal AI agent for automation and productivity', tech: 'Python, OpenAI, Node.js' },
    { name: 'Startup MVP', desc: 'Currently building in stealth mode', tech: 'React, Firebase, TensorFlow' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden"
      style={{ background: '#0a0a0f' }}
    >
      {/* Animated Starfield Background */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              background: '#fff',
              opacity: star.opacity,
              transform: `translate(${mousePos.x * (star.size / 10)}px, ${mousePos.y * (star.size / 10)}px)`,
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + star.delay,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #667eea 0%, transparent 70%)',
            left: '10%',
            top: '20%',
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #764ba2 0%, transparent 70%)',
            right: '10%',
            bottom: '20%',
            transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Avatar with glow */}
          <motion.div
            className="relative w-40 h-40 mx-auto mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                filter: 'blur(20px)',
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
            <div 
              className="relative w-full h-full rounded-full flex items-center justify-center text-6xl"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 0 60px rgba(102, 126, 234, 0.5)',
              }}
            >
              👨‍💻
            </div>
          </motion.div>

          {/* Name with gradient */}
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #a8b2d1 50%, #667eea 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            KREEZA
          </motion.h1>

          {/* Typing subtitle */}
          <div className="h-8 mb-6">
            <motion.p 
              className="text-xl md:text-2xl font-mono"
              style={{ color: '#64ffda' }}
            >
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                |
              </motion.span>
            </motion.p>
          </div>

          {/* Role tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['Software Engineer', 'Startup Founder', 'AI Enthusiast', 'CS Student'].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(100, 255, 218, 0.1)',
                  border: '1px solid rgba(100, 255, 218, 0.3)',
                  color: '#64ffda',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-12"
        >
          {(['about', 'skills', 'contact'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className="px-6 py-3 rounded-lg font-medium transition-all capitalize"
              style={{
                background: activeSection === section 
                  ? 'rgba(100, 255, 218, 0.15)' 
                  : 'transparent',
                border: `1px solid ${activeSection === section ? '#64ffda' : 'rgba(100, 255, 218, 0.2)'}`,
                color: activeSection === section ? '#64ffda' : '#8892b0',
              }}
            >
              {section}
            </button>
          ))}
        </motion.div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeSection === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl w-full"
            >
              <div 
                className="p-8 rounded-2xl mb-8"
                style={{
                  background: 'rgba(17, 34, 64, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                }}
              >
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#ccd6f6' }}>
                  The Journey
                </h2>
                <p className="text-lg leading-relaxed mb-4" style={{ color: '#8892b0' }}>
                  Final year Computer Science student transitioning into startup life. 
                  I build software that bridges the gap between cutting-edge technology 
                  and human experience.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: '#8892b0' }}>
                  This portfolio — Genesis — is a tribute to the computing pioneers 
                  who made our digital world possible. From Turing machines to AGI, 
                  every era shaped where we are today.
                </p>
              </div>

              {/* Projects */}
              <div className="grid md:grid-cols-3 gap-4">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="p-6 rounded-xl transition-all hover:translate-y-[-4px]"
                    style={{
                      background: 'rgba(17, 34, 64, 0.3)',
                      border: '1px solid rgba(100, 255, 218, 0.1)',
                    }}
                  >
                    <h3 className="font-bold mb-2" style={{ color: '#64ffda' }}>
                      {project.name}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: '#8892b0' }}>
                      {project.desc}
                    </p>
                    <p className="text-xs font-mono" style={{ color: '#667eea' }}>
                      {project.tech}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl w-full"
            >
              <div className="space-y-6">
                {skills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span style={{ color: '#ccd6f6' }}>{skill.name}</span>
                      <span style={{ color: '#64ffda' }}>{skill.level}%</span>
                    </div>
                    <div 
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: 'rgba(17, 34, 64, 0.5)' }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: skill.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="text-lg mb-8" style={{ color: '#8892b0' }}>
                Let's build something amazing together.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { name: 'GitHub', icon: '💻', url: 'https://github.com' },
                  { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
                  { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
                  { name: 'Email', icon: '✉️', url: 'mailto:hello@kreeza.dev' },
                ].map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all"
                    style={{
                      background: 'rgba(17, 34, 64, 0.5)',
                      border: '1px solid rgba(100, 255, 218, 0.2)',
                      color: '#64ffda',
                    }}
                  >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll to top */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 rounded-full transition-all hover:scale-110"
          style={{
            background: 'rgba(17, 34, 64, 0.8)',
            border: '1px solid rgba(100, 255, 218, 0.3)',
            color: '#64ffda',
            boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
          }}
          whileHover={{ y: -4 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-8 text-sm font-mono"
          style={{ color: '#8892b0' }}
        >
          <p>Built with React + TypeScript + Love</p>
          <p style={{ color: '#64ffda' }}>Genesis v1.0 — 2026</p>
        </motion.footer>
      </div>
    </div>
  );
}
