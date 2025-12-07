"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose prose-stone prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 自定义标题样式
          h1: ({ children }) => (
            <h1 className="font-serif text-3xl font-medium text-stone-900 mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-2xl font-medium text-stone-900 mt-8 mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-xl font-medium text-stone-900 mt-6 mb-3">
              {children}
            </h3>
          ),
          // 段落
          p: ({ children }) => (
            <p className="text-stone-700 leading-relaxed mb-4">{children}</p>
          ),
          // 链接
          a: ({ href, children }) => {
            let safeHref = href || "#";
            try {
              const url = new URL(safeHref, window.location.origin);
              if (!["http:", "https:"].includes(url.protocol)) {
                safeHref = "#";
              } else {
                safeHref = url.toString();
              }
            } catch {
              safeHref = "#";
            }

            const isExternal = safeHref.startsWith("http");

            return (
              <a
                href={safeHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-[#d97757] hover:underline"
              >
                {children}
              </a>
            );
          },
          // 代码块
          pre: ({ children }) => (
            <pre className="bg-[#1e1e1e] rounded-xl p-4 overflow-x-auto my-6">
              {children}
            </pre>
          ),
          // 行内代码
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-[#f0eee6] text-[#d97757] px-1.5 py-0.5 rounded text-sm">
                  {children}
                </code>
              );
            }
            return <code className={className}>{children}</code>;
          },
          // 引用
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#d97757] pl-4 italic text-stone-600 my-6">
              {children}
            </blockquote>
          ),
          // 列表
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-stone-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-stone-700">
              {children}
            </ol>
          ),
          // 图片
          img: ({ src, alt }) =>
            src ? (
              <span className="block relative w-full h-64 md:h-80 my-6">
                <Image
                  src={src}
                  alt={alt || ""}
                  fill
                  className="object-contain rounded-xl"
                  sizes="(min-width: 1024px) 768px, 100vw"
                />
              </span>
            ) : null,
          // 分割线
          hr: () => <hr className="border-stone-200 my-8" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
