import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { SalesAnalysisView } from './components/SalesAnalysisView';
import { SuggestionsView } from './components/SuggestionsView';
import { ChatView } from './components/ChatView';
import { ProductModal } from './components/ProductModal';
import { QuickSaleModal } from './components/QuickSaleModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import {
  INITIAL_PRODUCTS,
  INITIAL_DAILY_SALES,
  INITIAL_SUGGESTIONS,
} from './data/sampleData';
import { Product, DailySale, Suggestion, ActiveTab } from './types';
import { calculateShopStats, formatCurrency } from './utils/formatters';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { LanguageProvider, useTranslation } from './i18n/LanguageContext';

function ShopMateApp() {
  const { t, language } = useTranslation();

  // Persistent or fallback state for Indian Kirana edition
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_indian_products');
      if (saved) return JSON.parse(saved);
      // Clean legacy cache if it had old non-Indian items
      const legacy = localStorage.getItem('shopmate_products');
      if (legacy && !legacy.includes('Arabica')) {
        return JSON.parse(legacy);
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

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

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);

  // Suggestions state
  const [isRefreshingSuggestions, setIsRefreshingSuggestions] = useState(false);
  const [lastSuggestionsUpdate, setLastSuggestionsUpdate] = useState('8:00 AM');
  const [suggestionsSource, setSuggestionsSource] = useState<'gemini' | 'fallback'>('gemini');

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

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
  const stats = calculateShopStats(products, dailySales);

  // Reset sample data
  const handleResetData = () => {
    setProducts(INITIAL_PRODUCTS);
    setDailySales(INITIAL_DAILY_SALES);
    setSuggestions(INITIAL_SUGGESTIONS);
    localStorage.removeItem('shopmate_indian_products');
    localStorage.removeItem('shopmate_indian_sales');
    localStorage.removeItem('shopmate_indian_suggestions');
    localStorage.removeItem('shopmate_products');
    localStorage.removeItem('shopmate_daily_sales');
    localStorage.removeItem('shopmate_suggestions');
    showToast(t('toastResetSuccess'), 'info');
  };

  // Save new or edited product
  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData && productData.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? (productData as Product) : p))
      );
      showToast(t('toastUpdated', { name: productData.name }), 'success');
    } else {
      const newProduct: Product = {
        ...(productData as Omit<Product, 'id'>),
        id: `prod-${Date.now()}`,
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(t('toastAdded', { name: newProduct.name }), 'success');
    }
  };

  // Delete product
  const handleConfirmDelete = () => {
    if (!deletingProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    showToast(t('toastDeleted', { name: deletingProduct.name }), 'warning');
    setDeletingProduct(null);
  };

  // Update quantity inline
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: newQuantity } : p))
    );
  };

  // Quick Restock (+10 units)
  const handleQuickRestock = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: p.quantity + 10 } : p))
    );
    showToast(t('toastReplenished', { name: product.name }), 'success');
  };

  // Record simulated sale
  const handleRecordSale = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (product.quantity < quantity) {
      showToast(t('toastInsufficientStock', { qty: product.quantity }), 'warning');
      return;
    }

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - quantity } : p))
    );

    // Add to today's sale
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

  // Ask AI a question from dashboard or suggestions
  const handleAskAIQuestion = (question: string) => {
    setChatInitialQuestion(question);
    setActiveTab('chat');
  };

  return (
    <div className="flex min-h-screen bg-slate-100/70 font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 border border-slate-700">
          {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />}
          {toast.type === 'info' && <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Dark Blue Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowStockCount={stats.lowStockCount}
        onResetData={handleResetData}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              products={products}
              dailySales={dailySales}
              setActiveTab={setActiveTab}
              onOpenAddModal={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onQuickRestock={handleQuickRestock}
              onAskAIQuestion={handleAskAIQuestion}
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
            />
          )}

          {activeTab === 'sales' && (
            <SalesAnalysisView
              dailySales={dailySales}
              products={products}
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
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        existingCategories={existingCategories}
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
