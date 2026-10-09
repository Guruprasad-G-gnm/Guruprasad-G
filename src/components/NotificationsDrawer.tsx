import React from 'react';
import { useHelpdesk } from '../context/HelpdeskContext';
import {
  X,
  CheckCheck,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotifOpen,
    setIsNotifOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedTicketId,
    setCurrentView,
  } = useHelpdesk();

  if (!isNotifOpen) return null;

  const handleTicketClick = (ticketId?: string, notifId?: string) => {
    if (notifId) markNotificationRead(notifId);
    if (ticketId) {
      setSelectedTicketId(ticketId);
      setCurrentView('track_ticket');
      setIsNotifOpen(false);
    }
  };

  const getIcon = (level: string, type: string) => {
    if (level === 'danger' || type === 'escalated') {
      return <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
    }
    if (level === 'warning' || type === 'sla_warning') {
      return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
    }
    if (level === 'success' || type === 'resolved') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
    }
    return <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsNotifOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Campus Alerts & Updates</h2>
              <p className="text-xs text-slate-500">Live ticket updates & multi-agent notifications</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-sky-700 hover:text-sky-800 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
              <button
                onClick={() => setIsNotifOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No active notifications
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleTicketClick(item.ticketId, item.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-colors ${
                    item.read ? 'hover:bg-slate-50 opacity-80' : 'bg-sky-50/50 hover:bg-sky-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(item.level, item.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </span>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        {item.message}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {item.ticketId && (
                          <span className="text-sky-600 hover:text-sky-800 font-medium flex items-center gap-0.5">
                            {item.ticketId}
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
