/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpdeskProvider, useHelpdesk } from './context/HelpdeskContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StudentDashboardView } from './components/StudentDashboardView';
import { TicketSubmissionForm } from './components/TicketSubmissionForm';
import { TicketTrackerView } from './components/TicketTrackerView';
import { MultiAgentWorkflowView } from './components/MultiAgentWorkflowView';
import { DepartmentDashboardView } from './components/DepartmentDashboardView';
import { AdminAnalyticsView } from './components/AdminAnalyticsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { CampusHelpAIChat } from './components/CampusHelpAIChat';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { Sparkles, Phone, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, isChatOpen, setIsChatOpen, isAdminUnlocked } = useHelpdesk();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'student_dashboard':
        return <StudentDashboardView />;
      case 'submit_request':
        return <TicketSubmissionForm />;
      case 'track_ticket':
        return <TicketTrackerView />;
      case 'agent_workflow':
        return <MultiAgentWorkflowView />;
      case 'department_dashboard':
        return isAdminUnlocked ? <DepartmentDashboardView /> : <StudentDashboardView />;
      case 'admin_dashboard':
        return isAdminUnlocked ? <AdminAnalyticsView /> : <StudentDashboardView />;
      case 'knowledge_base':
        return <KnowledgeBaseView />;
      case 'chat_assistant':
        return (
          <div className="max-w-4xl mx-auto space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Virtual Campus Concierge</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Campus Help AI Assistant
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Chat with our intelligent campus virtual assistant to troubleshoot issues, look up
                ticket status, check university rules, or prepare a new ticket.
              </p>
            </div>
            <CampusHelpAIChat isEmbedded={true} />
          </div>
        );
      default:
        return <StudentDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Dynamic Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderCurrentView()}
        </main>
      </div>

      {/* Floating Campus Help AI Chat Widget (when toggled via Navbar or floating trigger) */}
      <CampusHelpAIChat isEmbedded={false} />

      {/* Floating AI chat launcher button when closed */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group text-xs font-bold"
          aria-label="Open Campus Help AI"
        >
          <Sparkles className="w-4 h-4 text-sky-200 group-hover:rotate-12 transition-transform" />
          <span>Ask Campus AI</span>
        </button>
      )}

      {/* Notifications Drawer */}
      <NotificationsDrawer />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto text-xs text-slate-500 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Campus Helpdesk AI · Multi-Agent Resolution System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
            <span>24/7 Security Hotline: Ext. 9999</span>
            <span>·</span>
            <span>IT Ops: Ext. 4020</span>
            <span>·</span>
            <span>COE: Ext. 1201</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <HelpdeskProvider>
      <AppContent />
    </HelpdeskProvider>
  );
}
