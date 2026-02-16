import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = sessionStorage.getItem('gmr_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (username, password) => {
        if (username === 'admin' && password === '12345') {
            const userData = { username: 'admin', role: 'Administrator', initials: 'AD' };
            setUser(userData);
            sessionStorage.setItem('gmr_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('gmr_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
