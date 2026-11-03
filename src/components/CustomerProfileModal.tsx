import React, { useMemo } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  Receipt,
  ShoppingCart,
  ExternalLink,
  ShieldCheck,
  Archive,
  ArrowUpRight,
} from 'lucide-react';
import { Customer, Bill } from '../types';
import { formatCurrency, formatIndianDate } from '../utils/formatters';
import { useTranslation } from '../i18n/LanguageContext';

interface CustomerProfileModalProps {
  customer: Customer | null;
  bills: Bill[];
  isOpen: boolean;
  onClose: () => void;
  onViewReceipt: (bill: Bill) => void;
  onStartBillForCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  customer,
  bills,
  isOpen,
  onClose,
  onViewReceipt,
  onStartBillForCustomer,
  onEditCustomer,
}) => {
  const { t, language } = useTranslation();

  if (!isOpen || !customer) return null;

  // Filter bills matching this customer
  const customerBills = useMemo(() => {
    return bills.filter(
      (b) =>
        (b.customerId && b.customerId === customer.id) ||
        (b.customerPhone && b.customerPhone === customer.phone) ||
        (b.customerName && b.customerName.toLowerCase() === customer.name.toLowerCase())
    );
  }, [bills, customer]);

  // Financial aggregates
  const stats = useMemo(() => {
    let totalPurchases = 0;
    let totalPaid = 0;
    let outstandingCredit = 0;

    for (const b of customerBills) {
      const amt = b.totalAmount ?? b.finalAmount ?? 0;
      totalPurchases += amt;
      if (b.paymentStatus === 'paid') {
        totalPaid += amt;
      } else if (b.paymentStatus === 'pending') {
        outstandingCredit += amt;
      }
    }

    return {
      totalPurchases,
      totalPaid,
      outstandingCredit,
      totalOrders: customerBills.length,
    };
  }, [customerBills]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{customer.name}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    customer.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {customer.status === 'active' ? t('customerActive') : t('customerArchived')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                ID: {customer.id} • {t('navCustomers')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onStartBillForCustomer(customer);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{t('createBillForCustomer')}</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onEditCustomer(customer);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {t('editCustomerTitle')}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                {t('totalPurchases')}
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-1 font-mono">
                {formatCurrency(stats.totalPurchases)}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                {stats.totalOrders} {t('recordedDays')}
              </span>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                {t('totalPaid')}
              </span>
              <div className="text-xl font-extrabold text-emerald-700 mt-1 font-mono">
                {formatCurrency(stats.totalPaid)}
              </div>
              <span className="text-[11px] text-emerald-600 mt-0.5 block flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Cash & UPI realized
              </span>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                stats.outstandingCredit > 0
                  ? 'bg-amber-50/80 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider block ${
                  stats.outstandingCredit > 0 ? 'text-amber-800' : 'text-slate-500'
                }`}
              >
                {t('outstandingCreditLabel')} (Udhar)
              </span>
              <div
                className={`text-xl font-extrabold mt-1 font-mono ${
                  stats.outstandingCredit > 0 ? 'text-amber-600' : 'text-slate-900'
                }`}
              >
                {formatCurrency(stats.outstandingCredit)}
              </div>
              <span
                className={`text-[11px] mt-0.5 block ${
                  stats.outstandingCredit > 0 ? 'text-amber-700 font-medium' : 'text-slate-500'
                }`}
              >
                {stats.outstandingCredit > 0
                  ? 'Pending collection in Khata'
                  : 'All bills settled • No pending dues'}
              </span>
            </div>
          </div>

          {/* Contact & Profile Details Grid */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px]">{t('customerPhone')}</span>
                <span className="font-semibold text-slate-800 font-mono">{customer.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px]">Customer Since</span>
                <span className="font-semibold text-slate-800">
                  {formatIndianDate(customer.createdAt)}
                </span>
              </div>
            </div>

            {customer.address && (
              <div className="flex items-start gap-2.5 sm:col-span-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block text-[10px]">{t('customerAddress')}</span>
                  <span className="font-medium text-slate-800">{customer.address}</span>
                </div>
              </div>
            )}

            {customer.email && (
              <div className="flex items-center gap-2.5 sm:col-span-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px]">{t('customerEmail')}</span>
                  <span className="font-medium text-slate-800">{customer.email}</span>
                </div>
              </div>
            )}

            {customer.notes && (
              <div className="flex items-start gap-2.5 sm:col-span-2 pt-2 border-t border-slate-200/80">
                <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block text-[10px]">{t('customerNotes')}</span>
                  <span className="text-slate-700 italic">{customer.notes}</span>
                </div>
              </div>
            )}
          </div>

          {/* Transaction History Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>{t('transactionHistory')}</span>
                <span className="text-xs font-normal text-slate-500">
                  ({customerBills.length} {t('recentBillsTab')})
                </span>
              </h3>
            </div>

            {customerBills.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">{t('noCustomerTransactions')}</p>
                <button
                  onClick={() => {
                    onClose();
                    onStartBillForCustomer(customer);
                  }}
                  className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{t('createBillForCustomer')}</span>
                </button>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3.5">{t('invoiceNumber')}</th>
                        <th className="py-2.5 px-3.5">{t('billDate')}</th>
                        <th className="py-2.5 px-3.5">Items</th>
                        <th className="py-2.5 px-3.5">{t('paymentMethod')}</th>
                        <th className="py-2.5 px-3.5">{t('finalPayable')}</th>
                        <th className="py-2.5 px-3.5">Status</th>
                        <th className="py-2.5 px-3.5 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customerBills.map((bill) => {
                        const billTotal = bill.totalAmount ?? bill.finalAmount ?? 0;
                        const formattedDate = formatIndianDate(bill.date || bill.createdAt);

                        return (
                          <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">
                              {bill.invoiceNumber}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-600">{formattedDate}</td>
                            <td className="py-2.5 px-3.5 text-slate-600">
                              {bill.items?.length || 0} items
                            </td>
                            <td className="py-2.5 px-3.5">
                              <span className="uppercase text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                {bill.paymentMethod}
                              </span>
                            </td>
                            <td className="py-2.5 px-3.5 font-bold font-mono text-slate-900">
                              ₹{billTotal.toFixed(0)}
                            </td>
                            <td className="py-2.5 px-3.5">
                              <span
                                className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                                  bill.paymentStatus === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {bill.paymentStatus === 'paid' ? (
                                  <>
                                    <CheckCircle className="w-2.5 h-2.5" />
                                    {t('paymentStatusPaid')}
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-2.5 h-2.5" />
                                    {t('paymentStatusPending')}
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <button
                                onClick={() => onViewReceipt(bill)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                              >
                                <span>View</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
