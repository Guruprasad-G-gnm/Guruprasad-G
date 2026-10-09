import React from 'react';
import { useHelpdesk } from '../context/HelpdeskContext';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const StudentDashboardView: React.FC = () => {
  const { tickets, currentUser, setCurrentView, setSelectedTicketId } = useHelpdesk();

  // Metrics for student
  const myTickets = tickets.filter(
    (t) =>
      t.studentEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      t.registerNumber === currentUser.idNumber ||
      currentUser.role === 'admin' ||
      currentUser.role === 'staff'
  );

  const activeTickets = myTickets.filter(
    (t) => t.status !== 'Resolved' && t.status !== 'Closed'
  );
  const resolvedTickets = myTickets.filter(
    (t) => t.status === 'Resolved' || t.status === 'Closed'
  );
  const pendingTickets = myTickets.filter(
    (t) => t.status === 'Waiting for Department' || t.status === 'Waiting for Student'
  );
  const highPriorityTickets = myTickets.filter(
    (t) => (t.priority === 'HIGH' || t.priority === 'CRITICAL') && t.status !== 'Resolved'
  );

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'HIGH':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'MEDIUM':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Escalated':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'In Progress':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  const handleTicketClick = (id: string) => {
    setSelectedTicketId(id);
    setCurrentView('track_ticket');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-800 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-medium mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Campus Helpdesk AI · Multi-Agent Resolution</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed mb-5">
            Submit issues, track automated departmental routing, and experience instant
            verified solutions backed by our 7 collaborative AI agents.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('submit_request')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-sky-900 font-bold text-xs hover:bg-sky-50 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-sky-600" />
              <span>Create New Request</span>
            </button>
            <button
              onClick={() => setCurrentView('agent_workflow')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-700/60 hover:bg-sky-700 text-white font-medium text-xs transition-colors border border-sky-400/30"
            >
              <span>Explore Multi-Agent Workflow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 w-80 h-full opacity-15 pointer-events-none">
          <div className="w-72 h-72 rounded-full bg-sky-300 blur-3xl" />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Requests */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Active Requests</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {activeTickets.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Currently in processing pipeline</p>
        </div>

        {/* Resolved Requests */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Resolved Requests</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {resolvedTickets.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Successfully closed with feedback</p>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Pending Clarification</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {pendingTickets.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting officer or student action</p>
        </div>

        {/* High / Critical Priority */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">High / Critical Priority</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {highPriorityTickets.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">SLA monitored: 2h - 8h window</p>
        </div>
      </div>

      {/* Main Content Grid: Active Requests + Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Requests List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Active Requests</h2>
              <p className="text-xs text-slate-500">Live status and expected resolution timelines</p>
            </div>
            <button
              onClick={() => setCurrentView('track_ticket')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeTickets.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">All Requests Resolved</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                You have no active unresolved requests at this time.
              </p>
              <button
                onClick={() => setCurrentView('submit_request')}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700"
              >
                Create New Request
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTickets.slice(0, 5).map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => handleTicketClick(ticket.id)}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-sky-300 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-sky-700">
                          {ticket.id}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-600 font-medium">
                          {ticket.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                        {ticket.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityStyle(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${getStatusStyle(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {ticket.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ticket.assignedDepartment}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[140px]">{ticket.location}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-sky-700 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>
                        Due{' '}
                        {new Date(ticket.expectedResolutionTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Updates & Multi-Agent Guarantee (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Multi-Agent AI Protocol
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              When a request is lodged, 7 autonomous AI agents collaborate in sequence:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <span className="font-semibold text-slate-800">Classification:</span>
                  <span className="text-slate-500 ml-1">Understands issue & detects duplicates</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <span className="font-semibold text-slate-800">Department Routing:</span>
                  <span className="text-slate-500 ml-1">Maps to verified college department</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <span className="font-semibold text-slate-800">Knowledge Retrieval:</span>
                  <span className="text-slate-500 ml-1">Strict citation of verified university rules</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div>
                  <span className="font-semibold text-slate-800">Priority & SLA:</span>
                  <span className="text-slate-500 ml-1">Calculates risk factors & resolution clock</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  5
                </span>
                <div>
                  <span className="font-semibold text-slate-800">Resolution & Escalation:</span>
                  <span className="text-slate-500 ml-1">Self-service guidance or supervisor escalate</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('agent_workflow')}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors text-center"
            >
              View Full Architecture Map
            </button>
          </div>

          {/* SLA Standard Notice */}
          <div className="bg-sky-50/70 rounded-xl border border-sky-200 p-4 text-xs">
            <div className="flex items-center gap-2 text-sky-800 font-bold mb-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Campus Charter SLA</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-3">
              All tickets are backed by university service level agreements:
            </p>
            <ul className="space-y-1 text-slate-700 font-mono text-[11px]">
              <li>• Critical (Safety/Outage): &lt; 2 hours</li>
              <li>• High (Academics/Exams): &lt; 8 hours</li>
              <li>• Medium (Hostel/Transit): &lt; 24 hours</li>
              <li>• Low (Certificates/Info): &lt; 48 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
