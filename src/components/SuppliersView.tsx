import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  User,
  Plus,
  Search,
  Edit2,
  Trash2,
  ShoppingBag,
  ExternalLink,
  ClipboardList,
  Calendar,
  IndianRupee,
  Package,
} from 'lucide-react';
import { Supplier, Product, PurchaseOrder } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { formatCurrency, formatIndianDate } from '../utils/formatters';

interface SuppliersViewProps {
  suppliers: Supplier[];
  products: Product[];
  purchases: PurchaseOrder[];
  onOpenAddSupplier: () => void;
  onOpenEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplierId: string) => void;
  onCreatePoForSupplier: (supplierId: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  products,
  purchases,
  onOpenAddSupplier,
  onOpenEditSupplier,
  onDeleteSupplier,
  onCreatePoForSupplier,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    suppliers[0]?.id || null
  );

  const filteredSuppliers = suppliers.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
      (s.category && s.category.toLowerCase().includes(q)) ||
      (s.address && s.address.toLowerCase().includes(q))
    );
  });

  const selectedSupplier =
    suppliers.find((s) => s.id === selectedSupplierId) || filteredSuppliers[0] || null;

  // Products associated with this supplier
  const supplierProducts = selectedSupplier
    ? products.filter(
        (p) =>
          p.supplierId === selectedSupplier.id ||
          selectedSupplier.suppliedProductIds?.includes(p.id)
      )
    : [];

  // Purchases associated with this supplier
  const supplierPurchases = selectedSupplier
    ? purchases.filter((po) => po.supplierId === selectedSupplier.id)
    : [];

  const totalSpentWithSupplier = supplierPurchases
    .filter((po) => po.status === 'received')
    .reduce((sum, po) => sum + (po.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top action & metrics bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('navSuppliers')}
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {suppliers.length}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{t('activeVendors')}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('ordersPlaced')}
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {purchases.length}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ClipboardList className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {purchases.filter((p) => p.status === 'pending').length} pending delivery
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('totalSpend')}
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatCurrency(
                  purchases
                    .filter((p) => p.status === 'received')
                    .reduce((sum, p) => sum + p.totalAmount, 0)
                )}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <IndianRupee className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Received wholesale procurement</p>
        </div>
      </div>

      {/* Main 2-column layout: Supplier List & Supplier Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Search & List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('searchSuppliersPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
              />
            </div>
            <button
              onClick={onOpenAddSupplier}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{t('addSupplier')}</span>
            </button>
          </div>

          {filteredSuppliers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 text-xs">
              {t('noSuppliersFound')}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredSuppliers.map((supplier) => {
                const isSelected = selectedSupplier?.id === supplier.id;
                const poCount = purchases.filter((p) => p.supplierId === supplier.id).length;
                const prodCount = products.filter(
                  (p) =>
                    p.supplierId === supplier.id ||
                    supplier.suppliedProductIds?.includes(p.id)
                ).length;

                return (
                  <div
                    key={supplier.id}
                    onClick={() => setSelectedSupplierId(supplier.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{supplier.name}</h4>
                          {supplier.category && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                              {supplier.category}
                            </span>
                          )}
                        </div>

                        {supplier.contactPerson && (
                          <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                            <User className="h-3 w-3 text-slate-400" />
                            {supplier.contactPerson}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {supplier.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEditSupplier(supplier);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-blue-600 transition-colors"
                          title={t('editSupplier')}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSupplier(supplier.id);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600 transition-colors"
                          title={t('deleteSupplierTitle')}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-slate-400" />
                        {prodCount} {t('assignedProducts')}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <ClipboardList className="h-3 w-3 text-slate-400" />
                        {poCount} {t('ordersPlaced')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detailed View of Selected Supplier (7 cols) */}
        <div className="lg:col-span-7">
          {selectedSupplier ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedSupplier.name}
                    </h3>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                      {selectedSupplier.category || t('supplierPrimary')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {selectedSupplier.address || 'Address not registered'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedSupplier.phone}`}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    Call
                  </a>
                  <button
                    onClick={() => onCreatePoForSupplier(selectedSupplier.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t('createPoForSupplier')}
                  </button>
                </div>
              </div>

              {/* Contact Information & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Contact Details
                  </h4>
                  <div className="space-y-1.5 text-slate-600">
                    <p className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>{selectedSupplier.contactPerson || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-2 font-mono">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{selectedSupplier.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{selectedSupplier.email || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Terms & Procurement
                  </h4>
                  <p className="text-slate-600 text-xs">
                    {selectedSupplier.notes || 'No specific terms recorded.'}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-200">
                    Total procures to date:{' '}
                    <span className="font-bold text-slate-900">
                      {formatCurrency(totalSpentWithSupplier)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Supplier-wise Products */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    {t('associatedProducts')} ({supplierProducts.length})
                  </h4>
                </div>

                {supplierProducts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                    No products explicitly linked to this supplier yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {supplierProducts.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-xl border border-slate-200 p-3 hover:border-slate-300 transition-colors flex items-center justify-between"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{p.sku}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-700 block">
                            Cost: {formatCurrency(p.purchasePrice)}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {p.quantity} {p.unit} left
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Purchase History for each Supplier */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-emerald-600" />
                    {t('purchaseOrderHistory')} ({supplierPurchases.length})
                  </h4>
                </div>

                {supplierPurchases.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                    No purchase orders recorded with this supplier yet.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200 divide-y divide-slate-200">
                    {supplierPurchases.map((po) => (
                      <div
                        key={po.id}
                        className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{po.orderNumber}</span>
                            <span className="text-[11px] text-slate-400">
                              {po.invoiceNumber}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {formatIndianDate(po.orderDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900">
                            {formatCurrency(po.totalAmount)}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              po.status === 'received'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : po.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {po.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              Select a supplier from the list to view their catalog, contact, and purchase history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
