import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Award,
  PieChart,
  Calendar,
} from 'lucide-react';
import { DailySale, Product } from '../types';
import { formatCurrency, formatNumber, calculateShopStats, formatIndianDate } from '../utils/formatters';
import { useTranslation } from '../i18n/LanguageContext';

interface SalesAnalysisViewProps {
  dailySales: DailySale[];
  products: Product[];
  onOpenQuickSale: () => void;
}

export const SalesAnalysisView: React.FC<SalesAnalysisViewProps> = ({
  dailySales,
  products,
  onOpenQuickSale,
}) => {
  const { t, translateCategory } = useTranslation();
  const [timeframe, setTimeframe] = useState<'7' | '14'>('7');
  const [hoveredDay, setHoveredDay] = useState<DailySale | null>(null);

  const displayedSales =
    timeframe === '7' ? dailySales.slice(-7) : dailySales.slice(-14);

  const stats = calculateShopStats(products, displayedSales);

  const maxSale = Math.max(...displayedSales.map((d) => d.sales), 100);
  const totalTransactions = displayedSales.reduce((acc, d) => acc + d.transactions, 0);
  const avgBasket = totalTransactions > 0 ? stats.totalSales / totalTransactions : 0;

  // Calculate category revenue breakdown from sample with translation
  const categoryData = [
    { name: t('catBeverages'), revenue: 21240.0, pct: 28 },
    { name: t('catDairy'), revenue: 15400.0, pct: 20 },
    { name: t('catBakery'), revenue: 14200.0, pct: 19 },
    { name: t('catPantry'), revenue: 12500.0, pct: 16 },
    { name: t('catSnacks'), revenue: 9800.0, pct: 13 },
    { name: t('catHousehold'), revenue: 3100.0, pct: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls & Timeframe selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">{t('revenueProfitPerf')}</h2>
          <p className="text-xs text-slate-500">{t('salesSubtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-medium text-slate-600">
            <button
              onClick={() => setTimeframe('7')}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                timeframe === '7'
                  ? 'bg-white font-bold text-slate-900 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              {t('last7Days')}
            </button>
            <button
              onClick={() => setTimeframe('14')}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                timeframe === '14'
                  ? 'bg-white font-bold text-slate-900 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              {t('last14Days')}
            </button>
          </div>

          <button
            onClick={onOpenQuickSale}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{t('simulateSale')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('periodRevenue')}
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {formatCurrency(stats.totalSales)}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            {t('recordedDays')} ({displayedSales.length})
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('estGrossProfit')}
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-700 sm:text-3xl">
            {formatCurrency(stats.estimatedProfit)}
          </div>
          <div className="mt-1 text-xs font-semibold text-emerald-700">
            {stats.marginPercent}% {t('grossMargin')}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('totalOrders')}
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {formatNumber(totalTransactions)}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            ~{Math.round(totalTransactions / displayedSales.length)} {t('customersPerDay')}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('avgBasketSize')}
          </span>
          <div className="mt-2 text-2xl font-bold text-blue-600 sm:text-3xl">
            {formatCurrency(avgBasket)}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            {t('avgRevPerOrder')}
          </div>
        </div>
      </div>

      {/* Main Interactive Daily Sales & Profit Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t('chartHeading')}</h2>
            <p className="text-xs text-slate-500">{t('chartSub')}</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-blue-600"></span>
              <span className="text-slate-700">{t('revenue')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-emerald-500"></span>
              <span className="text-slate-700">{t('profit')}</span>
            </div>
          </div>
        </div>

        {/* Selected / Hovered Day Detail Banner */}
        {hoveredDay && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-2 text-xs text-white">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="font-bold">{hoveredDay.dayName}, {formatIndianDate(hoveredDay.date)}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{t('revenue')}: <strong className="text-blue-300">{formatCurrency(hoveredDay.sales)}</strong></span>
              <span>{t('cogs')}: <strong>{formatCurrency(hoveredDay.cost)}</strong></span>
              <span>{t('profit')}: <strong className="text-emerald-400">{formatCurrency(hoveredDay.profit)}</strong></span>
              <span>{t('totalOrders')}: <strong>{hoveredDay.transactions}</strong></span>
            </div>
          </div>
        )}

        {/* Bar & Trend Chart Area */}
        <div className="mt-6 flex h-64 items-end gap-2 sm:gap-4 border-b border-slate-200 pb-4 pt-6">
          {displayedSales.map((day) => {
            const salesHeightPct = Math.min(100, Math.round((day.sales / maxSale) * 100));
            const profitHeightPct = Math.min(100, Math.round((day.profit / maxSale) * 100));

            return (
              <div
                key={day.date}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className="group relative flex flex-1 flex-col items-center h-full justify-end cursor-pointer"
              >
                {/* Visual tooltip */}
                <div className="pointer-events-none absolute -top-14 z-30 hidden rounded-xl bg-slate-900 px-3 py-1.5 text-center text-[11px] text-white shadow-xl group-hover:block whitespace-nowrap">
                  <div className="font-bold text-slate-200">{day.dayName} • {formatIndianDate(day.date)}</div>
                  <div className="text-blue-300 font-semibold">{formatCurrency(day.sales)} {t('revenue')}</div>
                  <div className="text-emerald-400">+{formatCurrency(day.profit)} {t('profit')}</div>
                </div>

                <div className="flex w-full items-end justify-center gap-1 h-full">
                  {/* Revenue Bar */}
                  <div
                    style={{ height: `${salesHeightPct}%` }}
                    className="w-full max-w-[24px] rounded-t-md bg-blue-600 transition-all duration-200 group-hover:bg-blue-700"
                  />
                  {/* Profit Bar */}
                  <div
                    style={{ height: `${profitHeightPct}%` }}
                    className="w-full max-w-[24px] rounded-t-md bg-emerald-500 transition-all duration-200 group-hover:bg-emerald-600"
                  />
                </div>

                <span className="mt-3 text-[11px] font-medium text-slate-600 group-hover:text-blue-600">
                  {day.dayName}
                </span>
                <span className="text-[10px] text-slate-400">
                  {day.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column: Best-Selling Products Ranking & Category Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Best-Selling Products Ranking */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">{t('bestSellingHeading')}</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">{t('rankedByRevenue')}</span>
          </div>

          <div className="mt-4 space-y-4">
            {stats.topSellers.map((item, index) => {
              const maxRev = stats.topSellers[0].revenue;
              const barWidthPct = Math.round((item.revenue / maxRev) * 100);

              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 font-bold text-slate-700 text-[11px]">
                        #{index + 1}
                      </span>
                      <span className="font-semibold text-slate-900">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{formatCurrency(item.revenue)}</span>
                      <span className="ml-2 font-semibold text-emerald-600">
                        (+{formatCurrency(item.profit)})
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      style={{ width: `${barWidthPct}%` }}
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.unitsSold} {t('unitsSold')} • {translateCategory(item.category)}</span>
                    <span className="font-medium text-slate-600">{item.marginPercent}% {t('marginUnit')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Share Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">{t('salesByCategory')}</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">{t('distributionPct')}</span>
          </div>

          <div className="mt-4 space-y-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{formatCurrency(cat.revenue)}</span>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-700">
                      {cat.pct}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    style={{ width: `${cat.pct * 3}%` }}
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-blue-900">
            <p className="font-semibold">{t('categoryInsightTitle')}</p>
            <p className="mt-0.5 text-[11px] text-blue-800 leading-relaxed">
              {t('categoryInsightDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
