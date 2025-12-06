import { Terminal, Cpu, Zap, Code2, Command, Shield } from "lucide-react";
import Hero from "@/components/home/Hero";
import FeatureCard from "@/components/home/FeatureCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const skills = [
  {
    icon: Terminal,
    title: "前端开发",
    description: "精通 React、Next.js、TypeScript，构建响应式、高性能的用户界面。",
  },
  {
    icon: Cpu,
    title: "后端开发",
    description: "熟练使用 Node.js、Express、MongoDB，设计可扩展的 API 服务。",
  },
  {
    icon: Zap,
    title: "性能优化",
    description: "专注于 Web 性能优化，确保应用快速加载和流畅运行。",
  },
  {
    icon: Code2,
    title: "代码质量",
    description: "遵循最佳实践，编写可维护、可测试的高质量代码。",
  },
  {
    icon: Command,
    title: "DevOps",
    description: "熟悉 CI/CD 流程，Docker 容器化和云服务部署。",
  },
  {
    icon: Shield,
    title: "安全意识",
    description: "注重应用安全，实施身份验证、数据加密等安全措施。",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Skills Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] mb-6">
              技术栈与专业技能
            </h2>
            <p className="text-xl text-stone-600">
              多年的开发经验让我掌握了全栈开发的各个环节，从前端界面到后端服务，从数据库设计到部署运维。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <FeatureCard
                key={skill.title}
                icon={skill.icon}
                title={skill.title}
                description={skill.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-serif text-4xl md:text-5xl">准备好开始合作了吗？</h2>
          <p className="text-xl text-stone-400">
            无论是新项目开发还是技术咨询，我都很乐意与您交流。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="px-10 py-4 bg-[#d97757] text-white rounded-xl font-medium text-lg hover:bg-[#c06040] transition-colors shadow-lg inline-flex items-center justify-center group"
            >
              联系我
              <ArrowRight
                size={18}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/projects"
              className="px-10 py-4 bg-transparent border border-stone-600 text-white rounded-xl font-medium text-lg hover:bg-stone-800 transition-colors inline-flex items-center justify-center"
            >
              查看项目
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
