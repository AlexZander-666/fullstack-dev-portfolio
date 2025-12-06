import type { Metadata } from "next";
import PostCard from "@/components/blog/PostCard";
import type { Post } from "@/types";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "博客",
  description: "阅读我的技术博客文章，分享开发经验和技术见解",
};

// 模拟文章数据
const mockPosts: Post[] = [
  {
    _id: "1",
    title: "使用 Next.js 14 构建现代 Web 应用",
    slug: "nextjs-14-modern-web-app",
    content: "...",
    excerpt: "Next.js 14 带来了许多令人兴奋的新特性，包括 App Router、Server Components 等。本文将介绍如何利用这些特性构建高性能的 Web 应用。",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    tags: ["Next.js", "React", "Web开发"],
    published: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    _id: "2",
    title: "TypeScript 高级类型技巧",
    slug: "typescript-advanced-types",
    content: "...",
    excerpt: "深入探讨 TypeScript 的高级类型系统，包括条件类型、映射类型、模板字面量类型等，帮助你写出更安全、更优雅的代码。",
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop",
    tags: ["TypeScript", "JavaScript"],
    published: true,
    createdAt: "2024-11-15T00:00:00Z",
    updatedAt: "2024-11-15T00:00:00Z",
  },
  {
    _id: "3",
    title: "MongoDB 性能优化实践",
    slug: "mongodb-performance-optimization",
    content: "...",
    excerpt: "分享在实际项目中积累的 MongoDB 性能优化经验，包括索引策略、查询优化、聚合管道优化等实用技巧。",
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop",
    tags: ["MongoDB", "数据库", "性能优化"],
    published: true,
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    _id: "4",
    title: "React 状态管理方案对比",
    slug: "react-state-management-comparison",
    content: "...",
    excerpt: "对比分析 React 生态中主流的状态管理方案：Context API、Redux、Zustand、Jotai 等，帮助你选择最适合项目的方案。",
    tags: ["React", "状态管理"],
    published: true,
    createdAt: "2024-10-20T00:00:00Z",
    updatedAt: "2024-10-20T00:00:00Z",
  },
];

export default function BlogPage() {
  const posts = mockPosts;

  // 提取所有标签
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] mb-6">
            技术博客
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed">
            分享我在开发过程中的经验、思考和学习笔记。希望这些内容对你有所帮助。
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="搜索文章..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#d97757]/20 focus:border-[#d97757]"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium">
              全部
            </button>
            {allTags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 bg-white border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:border-[#d97757] hover:text-[#d97757] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-stone-500 text-lg">暂无文章，敬请期待...</p>
          </div>
        )}
      </div>
    </div>
  );
}
