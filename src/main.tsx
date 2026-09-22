import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles.css';
import './character-fit.css';
import './milestone1.css';
import './milestone2.css';
import './platform.css';
import './parent-center.css';
import './visual-foundation.css';
import './onboarding-polish.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
