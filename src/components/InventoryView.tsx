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
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, formatNumber, calculateMargin } from '../utils/formatters';
import { useTranslation } from '../i18n/LanguageContext';

interface InventoryViewProps {
  products: Product[];
  onOpenAddModal: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onAskAIAboutProduct: (productName: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct,
  onUpdateQuantity,
  onAskAIAboutProduct,
}) => {
  const { t, translateCategory } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'healthy'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'margin' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === 'all' || p.category === selectedCategory;

        const isLow = p.quantity <= (p.minStockThreshold || 10);
        const matchesStock =
          stockFilter === 'all' ||
          (stockFilter === 'low' && isLow) ||
          (stockFilter === 'healthy' && !isLow);

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
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [products, searchTerm, selectedCategory, stockFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'name' | 'quantity' | 'margin' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'SKU', 'Quantity', 'Unit', 'Purchase Price (INR)', 'Selling Price (INR)', 'Profit Margin (INR)', 'Margin (%)', 'Stock Status'];
    const rows = filteredProducts.map((p) => {
      const margin = calculateMargin(p.purchasePrice, p.sellingPrice);
      const isLow = p.quantity <= (p.minStockThreshold || 10);
      return [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        `"${p.sku}"`,
        p.quantity,
        `"${p.unit}"`,
        p.purchasePrice.toFixed(2),
        p.sellingPrice.toFixed(2),
        margin.dollar.toFixed(2),
        `${margin.percent}%`,
        isLow ? 'LOW STOCK' : 'Healthy',
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShopMate_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
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
      {/* Top Inventory Summary Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {t('totalCatalogSkus')}
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-900">{products.length}</div>
          <span className="text-[11px] text-slate-400">{formatNumber(totalUnits)} {t('unitsOnHand')}</span>
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
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/70 p-1 text-xs font-medium text-slate-600">
            <button
              onClick={() => setStockFilter('all')}
              className={`rounded-lg px-3 py-1 transition-all cursor-pointer ${
                stockFilter === 'all' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'hover:text-slate-900'
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
              <span>{t('lowStockFilter')} ({lowStockCount})</span>
            </button>
            <button
              onClick={() => setStockFilter('healthy')}
              className={`rounded-lg px-3 py-1 transition-all cursor-pointer ${
                stockFilter === 'healthy'
                  ? 'bg-white font-bold text-slate-900 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              {t('healthyFilter')} ({products.length - lowStockCount})
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
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Package className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="font-medium text-slate-700">{t('noProductsMatch')}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {t('tryClearingSearch')}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const margin = calculateMargin(p.purchasePrice, p.sellingPrice);
                  const isLow = p.quantity <= (p.minStockThreshold || 10);
                  const isOut = p.quantity === 0;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isLow ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Name & SKU */}
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {p.sku} • {p.unit}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          {translateCategory(p.category)}
                        </span>
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
                      <td className="px-4 py-3.5 font-medium text-slate-600">
                        {formatCurrency(p.purchasePrice)}
                      </td>

                      {/* Selling Price */}
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {formatCurrency(p.sellingPrice)}
                      </td>

                      {/* Profit Margin ($ and %) */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-emerald-600">
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
