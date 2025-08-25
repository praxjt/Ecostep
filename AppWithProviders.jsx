// AppInner.jsx
import React from 'react';
import App from './App';
import { ConnectionProvider } from './contexts/ConnectionContext';

export default function AppInner() {
  return (
    <ConnectionProvider>
      <App />
    </ConnectionProvider>
  );
}
