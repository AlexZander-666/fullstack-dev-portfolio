"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    return {
      user: null,
      token: storedToken,
      isLoading: Boolean(storedToken),
      isAuthenticated: false,
    };
  });

  // 获取当前用户信息
  const fetchCurrentUser = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setState({
          user: data.data,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        // Token 无效，清除
        localStorage.removeItem("token");
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch {
      localStorage.removeItem("token");
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  // 初始化时从 localStorage 读取 token
  useEffect(() => {
    if (!state.token) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- effect is responsible for bootstrapping auth once on mount
    fetchCurrentUser(state.token);
  }, [state.token, fetchCurrentUser]);

  // 登录
  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "登录失败");
    }

    localStorage.setItem("token", data.data.token);
    setState({
      user: data.data.user,
      token: data.data.token,
      isLoading: false,
      isAuthenticated: true,
    });

    return data.data;
  }, []);

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setState({
      user: null,
      token: null,
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
