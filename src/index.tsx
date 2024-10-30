// index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

// Get the root element from the DOM
const rootElement = document.getElementById('app');

// Check if the root element exists
if (rootElement) {
  // Create a React root using the root element
  const root = ReactDOM.createRoot(rootElement);

  // Render the App component inside the root element
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
