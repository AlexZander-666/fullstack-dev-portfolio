"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // 登录页面不需要认证保护
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // 加载中
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f3ef]">
        <Loader2 size={32} className="animate-spin text-[#d97757]" />
      </div>
    );
  }

  // 登录页面使用简单布局
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 未认证时不渲染内容（等待重定向）
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f3ef]">
        <Loader2 size={32} className="animate-spin text-[#d97757]" />
      </div>
    );
  }

  // 已认证，显示管理后台布局
  return (
    <div className="flex min-h-screen bg-[#f4f3ef]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
