import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextProps {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface User {
    id: string;
    name: string;
    email: string;
    // Add other user properties as needed
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/auth'); // Adjust the endpoint as needed
                setUser(response.data);
                setIsAuthenticated(true);
            } catch {
                setUser(null);
                setIsAuthenticated(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('/api/auth/sign-in', { email, password }); // Adjust the endpoint as needed
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch {
            throw new Error('Login failed');
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout'); // Adjust the endpoint as needed
            setUser(null);
            setIsAuthenticated(false);
        } catch {
            throw new Error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

