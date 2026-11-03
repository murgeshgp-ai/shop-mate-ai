import { Product, DailySale, BestSeller } from '../types';

export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);
};

export const formatNumber = (val: number): string => {
  return new Intl.NumberFormat('en-IN').format(val || 0);
};

export const formatIndianDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};

export const calculateMargin = (cost: number, price: number): { dollar: number; percent: number } => {
  const dollar = price - cost;
  const percent = price > 0 ? (dollar / price) * 100 : 0;
  return {
    dollar: Math.max(0, dollar),
    percent: Math.max(0, Math.round(percent * 10) / 10),
  };
};

export const calculateShopStats = (products: Product[], dailySales: DailySale[]) => {
  const totalProducts = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.quantity || 0), 0);
  const lowStockProducts = products.filter(p => (p.quantity || 0) <= (p.minStockThreshold || 10));
  const outOfStockProducts = products.filter(p => (p.quantity || 0) === 0);

  const inventoryCostValue = products.reduce((acc, p) => acc + (p.quantity || 0) * (p.purchasePrice || 0), 0);
  const inventoryRetailValue = products.reduce((acc, p) => acc + (p.quantity || 0) * (p.sellingPrice || 0), 0);
  const potentialInventoryProfit = inventoryRetailValue - inventoryCostValue;

  const totalSales = dailySales.reduce((acc, d) => acc + d.sales, 0);
  const totalCost = dailySales.reduce((acc, d) => acc + d.cost, 0);
  const estimatedProfit = dailySales.reduce((acc, d) => acc + d.profit, 0);
  const marginPercent = totalSales > 0 ? Math.round((estimatedProfit / totalSales) * 1000) / 10 : 0;

  // Best sellers based on authentic Indian grocery items
  const topSellers: BestSeller[] = [
    {
      id: 'prod-1',
      name: 'Aashirvaad Shudh Chakki Atta (5kg)',
      category: 'Pantry',
      unitsSold: 142,
      revenue: 33370.00,
      profit: 5680.00,
      marginPercent: 17.0,
    },
    {
      id: 'prod-4',
      name: 'Nandini Pure Ghee (500ml)',
      category: 'Dairy',
      unitsSold: 98,
      revenue: 32340.00,
      profit: 4900.00,
      marginPercent: 15.2,
    },
    {
      id: 'prod-8',
      name: 'Tata Tea Premium Desh Ki Chai (500g)',
      category: 'Beverages',
      unitsSold: 124,
      revenue: 27280.00,
      profit: 5580.00,
      marginPercent: 20.5,
    },
    {
      id: 'prod-3',
      name: 'Fortune Sunlite Refined Sunflower Oil (1L)',
      category: 'Pantry',
      unitsSold: 165,
      revenue: 23925.00,
      profit: 4455.00,
      marginPercent: 18.6,
    },
    {
      id: 'prod-10',
      name: 'India Gate Feast Rozzana Basmati Rice (5kg)',
      category: 'Pantry',
      unitsSold: 52,
      revenue: 23400.00,
      profit: 4680.00,
      marginPercent: 20.0,
    },
  ];

  return {
    totalProducts,
    totalStockUnits,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    outOfStockCount: outOfStockProducts.length,
    inventoryCostValue,
    inventoryRetailValue,
    potentialInventoryProfit,
    totalSales,
    totalCost,
    estimatedProfit,
    marginPercent,
    topSellers,
  };
};
