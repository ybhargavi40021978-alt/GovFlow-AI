import React, { useState, useRef, useEffect } from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { MessageSquare, X, Send, Sparkles, Bot, User, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: { label: string; link?: string; onClick?: () => void }[];
  matchedServiceId?: string;
}

export const AIAssistantWidget: React.FC = () => {
  const { isAssistantOpen, setIsAssistantOpen, currentLanguage, services } = useGovFlow();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-init',
        sender: 'ai',
        text: currentLanguage === 'hi' 
          ? 'नमस्ते! मैं GovFlow AI हूँ। आप किस सरकारी योजना या प्रमाणपत्र के बारे में जानकारी चाहते हैं?'
          : currentLanguage === 'ta'
          ? 'வணக்கம்! நான் GovFlow AI. நீங்கள் என்ன அரசு சேவை அல்லது திட்டத்தை தேடுகிறீர்கள்?'
          : currentLanguage === 'te'
          ? 'నమస్కారం! నేను GovFlow AI. మీకు ఏ ప్రభుత్వ పథకం లేదా ధృవీకరణ పత్రం సహాయం కావాలి?'
          : 'Namaste! I am your GovFlow AI Assistant. What government service or certificate can I help you find today?',
        timestamp: 'Just now',
        actionButtons: [
          { label: '🎓 College Scholarships', link: '/services/SRV-EDU-001' },
          { label: '📜 Income Certificate', link: '/services/SRV-REV-002' },
          { label: '🏠 Housing Subsidy (PMAY)', link: '/services/SRV-HOU-003' },
          { label: '🌾 Crop Insurance', link: '/services/SRV-AGR-004' },
        ]
      }
    ];
  });

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAssistantOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // AI logic
    setTimeout(() => {
      const q = query.toLowerCase();
      let responseText = '';
      let actions: { label: string; link?: string }[] = [];
      let matchedServiceId: string | undefined;

      if (q.includes('scholarship') || q.includes('college') || q.includes('student') || q.includes('education') || q.includes('छात्रवृत्ति')) {
        responseText = 'I identified the **PM Post-Matric Scholarship for Higher Education** (94% match) and **National Career Service Skill Training**. Under central rules, students with family income <= ₹2.5L qualify for tuition subvention.';
        matchedServiceId = 'SRV-EDU-001';
        actions = [
          { label: 'Check Eligibility Now', link: '/eligibility/SRV-EDU-001' },
          { label: 'View Service Details', link: '/services/SRV-EDU-001' },
          { label: 'Check Required Documents', link: '/documents' },
        ];
      } else if (q.includes('income') || q.includes('certificate') || q.includes('आय') || q.includes('tahsildar') || q.includes('tehsildar')) {
        responseText = 'For an **Income & Asset Certificate**, the Revenue Department requires an electricity bill and self-affidavit. With GovFlow auto-fill, verified address details are fetched directly.';
        matchedServiceId = 'SRV-REV-002';
        actions = [
          { label: 'Check Income Rules', link: '/eligibility/SRV-REV-002' },
          { label: 'Apply with Auto-fill', link: '/services/SRV-REV-002/apply' },
        ];
      } else if (q.includes('house') || q.includes('home') || q.includes('pmay') || q.includes('आवास') || q.includes('flat')) {
        responseText = 'Under **Pradhan Mantri Awas Yojana (PMAY-Urban)**, first-time home buyers from EWS, LIG, and MIG categories can receive up to ₹2.67 Lakh upfront interest subsidy.';
        matchedServiceId = 'SRV-HOU-003';
        actions = [
          { label: 'Check PMAY Eligibility', link: '/eligibility/SRV-HOU-003' },
          { label: 'View PMAY Details', link: '/services/SRV-HOU-003' },
        ];
      } else if (q.includes('farm') || q.includes('crop') || q.includes('किसान') || q.includes('kisan') || q.includes('insurance')) {
        responseText = 'The **Pradhan Mantri Fasal Bima Yojana (PMFBY)** covers seasonal crop loss. Land records can be cross-verified via State Bhoomi/Bhulekh integration.';
        matchedServiceId = 'SRV-AGR-004';
        actions = [
          { label: 'Check Crop Insurance', link: '/services/SRV-AGR-004' },
          { label: 'Verify Land Record', link: '/documents' },
        ];
      } else if (q.includes('track') || q.includes('status') || q.includes('application')) {
        responseText = 'You have active applications: **PM Post-Matric Scholarship** (`GF-2026-89421`) is currently at *Document Validation*, and **Income Certificate** (`GF-2026-77319`) is in *Revenue Field Verification*.';
        actions = [
          { label: 'Go to Unified Tracking', link: '/applications' },
          { label: 'View Dashboard', link: '/dashboard' },
        ];
      } else {
        responseText = `I searched our unified catalog of 13 categories. Based on "${query}", I recommend exploring our conversational service discovery or browsing by your current life event.`;
        actions = [
          { label: 'Open Search Hub', link: '/search' },
          { label: 'Browse All Services', link: '/services' },
        ];
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: actions,
        matchedServiceId,
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isAssistantOpen && (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-gov-navy to-gov-blue text-white rounded-full shadow-elevation hover:shadow-2xl hover:scale-105 transition-all duration-200 border border-blue-400/30 group"
          aria-label="Open GovFlow AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
          </div>
          <span className="text-xs font-bold tracking-wide">Ask GovFlow AI</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isAssistantOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-white rounded-2xl shadow-elevation border border-slate-200 flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-900 to-gov-navy text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm leading-none">
                  <span>GovFlow AI Advisor</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Natural Language Civic Service Discovery
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAssistantOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-banner disclaimer */}
          <div className="px-3 py-1 bg-amber-50 border-b border-amber-100 flex items-center gap-1.5 text-[10px] text-amber-800">
            <Shield className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span>Preliminary guidance only. Final eligibility determined by concerned ministry.</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-gov-blue text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                    AI
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-gov-blue text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Action Buttons */}
                  {msg.actionButtons && msg.actionButtons.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-100">
                      {msg.actionButtons.map((btn, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (btn.link) {
                              setIsAssistantOpen(false);
                              navigate(btn.link);
                            } else if (btn.onClick) {
                              btn.onClick();
                            }
                          }}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-gov-blue font-semibold rounded-lg text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <span>{btn.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[9px] text-right font-mono ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                    You
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                <div className="w-6 h-6 rounded-full bg-gov-blue/20 text-gov-blue flex items-center justify-center text-[10px]">
                  AI
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gov-blue rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gov-blue rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gov-blue rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span>Analyzing government eligibility rules...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <span className="text-slate-400 font-semibold flex-shrink-0">Suggestions:</span>
            <button
              onClick={() => handleSend("I want financial support for college")}
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
            >
              College Grant
            </button>
            <button
              onClick={() => handleSend("I need an income certificate")}
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
            >
              Income Cert
            </button>
            <button
              onClick={() => handleSend("Where can I apply for PMAY home subsidy?")}
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
            >
              PMAY Housing
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask in English, हिन्दी, தமிழ், or తెలుగు..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-2 bg-gov-blue hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
