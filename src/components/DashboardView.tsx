import React from 'react';
import {
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Plus,
  ShoppingBag,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Product, DailySale, ActiveTab } from '../types';
import { formatCurrency, formatNumber, calculateShopStats, formatIndianDate } from '../utils/formatters';
import { useTranslation } from '../i18n/LanguageContext';

interface DashboardViewProps {
  products: Product[];
  dailySales: DailySale[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  onQuickRestock: (productId: string) => void;
  onAskAIQuestion: (question: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  dailySales,
  setActiveTab,
  onOpenAddModal,
  onQuickRestock,
  onAskAIQuestion,
}) => {
  const { t, translateCategory } = useTranslation();
  const stats = calculateShopStats(products, dailySales);

  // Recent 7 days for mini bar chart
  const recentDays = dailySales.slice(-7);
  const maxSale = Math.max(...recentDays.map((d) => d.sales), 100);

  const quickQuestions = [
    t('quickPrompt1'),
    t('quickPrompt2'),
    t('quickPrompt3'),
  ];

  return (
    <div className="space-y-6">
      {/* Low-stock urgent alert banner if any items are low */}
      {stats.lowStockCount > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200/80 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-950">
                {t('lowStockWarning', { count: stats.lowStockCount })}
              </h2>
              <p className="text-xs text-amber-800 mt-0.5">
                {stats.lowStockProducts.map((p) => `${p.name} (${p.quantity} ${t('leftUnits')})`).slice(0, 3).join(', ')}
                {stats.lowStockCount > 3 ? ` + ${stats.lowStockCount - 3}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setActiveTab('inventory')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition-colors shadow-xs cursor-pointer"
            >
              <span>{t('viewAndRestock')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Total Sales */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('totalSales')}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {formatCurrency(stats.totalSales)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{t('vsPrevious')}</span>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            {t('recordedDays')} ({dailySales.length})
          </div>
        </div>

        {/* 2. Total Products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('totalProducts')}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {formatNumber(stats.totalProducts)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <span>{formatNumber(stats.totalStockUnits)} {t('unitsInInventory')}</span>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            {t('retailInvValue')}: {formatCurrency(stats.inventoryRetailValue)}
          </div>
        </div>

        {/* 3. Low-Stock Products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('lowStockProducts')}
            </span>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                stats.lowStockCount > 0
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
                stats.lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-700'
              }`}
            >
              {stats.lowStockCount}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
              {stats.lowStockCount > 0 ? (
                <span className="text-amber-700 font-semibold">{t('underThreshold')}</span>
              ) : (
                <span className="text-emerald-700 font-semibold">{t('allHealthy')}</span>
              )}
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            {stats.outOfStockCount > 0
              ? `${stats.outOfStockCount} ${t('outOfStockRightNow')}`
              : t('noDepleted')}
          </div>
        </div>

        {/* 4. Estimated Profit */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('estimatedProfit')}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight text-emerald-700 sm:text-3xl">
              {formatCurrency(stats.estimatedProfit)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <span>{stats.marginPercent}% {t('grossMargin')}</span>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            {t('cogs')}: {formatCurrency(stats.totalCost)}
          </div>
        </div>
      </div>

      {/* Mid Section: Daily Sales Bar Chart Preview & AI Assistant Quick-Launch */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Daily Sales Bar Chart Preview (2 cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('recentSalesProfit')}</h2>
              <p className="text-xs text-slate-500">{t('last7DaysOverview')}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-xs bg-blue-600"></span>
                <span>{t('revenue')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500"></span>
                <span>{t('profit')}</span>
              </div>
              <button
                onClick={() => setActiveTab('sales')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
              >
                <span>{t('fullAnalysis')}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* SVG/HTML Chart Bars */}
          <div className="mt-6 flex h-52 items-end gap-3 sm:gap-6 border-b border-slate-100 pb-3 pt-4">
            {recentDays.map((day, idx) => {
              const salesHeightPct = Math.round((day.sales / maxSale) * 100);
              const profitHeightPct = Math.round((day.profit / maxSale) * 100);
              const isToday = idx === recentDays.length - 1;

              return (
                <div key={day.date} className="group relative flex flex-1 flex-col items-center h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="pointer-events-none absolute -top-12 z-20 hidden rounded-xl bg-slate-900 px-2.5 py-1 text-center text-[11px] text-white shadow-lg group-hover:block whitespace-nowrap">
                    <div className="font-semibold">{day.dayName} ({formatIndianDate(day.date)})</div>
                    <div>{t('revenue')}: {formatCurrency(day.sales)}</div>
                    <div className="text-emerald-400">{t('profit')}: {formatCurrency(day.profit)}</div>
                  </div>

                  <div className="flex w-full items-end justify-center gap-1 sm:gap-1.5 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${salesHeightPct}%` }}
                      className={`w-full max-w-[20px] rounded-t-xs transition-all duration-300 group-hover:opacity-90 ${
                        isToday ? 'bg-blue-600' : 'bg-blue-500/80'
                      }`}
                    />
                    {/* Profit Bar */}
                    <div
                      style={{ height: `${profitHeightPct}%` }}
                      className="w-full max-w-[20px] rounded-t-xs bg-emerald-500 transition-all duration-300 group-hover:opacity-90"
                    />
                  </div>
                  <span
                    className={`mt-2 text-[11px] font-medium ${
                      isToday ? 'font-bold text-blue-700' : 'text-slate-500'
                    }`}
                  >
                    {day.dayName}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span>{t('avgDailySales')}: {formatCurrency(stats.totalSales / (dailySales.length || 1))}</span>
            <span>{t('estDailyProfit')}: {formatCurrency(stats.estimatedProfit / (dailySales.length || 1))}</span>
          </div>
        </div>

        {/* AI Quick Advice Card (1 col) */}
        <div className="flex flex-col justify-between rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 p-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{t('aiAdvisorHeading')}</h2>
                  <p className="text-[11px] text-indigo-700 font-medium">Gemini 3.8 Flash</p>
                </div>
              </div>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                {t('advisorReady')}
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              {t('aiAdvisorPitch')}
            </p>

            <div className="mt-3 space-y-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onAskAIQuestion(q)}
                  className="flex w-full items-center justify-between rounded-xl border border-indigo-200/70 bg-white/90 p-2.5 text-left text-xs font-medium text-slate-700 hover:border-indigo-400 hover:bg-white hover:text-indigo-900 transition-all shadow-2xs group cursor-pointer"
                >
                  <span className="line-clamp-1">{q}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-indigo-100/70">
            <button
              onClick={() => setActiveTab('chat')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>{t('openAiChatbot')}</span>
              <ArrowRight className="h-3.5 w-3.5 text-indigo-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Low-Stock Quick Restock Table & Best Sellers Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low-Stock Quick Restock Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900">{t('lowStockReplenish')}</h2>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>{t('manageAll')}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {stats.lowStockProducts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-500">{t('allHealthyMsg')}</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-slate-100">
              {stats.lowStockProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">{product.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-amber-700">
                        {product.quantity} {product.unit} {t('leftUnits')}
                      </span>
                      <span>•</span>
                      <span>Min: {product.minStockThreshold}</span>
                      <span>•</span>
                      <span>Cost: {formatCurrency(product.purchasePrice)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onQuickRestock(product.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>{t('plus10Units')}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best-Sellers Snapshot */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">{t('topPerforming')}</h2>
            </div>
            <button
              onClick={() => setActiveTab('sales')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>{t('viewRankings')}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {stats.topSellers.slice(0, 4).map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-[11px] text-slate-500">
                      {item.unitsSold} {t('unitsSold')} • {translateCategory(item.category)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">{formatCurrency(item.revenue)}</div>
                  <div className="text-[11px] font-semibold text-emerald-600">
                    +{formatCurrency(item.profit)} ({item.marginPercent}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
