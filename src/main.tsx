import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/globals.css';
import './styles/buttons.css';
import './styles/cards.css';
import './styles/inputs.css';
import './styles/page.css';
import './styles/dialog-drawer.css';
import './styles/edit-page.css';
import './styles/main-page.css';
import './styles/settings-modal.css';
import './styles/start-from-word-drawer.css';
import './styles/study-page.css';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={`/review-app-vite`}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
