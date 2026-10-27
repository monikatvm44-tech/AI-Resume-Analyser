import { createContext, useContext, useState, useEffect } from 'react';
import { getSession, setSession, clearSession } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = getSession();
        if (session) setUser(session);
        setLoading(false);
    }, []);

    const login = (userData) => {
        setSession(userData);
        setUser(userData);
    };

    const logout = () => {
        clearSession();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
