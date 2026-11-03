import React, { useState, useEffect } from 'react';
import { X, ClipboardList, Plus, Trash2, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { PurchaseOrder, PurchaseOrderItem, Supplier, Product } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { formatCurrency } from '../utils/formatters';

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: Partial<PurchaseOrder> & { supplierId: string }) => void;
  suppliers: Supplier[];
  products: Product[];
  initialSupplierId?: string;
  editingOrder?: PurchaseOrder | null;
}

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  suppliers,
  products,
  initialSupplierId,
  editingOrder,
}) => {
  const { t } = useTranslation();

  const [supplierId, setSupplierId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);

  useEffect(() => {
    if (editingOrder) {
      setSupplierId(editingOrder.supplierId);
      setInvoiceNumber(editingOrder.invoiceNumber || '');
      setOrderDate(editingOrder.orderDate || new Date().toISOString().split('T')[0]);
      setExpectedDate(editingOrder.expectedDate || '');
      setNotes(editingOrder.notes || '');
      setItems(editingOrder.items || []);
    } else {
      const defaultSupplier = initialSupplierId || suppliers[0]?.id || '';
      setSupplierId(defaultSupplier);
      setInvoiceNumber(`INV-${Date.now().toString().slice(-5)}`);
      setOrderDate(new Date().toISOString().split('T')[0]);

      // Default expected date 3 days ahead
      const exp = new Date();
      exp.setDate(exp.getDate() + 3);
      setExpectedDate(exp.toISOString().split('T')[0]);

      setNotes('');

      // If supplier has products, prefill one line item
      const supp = suppliers.find((s) => s.id === defaultSupplier);
      const firstProdId = supp?.suppliedProductIds?.[0] || products[0]?.id;
      const firstProd = products.find((p) => p.id === firstProdId);

      if (firstProd) {
        setItems([
          {
            productId: firstProd.id,
            productName: firstProd.name,
            quantity: 10,
            unitPrice: firstProd.purchasePrice || 100,
            total: (firstProd.purchasePrice || 100) * 10,
            batchNumber: `BAT-${Date.now().toString().slice(-4)}`,
            expiryDate: '',
          },
        ]);
      } else {
        setItems([]);
      }
    }
  }, [editingOrder, initialSupplierId, isOpen, suppliers, products]);

  if (!isOpen) return null;

  const currentSupplier = suppliers.find((s) => s.id === supplierId);

  // Filter products by supplier if available, or allow all
  const availableProducts = currentSupplier?.suppliedProductIds?.length
    ? products.filter((p) => currentSupplier.suppliedProductIds?.includes(p.id))
    : products;

  const handleAddItem = () => {
    const defaultProd = availableProducts[0] || products[0];
    if (!defaultProd) return;

    setItems([
      ...items,
      {
        productId: defaultProd.id,
        productName: defaultProd.name,
        quantity: 10,
        unitPrice: defaultProd.purchasePrice || 100,
        total: (defaultProd.purchasePrice || 100) * 10,
        batchNumber: `BAT-${Date.now().toString().slice(-4)}`,
        expiryDate: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof PurchaseOrderItem,
    value: any
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index] };

      if (field === 'productId') {
        const prod = products.find((p) => p.id === value);
        if (prod) {
          item.productId = prod.id;
          item.productName = prod.name;
          item.unitPrice = prod.purchasePrice;
          item.total = Math.round(item.quantity * prod.purchasePrice * 100) / 100;
        }
      } else if (field === 'quantity') {
        const qty = Math.max(1, parseInt(value, 10) || 1);
        item.quantity = qty;
        item.total = Math.round(qty * item.unitPrice * 100) / 100;
      } else if (field === 'unitPrice') {
        const price = Math.max(0, parseFloat(value) || 0);
        item.unitPrice = price;
        item.total = Math.round(item.quantity * price * 100) / 100;
      } else {
        (item as any)[field] = value;
      }

      updated[index] = item;
      return updated;
    });
  };

  // Auto total calculation
  const calculatedGrandTotal = items.reduce((sum, it) => sum + (it.total || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || items.length === 0) return;

    onSave({
      ...(editingOrder ? { id: editingOrder.id } : {}),
      supplierId,
      supplierName: currentSupplier?.name || 'Unknown Supplier',
      invoiceNumber: invoiceNumber.trim(),
      orderDate,
      expectedDate: expectedDate || undefined,
      items,
      totalAmount: calculatedGrandTotal,
      notes: notes.trim(),
      status: editingOrder ? editingOrder.status : 'pending',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingOrder ? t('editPurchaseOrder') : t('createPurchaseOrder')}
              </h3>
              <p className="text-xs text-slate-500">
                Procure stock, record wholesale cost, and track expected delivery
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

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-xs">
            {/* Top row: Supplier & Invoices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('selectSupplier')} <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-hidden bg-white"
                >
                  <option value="">{t('selectSupplier')}</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('invoiceNumberLabel')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. INV-KA-9901"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('expectedDeliveryLabel')}
                </label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Line items section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900">
                  {t('orderItemsLabel')} ({items.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t('addItemBtn')}
                </button>
              </div>

              {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                  No products added yet. Click &quot;Add Product Item&quot; above to build your order.
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      {/* Product selector */}
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          {t('thProductName')}
                        </label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-800 focus:border-blue-500"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Qty */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          {t('quantityLabel')}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-center font-bold focus:border-blue-500"
                        />
                      </div>

                      {/* Unit cost */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          {t('purchasePriceLabel')}
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-right font-medium focus:border-blue-500"
                        />
                      </div>

                      {/* Batch & Expiry */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          {t('expiryDate')}
                        </label>
                        <input
                          type="date"
                          value={item.expiryDate || ''}
                          onChange={(e) => handleItemChange(idx, 'expiryDate', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11px] focus:border-blue-500"
                        />
                      </div>

                      {/* Line total & remove */}
                      <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                        <div className="text-right">
                          <span className="block text-[10px] font-semibold text-slate-400">Total</span>
                          <span className="text-xs font-bold text-slate-900">
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('supplierNotes')}
              </label>
              <textarea
                rows={2}
                placeholder="Urgent delivery note, wholesale transport rebate, or special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Footer with grand total and actions */}
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50/50">
            <div>
              <span className="text-xs text-slate-500 block">{t('totalAmountLabel')}</span>
              <span className="text-lg font-extrabold text-slate-900">
                {formatCurrency(calculatedGrandTotal)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={items.length === 0}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {editingOrder ? t('saveChanges') : t('createPurchaseOrder')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
