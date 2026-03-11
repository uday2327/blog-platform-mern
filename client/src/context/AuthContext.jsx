/* eslint-disable react-refresh/only-export-components */
import toast from 'react-hot-toast';
import { createContext, useState, useEffect, useContext } from 'react';
import API, { loginUser, registerUser, getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                localStorage.setItem('token', token);
                // The API interceptor handles the header
                try {
                    const res = await getMe();
                    if (res.data.success) {
                        setUser(res.data.data);
                    }
                } catch (err) {
                    toast.error(err.message || 'Failed to load user:');
                    setToken(null);
                    setUser(null);
                    localStorage.removeItem('token');
                }
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await loginUser(email, password);
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const res = await registerUser(userData);
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Registration failed' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const refetchUser = async () => {
        try {
            const res = await getMe();
            if (res.data.success) {
                setUser(res.data.data);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to refetch user:');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, refetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
