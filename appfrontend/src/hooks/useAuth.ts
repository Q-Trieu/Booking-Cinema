import { useState, useEffect } from "react";
import axios from "axios";

export const useAuth = () => {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await axios.get("/api/auth/verify-token", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data.success) {
                        setAuth(true);
                    }
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                setAuth(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post("/api/auth/sign-in", { email, password });
            if (response.data.success) {
                localStorage.setItem("token", response.data.access_token);
                setAuth(true);
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
    };

    return { auth, setAuth, login, logout };
};