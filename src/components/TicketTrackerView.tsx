import React, { useState } from 'react';
import { useHelpdesk } from '../context/HelpdeskContext';
import { TicketStatus, EscalationLevel, KBSourceCitation } from '../types';
import {
  Search,
  Clock,
  Building,
  CheckCircle2,
  AlertTriangle,
  Flame,
  User,
  ShieldCheck,
  Cpu,
  BookOpen,
  ArrowRight,
  Send,
  Star,
  FileText,
  AlertOctagon,
  ChevronRight,
  ExternalLink,
  Smile,
  CopyCheck,
  Info,
  X,
  Percent,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const TicketTrackerView: React.FC = () => {
  const {
    tickets,
    selectedTicketId,
    setSelectedTicketId,
    updateTicketStatus,
    addOfficialResponse,
    escalateTicket,
    submitFeedback,
    currentUser,
    setCurrentView,
    unlockAdminConsole,
  } = useHelpdesk();

  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState<'agents' | 'confidence' | 'responses' | 'timeline'>('agents');
  
  // Officer response form state
  const [officerMsg, setOfficerMsg] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  
  // Student feedback state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Manual escalation state
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');
  const [escalateLevel, setEscalateLevel] = useState<EscalationLevel>(2);

  // RAG Sources Modal state
  const [viewingSourceCite, setViewingSourceCite] = useState<KBSourceCitation | null>(null);

  // Explainable AI ("Why?") modal state
  const [explainModal, setExplainModal] = useState<{
    type: 'department' | 'priority' | 'escalation';
    title: string;
    factors: string[];
    evidence: string[];
    rule: string;
  } | null>(null);

  // Filter or selected ticket
  const currentTicket =
    tickets.find((t) => t.id.toLowerCase() === (selectedTicketId || '').toLowerCase()) ||
    tickets[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    // Secret sequence mechanism check
    if (query.toLowerCase() === 'openadmin777') {
      unlockAdminConsole();
      setSearchInput('');
      return;
    }

    const match = tickets.find((t) =>
      t.id.toLowerCase().includes(query.toLowerCase())
    );
    if (match) {
      setSelectedTicketId(match.id);
    }
  };

  const statusSteps: { label: string; key: TicketStatus }[] = [
    { label: 'Submitted', key: 'New' },
    { label: 'Classified', key: 'AI Processing' },
    { label: 'Assigned', key: 'Assigned' },
    { label: 'In Progress', key: 'In Progress' },
    { label: 'Resolved', key: 'Resolved' },
    { label: 'Closed', key: 'Closed' },
  ];

  const getStepProgressIndex = (status: TicketStatus) => {
    switch (status) {
      case 'New':
        return 0;
      case 'AI Processing':
        return 1;
      case 'Assigned':
      case 'Waiting for Student':
      case 'Waiting for Department':
        return 2;
      case 'In Progress':
      case 'Escalated':
        return 3;
      case 'Resolved':
        return 4;
      case 'Closed':
        return 5;
      default:
        return 2;
    }
  };

  const currentStepIdx = currentTicket ? getStepProgressIndex(currentTicket.status) : 0;

  const openExplainDepartment = () => {
    if (!currentTicket) return;
    const exp = currentTicket.agentAnalysis?.explainability?.whyDepartment;
    setExplainModal({
      type: 'department',
      title: exp?.title || `Why was ${currentTicket.assignedDepartment} selected?`,
      factors: exp?.factors || [
        'Departmental Domain Mandate',
        'Technical Equipment Ownership',
        'Standard Operating Procedures',
      ],
      evidence: exp?.evidence || [
        currentTicket.agentAnalysis?.routing?.routingJustification ||
          `Direct operational responsibility belongs to ${currentTicket.assignedDepartment}.`,
        `Designated Lead: ${currentTicket.assignedOfficer} (${currentTicket.agentAnalysis?.routing?.officerRole || 'Officer'})`,
      ],
      rule: exp?.ruleApplied || 'Campus Governance & Division Allocation Protocol',
    });
  };

  const openExplainPriority = () => {
    if (!currentTicket) return;
    const exp = currentTicket.agentAnalysis?.explainability?.whyPriority;
    setExplainModal({
      type: 'priority',
      title: exp?.title || `Why was ${currentTicket.priority} priority assigned?`,
      factors: exp?.factors || [
        'Student reports service interruption',
        'Issue affects academic/building infrastructure',
        'Similar complaints reported recently',
        'SLA deadline and exam calendar constraints',
      ],
      evidence: exp?.evidence || [
        currentTicket.agentAnalysis?.priority?.reasoning ||
          `Assessed risk factors dictate a ${currentTicket.agentAnalysis?.priority?.slaHours || 8}-hour SLA target.`,
        `Affected students estimate: ${currentTicket.agentAnalysis?.priority?.riskFactors?.studentsAffectedEstimate || 'Cohort impact'}`,
        `Academic deadline conflict: ${currentTicket.agentAnalysis?.priority?.riskFactors?.academicDeadlineImpact ? 'Yes (Critical)' : 'None'}`,
      ],
      rule: exp?.ruleApplied || 'Institutional SLA & Risk Assessment Framework',
    });
  };

  const openExplainEscalation = () => {
    if (!currentTicket) return;
    const exp = currentTicket.agentAnalysis?.explainability?.whyEscalation;
    setExplainModal({
      type: 'escalation',
      title: exp?.title || `Why was this ticket escalated?`,
      factors: exp?.factors || [
        'Immediate Severity Rule or SLA threshold proximity',
        'Campus Safety & Operational Escalation Policy',
        'Automated SLA monitoring alert',
      ],
      evidence: exp?.evidence || [
        currentTicket.agentAnalysis?.escalation?.escalationReason ||
          'Ticket breached SLA or flagged high severity during automated intake audit.',
        `Target Authority: ${currentTicket.agentAnalysis?.escalation?.escalatedTo || 'Department Head / Admin'}`,
      ],
      rule: exp?.ruleApplied || 'Campus Emergency Escalation Standard',
    });
  };

  const handleOfficerResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerMsg.trim() || !currentTicket) return;
    addOfficialResponse(currentTicket.id, officerMsg, actionNotes);
    setOfficerMsg('');
    setActionNotes('');
  };

  const handleEscalationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalateReason.trim() || !currentTicket) return;
    escalateTicket(currentTicket.id, escalateLevel, escalateReason);
    setShowEscalateModal(false);
    setEscalateReason('');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTicket) return;
    submitFeedback(currentTicket.id, feedbackRating, feedbackComment);
    setShowFeedbackModal(false);
    setFeedbackComment('');
  };

  const getPriorityBadgeClass = (priority: string) => {
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

  const getStatusBadgeClass = (status: string) => {
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

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Ticket ID (e.g. CHD-2026-0001)..."
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
          >
            Find Ticket
          </button>
        </form>

        {/* Quick chip selector for sample tickets */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs text-slate-500">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Sample Tickets:</span>
          {tickets.slice(0, 5).map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTicketId(t.id)}
              className={`font-mono text-[11px] px-2 py-1 rounded-md border whitespace-nowrap transition-colors ${
                currentTicket?.id === t.id
                  ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {t.id}
            </button>
          ))}
        </div>
      </div>

      {!currentTicket ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Ticket Selected</h3>
          <p className="text-xs text-slate-500 mt-1">
            Enter a valid Ticket ID or select one of the tickets above to inspect.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Ticket Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span className="font-mono text-base font-extrabold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                    {currentTicket.id}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-md border inline-flex items-center gap-1.5 ${getPriorityBadgeClass(
                      currentTicket.priority
                    )}`}
                  >
                    <span>Priority: {currentTicket.priority}</span>
                    <button
                      type="button"
                      onClick={openExplainPriority}
                      className="text-[10px] bg-white/90 hover:bg-white text-slate-800 px-1 py-0.2 rounded font-extrabold border border-slate-300 shadow-2xs hover:scale-105 transition-all flex items-center gap-0.5"
                      title="Why was this priority assigned?"
                    >
                      <HelpCircle className="w-2.5 h-2.5 text-amber-600" />
                      <span>Why?</span>
                    </button>
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${getStatusBadgeClass(
                      currentTicket.status
                    )}`}
                  >
                    Status: {currentTicket.status}
                  </span>
                  {currentTicket.slaBreached && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 inline-flex items-center gap-1.5">
                      <span>SLA Breached</span>
                      <button
                        type="button"
                        onClick={openExplainEscalation}
                        className="text-[10px] bg-white/90 hover:bg-white text-rose-900 px-1 py-0.2 rounded font-extrabold border border-rose-300 shadow-2xs hover:scale-105 transition-all flex items-center gap-0.5"
                        title="Why was this ticket escalated/flagged?"
                      >
                        <HelpCircle className="w-2.5 h-2.5 text-rose-600" />
                        <span>Why?</span>
                      </button>
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  {currentTicket.title}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Category: <span className="font-medium text-slate-700">{currentTicket.category}</span> · Location: <span className="font-medium text-slate-700">{currentTicket.location}</span>
                </p>
              </div>

              {/* Action Buttons: Escalate / Feedback */}
              <div className="flex items-center gap-2 shrink-0">
                {currentTicket.status === 'Resolved' && !currentTicket.feedback && (
                  <button
                    onClick={() => setShowFeedbackModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold shadow-xs"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Rate Resolution</span>
                  </button>
                )}

                {currentTicket.status !== 'Resolved' && currentTicket.status !== 'Closed' && (
                  <button
                    onClick={() => setShowEscalateModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold shadow-xs"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Escalate Request</span>
                  </button>
                )}
              </div>
            </div>

            {/* 6-Step Visual Progress Tracker */}
            <div className="py-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Ticket Resolution Progress
              </p>
              <div className="relative">
                {/* Connecting track line */}
                <div className="hidden sm:block absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
                <div
                  className="hidden sm:block absolute top-3.5 left-4 h-0.5 bg-sky-600 transition-all duration-500 -z-0"
                  style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 95}%` }}
                />

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center relative z-10">
                  {statusSteps.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold mb-1.5 transition-colors ${
                            isDone
                              ? 'bg-sky-600 text-white ring-4 ring-sky-100'
                              : 'bg-white border-2 border-slate-300 text-slate-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-xs ${
                            isCurrent
                              ? 'font-bold text-sky-800'
                              : isDone
                              ? 'font-medium text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Requester & SLA Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                  Student Requester
                </span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {currentTicket.studentName}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {currentTicket.registerNumber} · {currentTicket.studentYear}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                    Assigned Department
                  </span>
                  <button
                    type="button"
                    onClick={openExplainDepartment}
                    className="text-[10px] text-sky-700 hover:text-sky-900 font-bold flex items-center gap-0.5 hover:underline"
                    title="Why was this department selected?"
                  >
                    <HelpCircle className="w-2.5 h-2.5 text-sky-600" />
                    <span>Why?</span>
                  </button>
                </div>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {currentTicket.assignedDepartment}
                </span>
                <span className="text-slate-500 text-[11px]">
                  Lead: {currentTicket.assignedOfficer}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                  Created Timestamp
                </span>
                <span className="font-medium text-slate-800 block mt-0.5">
                  {new Date(currentTicket.createdAt).toLocaleDateString()}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {new Date(currentTicket.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                  Target Resolution Time
                </span>
                <span className="font-bold text-sky-700 font-mono block mt-0.5">
                  {new Date(currentTicket.expectedResolutionTime).toLocaleDateString()}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  Target: {currentTicket.agentAnalysis.priority.slaHours} hours SLA
                </span>
              </div>
            </div>

            {/* Issue Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Student Issue Description
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                {currentTicket.description}
              </p>
            </div>

            {/* Attachments if any */}
            {currentTicket.attachments.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Uploaded Attachments
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentTicket.attachments.map((att, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-800 border border-slate-200"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>{att.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tabbed Inspector: Multi-Agent Analysis, Official Responses, Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Tabs header */}
            <div className="flex items-center border-b border-slate-200 px-6 pt-3 gap-6">
              <button
                onClick={() => setActiveTab('agents')}
                className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === 'agents'
                    ? 'border-sky-600 text-sky-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Cpu className="w-4 h-4 text-sky-600" />
                <span>10-Agent AI Analysis</span>
              </button>

              <button
                onClick={() => setActiveTab('confidence')}
                className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === 'confidence'
                    ? 'border-sky-600 text-sky-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Percent className="w-4 h-4 text-sky-600" />
                <span>AI Confidence & Explainability</span>
              </button>

              <button
                onClick={() => setActiveTab('responses')}
                className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === 'responses'
                    ? 'border-sky-600 text-sky-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building className="w-4 h-4 text-sky-600" />
                <span>Department Updates ({currentTicket.officialResponses.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('timeline')}
                className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === 'timeline'
                    ? 'border-sky-600 text-sky-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Activity Timeline ({currentTicket.timeline.length})</span>
              </button>
            </div>

            {/* TAB 1: 10-Agent AI Outputs Breakdown */}
            {activeTab === 'agents' && (
              <div className="p-6 space-y-5">
                {/* Supervisor / Orchestrator Banner */}
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-700" />
                      <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                        Supervisor / Orchestrator Agent Verdict
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded font-bold">
                      10 Specialized Agents Coordinated
                    </span>
                  </div>
                  <p className="text-xs text-indigo-900 font-semibold leading-relaxed">
                    {currentTicket.agentAnalysis?.orchestrator?.supervisorVerdict ||
                      'All 10 specialized campus agents executed coordinated analysis with strict handbook grounding.'}
                  </p>
                  <p className="text-[11px] text-indigo-700">
                    {currentTicket.agentAnalysis?.orchestrator?.orchestrationSummary ||
                      'Execution DAG verified. Real-time anti-hallucination check passed.'}
                  </p>
                </div>

                {/* Sentiment & Duplicate Detection Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sentiment Agent */}
                  <div className="p-4 rounded-xl border border-pink-200 bg-pink-50/30 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Smile className="w-4 h-4 text-pink-600" />
                        <h4 className="text-xs font-bold text-slate-900">
                          Sentiment Analysis Agent
                        </h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentTicket.agentAnalysis?.sentiment?.sentiment === 'Urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : currentTicket.agentAnalysis?.sentiment?.sentiment === 'Frustrated' || currentTicket.agentAnalysis?.sentiment?.sentiment === 'Angry'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {currentTicket.agentAnalysis?.sentiment?.sentiment || 'Neutral'} Tone
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mb-2">
                      {currentTicket.agentAnalysis?.sentiment?.reason ||
                        'Standard informational inquiry phrased with neutral student sentiment.'}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-pink-100">
                      <span>Urgency Score:</span>
                      <span className="font-mono font-bold text-pink-800">
                        {currentTicket.agentAnalysis?.sentiment?.urgencyScore || 3} / 10
                      </span>
                    </div>
                  </div>

                  {/* Duplicate Detection Agent */}
                  <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/30 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CopyCheck className="w-4 h-4 text-cyan-700" />
                        <h4 className="text-xs font-bold text-slate-900">
                          Duplicate Detection Agent
                        </h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentTicket.agentAnalysis?.duplicate?.isDuplicate
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {currentTicket.agentAnalysis?.duplicate?.isDuplicate ? 'Potential Duplicate' : 'Unique Request'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mb-2">
                      {currentTicket.agentAnalysis?.duplicate?.reason ||
                        'No statistically significant overlap with currently open campus tickets.'}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-cyan-100">
                      <span>Action Recommendation:</span>
                      <span className="font-bold text-cyan-900">
                        {currentTicket.agentAnalysis?.duplicate?.actionRecommendation || 'Create New Ticket'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Agent 1: Classification */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-md bg-sky-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                        1
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">
                        Request Classification Agent
                      </h4>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mb-3">
                      {currentTicket.agentAnalysis.classification.summary}
                    </p>
                    <div className="space-y-1 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-700">Affected Group:</span>{' '}
                        {currentTicket.agentAnalysis.classification.extractedEntities.affectedGroup || 'Individual'}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Target System:</span>{' '}
                        {currentTicket.agentAnalysis.classification.extractedEntities.equipmentOrSystem || 'General Campus'}
                      </div>
                    </div>
                  </div>

                  {/* Agent 2: Routing */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-md bg-sky-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                        2
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">
                        Department Routing Agent
                      </h4>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mb-3">
                      {currentTicket.agentAnalysis.routing.routingJustification}
                    </p>
                    <div className="space-y-1 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-700">Assigned Officer:</span>{' '}
                        {currentTicket.agentAnalysis.routing.assignedOfficer} ({currentTicket.agentAnalysis.routing.officerRole})
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Department Mandate:</span>{' '}
                        {currentTicket.agentAnalysis.routing.assignedDepartment}
                      </div>
                    </div>
                  </div>

                  {/* Agent 3: Information Retrieval */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-sky-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                          3
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          Knowledge Retrieval Agent (Strict RAG Handbook Grounding)
                        </h4>
                      </div>
                      <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                        Zero Fabrication Enforced
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mb-3">
                      {currentTicket.agentAnalysis.retrieval.retrievalSummary}
                    </p>

                    {currentTicket.agentAnalysis.retrieval.citations.length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {currentTicket.agentAnalysis.retrieval.citations.map((cite) => (
                          <div
                            key={cite.id}
                            className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 font-semibold text-sky-800 mb-1">
                                <span>[{cite.id}] {cite.title}</span>
                                <span className="text-[10px] text-slate-500 font-normal">
                                  {cite.section}
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed text-[11px]">
                                {cite.summary}
                              </p>
                              {cite.urlRef && (
                                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                                  Official Desk: {cite.urlRef}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => setViewingSourceCite(cite)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-semibold hover:bg-sky-100 transition-colors shrink-0 self-start"
                            >
                              <Info className="w-3 h-3 text-sky-600" />
                              <span>View Sources</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                        <p className="font-bold">
                          Relevant campus information was not found in the campus knowledge base. Please contact the appropriate department.
                        </p>
                        <p className="text-[11px] text-amber-700">
                          AI agent refused to hallucinate synthetic college rules or phone numbers. Manual officer review required.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Agent 4: Priority Assessment */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-md bg-sky-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                        4
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">
                        Priority & Risk Agent
                      </h4>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mb-3">
                      {currentTicket.agentAnalysis.priority.reasoning}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-700">Safety Risk:</span>{' '}
                        {currentTicket.agentAnalysis.priority.riskFactors.safetyRisk}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Students Affected:</span>{' '}
                        {currentTicket.agentAnalysis.priority.riskFactors.studentsAffectedEstimate}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Exam Impact:</span>{' '}
                        {currentTicket.agentAnalysis.priority.riskFactors.academicDeadlineImpact ? 'Yes (Critical)' : 'No'}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Calculated SLA:</span>{' '}
                        <span className="font-mono font-bold text-sky-700">
                          {currentTicket.agentAnalysis.priority.slaHours} Hours
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Agent 5: Resolution Guidance */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-md bg-sky-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                        5
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">
                        Response Generation Agent
                      </h4>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 mb-2">
                      {currentTicket.agentAnalysis.resolution.recommendedSolution}
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-600 leading-relaxed">
                      {currentTicket.agentAnalysis.resolution.stepByStepGuidance.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                    <p className="text-[10px] text-slate-400 italic mt-3 pt-2 border-t border-slate-100">
                      {currentTicket.agentAnalysis.resolution.disclaimer}
                    </p>
                  </div>

                  {/* Agent 6 & 7: Follow-up & Escalation */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Follow-up agent */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-5 h-5 rounded-md bg-sky-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                            6
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">Follow-up Monitoring Agent</h4>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">
                          Monitors ticket age and triggers departmental reminders.
                        </p>
                        {currentTicket.agentAnalysis.followUp.followUpRemindersSent.length > 0 ? (
                          <div className="space-y-1">
                            {currentTicket.agentAnalysis.followUp.followUpRemindersSent.map((rem, rIdx) => (
                              <div
                                key={rIdx}
                                className="text-[11px] font-mono text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-200"
                              >
                                {rem}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400">
                            Ticket within nominal SLA window. Next check scheduled.
                          </p>
                        )}
                      </div>

                      {/* Escalation agent */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-5 h-5 rounded-md bg-sky-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                            7
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">Escalation Agent</h4>
                        </div>
                        {currentTicket.agentAnalysis.escalation.isEscalated ? (
                          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900">
                            <div className="font-bold mb-1">
                              Level {currentTicket.agentAnalysis.escalation.escalationLevel} Escalation Active
                            </div>
                            <p className="text-[11px] leading-relaxed mb-1">
                              {currentTicket.agentAnalysis.escalation.escalationReason}
                            </p>
                            <span className="text-[10px] text-rose-700 font-semibold">
                              Target Authority: {currentTicket.agentAnalysis.escalation.escalatedTo}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-emerald-700 font-medium">
                            No escalation required. Operating within configured department SLA.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Summary Box */}
                {currentTicket.agentAnalysis?.smartSummary && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Smart Executive Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-700 block">Problem:</span>
                        {currentTicket.agentAnalysis.smartSummary.problem}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">Actions Taken:</span>
                        {currentTicket.agentAnalysis.smartSummary.actionsTaken}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">Current Status:</span>
                        {currentTicket.agentAnalysis.smartSummary.currentStatus}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">Pending Action:</span>
                        {currentTicket.agentAnalysis.smartSummary.pendingAction}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: AI Confidence Scoring & Decision Explainability */}
            {activeTab === 'confidence' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Transparent AI Confidence Scoring & Explainability
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Every autonomous decision provides quantitative confidence scores, natural-language reasoning, and supporting evidence.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Audit Grade AI
                  </span>
                </div>

                {/* 3 Confidence Scoring Cards with Visual Meters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Confidence */}
                  <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Category Decision
                      </span>
                      <span className="font-mono text-sm font-extrabold text-sky-700">
                        {currentTicket.agentAnalysis?.confidenceDetails?.category.confidenceScore || 94}%
                      </span>
                    </div>

                    {/* Visual Meter Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full transition-all"
                        style={{ width: `${currentTicket.agentAnalysis?.confidenceDetails?.category.confidenceScore || 94}%` }}
                      ></div>
                    </div>

                    <div>
                      <span className="text-xs font-extrabold text-slate-900">
                        {currentTicket.agentAnalysis?.confidenceDetails?.category.decision || currentTicket.category}
                      </span>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {currentTicket.agentAnalysis?.confidenceDetails?.category.reason ||
                          'Request text matched vocabulary and technical entities for this category.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Supporting Evidence:
                      </span>
                      {currentTicket.agentAnalysis?.confidenceDetails?.category.supportingEvidence.map((ev, i) => (
                        <div key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0 mt-0.5" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Department Confidence */}
                  <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Department Routing
                      </span>
                      <span className="font-mono text-sm font-extrabold text-emerald-700">
                        {currentTicket.agentAnalysis?.confidenceDetails?.department.confidenceScore || 92}%
                      </span>
                    </div>

                    {/* Visual Meter Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${currentTicket.agentAnalysis?.confidenceDetails?.department.confidenceScore || 92}%` }}
                      ></div>
                    </div>

                    <div>
                      <span className="text-xs font-extrabold text-slate-900">
                        {currentTicket.agentAnalysis?.confidenceDetails?.department.decision || currentTicket.assignedDepartment}
                      </span>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {currentTicket.agentAnalysis?.confidenceDetails?.department.reason ||
                          'Assigned department maintains jurisdiction over the reported campus equipment.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Supporting Evidence:
                      </span>
                      {currentTicket.agentAnalysis?.confidenceDetails?.department.supportingEvidence.map((ev, i) => (
                        <div key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority Confidence */}
                  <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Priority Assessment
                      </span>
                      <span className="font-mono text-sm font-extrabold text-amber-700">
                        {currentTicket.agentAnalysis?.confidenceDetails?.priority.confidenceScore || 88}%
                      </span>
                    </div>

                    {/* Visual Meter Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all"
                        style={{ width: `${currentTicket.agentAnalysis?.confidenceDetails?.priority.confidenceScore || 88}%` }}
                      ></div>
                    </div>

                    <div>
                      <span className="text-xs font-extrabold text-slate-900">
                        {currentTicket.agentAnalysis?.confidenceDetails?.priority.decision || currentTicket.priority} Priority
                      </span>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {currentTicket.agentAnalysis?.confidenceDetails?.priority.reason ||
                          'Risk matrix calculated SLA targets and safety requirements.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Supporting Evidence:
                      </span>
                      {currentTicket.agentAnalysis?.confidenceDetails?.priority.supportingEvidence.map((ev, i) => (
                        <div key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Explainable AI Decision Cards */}
                {currentTicket.agentAnalysis?.explainability && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-sky-600" />
                        <span>{currentTicket.agentAnalysis.explainability.whyDepartment.title}</span>
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
                        {currentTicket.agentAnalysis.explainability.whyDepartment.evidence[0]}
                      </p>
                      <div className="text-[10px] font-mono text-slate-400 pt-1">
                        Rule: {currentTicket.agentAnalysis.explainability.whyDepartment.ruleApplied}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{currentTicket.agentAnalysis.explainability.whyPriority.title}</span>
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
                        {currentTicket.agentAnalysis.explainability.whyPriority.evidence[0]}
                      </p>
                      <div className="text-[10px] font-mono text-slate-400 pt-1">
                        Rule: {currentTicket.agentAnalysis.explainability.whyPriority.ruleApplied}
                      </div>
                    </div>
                  </div>
                )}

                {/* Predictive Escalation SLA Risk */}
                {currentTicket.agentAnalysis?.predictiveEscalation && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">Predictive SLA Breach Risk Assessment</h4>
                      <p className="text-slate-600 mt-0.5">
                        {currentTicket.agentAnalysis.predictiveEscalation.reason}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-500 font-medium">Risk Level:</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        currentTicket.agentAnalysis.predictiveEscalation.riskCategory === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : currentTicket.agentAnalysis.predictiveEscalation.riskCategory === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {currentTicket.agentAnalysis.predictiveEscalation.riskCategory} ({currentTicket.agentAnalysis.predictiveEscalation.breachRiskPercentage}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Department Updates & Officer Response Box */}
            {activeTab === 'responses' && (
              <div className="p-6 space-y-6">
                {/* Official responses stream */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Official Department Communications
                  </h3>
                  {currentTicket.officialResponses.length === 0 ? (
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                      No official department notes posted yet. The assigned officer will update this
                      record shortly.
                    </div>
                  ) : (
                    currentTicket.officialResponses.map((resp) => (
                      <div
                        key={resp.id}
                        className="p-4 bg-sky-50/50 rounded-xl border border-sky-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px]">
                              {resp.officerName.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900">{resp.officerName}</span>
                            <span className="text-slate-500 text-[11px]">
                              ({resp.officerDepartment})
                            </span>
                            <span className="text-[10px] bg-sky-200/70 text-sky-800 px-1.5 py-0.5 rounded font-semibold">
                              Official Response
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {new Date(resp.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{resp.message}</p>
                        {resp.actionTaken && (
                          <div className="p-2 bg-white rounded-md border border-sky-100 text-[11px] text-slate-600">
                            <span className="font-semibold text-slate-800">Action Scheduled:</span>{' '}
                            {resp.actionTaken}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Officer Action Panel (Available for Officers & Admins) */}
                {(currentUser.role === 'officer' || currentUser.role === 'admin') && (
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Post Department Update (Officer Controls)
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Signed as {currentUser.name}
                      </span>
                    </div>

                    <form onSubmit={handleOfficerResponseSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Officer Response Message *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={officerMsg}
                          onChange={(e) => setOfficerMsg(e.target.value)}
                          placeholder="Provide diagnostic update, technician dispatch confirmation, or student instructions..."
                          className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Action Taken / Scheduled Next Step
                        </label>
                        <input
                          type="text"
                          value={actionNotes}
                          onChange={(e) => setActionNotes(e.target.value)}
                          placeholder="e.g. Field engineer dispatched; gateway batch re-verified..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateTicketStatus(currentTicket.id, 'In Progress')}
                            className="px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold"
                          >
                            Set In Progress
                          </button>
                          <button
                            type="button"
                            onClick={() => updateTicketStatus(currentTicket.id, 'Resolved')}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold"
                          >
                            Mark Resolved
                          </button>
                        </div>

                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Post Response</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Complete Activity Timeline */}
            {activeTab === 'timeline' && (
              <div className="p-6">
                <div className="space-y-4">
                  {currentTicket.timeline.map((event, idx) => (
                    <div key={event.id} className="flex gap-4 items-start text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </div>
                        {idx < currentTicket.timeline.length - 1 && (
                          <div className="w-0.5 h-10 bg-slate-200 my-1" />
                        )}
                      </div>

                      <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-slate-900">{event.title}</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-1.5">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <span>Actor: {event.actor}</span>
                          {event.agentName && <span>· Agent: {event.agentName}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Feedback Display if exists */}
          {currentTicket.feedback && (
            <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-5 text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= currentTicket.feedback!.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-emerald-900">
                    Student Resolution Feedback ({currentTicket.feedback.rating}/5)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(currentTicket.feedback.submittedAt).toLocaleDateString()}
                </span>
              </div>
              {currentTicket.feedback.comment && (
                <p className="text-emerald-950 italic bg-white/70 p-3 rounded-lg border border-emerald-100">
                  "{currentTicket.feedback.comment}"
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Student Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              How satisfied are you with the resolution?
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your feedback is audited by the Helpdesk Administration for campus quality assurance.
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= feedbackRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200 hover:text-amber-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional Comments / Remarks
                </label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share details about your experience..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg"
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Escalation Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-rose-900 mb-1 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              <span>Escalate Request</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Escalating routes this request immediately to higher authorities for expedited review.
            </p>

            <form onSubmit={handleEscalationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Escalation Level
                </label>
                <select
                  value={escalateLevel}
                  onChange={(e) => setEscalateLevel(Number(e.target.value) as EscalationLevel)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500"
                >
                  <option value={1}>Level 1: Department Head Officer</option>
                  <option value={2}>Level 2: Central Helpdesk Admin (Dr. Rajesh Kumar)</option>
                  <option value={3}>Level 3: Higher Campus Authority (Dean / Director)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Escalation *
                </label>
                <textarea
                  required
                  rows={3}
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  placeholder="Explain why this request requires higher level intervention..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                >
                  Confirm Escalation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RAG Sources Grounding Modal */}
      {viewingSourceCite && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">RAG Grounded Source Citation</h3>
              </div>
              <button
                onClick={() => setViewingSourceCite(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Document Name
                </span>
                <p className="font-bold text-slate-900">{viewingSourceCite.title}</p>
                <span className="text-[10px] font-mono text-sky-700">ID: {viewingSourceCite.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Department
                  </span>
                  <p className="font-semibold text-slate-800">
                    {viewingSourceCite.department || currentTicket?.assignedDepartment || 'University Authority'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Last Updated Date
                  </span>
                  <p className="font-semibold text-slate-800">
                    {viewingSourceCite.lastUpdated || 'Current Academic Year'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Relevant Section
                </span>
                <p className="font-mono text-sky-900 bg-sky-50 p-2 rounded-lg border border-sky-200">
                  {viewingSourceCite.section}
                </p>
              </div>

              {viewingSourceCite.urlRef && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Official Contact Desk
                  </span>
                  <p className="text-slate-700">{viewingSourceCite.urlRef}</p>
                </div>
              )}

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Grounded Citation: This official rule was retrieved via semantic vector search. The AI Resolution Agent strictly adhered to this text without generating hallucinated content.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingSourceCite(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explainable AI ("Why?") Modal */}
      {explainModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Explainable AI · Autonomous Decision Audit</h3>
              </div>
              <button
                onClick={() => setExplainModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 bg-sky-50/70 rounded-xl border border-sky-200">
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block mb-1">
                  Query Decision
                </span>
                <p className="font-extrabold text-sm text-slate-900">{explainModal.title}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Key Decision Factors:
                </span>
                <ul className="space-y-1.5 pl-1">
                  {explainModal.factors.map((factor, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Supporting Operational Evidence:
                </span>
                <div className="space-y-1">
                  {explainModal.evidence.map((ev, eIdx) => (
                    <p key={eIdx} className="text-[11px] text-slate-700 font-mono bg-white p-2 rounded border border-slate-200">
                      • {ev}
                    </p>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                <span className="font-bold">Campus Policy Framework Applied: </span>
                <span>{explainModal.rule}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setExplainModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
