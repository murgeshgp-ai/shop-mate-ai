import React from 'react';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Sparkles,
  Lightbulb,
  Store,
  AlertTriangle,
  RotateCcw,
  Bot,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lowStockCount: number;
  onResetData: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  lowStockCount,
  onResetData,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { t } = useTranslation();

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: t('navDashboard'),
      description: t('navDashboardDesc'),
      icon: LayoutDashboard,
    },
    {
      id: 'chat' as ActiveTab,
      label: t('navChat'),
      description: t('navChatDesc'),
      icon: Bot,
      highlightBadge: 'AI',
    },
    {
      id: 'inventory' as ActiveTab,
      label: t('navInventory'),
      description: t('navInventoryDesc'),
      icon: Package,
      badgeCount: lowStockCount > 0 ? lowStockCount : undefined,
    },
    {
      id: 'sales' as ActiveTab,
      label: t('navSales'),
      description: t('navSalesDesc'),
      icon: TrendingUp,
    },
    {
      id: 'suggestions' as ActiveTab,
      label: t('navSuggestions'),
      description: t('navSuggestionsDesc'),
      icon: Lightbulb,
      highlightBadge: '3 New',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800/80 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white">{t('appName')}</span>
                <span className="rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-400/30">
                  AI
                </span>
              </div>
              <p className="text-xs text-slate-400">{t('appSubtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Store Profile Card */}
        <div className="mx-4 mt-5 rounded-xl border border-slate-800 bg-slate-800/50 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></div>
              <span className="text-xs font-semibold text-slate-200">{t('storeName')}</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400">{t('storeType')}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {t('sessionActive')}
          </p>
        </div>

        {/* Main Navigation */}
        <div className="mt-6 flex-1 px-3">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {t('navDashboard')}
          </p>
          <nav className="mt-2 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    <div>
                      <div className="text-sm leading-tight">{item.label}</div>
                      <div
                        className={`text-[11px] leading-tight ${
                          isActive ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30">
                        <AlertTriangle className="h-3 w-3" />
                        {item.badgeCount}
                      </span>
                    )}

                    {item.highlightBadge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                        }`}
                      >
                        {item.highlightBadge}
                      </span>
                    )}

                    <ChevronRight
                      className={`h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 ${
                        isActive ? 'opacity-100 text-blue-200' : 'text-slate-500'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Engine Status Banner */}
        <div className="mx-4 mb-4 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 p-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-200">{t('geminiPowered')}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
            {t('geminiDesc')}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-slate-800/80 p-4">
          <button
            onClick={onResetData}
            title={t('resetDemoData')}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>{t('resetDemoData')}</span>
          </button>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center">
            <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
            <span>{t('hackathonNote')}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
