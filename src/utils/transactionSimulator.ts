import { Transaction } from '../types';

const merchants = [
  { name: 'Swiggy', category: 'Food', upiId: 'swiggy@paytm' },
  { name: 'Zomato', category: 'Food', upiId: 'zomato@hdfcbank' },
  { name: 'BigBasket', category: 'Groceries', upiId: 'bigbasket@icici' },
  { name: 'BSES Delhi', category: 'Electricity', upiId: 'bses@sbi' },
  { name: 'Airtel', category: 'Utilities', upiId: 'airtel@airtel' },
  { name: 'Indian Oil Petrol Pump', category: 'Fuel', upiId: 'iocl@paytm' },
  { name: 'Metro Card Recharge', category: 'Transportation', upiId: 'dmrc@paytm' },
  { name: 'BookMyShow', category: 'Entertainment', upiId: 'bookmyshow@icici' },
  { name: 'Myntra', category: 'Shopping', upiId: 'myntra@razorpay' },
  { name: 'Apollo Pharmacy', category: 'Healthcare', upiId: 'apollo@paytm' },
  { name: 'Starbucks Coffee', category: 'Food', upiId: 'starbucks@hdfcbank' },
  { name: 'Uber', category: 'Transportation', upiId: 'uber@paytm' },
  { name: 'Amazon Pay', category: 'Shopping', upiId: 'amazon@icici' },
  { name: 'Netflix', category: 'Entertainment', upiId: 'netflix@razorpay' },
  { name: 'Reliance Digital', category: 'Electronics', upiId: 'reliance@sbi' },
];

const generateRandomTransaction = (): Transaction => {
  const merchant = merchants[Math.floor(Math.random() * merchants.length)];
  const baseAmount = Math.floor(Math.random() * 5000) + 50;
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  return {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: baseAmount,
    description: `Payment to ${merchant.name}`,
    merchant: merchant.name,
    category: merchant.category,
    date,
    upiId: merchant.upiId,
    transactionId: `UPI${Math.random().toString().substr(2, 12)}`,
  };
};

export const simulateUPIFetch = async (): Promise<Transaction[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const transactions: Transaction[] = [];
  const numTransactions = Math.floor(Math.random() * 15) + 20; // 20-35 transactions
  
  for (let i = 0; i < numTransactions; i++) {
    transactions.push(generateRandomTransaction());
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const categorizeTransaction = (description: string, merchant: string): string => {
  const categoryKeywords = {
    'Food': ['swiggy', 'zomato', 'restaurant', 'food', 'cafe', 'starbucks', 'mcdonald', 'kfc', 'domino'],
    'Groceries': ['bigbasket', 'grofers', 'blinkit', 'grocery', 'supermarket', 'dmart'],
    'Electricity': ['bses', 'bescom', 'kseb', 'mseb', 'electricity', 'power', 'energy'],
    'Utilities': ['airtel', 'jio', 'vodafone', 'bsnl', 'telecom', 'mobile', 'broadband', 'wifi'],
    'Transportation': ['uber', 'ola', 'metro', 'bus', 'train', 'petrol', 'diesel', 'fuel'],
    'Entertainment': ['bookmyshow', 'netflix', 'amazon prime', 'hotstar', 'spotify', 'cinema'],
    'Shopping': ['amazon', 'flipkart', 'myntra', 'ajio', 'shopping', 'mall'],
    'Healthcare': ['apollo', 'pharmacy', 'hospital', 'medical', 'doctor', 'medicine'],
    'Electronics': ['croma', 'reliance digital', 'electronics', 'mobile', 'laptop'],
  };
  
  const text = `${description} ${merchant}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return 'Others';
};