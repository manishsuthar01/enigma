import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import './index.css'
import App from './App.jsx'

// ── Smooth scrolling ──
const lenis = new Lenis({
  duration: 0.8,          // faster response
  lerp: 0.12,             // less floaty
  wheelMultiplier: 1,     // natural scroll strength
  smoothWheel: true,
  normalizeWheel: false,
});


function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
