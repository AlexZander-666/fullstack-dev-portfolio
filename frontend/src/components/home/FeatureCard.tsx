import { memo } from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="w-12 h-12 rounded-xl bg-[#f0eee6] flex items-center justify-center text-[#d97757] mb-4">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-600 leading-relaxed text-sm md:text-base">{description}</p>
    </div>
  );
}

export default memo(FeatureCard);
