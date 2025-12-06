"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import type { Post } from "@/types";

// 模拟数据
const mockPosts: Post[] = [
  {
    _id: "1",
    title: "使用 Next.js 14 构建现代 Web 应用",
    slug: "nextjs-14-modern-web-app",
    content: "...",
    excerpt: "Next.js 14 带来了许多令人兴奋的新特性...",
    tags: ["Next.js", "React"],
    published: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    _id: "2",
    title: "TypeScript 高级类型技巧",
    slug: "typescript-advanced-types",
    content: "...",
    excerpt: "深入探讨 TypeScript 的高级类型系统...",
    tags: ["TypeScript"],
    published: true,
    createdAt: "2024-11-15T00:00:00Z",
    updatedAt: "2024-11-15T00:00:00Z",
  },
  {
    _id: "3",
    title: "草稿文章示例",
    slug: "draft-post",
    content: "...",
    excerpt: "这是一篇草稿文章...",
    tags: [],
    published: false,
    createdAt: "2024-11-10T00:00:00Z",
    updatedAt: "2024-11-10T00:00:00Z",
  },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("zh-CN");
}

export default function AdminPostsPage() {
  const [posts] = useState<Post[]>(mockPosts);

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这篇文章吗？")) {
      console.log("Delete post:", id);
      // TODO: 调用 API 删除
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-stone-900 mb-2">文章管理</h1>
          <p className="text-stone-600">管理您的博客文章</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl hover:bg-stone-800 transition-colors"
        >
          <Plus size={20} />
          <span>写新文章</span>
        </Link>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-600">标题</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-600">状态</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-600">标签</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-600">创建时间</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-stone-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-stone-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-stone-900">{post.title}</p>
                  <p className="text-sm text-stone-500 truncate max-w-md">{post.excerpt}</p>
                </td>
                <td className="px-6 py-4">
                  {post.published ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      <Eye size={12} />
                      已发布
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">
                      <EyeOff size={12} />
                      草稿
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-[#f0eee6] text-stone-700 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-stone-500">
                  {formatDate(post.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/posts/${post._id}/edit`}
                      className="p-2 text-stone-500 hover:text-[#d97757] hover:bg-stone-100 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
