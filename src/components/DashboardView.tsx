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
  Clock,
  ShieldAlert,
  ClipboardList,
  Building2,
  CheckCircle2,
  Calendar,
  Receipt,
  Wallet,
} from 'lucide-react';
import { Product, DailySale, ActiveTab, PurchaseOrder, Supplier } from '../types';
import {
  formatCurrency,
  formatNumber,
  calculateShopStats,
  formatIndianDate,
  getEarliestExpiry,
} from '../utils/formatters';
import { useTranslation } from '../i18n/LanguageContext';

interface DashboardViewProps {
  products: Product[];
  dailySales: DailySale[];
  purchases?: PurchaseOrder[];
  suppliers?: Supplier[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  onQuickRestock: (productId: string) => void;
  onAskAIQuestion: (question: string) => void;
  onReceiveOrder?: (orderId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  dailySales,
  purchases = [],
  suppliers = [],
  setActiveTab,
  onOpenAddModal,
  onQuickRestock,
  onAskAIQuestion,
  onReceiveOrder,
}) => {
  const { t, translateCategory } = useTranslation();
  const stats = calculateShopStats(products, dailySales, purchases, suppliers);

  // Recent 7 days for mini bar chart
  const recentDays = dailySales.slice(-7);
  const maxSale = Math.max(...recentDays.map((d) => d.sales), 100);

  // Expiring items for watchlist (expiring soon or expired)
  const expiringItems = products
    .map((p) => {
      const exp = getEarliestExpiry(p);
      return { product: p, ...exp };
    })
    .filter((item) => item.status === 'expired' || item.status === 'expiring_soon')
    .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0));

  // Recent purchases
  const recentPurchases = purchases.slice(0, 4);

  const quickQuestions = [
    t('quickPrompt1'),
    t('quickPrompt2'),
    t('quickPrompt3'),
  ];

  return (
    <div className="space-y-6">
      {/* 1. Critical Expired Alert Banner */}
      {stats.expiredCount > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-300 bg-rose-50/90 p-4 text-rose-900 sm:flex-row sm:items-center sm:justify-between shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-200 text-rose-800">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-950">
                {t('expiredAlertBanner', { count: stats.expiredCount })}
              </h2>
              <p className="text-xs text-rose-800 mt-0.5">
                {stats.expiredProducts
                  .map((p) => `${p.name} (Batch: ${p.batchNumber || 'Main'})`)
                  .slice(0, 2)
                  .join(', ')}
                {stats.expiredCount > 2 ? ` + ${stats.expiredCount - 2} more` : ''} — {t('expiredAlertDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-xs shrink-0 self-end sm:self-center cursor-pointer"
          >
            <span>{t('filterExpired')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 2. Expiring Soon (≤7 Days) Banner */}
      {stats.expiringSoonCount > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-800">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-950">
                {t('expiryAlertBanner', { count: stats.expiringSoonCount })}
              </h2>
              <p className="text-xs text-amber-800 mt-0.5">
                {stats.expiringSoonProducts
                  .map((p) => `${p.name} (${getEarliestExpiry(p).daysRemaining}d left)`)
                  .slice(0, 3)
                  .join(', ')}
                {stats.expiringSoonCount > 3 ? ` + ${stats.expiringSoonCount - 3} more` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition-colors shadow-xs shrink-0 self-end sm:self-center cursor-pointer"
          >
            <span>{t('filterExpiringSoon')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 3. Low-Stock Alert Banner */}
      {stats.lowStockCount > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-200/80 text-amber-800">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-amber-950">
                {t('lowStockWarning', { count: stats.lowStockCount })}
              </h2>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {stats.lowStockProducts
                  .map((p) => `${p.name} (${p.quantity} ${t('leftUnits')})`)
                  .slice(0, 3)
                  .join(', ')}
                {stats.lowStockCount > 3 ? ` + ${stats.lowStockCount - 3}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-50 transition-colors shrink-0 self-end sm:self-center cursor-pointer"
          >
            <span>{t('viewAndRestock')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Quick Action Navigation Strip (Phase 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('billing')}
          className="p-3.5 bg-linear-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">POS Counter</span>
            <h3 className="font-bold text-sm text-white">{t('navBilling')}</h3>
          </div>
          <Receipt className="w-5 h-5 text-emerald-200 shrink-0" />
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className="p-3.5 bg-linear-to-r from-indigo-600 to-blue-700 text-white rounded-2xl shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Overhead</span>
            <h3 className="font-bold text-sm text-white">{t('navExpenses')}</h3>
          </div>
          <Wallet className="w-5 h-5 text-indigo-200 shrink-0" />
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className="p-3.5 bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-xs hover:border-slate-300 transition-all text-left flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock & Batches</span>
            <h3 className="font-bold text-sm text-slate-900">{t('navInventory')}</h3>
          </div>
          <Package className="w-5 h-5 text-indigo-600 shrink-0" />
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className="p-3.5 bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-xs hover:border-slate-300 transition-all text-left flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Gemini 3.8</span>
            <h3 className="font-bold text-sm text-slate-900">{t('navChat')}</h3>
          </div>
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
        </button>
      </div>

      {/* Core KPI Cards Grid (4 cols on lg, responsive) */}
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
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl font-mono">
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

        {/* 2. Total Products & Stock */}
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
              <span>
                {formatNumber(stats.totalStockUnits)} {t('unitsInInventory')}
              </span>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            {t('retailInvValue')}: {formatCurrency(stats.inventoryRetailValue)}
          </div>
        </div>

        {/* 3. Expiring Soon (Feature 1 & 5 KPI) */}
        <div
          onClick={() => setActiveTab('inventory')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('expiringSoonCard')}
            </span>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                stats.expiringSoonCount > 0
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
                stats.expiringSoonCount > 0 ? 'text-amber-600' : 'text-emerald-700'
              }`}
            >
              {stats.expiringSoonCount}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
              {stats.expiredCount > 0 ? (
                <span className="text-rose-600 font-bold">
                  {stats.expiredCount} {t('expired')}
                </span>
              ) : (
                <span className="text-amber-700 font-semibold">{t('within7DaysCard')}</span>
              )}
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <span>View inventory batches</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>

        {/* 4. Pending Purchase Orders (Feature 3 & 5 KPI) */}
        <div
          onClick={() => setActiveTab('purchases')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('pendingOrdersCard')}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {stats.pendingOrdersCount}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>{t('awaitingDelivery')}</span>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <span>Manage purchase orders</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Feature 5 Widgets: Expiry Watchlist & Pending Orders Inflow */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Widget 1: Expiry Watchlist (≤ 7 Days or Expired) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">
                {t('dashboardExpiryWatchlist')}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>{t('manageAll')}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {expiringItems.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
              <p className="font-semibold text-slate-700">{t('noExpiringItemsDashboard')}</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-slate-100">
              {expiringItems.slice(0, 4).map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between py-3 text-xs"
                >
                  <div>
                    <h3 className="font-bold text-slate-900">{item.product.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      {item.batchNumber && <span>Batch: {item.batchNumber}</span>}
                      <span>•</span>
                      <span>Stock: {item.product.quantity} {item.product.unit}</span>
                      <span>•</span>
                      <span>Exp: {formatIndianDate(item.expiryDate || '')}</span>
                    </div>
                  </div>

                  <div>
                    {item.status === 'expired' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 border border-rose-200">
                        <AlertTriangle className="h-3 w-3" />
                        {t('expired')} ({Math.abs(item.daysRemaining || 0)}d ago)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3" />
                        {item.daysRemaining === 0 ? 'Expires today' : `${item.daysRemaining}d left`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Widget 2: Pending Supplier Purchase Orders */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">
                {t('dashboardPendingOrders')} ({stats.pendingOrdersCount})
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('purchases')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View all POs</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {stats.pendingOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
              <p className="font-semibold text-slate-700">{t('noPendingOrdersDashboard')}</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-slate-100">
              {stats.pendingOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">
                        {order.orderNumber}
                      </span>
                      <span className="text-slate-500">• {order.supplierName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{order.items.length} items</span>
                      <span>•</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      {order.expectedDate && (
                        <>
                          <span>•</span>
                          <span className="text-amber-700">
                            Expected: {formatIndianDate(order.expectedDate)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {onReceiveOrder && (
                    <button
                      onClick={() => onReceiveOrder(order.id)}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs shrink-0 self-start sm:self-center cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{t('markAsReceivedBtn')}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
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
                <div
                  key={day.date}
                  className="group relative flex flex-1 flex-col items-center h-full justify-end"
                >
                  {/* Tooltip on hover */}
                  <div className="pointer-events-none absolute -top-12 z-20 hidden rounded-xl bg-slate-900 px-2.5 py-1 text-center text-[11px] text-white shadow-lg group-hover:block whitespace-nowrap">
                    <div className="font-semibold">
                      {day.dayName} ({formatIndianDate(day.date)})
                    </div>
                    <div>
                      {t('revenue')}: {formatCurrency(day.sales)}
                    </div>
                    <div className="text-emerald-400">
                      {t('profit')}: {formatCurrency(day.profit)}
                    </div>
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
            <span>
              {t('avgDailySales')}: {formatCurrency(stats.totalSales / (dailySales.length || 1))}
            </span>
            <span>
              {t('estDailyProfit')}: {formatCurrency(stats.estimatedProfit / (dailySales.length || 1))}
            </span>
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

      {/* Feature 5: Supplier Summary & Recent Purchases Snapshot */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Supplier Network Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                {t('dashboardSupplierSummary')} ({suppliers.length})
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('suppliers')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Manage suppliers</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {suppliers.slice(0, 4).map((s) => {
              const orderCount = purchases.filter((p) => p.supplierId === s.id).length;
              return (
                <div key={s.id} className="flex items-center justify-between py-3 text-xs">
                  <div>
                    <h3 className="font-bold text-slate-900">{s.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {s.contactPerson || 'Direct'} • {s.category || 'Wholesale'} • {s.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg text-[11px]">
                      {orderCount} {t('ordersPlaced')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Recent Purchase Deliveries
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('purchases')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View all</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {recentPurchases.map((po) => (
              <div key={po.id} className="flex items-center justify-between py-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono">{po.orderNumber}</span>
                    <span className="text-slate-500">{po.supplierName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {formatIndianDate(po.orderDate)} • {po.items.length} items
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 font-mono">
                    {formatCurrency(po.totalAmount)}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold uppercase rounded-full px-2 py-0.5 mt-0.5 ${
                      po.status === 'received'
                        ? 'bg-emerald-50 text-emerald-700'
                        : po.status === 'pending'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {po.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
