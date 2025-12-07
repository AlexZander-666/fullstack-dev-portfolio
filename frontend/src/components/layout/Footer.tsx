import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { siteConfig } from "@/config/site";

const footerLinks = {
  navigation: [
    { href: "/", label: "首页" },
    { href: "/projects", label: "项目" },
    { href: "/blog", label: "博客" },
    { href: "/contact", label: "联系" },
  ],
  social: [
    { href: siteConfig.github, icon: Github, label: "GitHub" },
    { href: siteConfig.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
    { href: `mailto:${siteConfig.email}`, icon: Mail, label: "Email" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-stone-200 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-stone-900 rounded-md flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xs">A</span>
              </div>
              <span className="font-serif text-lg font-semibold text-stone-900">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-stone-500 text-sm max-w-md mb-4">
              全栈开发者，热爱技术与创新。专注于构建优雅、高效的 Web 应用。
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-[#d97757] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-stone-900 mb-4">导航</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#d97757] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-stone-900 mb-4">联系方式</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-[#d97757] transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#d97757] transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-stone-200 text-center text-sm text-stone-500">
          <p>© {currentYear} Alex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
