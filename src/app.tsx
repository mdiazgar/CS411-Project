import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './components/Home'; // Import Home Component
import Login from './components/Login'; // Import Login Component
import Register from './components/Register'; // Import Register Component


function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Register />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
