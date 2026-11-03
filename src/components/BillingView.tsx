import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Receipt,
  User,
  Phone,
  Banknote,
  QrCode,
  BookOpen,
  Printer,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Users,
} from 'lucide-react';
import { Product, Bill, BillItem, PaymentMethod, Customer } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface BillingViewProps {
  inventory: Product[];
  bills: Bill[];
  customers?: Customer[];
  selectedCustomerForBill?: Customer | null;
  onClearSelectedCustomer?: () => void;
  onCreateBill: (billData: Omit<Bill, 'id' | 'createdAt'>) => Promise<Bill | null>;
  onViewReceipt: (bill: Bill) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  inventory,
  bills,
  customers = [],
  selectedCustomerForBill,
  onClearSelectedCustomer,
  onCreateBill,
  onViewReceipt,
}) => {
  const { t, language } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState<'new-bill' | 'history'>('new-bill');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Cart state
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [customerName, setCustomerName] = useState(selectedCustomerForBill?.name || '');
  const [customerPhone, setCustomerPhone] = useState(selectedCustomerForBill?.phone || '');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(selectedCustomerForBill?.id);
  const [cashReceived, setCashReceived] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync if selectedCustomerForBill changes externally
  useEffect(() => {
    if (selectedCustomerForBill) {
      setCustomerName(selectedCustomerForBill.name);
      setCustomerPhone(selectedCustomerForBill.phone);
      setSelectedCustomerId(selectedCustomerForBill.id);
    }
  }, [selectedCustomerForBill]);

  // Categories list
  const categories = useMemo(() => {
    const cats = Array.from(new Set(inventory.map((p) => p.category)));
    return ['All', ...cats];
  }, [inventory]);

  // Filtered products for billing catalog
  const filteredProducts = useMemo(() => {
    return inventory.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchQuery, selectedCategory]);

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.quantity <= 0) {
      setErrorMessage(`${product.name} is out of stock!`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          setErrorMessage(`Cannot add more than ${product.quantity} ${product.unit} (available stock).`);
          setTimeout(() => setErrorMessage(null), 3000);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;

    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (qty > item.product.quantity) {
      setErrorMessage(`Cannot exceed available stock of ${item.product.quantity} ${item.product.unit}.`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountValue(0);
    setCashReceived('');
    setErrorMessage(null);
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (discountValue <= 0) return 0;
    if (discountType === 'percent') {
      return (subtotal * Math.min(100, Math.max(0, discountValue))) / 100;
    }
    return Math.min(subtotal, Math.max(0, discountValue));
  }, [subtotal, discountType, discountValue]);

  const finalAmount = Math.max(0, subtotal - discountAmount);

  const changeToReturn = useMemo(() => {
    if (paymentMethod !== 'cash' || typeof cashReceived !== 'number') return 0;
    return Math.max(0, cashReceived - finalAmount);
  }, [paymentMethod, cashReceived, finalAmount]);

  // Handle Checkout
  const handleCompleteSale = async () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'credit' && !customerName.trim()) {
      setErrorMessage(t('customerCreditNote'));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const billItems: BillItem[] = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      unit: item.product.unit,
      quantity: item.quantity,
      unitPrice: item.product.sellingPrice,
      costPrice: item.product.purchasePrice,
      total: item.product.sellingPrice * item.quantity,
      sellingPrice: item.product.sellingPrice,
      purchasePrice: item.product.purchasePrice,
      totalPrice: item.product.sellingPrice * item.quantity,
    }));

    const now = new Date();
    const costOfGoods = billItems.reduce((s, i) => s + i.costPrice * i.quantity, 0);

    const billData: Omit<Bill, 'id' | 'createdAt'> = {
      invoiceNumber: `INV-${now.getFullYear()}-${String(bills.length + 1001).padStart(4, '0')}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      items: billItems,
      subtotal,
      discount: discountAmount,
      discountType,
      discountValue: Number(discountValue) || 0,
      discountAmount,
      totalAmount: finalAmount,
      finalAmount,
      costOfGoods,
      profit: finalAmount - costOfGoods,
      paymentMethod,
      paymentStatus: paymentMethod === 'credit' ? ('pending' as const) : ('paid' as const),
      customerId: selectedCustomerId || undefined,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      cashReceived: paymentMethod === 'cash' && typeof cashReceived === 'number' ? cashReceived : undefined,
      changeReturned: paymentMethod === 'cash' && changeToReturn > 0 ? changeToReturn : undefined,
    };

    try {
      const created = await onCreateBill(billData);
      if (created) {
        clearCart();
        setCustomerName('');
        setCustomerPhone('');
        setSelectedCustomerId(undefined);
        if (onClearSelectedCustomer) onClearSelectedCustomer();
        onViewReceipt(created);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Receipt className="w-7 h-7 text-emerald-600" />
            {t('titleBilling')}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{t('subtitleBilling')}</p>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveSubTab('new-bill')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'new-bill'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
            {t('newBillTab')}
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-blue-600" />
            {t('recentBillsTab')} ({bills.length})
          </button>
        </div>
      </div>

      {/* Main Billing UI or History */}
      {activeSubTab === 'new-bill' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Product Catalog (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Categories */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('searchProductsToBill')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[640px] overflow-y-auto pr-1">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.quantity <= 0;
                const isLowStock = product.quantity > 0 && product.quantity <= product.minStockThreshold;
                const cartItem = cart.find((i) => i.product.id === product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => !isOutOfStock && addToCart(product)}
                    className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                      isOutOfStock
                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                        : cartItem
                        ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300 shadow-sm hover:border-emerald-400'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {product.category}
                        </span>
                        {isOutOfStock ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                            Out of stock
                          </span>
                        ) : isLowStock ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                            Only {product.quantity} left
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-500">
                            {product.quantity} {product.unit} {t('stockLeft')}
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-slate-900 text-sm mt-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{product.sku}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-base font-bold text-slate-900">
                          ₹{product.sellingPrice.toFixed(0)}
                        </span>
                        <span className="text-[11px] text-slate-400">/{product.unit}</span>
                      </div>

                      {cartItem ? (
                        <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
                          <span>{cartItem.quantity} in cart</span>
                        </div>
                      ) : (
                        <button
                          disabled={isOutOfStock}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: POS Cart & Checkout (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <h2 className="font-bold text-slate-900 text-base">{t('currentCart')}</h2>
                <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)} items
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t('clearCartBtn')}
                </button>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <p className="font-semibold text-slate-700 text-sm">{t('cartEmpty')}</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">{t('cartEmptyDesc')}</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-2 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        ₹{item.product.sellingPrice} × {item.quantity} = ₹
                        {(item.product.sellingPrice * item.quantity).toFixed(0)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Calculations & Discounts */}
            <div className="pt-3 border-t border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t('subtotal')}:</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toFixed(0)}</span>
              </div>

              {/* Discount inputs */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600">{t('discount')}:</span>
                <div className="flex items-center gap-1">
                  <div className="flex rounded-lg bg-slate-100 p-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setDiscountType('flat')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        discountType === 'flat' ? 'bg-white font-bold text-slate-900 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      ₹
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType('percent')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        discountType === 'percent' ? 'bg-white font-bold text-slate-900 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      %
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discountValue || ''}
                    onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-2 py-1 text-right bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold"
                  />
                </div>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{t('discount')} Applied:</span>
                  <span>-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>{t('finalPayable')}:</span>
                <span className="text-emerald-700">₹{finalAmount.toFixed(0)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <label className="text-xs font-semibold text-slate-700 block">{t('paymentMethod')}</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'cash'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span className="text-[11px]">{t('payCash')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'upi'
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[11px]">{t('payUpi')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'credit'
                      ? 'border-amber-600 bg-amber-50 text-amber-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[11px]">{t('payCredit')}</span>
                </button>
              </div>
            </div>

            {/* Customer Details & Payment-specific fields */}
            <div className="space-y-2 pt-1 text-xs">
              {selectedCustomerId && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold truncate">
                      {customerName}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono">
                      {selectedCustomerId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCustomerId(undefined);
                      if (onClearSelectedCustomer) onClearSelectedCustomer();
                    }}
                    className="text-emerald-700 hover:text-emerald-950 text-[11px] font-medium underline shrink-0 cursor-pointer ml-2"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    {t('customerName')}{' '}
                    {paymentMethod === 'credit' && <span className="text-rose-500">*</span>}
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      list="registered-customers-list"
                      placeholder="e.g. Rajesh Sharma"
                      value={customerName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomerName(val);
                        // Check if value matches an existing customer
                        const matched = customers.find(
                          (c) => c.name.toLowerCase() === val.toLowerCase()
                        );
                        if (matched) {
                          setCustomerPhone(matched.phone);
                          setSelectedCustomerId(matched.id);
                        }
                      }}
                      className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <datalist id="registered-customers-list">
                      {customers
                        .filter((c) => c.status !== 'archived')
                        .map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.phone} ({c.id})
                          </option>
                        ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    {t('customerPhone')}
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="98450..."
                      value={customerPhone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomerPhone(val);
                        const matched = customers.find((c) => c.phone === val);
                        if (matched) {
                          setCustomerName(matched.name);
                          setSelectedCustomerId(matched.id);
                        }
                      }}
                      className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Cash given & change to return */}
              {paymentMethod === 'cash' && (
                <div className="grid grid-cols-2 gap-2 pt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      {t('cashGivenByCustomer')}
                    </label>
                    <input
                      type="number"
                      min={finalAmount}
                      placeholder={`₹${finalAmount}`}
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      {t('changeToReturn')}
                    </label>
                    <div className="px-2.5 py-1.5 bg-slate-200/60 rounded-lg text-xs font-bold text-slate-800">
                      ₹{changeToReturn.toFixed(0)}
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Warning */}
              {paymentMethod === 'credit' && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] flex items-start gap-2">
                  <BookOpen className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>{t('customerCreditNote')}. Recorded under accounts receivable.</span>
                </div>
              )}
            </div>

            {/* Complete Sale Button */}
            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? 'Processing...' : t('completeSaleBtn')}
            </button>
          </div>
        </div>
      ) : (
        /* History & Sales Invoices Tab */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              {t('recentBillsTab')}
            </h3>
            <span className="text-xs text-slate-500">{bills.length} bills recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{t('invoiceNumber')}</th>
                  <th className="py-3 px-4">{t('billDate')}</th>
                  <th className="py-3 px-4">{t('customerName')}</th>
                  <th className="py-3 px-4">{t('paymentMethod')}</th>
                  <th className="py-3 px-4">{t('finalPayable')}</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bills.map((bill) => {
                  const billDate = new Date(bill.createdAt || bill.date).toLocaleString(
                    language === 'kn' ? 'kn-IN' : 'en-IN',
                    { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                  );
                  const displayTotal = bill.totalAmount ?? bill.finalAmount ?? 0;

                  return (
                    <tr key={bill.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {bill.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{billDate}</td>
                      <td className="py-3 px-4 text-slate-900 font-medium">
                        {bill.customerName || 'Walk-in Customer'}
                        {bill.customerPhone && (
                          <span className="block text-[10px] text-slate-400">
                            {bill.customerPhone}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="uppercase text-[11px] font-semibold text-slate-700">
                          {bill.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{displayTotal.toFixed(0)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                            bill.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {bill.paymentStatus === 'paid' ? t('paymentStatusPaid') : t('paymentStatusPending')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewReceipt(bill)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          {t('viewInvoice')}
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
  );
};
