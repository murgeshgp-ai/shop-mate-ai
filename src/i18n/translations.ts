import { Language, LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

export interface Translations {
  // Brand & Global
  appName: string;
  appSubtitle: string;
  storeName: string;
  storeType: string;
  sessionActive: string;
  live: string;
  resetDemoData: string;
  hackathonNote: string;
  language: string;
  selectLanguage: string;

  // Navigation
  navDashboard: string;
  navDashboardDesc: string;
  navChat: string;
  navChatDesc: string;
  navInventory: string;
  navInventoryDesc: string;
  navSales: string;
  navSalesDesc: string;
  navSuggestions: string;
  navSuggestionsDesc: string;
  geminiPowered: string;
  geminiDesc: string;

  // Header Actions
  recordQuickSale: string;
  saleBtnShort: string;
  addProduct: string;
  askGemini: string;

  // Page Titles
  titleDashboard: string;
  subtitleDashboard: string;
  titleInventory: string;
  subtitleInventory: string;
  titleSales: string;
  subtitleSales: string;
  titleSuggestions: string;
  subtitleSuggestions: string;
  titleChat: string;
  subtitleChat: string;

  // Dashboard KPI
  totalSales: string;
  totalProducts: string;
  lowStockProducts: string;
  estimatedProfit: string;
  vsPrevious: string;
  recordedDays: string;
  unitsInInventory: string;
  retailInvValue: string;
  underThreshold: string;
  allHealthy: string;
  outOfStockRightNow: string;
  noDepleted: string;
  grossMargin: string;
  cogs: string;

  // Dashboard Alerts & Chart
  lowStockWarning: string;
  viewAndRestock: string;
  recentSalesProfit: string;
  last7DaysOverview: string;
  revenue: string;
  profit: string;
  fullAnalysis: string;
  avgDailySales: string;
  estDailyProfit: string;
  advisorReady: string;
  aiAdvisorHeading: string;
  aiAdvisorPitch: string;
  openAiChatbot: string;
  lowStockReplenish: string;
  manageAll: string;
  plus10Units: string;
  allHealthyMsg: string;
  topPerforming: string;
  viewRankings: string;
  unitsSold: string;

  // Inventory
  totalCatalogSkus: string;
  unitsOnHand: string;
  lowStockAlerts: string;
  needingRestock: string;
  inventoryCostVal: string;
  investedCapital: string;
  retailSalesVal: string;
  potentialProfit: string;
  searchPlaceholder: string;
  exportCsv: string;
  addNewProduct: string;
  allItems: string;
  lowStockFilter: string;
  healthyFilter: string;
  allCategories: string;
  thProductName: string;
  thCategory: string;
  thQuantity: string;
  thPurchasePrice: string;
  thSellingPrice: string;
  thProfitMargin: string;
  thStockStatus: string;
  thActions: string;
  statusHealthy: string;
  statusLowStock: string;
  statusOutOfStock: string;
  noProductsMatch: string;
  tryClearingSearch: string;
  leftUnits: string;
  marginUnit: string;

  // Categories
  catBeverages: string;
  catDairy: string;
  catBakery: string;
  catPantry: string;
  catSnacks: string;
  catHousehold: string;
  catGeneral: string;

  // Sales
  revenueProfitPerf: string;
  salesSubtitle: string;
  last7Days: string;
  last14Days: string;
  simulateSale: string;
  periodRevenue: string;
  estGrossProfit: string;
  totalOrders: string;
  customersPerDay: string;
  avgBasketSize: string;
  avgRevPerOrder: string;
  chartHeading: string;
  chartSub: string;
  bestSellingHeading: string;
  rankedByRevenue: string;
  salesByCategory: string;
  distributionPct: string;
  categoryInsightTitle: string;
  categoryInsightDesc: string;

  // Suggestions
  geminiRecommendations: string;
  geminiSub: string;
  lastAnalyzed: string;
  runNewAnalysis: string;
  analyzingStore: string;
  priority: string;
  impactLabel: string;
  executionSteps: string;
  copySteps: string;
  copied: string;
  needCustomAdvice: string;
  needCustomDesc: string;
  chatWithAi: string;

  // Chat
  chatHeaderTitle: string;
  chatContextSummary: string;
  clearChat: string;
  quickAsk: string;
  chatInputPlaceholder: string;
  chatFooterNote: string;
  chatThinking: string;
  welcomeMessage: string;
  quickPrompt1: string;
  quickPrompt2: string;
  quickPrompt3: string;
  quickPrompt4: string;
  quickPrompt5: string;

  // Modals
  modalEditTitle: string;
  modalAddTitle: string;
  modalDesc: string;
  labelProductName: string;
  labelCategory: string;
  labelSku: string;
  labelInitialStock: string;
  labelUnit: string;
  labelMinAlert: string;
  labelPurchasePrice: string;
  labelSellingPrice: string;
  unitProfitEst: string;
  grossMarginLabel: string;
  cancel: string;
  saveChanges: string;
  createProduct: string;
  customCategoryPrompt: string;

  // Quick Sale Modal
  quickSaleTitle: string;
  quickSaleDesc: string;
  selectProduct: string;
  currentlyInStock: string;
  unitsSoldLabel: string;
  saleTotal: string;
  costOfGoods: string;
  netProfitGenerated: string;
  confirmSaleBtn: string;

  // Delete Modal
  deleteTitle: string;
  deleteConfirmText: string;
  deleteBtn: string;

  // Toasts
  toastResetSuccess: string;
  toastAdded: string;
  toastUpdated: string;
  toastDeleted: string;
  toastReplenished: string;
  toastSaleRecorded: string;
  toastAiRefreshed: string;
  toastInsufficientStock: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'ShopMate AI',
    appSubtitle: 'Kirana & Small Business OS',
    storeName: 'GreenValley Kirana & Provision #104',
    storeType: 'Retail Kirana & Grocery',
    sessionActive: 'Current Session Active • Ready for billing & stock reorders',
    live: 'Live',
    resetDemoData: 'Reset Demo Sample Data',
    hackathonNote: 'Indian Kirana Edition • Local Storage Enabled',
    language: 'Language',
    selectLanguage: 'Select Language',

    navDashboard: 'Dashboard',
    navDashboardDesc: 'KPIs & Overview',
    navChat: 'AI Assistant',
    navChatDesc: 'Gemini Business Advisor',
    navInventory: 'Inventory',
    navInventoryDesc: 'Products & Stock Levels',
    navSales: 'Sales Analysis',
    navSalesDesc: 'Trends & Profit Charts',
    navSuggestions: 'Smart Suggestions',
    navSuggestionsDesc: 'Gemini Action Plan',
    geminiPowered: 'Powered by Gemini AI',
    geminiDesc: 'Real-time business insights, inventory reorder prompts & automated pricing strategies.',

    recordQuickSale: 'Record Quick Sale',
    saleBtnShort: 'Sale',
    addProduct: 'Add Product',
    askGemini: 'Ask Gemini AI',

    titleDashboard: 'Store Dashboard',
    subtitleDashboard: 'Live sales, inventory health & quick business intelligence',
    titleInventory: 'Inventory Management',
    subtitleInventory: 'Track purchase cost, selling prices, margins, and stock alerts',
    titleSales: 'Sales & Profit Analysis',
    subtitleSales: 'Daily revenue, cost breakdown, margins and top-performing products',
    titleSuggestions: 'Smart Business Suggestions',
    subtitleSuggestions: 'AI-generated recommendations to boost sales, margins, and turnover',
    titleChat: 'AI Business Advisor',
    subtitleChat: 'Chat with Gemini about pricing, stockouts, margins, and cash flow',

    totalSales: 'Total Sales',
    totalProducts: 'Total Products',
    lowStockProducts: 'Low-Stock Products',
    estimatedProfit: 'Estimated Profit',
    vsPrevious: '+14.2% vs previous period',
    recordedDays: 'Across recorded business days',
    unitsInInventory: 'total units in inventory',
    retailInvValue: 'Retail inventory value',
    underThreshold: 'Under safety minimum threshold',
    allHealthy: 'All inventory levels healthy',
    outOfStockRightNow: 'out of stock right now',
    noDepleted: '0 completely depleted items',
    grossMargin: 'gross margin',
    cogs: 'Cost of goods sold',

    lowStockWarning: 'Low-Stock Warning: {count} products require urgent reorder',
    viewAndRestock: 'View & Restock',
    recentSalesProfit: 'Recent Daily Sales & Profit',
    last7DaysOverview: 'Last 7 days performance overview',
    revenue: 'Revenue',
    profit: 'Profit',
    fullAnalysis: 'Full Analysis',
    avgDailySales: 'Average daily sales',
    estDailyProfit: 'Estimated daily profit',
    advisorReady: 'Ready',
    aiAdvisorHeading: 'ShopMate AI Advisor',
    aiAdvisorPitch: 'Have a question about your pricing, reorders, or boosting profits? Ask your AI business assistant:',
    openAiChatbot: 'Open Full AI Chatbot',
    lowStockReplenish: 'Low-Stock Quick Replenishment',
    manageAll: 'Manage All',
    plus10Units: '+10 Units',
    allHealthyMsg: 'Great job! All products have healthy stock.',
    topPerforming: 'Top Performing Products',
    viewRankings: 'View Rankings',
    unitsSold: 'units sold',

    totalCatalogSkus: 'Total Catalog SKUs',
    unitsOnHand: 'units on hand',
    lowStockAlerts: 'Low Stock Alerts',
    needingRestock: 'Items needing restock',
    inventoryCostVal: 'Inventory Cost Value',
    investedCapital: 'Total invested capital',
    retailSalesVal: 'Retail Sales Value',
    potentialProfit: 'potential profit',
    searchPlaceholder: 'Search product name, SKU, or category...',
    exportCsv: 'Export CSV',
    addNewProduct: 'Add New Product',
    allItems: 'All Items',
    lowStockFilter: 'Low Stock',
    healthyFilter: 'Healthy',
    allCategories: 'All Categories',
    thProductName: 'Product Name & SKU',
    thCategory: 'Category',
    thQuantity: 'Quantity',
    thPurchasePrice: 'Purchase Price',
    thSellingPrice: 'Selling Price',
    thProfitMargin: 'Profit Margin',
    thStockStatus: 'Stock Status',
    thActions: 'Actions',
    statusHealthy: 'Healthy',
    statusLowStock: 'Low Stock',
    statusOutOfStock: 'Out of Stock',
    noProductsMatch: 'No products match your criteria',
    tryClearingSearch: 'Try clearing the search or adding a new product.',
    leftUnits: 'left',
    marginUnit: 'margin',

    catBeverages: 'Beverages',
    catDairy: 'Dairy',
    catBakery: 'Bakery',
    catPantry: 'Pantry',
    catSnacks: 'Snacks',
    catHousehold: 'Household',
    catGeneral: 'General',

    revenueProfitPerf: 'Revenue & Profit Performance',
    salesSubtitle: 'Real-time analytics for small shop retail operations',
    last7Days: 'Last 7 Days',
    last14Days: 'Last 14 Days',
    simulateSale: 'Simulate Sale',
    periodRevenue: 'Period Revenue',
    estGrossProfit: 'Estimated Gross Profit',
    totalOrders: 'Total Customer Orders',
    customersPerDay: 'customers / day',
    avgBasketSize: 'Average Basket Size',
    avgRevPerOrder: 'Average revenue per checkout',
    chartHeading: 'Daily Sales & Estimated Profit Chart',
    chartSub: 'Hover over any day to inspect daily breakdown and gross margins',
    bestSellingHeading: 'Best-Selling Products',
    rankedByRevenue: 'Ranked by Revenue',
    salesByCategory: 'Sales by Category',
    distributionPct: 'Distribution %',
    categoryInsightTitle: 'Category Insight:',
    categoryInsightDesc: 'Beverages and Bakery drive strong recurring daily visits. Cross-merchandising snacks near the beverage cooler captures up to 15% more impulse add-ons.',

    geminiRecommendations: 'Gemini AI Business Recommendations',
    geminiSub: 'AI constantly analyzes your stock levels, margins, sales velocity, and low-stock triggers to deliver 3 high-impact strategies tailored for your shop.',
    lastAnalyzed: 'Last analyzed',
    runNewAnalysis: 'Run New AI Analysis',
    analyzingStore: 'Analyzing Store Data...',
    priority: 'Priority',
    impactLabel: 'Impact',
    executionSteps: 'Execution Steps',
    copySteps: 'Copy',
    copied: 'Copied!',
    needCustomAdvice: 'Need specific custom advice?',
    needCustomDesc: 'Open the AI Business Assistant to ask detailed questions regarding local suppliers, seasonal promotions, or custom discounts.',
    chatWithAi: 'Chat with ShopMate AI',

    chatHeaderTitle: 'ShopMate AI Business Advisor',
    chatContextSummary: 'Live context: {products} products • {lowStock} low stock • {sales} sales',
    clearChat: 'Clear Chat',
    quickAsk: 'Quick Ask:',
    chatInputPlaceholder: 'Ask anything about sales, prices, inventory, margins, or promotions...',
    chatFooterNote: 'ShopMate AI has real-time context of your store catalog, quantities, sales and margin numbers.',
    chatThinking: 'ShopMate AI is calculating recommendations...',
    welcomeMessage: `Hello! I'm **ShopMate AI**, your personal retail business and inventory advisor.\n\nI'm connected to your live store data:\n• **Catalog:** {products} products ({units} total units)\n• **Low Stock Alert:** {lowStock} items running low\n• **Total Sales:** {sales} with **{margin}% estimated gross profit margin**\n\nAsk me anything about **pricing strategies**, **inventory reorders**, **boosting daily sales**, or **customer promotions**!`,
    quickPrompt1: 'Which items should I reorder today to avoid stockouts?',
    quickPrompt2: 'How can I improve my store profit margins?',
    quickPrompt3: 'Suggest a promotional bundle for the weekend.',
    quickPrompt4: 'What should I do about slow-moving products?',
    quickPrompt5: 'How much safety stock should I maintain for fast-moving items?',

    modalEditTitle: 'Edit Product Details',
    modalAddTitle: 'Add New Product to Catalog',
    modalDesc: 'Configure prices, initial inventory and safety reorder alerts',
    labelProductName: 'Product Name *',
    labelCategory: 'Category',
    labelSku: 'SKU / Barcode *',
    labelInitialStock: 'Initial Stock',
    labelUnit: 'Package Unit',
    labelMinAlert: 'Min Alert Qty',
    labelPurchasePrice: 'Purchase Price (Cost) ₹',
    labelSellingPrice: 'Selling Price (Retail) ₹',
    unitProfitEst: 'Estimated Unit Profit:',
    grossMarginLabel: 'Gross Margin:',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    createProduct: 'Create Product',
    customCategoryPrompt: '+ Add Custom Category',

    quickSaleTitle: 'Record Customer Sale',
    quickSaleDesc: 'Immediately updates store revenue, profit & inventory stock',
    selectProduct: 'Select Product',
    currentlyInStock: 'Currently in stock:',
    unitsSoldLabel: 'Units Sold',
    saleTotal: 'Sale Total:',
    costOfGoods: 'Cost of Goods:',
    netProfitGenerated: 'Net Profit Generated:',
    confirmSaleBtn: 'Confirm Sale & Update Stats',

    deleteTitle: 'Delete Product?',
    deleteConfirmText: 'Are you sure you want to remove {name} from your catalog? This will remove all inventory records for this item.',
    deleteBtn: 'Delete Product',

    toastResetSuccess: 'Sample dataset restored successfully!',
    toastAdded: 'Added "{name}" to inventory!',
    toastUpdated: 'Updated "{name}" successfully!',
    toastDeleted: 'Removed "{name}" from catalog',
    toastReplenished: 'Replenished +10 units of {name}!',
    toastSaleRecorded: 'Recorded sale of {qty}x {name} (+{profit} profit)!',
    toastAiRefreshed: 'Gemini AI updated 3 business suggestions!',
    toastInsufficientStock: 'Insufficient stock: Only {qty} left',
  },

  kn: {
    appName: 'ಶಾಪ್‌ಮೇಟ್ AI',
    appSubtitle: 'ಭಾರತೀಯ ಕಿರಾಣಿ ಮತ್ತು ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳ ಸಹಾಯಕ',
    storeName: 'ಶ್ರೀ ಗ್ರೀನ್‌ವ್ಯಾಲಿ ಕಿರಾಣಿ ಮತ್ತು ಪ್ರಾವಿಷನ್ #104',
    storeType: 'ದಿನಸಿ ಮತ್ತು ಕಿರಾಣಿ ಅಂಗಡಿ',
    sessionActive: 'ಪ್ರಸ್ತುತ ಸೆಷನ್ ಸಕ್ರಿಯವಾಗಿದೆ • ಬಿಲ್ಲಿಂಗ್ ಮತ್ತು ಸ್ಟಾಕ್ ಮರುಆದೇಶಕ್ಕೆ ಸಿದ್ಧ',
    live: 'ಲೈವ್',
    resetDemoData: 'ಡೆಮೊ ಡೇಟಾ ಮರುಹೊಂದಿಸಿ',
    hackathonNote: 'ಭಾರತೀಯ ಕಿರಾಣಿ ಆವೃತ್ತಿ • ಲೋಕಲ್ ಸ್ಟೋರೇಜ್ ಸಕ್ರಿಯ',
    language: 'ಭಾಷೆ',
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',

    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navDashboardDesc: 'ಮುಖ್ಯ ವಿವರಗಳು ಮತ್ತು ಅವಲೋಕನ',
    navChat: 'AI ಸಹಾಯಕ',
    navChatDesc: 'ಜೆಮಿನಿ ವ್ಯಾಪಾರ ಸಲಹೆಗಾರ',
    navInventory: 'ದಾಸ್ತಾನು ನಿರ್ವಹಣೆ',
    navInventoryDesc: 'ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಸ್ಟಾಕ್ ಮಟ್ಟ',
    navSales: 'ಮಾರಾಟ ವಿಶ್ಲೇಷಣೆ',
    navSalesDesc: 'ಪ್ರವೃತ್ತಿಗಳು ಮತ್ತು ಲಾಭ ಚಾರ್ಟ್',
    navSuggestions: 'ಸ್ಮಾರ್ಟ್ ಸಲಹೆಗಳು',
    navSuggestionsDesc: 'ಜೆಮಿನಿ ಕಾರ್ಯಯೋಜನೆ',
    geminiPowered: 'ಜೆಮಿನಿ AI ಮೂಲಕ ಚಾಲಿತ',
    geminiDesc: 'ನೈಜ-ಸಮಯದ ವ್ಯಾಪಾರ ಒಳನೋಟಗಳು, ಮರುಆದೇಶ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಸ್ವಯಂಚಾಲಿತ ಬೆಲೆ ತಂತ್ರಗಳು.',

    recordQuickSale: 'ತ್ವರಿತ ಮಾರಾಟ ದಾಖಲಿಸಿ',
    saleBtnShort: 'ಮಾರಾಟ',
    addProduct: 'ಉತ್ಪನ್ನ ಸೇರಿಸಿ',
    askGemini: 'ಜೆಮಿನಿ AI ಕೇಳಿ',

    titleDashboard: 'ಅಂಗಡಿಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    subtitleDashboard: 'ಲೈವ್ ಮಾರಾಟ, ಸ್ಟಾಕ್ ಆರೋಗ್ಯ ಮತ್ತು ತ್ವರಿತ ವ್ಯಾಪಾರ ಮಾಹಿತಿ',
    titleInventory: 'ದಾಸ್ತಾನು (ಇನ್ವೆಂಟರಿ) ನಿರ್ವಹಣೆ',
    subtitleInventory: 'ಖರೀದಿ ದರ, ಮಾರಾಟ ಬೆಲೆ, ಲಾಭದ ಮಾರ್ಜಿನ್ ಮತ್ತು ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಗಮನಿಸಿ',
    titleSales: 'ಮಾರಾಟ ಮತ್ತು ಲಾಭದ ವಿಶ್ಲೇಷಣೆ',
    subtitleSales: 'ದೈನಂದಿನ ಆದಾಯ, ವೆಚ್ಚದ ವಿವರ, ಲಾಭಾಂಶ ಮತ್ತು ಹೆಚ್ಚು ಮಾರಾಟವಾಗುವ ಉತ್ಪನ್ನಗಳು',
    titleSuggestions: 'ಸ್ಮಾರ್ಟ್ ವ್ಯಾಪಾರ ಸಲಹೆಗಳು',
    subtitleSuggestions: 'ಮಾರಾಟ ಮತ್ತು ಲಾಭ ಹೆಚ್ಚಿಸಲು AI-ರಚಿತ ಪ್ರಾಯೋಗಿಕ ಶಿಫಾರಸುಗಳು',
    titleChat: 'AI ವ್ಯಾಪಾರ ಸಲಹೆಗಾರ',
    subtitleChat: 'ಬೆಲೆ, ಮರುಆದೇಶ, ಲಾಭ ಮತ್ತು ಹಣದ ಹರಿವಿನ ಬಗ್ಗೆ ಜೆಮಿನಿ ಜೊತೆ ಚರ್ಚಿಸಿ',

    totalSales: 'ಒಟ್ಟು ಮಾರಾಟ',
    totalProducts: 'ಒಟ್ಟು ಉತ್ಪನ್ನಗಳು',
    lowStockProducts: 'ಕಡಿಮೆ ಸ್ಟಾಕ್ ಉತ್ಪನ್ನಗಳು',
    estimatedProfit: 'ಅಂದಾಜು ಲಾಭ',
    vsPrevious: '+14.2% ಹಿಂದಿನ ಅವಧಿಗಿಂತ ಹೆಚ್ಚು',
    recordedDays: 'ದಾಖಲಾದ ವ್ಯಾಪಾರ ದಿನಗಳಲ್ಲಿ',
    unitsInInventory: 'ದಾಸ್ತಾನಿನಲ್ಲಿರುವ ಒಟ್ಟು ಯೂನಿಟ್‌ಗಳು',
    retailInvValue: 'ರೀಟೇಲ್ ದಾಸ್ತಾನು ಮೌಲ್ಯ',
    underThreshold: 'ಸುರಕ್ಷಿತ ಕನಿಷ್ಠ ಮಿತಿಗಿಂತ ಕಡಿಮೆ ಇದೆ',
    allHealthy: 'ಎಲ್ಲಾ ದಾಸ್ತಾನು ಮಟ್ಟ ಸರಿಯಾಗಿದೆ',
    outOfStockRightNow: 'ಸದ್ಯಕ್ಕೆ ಸ್ಟಾಕ್ ಖಾಲಿಯಾಗಿದೆ',
    noDepleted: '0 ಖಾಲಿಯಾದ ಉತ್ಪನ್ನಗಳು',
    grossMargin: 'ಒಟ್ಟು ಲಾಭಾಂಶ (ಗ್ರಾಸ್ ಮಾರ್ಜಿನ್)',
    cogs: 'ಮಾರಾಟವಾದ ಸರಕುಗಳ ವೆಚ್ಚ',

    lowStockWarning: 'ಕಡಿಮೆ ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆ: {count} ಉತ್ಪನ್ನಗಳಿಗೆ ತಕ್ಷಣ ಮರುಆದೇಶ ಬೇಕಾಗಿದೆ',
    viewAndRestock: 'ವೀಕ್ಷಿಸಿ ಮತ್ತು ಸ್ಟಾಕ್ ಭರ್ತಿಮಾಡಿ',
    recentSalesProfit: 'ಇತ್ತೀಚಿನ ದೈನಂದಿನ ಮಾರಾಟ ಮತ್ತು ಲಾಭ',
    last7DaysOverview: 'ಕಳೆದ 7 ದಿನಗಳ ಕಾರ್ಯಕ್ಷಮತೆ',
    revenue: 'ಮಾರಾಟ ಆದಾಯ',
    profit: 'ಲಾಭ',
    fullAnalysis: 'ಸಂಪೂರ್ಣ ವಿಶ್ಲೇಷಣೆ',
    avgDailySales: 'ದೈನಂದಿನ ಸರಾಸರಿ ಮಾರಾಟ',
    estDailyProfit: 'ಅಂದಾಜು ದೈನಂದಿನ ಲಾಭ',
    advisorReady: 'ಸಿದ್ಧವಾಗಿದೆ',
    aiAdvisorHeading: 'ಶಾಪ್‌ಮೇಟ್ AI ಸಲಹೆಗಾರ',
    aiAdvisorPitch: 'ಬೆಲೆ ನಿಗದಿ, ಮರುಆದೇಶ ಅಥವಾ ಲಾಭ ಹೆಚ್ಚಿಸುವ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ? ನಿಮ್ಮ AI ಸಹಾಯಕನನ್ನು ಕೇಳಿ:',
    openAiChatbot: 'ಸಂಪೂರ್ಣ AI ಚಾಟ್‌ಬಾಟ್ ತೆರೆಯಿರಿ',
    lowStockReplenish: 'ಕಡಿಮೆ ಸ್ಟಾಕ್ ತ್ವರಿತ ಭರ್ತಿ',
    manageAll: 'ಎಲ್ಲವನ್ನೂ ನಿರ್ವಹಿಸಿ',
    plus10Units: '+10 ಯೂನಿಟ್‌ಗಳು',
    allHealthyMsg: 'ಉತ್ತಮ! ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳಲ್ಲಿ ಸಾಕಷ್ಟು ಸ್ಟಾಕ್ ಇದೆ.',
    topPerforming: 'ಹೆಚ್ಚು ಮಾರಾಟವಾಗುವ ಉತ್ಪನ್ನಗಳು',
    viewRankings: 'ಶ್ರೇಯಾಂಕಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    unitsSold: 'ಮಾರಾಟವಾದ ಯೂನಿಟ್‌ಗಳು',

    totalCatalogSkus: 'ಒಟ್ಟು ಉತ್ಪನ್ನಗಳು (SKU)',
    unitsOnHand: 'ಕೈಯಲ್ಲಿರುವ ಯೂನಿಟ್‌ಗಳು',
    lowStockAlerts: 'ಕಡಿಮೆ ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆಗಳು',
    needingRestock: 'ಮರುಆದೇಶ ಅಗತ್ಯವಿರುವ ವಸ್ತುಗಳು',
    inventoryCostVal: 'ದಾಸ್ತಾನು ಖರೀದಿ ವೆಚ್ಚ',
    investedCapital: 'ಒಟ್ಟು ಹೂಡಿಕೆ ಬಂಡವಾಳ',
    retailSalesVal: 'ರೀಟೇಲ್ ಮಾರಾಟ ಮೌಲ್ಯ',
    potentialProfit: 'ಸಂಭಾವ್ಯ ಲಾಭ',
    searchPlaceholder: 'ಉತ್ಪನ್ನದ ಹೆಸರು, SKU ಅಥವಾ ವರ್ಗ ಹುಡುಕಿ...',
    exportCsv: 'CSV ಡೌನ್‌ಲೋಡ್',
    addNewProduct: 'ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ',
    allItems: 'ಎಲ್ಲಾ ವಸ್ತುಗಳು',
    lowStockFilter: 'ಕಡಿಮೆ ಸ್ಟಾಕ್',
    healthyFilter: 'ಸಾಕಷ್ಟು ಸ್ಟಾಕ್',
    allCategories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    thProductName: 'ಉತ್ಪನ್ನದ ಹೆಸರು ಮತ್ತು SKU',
    thCategory: 'ವರ್ಗ',
    thQuantity: 'ಪ್ರಮಾಣ (ಸ್ಟಾಕ್)',
    thPurchasePrice: 'ಖರೀದಿ ಬೆಲೆ',
    thSellingPrice: 'ಮಾರಾಟ ಬೆಲೆ',
    thProfitMargin: 'ಲಾಭದ ಮಾರ್ಜಿನ್',
    thStockStatus: 'ಸ್ಟಾಕ್ ಸ್ಥಿತಿ',
    thActions: 'ಕ್ರಿಯೆಗಳು',
    statusHealthy: 'ಸಾಕಷ್ಟಿದೆ',
    statusLowStock: 'ಕಡಿಮೆ ಸ್ಟಾಕ್',
    statusOutOfStock: 'ಸ್ಟಾಕ್ ಖಾಲಿ',
    noProductsMatch: 'ಯಾವುದೇ ಉತ್ಪನ್ನ ಕಂಡುಬಂದಿಲ್ಲ',
    tryClearingSearch: 'ಹುಡುಕಾಟವನ್ನು ತೆರವುಗೊಳಿಸಿ ಅಥವಾ ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ.',
    leftUnits: 'ಉಳಿದಿದೆ',
    marginUnit: 'ಮಾರ್ಜಿನ್',

    catBeverages: 'ಪಾನೀಯಗಳು',
    catDairy: 'ಡೈರಿ & ಹಾಲು',
    catBakery: 'ಬೇಕರಿ',
    catPantry: 'ದಿನಸಿ ವಸ್ತುಗಳು',
    catSnacks: 'ತಿಂಡಿಗಳು',
    catHousehold: 'ಮನೆಬಳಕೆ',
    catGeneral: 'ಸಾಮಾನ್ಯ',

    revenueProfitPerf: 'ಆದಾಯ ಮತ್ತು ಲಾಭದ ಕಾರ್ಯಕ್ಷಮತೆ',
    salesSubtitle: 'ಸಣ್ಣ ಅಂಗಡಿ ಚಿಲ್ಲರೆ ವ್ಯಾಪಾರಕ್ಕಾಗಿ ನೈಜ-ಸಮಯದ ವಿಶ್ಲೇಷಣೆ',
    last7Days: 'ಕಳೆದ 7 ದಿನಗಳು',
    last14Days: 'ಕಳೆದ 14 ದಿನಗಳು',
    simulateSale: 'ಮಾರಾಟ ಸಿಮ್ಯುಲೇಶನ್',
    periodRevenue: 'ಈ ಅವಧಿಯ ಆದಾಯ',
    estGrossProfit: 'ಅಂದಾಜು ಒಟ್ಟು ಲಾಭ',
    totalOrders: 'ಒಟ್ಟು ಗ್ರಾಹಕರ ಆರ್ಡರ್‌ಗಳು',
    customersPerDay: 'ಗ್ರಾಹಕರು / ದಿನ',
    avgBasketSize: 'ಸರಾಸರಿ ಬಿಲ್ ಮೌಲ್ಯ',
    avgRevPerOrder: 'ಪ್ರತಿ ಚೆಕ್‌ಔಟ್‌ಗೆ ಸರಾಸರಿ ಆದಾಯ',
    chartHeading: 'ದೈನಂದಿನ ಮಾರಾಟ ಮತ್ತು ಲಾಭದ ಚಾರ್ಟ್',
    chartSub: 'ದೈನಂದಿನ ವಿವರ ಮತ್ತು ಮಾರ್ಜಿನ್ ನೋಡಲು ಯಾವುದೇ ದಿನದ ಮೇಲೆ ಕರ್ಸರ್ ಇರಿಸಿ',
    bestSellingHeading: 'ಅತಿ ಹೆಚ್ಚು ಮಾರಾಟವಾದ ಉತ್ಪನ್ನಗಳು',
    rankedByRevenue: 'ಗಳಿಸಿದ ಆದಾಯದ ಆಧಾರದ ಮೇಲೆ',
    salesByCategory: 'ವರ್ಗವಾರು ಮಾರಾಟ',
    distributionPct: 'ಪಾಲು %',
    categoryInsightTitle: 'ವರ್ಗ ಒಳನೋಟ:',
    categoryInsightDesc: 'ಪಾನೀಯಗಳು ಮತ್ತು ಬೇಕರಿ ಉತ್ಪನ್ನಗಳು ನಿಯಮಿತ ದಿನನಿತ್ಯದ ಗ್ರಾಹಕರನ್ನು ತರುತ್ತವೆ. ಪಾನೀಯಗಳ ಬಳಿ ತಿಂಡಿಗಳನ್ನು ಇರಿಸಿದರೆ ಮಾರಾಟ 15% ರಷ್ಟು ಹೆಚ್ಚಾಗುತ್ತದೆ.',

    geminiRecommendations: 'ಜೆಮಿನಿ AI ವ್ಯಾಪಾರ ಸಲಹೆಗಳು',
    geminiSub: 'ನಿಮ್ಮ ಅಂಗಡಿಗೆ ಸೂಕ್ತವಾದ 3 ಪ್ರಮುಖ ಲಾಭ ತಂತ್ರಗಳನ್ನು ನೀಡಲು AI ನಿಮ್ಮ ಸ್ಟಾಕ್, ಮಾರ್ಜಿನ್ ಮತ್ತು ಮಾರಾಟ ವೇಗವನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ.',
    lastAnalyzed: 'ಕೊನೆಯ ವಿಶ್ಲೇಷಣೆ',
    runNewAnalysis: 'ಹೊಸ AI ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ',
    analyzingStore: 'ಅಂಗಡಿಯ ಡೇಟಾ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    priority: 'ಆದ್ಯತೆ',
    impactLabel: 'ನಿರೀಕ್ಷಿತ ಲಾಭ / ಪರಿಣಾಮ',
    executionSteps: 'ಅನುಷ್ಠಾನದ ಹಂತಗಳು',
    copySteps: 'ಕಾಪಿ',
    copied: 'ಕಾಪಿಯಾಗಿದೆ!',
    needCustomAdvice: 'ನಿರ್ದಿಷ್ಟ ಕಸ್ಟಮ್ ಸಲಹೆ ಬೇಕೇ?',
    needCustomDesc: 'ಸ್ಥಳೀಯ ಸರಬರಾಜುದಾರರು, ಕಾಲೋಚಿತ ಆಫರ್‌ಗಳು ಅಥವಾ ವಿಶೇಷ ರಿಯಾಯಿತಿಗಳ ಬಗ್ಗೆ ವಿವರವಾಗಿ ಕೇಳಲು AI ಸಹಾಯಕನನ್ನು ಬಳಸಿ.',
    chatWithAi: 'ಶಾಪ್‌ಮೇಟ್ AI ಜೊತೆ ಚಾಟ್ ಮಾಡಿ',

    chatHeaderTitle: 'ಶಾಪ್‌ಮೇಟ್ AI ವ್ಯಾಪಾರ ಸಲಹೆಗಾರ',
    chatContextSummary: 'ಲೈವ್ ಡೇಟಾ: {products} ಉತ್ಪನ್ನಗಳು • {lowStock} ಕಡಿಮೆ ಸ್ಟಾಕ್ • {sales} ಒಟ್ಟು ಮಾರಾಟ',
    clearChat: 'ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ',
    quickAsk: 'ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು:',
    chatInputPlaceholder: 'ಮಾರಾಟ, ಬೆಲೆ, ಸ್ಟಾಕ್, ಲಾಭ ಅಥವಾ ಆಫರ್‌ಗಳ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲೂ ಕೇಳಿ...',
    chatFooterNote: 'ಶಾಪ್‌ಮೇಟ್ AI ನಿಮ್ಮ ಅಂಗಡಿಯ ಲೈವ್ ಸ್ಟಾಕ್, ದರ ಮತ್ತು ಲಾಭದ ಅಂಕಿಅಂಶಗಳನ್ನು ತಿಳಿದಿದೆ.',
    chatThinking: 'ಶಾಪ್‌ಮೇಟ್ AI ಶಿಫಾರಸುಗಳನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತಿದೆ...',
    welcomeMessage: `ನಮಸ್ಕಾರ! ನಾನು **ಶಾಪ್‌ಮೇಟ್ AI**, ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ರೀಟೇಲ್ ವ್ಯಾಪಾರ ಮತ್ತು ಇನ್ವೆಂಟರಿ ಸಲಹೆಗಾರ.\n\nನಾನು ನಿಮ್ಮ ಅಂಗಡಿಯ ಲೈವ್ ಡೇಟಾಗೆ ಸಂಪರ್ಕ ಹೊಂದಿದ್ದೇನೆ:\n• **ಉತ್ಪನ್ನಗಳು:** {products} ಐಟಂಗಳು (ಒಟ್ಟು {units} ಯೂನಿಟ್‌ಗಳು)\n• **ಕಡಿಮೆ ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆ:** {lowStock} ವಸ್ತುಗಳು ಖಾಲಿಯಾಗುವ ಹಂತದಲ್ಲಿವೆ\n• **ಒಟ್ಟು ಮಾರಾಟ:** {sales} (**{margin}% ಅಂದಾಜು ಒಟ್ಟು ಲಾಭಾಂಶ**)\n\nನೀವು ಕನ್ನಡದಲ್ಲೂ ನೇರವಾಗಿ **ಬೆಲೆ ನಿಗದಿ**, **ಸ್ಟಾಕ್ ಮರುಆದೇಶ**, **ದೈನಂದಿನ ಮಾರಾಟ ಹೆಚ್ಚಳ**, ಅಥವಾ **ಆಫರ್‌ಗಳ** ಬಗ್ಗೆ ಕೇಳಬಹುದು!`,
    quickPrompt1: 'ಸ್ಟಾಕ್ ಖಾಲಿಯಾಗದಂತೆ ನಾನು ಇಂದು ಯಾವ ವಸ್ತುಗಳನ್ನು ಆರ್ಡರ್ ಮಾಡಬೇಕು?',
    quickPrompt2: 'ನನ್ನ ಅಂಗಡಿಯ ಒಟ್ಟು ಲಾಭದ ಮಾರ್ಜಿನ್ ಅನ್ನು ಹೇಗೆ ಹೆಚ್ಚಿಸಬಹುದು?',
    quickPrompt3: 'ಈ ವಾರಾಂತ್ಯಕ್ಕೆ ಉತ್ತಮ ಲಾಭದಾಯಕ ಆಫರ್ ಕಾಂಬೊ ಸೂಚಿಸಿ.',
    quickPrompt4: 'ನಿಧಾನವಾಗಿ ಮಾರಾಟವಾಗುವ ಉತ್ಪನ್ನಗಳನ್ನು ಏನು ಮಾಡಬೇಕು?',
    quickPrompt5: 'ವೇಗವಾಗಿ ಮಾರಾಟವಾಗುವ ವಸ್ತುಗಳಿಗೆ ಎಷ್ಟು ಸುರಕ್ಷಿತ ಸ್ಟಾಕ್ ಇಟ್ಟುಕೊಳ್ಳಬೇಕು?',

    modalEditTitle: 'ಉತ್ಪನ್ನದ ವಿವರ ತಿದ್ದುಪಡಿ',
    modalAddTitle: 'ಕ್ಯಾಟಲಾಗ್‌ಗೆ ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ',
    modalDesc: 'ಬೆಲೆ, ಆರಂಭಿಕ ದಾಸ್ತಾನು ಮತ್ತು ಮರುಆದೇಶ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಹೊಂದಿಸಿ',
    labelProductName: 'ಉತ್ಪನ್ನದ ಹೆಸರು *',
    labelCategory: 'ವರ್ಗ',
    labelSku: 'SKU / ಬಾರ್‌ಕೋಡ್ *',
    labelInitialStock: 'ಆರಂಭಿಕ ಸ್ಟಾಕ್ ಪ್ರಮಾಣ',
    labelUnit: 'ಪ್ಯಾಕಿಂಗ್ ಯೂನಿಟ್',
    labelMinAlert: 'ಕನಿಷ್ಠ ಎಚ್ಚರಿಕೆ ಪ್ರಮಾಣ',
    labelPurchasePrice: 'ಖರೀದಿ ಬೆಲೆ (ವೆಚ್ಚ) ₹',
    labelSellingPrice: 'ಮಾರಾಟ ಬೆಲೆ (ರೀಟೇಲ್) ₹',
    unitProfitEst: 'ಅಂದಾಜು ಯೂನಿಟ್ ಲಾಭ:',
    grossMarginLabel: 'ಲಾಭಾಂಶ (ಮಾರ್ಜಿನ್):',
    cancel: 'ರದ್ದುಮಾಡಿ',
    saveChanges: 'ಬದಲಾವಣೆ ಉಳಿಸಿ',
    createProduct: 'ಉತ್ಪನ್ನ ರಚಿಸಿ',
    customCategoryPrompt: '+ ಹೊಸ ವರ್ಗ ಸೇರಿಸಿ',

    quickSaleTitle: 'ಗ್ರಾಹಕರ ಮಾರಾಟ ದಾಖಲಿಸಿ',
    quickSaleDesc: 'ಆದಾಯ, ಲಾಭ ಮತ್ತು ಇನ್ವೆಂಟರಿ ಸ್ಟಾಕ್ ಅನ್ನು ತಕ್ಷಣವೇ ನವೀಕರಿಸುತ್ತದೆ',
    selectProduct: 'ಉತ್ಪನ್ನ ಆಯ್ಕೆಮಾಡಿ',
    currentlyInStock: 'ಪ್ರಸ್ತುತ ದಾಸ್ತಾನು:',
    unitsSoldLabel: 'ಮಾರಾಟವಾದ ಯೂನಿಟ್‌ಗಳು',
    saleTotal: 'ಒಟ್ಟು ಮಾರಾಟ ಮೌಲ್ಯ:',
    costOfGoods: 'ಖರೀದಿ ವೆಚ್ಚ:',
    netProfitGenerated: 'ಗಳಿಸಿದ ನಿವ್ವಳ ಲಾಭ:',
    confirmSaleBtn: 'ಮಾರಾಟ ಖಚಿತಪಡಿಸಿ ಮತ್ತು ಅಂಕಿಅಂಶ ನವೀಕರಿಸಿ',

    deleteTitle: 'ಉತ್ಪನ್ನ ಅಳಿಸಬೇಕೇ?',
    deleteConfirmText: 'ನಿಮ್ಮ ಕ್ಯಾಟಲಾಗ್‌ನಿಂದ {name} ಅನ್ನು ತೆಗೆದುಹಾಕಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಇದರಿಂದ ಈ ವಸ್ತುವಿನ ಎಲ್ಲಾ ದಾಖಲೆಗಳು ಅಳಿಸಲ್ಪಡುತ್ತವೆ.',
    deleteBtn: 'ಉತ್ಪನ್ನ ಅಳಿಸಿ',

    toastResetSuccess: 'ಮಾದರಿ ಡೇಟಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ!',
    toastAdded: '"{name}" ಅನ್ನು ದಾಸ್ತಾನಿಗೆ ಸೇರಿಸಲಾಗಿದೆ!',
    toastUpdated: '"{name}" ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!',
    toastDeleted: 'ಕ್ಯಾಟಲಾಗ್‌ನಿಂದ "{name}" ತೆಗೆದುಹಾಕಲಾಗಿದೆ',
    toastReplenished: '{name} ಗೆ +10 ಯೂನಿಟ್‌ಗಳನ್ನು ಮರುಪೂರಣ ಮಾಡಲಾಗಿದೆ!',
    toastSaleRecorded: '{qty}x {name} ಮಾರಾಟ ದಾಖಲಾಗಿದೆ (+{profit} ಲಾಭ)!',
    toastAiRefreshed: 'ಜೆಮಿನಿ AI 3 ವ್ಯಾಪಾರ ಸಲಹೆಗಳನ್ನು ನವೀಕರಿಸಿದೆ!',
    toastInsufficientStock: 'ಸಾಕಷ್ಟು ಸ್ಟಾಕ್ ಇಲ್ಲ: ಕೇವಲ {qty} ಉಳಿದಿದೆ',
  },

  hi: {
    appName: 'शॉपमेट',
    appSubtitle: 'छोटे व्यापारियों का डिजिटल साथी',
    storeName: 'ग्रीनवैली मार्ट #104',
    storeType: 'किराना दुकान',
    sessionActive: 'सत्र सक्रिय है • बिलिंग और रीऑर्डर के लिए तैयार',
    live: 'लाइव',
    resetDemoData: 'डेमो डेटा रीसेट करें',
    hackathonNote: 'हैकाथॉन प्रोटोटाइप • लोकल स्टोरेज सक्षम',
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',

    navDashboard: 'डैशबोर्ड',
    navDashboardDesc: 'मुख्य विवरण और अवलोकन',
    navChat: 'AI सहायक',
    navChatDesc: 'जेमिनी बिजनेस सलाहकार',
    navInventory: 'इन्वेंटरी प्रबंधन',
    navInventoryDesc: 'उत्पाद और स्टॉक स्तर',
    navSales: 'बिक्री विश्लेषण',
    navSalesDesc: 'ट्रेंड्स और मुनाफा चार्ट',
    navSuggestions: 'स्मार्ट सुझाव',
    navSuggestionsDesc: 'जेमिनी कार्य योजना',
    geminiPowered: 'जेमिनी AI द्वारा संचालित',
    geminiDesc: 'रीयल-टाइम बिजनेस इनसाइट्स, रीऑर्डर अलर्ट और स्वचालित मूल्य निर्धारण रणनीति।',

    recordQuickSale: 'त्वरित बिक्री दर्ज करें',
    saleBtnShort: 'बिक्री',
    addProduct: 'उत्पाद जोड़ें',
    askGemini: 'जेमिनी AI से पूछें',

    titleDashboard: 'दुकान का डैशबोर्ड',
    subtitleDashboard: 'लाइव बिक्री, स्टॉक की स्थिति और त्वरित व्यावसायिक जानकारी',
    titleInventory: 'इन्वेंटरी (स्टॉक) प्रबंधन',
    subtitleInventory: 'खरीद लागत, बिक्री मूल्य, मार्जिन और स्टॉक अलर्ट ट्रैक करें',
    titleSales: 'बिक्री और मुनाफा विश्लेषण',
    subtitleSales: 'दैनिक आय, लागत विवरण, मार्जिन और सबसे ज्यादा बिकने वाले उत्पाद',
    titleSuggestions: 'स्मार्ट बिजनेस सुझाव',
    subtitleSuggestions: 'बिक्री और मुनाफा बढ़ाने के लिए AI-जनित व्यावहारिक सिफारिशें',
    titleChat: 'AI बिजनेस सलाहकार',
    subtitleChat: 'मूल्य निर्धारण, स्टॉकआउट, मार्जिन और कैश फ्लो पर जेमिनी से बात करें',

    totalSales: 'कुल बिक्री',
    totalProducts: 'कुल उत्पाद',
    lowStockProducts: 'कम स्टॉक वाले उत्पाद',
    estimatedProfit: 'अनुमानित मुनाफा',
    vsPrevious: '+14.2% पिछली अवधि की तुलना में',
    recordedDays: 'रिकॉर्ड किए गए दिनों में',
    unitsInInventory: 'इन्वेंटरी में कुल इकाइयाँ',
    retailInvValue: 'रिटेल इन्वेंटरी मूल्य',
    underThreshold: 'न्यूनतम सुरक्षा सीमा से कम',
    allHealthy: 'सभी स्टॉक स्तर सामान्य हैं',
    outOfStockRightNow: 'वर्तमान में स्टॉक समाप्त',
    noDepleted: '0 समाप्त उत्पाद',
    grossMargin: 'सकल मार्जिन',
    cogs: 'बेचे गए माल की लागत',

    lowStockWarning: 'कम स्टॉक चेतावनी: {count} उत्पादों को तुरंत रीऑर्डर करने की आवश्यकता है',
    viewAndRestock: 'देखें और स्टॉक भरें',
    recentSalesProfit: 'हाल की दैनिक बिक्री और मुनाफा',
    last7DaysOverview: 'पिछले 7 दिनों का प्रदर्शन',
    revenue: 'आय',
    profit: 'मुनाफा',
    fullAnalysis: 'संपूर्ण विश्लेषण',
    avgDailySales: 'औसत दैनिक बिक्री',
    estDailyProfit: 'अनुमानित दैनिक मुनाफा',
    advisorReady: 'तैयार',
    aiAdvisorHeading: 'शॉपमेट AI सलाहकार',
    aiAdvisorPitch: 'मूल्य निर्धारण, रीऑर्डर या मुनाफा बढ़ाने के बारे में कोई सवाल है? अपने AI सहायक से पूछें:',
    openAiChatbot: 'संपूर्ण AI चैटबॉट खोलें',
    lowStockReplenish: 'कम स्टॉक त्वरित रीफिल',
    manageAll: 'सभी प्रबंधित करें',
    plus10Units: '+10 इकाइयाँ',
    allHealthyMsg: 'बहुत बढ़िया! सभी उत्पादों में पर्याप्त स्टॉक है।',
    topPerforming: 'शीर्ष बिकने वाले उत्पाद',
    viewRankings: 'रैंकिंग देखें',
    unitsSold: 'इकाइयाँ बिकीं',

    totalCatalogSkus: 'कुल उत्पाद (SKU)',
    unitsOnHand: 'उपलब्ध इकाइयाँ',
    lowStockAlerts: 'कम स्टॉक अलर्ट',
    needingRestock: 'रीऑर्डर की जरूरत वाली वस्तुएं',
    inventoryCostVal: 'इन्वेंटरी खरीद लागत',
    investedCapital: 'कुल निवेशित पूंजी',
    retailSalesVal: 'रिटेल बिक्री मूल्य',
    potentialProfit: 'संभावित मुनाफा',
    searchPlaceholder: 'उत्पाद का नाम, SKU या श्रेणी खोजें...',
    exportCsv: 'CSV डाउनलोड करें',
    addNewProduct: 'नया उत्पाद जोड़ें',
    allItems: 'सभी सामान',
    lowStockFilter: 'कम स्टॉक',
    healthyFilter: 'पर्याप्त स्टॉक',
    allCategories: 'सभी श्रेणियां',
    thProductName: 'उत्पाद का नाम और SKU',
    thCategory: 'श्रेणी',
    thQuantity: 'मात्रा',
    thPurchasePrice: 'खरीद मूल्य',
    thSellingPrice: 'बिक्री मूल्य',
    thProfitMargin: 'मुनाफा मार्जिन',
    thStockStatus: 'स्टॉक स्थिति',
    thActions: 'कार्रवाई',
    statusHealthy: 'पर्याप्त',
    statusLowStock: 'कम स्टॉक',
    statusOutOfStock: 'स्टॉक समाप्त',
    noProductsMatch: 'कोई उत्पाद नहीं मिला',
    tryClearingSearch: 'खोज साफ़ करें या नया उत्पाद जोड़ें।',
    leftUnits: 'बचे हैं',
    marginUnit: 'मार्जिन',

    catBeverages: 'पेय पदार्थ',
    catDairy: 'डेयरी व दूध',
    catBakery: 'बेकरी',
    catPantry: 'किराना सामान',
    catSnacks: 'नाश्ता व स्नैक्स',
    catHousehold: 'घरेलू सामान',
    catGeneral: 'सामान्य',

    revenueProfitPerf: 'राजस्व और मुनाफे का प्रदर्शन',
    salesSubtitle: 'छोटे खुदरा व्यापारियों के लिए रीयल-टाइम एनालिटिक्स',
    last7Days: 'पिछले 7 दिन',
    last14Days: 'पिछले 14 दिन',
    simulateSale: 'बिक्री सिमुलेशन',
    periodRevenue: 'अवधि की कुल आय',
    estGrossProfit: 'अनुमानित सकल मुनाफा',
    totalOrders: 'कुल ग्राहक ऑर्डर',
    customersPerDay: 'ग्राहक / दिन',
    avgBasketSize: 'औसत बिल राशि',
    avgRevPerOrder: 'प्रति चेकआउट औसत आय',
    chartHeading: 'दैनिक बिक्री और मुनाफा चार्ट',
    chartSub: 'दैनिक विवरण और मार्जिन देखने के लिए किसी भी दिन पर कर्सर ले जाएं',
    bestSellingHeading: 'सबसे ज्यादा बिकने वाले उत्पाद',
    rankedByRevenue: 'कमाई के आधार पर रैंक',
    salesByCategory: 'श्रेणी अनुसार बिक्री',
    distributionPct: 'हिस्सा %',
    categoryInsightTitle: 'श्रेणी इनसाइट:',
    categoryInsightDesc: 'पेय पदार्थ और बेकरी सामान नियमित ग्राहकों को लाते हैं। पेय पदार्थों के पास स्नैक्स रखने से बिक्री में 15% की वृद्धि होती है।',

    geminiRecommendations: 'जेमिनी AI बिजनेस सिफारिशें',
    geminiSub: 'आपकी दुकान के लिए सर्वोत्तम 3 रणनीति तैयार करने के लिए AI आपके स्टॉक, मार्जिन और बिक्री की गति का विश्लेषण करता है।',
    lastAnalyzed: 'अंतिम विश्लेषण',
    runNewAnalysis: 'नया AI विश्लेषण चलाएं',
    analyzingStore: 'दुकान के डेटा का विश्लेषण हो रहा है...',
    priority: 'प्राथमिकता',
    impactLabel: 'अपेक्षित प्रभाव',
    executionSteps: 'कार्यान्वयन के चरण',
    copySteps: 'कॉपी करें',
    copied: 'कॉपी हो गया!',
    needCustomAdvice: 'कस्टम सलाह चाहिए?',
    needCustomDesc: 'स्थानीय सप्लायर्स, मौसमी ऑफर्स या विशेष छूट के बारे में पूछने के लिए AI बिजनेस सहायक का उपयोग करें।',
    chatWithAi: 'शॉपमेट AI से चैट करें',

    chatHeaderTitle: 'शॉपमेट AI बिजनेस सलाहकार',
    chatContextSummary: 'लाइव डेटा: {products} उत्पाद • {lowStock} कम स्टॉक • {sales} कुल बिक्री',
    clearChat: 'चैट साफ़ करें',
    quickAsk: 'त्वरित प्रश्न:',
    chatInputPlaceholder: 'बिक्री, मूल्य, स्टॉक, मार्जिन या ऑफर्स के बारे में हिंदी में भी पूछें...',
    chatFooterNote: 'शॉपमेट AI आपकी दुकान के वर्तमान स्टॉक, कीमतों और मुनाफे के आंकड़ों को समझता है।',
    chatThinking: 'शॉपमेट AI सिफारिशों की गणना कर रहा है...',
    welcomeMessage: `नमस्ते! मैं **शॉपमेट AI** हूँ, आपका व्यक्तिगत खुदरा व्यापार और इन्वेंटरी सलाहकार।\n\nमैं आपकी दुकान के लाइव डेटा से जुड़ा हूँ:\n• **कैटलॉग:** {products} उत्पाद (कुल {units} इकाइयाँ)\n• **कम स्टॉक चेतावनी:** {lowStock} वस्तुएं खत्म होने वाली हैं\n• **कुल बिक्री:** {sales} (**{margin}% अनुमानित सकल मुनाफा मार्जिन**)\n\nआप मुझसे सीधे **मूल्य निर्धारण**, **स्टॉक रीऑर्डर**, **बिक्री बढ़ाने**, या **ग्राहकों के ऑफर्स** के बारे में पूछ सकते हैं!`,
    quickPrompt1: 'स्टॉक खत्म होने से बचने के लिए मुझे आज कौन से सामान ऑर्डर करने चाहिए?',
    quickPrompt2: 'मैं अपनी दुकान का मुनाफा मार्जिन कैसे बढ़ा सकता हूँ?',
    quickPrompt3: 'सप्ताहांत के लिए एक अच्छा प्रमोशनल कॉम्बो सुझाएं।',
    quickPrompt4: 'धीमी गति से बिकने वाले सामान के साथ क्या करना चाहिए?',
    quickPrompt5: 'तेजी से बिकने वाले सामान के लिए कितना सेफ्टी स्टॉक रखना चाहिए?',

    modalEditTitle: 'उत्पाद विवरण संपादित करें',
    modalAddTitle: 'कैटलॉग में नया उत्पाद जोड़ें',
    modalDesc: 'मूल्य, प्रारंभिक स्टॉक और रीऑर्डर अलर्ट सेट करें',
    labelProductName: 'उत्पाद का नाम *',
    labelCategory: 'श्रेणी',
    labelSku: 'SKU / बारकोड *',
    labelInitialStock: 'प्रारंभिक स्टॉक मात्रा',
    labelUnit: 'पैकेजिंग इकाई',
    labelMinAlert: 'न्यूनतम अलर्ट मात्रा',
    labelPurchasePrice: 'खरीद मूल्य (लागत) ₹',
    labelSellingPrice: 'बिक्री मूल्य (रिटेल) ₹',
    unitProfitEst: 'अनुमानित प्रति इकाई मुनाफा:',
    grossMarginLabel: 'सकल मार्जिन:',
    cancel: 'रद्द करें',
    saveChanges: 'बदलाव सहेजें',
    createProduct: 'उत्पाद बनाएं',
    customCategoryPrompt: '+ नई श्रेणी जोड़ें',

    quickSaleTitle: 'ग्राहक बिक्री दर्ज करें',
    quickSaleDesc: 'दुकान की आय, मुनाफा और स्टॉक तुरंत अपडेट हो जाता है',
    selectProduct: 'उत्पाद चुनें',
    currentlyInStock: 'वर्तमान स्टॉक:',
    unitsSoldLabel: 'बेची गई इकाइयाँ',
    saleTotal: 'कुल बिक्री:',
    costOfGoods: 'माल की लागत:',
    netProfitGenerated: 'शुद्ध मुनाफा:',
    confirmSaleBtn: 'बिक्री की पुष्टि करें और आंकड़े अपडेट करें',

    deleteTitle: 'उत्पाद हटाएं?',
    deleteConfirmText: 'क्या आप वाकई अपने कैटलॉग से {name} को हटाना चाहते हैं? इससे इस वस्तु का सारा रिकॉर्ड हट जाएगा।',
    deleteBtn: 'उत्पाद हटाएं',

    toastResetSuccess: 'नमूना डेटा सफलतापूर्वक पुनर्स्थापित किया गया!',
    toastAdded: '"{name}" को इन्वेंटरी में जोड़ा गया!',
    toastUpdated: '"{name}" को सफलतापूर्वक अपडेट किया गया!',
    toastDeleted: 'कैटलॉग से "{name}" को हटा दिया गया',
    toastReplenished: '{name} की +10 इकाइयाँ जोड़ी गईं!',
    toastSaleRecorded: '{qty}x {name} की बिक्री दर्ज हुई (+{profit} मुनाफा)!',
    toastAiRefreshed: 'जेमिनी AI ने 3 बिजनेस सुझाव अपडेट किए!',
    toastInsufficientStock: 'अपर्याप्त स्टॉक: केवल {qty} शेष है',
  },

  te: {
    appName: 'షాప్‌మేట్',
    appSubtitle: 'చిన్న వ్యాపారుల డిజిటల్ సహాయకుడు',
    storeName: 'గ్రీన్‌వ్యాలీ మార్ట్ #104',
    storeType: 'కిరాణా దుకాణం',
    sessionActive: 'ప్రస్తుత సెషన్ సక్రియంగా ఉంది • బిల్లింగ్ & రీఆర్డర్‌కు సిద్ధం',
    live: 'లైవ్',
    resetDemoData: 'డెమో డేటాను రీసెట్ చేయండి',
    hackathonNote: 'హ్యాకథాన్ ప్రోటోటైప్ • లోకల్ స్టోరేజ్ ఎనేబుల్ చేయబడింది',
    language: 'భాష',
    selectLanguage: 'భాషను ఎంచుకోండి',

    navDashboard: 'డ్యాష్‌బోర్డ్',
    navDashboardDesc: 'ముఖ్య వివరాలు & అవలోకనం',
    navChat: 'AI సహాయకుడు',
    navChatDesc: 'జెమిని వ్యాపార సలహాదారు',
    navInventory: 'ఇన్వెంటరీ నిర్వహణ',
    navInventoryDesc: 'ఉత్పత్తులు & స్టాక్ స్థాయిలు',
    navSales: 'అమ్మకాల విశ్లేషణ',
    navSalesDesc: 'ట్రెండ్‌లు & లాభాల చార్ట్',
    navSuggestions: 'స్మార్ట్ సూచనలు',
    navSuggestionsDesc: 'జెమిని కార్యాచరణ ప్రణాళిక',
    geminiPowered: 'జెమిని AI ఆధారితం',
    geminiDesc: 'రియల్-టైమ్ వ్యాపార అంతర్దృష్టులు, రీఆర్డర్ హెచ్చరికలు & ఆటోమేటెడ్ ధర వ్యూహాలు.',

    recordQuickSale: 'త్వరిత అమ్మకం నమోదు చేయండి',
    saleBtnShort: 'అమ్మకం',
    addProduct: 'ఉత్పత్తిని జోడించండి',
    askGemini: 'జెమిని AIని అడగండి',

    titleDashboard: 'దుకాణ డ్యాష్‌బోర్డ్',
    subtitleDashboard: 'లైవ్ అమ్మకాలు, స్టాక్ ఆరోగ్యం & శీఘ్ర వ్యాపార సమాచారం',
    titleInventory: 'ఇన్వెంటరీ (స్టాక్) నిర్వహణ',
    subtitleInventory: 'కొనుగోలు ధర, అమ్మకపు ధర, మార్జిన్లు & స్టాక్ హెచ్చరికలను ట్రాక్ చేయండి',
    titleSales: 'అమ్మకాలు & లాభాల విశ్లేషణ',
    subtitleSales: 'రోజువారీ ఆదాయం, ఖర్చుల వివరాలు, మార్జిన్లు & అత్యధికంగా అమ్ముడైన ఉత్పత్తులు',
    titleSuggestions: 'స్మార్ట్ వ్యాపార సూచనలు',
    subtitleSuggestions: 'అమ్మకాలు & లాభాలను పెంచడానికి AI-సృష్టించిన ఆచరణాత్మక సిఫార్సులు',
    titleChat: 'AI వ్యాపార సలహాదారు',
    subtitleChat: 'ధరలు, స్టాక్‌అవుట్‌లు, మార్జిన్లు & నగదు ప్రవాహం గురించి జెమినితో మాట్లాడండి',

    totalSales: 'మొత్తం అమ్మకాలు',
    totalProducts: 'మొత్తం ఉత్పత్తులు',
    lowStockProducts: 'తక్కువ స్టాక్ ఉత్పత్తులు',
    estimatedProfit: 'అంచనా లాభం',
    vsPrevious: '+14.2% మునుపటి కాలం కంటే ఎక్కువ',
    recordedDays: 'నమోదైన వ్యాపార దినాలలో',
    unitsInInventory: 'మొత్తం ఇన్వెంటరీ యూనిట్లు',
    retailInvValue: 'రిటైల్ ఇన్వెంటరీ విలువ',
    underThreshold: 'కనిష్ట భద్రతా పరిమితి కంటే తక్కువ',
    allHealthy: 'అన్ని స్టాక్ స్థాయిలు సరిగ్గా ఉన్నాయి',
    outOfStockRightNow: 'ప్రస్తుతం స్టాక్ అయిపోయింది',
    noDepleted: '0 ముగిసిన ఉత్పత్తులు',
    grossMargin: 'స్థూల మార్జిన్ (గ్రాస్ మార్జిన్)',
    cogs: 'అమ్మిన వస్తువుల కొనుగోలు ఖర్చు',

    lowStockWarning: 'తక్కువ స్టాక్ హెచ్చరిక: {count} ఉత్పత్తులకు తక్షణ రీఆర్డర్ అవసరం',
    viewAndRestock: 'చూడండి & స్టాక్ నింపండి',
    recentSalesProfit: 'ఇటీవలి రోజువారీ అమ్మకాలు & లాభం',
    last7DaysOverview: 'గత 7 రోజుల పనితీరు',
    revenue: 'ఆదాయం',
    profit: 'లాభం',
    fullAnalysis: 'పూర్తి విశ్లేషణ',
    avgDailySales: 'సగటు రోజువారీ అమ్మకాలు',
    estDailyProfit: 'అంచనా రోజువారీ లాభం',
    advisorReady: 'సిద్ధంగా ఉంది',
    aiAdvisorHeading: 'షాప్‌మేట్ AI సలహాదారు',
    aiAdvisorPitch: 'ధరల నిర్ణయం, రీఆర్డర్లు లేదా లాభాల పెంపు గురించి ప్రశ్నలు ఉన్నాయా? AIని అడగండి:',
    openAiChatbot: 'పూర్తి AI చాట్‌బాట్ తెరవండి',
    lowStockReplenish: 'తక్కువ స్టాక్ శీఘ్ర భర్తీ',
    manageAll: 'అన్నీ నిర్వహించండి',
    plus10Units: '+10 యూనిట్లు',
    allHealthyMsg: 'చాలా బాగుంది! అన్ని ఉత్పత్తులలో తగినంత స్టాక్ ఉంది.',
    topPerforming: 'అత్యధికంగా అమ్ముడైన ఉత్పత్తులు',
    viewRankings: 'ర్యాంకింగ్స్ చూడండి',
    unitsSold: 'యూనిట్లు అమ్ముడయ్యాయి',

    totalCatalogSkus: 'మొత్తం ఉత్పత్తులు (SKU)',
    unitsOnHand: 'చేతిలో ఉన్న యూనిట్లు',
    lowStockAlerts: 'తక్కువ స్టాక్ హెచ్చరికలు',
    needingRestock: 'రీఆర్డర్ కావాల్సిన వస్తువులు',
    inventoryCostVal: 'ఇన్వెంటరీ కొనుగోలు వ్యయం',
    investedCapital: 'మొత్తం పెట్టుబడి',
    retailSalesVal: 'రిటైల్ అమ్మకపు విలువ',
    potentialProfit: 'సంభావ్య లాభం',
    searchPlaceholder: 'ఉత్పత్తి పేరు, SKU లేదా వర్గాన్ని వెతకండి...',
    exportCsv: 'CSV డౌన్‌లోడ్',
    addNewProduct: 'కొత్త ఉత్పత్తిని జోడించండి',
    allItems: 'అన్ని వస్తువులు',
    lowStockFilter: 'తక్కువ స్టాక్',
    healthyFilter: 'తగినంత స్టాక్',
    allCategories: 'అన్ని వర్గాలు',
    thProductName: 'ఉత్పత్తి పేరు & SKU',
    thCategory: 'వర్గం',
    thQuantity: 'పరిమాణం',
    thPurchasePrice: 'కొనుగోలు ధర',
    thSellingPrice: 'అమ్మకపు ధర',
    thProfitMargin: 'లాభం మార్జిన్',
    thStockStatus: 'స్టాక్ స్థితి',
    thActions: 'చర్యలు',
    statusHealthy: 'సరిపడా ఉంది',
    statusLowStock: 'తక్కువ స్టాక్',
    statusOutOfStock: 'స్టాక్ అయిపోయింది',
    noProductsMatch: 'ఏ ఉత్పత్తులు సరిపోలలేదు',
    tryClearingSearch: 'శోధనను క్లియర్ చేయండి లేదా కొత్త ఉత్పత్తిని జోడించండి.',
    leftUnits: 'మిగిలాయి',
    marginUnit: 'మార్జిన్',

    catBeverages: 'పానీయాలు',
    catDairy: 'పాల ఉత్పత్తులు',
    catBakery: 'బేకరీ',
    catPantry: 'కిరాణా సరుకులు',
    catSnacks: 'స్నాక్స్ & స్వీట్స్',
    catHousehold: 'గృహావసరాలు',
    catGeneral: 'సాధారణం',

    revenueProfitPerf: 'ఆదాయం & లాభాల పనితీరు',
    salesSubtitle: 'చిన్న రిటైల్ దుకాణాల కోసం రియల్-టైమ్ అనలిటిక్స్',
    last7Days: 'గత 7 రోజులు',
    last14Days: 'గత 14 రోజులు',
    simulateSale: 'అమ్మకం అనుకరణ',
    periodRevenue: 'ఈ కాలపు మొత్తం ఆదాయం',
    estGrossProfit: 'అంచనా స్థూల లాభం',
    totalOrders: 'మొత్తం కస్టమర్ ఆర్డర్లు',
    customersPerDay: 'కస్టమర్లు / రోజు',
    avgBasketSize: 'సగటు బిల్లు మొత్తం',
    avgRevPerOrder: 'సగటు చెక్‌అవుట్ ఆదాయం',
    chartHeading: 'రోజువారీ అమ్మకాలు & లాభాల చార్ట్',
    chartSub: 'రోజువారీ వివరాలను మరియు మార్జిన్లను చూడటానికి ఏ రోజైనా హోవర్ చేయండి',
    bestSellingHeading: 'అత్యధికంగా అమ్ముడైన ఉత్పత్తులు',
    rankedByRevenue: 'ఆదాయం ఆధారంగా ర్యాంక్',
    salesByCategory: 'వర్గాల వారీగా అమ్మకాలు',
    distributionPct: 'వాటా %',
    categoryInsightTitle: 'వర్గ అంతర్దృష్టి:',
    categoryInsightDesc: 'పానీయాలు & బేకరీ వస్తువులు క్రమంతప్పకుండా కస్టమర్లను తెస్తాయి. పానీయాల వద్ద స్నాక్స్ ఉంచడం వల్ల అమ్మకాలు 15% పెరుగుతాయి.',

    geminiRecommendations: 'జెమిని AI వ్యాపార సూచనలు',
    geminiSub: 'మీ దుకాణానికి తగిన 3 వ్యూహాలను రూపొందించడానికి AI మీ స్టాక్, మార్జిన్లు & అమ్మకాల వేగాన్ని విశ్లేషిస్తుంది.',
    lastAnalyzed: 'చివరి విశ్లేషణ',
    runNewAnalysis: 'కొత్త AI విశ్లేషణ ప్రారంభించండి',
    analyzingStore: 'దుకాణ డేటా విశ్లేషించబడుతోంది...',
    priority: 'ప్రాధాన్యత',
    impactLabel: 'నిరీక్షిత ప్రభావం',
    executionSteps: 'అమలు చేయవలసిన దశలు',
    copySteps: 'కాపీ',
    copied: 'కాపీ చేయబడింది!',
    needCustomAdvice: 'ప్రత్యేక సలహా కావాలా?',
    needCustomDesc: 'సప్లయర్లు లేదా సీజనల్ ఆఫర్ల గురించి వివరంగా అడగడానికి AI సహాయకుడిని ఉపయోగించండి.',
    chatWithAi: 'షాప్‌మేట్ AIతో చాట్ చేయండి',

    chatHeaderTitle: 'షాప్‌మేట్ AI వ్యాపార సలహాదారు',
    chatContextSummary: 'లైవ్ సమాచారం: {products} ఉత్పత్తులు • {lowStock} తక్కువ స్టాక్ • {sales} అమ్మకాలు',
    clearChat: 'చాట్ క్లియర్ చేయండి',
    quickAsk: 'త్వరిత ప్రశ్నలు:',
    chatInputPlaceholder: 'అమ్మకాలు, ధరలు, స్టాక్ లేదా లాభాల గురించి తెలుగులో అడగండి...',
    chatFooterNote: 'షాప్‌మేట్ AIకి మీ దుకాణ లైవ్ స్టాక్ మరియు లాభాల వివరాలు తెలుసు.',
    chatThinking: 'షాప్‌మేట్ AI సిఫార్సులను లెక్కిస్తోంది...',
    welcomeMessage: `నమస్కారం! నేను **షాప్‌మేట్ AI**, మీ వ్యక్తిగత రిటైల్ వ్యాపార సలహాదారుని.\n\nనేను మీ దుకాణ లైవ్ డేటాతో అనుసంధానించబడి ఉన్నాను:\n• **కేటలాగ్:** {products} ఉత్పత్తులు (మొత్తం {units} యూనిట్లు)\n• **తక్కువ స్టాక్ హెచ్చరిక:** {lowStock} వస్తువులు అయిపోతున్నాయి\n• **మొత్తం అమ్మకాలు:** {sales} (**{margin}% అంచనా లాభ మార్జిన్**)\n\nమీరు తెలుగులో నేరుగా **ధరల వ్యూహాలు**, **రీఆర్డర్లు**, **అమ్మకాల పెంపు** గురించి అడగవచ్చు!`,
    quickPrompt1: 'స్టాక్ అయిపోకుండా ఉండటానికి నేను ఈరోజు ఏ వస్తువులను ఆర్డర్ చేయాలి?',
    quickPrompt2: 'నా దుకాణ లాభాల మార్జిన్‌ను ఎలా పెంచుకోవాలి?',
    quickPrompt3: 'ఈ వారాంతానికి మంచి లాభదాయక ఆఫర్ కాంబోను సూచించండి.',
    quickPrompt4: 'నెమ్మదిగా అమ్ముడయ్యే వస్తువులతో ఏమి చేయాలి?',
    quickPrompt5: 'వేగంగా అమ్ముడయ్యే వస్తువులకు ఎంత సేఫ్టీ స్టాక్ ఉంచాలి?',

    modalEditTitle: 'ఉత్పత్తి వివరాలను సవరించండి',
    modalAddTitle: 'కొత్త ఉత్పత్తిని జోడించండి',
    modalDesc: 'ధరలు, ప్రారంభ ఇన్వెంటరీ మరియు రీఆర్డర్ హెచ్చరికలను సెట్ చేయండి',
    labelProductName: 'ఉత్పత్తి పేరు *',
    labelCategory: 'వర్గం',
    labelSku: 'SKU / బార్‌కోడ్ *',
    labelInitialStock: 'ప్రారంభ స్టాక్ పరిమాణం',
    labelUnit: 'ప్యాకేజింగ్ యూనిట్',
    labelMinAlert: 'కనిష్ట హెచ్చరిక పరిమాణం',
    labelPurchasePrice: 'కొనుగోలు ధర (ఖర్చు) ₹',
    labelSellingPrice: 'అమ్మకపు ధర (రిటైల్) ₹',
    unitProfitEst: 'అంచనా యూనిట్ లాభం:',
    grossMarginLabel: 'లాభ మార్జిన్:',
    cancel: 'రద్దు చేయండి',
    saveChanges: 'మార్పులను సేవ్ చేయండి',
    createProduct: 'ఉత్పత్తిని సృష్టించండి',
    customCategoryPrompt: '+ కొత్త వర్గం జోడించండి',

    quickSaleTitle: 'కస్టమర్ అమ్మకాన్ని నమోదు చేయండి',
    quickSaleDesc: 'దుకాణ ఆదాయం, లాభం మరియు స్టాక్ వెంటనే అప్‌డేట్ అవుతాయి',
    selectProduct: 'ఉత్పత్తిని ఎంచుకోండి',
    currentlyInStock: 'ప్రస్తుతం స్టాక్‌లో ఉంది:',
    unitsSoldLabel: 'అమ్మిన యూనిట్లు',
    saleTotal: 'మొత్తం అమ్మకం:',
    costOfGoods: 'వస్తువుల వ్యయం:',
    netProfitGenerated: 'నికర లాభం:',
    confirmSaleBtn: 'అమ్మకాన్ని నిర్ధారించండి & అప్‌డేట్ చేయండి',

    deleteTitle: 'ఉత్పత్తిని తొలగించాలా?',
    deleteConfirmText: 'మీరు ఖచ్చితంగా {name}ను కేటలాగ్ నుండి తొలగించాలనుకుంటున్నారా? దీనితో అన్ని రికార్డులు తొలగించబడతాయి.',
    deleteBtn: 'ఉత్పత్తిని తొలగించండి',

    toastResetSuccess: 'నమూనా డేటా విజయవంతంగా పునరుద్ధరించబడింది!',
    toastAdded: '"{name}" ఇన్వెంటరీకి జోడించబడింది!',
    toastUpdated: '"{name}" విజయవంతంగా నవీకరించబడింది!',
    toastDeleted: 'కేటలాగ్ నుండి "{name}" తొలగించబడింది',
    toastReplenished: '{name}కు +10 యూనిట్లు చేర్చబడ్డాయి!',
    toastSaleRecorded: '{qty}x {name} అమ్మకం నమోదైంది (+{profit} లాభం)!',
    toastAiRefreshed: 'జెమిని AI 3 వ్యాపార సూచనలను నవీకరించింది!',
    toastInsufficientStock: 'సరిపడా స్టాక్ లేదు: కేవలం {qty} మాత్రమే మిగిలి ఉంది',
  },

  ta: {
    appName: 'ஷாப்மேட்',
    appSubtitle: 'சிறு வணிகர்களின் டிஜிட்டல் உதவியாளர்',
    storeName: 'கிரீன்வேலி மார்ட் #104',
    storeType: 'மளிகைக் கடை',
    sessionActive: 'தற்போதைய அமர்வு செயலில் உள்ளது • பில்லிங் மற்றும் மறுவரிசைக்கு தயார்',
    live: 'நேரலை',
    resetDemoData: 'டெமோ தரவை மீட்டமைக்கவும்',
    hackathonNote: 'ஹேக்கத்தான் முன்மாதிரி • உள்ளூர் சேமிப்பகம் இயக்கப்பட்டது',
    language: 'மொழி',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',

    navDashboard: 'டாஷ்போர்டு',
    navDashboardDesc: 'முக்கிய கண்ணோட்டம்',
    navChat: 'AI உதவியாளர்',
    navChatDesc: 'ஜெமினி வணிக ஆலோசகர்',
    navInventory: 'சரக்கு இருப்பு மேலாண்மை',
    navInventoryDesc: 'பொருட்கள் மற்றும் இருப்பு நிலைகள்',
    navSales: 'விற்பனை பகுப்பாய்வு',
    navSalesDesc: 'போக்குகள் மற்றும் லாப விளக்கப்படம்',
    navSuggestions: 'ஸ்மார்ட் பரிந்துரைகள்',
    navSuggestionsDesc: 'ஜெமினி செயல் திட்டம்',
    geminiPowered: 'ஜெமினி AI மூலம் இயக்கப்படுகிறது',
    geminiDesc: 'நிகழ்நேர வணிக நுண்ணறிவு, மறுஆர்டர் விழிப்பூட்டல்கள் மற்றும் தானியங்கி விலை உத்திகள்.',

    recordQuickSale: 'விரைவு விற்பனையை பதிவு செய்க',
    saleBtnShort: 'விற்பனை',
    addProduct: 'பொருளைச் சேர்க்கவும்',
    askGemini: 'ஜெமினி AI-யிடம் கேளுங்கள்',

    titleDashboard: 'கடை டாஷ்போர்டு',
    subtitleDashboard: 'நேரலை விற்பனை, இருப்பு நிலை மற்றும் வணிக நுண்ணறிவு',
    titleInventory: 'சரக்கு (இருப்பு) மேலாண்மை',
    subtitleInventory: 'கொள்முதல் விலை, விற்பனை விலை, லாப வரம்பு மற்றும் எச்சரிக்கைகளை கண்காணிக்கவும்',
    titleSales: 'விற்பனை மற்றும் லாப பகுப்பாய்வு',
    subtitleSales: 'தினசரி வருவாய், செலவு விவரங்கள் மற்றும் அதிகம் விற்பனையாகும் பொருட்கள்',
    titleSuggestions: 'ஸ்மார்ட் வணிக பரிந்துரைகள்',
    subtitleSuggestions: 'விற்பனை மற்றும் லாபத்தை அதிகரிக்க AI பரிந்துரைகள்',
    titleChat: 'AI வணிக ஆலோசகர்',
    subtitleChat: 'விலை, இருப்பு, லாபம் மற்றும் பணப்புழக்கம் பற்றி ஜெமினியிடம் ஆலோசிக்கவும்',

    totalSales: 'மொத்த விற்பனை',
    totalProducts: 'மொத்த பொருட்கள்',
    lowStockProducts: 'குறைந்த இருப்பு பொருட்கள்',
    estimatedProfit: 'மதிப்பிடப்பட்ட லாபம்',
    vsPrevious: '+14.2% முந்தைய காலத்தை விட அதிகம்',
    recordedDays: 'பதிவுசெய்யப்பட்ட நாட்களில்',
    unitsInInventory: 'மொத்த இருப்பு அலகுகள்',
    retailInvValue: 'சில்லறை சரக்கு மதிப்பு',
    underThreshold: 'குறைந்தபட்ச பாதுகாப்பு வரம்பிற்கு கீழ் உள்ளது',
    allHealthy: 'அனைத்து இருப்பு நிலைகளும் சீராக உள்ளன',
    outOfStockRightNow: 'தற்போது இருப்பு தீர்ந்துவிட்டது',
    noDepleted: '0 தீர்ந்த பொருட்கள்',
    grossMargin: 'மொத்த லாப வரம்பு',
    cogs: 'விற்கப்பட்ட பொருட்களின் அடக்க விலை',

    lowStockWarning: 'குறைந்த இருப்பு எச்சரிக்கை: {count} பொருட்களை உடனடியாக மறுஆர்டர் செய்ய வேண்டும்',
    viewAndRestock: 'பார்த்து மறுஇருப்பு செய்க',
    recentSalesProfit: 'சமீபத்திய தினசரி விற்பனை மற்றும் லாபம்',
    last7DaysOverview: 'கடந்த 7 நாட்களின் கண்ணோட்டம்',
    revenue: 'வருவாய்',
    profit: 'லாபம்',
    fullAnalysis: 'முழு பகுப்பாய்வு',
    avgDailySales: 'சராசரி தினசரி விற்பனை',
    estDailyProfit: 'மதிப்பிடப்பட்ட தினசரி லாபம்',
    advisorReady: 'தயார்',
    aiAdvisorHeading: 'ஷாப்மேட் AI ஆலோசகர்',
    aiAdvisorPitch: 'விலை நிர்ணயம், மறுஆர்டர் அல்லது லாபத்தை அதிகரிப்பது பற்றிய கேள்விகள் உள்ளதா? கேளுங்கள்:',
    openAiChatbot: 'முழு AI சாட்போட்டைத் திறக்கவும்',
    lowStockReplenish: 'குறைந்த இருப்பு விரைவு நிரப்பல்',
    manageAll: 'அனைத்தையும் நிர்வகிக்கவும்',
    plus10Units: '+10 அலகுகள்',
    allHealthyMsg: 'அருமை! அனைத்து பொருட்களிலும் போதுமான இருப்பு உள்ளது.',
    topPerforming: 'அதிகம் விற்பனையாகும் பொருட்கள்',
    viewRankings: 'தரவரிசையைக் காண்க',
    unitsSold: 'விற்கப்பட்ட அலகுகள்',

    totalCatalogSkus: 'மொத்த பொருட்கள் (SKU)',
    unitsOnHand: 'கையிருப்பில் உள்ள அலகுகள்',
    lowStockAlerts: 'குறைந்த இருப்பு எச்சரிக்கைகள்',
    needingRestock: 'மறுஆர்டர் தேவைப்படும் பொருட்கள்',
    inventoryCostVal: 'சரக்கு கொள்முதல் செலவு',
    investedCapital: 'மொத்த முதலீடு',
    retailSalesVal: 'சில்லறை விற்பனை மதிப்பு',
    potentialProfit: 'சாத்தியமான லாபம்',
    searchPlaceholder: 'பொருளின் பெயர், SKU அல்லது வகையைத் தேடவும்...',
    exportCsv: 'CSV பதிவிறக்கம்',
    addNewProduct: 'புதிய பொருளைச் சேர்க்கவும்',
    allItems: 'அனைத்து பொருட்கள்',
    lowStockFilter: 'குறைந்த இருப்பு',
    healthyFilter: 'சீரான இருப்பு',
    allCategories: 'அனைத்து வகைகள்',
    thProductName: 'பொருளின் பெயர் & SKU',
    thCategory: 'வகை',
    thQuantity: 'அளவு',
    thPurchasePrice: 'கொள்முதல் விலை',
    thSellingPrice: 'விற்பனை விலை',
    thProfitMargin: 'லாப வரம்பு',
    thStockStatus: 'இருப்பு நிலை',
    thActions: 'செயல்கள்',
    statusHealthy: 'சரியானது',
    statusLowStock: 'குறைந்த இருப்பு',
    statusOutOfStock: 'இருப்பு தீர்ந்தது',
    noProductsMatch: 'பொருட்கள் எதுவும் பொருந்தவில்லை',
    tryClearingSearch: 'தேடலை அழிக்கவும் அல்லது புதிய பொருளைச் சேர்க்கவும்.',
    leftUnits: 'மீதமுள்ளது',
    marginUnit: 'வரம்பு',

    catBeverages: 'பானங்கள்',
    catDairy: 'பால் பொருட்கள்',
    catBakery: 'பேக்கரி',
    catPantry: 'மளிகை பொருட்கள்',
    catSnacks: 'சிற்றுண்டி & தின்பண்டங்கள்',
    catHousehold: 'வீட்டு உபயோகம்',
    catGeneral: 'பொதுவானது',

    revenueProfitPerf: 'வருவாய் மற்றும் லாப செயல்பாடு',
    salesSubtitle: 'சிறு சில்லறை வணிகங்களுக்கான நிகழ்நேர பகுப்பாய்வு',
    last7Days: 'கடந்த 7 நாட்கள்',
    last14Days: 'கடந்த 14 நாட்கள்',
    simulateSale: 'விற்பனை சோதனை',
    periodRevenue: 'இக்காலகட்ட வருவாய்',
    estGrossProfit: 'மதிப்பிடப்பட்ட மொத்த லாபம்',
    totalOrders: 'மொத்த வாடிக்கையாளர் ஆர்டர்கள்',
    customersPerDay: 'வாடிக்கையாளர்கள் / நாள்',
    avgBasketSize: 'சராசரி ரசீது தொகை',
    avgRevPerOrder: 'ஒரு பில்லுக்கான சராசரி வருவாய்',
    chartHeading: 'தினசரி விற்பனை மற்றும் லாப விளக்கப்படம்',
    chartSub: 'தினசரி விவரங்கள் மற்றும் வரம்புகளைப் பார்க்க எந்த நாளிலும் கர்சரைக் கொண்டு செல்லவும்',
    bestSellingHeading: 'அதிகம் விற்பனையாகும் பொருட்கள்',
    rankedByRevenue: 'வருவாயின் அடிப்படையில்',
    salesByCategory: 'வகை வாரியாக விற்பனை',
    distributionPct: 'பங்கு %',
    categoryInsightTitle: 'வகை நுண்ணறிவு:',
    categoryInsightDesc: 'பானங்கள் மற்றும் பேக்கரி பொருட்கள் வழக்கமான வாடிக்கையாளர்களை ஈர்க்கின்றன. பானங்களுக்கு அருகில் சிற்றுண்டிகளை வைப்பது விற்பனையை 15% அதிகரிக்கும்.',

    geminiRecommendations: 'ஜெமினி AI வணிகப் பரிந்துரைகள்',
    geminiSub: 'உங்கள் கடைக்கு ஏற்ற 3 உத்திகளை வழங்க AI உங்கள் இருப்பு மற்றும் விற்பனை வேகத்தை பகுப்பாய்வு செய்கிறது.',
    lastAnalyzed: 'கடைசி பகுப்பாய்வு',
    runNewAnalysis: 'புதிய AI பகுப்பாய்வை இயக்கவும்',
    analyzingStore: 'கடையின் தரவு பகுப்பாய்வு செய்யப்படுகிறது...',
    priority: 'முன்னுரிமை',
    impactLabel: 'எதிர்பார்க்கப்படும் பலன்',
    executionSteps: 'செயல்படுத்தும் படிகள்',
    copySteps: 'நகலெடு',
    copied: 'நகலெடுக்கப்பட்டது!',
    needCustomAdvice: 'தனிப்பயன் ஆலோசனை தேவையா?',
    needCustomDesc: 'வழங்குநர்கள் அல்லது சலுகைகள் பற்றி விரிவாகக் கேட்க AI உதவியாளரைப் பயன்படுத்தவும்.',
    chatWithAi: 'ஷாப்மேட் AI உடன் அரட்டையடிக்கவும்',

    chatHeaderTitle: 'ஷாப்மேட் AI வணிக ஆலோசகர்',
    chatContextSummary: 'நேரலை தகவல்: {products} பொருட்கள் • {lowStock} குறைந்த இருப்பு • {sales} விற்பனை',
    clearChat: 'அரட்டையை அழிக்கவும்',
    quickAsk: 'விரைவு கேள்விகள்:',
    chatInputPlaceholder: 'விற்பனை, விலை, இருப்பு, லாபம் பற்றி தமிழிலும் கேட்கலாம்...',
    chatFooterNote: 'ஷாப்மேட் AI உங்கள் கடையின் நேரலை இருப்பு மற்றும் லாப விவரங்களை அறிந்து வைத்துள்ளது.',
    chatThinking: 'ஷாப்மேட் AI பரிந்துரைகளை கணக்கிடுகிறது...',
    welcomeMessage: `வணக்கம்! நான் **ஷாப்மேட் AI**, உங்கள் சில்லறை வணிக மற்றும் இருப்பு ஆலோசகர்.\n\nநான் உங்கள் கடையின் நேரலைத் தரவுடன் இணைக்கப்பட்டுள்ளேன்:\n• **பட்டியல்:** {products} பொருட்கள் (மொத்தம் {units} அலகுகள்)\n• **குறைந்த இருப்பு எச்சரிக்கை:** {lowStock} பொருட்கள் குறைகின்றன\n• **மொத்த விற்பனை:** {sales} (**{margin}% மதிப்பிடப்பட்ட லாப வரம்பு**)\n\nநீங்கள் தமிழிலும் நேரடியாக **விலை உத்திகள்**, **மறுஆர்டர்கள்**, **விற்பனை அதிகரிப்பு** பற்றி என்னிடம் கேட்கலாம்!`,
    quickPrompt1: 'இருப்பு தீர்ந்துவிடாமல் இருக்க நான் இன்று எந்த பொருட்களை ஆர்டர் செய்ய வேண்டும்?',
    quickPrompt2: 'எனது கடையின் லாப வரம்பை எவ்வாறு அதிகரிக்கலாம்?',
    quickPrompt3: 'இந்த வார இறுதிக்கு ஒரு நல்ல சலுகை காம்போவை பரிந்துரைக்கவும்.',
    quickPrompt4: 'மெதுவாக விற்பனையாகும் பொருட்களுக்கு என்ன செய்ய வேண்டும்?',
    quickPrompt5: 'வேகமாக விற்பனையாகும் பொருட்களுக்கு எவ்வளவு இருப்பு வைத்திருக்க வேண்டும்?',

    modalEditTitle: 'பொருள் விவரங்களைத் திருத்தவும்',
    modalAddTitle: 'புதிய பொருளைச் சேர்க்கவும்',
    modalDesc: 'விலை, ஆரம்ப இருப்பு மற்றும் மறுஆர்டர் விழிப்பூட்டல்களை அமைக்கவும்',
    labelProductName: 'பொருளின் பெயர் *',
    labelCategory: 'வகை',
    labelSku: 'SKU / பார்கோடு *',
    labelInitialStock: 'ஆரம்ப இருப்பு அளவு',
    labelUnit: 'பேக்கேஜிங் அலகு',
    labelMinAlert: 'குறைந்தபட்ச எச்சரிக்கை அளவு',
    labelPurchasePrice: 'கொள்முதல் விலை (செலவு) ₹',
    labelSellingPrice: 'விற்பனை விலை (சில்லறை) ₹',
    unitProfitEst: 'மதிப்பிடப்பட்ட அலகு லாபம்:',
    grossMarginLabel: 'லாப வரம்பு:',
    cancel: 'ரத்து செய்',
    saveChanges: 'மாற்றங்களைச் சேமிக்கவும்',
    createProduct: 'பொருளை உருவாக்கவும்',
    customCategoryPrompt: '+ புதிய வகையைச் சேர்க்கவும்',

    quickSaleTitle: 'வாடிக்கையாளர் விற்பனையைப் பதிவு செய்க',
    quickSaleDesc: 'கடையின் வருவாய், லாபம் மற்றும் இருப்பு உடனடியாக புதுப்பிக்கப்படும்',
    selectProduct: 'பொருளைத் தேர்ந்தெடுக்கவும்',
    currentlyInStock: 'தற்போது கையிருப்பில் உள்ளது:',
    unitsSoldLabel: 'விற்கப்பட்ட அலகுகள்',
    saleTotal: 'விற்பனை மொத்தம்:',
    costOfGoods: 'பொருட்களின் அடக்கம்:',
    netProfitGenerated: 'நிகர லாபம்:',
    confirmSaleBtn: 'விற்பனையை உறுதிசெய்து புதுப்பிக்கவும்',

    deleteTitle: 'பொருளை நீக்கவா?',
    deleteConfirmText: 'உங்கள் பட்டியலிலிருந்து {name} என்ற பொருளை நீக்க விரும்புகிறீர்களா? இதன் அனைத்து பதிவுகளும் நீக்கப்படும்.',
    deleteBtn: 'பொருளை நீக்கு',

    toastResetSuccess: 'மாதிரி தரவு வெற்றிகரமாக மீட்டமைக்கப்பட்டது!',
    toastAdded: '"{name}" இருப்புக்குச் சேர்க்கப்பட்டது!',
    toastUpdated: '"{name}" வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
    toastDeleted: 'பட்டியலிலிருந்து "{name}" நீக்கப்பட்டது',
    toastReplenished: '{name} பொருளுக்கு +10 அலகுகள் சேர்க்கப்பட்டது!',
    toastSaleRecorded: '{qty}x {name} விற்பனை பதிவானது (+{profit} லாபம்)!',
    toastAiRefreshed: 'ஜெமினி AI 3 வணிக பரிந்துரைகளைப் புதுப்பித்தது!',
    toastInsufficientStock: 'போதுமான இருப்பு இல்லை: {qty} மட்டுமே உள்ளது',
  },

  ml: {
    appName: 'ഷോപ്പ്മേറ്റ്',
    appSubtitle: 'ചെറുകിട വ്യാപാരികളുടെ സഹായി',
    storeName: 'ഗ്രീൻവാലി മാർട്ട് #104',
    storeType: 'പലചരക്ക് കട',
    sessionActive: 'നിലവിലെ സെഷൻ സജീവമാണ് • ബില്ലിംഗിനും റീഓർഡറിനും തയ്യാറാണ്',
    live: 'തത്സമയം',
    resetDemoData: 'ഡെമോ ഡാറ്റ പുനഃക്രമീകരിക്കുക',
    hackathonNote: 'ഹാക്കത്തോൺ പ്രോട്ടോടൈപ്പ് • ലോക്കൽ സ്റ്റോറേജ് പ്രവർത്തനക്ഷമമാക്കി',
    language: 'ഭാഷ',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',

    navDashboard: 'ഡാഷ്‌ബോർഡ്',
    navDashboardDesc: 'പ്രധാന വിവരങ്ങളും അവലോകനവും',
    navChat: 'AI അസിസ്റ്റന്റ്',
    navChatDesc: 'ജെമിനി ബിസിനസ്സ് ഉപദേശകൻ',
    navInventory: 'ഇൻവെന്ററി മാനേജ്മെന്റ്',
    navInventoryDesc: 'ഉൽപ്പന്നങ്ങളും സ്റ്റോക്ക് ലെവലുകളും',
    navSales: 'വിൽപ്പന വിശകലനം',
    navSalesDesc: 'ട്രെൻഡുകളും ലാഭ ചാർട്ടും',
    navSuggestions: 'സ്മാർട്ട് നിർദ്ദേശങ്ങൾ',
    navSuggestionsDesc: 'ജെമിനി കർമ്മപദ്ധതി',
    geminiPowered: 'ജെമിനി AI പിന്തുണയോടെ',
    geminiDesc: 'തത്സമയ ബിസിനസ്സ് ഉൾക്കാഴ്ചകൾ, റീഓർഡർ അലേർട്ടുകൾ, യാന്ത്രിക വിലനിർണ്ണയ തന്ത്രങ്ങൾ.',

    recordQuickSale: 'വിൽപ്പന രേഖപ്പെടുത്തുക',
    saleBtnShort: 'വിൽപ്പന',
    addProduct: 'ഉൽപ്പന്നം ചേർക്കുക',
    askGemini: 'ജെമിനി AI-യോട് ചോദിക്കുക',

    titleDashboard: 'ഷോപ്പ് ഡാഷ്‌ബോർഡ്',
    subtitleDashboard: 'തത്സമയ വിൽപ്പന, സ്റ്റോക്ക് ആരോഗ്യം, ബിസിനസ്സ് വിവരങ്ങൾ',
    titleInventory: 'ഇൻവെന്ററി (സ്റ്റോക്ക്) മാനേജ്മെന്റ്',
    subtitleInventory: 'വാങ്ങൽ വില, വിൽപ്പന വില, ലാഭവിഹിതം, അലേർട്ടുകൾ എന്നിവ നിരീക്ഷിക്കുക',
    titleSales: 'വിൽപ്പനയും ലാഭവും വിശകലനം',
    subtitleSales: 'പ്രതിദിന വരുമാനം, ചെലവ് വിശദാംശങ്ങൾ, കൂടുതൽ വിറ്റഴിക്കപ്പെടുന്ന ഉൽപ്പന്നങ്ങൾ',
    titleSuggestions: 'സ്മാർട്ട് ബിസിനസ്സ് നിർദ്ദേശങ്ങൾ',
    subtitleSuggestions: 'വിൽപ്പനയും ലാഭവും വർദ്ധിപ്പിക്കുന്നതിനുള്ള AI നിർദ്ദേശങ്ങൾ',
    titleChat: 'AI ബിസിനസ്സ് ഉപദേശകൻ',
    subtitleChat: 'വിലനിർണ്ണയം, സ്റ്റോക്ക്, ലാഭം എന്നിവയെക്കുറിച്ച് ജെമിനിയുമായി ചർച്ച ചെയ്യുക',

    totalSales: 'ആകെ വിൽപ്പന',
    totalProducts: 'ആകെ ഉൽപ്പന്നങ്ങൾ',
    lowStockProducts: 'കുറഞ്ഞ സ്റ്റോക്ക് ഉൽപ്പന്നങ്ങൾ',
    estimatedProfit: 'കണക്കാക്കിയ ലാഭം',
    vsPrevious: '+14.2% കഴിഞ്ഞ കാലയളവിനേക്കാൾ കൂടുതൽ',
    recordedDays: 'രേഖപ്പെടുത്തിയ ദിവസങ്ങളിൽ',
    unitsInInventory: 'ആകെ ഇൻവെന്ററി യൂണിറ്റുകൾ',
    retailInvValue: 'റീട്ടെയിൽ ഇൻവെന്ററി മൂല്യം',
    underThreshold: 'സുരക്ഷാ പരിധിയേക്കാൾ കുറവാണ്',
    allHealthy: 'എല്ലാ സ്റ്റോക്ക് ലെവലുകളും സാധാരണമാണ്',
    outOfStockRightNow: 'നിലവിൽ സ്റ്റോക്ക് തീർന്നു',
    noDepleted: '0 തീർന്ന ഉൽപ്പന്നങ്ങൾ',
    grossMargin: 'മൊത്തം ലാഭവിഹിതം',
    cogs: 'വിറ്റ സാധനങ്ങളുടെ വാങ്ങൽ ചെലവ്',

    lowStockWarning: 'കുറഞ്ഞ സ്റ്റോക്ക് മുന്നറിയിപ്പ്: {count} ഉൽപ്പന്നങ്ങൾ ഉടൻ റീഓർഡർ ചെയ്യണം',
    viewAndRestock: 'കണ്ട് സ്റ്റോക്ക് നിറയ്ക്കുക',
    recentSalesProfit: 'സമീപകാല ദൈനംദിന വിൽപ്പനയും ലാഭവും',
    last7DaysOverview: 'കഴിഞ്ഞ 7 ദിവസത്തെ അവലോകനം',
    revenue: 'വരുമാനം',
    profit: 'ലാഭം',
    fullAnalysis: 'പൂർണ്ണ വിശകലനം',
    avgDailySales: 'ശരാശരി പ്രതിദിന വിൽപ്പന',
    estDailyProfit: 'പ്രതീക്ഷിക്കുന്ന പ്രതിദിന ലാഭം',
    advisorReady: 'സജ്ജമാണ്',
    aiAdvisorHeading: 'ഷോപ്പ്മേറ്റ് AI ഉപദേശകൻ',
    aiAdvisorPitch: 'വിലനിർണ്ണയം, റീഓർഡറുകൾ അല്ലെങ്കിൽ ലാഭം വർദ്ധിപ്പിക്കൽ എന്നിവയെക്കുറിച്ച് സംശയമുണ്ടോ? ചോദിക്കൂ:',
    openAiChatbot: 'മുഴുവൻ AI ചാറ്റ്ബോട്ട് തുറക്കുക',
    lowStockReplenish: 'കുറഞ്ഞ സ്റ്റോക്ക് വേഗത്തിൽ നിറയ്ക്കൽ',
    manageAll: 'എല്ലാം കൈകാര്യം ചെയ്യുക',
    plus10Units: '+10 യൂണിറ്റുകൾ',
    allHealthyMsg: 'നന്നായിരിക്കുന്നു! എല്ലാ ഉൽപ്പന്നങ്ങളിലും ആവശ്യത്തിന് സ്റ്റോക്ക് ഉണ്ട്.',
    topPerforming: 'കൂടുതൽ വിറ്റഴിക്കപ്പെടുന്ന ഉൽപ്പന്നങ്ങൾ',
    viewRankings: 'റാങ്കിംഗ് കാണുക',
    unitsSold: 'വിറ്റ യൂണിറ്റുകൾ',

    totalCatalogSkus: 'ആകെ ഉൽപ്പന്നങ്ങൾ (SKU)',
    unitsOnHand: 'കയ്യിലുള്ള യൂണിറ്റുകൾ',
    lowStockAlerts: 'കുറഞ്ഞ സ്റ്റോക്ക് അലേർട്ടുകൾ',
    needingRestock: 'റീഓർഡർ ആവശ്യമുള്ളവ',
    inventoryCostVal: 'ഇൻവെന്ററി വാങ്ങൽ ചെലവ്',
    investedCapital: 'ആകെ നിക്ഷേപം',
    retailSalesVal: 'റീട്ടെയിൽ വിൽപ്പന മൂല്യം',
    potentialProfit: 'പ്രതീക്ഷിക്കുന്ന ലാഭം',
    searchPlaceholder: 'ഉൽപ്പന്നത്തിന്റെ പേര്, SKU അല്ലെങ്കിൽ വിഭാഗം തിരയുക...',
    exportCsv: 'CSV ഡൗൺലോഡ് ചെയ്യുക',
    addNewProduct: 'പുതിയ ഉൽപ്പന്നം ചേർക്കുക',
    allItems: 'എല്ലാ സാധനങ്ങളും',
    lowStockFilter: 'കുറഞ്ഞ സ്റ്റോക്ക്',
    healthyFilter: 'ആവശ്യത്തിന് സ്റ്റോക്ക്',
    allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
    thProductName: 'ഉൽപ്പന്നത്തിന്റെ പേരും SKU ഉം',
    thCategory: 'വിഭാഗം',
    thQuantity: 'അളവ്',
    thPurchasePrice: 'വാങ്ങൽ വില',
    thSellingPrice: 'വിൽപ്പന വില',
    thProfitMargin: 'ലാഭവിഹിതം',
    thStockStatus: 'സ്റ്റോക്ക് നില',
    thActions: 'നടപടികൾ',
    statusHealthy: 'സാധാരണ',
    statusLowStock: 'കുറഞ്ഞ സ്റ്റോക്ക്',
    statusOutOfStock: 'സ്റ്റോക്ക് തീർന്നു',
    noProductsMatch: 'ഉൽപ്പന്നങ്ങളൊന്നും കണ്ടെത്തിയില്ല',
    tryClearingSearch: 'തിരയൽ മായ്‌ക്കുക അല്ലെങ്കിൽ പുതിയ ഉൽപ്പന്നം ചേർക്കുക.',
    leftUnits: 'ബാക്കിയുണ്ട്',
    marginUnit: 'വിഹിതം',

    catBeverages: 'പാനീയങ്ങൾ',
    catDairy: 'പാൽ ഉൽപ്പന്നങ്ങൾ',
    catBakery: 'ബേക്കറി',
    catPantry: 'പലചരക്ക് സാധനങ്ങൾ',
    catSnacks: 'ലഘുഭക്ഷണങ്ങൾ',
    catHousehold: 'വീട്ടുപകരണങ്ങൾ',
    catGeneral: 'പൊതുവായത്',

    revenueProfitPerf: 'വരുമാനവും ലാഭവും പ്രകടനം',
    salesSubtitle: 'ചെറുകിട റീട്ടെയിൽ ബിസിനസുകൾക്കായുള്ള തത്സമയ വിശകലനം',
    last7Days: 'കഴിഞ്ഞ 7 ദിവസങ്ങൾ',
    last14Days: 'കഴിഞ്ഞ 14 ദിവസങ്ങൾ',
    simulateSale: 'വിൽപ്പന സിമുലേഷൻ',
    periodRevenue: 'ഈ കാലയളവിലെ വരുമാനം',
    estGrossProfit: 'പ്രതീക്ഷിക്കുന്ന മൊത്തം ലാഭം',
    totalOrders: 'ആകെ കസ്റ്റമർ ഓർഡറുകൾ',
    customersPerDay: 'ഉപഭോക്താക്കൾ / ദിവസം',
    avgBasketSize: 'ശരാശരി ബിൽ തുക',
    avgRevPerOrder: 'ഒരു ചെക്ക്ഔട്ടിന് ശരാശരി വരുമാനം',
    chartHeading: 'പ്രതിദിന വിൽപ്പനയും ലാഭവും ചാർട്ട്',
    chartSub: 'പ്രതിദിന വിവരങ്ങളും മാർജിനുകളും കാണാൻ ഏതെങ്കിലും ദിവസത്തിൽ ഹോവർ ചെയ്യുക',
    bestSellingHeading: 'കൂടുതൽ വിറ്റഴിക്കപ്പെടുന്ന ഉൽപ്പന്നങ്ങൾ',
    rankedByRevenue: 'വരുമാനത്തിന്റെ അടിസ്ഥാനത്തിൽ',
    salesByCategory: 'വിഭാഗം തിരിച്ചുള്ള വിൽപ്പന',
    distributionPct: 'വിഹിതം %',
    categoryInsightTitle: 'വിഭാഗ ഉൾക്കാഴ്ച:',
    categoryInsightDesc: 'പാനീയങ്ങളും ബേക്കറി സാധനങ്ങളും സ്ഥിരം ഉപഭോക്താക്കളെ നൽകുന്നു. പാനീയങ്ങൾക്കൊപ്പം ലഘുഭക്ഷണങ്ങൾ വെക്കുന്നത് വിൽപ്പന 15% വർദ്ധിപ്പിക്കും.',

    geminiRecommendations: 'ജെമിനി AI ബിസിനസ്സ് ശുപാർശകൾ',
    geminiSub: 'നിങ്ങളുടെ കടയ്ക്ക് അനുയോജ്യമായ 3 മികച്ച തന്ത്രങ്ങൾ നിർദ്ദേശിക്കാൻ AI നിങ്ങളുടെ സ്റ്റോക്കും വിൽപ്പന വേഗതയും പരിശോധിക്കുന്നു.',
    lastAnalyzed: 'അവസാനം വിശകലനം ചെയ്തത്',
    runNewAnalysis: 'പുതിയ AI വിശകലനം നടത്തുക',
    analyzingStore: 'ഷോപ്പ് ഡാറ്റ വിശകലനം ചെയ്യുന്നു...',
    priority: 'മുൻഗണന',
    impactLabel: 'പ്രതീക്ഷിക്കുന്ന ഫലം',
    executionSteps: 'നടപ്പിലാക്കേണ്ട ഘട്ടങ്ങൾ',
    copySteps: 'പകർത്തുക',
    copied: 'പകർത്തി!',
    needCustomAdvice: 'പ്രത്യേക ഉപദേശം ആവശ്യമുണ്ടോ?',
    needCustomDesc: 'പ്രാദേശിക വിതരണക്കാരെക്കുറിച്ചോ സീസണൽ ഓഫറുകളെക്കുറിച്ചോ ചോദിക്കാൻ AI ഉപയോഗിക്കുക.',
    chatWithAi: 'ഷോപ്പ്മേറ്റ് AI-യുമായി ചാറ്റ് ചെയ്യുക',

    chatHeaderTitle: 'ഷോപ്പ്മേറ്റ് AI ബിസിനസ്സ് ഉപദേശകൻ',
    chatContextSummary: 'തത്സമയ വിവരങ്ങൾ: {products} ഉൽപ്പന്നങ്ങൾ • {lowStock} കുറഞ്ഞ സ്റ്റോക്ക് • {sales} വിൽപ്പന',
    clearChat: 'ചാറ്റ് മായ്‌ക്കുക',
    quickAsk: 'ദ്രുത ചോദ്യങ്ങൾ:',
    chatInputPlaceholder: 'വിൽപ്പന, വില, സ്റ്റോക്ക്, ലാഭം എന്നിവയെക്കുറിച്ച് മലയാളത്തിലും ചോദിക്കാം...',
    chatFooterNote: 'ഷോപ്പ്മേറ്റ് AI-ക്ക് നിങ്ങളുടെ കടയിലെ തത്സമയ സ്റ്റോക്കും ലാഭക്കണക്കുകളും അറിയാം.',
    chatThinking: 'ഷോപ്പ്മേറ്റ് AI കണക്കുകൂട്ടുന്നു...',
    welcomeMessage: `നമസ്കാരം! ഞാൻ **ഷോപ്പ്മേറ്റ് AI**, നിങ്ങളുടെ റീട്ടെയിൽ ബിസിനസ്സ് ഉപദേശകൻ.\n\nഞാൻ നിങ്ങളുടെ കടയുടെ തത്സമയ ഡാറ്റയുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു:\n• **ഉൽപ്പന്നങ്ങൾ:** {products} സാധനങ്ങൾ (ആകെ {units} യൂണിറ്റുകൾ)\n• **കുറഞ്ഞ സ്റ്റോക്ക് മുന്നറിയിപ്പ്:** {lowStock} സാധനങ്ങൾ തീരാറായി\n• **ആകെ വിൽപ്പന:** {sales} (**{margin}% പ്രതീക്ഷിക്കുന്ന ലാഭവിഹിതം**)\n\nനിങ്ങൾക്ക് മലയാളത്തിൽ തന്നെ **വിലനിർണ്ണയം**, **സ്റ്റോക്ക് റീഓർഡർ**, **വിൽപ്പന വർദ്ധിപ്പിക്കൽ** എന്നിവയെക്കുറിച്ച് ചോദിക്കാം!`,
    quickPrompt1: 'സ്റ്റോക്ക് തീരാതിരിക്കാൻ ഞാൻ ഇന്ന് ഏതൊക്കെ സാധനങ്ങൾ ഓർഡർ ചെയ്യണം?',
    quickPrompt2: 'എന്റെ കടയിലെ ലാഭവിഹിതം എങ്ങനെ വർദ്ധിപ്പിക്കാം?',
    quickPrompt3: 'ഈ വാരാന്ത്യത്തിൽ മികച്ച ലാഭം നൽകുന്ന ഒരു കോംബോ ഓഫർ നിർദ്ദേശിക്കൂ.',
    quickPrompt4: 'പതുക്കെ വിൽക്കുന്ന സാധനങ്ങൾ എന്ത് ചെയ്യണം?',
    quickPrompt5: 'വേഗത്തിൽ വിൽക്കുന്ന സാധനങ്ങൾക്ക് എത്ര സേഫ്റ്റി സ്റ്റോക്ക് സൂക്ഷിക്കണം?',

    modalEditTitle: 'ഉൽപ്പന്ന വിവരങ്ങൾ തിരുത്തുക',
    modalAddTitle: 'പുതിയ ഉൽപ്പന്നം ചേർക്കുക',
    modalDesc: 'വില, പ്രാരംഭ സ്റ്റോക്ക്, റീഓർഡർ അലേർട്ടുകൾ എന്നിവ സജ്ജീകരിക്കുക',
    labelProductName: 'ഉൽപ്പന്നത്തിന്റെ പേര് *',
    labelCategory: 'വിഭാഗം',
    labelSku: 'SKU / ബാർകോഡ് *',
    labelInitialStock: 'പ്രാരംഭ സ്റ്റോക്ക് അളവ്',
    labelUnit: 'പാക്കേജിംഗ് യൂണിറ്റ്',
    labelMinAlert: 'കുറഞ്ഞ അലേർട്ട് അളവ്',
    labelPurchasePrice: 'വാങ്ങൽ വില (ചെലവ്) ₹',
    labelSellingPrice: 'വിൽപ്പന വില (റീട്ടെയിൽ) ₹',
    unitProfitEst: 'യൂണിറ്റ് ലാഭം (കണക്കാക്കിയത്):',
    grossMarginLabel: 'ലാഭവിഹിതം:',
    cancel: 'റദ്ദാക്കുക',
    saveChanges: 'മാറ്റങ്ങൾ സംരക്ഷിക്കുക',
    createProduct: 'ഉൽപ്പന്നം സൃഷ്ടിക്കുക',
    customCategoryPrompt: '+ പുതിയ വിഭാഗം ചേർക്കുക',

    quickSaleTitle: 'വിൽപ്പന രേഖപ്പെടുത്തുക',
    quickSaleDesc: 'വരുമാനവും ലാഭവും സ്റ്റോക്കും ഉടനടി അപ്‌ഡേറ്റ് ചെയ്യപ്പെടും',
    selectProduct: 'ഉൽപ്പന്നം തിരഞ്ഞെടുക്കുക',
    currentlyInStock: 'നിലവിൽ സ്റ്റോക്കിലുള്ളത്:',
    unitsSoldLabel: 'വിറ്റ യൂണിറ്റുകൾ',
    saleTotal: 'ആകെ വിൽപ്പന:',
    costOfGoods: 'സാധനങ്ങളുടെ ചെലവ്:',
    netProfitGenerated: 'അറ്റാദായം:',
    confirmSaleBtn: 'വിൽപ്പന സ്ഥിരീകരിച്ച് അപ്ഡേറ്റ് ചെയ്യുക',

    deleteTitle: 'ഉൽപ്പന്നം ഒഴിവാക്കണോ?',
    deleteConfirmText: '{name} എന്ന ഉൽപ്പന്നം നിങ്ങളുടെ കാറ്റലോഗിൽ നിന്ന് ഒഴിവാക്കണമെന്ന് ഉറപ്പാണോ? ഇതിന്റെ എല്ലാ വിവരങ്ങളും നീക്കം ചെയ്യപ്പെടും.',
    deleteBtn: 'ഉൽപ്പന്നം നീക്കം ചെയ്യുക',

    toastResetSuccess: 'സാമ്പിൾ ഡാറ്റ വിജയകരമായി പുനഃസ്ഥാപിച്ചു!',
    toastAdded: '"{name}" ഇൻവെന്ററിയിലേക്ക് ചേർത്തു!',
    toastUpdated: '"{name}" വിജയകരമായി അപ്‌ഡേറ്റുചെയ്‌തു!',
    toastDeleted: 'കാറ്റലോഗിൽ നിന്ന് "{name}" നീക്കംചെയ്‌തു',
    toastReplenished: '{name}-ന് +10 യൂണിറ്റുകൾ ചേർത്തു!',
    toastSaleRecorded: '{qty}x {name} വിൽപ്പന രേഖപ്പെടുത്തി (+{profit} ലാഭം)!',
    toastAiRefreshed: 'ജെമിനി AI 3 ബിസിനസ്സ് നിർദ്ദേശങ്ങൾ അപ്ഡേറ്റ് ചെയ്തു!',
    toastInsufficientStock: 'ആവശ്യത്തിന് സ്റ്റോക്ക് ഇല്ല: {qty} മാത്രമേ ശേഷിക്കുന്നുള്ളൂ',
  },

  mr: {
    appName: 'शॉपमेट',
    appSubtitle: 'लहान व्यापाऱ्यांचा डिजिटल साथीदार',
    storeName: 'ग्रीनव्हॅली मार्ट #104',
    storeType: 'किराणा दुकान',
    sessionActive: 'सत्र सक्रिय आहे • बिलिंग आणि रीऑर्डरसाठी तयार',
    live: 'थेट',
    resetDemoData: 'डेमो डेटा रीसेट करा',
    hackathonNote: 'हॅकाथॉन प्रोटोटाइप • लोकल स्टोरेज सक्षम',
    language: 'भाषा',
    selectLanguage: 'भाषा निवडा',

    navDashboard: 'डॅशबोर्ड',
    navDashboardDesc: 'मुख्य तपशील आणि विहंगावलोकन',
    navChat: 'AI सहाय्यक',
    navChatDesc: 'जेमिनी व्यवसाय सल्लागार',
    navInventory: 'इन्व्हेंटरी व्यवस्थापन',
    navInventoryDesc: 'उत्पादने आणि स्टॉक पातळी',
    navSales: 'विक्री विश्लेषण',
    navSalesDesc: 'ट्रेन्ड्स आणि नफा चार्ट',
    navSuggestions: 'स्मार्ट सल्ले',
    navSuggestionsDesc: 'जेमिनी कृती योजना',
    geminiPowered: 'जेमिनी AI समर्थित',
    geminiDesc: 'रिअल-टाइम व्यवसाय माहिती, रीऑर्डर सूचना आणि स्वयंचलित किंमत रणनीती.',

    recordQuickSale: 'त्वरित विक्री नोंदवा',
    saleBtnShort: 'विक्री',
    addProduct: 'उत्पादन जोडा',
    askGemini: 'जेमिनी AI ला विचारा',

    titleDashboard: 'दुकानाचे डॅशबोर्ड',
    subtitleDashboard: 'थेट विक्री, स्टॉक स्थिती आणि त्वरित व्यावसायिक माहिती',
    titleInventory: 'इन्व्हेंटरी (स्टॉक) व्यवस्थापन',
    subtitleInventory: 'खरेदी किंमत, विक्री किंमत, नफा मार्जिन आणि स्टॉक अलर्ट तपासा',
    titleSales: 'विक्री आणि नफा विश्लेषण',
    subtitleSales: 'दैनिक महसूल, खर्च तपशील, मार्जिन आणि सर्वाधिक खपाची उत्पादने',
    titleSuggestions: 'स्मार्ट व्यवसाय सल्ले',
    subtitleSuggestions: 'विक्री आणि नफा वाढवण्यासाठी AI-निर्मित व्यावहारिक शिफारसी',
    titleChat: 'AI व्यवसाय सल्लागार',
    subtitleChat: 'किंमत, रीऑर्डर, मार्जिन आणि रोख प्रवाह यावर जेमिनीशी चर्चा करा',

    totalSales: 'एकूण विक्री',
    totalProducts: 'एकूण उत्पादने',
    lowStockProducts: 'कमी स्टॉक असलेली उत्पादने',
    estimatedProfit: 'अंदाजे नफा',
    vsPrevious: '+14.2% मागील कालावधीपेक्षा जास्त',
    recordedDays: 'नोंदवलेल्या व्यावसायिक दिवसांत',
    unitsInInventory: 'इन्व्हेंटरीमधील एकूण युनिट्स',
    retailInvValue: 'किरकोळ इन्व्हेंटरी मूल्य',
    underThreshold: 'किमान सुरक्षा मर्यादेपेक्षा कमी',
    allHealthy: 'सर्व स्टॉक पातळी व्यवस्थित आहे',
    outOfStockRightNow: 'सध्या स्टॉक संपला आहे',
    noDepleted: '0 संपलेली उत्पादने',
    grossMargin: 'एकूण मार्जिन (ग्रॉस मार्जिन)',
    cogs: 'विकलेल्या मालाची खरेदी किंमत',

    lowStockWarning: 'कमी स्टॉक सूचना: {count} उत्पादनांना तातडीने रीऑर्डरची गरज आहे',
    viewAndRestock: 'पहा आणि स्टॉक भरा',
    recentSalesProfit: 'अलीकडील दैनिक विक्री आणि नफा',
    last7DaysOverview: 'मागील 7 दिवसांचे कार्यप्रदर्शन',
    revenue: 'महसूल',
    profit: 'नफा',
    fullAnalysis: 'संपूर्ण विश्लेषण',
    avgDailySales: 'सरासरी दैनिक विक्री',
    estDailyProfit: 'अंदाजे दैनिक नफा',
    advisorReady: 'तयार',
    aiAdvisorHeading: 'शॉपमेट AI सल्लागार',
    aiAdvisorPitch: 'किंमत, रीऑर्डर किंवा नफा वाढवण्याबाबत काही प्रश्न आहेत? AI ला विचारा:',
    openAiChatbot: 'संपूर्ण AI चॅटबॉट उघडा',
    lowStockReplenish: 'कमी स्टॉक त्वरित भरणे',
    manageAll: 'सर्व व्यवस्थापित करा',
    plus10Units: '+10 युनिट्स',
    allHealthyMsg: 'उत्तम! सर्व उत्पादनांमध्ये पुरेसा स्टॉक उपलब्ध आहे.',
    topPerforming: 'सर्वाधिक खपाची उत्पादने',
    viewRankings: 'रँकिंग पहा',
    unitsSold: 'विकलेली युनिट्स',

    totalCatalogSkus: 'एकूण उत्पादने (SKU)',
    unitsOnHand: 'उपलब्ध युनिट्स',
    lowStockAlerts: 'कमी स्टॉक अलर्ट',
    needingRestock: 'रीऑर्डर आवश्यक असलेल्या वस्तू',
    inventoryCostVal: 'इन्व्हेंटरी खरेदी खर्च',
    investedCapital: 'एकूण गुंतवलेले भांडवल',
    retailSalesVal: 'किरकोळ विक्री मूल्य',
    potentialProfit: 'संभाव्य नफा',
    searchPlaceholder: 'उत्पादनाचे नाव, SKU किंवा वर्गवारी शोधा...',
    exportCsv: 'CSV डाउनलोड करा',
    addNewProduct: 'नवीन उत्पादन जोडा',
    allItems: 'सर्व वस्तू',
    lowStockFilter: 'कमी स्टॉक',
    healthyFilter: 'पुरेसा स्टॉक',
    allCategories: 'सर्व वर्गवाऱ्या',
    thProductName: 'उत्पादनाचे नाव आणि SKU',
    thCategory: 'वर्गवारी',
    thQuantity: 'प्रमाण',
    thPurchasePrice: 'खरेदी किंमत',
    thSellingPrice: 'विक्री किंमत',
    thProfitMargin: 'नफा मार्जिन',
    thStockStatus: 'स्टॉक स्थिती',
    thActions: 'कृती',
    statusHealthy: 'पुरेसे',
    statusLowStock: 'कमी स्टॉक',
    statusOutOfStock: 'स्टॉक संपला',
    noProductsMatch: 'कोणतेही उत्पादन सापडले नाही',
    tryClearingSearch: 'शोध साफ करा किंवा नवीन उत्पादन जोडा.',
    leftUnits: 'शिल्लक',
    marginUnit: 'मार्जिन',

    catBeverages: 'पेये',
    catDairy: 'दुग्धजन्य पदार्थ',
    catBakery: 'बेकरी',
    catPantry: 'किराणा सामान',
    catSnacks: 'नाश्ता आणि स्नॅक्स',
    catHousehold: 'घरगुती वस्तू',
    catGeneral: 'सामान्य',

    revenueProfitPerf: 'महसूल आणि नफा कामगिरी',
    salesSubtitle: 'लहान किरकोळ दुकानांसाठी रिअल-टाइम विश्लेषण',
    last7Days: 'मागील 7 दिवस',
    last14Days: 'मागील 14 दिवस',
    simulateSale: 'विक्री सिम्युलेशन',
    periodRevenue: 'या कालावधीतील महसूल',
    estGrossProfit: 'अंदाजे एकूण नफा',
    totalOrders: 'एकूण ग्राहक ऑर्डर्स',
    customersPerDay: 'ग्राहक / दिवस',
    avgBasketSize: 'सरासरी बिल रक्कम',
    avgRevPerOrder: 'प्रत्येक चेकआउटमागे सरासरी महसूल',
    chartHeading: 'दैनिक विक्री आणि नफा चार्ट',
    chartSub: 'दैनिक तपशील आणि मार्जिन पाहण्यासाठी कोणत्याही दिवसावर कर्सर न्या',
    bestSellingHeading: 'सर्वाधिक विक्री होणारी उत्पादने',
    rankedByRevenue: 'कमाईच्या आधारावर क्रमवारी',
    salesByCategory: 'वर्गवारीनुसार विक्री',
    distributionPct: 'वाटा %',
    categoryInsightTitle: 'वर्गवारी इनसाइट:',
    categoryInsightDesc: 'पेये आणि बेकरी वस्तू नियमित ग्राहक आणतात. पेयांजवळ स्नॅक्स ठेवल्यास विक्रीत 15% वाढ होऊ शकते.',

    geminiRecommendations: 'जेमिनी AI व्यवसाय शिफारसी',
    geminiSub: 'तुमच्या दुकानासाठी 3 सर्वोत्तम धोरणे तयार करण्यासाठी AI तुमच्या स्टॉक आणि विक्रीच्या वेगाचे विश्लेषण करते.',
    lastAnalyzed: 'शेवटचे विश्लेषण',
    runNewAnalysis: 'नवीन AI विश्लेषण चालवा',
    analyzingStore: 'दुकानाचा डेटा विश्लेषित केला जात आहे...',
    priority: 'प्राधान्य',
    impactLabel: 'अपेक्षित परिणाम',
    executionSteps: 'अंमलबजावणीच्या पायऱ्या',
    copySteps: 'कॉपी करा',
    copied: 'कॉपी झाले!',
    needCustomAdvice: 'विशेष सल्ला हवा आहे?',
    needCustomDesc: 'स्थानिक पुरवठादार किंवा सणासुदीच्या ऑफर्सबद्दल विचारण्यासाठी AI व्यवसाय सहाय्यक वापरा.',
    chatWithAi: 'शॉपमेट AI सोबत चॅट करा',

    chatHeaderTitle: 'शॉपमेट AI व्यवसाय सल्लागार',
    chatContextSummary: 'थेट माहिती: {products} उत्पादने • {lowStock} कमी स्टॉक • {sales} एकूण विक्री',
    clearChat: 'चॅट साफ करा',
    quickAsk: 'त्वरित प्रश्न:',
    chatInputPlaceholder: 'विक्री, किंमत, स्टॉक किंवा नफ्याबद्दल मराठीतही विचारा...',
    chatFooterNote: 'शॉपमेट AI ला तुमच्या दुकानातील सध्याचा स्टॉक आणि नफ्याची आकडेवारी माहित आहे.',
    chatThinking: 'शॉपमेट AI शिफारशींची गणना करत आहे...',
    welcomeMessage: `नमस्कार! मी **शॉपमेट AI**, तुमचा वैयक्तिक किरकोळ व्यवसाय सल्लागार.\n\nमी तुमच्या दुकानाच्या थेट डेटाशी जोडलेला आहे:\n• **कॅटलॉग:** {products} उत्पादने (एकूण {units} युनिट्स)\n• **कमी स्टॉक सूचना:** {lowStock} वस्तू संपत आल्या आहेत\n• **एकूण विक्री:** {sales} (**{margin}% अंदाजे नफा मार्जिन**)\n\nतुम्ही थेट मराठीत **किंमत धोरणे**, **स्टॉक रीऑर्डर**, **विक्री वाढवणे** किंवा **ऑफर्स** बद्दल विचारू शकता!`,
    quickPrompt1: 'स्टॉक संपू नये म्हणून मी आज कोणत्या वस्तू मागवल्या पाहिजेत?',
    quickPrompt2: 'मी माझ्या दुकानाचे नफा मार्जिन कसे वाढवू शकतो?',
    quickPrompt3: 'या वीकेंडसाठी चांगला नफा मिळवून देणारा कॉम्बो सुचवा.',
    quickPrompt4: 'हळूहळू विकल्या जाणाऱ्या वस्तूंचे काय करावे?',
    quickPrompt5: 'वेगाने विकल्या जाणाऱ्या वस्तूंचा किती सेफ्टी स्टॉक ठेवावा?',

    modalEditTitle: 'उत्पादन तपशील संपादित करा',
    modalAddTitle: 'कॅटलॉगमध्ये नवीन उत्पादन जोडा',
    modalDesc: 'किंमत, प्रारंभिक स्टॉक आणि रीऑर्डर सूचना सेट करा',
    labelProductName: 'उत्पादनाचे नाव *',
    labelCategory: 'वर्गवारी',
    labelSku: 'SKU / बारकोड *',
    labelInitialStock: 'प्रारंभिक स्टॉक प्रमाण',
    labelUnit: 'पॅकेजिंग युनिट',
    labelMinAlert: 'किमान अलर्ट प्रमाण',
    labelPurchasePrice: 'खरेदी किंमत (खर्च) ₹',
    labelSellingPrice: 'विक्री किंमत (किरकोळ) ₹',
    unitProfitEst: 'अंदाजे युनिट नफा:',
    grossMarginLabel: 'नफा मार्जिन:',
    cancel: 'रद्द करा',
    saveChanges: 'बदल जतन करा',
    createProduct: 'उत्पादन तयार करा',
    customCategoryPrompt: '+ नवीन वर्गवारी जोडा',

    quickSaleTitle: 'ग्राहक विक्री नोंदवा',
    quickSaleDesc: 'दुकानाची कमाई, नफा आणि स्टॉक लगेच अपडेट होईल',
    selectProduct: 'उत्पादन निवडा',
    currentlyInStock: 'सध्या स्टॉकमध्ये:',
    unitsSoldLabel: 'विकलेली युनिट्स',
    saleTotal: 'एकूण विक्री:',
    costOfGoods: 'मालाचा खर्च:',
    netProfitGenerated: 'निव्वळ नफा:',
    confirmSaleBtn: 'विक्री पुष्टी करा आणि आकडे अपडेट करा',

    deleteTitle: 'उत्पादन हटवायचे का?',
    deleteConfirmText: 'तुम्हाला खात्री आहे का की तुम्ही {name} कॅटलॉगमधून काढून टाकू इच्छिता? यामुळे सर्व नोंदी हटतील.',
    deleteBtn: 'उत्पादन हटवा',

    toastResetSuccess: 'नमुना डेटा यशस्वीरित्या पुनर्संचयित केला!',
    toastAdded: '"{name}" इन्व्हेंटरीमध्ये जोडले गेले!',
    toastUpdated: '"{name}" यशस्वीरित्या अपडेट केले!',
    toastDeleted: 'कॅटलॉगमधून "{name}" काढले गेले',
    toastReplenished: '{name} ची +10 युनिट्स जोडली!',
    toastSaleRecorded: '{qty}x {name} ची विक्री नोंदवली (+{profit} नफा)!',
    toastAiRefreshed: 'जेमिनी AI ने 3 व्यवसाय सल्ले अपडेट केले!',
    toastInsufficientStock: 'अपुरा स्टॉक: फक्त {qty} शिल्लक आहे',
  },
};
