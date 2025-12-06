"use client";

import { FileText, FolderKanban, Mail, Eye } from "lucide-react";

const stats = [
  { label: "文章数量", value: "12", icon: FileText, color: "bg-blue-500" },
  { label: "项目数量", value: "8", icon: FolderKanban, color: "bg-green-500" },
  { label: "未读消息", value: "3", icon: Mail, color: "bg-orange-500" },
  { label: "本月访问", value: "1.2k", icon: Eye, color: "bg-purple-500" },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900 mb-2">仪表盘</h1>
        <p className="text-stone-600">欢迎回来！这是您网站的概览。</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">{stat.value}</p>
            <p className="text-sm text-stone-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <h2 className="font-serif text-xl text-stone-900 mb-4">快捷操作</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <a
            href="/admin/posts/new"
            className="flex items-center gap-3 p-4 bg-[#f0eee6] rounded-xl hover:bg-[#e8e6de] transition-colors"
          >
            <FileText size={20} className="text-[#d97757]" />
            <span className="text-stone-900 font-medium">写新文章</span>
          </a>
          <a
            href="/admin/projects/new"
            className="flex items-center gap-3 p-4 bg-[#f0eee6] rounded-xl hover:bg-[#e8e6de] transition-colors"
          >
            <FolderKanban size={20} className="text-[#d97757]" />
            <span className="text-stone-900 font-medium">添加项目</span>
          </a>
          <a
            href="/admin/messages"
            className="flex items-center gap-3 p-4 bg-[#f0eee6] rounded-xl hover:bg-[#e8e6de] transition-colors"
          >
            <Mail size={20} className="text-[#d97757]" />
            <span className="text-stone-900 font-medium">查看消息</span>
          </a>
        </div>
      </div>
    </div>
  );
}
