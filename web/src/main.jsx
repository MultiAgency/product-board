import React from 'react';
import { createRoot } from 'react-dom/client';
import { setGlobalTheme } from '@atlaskit/tokens/set-global-theme';
import App from './App.jsx';
import './styles.css';

// Atlassian design tokens, following the viewer's light/dark preference.
setGlobalTheme({ colorMode: 'auto', light: 'light', dark: 'dark' });

createRoot(document.getElementById('root')).render(<App />);
