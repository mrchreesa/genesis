import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [bootPhase, setBootPhase] = useState(0);
  const [, setMemoryCount] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const memoryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLine = useCallback((text: string, phase: number) => {
    setLines(prev => [...prev, text]);
    setBootPhase(phase);
  }, []);

  // Authentic IBM PC BIOS-style boot sequence
  useEffect(() => {
    const bootSequence = async () => {
      // Phase 0: BIOS Initialization
      await delay(300);
      addLine('', 0);
      addLine('╔══════════════════════════════════════════════════════════════╗', 0);
      addLine('║                 GENESIS BIOS v1.0.2                          ║', 0);
      addLine('║         Copyright (C) 1981-2026 Genesis Systems Inc.         ║', 0);
      addLine('╚══════════════════════════════════════════════════════════════╝', 0);
      addLine('', 0);
      
      await delay(400);
      addLine('BIOS Date: 01/01/26 14:22:51', 0);
      addLine('CPU: Intel(R) Genesis(TM) CPU @ 4.77 MHz', 0);
      addLine('CPU Signature: 0x0F0B', 0);
      
      await delay(300);
      addLine('Initializing CPU... OK', 0);
      addLine('Checking NPU... Not Present', 0);
      
      await delay(200);
      addLine('', 0);
      addLine('Award Plug and Play BIOS Extension v1.0A', 0);
      addLine('Detecting HDD Primary Master ... GENESIS-SSD 512GB', 0);
      addLine('Detecting HDD Primary Slave  ... None', 0);
      addLine('Detecting HDD Secondary Master ... CD-ROM', 0);
      addLine('Detecting HDD Secondary Slave  ... None', 0);
      
      // Phase 1: Memory Test with counting animation
      await delay(400);
      addLine('', 1);
      addLine('Memory Test:', 1);
      
      // Animate memory count
      memoryIntervalRef.current = setInterval(() => {
        setMemoryCount(prev => {
          if (prev >= 16384) {
            if (memoryIntervalRef.current) clearInterval(memoryIntervalRef.current);
            return 16384;
          }
          return prev + 256;
        });
      }, 30);
      
      await delay(2000);
      if (memoryIntervalRef.current) clearInterval(memoryIntervalRef.current);
      addLine(` ${16384}K OK`, 1);
      addLine('', 1);
      
      await delay(200);
      addLine('Extended Memory: 15728640K OK', 1);
      addLine('Cache Memory: 512K OK', 1);
      
      // Phase 2: Hardware initialization
      await delay(300);
      addLine('', 2);
      addLine('Award Medallion BIOS v6.0, An Energy Star Ally', 2);
      addLine('', 2);
      addLine('Hardware Init:', 2);
      addLine('  Keyboard ... Detected, OK', 2);
      addLine('  Mouse ..... Detected, OK', 2);
      addLine('  Video ..... VGA Compatible, OK', 2);
      addLine('  Floppy .... Not Detected', 2);
      addLine('  COM1 ...... 0x3F8', 2);
      addLine('  COM2 ...... 0x2F8', 2);
      addLine('  LPT1 ...... 0x378', 2);
      
      await delay(200);
      addLine('', 2);
      addLine('CMOS Checksum ... OK', 2);
      addLine('System Time ..... [Set]', 2);
      addLine('System Date ..... [Set]', 2);
      
      // Phase 3: Loading with progress bar
      await delay(400);
      addLine('', 3);
      addLine('Loading Operating System...', 3);
      
      // ASCII progress bar animation
      const progressChars = ['[                    ] 0%', '[██                  ] 10%', '[████                ] 20%', '[██████              ] 30%', '[████████            ] 40%', '[██████████          ] 50%', '[████████████        ] 60%', '[██████████████      ] 70%', '[████████████████    ] 80%', '[██████████████████  ] 90%', '[████████████████████] 100%'];
      
      for (let i = 0; i < progressChars.length; i++) {
        await delay(150);
        // Replace the last line with updated progress
        setLines(prev => {
          const newLines = [...prev];
          // Find and replace the progress line
          const lastProgressIndex = newLines.findIndex(l => l.includes('[') && l.includes('%'));
          if (lastProgressIndex >= 0) {
            newLines[lastProgressIndex] = progressChars[i];
          } else {
            newLines.push(progressChars[i]);
          }
          return newLines;
        });
      }
      
      // Phase 4: Genesis-specific initialization
      await delay(300);
      addLine('', 4);
      addLine('Genesis OS v1.0 Loading...', 4);
      addLine('  [OK] Mounting filesystems', 4);
      addLine('  [OK] Starting chronos daemon', 4);
      addLine('  [OK] Initializing temporal engines', 4);
      addLine('  [OK] Loading era modules:', 4);
      
      await delay(200);
      const eras = ['1936', '1949', '1969', 'Theory', '1985', '1995', '2004', '2010', '2022', 'Present'];
      eras.forEach((era, i) => {
        setTimeout(() => {
          addLine(`       [${era}]`, 4);
        }, i * 100);
      });
      
      await delay(1500);
      
      // Phase 5: Ready
      await delay(300);
      addLine('', 5);
      addLine('═══════════════════════════════════════', 5);
      addLine('  GENESIS v1.0 READY', 5);
      addLine('═══════════════════════════════════════', 5);
      addLine('', 5);
      addLine('Initializing display adapter... OK', 5);
      addLine('Setting video mode: 80x25 text', 5);
      addLine('', 5);
      
      // Final prompt
      await delay(400);
      addLine('> Press any key to continue...', 6);
    };

    timeoutRef.current = setTimeout(bootSequence, 500);
    
    // Show skip button after 2 seconds
    const skipTimer = setTimeout(() => setShowSkip(true), 2000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (memoryIntervalRef.current) clearInterval(memoryIntervalRef.current);
      clearTimeout(skipTimer);
    };
  }, [addLine]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipBoot();
        return;
      }
      const lastLine = lines[lines.length - 1];
      if (lastLine && lastLine.includes('Press any key to continue')) {
        onComplete();
      }
    };

    const handleClick = () => {
      const lastLine = lines[lines.length - 1];
      if (lastLine && lastLine.includes('Press any key to continue')) {
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [lines, onComplete]);

  const skipBoot = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (memoryIntervalRef.current) clearInterval(memoryIntervalRef.current);
    onComplete();
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Authentic CRT scanlines - more pronounced */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(51, 255, 0, 0.03) 2px,
            rgba(51, 255, 0, 0.03) 4px
          )`,
        }}
      />

      {/* CRT screen curvature effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
        }}
      />

      {/* Subtle screen flicker */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-green-500/5"
        animate={{ opacity: [0, 0.02, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }}
      />

      {/* Boot text container */}
      <div className="relative z-10 w-full max-w-4xl px-6 py-8">
        <pre 
          className="font-mono text-xs md:text-sm whitespace-pre leading-relaxed"
          style={{ 
            color: '#33FF00',
            textShadow: '0 0 5px rgba(51, 255, 0, 0.8), 0 0 10px rgba(51, 255, 0, 0.4)',
            fontFamily: '"VT323", "IBM Plex Mono", monospace',
            letterSpacing: '0.05em',
          }}
        >
          {lines.map((line, i) => (
            <div key={i} className={line.includes('█') ? 'font-bold' : ''}>
              {line}
            </div>
          ))}
          {lines.length > 0 && lines[lines.length - 1]?.includes('Press any key to continue') && (
            <span 
              className={`inline-block w-3 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                backgroundColor: '#33FF00',
                boxShadow: '0 0 5px #33FF00',
              }}
            >
              &nbsp;
            </span>
          )}
        </pre>

        {/* Phase indicator */}
        <AnimatePresence>
          {bootPhase >= 1 && bootPhase < 6 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex items-center gap-3"
            >
              <span className="text-xs text-green-500/60 font-mono">STATUS:</span>
              <div className="flex items-center gap-2">
                {['POST', 'MEM', 'LOAD', 'INIT', 'RDY'].map((label, idx) => (
                  <div key={label} className="flex items-center gap-1">
                    <div 
                      className={`w-1.5 h-1.5 transition-all duration-300 ${
                        bootPhase > idx ? 'bg-green-400' : 'bg-green-900'
                      }`}
                      style={{
                        boxShadow: bootPhase > idx ? '0 0 5px #4ade80' : 'none',
                      }}
                    />
                    <span 
                      className={`text-[10px] font-mono ${
                        bootPhase > idx ? 'text-green-400' : 'text-green-900'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip button */}
      <AnimatePresence>
        {showSkip && bootPhase < 6 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={skipBoot}
            className="absolute bottom-6 right-6 px-3 py-1.5 border border-green-500/40 text-green-400/70 text-xs font-mono hover:border-green-400 hover:text-green-400 hover:bg-green-500/10 transition-all"
            style={{ fontFamily: '"VT323", monospace' }}
          >
            [ESC] Skip
          </motion.button>
        )}
      </AnimatePresence>

      {/* Final boot flash effect */}
      <AnimatePresence>
        {bootPhase === 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-green-500 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
