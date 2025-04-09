import { useState, useEffect } from "react";
import axios from "axios";

export const useAuth = () => {
  const [auth, setAuth] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
            setUser(response.data.user); // Giả sử API trả về thông tin người dùng
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuth(false);
        setUser(null);
      } finally {
        setLoading(false);
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
        setUser(response.data.user); // Giả sử API trả về thông tin người dùng
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/sign-out", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.removeItem("token");
      setAuth(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return { auth, user, loading, login, logout };
};