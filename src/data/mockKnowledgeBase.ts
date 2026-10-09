import { KnowledgeArticle } from '../types';

export const INITIAL_KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    id: 'KB-IT-01',
    title: 'Campus Wi-Fi (Eduroam & Campus-Secure) Troubleshooting & Access Policy',
    category: 'IT / Wi-Fi',
    department: 'IT Services',
    summary: 'Procedures for connecting devices to Campus-Secure, MAC address registration, certificate installation, and reporting AP outages.',
    content: `1. SSID Credentials:
- Connect to 'Campus-Secure' or 'eduroam' using your Institutional ID (e.g., student_id@campus.edu) and LDAP password.
- Do NOT share your credentials; maximum 3 devices allowed per registered student account.

2. Access Point (AP) Troubleshooting:
- If a specific block or classroom shows 'Connected without Internet' or 'Authentication timed out', the departmental switch or edge AP may have tripped.
- Check if your device MAC address is whitelisted via https://netauth.campus.edu.

3. Reporting Outages:
- Block-wide or lab outages require an IT Network Operations ticket.
- Typical response time for departmental access points is 2 to 4 hours during academic hours (8:30 AM - 6:00 PM).

4. Support Desk:
- IT Helpdesk Room 104, Technology Tower. Phone: Ext. 4020. Email: net-ops@campus.edu.`,
    sourceReference: 'Campus IT Network Regulations Handbook (2025-2026), Section 4.2',
    lastUpdated: '2026-09-15',
    author: 'Campus Network Operations Team',
    tags: ['wifi', 'eduroam', 'internet', 'cse block', 'network', 'login', 'ap'],
    isVerified: true,
    contactDesk: 'IT Helpdesk (Tech Tower 104) Ext. 4020',
  },
  {
    id: 'KB-TRP-04',
    title: 'University Transport Fleet Routes, Bus Timings & Breakdown Escalation',
    category: 'Transport',
    department: 'Transport Division',
    summary: 'Standard bus fleet operating schedules, morning pickup delays, route alterations, and transport pass issues.',
    content: `1. Operational Fleet Timing:
- Morning Inbound Fleet: Commences 06:45 AM from designated terminus hubs, arriving campus between 08:15 AM - 08:30 AM.
- Evening Outbound Fleet: Departs at 04:30 PM (Regular) and 06:15 PM (Extended Lab Hours).

2. Route Delay & Timing Discrepancies:
- Route schedules are coordinated via GPS telemetry. If a bus arrives >15 minutes late or departs ahead of schedule, students should note Route Number, Bus Reg No, and Pickup Stop.
- Route adjustments for ongoing municipal roadwork are posted daily at 06:00 AM on the Transport Portal.

3. Bus Pass & Seating:
- Physical or digital QR Bus Pass must be presented upon boarding. Lost passes can be reissued at the Transport Counter (Admin Annex).

4. Contact Desk:
- Transport Central Depot Office, Near Gate 3. Emergency Fleet Hotline: Ext. 3311. Email: transport@campus.edu.`,
    sourceReference: 'Campus Transport Operations Manual, Clause 8.1',
    lastUpdated: '2026-08-20',
    author: 'Transport Officer In-Charge',
    tags: ['bus', 'transport', 'route', 'pickup', 'bus pass', 'delay', 'timing'],
    isVerified: true,
    contactDesk: 'Transport Control Room (Gate 3) Ext. 3311',
  },
  {
    id: 'KB-HST-05',
    title: 'Hostel Maintenance Protocol: Electrical, Plumbing & Room Inventory Repairs',
    category: 'Hostel',
    department: 'Hostel Administration',
    summary: 'SOP for reporting hostel electrical failures, fan/light breakdown, water supply disruptions, and carpenter requests.',
    content: `1. Room Maintenance Reporting:
- All room electrical issues (ceiling fan speed regulator, tube light, power sockets) must be logged with Hostel Block & Room Number.
- High-wattage heating appliances (immersion coils, hot plates) are strictly prohibited and may trip the floor distribution board (MCB).

2. Service Timelines:
- Standard room fixtures: Resolved within 24 hours (Routine electrical inspection daily 10:00 AM - 1:00 PM and 3:00 PM - 5:30 PM).
- Emergency water or power supply cut in hostel wing: Escalated immediately as High priority (Resolved within 4 hours).

3. Warden Verification:
- Heavy fixture replacements require endorsement by the Block Assistant Warden.

4. Contact Desk:
- Chief Warden Office, Central Hostel Hub. Maintenance Superintendent: Ext. 2105. Caretaker Desk in each block lobby.`,
    sourceReference: 'Hostel Resident Code & Maintenance Guidelines, Article 11',
    lastUpdated: '2026-09-02',
    author: 'Hostel Maintenance Division',
    tags: ['hostel', 'fan', 'light', 'room', 'plumbing', 'electrical', 'warden', 'maintenance'],
    isVerified: true,
    contactDesk: 'Central Hostel Maintenance Desk Ext. 2105',
  },
  {
    id: 'KB-FIN-03',
    title: 'Tuition & Semester Fee Payment Verification, Receipt Generation & Bank Reconciliation',
    category: 'Fees & Finance',
    department: 'Finance & Accounts',
    summary: 'Resolving failed payment gateway debits, missing payment receipts, installment approvals, and bursar reconciliations.',
    content: `1. Payment Receipt Generation:
- Payments processed via Net Banking / UPI / Cards on the ERP portal generate an instant e-receipt.
- If money is debited from bank account but receipt status shows 'Pending' or 'Failed', bank gateway reconciliation typically takes 24 to 48 banking hours.

2. Submitting Payment Proof:
- Do NOT make a duplicate payment immediately.
- Submit the Bank Transaction Reference ID (UTR / RRN number), transaction date, and screenshot to the Finance Desk.
- The accounts officer manually verifies the settlement batch with the campus nodal bank (SBI Campus Branch).

3. Late Fee Waivers:
- If technical payment failure occurred before deadline, late fee is waived upon verification of the first transaction attempt timestamp.

4. Contact Desk:
- Bursar Office & Student Accounts Section, Ground Floor, Administrative Block. Ext. 1042. Email: accounts.student@campus.edu.`,
    sourceReference: 'University Financial Policies & Fee Collection Bylaws, Section 3.4',
    lastUpdated: '2026-07-10',
    author: 'Finance & Accounts Officer',
    tags: ['fee', 'payment', 'receipt', 'finance', 'challan', 'transaction', 'utr', 'tuition'],
    isVerified: true,
    contactDesk: 'Bursar Accounts Counter (Admin Block) Ext. 1042',
  },
  {
    id: 'KB-EXAM-02',
    title: 'Examination Hall Ticket (Admit Card) Discrepancies, Seating & Attendance Eligibility',
    category: 'Examination',
    department: 'Examination Cell',
    summary: 'Protocol for hall ticket download errors, attendance shortage reviews, exam center discrepancies, and photo mismatches.',
    content: `1. Hall Ticket Release & Download:
- Hall tickets are published on the Student Portal 7 days prior to examination commencement.
- If the download button is locked or disabled, check: (a) Semester fee dues clearance, (b) Minimum 75% attendance threshold compliance.

2. Discrepancy Rectification:
- Subject code errors, missing elective listings, or photo mismatches must be rectified at least 48 hours before the first scheduled exam.
- The Examination Cell issues a provisional duplicate admit card with official seal if ERP syncing is delayed.

3. Emergency Exam Morning Issues:
- In case of lost hall ticket on the day of exam, report to Exam Control Room (Block A, Room 102) with student ID card 45 minutes prior to session.

4. Contact Desk:
- Controller of Examinations (COE) Office, Academic Block A, Room 102. Phone: Ext. 1201 / 1202. Email: coe@campus.edu.`,
    sourceReference: 'Controller of Examinations Academic Regulation Handbook, Section 9',
    lastUpdated: '2026-09-28',
    author: 'Office of Controller of Examinations',
    tags: ['exam', 'hall ticket', 'admit card', 'controller', 'seating', 'attendance', 'examination'],
    isVerified: true,
    contactDesk: 'Exam Cell (Block A-102) Ext. 1201',
  },
  {
    id: 'KB-STU-07',
    title: 'Student Identity Card Replacement, Smart RFID Access & Temporary Pass Issuance',
    category: 'Other',
    department: 'Student Services',
    summary: 'Guidelines for replacing damaged or lost student smart cards, library RFID re-encoding, and issuing temporary day passes.',
    content: `1. Reporting Lost ID Card:
- Immediately inform the Student Services Desk or disable card via Campus Portal to prevent unauthorized canteen debit or building access misuse.

2. Reissuance Process:
- Fill out the ID Card Replacement Form online.
- Pay the nominal replacement fee ($10 / ₹300) through student billing.
- Bring proof of enrollment (Semester registration slip or Government photo ID).

3. Temporary Day Pass:
- While new smart card is being printed (turnaround time: 2 business days), collect a stamped Temporary Student Pass from Security Counter Gate 1 for library and turnstile access.

4. Contact Desk:
- Student Services & Welfare Center, Student Center Building, Room B-12. Ext. 2240. Email: studentaffairs@campus.edu.`,
    sourceReference: 'Student Affairs Guidelines on Campus Identity & Smart Credential Systems',
    lastUpdated: '2026-06-12',
    author: 'Dean of Student Welfare',
    tags: ['id card', 'lost id', 'smart card', 'rfid', 'student services', 'temporary pass'],
    isVerified: true,
    contactDesk: 'Student Affairs Desk (Room B-12) Ext. 2240',
  },
  {
    id: 'KB-SEC-06',
    title: '24/7 Campus Security & Emergency Safety Protocol (Lighting, Patrols & Incident Reporting)',
    category: 'Security',
    department: 'Campus Security',
    summary: 'Emergency response for security incidents, perimeter lighting failures, suspicious activity, medical escorts, and rapid intervention.',
    content: `1. Emergency Safety Dispatch:
- Any situation involving immediate physical danger, harassment, medical distress, or severe perimeter hazard is categorized as CRITICAL priority.
- Campus Security Patrol Unit is dispatched within 5 to 8 minutes of report receipt.

2. Perimeter & Pathway Lighting Failures:
- Dark pathways, broken street lights near gates or academic alleys are prioritized for safety audits.
- Temporary mobile halogen lighting towers are deployed within 2 hours if underground electrical cable repair takes extended time.

3. Campus Night Escort Service:
- Students studying late in libraries or research laboratories after 10:00 PM can request a Security Patrol Escort to their hostel wing by dialing Ext. 9999.

4. Contact & Emergency Dispatch:
- Central Security Control Room, Main Gate 1. 24/7 Campus Emergency Hotline: Ext. 9999 / 9998. Mobile Emergency Patrol: +1 (800) 555-SAFE.`,
    sourceReference: 'Campus Safety & Emergency Preparedness Directive, Section 1',
    lastUpdated: '2026-10-01',
    author: 'Chief Security Officer',
    tags: ['security', 'safety', 'emergency', 'lighting', 'patrol', 'night escort', 'gate', 'critical'],
    isVerified: true,
    contactDesk: 'Security Central Control (Gate 1) Ext. 9999',
  },
  {
    id: 'KB-LIB-08',
    title: 'Central Library Digital Database Access, Inter-Library Loans & Overdue Clearance',
    category: 'Library',
    department: 'Central Library',
    summary: 'Remote VPN access to IEEE, ACM, ScienceDirect, renewing physical books, and library fine dispute procedure.',
    content: `1. Digital Database Remote Access:
- Off-campus access to IEEE Xplore, ScienceDirect, SpringerLink is available via the EZProxy gateway (https://elibrary.campus.edu) using university credentials.
- If access throws a 403 Forbidden or subscription expired error, the central authentication certificate may need renewal by the systems librarian.

2. Book Borrowing & Overdue Regulations:
- Undergraduate students: Up to 4 books for 14 days. Postgraduate/Research: Up to 8 books for 30 days.
- Automatic renewal is permitted twice via the online OPAC catalog unless requested by another student.

3. Contact Desk:
- Central Library Reference Desk, 2nd Floor Library Atrium. Ext. 1400. Email: library@campus.edu.`,
    sourceReference: 'Central University Library Access & Resource Sharing Bylaws, Clause 5',
    lastUpdated: '2026-08-14',
    author: 'Head University Librarian',
    tags: ['library', 'books', 'ieee', 'research', 'database', 'access', 'fines'],
    isVerified: true,
    contactDesk: 'Library Circulation Counter Ext. 1400',
  },
  {
    id: 'KB-SCH-09',
    title: 'Institutional & Government Scholarship Application Verification & Disbursement',
    category: 'Scholarship',
    department: 'Finance & Accounts',
    summary: 'Checklist for NSP, State merit-cum-means scholarships, tuition waiver endorsements, and bank account seeding.',
    content: `1. Application Endorsement:
- All scholarship applications requiring Institute Nodal Officer verification must be submitted with attested income certificate, marksheets, and domicile proof.
- Verification window closes 3 business days before the official state/national portal cutoff.

2. Disbursement Enquiries:
- Institutional merit scholarships are credited directly to the student fee ledger in the subsequent semester.
- Government direct-benefit transfers (DBT) require Aadhaar-seeded active bank accounts.

3. Contact Desk:
- Scholarship Liaison Cell, Administrative Building Room 208. Ext. 1055. Email: scholarships@campus.edu.`,
    sourceReference: 'Student Financial Aid & Scholarship Administration Manual, Section 2',
    lastUpdated: '2026-07-22',
    author: 'Scholarship Nodal Officer',
    tags: ['scholarship', 'financial aid', 'fee waiver', 'merit', 'disbursement', 'verification'],
    isVerified: true,
    contactDesk: 'Scholarship Cell (Admin 208) Ext. 1055',
  },
  {
    id: 'KB-CERT-10',
    title: 'Bonafide, Transcript, Migration & Medium of Instruction Certificates',
    category: 'Certificates',
    department: 'Academic Affairs',
    summary: 'Standard lead times, fee schedules, and self-service online application for official academic certificates.',
    content: `1. Available Certificate Types:
- Bonafide Certificate (For passport, visa, bank loan, bus pass): Issued within 24 hours via Student Self-Service Portal.
- Official Transcripts & Grade Sheets: 3 to 5 business days.
- Medium of Instruction / Character Certificate: 2 business days.

2. Delivery Options:
- Digitally signed PDF with verification QR code sent to student registered email.
- Physical embossed hardcopy collectible at the Academic Counter.

3. Contact Desk:
- Office of Academic Affairs, Window 4, Central Academic Block. Ext. 1120. Email: academic.records@campus.edu.`,
    sourceReference: 'University Academic Record & Certification Rules (2025 Revised)',
    lastUpdated: '2026-09-05',
    author: 'Registrar (Academic)',
    tags: ['bonafide', 'certificate', 'transcript', 'migration', 'documents', 'records'],
    isVerified: true,
    contactDesk: 'Academic Records Window 4 Ext. 1120',
  }
];
