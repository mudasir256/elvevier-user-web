"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface Admin {
  email: string;
  name: string;
}

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AdminAuthContext = createContext<AuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (!saved) {
      setIsLoading(false);
      return;
    }
    fetch("/api/admin/me", {
      headers: { Authorization: `Bearer ${saved}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setAdmin({ email: data.email, name: data.name });
        setToken(saved);
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error || "Login failed";
      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
      setAdmin(data.admin);
      return null;
    } catch {
      return "Network error. Is the server running?";
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, token, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
