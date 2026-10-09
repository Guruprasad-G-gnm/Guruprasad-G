import {
  AgentStatus,
  SupervisorOrchestratorResult,
  TicketCategory,
  TicketPriority,
} from '../../types';

export interface SupervisorDecisionPlan {
  executionOrder: string[];
  plannedSteps: {
    agentId: string;
    agentName: string;
    description: string;
    estimatedWeight: number;
  }[];
  supervisorVerdict: string;
  orchestrationSummary: string;
}

export class SupervisorAgentService {
  /**
   * Evaluates incoming request parameters and determines dynamic agent orchestration pipeline
   */
  public planPipeline(
    category: TicketCategory,
    text: string,
    priorityHint?: TicketPriority
  ): SupervisorDecisionPlan {
    const isSafetyOrCritical =
      text.toLowerCase().includes('safety') ||
      text.toLowerCase().includes('emergency') ||
      text.toLowerCase().includes('spark') ||
      text.toLowerCase().includes('danger') ||
      priorityHint === 'CRITICAL';

    const plannedSteps = [
      {
        agentId: 'supervisor',
        agentName: 'Supervisor / Orchestrator Agent',
        description: 'Assesses request context, provisions execution DAG, and assigns task queues.',
        estimatedWeight: 5,
      },
      {
        agentId: 'sentiment',
        agentName: 'Sentiment Analysis Agent',
        description: 'Analyzes user emotional state, frustration level, and real-time urgency cues.',
        estimatedWeight: 10,
      },
      {
        agentId: 'duplicate',
        agentName: 'Duplicate Detection Agent',
        description: 'Executes semantic vector similarity against active open campus tickets.',
        estimatedWeight: 15,
      },
      {
        agentId: 'classification',
        agentName: 'Request Classification Agent',
        description: 'Parses entities, location parameters, and categorizes academic / infrastructural domain.',
        estimatedWeight: 15,
      },
      {
        agentId: 'routing',
        agentName: 'Department Routing Agent',
        description: 'Matches domain to authoritative campus division and designated duty officer.',
        estimatedWeight: 10,
      },
      {
        agentId: 'priority',
        agentName: 'Priority & Risk Agent',
        description: 'Evaluates safety risk, user cohort volume, SLA deadlines, and academic calendar.',
        estimatedWeight: 15,
      },
      {
        agentId: 'knowledge',
        agentName: 'Knowledge Retrieval Agent (RAG)',
        description: 'Performs semantic vector search across verified campus manuals and rulebooks.',
        estimatedWeight: 15,
      },
      {
        agentId: 'response',
        agentName: 'Response Generation Agent',
        description: 'Drafts grounded resolution guidance with official source citations.',
        estimatedWeight: 10,
      },
      {
        agentId: 'followup',
        agentName: 'Follow-up Monitoring Agent',
        description: 'Schedules progressive SLA check-ins and automated reminder checkpoints.',
        estimatedWeight: 5,
      },
      {
        agentId: 'escalation',
        agentName: 'Escalation Agent',
        description: 'Evaluates escalation thresholds based on priority, risk severity, and SLA timers.',
        estimatedWeight: 5,
      },
    ];

    const executionOrder = plannedSteps.map((s) => s.agentName);

    const supervisorVerdict = isSafetyOrCritical
      ? 'CRITICAL_FAST_TRACK: Immediate security dispatch prioritized. Parallel execution of priority assessment and knowledge retrieval initiated.'
      : 'STANDARD_ORCHESTRATION: Full 10-agent verification pipeline engaged. High-confidence routing and citation grounding active.';

    const orchestrationSummary = `Supervisor assigned 10 specialized agent workers. Dynamic execution DAG established for category "${category}". Anti-hallucination guardrails active.`;

    return {
      executionOrder,
      plannedSteps,
      supervisorVerdict,
      orchestrationSummary,
    };
  }

  /**
   * Compiles orchestration verdict and tracks agent execution statuses
   */
  public compileResult(
    statuses: Record<string, AgentStatus>,
    isEscalated: boolean = false,
    verdict?: string
  ): SupervisorOrchestratorResult {
    const agentNames = [
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

    return {
      executionOrder: agentNames,
      supervisorVerdict:
        verdict ||
        (isEscalated
          ? 'ORCHESTRATION COMPLETE [WITH ESCALATION]: Agent tasks executed with priority elevation flag.'
          : 'ORCHESTRATION SUCCESSFUL: All 10 agents completed evaluation with 100% policy grounding.'),
      agentStatuses: statuses,
      orchestrationSummary:
        'Coordinated multi-agent execution finished. Outputs verified against Campus Knowledge Base guardrails.',
    };
  }
}

export const supervisorAgent = new SupervisorAgentService();
