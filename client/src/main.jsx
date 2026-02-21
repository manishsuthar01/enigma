import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import './index.css'
import App from './App.jsx'

// ── Smooth scrolling ──
const lenis = new Lenis({
  duration: 1.2,
  orientation: "vertical",
  lerp: 0.08,
  wheelMultiplier: 0.5,
  infinite: false,
  gestureOrientation: "vertical",
  normalizeWheel: true,
  smoothWheel: true,
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
