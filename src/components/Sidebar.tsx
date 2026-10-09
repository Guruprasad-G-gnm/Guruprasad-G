import React from 'react';
import { useHelpdesk, AppView } from '../context/HelpdeskContext';
import {
  LayoutDashboard,
  FilePlus2,
  SearchCheck,
  Cpu,
  Building2,
  BarChart3,
  BookOpen,
  MessageSquareCode,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, tickets, currentUser, isAdminUnlocked, lockAdminConsole } = useHelpdesk();

  const activeTicketsCount = tickets.filter(
    (t) => t.status !== 'Resolved' && t.status !== 'Closed'
  ).length;

  const escalatedCount = tickets.filter((t) => t.status === 'Escalated').length;

  const navItems: {
    id: AppView;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'student_dashboard',
      label: 'Student Portal',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'submit_request',
      label: 'Create Request',
      icon: <FilePlus2 className="w-4 h-4" />,
    },
    {
      id: 'track_ticket',
      label: 'Track Ticket',
      icon: <SearchCheck className="w-4 h-4" />,
      badge: activeTicketsCount,
      badgeColor: 'bg-slate-200 text-slate-700',
    },
    {
      id: 'agent_workflow',
      label: 'Multi-Agent AI',
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      id: 'department_dashboard',
      label: 'Department Desk',
      icon: <Building2 className="w-4 h-4" />,
      badge: escalatedCount > 0 ? escalatedCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'admin_dashboard',
      label: 'Admin Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'knowledge_base',
      label: 'Knowledge Base',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'chat_assistant',
      label: 'Campus Help AI',
      icon: <MessageSquareCode className="w-4 h-4" />,
    },
  ];

  // Completely hide Department Desk & Admin Analytics unless unlocked
  const visibleNavItems = navItems.filter((item) => {
    if (!isAdminUnlocked && (item.id === 'department_dashboard' || item.id === 'admin_dashboard')) {
      return false;
    }
    return true;
  });

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* College Info strip */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Campus Desk
          </p>
          <p className="text-xs font-semibold text-slate-800">Fall 2026 Academic Term</p>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified</span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {visibleNavItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-sky-50 text-sky-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-sky-600' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
                    item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* SLA Live Status Card */}
      <div className="p-3 mx-3 mb-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-slate-800">SLA Guarantee</span>
          <span className="text-[10px] font-mono font-medium text-emerald-600">Active</span>
        </div>
        <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
          Critical tickets escalated sub-2h. High priority guaranteed within 8h.
        </p>
        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
          <span>Active Escalate:</span>
          <span className="font-mono font-bold text-amber-700">{escalatedCount} ticket(s)</span>
        </div>
      </div>

      {/* Lock Admin Console action when unlocked */}
      {isAdminUnlocked && (
        <div className="p-3 border-t border-amber-200 bg-amber-50">
          <button
            onClick={lockAdminConsole}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            title="Lock administrative console and return to student view"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      )}

      {/* Active User profile card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {currentUser.avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-slate-500 truncate capitalize">
              {currentUser.role} · {currentUser.idNumber}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
