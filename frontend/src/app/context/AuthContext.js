"use client"

import { createContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            setUser(response.data.user);
            router.push('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}