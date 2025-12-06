"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import TypewriterTerminal from "./TypewriterTerminal";

export default function Hero() {
  return (
    <section className="pt-16 pb-20 px-6 md:pt-24 md:pb-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Side - Content */}
        <div className="space-y-8 animate-fadeInUp">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white border border-stone-200 rounded-full px-3 py-1 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#d97757]"></span>
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              全栈开发者
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] text-[#1a1a1a]">
            构建优雅、高效的
            <span className="italic text-stone-500 font-serif"> Web 应用</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-stone-600 max-w-lg leading-relaxed">
            我是一名热爱技术的全栈开发者，专注于使用现代技术栈构建用户友好的应用程序。
            让我们一起将想法变为现实。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/projects"
              className="flex items-center justify-center px-8 py-4 bg-[#1a1a1a] text-white rounded-xl font-medium text-lg hover:bg-stone-800 transition-transform hover:-translate-y-1 shadow-lg shadow-stone-900/10 group"
            >
              查看项目
              <ArrowRight
                size={18}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/blog"
              className="flex items-center justify-center px-8 py-4 bg-white border border-stone-300 text-stone-800 rounded-xl font-medium text-lg hover:bg-stone-50 transition-colors"
            >
              阅读博客
            </Link>
          </div>

          {/* Trust Badge */}
          <p className="text-xs text-stone-500 flex items-center">
            <Shield size={12} className="mr-1" />
            专注于代码质量与用户体验
          </p>
        </div>

        {/* Right Side - Terminal Visual */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#d97757]/20 to-stone-400/20 rounded-[2rem] blur-2xl opacity-50"></div>
          <TypewriterTerminal />
        </div>
      </div>
    </section>
  );
}
