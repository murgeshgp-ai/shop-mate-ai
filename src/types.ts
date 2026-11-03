export interface ProductBatch {
  id: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string; // YYYY-MM-DD
  purchasePrice?: number;
  purchaseDate?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  purchasePrice: number; // Cost price
  sellingPrice: number;  // Retail price
  minStockThreshold: number; // Alert threshold (default 10)
  minStockAlert?: number; // Alias
  unit: string; // e.g. 'pack', 'kg', 'bottle', 'box'
  lastRestocked?: string;
  // Feature 1: Expiry & Batch Tracking
  expiryDate?: string; // Earliest or primary batch expiry (YYYY-MM-DD)
  batchNumber?: string;
  batches?: ProductBatch[];
  // Feature 2: Supplier Association
  supplierId?: string;
  supplierName?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  notes?: string;
  createdAt: string; // YYYY-MM-DD
  status: 'active' | 'archived';
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  contactPerson?: string;
  category?: string;
  notes?: string;
  suppliedProductIds?: string[];
  createdAt: string;
}

export type PurchaseOrderStatus = 'pending' | 'received' | 'cancelled';

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  batchNumber?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  expiryDate?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  invoiceNumber?: string;
  orderDate: string; // YYYY-MM-DD
  expectedDate?: string; // YYYY-MM-DD
  receivedDate?: string; // YYYY-MM-DD
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  stockUpdated: boolean; // Prevent duplicate stock additions
  notes?: string;
  createdAt: string;
}

// Phase 3: Smart POS Billing & Invoices
export type PaymentMethod = 'cash' | 'upi' | 'credit';

export interface BillItem {
  productId: string;
  productName: string;
  sku?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  total: number;
  // Aliases for convenience
  purchasePrice?: number;
  sellingPrice?: number;
  totalPrice?: number;
  batchesDeducted?: { batchNumber: string; quantity: number; expiryDate?: string }[];
}

export interface Bill {
  id: string;
  invoiceNumber: string;
  date: string; // YYYY-MM-DD or ISO
  time: string; // HH:mm:ss
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  items: BillItem[];
  subtotal: number;
  discount: number; // Flat or computed INR discount
  discountType?: 'flat' | 'percent';
  discountValue?: number;
  discountAmount?: number;
  totalAmount: number;
  finalAmount?: number; // Final payable amount (alias for totalAmount)
  costOfGoods: number;
  profit: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending'; // 'pending' if credit/udhar
  cashReceived?: number;
  changeReturned?: number;
  notes?: string;
  createdAt: string;
}

// Phase 3: Expense Management
export type ExpenseCategory =
  | 'rent'
  | 'electricity'
  | 'salaries'
  | 'transportation'
  | 'maintenance'
  | 'packaging'
  | 'miscellaneous';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  paymentMethod?: 'cash' | 'upi';
  description?: string;
  receiptNumber?: string;
  createdAt?: string;
}

// Phase 3: Financial Summary
export interface FinancialSummary {
  totalRevenue: number;
  costOfGoods: number;
  costOfGoodsSold?: number;
  grossProfit: number;
  grossMarginPercent: number;
  totalExpenses: number;
  totalOperatingExpenses?: number;
  netProfit: number;
  netMarginPercent: number;
  cashReceived: number; // Cash + UPI
  outstandingCredit: number; // Unpaid customer credit (Udhar)
  expenseByCategory?: Record<string, number>;
  paymentBreakdown?: {
    cash: { count: number; amount: number };
    upi: { count: number; amount: number };
    credit: { count: number; amount: number };
  };
}

export interface DailySale {
  date: string;
  dayName: string;
  sales: number;      // Total revenue
  cost: number;       // Total cost of goods
  profit: number;     // Estimated profit
  transactions: number;
}

export interface BestSeller {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  profit: number;
  marginPercent: number;
}

export interface Suggestion {
  id: string;
  title: string;
  category: 'Inventory' | 'Pricing' | 'Sales' | 'Cost Saving';
  impact: string;
  urgency: 'High' | 'Medium' | 'Low';
  summary: string;
  actionSteps: string[];
  recommendedActionLabel: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'gemini' | 'fallback';
}

export type ActiveTab =
  | 'dashboard'
  | 'billing'
  | 'customers'
  | 'inventory'
  | 'suppliers'
  | 'purchases'
  | 'expenses'
  | 'sales'
  | 'suggestions'
  | 'chat';

export type Language = 'en' | 'kn' | 'hi' | 'te' | 'ta' | 'ml' | 'mr';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}
