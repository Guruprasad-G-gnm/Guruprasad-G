import React, { useState, useRef, useEffect } from 'react';
import { useHelpdesk } from '../context/HelpdeskContext';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  PlusCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'create_ticket' | 'view_ticket' | 'view_kb';
    label: string;
    payload?: any;
  };
}

export const CampusHelpAIChat: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
  const {
    isChatOpen,
    setIsChatOpen,
    tickets,
    knowledgeBase,
    setCurrentView,
    setSelectedTicketId,
    setPrefillDraft,
  } = useHelpdesk();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Hello! I am **Campus Help AI**, your university virtual assistant.\n\nI can help you:\n• Troubleshoot Wi-Fi, transport, fees, hostels & exams\n• Check the live status of any ticket\n• Suggest verified campus regulations\n• Pre-fill and submit official helpdesk tickets\n\nHow can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'My college Wi-Fi is not working in CSE block',
    'Check status of ticket CHD-2026-0001',
    'Lost student ID card procedure',
    'Bus route timing issue',
    'Fee payment receipt not generated',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!isEmbedded && !isChatOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Check if query is looking up a ticket
    const ticketMatch = query.match(/CHD-\d{4}-\d{4}/i);
    if (ticketMatch) {
      const ticketId = ticketMatch[0].toUpperCase();
      const foundTicket = tickets.find((t) => t.id === ticketId);
      if (foundTicket) {
        setTimeout(() => {
          const aiMsg: ChatMessage = {
            id: `msg-${Date.now()}-ai`,
            sender: 'ai',
            text: `Here is the current status of **${foundTicket.id}**:\n\n• **Title:** ${foundTicket.title}\n• **Status:** ${foundTicket.status}\n• **Assigned Department:** ${foundTicket.assignedDepartment} (Lead: ${foundTicket.assignedOfficer})\n• **Priority:** ${foundTicket.priority}\n• **Last Update:** ${foundTicket.officialResponses.length > 0 ? foundTicket.officialResponses[foundTicket.officialResponses.length - 1].message : 'AI Processing completed, awaiting officer review.'}`,
            timestamp: new Date().toISOString(),
            suggestedAction: {
              type: 'view_ticket',
              label: `Open Full Tracker for ${foundTicket.id}`,
              payload: foundTicket.id,
            },
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsLoading(false);
        }, 600);
        return;
      }
    }

    // Call /api/chat backend
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          currentContext: {
            ticketCount: tickets.length,
            categories: [
              'Academic',
              'Examination',
              'Fees & Finance',
              'Hostel',
              'Transport',
              'IT / Wi-Fi',
              'Security',
            ],
          },
        }),
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      let action: ChatMessage['suggestedAction'] | undefined = undefined;
      const lower = query.toLowerCase();

      if (
        lower.includes('wi-fi') ||
        lower.includes('wifi') ||
        lower.includes('bus') ||
        lower.includes('fee') ||
        lower.includes('hostel') ||
        lower.includes('fan') ||
        lower.includes('exam') ||
        lower.includes('ticket') ||
        lower.includes('lost') ||
        lower.includes('not working')
      ) {
        action = {
          type: 'create_ticket',
          label: 'Create Helpdesk Ticket for this issue',
          payload: {
            title: query,
            description: `Issue reported via Campus Help AI: ${query}`,
          },
        };
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toISOString(),
        suggestedAction: action,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error, using fallback:', err);
      // Fallback message
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: 'I understand your query. For official resolution and tracking, you can create a new request or search verified articles in the Campus Knowledge Base.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: ChatMessage['suggestedAction']) => {
    if (!action) return;
    if (action.type === 'create_ticket') {
      if (action.payload) {
        setPrefillDraft(action.payload);
      }
      setCurrentView('submit_request');
      setIsChatOpen(false);
    } else if (action.type === 'view_ticket') {
      setSelectedTicketId(action.payload);
      setCurrentView('track_ticket');
      setIsChatOpen(false);
    } else if (action.type === 'view_kb') {
      setCurrentView('knowledge_base');
      setIsChatOpen(false);
    }
  };

  const containerClasses = isEmbedded
    ? 'w-full h-[650px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden'
    : 'fixed bottom-5 right-5 w-96 sm:w-[420px] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 duration-200';

  return (
    <div className={containerClasses}>
      {/* Chat Header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-sky-700 to-blue-800 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-sky-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold">Campus Help AI</span>
              <span className="text-[10px] bg-sky-500/40 px-1.5 py-0.2 rounded font-mono font-medium">
                Grounded
              </span>
            </div>
            <p className="text-[11px] text-sky-200">Grounded in official university KB</p>
          </div>
        </div>
        {!isEmbedded && (
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-6 h-6 rounded-md bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-xs shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
              }`}
            >
              <div className="whitespace-pre-line text-xs">{m.text}</div>

              {/* Action Button inside AI reply */}
              {m.suggestedAction && (
                <div className="mt-2.5 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleActionClick(m.suggestedAction)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors w-full justify-center"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-sky-600" />
                    <span>{m.suggestedAction.label}</span>
                  </button>
                </div>
              )}

              <span
                className={`text-[9px] block mt-1 text-right font-mono ${
                  m.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                }`}
              >
                {new Date(m.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs">
            <div className="w-6 h-6 rounded-md bg-sky-600 text-white flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-xs text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-[11px]">Searching campus knowledge...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions pills */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-600">
        <span className="text-[10px] font-semibold text-slate-400 shrink-0">Try:</span>
        {quickPrompts.slice(0, 3).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-slate-700 shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question or enter Ticket ID..."
          className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white transition-colors shrink-0 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
