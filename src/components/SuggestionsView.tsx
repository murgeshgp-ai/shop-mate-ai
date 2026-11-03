import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  Copy,
  Check,
} from 'lucide-react';
import { Suggestion, ActiveTab } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface SuggestionsViewProps {
  suggestions: Suggestion[];
  onRefreshSuggestions: () => Promise<void>;
  isRefreshing: boolean;
  lastUpdated: string;
  source: 'gemini' | 'fallback';
  setActiveTab: (tab: ActiveTab) => void;
  onAskAIQuestion: (question: string) => void;
}

export const SuggestionsView: React.FC<SuggestionsViewProps> = ({
  suggestions,
  onRefreshSuggestions,
  isRefreshing,
  lastUpdated,
  source,
  setActiveTab,
  onAskAIQuestion,
}) => {
  const { t, translateCategory, language } = useTranslation();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Inventory':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Pricing':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Sales':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const handleActionClick = (suggestion: Suggestion) => {
    if (suggestion.category === 'Inventory') {
      setActiveTab('inventory');
    } else if (suggestion.category === 'Pricing') {
      if (language === 'kn') {
        onAskAIQuestion(
          `ನನ್ನ ಅಂಗಡಿಯ ಈ ಸಲಹೆಯ ಆಧಾರದ ಮೇಲೆ ನಿಖರವಾದ ಬೆಲೆ ಬದಲಾವಣೆಗಳನ್ನು ತಿಳಿಸಿ: "${suggestion.title}".`
        );
      } else {
        onAskAIQuestion(
          `Help me optimize the pricing for my store items based on this suggestion: "${suggestion.title}". Give me exact Rupee amounts to change.`
        );
      }
    } else {
      if (language === 'kn') {
        onAskAIQuestion(
          `ಈ ಪ್ರಚಾರದ ತಂತ್ರವನ್ನು ಹೇಗೆ ಅನುಷ್ಠಾನಗೊಳಿಸಬೇಕು ಎಂದು ಹಂತ-ಹಂತವಾಗಿ ತಿಳಿಸಿ: "${suggestion.title}"?`
        );
      } else {
        onAskAIQuestion(
          `How do I implement this promotional strategy step-by-step: "${suggestion.title}"?`
        );
      }
    }
  };

  const handleCopySteps = (suggestion: Suggestion) => {
    const text = `${suggestion.title}\n${t('thCategory')}: ${suggestion.category} | ${t('impactLabel')}: ${suggestion.impact}\n\n${suggestion.summary}\n\n${t('executionSteps')}:\n${suggestion.actionSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(suggestion.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Gemini AI Status */}
      <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold">{t('geminiRecommendations')}</h2>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-400/30">
              {source === 'gemini' ? 'Gemini 3.8 Flash' : 'Smart Retail Heuristics'}
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {t('geminiSub')}
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{t('lastAnalyzed')}: {lastUpdated}</span>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefreshSuggestions}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 disabled:opacity-50 transition-all shrink-0 active:scale-95 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? t('analyzingStore') : t('runNewAnalysis')}</span>
        </button>
      </div>

      {/* 3 Suggestions Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {suggestions.map((s, index) => (
          <div
            key={s.id || index}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Top Accent Strip */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                s.urgency === 'High'
                  ? 'bg-rose-500'
                  : s.urgency === 'Medium'
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
            />

            <div>
              {/* Badges row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${getCategoryColor(
                    s.category
                  )}`}
                >
                  {translateCategory(s.category)}
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${getUrgencyBadge(
                      s.urgency
                    )}`}
                  >
                    {s.urgency} {t('priority')}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-3 text-base font-bold text-slate-900 leading-snug">
                {s.title}
              </h3>

              {/* Quantified Impact Pill */}
              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{t('impactLabel')}: {s.impact}</span>
              </div>

              {/* Summary Description */}
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                {s.summary}
              </p>

              {/* Action Steps Checklist */}
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {t('executionSteps')}
                  </span>
                  <button
                    onClick={() => handleCopySteps(s)}
                    title={t('copySteps')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    {copiedId === s.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">{t('copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>{t('copySteps')}</span>
                      </>
                    )}
                  </button>
                </div>

                <ul className="space-y-2">
                  {s.actionSteps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-800 mt-0.5">
                        {stepIdx + 1}
                      </span>
                      <span className="leading-tight">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Action button */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleActionClick(s)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
              >
                <span>{s.recommendedActionLabel || t('chatWithAi')}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Helpful context block */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">{t('needCustomAdvice')}</h4>
            <p className="text-xs text-slate-500">
              {t('needCustomDesc')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('chat')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-900 hover:bg-indigo-100 transition-colors shrink-0 cursor-pointer"
        >
          <span>{t('chatWithAi')}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
