import {
  AgentRoutingResult,
  AIConfidenceDetail,
  Department,
  TicketCategory,
} from '../../types';

export class RoutingAgentService {
  public route(
    category: TicketCategory,
    text: string
  ): {
    result: AgentRoutingResult;
    confidence: AIConfidenceDetail;
  } {
    const lower = text.toLowerCase();
    let assignedDepartment: Department = 'Student Services';
    let assignedOfficer = 'Duty Desk In-Charge';
    let officerRole = 'Helpdesk Dispatcher';
    let routingJustification = 'Standard campus service request routed to central student desk.';
    let slaTargetHours = 24;
    let confidenceScore = 92;
    const supportingEvidence: string[] = [];

    switch (category) {
      case 'IT / Wi-Fi':
        assignedDepartment = 'IT Services';
        assignedOfficer = 'Mr. Rajesh Varma';
        officerRole = 'Senior Network Operations Engineer';
        routingJustification = 'Issue involves campus Wi-Fi AP connectivity, authentication, or network infrastructure under IT Services mandate.';
        slaTargetHours = 8;
        confidenceScore = 96;
        supportingEvidence.push('Matches university IT network operations jurisdiction.');
        supportingEvidence.push('Direct technical access to switchboards and RADIUS servers required.');
        break;

      case 'Hostel':
        assignedDepartment = 'Hostel Administration';
        assignedOfficer = 'Dr. Meenakshi Sundaram';
        officerRole = 'Chief Hostel Warden & Facilities Supervisor';
        routingJustification = 'Residential room fixtures, mess dining halls, or hostel living amenities fall directly under Hostel Administration.';
        slaTargetHours = 12;
        confidenceScore = 95;
        supportingEvidence.push('Designated resident warden jurisdiction.');
        supportingEvidence.push('Maintenance rosters maintained under Hostel Admin.');
        break;

      case 'Transport':
        assignedDepartment = 'Transport Division';
        assignedOfficer = 'Mr. K. Selvam';
        officerRole = 'Fleet Transport Manager';
        routingJustification = 'Campus bus routes, fleet schedules, driver logistics, and student transport passes are governed by Transport Division.';
        slaTargetHours = 12;
        confidenceScore = 94;
        supportingEvidence.push('Fleet telemetry and route management jurisdiction.');
        break;

      case 'Fees & Finance':
      case 'Scholarship':
        assignedDepartment = 'Finance & Accounts';
        assignedOfficer = 'Mrs. S. Hemalatha';
        officerRole = 'Bursar & Accounts Section Officer';
        routingJustification = 'Financial transactions, fee receipt reconciliation, bank reconciliations, and fee concession schemes are audited by Accounts.';
        slaTargetHours = 24;
        confidenceScore = 93;
        supportingEvidence.push('ERP finance ledger and UTR transaction access required.');
        break;

      case 'Examination':
      case 'Certificates':
        assignedDepartment = 'Examination Cell';
        assignedOfficer = 'Dr. Anand Kumar';
        officerRole = 'Deputy Controller of Examinations (COE)';
        routingJustification = 'Hall tickets, midterm/semester schedules, seating plans, grade sheets, and degree verification are managed by Examination Cell.';
        slaTargetHours = 8;
        confidenceScore = 95;
        supportingEvidence.push('Autonomous Controller of Examinations system integration.');
        break;

      case 'Security':
        assignedDepartment = 'Campus Security';
        assignedOfficer = 'Major (Retd.) R. Swaminathan';
        officerRole = 'Chief Security Officer';
        routingJustification = 'Campus perimeter safety, night lighting hazards, gate entry systems, and student safety alerts require immediate Security dispatch.';
        slaTargetHours = 2;
        confidenceScore = 98;
        supportingEvidence.push('Urgent campus physical security and 24/7 patrol dispatch.');
        break;

      case 'Maintenance':
        assignedDepartment = 'Estate & Maintenance';
        assignedOfficer = 'Er. N. Balakrishnan';
        officerRole = 'Executive Engineer (Civil & Electrical)';
        routingJustification = 'Civil infrastructure, plumbing, classroom furniture, and building maintenance are overseen by Estate & Maintenance.';
        slaTargetHours = 16;
        confidenceScore = 92;
        supportingEvidence.push('Campus physical infrastructure repair mandate.');
        break;

      case 'Library':
        assignedDepartment = 'Central Library';
        assignedOfficer = 'Dr. P. Mythili';
        officerRole = 'Chief Librarian & Information Resource Officer';
        routingJustification = 'Library RFID cards, book circulation, IEEE/Elsevier digital access, and reading room facilities belong to Central Library.';
        slaTargetHours = 24;
        confidenceScore = 93;
        supportingEvidence.push('Library automated management system (KOHA/RFID).');
        break;

      case 'Academic':
      default:
        assignedDepartment = 'Academic Affairs';
        assignedOfficer = 'Prof. S. Ranganathan';
        officerRole = 'Dean of Academic Affairs';
        routingJustification = 'Curricular concerns, faculty coordinator approvals, and course registration matters belong to Academic Affairs.';
        slaTargetHours = 24;
        confidenceScore = 90;
        supportingEvidence.push('Faculty advisory and academic council portfolio.');
        break;
    }

    const confidence: AIConfidenceDetail = {
      decision: assignedDepartment,
      confidenceScore,
      reason: routingJustification,
      supportingEvidence,
    };

    const result: AgentRoutingResult = {
      assignedDepartment,
      assignedOfficer,
      officerRole,
      routingJustification,
      slaTargetHours,
      confidenceScore,
    };

    return { result, confidence };
  }
}

export const routingAgent = new RoutingAgentService();
