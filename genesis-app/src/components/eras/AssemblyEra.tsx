// Assembly Age - PDP-11/40 Front Panel Authentic Recreation
// 1949-1958: The era of vacuum tubes to transistors, stored-program computers

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Register {
  name: string;
  value: number;
  description: string;
}

export function AssemblyEra() {
  // PDP-11 Style Registers (16-bit, octal display)
  const [registers, setRegisters] = useState<Register[]>([
    { name: 'R0', value: 0o000000, description: 'General Purpose' },
    { name: 'R1', value: 0o000042, description: 'General Purpose' },
    { name: 'R2', value: 0o000000, description: 'General Purpose' },
    { name: 'R3', value: 0o000000, description: 'General Purpose' },
    { name: 'R4', value: 0o000000, description: 'General Purpose' },
    { name: 'R5', value: 0o000000, description: 'Frame Pointer' },
    { name: 'SP', value: 0o177776, description: 'Stack Pointer' },
    { name: 'PC', value: 0o001000, description: 'Program Counter' },
  ]);
  
  // PDP-11 Processor Status Word
  const [psw, setPsw] = useState({
    n: false, // Negative
    z: true,  // Zero
    v: false, // Overflow
    c: false, // Carry
    priority: 0o7,
  });

  // Octal memory (PDP-11 used 18-bit addressing, up to 256KB)
  const [memory, setMemory] = useState<number[]>(() => {
    // Generate initial memory with random values once
    const initialMemory = Array.from({ length: 32 }, (_, i) => {
      // Sample PDP-11 program: Simple addition loop
      const sampleProgram = [
        0o012701, // MOV #5, R1
        0o000005,
        0o005000, // CLR R0
        0o060100, // ADD R1, R0
        0o005301, // DEC R1
        0o001375, // BNE .-6
        0o000000, // HALT
      ];
      return sampleProgram[i] ?? Math.floor(Math.random() * 0o1000000);
    });
    return initialMemory;
  });

  const [consoleLights, setConsoleLights] = useState<boolean[]>(Array(24).fill(false));
  const [runLight, setRunLight] = useState(false);
  const [output, setOutput] = useState<string[]>([
    'PDP-11/40 Console Monitor V1.0',
    'Copyright (c) 1972 Digital Equipment Corporation',
    '',
    '@',
  ]);
  const [inputBuffer, setInputBuffer] = useState('');
  const [currentAddress, setCurrentAddress] = useState(0o001000);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Blinking console lights effect
  useEffect(() => {
    const interval = setInterval(() => {
      setConsoleLights(prev => 
        prev.map(() => Math.random() > 0.7)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Blinking RUN light when executing
  useEffect(() => {
    if (runLight) {
      const interval = setInterval(() => {
        setRunLight(prev => !prev);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [runLight]);

  const scrollToBottom = () => {
    if (consoleEndRef.current?.parentElement) {
      const parent = consoleEndRef.current.parentElement;
      parent.scrollTop = parent.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [output]);

  // Execute PDP-11 style instruction
  const executeInstruction = (instr: string) => {
    const newOutput = [...output];
    const command = instr.trim().toUpperCase();
    
    newOutput.push(`@ ${instr}`);
    
    if (command === 'HELP' || command === 'H') {
      newOutput.push('PDP-11/40 Monitor Commands:');
      newOutput.push('  R [REG] [VALUE]  - Set register (octal)');
      newOutput.push('  E [ADDR] [VALUE] - Examine/Deposit memory');
      newOutput.push('  G [ADDR]         - Go (start execution)');
      newOutput.push('  S                - Single step');
      newOutput.push('  D [ADDR] [COUNT] - Dump memory');
      newOutput.push('  CLR              - Clear console');
      newOutput.push('  HALT             - Halt processor');
      newOutput.push('');
    } else if (command.startsWith('R ')) {
      // Set register
      const parts = command.split(' ').filter(p => p);
      if (parts.length >= 3) {
        const regName = parts[1].toUpperCase();
        const value = parseInt(parts[2], 8);
        if (!isNaN(value)) {
          setRegisters(prev => prev.map(r => 
            r.name === regName ? { ...r, value: value & 0o177777 } : r
          ));
          newOutput.push(`; ${regName} <- ${(value & 0o177777).toString(8).padStart(6, '0')}`);
        }
      }
    } else if (command.startsWith('E ')) {
      // Examine/Deposit
      const parts = command.split(' ').filter(p => p);
      if (parts.length === 2) {
        const addr = parseInt(parts[1], 8);
        if (!isNaN(addr) && addr < memory.length) {
          newOutput.push(`; ${addr.toString(8).padStart(6, '0')}: ${memory[addr].toString(8).padStart(6, '0')}`);
        }
      } else if (parts.length >= 3) {
        const addr = parseInt(parts[1], 8);
        const value = parseInt(parts[2], 8);
        if (!isNaN(addr) && !isNaN(value)) {
          setMemory(prev => {
            const newMem = [...prev];
            newMem[addr] = value & 0o177777;
            return newMem;
          });
          newOutput.push(`; ${addr.toString(8).padStart(6, '0')} <- ${(value & 0o177777).toString(8).padStart(6, '0')}`);
        }
      }
    } else if (command.startsWith('G')) {
      const parts = command.split(' ');
      const addr = parts[1] ? parseInt(parts[1], 8) : registers.find(r => r.name === 'PC')?.value ?? 0o001000;
      setCurrentAddress(addr);
      setRunLight(true);
      newOutput.push(`; Starting execution at ${addr.toString(8).padStart(6, '0')}`);
      
      // Simulate execution
      setTimeout(() => {
        setRunLight(false);
        setRegisters(prev => prev.map(r => {
          if (r.name === 'R0') return { ...r, value: 0o000017 }; // Result of 5+4+3+2+1+0
          if (r.name === 'R1') return { ...r, value: 0o000000 };
          return r;
        }));
        setPsw(prev => ({ ...prev, z: false, n: false }));
        setOutput(o => [...o, '; HALT encountered', '; R0 = 000017 (15 decimal)', '@']);
      }, 2000);
    } else if (command === 'S' || command === 'STEP') {
      newOutput.push(`; Step: PC=${currentAddress.toString(8).padStart(6, '0')}`);
      setCurrentAddress(a => a + 2);
    } else if (command.startsWith('D ')) {
      const parts = command.split(' ').filter(p => p);
      const start = parseInt(parts[1], 8) || 0;
      const count = parseInt(parts[2]) || 8;
      newOutput.push(`; Memory dump from ${start.toString(8).padStart(6, '0')}:`);
      for (let i = 0; i < count; i += 4) {
        const line = [];
        for (let j = 0; j < 4 && i + j < count; j++) {
          const addr = start + i + j;
          const val = memory[addr] ?? 0;
          line.push(val.toString(8).padStart(6, '0'));
        }
        newOutput.push(`; ${(start + i).toString(8).padStart(6, '0')}: ${line.join(' ')}`);
      }
    } else if (command === 'CLR' || command === 'CLEAR') {
      newOutput.length = 0;
      newOutput.push('PDP-11/40 Console Monitor V1.0');
      newOutput.push('@');
    } else if (command === 'HALT') {
      setRunLight(false);
      newOutput.push('; Processor halted');
    } else if (command !== '') {
      newOutput.push(`; Unknown command: ${command}`);
    }
    
    if (!command.startsWith('G') || command === 'G' || command.startsWith('G ')) {
      if (!newOutput[newOutput.length - 1]?.startsWith('; HALT')) {
        newOutput.push('@');
      }
    }
    
    setOutput(newOutput);
  };

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBuffer.trim()) {
      executeInstruction(inputBuffer);
      setInputBuffer('');
    }
  };

  // Format octal number
  const oct = (n: number) => (n & 0o177777).toString(8).padStart(6, '0');

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-6 relative"
      style={{ background: '#0C0C0C' }}
    >
      {/* Background scanlines */}
      <div className="scanlines opacity-20" />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-6 z-10"
      >
        <h1 
          className="text-3xl md:text-5xl font-bold mb-2 font-mono"
          style={{ 
            color: '#FFB000',
            textShadow: '0 0 20px rgba(255, 176, 0, 0.5)',
          }}
        >
          ASSEMBLY AGE
        </h1>
        <p className="text-sm md:text-lg opacity-80 font-mono" style={{ color: '#FFB000' }}>
          1949 — 1958
        </p>
        <p className="text-xs md:text-sm opacity-60 mt-2 max-w-2xl px-4"
          style={{ color: '#FFB00080' }}
        >
          The PDP-11: The most influential minicomputer in history.
          16-bit architecture, Unibus, and the birthplace of Unix.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 w-full max-w-6xl z-10">
        {/* LEFT PANEL: PDP-11 Front Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Console Lights / Address/Data Display */}
          <div 
            className="border-2 p-4 rounded"
            style={{ 
              borderColor: '#FFB00040',
              background: 'linear-gradient(180deg, #1a0f00 0%, #0a0500 100%)',
              boxShadow: '0 0 20px rgba(255, 176, 0, 0.1), inset 0 0 20px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono opacity-60" style={{ color: '#FFB000' }}>
                ADDRESS/DATA DISPLAY
              </span>
              <motion.div
                animate={{ opacity: runLight ? [0.3, 1, 0.3] : 0.3 }}
                transition={{ duration: 0.2 }}
                className="px-2 py-0.5 text-xs font-mono rounded"
                style={{
                  background: runLight ? '#FF3300' : '#331100',
                  color: runLight ? '#FFF' : '#FF330080',
                  boxShadow: runLight ? '0 0 10px #FF3300' : 'none',
                }}
              >
                RUN
              </motion.div>
            </div>

            {/* Console LED row - authentic to PDP-11 (18-bit data/addr bus) */}
            <div 
              className="grid gap-0.5 mb-2"
              style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}
            >
              {consoleLights.slice(0, 24).map((lit, idx) => (
                <motion.div
                  key={idx}
                  className="aspect-square rounded-sm"
                  animate={{
                    backgroundColor: lit ? '#FFB000' : '#331900',
                    boxShadow: lit ? '0 0 4px #FFB000' : 'none',
                  }}
                  transition={{ duration: 0.05 }}
                />
              ))}
            </div>

            {/* Address and Data switches */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-xs font-mono opacity-60 mb-1" style={{ color: '#FFB000' }}>ADDRESS</div>
                <div className="text-2xl font-mono" style={{ color: '#FFB000' }}>
                  {oct(currentAddress)}
                </div>
              </div>
              <div>
                <div className="text-xs font-mono opacity-60 mb-1" style={{ color: '#FFB000' }}>DATA</div>
                <div className="text-2xl font-mono" style={{ color: '#FFB000' }}>
                  {oct(memory[currentAddress] ?? 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Registers Panel */}
          <div 
            className="border-2 p-4 rounded"
            style={{ 
              borderColor: '#FFB00040',
              background: 'rgba(255, 176, 0, 0.02)',
              boxShadow: '0 0 20px rgba(255, 176, 0, 0.1)',
            }}
          >
            <h2 className="text-sm mb-4 font-mono" style={{ color: '#FFB000' }}>REGISTERS (OCTAL)</h2>
            
            <div className="grid grid-cols-2 gap-2">
              {registers.map((reg) => (
                <div 
                  key={reg.name} 
                  className="border p-2 rounded"
                  style={{ borderColor: '#FFB00020' }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold font-mono" style={{ color: '#FFB000' }}>
                      {reg.name}
                    </span>
                    <span className="text-xs opacity-40 font-mono" style={{ color: '#FFB000' }}>
                      {reg.description.slice(0, 8)}
                    </span>
                  </div>
                  <div className="text-xl font-mono mt-1" style={{ color: '#FFB000' }}>
                    {oct(reg.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PSW Panel */}
          <div 
            className="border-2 p-4 rounded"
            style={{ 
              borderColor: '#FFB00040',
              background: 'rgba(255, 176, 0, 0.02)',
            }}
          >
            <h2 className="text-sm mb-3 font-mono" style={{ color: '#FFB000' }}>PROCESSOR STATUS WORD</h2>
            
            <div className="flex gap-4">
              {[
                { label: 'N', value: psw.n, desc: 'Negative' },
                { label: 'Z', value: psw.z, desc: 'Zero' },
                { label: 'V', value: psw.v, desc: 'Overflow' },
                { label: 'C', value: psw.c, desc: 'Carry' },
              ].map((flag) => (
                <div key={flag.label} className="text-center">
                  <div 
                    className="w-10 h-10 flex items-center justify-center font-mono text-sm border rounded"
                    style={{
                      borderColor: flag.value ? '#FFB000' : '#FFB00020',
                      background: flag.value ? 'rgba(255, 176, 0, 0.2)' : 'transparent',
                      color: flag.value ? '#FFB000' : '#FFB00040',
                      boxShadow: flag.value ? '0 0 10px rgba(255, 176, 0, 0.3)' : 'none',
                    }}
                  >
                    {flag.label}
                  </div>
                  <div className="text-[10px] mt-1 opacity-50 font-mono" style={{ color: '#FFB000' }}>
                    {flag.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT PANEL: Memory and Console */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Memory Panel */}
          <div 
            className="border-2 p-4 rounded h-64 overflow-hidden"
            style={{ 
              borderColor: '#FFB00040',
              background: 'rgba(255, 176, 0, 0.02)',
              boxShadow: '0 0 20px rgba(255, 176, 0, 0.1)',
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-mono" style={{ color: '#FFB000' }}>MEMORY DUMP (OCTAL)</h2>
              <span className="text-xs opacity-50 font-mono" style={{ color: '#FFB000' }}>ADDR: CONTENTS</span>
            </div>
            
            <div className="font-mono text-sm h-full overflow-y-auto"
              style={{ color: '#FFB000', overscrollBehavior: 'contain' }}
            >
              {memory.map((val, idx) => (
                <div 
                  key={idx}
                  className="flex gap-4 py-0.5 hover:bg-amber-500/10 cursor-pointer"
                  style={{
                    background: idx === currentAddress ? 'rgba(255, 176, 0, 0.15)' : 'transparent',
                  }}
                >
                  <span className="opacity-50 w-20">{idx.toString(8).padStart(6, '0')}:</span>
                  <span className={idx === currentAddress ? 'font-bold' : ''}>{val.toString(8).padStart(6, '0')}</span>
                  <span className="opacity-30 ml-2">
                    {'/* ' + decodeInstruction(val) + ' */'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Console Terminal */}
          <div 
            className="border-2 p-4 rounded"
            style={{ 
              borderColor: '#FFB00040',
              background: '#050300',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
            }}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b"
              style={{ borderColor: '#FFB00030' }}
            >
              <span className="text-xs font-mono" style={{ color: '#FFB000' }}>
                CONSOLE TERMINAL
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => executeInstruction('HELP')}
                  className="px-2 py-0.5 text-xs border hover:bg-amber-500/20"
                  style={{ borderColor: '#FFB00050', color: '#FFB000' }}
                >
                  ?
                </button>
              </div>
            </div>

            <div 
              className="font-mono text-sm h-48 overflow-y-auto mb-3 p-2 rounded"
              style={{ 
                color: '#FFB000',
                background: 'rgba(0, 0, 0, 0.5)',
                overscrollBehavior: 'contain',
              }}
            >
              {output.map((line, i) => (
                <div 
                  key={i} 
                  className={line.startsWith(';') ? 'opacity-60 pl-4' : line.startsWith('@') ? 'opacity-100' : 'opacity-80'}
                >
                  {line}
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>

            <form onSubmit={handleConsoleSubmit} className="flex gap-2">
              <span className="font-mono text-lg" style={{ color: '#FFB000' }}>@</span>
              <input
                type="text"
                value={inputBuffer}
                onChange={(e) => setInputBuffer(e.target.value)}
                className="flex-1 bg-transparent border-b font-mono text-sm outline-none"
                style={{ 
                  borderColor: '#FFB00050',
                  color: '#FFB000',
                }}
                spellCheck={false}
                autoFocus
              />
            </form>
          </div>

          {/* Quick Commands */}
          <div className="flex flex-wrap gap-2">
            {['R R0 000042', 'E 001000', 'G', 'S', 'CLR'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeInstruction(cmd)}
                className="px-3 py-1 border text-xs font-mono transition-all hover:bg-amber-500/20"
                style={{ 
                  borderColor: '#FFB00040',
                  color: '#FFB000',
                }}
              >
                {cmd}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center z-10 max-w-2xl px-4"
      >
        <blockquote 
          className="text-xs italic opacity-40 font-mono"
          style={{ color: '#FFB000' }}
        >
          "Unix is simple. It just takes a genius to understand its simplicity."
        </blockquote>
        <cite 
          className="text-[10px] mt-1 block opacity-30 font-mono"
          style={{ color: '#FFB000' }}
        >
          — Dennis Ritchie
        </cite>
      </motion.div>
    </div>
  );
}

// Decode PDP-11 instructions for display
function decodeInstruction(instr: number): string {
  const opcode = (instr >> 6) & 0o77;
  const src = (instr >> 3) & 0o7;
  const dst = instr & 0o7;
  void src; void dst; // Used for decoding
  
  const opcodes: Record<number, string> = {
    0o00: 'HALT',
    0o01: 'WAIT',
    0o02: 'RTI',
    0o03: 'BPT',
    0o04: 'IOT',
    0o05: 'RESET',
    0o06: 'RTT',
    0o57: 'CLR',
    0o60: 'ADD',
    0o61: 'SUB',
    0o62: 'CMP',
    0o27: 'MOV',
    0o10: 'JMP',
  };
  
  const op = opcodes[opcode] || 'UNKNOWN';
  return `${op}`;
}
