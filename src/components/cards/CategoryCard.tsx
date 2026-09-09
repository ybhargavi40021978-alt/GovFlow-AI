import React from 'react';
import { ServiceCategory } from '../../types';
import { getCategoryIcon } from './ServiceCard';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: ServiceCategory;
  count: number;
  isSelected?: boolean;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  count,
  isSelected = false,
  onClick
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
        isSelected
          ? 'bg-blue-50/80 border-gov-blue shadow-sm ring-2 ring-blue-500/20'
          : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-card-hover'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-100/70 transition-all">
          {getCategoryIcon(category)}
        </div>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {count} {count === 1 ? 'service' : 'services'}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-800 group-hover:text-gov-blue transition-colors leading-snug mb-1">
          {category}
        </h4>
        <p className="text-[11px] text-slate-500 line-clamp-1">
          Explore schemes & automated workflows
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-gov-blue opacity-80 group-hover:opacity-100 transition-opacity">
        <span>Browse Category</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
};
