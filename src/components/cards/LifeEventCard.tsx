import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LifeEventCardProps {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  description: string;
  recommendedServices: string[];
  isActive?: boolean;
  onSelect?: () => void;
}

export const LifeEventCard: React.FC<LifeEventCardProps> = ({
  emoji,
  title,
  tagline,
  description,
  recommendedServices,
  isActive = false,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between group ${
        isActive
          ? 'bg-gradient-to-b from-blue-50/70 to-white border-gov-blue shadow-card-hover ring-2 ring-blue-500/20'
          : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-card'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            {emoji}
          </div>
          <span className="text-[10px] font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            {recommendedServices.length} Linked Services
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-gov-blue transition-colors mb-1">
          {title}
        </h3>
        <p className="text-xs font-semibold text-slate-500 mb-2">
          {tagline}
        </p>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-gov-blue group-hover:text-blue-700 flex items-center gap-1">
          <span>View Orchestrated Journey</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
        {isActive && (
          <CheckCircle2 className="w-4 h-4 text-gov-blue" />
        )}
      </div>
    </div>
  );
};
