import {
  AgentEscalationResult,
  Department,
  EscalationLevel,
  TicketPriority,
} from '../../types';

export class EscalationAgentService {
  public evaluate(
    priority: TicketPriority,
    assignedDepartment: Department,
    text: string,
    elapsedHours: number,
    slaTargetHours: number,
    sentimentUrgency: number = 3
  ): AgentEscalationResult {
    const lower = text.toLowerCase();

    // Trigger 1: Critical priority / safety risk
    if (priority === 'CRITICAL' || lower.includes('spark') || lower.includes('hazard') || lower.includes('emergency')) {
      return {
        isEscalated: true,
        escalationLevel: 3 as EscalationLevel,
        escalatedTo: 'Campus Director & Chief Security Officer',
        escalationReason: 'Immediate Level 3 Escalation: Physical safety risk or zero-downtime campus utility outage.',
        escalatedAt: new Date().toISOString(),
        trigger: 'critical_priority',
      };
    }

    // Trigger 2: SLA Breach
    if (elapsedHours > slaTargetHours) {
      return {
        isEscalated: true,
        escalationLevel: 2 as EscalationLevel,
        escalatedTo: 'Central Helpdesk Admin (Dr. Rajesh Kumar)',
        escalationReason: `SLA breach detected: Elapsed time (${elapsedHours.toFixed(1)}h) exceeds target (${slaTargetHours}h). Escalated for administrative intervention.`,
        escalatedAt: new Date().toISOString(),
        trigger: 'sla_breach',
      };
    }

    // Trigger 3: Repeated Complaints / High Frustration
    if (sentimentUrgency >= 8 || lower.includes('third time') || lower.includes('repeatedly') || lower.includes('no response for days')) {
      return {
        isEscalated: true,
        escalationLevel: 2 as EscalationLevel,
        escalatedTo: `Head of Department (${assignedDepartment})`,
        escalationReason: 'High student distress / repeated complaint pattern identified by Sentiment Agent.',
        escalatedAt: new Date().toISOString(),
        trigger: 'repeated_complaints',
      };
    }

    // Trigger 4: High Priority Approaching SLA
    if (priority === 'HIGH' && elapsedHours > slaTargetHours * 0.75) {
      return {
        isEscalated: true,
        escalationLevel: 1 as EscalationLevel,
        escalatedTo: `${assignedDepartment} Duty Supervisor`,
        escalationReason: 'High priority request approaching SLA limit (>75% consumed).',
        escalatedAt: new Date().toISOString(),
        trigger: 'department_inactivity',
      };
    }

    return {
      isEscalated: false,
      trigger: 'none',
    };
  }
}

export const escalationAgent = new EscalationAgentService();
