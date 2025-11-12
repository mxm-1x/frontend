import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string | null;
    loading: boolean;
    login: (token: string, role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = authService.getToken();
        const role = authService.getUserRole();
        console.log('AuthContext: Checking stored auth -', { hasToken: !!token, role });
        if (token && role) {
            setIsAuthenticated(true);
            setUserRole(role);
            console.log('AuthContext: User authenticated from storage');
        } else {
            console.log('AuthContext: No stored authentication found');
        }
        setLoading(false);
    }, []);

    const login = (token: string, role: string) => {
        console.log('AuthContext: Logging in user with role:', role);
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        setIsAuthenticated(true);
        setUserRole(role);
    };

    const logout = () => {
        console.log('AuthContext: Logging out user');
        authService.logout();
        setIsAuthenticated(false);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
