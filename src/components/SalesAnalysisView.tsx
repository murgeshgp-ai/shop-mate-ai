import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Award,
  PieChart,
  Calendar,
  Download,
  DollarSign,
  Wallet,
  BookOpen,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { DailySale, Product, Bill, Expense, FinancialSummary } from '../types';
import { formatCurrency, formatNumber, calculateShopStats, formatIndianDate } from '../utils/formatters';
import { useTranslation } from '../i18n/LanguageContext';

interface SalesAnalysisViewProps {
  dailySales: DailySale[];
  products: Product[];
  bills?: Bill[];
  expenses?: Expense[];
  financialSummary?: FinancialSummary | null;
  onOpenQuickSale: () => void;
}

export const SalesAnalysisView: React.FC<SalesAnalysisViewProps> = ({
  dailySales,
  products,
  bills = [],
  expenses = [],
  financialSummary,
  onOpenQuickSale,
}) => {
  const { t, translateCategory } = useTranslation();
  const [timeframe, setTimeframe] = useState<'7' | '14' | '30'>('7');
  const [hoveredDay, setHoveredDay] = useState<DailySale | null>(null);

  const displayedSales = useMemo(() => {
    if (timeframe === '7') return dailySales.slice(-7);
    if (timeframe === '14') return dailySales.slice(-14);
    return dailySales;
  }, [dailySales, timeframe]);

  const stats = calculateShopStats(products, displayedSales);

  // Financial calculations
  const totalRevenue = financialSummary?.totalRevenue ?? stats.totalSales;
  const costOfGoodsSold = financialSummary?.costOfGoodsSold ?? financialSummary?.costOfGoods ?? stats.totalCost;
  const grossProfit = financialSummary?.grossProfit ?? stats.estimatedProfit;
  const totalExpenses = financialSummary?.totalOperatingExpenses ?? financialSummary?.totalExpenses ?? expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = financialSummary?.netProfit ?? Math.max(0, grossProfit - totalExpenses);
  const cashReceived = financialSummary?.cashReceived ?? (totalRevenue * 0.88);
  const outstandingCredit = financialSummary?.outstandingCredit ?? (totalRevenue * 0.12);
  const netMarginPercent = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const maxSale = Math.max(...displayedSales.map((d) => d.sales), 100);
  const totalTransactions = displayedSales.reduce((acc, d) => acc + d.transactions, 0);
  const avgBasket = totalTransactions > 0 ? stats.totalSales / totalTransactions : 0;

  // Payment Breakdown
  const paymentBreakdown = useMemo(() => {
    if (bills.length > 0) {
      const cash = bills.filter((b) => b.paymentMethod === 'cash').reduce((s, b) => s + (b.totalAmount || b.finalAmount || 0), 0);
      const upi = bills.filter((b) => b.paymentMethod === 'upi').reduce((s, b) => s + (b.totalAmount || b.finalAmount || 0), 0);
      const credit = bills.filter((b) => b.paymentMethod === 'credit').reduce((s, b) => s + (b.totalAmount || b.finalAmount || 0), 0);
      const total = cash + upi + credit || 1;
      return [
        { name: t('payCash'), amount: cash, pct: Math.round((cash / total) * 100), color: 'bg-emerald-500' },
        { name: t('payUpi'), amount: upi, pct: Math.round((upi / total) * 100), color: 'bg-blue-600' },
        { name: t('payCredit'), amount: credit, pct: Math.round((credit / total) * 100), color: 'bg-amber-500' },
      ];
    }
    return [
      { name: t('payCash'), amount: totalRevenue * 0.52, pct: 52, color: 'bg-emerald-500' },
      { name: t('payUpi'), amount: totalRevenue * 0.36, pct: 36, color: 'bg-blue-600' },
      { name: t('payCredit'), amount: totalRevenue * 0.12, pct: 12, color: 'bg-amber-500' },
    ];
  }, [bills, totalRevenue, t]);

  // Product-wise Profitability Breakdown
  const productProfitability = useMemo(() => {
    return products.map((p) => {
      const marginRupees = p.sellingPrice - p.purchasePrice;
      const marginPct = p.sellingPrice > 0 ? Math.round((marginRupees / p.sellingPrice) * 100) : 0;
      const unitsSoldEstimate = Math.max(12, Math.round(1500 / (p.sellingPrice || 10)));
      const totalProfitEstimate = marginRupees * unitsSoldEstimate;

      return {
        id: p.id,
        name: p.name,
        category: p.category,
        purchasePrice: p.purchasePrice,
        sellingPrice: p.sellingPrice,
        marginRupees,
        marginPct,
        unitsSold: unitsSoldEstimate,
        totalProfit: totalProfitEstimate,
      };
    }).sort((a, b) => b.totalProfit - a.totalProfit);
  }, [products]);

  // CSV Report Generator
  const handleExportCsv = () => {
    const headers = ['Date', 'Day', 'Revenue (INR)', 'COGS (INR)', 'Gross Profit (INR)', 'Transactions'];
    const rows = displayedSales.map((d) => [
      d.date,
      d.dayName,
      d.sales.toFixed(2),
      d.cost.toFixed(2),
      d.profit.toFixed(2),
      d.transactions,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShopMate_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">{t('financialDashboardHeading')}</h2>
          <p className="text-xs text-slate-500">{t('financialDashboardSub')}</p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-medium text-slate-600">
            <button
              onClick={() => setTimeframe('7')}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                timeframe === '7' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              {t('dailySalesTab')}
            </button>
            <button
              onClick={() => setTimeframe('14')}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                timeframe === '14' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              {t('weeklySalesTab')}
            </button>
            <button
              onClick={() => setTimeframe('30')}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                timeframe === '30' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              {t('monthlySalesTab')}
            </button>
          </div>

          {/* CSV Download Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>{t('downloadCsvReport')}</span>
          </button>

          <button
            onClick={onOpenQuickSale}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{t('simulateSale')}</span>
          </button>
        </div>
      </div>

      {/* Row 1: Core Financial Dashboard KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('totalRevenue')}
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            COGS: {formatCurrency(costOfGoodsSold)}
          </div>
        </div>

        {/* Gross Profit */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('grossProfit')}
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-700 sm:text-3xl">
            {formatCurrency(grossProfit)}
          </div>
          <div className="mt-1 text-xs font-semibold text-emerald-700">
            {stats.marginPercent}% {t('grossMargin')}
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('operatingExpenses')}
          </span>
          <div className="mt-2 text-2xl font-bold text-rose-700 sm:text-3xl">
            {formatCurrency(totalExpenses)}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Rent, bills, staff & packaging
          </div>
        </div>

        {/* Net Profit (True Bottom Line) */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs ring-1 ring-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {t('netProfit')}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
              {netMarginPercent}% {t('netMarginLabel')}
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-900 sm:text-3xl">
            {formatCurrency(netProfit)}
          </div>
          <div className="mt-1 text-xs text-emerald-700 font-medium">
            Gross Profit minus Expenses
          </div>
        </div>
      </div>

      {/* Row 2: Cash Realized vs Outstanding Customer Credit (Udhar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cash Realized */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                {t('cashReceived')}
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-950 mt-2">
              {formatCurrency(cashReceived)}
            </div>
            <p className="text-[11px] text-blue-700 mt-1">
              Realized funds in cash drawer & bank UPI account
            </p>
          </div>
        </div>

        {/* Outstanding Credit (Udhar) */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                {t('outstandingCredit')}
              </span>
            </div>
            <div className="text-2xl font-bold text-amber-950 mt-2">
              {formatCurrency(outstandingCredit)}
            </div>
            <p className="text-[11px] text-amber-700 mt-1">
              Unpaid customer ledger balances • Not counted as cash
            </p>
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

        {/* Hovered Day Banner */}
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
                <div className="pointer-events-none absolute -top-14 z-30 hidden rounded-xl bg-slate-900 px-3 py-1.5 text-center text-[11px] text-white shadow-xl group-hover:block whitespace-nowrap">
                  <div className="font-bold text-slate-200">{day.dayName} • {formatIndianDate(day.date)}</div>
                  <div className="text-blue-300 font-semibold">{formatCurrency(day.sales)} {t('revenue')}</div>
                  <div className="text-emerald-400">+{formatCurrency(day.profit)} {t('profit')}</div>
                </div>

                <div className="flex w-full items-end justify-center gap-1 h-full">
                  <div
                    style={{ height: `${salesHeightPct}%` }}
                    className="w-full max-w-[24px] rounded-t-md bg-blue-600 transition-all duration-200 group-hover:bg-blue-700"
                  />
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

      {/* Row 3: Best Sellers & Payment Method Breakdown */}
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
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      style={{ width: `${barWidthPct}%` }}
                      className="h-full rounded-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{item.unitsSold} units sold</span>
                    <span>{item.marginPercent}% margin</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Payment Method Breakdown</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">Cash, UPI & Udhar</span>
          </div>

          <div className="mt-4 space-y-4">
            {paymentBreakdown.map((pm) => (
              <div key={pm.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">{pm.name}</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{formatCurrency(pm.amount)}</span>
                    <span className="ml-2 font-semibold text-slate-500">({pm.pct}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    style={{ width: `${pm.pct}%` }}
                    className={`h-full rounded-full ${pm.color} transition-all duration-300`}
                  />
                </div>
              </div>
            ))}

            <div className="mt-6 rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Shopkeeper Cash Flow Tip:</div>
              <p>
                Prompt collection of customer credit (Udhar) maintains working capital for supplier purchases and bulk discounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Product-Wise Profitability Breakdown Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">{t('productProfitabilityHeading')}</h3>
          </div>
          <span className="text-xs text-slate-500">{productProfitability.length} catalog items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Cost Price</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-right">Unit Margin (₹)</th>
                <th className="py-3 px-4 text-right">Margin (%)</th>
                <th className="py-3 px-4 text-right">Est. Period Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productProfitability.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{item.name}</td>
                  <td className="py-3 px-4 text-slate-500">{translateCategory(item.category)}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">₹{item.purchasePrice}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">₹{item.sellingPrice}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600">
                    +₹{item.marginRupees}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                        item.marginPct >= 25
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.marginPct >= 15
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.marginPct}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">
                    +{formatCurrency(item.totalProfit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
