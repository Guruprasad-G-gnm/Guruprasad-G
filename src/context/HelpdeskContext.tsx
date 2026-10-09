import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Ticket,
  KnowledgeArticle,
  CampusNotification,
  UserRole,
  ActiveUser,
  TicketStatus,
  EscalationLevel,
  DepartmentResponse,
  TicketFeedback,
  Attachment,
  TimelineEvent,
  Department,
} from '../types';
import { INITIAL_TICKETS } from '../data/mockTickets';
import { INITIAL_KNOWLEDGE_BASE } from '../data/mockKnowledgeBase';
import { INITIAL_NOTIFICATIONS } from '../data/mockNotifications';
import { TicketInput, executeMultiAgentPipeline } from '../services/agentEngine';

export type AppView =
  | 'student_dashboard'
  | 'submit_request'
  | 'track_ticket'
  | 'agent_workflow'
  | 'department_dashboard'
  | 'admin_dashboard'
  | 'knowledge_base'
  | 'chat_assistant';

interface HelpdeskContextType {
  tickets: Ticket[];
  knowledgeBase: KnowledgeArticle[];
  notifications: CampusNotification[];
  currentUser: ActiveUser;
  currentView: AppView;
  selectedTicketId: string | null;
  searchQuery: string;
  isChatOpen: boolean;
  isNotifOpen: boolean;

  // Navigation & UI controls
  setCurrentView: (view: AppView) => void;
  setSelectedTicketId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  switchUserRole: (role: UserRole) => void;
  setIsChatOpen: (open: boolean) => void;
  setIsNotifOpen: (open: boolean) => void;

  // Ticket actions
  createTicket: (input: TicketInput, attachments?: Attachment[]) => Promise<Ticket>;
  updateTicketStatus: (ticketId: string, newStatus: TicketStatus, notes?: string) => void;
  addOfficialResponse: (ticketId: string, responseMessage: string, actionTaken?: string) => void;
  escalateTicket: (ticketId: string, level: EscalationLevel, reason: string) => void;
  rerouteTicket: (ticketId: string, newDepartment: Department, reason?: string) => void;
  submitFeedback: (ticketId: string, rating: number, comment?: string) => void;
  getTicketById: (id: string) => Ticket | undefined;

  // Knowledge base actions
  addKBArticle: (article: Omit<KnowledgeArticle, 'id' | 'lastUpdated' | 'isVerified'>) => void;
  updateKBArticle: (id: string, updates: Partial<KnowledgeArticle>) => void;
  deleteKBArticle: (id: string) => void;

  // Notifications actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  // Chat pre-fill helper
  prefillDraft: Partial<TicketInput> | null;
  setPrefillDraft: (draft: Partial<TicketInput> | null) => void;

  // Hidden admin access controls (openadmin777 mechanism)
  isAdminUnlocked: boolean;
  unlockAdminConsole: () => void;
  lockAdminConsole: () => void;
}

const STORAGE_KEYS = {
  TICKETS: 'campus_helpdesk_tickets_v1',
  KB: 'campus_helpdesk_kb_v1',
  NOTIFS: 'campus_helpdesk_notifs_v1',
};

const DEFAULT_USERS: Record<UserRole, ActiveUser> = {
  student: {
    role: 'student',
    name: 'Aarav Sharma',
    idNumber: '2023CSE1042',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    email: 'aarav.sharma@campus.edu',
    avatarInitials: 'AS',
  },
  staff: {
    role: 'staff',
    name: 'Prof. Priya Nair',
    idNumber: 'FAC-8092',
    department: 'Electronics & Communication',
    email: 'priya.nair@campus.edu',
    avatarInitials: 'PN',
  },
  admin: {
    role: 'admin',
    name: 'Dr. Rajesh Kumar',
    idNumber: 'ADM-001',
    department: 'Central Campus Administration',
    email: 'rajesh.kumar@campus.edu',
    avatarInitials: 'RK',
  },
  officer: {
    role: 'officer',
    name: 'S. Murugan',
    idNumber: 'OFF-IT-42',
    department: 'IT Services',
    email: 'murugan.it@campus.edu',
    avatarInitials: 'SM',
  },
};

const HelpdeskContext = createContext<HelpdeskContextType | undefined>(undefined);

export const HelpdeskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading tickets from storage', e);
    }
    return INITIAL_TICKETS;
  });

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KB);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading KB from storage', e);
    }
    return INITIAL_KNOWLEDGE_BASE;
  });

  const [notifications, setNotifications] = useState<CampusNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<ActiveUser>(DEFAULT_USERS.student);
  const [currentView, setCurrentView] = useState<AppView>('student_dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>('CHD-2026-0001');
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [prefillDraft, setPrefillDraft] = useState<Partial<TicketInput> | null>(null);

  // Hidden Admin Console Access Controls (starts strictly false / student portal view)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);

  const unlockAdminConsole = () => {
    setIsAdminUnlocked(true);
    setCurrentUser(DEFAULT_USERS.admin);
    setCurrentView('admin_dashboard');
    const unlockNotif: CampusNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Admin Console Unlocked',
      message: 'Access granted via security sequence "openadmin777". Administrative controls active.',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'status_change',
      level: 'warning',
    };
    setNotifications((prev) => [unlockNotif, ...prev]);
  };

  const lockAdminConsole = () => {
    setIsAdminUnlocked(false);
    setCurrentUser(DEFAULT_USERS.student);
    setCurrentView('student_dashboard');
    const lockNotif: CampusNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Console Locked',
      message: 'Securely returned to Student Portal view. Admin access locked.',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'status_change',
      level: 'info',
    };
    setNotifications((prev) => [lockNotif, ...prev]);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch (e) {
      console.error('Could not save tickets', e);
    }
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.KB, JSON.stringify(knowledgeBase));
    } catch (e) {
      console.error('Could not save KB', e);
    }
  }, [knowledgeBase]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Could not save notifications', e);
    }
  }, [notifications]);

  const switchUserRole = (role: UserRole) => {
    if (role === 'admin' && !isAdminUnlocked) {
      // Hidden admin cannot be switched to without secret unlock
      return;
    }
    setCurrentUser(DEFAULT_USERS[role]);
    if (role === 'admin') {
      setCurrentView('admin_dashboard');
    } else if (role === 'officer') {
      setCurrentView('department_dashboard');
    } else {
      setCurrentView('student_dashboard');
    }
  };

  const getTicketById = (id: string): Ticket | undefined => {
    return tickets.find((t) => t.id.toLowerCase() === id.toLowerCase());
  };

  // Create ticket using multi-agent pipeline
  const createTicket = async (input: TicketInput, attachments: Attachment[] = []): Promise<Ticket> => {
    // 1. Run Multi-Agent Analysis
    const agentAnalysis = executeMultiAgentPipeline(input, tickets, knowledgeBase);

    // 2. Generate unique Ticket ID: CHD-2026-0008 etc.
    const year = new Date().getFullYear();
    const existingSeqNumbers = tickets.map((t) => {
      const match = t.id.match(/\d+$/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxSeq = existingSeqNumbers.length > 0 ? Math.max(...existingSeqNumbers) : 0;
    const nextSeq = String(maxSeq + 1).padStart(4, '0');
    const ticketId = `CHD-${year}-${nextSeq}`;

    // 3. Expected Resolution Date
    const createdAt = new Date().toISOString();
    const slaMs = agentAnalysis.priority.slaHours * 60 * 60 * 1000;
    const expectedResolutionTime = new Date(Date.now() + slaMs).toISOString();

    const initialTimeline: TimelineEvent[] = [
      {
        id: `TL-${Date.now()}-1`,
        timestamp: createdAt,
        title: 'Ticket Submitted',
        description: `Request submitted by ${input.studentName} (${input.registerNumber}).`,
        actor: 'Student' as const,
        type: 'creation' as const,
      },
      {
        id: `TL-${Date.now()}-2`,
        timestamp: createdAt,
        title: 'Classification Agent Executed',
        description: `Classified as ${agentAnalysis.classification.detectedCategory}. Summary: "${agentAnalysis.classification.summary}"`,
        actor: 'AI Agent' as const,
        agentName: 'Request Classification Agent',
        type: 'ai_step' as const,
      },
      {
        id: `TL-${Date.now()}-3`,
        timestamp: createdAt,
        title: 'Department Routing Agent Assigned',
        description: `Auto-routed to ${agentAnalysis.routing.assignedDepartment} (Lead Officer: ${agentAnalysis.routing.assignedOfficer}). Reason: ${agentAnalysis.routing.routingJustification}`,
        actor: 'AI Agent' as const,
        agentName: 'Department Routing Agent',
        type: 'routing' as const,
      },
      {
        id: `TL-${Date.now()}-4`,
        timestamp: createdAt,
        title: 'Information Retrieval Agent Verified',
        description: agentAnalysis.retrieval.retrievalSummary,
        actor: 'AI Agent' as const,
        agentName: 'Information Retrieval Agent',
        type: 'ai_step' as const,
      },
      {
        id: `TL-${Date.now()}-5`,
        timestamp: createdAt,
        title: `Priority Assessed: ${agentAnalysis.priority.priority}`,
        description: `${agentAnalysis.priority.reasoning} SLA Target: ${agentAnalysis.priority.slaHours} hours.`,
        actor: 'AI Agent' as const,
        agentName: 'Priority Assessment Agent',
        type: 'ai_step' as const,
      },
      {
        id: `TL-${Date.now()}-6`,
        timestamp: createdAt,
        title: 'Resolution Agent Generated Guidance',
        description: `Self-service feasible: ${agentAnalysis.resolution.isSelfServicePossible ? 'Yes' : 'No'}. Human intervention required: ${agentAnalysis.resolution.requiresHumanIntervention ? 'Yes' : 'No'}.`,
        actor: 'AI Agent' as const,
        agentName: 'Resolution Agent',
        type: 'ai_step' as const,
      },
    ];

    if (agentAnalysis.escalation.isEscalated) {
      initialTimeline.push({
        id: `TL-${Date.now()}-7`,
        timestamp: createdAt,
        title: `Escalation Agent: Level ${agentAnalysis.escalation.escalationLevel} Triggered`,
        description: agentAnalysis.escalation.escalationReason || 'Automatic escalation rule triggered.',
        actor: 'AI Agent' as const,
        agentName: 'Escalation Agent',
        type: 'escalation' as const,
      });
    }

    const newTicket: Ticket = {
      id: ticketId,
      title: input.title,
      description: input.description,
      category: agentAnalysis.classification.detectedCategory,
      location: input.location,
      preferredContact: input.preferredContact,
      attachments,
      studentName: input.studentName,
      registerNumber: input.registerNumber,
      studentDepartment: input.department,
      studentYear: input.year,
      studentEmail: `${input.registerNumber.toLowerCase()}@campus.edu`,
      status: agentAnalysis.escalation.isEscalated ? 'Escalated' : 'Assigned',
      priority: agentAnalysis.priority.priority,
      assignedDepartment: agentAnalysis.routing.assignedDepartment,
      assignedOfficer: agentAnalysis.routing.assignedOfficer,
      createdAt,
      lastUpdatedAt: createdAt,
      expectedResolutionTime,
      slaBreached: false,
      agentAnalysis,
      officialResponses: [],
      timeline: initialTimeline,
    };

    setTickets((prev) => [newTicket, ...prev]);

    // Dispatch notification
    const newNotif: CampusNotification = {
      id: `NOTIF-${Date.now()}`,
      ticketId,
      title: `Ticket ${ticketId} Created & Assigned`,
      message: `Your request "${input.title}" was processed by Multi-Agent AI and routed to ${agentAnalysis.routing.assignedDepartment}.`,
      timestamp: createdAt,
      read: false,
      type: 'submitted',
      level: agentAnalysis.priority.priority === 'CRITICAL' ? 'danger' : 'info',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newTicket;
  };

  // Update status
  const updateTicketStatus = (ticketId: string, newStatus: TicketStatus, notes?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const timestamp = new Date().toISOString();
          const newEvent = {
            id: `TL-${Date.now()}`,
            timestamp,
            title: `Status Changed to ${newStatus}`,
            description: notes || `Status updated to ${newStatus} by ${currentUser.name} (${currentUser.role}).`,
            actor: (currentUser.role === 'student'
              ? 'Student'
              : currentUser.role === 'admin'
              ? 'Helpdesk Admin'
              : 'Department Officer') as any,
            type: 'status_change' as const,
          };
          return {
            ...t,
            status: newStatus,
            lastUpdatedAt: timestamp,
            timeline: [...t.timeline, newEvent],
          };
        }
        return t;
      })
    );

    // Notification
    const notif: CampusNotification = {
      id: `NOTIF-${Date.now()}`,
      ticketId,
      title: `Ticket ${ticketId} Status: ${newStatus}`,
      message: `Status updated to ${newStatus} by ${currentUser.name}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: newStatus === 'Resolved' ? 'resolved' : 'status_change',
      level: newStatus === 'Resolved' ? 'success' : 'info',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Add official department response
  const addOfficialResponse = (ticketId: string, message: string, actionTaken?: string) => {
    const timestamp = new Date().toISOString();
    const response: DepartmentResponse = {
      id: `RESP-${Date.now()}`,
      officerName: currentUser.name,
      officerDepartment: (currentUser.department as any) || 'IT Services',
      message,
      actionTaken,
      timestamp,
      isOfficial: true,
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newEvent = {
            id: `TL-${Date.now()}`,
            timestamp,
            title: 'Official Department Response Posted',
            description: `${currentUser.name} responded: "${message}"`,
            actor: 'Department Officer' as const,
            type: 'note' as const,
          };
          return {
            ...t,
            officialResponses: [...t.officialResponses, response],
            lastUpdatedAt: timestamp,
            status: t.status === 'Assigned' ? 'In Progress' : t.status,
            timeline: [...t.timeline, newEvent],
          };
        }
        return t;
      })
    );

    const notif: CampusNotification = {
      id: `NOTIF-${Date.now()}`,
      ticketId,
      title: `Official Update on ${ticketId}`,
      message: `${currentUser.name} posted an official response.`,
      timestamp,
      read: false,
      type: 'response',
      level: 'info',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Escalate ticket
  const escalateTicket = (ticketId: string, level: EscalationLevel, reason: string) => {
    const timestamp = new Date().toISOString();
    const escalatedToName =
      level === 3
        ? 'Campus Director & Dean of Student Affairs'
        : level === 2
        ? 'Central Helpdesk Administration (Dr. Rajesh Kumar)'
        : 'Department Head Officer';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newEvent = {
            id: `TL-${Date.now()}`,
            timestamp,
            title: `Escalated to Level ${level} (${escalatedToName})`,
            description: `Escalation requested by ${currentUser.name}: "${reason}"`,
            actor: (currentUser.role === 'student' ? 'Student' : 'Helpdesk Admin') as any,
            type: 'escalation' as const,
          };

          const updatedAgentAnalysis = {
            ...t.agentAnalysis,
            escalation: {
              isEscalated: true,
              escalationLevel: level,
              escalatedTo: escalatedToName,
              escalationReason: reason,
              escalatedAt: timestamp,
              trigger: (currentUser.role === 'student' ? 'student_requested' : 'department_inactivity') as any,
            },
          };

          return {
            ...t,
            status: 'Escalated',
            lastUpdatedAt: timestamp,
            agentAnalysis: updatedAgentAnalysis,
            timeline: [...t.timeline, newEvent],
          };
        }
        return t;
      })
    );

    const notif: CampusNotification = {
      id: `NOTIF-${Date.now()}`,
      ticketId,
      title: `Ticket ${ticketId} Escalated to Level ${level}`,
      message: `Escalated to ${escalatedToName}: ${reason}`,
      timestamp,
      read: false,
      type: 'escalated',
      level: 'warning',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Re-route ticket to different department
  const rerouteTicket = (ticketId: string, newDepartment: Department, reason?: string) => {
    const timestamp = new Date().toISOString();
    const departmentLeadOfficers: Record<Department, { name: string; role: string }> = {
      'IT Services': { name: 'S. Murugan', role: 'Lead Network Infrastructure Engineer' },
      'Finance & Accounts': { name: 'Anita Roy', role: 'Bursar & Student Accounts Head' },
      'Transport Division': { name: 'K. Raghavan', role: 'Senior Fleet Logistics Supervisor' },
      'Hostel Administration': { name: 'Dr. V. Sundaram', role: 'Chief Hostel Warden' },
      'Examination Cell': { name: 'Prof. R. Ramanathan', role: 'Assistant Controller of Examinations' },
      'Campus Security': { name: 'Capt. Devraj Patil', role: 'Chief Campus Security Officer' },
      'Estate & Maintenance': { name: 'Er. Rajesh Varma', role: 'Superintending Engineer' },
      'Student Services': { name: 'Meera Sen', role: 'Student Welfare Coordinator' },
      'Central Library': { name: 'Dr. Sunita Bannerjee', role: 'Chief University Librarian' },
      'Academic Affairs': { name: 'K. Natarajan', role: 'Deputy Registrar' },
    };

    const targetOfficer = departmentLeadOfficers[newDepartment] || {
      name: 'Department Officer',
      role: 'Division Lead',
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const oldDept = t.assignedDepartment;
          const newEvent: TimelineEvent = {
            id: `TL-${Date.now()}`,
            timestamp,
            title: `Re-routed to ${newDepartment}`,
            description: `Ticket re-routed from ${oldDept} to ${newDepartment} (Assigned to: ${targetOfficer.name}) by ${currentUser.name}. Reason: ${reason || 'Departmental jurisdiction realignment'}.`,
            actor: (currentUser.role === 'admin' ? 'Helpdesk Admin' : 'Department Officer') as any,
            type: 'routing',
          };

          const updatedAgentAnalysis = {
            ...t.agentAnalysis,
            routing: {
              ...t.agentAnalysis.routing,
              assignedDepartment: newDepartment,
              assignedOfficer: targetOfficer.name,
              officerRole: targetOfficer.role,
              routingJustification: `Re-routed by ${currentUser.name}: ${reason || 'Reassigned to correct campus department'}`,
            },
          };

          return {
            ...t,
            assignedDepartment: newDepartment,
            assignedOfficer: targetOfficer.name,
            lastUpdatedAt: timestamp,
            agentAnalysis: updatedAgentAnalysis,
            timeline: [...t.timeline, newEvent],
          };
        }
        return t;
      })
    );

    const notif: CampusNotification = {
      id: `NOTIF-${Date.now()}`,
      ticketId,
      title: `Ticket ${ticketId} Re-routed to ${newDepartment}`,
      message: `Re-routed by ${currentUser.name}. New lead officer: ${targetOfficer.name}.`,
      timestamp,
      read: false,
      type: 'assigned',
      level: 'info',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Submit feedback
  const submitFeedback = (ticketId: string, rating: number, comment?: string) => {
    const timestamp = new Date().toISOString();
    const fb: TicketFeedback = {
      rating,
      comment,
      submittedAt: timestamp,
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newEvent = {
            id: `TL-${Date.now()}`,
            timestamp,
            title: `Student Feedback Submitted (${rating}/5 Stars)`,
            description: comment ? `Comment: "${comment}"` : 'Student submitted rating.',
            actor: 'Student' as const,
            type: 'feedback' as const,
          };
          return {
            ...t,
            feedback: fb,
            status: 'Closed',
            lastUpdatedAt: timestamp,
            timeline: [...t.timeline, newEvent],
          };
        }
        return t;
      })
    );

    const notif: CampusNotification = {
      id: `NOTIF-${Date.now()}`,
      ticketId,
      title: `Feedback Received for ${ticketId}`,
      message: `Student gave a ${rating}⭐ rating.`,
      timestamp,
      read: false,
      type: 'resolved',
      level: 'success',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Knowledge base CRUD
  const addKBArticle = (article: Omit<KnowledgeArticle, 'id' | 'lastUpdated' | 'isVerified'>) => {
    const newId = `KB-GEN-${String(knowledgeBase.length + 1).padStart(2, '0')}`;
    const newDoc: KnowledgeArticle = {
      ...article,
      id: newId,
      lastUpdated: new Date().toISOString().split('T')[0],
      isVerified: true,
    };
    setKnowledgeBase((prev) => [newDoc, ...prev]);
  };

  const updateKBArticle = (id: string, updates: Partial<KnowledgeArticle>) => {
    setKnowledgeBase((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              ...updates,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : doc
      )
    );
  };

  const deleteKBArticle = (id: string) => {
    setKnowledgeBase((prev) => prev.filter((doc) => doc.id !== id));
  };

  // Notification read
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <HelpdeskContext.Provider
      value={{
        tickets,
        knowledgeBase,
        notifications,
        currentUser,
        currentView,
        selectedTicketId,
        searchQuery,
        isChatOpen,
        isNotifOpen,
        setCurrentView,
        setSelectedTicketId,
        setSearchQuery,
        switchUserRole,
        setIsChatOpen,
        setIsNotifOpen,
        createTicket,
        updateTicketStatus,
        addOfficialResponse,
        escalateTicket,
        rerouteTicket,
        submitFeedback,
        getTicketById,
        addKBArticle,
        updateKBArticle,
        deleteKBArticle,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        prefillDraft,
        setPrefillDraft,
        isAdminUnlocked,
        unlockAdminConsole,
        lockAdminConsole,
      }}
    >
      {children}
    </HelpdeskContext.Provider>
  );
};

export const useHelpdesk = () => {
  const context = useContext(HelpdeskContext);
  if (!context) {
    throw new Error('useHelpdesk must be used within a HelpdeskProvider');
  }
  return context;
};
