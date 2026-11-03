import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { SuppliersView } from './components/SuppliersView';
import { PurchasesView } from './components/PurchasesView';
import { SalesAnalysisView } from './components/SalesAnalysisView';
import { SuggestionsView } from './components/SuggestionsView';
import { ChatView } from './components/ChatView';
import { BillingView } from './components/BillingView';
import { ExpensesView } from './components/ExpensesView';
import { ReceiptModal } from './components/ReceiptModal';
import { ProductModal } from './components/ProductModal';
import { QuickSaleModal } from './components/QuickSaleModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SupplierModal } from './components/SupplierModal';
import { PurchaseOrderModal } from './components/PurchaseOrderModal';
import { BatchModal } from './components/BatchModal';
import {
  INITIAL_PRODUCTS,
  INITIAL_DAILY_SALES,
  INITIAL_SUGGESTIONS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_BILLS,
  INITIAL_EXPENSES,
} from './data/sampleData';
import {
  Product,
  DailySale,
  Suggestion,
  ActiveTab,
  Supplier,
  PurchaseOrder,
  ProductBatch,
  Bill,
  Expense,
  FinancialSummary,
} from './types';
import { calculateShopStats, formatCurrency, getEarliestExpiry } from './utils/formatters';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { LanguageProvider, useTranslation } from './i18n/LanguageContext';

function ShopMateApp() {
  const { t, language } = useTranslation();

  // 1. Products state with persistent storage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_indian_products');
      if (saved) return JSON.parse(saved);
      const legacy = localStorage.getItem('shopmate_products');
      if (legacy && !legacy.includes('Arabica')) return JSON.parse(legacy);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // 2. Suppliers state with persistent storage
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_indian_suppliers');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SUPPLIERS;
  });

  // 3. Purchase Orders state with persistent storage
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_indian_purchases');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PURCHASE_ORDERS;
  });

  // 4. Bills state with persistent storage (Phase 3)
  const [bills, setBills] = useState<Bill[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_indian_bills');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_BILLS;
  });

  // 5. Expenses state with persistent storage (Phase 3)
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_indian_expenses');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_EXPENSES;
  });

  // 6. Financial summary state
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);

  // 7. Active Receipt modal
  const [activeReceiptBill, setActiveReceiptBill] = useState<Bill | null>(null);

  // 8. Sales and suggestions state
  const [dailySales, setDailySales] = useState<DailySale[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_indian_sales');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DAILY_SALES;
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_indian_suggestions');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SUGGESTIONS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | undefined>();

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [batchEditingProduct, setBatchEditingProduct] = useState<Product | null>(null);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [initialPoSupplierId, setInitialPoSupplierId] = useState<string | undefined>();

  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);

  // Suggestions state
  const [isRefreshingSuggestions, setIsRefreshingSuggestions] = useState(false);
  const [lastSuggestionsUpdate, setLastSuggestionsUpdate] = useState('8:00 AM');
  const [suggestionsSource, setSuggestionsSource] = useState<'gemini' | 'fallback'>('gemini');

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch initial data from persistent backend database on startup
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [allDataRes, billsRes, expensesRes, finRes] = await Promise.allSettled([
          fetch('/api/all-data'),
          fetch('/api/bills'),
          fetch('/api/expenses'),
          fetch('/api/financial-summary'),
        ]);

        if (allDataRes.status === 'fulfilled' && allDataRes.value.ok) {
          const data = await allDataRes.value.json();
          if (Array.isArray(data.products) && data.products.length > 0) setProducts(data.products);
          if (Array.isArray(data.suppliers) && data.suppliers.length > 0) setSuppliers(data.suppliers);
          if (Array.isArray(data.purchases) && data.purchases.length > 0) setPurchases(data.purchases);
          if (Array.isArray(data.dailySales) && data.dailySales.length > 0) setDailySales(data.dailySales);
        }

        if (billsRes.status === 'fulfilled' && billsRes.value.ok) {
          const bData = await billsRes.value.json();
          if (Array.isArray(bData) && bData.length > 0) setBills(bData);
        }

        if (expensesRes.status === 'fulfilled' && expensesRes.value.ok) {
          const eData = await expensesRes.value.json();
          if (Array.isArray(eData) && eData.length > 0) setExpenses(eData);
        }

        if (finRes.status === 'fulfilled' && finRes.value.ok) {
          const fData = await finRes.value.json();
          setFinancialSummary(fData);
        }
      } catch (err) {
        console.warn('Backend sync failed, using client storage:', err);
      }
    };
    fetchBackendData();
  }, []);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('shopmate_indian_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('shopmate_indian_suppliers', JSON.stringify(suppliers));
    } catch (e) {
      console.error(e);
    }
  }, [suppliers]);

  useEffect(() => {
    try {
      localStorage.setItem('shopmate_indian_purchases', JSON.stringify(purchases));
    } catch (e) {
      console.error(e);
    }
  }, [purchases]);

  useEffect(() => {
    try {
      localStorage.setItem('shopmate_indian_bills', JSON.stringify(bills));
    } catch (e) {
      console.error(e);
    }
  }, [bills]);

  useEffect(() => {
    try {
      localStorage.setItem('shopmate_indian_expenses', JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem('shopmate_indian_sales', JSON.stringify(dailySales));
    } catch (e) {
      console.error(e);
    }
  }, [dailySales]);

  useEffect(() => {
    try {
      localStorage.setItem('shopmate_indian_suggestions', JSON.stringify(suggestions));
    } catch (e) {
      console.error(e);
    }
  }, [suggestions]);

  // Existing categories
  const existingCategories = Array.from(new Set(products.map((p) => p.category)));

  // Shop metrics for alerts
  const stats = calculateShopStats(products, dailySales, purchases, suppliers);

  // Reset demo data
  const handleResetData = () => {
    setProducts(INITIAL_PRODUCTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setPurchases(INITIAL_PURCHASE_ORDERS);
    setBills(INITIAL_BILLS);
    setExpenses(INITIAL_EXPENSES);
    setDailySales(INITIAL_DAILY_SALES);
    setSuggestions(INITIAL_SUGGESTIONS);

    localStorage.removeItem('shopmate_indian_products');
    localStorage.removeItem('shopmate_indian_suppliers');
    localStorage.removeItem('shopmate_indian_purchases');
    localStorage.removeItem('shopmate_indian_bills');
    localStorage.removeItem('shopmate_indian_expenses');
    localStorage.removeItem('shopmate_indian_sales');
    localStorage.removeItem('shopmate_indian_suggestions');
    localStorage.removeItem('shopmate_products');
    localStorage.removeItem('shopmate_daily_sales');
    localStorage.removeItem('shopmate_suggestions');

    showToast(t('toastResetSuccess'), 'info');
  };

  // ==================== INVENTORY ACTIONS ====================

  const handleSaveProduct = async (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData && productData.id) {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? (productData as Product) : p))
      );
      showToast(t('toastUpdated', { name: productData.name }), 'success');

      try {
        await fetch(`/api/inventory/${productData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } catch (err) {
        console.error('Failed to sync product update to server:', err);
      }
    } else {
      const newProduct: Product = {
        ...(productData as Omit<Product, 'id'>),
        id: `prod-${Date.now()}`,
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(t('toastAdded', { name: newProduct.name }), 'success');

      try {
        await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        });
      } catch (err) {
        console.error('Failed to sync new product to server:', err);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    const prodToDelete = deletingProduct;
    setProducts((prev) => prev.filter((p) => p.id !== prodToDelete.id));
    showToast(t('toastDeleted', { name: prodToDelete.name }), 'warning');
    setDeletingProduct(null);

    try {
      await fetch(`/api/inventory/${prodToDelete.id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete product from server:', err);
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: newQuantity } : p))
    );

    try {
      await fetch(`/api/inventory/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    } catch (err) {
      console.error('Failed to update quantity on server:', err);
    }
  };

  const handleQuickRestock = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const newQty = product.quantity + 10;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: newQty } : p))
    );
    showToast(t('toastReplenished', { name: product.name }), 'success');

    try {
      await fetch(`/api/inventory/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      });
    } catch (err) {
      console.error('Failed to restock on server:', err);
    }
  };

  // Batches Management for Product
  const handleSaveBatches = async (productId: string, newBatches: ProductBatch[]) => {
    const totalQty = newBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);
    const sortedDates = newBatches
      .map((b) => b.expiryDate)
      .filter(Boolean)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          batches: newBatches,
          quantity: totalQty > 0 ? totalQty : p.quantity,
          expiryDate: sortedDates[0] || p.expiryDate,
        };
      })
    );

    showToast('Batches and expiry dates updated successfully.', 'success');

    try {
      await fetch(`/api/inventory/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batches: newBatches,
          quantity: totalQty > 0 ? totalQty : undefined,
          expiryDate: sortedDates[0],
        }),
      });
    } catch (err) {
      console.error('Failed to save batches to server:', err);
    }
  };

  // ==================== SUPPLIER ACTIONS ====================

  const handleSaveSupplier = async (supplierData: Partial<Supplier> & { name: string; phone: string }) => {
    if (supplierData.id) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === supplierData.id ? ({ ...s, ...supplierData } as Supplier) : s))
      );
      showToast(t('toastSupplierUpdated', { name: supplierData.name }), 'success');

      try {
        await fetch(`/api/suppliers/${supplierData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(supplierData),
        });
      } catch (err) {
        console.error('Failed to update supplier on server:', err);
      }
    } else {
      const newSupplier: Supplier = {
        ...(supplierData as any),
        id: `supp-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setSuppliers((prev) => [...prev, newSupplier]);
      showToast(t('toastSupplierAdded', { name: newSupplier.name }), 'success');

      try {
        await fetch('/api/suppliers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSupplier),
        });
      } catch (err) {
        console.error('Failed to create supplier on server:', err);
      }
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    const supp = suppliers.find((s) => s.id === supplierId);
    setSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
    if (supp) {
      showToast(t('toastSupplierDeleted', { name: supp.name }), 'warning');
    }

    try {
      await fetch(`/api/suppliers/${supplierId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete supplier on server:', err);
    }
  };

  // ==================== PURCHASE MANAGEMENT ACTIONS ====================

  const handleSavePurchase = async (orderData: Partial<PurchaseOrder> & { supplierId: string }) => {
    if (orderData.id) {
      setPurchases((prev) =>
        prev.map((po) => (po.id === orderData.id ? ({ ...po, ...orderData } as PurchaseOrder) : po))
      );
      showToast('Purchase Order updated successfully.', 'success');

      try {
        await fetch(`/api/purchases/${orderData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
      } catch (err) {
        console.error('Failed to update purchase on server:', err);
      }
    } else {
      const newOrder: PurchaseOrder = {
        ...(orderData as any),
        id: `po-${Date.now()}`,
        orderNumber: `PO-2026-${String(purchases.length + 101).padStart(3, '0')}`,
        orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
        status: 'pending',
        stockUpdated: false,
        createdAt: new Date().toISOString(),
      };
      setPurchases((prev) => [newOrder, ...prev]);
      showToast(t('toastOrderCreated', { order: newOrder.orderNumber }), 'success');

      try {
        await fetch('/api/purchases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder),
        });
      } catch (err) {
        console.error('Failed to create purchase on server:', err);
      }
    }
  };

  // Feature 4: AUTOMATIC INVENTORY UPDATE WHEN PURCHASE IS MARKED AS RECEIVED
  const handleReceivePurchase = async (orderId: string) => {
    const order = purchases.find((p) => p.id === orderId);
    if (!order) return;

    if (order.stockUpdated) {
      showToast('This purchase order stock has already been applied.', 'warning');
      return;
    }

    try {
      // 1. Call persistent backend atomic receive endpoint
      const response = await fetch(`/api/purchases/${orderId}/receive`, {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        // Update purchase in local state
        setPurchases((prev) =>
          prev.map((po) => (po.id === orderId ? result.order : po))
        );
        // Refresh products with server updated stock and batches
        if (Array.isArray(result.updatedProducts)) {
          setProducts((prev) => {
            const map = new Map(result.updatedProducts.map((p: Product) => [p.id, p]));
            return prev.map((p) => (map.has(p.id) ? (map.get(p.id) as Product) : p));
          });
        }
        showToast(t('toastOrderReceived', { order: order.orderNumber }), 'success');
        return;
      }
    } catch (err) {
      console.warn('Backend receive endpoint unavailable, applying local update:', err);
    }

    // Fallback: Client-side authoritative stock update
    const nowStr = new Date().toISOString().split('T')[0];

    // Automatically increase product stock & create batch records
    setProducts((prevProducts) => {
      const updated = [...prevProducts];

      for (const item of order.items) {
        const prodIndex = updated.findIndex((p) => p.id === item.productId);
        if (prodIndex !== -1) {
          const prod = updated[prodIndex];
          const newBatches: ProductBatch[] = Array.isArray(prod.batches) ? [...prod.batches] : [];

          const batchNum = item.batchNumber || `BAT-${order.orderNumber}`;
          const existingBatchIdx = newBatches.findIndex((b) => b.batchNumber === batchNum);

          if (existingBatchIdx !== -1) {
            newBatches[existingBatchIdx] = {
              ...newBatches[existingBatchIdx],
              quantity: newBatches[existingBatchIdx].quantity + item.quantity,
              expiryDate: item.expiryDate || newBatches[existingBatchIdx].expiryDate,
              purchasePrice: item.unitPrice || newBatches[existingBatchIdx].purchasePrice,
            };
          } else {
            newBatches.push({
              id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              batchNumber: batchNum,
              quantity: item.quantity,
              expiryDate: item.expiryDate || prod.expiryDate || nowStr,
              purchasePrice: item.unitPrice || prod.purchasePrice,
              purchaseDate: nowStr,
            });
          }

          const validDates = newBatches
            .map((b) => b.expiryDate)
            .filter(Boolean)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

          updated[prodIndex] = {
            ...prod,
            quantity: prod.quantity + item.quantity,
            purchasePrice: item.unitPrice > 0 ? item.unitPrice : prod.purchasePrice,
            lastRestocked: nowStr,
            supplierId: order.supplierId,
            supplierName: order.supplierName,
            batchNumber: batchNum,
            expiryDate: validDates[0] || prod.expiryDate,
            batches: newBatches,
          };
        }
      }

      return updated;
    });

    // Mark order as received and prevent future duplicate updates
    setPurchases((prev) =>
      prev.map((po) =>
        po.id === orderId
          ? {
              ...po,
              status: 'received',
              receivedDate: nowStr,
              stockUpdated: true,
            }
          : po
      )
    );

    showToast(t('toastOrderReceived', { order: order.orderNumber }), 'success');
  };

  const handleCancelPurchase = async (orderId: string) => {
    const order = purchases.find((p) => p.id === orderId);
    setPurchases((prev) =>
      prev.map((po) => (po.id === orderId ? { ...po, status: 'cancelled' } : po))
    );
    if (order) {
      showToast(t('toastOrderCancelled', { order: order.orderNumber }), 'warning');
    }

    try {
      await fetch(`/api/purchases/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
    } catch (err) {
      console.error('Failed to cancel purchase on server:', err);
    }
  };

  const handleDeletePurchase = async (orderId: string) => {
    setPurchases((prev) => prev.filter((po) => po.id !== orderId));
    try {
      await fetch(`/api/purchases/${orderId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete purchase on server:', err);
    }
  };

  // ==================== SALE SIMULATOR ====================

  const handleRecordSale = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (product.quantity < quantity) {
      showToast(t('toastInsufficientStock', { qty: quantity, left: product.quantity }), 'warning');
      return;
    }

    // Deduct stock (and deduct from earliest batch if batches exist)
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        let remainingToDeduct = quantity;
        const newBatches = Array.isArray(p.batches)
          ? p.batches.map((b) => {
              if (remainingToDeduct <= 0) return b;
              const deduct = Math.min(b.quantity, remainingToDeduct);
              remainingToDeduct -= deduct;
              return { ...b, quantity: b.quantity - deduct };
            })
          : [];

        return {
          ...p,
          quantity: p.quantity - quantity,
          batches: newBatches,
        };
      })
    );

    const revenue = product.sellingPrice * quantity;
    const cost = product.purchasePrice * quantity;
    const profit = revenue - cost;

    setDailySales((prev) => {
      const updated = [...prev];
      const todayIndex = updated.length - 1;
      if (todayIndex >= 0) {
        const today = updated[todayIndex];
        updated[todayIndex] = {
          ...today,
          sales: Math.round((today.sales + revenue) * 100) / 100,
          cost: Math.round((today.cost + cost) * 100) / 100,
          profit: Math.round((today.profit + profit) * 100) / 100,
          transactions: today.transactions + 1,
        };
      }
      return updated;
    });

    showToast(
      t('toastSaleRecorded', {
        qty: quantity,
        name: product.name,
        profit: formatCurrency(profit),
      }),
      'success'
    );
  };

  // ==================== POS BILLING ACTIONS (Phase 3) ====================

  const handleCreateBill = async (billData: Omit<Bill, 'id' | 'createdAt'>): Promise<Bill | null> => {
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create bill');
      }

      const createdBill: Bill = await res.json();

      // Deduct stock locally via FEFO
      setProducts((prev) =>
        prev.map((product) => {
          const item = createdBill.items.find((i) => i.productId === product.id);
          if (!item) return product;

          let remainingToDeduct = item.quantity;
          const updatedBatches = (product.batches || [])
            .map((b) => ({ ...b }))
            .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
            .map((batch) => {
              if (remainingToDeduct <= 0) return batch;
              const deduct = Math.min(batch.quantity, remainingToDeduct);
              remainingToDeduct -= deduct;
              return { ...batch, quantity: batch.quantity - deduct };
            })
            .filter((batch) => batch.quantity > 0);

          return {
            ...product,
            quantity: Math.max(0, product.quantity - item.quantity),
            batches: updatedBatches,
          };
        })
      );

      // Add to bills
      setBills((prev) => [createdBill, ...prev]);

      // Update daily sales
      setDailySales((prev) => {
        const updated = [...prev];
        const todayIndex = updated.length - 1;
        if (todayIndex >= 0) {
          const today = updated[todayIndex];
          const cost = createdBill.items.reduce(
            (s, i) => s + (i.costPrice ?? i.purchasePrice ?? 0) * i.quantity,
            0
          );
          const billedAmount = createdBill.totalAmount ?? createdBill.finalAmount ?? 0;
          const profit = billedAmount - cost;
          updated[todayIndex] = {
            ...today,
            sales: Math.round((today.sales + billedAmount) * 100) / 100,
            cost: Math.round((today.cost + cost) * 100) / 100,
            profit: Math.round((today.profit + profit) * 100) / 100,
            transactions: today.transactions + 1,
          };
        }
        return updated;
      });

      // Refresh financial summary
      try {
        const fRes = await fetch('/api/financial-summary');
        if (fRes.ok) setFinancialSummary(await fRes.json());
      } catch (e) {
        // ignore
      }

      showToast(t('toastBillCreated', { invoice: createdBill.invoiceNumber }), 'success');
      return createdBill;
    } catch (err: any) {
      showToast(err.message || 'Error creating bill', 'warning');
      throw err;
    }
  };

  // ==================== EXPENSE ACTIONS (Phase 3) ====================

  const handleAddExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });

      if (!res.ok) {
        throw new Error('Failed to record expense');
      }

      const created: Expense = await res.json();
      setExpenses((prev) => [created, ...prev]);

      try {
        const fRes = await fetch('/api/financial-summary');
        if (fRes.ok) setFinancialSummary(await fRes.json());
      } catch (e) {}

      showToast(t('toastExpenseAdded', { amount: `₹${created.amount}`, category: created.category }), 'success');
    } catch (err: any) {
      showToast(err.message || 'Error adding expense', 'warning');
    }
  };

  const handleEditExpense = async (expense: Expense) => {
    try {
      setExpenses((prev) => prev.map((e) => (e.id === expense.id ? expense : e)));
      showToast(t('toastExpenseUpdated'), 'success');

      await fetch(`/api/expenses/${expense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });

      const fRes = await fetch('/api/financial-summary');
      if (fRes.ok) setFinancialSummary(await fRes.json());
    } catch (err: any) {
      showToast(err.message || 'Error updating expense', 'warning');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      showToast(t('toastExpenseDeleted'), 'info');

      await fetch(`/api/expenses/${id}`, { method: 'DELETE' });

      const fRes = await fetch('/api/financial-summary');
      if (fRes.ok) setFinancialSummary(await fRes.json());
    } catch (err: any) {
      showToast(err.message || 'Error deleting expense', 'warning');
    }
  };

  // Refresh Suggestions from Gemini AI in active language
  const handleRefreshSuggestions = async () => {
    setIsRefreshingSuggestions(true);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventory: products,
          language,
          salesSummary: {
            totalSales: stats.totalSales,
            estimatedProfit: stats.estimatedProfit,
            marginPercent: stats.marginPercent,
          },
          topSellers: stats.topSellers,
        }),
      });

      const data = await response.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        setSuggestionsSource(data.source || 'gemini');
        setLastSuggestionsUpdate(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
        showToast(t('toastAiRefreshed'), 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not refresh suggestions; using cached advice.', 'warning');
    } finally {
      setIsRefreshingSuggestions(false);
    }
  };

  const handleAskAIQuestion = (question: string) => {
    setChatInitialQuestion(question);
    setActiveTab('chat');
  };

  return (
    <div className="flex min-h-screen bg-slate-100/60 font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in slide-in-from-bottom-5">
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : toast.type === 'info' ? (
            <Sparkles className="h-4 w-4 text-blue-400" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Responsive Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowStockCount={stats.lowStockCount}
        onResetData={handleResetData}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Layout Container */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Sticky Header with Language Switcher */}
        <Header
          activeTab={activeTab}
          onOpenAddModal={() => {
            setEditingProduct(null);
            setIsProductModalOpen(true);
          }}
          onOpenQuickSale={() => setIsQuickSaleOpen(true)}
          onOpenChat={() => setActiveTab('chat')}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        />

        {/* View Switcher Container */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              products={products}
              dailySales={dailySales}
              purchases={purchases}
              suppliers={suppliers}
              setActiveTab={setActiveTab}
              onOpenAddModal={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onQuickRestock={handleQuickRestock}
              onAskAIQuestion={handleAskAIQuestion}
              onReceiveOrder={handleReceivePurchase}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              onOpenAddModal={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onEditProduct={(product) => {
                setEditingProduct(product);
                setIsProductModalOpen(true);
              }}
              onDeleteProduct={(product) => setDeletingProduct(product)}
              onUpdateQuantity={handleUpdateQuantity}
              onAskAIAboutProduct={(name) =>
                handleAskAIQuestion(
                  language === 'kn'
                    ? `ನನ್ನ ಅಂಗಡಿಯಲ್ಲಿ "${name}" ಗಾಗಿ ಉತ್ತಮ ಬೆಲೆ ಮತ್ತು ಮರುಆದೇಶ ತಂತ್ರವೇನು?`
                    : `What is the best pricing and reordering strategy for "${name}" in my store?`
                )
              }
              onOpenBatchesModal={(product) => setBatchEditingProduct(product)}
            />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersView
              suppliers={suppliers}
              products={products}
              purchases={purchases}
              onOpenAddSupplier={() => {
                setEditingSupplier(null);
                setIsSupplierModalOpen(true);
              }}
              onOpenEditSupplier={(supplier) => {
                setEditingSupplier(supplier);
                setIsSupplierModalOpen(true);
              }}
              onDeleteSupplier={handleDeleteSupplier}
              onCreatePoForSupplier={(supplierId) => {
                setInitialPoSupplierId(supplierId);
                setEditingPurchaseOrder(null);
                setIsPurchaseModalOpen(true);
              }}
            />
          )}

          {activeTab === 'purchases' && (
            <PurchasesView
              purchases={purchases}
              suppliers={suppliers}
              products={products}
              onOpenCreateOrder={() => {
                setEditingPurchaseOrder(null);
                setInitialPoSupplierId(undefined);
                setIsPurchaseModalOpen(true);
              }}
              onReceiveOrder={handleReceivePurchase}
              onCancelOrder={handleCancelPurchase}
              onDeleteOrder={handleDeletePurchase}
            />
          )}

          {activeTab === 'billing' && (
            <BillingView
              inventory={products}
              bills={bills}
              onCreateBill={handleCreateBill}
              onViewReceipt={(bill) => setActiveReceiptBill(bill)}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'sales' && (
            <SalesAnalysisView
              dailySales={dailySales}
              products={products}
              bills={bills}
              expenses={expenses}
              financialSummary={financialSummary}
              onOpenQuickSale={() => setIsQuickSaleOpen(true)}
            />
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsView
              suggestions={suggestions}
              onRefreshSuggestions={handleRefreshSuggestions}
              isRefreshing={isRefreshingSuggestions}
              lastUpdated={lastSuggestionsUpdate}
              source={suggestionsSource}
              setActiveTab={setActiveTab}
              onAskAIQuestion={handleAskAIQuestion}
            />
          )}

          {activeTab === 'chat' && (
            <ChatView
              products={products}
              dailySales={dailySales}
              initialQuestion={chatInitialQuestion}
              onClearInitialQuestion={() => setChatInitialQuestion(undefined)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {activeReceiptBill && (
        <ReceiptModal
          bill={activeReceiptBill}
          onClose={() => setActiveReceiptBill(null)}
        />
      )}

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        existingCategories={existingCategories}
        suppliers={suppliers}
      />

      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => {
          setIsSupplierModalOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        supplier={editingSupplier}
        products={products}
      />

      <PurchaseOrderModal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setEditingPurchaseOrder(null);
          setInitialPoSupplierId(undefined);
        }}
        onSave={handleSavePurchase}
        suppliers={suppliers}
        products={products}
        initialSupplierId={initialPoSupplierId}
        editingOrder={editingPurchaseOrder}
      />

      <BatchModal
        product={batchEditingProduct}
        isOpen={!!batchEditingProduct}
        onClose={() => setBatchEditingProduct(null)}
        onSaveBatches={handleSaveBatches}
      />

      <QuickSaleModal
        isOpen={isQuickSaleOpen}
        onClose={() => setIsQuickSaleOpen(false)}
        products={products}
        onRecordSale={handleRecordSale}
      />

      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        product={deletingProduct}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ShopMateApp />
    </LanguageProvider>
  );
}
