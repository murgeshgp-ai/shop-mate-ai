import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';
import { ChatMessage, Product, DailySale } from '../types';
import { calculateShopStats, formatCurrency } from '../utils/formatters';
import { useTranslation } from '../i18n/LanguageContext';

interface ChatViewProps {
  products: Product[];
  dailySales: DailySale[];
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  products,
  dailySales,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const { t, language } = useTranslation();
  const stats = calculateShopStats(products, dailySales);

  const getWelcomeMessage = () => {
    return t('welcomeMessage', {
      products: stats.totalProducts,
      units: stats.totalStockUnits,
      lowStock: stats.lowStockCount,
      sales: formatCurrency(stats.totalSales),
      margin: stats.marginPercent,
    });
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini',
    },
  ]);

  // Update welcome message if user changes language and hasn't started a deep chat yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1 && prev[0]?.id === 'welcome') {
        return [
          {
            id: 'welcome',
            role: 'assistant',
            content: getWelcomeMessage(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'gemini',
          },
        ];
      }
      return prev;
    });
  }, [language, stats.totalProducts, stats.lowStockCount, stats.totalSales]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle incoming initial question triggered from dashboard/suggestions
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      handleSendMessage(initialQuestion);
      onClearInitialQuestion?.();
    }
  }, [initialQuestion]);

  const handleSendMessage = async (userPrompt?: string) => {
    const text = (userPrompt ?? input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          shopContext: {
            totalProducts: stats.totalProducts,
            totalStockUnits: stats.totalStockUnits,
            lowStockCount: stats.lowStockCount,
            lowStockItems: stats.lowStockProducts.map((p) => ({
              name: p.name,
              quantity: p.quantity,
              cost: p.purchasePrice,
              price: p.sellingPrice,
            })),
            totalSales: stats.totalSales,
            estimatedProfit: stats.estimatedProfit,
            marginPercent: stats.marginPercent,
            topSellers: stats.topSellers.map((s) => ({
              name: s.name,
              unitsSold: s.unitsSold,
              revenue: s.revenue,
            })),
          },
        }),
      });

      const data = await response.json();
      const replyContent =
        data.reply ||
        (language === 'kn'
          ? 'ನಾನು ನಿಮ್ಮ ಅಂಗಡಿಯ ವಿವರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿದ್ದೇನೆ. ಇಂದು ಸ್ಟಾಕ್ ಮರುಆದೇಶ ಅಥವಾ ಲಾಭದ ಮಾರ್ಜಿನ್ ಹೆಚ್ಚಿಸುವ ಬಗ್ಗೆ ಚರ್ಚಿಸೋಣವೇ?'
          : 'I have analyzed your shop metrics. Would you like me to focus on inventory replenishment or profit margin enhancement?');

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content:
          language === 'kn'
            ? `ನಿಮ್ಮ **${stats.lowStockCount} ಕಡಿಮೆ ಸ್ಟಾಕ್ ಉತ್ಪನ್ನಗಳಿಗೆ** ತಕ್ಷಣವೇ ಮರುಆದೇಶ ಕಳುಹಿಸಲು ಸಲಹೆ ಮಾಡುತ್ತೇನೆ. ಇದರಿಂದ ಗ್ರಾಹಕರು ಹಿಂತಿರುಗಿ ಹೋಗುವುದನ್ನು ತಡೆಯಬಹುದು.`
            : `I recommend addressing your **${stats.lowStockCount} low-stock products** first (especially items with under 10 units left) to prevent lost walk-in customers today. Check your Inventory tab to place replenishment orders.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'fallback',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'gemini',
      },
    ]);
  };

  const samplePrompts = [
    t('quickPrompt1'),
    t('quickPrompt2'),
    t('quickPrompt3'),
    t('quickPrompt4'),
    t('quickPrompt5'),
  ];

  // Markdown formatter for bold and bullet points
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Process bold tags
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const formattedParts = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
            }
            return part;
          });

          // Bullet points
          if (line.trim().startsWith('•') || line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const bulletText = line.replace(/^[\s•\-\*]+/, '');
            const bParts = bulletText.split(/(\*\*.*?\*\*)/g);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  {bParts.map((p, pIdx) =>
                    p.startsWith('**') && p.endsWith('**') ? (
                      <strong key={pIdx} className="font-bold text-slate-900">{p.slice(2, -2)}</strong>
                    ) : (
                      p
                    )
                  )}
                </span>
              </div>
            );
          }

          // Numbered lists (1., 2., etc.)
          const numMatch = line.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            const [, num, itemText] = numMatch;
            const nParts = itemText.split(/(\*\*.*?\*\*)/g);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="font-bold text-blue-600 min-w-[16px]">{num}.</span>
                <span>
                  {nParts.map((p, pIdx) =>
                    p.startsWith('**') && p.endsWith('**') ? (
                      <strong key={pIdx} className="font-bold text-slate-900">{p.slice(2, -2)}</strong>
                    ) : (
                      p
                    )
                  )}
                </span>
              </div>
            );
          }

          return <p key={idx}>{formattedParts}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Chat Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white shadow-xs">
            <Bot className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">{t('chatHeaderTitle')}</h2>
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {t('chatContextSummary', {
                products: stats.totalProducts,
                lowStock: stats.lowStockCount,
                sales: formatCurrency(stats.totalSales),
              })}
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          title={t('clearChat')}
          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="hidden sm:inline">{t('clearChat')}</span>
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="border-b border-slate-100 bg-slate-50/40 px-6 py-2.5 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-500" /> {t('quickAsk')}
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-900 transition-all shadow-2xs cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-indigo-300 border border-indigo-500/20'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-2xl rounded-2xl p-4 shadow-2xs ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs'
                }`}
              >
                {/* Formatted body */}
                {isUser ? (
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">{message.content}</p>
                ) : (
                  <div>{renderFormattedContent(message.content)}</div>
                )}

                {/* Footer bar */}
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isUser ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  <span>{message.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handleCopyMessage(message.id, message.content)}
                      title={t('copySteps')}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-opacity cursor-pointer"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">{t('copied')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>{t('copySteps')}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-indigo-300">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-xs bg-slate-50 border border-slate-200 p-4 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce"></span>
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {t('chatThinking')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="border-t border-slate-100 bg-white p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={t('chatInputPlaceholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs hover:bg-blue-700 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-slate-400">
          {t('chatFooterNote')}
        </p>
      </div>
    </div>
  );
};
