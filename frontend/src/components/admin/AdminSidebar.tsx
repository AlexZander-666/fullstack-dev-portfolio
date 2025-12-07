"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, FolderKanban, Mail, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "仪表盘" },
  { href: "/admin/posts", icon: FileText, label: "文章管理" },
  { href: "/admin/projects", icon: FolderKanban, label: "项目管理" },
  { href: "/admin/messages", icon: Mail, label: "消息管理" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-[#1a1a1a] text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-stone-800">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#d97757] rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-bold text-lg">A</span>
          </div>
          <span className="font-serif text-lg font-semibold">管理后台</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-[#d97757] text-white"
                      : "text-stone-400 hover:bg-stone-800 hover:text-white"
                  }`}
                >
                  <item.icon size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-stone-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
            <p className="text-xs text-stone-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-stone-400 hover:bg-stone-800 hover:text-white rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
