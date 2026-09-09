import React from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { Link } from 'react-router-dom';
import { ServiceCard } from '../../components/cards/ServiceCard';
import { Building2, Plus, ArrowRight } from 'lucide-react';

export const DepartmentServices: React.FC = () => {
  const { services } = useGovFlow();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Registered Department Schemes & Services
          </h2>
          <p className="text-xs text-slate-500">
            Active service configurations currently exposed to citizens with automated eligibility verification.
          </p>
        </div>
        <Link
          to="/admin/services"
          className="px-4 py-2 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Configure New Service in Registry</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};
