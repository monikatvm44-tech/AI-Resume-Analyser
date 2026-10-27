import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Brain, LayoutDashboard, FileSearch, Lightbulb, User, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileSearch, label: 'Resume Analyzer', path: '/analyze' },
    { icon: Lightbulb, label: 'Resume Improvement', path: '/improve' },
    { icon: User, label: 'Profile & History', path: '/profile' },
];

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const SidebarContent = () => (
        <div className="sidebar-content">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon"><Brain size={18} /></div>
                    {!collapsed && <span>Resume<span className="gradient-text">AI</span></span>}
                </div>
                <button className="sidebar-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`sidebar-nav-item ${location.pathname === path ? 'active' : ''}`}
                        onClick={() => setMobileOpen(false)}
                    >
                        <Icon size={20} />
                        {!collapsed && <span>{label}</span>}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">{initials}</div>
                    {!collapsed && (
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{user?.name || 'User'}</span>
                            <span className="sidebar-user-email">{user?.email || ''}</span>
                        </div>
                    )}
                </div>
                <button className="sidebar-logout" onClick={handleLogout} title="Logout">
                    <LogOut size={18} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile hamburger */}
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
                <Menu size={22} />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}>
                    <div className="sidebar-mobile" onClick={e => e.stopPropagation()}>
                        <button className="sidebar-mobile-close" onClick={() => setMobileOpen(false)}>
                            <X size={20} />
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <SidebarContent />
            </aside>
        </>
    );
};

export default Sidebar;
