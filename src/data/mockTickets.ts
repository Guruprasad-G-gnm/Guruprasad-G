import { Ticket } from '../types';

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'CHD-2026-0001',
    title: 'Wi-Fi not working in CSE block',
    description: 'The primary access point on the 3rd floor CSE block (Rooms 301-306) has been showing authentication timeouts for the entire morning lab batch. Over 60 students are unable to connect to Campus-Secure or eduroam.',
    category: 'IT / Wi-Fi',
    location: 'CSE Block 3rd Floor, Rooms 301-306',
    preferredContact: 'Campus Email',
    attachments: [
      { name: 'wifi_error_screenshot.png', size: '240 KB', type: 'image/png' },
      { name: 'ap_beacon_log.txt', size: '12 KB', type: 'text/plain' }
    ],
    studentName: 'Aarav Sharma',
    registerNumber: '2023CSE1042',
    studentDepartment: 'Computer Science and Engineering',
    studentYear: '3rd Year',
    studentEmail: 'aarav.sharma@campus.edu',
    studentPhone: '+91 98450 12345',
    status: 'In Progress',
    priority: 'HIGH',
    assignedDepartment: 'IT Services',
    assignedOfficer: 'S. Murugan',
    createdAt: '2026-10-08T09:15:00Z',
    lastUpdatedAt: '2026-10-08T11:30:00Z',
    expectedResolutionTime: '2026-10-08T17:15:00Z',
    slaBreached: false,
    agentAnalysis: {
      classification: {
        detectedCategory: 'IT / Wi-Fi',
        summary: 'IT / Wi-Fi outage at CSE Block 3rd Floor: Wi-Fi not working in CSE block. Affects 60+ students in lab batch.',
        extractedEntities: {
          location: 'CSE Block 3rd Floor, Rooms 301-306',
          affectedGroup: 'Batch / Entire Block (Multi-User Impact)',
          urgencyIndicator: 'Immediate Attention Needed',
          equipmentOrSystem: 'Campus Wi-Fi / AP Access Point',
        },
        isDuplicate: false,
        confidenceScore: 0.98,
      },
      routing: {
        assignedDepartment: 'IT Services',
        assignedOfficer: 'S. Murugan',
        officerRole: 'Lead Network Infrastructure Engineer',
        routingJustification: 'Routed to IT Services because the issue involves campus network AP hardware, DHCP leases, and departmental switchgear.',
        slaTargetHours: 8,
      },
      retrieval: {
        citations: [
          {
            id: 'KB-IT-01',
            title: 'Campus Wi-Fi (Eduroam & Campus-Secure) Troubleshooting & Access Policy',
            section: 'Campus IT Network Regulations Handbook (2025-2026), Section 4.2',
            summary: 'Procedures for connecting devices to Campus-Secure, MAC address registration, certificate installation, and reporting AP outages.',
            urlRef: 'IT Helpdesk (Tech Tower 104) Ext. 4020',
          }
        ],
        groundingStatus: 'found',
        retrievalSummary: 'Retrieved verified campus knowledge base source: [KB-IT-01: Campus Wi-Fi Policy §4.2]. Grounded strictly in official university IT directives.',
      },
      priority: {
        priority: 'HIGH',
        slaHours: 8,
        riskFactors: {
          safetyRisk: 'Low',
          studentsAffectedEstimate: '50 - 200+ Students (High Cohort Impact)',
          academicDeadlineImpact: true,
          financialImpact: false,
          serviceAvailabilityImpact: true,
          urgencyScore: 8,
        },
        reasoning: 'High priority assigned because of high-volume multi-student service interruption affecting active laboratory coursework. SLA target is 8 hours.',
      },
      resolution: {
        recommendedSolution: 'Department Access Point or PoE switch restart required by IT Network Operations team.',
        stepByStepGuidance: [
          'Verify if devices connect via alternate SSID: "Campus-Guest" temporarily.',
          'Forget network "Campus-Secure" and re-authenticate using student LDAP credentials.',
          'Network Operations field engineer dispatched to CSE Block distribution rack 3B.'
        ],
        isSelfServicePossible: false,
        requiresHumanIntervention: true,
        disclaimer: 'AI guidance is generated based on verified campus knowledge base articles. Official binding resolution will be provided by the assigned department officer.',
      },
      followUp: {
        lastFollowUpAt: '2026-10-08T11:00:00Z',
        nextFollowUpDue: '2026-10-08T13:15:00Z',
        followUpCount: 1,
        followUpRemindersSent: [
          'Automated 50% SLA milestone check: Ticket pending for 2h. Assigned engineer S. Murugan acknowledged.'
        ],
      },
      escalation: {
        isEscalated: false,
        trigger: 'none',
      },
      executedAt: '2026-10-08T09:15:12Z',
    },
    officialResponses: [
      {
        id: 'RESP-01',
        officerName: 'S. Murugan',
        officerDepartment: 'IT Services',
        message: 'Network Operations received the alert. PoE switch on Rack 3B in CSE building showed a brief power surge trip. Hardware engineer dispatched to reboot switch and reload AP firmware.',
        timestamp: '2026-10-08T10:45:00Z',
        actionTaken: 'Switch reset scheduled. Expected resolution within 90 minutes.',
        isOfficial: true,
      }
    ],
    timeline: [
      {
        id: 'TL-101',
        timestamp: '2026-10-08T09:15:00Z',
        title: 'Ticket Submitted',
        description: 'Student Aarav Sharma submitted ticket via Web Portal.',
        actor: 'Student',
        type: 'creation',
      },
      {
        id: 'TL-102',
        timestamp: '2026-10-08T09:15:05Z',
        title: 'Classification Agent Executed',
        description: 'Categorized as IT / Wi-Fi; identified 60+ student cohort impact.',
        actor: 'AI Agent',
        agentName: 'Request Classification Agent',
        type: 'ai_step',
      },
      {
        id: 'TL-103',
        timestamp: '2026-10-08T09:15:08Z',
        title: 'Department Routed',
        description: 'Assigned to IT Services (Lead: S. Murugan).',
        actor: 'AI Agent',
        agentName: 'Department Routing Agent',
        type: 'routing',
      },
      {
        id: 'TL-104',
        timestamp: '2026-10-08T09:15:10Z',
        title: 'Verified KB Retrieval',
        description: 'Retrieved KB-IT-01 (Campus IT Network Regulations §4.2).',
        actor: 'AI Agent',
        agentName: 'Information Retrieval Agent',
        type: 'ai_step',
      },
      {
        id: 'TL-105',
        timestamp: '2026-10-08T09:15:12Z',
        title: 'Priority Assessed: HIGH',
        description: 'Assigned HIGH priority with 8-hour SLA deadline.',
        actor: 'AI Agent',
        agentName: 'Priority Assessment Agent',
        type: 'ai_step',
      },
      {
        id: 'TL-106',
        timestamp: '2026-10-08T10:45:00Z',
        title: 'Department Update Posted',
        description: 'Engineer S. Murugan posted diagnostic update on Rack 3B switch.',
        actor: 'Department Officer',
        type: 'note',
      }
    ]
  },
  {
    id: 'CHD-2026-0002',
    title: 'Bus route timing issue',
    description: 'Bus Route 14 (South Terminus to Campus) has been consistently arriving 25-30 minutes late for the past 3 consecutive days, causing over 35 day-scholar students to miss their 8:30 AM attendance in 1st period classes.',
    category: 'Transport',
    location: 'Bus Route 14 (South Metro Stop)',
    preferredContact: 'Phone/SMS',
    attachments: [
      { name: 'bus_arrival_log.pdf', size: '150 KB', type: 'application/pdf' }
    ],
    studentName: 'Sneha Patel',
    registerNumber: '2024ECE2091',
    studentDepartment: 'Electronics and Communication',
    studentYear: '2nd Year',
    studentEmail: 'sneha.patel@campus.edu',
    studentPhone: '+91 97230 45678',
    status: 'Waiting for Department',
    priority: 'MEDIUM',
    assignedDepartment: 'Transport Division',
    assignedOfficer: 'K. Raghavan',
    createdAt: '2026-10-07T16:20:00Z',
    lastUpdatedAt: '2026-10-08T08:00:00Z',
    expectedResolutionTime: '2026-10-08T16:20:00Z',
    slaBreached: false,
    agentAnalysis: {
      classification: {
        detectedCategory: 'Transport',
        summary: 'Transport route delay reported: Bus Route 14 consistently 25-30 minutes late, affecting 35 commuter students.',
        extractedEntities: {
          location: 'Bus Route 14 (South Metro Stop)',
          affectedGroup: 'Commuter Cohort (Route Passengers)',
          urgencyIndicator: 'Standard Timeline',
          equipmentOrSystem: 'University Bus Transport Fleet',
        },
        isDuplicate: false,
        confidenceScore: 0.95,
      },
      routing: {
        assignedDepartment: 'Transport Division',
        assignedOfficer: 'K. Raghavan',
        officerRole: 'Senior Fleet Logistics Supervisor',
        routingJustification: 'Routed to Transport Division for transit timing discrepancies, driver GPS audit, and route dispatch adjustment.',
        slaTargetHours: 24,
      },
      retrieval: {
        citations: [
          {
            id: 'KB-TRP-04',
            title: 'University Transport Fleet Routes, Bus Timings & Breakdown Escalation',
            section: 'Campus Transport Operations Manual, Clause 8.1',
            summary: 'Standard bus fleet operating schedules, morning pickup delays, route alterations, and transport pass issues.',
            urlRef: 'Transport Control Room (Gate 3) Ext. 3311',
          }
        ],
        groundingStatus: 'found',
        retrievalSummary: 'Retrieved verified campus knowledge base source: [KB-TRP-04: Transport Operations Manual Clause 8.1].',
      },
      priority: {
        priority: 'MEDIUM',
        slaHours: 24,
        riskFactors: {
          safetyRisk: 'Low',
          studentsAffectedEstimate: '20 - 45 Students (Transit Route / Class Cohort)',
          academicDeadlineImpact: false,
          financialImpact: false,
          serviceAvailabilityImpact: true,
          urgencyScore: 5,
        },
        reasoning: 'Medium priority assigned: recurring transit delay impacting 35 students morning class attendance. Standard 24h SLA.',
      },
      resolution: {
        recommendedSolution: 'Transit route telemetry check and route timing dispatch advance by 15 minutes.',
        stepByStepGuidance: [
          'Transport officer reviewing route 14 driver GPS logs against designated schedule.',
          'Checking municipal roadwork advisory near South Metro Flyover junction.',
          'Departure time from terminus will be advanced to 06:30 AM to offset traffic congestion.'
        ],
        isSelfServicePossible: false,
        requiresHumanIntervention: true,
        disclaimer: 'AI guidance is generated based on verified campus knowledge base articles. Official binding resolution will be provided by the assigned department officer.',
      },
      followUp: {
        lastFollowUpAt: '2026-10-08T04:20:00Z',
        nextFollowUpDue: '2026-10-08T12:00:00Z',
        followUpCount: 1,
        followUpRemindersSent: [
          'Follow-up reminder sent to Transport Desk regarding route 14 timing rescheduling.'
        ],
      },
      escalation: {
        isEscalated: false,
        trigger: 'none',
      },
      executedAt: '2026-10-07T16:20:10Z',
    },
    officialResponses: [],
    timeline: [
      {
        id: 'TL-201',
        timestamp: '2026-10-07T16:20:00Z',
        title: 'Ticket Submitted',
        description: 'Student Sneha Patel logged route 14 timing irregularity.',
        actor: 'Student',
        type: 'creation',
      },
      {
        id: 'TL-202',
        timestamp: '2026-10-07T16:20:05Z',
        title: 'AI Multi-Agent Pipeline Completed',
        description: 'Assigned to Transport Division, medium priority, 24h SLA.',
        actor: 'AI Agent',
        agentName: 'Resolution Agent',
        type: 'ai_step',
      }
    ]
  },
  {
    id: 'CHD-2026-0003',
    title: 'Hostel room fan not working',
    description: 'Ceiling fan in Hostel Block B, Room 214 has stopped spinning completely. The regulator knob is also stuck. Due to warm afternoon weather, studying inside the room is difficult.',
    category: 'Hostel',
    location: 'Hostel Block B, Room 214',
    preferredContact: 'In-Person Desk',
    attachments: [],
    studentName: 'Vikram Joshi',
    registerNumber: '2023MECH3011',
    studentDepartment: 'Mechanical Engineering',
    studentYear: '3rd Year',
    studentEmail: 'vikram.joshi@campus.edu',
    studentPhone: '+91 99112 33445',
    status: 'Assigned',
    priority: 'MEDIUM',
    assignedDepartment: 'Hostel Administration',
    assignedOfficer: 'Dr. V. Sundaram',
    createdAt: '2026-10-08T08:30:00Z',
    lastUpdatedAt: '2026-10-08T08:35:00Z',
    expectedResolutionTime: '2026-10-09T08:30:00Z',
    slaBreached: false,
    agentAnalysis: {
      classification: {
        detectedCategory: 'Hostel',
        summary: 'Hostel maintenance issue: Ceiling fan and regulator failure in Hostel Block B Room 214.',
        extractedEntities: {
          location: 'Hostel Block B, Room 214',
          affectedGroup: 'Individual Student',
          urgencyIndicator: 'Standard Timeline',
          equipmentOrSystem: 'Hostel Room Electrical Fixture',
        },
        isDuplicate: false,
        confidenceScore: 0.96,
      },
      routing: {
        assignedDepartment: 'Hostel Administration',
        assignedOfficer: 'Dr. V. Sundaram',
        officerRole: 'Chief Hostel Warden & Resident Affairs',
        routingJustification: 'Routed to Hostel Administration for room inventory maintenance and electrician work order.',
        slaTargetHours: 24,
      },
      retrieval: {
        citations: [
          {
            id: 'KB-HST-05',
            title: 'Hostel Maintenance Protocol: Electrical, Plumbing & Room Inventory Repairs',
            section: 'Hostel Resident Code & Maintenance Guidelines, Article 11',
            summary: 'SOP for reporting hostel electrical failures, fan/light breakdown, and electrician rosters.',
            urlRef: 'Central Hostel Maintenance Desk Ext. 2105',
          }
        ],
        groundingStatus: 'found',
        retrievalSummary: 'Retrieved verified campus knowledge base source: [KB-HST-05: Hostel Maintenance Guidelines Art. 11].',
      },
      priority: {
        priority: 'MEDIUM',
        slaHours: 24,
        riskFactors: {
          safetyRisk: 'Low',
          studentsAffectedEstimate: '1-2 Students',
          academicDeadlineImpact: false,
          financialImpact: false,
          serviceAvailabilityImpact: false,
          urgencyScore: 4,
        },
        reasoning: 'Medium priority assigned: standard residential living amenity request with 24h maintenance turnaround.',
      },
      resolution: {
        recommendedSolution: 'Electrician dispatch during daily afternoon hostel maintenance window (3:00 PM - 5:30 PM).',
        stepByStepGuidance: [
          'Work order #HST-EL-882 logged in hostel maintenance register.',
          'Ensure room is accessible or leave room key with Block B Caretaker Desk.',
          'Electrician will replace fan capacitor and regulator unit.'
        ],
        isSelfServicePossible: false,
        requiresHumanIntervention: true,
        disclaimer: 'AI guidance is generated based on verified campus knowledge base articles. Official binding resolution will be provided by the assigned department officer.',
      },
      followUp: {
        nextFollowUpDue: '2026-10-08T20:30:00Z',
        followUpCount: 0,
        followUpRemindersSent: [],
      },
      escalation: {
        isEscalated: false,
        trigger: 'none',
      },
      executedAt: '2026-10-08T08:30:08Z',
    },
    officialResponses: [],
    timeline: [
      {
        id: 'TL-301',
        timestamp: '2026-10-08T08:30:00Z',
        title: 'Ticket Submitted',
        description: 'Student Vikram Joshi submitted fan repair request.',
        actor: 'Student',
        type: 'creation',
      },
      {
        id: 'TL-302',
        timestamp: '2026-10-08T08:30:08Z',
        title: 'AI Multi-Agent Analysis Complete',
        description: 'Classified Hostel Maintenance, routed to Dr. V. Sundaram, 24h SLA assigned.',
        actor: 'AI Agent',
        type: 'ai_step',
      }
    ]
  },
  {
    id: 'CHD-2026-0004',
    title: 'Fee payment receipt not generated',
    description: 'I paid the 5th semester tuition fees of $1,450 / ₹48,000 yesterday via Net Banking (Transaction Ref: HDFC-992817291). The money was deducted from my bank account, but the ERP portal still shows "Fee Unpaid" and no receipt was generated.',
    category: 'Fees & Finance',
    location: 'Student ERP Online Portal',
    preferredContact: 'Campus Email',
    attachments: [
      { name: 'bank_debit_statement.pdf', size: '310 KB', type: 'application/pdf' }
    ],
    studentName: 'Rohan Deshmukh',
    registerNumber: '2023CIVIL105',
    studentDepartment: 'Civil Engineering',
    studentYear: '3rd Year',
    studentEmail: 'rohan.deshmukh@campus.edu',
    studentPhone: '+91 98200 99887',
    status: 'In Progress',
    priority: 'HIGH',
    assignedDepartment: 'Finance & Accounts',
    assignedOfficer: 'Anita Roy',
    createdAt: '2026-10-07T14:10:00Z',
    lastUpdatedAt: '2026-10-08T10:15:00Z',
    expectedResolutionTime: '2026-10-07T22:10:00Z',
    slaBreached: true,
    agentAnalysis: {
      classification: {
        detectedCategory: 'Fees & Finance',
        summary: 'Tuition fee debit unverified: $1,450 paid via HDFC-992817291, receipt missing on portal.',
        extractedEntities: {
          location: 'Student ERP Online Portal',
          affectedGroup: 'Individual Student',
          urgencyIndicator: 'Financial Reconciliation',
          equipmentOrSystem: 'ERP Payment Gateway / Fee Ledger',
        },
        isDuplicate: false,
        confidenceScore: 0.97,
      },
      routing: {
        assignedDepartment: 'Finance & Accounts',
        assignedOfficer: 'Anita Roy',
        officerRole: 'Bursar & Student Accounts Head',
        routingJustification: 'Routed to Finance & Accounts for payment gateway UTR verification and fee ledger reconciliation.',
        slaTargetHours: 8,
      },
      retrieval: {
        citations: [
          {
            id: 'KB-FIN-03',
            title: 'Tuition & Semester Fee Payment Verification, Receipt Generation & Bank Reconciliation',
            section: 'University Financial Policies & Fee Collection Bylaws, Section 3.4',
            summary: 'Resolving failed payment gateway debits, missing payment receipts, and bursar reconciliations.',
            urlRef: 'Bursar Accounts Counter (Admin Block) Ext. 1042',
          }
        ],
        groundingStatus: 'found',
        retrievalSummary: 'Retrieved verified campus knowledge base source: [KB-FIN-03: University Financial Policies §3.4].',
      },
      priority: {
        priority: 'HIGH',
        slaHours: 8,
        riskFactors: {
          safetyRisk: 'Low',
          studentsAffectedEstimate: '1-2 Students',
          academicDeadlineImpact: true,
          financialImpact: true,
          serviceAvailabilityImpact: false,
          urgencyScore: 7,
        },
        reasoning: 'High priority assigned due to significant financial deduction and potential course registration block. 8h SLA target.',
      },
      resolution: {
        recommendedSolution: 'Bank gateway batch reconciliation per University Financial Bylaws §3.4.',
        stepByStepGuidance: [
          'Do NOT initiate a duplicate payment.',
          'Accounts section verifying HDFC-992817291 with nodal clearing bank.',
          'Once batch settled, e-receipt will be posted to student portal ledger.'
        ],
        isSelfServicePossible: false,
        requiresHumanIntervention: true,
        disclaimer: 'AI guidance is generated based on verified campus knowledge base articles. Official binding resolution will be provided by the assigned department officer.',
      },
      followUp: {
        lastFollowUpAt: '2026-10-08T09:00:00Z',
        nextFollowUpDue: '2026-10-08T14:00:00Z',
        followUpCount: 2,
        followUpRemindersSent: [
          'SLA threshold reached (8h target). Follow-up alert dispatched to Finance Bursar Anita Roy.',
          'Follow-up ping sent to bank gateway liaison officer.'
        ],
      },
      escalation: {
        isEscalated: true,
        escalationLevel: 2,
        escalatedTo: 'Central Helpdesk Administration (Dr. Rajesh Kumar)',
        escalationReason: 'Automatic SLA Breach: High priority fee payment reconciliation pending for >18 hours.',
        escalatedAt: '2026-10-08T06:00:00Z',
        trigger: 'sla_breach',
      },
      executedAt: '2026-10-07T14:10:09Z',
    },
    officialResponses: [
      {
        id: 'RESP-02',
        officerName: 'Anita Roy',
        officerDepartment: 'Finance & Accounts',
        message: 'The transaction reference HDFC-992817291 was located in the payment gateway uncleared batch file. Bank confirmation received at 10:00 AM today. Fee ledger is being manually credited.',
        timestamp: '2026-10-08T10:15:00Z',
        actionTaken: 'Payment ledger credited; receipt generation queued.',
        isOfficial: true,
      }
    ],
    timeline: [
      {
        id: 'TL-401',
        timestamp: '2026-10-07T14:10:00Z',
        title: 'Ticket Submitted',
        description: 'Student Rohan Deshmukh reported missing fee receipt.',
        actor: 'Student',
        type: 'creation',
      },
      {
        id: 'TL-402',
        timestamp: '2026-10-07T14:10:09Z',
        title: 'AI Multi-Agent Processing',
        description: 'Categorized Fees & Finance, assigned to Anita Roy, High priority.',
        actor: 'AI Agent',
        type: 'ai_step',
      },
      {
        id: 'TL-403',
        timestamp: '2026-10-08T06:00:00Z',
        title: 'Escalated to Level 2 (Admin)',
        description: 'Escalation Agent detected SLA breach (>8h elapsed). Escalated to Dr. Rajesh Kumar.',
        actor: 'AI Agent',
        agentName: 'Escalation Agent',
        type: 'escalation',
      },
      {
        id: 'TL-404',
        timestamp: '2026-10-08T10:15:00Z',
        title: 'Official Department Response',
        description: 'Anita Roy verified gateway batch; payment credited.',
        actor: 'Department Officer',
        type: 'note',
      }
    ]
  },
  {
    id: 'CHD-2026-0005',
    title: 'Exam hall ticket issue',
    description: 'My semester mid-term exams begin tomorrow morning at 09:00 AM, but my hall ticket download is showing an error: "Attendance threshold mismatch: Elective CS-402". My course instructor already verified my attendance is 82%, but the portal is not updated.',
    category: 'Examination',
    location: 'Controller of Examinations Portal',
    preferredContact: 'Phone/SMS',
    attachments: [
      { name: 'attendance_hod_approval.jpg', size: '420 KB', type: 'image/jpeg' }
    ],
    studentName: 'Ananya Iyer',
    registerNumber: '2022CSE045',
    studentDepartment: 'Computer Science and Engineering',
    studentYear: '4th Year',
    studentEmail: 'ananya.iyer@campus.edu',
    studentPhone: '+91 99801 11223',
    status: 'Escalated',
    priority: 'HIGH',
    assignedDepartment: 'Examination Cell',
    assignedOfficer: 'Prof. R. Ramanathan',
    createdAt: '2026-10-08T07:45:00Z',
    lastUpdatedAt: '2026-10-08T11:00:00Z',
    expectedResolutionTime: '2026-10-08T15:45:00Z',
    slaBreached: false,
    agentAnalysis: {
      classification: {
        detectedCategory: 'Examination',
        summary: 'Exam hall ticket blocked due to attendance mismatch for CS-402 with exam starting tomorrow.',
        extractedEntities: {
          location: 'Controller of Examinations Portal',
          affectedGroup: 'Individual Student',
          urgencyIndicator: 'Time-Critical / Exam Tomorrow Morning',
          equipmentOrSystem: 'Examination Portal / Seating Allocation',
        },
        isDuplicate: false,
        confidenceScore: 0.99,
      },
      routing: {
        assignedDepartment: 'Examination Cell',
        assignedOfficer: 'Prof. R. Ramanathan',
        officerRole: 'Assistant Controller of Examinations',
        routingJustification: 'Routed to Examination Cell for hall ticket unlock, attendance verification, and provisional admit card issuance.',
        slaTargetHours: 8,
      },
      retrieval: {
        citations: [
          {
            id: 'KB-EXAM-02',
            title: 'Examination Hall Ticket (Admit Card) Discrepancies, Seating & Attendance Eligibility',
            section: 'Controller of Examinations Academic Regulation Handbook, Section 9',
            summary: 'Protocol for hall ticket download errors, attendance reviews, and emergency exam morning admit cards.',
            urlRef: 'Exam Cell (Block A-102) Ext. 1201',
          }
        ],
        groundingStatus: 'found',
        retrievalSummary: 'Retrieved verified campus knowledge base source: [KB-EXAM-02: COE Handbook Section 9]. Urgent pre-exam protocol applied.',
      },
      priority: {
        priority: 'HIGH',
        slaHours: 8,
        riskFactors: {
          safetyRisk: 'Low',
          studentsAffectedEstimate: '1-2 Students',
          academicDeadlineImpact: true,
          financialImpact: false,
          serviceAvailabilityImpact: false,
          urgencyScore: 9,
        },
        reasoning: 'High priority assigned due to examination scheduled within less than 24 hours. Immediate manual override required.',
      },
      resolution: {
        recommendedSolution: 'Immediate attendance override and provisional hall ticket seal in Exam Cell Block A Room 102.',
        stepByStepGuidance: [
          'Take HOD attendance signature slip to Exam Cell Block A Room 102 immediately.',
          'Assistant Controller will execute manual portal override for course CS-402.',
          'Provisional stamped hall ticket will be printed on the spot.'
        ],
        isSelfServicePossible: false,
        requiresHumanIntervention: true,
        disclaimer: 'AI guidance is generated based on verified campus knowledge base articles. Official binding resolution will be provided by the assigned department officer.',
      },
      followUp: {
        nextFollowUpDue: '2026-10-08T11:45:00Z',
        followUpCount: 1,
        followUpRemindersSent: [
          'High priority pre-exam alert dispatched to COE Prof. Ramanathan.'
        ],
      },
      escalation: {
        isEscalated: true,
        escalationLevel: 2,
        escalatedTo: 'Central Helpdesk Administration (Dr. Rajesh Kumar)',
        escalationReason: 'Pre-exam deadline within 24h: Escalated to Admin to expedite COE database lock removal.',
        escalatedAt: '2026-10-08T09:30:00Z',
        trigger: 'student_requested',
      },
      executedAt: '2026-10-08T07:45:11Z',
    },
    officialResponses: [
      {
        id: 'RESP-03',
        officerName: 'Prof. R. Ramanathan',
        officerDepartment: 'Examination Cell',
        message: 'HOD verification slip received and approved. Portal override CS-402 initiated in COE server. Student advised to report to Block A-102 counter by 2:00 PM for duplicate sealed card.',
        timestamp: '2026-10-08T11:00:00Z',
        actionTaken: 'Attendance flag bypassed in exam database.',
        isOfficial: true,
      }
    ],
    timeline: [
      {
        id: 'TL-501',
        timestamp: '2026-10-08T07:45:00Z',
        title: 'Ticket Submitted',
        description: 'Student Ananya Iyer submitted urgent hall ticket request.',
        actor: 'Student',
        type: 'creation',
      },
      {
        id: 'TL-502',
        timestamp: '2026-10-08T07:45:11Z',
        title: 'AI Multi-Agent Prioritization',
        description: 'Classified Examination, High Priority (Urgency 9/10), routed to COE.',
        actor: 'AI Agent',
        type: 'ai_step',
      },
      {
        id: 'TL-503',
        timestamp: '2026-10-08T09:30:00Z',
        title: 'Escalated to Level 2',
        description: 'Escalated to Helpdesk Admin due to exam scheduled tomorrow morning.',
        actor: 'AI Agent',
        agentName: 'Escalation Agent',
        type: 'escalation',
      },
      {
        id: 'TL-504',
        timestamp: '2026-10-08T11:00:00Z',
        title: 'COE Response Posted',
        description: 'Prof. Ramanathan bypassed flag; hall ticket available for collection.',
        actor: 'Department Officer',
        type: 'note',
      }
    ]
  },
  {
    id: 'CHD-2026-0006',
    title: 'Lost student ID card',
    description: 'Misplaced my smart RFID student identity card somewhere in the Central Library or Student Cafeteria yesterday afternoon. Need a replacement card and temporary gate pass.',
    category: 'Other',
    location: 'Central Library / Student Cafeteria',
    preferredContact: 'Campus Email',
    attachments: [],
    studentName: 'Karthik Raja',
    registerNumber: '2024MECH204',
    studentDepartment: 'Mechanical Engineering',
    studentYear: '2nd Year',
    studentEmail: 'karthik.raja@campus.edu',
    studentPhone: '+91 97110 55443',
    status: 'Resolved',
    priority: 'MEDIUM',
    assignedDepartment: 'Student Services',
    assignedOfficer: 'Meera Sen',
    createdAt: '2026-10-06T11:00:00Z',
    lastUpdatedAt: '2026-10-07T15:30:00Z',
    expectedResolutionTime: '2026-10-07T11:00:00Z',
    slaBreached: false,
    agentAnalysis: {
      classification: {
        detectedCategory: 'Other',
        summary: 'Lost student RFID smart card reported; student requests replacement and temporary pass.',
        extractedEntities: {
          location: 'Central Library / Student Cafeteria',
          affectedGroup: 'Individual Student',
          urgencyIndicator: 'Standard Timeline',
          equipmentOrSystem: 'Student RFID Identity Card',
        },
        isDuplicate: false,
        confidenceScore: 0.94,
      },
      routing: {
        assignedDepartment: 'Student Services',
        assignedOfficer: 'Meera Sen',
        officerRole: 'Student Welfare Coordinator',
        routingJustification: 'Routed to Student Services for smart ID card deactivation, replacement printing, and temporary badge authorization.',
        slaTargetHours: 24,
      },
      retrieval: {
        citations: [
          {
            id: 'KB-STU-07',
            title: 'Student Identity Card Replacement, Smart RFID Access & Temporary Pass Issuance',
            section: 'Student Affairs Guidelines on Campus Identity & Smart Credential Systems',
            summary: 'Guidelines for replacing lost student smart cards, RFID re-encoding, and temporary passes.',
            urlRef: 'Student Affairs Desk (Room B-12) Ext. 2240',
          }
        ],
        groundingStatus: 'found',
        retrievalSummary: 'Retrieved verified campus knowledge base source: [KB-STU-07: Student Affairs Identity Guidelines].',
      },
      priority: {
        priority: 'MEDIUM',
        slaHours: 24,
        riskFactors: {
          safetyRisk: 'Low',
          studentsAffectedEstimate: '1 Student',
          academicDeadlineImpact: false,
          financialImpact: false,
          serviceAvailabilityImpact: false,
          urgencyScore: 4,
        },
        reasoning: 'Medium priority assigned: standard administrative reissuance workflow with 24h SLA.',
      },
      resolution: {
        recommendedSolution: 'Temporary entry pass issued at Gate 1; replacement smart RFID printed at Room B-12.',
        stepByStepGuidance: [
          'Old card #2024MECH204 deactivated to prevent unauthorized canteen debit.',
          'Collect stamped temporary pass from Security Gate 1 for building access.',
          'Collect new permanent RFID card from Student Affairs Room B-12 after payment of nominal fee.'
        ],
        isSelfServicePossible: true,
        requiresHumanIntervention: true,
        disclaimer: 'AI guidance is generated based on verified campus knowledge base articles. Official binding resolution will be provided by the assigned department officer.',
      },
      followUp: {
        followUpCount: 0,
        followUpRemindersSent: [],
      },
      escalation: {
        isEscalated: false,
        trigger: 'none',
      },
      executedAt: '2026-10-06T11:00:10Z',
    },
    officialResponses: [
      {
        id: 'RESP-04',
        officerName: 'Meera Sen',
        officerDepartment: 'Student Services',
        message: 'Replacement RFID smart card has been printed and encoded. Temporary pass issued at Gate 1. Card is ready for pickup at Student Welfare Desk Room B-12.',
        timestamp: '2026-10-07T14:30:00Z',
        actionTaken: 'Replacement smart card printed; old card deactivated.',
        isOfficial: true,
      }
    ],
    timeline: [
      {
        id: 'TL-601',
        timestamp: '2026-10-06T11:00:00Z',
        title: 'Ticket Submitted',
        description: 'Student Karthik Raja reported lost ID card.',
        actor: 'Student',
        type: 'creation',
      },
      {
        id: 'TL-602',
        timestamp: '2026-10-07T14:30:00Z',
        title: 'Card Printed',
        description: 'Officer Meera Sen encoded replacement RFID card.',
        actor: 'Department Officer',
        type: 'resolution',
      },
      {
        id: 'TL-603',
        timestamp: '2026-10-07T15:30:00Z',
        title: 'Ticket Marked Resolved',
        description: 'Student collected card from Room B-12.',
        actor: 'Department Officer',
        type: 'status_change',
      },
      {
        id: 'TL-604',
        timestamp: '2026-10-07T16:00:00Z',
        title: 'Student Feedback Submitted',
        description: 'Student rated resolution 5/5 stars with positive remarks.',
        actor: 'Student',
        type: 'feedback',
      }
    ],
    feedback: {
      rating: 5,
      comment: 'Super fast replacement! Temporary pass worked smoothly at library turnstiles and the new RFID card was ready next morning.',
      submittedAt: '2026-10-07T16:00:00Z',
    }
  },
  {
    id: 'CHD-2026-0007',
    title: 'Campus safety issue',
    description: 'High-voltage perimeter halogen streetlight pole near South Gate 4 has completely blacked out, and sparks were seen near the exposed base junction box after heavy rain. The walkway is completely dark and presents an acute electrocution/safety hazard for students walking to girls hostel.',
    category: 'Security',
    location: 'Perimeter Pathway near South Gate 4 / Girls Hostel Alleys',
    preferredContact: 'Phone/SMS',
    attachments: [
      { name: 'sparking_pole_base.jpg', size: '540 KB', type: 'image/jpeg' }
    ],
    studentName: 'Divya Nambiar',
    registerNumber: '2023BIOTECH012',
    studentDepartment: 'Biotechnology',
    studentYear: '3rd Year',
    studentEmail: 'divya.nambiar@campus.edu',
    studentPhone: '+91 99440 88776',
    status: 'In Progress',
    priority: 'CRITICAL',
    assignedDepartment: 'Campus Security',
    assignedOfficer: 'Capt. Devraj Patil',
    createdAt: '2026-10-08T10:00:00Z',
    lastUpdatedAt: '2026-10-08T10:45:00Z',
    expectedResolutionTime: '2026-10-08T12:00:00Z',
    slaBreached: false,
    agentAnalysis: {
      classification: {
        detectedCategory: 'Security',
        summary: 'CRITICAL safety emergency: Exposed sparking streetlight base near South Gate 4 with complete darkness along girls hostel pathway.',
        extractedEntities: {
          location: 'Perimeter Pathway near South Gate 4 / Girls Hostel Alleys',
          affectedGroup: 'Batch / Entire Block (Multi-User Impact)',
          urgencyIndicator: 'Immediate Life-Safety Hazard',
          equipmentOrSystem: 'Perimeter Security & Lighting Infrastructure',
        },
        isDuplicate: false,
        confidenceScore: 0.99,
      },
      routing: {
        assignedDepartment: 'Campus Security',
        assignedOfficer: 'Capt. Devraj Patil',
        officerRole: 'Chief Campus Security Officer',
        routingJustification: 'Routed to Campus Security due to acute physical hazard, electrical spark risk, and dark pathway security escort protocol.',
        slaTargetHours: 2,
      },
      retrieval: {
        citations: [
          {
            id: 'KB-SEC-06',
            title: '24/7 Campus Security & Emergency Safety Protocol (Lighting, Patrols & Incident Reporting)',
            section: 'Campus Safety & Emergency Preparedness Directive, Section 1',
            summary: 'Emergency response for security incidents, perimeter lighting failures, and rapid patrol vehicle dispatch.',
            urlRef: 'Security Central Control (Gate 1) Ext. 9999',
          }
        ],
        groundingStatus: 'found',
        retrievalSummary: 'Retrieved verified campus knowledge base source: [KB-SEC-06: Campus Safety Directive §1]. Emergency Level 3 Escalation protocol active.',
      },
      priority: {
        priority: 'CRITICAL',
        slaHours: 2,
        riskFactors: {
          safetyRisk: 'Critical',
          studentsAffectedEstimate: '50 - 200+ Students (High Cohort Impact)',
          academicDeadlineImpact: false,
          financialImpact: false,
          serviceAvailabilityImpact: true,
          urgencyScore: 10,
        },
        reasoning: 'Critical priority assigned: imminent electrocution hazard and severe lighting blackout on active student walkway. 2-hour mandatory SLA.',
      },
      resolution: {
        recommendedSolution: 'Immediate security cordon, mobile halogen tower deployment, and emergency electrical isolator trip.',
        stepByStepGuidance: [
          'Security Patrol Unit #2 dispatched to cordon off 20m radius around pole #SG-04.',
          'Estate electrical team notified to trip circuit breaker at Feeder Pillar 2.',
          'Mobile generator floodlight unit deployed for pathway illumination.',
          'Dial Ext. 9999 for emergency night escort service.'
        ],
        isSelfServicePossible: false,
        requiresHumanIntervention: true,
        disclaimer: 'AI guidance is generated based on verified campus knowledge base articles. Official binding resolution will be provided by the assigned department officer.',
      },
      followUp: {
        lastFollowUpAt: '2026-10-08T10:30:00Z',
        nextFollowUpDue: '2026-10-08T11:00:00Z',
        followUpCount: 1,
        followUpRemindersSent: [
          'Automated Critical priority dispatch pinged to Chief Security Officer Capt. Patil and Estate Engineer Er. Varma.'
        ],
      },
      escalation: {
        isEscalated: true,
        escalationLevel: 3,
        escalatedTo: 'Campus Director & Dean of Student Affairs',
        escalationReason: 'Automatic Level 3 escalation triggered: Ticket classified as CRITICAL safety/security hazard requiring top executive awareness.',
        escalatedAt: '2026-10-08T10:00:15Z',
        trigger: 'critical_priority',
      },
      executedAt: '2026-10-08T10:00:15Z',
    },
    officialResponses: [
      {
        id: 'RESP-05',
        officerName: 'Capt. Devraj Patil',
        officerDepartment: 'Campus Security',
        message: 'Security patrol unit cordoned off South Gate 4 pathway within 6 minutes. Estate electrical crew isolated breaker switch. Mobile halogen trailer deployed for active illumination.',
        timestamp: '2026-10-08T10:45:00Z',
        actionTaken: 'Hazard area barricaded; mobile generator floodlight active.',
        isOfficial: true,
      }
    ],
    timeline: [
      {
        id: 'TL-701',
        timestamp: '2026-10-08T10:00:00Z',
        title: 'Emergency Ticket Logged',
        description: 'Student Divya Nambiar reported sparking pole and dark walkway.',
        actor: 'Student',
        type: 'creation',
      },
      {
        id: 'TL-702',
        timestamp: '2026-10-08T10:00:15Z',
        title: 'CRITICAL Priority Assigned',
        description: 'Priority Agent assigned CRITICAL (Risk 10/10); SLA target 2 hours.',
        actor: 'AI Agent',
        agentName: 'Priority Assessment Agent',
        type: 'ai_step',
      },
      {
        id: 'TL-703',
        timestamp: '2026-10-08T10:00:16Z',
        title: 'Level 3 Escalation Triggered',
        description: 'Escalated immediately to Campus Director & Dean of Student Affairs.',
        actor: 'AI Agent',
        agentName: 'Escalation Agent',
        type: 'escalation',
      },
      {
        id: 'TL-704',
        timestamp: '2026-10-08T10:45:00Z',
        title: 'Security Cordon Established',
        description: 'Capt. Patil barricaded hazard; mobile floodlights deployed.',
        actor: 'Department Officer',
        type: 'note',
      }
    ]
  }
];
