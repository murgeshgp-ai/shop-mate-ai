import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_DAILY_SALES,
  INITIAL_BILLS,
  INITIAL_EXPENSES,
  INITIAL_CUSTOMERS,
} from '../src/data/sampleData.ts';
import {
  Product,
  Supplier,
  PurchaseOrder,
  DailySale,
  ProductBatch,
  Bill,
  BillItem,
  Expense,
  FinancialSummary,
  Customer,
} from '../src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.resolve(DB_DIR, 'shopmate_db.json');

export interface DatabaseSchema {
  products: Product[];
  suppliers: Supplier[];
  customers: Customer[];
  purchases: PurchaseOrder[];
  dailySales: DailySale[];
  bills: Bill[];
  expenses: Expense[];
  lastUpdated: string;
}

class Database {
  private cache: DatabaseSchema | null = null;

  async init(): Promise<DatabaseSchema> {
    try {
      await fs.mkdir(DB_DIR, { recursive: true });
      try {
        const raw = await fs.readFile(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.suppliers)) {
          this.cache = {
            products: parsed.products,
            suppliers: parsed.suppliers,
            customers: Array.isArray(parsed.customers) && parsed.customers.length > 0 ? parsed.customers : INITIAL_CUSTOMERS,
            purchases: parsed.purchases || INITIAL_PURCHASE_ORDERS,
            dailySales: parsed.dailySales || INITIAL_DAILY_SALES,
            bills: Array.isArray(parsed.bills) ? parsed.bills : INITIAL_BILLS,
            expenses: Array.isArray(parsed.expenses) ? parsed.expenses : INITIAL_EXPENSES,
            lastUpdated: parsed.lastUpdated || new Date().toISOString(),
          };
          return this.cache;
        }
      } catch {
        // file doesn't exist or is invalid, will seed
      }

      // Seed with initial data
      this.cache = {
        products: INITIAL_PRODUCTS,
        suppliers: INITIAL_SUPPLIERS,
        customers: INITIAL_CUSTOMERS,
        purchases: INITIAL_PURCHASE_ORDERS,
        dailySales: INITIAL_DAILY_SALES,
        bills: INITIAL_BILLS,
        expenses: INITIAL_EXPENSES,
        lastUpdated: new Date().toISOString(),
      };
      await this.persist();
      return this.cache;
    } catch (err) {
      console.error('Error initializing database:', err);
      this.cache = {
        products: INITIAL_PRODUCTS,
        suppliers: INITIAL_SUPPLIERS,
        customers: INITIAL_CUSTOMERS,
        purchases: INITIAL_PURCHASE_ORDERS,
        dailySales: INITIAL_DAILY_SALES,
        bills: INITIAL_BILLS,
        expenses: INITIAL_EXPENSES,
        lastUpdated: new Date().toISOString(),
      };
      return this.cache;
    }
  }

  private async persist(): Promise<void> {
    if (!this.cache) return;
    this.cache.lastUpdated = new Date().toISOString();
    try {
      // Atomic write via temp file
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      await fs.writeFile(tempFile, JSON.stringify(this.cache, null, 2), 'utf-8');
      await fs.rename(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  // ==================== PRODUCTS ====================
  async getProducts(): Promise<Product[]> {
    if (!this.cache) await this.init();
    return this.cache!.products;
  }

  async saveProduct(productData: Partial<Product> & { name: string }): Promise<Product> {
    if (!this.cache) await this.init();

    if (productData.id) {
      const index = this.cache!.products.findIndex((p) => p.id === productData.id);
      if (index !== -1) {
        const existing = this.cache!.products[index];
        const updated: Product = {
          ...existing,
          ...productData,
          id: existing.id,
          quantity: Number(productData.quantity ?? existing.quantity),
          purchasePrice: Number(productData.purchasePrice ?? existing.purchasePrice),
          sellingPrice: Number(productData.sellingPrice ?? existing.sellingPrice),
          minStockThreshold: Number(productData.minStockThreshold ?? existing.minStockThreshold ?? 10),
        };
        this.cache!.products[index] = updated;
        await this.persist();
        return updated;
      }
    }

    // New product
    const newProduct: Product = {
      id: productData.id || `prod-${Date.now()}`,
      name: productData.name,
      category: productData.category || 'General',
      sku: productData.sku || `SKU-${Date.now().toString().slice(-4)}`,
      quantity: Number(productData.quantity || 0),
      purchasePrice: Number(productData.purchasePrice || 0),
      sellingPrice: Number(productData.sellingPrice || 0),
      minStockThreshold: Number(productData.minStockThreshold || 10),
      unit: productData.unit || 'unit',
      expiryDate: productData.expiryDate || undefined,
      batchNumber: productData.batchNumber || undefined,
      batches: productData.batches || (productData.expiryDate ? [{
        id: `b-${Date.now()}`,
        batchNumber: productData.batchNumber || `BAT-${Date.now().toString().slice(-4)}`,
        quantity: Number(productData.quantity || 0),
        expiryDate: productData.expiryDate,
        purchasePrice: Number(productData.purchasePrice || 0),
        purchaseDate: new Date().toISOString().split('T')[0],
      }] : []),
      supplierId: productData.supplierId || undefined,
      supplierName: productData.supplierName || undefined,
      lastRestocked: new Date().toISOString().split('T')[0],
    };

    this.cache!.products.unshift(newProduct);
    await this.persist();
    return newProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (!this.cache) await this.init();
    const initialLen = this.cache!.products.length;
    this.cache!.products = this.cache!.products.filter((p) => p.id !== id);
    if (this.cache!.products.length !== initialLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  // ==================== SUPPLIERS ====================
  async getSuppliers(): Promise<Supplier[]> {
    if (!this.cache) await this.init();
    return this.cache!.suppliers;
  }

  async saveSupplier(supplierData: Partial<Supplier> & { name: string; phone: string }): Promise<Supplier> {
    if (!this.cache) await this.init();

    if (supplierData.id) {
      const index = this.cache!.suppliers.findIndex((s) => s.id === supplierData.id);
      if (index !== -1) {
        const existing = this.cache!.suppliers[index];
        const updated: Supplier = {
          ...existing,
          ...supplierData,
          id: existing.id,
        };
        this.cache!.suppliers[index] = updated;
        await this.persist();
        return updated;
      }
    }

    const newSupplier: Supplier = {
      id: supplierData.id || `supp-${Date.now()}`,
      name: supplierData.name,
      phone: supplierData.phone,
      email: supplierData.email || '',
      address: supplierData.address || '',
      contactPerson: supplierData.contactPerson || '',
      category: supplierData.category || 'General Wholesale',
      notes: supplierData.notes || '',
      suppliedProductIds: supplierData.suppliedProductIds || [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.cache!.suppliers.push(newSupplier);
    await this.persist();
    return newSupplier;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    if (!this.cache) await this.init();
    const initialLen = this.cache!.suppliers.length;
    this.cache!.suppliers = this.cache!.suppliers.filter((s) => s.id !== id);
    if (this.cache!.suppliers.length !== initialLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  // ==================== CUSTOMERS (Phase 4, Step 1) ====================
  async getCustomers(): Promise<Customer[]> {
    if (!this.cache) await this.init();
    return this.cache!.customers || [];
  }

  async getCustomer(id: string): Promise<Customer | null> {
    if (!this.cache) await this.init();
    return (this.cache!.customers || []).find((c) => c.id === id) || null;
  }

  async saveCustomer(customerData: Partial<Customer> & { name: string; phone: string }): Promise<Customer> {
    if (!this.cache) await this.init();

    const name = customerData.name?.trim();
    const phone = customerData.phone?.trim();

    if (!name) {
      throw new Error('Customer name is required.');
    }
    if (!phone) {
      throw new Error('Customer phone number is required.');
    }

    if (customerData.id) {
      const index = (this.cache!.customers || []).findIndex((c) => c.id === customerData.id);
      if (index !== -1) {
        const existing = this.cache!.customers[index];
        const updated: Customer = {
          ...existing,
          ...customerData,
          name,
          phone,
          address: customerData.address !== undefined ? customerData.address.trim() : existing.address,
          email: customerData.email !== undefined ? customerData.email.trim() : existing.email,
          notes: customerData.notes !== undefined ? customerData.notes.trim() : existing.notes,
          status: customerData.status || existing.status || 'active',
          id: existing.id,
          createdAt: existing.createdAt,
        };
        this.cache!.customers[index] = updated;
        await this.persist();
        return updated;
      }
    }

    // Check for ID collision
    let newId = customerData.id?.trim();
    if (newId) {
      const existingWithId = (this.cache!.customers || []).some((c) => c.id === newId);
      if (existingWithId) {
        throw new Error(`Customer ID "${newId}" already exists. Customer IDs must be unique.`);
      }
    } else {
      newId = `cust-${Date.now()}`;
    }

    const newCustomer: Customer = {
      id: newId,
      name,
      phone,
      address: customerData.address?.trim() || '',
      email: customerData.email?.trim() || '',
      notes: customerData.notes?.trim() || '',
      createdAt: customerData.createdAt || new Date().toISOString().split('T')[0],
      status: customerData.status || 'active',
    };

    if (!Array.isArray(this.cache!.customers)) {
      this.cache!.customers = [];
    }

    this.cache!.customers.unshift(newCustomer);
    await this.persist();
    return newCustomer;
  }

  async archiveCustomer(id: string, archive: boolean = true): Promise<Customer> {
    if (!this.cache) await this.init();
    const index = (this.cache!.customers || []).findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Customer with ID ${id} not found.`);
    }

    const customer = this.cache!.customers[index];
    const updated: Customer = {
      ...customer,
      status: archive ? 'archived' : 'active',
    };

    this.cache!.customers[index] = updated;
    await this.persist();
    return updated;
  }

  async deleteCustomer(id: string): Promise<{ success: boolean; archived: boolean; message: string }> {
    if (!this.cache) await this.init();
    const customer = (this.cache!.customers || []).find((c) => c.id === id);
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found.`);
    }

    // Check for transaction history in bills
    const bills = this.cache!.bills || [];
    const hasTransactions = bills.some(
      (b) =>
        (b.customerId && b.customerId === id) ||
        (b.customerPhone && b.customerPhone === customer.phone) ||
        (b.customerName && b.customerName.toLowerCase() === customer.name.toLowerCase())
    );

    if (hasTransactions) {
      // Archive customer to preserve financial history and audit trail
      const index = this.cache!.customers.findIndex((c) => c.id === id);
      this.cache!.customers[index] = {
        ...customer,
        status: 'archived',
      };
      await this.persist();
      return {
        success: true,
        archived: true,
        message: 'Customer has transaction history and was archived instead of permanently deleted to preserve billing records.',
      };
    }

    // If zero transactions, safely remove
    this.cache!.customers = this.cache!.customers.filter((c) => c.id !== id);
    await this.persist();
    return {
      success: true,
      archived: false,
      message: 'Customer deleted successfully.',
    };
  }

  async getCustomerProfile(id: string): Promise<{
    customer: Customer;
    totalPurchases: number;
    totalPaid: number;
    outstandingCredit: number;
    transactions: Bill[];
  }> {
    if (!this.cache) await this.init();
    const customer = (this.cache!.customers || []).find((c) => c.id === id);
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found.`);
    }

    const bills = this.cache!.bills || [];
    const customerBills = bills.filter(
      (b) =>
        (b.customerId && b.customerId === id) ||
        (b.customerPhone && b.customerPhone === customer.phone) ||
        (b.customerName && b.customerName.toLowerCase() === customer.name.toLowerCase())
    );

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
      customer,
      totalPurchases: Math.round(totalPurchases * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      outstandingCredit: Math.round(outstandingCredit * 100) / 100,
      transactions: customerBills,
    };
  }

  // ==================== PURCHASES ====================
  async getPurchases(): Promise<PurchaseOrder[]> {
    if (!this.cache) await this.init();
    return this.cache!.purchases;
  }

  async savePurchase(orderData: Partial<PurchaseOrder> & { supplierId: string }): Promise<PurchaseOrder> {
    if (!this.cache) await this.init();

    const items = (orderData.items || []).map((it) => {
      const qty = Number(it.quantity || 0);
      const price = Number(it.unitPrice || 0);
      return {
        ...it,
        quantity: qty,
        unitPrice: price,
        total: Math.round(qty * price * 100) / 100,
      };
    });

    const calculatedTotal = items.reduce((sum, it) => sum + it.total, 0);

    if (orderData.id) {
      const index = this.cache!.purchases.findIndex((p) => p.id === orderData.id);
      if (index !== -1) {
        const existing = this.cache!.purchases[index];
        const updated: PurchaseOrder = {
          ...existing,
          ...orderData,
          items,
          totalAmount: calculatedTotal,
        };
        this.cache!.purchases[index] = updated;
        await this.persist();
        return updated;
      }
    }

    const orderNumber = orderData.orderNumber || `PO-2026-${String(this.cache!.purchases.length + 101).padStart(3, '0')}`;
    const newOrder: PurchaseOrder = {
      id: orderData.id || `po-${Date.now()}`,
      orderNumber,
      supplierId: orderData.supplierId,
      supplierName: orderData.supplierName || 'Unknown Supplier',
      invoiceNumber: orderData.invoiceNumber || `INV-${Date.now().toString().slice(-5)}`,
      orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
      expectedDate: orderData.expectedDate || undefined,
      receivedDate: orderData.receivedDate || undefined,
      status: orderData.status || 'pending',
      items,
      totalAmount: calculatedTotal,
      stockUpdated: orderData.stockUpdated || false,
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
    };

    this.cache!.purchases.unshift(newOrder);
    await this.persist();
    return newOrder;
  }

  async receivePurchase(orderId: string): Promise<{ order: PurchaseOrder; updatedProducts: Product[] }> {
    if (!this.cache) await this.init();

    const orderIndex = this.cache!.purchases.findIndex((p) => p.id === orderId);
    if (orderIndex === -1) {
      throw new Error(`Purchase order ${orderId} not found`);
    }

    const order = this.cache!.purchases[orderIndex];

    if (order.stockUpdated) {
      throw new Error(`Purchase order ${order.orderNumber} has already been received and stock updated.`);
    }

    const nowStr = new Date().toISOString().split('T')[0];
    const updatedProducts: Product[] = [];

    for (const item of order.items) {
      const productIndex = this.cache!.products.findIndex((p) => p.id === item.productId);
      if (productIndex !== -1) {
        const product = this.cache!.products[productIndex];
        const addedQty = Number(item.quantity) || 0;

        const newBatches: ProductBatch[] = Array.isArray(product.batches) ? [...product.batches] : [];
        const batchNum = item.batchNumber || `BAT-${order.orderNumber}-${nowStr}`;
        const existingBatchIndex = newBatches.findIndex((b) => b.batchNumber === batchNum);

        if (existingBatchIndex !== -1) {
          newBatches[existingBatchIndex] = {
            ...newBatches[existingBatchIndex],
            quantity: newBatches[existingBatchIndex].quantity + addedQty,
            expiryDate: item.expiryDate || newBatches[existingBatchIndex].expiryDate,
            purchasePrice: item.unitPrice || newBatches[existingBatchIndex].purchasePrice,
          };
        } else {
          newBatches.push({
            id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            batchNumber: batchNum,
            quantity: addedQty,
            expiryDate: item.expiryDate || product.expiryDate || nowStr,
            purchasePrice: item.unitPrice || product.purchasePrice,
            purchaseDate: nowStr,
          });
        }

        const validDates = newBatches
          .map((b) => b.expiryDate)
          .filter(Boolean)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const updatedProduct: Product = {
          ...product,
          quantity: product.quantity + addedQty,
          purchasePrice: item.unitPrice > 0 ? item.unitPrice : product.purchasePrice,
          lastRestocked: nowStr,
          supplierId: order.supplierId,
          supplierName: order.supplierName,
          batchNumber: batchNum,
          expiryDate: validDates[0] || product.expiryDate,
          batches: newBatches,
        };

        this.cache!.products[productIndex] = updatedProduct;
        updatedProducts.push(updatedProduct);
      }
    }

    const updatedOrder: PurchaseOrder = {
      ...order,
      status: 'received',
      receivedDate: nowStr,
      stockUpdated: true,
    };

    this.cache!.purchases[orderIndex] = updatedOrder;
    await this.persist();

    return { order: updatedOrder, updatedProducts };
  }

  async deletePurchase(id: string): Promise<boolean> {
    if (!this.cache) await this.init();
    const initialLen = this.cache!.purchases.length;
    this.cache!.purchases = this.cache!.purchases.filter((p) => p.id !== id);
    if (this.cache!.purchases.length !== initialLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  // ==================== PHASE 3: BILLS & FEFO STOCK DEDUCTION ====================

  async getBills(): Promise<Bill[]> {
    if (!this.cache) await this.init();
    return this.cache!.bills || [];
  }

  async getBill(id: string): Promise<Bill | null> {
    if (!this.cache) await this.init();
    return (this.cache!.bills || []).find((b) => b.id === id) || null;
  }

  async createBill(billData: Partial<Bill> & { items: BillItem[]; paymentMethod: 'cash' | 'upi' | 'credit' }): Promise<{ bill: Bill; updatedProducts: Product[] }> {
    if (!this.cache) await this.init();

    if (!Array.isArray(billData.items) || billData.items.length === 0) {
      throw new Error('At least one item is required to generate a bill.');
    }

    const updatedProducts: Product[] = [];
    const processedItems: BillItem[] = [];
    let totalCogs = 0;
    let totalSubtotal = 0;

    // Validate stock and prepare FEFO deduction
    for (const reqItem of billData.items) {
      const prodIndex = this.cache!.products.findIndex((p) => p.id === reqItem.productId);
      if (prodIndex === -1) {
        throw new Error(`Product ${reqItem.productName} not found in inventory.`);
      }

      const product = this.cache!.products[prodIndex];
      const qtyToDeduct = Number(reqItem.quantity) || 1;

      if (product.quantity < qtyToDeduct) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.quantity}, Requested: ${qtyToDeduct}`);
      }

      // FEFO Batch Deduction
      let remainingDeduct = qtyToDeduct;
      const batchesDeducted: { batchNumber: string; quantity: number; expiryDate?: string }[] = [];
      const newBatches: ProductBatch[] = Array.isArray(product.batches) ? [...product.batches] : [];

      if (newBatches.length > 0) {
        // Sort batches by earliest expiry date (FEFO)
        newBatches.sort((a, b) => new Date(a.expiryDate || '9999-12-31').getTime() - new Date(b.expiryDate || '9999-12-31').getTime());

        for (let i = 0; i < newBatches.length && remainingDeduct > 0; i++) {
          const batch = newBatches[i];
          if (batch.quantity > 0) {
            const deduct = Math.min(batch.quantity, remainingDeduct);
            batch.quantity -= deduct;
            remainingDeduct -= deduct;
            batchesDeducted.push({
              batchNumber: batch.batchNumber,
              quantity: deduct,
              expiryDate: batch.expiryDate,
            });
          }
        }
      }

      // If product has no explicit batches or remaining quantity unassigned
      if (remainingDeduct > 0 && product.batchNumber) {
        batchesDeducted.push({
          batchNumber: product.batchNumber,
          quantity: remainingDeduct,
          expiryDate: product.expiryDate,
        });
      }

      // Recalculate earliest active expiry date for product
      const activeBatches = newBatches.filter((b) => b.quantity > 0);
      const earliestActiveDate = activeBatches.length > 0
        ? activeBatches.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0].expiryDate
        : product.expiryDate;

      // Update product record
      const updatedProduct: Product = {
        ...product,
        quantity: product.quantity - qtyToDeduct,
        batches: newBatches,
        expiryDate: earliestActiveDate,
      };

      this.cache!.products[prodIndex] = updatedProduct;
      updatedProducts.push(updatedProduct);

      // Line calculations
      const unitRate = Number(reqItem.unitPrice ?? product.sellingPrice);
      const costRate = Number(product.purchasePrice || 0);
      const lineTotal = Math.round(qtyToDeduct * unitRate * 100) / 100;
      const lineCost = Math.round(qtyToDeduct * costRate * 100) / 100;

      totalSubtotal += lineTotal;
      totalCogs += lineCost;

      processedItems.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        unit: product.unit,
        quantity: qtyToDeduct,
        unitPrice: unitRate,
        costPrice: costRate,
        total: lineTotal,
        batchesDeducted,
      });
    }

    const discountAmount = Math.max(0, Number(billData.discount || 0));
    const finalPayable = Math.max(0, Math.round((totalSubtotal - discountAmount) * 100) / 100);
    const profit = Math.round((finalPayable - totalCogs) * 100) / 100;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const invoiceNumber = billData.invoiceNumber || `INV-${now.getFullYear()}-${String(this.cache!.bills.length + 1001).padStart(4, '0')}`;

    const newBill: Bill = {
      id: billData.id || `bill-${Date.now()}`,
      invoiceNumber,
      date: billData.date || dateStr,
      time: timeStr,
      customerName: billData.customerName?.trim() || undefined,
      customerPhone: billData.customerPhone?.trim() || undefined,
      items: processedItems,
      subtotal: Math.round(totalSubtotal * 100) / 100,
      discount: discountAmount,
      totalAmount: finalPayable,
      costOfGoods: Math.round(totalCogs * 100) / 100,
      profit,
      paymentMethod: billData.paymentMethod,
      paymentStatus: billData.paymentMethod === 'credit' ? 'pending' : 'paid',
      notes: billData.notes?.trim() || undefined,
      createdAt: now.toISOString(),
    };

    this.cache!.bills.unshift(newBill);

    // Update today's entry in dailySales
    if (this.cache!.dailySales && this.cache!.dailySales.length > 0) {
      const todayEntryIdx = this.cache!.dailySales.length - 1;
      const today = this.cache!.dailySales[todayEntryIdx];
      this.cache!.dailySales[todayEntryIdx] = {
        ...today,
        sales: Math.round((today.sales + finalPayable) * 100) / 100,
        cost: Math.round((today.cost + totalCogs) * 100) / 100,
        profit: Math.round((today.profit + profit) * 100) / 100,
        transactions: today.transactions + 1,
      };
    }

    await this.persist();
    return { bill: newBill, updatedProducts };
  }

  // ==================== PHASE 3: EXPENSES ====================

  async getExpenses(): Promise<Expense[]> {
    if (!this.cache) await this.init();
    return this.cache!.expenses || [];
  }

  async saveExpense(expenseData: Partial<Expense> & { title: string; amount: number; category: any }): Promise<Expense> {
    if (!this.cache) await this.init();

    if (!expenseData.title || Number(expenseData.amount) <= 0) {
      throw new Error('Expense title and positive amount are required.');
    }

    const nowStr = new Date().toISOString().split('T')[0];

    if (expenseData.id) {
      const index = this.cache!.expenses.findIndex((e) => e.id === expenseData.id);
      if (index !== -1) {
        const existing = this.cache!.expenses[index];
        const updated: Expense = {
          ...existing,
          ...expenseData,
          amount: Number(expenseData.amount),
        };
        this.cache!.expenses[index] = updated;
        await this.persist();
        return updated;
      }
    }

    const newExpense: Expense = {
      id: expenseData.id || `exp-${Date.now()}`,
      title: expenseData.title.trim(),
      category: expenseData.category || 'miscellaneous',
      amount: Math.round(Number(expenseData.amount) * 100) / 100,
      date: expenseData.date || nowStr,
      paymentMethod: expenseData.paymentMethod || 'cash',
      description: expenseData.description?.trim() || '',
      receiptNumber: expenseData.receiptNumber?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    this.cache!.expenses.unshift(newExpense);
    await this.persist();
    return newExpense;
  }

  async deleteExpense(id: string): Promise<boolean> {
    if (!this.cache) await this.init();
    const initialLen = (this.cache!.expenses || []).length;
    this.cache!.expenses = (this.cache!.expenses || []).filter((e) => e.id !== id);
    if (this.cache!.expenses.length !== initialLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  // ==================== PHASE 3: ACCURATE FINANCIAL SUMMARY ====================

  async getFinancialSummary(): Promise<FinancialSummary> {
    if (!this.cache) await this.init();

    const bills = this.cache!.bills || [];
    const expenses = this.cache!.expenses || [];

    // Total revenue from all bills
    const totalRevenue = bills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const costOfGoods = bills.reduce((sum, b) => sum + (b.costOfGoods || 0), 0);
    const grossProfit = Math.round((totalRevenue - costOfGoods) * 100) / 100;
    const grossMarginPercent = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 1000) / 10 : 0;

    // Total operating expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    // Net profit = Gross Profit - Operating Expenses
    const netProfit = Math.round((grossProfit - totalExpenses) * 100) / 100;
    const netMarginPercent = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 1000) / 10 : 0;

    // Payment method breakdown & Cash received
    // IMPORTANT: Do NOT count unpaid customer credit as cash received!
    const paymentBreakdown = {
      cash: { count: 0, amount: 0 },
      upi: { count: 0, amount: 0 },
      credit: { count: 0, amount: 0 },
    };

    let outstandingCredit = 0;

    for (const b of bills) {
      if (b.paymentMethod === 'cash') {
        paymentBreakdown.cash.count += 1;
        paymentBreakdown.cash.amount += b.totalAmount;
      } else if (b.paymentMethod === 'upi') {
        paymentBreakdown.upi.count += 1;
        paymentBreakdown.upi.amount += b.totalAmount;
      } else if (b.paymentMethod === 'credit') {
        paymentBreakdown.credit.count += 1;
        paymentBreakdown.credit.amount += b.totalAmount;
        if (b.paymentStatus === 'pending') {
          outstandingCredit += b.totalAmount;
        }
      }
    }

    // Cash received = actual cash + UPI payments received
    const cashReceived = Math.round((paymentBreakdown.cash.amount + paymentBreakdown.upi.amount) * 100) / 100;

    // Category-wise expense breakdown
    const expenseByCategory: Record<string, number> = {};
    for (const e of expenses) {
      expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
    }

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      costOfGoods: Math.round(costOfGoods * 100) / 100,
      grossProfit,
      grossMarginPercent,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netProfit,
      netMarginPercent,
      cashReceived,
      outstandingCredit: Math.round(outstandingCredit * 100) / 100,
      expenseByCategory,
      paymentBreakdown,
    };
  }

  async getAllData(): Promise<DatabaseSchema> {
    if (!this.cache) await this.init();
    return this.cache!;
  }
}

export const db = new Database();
