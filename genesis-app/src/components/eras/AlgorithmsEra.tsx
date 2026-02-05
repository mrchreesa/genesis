// Algorithms Era - 90s Educational Software Aesthetic
// Theory of Computation with Windows 3.1 / Classic Mac OS styling

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Algorithm = 'bubble' | 'quick' | 'merge' | 'binary';

export function AlgorithmsEra() {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 5, 73, 45]);
  const [sorting, setSorting] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [compareIdx, setCompareIdx] = useState(-1);
  const [swapped, setSwapped] = useState(false);
  const [algorithm, setAlgorithm] = useState<Algorithm>('bubble');
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [speed, setSpeed] = useState(500);

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer for elapsed time
  useEffect(() => {
    if (sorting) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime((Date.now() - startTimeRef.current) / 1000);
        }
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sorting]);

  // Bubble Sort implementation
  const bubbleSort = useCallback(async () => {
    setSorting(true);
    setComparisons(0);
    setSwaps(0);
    const arr = [...array];
    
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setCurrentIdx(j);
        setCompareIdx(j + 1);
        setComparisons(c => c + 1);
        setSwapped(false);
        
        await new Promise(r => setTimeout(r, speed));
        
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          setSwaps(s => s + 1);
          setSwapped(true);
          await new Promise(r => setTimeout(r, speed / 2));
        }
      }
    }
    
    setCurrentIdx(-1);
    setCompareIdx(-1);
    setSorting(false);
    setSwapped(false);
  }, [array, speed]);

  // Quick Sort implementation
  const quickSort = useCallback(async () => {
    setSorting(true);
    setComparisons(0);
    setSwaps(0);
    const arr = [...array];
    
    const partition = async (low: number, high: number): Promise<number> => {
      const pivot = arr[high];
      setCurrentIdx(high);
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        setCompareIdx(j);
        setComparisons(c => c + 1);
        await new Promise(r => setTimeout(r, speed));
        
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          setSwaps(s => s + 1);
          await new Promise(r => setTimeout(r, speed / 2));
        }
      }
      
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      setSwaps(s => s + 1);
      return i + 1;
    };
    
    const quickSortHelper = async (low: number, high: number) => {
      if (low < high) {
        const pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      }
    };
    
    await quickSortHelper(0, arr.length - 1);
    setCurrentIdx(-1);
    setCompareIdx(-1);
    setSorting(false);
  }, [array, speed]);

  const reset = () => {
    setArray([64, 34, 25, 12, 22, 11, 90, 5, 73, 45]);
    setCurrentIdx(-1);
    setCompareIdx(-1);
    setComparisons(0);
    setSwaps(0);
    setElapsedTime(0);
    setSwapped(false);
  };

  const randomize = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setCurrentIdx(-1);
    setCompareIdx(-1);
    setComparisons(0);
    setSwaps(0);
    setElapsedTime(0);
  };

  const startSort = () => {
    if (algorithm === 'bubble') {
      bubbleSort();
    } else if (algorithm === 'quick') {
      quickSort();
    }
  };

  // Win 3.1 style colors
  const colors = {
    bg: '#c0c0c0',
    buttonFace: '#c0c0c0',
    buttonHighlight: '#ffffff',
    buttonShadow: '#808080',
    buttonDarkShadow: '#000000',
    activeTitle: '#000080',
    titleText: '#ffffff',
    windowFrame: '#000000',
    text: '#000000',
  };

  const buttonStyle = {
    background: colors.buttonFace,
    borderTop: `2px solid ${colors.buttonHighlight}`,
    borderLeft: `2px solid ${colors.buttonHighlight}`,
    borderRight: `2px solid ${colors.buttonDarkShadow}`,
    borderBottom: `2px solid ${colors.buttonDarkShadow}`,
    boxShadow: `1px 1px 0 ${colors.buttonShadow}`,
  };

  const buttonActiveStyle = {
    background: colors.buttonFace,
    borderTop: `2px solid ${colors.buttonDarkShadow}`,
    borderLeft: `2px solid ${colors.buttonDarkShadow}`,
    borderRight: `2px solid ${colors.buttonHighlight}`,
    borderBottom: `2px solid ${colors.buttonHighlight}`,
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8"
      style={{ 
        background: '#008080',
        fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
      }}
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-4">
        {[
          { name: 'Computer', icon: '🖥️' },
          { name: 'Algorithms', icon: '📊' },
          { name: 'Recycle Bin', icon: '🗑️' },
        ].map((item) => (
          <div key={item.name} className="flex flex-col items-center gap-1 cursor-pointer group w-16"
          >
            <div className="text-3xl group-hover:scale-110 transition-transform drop-shadow"
            >{item.icon}</div>
            <div 
              className="text-xs text-center px-1 py-0.5 truncate"
              style={{ 
                background: 'rgba(0,0,128,0.3)',
                color: '#fff',
              }}
            >
              {item.name}
            </div>
          </div>
        ))}
      </div>

      {/* Main Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
        style={{
          background: colors.bg,
          borderTop: `2px solid ${colors.buttonHighlight}`,
          borderLeft: `2px solid ${colors.buttonHighlight}`,
          borderRight: `2px solid ${colors.windowFrame}`,
          borderBottom: `2px solid ${colors.windowFrame}`,
          boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
        }}
      >
        {/* Title Bar */}
        <div 
          className="flex items-center justify-between px-2 py-1"
          style={{
            background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
          }}
        >
          <div className="flex items-center gap-2"
          >
            <span className="text-white">📊</span>
            <span className="text-white text-sm font-bold"
              style={{ fontFamily: 'MS Sans Serif, sans-serif' }}
            >
              Algorithm Visualizer
            </span>
          </div>
          
          <div className="flex gap-1"
          >
            {['_', '□', '×'].map((btn, i) => (
              <button
                key={i}
                className="w-4 h-4 flex items-center justify-center text-xs font-bold"
                style={{
                  ...buttonStyle,
                  color: '#000',
                }}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Bar */}
        <div 
          className="flex gap-4 px-2 py-1 text-xs"
          style={{ borderBottom: `1px solid ${colors.buttonShadow}` }}
        >
          {['File', 'Edit', 'View', 'Help'].map((menu) => (
            <button
              key={menu}
              onClick={() => menu === 'Help' && setShowHelp(true)}
              className="px-2 py-0.5 hover:bg-blue-800 hover:text-white"
              style={{ color: '#000' }}
            >
              {menu}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div 
          className="flex gap-2 px-2 py-2"
          style={{ borderBottom: `1px solid ${colors.buttonShadow}` }}
        >
          <button
            onClick={startSort}
            disabled={sorting}
            className="flex items-center gap-1 px-3 py-1 text-xs disabled:opacity-50"
            style={sorting ? buttonActiveStyle : buttonStyle}
          >
            ▶️ Run
          </button>
          
          <button
            onClick={reset}
            disabled={sorting}
            className="flex items-center gap-1 px-3 py-1 text-xs disabled:opacity-50"
            style={buttonStyle}
          >
            🔄 Reset
          </button>
          
          <button
            onClick={randomize}
            disabled={sorting}
            className="flex items-center gap-1 px-3 py-1 text-xs disabled:opacity-50"
            style={buttonStyle}
          >
            🎲 Random
          </button>
          
          <div className="w-px h-6 mx-2" style={{ background: colors.buttonShadow }} />
          
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            disabled={sorting}
            className="text-xs px-2 py-1 disabled:opacity-50"
            style={{
              ...buttonStyle,
              color: '#000',
            }}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="quick">Quick Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="binary">Binary Search</option>
          </select>
        </div>

        {/* Client Area */}
        <div className="p-4"
          style={{ background: '#c0c0c0' }}
        >
          {/* Visualization Area */}
          <div 
            className="p-4 mb-4"
            style={{
              background: '#fff',
              borderTop: `2px solid ${colors.buttonShadow}`,
              borderLeft: `2px solid ${colors.buttonShadow}`,
              borderRight: `2px solid ${colors.buttonHighlight}`,
              borderBottom: `2px solid ${colors.buttonHighlight}`,
            }}
          >
            <div className="text-center mb-4 text-sm font-bold"
              style={{ color: '#000' }}
            >
              {algorithm === 'bubble' && 'Bubble Sort Visualization'}
              {algorithm === 'quick' && 'Quick Sort Visualization'}
              {algorithm === 'merge' && 'Merge Sort Visualization'}
              {algorithm === 'binary' && 'Binary Search Visualization'}
            </div>

            {/* Array bars */}
            <div className="flex items-end justify-center gap-1 h-48"
            >
              {array.map((value, idx) => (
                <motion.div
                  key={idx}
                  layout
                  className="flex flex-col items-center"
                >
                  <div
                    className="w-8 flex items-end justify-center text-xs font-bold transition-all duration-300"
                    style={{
                      height: `${value * 2}px`,
                      background: 
                        idx === currentIdx ? '#ff0000' :
                        idx === compareIdx ? '#00ff00' :
                        swapped && (idx === currentIdx || idx === compareIdx) ? '#ffff00' :
                        '#000080',
                      border: '1px solid #000',
                    }}
                  >
                    <span 
                      className="mb-1"
                      style={{ color: idx === currentIdx || idx === compareIdx ? '#000' : '#fff' }}
                    >
                      {value}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 text-xs"
            >
              {[
                { color: '#ff0000', label: 'Current' },
                { color: '#00ff00', label: 'Compare' },
                { color: '#ffff00', label: 'Swap' },
                { color: '#000080', label: 'Unsorted' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1"
                >
                  <div 
                    className="w-4 h-4 border"
                    style={{ background: item.color, borderColor: '#000' }}
                  />
                  <span style={{ color: '#000' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Panel */}
          <div 
            className="grid grid-cols-4 gap-2 p-3"
            style={{
              background: '#c0c0c0',
              borderTop: `2px solid ${colors.buttonHighlight}`,
              borderLeft: `2px solid ${colors.buttonHighlight}`,
              borderRight: `2px solid ${colors.buttonShadow}`,
              borderBottom: `2px solid ${colors.buttonShadow}`,
            }}
          >
            {[
              { label: 'Comparisons', value: comparisons },
              { label: 'Swaps', value: swaps },
              { label: 'Time (s)', value: elapsedTime.toFixed(2) },
              { label: 'Speed', value: `${speed}ms` },
            ].map((stat) => (
              <div 
                key={stat.label}
                className="text-center p-2"
                style={{
                  background: '#fff',
                  borderTop: `1px solid ${colors.buttonShadow}`,
                  borderLeft: `1px solid ${colors.buttonShadow}`,
                  borderRight: `1px solid ${colors.buttonHighlight}`,
                  borderBottom: `1px solid ${colors.buttonHighlight}`,
                }}
              >
                <div className="text-xs mb-1" style={{ color: '#000' }}>{stat.label}</div>
                <div className="text-lg font-bold font-mono" style={{ color: '#000' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Speed Control */}
          <div className="mt-4 flex items-center gap-2"
          >
            <span className="text-xs" style={{ color: '#000' }}>Speed:</span>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={sorting}
              className="flex-1 disabled:opacity-50"
            />
            <span className="text-xs w-12 text-right font-mono" style={{ color: '#000' }}>
              {speed}ms
            </span>
          </div>
        </div>

        {/* Status Bar */}
        <div 
          className="px-2 py-1 text-xs flex justify-between"
          style={{
            borderTop: `1px solid ${colors.buttonShadow}`,
            background: colors.bg,
          }}
        >
          <span style={{ color: '#000' }}>
            {sorting ? 'Sorting...' : 'Ready'}
          </span>
          <span style={{ color: '#000' }}>
            O(n²) Time Complexity
          </span>
        </div>
      </motion.div>

      {/* Help Dialog */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex items-center justify-center z-50 bg-black/50"
          >
            <div 
              className="w-80"
              style={{
                background: colors.bg,
                borderTop: `2px solid ${colors.buttonHighlight}`,
                borderLeft: `2px solid ${colors.buttonHighlight}`,
                borderRight: `2px solid ${colors.windowFrame}`,
                borderBottom: `2px solid ${colors.windowFrame}`,
              }}
            >
              <div 
                className="px-2 py-1 flex items-center justify-between"
                style={{ background: colors.activeTitle }}
              >
                <span className="text-white text-sm font-bold">Help</span>
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-4 h-4 flex items-center justify-center"
                  style={buttonStyle}
                >
                  ×
                </button>
              </div>
              
              <div className="p-4 text-sm" style={{ color: '#000' }}>
                <p className="mb-2"><strong>Algorithm Visualizer v1.0</strong></p>
                <p className="mb-2">This program demonstrates sorting algorithms:</p>
                <ul className="list-disc pl-4 mb-4">
                  <li>Bubble Sort: O(n²) - simple but slow</li>
                  <li>Quick Sort: O(n log n) - divide and conquer</li>
                  <li>Merge Sort: O(n log n) - stable sort</li>
                </ul>
                <p>Click Run to visualize the algorithm step by step.</p>
              </div>
              
              <div className="p-2 flex justify-end"
                style={{ borderTop: `1px solid ${colors.buttonShadow}` }}
              >
                <button
                  onClick={() => setShowHelp(false)}
                  className="px-4 py-1 text-xs"
                  style={buttonStyle}
                >
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-10 flex items-center px-1 gap-1"
        style={{ 
          background: '#c0c0c0',
          borderTop: '2px solid #ffffff',
        }}
      >
        <button 
          className="flex items-center gap-2 px-4 py-1 font-bold"
          style={buttonStyle}
        >
          <span>🪟</span>
          <span className="text-sm">Start</span>
        </button>
        
        <div className="flex-1"></div>
        
        <div 
          className="px-3 py-1 text-xs font-mono flex items-center gap-2"
          style={{
            ...buttonActiveStyle,
            border: 'none',
            boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
          }}
        >
          <span>📊</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}
