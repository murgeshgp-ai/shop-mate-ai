import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Edit2,
  Trash2,
  ArrowUpDown,
  Download,
  PlusCircle,
  MinusCircle,
  CheckCircle,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Layers,
  Building2,
} from 'lucide-react';
import { Product } from '../types';
import {
  formatCurrency,
  formatNumber,
  calculateMargin,
  getEarliestExpiry,
  formatIndianDate,
} from '../utils/formatters';
import { useTranslation } from '../i18n/LanguageContext';

interface InventoryViewProps {
  products: Product[];
  onOpenAddModal: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onAskAIAboutProduct: (productName: string) => void;
  onOpenBatchesModal?: (product: Product) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct,
  onUpdateQuantity,
  onAskAIAboutProduct,
  onOpenBatchesModal,
}) => {
  const { t, translateCategory } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'healthy' | 'expiring_soon' | 'expired'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'margin' | 'price' | 'expiry'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Expiry counts
  const expiringSoonCount = useMemo(() => {
    return products.filter((p) => getEarliestExpiry(p).status === 'expiring_soon').length;
  }, [products]);

  const expiredCount = useMemo(() => {
    return products.filter((p) => getEarliestExpiry(p).status === 'expired').length;
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.supplierName && p.supplierName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.batchNumber && p.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory =
          selectedCategory === 'all' || p.category === selectedCategory;

        const isLow = p.quantity <= (p.minStockThreshold || 10);
        const { status: expStatus } = getEarliestExpiry(p);

        let matchesStock = true;
        if (stockFilter === 'low') matchesStock = isLow;
        else if (stockFilter === 'healthy') matchesStock = !isLow;
        else if (stockFilter === 'expiring_soon') matchesStock = expStatus === 'expiring_soon';
        else if (stockFilter === 'expired') matchesStock = expStatus === 'expired';

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === 'quantity') {
          comparison = a.quantity - b.quantity;
        } else if (sortBy === 'price') {
          comparison = a.sellingPrice - b.sellingPrice;
        } else if (sortBy === 'margin') {
          const marginA = calculateMargin(a.purchasePrice, a.sellingPrice).percent;
          const marginB = calculateMargin(b.purchasePrice, b.sellingPrice).percent;
          comparison = marginA - marginB;
        } else if (sortBy === 'expiry') {
          const expA = getEarliestExpiry(a).expiryDate || '9999-12-31';
          const expB = getEarliestExpiry(b).expiryDate || '9999-12-31';
          comparison = new Date(expA).getTime() - new Date(expB).getTime();
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [products, searchTerm, selectedCategory, stockFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'name' | 'quantity' | 'margin' | 'price' | 'expiry') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'Name',
      'Category',
      'SKU',
      'Supplier',
      'Batch No',
      'Expiry Date',
      'Expiry Status',
      'Quantity',
      'Unit',
      'Purchase Price (INR)',
      'Selling Price (INR)',
      'Profit Margin (INR)',
      'Margin (%)',
      'Stock Status',
    ];
    const rows = filteredProducts.map((p) => {
      const margin = calculateMargin(p.purchasePrice, p.sellingPrice);
      const isLow = p.quantity <= (p.minStockThreshold || 10);
      const { expiryDate, status: expStatus } = getEarliestExpiry(p);

      return [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        `"${p.sku}"`,
        `"${p.supplierName || 'Direct'}"`,
        `"${p.batchNumber || ''}"`,
        `"${expiryDate || 'N/A'}"`,
        `"${expStatus}"`,
        p.quantity,
        `"${p.unit}"`,
        p.purchasePrice.toFixed(2),
        p.sellingPrice.toFixed(2),
        margin.dollar.toFixed(2),
        `${margin.percent}%`,
        isLow ? 'LOW STOCK' : 'Healthy',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `ShopMate_Inventory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Summary figures
  const totalUnits = products.reduce((acc, p) => acc + p.quantity, 0);
  const lowStockCount = products.filter((p) => p.quantity <= (p.minStockThreshold || 10)).length;
  const totalCost = products.reduce((acc, p) => acc + p.quantity * p.purchasePrice, 0);
  const totalRetail = products.reduce((acc, p) => acc + p.quantity * p.sellingPrice, 0);

  return (
    <div className="space-y-6">
      {/* Expiry Alert Banners if any */}
      {expiredCount > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/90 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                {t('expiredAlertBanner', { count: expiredCount })}
              </h4>
              <p className="text-xs text-rose-700">{t('expiredAlertDesc')}</p>
            </div>
          </div>
          <button
            onClick={() => setStockFilter('expired')}
            className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-colors shrink-0 cursor-pointer"
          >
            {t('filterExpired')}
          </button>
        </div>
      )}

      {expiringSoonCount > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/90 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                {t('expiryAlertBanner', { count: expiringSoonCount })}
              </h4>
              <p className="text-xs text-amber-700">{t('expiryAlertDesc')}</p>
            </div>
          </div>
          <button
            onClick={() => setStockFilter('expiring_soon')}
            className="rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition-colors shrink-0 cursor-pointer"
          >
            {t('filterExpiringSoon')}
          </button>
        </div>
      )}

      {/* Top Inventory Summary Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {t('totalCatalogSkus')}
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-900">{products.length}</div>
          <span className="text-[11px] text-slate-400">
            {formatNumber(totalUnits)} {t('unitsOnHand')}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {t('lowStockAlerts')}
          </span>
          <div
            className={`mt-1 text-2xl font-bold ${
              lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {lowStockCount}
          </div>
          <span className="text-[11px] text-slate-400">{t('needingRestock')}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {t('inventoryCostVal')}
          </span>
          <div className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            {formatCurrency(totalCost)}
          </div>
          <span className="text-[11px] text-slate-400">{t('investedCapital')}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {t('retailSalesVal')}
          </span>
          <div className="mt-1 text-xl font-bold text-blue-600 sm:text-2xl">
            {formatCurrency(totalRetail)}
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">
            +{formatCurrency(totalRetail - totalCost)} {t('potentialProfit')}
          </span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Action Buttons: Add & Export */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>{t('exportCsv')}</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{t('addNewProduct')}</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Category Selector */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {/* Stock status tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/70 p-1 text-xs font-medium text-slate-600">
            <button
              onClick={() => setStockFilter('all')}
              className={`rounded-lg px-3 py-1 transition-all cursor-pointer ${
                stockFilter === 'all'
                  ? 'bg-white font-bold text-slate-900 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              {t('allItems')} ({products.length})
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1 transition-all cursor-pointer ${
                stockFilter === 'low'
                  ? 'bg-amber-500 font-bold text-white shadow-2xs'
                  : 'text-amber-700 hover:text-amber-800'
              }`}
            >
              <AlertTriangle className="h-3 w-3" />
              <span>
                {t('lowStockFilter')} ({lowStockCount})
              </span>
            </button>
            <button
              onClick={() => setStockFilter('expiring_soon')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1 transition-all cursor-pointer ${
                stockFilter === 'expiring_soon'
                  ? 'bg-amber-600 font-bold text-white shadow-2xs'
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>
                {t('filterExpiringSoon')} ({expiringSoonCount})
              </span>
            </button>
            <button
              onClick={() => setStockFilter('expired')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1 transition-all cursor-pointer ${
                stockFilter === 'expired'
                  ? 'bg-rose-600 font-bold text-white shadow-2xs'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              <AlertTriangle className="h-3 w-3" />
              <span>
                {t('filterExpired')} ({expiredCount})
              </span>
            </button>
            <button
              onClick={() => setStockFilter('healthy')}
              className={`rounded-lg px-3 py-1 transition-all cursor-pointer ${
                stockFilter === 'healthy'
                  ? 'bg-white font-bold text-slate-900 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              {t('healthyFilter')}
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">{t('allCategories')}</option>
              {categories
                .filter((c) => c !== 'all')
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {translateCategory(cat)}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Products Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th
                  onClick={() => toggleSort('name')}
                  className="cursor-pointer px-5 py-3.5 hover:text-slate-900"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{t('thProductName')}</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5">{t('thCategory')}</th>
                {/* Feature 1: Expiry & Batches Column */}
                <th
                  onClick={() => toggleSort('expiry')}
                  className="cursor-pointer px-4 py-3.5 hover:text-slate-900"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{t('thExpiryDate')}</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('quantity')}
                  className="cursor-pointer px-4 py-3.5 hover:text-slate-900"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{t('thQuantity')}</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5">{t('thPurchasePrice')}</th>
                <th
                  onClick={() => toggleSort('price')}
                  className="cursor-pointer px-4 py-3.5 hover:text-slate-900"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{t('thSellingPrice')}</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('margin')}
                  className="cursor-pointer px-4 py-3.5 hover:text-slate-900"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{t('thProfitMargin')}</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5">{t('thStockStatus')}</th>
                <th className="px-5 py-3.5 text-right">{t('thActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Package className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="font-medium text-slate-700">{t('noProductsMatch')}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{t('tryClearingSearch')}</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const margin = calculateMargin(p.purchasePrice, p.sellingPrice);
                  const isLow = p.quantity <= (p.minStockThreshold || 10);
                  const isOut = p.quantity === 0;

                  const { expiryDate, status: expStatus, daysRemaining, batchNumber } =
                    getEarliestExpiry(p);
                  const batchCount = p.batches?.length || (p.expiryDate ? 1 : 0);

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        expStatus === 'expired'
                          ? 'bg-rose-50/20'
                          : expStatus === 'expiring_soon'
                          ? 'bg-amber-50/30'
                          : isLow
                          ? 'bg-amber-50/20'
                          : ''
                      }`}
                    >
                      {/* Name & SKU */}
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                          <span>
                            {p.sku} • {p.unit}
                          </span>
                          {p.supplierName && (
                            <>
                              <span>•</span>
                              <span className="text-slate-500 flex items-center gap-0.5">
                                <Building2 className="h-2.5 w-2.5 text-slate-400" />
                                {p.supplierName}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          {translateCategory(p.category)}
                        </span>
                      </td>

                      {/* Feature 1: Expiry Date & Batches */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          {expiryDate ? (
                            <div className="flex items-center gap-1.5">
                              {expStatus === 'expired' && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                                  <AlertTriangle className="h-3 w-3 shrink-0" />
                                  {t('expired')} ({Math.abs(daysRemaining || 0)}d ago)
                                </span>
                              )}
                              {expStatus === 'expiring_soon' && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                                  <Clock className="h-3 w-3 shrink-0" />
                                  {daysRemaining === 0 ? 'Today' : `${daysRemaining}d left`}
                                </span>
                              )}
                              {expStatus === 'safe' && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                                  <ShieldCheck className="h-3 w-3 shrink-0" />
                                  {formatIndianDate(expiryDate)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}

                          {/* Batch trigger */}
                          <button
                            type="button"
                            onClick={() => onOpenBatchesModal && onOpenBatchesModal(p)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer text-left"
                            title="Manage multiple batches and expiry"
                          >
                            <Layers className="h-3 w-3" />
                            <span>
                              {batchCount > 1
                                ? `${batchCount} ${t('batches')}`
                                : batchNumber
                                ? `Batch: ${batchNumber}`
                                : t('viewBatches')}
                            </span>
                          </button>
                        </div>
                      </td>

                      {/* Quantity with quick +/- buttons */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(p.id, Math.max(0, p.quantity - 1))}
                            title="Decrease 1 unit"
                            className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </button>
                          <span
                            className={`min-w-[28px] text-center font-bold ${
                              isOut
                                ? 'text-rose-600'
                                : isLow
                                ? 'text-amber-600'
                                : 'text-slate-900'
                            }`}
                          >
                            {p.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(p.id, p.quantity + 1)}
                            title="Increase 1 unit"
                            className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          >
                            <PlusCircle className="h-4 w-4" />
                          </button>
                          <span className="text-[11px] text-slate-400">{p.unit}</span>
                        </div>
                      </td>

                      {/* Purchase Price (Cost) */}
                      <td className="px-4 py-3.5 font-medium text-slate-600 font-mono">
                        {formatCurrency(p.purchasePrice)}
                      </td>

                      {/* Selling Price */}
                      <td className="px-4 py-3.5 font-bold text-slate-900 font-mono">
                        {formatCurrency(p.sellingPrice)}
                      </td>

                      {/* Profit Margin ($ and %) */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-emerald-600 font-mono">
                          +{formatCurrency(margin.dollar)}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {margin.percent}% {t('marginUnit')}
                        </div>
                      </td>

                      {/* Stock Status Badge */}
                      <td className="px-4 py-3.5">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                            {t('statusOutOfStock')}
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                            <AlertTriangle className="h-3 w-3" />
                            {t('statusLowStock')} ({p.quantity})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                            <CheckCircle className="h-3 w-3" />
                            {t('statusHealthy')}
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* AI advice for this product */}
                          <button
                            onClick={() => onAskAIAboutProduct(p.name)}
                            title="Ask AI advice"
                            className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          >
                            <Sparkles className="h-4 w-4" />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => onEditProduct(p)}
                            title="Edit"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => onDeleteProduct(p)}
                            title="Delete"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
