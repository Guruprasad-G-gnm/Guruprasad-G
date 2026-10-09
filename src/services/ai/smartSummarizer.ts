import { Ticket, SmartSummary } from '../../types';

export class SmartSummarizerService {
  public summarizeTicket(ticket: Ticket): SmartSummary {
    const responses = ticket.officialResponses || [];
    const timeline = ticket.timeline || [];

    // Problem formulation
    const problem = `${ticket.title} reported at ${ticket.location || 'campus'}. Student ${ticket.studentName} flagged ${ticket.category} degradation impacting daily campus activity.`;

    // Actions taken
    let actionsTaken = 'AI multi-agent intake completed; automated routing and risk classification verified.';
    if (responses.length > 0) {
      actionsTaken += ` Department officer ${responses[0].officerName} reviewed ticket: "${responses[0].message.slice(0, 120)}..."`;
    }

    // Current status
    const currentStatus = `Ticket is in ${ticket.status} status with ${ticket.priority} priority assigned to ${ticket.assignedDepartment} (Lead: ${ticket.assignedOfficer}).`;

    // Pending action
    let pendingAction = '';
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
      pendingAction = 'Ticket closed. Awaiting student satisfaction rating and feedback archival.';
    } else if (ticket.status === 'Waiting for Student') {
      pendingAction = 'Awaiting requested student documentation / physical device presentation at desk.';
    } else if (responses.length === 0) {
      pendingAction = 'Awaiting initial acknowledgment and diagnostic dispatch by assigned department officer.';
    } else {
      pendingAction = 'Field repair or operational verification in progress by departmental support team.';
    }

    // Recommended next step
    const recommendedNextStep = ticket.agentAnalysis?.resolution?.stepByStepGuidance?.[0]
      || `Assign duty engineer from ${ticket.assignedDepartment} to inspect facility.`;

    return {
      problem,
      actionsTaken,
      currentStatus,
      pendingAction,
      recommendedNextStep,
    };
  }
}

export const smartSummarizer = new SmartSummarizerService();
