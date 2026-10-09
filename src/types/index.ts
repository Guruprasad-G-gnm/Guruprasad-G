export type UserRole = 'student' | 'staff' | 'admin' | 'officer';

export type TicketCategory =
  | 'Academic'
  | 'Examination'
  | 'Fees & Finance'
  | 'Hostel'
  | 'Transport'
  | 'Library'
  | 'IT / Wi-Fi'
  | 'Maintenance'
  | 'Security'
  | 'Canteen'
  | 'Scholarship'
  | 'Certificates'
  | 'Other';

export type Department =
  | 'IT Services'
  | 'Finance & Accounts'
  | 'Transport Division'
  | 'Hostel Administration'
  | 'Examination Cell'
  | 'Estate & Maintenance'
  | 'Campus Security'
  | 'Student Services'
  | 'Central Library'
  | 'Academic Affairs';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TicketStatus =
  | 'New'
  | 'AI Processing'
  | 'Assigned'
  | 'In Progress'
  | 'Waiting for Student'
  | 'Waiting for Department'
  | 'Escalated'
  | 'Resolved'
  | 'Closed';

export type EscalationLevel = 1 | 2 | 3;

export type AgentStatus = 'Waiting' | 'Processing' | 'Completed' | 'Escalated' | 'Failed';

export type LanguageCode = 'en' | 'ta' | 'hi';

export type SentimentType = 'Positive' | 'Neutral' | 'Frustrated' | 'Angry' | 'Urgent';

export interface KBSourceCitation {
  id: string;
  title: string;
  section: string;
  summary: string;
  department?: Department;
  lastUpdated?: string;
  urlRef?: string;
  relevanceScore?: number;
}

export interface AIConfidenceDetail {
  decision: string;
  confidenceScore: number; // 0 - 100
  reason: string;
  supportingEvidence: string[];
}

export interface ExplainableAIDecision {
  title: string;
  factors: string[];
  evidence: string[];
  ruleApplied?: string;
}

export interface AgentSentimentResult {
  sentiment: SentimentType;
  urgencyScore: number; // 0 - 10
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  reason: string;
  confidenceScore: number;
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  similarityScore: number; // 0 - 100
  duplicateTicketId?: string;
  duplicateTicketTitle?: string;
  reason: string;
  actionRecommendation: 'Link to Existing Ticket' | 'Create New Ticket' | 'View Related Ticket';
}

export interface SmartSummary {
  problem: string;
  actionsTaken: string;
  currentStatus: string;
  pendingAction: string;
  recommendedNextStep: string;
}

export interface SLAStatusPrediction {
  breachRiskPercentage: number; // 0 - 100
  riskCategory: 'Low' | 'Medium' | 'High';
  reason: string;
  predictedBreachAt?: string;
}

export interface AgentClassificationResult {
  detectedCategory: TicketCategory;
  summary: string;
  extractedEntities: {
    location?: string;
    affectedGroup?: string;
    urgencyIndicator?: string;
    equipmentOrSystem?: string;
  };
  isDuplicate: boolean;
  duplicateOfTicketId?: string;
  confidenceScore: number;
}

export interface AgentRoutingResult {
  assignedDepartment: Department;
  assignedOfficer: string;
  officerRole: string;
  routingJustification: string;
  slaTargetHours: number;
  confidenceScore?: number;
}

export interface AgentRetrievalResult {
  citations: KBSourceCitation[];
  groundingStatus: 'found' | 'not_found' | 'partial';
  retrievalSummary: string;
  vectorSimilarityAverage?: number;
  provider?: string;
}

export interface AgentPriorityResult {
  priority: TicketPriority;
  priorityScore?: number; // 0 - 100
  slaHours: number;
  riskFactors: {
    safetyRisk: 'Low' | 'Medium' | 'High' | 'Critical';
    studentsAffectedEstimate: string;
    academicDeadlineImpact: boolean;
    financialImpact: boolean;
    serviceAvailabilityImpact: boolean;
    urgencyScore: number; // 1-10
  };
  reasoning: string;
  confidenceScore?: number;
}

export interface AgentResolutionResult {
  recommendedSolution: string;
  stepByStepGuidance: string[];
  isSelfServicePossible: boolean;
  requiresHumanIntervention: boolean;
  disclaimer: string;
}

export interface AgentFollowUpResult {
  lastFollowUpAt?: string;
  nextFollowUpDue?: string;
  followUpCount: number;
  followUpRemindersSent: string[];
}

export interface AgentEscalationResult {
  isEscalated: boolean;
  escalationLevel?: EscalationLevel;
  escalatedTo?: string;
  escalationReason?: string;
  escalatedAt?: string;
  trigger: 'critical_priority' | 'sla_breach' | 'repeated_complaints' | 'department_inactivity' | 'student_requested' | 'none';
}

export interface SupervisorOrchestratorResult {
  executionOrder: string[];
  supervisorVerdict: string;
  agentStatuses: Record<string, AgentStatus>;
  orchestrationSummary: string;
}

export interface MultiAgentAnalysis {
  orchestrator?: SupervisorOrchestratorResult;
  classification: AgentClassificationResult;
  routing: AgentRoutingResult;
  retrieval: AgentRetrievalResult;
  priority: AgentPriorityResult;
  resolution: AgentResolutionResult;
  followUp: AgentFollowUpResult;
  escalation: AgentEscalationResult;
  sentiment?: AgentSentimentResult;
  duplicate?: DuplicateDetectionResult;
  confidenceDetails?: {
    category: AIConfidenceDetail;
    department: AIConfidenceDetail;
    priority: AIConfidenceDetail;
  };
  smartSummary?: SmartSummary;
  predictiveEscalation?: SLAStatusPrediction;
  explainability?: {
    whyDepartment: ExplainableAIDecision;
    whyPriority: ExplainableAIDecision;
    whyEscalation?: ExplainableAIDecision;
  };
  guardrailStatus?: {
    passed: boolean;
    verifiedAgainstSources: boolean;
    isHumanApproved: boolean;
    notice?: string;
  };
  executedAt: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: 'Student' | 'AI Agent' | 'Department Officer' | 'Helpdesk Admin' | 'Escalation Authority';
  agentName?: string;
  type: 'creation' | 'ai_step' | 'routing' | 'status_change' | 'note' | 'reminder' | 'escalation' | 'resolution' | 'feedback';
}

export interface DepartmentResponse {
  id: string;
  officerName: string;
  officerDepartment: Department;
  message: string;
  timestamp: string;
  actionTaken?: string;
  isOfficial: boolean;
  isHumanApproved?: boolean;
}

export interface TicketFeedback {
  rating: number; // 1-5
  comment?: string;
  submittedAt: string;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface Ticket {
  id: string; // e.g. CHD-2026-0001
  title: string;
  description: string;
  category: TicketCategory;
  location: string;
  preferredContact: 'Campus Email' | 'Phone/SMS' | 'In-Person Desk';
  attachments: Attachment[];
  
  // Student info
  studentName: string;
  registerNumber: string;
  studentDepartment: string;
  studentYear: string;
  studentEmail: string;
  studentPhone?: string;

  // Status & Priority
  status: TicketStatus;
  priority: TicketPriority;
  priorityScore?: number; // 0 - 100
  assignedDepartment: Department;
  assignedOfficer: string;

  // Timestamps & SLA
  createdAt: string;
  lastUpdatedAt: string;
  expectedResolutionTime: string;
  slaBreached: boolean;
  slaBreachRisk?: number; // 0 - 100

  // Multi-Agent outputs
  agentAnalysis: MultiAgentAnalysis;

  // Department interactions
  officialResponses: DepartmentResponse[];

  // Timeline
  timeline: TimelineEvent[];

  // Feedback
  feedback?: TicketFeedback;

  // Advanced metadata
  language?: LanguageCode;
  sentiment?: SentimentType;
  isHumanVerified?: boolean;
  voiceRecorded?: boolean;
}

export interface KnowledgeArticle {
  id: string; // e.g. KB-IT-01
  title: string;
  category: TicketCategory;
  department: Department;
  summary: string;
  content: string;
  sourceReference: string;
  lastUpdated: string;
  author: string;
  tags: string[];
  isVerified: boolean;
  contactDesk: string;
  embeddingVector?: number[]; // Vector embedding representation
}

export interface CampusNotification {
  id: string;
  ticketId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'submitted' | 'assigned' | 'status_change' | 'response' | 'follow_up' | 'sla_warning' | 'escalated' | 'resolved';
  level: 'info' | 'warning' | 'danger' | 'success';
}

export interface ActiveUser {
  role: UserRole;
  name: string;
  idNumber: string;
  department: string;
  year?: string;
  email: string;
  avatarInitials: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  target: string;
  details: string;
  status: 'SUCCESS' | 'FLAGGED' | 'BLOCKED';
  ipAddress?: string;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'Student' | 'Department' | 'Staff' | 'Building' | 'Service' | 'Policy' | 'Ticket' | 'Location' | 'Category';
  description?: string;
  meta?: Record<string, any>;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  label: string;
}
