import type { Metadata } from "next";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/types";

export const metadata: Metadata = {
  title: "项目",
  description: "查看我的项目作品集，包括 Web 应用、开源项目等",
};

// 模拟项目数据（后续可替换为 API 调用）
const mockProjects: Project[] = [
  {
    _id: "1",
    name: "个人博客系统",
    description: "基于 Next.js 和 MongoDB 构建的全栈博客系统，支持 Markdown 编辑、标签分类、搜索功能。",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "任务管理应用",
    description: "一个简洁高效的任务管理工具，支持拖拽排序、标签分类、截止日期提醒等功能。",
    techStack: ["React", "Node.js", "PostgreSQL", "Redis"],
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "实时聊天应用",
    description: "基于 WebSocket 的实时聊天应用，支持群聊、私聊、消息已读状态等功能。",
    techStack: ["Vue.js", "Socket.io", "Express", "MongoDB"],
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop",
    githubUrl: "https://github.com",
    featured: false,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "电商后台管理系统",
    description: "功能完善的电商后台，包含商品管理、订单处理、数据统计、权限控制等模块。",
    techStack: ["React", "Ant Design", "Node.js", "MySQL"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    liveUrl: "https://example.com",
    featured: false,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ProjectsPage() {
  const projects = mockProjects;
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="max-w-3xl mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] mb-6">
            项目作品集
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed">
            这里展示了我参与开发的一些项目，涵盖 Web 应用、移动端、开源工具等多个领域。
            每个项目都体现了我对代码质量和用户体验的追求。
          </p>
        </header>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-16" aria-labelledby="featured-projects-heading">
            <h2 id="featured-projects-heading" className="font-serif text-2xl text-stone-900 mb-8">精选项目</h2>
            <ul className="grid md:grid-cols-2 gap-8 list-none p-0">
              {featuredProjects.map((project) => (
                <li key={project._id}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <section aria-labelledby="other-projects-heading">
            <h2 id="other-projects-heading" className="font-serif text-2xl text-stone-900 mb-8">更多项目</h2>
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
              {otherProjects.map((project) => (
                <li key={project._id}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-20" role="status">
            <p className="text-stone-500 text-lg">暂无项目，敬请期待...</p>
          </div>
        )}
      </div>
    </main>
  );
}
