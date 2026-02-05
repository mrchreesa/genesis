# Genesis

**The Evolution of Computing — An Immersive Portfolio Experience**

## Vision
An interactive journey from the birth of computing (transistors, binary, Turing) through Assembly, C, early web, modern web, all the way to LLMs and AGI. Each era styled authentically with period-appropriate visuals, interactions, and atmosphere.

## Live Development Server
```bash
cd genesis-app && npm run dev
```
Runs at `http://localhost:5173/`

## Eras / Sections (10 Total)

### ✅ 1. Boot Sequence
- BIOS POST simulation
- Green phosphor terminal
- Typewriter text effect
- "Press any key to continue"

### ✅ 2. The Genesis (Pre-Computing)
- **Interactive:** Turing Machine step-through simulator
- **Visual:** Binary rain background, CRT scanlines
- **Aesthetic:** Terminal green on black (`#33FF00`)
- User can step through or auto-run the machine

### ✅ 3. Assembly Age
- **Interactive:** Register manipulation, memory hex dump
- **Visual:** Amber phosphor terminal
- **Aesthetic:** PDP-11 era, hex addresses
- Terminal commands: MOV, INC, DEC, NOP

### ✅ 4. C Revolution
- **Interactive:** C code editor with "compile" simulation
- **Visual:** VT100 terminal, gcc output
- **Aesthetic:** White on black, Unix philosophy
- Live code editing → terminal output

### ✅ 5. Algorithms
- **Interactive:** Bubble sort visualizer with drag-to-reorder
- **Visual:** Clean white background, bar chart
- **Aesthetic:** Educational, Big O notation
- Color-coded: Current (red), Compare (teal), Unsorted (gray)

### ✅ 6. Early GUI
- **Interactive:** Minesweeper clone (Win95 style)
- **Visual:** Desktop icons, taskbar, window chrome
- **Aesthetic:** Windows 95 grey `#C0C0C0`, beveled buttons
- Desktop environment with Start menu

### ✅ 7. Web 1.0
- **Interactive:** Guestbook form (functional)
- **Visual:** Table layouts, marquees, under construction GIF
- **Aesthetic:** Times New Roman, blue links, hit counter
- Sidebar navigation, email link

### ✅ 8. Web 2.0
- **Interactive:** Draggable sortable list, tabbed interface
- **Visual:** Glossy glass cards, gradient backgrounds
- **Aesthetic:** Purple-blue gradients, pill buttons
- Profile/Dashboard/Settings tabs with animations

### ✅ 9. Modern Web
- **Interactive:** 3D tilt cards that follow mouse
- **Visual:** Glassmorphism, animated background orbs
- **Aesthetic:** Dark mode `#0D0D0D`, cyan accents
- React/TypeScript/Three.js feature cards

### ✅ 10. Intelligence Age
- **Interactive:** AI chat interface (simulated responses)
- **Visual:** Neural network particle system, glowing nodes
- **Aesthetic:** Futuristic cyan `#00FFFF`, purple `#9D4EDD`
- Typing indicators, connection lines

### ✅ 11. Portfolio (This Is Me)
- **Visual:** Clean landing, gradient avatar
- Links placeholder for GitHub, LinkedIn, Twitter, Email
- "Scroll back up" to restart journey

## Technical Stack
- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** VT323, IBM Plex Mono, Press Start 2P (Google Fonts)

## Architecture
- `App.tsx` — Main orchestrator, handles boot sequence vs main content
- `BootSequence.tsx` — Typewriter BIOS simulation
- `EraContainer.tsx` — Scrollytelling container with smooth transitions
- `ProgressBar.tsx` — Top progress + era timeline dots
- `eras/*.tsx` — Individual era components with unique styling

## Features Implemented
- ✅ Boot sequence (first-time, non-skippable)
- ✅ Continuous scroll through all eras
- ✅ Scroll back up reverses evolution
- ✅ Progress bar with era info
- ✅ Timeline dots on desktop
- ✅ CRT scanlines on appropriate eras
- ✅ Keyboard navigation support
- ✅ Responsive (desktop-first design)
- ✅ All 10 eras with interactive demos

## Next Steps / Enhancements
- [ ] Easter eggs (Konami code, hidden commands)
- [ ] Sound effects per era
- [ ] Three.js integration for true 3D sections
- [ ] Actual API integration for AGI chat
- [ ] Performance optimization (lazy loading)
- [ ] Mobile experience refinement
- [ ] Deploy to Vercel
- [ ] Portfolio content (replace placeholders with real links)

## Running Locally
```bash
cd genesis-app
npm install
npm run dev
```

## Build for Production
```bash
npm run build
```

---

Built by Kreeza with Kimmy 🤖
