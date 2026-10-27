import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleCTA = () => {
        if (user) navigate('/dashboard');
        else navigate('/auth');
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner container">
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-icon">
                        <Brain size={20} />
                    </div>
                    <span>Resume<span className="gradient-text">AI</span></span>
                </Link>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
                    <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
                    {user ? (
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    ) : (
                        <Link to="/auth" onClick={() => setMenuOpen(false)}>Login</Link>
                    )}
                    <button className="btn btn-primary btn-sm" onClick={() => { handleCTA(); setMenuOpen(false); }}>
                        Get Started
                    </button>
                </div>

                <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
