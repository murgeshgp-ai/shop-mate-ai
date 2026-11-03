import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Calendar,
  Building2,
  Package,
  AlertCircle,
  ArrowRight,
  Eye,
  Trash2,
} from 'lucide-react';
import { PurchaseOrder, Supplier, Product } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { formatCurrency, formatIndianDate } from '../utils/formatters';

interface PurchasesViewProps {
  purchases: PurchaseOrder[];
  suppliers: Supplier[];
  products: Product[];
  onOpenCreateOrder: () => void;
  onReceiveOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({
  purchases,
  suppliers,
  products,
  onOpenCreateOrder,
  onReceiveOrder,
  onCancelOrder,
  onDeleteOrder,
}) => {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'received' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<PurchaseOrder | null>(null);
  const [confirmReceiveOrder, setConfirmReceiveOrder] = useState<PurchaseOrder | null>(null);

  const filteredPurchases = purchases.filter((po) => {
    const matchesStatus = filterStatus === 'all' || po.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      po.orderNumber.toLowerCase().includes(q) ||
      (po.invoiceNumber && po.invoiceNumber.toLowerCase().includes(q)) ||
      po.supplierName.toLowerCase().includes(q) ||
      po.items.some((it) => it.productName.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = purchases.filter((p) => p.status === 'pending').length;
  const receivedCount = purchases.filter((p) => p.status === 'received').length;
  const totalProcuredAmount = purchases
    .filter((p) => p.status === 'received')
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('pendingOrdersCard')}
              </p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
                {pendingCount}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{t('awaitingDelivery')}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Received Orders
              </p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                {receivedCount}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{t('stockUpdatedBadge')}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('totalAmountLabel')}
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatCurrency(totalProcuredAmount)}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ClipboardList className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Across all completed deliveries</p>
        </div>
      </div>

      {/* Action and Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl max-w-fit">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('allOrdersFilter')} ({purchases.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('pendingOrdersFilter')} ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('received')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'received'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('receivedOrdersFilter')} ({receivedCount})
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'cancelled'
                ? 'bg-white text-slate-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('cancelledOrdersFilter')}
          </button>
        </div>

        {/* Search & Create Button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchOrdersPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 sm:w-64 rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <button
            onClick={onOpenCreateOrder}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t('createPurchaseOrder')}</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredPurchases.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 text-xs">
          {t('noOrdersFound')}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPurchases.map((order) => {
            const isPending = order.status === 'pending';
            const isReceived = order.status === 'received';
            const isCancelled = order.status === 'cancelled';

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-slate-900 font-mono">
                      {order.orderNumber}
                    </span>

                    {/* Status pill */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border ${
                        isReceived
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isPending
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isReceived && <CheckCircle2 className="h-3 w-3" />}
                      {isPending && <Clock className="h-3 w-3" />}
                      {isCancelled && <XCircle className="h-3 w-3" />}
                      {order.status === 'received'
                        ? t('statusReceived')
                        : order.status === 'pending'
                        ? t('statusPending')
                        : t('statusCancelled')}
                    </span>

                    {order.stockUpdated && (
                      <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                        {t('stockUpdatedBadge')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Ordered: {formatIndianDate(order.orderDate)}
                    </span>
                    {order.expectedDate && isPending && (
                      <span className="text-amber-700 font-medium">
                        Expected: {formatIndianDate(order.expectedDate)}
                      </span>
                    )}
                    {order.receivedDate && isReceived && (
                      <span className="text-emerald-700 font-medium">
                        Received: {formatIndianDate(order.receivedDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body row: Supplier & Items summary */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span className="font-bold text-slate-900 text-sm">{order.supplierName}</span>
                      {order.invoiceNumber && (
                        <span className="text-slate-400 font-mono">({order.invoiceNumber})</span>
                      )}
                    </div>
                    {order.notes && <p className="text-slate-500 text-[11px]">{order.notes}</p>}
                  </div>

                  {/* Items summary */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Total Items</span>
                      <span className="font-bold text-slate-800">
                        {order.items.reduce((s, it) => s + it.quantity, 0)} units ({order.items.length} SKUs)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">{t('totalAmountLabel')}</span>
                      <span className="text-base font-extrabold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Line items pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {order.items.map((it, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-slate-100"
                    >
                      <Package className="h-3 w-3 text-slate-400" />
                      <span className="font-semibold text-slate-900">{it.productName}</span>
                      <span className="text-slate-400">× {it.quantity}</span>
                      <span className="font-bold text-slate-700">{formatCurrency(it.unitPrice)}</span>
                      {it.expiryDate && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded">
                          Exp: {formatIndianDate(it.expiryDate)}
                        </span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Footer action bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedOrderForDetails(order)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{t('viewInvoice')}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Mark as Received button (Feature 4 core action) */}
                    {isPending && (
                      <>
                        <button
                          onClick={() => onCancelOrder(order.id)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          {t('markAsCancelledBtn')}
                        </button>
                        <button
                          onClick={() => setConfirmReceiveOrder(order)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{t('markAsReceivedBtn')}</span>
                        </button>
                      </>
                    )}

                    {isCancelled && (
                      <button
                        onClick={() => onDeleteOrder(order.id)}
                        className="rounded-xl p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete Order Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Marking Order as Received */}
      {confirmReceiveOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('confirmReceiveTitle')}
              </h3>
              <p className="text-xs text-slate-600 mt-2">
                {t('confirmReceiveMsg', { order: confirmReceiveOrder.orderNumber })}
              </p>
            </div>

            {/* Items summary */}
            <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs">
              <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                Stock Additions:
              </p>
              {confirmReceiveOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-600">
                  <span>
                    +{it.quantity} {it.productName}
                  </span>
                  <span className="font-mono">{formatCurrency(it.total)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmReceiveOrder(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onReceiveOrder(confirmReceiveOrder.id);
                  setConfirmReceiveOrder(null);
                }}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                {t('markAsReceivedBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedOrderForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {selectedOrderForDetails.orderNumber} • Invoice
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForDetails(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 text-slate-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 block">{t('supplierName')}</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedOrderForDetails.supplierName}
                  </span>
                  <span className="text-slate-500 block">
                    Invoice: {selectedOrderForDetails.invoiceNumber || 'N/A'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">{t('orderDateLabel')}</span>
                  <span className="font-bold text-slate-800">
                    {formatIndianDate(selectedOrderForDetails.orderDate)}
                  </span>
                  <span className="text-slate-500 block capitalize">
                    Status: {selectedOrderForDetails.status}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Rate</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedOrderForDetails.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5">
                          <span className="font-bold text-slate-900 block">{it.productName}</span>
                          {it.batchNumber && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              Batch: {it.batchNumber}
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-bold">{it.quantity}</td>
                        <td className="p-2.5 text-right font-mono">{formatCurrency(it.unitPrice)}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900 font-mono">
                          {formatCurrency(it.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right text-xs">
                        Grand Total:
                      </td>
                      <td className="p-2.5 text-right text-sm text-blue-700">
                        {formatCurrency(selectedOrderForDetails.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {selectedOrderForDetails.notes && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-500 block">Notes:</span>
                  <p className="text-slate-700">{selectedOrderForDetails.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end p-4 border-t border-slate-200 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setSelectedOrderForDetails(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
