import React, { useState } from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  ArrowRight, 
  CheckCheck,
  RotateCcw
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useGovFlow();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false;
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <Info className="w-5 h-5 text-gov-blue" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
            <span>Notification Center</span>
            <span>•</span>
            <span>Real-Time Updates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
            Notifications & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay informed on application stage transitions, document expiry reminders, and new eligible benefits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={markAllAsRead}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4 text-gov-blue" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-colors ${
            filter === 'all'
              ? 'border-gov-blue text-gov-blue font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-colors ${
            filter === 'unread'
              ? 'border-gov-blue text-gov-blue font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                !notif.read
                  ? 'bg-white border-blue-200/90 shadow-sm ring-1 ring-blue-500/10'
                  : 'bg-white/80 border-slate-200 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-gov-blue" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>
                  <span className="text-[11px] font-mono text-slate-400 block pt-1">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              {notif.link && (
                <Link
                  to={notif.link}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-gov-blue rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 whitespace-nowrap self-center transition-colors"
                >
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No unread notifications</h3>
            <p className="text-xs text-slate-500 mt-1">
              You are completely up to date with your government schemes and document status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
