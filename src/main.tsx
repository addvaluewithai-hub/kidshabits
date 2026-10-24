import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { WorldErrorBoundary } from './app/WorldErrorBoundary';
import './styles/world.css';

const root=document.getElementById('root');
if(!root) throw new Error('Missing root');
createRoot(root).render(<StrictMode><WorldErrorBoundary><App/></WorldErrorBoundary></StrictMode>);
