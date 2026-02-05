// C Revolution - Authentic Unix Terminal with vi and gcc
// 1969-1985: The era of Unix, C, and the systems programming revolution

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type EditorMode = 'normal' | 'insert' | 'command';

export function CRevolutionEra() {
  // Code editor content
  const [code, setCode] = useState(`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* 
 * hello.c - The classic first program
 * Written for Unix V7 on PDP-11
 */

int main(int argc, char *argv[])
{
    printf("Hello, World!\\n");
    
    if (argc > 1) {
        printf("Arguments passed: %d\\n", argc - 1);
        for (int i = 1; i < argc; i++) {
            printf("  [%d]: %s\\n", i, argv[i]);
        }
    }
    
    return 0;
}`);

  const [compiled, setCompiled] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Last login: Mon Jan 27 09:42:33 1986 from tty01',
    '',
    'The programs included with the Debian GNU/Linux system are free software;',
    'the exact distribution terms for each program are described in the',
    'individual files in /usr/share/doc/*/copyright.',
    '',
    'Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent',
    'permitted by applicable law.',
    '',
    '$ _',
  ]);
  
  // vi editor state
  const [editorMode, setEditorMode] = useState<EditorMode>('normal');
  const [cursorLine, setCursorLine] = useState(0);
  const [cursorCol, setCursorCol] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [commandBuffer, setCommandBuffer] = useState('');
  const [filename, setFilename] = useState('hello.c');
  const [statusMessage, setStatusMessage] = useState('"hello.c" 23L, 467C');
  
  // Terminal state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalMode, setTerminalMode] = useState(false);
  
  const codeLines = code.split('\n');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  // Line info for status bar - defined early to avoid hoisting issues
  const lineInfo = () => `${codeLines.length},${cursorCol + 1}  ${Math.round(((cursorLine + 1) / codeLines.length) * 100)}%`;

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [terminalOutput]);

  // Handle vi key presses
  const handleViKeyDown = (e: React.KeyboardEvent) => {
    if (editorMode === 'insert') {
      if (e.key === 'Escape') {
        setEditorMode('normal');
        setStatusMessage('');
        return;
      }
      // In insert mode, let default behavior happen
      return;
    }

    if (editorMode === 'command') {
      if (e.key === 'Escape') {
        setEditorMode('normal');
        setCommandBuffer('');
        setStatusMessage('');
        return;
      }
      if (e.key === 'Enter') {
        executeCommand(commandBuffer);
        setCommandBuffer('');
        return;
      }
      if (e.key === 'Backspace') {
        setCommandBuffer(prev => prev.slice(0, -1));
        return;
      }
      if (e.key.length === 1) {
        setCommandBuffer(prev => prev + e.key);
      }
      return;
    }

    // Normal mode
    e.preventDefault();
    
    switch (e.key) {
      case 'i':
        setEditorMode('insert');
        setStatusMessage('-- INSERT --');
        break;
      case ':':
        setEditorMode('command');
        setCommandBuffer(':');
        break;
      case 'h':
      case 'ArrowLeft':
        setCursorCol(c => Math.max(0, c - 1));
        break;
      case 'j':
      case 'ArrowDown':
        setCursorLine(l => Math.min(codeLines.length - 1, l + 1));
        setCursorCol(c => Math.min(c, codeLines[cursorLine + 1]?.length || 0));
        break;
      case 'k':
      case 'ArrowUp':
        setCursorLine(l => Math.max(0, l - 1));
        break;
      case 'l':
      case 'ArrowRight':
        setCursorCol(c => Math.min((codeLines[cursorLine]?.length || 0), c + 1));
        break;
      case '0':
        setCursorCol(0);
        break;
      case '$':
        setCursorCol(codeLines[cursorLine]?.length || 0);
        break;
      case 'G':
        setCursorLine(codeLines.length - 1);
        break;
      case 'g':
        if (e.shiftKey) {
          setCursorLine(codeLines.length - 1);
        } else {
          setCursorLine(0);
        }
        break;
      case 'w': {
        // Move word forward
        const currentLine = codeLines[cursorLine] || '';
        const nextSpace = currentLine.indexOf(' ', cursorCol + 1);
        setCursorCol(nextSpace > 0 ? nextSpace + 1 : currentLine.length);
        break;
      }
      case 'x': {
        // Delete character
        const lines = code.split('\n');
        const line = lines[cursorLine];
        if (line && cursorCol < line.length) {
          lines[cursorLine] = line.slice(0, cursorCol) + line.slice(cursorCol + 1);
          setCode(lines.join('\n'));
        }
        break;
      }
      case 'd': {
        if (e.key === 'd') {
          // dd - delete line (simplified)
          const newLines = code.split('\n');
          newLines.splice(cursorLine, 1);
          setCode(newLines.join('\n'));
        }
        break;
      }
    }
  };

  const executeCommand = (cmd: string) => {
    setEditorMode('normal');
    
    if (cmd === ':w' || cmd === ':w!') {
      setStatusMessage(`"${filename}" written`);
    } else if (cmd === ':q') {
      setStatusMessage('No write since last change (add ! to override)');
    } else if (cmd === ':wq' || cmd === ':x') {
      setStatusMessage(`"${filename}" written and closed`);
      setTimeout(() => setTerminalMode(true), 500);
    } else if (cmd === ':q!') {
      setTerminalMode(true);
    } else if (cmd.startsWith(':e ')) {
      const newFilename = cmd.slice(3);
      setFilename(newFilename);
      setStatusMessage(`"${newFilename}" opened`);
    } else if (cmd.startsWith(':')) {
      setStatusMessage(`Not an editor command: ${cmd.slice(1)}`);
    }
  };

  // Handle compilation
  const handleCompile = () => {
    setCompiling(true);
    setTerminalOutput(prev => [...prev, `$ gcc -Wall -o hello hello.c`]);
    
    setTimeout(() => {
      setTerminalOutput(prev => [
        ...prev,
        '',
        'Compiling...',
      ]);
      
      setTimeout(() => {
        setTerminalOutput(prev => [
          ...prev,
          'gcc: hello.c: In function \'main\':',
          'gcc: hello.c:14: warning: implicit declaration of function \'printf\'',
          'gcc: hello.c:14: note: include \'<stdio.h>\' or provide a declaration',
          '',
          'Compilation successful (1 warning)',
          `$ _`,
        ]);
        setCompiling(false);
        setCompiled(true);
      }, 1500);
    }, 500);
  };

  const handleRun = () => {
    if (!compiled) return;
    
    setTerminalOutput(prev => [
      ...prev,
      '$ ./hello',
      'Hello, World!',
      '$ _',
    ]);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    const cmd = terminalInput.trim();
    setTerminalOutput(prev => [...prev, `$ ${cmd}`]);
    
    if (cmd === 'clear' || cmd === 'cls') {
      setTerminalOutput(['$ _']);
    } else if (cmd === 'ls' || cmd === 'dir') {
      setTerminalOutput(prev => [
        ...prev,
        'hello.c  hello  makefile  README',
        '$ _',
      ]);
    } else if (cmd === 'cat hello.c' || cmd === 'type hello.c') {
      setTerminalOutput(prev => [
        ...prev,
        ...code.split('\n'),
        '$ _',
      ]);
    } else if (cmd === 'make') {
      setTerminalOutput(prev => [
        ...prev,
        'cc -Wall -o hello hello.c',
        '$ _',
      ]);
      setCompiled(true);
    } else if (cmd === 'vi' || cmd === 'vim' || cmd === 'edit') {
      setTerminalMode(false);
      setEditorMode('normal');
      setStatusMessage(`"${filename}" 23L, 467C`);
    } else if (cmd === 'whoami') {
      setTerminalOutput(prev => [...prev, 'dmr', '$ _']);
    } else if (cmd === 'date') {
      setTerminalOutput(prev => [...prev, new Date().toString(), '$ _']);
    } else if (cmd === 'uname -a') {
      setTerminalOutput(prev => [
        ...prev,
        'Unix Version 7 Unix 4.1 BSD PDP-11',
        '$ _',
      ]);
    } else if (cmd === 'help') {
      setTerminalOutput(prev => [
        ...prev,
        'Available commands:',
        '  ls       - List files',
        '  cat      - Display file contents',
        '  make     - Build the project',
        '  vi       - Open vi editor',
        '  whoami   - Show current user',
        '  date     - Show current date',
        '  uname    - Show system info',
        '  clear    - Clear screen',
        '  help     - Show this help',
        '$ _',
      ]);
    } else {
      setTerminalOutput(prev => [
        ...prev,
        `${cmd}: command not found`,
        `$ _`,
      ]);
    }
    
    setTerminalInput('');
  };

  // C syntax highlighting (simplified)
  const highlightLine = (line: string) => {
    const highlighted = line
      .replace(/(\/\*.*?\*\/)/g, '<span style="color: #6272a4">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span style="color: #6272a4">$1</span>')
      .replace(/\b(int|char|void|return|if|else|for|while|include|define)\b/g, '<span style="color: #ff79c6">$1</span>')
      .replace(/\b(printf|scanf|malloc|free|strlen|strcpy)\b/g, '<span style="color: #8be9fd">$1</span>')
      .replace(/(".*?")/g, '<span style="color: #f1fa8c">$1</span>')
      .replace(/(#.*)/g, '<span style="color: #ff79c6">$1</span>')
      .replace(/(\b\d+\b)/g, '<span style="color: #bd93f9">$1</span>');
    return highlighted;
  };

  if (!terminalMode) {
    // vi Editor Mode
    return (
      <div className="min-h-screen w-full flex flex-col"
        style={{ background: '#1e1e1e' }}
      >
        {/* vi Editor */}
        <div className="flex-1 p-4 font-mono text-sm relative"
          style={{ 
            background: '#1e1e1e',
            color: '#f8f8f2',
          }}
          tabIndex={0}
          onKeyDown={handleViKeyDown}
        >
          <div className="absolute top-4 left-0 right-0 px-4"
          >
            {codeLines.map((line, lineIdx) => (
              <div 
                key={lineIdx} 
                className="flex"
                style={{ height: '1.5em' }}
              >
                <span className="w-8 text-right pr-2 opacity-30 select-none"
                >
                  {lineIdx + 1}
                </span>
                <span 
                  className="relative flex-1 whitespace-pre"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightLine(line.replace(/ /g, '\u00A0')) || '\u00A0'
                  }}
                />
                
                {/* Cursor */}
                {cursorLine === lineIdx && editorMode !== 'command' && (
                  <motion.span
                    layoutId="vi-cursor"
                    className="absolute w-2 h-5"
                    style={{
                      left: `${40 + cursorCol * 9.6}px`,
                      top: `${16 + lineIdx * 24}px`,
                      background: editorMode === 'insert' ? '#f8f8f2' : '#6272a4',
                      opacity: showCursor ? 1 : 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Tilde lines */}
          <div className="mt-4"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="opacity-30">~</div>
            ))}
          </div>
        </div>

        {/* Status Line */}
        <div 
          className="h-6 px-2 flex items-center justify-between text-sm font-mono"
          style={{
            background: editorMode === 'insert' ? '#005f5f' : '#303030',
            color: '#fff',
          }}
        >
          <span>{statusMessage}</span>
          <span>{lineInfo()}</span>
        </div>

        {/* Command Line */}
        <AnimatePresence>
          {editorMode === 'command' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-6 px-2 flex items-center text-sm font-mono"
              style={{ background: '#1e1e1e', color: '#f8f8f2' }}
            >
              {commandBuffer}
              <span 
                className="w-2 h-4 ml-0.5"
                style={{
                  background: showCursor ? '#f8f8f2' : 'transparent',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Terminal Mode
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8"
      style={{ background: '#000000' }}
    >
      {/* CRT effects */}
      <div className="scanlines opacity-30" />
      
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-6 z-10"
      >
        <h1 
          className="text-3xl md:text-5xl font-bold mb-2 font-mono"
          style={{ 
            color: '#33FF00',
            textShadow: '0 0 20px rgba(51, 255, 0, 0.5)',
          }}
        >
          C REVOLUTION
        </h1>
        <p className="text-sm md:text-lg opacity-80 font-mono" style={{ color: '#33FF00' }}>
          1969 — 1985
        </p>
        <p className="text-xs md:text-sm opacity-60 mt-2 max-w-2xl px-4"
          style={{ color: '#33FF0080' }}
        >
          "C is a general-purpose programming language which features economy of expression, 
          modern control flow and data structures, and a rich set of operators." — K&R
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 w-full max-w-6xl z-10">
        {/* Code Editor Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="border-2 rounded overflow-hidden"
          style={{ 
            borderColor: '#33FF0040',
            boxShadow: '0 0 20px rgba(51, 255, 0, 0.1)',
          }}
        >
          {/* Title bar */}
          <div 
            className="flex items-center justify-between px-3 py-2 border-b"
            style={{ borderColor: '#33FF0030', background: 'rgba(51, 255, 0, 0.05)' }}
          >
            <span className="text-xs font-mono" style={{ color: '#33FF00' }}>
              {filename}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCompile}
                disabled={compiling}
                className="px-3 py-1 text-xs border font-mono transition-all hover:bg-green-900/30 disabled:opacity-50"
                style={{ borderColor: '#33FF0050', color: '#33FF00' }}
              >
                {compiling ? 'Compiling...' : 'gcc -Wall'}
              </button>
              
              <button
                onClick={handleRun}
                disabled={!compiled}
                className="px-3 py-1 text-xs border font-mono transition-all hover:bg-green-900/30 disabled:opacity-30"
                style={{ borderColor: '#33FF0050', color: '#33FF00' }}
              >
                ./hello
              </button>
            </div>
          </div>

          {/* Code content */}
          <div 
            className="p-4 font-mono text-sm h-64 overflow-auto"
            style={{ background: '#0a0a0a', color: '#f8f8f2' }}
          >
            {code.split('\n').map((line, i) => (
              <div key={i} className="flex"
              >
                <span className="w-8 text-right pr-3 opacity-30 select-none"
                >{i + 1}</span>
                <span 
                  dangerouslySetInnerHTML={{ __html: highlightLine(line) }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Terminal Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="border-2 rounded overflow-hidden flex flex-col"
          style={{ 
            borderColor: '#33FF0040',
            boxShadow: '0 0 20px rgba(51, 255, 0, 0.1)',
          }}
        >
          {/* Terminal title bar */}
          <div 
            className="flex items-center gap-2 px-3 py-2 border-b"
            style={{ borderColor: '#33FF0030', background: 'rgba(51, 255, 0, 0.05)' }}
          >
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="ml-2 text-xs opacity-50 font-mono" style={{ color: '#33FF00' }}>
              tty01 — bash
            </span>
          </div>

          {/* Terminal content */}
          <div 
            className="flex-1 p-4 font-mono text-sm h-64 overflow-auto"
            style={{ background: '#000000', color: '#33FF00' }}
          >
            {terminalOutput.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap"
              >
                {line.endsWith('_') ? (
                  <span>
                    {line.slice(0, -1)}
                    <span 
                      className="inline-block w-2 h-4 align-middle"
                      style={{
                        background: showCursor ? '#33FF00' : 'transparent',
                      }}
                    />
                  </span>
                ) : (
                  line
                )}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal input */}
          <form 
            onSubmit={handleTerminalSubmit}
            className="flex items-center px-3 py-2 border-t"
            style={{ borderColor: '#33FF0030', background: 'rgba(0,0,0,0.8)' }}
          >
            <span style={{ color: '#33FF00' }}>$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-1 ml-2 bg-transparent outline-none font-mono text-sm"
              style={{ color: '#33FF00' }}
              spellCheck={false}
              autoFocus
            />
          </form>
        </motion.div>
      </div>

      {/* Footer Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center z-10 max-w-2xl px-4"
      >
        <blockquote 
          className="text-xs italic opacity-40 font-mono"
          style={{ color: '#33FF00' }}
        >
          "Unix is simple. It just takes a genius to understand its simplicity."
        </blockquote>
        <cite 
          className="text-[10px] mt-1 block opacity-30 font-mono"
          style={{ color: '#33FF00' }}
        >
          — Dennis Ritchie
        </cite>
      </motion.div>
    </div>
  );

}
