"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";

export interface AuthUser {
  username: string;
  name: string;
  email: string;
  role: string;
  loginAt: string;
}

const STORAGE_KEY = "homeowner365_auth_user";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Check cookie fallback
        const match = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`));
        if (match) {
          const val = decodeURIComponent(match.split("=")[1]);
          const parsed = JSON.parse(val);
          setUser(parsed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.error("Auth init error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to authenticate");
        }

        setUser(data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.name || "Pentacloud"}!`);
        return true;
      } catch (err: any) {
        toast.error(err.message || "Invalid credentials");
        return false;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.warn("Logout API warning:", e);
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0;`;
      toast.info("You have signed out.");
      router.push("/");
      router.refresh();
    }
  }, [router]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}
