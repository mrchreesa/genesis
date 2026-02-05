# Genesis — Era Research & Inspiration

## Reference: pieter.com
- Full Windows 3.11 emulation in browser
- **Takeaways for us:**
  - On-screen keyboard overlay for authenticity
  - "Loading..." / "Downloading..." text states build anticipation
  - Fullscreen toggle for immersion
  - Don't need full emulation — just the *feel*

---

## Era-by-Era Inspiration

### 1. The Genesis (Pre-Computing)
**Visual References:**
- CRT monitors with phosphor glow (green/amber)
- Blinking cursor, terminal aesthetics
- Binary rain (Matrix-style but slower, more "computational")
- Vacuum tube glow, early transistor boards

**Interactions:**
- Turing Machine step-through simulator
- Binary calculator/converter
- Flip bits and see immediate result

**Color Palette:** 
- Phosphor green `#33FF00` on black `#000000`
- Optional amber `#FFB000` variant
- Scanline overlay effect

---

### 2. Assembly Age
**Visual References:**
- Hex dump scrolling
- Amber phosphor terminal (different from green)
- Memory addresses, registers visualization
- PDP-11 / early microcomputer aesthetics

**Interactions:**
- Simple assembly language simulator
- MOV, ADD, JMP instructions they can execute
- Register state visualization

**Color Palette:**
- Amber phosphor `#FFB000`
- Dark background `#0C0C0C`
- Monospace grid layout

---

### 3. C Revolution
**Visual References:**
- VT100 terminal emulation
- `man` page formatting
- GCC compiler output
- Early Unix aesthetic

**Interactions:**
- "Hello World" that actually compiles and runs
- Pointer visualization (memory addresses)
- Simple C program they can modify and "run"

**Color Palette:**
- White/light gray on black
- `#FFFFFF`, `#CCCCCC`, `#000000`

---

### 4. Early GUI (Pre-Web)
**Visual References:**
- BIOS POST screens
- DOS command prompt
- Windows 3.1/95/98 chrome
- Beveled buttons, pixel fonts
- Mouse cursor changes

**Interactions:**
- Interactive DOS commands (DIR, CLS, etc.)
- Functional Minesweeper clone
- Paint-like drawing canvas
- "My Computer" file explorer simulation

**Color Palette:**
- Windows 95 gray `#C0C0C0`
- Button highlight `#FFFFFF`, shadow `#808080`
- Blue title bars `#000080`

---

### 5. Web 1.0
**Visual References:**
- Table-based layouts
- Web-safe colors (216 palette)
- Marquees, blinking text
- "Under Construction" GIFs
- Guestbooks, hit counters
- Times New Roman, blue links

**Interactions:**
- Functional guestbook form
- Animated GIF showcase
- Frame-based navigation simulation
- Classic marquee they can edit

**Color Palette:**
- Web gray `#CCCCCC`
- Link blue `#0000FF`
- Visited purple `#800080`
- White backgrounds

---

### 6. Algorithms (CS Theory)
**Visual References:**
- Flowchart aesthetics
- Graph paper grid
- Clean vector shapes
- Step-by-step visualization

**Interactions:**
- Sorting visualizer (bubble, quick, merge)
- Pathfinding (A*, Dijkstra)
- Binary search tree builder
- Maze generation/solving

**Color Palette:**
- White/light backgrounds
- Accent colors for different algorithm states
- Clean, educational feel

---

### 7. Web 2.0
**Visual References:**
- Glossy buttons with reflections
- Rounded corners (border-radius)
- Gradient backgrounds
- AJAX loading spinners
- jQuery UI aesthetic
- Reflections, shadows

**Interactions:**
- AJAX-powered content loading demo
- Accordion/Tab interface
- Drag-and-drop sorting
- Slider controls

**Color Palette:**
- Vibrant gradients
- `#4A90E2` to `#357ABD` blues
- Reflection white `#FFFFFF` at 30% opacity

---

### 8. Modern Web
**Visual References:**
- Dark mode aesthetics
- Glassmorphism (frosted glass)
- Neumorphism (soft UI)
- Three.js 3D scenes
- Smooth micro-interactions

**Interactions:**
- 3D interactive orb (Three.js)
- React component playground
- Glassmorphism card builder
- Smooth page transitions demo

**Color Palette:**
- Dark backgrounds `#0D0D0D`, `#1A1A1A`
- Accent gradients
- Glass white `rgba(255,255,255,0.1)`

---

### 9. Intelligence Age
**Visual References:**
- Neural network visualizations
- Particle systems
- Glowing connections
- Holographic UI
- Terminal-like but futuristic

**Interactions:**
- Live chat interface (actually functional with AI)
- Neural net visualization they can train
- Prompt engineering playground
- Code generation demo

**Color Palette:**
- Deep space black `#000000`
- Cyan glow `#00FFFF`
- Purple accents `#9D4EDD`
- Particle gold `#FFD700`

---

### 10. This Is Me (Portfolio)
**Visual References:**
- Clean, modern, personal
- Typography-focused
- Contact form, project showcase
- Links to real work

---

## Technical Implementation Notes

### Scroll Behavior
- **Scroll snap vs free scroll:** Consider snap points at era boundaries
- **Progress indicator:** Timeline on side that morphs style per era
- **Parallax layers:** Background elements move at different speeds

### Transition Effects
- **Color grading:** Global CSS filter that shifts between era palettes
- **CRT effects:** Scanlines, vignette, chromatic aberration for early eras
- **Glitch effects:** Hard cuts between certain eras (Assembly → C?)

### Performance
- Lazy load eras not in viewport
- Pause animations when not visible
- Use `will-change` for scroll-triggered animations

## Open Questions
1. Sound design scope — ambient? UI sounds? Era-appropriate?
2. Mobile strategy — simplified view or "desktop only" notice?
3. Accessibility — keyboard navigation essential for early eras?
4. Easter eggs — hidden commands, Konami code, secret pages?
5. Social sharing — share specific era or whole journey?
