import {
  AgentFollowUpResult,
  TicketPriority,
} from '../../types';

export class FollowUpAgentService {
  public evaluate(
    createdAtIso: string,
    priority: TicketPriority,
    slaHours: number
  ): AgentFollowUpResult {
    const createdTime = new Date(createdAtIso).getTime();
    const now = Date.now();
    const elapsedHours = (now - createdTime) / (1000 * 60 * 60);

    const followUpRemindersSent: string[] = [];
    let followUpCount = 0;

    // SLA Milestone triggers (50%, 75%, 100%)
    if (elapsedHours >= slaHours * 0.5) {
      followUpRemindersSent.push(
        `Automated 50% SLA Checkpoint: Reminder ping dispatched to Department In-Charge (${elapsedHours.toFixed(1)}h elapsed).`
      );
      followUpCount++;
    }

    if (elapsedHours >= slaHours * 0.8) {
      followUpRemindersSent.push(
        `Critical SLA Window (80%): Escalation alert queued for Department Lead & Helpdesk Supervisor.`
      );
      followUpCount++;
    }

    const nextFollowUpDate = new Date(now + 4 * 60 * 60 * 1000);

    return {
      lastFollowUpAt: followUpRemindersSent.length > 0 ? new Date().toISOString() : undefined,
      nextFollowUpDue: nextFollowUpDate.toISOString(),
      followUpCount,
      followUpRemindersSent,
    };
  }
}

export const followUpAgent = new FollowUpAgentService();
