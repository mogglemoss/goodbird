import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from './lib/sw'
import { useGame } from './game/store'

// Apply theme attribute before React paints — prevents a flash of light mode
// when a user has chosen dark in a previous session.
function applyTheme(t: 'auto' | 'light' | 'dark') {
  document.documentElement.dataset.theme = t;
}
applyTheme(useGame.getState().theme);
useGame.subscribe((s) => applyTheme(s.theme));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

registerSW()
