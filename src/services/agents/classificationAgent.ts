import {
  AgentClassificationResult,
  AIConfidenceDetail,
  Ticket,
  TicketCategory,
} from '../../types';

export interface ClassificationInput {
  title: string;
  description: string;
  location: string;
  category: TicketCategory;
  existingTickets?: Ticket[];
}

export class ClassificationAgentService {
  public classify(input: ClassificationInput): {
    result: AgentClassificationResult;
    confidence: AIConfidenceDetail;
  } {
    const text = `${input.title} ${input.description} ${input.location}`.toLowerCase();

    // Extract hardware/system entity
    let equipmentOrSystem = 'General Campus Infrastructure';
    if (text.includes('wi-fi') || text.includes('wifi') || text.includes('internet') || text.includes('network') || text.includes('eduroam')) {
      equipmentOrSystem = 'Campus Wi-Fi / AP Access Point (Cisco Catalyst / Aruba)';
    } else if (text.includes('bus') || text.includes('route') || text.includes('transit') || text.includes('shuttle')) {
      equipmentOrSystem = 'University Bus Transport Fleet';
    } else if (text.includes('fan') || text.includes('light') || text.includes('electrical') || text.includes('ac') || text.includes('wiring')) {
      equipmentOrSystem = 'Hostel Room Electrical Fixture / Distribution Board';
    } else if (text.includes('fee') || text.includes('receipt') || text.includes('payment') || text.includes('challan') || text.includes('refund')) {
      equipmentOrSystem = 'ERP Payment Gateway / Bursar Fee Ledger';
    } else if (text.includes('hall ticket') || text.includes('admit card') || text.includes('exam') || text.includes('coe')) {
      equipmentOrSystem = 'Examination Portal / Seating Allocation Database';
    } else if (text.includes('id card') || text.includes('smart card') || text.includes('badge') || text.includes('rfid')) {
      equipmentOrSystem = 'Student RFID Identity Card & Access Control';
    } else if (text.includes('security') || text.includes('dark') || text.includes('safety') || text.includes('patrol') || text.includes('camera')) {
      equipmentOrSystem = 'Perimeter Security & Night Lighting Infrastructure';
    } else if (text.includes('mess') || text.includes('food') || text.includes('canteen') || text.includes('hygiene')) {
      equipmentOrSystem = 'Hostel Dining Hall / Mess Food Operations';
    }

    // Detect affected group
    let affectedGroup = 'Individual Student';
    if (text.includes('block') || text.includes('department') || text.includes('entire') || text.includes('all students') || text.includes('classroom') || text.includes('lab')) {
      affectedGroup = 'Batch / Entire Block (Multi-User Impact)';
    } else if (text.includes('bus') || text.includes('route')) {
      affectedGroup = 'Commuter Cohort (Route Passengers)';
    } else if (text.includes('floor') || text.includes('wing')) {
      affectedGroup = 'Floor Residents (Shared Utility)';
    }

    // Urgency indicator
    let urgencyIndicator = 'Standard Operational Timeline';
    if (text.includes('urgent') || text.includes('immediate') || text.includes('today') || text.includes('exam tomorrow') || text.includes('danger') || text.includes('spark') || text.includes('injury')) {
      urgencyIndicator = 'Time-Critical / Immediate Campus Attention Required';
    }

    // Duplicate check
    let isDuplicate = false;
    let duplicateOfTicketId: string | undefined = undefined;

    if (input.existingTickets) {
      for (const existing of input.existingTickets) {
        if (existing.status !== 'Resolved' && existing.status !== 'Closed') {
          const existingText = `${existing.title} ${existing.location}`.toLowerCase();
          const sameLocation =
            input.location &&
            existing.location &&
            (text.includes(existing.location.toLowerCase()) ||
              existingText.includes(input.location.toLowerCase()));

          const commonTerms = ['wi-fi', 'bus', 'fan', 'hall ticket', 'safety', 'lighting', 'mess'];
          const sharedTerm = commonTerms.find((term) => text.includes(term) && existingText.includes(term));

          if (sameLocation && sharedTerm) {
            isDuplicate = true;
            duplicateOfTicketId = existing.id;
            break;
          }
        }
      }
    }

    const summary = `${input.category} issue reported at ${input.location || 'campus'}: ${input.title}.${isDuplicate ? ` [Correlates with active ticket ${duplicateOfTicketId}]` : ''}`.trim();

    // Confidence Calculation
    const supportingEvidence: string[] = [];
    let confidenceScore = 91;

    if (text.includes(input.category.toLowerCase().split(' ')[0])) {
      confidenceScore += 4;
      supportingEvidence.push(`Exact keyword match for category "${input.category}" found in description.`);
    }
    if (input.location) {
      supportingEvidence.push(`Precise campus location identified: "${input.location}".`);
    }
    supportingEvidence.push(`Mapped equipment/system entity: "${equipmentOrSystem}".`);
    supportingEvidence.push(`Identified affected user cohort: "${affectedGroup}".`);

    confidenceScore = Math.min(99, confidenceScore);

    const confidence: AIConfidenceDetail = {
      decision: input.category,
      confidenceScore,
      reason: `Classification agent parsed issue parameters and matched entities with university domain standards.`,
      supportingEvidence,
    };

    const result: AgentClassificationResult = {
      detectedCategory: input.category,
      summary,
      extractedEntities: {
        location: input.location,
        affectedGroup,
        urgencyIndicator,
        equipmentOrSystem,
      },
      isDuplicate,
      duplicateOfTicketId,
      confidenceScore,
    };

    return { result, confidence };
  }
}

export const classificationAgent = new ClassificationAgentService();
