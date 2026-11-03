import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useTranslation } from '../i18n/LanguageContext';

interface QuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRecordSale: (productId: string, quantity: number) => void;
}

export const QuickSaleModal: React.FC<QuickSaleModalProps> = ({
  isOpen,
  onClose,
  products,
  onRecordSale,
}) => {
  const { t } = useTranslation();
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen) return null;

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || products[0];

  const subtotal = selectedProduct ? selectedProduct.sellingPrice * quantity : 0;
  const cost = selectedProduct ? selectedProduct.purchasePrice * quantity : 0;
  const profit = subtotal - cost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (quantity <= 0) return;

    onRecordSale(selectedProduct.id, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t('quickSaleTitle')}</h2>
              <p className="text-[11px] text-slate-500">
                {t('quickSaleDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700">{t('selectProduct')}</label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setQuantity(1);
              }}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatCurrency(p.sellingPrice)} ({p.quantity} {p.unit})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
              <span className="text-slate-500">{t('currentlyInStock')}</span>
              <span
                className={`font-bold ${
                  selectedProduct.quantity <= 10 ? 'text-amber-600' : 'text-slate-800'
                }`}
              >
                {selectedProduct.quantity} {selectedProduct.unit}
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700">{t('unitsSoldLabel')}</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="number"
                min="1"
                max={selectedProduct ? Math.max(1, selectedProduct.quantity) : 99}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-center text-sm font-bold text-slate-900"
              />
              <div className="flex gap-1.5">
                {[1, 2, 5, 10].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setQuantity(qty)}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                      quantity === qty
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    +{qty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time sale breakdown in INR */}
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{t('saleTotal')}</span>
              <span className="text-base font-bold text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>{t('costOfGoods')}</span>
              <span>{formatCurrency(cost)}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-400">{t('netProfitGenerated')}</span>
              <span className="text-emerald-400 text-sm">+{formatCurrency(profit)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              {t('confirmSaleBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
