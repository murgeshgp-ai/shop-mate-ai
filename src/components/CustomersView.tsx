import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  MapPin,
  Mail,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  Archive,
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  ShoppingCart,
  ArrowRight,
  AlertCircle,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import { Customer, Bill } from '../types';
import { formatCurrency, formatIndianDate } from '../utils/formatters';
import { useTranslation } from '../i18n/LanguageContext';

interface CustomersViewProps {
  customers: Customer[];
  bills: Bill[];
  onOpenAddCustomer: () => void;
  onOpenEditCustomer: (customer: Customer) => void;
  onViewCustomerProfile: (customer: Customer) => void;
  onArchiveCustomer: (customerId: string, archive: boolean) => Promise<void>;
  onDeleteCustomer: (customerId: string) => Promise<void>;
  onStartBillForCustomer: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  bills,
  onOpenAddCustomer,
  onOpenEditCustomer,
  onViewCustomerProfile,
  onArchiveCustomer,
  onDeleteCustomer,
  onStartBillForCustomer,
}) => {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'with-credit' | 'archived'>('all');
  const [confirmDeleteCustomer, setConfirmDeleteCustomer] = useState<Customer | null>(null);

  // Compute customer credit ledger map
  const customerFinancials = useMemo(() => {
    const map = new Map<
      string,
      { totalPurchases: number; totalPaid: number; outstandingCredit: number; billCount: number }
    >();

    for (const customer of customers) {
      map.set(customer.id, { totalPurchases: 0, totalPaid: 0, outstandingCredit: 0, billCount: 0 });
    }

    for (const b of bills) {
      const amt = b.totalAmount ?? b.finalAmount ?? 0;
      // Match by customerId, phone, or name
      const matchedCustomer = customers.find(
        (c) =>
          (b.customerId && c.id === b.customerId) ||
          (b.customerPhone && c.phone === b.customerPhone) ||
          (b.customerName && c.name.toLowerCase() === b.customerName.toLowerCase())
      );

      if (matchedCustomer) {
        const curr = map.get(matchedCustomer.id) || {
          totalPurchases: 0,
          totalPaid: 0,
          outstandingCredit: 0,
          billCount: 0,
        };
        curr.totalPurchases += amt;
        curr.billCount += 1;
        if (b.paymentStatus === 'paid') {
          curr.totalPaid += amt;
        } else if (b.paymentStatus === 'pending') {
          curr.outstandingCredit += amt;
        }
        map.set(matchedCustomer.id, curr);
      }
    }

    return map;
  }, [customers, bills]);

  // Overall KPIs
  const totalRegistered = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'active');

  const customersWithCredit = useMemo(() => {
    return customers.filter((c) => {
      const fin = customerFinancials.get(c.id);
      return fin && fin.outstandingCredit > 0;
    });
  }, [customers, customerFinancials]);

  const totalOutstanding = useMemo(() => {
    let sum = 0;
    for (const fin of customerFinancials.values()) {
      sum += fin.outstandingCredit;
    }
    return sum;
  }, [customerFinancials]);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.address && c.address.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      const fin = customerFinancials.get(c.id);
      const hasCredit = fin && fin.outstandingCredit > 0;

      if (statusFilter === 'active') return c.status === 'active';
      if (statusFilter === 'archived') return c.status === 'archived';
      if (statusFilter === 'with-credit') return Boolean(hasCredit);
      return true; // 'all'
    });
  }, [customers, searchQuery, statusFilter, customerFinancials]);

  return (
    <div className="space-y-6">
      {/* 1. Header Title & Top CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            {t('titleCustomers')}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{t('subtitleCustomers')}</p>
        </div>

        <button
          onClick={onOpenAddCustomer}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addCustomerBtn')}</span>
        </button>
      </div>

      {/* 2. Customer Dashboard Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('totalCustomersCard')}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
            {totalRegistered}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {activeCustomers.length} active • {totalRegistered - activeCustomers.length} archived
          </p>
        </div>

        {/* Customers with Credit */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('customersWithCreditCard')}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <BadgeAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2 font-mono">
            {customersWithCredit.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Customers with pending Udhar</p>
        </div>

        {/* Total Outstanding Credit */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('totalOutstandingCreditCard')}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-2 font-mono">
            {formatCurrency(totalOutstanding)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Accounts receivable in store Khata</p>
        </div>

        {/* Recent Customers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('recentCustomersCard')}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
            {customers.slice(0, 5).length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Registered in recent billing cycles</p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchCustomersPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('allFilter')} ({customers.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('activeFilter')} ({activeCustomers.length})
          </button>
          <button
            onClick={() => setStatusFilter('with-credit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === 'with-credit'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{t('withCreditFilter')} ({customersWithCredit.length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('archived')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'archived'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('archivedFilter')} ({totalRegistered - activeCustomers.length})
          </button>
        </div>
      </div>

      {/* 4. Customers List / Table View */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">{t('noCustomersFound')}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or status filter, or register a new customer profile.
          </p>
          <button
            onClick={onOpenAddCustomer}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addCustomerBtn')}</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{t('customerFullName')}</th>
                  <th className="py-3 px-4">{t('customerPhone')}</th>
                  <th className="py-3 px-4">{t('customerAddress')}</th>
                  <th className="py-3 px-4">{t('totalPurchases')}</th>
                  <th className="py-3 px-4">{t('outstandingCreditLabel')}</th>
                  <th className="py-3 px-4">{t('customerStatus')}</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => {
                  const fin = customerFinancials.get(customer.id) || {
                    totalPurchases: 0,
                    totalPaid: 0,
                    outstandingCredit: 0,
                    billCount: 0,
                  };
                  const isArchived = customer.status === 'archived';

                  return (
                    <tr
                      key={customer.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isArchived ? 'opacity-70 bg-slate-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block hover:text-blue-600 cursor-pointer"
                              onClick={() => onViewCustomerProfile(customer)}
                            >
                              {customer.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {customer.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {customer.phone}
                      </td>

                      <td className="py-3 px-4 max-w-[200px] truncate text-slate-600" title={customer.address}>
                        {customer.address || '—'}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {formatCurrency(fin.totalPurchases)}
                        <span className="block text-[10px] text-slate-400 font-sans font-normal">
                          {fin.billCount} bills
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {fin.outstandingCredit > 0 ? (
                          <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-mono text-[11px]">
                            <Clock className="w-3 h-3 shrink-0" />
                            {formatCurrency(fin.outstandingCredit)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            <span>Settled</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                            customer.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {customer.status === 'active' ? t('customerActive') : t('customerArchived')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Quick Bill */}
                          <button
                            onClick={() => onStartBillForCustomer(customer)}
                            title={t('createBillForCustomer')}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>

                          {/* Profile */}
                          <button
                            onClick={() => onViewCustomerProfile(customer)}
                            title={t('viewCustomerProfile')}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onOpenEditCustomer(customer)}
                            title={t('editCustomerTitle')}
                            className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Archive / Restore */}
                          {isArchived ? (
                            <button
                              onClick={() => onArchiveCustomer(customer.id, false)}
                              title={t('unarchiveCustomerBtn')}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onArchiveCustomer(customer.id, true)}
                              title={t('archiveCustomerBtn')}
                              className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete (handles archive if transactions exist) */}
                          <button
                            onClick={() => setConfirmDeleteCustomer(customer)}
                            title={t('deleteCustomerBtn')}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete / Archive Confirmation Dialog */}
      {confirmDeleteCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-50 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{t('deleteCustomerBtn')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('deleteCustomerConfirm')} <strong>{confirmDeleteCustomer.name}</strong>?
              <br />
              <span className="text-slate-500 mt-1 block">
                Note: If this customer has existing bill or credit records, they will be safely <strong>archived</strong> instead of deleted to protect accounting data.
              </span>
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteCustomer(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const id = confirmDeleteCustomer.id;
                  setConfirmDeleteCustomer(null);
                  await onDeleteCustomer(id);
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
