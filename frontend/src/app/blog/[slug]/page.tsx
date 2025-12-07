import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import MarkdownContent from "@/components/blog/MarkdownContent";
import type { Post } from "@/types";

// 模拟文章数据
const mockPosts: Record<string, Post> = {
  "nextjs-14-modern-web-app": {
    _id: "1",
    title: "使用 Next.js 14 构建现代 Web 应用",
    slug: "nextjs-14-modern-web-app",
    content: `
## 前言

Next.js 14 是 Vercel 团队发布的最新版本，带来了许多令人兴奋的新特性。本文将深入介绍如何利用这些特性构建高性能的 Web 应用。

## App Router 的优势

App Router 是 Next.js 13 引入的新路由系统，在 14 版本中得到了进一步完善：

- **Server Components**: 默认使用服务端组件，减少客户端 JavaScript
- **Streaming**: 支持流式渲染，提升首屏加载速度
- **Layouts**: 嵌套布局系统，代码复用更简单

### 代码示例

\`\`\`typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
\`\`\`

## Server Actions

Server Actions 让你可以直接在组件中定义服务端函数：

\`\`\`typescript
async function submitForm(formData: FormData) {
  "use server";
  // 这段代码在服务端执行
  const name = formData.get("name");
  await saveToDatabase(name);
}
\`\`\`

## 性能优化

Next.js 14 内置了多项性能优化：

1. **自动代码分割**: 每个页面只加载必要的代码
2. **图片优化**: 使用 \`next/image\` 自动优化图片
3. **字体优化**: 使用 \`next/font\` 优化字体加载

> 提示：使用 Lighthouse 测试你的应用性能，目标是达到 90+ 分。

## 总结

Next.js 14 是构建现代 Web 应用的绝佳选择。它提供了出色的开发体验和生产性能，值得每个 React 开发者学习和使用。
    `,
    excerpt: "Next.js 14 带来了许多令人兴奋的新特性，包括 App Router、Server Components 等。",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
    tags: ["Next.js", "React", "Web开发"],
    published: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = mockPosts[slug];
  
  if (!post) {
    return { title: "文章未找到" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.createdAt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.length / 2; // 中文字符估算
  return Math.ceil(words / wordsPerMinute);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = mockPosts[slug];

  if (!post) {
    return (
      <div className="min-h-screen py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl text-stone-900 mb-4">文章未找到</h1>
          <p className="text-stone-600 mb-8">抱歉，您访问的文章不存在或已被删除。</p>
          <Link
            href="/blog"
            className="inline-flex items-center text-[#d97757] hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" />
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }

  const readTime = estimateReadTime(post.content);

  return (
    <div className="min-h-screen py-16 px-6">
      <article className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-stone-600 hover:text-[#d97757] transition-colors mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          返回博客列表
        </Link>

        {/* Header */}
        <header className="mb-8">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[#f0eee6] text-stone-700 px-2 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-stone-900 mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              约 {readTime} 分钟阅读
            </span>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-64 md:h-96 mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover rounded-2xl"
              sizes="(min-width: 1024px) 768px, 100vw"
              priority
            />
          </div>
        )}

        {/* Content */}
        <MarkdownContent content={post.content} />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-stone-200">
          <div className="flex justify-between items-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-stone-600 hover:text-[#d97757] transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              返回博客列表
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
