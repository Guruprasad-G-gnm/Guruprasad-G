import { Ticket, SLAStatusPrediction } from '../../types';

export class PredictiveEscalatorService {
  /**
   * Predicts likelihood of SLA breach based on elapsed time, officer response presence, and priority
   */
  public predictBreachRisk(ticket: Ticket): SLAStatusPrediction {
    const createdTime = new Date(ticket.createdAt).getTime();
    const now = Date.now();
    const elapsedHours = (now - createdTime) / (1000 * 60 * 60);

    const targetSlaHours = ticket.agentAnalysis?.priority?.slaHours || 24;
    const hasResponse = ticket.officialResponses && ticket.officialResponses.length > 0;
    const isResolved = ticket.status === 'Resolved' || ticket.status === 'Closed';

    if (isResolved) {
      return {
        breachRiskPercentage: 0,
        riskCategory: 'Low',
        reason: 'Ticket resolved within SLA parameters. Zero breach risk.',
      };
    }

    const elapsedRatio = elapsedHours / targetSlaHours;
    let riskPercentage = Math.round(elapsedRatio * 70);

    // If no staff response recorded yet and more than 40% of time has passed
    if (!hasResponse && elapsedRatio > 0.4) {
      riskPercentage += 25;
    }

    // Critical tickets without response escalate risk rapidly
    if (ticket.priority === 'CRITICAL' && !hasResponse && elapsedHours > 0.5) {
      riskPercentage = Math.max(riskPercentage, 85);
    }

    // If SLA breached already
    if (elapsedHours >= targetSlaHours) {
      riskPercentage = Math.min(100, Math.max(90, riskPercentage));
    }

    riskPercentage = Math.min(100, Math.max(5, riskPercentage));

    let riskCategory: 'Low' | 'Medium' | 'High' = 'Low';
    let reason = '';

    if (riskPercentage >= 75) {
      riskCategory = 'High';
      reason = `Ticket has remained in ${ticket.status} for ${Math.round(elapsedHours)}h (${Math.round(elapsedRatio * 100)}% of ${targetSlaHours}h SLA) ${hasResponse ? 'with pending field work' : 'without official department reply'}. High probability of SLA breach.`;
    } else if (riskPercentage >= 45) {
      riskCategory = 'Medium';
      reason = `Approaching intermediate milestone (${Math.round(elapsedHours)}h elapsed of ${targetSlaHours}h). Moderate risk if departmental response is not posted soon.`;
    } else {
      riskCategory = 'Low';
      reason = `Operating nominally within early SLA window (${Math.round(elapsedHours)}h / ${targetSlaHours}h target).`;
    }

    return {
      breachRiskPercentage: riskPercentage,
      riskCategory,
      reason,
      predictedBreachAt: ticket.expectedResolutionTime,
    };
  }
}

export const predictiveEscalator = new PredictiveEscalatorService();
