import React, { useState } from 'react';
import { X, Calendar, AlertTriangle, ShieldCheck, Clock, Plus, Trash2, Box } from 'lucide-react';
import { Product, ProductBatch } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { formatIndianDate, getDaysUntilExpiry, getExpiryStatusForDate } from '../utils/formatters';

interface BatchModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveBatches: (productId: string, batches: ProductBatch[]) => void;
}

export const BatchModal: React.FC<BatchModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveBatches,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !product) return null;

  const [batches, setBatches] = useState<ProductBatch[]>(() => {
    if (Array.isArray(product.batches) && product.batches.length > 0) {
      return [...product.batches];
    }
    if (product.expiryDate) {
      return [
        {
          id: `b-${Date.now()}`,
          batchNumber: product.batchNumber || 'BAT-MAIN',
          quantity: product.quantity,
          expiryDate: product.expiryDate,
          purchasePrice: product.purchasePrice,
          purchaseDate: product.lastRestocked || new Date().toISOString().split('T')[0],
        },
      ];
    }
    return [];
  });

  const [newBatchNumber, setNewBatchNumber] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newCostPrice, setNewCostPrice] = useState(String(product.purchasePrice || ''));

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchNumber || !newQuantity || !newExpiryDate) return;

    const newBatch: ProductBatch = {
      id: `b-${Date.now()}`,
      batchNumber: newBatchNumber.trim(),
      quantity: Math.max(1, parseInt(newQuantity, 10) || 1),
      expiryDate: newExpiryDate,
      purchasePrice: parseFloat(newCostPrice) || product.purchasePrice,
      purchaseDate: new Date().toISOString().split('T')[0],
    };

    setBatches([...batches, newBatch]);
    setNewBatchNumber('');
    setNewQuantity('');
    setNewExpiryDate('');
  };

  const handleRemoveBatch = (batchId: string) => {
    setBatches(batches.filter((b) => b.id !== batchId));
  };

  const handleSave = () => {
    onSaveBatches(product.id, batches);
    onClose();
  };

  const totalBatchUnits = batches.reduce((sum, b) => sum + (b.quantity || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
              <p className="text-xs text-slate-500">
                {t('manageBatches')} • SKU: {product.sku} • {t('unitsInInventory')}: {totalBatchUnits}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Batches Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900">{t('batchListTitle')}</h4>
              <span className="text-xs font-semibold text-slate-500">
                {batches.length} {t('batches')}
              </span>
            </div>

            {batches.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500 text-xs">
                No batches recorded for this product yet. Add a batch below.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200 divide-y divide-slate-200">
                {batches.map((batch) => {
                  const days = getDaysUntilExpiry(batch.expiryDate);
                  const status = getExpiryStatusForDate(batch.expiryDate);

                  return (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between p-3.5 hover:bg-slate-50/70 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{batch.batchNumber}</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {formatIndianDate(batch.expiryDate)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {batch.quantity} {product.unit || 'units'}
                        </span>

                        {status === 'expired' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 border border-rose-200">
                            <AlertTriangle className="h-3 w-3" />
                            {t('expired')} ({Math.abs(days || 0)}d ago)
                          </span>
                        )}

                        {status === 'expiring_soon' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                            <Clock className="h-3 w-3" />
                            {days === 0 ? 'Expires today' : `${days}d left`}
                          </span>
                        )}

                        {status === 'safe' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="h-3 w-3" />
                            {t('safeStock')} ({days}d)
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveBatch(batch.id)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title={t('removeBatch')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add New Batch Form */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-blue-600" />
              {t('addBatch')}
            </h4>

            <form onSubmit={handleAddBatch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t('batchNumber')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BAT-2026-X"
                  value={newBatchNumber}
                  onChange={(e) => setNewBatchNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t('thQuantity')}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 15"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t('expiryDate')}
                </label>
                <input
                  type="date"
                  required
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  {t('addBatch')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50/50">
          <div className="text-xs text-slate-500">
            Total Batch Units: <span className="font-bold text-slate-900">{totalBatchUnits}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              {t('saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
