// AGI Era - LLMs, Neural Networks, Intelligence Age

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NeuralNode {
  id: number;
  color: string;
  left: string;
  top: string;
  duration: number;
  delay: number;
}

interface ConnectionLine {
  id: number;
  x1: string;
  y1: string;
  x2: string;
  y2: string;
}

export function AgiEra() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Neural network initialized. Consciousness emerging...' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate stable random values for neural network background
  const neuralNodes = useMemo<NeuralNode[]>(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: Math.random() > 0.5 ? '#00FFFF' : '#9D4EDD',
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
    }));
  }, []);

  const connectionLines = useMemo<ConnectionLine[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x1: `${Math.random() * 100}%`,
      y1: `${Math.random() * 100}%`,
      x2: `${Math.random() * 100}%`,
      y2: `${Math.random() * 100}%`,
    }));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'm an AI assistant, part of the latest generation of language models.",
        "The neural networks that power me are inspired by the human brain.",
        "We've come a long way from Turing machines to transformer architectures.",
        "The future of computing is intelligent, adaptive, and deeply interconnected.",
        "What questions do you have about the journey of computing?",
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8"
      style={{ background: '#000000' }}
    >
      <div className="scanlines" />
      
      {/* Neural Network Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {neuralNodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: node.color,
              boxShadow: '0 0 10px currentColor',
              left: node.left,
              top: node.top,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: node.duration,
              repeat: Infinity,
              delay: node.delay,
            }}
          />
        ))}
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full"
        >
          {connectionLines.map((line) => (
            <motion.line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#00FFFF"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </svg>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4"
          style={{ 
            color: '#00FFFF',
            textShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
          }}
        >
          INTELLIGENCE AGE
        </h1>
        
        <p className="text-lg"
          style={{ color: '#9D4EDD' }}
        >
          2022 - Future
        </p>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-3xl z-10"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          borderRadius: '12px',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.1)',
        }}
      >
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b"
          style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}
        >
          <div className="w-3 h-3 rounded-full animate-pulse"
            style={{ background: '#00FF00', boxShadow: '0 0 10px #00FF00' }}
          />
          
          <span style={{ color: '#00FFFF' }}>Genesis AI Assistant</span>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4"
          style={{ overscrollBehavior: 'contain' }}
        >
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[80%] px-4 py-2 rounded-lg"
                  style={{
                    background: msg.role === 'user' 
                      ? 'rgba(157, 78, 221, 0.3)' 
                      : 'rgba(0, 255, 255, 0.1)',
                    border: `1px solid ${msg.role === 'user' ? '#9D4EDD' : '#00FFFF'}`,
                    color: msg.role === 'user' ? '#E0C3FC' : '#00FFFF',
                  }}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div
                className="px-4 py-2 rounded-lg flex gap-1"
                style={{
                  background: 'rgba(0, 255, 255, 0.1)',
                  border: '1px solid #00FFFF',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#00FFFF' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t"
          style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}
        >
          <div className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Talk to the future..."
              className="flex-1 px-4 py-2 rounded-lg outline-none transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                color: '#fff',
              }}
            />
            
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-bold transition-all"
              style={{
                background: 'linear-gradient(135deg, #00FFFF 0%, #9D4EDD 100%)',
                color: '#000',
              }}
            >
              Send
            </button>
          </div>
        </form>
      </motion.div>

      {/* Footer Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center z-10"
        style={{ color: '#666' }}
      >
        <p className="text-sm">
          The journey continues. What's next?
        </p>
      </motion.div>
    </div>
  );
}
