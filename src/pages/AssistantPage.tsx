import React, { useState } from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  MessageSquare,
  GraduationCap,
  Home,
  FileCheck,
  Tractor
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const { currentLanguage, services } = useGovFlow();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; link?: string; linkLabel?: string }>>([
    {
      sender: 'ai',
      text: 'Namaste! I am GovFlow AI, your civic intelligence assistant. I can guide you through 40+ central and state schemes, evaluate preliminary eligibility, and prepare auto-filled applications. What are you looking for today?',
    }
  ]);

  const handleSend = (text?: string) => {
    const q = (text || query).trim();
    if (!q) return;

    const userText = q;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setQuery('');

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = '';
      let link: string | undefined;
      let linkLabel: string | undefined;

      if (lower.includes('scholarship') || lower.includes('college') || lower.includes('student')) {
        reply = 'I found the PM Post-Matric Scholarship for Higher Education. Students with family annual income under ₹2.5L and active degree enrollment appear eligible. With your verified DigiLocker marksheet, you can submit in under 3 minutes.';
        link = '/services/SRV-EDU-001';
        linkLabel = 'View PM Post-Matric Scholarship';
      } else if (lower.includes('income') || lower.includes('certificate')) {
        reply = 'The Income & Asset Certificate issued by the Karnataka Revenue Department requires proof of residence and income declaration. Your address details are already verified via Aadhaar.';
        link = '/services/SRV-REV-002';
        linkLabel = 'View Income Certificate Scheme';
      } else if (lower.includes('house') || lower.includes('home') || lower.includes('pmay')) {
        reply = 'Pradhan Mantri Awas Yojana (PMAY-Urban) provides interest subvention up to ₹2.67 Lakh for first-time urban home buyers without an existing pucca house.';
        link = '/services/SRV-HOU-003';
        linkLabel = 'Explore PMAY Urban Subsidy';
      } else if (lower.includes('farm') || lower.includes('crop') || lower.includes('kisan')) {
        reply = 'Under PM Fasal Bima Yojana, crop insurance covers non-preventable natural risks from sowing to harvest with highly subsidized premium rates (1.5% to 2%).';
        link = '/services/SRV-AGR-004';
        linkLabel = 'View Crop Insurance Details';
      } else {
        reply = `I searched our catalog for "${userText}". You can browse all 13 categories or check your eligibility using our guided workflow.`;
        link = '/services';
        linkLabel = 'Browse All Services';
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply, link, linkLabel }]);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-gov-blue text-xs font-bold border border-blue-200 mb-2">
          <Bot className="w-3.5 h-3.5 text-gov-saffron" />
          <span>Multilingual Civic AI Advisor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy">
          GovFlow AI Conversational Assistant
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Ask questions in plain English, हिन्दी, தமிழ், or తెలుగు to discover tailored government programs.
        </p>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden flex flex-col h-[560px]">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-gov-blue text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  AI
                </div>
              )}
              <div className={`max-w-xl p-4 rounded-2xl space-y-2 ${
                m.sender === 'user'
                  ? 'bg-gov-blue text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                {m.link && (
                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to={m.link}
                      className="inline-flex items-center gap-1 text-xs font-bold text-gov-blue bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>{m.linkLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  You
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about college scholarships, income certificates, farmer subsidies..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="px-5 py-3 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
