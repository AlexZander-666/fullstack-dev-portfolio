import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Cover Image */}
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center text-sm text-stone-500 mb-3">
          <Calendar size={14} className="mr-1" />
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>

        {/* Title */}
        <h2 className="font-serif text-xl font-medium text-stone-900 mb-2 group-hover:text-[#d97757] transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[#f0eee6] text-stone-700 px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-sm text-stone-600 hover:text-[#d97757] transition-colors group/link"
        >
          阅读全文
          <ArrowRight
            size={14}
            className="ml-1 group-hover/link:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </article>
  );
}
