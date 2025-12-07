"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { API_BASE_URL } from "@/lib/api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // 获取当前用户信息
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setState({
          user: data.data,
          isLoading: false,
          isAuthenticated: true,
        });
        return;
      }
    } catch {
      // ignore and fall through
    }

    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  // 初始化时检查会话
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- effect is responsible for bootstrapping auth once on mount
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        await fetchCurrentUser();
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (!state.isAuthenticated) {
      return;
    }

    const interval = setInterval(refreshSession, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [state.isAuthenticated, refreshSession]);

  // 登录
  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "登录失败");
    }

    setState({
      user: data.data.user,
      isLoading: false,
      isAuthenticated: true,
    });

    return data.data;
  }, []);

  // 登出
  const logout = useCallback(() => {
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {
      // Ignore logout failures on client
    });

    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.push("/admin/login");
  }, [router]);

  return {
    ...state,
    login,
    logout,
  };
}
