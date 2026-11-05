import React from 'react';
import { createRoot } from 'react-dom/client';
import DemoOne from './demo';
import './index.css';

createRoot(document.getElementById('root')!).render(<React.StrictMode><DemoOne /></React.StrictMode>);
