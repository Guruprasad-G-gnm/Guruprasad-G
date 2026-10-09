import React, { useState, useEffect } from 'react';
import { useHelpdesk } from '../context/HelpdeskContext';
import { TicketCategory, Attachment } from '../types';
import { TicketInput } from '../services/agentEngine';
import {
  FilePlus2,
  Paperclip,
  X,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Sparkles,
  Bot,
  ShieldCheck,
  Building,
  AlertCircle,
  UploadCloud,
} from 'lucide-react';

export const TicketSubmissionForm: React.FC = () => {
  const {
    currentUser,
    createTicket,
    setCurrentView,
    setSelectedTicketId,
    prefillDraft,
    setPrefillDraft,
  } = useHelpdesk();

  const isStudentUser = currentUser.role === 'student';

  const [formData, setFormData] = useState<TicketInput>(() => ({
    studentName: isStudentUser ? currentUser.name : '',
    registerNumber: isStudentUser ? currentUser.idNumber : '',
    department: isStudentUser ? currentUser.department : 'Computer Science and Engineering',
    year: isStudentUser ? (currentUser.year || '3rd Year') : '3rd Year',
    category: 'IT / Wi-Fi',
    title: '',
    description: '',
    location: '',
    preferredContact: 'Campus Email',
  }));

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [liveGeneratedTicketId, setLiveGeneratedTicketId] = useState<string | null>(null);

  // When currentUser changes (e.g. role switched), adjust studentName & registerNumber
  useEffect(() => {
    if (currentUser.role !== 'student') {
      // Administrator / Staff / Officer: do NOT fill Dr. Rajesh Kumar or admin ID into student fields!
      // If the field currently contains the admin's own name, clear it so they can input the actual student's details
      setFormData((prev) => {
        if (prev.studentName === currentUser.name || prev.registerNumber === currentUser.idNumber) {
          return {
            ...prev,
            studentName: '',
            registerNumber: '',
          };
        }
        return prev;
      });
    } else {
      // Student: fill their own verified credentials
      setFormData((prev) => ({
        ...prev,
        studentName: currentUser.name,
        registerNumber: currentUser.idNumber,
        department: currentUser.department,
        year: currentUser.year || '3rd Year',
      }));
    }
  }, [currentUser]);

  // Apply prefill if came from AI chat
  useEffect(() => {
    if (prefillDraft) {
      setFormData((prev) => ({
        ...prev,
        ...prefillDraft,
      }));
      setPrefillDraft(null);
    }
  }, [prefillDraft, setPrefillDraft]);

  const categories: TicketCategory[] = [
    'Academic',
    'Examination',
    'Fees & Finance',
    'Hostel',
    'Transport',
    'Library',
    'IT / Wi-Fi',
    'Maintenance',
    'Security',
    'Canteen',
    'Scholarship',
    'Certificates',
    'Other',
  ];

  const collegeDepartments = [
    'Computer Science and Engineering',
    'Electronics and Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
    'Electrical & Electronics',
    'Biotechnology',
    'Management Studies (MBA)',
  ];

  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate / Research'];

  const quickScenarios = [
    {
      label: 'Wi-Fi Outage in CSE',
      cat: 'IT / Wi-Fi' as TicketCategory,
      title: 'Wi-Fi connectivity completely down in CSE block Lab 3',
      desc: 'All lab workstations and student laptops in CSE block Room 302 are disconnected from Campus-Secure AP. Practical examination is scheduled for tomorrow.',
      loc: 'CSE Block, 3rd Floor, Lab 3',
    },
    {
      label: 'Exam Hall Ticket Error',
      cat: 'Examination' as TicketCategory,
      title: 'Hall ticket showing attendance lock for CS-402',
      desc: 'Portal shows attendance below 75% for CS-402, but instructor approved 82% attendance slip. Exam commences tomorrow morning at 9:00 AM.',
      loc: 'Examination Online Portal',
    },
    {
      label: 'Hostel Maintenance',
      cat: 'Hostel' as TicketCategory,
      title: 'Hostel Block B room ceiling fan not working',
      desc: 'Ceiling fan in room 114 has stopped spinning and the regulator switch is stuck. Request duty electrician inspection.',
      loc: 'Hostel Block B, Room 114',
    },
    {
      label: 'Fee Receipt Missing',
      cat: 'Fees & Finance' as TicketCategory,
      title: 'Tuition fee debited but receipt not generated',
      desc: 'Paid semester tuition fee of $1,450 via NetBanking (Ref: UTR-98218172). Bank debited yesterday but portal shows fee status pending.',
      loc: 'Student Accounts ERP',
    },
    {
      label: 'Campus Security Alert',
      cat: 'Security' as TicketCategory,
      title: 'Streetlight pole sparking near South Gate walkway',
      desc: 'Perimeter pathway streetlight near South Gate 4 has tripped and sparked at base. Pathway is pitch dark and hazardous for evening pedestrians.',
      loc: 'Perimeter Walkway near South Gate 4',
    },
  ];

  const handleApplyScenario = (sc: typeof quickScenarios[0]) => {
    setFormData((prev) => ({
      ...prev,
      category: sc.cat,
      title: sc.title,
      description: sc.desc,
      location: sc.loc,
    }));
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newAtt: Attachment = {
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type || 'document',
      };
      setAttachments((prev) => [...prev, newAtt]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    setIsSubmitting(true);
    setPipelineStep(1);

    // Simulate multi-agent sequential execution steps for maximum transparency and clarity
    const stepInterval = setInterval(() => {
      setPipelineStep((prev) => {
        if (prev < 7) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 450);

    try {
      const newTicket = await createTicket(formData, attachments);
      setLiveGeneratedTicketId(newTicket.id);

      setTimeout(() => {
        setIsSubmitting(false);
        setSelectedTicketId(newTicket.id);
        setCurrentView('track_ticket');
      }, 3400);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      clearInterval(stepInterval);
    }
  };

  const pipelineSteps = [
    { num: 1, name: 'Classification Agent', desc: 'Understanding issue semantics & duplicate detection' },
    { num: 2, name: 'Department Routing Agent', desc: 'Determining responsible campus division & lead officer' },
    { num: 3, name: 'Information Retrieval Agent', desc: 'Querying verified campus regulations & knowledge base' },
    { num: 4, name: 'Priority Assessment Agent', desc: 'Evaluating safety risks, cohort impact, & SLA deadlines' },
    { num: 5, name: 'Resolution Agent', desc: 'Synthesizing verified guidance & human dispatch needs' },
    { num: 6, name: 'Follow-up Agent', desc: 'Configuring automated reminder checkpoints' },
    { num: 7, name: 'Escalation Agent', desc: 'Auditing critical threshold rules & supervisory escalation' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
          <FilePlus2 className="w-4 h-4" />
          <span>Campus Intake System</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Submit Campus Issue or Request
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Our Multi-Agent AI system will immediately classify, route, retrieve verified university
          guidelines, and assign priority to your request.
        </p>
      </div>

      {/* Quick Scenario Templates */}
      <div className="bg-slate-100/80 rounded-xl p-3 border border-slate-200">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Quick Test Scenarios
          </span>
          <span className="text-[10px] text-slate-500">Click any scenario to auto-fill</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickScenarios.map((sc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyScenario(sc)}
              className="text-[11px] font-medium px-2.5 py-1 bg-white hover:bg-sky-50 hover:text-sky-800 hover:border-sky-300 text-slate-700 rounded-lg border border-slate-200 transition-colors"
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Intake Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Student Details Section */}
        <div>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Student / Requester Information
              </h2>
              <p className="text-[11px] text-slate-500">
                {currentUser.role === 'student'
                  ? `Logged in as registered student: ${currentUser.name}`
                  : `Administrator Mode (${currentUser.name}): Enter student credentials on whose behalf you are lodging this request.`}
              </p>
            </div>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                currentUser.role === 'student'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {currentUser.role === 'student' ? 'Student Profile' : 'Admin Intake Mode'}
            </span>
          </div>

          {currentUser.role !== 'student' && (
            <div className="mb-4 p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px]">
                <strong>Notice:</strong> As an Administrator, your name is not auto-filled. Input the actual student's details below or pick a student:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                <span className="text-[10px] text-amber-700 font-semibold">Quick Student Fill:</span>
                {[
                  { name: 'Aarav Sharma', reg: '2023CSE1042', dept: 'Computer Science and Engineering', yr: '3rd Year' },
                  { name: 'Sneha Patel', reg: '2024ECE2091', dept: 'Electronics and Communication', yr: '2nd Year' },
                  { name: 'Vikram Joshi', reg: '2023MECH3011', dept: 'Mechanical Engineering', yr: '3rd Year' },
                ].map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        studentName: s.name,
                        registerNumber: s.reg,
                        department: s.dept,
                        year: s.yr,
                      }))
                    }
                    className="text-[10px] font-medium px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-900 rounded border border-amber-300 transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Name *
              </label>
              <input
                type="text"
                required
                placeholder={currentUser.role === 'student' ? 'Student Name' : 'Enter actual student name (e.g. Aarav Sharma)'}
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Register Number *
              </label>
              <input
                type="text"
                required
                placeholder={currentUser.role === 'student' ? 'Register Number' : 'e.g. 2023CSE1042'}
                value={formData.registerNumber}
                onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500"
              >
                {collegeDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year *</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Issue Details Section */}
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Issue Particulars
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as TicketCategory })
                  }
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Location / Facility *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE Block Rm 302, Hostel B Rm 114, Route 14..."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                required
                placeholder="Concise summary of the request or problem..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Explain the specific issue, who is affected, when it started, and any error messages..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Contact Method
                </label>
                <select
                  value={formData.preferredContact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredContact: e.target.value as any,
                    })
                  }
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Campus Email">Campus Email</option>
                  <option value="Phone/SMS">Phone / SMS</option>
                  <option value="In-Person Desk">In-Person Helpdesk Window</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attach Screenshots or Documents
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors">
                    <UploadCloud className="w-4 h-4 text-slate-500" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      onChange={handleSimulatedFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.txt,.log"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">PNG, JPG, PDF up to 10MB</span>
                </div>
              </div>
            </div>

            {/* Uploaded attachments preview */}
            {attachments.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Attached Files:</p>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((att, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200 text-xs text-slate-700"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium truncate max-w-[160px]">{att.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(i)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted with institutional student credentials</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
          >
            <span>Submit Request & Run Multi-Agent AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Live Multi-Agent Execution Progress Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 mx-auto flex items-center justify-center mb-3">
                <Cpu className="w-6 h-6 animate-spin" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Multi-Agent AI Pipeline In Progress
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Collaborating across 7 autonomous AI agents for verified resolution
              </p>
            </div>

            {/* Steps list */}
            <div className="space-y-2.5 mb-6">
              {pipelineSteps.map((step) => {
                const isDone = pipelineStep > step.num;
                const isCurrent = pipelineStep === step.num;
                return (
                  <div
                    key={step.num}
                    className={`p-2.5 rounded-xl border flex items-center gap-3 transition-colors ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : isCurrent
                        ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-sky-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold leading-tight">{step.name}</div>
                      <div className="text-[11px] opacity-80 truncate">{step.desc}</div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-sky-200 text-sky-800 shrink-0">
                        Analyzing...
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {liveGeneratedTicketId && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <p className="text-xs text-emerald-800 font-semibold">
                  Unique Ticket ID Generated:
                </p>
                <p className="text-base font-mono font-extrabold text-emerald-900">
                  {liveGeneratedTicketId}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
