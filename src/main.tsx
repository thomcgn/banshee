import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import "./pages/calendar-dark.css"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Service Worker für Firebase Messaging registrieren
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registriert:', registration);
    })
    .catch((err) => {
      console.error('Service Worker Registrierung fehlgeschlagen:', err);
    });
}
