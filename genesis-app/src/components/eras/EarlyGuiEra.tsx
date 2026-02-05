// Early GUI Era - Windows 95 Style with Functional Minesweeper
// 1985-1995: The graphical revolution

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export function EarlyGuiEra() {
  // Minesweeper game state
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [flagCount, setFlagCount] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  
  // Window states
  const [activeWindow, setActiveWindow] = useState<'minesweeper' | 'notepad' | 'calc'>('minesweeper');
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const ROWS = 8;
  const COLS = 8;
  const MINES = 10;

  // Initialize board
  const initBoard = useCallback(() => {
    const newBoard: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newBoard.push(row);
    }
    return newBoard;
  }, []);

  // Place mines (after first click) - memoized to avoid ESLint warnings
  const placeMines = useCallback((board: Cell[][], excludeR: number, excludeC: number) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let minesPlaced = 0;
    
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      
      if (!newBoard[r][c].isMine && !(r === excludeR && c === excludeC)) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }
    
    // Calculate neighbor counts
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                if (newBoard[nr][nc].isMine) count++;
              }
            }
          }
          newBoard[r][c].neighborMines = count;
        }
      }
    }
    
    return newBoard;
  }, []);

  // Reveal cell
  const revealCell = (r: number, c: number) => {
    if (gameState !== 'playing' || board[r][c].isRevealed || board[r][c].isFlagged) return;
    
    let newBoard = [...board];
    
    // First click - place mines
    if (firstClick) {
      newBoard = placeMines(newBoard, r, c);
      setFirstClick(false);
      setGameStarted(true);
    }
    
    const reveal = (br: number, bc: number) => {
      if (br < 0 || br >= ROWS || bc < 0 || bc >= COLS) return;
      if (newBoard[br][bc].isRevealed || newBoard[br][bc].isFlagged) return;
      
      newBoard[br][bc].isRevealed = true;
      
      if (newBoard[br][bc].neighborMines === 0 && !newBoard[br][bc].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(br + dr, bc + dc);
          }
        }
      }
    };
    
    reveal(r, c);
    setBoard(newBoard.map(row => [...row]));
    
    // Check for mine hit
    if (newBoard[r][c].isMine) {
      setGameState('lost');
      // Reveal all mines
      const revealedBoard = newBoard.map(row => 
        row.map(cell => ({
          ...cell,
          isRevealed: cell.isMine ? true : cell.isRevealed,
        }))
      );
      setBoard(revealedBoard);
      return;
    }
    
    // Check for win
    const revealedCount = newBoard.flat().filter(c => c.isRevealed).length;
    if (revealedCount === ROWS * COLS - MINES) {
      setGameState('won');
    }
  };

  // Flag cell
  const flagCell = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || board[r][c].isRevealed) return;
    
    const newBoard = board.map(row => [...row]);
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
    setFlagCount(prev => newBoard[r][c].isFlagged ? prev + 1 : prev - 1);
  };

  // Reset game
  const resetGame = () => {
    setBoard(initBoard());
    setGameState('playing');
    setFlagCount(0);
    setTime(0);
    setGameStarted(false);
    setFirstClick(true);
  };

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameStarted && gameState === 'playing' && time < 999) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameState, time]);

  // Initialize on mount
  useEffect(() => {
    setBoard(initBoard());
  }, [initBoard]);

  // Win95 colors
  const win95 = {
    buttonFace: '#c0c0c0',
    buttonHighlight: '#ffffff',
    buttonShadow: '#808080',
    buttonDarkShadow: '#404040',
    windowFrame: '#000000',
    titleActive: '#000080',
    titleInactive: '#808080',
  };

  const button3D = (pressed = false) => ({
    background: win95.buttonFace,
    borderTop: `2px solid ${pressed ? win95.buttonDarkShadow : win95.buttonHighlight}`,
    borderLeft: `2px solid ${pressed ? win95.buttonDarkShadow : win95.buttonHighlight}`,
    borderRight: `2px solid ${pressed ? win95.buttonHighlight : win95.buttonDarkShadow}`,
    borderBottom: `2px solid ${pressed ? win95.buttonHighlight : win95.buttonDarkShadow}`,
  });

  const sunkenPanel = {
    background: '#c0c0c0',
    borderTop: `2px solid ${win95.buttonShadow}`,
    borderLeft: `2px solid ${win95.buttonShadow}`,
    borderRight: `2px solid ${win95.buttonHighlight}`,
    borderBottom: `2px solid ${win95.buttonHighlight}`,
    boxShadow: 'inset 1px 1px 0 #00000040',
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{ 
        background: '#008080',
        fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
      }}
      onClick={() => setStartMenuOpen(false)}
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-6"
      >
        {[
          { name: 'My Computer', icon: '🖥️', onClick: () => {} },
          { name: 'Minesweeper', icon: '💣', onClick: () => setActiveWindow('minesweeper') },
          { name: 'Notepad', icon: '📄', onClick: () => setActiveWindow('notepad') },
          { name: 'Recycle Bin', icon: '🗑️', onClick: () => {} },
        ].map((item) => (
          <div 
            key={item.name} 
            className="flex flex-col items-center gap-1 cursor-pointer group w-20"
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
            }}
          >
            <div className="text-4xl group-hover:scale-110 transition-transform drop-shadow-lg"
            >{item.icon}</div>
            <div 
              className="text-xs text-center px-1 py-0.5 truncate w-full"
              style={{ 
                background: activeWindow === item.name.toLowerCase() ? '#000080' : 'transparent',
                color: '#fff',
                textShadow: '1px 1px 0 #000',
              }}
            >
              {item.name}
            </div>
          </div>
        ))}
      </div>

      {/* Minesweeper Window */}
      <AnimatePresence>
        {activeWindow === 'minesweeper' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ minWidth: '200px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Window Frame */}
            <div 
              style={{
                background: win95.buttonFace,
                borderTop: `2px solid ${win95.buttonHighlight}`,
                borderLeft: `2px solid ${win95.buttonHighlight}`,
                borderRight: `2px solid ${win95.windowFrame}`,
                borderBottom: `2px solid ${win95.windowFrame}`,
                boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
              }}
            >
              {/* Title Bar */}
              <div 
                className="flex items-center justify-between px-2 py-1 select-none"
                style={{
                  background: `linear-gradient(90deg, ${win95.titleActive} 0%, #1084d0 100%)`,
                }}
              >
                <div className="flex items-center gap-2"
                >
                  <span>💣</span>
                  <span className="text-white text-sm font-bold">Minesweeper</span>
                </div>
                
                <div className="flex gap-1"
                >
                  <button 
                    className="w-4 h-4 flex items-center justify-center text-xs"
                    style={button3D()}
                  >
                    _
                  </button>
                  <button 
                    className="w-4 h-4 flex items-center justify-center text-xs"
                    style={button3D()}
                  >
                    □
                  </button>
                  <button 
                    className="w-4 h-4 flex items-center justify-center text-xs font-bold"
                    style={button3D()}
                    onClick={() => setActiveWindow('notepad')}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Menu Bar */}
              <div 
                className="flex gap-4 px-2 py-1 text-xs"
                style={{ borderBottom: `1px solid ${win95.buttonShadow}` }}
              >
                {['Game', 'Help'].map((menu) => (
                  <button 
                    key={menu}
                    className="hover:bg-blue-800 hover:text-white px-2 py-0.5"
                    style={{ color: '#000' }}
                    onClick={() => menu === 'Game' && resetGame()}
                  >
                    {menu}
                  </button>
                ))}
              </div>

              {/* Game Area */}
              <div className="p-3"
                style={{ background: win95.buttonFace }}
              >
                {/* Status Panel */}
                <div 
                  className="flex justify-between items-center mb-3 p-2"
                  style={sunkenPanel}
                >
                  {/* Mine Counter */}
                  <div 
                    className="px-2 py-1 font-mono text-xl font-bold"
                    style={{
                      background: '#000',
                      color: '#ff0000',
                      border: '1px inset #808080',
                      fontFamily: 'Digital, "Courier New", monospace',
                    }}
                  >
                    {String(MINES - flagCount).padStart(3, '0')}
                  </div>
                  
                  {/* Face Button */}
                  <button
                    onClick={resetGame}
                    className="w-8 h-8 text-2xl flex items-center justify-center active:translate-y-0.5"
                    style={button3D()}
                  >
                    {gameState === 'lost' ? '💀' : gameState === 'won' ? '😎' : gameStarted ? '😮' : '😊'}
                  </button>
                  
                  {/* Timer */}
                  <div 
                    className="px-2 py-1 font-mono text-xl font-bold"
                    style={{
                      background: '#000',
                      color: '#ff0000',
                      border: '1px inset #808080',
                      fontFamily: 'Digital, "Courier New", monospace',
                    }}
                  >
                    {String(time).padStart(3, '0')}
                  </div>
                </div>

                {/* Game Grid */}
                <div 
                  className="inline-block p-1"
                  style={sunkenPanel}
                >
                  <div 
                    className="grid gap-0"
                    style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
                  >
                    {board.map((row, r) => (
                      row.map((cell, c) => (
                        <button
                          key={`${r}-${c}`}
                          onClick={() => revealCell(r, c)}
                          onContextMenu={(e) => flagCell(e, r, c)}
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold select-none"
                          style={{
                            ...button3D(!cell.isRevealed && !cell.isFlagged),
                            background: cell.isRevealed ? '#c0c0c0' : win95.buttonFace,
                            color: getNumberColor(cell.neighborMines),
                            fontFamily: 'MS Sans Serif, sans-serif',
                          }}
                          disabled={cell.isRevealed && !cell.isMine}
                        >
                          {cell.isRevealed ? (
                            cell.isMine ? '💣' : 
                            cell.neighborMines > 0 ? cell.neighborMines : ''
                          ) : (
                            cell.isFlagged ? '🚩' : ''
                          )}
                        </button>
                      ))
                    ))}
                  </div>
                </div>

                {/* Game Over Message */}
                <AnimatePresence>
                  {gameState !== 'playing' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center mt-4 font-bold"
                      style={{ 
                        color: gameState === 'won' ? '#008000' : '#ff0000',
                        fontSize: '14px',
                      }}
                    >
                      {gameState === 'won' ? 'YOU WIN! 🎉' : 'GAME OVER!'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notepad Window */}
      <AnimatePresence>
        {activeWindow === 'notepad' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/4 right-1/4"
            style={{ width: '400px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              style={{
                background: win95.buttonFace,
                borderTop: `2px solid ${win95.buttonHighlight}`,
                borderLeft: `2px solid ${win95.buttonHighlight}`,
                borderRight: `2px solid ${win95.windowFrame}`,
                borderBottom: `2px solid ${win95.windowFrame}`,
                boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
              }}
            >
              {/* Title Bar */}
              <div 
                className="flex items-center justify-between px-2 py-1"
                style={{
                  background: `linear-gradient(90deg, ${win95.titleActive} 0%, #1084d0 100%)`,
                }}
              >
                <div className="flex items-center gap-2"
                >
                  <span>📄</span>
                  <span className="text-white text-sm font-bold">About Windows 95</span>
                </div>
                
                <button 
                  className="w-4 h-4 flex items-center justify-center text-xs font-bold"
                  style={button3D()}
                  onClick={() => setActiveWindow('minesweeper')}
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div 
                className="p-4 h-48 overflow-auto"
                style={{ 
                  background: '#fff',
                  fontFamily: 'Fixedsys, Courier New, monospace',
                }}
              >
                <p className="mb-4">Microsoft® Windows 95</p>
                <p className="mb-4">Version 4.00.950</p>
                
                <p className="mb-4">
                  The era of graphical user interfaces brought computing to the masses.
                  Windows 95 introduced the Start menu, taskbar, and plug-and-play hardware.
                </p>

                <p className="mb-4">
                  1995 also saw the release of Internet Explorer 1.0, 
                  beginning the browser wars that would shape the web.
                </p>

                <div className="mt-8 text-center"
                >
                  <button
                    onClick={() => setActiveWindow('minesweeper')}
                    className="px-8 py-1 text-sm"
                    style={button3D()}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-9 flex items-center px-0.5 gap-1"
        style={{ 
          background: win95.buttonFace,
          borderTop: '2px solid #ffffff',
        }}
      >
        {/* Start Button */}
        <button 
          className="flex items-center gap-1 px-2 py-0.5 h-7 font-bold"
          style={{
            ...button3D(startMenuOpen),
            fontStyle: 'italic',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setStartMenuOpen(!startMenuOpen);
          }}
        >
          <span className="text-lg">🪟</span>
          <span className="text-sm">Start</span>
        </button>

        {/* Taskbar Divider */}
        <div 
          className="w-0.5 h-6 mx-1"
          style={{
            borderLeft: `1px solid ${win95.buttonShadow}`,
            borderRight: `1px solid ${win95.buttonHighlight}`,
          }}
        />

        {/* Window Buttons */}
        <button
          onClick={() => setActiveWindow('minesweeper')}
          className="flex items-center gap-1 px-2 py-0.5 h-7 text-xs"
          style={{
            ...button3D(activeWindow === 'minesweeper'),
            background: activeWindow === 'minesweeper' ? '#d4d0c8' : win95.buttonFace,
          }}
        >
          <span>💣</span>
          <span>Minesweeper</span>
        </button>

        <button
          onClick={() => setActiveWindow('notepad')}
          className="flex items-center gap-1 px-2 py-0.5 h-7 text-xs"
          style={{
            ...button3D(activeWindow === 'notepad'),
            background: activeWindow === 'notepad' ? '#d4d0c8' : win95.buttonFace,
          }}
        >
          <span>📄</span>
          <span>Notepad</span>
        </button>

        <div className="flex-1"></div>

        {/* Clock */}
        <div 
          className="flex items-center gap-1 px-3 py-0.5 h-7 text-xs"
          style={{
            ...button3D(true),
            border: 'none',
          }}
        >
          <span>📅</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Start Menu */}
      <AnimatePresence>
        {startMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-10 left-0.5 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="flex"
              style={{
                background: win95.buttonFace,
                borderTop: `2px solid ${win95.buttonHighlight}`,
                borderLeft: `2px solid ${win95.buttonHighlight}`,
                borderRight: `2px solid ${win95.windowFrame}`,
                borderBottom: `2px solid ${win95.windowFrame}`,
              }}
            >
              {/* Sidebar */}
              <div 
                className="w-8 flex items-end justify-center pb-2"
                style={{
                  background: `linear-gradient(180deg, ${win95.titleActive} 0%, #1084d0 100%)`,
                }}
              >
                <span 
                  className="text-white font-bold text-lg whitespace-nowrap"
                  style={{ 
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                  }}
                >
                  Windows 95
                </span>
              </div>

              {/* Menu Items */}
              <div className="py-1 w-48"
              >
                {[
                  { icon: '📄', label: 'Programs', arrow: true },
                  { icon: '📂', label: 'Documents', arrow: true },
                  { icon: '⚙️', label: 'Settings', arrow: true },
                  { icon: '📊', label: 'Find', arrow: true },
                  { icon: '❓', label: 'Help', separator: true },
                  { icon: '💻', label: 'Run...', separator: true },
                  { icon: '🚪', label: 'Shut Down...' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-3 px-3 py-1.5 text-sm hover:bg-blue-800 hover:text-white"
                    style={{ color: '#000' }}
                  >
                    <span className="w-5">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.arrow && <span>▶</span>}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getNumberColor(n: number): string {
  const colors: Record<number, string> = {
    1: '#0000ff',
    2: '#008000',
    3: '#ff0000',
    4: '#000080',
    5: '#800000',
    6: '#008080',
    7: '#000000',
    8: '#808080',
  };
  return colors[n] || '#000';
}
