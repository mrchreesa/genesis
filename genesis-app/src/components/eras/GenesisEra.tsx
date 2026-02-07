// Genesis Era - Turing Machine (1936) & ENIAC Era (1945)
// Authentic to the foundational era of computing

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Seeded random for stable SSR/hydration
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

interface PunchCard {
  id: number;
  row: number;
  col: number;
  punched: boolean;
}

export function GenesisEra() {
  // Turing Machine State
  const [tape, setTape] = useState(['0', '0', '1', '0', '1', '0', '0', '0', '0', '0', '0', '0']);
  const [headPosition, setHeadPosition] = useState(2);
  const [state, setState] = useState('q₀');
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState(0);
  
  // ENIAC/Vacuum Tube Simulation
  const [tubes, setTubes] = useState(Array(40).fill(false));
  const [accumulator, setAccumulator] = useState(0);
  
  // Punch Card State
  const [punchCards, setPunchCards] = useState<PunchCard[]>([]);
  const [activeTab, setActiveTab] = useState<'turing' | 'eniac' | 'punch'>('turing');

  // Generate binary rain background - stable random values using seeded random
  const binaryRain = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) =>
      Array.from({ length: 60 }, (_, j) => seededRandom(i * 60 + j) > 0.5 ? '1' : '0').join('')
    );
  }, []);

  // Pre-generate animation configs for binary rain
  const rainAnimationConfigs = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      duration: 8 + seededRandom(i * 100) * 8,
      delay: seededRandom(i * 200) * 5,
    }));
  }, []);

  // Vacuum tube flicker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTubes(prev => prev.map((_, i) => seededRandom(Date.now() + i) > 0.85));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Authentic Turing Machine - Binary Increment
  // This implements a proper Turing machine that increments a binary number
  const step = useCallback(() => {
    const current = tape[headPosition];
    const newTape = [...tape];

    // State machine for binary increment
    // q₀: Start state - move right to find LSB
    // q₁: Carry state - flip bits and propagate carry
    // q₂: Halt state
    switch (state) {
      case 'q₀':
        if (headPosition < tape.length - 1) {
          setHeadPosition(p => p + 1);
        } else {
          setState('q₁');
        }
        break;
        
      case 'q₁':
        if (current === '1') {
          newTape[headPosition] = '0';
          if (headPosition > 0) {
            setHeadPosition(p => p - 1);
          } else {
            setState('HALT');
          }
        } else {
          newTape[headPosition] = '1';
          setState('HALT');
        }
        setTape(newTape);
        break;
        
      case 'HALT':
        return;
    }
    setSteps(s => s + 1);
  }, [tape, headPosition, state]);

  const resetTuring = () => {
    setTape(['0', '0', '1', '0', '1', '0', '0', '0', '0', '0', '0', '0']);
    setHeadPosition(2);
    setState('q₀');
    setSteps(0);
    setIsRunning(false);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && state !== 'HALT') {
      interval = setInterval(step, 600);
    }
    return () => clearInterval(interval);
  }, [isRunning, state, step]);

  // Punch card interaction
  const punchHole = (row: number, col: number) => {
    const existingIndex = punchCards.findIndex(c => c.row === row && c.col === col);
    if (existingIndex >= 0) {
      setPunchCards(prev => prev.filter((_, i) => i !== existingIndex));
    } else {
      setPunchCards(prev => [...prev, { id: Date.now(), row, col, punched: true }]);
    }
    
    // Simulate accumulator based on punches
    const binaryValue = punchCards.length % 256;
    setAccumulator(binaryValue);
  };

  // Binary value display
  const binaryValue = parseInt(tape.join(''), 2);

  return (
    <div className="min-h-screen w-full crt-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Binary Rain Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {binaryRain.map((line, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-xs whitespace-nowrap"
            style={{
              left: `${(i % 20) * 5}%`,
              color: '#33FF00',
              textShadow: '0 0 5px rgba(51, 255, 0, 0.5)',
            }}
            initial={{ y: -100 }}
            animate={{ y: '100vh' }}
            transition={{
              duration: rainAnimationConfigs[i]?.duration ?? 8,
              repeat: Infinity,
              delay: rainAnimationConfigs[i]?.delay ?? 0,
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6 z-10"
      >
        <h1 
          className="text-3xl md:text-5xl font-bold mb-2 font-mono tracking-wider"
          style={{ 
            color: '#33FF00',
            textShadow: '0 0 20px rgba(51, 255, 0, 0.8), 0 0 40px rgba(51, 255, 0, 0.4)',
          }}
        >
          THE GENESIS
        </h1>
        <p className="text-sm md:text-base opacity-80 font-mono" style={{ color: '#33FF00' }}>
          1936 — 1945
        </p>
        <p className="text-xs md:text-sm opacity-60 mt-2 max-w-2xl text-center px-4"
          style={{ color: '#33FF0080' }}
        >
          "On Computable Numbers, with an Application to the Entscheidungsproblem" &mdash; A.M. Turing, 1936
        </p>
      </motion.div>

      {/* Era Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-2 mb-6 z-10"
      >
        {[
          { id: 'turing', label: 'Turing Machine', year: '1936' },
          { id: 'eniac', label: 'ENIAC', year: '1945' },
          { id: 'punch', label: 'IBM Punch Cards', year: '1890-1960s' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className="px-4 py-2 text-xs md:text-sm font-mono border transition-all"
            style={{
              borderColor: activeTab === tab.id ? '#33FF00' : '#33FF0030',
              background: activeTab === tab.id ? '#33FF0010' : 'transparent',
              color: activeTab === tab.id ? '#33FF00' : '#33FF0060',
            }}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* TURING MACHINE VIEW */}
        {activeTab === 'turing' && (
          <motion.div
            key="turing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="z-10 w-full max-w-4xl"
          >
            <div 
              className="border-2 p-4 md:p-6 rounded"
              style={{ 
                borderColor: '#33FF0050',
                boxShadow: '0 0 30px rgba(51, 255, 0, 0.1), inset 0 0 30px rgba(51, 255, 0, 0.02)',
                background: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <h2 
                className="text-lg md:text-xl mb-6 font-mono text-center"
                style={{ color: '#33FF00' }}
              >
                A-MACHINE SIMULATOR
              </h2>

              {/* Tape Visualization */}
              <div className="mb-6">
                <div className="text-xs mb-2 font-mono opacity-60" style={{ color: '#33FF00' }}>
                  INFINITE TAPE (FINITE VIEW)
                </div>
                <div className="flex justify-center gap-1 mb-2 overflow-x-auto pb-2">
                  {tape.map((bit, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      className="w-10 h-12 md:w-12 md:h-14 flex items-center justify-center font-mono text-lg md:text-xl border-2 flex-shrink-0"
                      style={{
                        borderColor: idx === headPosition ? '#33FF00' : '#33FF0030',
                        background: idx === headPosition ? '#33FF0020' : 'transparent',
                        color: '#33FF00',
                        boxShadow: idx === headPosition ? '0 0 15px rgba(51, 255, 0, 0.5)' : 'none',
                      }}
                    >
                      {bit}
                    </motion.div>
                  ))}
                </div>
                
                {/* Head Position Indicator */}
                <div className="flex justify-center">
                  {tape.map((_, idx) => (
                    <div 
                      key={idx}
                      className="w-10 md:w-12 flex justify-center flex-shrink-0"
                    >
                      {idx === headPosition && (
                        <motion.div
                          layoutId="head"
                          className="text-xs md:text-sm"
                          style={{ color: '#33FF00' }}
                        >
                          ▲
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* State Machine Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="border p-3 text-center"
                  style={{ borderColor: '#33FF0030' }}
                >
                  <div className="text-xs opacity-60 mb-1 font-mono" style={{ color: '#33FF00' }}>STATE</div>
                  <div 
                    className="text-2xl md:text-3xl font-bold font-mono"
                    style={{ 
                      color: state === 'HALT' ? '#FF3330' : '#33FF00',
                      textShadow: state === 'HALT' ? '0 0 10px rgba(255, 51, 48, 0.5)' : '0 0 10px rgba(51, 255, 0, 0.5)',
                    }}
                  >
                    {state}
                  </div>
                </div>
                
                <div className="border p-3 text-center"
                  style={{ borderColor: '#33FF0030' }}
                >
                  <div className="text-xs opacity-60 mb-1 font-mono" style={{ color: '#33FF00' }}>HEAD POS</div>
                  <div className="text-2xl md:text-3xl font-bold font-mono" style={{ color: '#33FF00' }}>
                    {headPosition}
                  </div>
                </div>
                
                <div className="border p-3 text-center"
                  style={{ borderColor: '#33FF0030' }}
                >
                  <div className="text-xs opacity-60 mb-1 font-mono" style={{ color: '#33FF00' }}>STEPS</div>
                  <div className="text-2xl md:text-3xl font-bold font-mono" style={{ color: '#33FF00' }}>
                    {steps}
                  </div>
                </div>
                
                <div className="border p-3 text-center"
                  style={{ borderColor: '#33FF0030' }}
                >
                  <div className="text-xs opacity-60 mb-1 font-mono" style={{ color: '#33FF00' }}>VALUE</div>
                  <div className="text-xl md:text-2xl font-bold font-mono" style={{ color: '#33FF00' }}>
                    {binaryValue}
                  </div>
                  <div className="text-xs opacity-40 font-mono">{tape.join('')}</div>
                </div>
              </div>

              {/* Transition Table */}
              <div className="mb-6 p-3 border text-xs font-mono"
                style={{ borderColor: '#33FF0020', background: 'rgba(51, 255, 0, 0.02)' }}
              >
                <div className="mb-2 opacity-60" style={{ color: '#33FF00' }}>TRANSITION FUNCTION δ</div>
                <div className="grid grid-cols-3 gap-2 opacity-80" style={{ color: '#33FF00' }}>
                  <div>δ(q₀, 0/1) → (q₀, 0/1, R)</div>
                  <div>δ(q₁, 1) → (q₁, 0, L)</div>
                  <div>δ(q₁, 0) → (HALT, 1, -)</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => state === 'HALT' ? resetTuring() : setIsRunning(!isRunning)}
                  className="px-6 py-2 border font-mono text-sm transition-all hover:bg-green-900/30"
                  style={{ 
                    borderColor: '#33FF0050',
                    color: '#33FF00',
                  }}
                >
                  {state === 'HALT' ? 'RESET' : isRunning ? 'PAUSE' : 'RUN'}
                </button>
                
                <button
                  onClick={step}
                  disabled={state === 'HALT' || isRunning}
                  className="px-6 py-2 border font-mono text-sm transition-all hover:bg-green-900/30 disabled:opacity-30"
                  style={{ 
                    borderColor: '#33FF0050',
                    color: '#33FF00',
                  }}
                >
                  STEP
                </button>
              </div>

              {state === 'HALT' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-4 font-mono"
                  style={{ color: '#FF3330' }}
                >
                  MACHINE HALTED — COMPUTATION COMPLETE
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ENIAC VIEW */}
        {activeTab === 'eniac' && (
          <motion.div
            key="eniac"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="z-10 w-full max-w-4xl"
          >
            <div 
              className="border-2 p-4 md:p-6 rounded"
              style={{ 
                borderColor: '#FFB00050',
                boxShadow: '0 0 30px rgba(255, 176, 0, 0.1), inset 0 0 30px rgba(255, 176, 0, 0.02)',
                background: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <h2 
                className="text-lg md:text-xl mb-4 font-mono text-center"
                style={{ color: '#FFB000' }}
              >
                ELECTRONIC NUMERICAL INTEGRATOR AND COMPUTER
              </h2>
              
              <div className="text-center mb-6 text-xs opacity-60 font-mono" style={{ color: '#FFB000' }}>
                17,468 VACUUM TUBES • 30 TONS • 150 KW • 1945
              </div>

              {/* Vacuum Tube Panel */}
              <div className="mb-6">
                <div className="text-xs mb-2 font-mono opacity-60" style={{ color: '#FFB000' }}>
                  VACUUM TUBE STATUS (40 of 17,468)
                </div>
                <div 
                  className="grid grid-cols-10 gap-1 p-4 rounded"
                  style={{ background: '#1a1000' }}
                >
                  {tubes.map((lit, idx) => (
                    <motion.div
                      key={idx}
                      className="aspect-square rounded-full"
                      animate={{
                        backgroundColor: lit ? '#FFB000' : '#332200',
                        boxShadow: lit ? '0 0 10px #FFB000' : 'none',
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </div>

              {/* Accumulator Display */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border p-4"
                  style={{ borderColor: '#FFB00030' }}
                >
                  <div className="text-xs opacity-60 mb-2 font-mono" style={{ color: '#FFB000' }}>
                    ACCUMULATOR 1
                  </div>
                  <div className="text-3xl font-mono" style={{ color: '#FFB000' }}>
                    {accumulator.toString().padStart(10, '0')}
                  </div>
                  <div className="text-xs opacity-40 mt-1 font-mono" style={{ color: '#FFB000' }}>
                    DECIMAL
                  </div>
                </div>
                
                <div className="border p-4"
                  style={{ borderColor: '#FFB00030' }}
                >
                  <div className="text-xs opacity-60 mb-2 font-mono" style={{ color: '#FFB000' }}>
                    PROGRAM COUNTER
                  </div>
                  <div className="text-3xl font-mono" style={{ color: '#FFB000' }}>
                    {(accumulator % 100).toString().padStart(3, '0')}
                  </div>
                  <div className="text-xs opacity-40 mt-1 font-mono" style={{ color: '#FFB000' }}>
                    OCTAL
                  </div>
                </div>
              </div>

              {/* ENIAC Programming Info */}
              <div className="p-3 border text-xs font-mono"
                style={{ borderColor: '#FFB00020', background: 'rgba(255, 176, 0, 0.02)' }}
              >
                <div className="mb-2 opacity-60" style={{ color: '#FFB000' }}>HISTORICAL NOTE</div>
                <p className="opacity-80 mb-2" style={{ color: '#FFB000' }}>
                  ENIAC was programmed by setting switches and plugging cables into patch panels.
                  Each program required rewiring the machine — a process that could take days.
                </p>
                <p className="opacity-80" style={{ color: '#FFB000' }}>
                  First programmer: Jean Bartik (1924-2011), one of six original ENIAC women.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* PUNCH CARD VIEW */}
        {activeTab === 'punch' && (
          <motion.div
            key="punch"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="z-10 w-full max-w-4xl"
          >
            <div 
              className="border-2 p-4 md:p-6 rounded"
              style={{ 
                borderColor: '#FFFFFF30',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.05), inset 0 0 30px rgba(255, 255, 255, 0.01)',
                background: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <h2 
                className="text-lg md:text-xl mb-2 font-mono text-center"
                style={{ color: '#FFFFFF' }}
              >
                IBM PUNCHED CARD SYSTEM
              </h2>
              
              <div className="text-center mb-6 text-xs opacity-60 font-mono" style={{ color: '#FFFFFF' }}>
                HOLLERITH CODE • 80 COLUMNS × 12 ROWS • DO NOT FOLD, SPINDLE, OR MUTILATE
              </div>

              {/* Punch Card Grid */}
              <div className="mb-6 overflow-x-auto">
                <div 
                  className="inline-block p-4 rounded"
                  style={{ 
                    background: '#f5f5dc',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    minWidth: '600px',
                  }}
                >
                  {/* Column numbers */}
                  <div className="flex mb-1">
                    <div className="w-8" />
                    {Array.from({ length: 20 }, (_, i) => (
                      <div 
                        key={i} 
                        className="flex-1 text-center text-[8px] text-gray-400 font-mono"
                      >
                        {(i + 1).toString().padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                  
                  {/* Card rows */}
                  {['12', '11', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((rowLabel, rowIdx) => (
                    <div key={rowLabel} className="flex items-center">
                      <div 
                        className="w-8 text-right pr-2 text-[10px] text-gray-500 font-mono"
                      >
                        {rowLabel}
                      </div>
                      <div className="flex flex-1">
                        {Array.from({ length: 20 }, (_, colIdx) => {
                          const isPunched = punchCards.some(
                            c => c.row === rowIdx && c.col === colIdx
                          );
                          return (
                            <button
                              key={colIdx}
                              onClick={() => punchHole(rowIdx, colIdx)}
                              className="flex-1 aspect-square border border-gray-200 flex items-center justify-center transition-all hover:bg-gray-100"
                              style={{
                                background: isPunched ? '#1a1a1a' : 'transparent',
                              }}
                            >
                              {isPunched && (
                                <div className="w-2 h-3 bg-gray-800 rounded-sm" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="border p-3 text-center"
                  style={{ borderColor: '#FFFFFF30' }}
                >
                  <div className="text-xs opacity-60 mb-1 font-mono" style={{ color: '#FFFFFF' }}>HOLES PUNCHED</div>
                  <div className="text-2xl font-mono" style={{ color: '#FFFFFF' }}>
                    {punchCards.length}
                  </div>
                </div>
                
                <div className="border p-3 text-center"
                  style={{ borderColor: '#FFFFFF30' }}
                >
                  <div className="text-xs opacity-60 mb-1 font-mono" style={{ color: '#FFFFFF' }}>CHARACTERS</div>
                  <div className="text-2xl font-mono" style={{ color: '#FFFFFF' }}>
                    {Math.floor(punchCards.length / 2)}
                  </div>
                </div>
                
                <div className="border p-3 text-center"
                  style={{ borderColor: '#FFFFFF30' }}
                >
                  <div className="text-xs opacity-60 mb-1 font-mono" style={{ color: '#FFFFFF' }}>CARD NUMBER</div>
                  <div className="text-2xl font-mono" style={{ color: '#FFFFFF' }}>
                    00001
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setPunchCards([]);
                    setAccumulator(0);
                  }}
                  className="px-6 py-2 border font-mono text-sm transition-all hover:bg-white/10"
                  style={{ 
                    borderColor: '#FFFFFF50',
                    color: '#FFFFFF',
                  }}
                >
                  CLEAR CARD
                </button>
              </div>

              <div className="mt-4 p-3 border text-xs font-mono"
                style={{ borderColor: '#FFFFFF20', background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <div className="mb-2 opacity-60" style={{ color: '#FFFFFF' }}>INSTRUCTIONS</div>
                <p className="opacity-80" style={{ color: '#FFFFFF' }}>
                  Click cells to punch holes. Each column encodes one character using Hollerith code.
                  Used for data storage from 1890 through the 1970s.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 z-10 text-center max-w-2xl px-4"
      >
        <blockquote 
          className="text-xs md:text-sm italic opacity-50 font-mono"
          style={{ color: '#33FF0080' }}
        >
          "We can only see a short distance ahead, but we can see plenty there that needs to be done."
        </blockquote>
        <cite 
          className="text-xs mt-2 block opacity-40 font-mono"
          style={{ color: '#33FF0060' }}
        >
          — Alan Turing, 1950
        </cite>
      </motion.div>
    </div>
  );
}
