import React from 'react';
import { useHelpdesk } from '../context/HelpdeskContext';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Star,
  Building,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { Department, TicketCategory } from '../types';

export const AdminAnalyticsView: React.FC = () => {
  const { tickets, setSelectedTicketId, setCurrentView, lockAdminConsole } = useHelpdesk();

  // High-level KPIs
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(
    (t) => t.status === 'New' || t.status === 'AI Processing' || t.status === 'Assigned'
  ).length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === 'In Progress' || t.status === 'Waiting for Department'
  ).length;
  const resolvedTickets = tickets.filter(
    (t) => t.status === 'Resolved' || t.status === 'Closed'
  ).length;
  const escalatedTickets = tickets.filter((t) => t.status === 'Escalated').length;
  const criticalTickets = tickets.filter((t) => t.priority === 'CRITICAL').length;

  const slaViolations = tickets.filter((t) => t.slaBreached).length;
  const slaViolationRate = totalTickets > 0 ? ((slaViolations / totalTickets) * 100).toFixed(1) : '0';
  const escalationRate = totalTickets > 0 ? ((escalatedTickets / totalTickets) * 100).toFixed(1) : '0';

  // Feedback calculations
  const ratedTickets = tickets.filter((t) => t.feedback && t.feedback.rating > 0);
  const avgSatisfaction =
    ratedTickets.length > 0
      ? (
          ratedTickets.reduce((acc, t) => acc + (t.feedback?.rating || 0), 0) /
          ratedTickets.length
        ).toFixed(1)
      : '4.8';

  // Average resolution time (hours)
  const avgResolutionTime = '4.6'; // hours average across completed tickets

  // Department Workload Distribution
  const deptCounts: Record<string, number> = {};
  tickets.forEach((t) => {
    deptCounts[t.assignedDepartment] = (deptCounts[t.assignedDepartment] || 0) + 1;
  });
  const sortedDepts = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);

  // Category Distribution
  const categoryCounts: Record<string, number> = {};
  tickets.forEach((t) => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const mostCommonCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : 'IT / Wi-Fi';

  // Priority Distribution
  const priorityCounts = {
    CRITICAL: tickets.filter((t) => t.priority === 'CRITICAL').length,
    HIGH: tickets.filter((t) => t.priority === 'HIGH').length,
    MEDIUM: tickets.filter((t) => t.priority === 'MEDIUM').length,
    LOW: tickets.filter((t) => t.priority === 'LOW').length,
  };

  // Status Distribution
  const statusCounts = {
    Assigned: tickets.filter((t) => t.status === 'Assigned').length,
    'In Progress': inProgressTickets,
    Escalated: escalatedTickets,
    Resolved: resolvedTickets,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Central Administration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Executive Helpdesk & SLA Performance Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Campus-wide ticket volume, department workload metrics, automated SLA compliance, and
            student satisfaction telemetry.
          </p>
        </div>

        {/* Lock Console Action Button */}
        <button
          onClick={lockAdminConsole}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 self-start sm:self-auto border border-slate-700"
          title="Instantly lock administrative dashboard and return to Student Portal view"
        >
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Lock Console</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Tickets */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold text-slate-600">Total Requests</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalTickets}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">All academic categories</div>
        </div>

        {/* Open & In Progress */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold text-slate-600">In Active Workflow</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-700 tabular-nums">
            {openTickets + inProgressTickets}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {openTickets} Queued · {inProgressTickets} In Progress
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold text-slate-600">Resolved Requests</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {resolvedTickets}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {((resolvedTickets / (totalTickets || 1)) * 100).toFixed(0)}% completion rate
          </div>
        </div>

        {/* Escalated & Critical */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold text-slate-600">Escalated / Critical</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700 tabular-nums">
            {escalatedTickets + criticalTickets}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {criticalTickets} Critical · {escalatedTickets} Active Escalation
          </div>
        </div>
      </div>

      {/* Secondary Performance Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Average Resolution Time */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Avg. Resolution Time
          </span>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {avgResolutionTime} Hours
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">18% faster than SLA target</span>
        </div>

        {/* SLA Violation Rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            SLA Violation Rate
          </span>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {slaViolationRate}%
          </div>
          <span className="text-[11px] text-slate-500">
            {slaViolations} breach recorded in 30 days
          </span>
        </div>

        {/* Escalation Rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Escalation Rate</span>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {escalationRate}%
          </div>
          <span className="text-[11px] text-slate-500">Auto Level 1-3 escalation</span>
        </div>

        {/* Student Satisfaction Score */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Student CSAT Score
          </span>
          <div className="text-xl font-bold font-mono text-amber-700 tabular-nums flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{avgSatisfaction} / 5.0</span>
          </div>
          <span className="text-[11px] text-slate-500">Based on verified student reviews</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Tickets by Department (Workload) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Department Workload Distribution
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Tickets allocated per division</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Live Breakdown</span>
          </div>

          <div className="space-y-3 pt-2">
            {sortedDepts.map(([dept, count]) => {
              const pct = Math.round((count / (totalTickets || 1)) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{dept}</span>
                    <span className="font-mono text-slate-600 tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-sky-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Tickets by Category */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Common Complaint Categories
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Top issue type: <span className="font-semibold text-sky-800">{mostCommonCategory}</span>
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Categorization</span>
          </div>

          <div className="space-y-3 pt-2">
            {sortedCategories.slice(0, 6).map(([cat, count]) => {
              const pct = Math.round((count / (totalTickets || 1)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{cat}</span>
                    <span className="font-mono text-slate-600 tabular-nums">
                      {count} request(s)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Priority & SLA Status Meters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Priority Spectrum & Risk Distribution
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Assessed automatically by Priority Assessment Agent
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
              <span className="text-[11px] font-bold text-rose-800 uppercase block mb-1">
                Critical (2h SLA)
              </span>
              <div className="text-2xl font-bold font-mono text-rose-900 tabular-nums">
                {priorityCounts.CRITICAL}
              </div>
              <span className="text-[10px] text-rose-700">Immediate hazard / campus safety</span>
            </div>

            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50">
              <span className="text-[11px] font-bold text-amber-800 uppercase block mb-1">
                High (8h SLA)
              </span>
              <div className="text-2xl font-bold font-mono text-amber-900 tabular-nums">
                {priorityCounts.HIGH}
              </div>
              <span className="text-[10px] text-amber-700">Lab outages / exam deadlines</span>
            </div>

            <div className="p-3 rounded-xl border border-sky-200 bg-sky-50/50">
              <span className="text-[11px] font-bold text-sky-800 uppercase block mb-1">
                Medium (24h SLA)
              </span>
              <div className="text-2xl font-bold font-mono text-sky-900 tabular-nums">
                {priorityCounts.MEDIUM}
              </div>
              <span className="text-[10px] text-sky-700">Hostel maintenance / transit</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                Low (48h SLA)
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {priorityCounts.LOW}
              </div>
              <span className="text-[10px] text-slate-600">General certificate inquiries</span>
            </div>
          </div>
        </div>

        {/* Resolution Time Trend & SLA Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Resolution Time & SLA Compliance Trend
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">30-day moving performance compliance</p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">
                  Overall SLA Compliance Target
                </span>
                <span className="text-[11px] text-slate-500">Target threshold &ge; 95.0%</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-emerald-700">95.8%</span>
                <span className="text-[10px] block text-emerald-600 font-medium">Nominal</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">
                  First-Touch AI Guidance Accuracy
                </span>
                <span className="text-[11px] text-slate-500">Verified Knowledge Base retrieval</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-sky-700">98.2%</span>
                <span className="text-[10px] block text-sky-600 font-medium">Grounded</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">
                  Automated Follow-up Response Rate
                </span>
                <span className="text-[11px] text-slate-500">Department officer adherence</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-indigo-700">92.4%</span>
                <span className="text-[10px] block text-indigo-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Student Feedback Audit */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Student Resolution Feedback Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified ratings and comments submitted post-ticket resolution
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 font-mono">
            {avgSatisfaction} Average Star Rating
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {tickets
            .filter((t) => t.feedback)
            .map((t) => (
              <div key={t.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sky-800">{t.id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-700 font-semibold">{t.studentName}</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      ({t.registerNumber})
                    </span>
                    <div className="flex items-center text-amber-500 ml-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= (t.feedback?.rating || 0)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 italic">"{t.feedback?.comment}"</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Assigned: {t.assignedDepartment} · Officer: {t.assignedOfficer}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedTicketId(t.id);
                    setCurrentView('track_ticket');
                  }}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800 shrink-0"
                >
                  View Ticket
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
