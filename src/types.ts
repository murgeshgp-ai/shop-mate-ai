export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  purchasePrice: number; // Cost price
  sellingPrice: number;  // Retail price
  minStockThreshold: number; // Alert threshold (default 10)
  unit: string; // e.g. 'pack', 'kg', 'bottle', 'box'
  lastRestocked?: string;
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

export type ActiveTab = 'dashboard' | 'inventory' | 'sales' | 'suggestions' | 'chat';

export type Language = 'en' | 'kn' | 'hi' | 'te' | 'ta' | 'ml' | 'mr';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}
