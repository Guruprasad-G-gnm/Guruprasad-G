import React, { useState } from 'react';
import { useHelpdesk } from '../context/HelpdeskContext';
import {
  Cpu,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building,
  Clock,
  Layers,
  ArrowRight,
  Smile,
  CopyCheck,
  BookOpen,
  Send,
  AlertOctagon,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { executeMultiAgentPipeline, TicketInput } from '../services/agentEngine';
import { MultiAgentAnalysis, TicketCategory, AgentStatus } from '../types';

export const MultiAgentWorkflowView: React.FC = () => {
  const { tickets, knowledgeBase, setCurrentView, setPrefillDraft } = useHelpdesk();

  // Interactive sandbox state
  const [sandboxPrompt, setSandboxPrompt] = useState('Wi-Fi not working in CSE block Room 302 during lab hours');
  const [sandboxCategory, setSandboxCategory] = useState<TicketCategory>('IT / Wi-Fi');
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [liveAgentStatuses, setLiveAgentStatuses] = useState<Record<string, AgentStatus>>({
    'Supervisor Agent': 'Waiting',
    'Sentiment Analysis Agent': 'Waiting',
    'Duplicate Detection Agent': 'Waiting',
    'Classification Agent': 'Waiting',
    'Routing Agent': 'Waiting',
    'Priority & Risk Agent': 'Waiting',
    'Knowledge Retrieval Agent': 'Waiting',
    'Response Generation Agent': 'Waiting',
    'Follow-up Monitoring Agent': 'Waiting',
    'Escalation Agent': 'Waiting',
  });
  const [sandboxResult, setSandboxResult] = useState<MultiAgentAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'workflow' | 'simulator' | 'agents-registry'>('workflow');

  const sampleScenarios = [
    { title: 'Wi-Fi Outage in CSE', cat: 'IT / Wi-Fi' as TicketCategory, prompt: 'Wi-Fi access point in CSE 3rd floor is unresponsive for 60 lab students.' },
    { title: 'Fee Refund / Receipt', cat: 'Fees & Finance' as TicketCategory, prompt: 'Fee payment receipt not generated after bank debit of $1,450. Urgent assistance needed.' },
    { title: 'Bus Route Delay', cat: 'Transport' as TicketCategory, prompt: 'Bus Route 14 arriving 30 minutes late consistently, missing 1st hour classes.' },
    { title: 'Hostel Room Fan', cat: 'Hostel' as TicketCategory, prompt: 'Ceiling fan regulator broken in Hostel Block B Room 214.' },
    { title: 'Exam Hall Ticket', cat: 'Examination' as TicketCategory, prompt: 'Exam hall ticket error for midterms starting tomorrow morning!' },
    { title: 'Perimeter Safety Alert', cat: 'Security' as TicketCategory, prompt: 'Exposed sparking streetlight base and dark walkway near South Gate 4.' },
  ];

  // The 10 Specialized Agents in the system
  const allTenAgents = [
    {
      id: 'supervisor',
      num: 1,
      name: 'Supervisor / Orchestrator Agent',
      shortName: 'Supervisor Agent',
      role: 'Master controller coordinating agent sequence, provisioning execution DAG, managing agent lifecycle, and formulating unified verdict.',
      tag: 'Orchestration Engine',
      icon: Cpu,
      color: 'bg-indigo-600',
    },
    {
      id: 'classification',
      num: 2,
      name: 'Request Classification Agent',
      shortName: 'Classification Agent',
      role: 'Understands student intent, identifies primary category, extracts hardware and location entities, and drafts concise issue synopsis.',
      tag: 'Entity & Intent Parser',
      icon: Layers,
      color: 'bg-blue-600',
    },
    {
      id: 'routing',
      num: 3,
      name: 'Department Routing Agent',
      shortName: 'Routing Agent',
      role: 'Maps request to official university administrative division, identifies duty officer in-charge, and documents explainable jurisdiction justification.',
      tag: 'Domain Dispatcher',
      icon: Building,
      color: 'bg-sky-600',
    },
    {
      id: 'priority',
      num: 4,
      name: 'Priority & Risk Agent',
      shortName: 'Priority Agent',
      role: 'Assesses multi-dimensional risk matrix (Life safety, Student cohort scale, Exam deadlines, Financial impact, Urgency) to assign SLA hours.',
      tag: 'Risk Matrix Evaluator',
      icon: Clock,
      color: 'bg-amber-600',
    },
    {
      id: 'knowledge',
      num: 5,
      name: 'Knowledge Retrieval Agent (RAG)',
      shortName: 'Knowledge Agent',
      role: 'Executes RAG pipeline against verified university handbooks using vector embeddings. Strictly prohibits policy fabrication.',
      tag: 'RAG Knowledge Engine',
      icon: BookOpen,
      color: 'bg-emerald-600',
    },
    {
      id: 'response',
      num: 6,
      name: 'Response Generation Agent',
      shortName: 'Response Agent',
      role: 'Synthesizes step-by-step guidance grounded strictly in retrieved knowledge base articles, with clear human technician dispatch flags.',
      tag: 'Grounded Guidance',
      icon: Send,
      color: 'bg-teal-600',
    },
    {
      id: 'followup',
      num: 7,
      name: 'Follow-up Monitoring Agent',
      shortName: 'Follow-up Agent',
      role: 'Tracks ticket timeline against SLA thresholds, schedules 50% milestone reminders, and dispatches automated officer notifications.',
      tag: 'SLA Lifecycle Tracker',
      icon: Clock,
      color: 'bg-purple-600',
    },
    {
      id: 'escalation',
      num: 8,
      name: 'Escalation Agent',
      shortName: 'Escalation Agent',
      role: 'Evaluates critical triggers, SLA breaches, and student appeals to escalate across Levels 1 (Officer), 2 (Admin), and 3 (Campus Director).',
      tag: 'Hierarchy Escalator',
      icon: AlertTriangle,
      color: 'bg-rose-600',
    },
    {
      id: 'sentiment',
      num: 9,
      name: 'Sentiment Analysis Agent',
      shortName: 'Sentiment Agent',
      role: 'Detects emotional tone (Positive, Neutral, Frustrated, Angry, Urgent), computes distress urgency score, and flags student dissatisfaction.',
      tag: 'Emotion & Urgency Monitor',
      icon: Smile,
      color: 'bg-pink-600',
    },
    {
      id: 'duplicate',
      num: 10,
      name: 'Duplicate Detection Agent',
      shortName: 'Duplicate Agent',
      role: 'Runs cosine similarity on dense embeddings against currently open tickets to prevent duplicate staff dispatch for known outages.',
      tag: 'Semantic Vector Matcher',
      icon: CopyCheck,
      color: 'bg-cyan-600',
    },
  ];

  // Visual order specified by user prompt
  const mainFlowOrder = [
    { label: 'User Request', sub: 'Student submits issue via portal or mobile', type: 'entry' },
    { agentKey: 'Supervisor Agent', agentId: 'supervisor', num: 1, name: 'Supervisor Agent', desc: 'Analyzes context & coordinates execution graph' },
    { agentKey: 'Classification Agent', agentId: 'classification', num: 2, name: 'Classification Agent', desc: 'Extracts domain, entities, and location' },
    { agentKey: 'Routing Agent', agentId: 'routing', num: 3, name: 'Routing Agent', desc: 'Directs request to authoritative department' },
    { agentKey: 'Priority & Risk Agent', agentId: 'priority', num: 4, name: 'Priority Agent', desc: 'Calculates risk factors & sets SLA target' },
    { agentKey: 'Knowledge Retrieval Agent', agentId: 'knowledge', num: 5, name: 'Knowledge Agent', desc: 'RAG retrieval with verified campus citations' },
    { agentKey: 'Response Generation Agent', agentId: 'response', num: 6, name: 'Response Agent', desc: 'Generates policy-grounded draft guidance' },
    { agentKey: 'Follow-up Monitoring Agent', agentId: 'followup', num: 7, name: 'Follow-up Agent', desc: 'Monitors progress & queues proactive reminders' },
    { agentKey: 'Escalation Agent', agentId: 'escalation', num: 8, name: 'Escalation Agent', desc: 'Elevates breached or critical tickets' },
    { label: 'Resolution', sub: 'Department action taken, student verified & rating collected', type: 'exit' },
  ];

  const handleRunSimulation = () => {
    setIsRunning(true);
    setSandboxResult(null);

    // Reset statuses to waiting
    const initialStatuses: Record<string, AgentStatus> = {
      'Supervisor Agent': 'Processing',
      'Sentiment Analysis Agent': 'Waiting',
      'Duplicate Detection Agent': 'Waiting',
      'Classification Agent': 'Waiting',
      'Routing Agent': 'Waiting',
      'Priority & Risk Agent': 'Waiting',
      'Knowledge Retrieval Agent': 'Waiting',
      'Response Generation Agent': 'Waiting',
      'Follow-up Monitoring Agent': 'Waiting',
      'Escalation Agent': 'Waiting',
    };
    setLiveAgentStatuses(initialStatuses);
    setActiveStepIndex(1);

    const testInput: TicketInput = {
      studentName: 'Simulation Sandbox Tester',
      registerNumber: 'SIM-2026-TEST',
      department: 'Computer Science and Engineering',
      year: '3rd Year',
      category: sandboxCategory,
      title: sandboxPrompt,
      description: sandboxPrompt,
      location: 'Campus Simulation Environment',
      preferredContact: 'Campus Email',
    };

    // Sequential step highlight simulation across the flow
    const flowKeys = [
      'Supervisor Agent',
      'Sentiment Analysis Agent',
      'Duplicate Detection Agent',
      'Classification Agent',
      'Routing Agent',
      'Priority & Risk Agent',
      'Knowledge Retrieval Agent',
      'Response Generation Agent',
      'Follow-up Monitoring Agent',
      'Escalation Agent',
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < flowKeys.length) {
        setActiveStepIndex(current + 1);
        setLiveAgentStatuses((prev) => {
          const updated = { ...prev };
          const prevKey = flowKeys[current - 1];
          const currKey = flowKeys[current];
          if (prevKey) updated[prevKey] = 'Completed';
          if (currKey) updated[currKey] = 'Processing';
          return updated;
        });
      } else {
        clearInterval(interval);
        const result = executeMultiAgentPipeline(testInput, tickets, knowledgeBase);
        setSandboxResult(result);
        setIsRunning(false);
        setActiveStepIndex(null);

        // Final statuses
        setLiveAgentStatuses({
          'Supervisor Agent': 'Completed',
          'Sentiment Analysis Agent': 'Completed',
          'Duplicate Detection Agent': 'Completed',
          'Classification Agent': 'Completed',
          'Routing Agent': 'Completed',
          'Priority & Risk Agent': 'Completed',
          'Knowledge Retrieval Agent': 'Completed',
          'Response Generation Agent': 'Completed',
          'Follow-up Monitoring Agent': 'Completed',
          'Escalation Agent': result.escalation.isEscalated ? 'Escalated' : 'Completed',
        });
      }
    }, 450);
  };

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
            Processing
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            Completed
          </span>
        );
      case 'Escalated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
            Escalated
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
            <AlertOctagon className="w-2.5 h-2.5 text-red-600" />
            Failed
          </span>
        );
      case 'Waiting':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            Waiting
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
          <Cpu className="w-4 h-4" />
          <span>Multi-Agent AI Orchestration</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              10-Agent Autonomous Campus Helpdesk System
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Specialized AI agents supervised by a central Orchestrator work concurrently to parse, route, prioritize, ground, and escalate campus tickets without hallucinations.
            </p>
          </div>

          {/* Navigation Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shrink-0 self-start">
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'workflow'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Execution Flowchart
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-white text-sky-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Sandbox
            </button>
            <button
              onClick={() => setActiveTab('agents-registry')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'agents-registry'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All 10 Agents Directory
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: VISUAL WORKFLOW FLOWCHART */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          {/* Status Legend */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Agent Status Legend:</span>
              <span className="text-slate-500">Live indicators during orchestration lifecycle:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge('Waiting')}
              {getStatusBadge('Processing')}
              {getStatusBadge('Completed')}
              {getStatusBadge('Escalated')}
              {getStatusBadge('Failed')}
            </div>
          </div>

          {/* User Specified Workflow Diagram */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Supervisor-Directed Resolution Pipeline
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual execution pipeline with dynamic Supervisor dispatch and verification checkpoints
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('simulator');
                  handleRunSimulation();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Pipeline</span>
              </button>
            </div>

            {/* Vertical Flow */}
            <div className="max-w-2xl mx-auto space-y-3">
              {mainFlowOrder.map((step, idx) => {
                if (step.type === 'entry') {
                  return (
                    <React.Fragment key={idx}>
                      <div className="p-4 bg-slate-900 text-white rounded-2xl text-center shadow-xs flex items-center justify-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sky-400">
                          1
                        </div>
                        <div className="text-left">
                          <h4 className="text-xs font-bold uppercase tracking-wider">{step.label}</h4>
                          <p className="text-[11px] text-slate-400">{step.sub}</p>
                        </div>
                      </div>
                      <div className="flex justify-center text-slate-400 py-1">
                        <ArrowDown className="w-4 h-4 animate-bounce" />
                      </div>
                    </React.Fragment>
                  );
                }

                if (step.type === 'exit') {
                  return (
                    <React.Fragment key={idx}>
                      <div className="flex justify-center text-slate-400 py-1">
                        <ArrowDown className="w-4 h-4" />
                      </div>
                      <div className="p-4 bg-emerald-600 text-white rounded-2xl text-center shadow-xs flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-200 shrink-0" />
                        <div className="text-left">
                          <h4 className="text-xs font-bold uppercase tracking-wider">{step.label}</h4>
                          <p className="text-[11px] text-emerald-100">{step.sub}</p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                }

                const currentStatus = step.agentKey ? liveAgentStatuses[step.agentKey] || 'Completed' : 'Completed';
                const isStepActive = activeStepIndex === step.num;

                return (
                  <React.Fragment key={idx}>
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        isStepActive
                          ? 'bg-sky-50 border-sky-400 shadow-md ring-2 ring-sky-300'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {step.num}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-bold text-slate-900">{step.name}</h3>
                              {step.agentId === 'supervisor' && (
                                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">
                                  Pipeline Controller
                                </span>
                              )}
                              {step.agentId === 'knowledge' && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                                  RAG Grounded
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{step.desc}</p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {getStatusBadge(currentStatus)}
                        </div>
                      </div>

                      {/* Sub-agents connected at Supervisor */}
                      {step.agentId === 'supervisor' && (
                        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2 bg-pink-50 border border-pink-200 rounded-lg flex items-center justify-between">
                            <span className="font-semibold text-pink-900 flex items-center gap-1">
                              <Smile className="w-3 h-3 text-pink-600" />
                              Sentiment Analysis Agent
                            </span>
                            {getStatusBadge(liveAgentStatuses['Sentiment Analysis Agent'] || 'Completed')}
                          </div>
                          <div className="p-2 bg-cyan-50 border border-cyan-200 rounded-lg flex items-center justify-between">
                            <span className="font-semibold text-cyan-900 flex items-center gap-1">
                              <CopyCheck className="w-3 h-3 text-cyan-600" />
                              Duplicate Detection Agent
                            </span>
                            {getStatusBadge(liveAgentStatuses['Duplicate Detection Agent'] || 'Completed')}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center text-slate-400 py-1">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE SIMULATION SANDBOX */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Multi-Agent Interactive Execution Sandbox</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Test how the 10 specialized agents coordinate in real time. Watch live status transitions, confidence scoring, RAG document retrieval, sentiment detection, and supervisor verdicts.
            </p>

            {/* Quick Template Scenarios */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-700 block mb-2">
                Click a realistic campus scenario to test:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {sampleScenarios.map((sc, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSandboxPrompt(sc.prompt);
                      setSandboxCategory(sc.cat);
                    }}
                    className={`p-2 rounded-lg text-left border text-[11px] transition-all ${
                      sandboxPrompt === sc.prompt
                        ? 'bg-sky-50 border-sky-400 text-sky-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate font-semibold">{sc.title}</div>
                    <div className="text-[10px] text-slate-500 truncate">{sc.cat}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sandbox Input Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Description & Prompt
                </label>
                <textarea
                  rows={2}
                  value={sandboxPrompt}
                  onChange={(e) => setSandboxPrompt(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none font-mono"
                  placeholder="Describe an issue to run across the 10 agents..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">Domain Category:</span>
                  <select
                    value={sandboxCategory}
                    onChange={(e) => setSandboxCategory(e.target.value as TicketCategory)}
                    className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="IT / Wi-Fi">IT / Wi-Fi</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Transport">Transport</option>
                    <option value="Fees & Finance">Fees & Finance</option>
                    <option value="Examination">Examination</option>
                    <option value="Security">Security</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Library">Library</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSandboxPrompt('');
                      setSandboxResult(null);
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleRunSimulation}
                    disabled={isRunning || !sandboxPrompt.trim()}
                    className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 disabled:opacity-50 flex items-center gap-2 shadow-xs"
                  >
                    {isRunning ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                        <span>Orchestrating Agents...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Execute 10-Agent Pipeline</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Agent Execution Monitor */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {allTenAgents.map((ag) => {
              const st = liveAgentStatuses[ag.shortName] || 'Waiting';
              return (
                <div
                  key={ag.id}
                  className={`p-3 rounded-xl border transition-all ${
                    st === 'Processing'
                      ? 'bg-amber-50 border-amber-300 shadow-md ring-2 ring-amber-200'
                      : st === 'Completed'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : st === 'Escalated'
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-mono text-[10px] text-slate-400">Agent {ag.num}</span>
                    {getStatusBadge(st)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{ag.shortName}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{ag.tag}</p>
                </div>
              );
            })}
          </div>

          {/* Simulation Output Dashboard */}
          {sandboxResult && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-fadeIn">
              {/* Supervisor Verdict Banner */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start gap-3">
                <Cpu className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      Supervisor / Orchestrator Agent Verdict
                    </h3>
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      DAG Complete
                    </span>
                  </div>
                  <p className="text-xs text-indigo-900 mt-1 font-medium leading-relaxed">
                    {sandboxResult.orchestrator?.supervisorVerdict || 'Orchestration pipeline execution complete.'}
                  </p>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    {sandboxResult.orchestrator?.orchestrationSummary}
                  </p>
                </div>
              </div>

              {/* Confidence & Sentiment Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Confidence */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Category Confidence
                  </div>
                  <div className="text-xl font-extrabold text-sky-700 mt-1">
                    {sandboxResult.confidenceDetails?.category.confidenceScore || 94}%
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {sandboxResult.classification.detectedCategory}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                    {sandboxResult.confidenceDetails?.category.reason}
                  </p>
                </div>

                {/* Department Confidence */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Department Routing
                  </div>
                  <div className="text-xl font-extrabold text-emerald-700 mt-1">
                    {sandboxResult.confidenceDetails?.department.confidenceScore || 92}%
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {sandboxResult.routing.assignedDepartment}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                    Officer: {sandboxResult.routing.assignedOfficer}
                  </p>
                </div>

                {/* Priority Confidence */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Assigned Priority
                  </div>
                  <div className="text-xl font-extrabold text-amber-700 mt-1">
                    {sandboxResult.priority.priority}
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    SLA: {sandboxResult.priority.slaHours} Hours
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                    Safety: {sandboxResult.priority.riskFactors.safetyRisk} · Urgency: {sandboxResult.priority.riskFactors.urgencyScore}/10
                  </p>
                </div>

                {/* Sentiment & Duplicates */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Sentiment & Duplicate
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                      {sandboxResult.sentiment?.sentiment || 'Neutral'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      (Urgency {sandboxResult.sentiment?.urgencyScore || 3}/10)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-2 font-medium">
                    {sandboxResult.duplicate?.isDuplicate
                      ? `⚠️ Similar to ticket ${sandboxResult.duplicate.duplicateTicketId} (${sandboxResult.duplicate.similarityScore}%)`
                      : '✅ No duplicate tickets detected.'}
                  </div>
                </div>
              </div>

              {/* RAG Knowledge Citations */}
              <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      RAG Knowledge Base Citations ({sandboxResult.retrieval.citations.length} retrieved)
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-mono">
                    Vector Relevance: {sandboxResult.retrieval.vectorSimilarityAverage || 95}%
                  </span>
                </div>

                {sandboxResult.retrieval.citations.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {sandboxResult.retrieval.citations.map((cite) => (
                      <div key={cite.id} className="p-3 bg-white rounded-lg border border-emerald-200 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                          <span>[{cite.id}] {cite.title}</span>
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                            {cite.section}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{cite.summary}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-800 italic">
                    Relevant campus information was not found in the campus knowledge base. Please contact the appropriate department.
                  </p>
                )}
              </div>

              {/* Generated Resolution Guidance */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Response Generation Agent Guidance
                </h3>
                <p className="text-xs font-semibold text-slate-800 mb-2">
                  {sandboxResult.resolution.recommendedSolution}
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-600">
                  {sandboxResult.resolution.stepByStepGuidance.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
                <p className="text-[10px] text-slate-400 italic mt-3 pt-2 border-t border-slate-200">
                  {sandboxResult.resolution.disclaimer}
                </p>
              </div>

              {/* Action: Send to Submit Form */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setPrefillDraft({
                      title: sandboxPrompt,
                      description: sandboxPrompt,
                      category: sandboxCategory,
                      location: 'Campus Simulation Area',
                    });
                    setCurrentView('submit_request');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-2 shadow-xs"
                >
                  <span>Create Real Ticket from this Simulation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALL 10 AGENTS DIRECTORY */}
      {activeTab === 'agents-registry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTenAgents.map((ag) => {
            const Icon = ag.icon;
            return (
              <div
                key={ag.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl ${ag.color} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Agent {ag.num}</div>
                        <h3 className="text-xs font-bold text-slate-900">{ag.name}</h3>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {ag.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ag.role}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono">Autonomous Execution</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
