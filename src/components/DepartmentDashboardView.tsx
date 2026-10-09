import React, { useState, useEffect } from 'react';
import { useHelpdesk } from '../context/HelpdeskContext';
import { Department, TicketStatus, EscalationLevel, Ticket } from '../types';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertOctagon,
  Flame,
  Send,
  ArrowRight,
  ShieldAlert,
  User,
  MapPin,
  Sparkles,
  ArrowRightLeft,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Check,
  Info,
  Lock,
} from 'lucide-react';

export const DepartmentDashboardView: React.FC = () => {
  const {
    tickets,
    updateTicketStatus,
    addOfficialResponse,
    escalateTicket,
    rerouteTicket,
    setSelectedTicketId,
    setCurrentView,
    currentUser,
    isAdminUnlocked,
    lockAdminConsole,
  } = useHelpdesk();

  const [selectedDept, setSelectedDept] = useState<Department>('IT Services');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected / expanded ticket
  const [selectedTicketForAction, setSelectedTicketForAction] = useState<string | null>(null);

  // Dynamic AI draft reply state per ticket
  const [aiDraftReplies, setAiDraftReplies] = useState<Record<string, string>>({});

  // Sub-actions toggles (re-route, escalate)
  const [reroutingTicketId, setReroutingTicketId] = useState<string | null>(null);
  const [targetRerouteDept, setTargetRerouteDept] = useState<Department>('Estate & Maintenance');
  const [rerouteReason, setRerouteReason] = useState<string>('');

  const [escalatingTicketId, setEscalatingTicketId] = useState<string | null>(null);
  const [escalateLevel, setEscalateLevel] = useState<EscalationLevel>(2);
  const [escalateReason, setEscalateReason] = useState<string>('');

  // Status feedback toast
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const departments: Department[] = [
    'IT Services',
    'Finance & Accounts',
    'Transport Division',
    'Hostel Administration',
    'Examination Cell',
    'Campus Security',
    'Estate & Maintenance',
    'Student Services',
    'Central Library',
    'Academic Affairs',
  ];

  // Generates dynamic AI draft reply grounded in ticket's analysis and verified KB
  const buildAIDraftReply = (ticket: Ticket): string => {
    const studentFirstName = ticket.studentName ? ticket.studentName.split(' ')[0] : 'Student';
    const resolution = ticket.agentAnalysis?.resolution;
    const priority = ticket.agentAnalysis?.priority;
    const routing = ticket.agentAnalysis?.routing;

    const guidance = resolution?.stepByStepGuidance?.length
      ? resolution.stepByStepGuidance.map((step, idx) => `${idx + 1}. ${step}`).join('\n')
      : '1. Department technician dispatched to inspect physical hardware.\n2. Review status log in your student portal for updates.';

    return `Dear ${studentFirstName},

Thank you for reporting this issue regarding "${ticket.title}".

Our AI resolution diagnostic has assessed your request:
${resolution?.recommendedSolution || 'Your request has been verified and prioritized by the department support unit.'}

Action steps scheduled for resolution:
${guidance}

Location: ${ticket.location || 'Campus Facilities'}
Target SLA: ${priority?.slaHours || 24} Hours
Assigned Officer: ${routing?.assignedOfficer || ticket.assignedOfficer || 'Department Support Lead'}

Please let us know if you require any temporary passes or assistance in the interim.

Best regards,
${ticket.assignedOfficer || 'Officer In-Charge'}
${ticket.assignedDepartment}`;
  };

  // Pre-populate AI drafts for tickets
  useEffect(() => {
    setAiDraftReplies((prev) => {
      const updated = { ...prev };
      tickets.forEach((t) => {
        if (!updated[t.id]) {
          updated[t.id] = buildAIDraftReply(t);
        }
      });
      return updated;
    });
  }, [tickets]);

  // Filter tickets assigned to this department
  const deptTickets = tickets.filter((t) => t.assignedDepartment === selectedDept);

  const filteredTickets = deptTickets.filter((t) => {
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

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

  const handleTicketCardClick = (ticketId: string) => {
    setSelectedTicketForAction((prev) => (prev === ticketId ? null : ticketId));
    setReroutingTicketId(null);
    setEscalatingTicketId(null);
  };

  // ACTION 1: Approve & Send AI Draft Reply
  const handleApproveAndSend = (ticket: Ticket, draftText: string) => {
    if (!draftText.trim()) return;

    addOfficialResponse(
      ticket.id,
      draftText,
      `AI-generated resolution approved and sent by ${currentUser.name} (${currentUser.role})`
    );

    // If ticket was 'Assigned', move to 'In Progress'
    if (ticket.status === 'Assigned') {
      updateTicketStatus(ticket.id, 'In Progress', 'AI draft reply approved and official update dispatched.');
    }

    setActionSuccessMessage(`Official response approved & dispatched to ${ticket.studentName} for ticket ${ticket.id}!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  // ACTION 2: Confirm Re-route
  const handleConfirmReroute = (ticketId: string) => {
    if (!targetRerouteDept) return;
    rerouteTicket(ticketId, targetRerouteDept, rerouteReason);
    setReroutingTicketId(null);
    setRerouteReason('');
    setActionSuccessMessage(`Ticket ${ticketId} successfully re-routed to ${targetRerouteDept}!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  // ACTION 3: Confirm Escalation
  const handleConfirmEscalation = (ticketId: string) => {
    if (!escalateReason.trim()) return;
    escalateTicket(ticketId, escalateLevel, escalateReason);
    setEscalatingTicketId(null);
    setEscalateReason('');
    setActionSuccessMessage(`Ticket ${ticketId} escalated to Level ${escalateLevel}!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const activeTicket = tickets.find((t) => t.id === selectedTicketForAction);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Department Operational Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Department Queue & Resolution Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Click any ticket to expand its dynamic AI-generated draft reply with rapid action buttons:
            <span className="font-semibold text-slate-700"> Approve & Send</span>,
            <span className="font-semibold text-slate-700"> Re-route</span>, and
            <span className="font-semibold text-slate-700"> Escalate</span>.
          </p>
        </div>

        {/* Lock Console Action Button */}
        {isAdminUnlocked && (
          <button
            onClick={lockAdminConsole}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 self-start sm:self-auto border border-slate-700"
            title="Instantly lock administrative dashboard and return to Student Portal view"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Lock Console</span>
          </button>
        )}
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Department Selector Pills */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Select Department Queue:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {departments.map((dept) => {
            const count = tickets.filter(
              (t) => t.assignedDepartment === dept && t.status !== 'Resolved' && t.status !== 'Closed'
            ).length;
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => {
                  setSelectedDept(dept);
                  setSelectedTicketForAction(null);
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{dept}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">Filter by:</span>
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Student">Waiting for Student</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="text-slate-500 text-[11px]">
          Showing <span className="font-bold text-slate-800">{filteredTickets.length}</span> tickets for{' '}
          <span className="font-bold text-slate-800">{selectedDept}</span>
        </div>
      </div>

      {/* Main Ticket Queue with Expandable Cards & Action Buttons */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">Queue Clear</h3>
            <p className="mt-1">No pending tickets match the selected filters for {selectedDept}.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const isExpanded = selectedTicketForAction === ticket.id;
            const draftText = aiDraftReplies[ticket.id] || buildAIDraftReply(ticket);
            const isRerouting = reroutingTicketId === ticket.id;
            const isEscalating = escalatingTicketId === ticket.id;

            return (
              <div
                key={ticket.id}
                className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                  isExpanded
                    ? 'border-sky-500 ring-2 ring-sky-100 bg-sky-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header row: clickable to expand */}
                <div
                  onClick={() => handleTicketCardClick(ticket.id)}
                  className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 select-none"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {ticket.id}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-600 font-medium">
                        {ticket.category}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[150px]">{ticket.location}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {ticket.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      Student: <span className="font-semibold text-slate-700">{ticket.studentName}</span> ({ticket.registerNumber}) · {ticket.studentYear}
                    </p>
                  </div>

                  {/* Status, Priority & Expand indicator */}
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
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                      title={isExpanded ? 'Collapse' : 'Expand AI Draft & Actions'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-sky-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* EXPANDED SECTION: Dynamic AI-Generated Draft Reply & Action Buttons */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-in fade-in duration-150">
                    {/* Student description preview */}
                    <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800 block mb-0.5">
                        Original Student Request:
                      </span>
                      <p className="leading-relaxed">{ticket.description}</p>
                    </div>

                    {/* AI Draft Reply Card */}
                    <div className="p-4 bg-sky-50/80 rounded-xl border border-sky-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
                          <Sparkles className="w-4 h-4 text-sky-600" />
                          <span>Dynamic AI-Generated Draft Reply</span>
                          <span className="text-[10px] font-medium text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded border border-sky-200">
                            Grounded in KB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setAiDraftReplies((prev) => ({
                              ...prev,
                              [ticket.id]: buildAIDraftReply(ticket),
                            }))
                          }
                          className="text-[11px] text-sky-700 hover:text-sky-900 flex items-center gap-1 font-medium"
                          title="Reset to original AI generation"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Draft</span>
                        </button>
                      </div>

                      {/* Editable AI Draft Reply */}
                      <textarea
                        rows={7}
                        value={draftText}
                        onChange={(e) =>
                          setAiDraftReplies((prev) => ({
                            ...prev,
                            [ticket.id]: e.target.value,
                          }))
                        }
                        className="w-full text-xs p-3 bg-white border border-sky-200 rounded-lg text-slate-800 leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="AI-generated response draft..."
                      />

                      {/* THE THREE REQUESTED ACTION BUTTONS */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          {/* 1. APPROVE & SEND */}
                          <button
                            type="button"
                            onClick={() => handleApproveAndSend(ticket, draftText)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve & Send</span>
                          </button>

                          {/* 2. RE-ROUTE */}
                          <button
                            type="button"
                            onClick={() => {
                              setReroutingTicketId(isRerouting ? null : ticket.id);
                              setEscalatingTicketId(null);
                            }}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors ${
                              isRerouting
                                ? 'bg-indigo-700 text-white border-indigo-700'
                                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                            }`}
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>Re-route</span>
                          </button>

                          {/* 3. ESCALATE */}
                          <button
                            type="button"
                            onClick={() => {
                              setEscalatingTicketId(isEscalating ? null : ticket.id);
                              setReroutingTicketId(null);
                            }}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors ${
                              isEscalating
                                ? 'bg-rose-700 text-white border-rose-700'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                            }`}
                          >
                            <AlertOctagon className="w-3.5 h-3.5" />
                            <span>Escalate</span>
                          </button>
                        </div>

                        {/* Link to Full Tracking View */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTicketId(ticket.id);
                            setCurrentView('track_ticket');
                          }}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                          <span>Full History & Timeline</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Re-route Controls */}
                    {isRerouting && (
                      <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-200 space-y-3 animate-in fade-in duration-150 text-xs">
                        <div className="flex items-center justify-between font-bold text-indigo-950">
                          <span className="flex items-center gap-1.5">
                            <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                            <span>Re-route Ticket {ticket.id} to Another Department</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setReroutingTicketId(null)}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                              Target Department *
                            </label>
                            <select
                              value={targetRerouteDept}
                              onChange={(e) => setTargetRerouteDept(e.target.value as Department)}
                              className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500"
                            >
                              {departments
                                .filter((d) => d !== ticket.assignedDepartment)
                                .map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                              Re-routing Reason / Officer Note
                            </label>
                            <input
                              type="text"
                              value={rerouteReason}
                              onChange={(e) => setRerouteReason(e.target.value)}
                              placeholder="e.g. Belongs under electrical facility jurisdiction..."
                              className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => handleConfirmReroute(ticket.id)}
                            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold shadow-xs"
                          >
                            Confirm Re-route
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Inline Escalation Controls */}
                    {isEscalating && (
                      <div className="p-4 bg-rose-50/80 rounded-xl border border-rose-200 space-y-3 animate-in fade-in duration-150 text-xs">
                        <div className="flex items-center justify-between font-bold text-rose-950">
                          <span className="flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4 text-rose-600" />
                            <span>Escalate Ticket {ticket.id}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setEscalatingTicketId(null)}
                            className="text-rose-600 hover:text-rose-800 font-semibold"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-rose-900 mb-1">
                              Escalation Authority Level
                            </label>
                            <select
                              value={escalateLevel}
                              onChange={(e) => setEscalateLevel(Number(e.target.value) as EscalationLevel)}
                              className="w-full p-2 bg-white border border-rose-200 rounded-lg text-xs font-medium focus:outline-none focus:border-rose-500"
                            >
                              <option value={1}>Level 1: Department Division Head</option>
                              <option value={2}>Level 2: Central Helpdesk Admin (Dr. Rajesh Kumar)</option>
                              <option value={3}>Level 3: Higher Campus Authority (Dean of Student Affairs / Director)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-rose-900 mb-1">
                              Escalation Reason *
                            </label>
                            <input
                              type="text"
                              required
                              value={escalateReason}
                              onChange={(e) => setEscalateReason(e.target.value)}
                              placeholder="e.g. Critical safety concern / hardware parts unavailable..."
                              className="w-full p-2 bg-white border border-rose-200 rounded-lg text-xs focus:outline-none focus:border-rose-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => handleConfirmEscalation(ticket.id)}
                            className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold shadow-xs"
                          >
                            Confirm Escalation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
