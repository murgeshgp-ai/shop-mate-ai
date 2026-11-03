import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { db } from './server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Language instructions helper
  function getLanguageInstruction(lang: string = 'en'): string {
    switch (lang) {
      case 'kn':
        return `CRITICAL LANGUAGE REQUIREMENT: You MUST respond naturally in KANNADA (ಕನ್ನಡ) script.
- Understand questions typed in native Kannada script, mixed Kannada-English (Kanglish), or English.
- Use clear, respectful, practical conversational Kannada that local Karnataka small shopkeepers understand (use common terms like ದಾಸ್ತಾನು/ಸ್ಟಾಕ್, ಮಾರಾಟ, ಲಾಭ, ವೆಚ್ಚ, ಮರುಆದೇಶ, ರಿಯಾಯಿತಿ, ಗ್ರಾಹಕರು).
- Always quote monetary amounts in Indian Rupees (₹).
- Keep formatting clean with bold text and bullet points.`;
      case 'hi':
        return `CRITICAL LANGUAGE REQUIREMENT: You MUST respond naturally in HINDI (हिंदी) in Devanagari script.
- Understand questions in Hindi, Hinglish, or English.
- Use simple everyday retail terms (बिक्री, मुनाफा, खरीद लागत, स्टॉक, छूट).
- Quote monetary amounts in Indian Rupees (₹).`;
      case 'te':
        return `CRITICAL LANGUAGE REQUIREMENT: You MUST respond naturally in TELUGU (తెలుగు) script.
- Understand questions in Telugu or Telugu-English.
- Use simple terms (అమ్మకాలు, లాభం, స్టాక్, కొనుగోలు ధర).
- Quote monetary amounts in Indian Rupees (₹).`;
      case 'ta':
        return `CRITICAL LANGUAGE REQUIREMENT: You MUST respond naturally in TAMIL (தமிழ்) script.
- Understand questions in Tamil or Tanglish.
- Use everyday retail terms (விற்பனை, லாபம், இருப்பு, கொள்முதல் விலை).
- Quote monetary amounts in Indian Rupees (₹).`;
      case 'ml':
        return `CRITICAL LANGUAGE REQUIREMENT: You MUST respond naturally in MALAYALAM (മലയാളം) script.
- Understand questions in Malayalam or Manglish.
- Quote monetary amounts in Indian Rupees (₹).`;
      case 'mr':
        return `CRITICAL LANGUAGE REQUIREMENT: You MUST respond naturally in MARATHI (मराठी) in Devanagari script.
- Understand questions in Marathi or Marathi-English.
- Quote monetary amounts in Indian Rupees (₹).`;
      default:
        return `Respond in clear English. Quote monetary amounts in Indian Rupees (₹).`;
    }
  }

  // Initialize Database on startup
  await db.init();

  // === Persistent Database REST APIs ===

  // Inventory APIs
  app.get('/api/inventory', async (_req, res) => {
    try {
      const items = await db.getProducts();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/inventory', async (req, res) => {
    try {
      const item = await db.saveProduct(req.body);
      res.status(201).json(item);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/inventory/:id', async (req, res) => {
    try {
      const item = await db.saveProduct({ ...req.body, id: req.params.id });
      res.json(item);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/inventory/:id', async (req, res) => {
    try {
      const success = await db.deleteProduct(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Supplier APIs
  app.get('/api/suppliers', async (_req, res) => {
    try {
      const suppliers = await db.getSuppliers();
      res.json(suppliers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/suppliers', async (req, res) => {
    try {
      if (!req.body.name || !req.body.phone) {
        return res.status(400).json({ error: 'Supplier name and phone number are required.' });
      }
      const supplier = await db.saveSupplier(req.body);
      res.status(201).json(supplier);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/suppliers/:id', async (req, res) => {
    try {
      const supplier = await db.saveSupplier({ ...req.body, id: req.params.id });
      res.json(supplier);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/suppliers/:id', async (req, res) => {
    try {
      const success = await db.deleteSupplier(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Purchase Order APIs
  app.get('/api/purchases', async (_req, res) => {
    try {
      const orders = await db.getPurchases();
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/purchases', async (req, res) => {
    try {
      if (!req.body.supplierId) {
        return res.status(400).json({ error: 'Supplier selection is required.' });
      }
      if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
        return res.status(400).json({ error: 'At least one product item is required.' });
      }
      const order = await db.savePurchase(req.body);
      res.status(201).json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/purchases/:id', async (req, res) => {
    try {
      const order = await db.savePurchase({ ...req.body, id: req.params.id });
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Feature 4: Mark purchase as received & automatically update inventory stock
  app.post('/api/purchases/:id/receive', async (req, res) => {
    try {
      const result = await db.receivePurchase(req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/purchases/:id', async (req, res) => {
    try {
      const success = await db.deletePurchase(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/all-data', async (_req, res) => {
    try {
      const data = await db.getAllData();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // === POS Billing & Invoicing APIs (Phase 3) ===
  app.get('/api/bills', async (_req, res) => {
    try {
      const bills = await db.getBills();
      res.json(bills);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/bills', async (req, res) => {
    try {
      if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
        return res.status(400).json({ error: 'Bill must contain at least one item.' });
      }
      if (req.body.paymentMethod === 'credit' && !req.body.customerName) {
        return res.status(400).json({ error: 'Customer name is required for credit transactions (ಉದ್ದರಿ / Udhar).' });
      }
      const newBill = await db.createBill(req.body);
      res.status(201).json(newBill);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/bills/:id', async (req, res) => {
    try {
      const bill = await db.getBill(req.params.id);
      if (!bill) return res.status(404).json({ error: 'Bill not found' });
      res.json(bill);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // === Expense Management APIs (Phase 3) ===
  app.get('/api/expenses', async (_req, res) => {
    try {
      const expenses = await db.getExpenses();
      res.json(expenses);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/expenses', async (req, res) => {
    try {
      if (!req.body.title || !req.body.amount || !req.body.category) {
        return res.status(400).json({ error: 'Title, amount, and category are required.' });
      }
      const expense = await db.saveExpense(req.body);
      res.status(201).json(expense);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/expenses/:id', async (req, res) => {
    try {
      const expense = await db.saveExpense({ ...req.body, id: req.params.id });
      res.json(expense);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/expenses/:id', async (req, res) => {
    try {
      const success = await db.deleteExpense(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Financial Dashboard Summary API (Phase 3)
  app.get('/api/financial-summary', async (_req, res) => {
    try {
      const summary = await db.getFinancialSummary();
      res.json(summary);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI Chatbot endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, shopContext, language = 'en' } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (!ai) {
        const fallbackReply = generateFallbackChat(message, shopContext, language);
        return res.json({ reply: fallbackReply, source: 'fallback' });
      }

      const shopContextSummary = shopContext
        ? `
CURRENT STORE & FINANCIAL SNAPSHOT:
- Total Products in Catalog: ${shopContext.totalProducts ?? 'N/A'}
- Total Current Stock Units: ${shopContext.totalStockUnits ?? 'N/A'}
- Low Stock Items (${shopContext.lowStockCount ?? 0}): ${
            Array.isArray(shopContext.lowStockItems)
              ? shopContext.lowStockItems.map((i: any) => `${i.name} (${i.quantity} left, min 10)`).join(', ')
              : 'None'
          }
- Total Revenue: ₹${shopContext.totalRevenue ?? shopContext.totalSales ?? 'N/A'}
- Cost of Goods Sold (COGS): ₹${shopContext.costOfGoodsSold ?? 'N/A'}
- Gross Profit: ₹${shopContext.grossProfit ?? shopContext.estimatedProfit ?? 'N/A'}
- Operating Expenses: ₹${shopContext.totalOperatingExpenses ?? 'N/A'}
- Net Profit: ₹${shopContext.netProfit ?? 'N/A'}
- Cash Received (Cash & UPI only): ₹${shopContext.cashReceived ?? 'N/A'}
- Outstanding Customer Credit (Udhar / Pending): ₹${shopContext.outstandingCredit ?? 'N/A'}
- Top 3 Best-Sellers: ${
            Array.isArray(shopContext.topSellers)
              ? shopContext.topSellers.map((s: any) => `${s.name} (${s.unitsSold} sold)`).join(', ')
              : 'N/A'
          }
IMPORTANT ACCOUNTING RULES:
- Never count unpaid customer credit (Udhar) as cash in hand.
- Net profit = Gross profit minus operating expenses.
- Always quote exact verified figures from the snapshot above.
`
        : '';

      const langInstruction = getLanguageInstruction(language);

      const systemInstruction = `You are ShopMate AI, a friendly, sharp, and highly practical business mentor and financial advisor for small Indian shop owners (Kirana stores, retail shops, corner stores).
Your goal is to help the shopkeeper maximize profit, avoid stockouts, collect outstanding udhar credit, manage daily expenses, and price products wisely.
Always provide concrete, actionable advice in plain, accessible language with bullet points and clear numbers when applicable.
${langInstruction}
${shopContextSummary}
When the user asks questions about their business, reference their current store numbers whenever relevant. Keep answers concise, direct, and motivating.`;

      // Build messages
      const conversationText = (history || [])
        .map((h: { role: string; content: string }) => `${h.role === 'user' ? 'Shopkeeper' : 'ShopMate AI'}: ${h.content}`)
        .join('\n');

      const fullPrompt = conversationText
        ? `${conversationText}\nShopkeeper: ${message}\nShopMate AI:`
        : message;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text || generateFallbackChat(message, shopContext, language);
      return res.json({ reply, source: 'gemini' });
    } catch (error: any) {
      console.error('Chat endpoint error:', error);
      const fallbackReply = generateFallbackChat(req.body.message, req.body.shopContext, req.body.language || 'en');
      return res.json({
        reply: fallbackReply,
        source: 'fallback',
        warning: 'AI Assistant responded using backup business heuristics.',
      });
    }
  });

  // AI Smart Business Suggestions endpoint
  app.post('/api/suggestions', async (req, res) => {
    try {
      const { inventory, salesSummary, topSellers, language = 'en' } = req.body;

      if (!ai) {
        return res.json({
          suggestions: generateFallbackSuggestions(inventory, salesSummary, topSellers, language),
          source: 'fallback',
        });
      }

      const langInstruction = getLanguageInstruction(language);

      const prompt = `Analyze this small retail shop data and provide exactly 3 high-impact, practical suggestions for the shopkeeper to improve profit, sales, or inventory health:

STORE DATA:
- Total Products: ${inventory?.length || 0}
- Low Stock Items: ${
        JSON.stringify(
          (inventory || [])
            .filter((p: any) => p.quantity <= 10)
            .map((p: any) => ({ name: p.name, qty: p.quantity, cost: p.purchasePrice, price: p.sellingPrice }))
        )
      }
- Highest Margin Items: ${
        JSON.stringify(
          (inventory || [])
            .map((p: any) => ({
              name: p.name,
              marginDollar: p.sellingPrice - p.purchasePrice,
              marginPct: Math.round(((p.sellingPrice - p.purchasePrice) / (p.sellingPrice || 1)) * 100),
            }))
            .sort((a: any, b: any) => b.marginPct - a.marginPct)
            .slice(0, 3)
        )
      }
- Recent Sales Total: ₹${salesSummary?.totalSales || 0}
- Estimated Profit: ₹${salesSummary?.estimatedProfit || 0}
- Top Selling Items: ${JSON.stringify(topSellers || [])}

Provide exactly 3 suggestions. For each, give:
1. title: punchy action headline (max 8 words) in the requested language
2. category: one of 'Inventory', 'Pricing', 'Sales', 'Cost Saving'
3. impact: quantified estimate in Indian Rupees (₹) (e.g., '+₹3,200/ತಿಂಗಳು' or '+₹3,200/month', 'Avoid ~₹4,000 lost sales')
4. urgency: 'High', 'Medium', or 'Low'
5. summary: 2-3 sentences explaining why this matters and the expected payoff in the requested language
6. actionSteps: array of 3 bullet points with specific action items in the requested language
7. recommendedActionLabel: short CTA button text in the requested language (e.g., 'ಸ್ಟಾಕ್ ಮರುಆದೇಶಿಸಿ' / 'Restock Order')`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are an elite retail management consultant for small independent Indian businesses. Always produce structured, realistic, immediately profitable recommendations. ${langInstruction}`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    category: { type: Type.STRING },
                    impact: { type: Type.STRING },
                    urgency: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    actionSteps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    recommendedActionLabel: { type: Type.STRING },
                  },
                  required: ['title', 'category', 'impact', 'urgency', 'summary', 'actionSteps', 'recommendedActionLabel'],
                },
              },
            },
            required: ['suggestions'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
        const formatted = parsed.suggestions.map((s: any, idx: number) => ({
          ...s,
          id: s.id || `sugg-${Date.now()}-${idx}`,
        }));
        return res.json({ suggestions: formatted, source: 'gemini' });
      }

      return res.json({
        suggestions: generateFallbackSuggestions(inventory, salesSummary, topSellers, language),
        source: 'fallback',
      });
    } catch (error) {
      console.error('Suggestions endpoint error:', error);
      return res.json({
        suggestions: generateFallbackSuggestions(req.body.inventory, req.body.salesSummary, req.body.topSellers, req.body.language || 'en'),
        source: 'fallback',
      });
    }
  });

  // Fallback heuristic chat responses
  function generateFallbackChat(message: string, context: any, lang: string = 'en'): string {
    const lower = (message || '').toLowerCase();
    const lowStockCount = context?.lowStockCount ?? 5;
    const topSeller = context?.topSellers?.[0]?.name ?? 'Aashirvaad Shudh Chakki Atta (5kg)';

    if (lang === 'kn') {
      if (lower.includes('stock') || lower.includes('ಸ್ಟಾಕ್') || lower.includes('ದಾಸ್ತಾನು') || lower.includes('ಆರ್ಡರ್') || lower.includes('reorder')) {
        return `ನಿಮ್ಮ ಅಂಗಡಿಯ ಇನ್ವೆಂಟರಿ ಪ್ರಕಾರ, ಸದ್ಯಕ್ಕೆ **${lowStockCount} ಉತ್ಪನ್ನಗಳಲ್ಲಿ ಸ್ಟಾಕ್ ತೀರಾ ಕಡಿಮೆಯಾಗಿದೆ**.

ತಕ್ಷಣದ ಶಿಫಾರಸುಗಳು:
1. ಗ್ರಾಹಕರು ಹಿಂತಿರುಗಿ ಹೋಗದಂತೆ ಇಂದು ಕಡಿಮೆ ಸ್ಟಾಕ್ ಇರುವ ವಸ್ತುಗಳನ್ನು ಮರುಆದೇಶಿಸಿ (Reorder).
2. ವೇಗವಾಗಿ ಮಾರಾಟವಾಗುವ **${topSeller}** ನಂತಹ ಉತ್ಪನ್ನಗಳಿಗೆ ವಾರಾಂತ್ಯದ ಮೊದಲು 20% ಹೆಚ್ಚುವರಿ ಸೇಫ್ಟಿ ಸ್ಟಾಕ್ ಇರಿಸಿಕೊಳ್ಳಿ.
3. ವಿತರಕರಿಂದ ಸರಕು ತಲುಪಲು 2-3 ದಿನ ತೆಗೆದುಕೊಂಡರೆ, ನಿಮ್ಮ ಕನಿಷ್ಠ ಅಲರ್ಟ್ ಮಿತಿಯನ್ನು 10 ರಿಂದ 15 ಯೂನಿಟ್‌ಗಳಿಗೆ ಹೆಚ್ಚಿಸಿ.`;
      }

      if (lower.includes('price') || lower.includes('ಬೆಲೆ') || lower.includes('ಮಾರ್ಜಿನ್') || lower.includes('ಲಾಭ') || lower.includes('profit')) {
        return `ಗ್ರಾಹಕರಿಗೆ ಹೊರೆಯಾಗದಂತೆ ನಿಮ್ಮ ಲಾಭದ ಮಾರ್ಜಿನ್ ಹೆಚ್ಚಿಸುವ ಉಪಾಯಗಳು:
1. ದಿನನಿತ್ಯದ ಅಗತ್ಯ ವಸ್ತುಗಳ ಮೇಲೆ ₹2 ರಿಂದ ₹5 ರಷ್ಟು ಬೆಲೆ ಪರಿಷ್ಕರಣೆ ಮಾಡಿದರೆ ಗ್ರಾಹಕರು ಆಕ್ಷೇಪಿಸುವುದಿಲ್ಲ ಮತ್ತು ನಿಮ್ಮ ಲಾಭ ನೇರವಾಗಿ ಹೆಚ್ಚುತ್ತದೆ.
2. ಹೆಚ್ಚು ಲಾಭವಿರುವ ವಸ್ತುಗಳನ್ನು ಜನಪ್ರಿಯ ವಸ್ತುಗಳ ಜೊತೆ ಕಾಂಬೊ ಮಾಡಿ ಮಾರಾಟ ಮಾಡಿ.
3. ಸಣ್ಣ ಕಿರಾಣಿ ಅಂಗಡಿಗಳಲ್ಲಿ ಒಟ್ಟು ಗ್ರಾಸ್ ಮಾರ್ಜಿನ್ ಕನಿಷ್ಠ 30% ರಿಂದ 40% ಇರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.`;
      }

      return `ಶಾಪ್‌ಮೇಟ್ AI ನಿಮ್ಮ ಅಂಗಡಿಯ ಅಭಿವೃದ್ಧಿಗೆ ಸದಾ ಸಿದ್ಧವಾಗಿದೆ!

ನಿಮ್ಮ ಇಂದಿನ ಮುಖ್ಯ ಆದ್ಯತೆಗಳು:
• ಸ್ಟಾಕ್ ಕಡಿಮೆಯಿರುವ ${lowStockCount} ವಸ್ತುಗಳನ್ನು ಆದ್ಯತೆಯ ಮೇಲೆ ಪರಿಶೀಲಿಸಿ.
• ಒಟ್ಟು ಲಾಭದ ಮಾರ್ಜಿನ್ ಅನ್ನು 35% ಗಿಂತ ಹೆಚ್ಚಾಗಿ ಕಾಯ್ದುಕೊಳ್ಳಿ.
• ಹೆಚ್ಚು ಮಾರಾಟವಾಗುವ **${topSeller}** ಅನ್ನು ಅಂಗಡಿಯ ಮುಂಭಾಗದಲ್ಲಿ ಪ್ರದರ್ಶಿಸಿ.

ಬೆಲೆ ನಿಗದಿ, ನಿಧಾನವಾಗಿ ಮಾರಾಟವಾಗುವ ವಸ್ತುಗಳು ಅಥವಾ ಸಪ್ಲೈಯರ್ ಆಫರ್‌ಗಳ ಬಗ್ಗೆ ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು!`;
    }

    if (lang === 'hi') {
      return `आपकी दुकान के डेटा के आधार पर, अभी **${lowStockCount} उत्पादों में स्टॉक कम है**।

तुरंत ध्यान देने योग्य बातें:
1. ग्राहकों को वापस लौटने से रोकने के लिए कम स्टॉक वाली वस्तुओं को आज ही रीऑर्डर करें।
2. सबसे ज्यादा बिकने वाले उत्पाद **${topSeller}** का अतिरिक्त स्टॉक वीकेंड से पहले सुरक्षित रखें।
3. औसत मुनाफा मार्जिन 35% से ऊपर बनाए रखने के लिए कॉम्बो ऑफर्स का उपयोग करें।`;
    }

    // Default English
    return `Based on your inventory, you currently have **${lowStockCount} items running low on stock**.

Recommended immediate actions:
1. Reorder low-stock items today to avoid lost foot traffic.
2. For fast-moving goods like **${topSeller}**, keep a 20% safety stock buffer before the weekend.
3. Maintain target gross margins above 35% by bundling high-margin companion items with essentials.`;
  }

  // Fallback heuristic suggestions
  function generateFallbackSuggestions(inventory: any[], salesSummary: any, topSellers: any[], lang: string = 'en') {
    const lowStockList = (inventory || []).filter((p: any) => p.quantity <= 10);
    const lowStockName = lowStockList[0]?.name || 'Nandini Pure Ghee (500ml)';

    if (lang === 'kn') {
      return [
        {
          id: 'sugg-1',
          title: `ವಾರಾಂತ್ಯದ ಮುನ್ನ ${lowStockName} ಮರುಆದೇಶಿಸಿ`,
          category: 'Inventory',
          impact: '~₹3,500 ಸಂಭಾವ್ಯ ನಷ್ಟ ತಡೆಯಿರಿ',
          urgency: 'High',
          summary: `${lowStockName} ಸೇರಿದಂತೆ ಪ್ರಮುಖ ಅಗತ್ಯ ವಸ್ತುಗಳ ಸ್ಟಾಕ್ ಕನಿಷ್ಠ ಮಿತಿಗಿಂತ ಕಡಿಮೆಯಾಗಿದೆ. ಗ್ರಾಹಕರು ಹಾಲು-ಕಾಫಿ ಇಲ್ಲದಿದ್ದರೆ ಪಕ್ಕದ ಅಂಗಡಿಗೆ ಹೋಗುವ ಸಾಧ್ಯತೆ ಇರುತ್ತದೆ.`,
          actionSteps: [
            `ಮುಖ್ಯ ವಿತರಕರನ್ನು ಸಂಪರ್ಕಿಸಿ ಕನಿಷ್ಠ 25 ಯೂನಿಟ್‌ಗಳ ಮರುಆದೇಶ ಕಳುಹಿಸಿ.`,
            `ಸ್ಟಾಕ್ 15 ಕ್ಕಿಂತ ಕಡಿಮೆಯಾದಾಗ ಮುನ್ಸೂಚನೆ ನೀಡುವ ರಿಮೈಂಡರ್ ಸೆಟ್ ಮಾಡಿ.`,
            `ಉಳಿದಿರುವ ಸ್ಟಾಕ್ ಅನ್ನು ಪೀಕ್ ಸಮಯದಲ್ಲಿ ಮುಂಭಾಗದ ಕೌಂಟರ್‌ನಲ್ಲಿ ಪ್ರದರ್ಶಿಸಿ.`,
          ],
          recommendedActionLabel: 'ಕಡಿಮೆ ಸ್ಟಾಕ್ ಪರಿಶೀಲಿಸಿ',
        },
        {
          id: 'sugg-2',
          title: 'ಬೆಳಗಿನ ತಿಂಡಿ ಕಾಂಬೊ ಪ್ಯಾಕ್ ಆರಂಭಿಸಿ',
          category: 'Sales',
          impact: '+₹2,200 ಹೆಚ್ಚುವರಿ ಸಾಪ್ತಾಹಿಕ ಲಾಭ',
          urgency: 'Medium',
          summary: 'ಕಾಫಿ ಮತ್ತು ಬ್ರೆಡ್ ಎರಡರಲ್ಲೂ ಉತ್ತಮ ಲಾಭಾಂಶವಿದೆ. ಇವೆರಡನ್ನು ಜೊತೆಯಾಗಿ ವಿಶೇಷ ಕಾಂಬೊ ರಿಯಾಯಿತಿಯಲ್ಲಿ ನೀಡಿದರೆ ಗ್ರಾಹಕರು ಒಟ್ಟಿಗೆ ಖರೀದಿಸುತ್ತಾರೆ.',
          actionSteps: [
            `ಕೌಂಟರ್ ಬಳಿ "ಬೆಳಗಿನ ಸ್ಪೆಷಲ್ ಕಾಂಬೊ" ಫಲಕ ಪ್ರದರ್ಶಿಸಿ.`,
            `ಹೆಚ್ಚು ಮಾರಾಟವಾಗುವ ದಿನಸಿ ಬಳಿ ಪೂರಕ ವಸ್ತುಗಳನ್ನು ಜೋಡಿಸಿ.`,
            `ಬಿಲ್ಲಿಂಗ್ ಸಮಯದಲ್ಲಿ ಗ್ರಾಹಕರಿಗೆ ಕಾಂಬೊ ಆಫರ್ ಬಗ್ಗೆ ತಿಳಿಸಲು ಸಿಬ್ಬಂದಿಗೆ ಸೂಚಿಸಿ.`,
          ],
          recommendedActionLabel: 'ಕಾಂಬೊ ಆಫರ್ ನೋಡಿ',
        },
        {
          id: 'sugg-3',
          title: 'ಕಡಿಮೆ ಮಾರ್ಜಿನ್ ಉತ್ಪನ್ನಗಳ ಬೆಲೆ ಸರಿಪಡಿಸಿ',
          category: 'Pricing',
          impact: '+₹4,200 ಮಾಸಿಕ ನಿವ್ವಳ ಲಾಭ ಹೆಚ್ಚಳ',
          urgency: 'Medium',
          summary: 'ಕೆಲವು ದಿನಸಿ ಮತ್ತು ಸಿಹಿತಿಂಡಿಗಳ ಮೇಲೆ ಬೆಲೆ ಸೂಕ್ಷ್ಮತೆ ಕಡಿಮೆಯಿರುತ್ತದೆ. ₹2 ರಿಂದ ₹5 ರಷ್ಟು ಸೂಕ್ಷ್ಮ ಬೆಲೆ ಹೆಚ್ಚಳವು ನಿಮ್ಮ ಒಟ್ಟು ಲಾಭವನ್ನು ಗಣనీಯವಾಗಿ ಹೆಚ್ಚಿಸುತ್ತದೆ.',
          actionSteps: [
            `25% ಗಿಂತ ಕಡಿಮೆ ಮಾರ್ಜಿನ್ ಇರುವ ವಸ್ತುಗಳನ್ನು ಗುರುತಿಸಿ ಬೆಲೆ ಪರಿಷ್ಕರಿಸಿ.`,
            `ಸರಬರಾಜುದಾರರೊಂದಿಗೆ ದೊಡ್ಡ ಪ್ರಮಾಣದ ಖರೀದಿಗೆ ರಿಯಾಯಿತಿ ಕೇಳಿ.`,
            `ಸ್ಥಳೀಯ ಸ್ಪರ್ಧಿಗಳ ಬೆಲೆಗಳನ್ನು ಗಮನಿಸಿ ಸಮತೋಲನ ಕಾಯ್ದುಕೊಳ್ಳಿ.`,
          ],
          recommendedActionLabel: 'ಬೆಲೆ ಪರಿಶೀಲಿಸಿ',
        },
      ];
    }

    return [
      {
        id: 'sugg-1',
        title: `Restock ${lowStockName} Before Weekend Rush`,
        category: 'Inventory',
        impact: 'Prevent ~₹3,500 in lost revenue',
        urgency: 'High',
        summary: `Your stock for ${lowStockName} has dropped below the safety threshold. When high-demand items run out, customers frequently walk out without buying alternatives.`,
        actionSteps: [
          `Contact primary distributor to place a replenishment order of at least 35 units.`,
          `Set automated low-stock reminder notification when units dip under 15.`,
          `Temporarily reserve remaining shelf inventory for peak foot-traffic hours.`,
        ],
        recommendedActionLabel: 'Review Reorder List',
      },
      {
        id: 'sugg-2',
        title: 'Create Best-Seller Complementary Bundles',
        category: 'Sales',
        impact: '+18% higher Average Order Value (AOV)',
        urgency: 'Medium',
        summary: `Pairing top-selling staples with higher-margin complementary treats increases basket size without customer friction.`,
        actionSteps: [
          `Place companion items directly adjacent to your top seller at checkout.`,
          `Offer a "Buy Together & Save ₹20" promotional counter display.`,
          `Train staff to suggest the add-on during checkout ringing.`,
        ],
        recommendedActionLabel: 'Set Up Bundle Promo',
      },
      {
        id: 'sugg-3',
        title: 'Optimize Margins on Low-Sensitivity Products',
        category: 'Pricing',
        impact: '+₹4,200 projected monthly net profit',
        urgency: 'Medium',
        summary: `Several specialized items in your catalog have below-average gross margins despite low customer price-sensitivity. A slight price correction will directly increase your bottom line.`,
        actionSteps: [
          `Review products with margins below 25% and adjust selling price upward slightly.`,
          `Negotiate volume purchase tiers with suppliers for top-volume items.`,
          `Audit competitor local pricing to confirm you remain competitively positioned.`,
        ],
        recommendedActionLabel: 'Adjust Item Prices',
      },
    ];
  }

  // Set up Vite dev server or serve static build
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ShopMate AI server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
