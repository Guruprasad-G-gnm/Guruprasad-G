import {
  AgentPriorityResult,
  AIConfidenceDetail,
  TicketCategory,
  TicketPriority,
} from '../../types';

export class PriorityAgentService {
  public assess(
    category: TicketCategory,
    text: string,
    extractedEntities?: {
      affectedGroup?: string;
      urgencyIndicator?: string;
    }
  ): {
    result: AgentPriorityResult;
    confidence: AIConfidenceDetail;
  } {
    const lower = text.toLowerCase();

    // 1. Safety Risk
    let safetyRisk: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
    if (lower.includes('spark') || lower.includes('fire') || lower.includes('hazard') || lower.includes('wire') || lower.includes('shock') || lower.includes('emergency')) {
      safetyRisk = 'Critical';
    } else if (lower.includes('dark') || lower.includes('street light') || lower.includes('unattended') || lower.includes('stranger')) {
      safetyRisk = 'High';
    } else if (lower.includes('water leak') || lower.includes('broken glass')) {
      safetyRisk = 'Medium';
    }

    // 2. Students Affected
    let studentsAffected = '1 Student';
    if (lower.includes('cse block') || lower.includes('all students') || lower.includes('entire block') || lower.includes('batch') || lower.includes('lab') || lower.includes('bus')) {
      studentsAffected = '50 - 200+ Students (Broad Cohort Impact)';
    } else if (lower.includes('floor') || lower.includes('wing') || lower.includes('mess')) {
      studentsAffected = '20 - 50 Students (Shared Infrastructure)';
    } else if (lower.includes('room') && !lower.includes('all rooms')) {
      studentsAffected = '2 - 4 Roommates';
    }

    // 3. Academic Deadline Impact
    const academicDeadlineImpact =
      lower.includes('exam tomorrow') ||
      lower.includes('midterm') ||
      lower.includes('hall ticket') ||
      lower.includes('admit card') ||
      lower.includes('grades') ||
      lower.includes('project submission') ||
      category === 'Examination';

    // 4. Financial Impact
    const financialImpact =
      lower.includes('fee') ||
      lower.includes('refund') ||
      lower.includes('payment') ||
      lower.includes('scholarship') ||
      lower.includes('bank');

    // 5. Service Availability
    const serviceAvailabilityImpact =
      lower.includes('outage') ||
      lower.includes('down') ||
      lower.includes('unresponsive') ||
      lower.includes('not working') ||
      lower.includes('stopped');

    // Calculate score
    let score = 25; // baseline LOW

    if (safetyRisk === 'Critical') score += 60;
    else if (safetyRisk === 'High') score += 40;
    else if (safetyRisk === 'Medium') score += 15;

    if (studentsAffected.includes('200+')) score += 30;
    else if (studentsAffected.includes('50 Students')) score += 15;

    if (academicDeadlineImpact) score += 35;
    if (financialImpact) score += 20;
    if (serviceAvailabilityImpact) score += 15;

    if (lower.includes('urgent') || lower.includes('immediate')) score += 15;

    // Normalization & Priority classification
    let priority: TicketPriority = 'LOW';
    let slaHours = 48;

    if (score >= 80 || safetyRisk === 'Critical') {
      priority = 'CRITICAL';
      slaHours = 2;
    } else if (score >= 55) {
      priority = 'HIGH';
      slaHours = 8;
    } else if (score >= 35) {
      priority = 'MEDIUM';
      slaHours = 24;
    } else {
      priority = 'LOW';
      slaHours = 48;
    }

    const reasoning = `Computed priority score of ${score}/100. Factors: Safety Risk (${safetyRisk}), Student Cohort (${studentsAffected}), Academic Deadline (${academicDeadlineImpact ? 'Yes' : 'No'}), SLA Target: ${slaHours} Hours.`;

    const supportingEvidence = [
      `Safety Risk evaluated as "${safetyRisk}".`,
      `Impact blast radius estimated at "${studentsAffected}".`,
      academicDeadlineImpact ? 'Active examination or academic deadline constraint detected.' : 'No immediate exam deadline conflict.',
      `Configured SLA benchmark: ${slaHours} hours response threshold.`,
    ];

    const confidence: AIConfidenceDetail = {
      decision: priority,
      confidenceScore: Math.min(98, 85 + Math.round(score * 0.12)),
      reason: reasoning,
      supportingEvidence,
    };

    const result: AgentPriorityResult = {
      priority,
      priorityScore: score,
      slaHours,
      riskFactors: {
        safetyRisk,
        studentsAffectedEstimate: studentsAffected,
        academicDeadlineImpact,
        financialImpact,
        serviceAvailabilityImpact,
        urgencyScore: Math.min(10, Math.ceil(score / 10)),
      },
      reasoning,
      confidenceScore: confidence.confidenceScore,
    };

    return { result, confidence };
  }
}

export const priorityAgent = new PriorityAgentService();
