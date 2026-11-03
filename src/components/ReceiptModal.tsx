import React from 'react';
import { Printer, X, CheckCircle, Clock, Store, Phone, Receipt } from 'lucide-react';
import { Bill } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface ReceiptModalProps {
  bill: Bill;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ bill, onClose }) => {
  const { t, language } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(bill.createdAt || Date.now()).toLocaleString(
    language === 'kn' ? 'kn-IN' : 'en-IN',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  const finalPayable = bill.finalAmount ?? bill.totalAmount ?? 0;
  const discountVal = bill.discountAmount ?? bill.discount ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-w-full print:shadow-none print:border-none print:max-h-none">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-sm">{t('billReceiptTitle')}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              {t('printReceiptBtn')}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thermal Receipt Paper Layout */}
        <div className="p-6 overflow-y-auto bg-slate-50 font-mono text-xs text-slate-800 space-y-4 print:p-4 print:bg-white print:text-black">
          {/* Shop Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-700 mb-1 print:hidden">
              <Store className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">{t('storeName')}</h2>
            <p className="text-[11px] text-slate-600 font-sans">{t('storeType')}</p>
            <p className="text-[10px] text-slate-500">Bengaluru, Karnataka • GSTIN: 29AABCU9603R1ZX</p>
            <p className="text-[10px] text-slate-500">Phone: +91 98450 12345</p>
          </div>

          {/* Invoice Info */}
          <div className="text-[11px] space-y-1 pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('invoiceNumber')}:</span>
              <span className="font-bold text-slate-900">{bill.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('billDate')}:</span>
              <span>{formattedDate}</span>
            </div>
            {bill.customerName && (
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">{t('customerName')}:</span>
                <span className="font-bold text-slate-900">{bill.customerName}</span>
              </div>
            )}
            {bill.customerPhone && (
              <div className="flex justify-between">
                <span className="text-slate-500">{t('customerPhone')}:</span>
                <span>{bill.customerPhone}</span>
              </div>
            )}
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">{t('paymentMethod')}:</span>
              <span className="font-bold uppercase">
                {bill.paymentMethod === 'cash'
                  ? t('payCash')
                  : bill.paymentMethod === 'upi'
                  ? t('payUpi')
                  : t('payCredit')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Status:</span>
              <span
                className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded ${
                  bill.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {bill.paymentStatus === 'paid' ? (
                  <>
                    <CheckCircle className="w-3 h-3" /> {t('paymentStatusPaid')}
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" /> {t('paymentStatusPending')}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="pb-3 border-b border-dashed border-slate-300">
            <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase pb-1 border-b border-slate-200">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">{t('qty')}</div>
              <div className="col-span-2 text-right">{t('itemRate')}</div>
              <div className="col-span-2 text-right">{t('lineTotal')}</div>
            </div>

            <div className="divide-y divide-slate-100 py-1">
              {bill.items.map((item, idx) => {
                const rate = item.unitPrice ?? item.sellingPrice ?? 0;
                const total = item.total ?? item.totalPrice ?? (rate * item.quantity);
                return (
                  <div key={idx} className="grid grid-cols-12 py-1.5 text-[11px] items-center">
                    <div className="col-span-6 font-sans font-medium text-slate-900 truncate pr-1">
                      {item.productName}
                      {item.batchesDeducted && item.batchesDeducted.length > 0 && (
                        <span className="block text-[9px] text-emerald-600 font-mono">
                          [FEFO: {item.batchesDeducted.map((b) => b.batchNumber).join(', ')}]
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 text-center text-slate-600">
                      {item.quantity} {item.unit}
                    </div>
                    <div className="col-span-2 text-right text-slate-600">
                      ₹{rate.toFixed(0)}
                    </div>
                    <div className="col-span-2 text-right font-bold text-slate-900">
                      ₹{total.toFixed(0)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="space-y-1.5 pb-3 border-b border-dashed border-slate-300 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-600">{t('subtotal')}:</span>
              <span className="font-semibold">₹{bill.subtotal.toFixed(0)}</span>
            </div>
            {discountVal > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>
                  {t('discount')} ({bill.discountType === 'percent' ? `${bill.discountValue}%` : '₹'}):
                </span>
                <span>-₹{discountVal.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-slate-900 pt-1 border-t border-slate-300">
              <span>{t('finalPayable')}:</span>
              <span>₹{finalPayable.toFixed(0)}</span>
            </div>
            {bill.paymentMethod === 'cash' && bill.cashReceived && bill.cashReceived > 0 && (
              <>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                  <span>{t('cashGivenByCustomer')}:</span>
                  <span>₹{bill.cashReceived.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-700 font-bold">
                  <span>{t('changeToReturn')}:</span>
                  <span>₹{(bill.changeReturned || 0).toFixed(0)}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[10px] text-slate-500 space-y-1">
            <p className="font-medium text-slate-700">{t('thankYouNote')}</p>
            <p>{t('customerCopy')} • Powered by ShopMate AI</p>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            {t('printReceiptBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
