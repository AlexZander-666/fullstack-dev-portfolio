"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Star, ExternalLink } from "lucide-react";
import type { Project } from "@/types";

// 模拟数据
const mockProjects: Project[] = [
  {
    _id: "1",
    name: "个人博客系统",
    description: "基于 Next.js 和 MongoDB 构建的全栈博客系统",
    techStack: ["Next.js", "TypeScript", "MongoDB"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    order: 1,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    _id: "2",
    name: "任务管理应用",
    description: "一个简洁高效的任务管理工具",
    techStack: ["React", "Node.js", "PostgreSQL"],
    liveUrl: "https://example.com",
    featured: true,
    order: 2,
    createdAt: "2024-11-15T00:00:00Z",
    updatedAt: "2024-11-15T00:00:00Z",
  },
  {
    _id: "3",
    name: "实时聊天应用",
    description: "基于 WebSocket 的实时聊天应用",
    techStack: ["Vue.js", "Socket.io"],
    githubUrl: "https://github.com",
    featured: false,
    order: 3,
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
];

export default function AdminProjectsPage() {
  const [projects] = useState<Project[]>(mockProjects);

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个项目吗？")) {
      console.log("Delete project:", id);
      // TODO: 调用 API 删除
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-stone-900 mb-2">项目管理</h1>
          <p className="text-stone-600">管理您的项目作品集</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl hover:bg-stone-800 transition-colors"
        >
          <Plus size={20} />
          <span>添加项目</span>
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
          >
            {/* Image Placeholder */}
            {project.imageUrl ? (
              <div className="relative w-full h-40">
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 300px, 100vw"
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-stone-100 flex items-center justify-center">
                <span className="text-stone-400">无图片</span>
              </div>
            )}

            <div className="p-4">
              {/* Title & Featured */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-stone-900">{project.name}</h3>
                {project.featured && (
                  <Star size={16} className="text-[#d97757] fill-current" />
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-stone-500 mb-3 line-clamp-2">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-[#f0eee6] text-stone-700 px-2 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-stone-500 hover:text-[#d97757] hover:bg-stone-100 rounded-lg transition-colors"
                      title="查看演示"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                <div className="flex gap-1">
                  <Link
                    href={`/admin/projects/${project._id}/edit`}
                    className="p-2 text-stone-500 hover:text-[#d97757] hover:bg-stone-100 rounded-lg transition-colors"
                    title="编辑"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-500">暂无项目</p>
        </div>
      )}
    </div>
  );
}
