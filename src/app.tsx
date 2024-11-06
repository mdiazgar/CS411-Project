import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import HomePage from './components/Home'; // Import Home Component
import Login from './components/Login'; // Import Login Component
import Register from './components/Register'; // Import Register Component
import { Link } from 'react-router-dom';
import List from "./components/List";


function MainContent() {
    const location = useLocation();
    const showButtons = location.pathname === '/home' || location.pathname === '/list';

    return (
        <div>
            {/* Conditionally render buttons based on the route */}

            {showButtons && (
                <div className="button-container">
                    <Link to="/home">
                        <button>Maps</button>
                    </Link>
                    <Link to="/list">
                        <button>Saved Pins</button>
                    </Link>
                </div>
            )}

            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/list" element={<List />} />
                <Route path="*" element={<Login />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <MainContent />
        </BrowserRouter>
    );
}

export default App;
