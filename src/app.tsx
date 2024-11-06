import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './components/Home'; // Import Home Component
import Login from './components/Login'; // Import Login Component
import Register from './components/Register'; // Import Register Component
import List from './components/List'; // Import List Component
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function MainContent() {
    const location = useLocation();
    const showButtons = location.pathname === '/home' || location.pathname === '/List';

    return (
        <div>
            {/* Conditionally render buttons based on the route */}
            {showButtons && (
                <div className="button-container">
                    <Link to="/home"><button>Home</button></Link>
                    <Link to="/List"><button>Saved pin</button></Link>
    </div>
)}

            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Register />} />
                <Route path="/list" element={<List />} />
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