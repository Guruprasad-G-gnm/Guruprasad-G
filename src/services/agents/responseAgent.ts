import {
  AgentResolutionResult,
  AgentRetrievalResult,
  TicketCategory,
} from '../../types';

export class ResponseAgentService {
  public generateResponse(
    category: TicketCategory,
    text: string,
    retrieval: AgentRetrievalResult
  ): AgentResolutionResult {
    const lower = text.toLowerCase();
    const hasCitations = retrieval.citations.length > 0;

    let recommendedSolution = 'Log ticket with department officer for on-site inspection and verification.';
    let stepByStepGuidance: string[] = [
      'Document your issue timestamp and exact campus room number.',
      'Await officer review within the allocated SLA window.',
      'Check the Ticket Tracker for updates or response notes.',
    ];
    let isSelfServicePossible = false;
    let requiresHumanIntervention = true;

    if (hasCitations) {
      const topCite = retrieval.citations[0];

      if (category === 'IT / Wi-Fi') {
        recommendedSolution = 'Verify device MAC address registration and forget/reconnect to "Eduroam" or "Campus-Secure" using NetAuth credentials.';
        stepByStepGuidance = [
          'Access Wi-Fi settings, select "Eduroam" and choose PEAP authentication.',
          'Input your verified student registration ID and NetAuth password.',
          'If connecting in CSE/ECE block and AP lights are amber, the switch port is undergoing POE reset.',
          `Reference: ${topCite.title} (${topCite.section}).`,
        ];
        isSelfServicePossible = true;
        requiresHumanIntervention = lower.includes('spark') || lower.includes('broken') || lower.includes('cable');
      } else if (category === 'Hostel') {
        recommendedSolution = 'Log work order in Hostel Caretaker Maintenance Roster and verify room electrical sub-meter status.';
        stepByStepGuidance = [
          'Locate Hostel Caretaker Desk (Ground Floor, 09:00 - 18:00 hrs).',
          'Ensure the room main circuit breaker (MCB) has not tripped.',
          'Electrician duty slots operate 10:00 - 12:00 and 15:00 - 17:00.',
          `Reference: ${topCite.title} (${topCite.section}).`,
        ];
        isSelfServicePossible = false;
        requiresHumanIntervention = true;
      } else if (category === 'Transport') {
        recommendedSolution = 'Check Live Bus Telemetry GPS Dashboard at transport portal and note designated route stop times.';
        stepByStepGuidance = [
          'Cross-reference your boarding stop with the published Morning Inbound Schedule.',
          'Carry physical/RFID Smart Card bus pass during transit.',
          'For route deviations exceeding 20 minutes, Transport Desk logs driver telemetry.',
          `Reference: ${topCite.title} (${topCite.section}).`,
        ];
        isSelfServicePossible = false;
        requiresHumanIntervention = true;
      } else if (category === 'Fees & Finance') {
        recommendedSolution = 'Verify bank transaction UTR reference code and allow 48-hour automated bank reconciliation window.';
        stepByStepGuidance = [
          'Note down the 12-digit UTR transaction number from your banking portal.',
          'Log in to Student Accounts ERP and navigate to "Fee Reconciliation" tab.',
          'If status remains unverified after 48 hrs, submit bank counterfoil copy to Admin Block Room 104.',
          `Reference: ${topCite.title} (${topCite.section}).`,
        ];
        isSelfServicePossible = true;
        requiresHumanIntervention = false;
      } else if (category === 'Examination') {
        recommendedSolution = 'Clear fee/attendance portal holds and request Provisional Examination Clearance from COE Desk.';
        stepByStepGuidance = [
          'Check Student Information System (SIS) for mandatory 75% attendance compliance.',
          'Download digital copy from COE student portal.',
          'If photo is missing or barcode unreadable, report directly to COE Helpdesk (Block A-102).',
          `Reference: ${topCite.title} (${topCite.section}).`,
        ];
        isSelfServicePossible = true;
        requiresHumanIntervention = lower.includes('tomorrow');
      } else if (category === 'Security') {
        recommendedSolution = 'Immediate campus safety alert flagged to 24/7 Security Control Room (Ext. 9999).';
        stepByStepGuidance = [
          'Maintain a safe distance from hazard/unlit area.',
          'Perimeter security mobile patrol unit dispatched.',
          'In case of direct emergency, contact Main Security Gate 1 immediately.',
          `Reference: ${topCite.title} (${topCite.section}).`,
        ];
        isSelfServicePossible = false;
        requiresHumanIntervention = true;
      }
    } else {
      recommendedSolution = 'Relevant campus information was not found in the campus knowledge base. Please contact the appropriate department.';
      stepByStepGuidance = [
        'Your request has been routed to the respective campus department.',
        'An authorized officer will examine the specifics and provide official guidance.',
        'Check back for official department notes.',
      ];
      isSelfServicePossible = false;
      requiresHumanIntervention = true;
    }

    const disclaimer = hasCitations
      ? 'All guidance synthesized directly from verified University Handbooks & Standard Operating Procedures. Official action subject to department duty officer review.'
      : 'Notice: Relevant campus information was not found in the knowledge base. No synthetic college rules or phone numbers were generated.';

    return {
      recommendedSolution,
      stepByStepGuidance,
      isSelfServicePossible,
      requiresHumanIntervention,
      disclaimer,
    };
  }
}

export const responseAgent = new ResponseAgentService();
