import React, { useState } from 'react';
import { Bot, Send, Sparkles, ChevronRight, Car, RefreshCw } from 'lucide-react';
import { askAiAdvisor } from '../services/api';
import { Locale, translations } from '../data/translations';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  referencedSlugs?: string[];
  confidence?: string;
  timestamp: string;
}

interface AiAdvisorPageProps {
  locale: Locale;
  onNavigate: (page: string, slug?: string) => void;
}

export const AiAdvisorPage: React.FC<AiAdvisorPageProps> = ({ locale, onNavigate }) => {
  const t = translations[locale];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: locale === 'it' 
        ? 'Benvenuto nell’AI Strategic Advisor del settore Automotive Intelligence. Posso analizzare le tendenze di mercato d’asta, i costi di restauro, la liquidità e consigliare allocazioni di portafoglio su 300 modelli storici europei. Come posso assisterti oggi?'
        : 'Welcome to the AI Strategic Automotive Advisor. I can synthesize auction market dynamics, maintenance budgets, and portfolio allocation strategies across 300 European iconic cars. How can I assist your collection strategy today?',
      referencedSlugs: ['ferrari-f40', 'porsche-959-komfort'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const presets = [
    t.advisor_preset_1,
    t.advisor_preset_2,
    t.advisor_preset_3
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputVal;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputVal('');
    setLoading(true);

    const res = await askAiAdvisor(textToSend, locale);

    const aiMsg: Message = {
      id: `a-${Date.now()}`,
      sender: 'ai',
      text: res.answer,
      referencedSlugs: res.referenced_slugs,
      confidence: res.confidence,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#141826] via-[#1a2033] to-[#121624] p-6 rounded-2xl border border-red-500/30 space-y-2">
        <div className="flex items-center space-x-2 text-red-400">
          <Bot className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Gemini 3.6 Flash Grounded Assistant</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">{t.ai_advisor_title}</h1>
        <p className="text-xs text-slate-300">
          Grounded responses backed by our 300-vehicle database, historical auction records, and rarity metrics.
        </p>
      </div>

      {/* Preset Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(preset)}
            className="p-3 bg-[#121520] hover:bg-[#181d2e] border border-[#232a3d] hover:border-red-500/40 rounded-xl text-left text-xs text-slate-300 hover:text-red-300 transition-all cursor-pointer flex justify-between items-center group"
          >
            <span className="line-clamp-2 pr-2">{preset}</span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 shrink-0" />
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-[#121520] rounded-2xl border border-[#23293a] p-4 sm:p-6 space-y-4 min-h-[400px] flex flex-col justify-between">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-red-400" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-red-600 text-white font-medium rounded-tr-none'
                    : 'bg-[#181c2b] text-slate-200 border border-[#283045] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Referenced Slugs clickable links */}
                {msg.referencedSlugs && msg.referencedSlugs.length > 0 && (
                  <div className="pt-2 border-t border-[#2a3248] flex flex-wrap gap-2">
                    <span className="text-[10px] text-slate-400 block font-semibold">Referenced Vehicles:</span>
                    {msg.referencedSlugs.map(slug => (
                      <button
                        key={slug}
                        onClick={() => onNavigate('detail', slug)}
                        className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold hover:bg-red-600 hover:text-slate-950 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Car className="w-3 h-3" />
                        <span>{slug}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[10px] opacity-60 text-right">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-red-400 animate-pulse p-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Synthesizing Gemini AI response...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="pt-4 border-t border-[#222838] flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask AI about valuation, maintenance budgets, or auction forecasts..."
            className="flex-1 bg-[#171b28] text-xs text-slate-200 placeholder-slate-500 px-4 py-3 rounded-xl border border-[#293146] focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
