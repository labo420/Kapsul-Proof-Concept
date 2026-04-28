import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  link: string;
  avatarUrl: string | null;
  isPublic: boolean;
  highlights: string[];
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, displayName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (fields: Partial<Pick<AuthUser, "displayName" | "bio" | "link" | "avatarUrl" | "isPublic" | "highlights">>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const TOKEN_KEY = "kapsul_auth_token";

async function storeToken(token: string) {
  if (Platform.OS === "web") {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

async function loadToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return AsyncStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

async function removeToken() {
  if (Platform.OS === "web") {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await loadToken();
        if (stored) {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${stored}` },
          });
          if (res.ok) {
            const data = await res.json() as AuthUser;
            setToken(stored);
            setUser(data);
          } else {
            await removeToken();
          }
        }
      } catch {}
      setIsLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json() as { token: string; user: AuthUser; error?: string; message?: string };
    if (!res.ok) throw new Error(data.message ?? data.error ?? "Login fallito");
    await storeToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (email: string, username: string, displayName: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, displayName, password }),
    });
    const data = await res.json() as { token: string; user: AuthUser; error?: string; message?: string };
    if (!res.ok) throw new Error(data.message ?? data.error ?? "Registrazione fallita");
    await storeToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await removeToken();
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (fields: Partial<Pick<AuthUser, "displayName" | "bio" | "link" | "avatarUrl" | "isPublic" | "highlights">>) => {
    const stored = token;
    if (!stored) throw new Error("Not authenticated");
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${stored}` },
      body: JSON.stringify(fields),
    });
    const data = await res.json() as AuthUser;
    if (!res.ok) throw new Error("Aggiornamento profilo fallito");
    setUser(data);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json() as AuthUser;
        setUser(data);
      }
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
