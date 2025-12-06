import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex flex-col bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full">
      {/* Project Image */}
      {project.imageUrl && (
        <div className="relative h-48 overflow-hidden bg-stone-100">
          <img
            src={project.imageUrl}
            alt={`${project.name} 项目截图`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {project.featured && (
            <span className="absolute top-3 right-3 bg-[#d97757] text-white text-xs font-semibold px-2 py-1 rounded-full">
              <span className="sr-only">此项目为</span>精选
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
          {project.name}
        </h3>
        <p className="text-stone-600 text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tech Stack */}
        <ul className="flex flex-wrap gap-2 mb-4 list-none p-0" aria-label="技术栈">
          {project.techStack.map((tech) => (
            <li
              key={tech}
              className="text-xs bg-[#f0eee6] text-stone-700 px-2 py-1 rounded-md"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Links */}
        <nav className="flex gap-3 pt-4 border-t border-stone-100" aria-label="项目链接">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`查看 ${project.name} 在线演示（在新窗口打开）`}
              className="flex items-center text-sm text-stone-600 hover:text-[#d97757] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97757] focus-visible:ring-offset-2 rounded transition-colors"
            >
              <ExternalLink size={16} className="mr-1" aria-hidden="true" />
              在线演示
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`查看 ${project.name} 源代码（在新窗口打开）`}
              className="flex items-center text-sm text-stone-600 hover:text-[#d97757] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97757] focus-visible:ring-offset-2 rounded transition-colors"
            >
              <Github size={16} className="mr-1" aria-hidden="true" />
              源代码
            </a>
          )}
        </nav>
      </div>
    </article>
  );
}
