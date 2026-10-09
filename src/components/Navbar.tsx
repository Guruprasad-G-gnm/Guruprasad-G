import React, { useState } from 'react';
import { useHelpdesk, AppView } from '../context/HelpdeskContext';
import { UserRole } from '../types';
import {
  Bell,
  Sparkles,
  PlusCircle,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  UserCheck,
  ChevronDown,
  Search,
  Lock,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    switchUserRole,
    unreadCount,
    setIsNotifOpen,
    setIsChatOpen,
    searchQuery,
    setSearchQuery,
    setSelectedTicketId,
    isAdminUnlocked,
    unlockAdminConsole,
    lockAdminConsole,
  } = useHelpdesk();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [navSearchInput, setNavSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = navSearchInput.trim();
    if (!query) return;

    // Secret access mechanism: "openadmin777" securely unlocks Admin Analytics & Department Desk
    if (query.toLowerCase() === 'openadmin777') {
      unlockAdminConsole();
      setNavSearchInput('');
      return;
    }

    setSearchQuery(query);
    setSelectedTicketId(query.toUpperCase());
    setCurrentView('track_ticket');
  };

  const navLinks: { label: string; view: AppView }[] = [
    { label: 'Student Portal', view: 'student_dashboard' },
    { label: 'Track Request', view: 'track_ticket' },
    { label: 'Agent Pipeline', view: 'agent_workflow' },
    { label: 'Departments', view: 'department_dashboard' },
    { label: 'Analytics', view: 'admin_dashboard' },
    { label: 'Knowledge Base', view: 'knowledge_base' },
  ];

  // Completely hide Admin Analytics and Department Desk unless unlocked
  const visibleNavLinks = navLinks.filter((item) => {
    if (!isAdminUnlocked && (item.view === 'department_dashboard' || item.view === 'admin_dashboard')) {
      return false;
    }
    return true;
  });

  const roleOptions: { role: UserRole; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      role: 'student',
      title: 'Student',
      subtitle: 'Aarav Sharma · 3rd Year CSE',
      icon: <GraduationCap className="w-4 h-4 text-sky-600" />,
    },
    {
      role: 'staff',
      title: 'Staff / Faculty',
      subtitle: 'Prof. Priya Nair · Coordinator',
      icon: <Briefcase className="w-4 h-4 text-emerald-600" />,
    },
    {
      role: 'officer',
      title: 'Department Officer',
      subtitle: 'S. Murugan · IT Systems Lead',
      icon: <UserCheck className="w-4 h-4 text-indigo-600" />,
    },
    {
      role: 'admin',
      title: 'Helpdesk Admin',
      subtitle: 'Dr. Rajesh Kumar · Chief Admin',
      icon: <ShieldAlert className="w-4 h-4 text-amber-600" />,
    },
  ];

  // Completely hide Dr. Rajesh Kumar / Admin view from role selector unless unlocked
  const visibleRoleOptions = roleOptions.filter((opt) => {
    if (!isAdminUnlocked && opt.role === 'admin') {
      return false;
    }
    return true;
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text wordmark with collegiate badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('student_dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-600 to-blue-800 flex items-center justify-center text-white shadow-sm ring-1 ring-sky-700/20 group-hover:scale-105 transition-transform">
                <span className="font-bold text-sm tracking-wider font-mono">CH</span>
              </div>
              <div className="leading-tight">
                <span className="text-base font-bold text-slate-900 tracking-tight block">
                  Campus Helpdesk AI
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:block">
                  Smart Requests · Faster Resolution
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {visibleNavLinks.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                    isActive
                      ? 'text-sky-700 font-semibold border-b-2 border-sky-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Ticket Lookup Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative max-w-xs w-full text-xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={navSearchInput}
              onChange={(e) => setNavSearchInput(e.target.value)}
              placeholder="Search Ticket ID (e.g. CHD-2026-0001)..."
              className="w-full bg-slate-100 hover:bg-slate-150 focus:bg-white pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
            />
          </form>

          {/* Zone 3: Role Switcher, Notification Bell, AI Assistant & Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Campus Help AI Button */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors whitespace-nowrap shadow-xs"
              title="Open Campus Help AI Chatbot"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Campus Help AI</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-rose-600 rounded-full flex items-center justify-center font-mono ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              >
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span className="hidden md:inline capitalize">{currentUser.role}:</span>
                <span className="font-semibold text-slate-900 max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Active Role
                    </p>
                  </div>
                  {visibleRoleOptions.map((opt) => (
                    <button
                      key={opt.role}
                      onClick={() => {
                        switchUserRole(opt.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                        currentUser.role === opt.role ? 'bg-sky-50/70' : ''
                      }`}
                    >
                      <div className="mt-0.5">{opt.icon}</div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{opt.title}</div>
                        <div className="text-[11px] text-slate-500">{opt.subtitle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lock Console Button when Admin is Unlocked */}
            {isAdminUnlocked && (
              <button
                onClick={lockAdminConsole}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                title="Lock administrative console and return to student view"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Lock Console</span>
              </button>
            )}

            {/* Submit Request CTA Button */}
            <button
              onClick={() => setCurrentView('submit_request')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Request</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
