import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { Product } from '../types';
import { calculateMargin, formatCurrency } from '../utils/formatters';
import { useTranslation } from '../i18n/LanguageContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'> | Product) => void;
  editingProduct?: Product | null;
  existingCategories: string[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  existingCategories,
}) => {
  const { t, translateCategory } = useTranslation();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Beverages');
  const [customCategory, setCustomCategory] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(15);
  const [unit, setUnit] = useState('pack');
  const [purchasePrice, setPurchasePrice] = useState(150.00);
  const [sellingPrice, setSellingPrice] = useState(250.00);
  const [minStockThreshold, setMinStockThreshold] = useState(10);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setSku(editingProduct.sku);
      setQuantity(editingProduct.quantity);
      setUnit(editingProduct.unit || 'pack');
      setPurchasePrice(editingProduct.purchasePrice);
      setSellingPrice(editingProduct.sellingPrice);
      setMinStockThreshold(editingProduct.minStockThreshold || 10);
    } else {
      setName('');
      setCategory(existingCategories[0] || 'Beverages');
      setCustomCategory('');
      setSku(`SKU-${Math.floor(100 + Math.random() * 900)}`);
      setQuantity(20);
      setUnit('pack');
      setPurchasePrice(150.00);
      setSellingPrice(250.00);
      setMinStockThreshold(10);
    }
    setErrors({});
  }, [editingProduct, isOpen, existingCategories]);

  if (!isOpen) return null;

  const margin = calculateMargin(purchasePrice, sellingPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Required';
    if (!sku.trim()) newErrors.sku = 'Required';
    if (purchasePrice < 0) newErrors.purchasePrice = 'Invalid';
    if (sellingPrice < 0) newErrors.sellingPrice = 'Invalid';
    if (quantity < 0) newErrors.quantity = 'Invalid';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalCategory = category === '__custom__' ? customCategory || 'General' : category;

    const productData = {
      name: name.trim(),
      category: finalCategory,
      sku: sku.trim(),
      quantity: Number(quantity),
      unit: unit.trim() || 'unit',
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      minStockThreshold: Number(minStockThreshold),
      lastRestocked: new Date().toISOString().slice(0, 10),
    };

    if (editingProduct) {
      onSave({ ...productData, id: editingProduct.id });
    } else {
      onSave(productData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {editingProduct ? t('modalEditTitle') : t('modalAddTitle')}
              </h2>
              <p className="text-[11px] text-slate-500">
                {t('modalDesc')}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700">
              {t('labelProductName')}
            </label>
            <input
              type="text"
              placeholder="e.g. Organic Honeycomb Granola (400g)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
            {errors.name && <p className="mt-1 text-[11px] text-rose-500">{errors.name}</p>}
          </div>

          {/* Category & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">{t('labelCategory')}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {existingCategories.map((c) => (
                  <option key={c} value={c}>
                    {translateCategory(c)}
                  </option>
                ))}
                <option value="__custom__">{t('customCategoryPrompt')}</option>
              </select>
              {category === '__custom__' && (
                <input
                  type="text"
                  placeholder="Custom Category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">{t('labelSku')}</label>
              <input
                type="text"
                placeholder="e.g. GRN-102"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-mono font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.sku && <p className="mt-1 text-[11px] text-rose-500">{errors.sku}</p>}
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">{t('labelInitialStock')}</label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">{t('labelUnit')}</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-900 cursor-pointer"
              >
                <option value="pack">Pack</option>
                <option value="bottle">Bottle</option>
                <option value="bag">Bag</option>
                <option value="box">Box</option>
                <option value="can">Can</option>
                <option value="carton">Carton</option>
                <option value="jug">Jug</option>
                <option value="loaf">Loaf</option>
                <option value="kg">Kg</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">{t('labelMinAlert')}</label>
              <input
                type="number"
                min="1"
                value={minStockThreshold}
                onChange={(e) => setMinStockThreshold(Math.max(1, parseInt(e.target.value) || 10))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Pricing Row: Purchase Price vs Selling Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {t('labelPurchasePrice')}
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-7 pr-3 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                {t('labelSellingPrice')}
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-7 pr-3 text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Real-time Profit Margin preview indicator */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-emerald-900">{t('unitProfitEst')}</span>
              <div className="text-emerald-700 font-bold text-sm">
                +{formatCurrency(margin.dollar)}
              </div>
            </div>
            <div className="text-right">
              <span className="font-semibold text-emerald-900">{t('grossMarginLabel')}</span>
              <div className="text-emerald-700 font-extrabold text-sm">
                {margin.percent}%
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {editingProduct ? t('saveChanges') : t('createProduct')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
