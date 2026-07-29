import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.tsx'

// Scroll suave (Lenis). `anchors` faz os links #âncora rolarem suave também.
// Respeita prefers-reduced-motion: quem desliga animação fica no scroll nativo.
const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {prefersReduced ? (
      <App />
    ) : (
      <ReactLenis root options={{ anchors: true }}>
        <App />
      </ReactLenis>
    )}
  </StrictMode>,
)
