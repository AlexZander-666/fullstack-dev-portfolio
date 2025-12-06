import type { Metadata } from "next";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "联系我",
  description: "有任何问题或合作意向？欢迎与我联系",
};

const contactInfo = [
  {
    icon: Mail,
    label: "邮箱",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/alex",
    href: "https://github.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/alex",
    href: "https://linkedin.com",
  },
  {
    icon: MapPin,
    label: "位置",
    value: "中国",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] mb-6">
            联系我
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed">
            有任何问题、合作意向或只是想打个招呼？欢迎通过以下方式与我联系，我会尽快回复您。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">发送消息</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">联系方式</h2>
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f0eee6] flex items-center justify-center text-[#d97757] flex-shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 mb-1">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-stone-900 hover:text-[#d97757] transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-stone-900">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-12 p-6 bg-[#f0eee6] rounded-2xl">
              <h3 className="font-serif text-lg text-stone-900 mb-3">工作时间</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                我通常会在 1-2 个工作日内回复邮件。如果是紧急事项，请在邮件标题中注明。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
