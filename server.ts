import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if key exists
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Campus Help AI Chatbot API
app.post('/api/chat', async (req, res) => {
  const { message, history = [], currentContext } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // System instruction grounded in the Campus Knowledge Base
  const systemInstruction = `You are "Campus Help AI", an intelligent, courteous, and authoritative campus helpdesk virtual assistant for the university.
Your goal is to answer campus questions, assist students and staff in troubleshooting issues or creating helpdesk tickets, check ticket status, and route issues to the correct department.

STRICT SAFETY AND GROUNDING RULES:
1. Never invent or fabricate college rules, attendance percentages, policies, phone extensions, or official procedures.
2. If the user asks about an unknown policy not covered in the knowledge base, state clearly: "Relevant information was not found in the campus knowledge base. Would you like me to guide you to create an official helpdesk ticket for the designated department?"
3. Verified Departments: IT Services (Ext. 4020, Lead: S. Murugan), Transport Division (Ext. 3311, Lead: K. Raghavan), Hostel Administration (Ext. 2105, Lead: Dr. V. Sundaram), Finance & Accounts (Ext. 1042, Lead: Anita Roy), Examination Cell (Ext. 1201, Lead: Prof. R. Ramanathan), Student Services (Ext. 2240, Lead: Meera Sen), Campus Security (Ext. 9999 / 9998, Lead: Capt. Devraj Patil), Estate & Maintenance (Er. Rajesh Varma), Central Library (Ext. 1400, Dr. Sunita Bannerjee), Academic Affairs (Ext. 1120, K. Natarajan).
4. Verified Rules:
- Wi-Fi: Connect to 'Campus-Secure' or 'eduroam' with institutional email and LDAP password. Max 3 devices. MAC registration via netauth.campus.edu. AP fix takes 2-4 hours.
- Transport: Inbound fleet starts 6:45 AM, arrives 8:15-8:30 AM. Outbound 4:30 PM & 6:15 PM.
- Hostel: Electrical fixtures serviced 10:00 AM-1:00 PM and 3:00 PM-5:30 PM. High-wattage heating appliances strictly banned.
- Fees: Online e-receipts. Bank gateway settlement takes 24-48 business hours. Provide UTR ref for reconciliation.
- Exam Hall Ticket: Published 7 days prior. Requires >75% attendance and fee clearance. Discrepancies addressed at COE Block A-102.
- Lost ID Card: Report immediately to disable canteen debit. Temporary pass issued at Gate 1; replacement RFID printed at Room B-12 ($10 fee).
- Security: Ext. 9999 for 24/7 emergency dispatch. Night security escort available after 10 PM.
5. Offer relevant ticket suggestions or steps. If student wants to submit a ticket, provide pre-filled advice.`;

  try {
    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemInstruction}\n\nUser Question: ${message}\nContext: ${JSON.stringify(currentContext || {})}`,
              },
            ],
          },
        ],
      });

      const reply = response.text || 'I am ready to help you with your campus query.';
      return res.json({ reply, source: 'gemini-3.8-flash' });
    }
  } catch (err: any) {
    console.error('Gemini chat error, falling back to local KB engine:', err?.message);
  }

  // Smart local grounding fallback if Gemini is offline or unkeyed
  const lowerMsg = message.toLowerCase();
  let localReply = '';

  if (lowerMsg.includes('wi-fi') || lowerMsg.includes('wifi') || lowerMsg.includes('internet')) {
    localReply = `This appears to be an IT / Wi-Fi issue. 
According to campus KB-IT-01:
• You can connect to 'Campus-Secure' or 'eduroam' using your Institutional ID and LDAP password (up to 3 devices).
• If an entire block shows authentication failure, the departmental AP or PoE switch may require a restart by IT Network Operations (Tech Tower 104, Ext. 4020).
Would you like to try reconnecting via netauth.campus.edu or create a helpdesk ticket?`;
  } else if (lowerMsg.includes('bus') || lowerMsg.includes('transport') || lowerMsg.includes('route')) {
    localReply = `This pertains to the Transport Division.
According to KB-TRP-04:
• Morning buses depart terminus hubs at 06:45 AM and arrive by 08:15-08:30 AM.
• Evening outbound trips depart at 04:30 PM and 06:15 PM.
• Route delays over 15 minutes are audited via vehicle GPS telemetry (Control Room Gate 3, Ext. 3311).
Would you like to log a ticket for a specific route number?`;
  } else if (lowerMsg.includes('exam') || lowerMsg.includes('hall ticket') || lowerMsg.includes('admit card')) {
    localReply = `This relates to the Examination Cell.
According to KB-EXAM-02:
• Hall tickets require fee dues clearance and a minimum of 75% attendance.
• For course code mismatches or urgent pre-exam unlocks, the Controller of Examinations (COE) Office is located at Academic Block A, Room 102 (Ext. 1201).
Shall we create an urgent high-priority ticket for the Exam Cell?`;
  } else if (lowerMsg.includes('fee') || lowerMsg.includes('payment') || lowerMsg.includes('receipt')) {
    localReply = `This relates to Finance & Accounts.
According to KB-FIN-03:
• Online payments usually reflect within 24 to 48 banking hours.
• If your bank was debited but the receipt is pending, retain your bank UTR / Reference ID. Do not make a duplicate payment.
• The Bursar accounts desk is located on the Ground Floor of the Admin Block (Ext. 1042).`;
  } else if (lowerMsg.includes('hostel') || lowerMsg.includes('fan') || lowerMsg.includes('room')) {
    localReply = `This relates to Hostel Administration.
According to KB-HST-05:
• Room maintenance rosters (fans, lights, plumbing) operate daily from 10:00 AM - 1:00 PM and 3:00 PM - 5:30 PM.
• Report your Block and Room number so the duty electrician can be dispatched.`;
  } else if (lowerMsg.includes('id card') || lowerMsg.includes('lost id')) {
    localReply = `This relates to Student Services.
According to KB-STU-07:
• Report lost smart RFID cards promptly to deactivate canteen wallet access.
• You can collect a stamped temporary day pass from Security Gate 1 immediately.
• Replacement cards are printed in Room B-12 within 2 business days.`;
  } else if (lowerMsg.includes('safety') || lowerMsg.includes('security') || lowerMsg.includes('emergency')) {
    localReply = `This is handled by Campus Security (24/7 Control Room Gate 1).
• Immediate emergency hotline: Ext. 9999 or Ext. 9998.
• Security patrol units are dispatched within 5-8 minutes.
• Free night security escort service is available for students moving between labs and hostels after 10:00 PM.`;
  } else {
    localReply = `Hello! I am Campus Help AI. I can assist you with campus policies, IT connectivity, bus routes, examination hall tickets, hostel repairs, and fee receipts.
If you have an active issue, feel free to describe it or ask me to search the campus knowledge base!`;
  }

  return res.json({ reply: localReply, source: 'local-knowledge-base' });
});

// Setup dev server with Vite middlewares, or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Campus Helpdesk AI Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
