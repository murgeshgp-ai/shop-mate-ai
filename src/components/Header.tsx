import React from 'react';
import {
  Menu,
  Plus,
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenAddModal: () => void;
  onOpenQuickSale: () => void;
  onOpenChat: () => void;
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenAddModal,
  onOpenQuickSale,
  onOpenChat,
  onToggleMobileNav,
}) => {
  const { t, language } = useTranslation();

  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: t('titleDashboard'),
          subtitle: t('subtitleDashboard'),
        };
      case 'inventory':
        return {
          title: t('titleInventory'),
          subtitle: t('subtitleInventory'),
        };
      case 'sales':
        return {
          title: t('titleSales'),
          subtitle: t('subtitleSales'),
        };
      case 'suggestions':
        return {
          title: t('titleSuggestions'),
          subtitle: t('subtitleSuggestions'),
        };
      case 'chat':
        return {
          title: t('titleChat'),
          subtitle: t('subtitleChat'),
        };
    }
  };

  const current = getTabTitle(activeTab);

  const currentDate = new Intl.DateTimeFormat(
    language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN',
    {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  ).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {current.title}
            </h1>
            <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 sm:inline-flex border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" /> {t('live')}
            </span>
          </div>
          <p className="hidden text-xs text-slate-500 sm:block">{current.subtitle}</p>
        </div>
      </div>

      {/* Right: Language Selector & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <LanguageSelector />

        {/* Date Display */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 xl:flex">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>{currentDate}</span>
        </div>

        {/* Simulate Quick Sale Button */}
        <button
          onClick={onOpenQuickSale}
          title="Simulate a customer sale to see numbers update in real-time"
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ShoppingBag className="h-4 w-4 text-blue-600" />
          <span className="hidden md:inline">{t('recordQuickSale')}</span>
          <span className="md:hidden">{t('saleBtnShort')}</span>
        </button>

        {/* Add Product Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">{t('addProduct')}</span>
          <span className="sm:hidden">+</span>
        </button>

        {/* Ask AI button (if not already on chat) */}
        {activeTab !== 'chat' && (
          <button
            onClick={onOpenChat}
            className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all xl:flex border border-indigo-500/30 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span>{t('askGemini')}</span>
          </button>
        )}
      </div>
    </header>
  );
};
