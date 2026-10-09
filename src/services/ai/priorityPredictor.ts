import { TicketPriority, AgentPriorityResult, SentimentType } from '../../types';

export interface PriorityPredictionInput {
  title: string;
  description: string;
  category: string;
  location: string;
  sentiment: SentimentType;
  unresolvedCountForStudent?: number;
}

export class PriorityPredictorService {
  public predict(input: PriorityPredictionInput): AgentPriorityResult {
    const text = `${input.title} ${input.description} ${input.location}`.toLowerCase();
    let score = 25; // baseline
    const factors: string[] = [];

    let safetyRisk: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
    let studentsAffectedEstimate = '1-2 Students';
    let academicDeadlineImpact = false;
    let financialImpact = false;
    let serviceAvailabilityImpact = false;

    // 1. Safety & Hazard Analysis
    if (text.includes('danger') || text.includes('fire') || text.includes('spark') || text.includes('shock') || text.includes('harassment') || text.includes('dark pathway')) {
      safetyRisk = text.includes('emergency') || text.includes('spark') || text.includes('shock') || text.includes('fire') ? 'Critical' : 'High';
      score += 45;
      factors.push(`Physical safety/hazard detected (+45): ${safetyRisk}`);
    }

    // 2. Cohort Scale & Student Impact
    if (text.includes('block') || text.includes('department') || text.includes('entire') || text.includes('all students') || text.includes('lab') || text.includes('batch')) {
      studentsAffectedEstimate = '50 - 200+ Students (High Cohort Impact)';
      serviceAvailabilityImpact = true;
      score += 25;
      factors.push('Multi-student campus infrastructure outage (+25)');
    } else if (text.includes('bus') || text.includes('route') || text.includes('route 14')) {
      studentsAffectedEstimate = '25 - 40 Commuters';
      serviceAvailabilityImpact = true;
      score += 18;
      factors.push('Transit route delay affecting commuting cohort (+18)');
    }

    // 3. Academic & Examination Proximity
    if (text.includes('exam tomorrow') || text.includes('exam') || text.includes('starts in 2 hours') || text.includes('examination') || text.includes('hall ticket') || text.includes('submission deadline')) {
      academicDeadlineImpact = true;
      score += 30;
      factors.push('Impending examination or academic deadline constraint (+30)');
    }

    // 4. Financial impact
    if (text.includes('fee') || text.includes('debited') || text.includes('payment') || text.includes('scholarship')) {
      financialImpact = true;
      score += 15;
      factors.push('Financial ledger or monetary debit discrepancy (+15)');
    }

    // 5. Sentiment boost
    if (input.sentiment === 'Urgent') {
      score += 20;
      factors.push('Urgent student emotional sentiment (+20)');
    } else if (input.sentiment === 'Angry') {
      score += 15;
      factors.push('Distressed/angry student escalation factor (+15)');
    } else if (input.sentiment === 'Frustrated') {
      score += 10;
      factors.push('Repeated frustration / delayed response factor (+10)');
    }

    // 6. Repeat complaints
    if ((input.unresolvedCountForStudent || 0) > 1) {
      score += 15;
      factors.push(`Repeat complaint history (${input.unresolvedCountForStudent} open tickets) (+15)`);
    }

    // Cap at 100
    const finalScore = Math.min(100, Math.max(10, score));

    let priority: TicketPriority = 'LOW';
    let slaHours = 24;
    let confidenceScore = 91;

    if (finalScore >= 85 || safetyRisk === 'Critical') {
      priority = 'CRITICAL';
      slaHours = 1;
      confidenceScore = 96;
    } else if (finalScore >= 65 || academicDeadlineImpact) {
      priority = 'HIGH';
      slaHours = 4;
      confidenceScore = 93;
    } else if (finalScore >= 38 || serviceAvailabilityImpact) {
      priority = 'MEDIUM';
      slaHours = 12;
      confidenceScore = 89;
    } else {
      priority = 'LOW';
      slaHours = 24;
      confidenceScore = 87;
    }

    const reasoning = `Computed Multi-Factor Priority Score: ${finalScore}/100. Factors: ${factors.join('; ')}.`;

    return {
      priority,
      priorityScore: finalScore,
      slaHours,
      riskFactors: {
        safetyRisk,
        studentsAffectedEstimate,
        academicDeadlineImpact,
        financialImpact,
        serviceAvailabilityImpact,
        urgencyScore: Math.round(finalScore / 10),
      },
      reasoning,
      confidenceScore,
    };
  }
}

export const priorityPredictor = new PriorityPredictorService();
