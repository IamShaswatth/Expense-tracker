import { useState, useEffect } from 'react';
import { Transaction, CategoryStats, MonthlyData } from '../types';
import { simulateUPIFetch } from '../utils/transactionSimulator';
import { format, startOfMonth } from 'date-fns';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const newTransactions = await simulateUPIFetch();
      setTransactions(prev => [...newTransactions, ...prev]);
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const importTransactions = (newTransactions: Transaction[]) => {
    setTransactions(prev => {
      // Remove duplicates based on transaction ID
      const existingIds = new Set(prev.map(t => t.transactionId));
      const uniqueNew = newTransactions.filter(t => !existingIds.has(t.transactionId));
      return [...uniqueNew, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime());
    });
  };
  const getCategoryStats = (): CategoryStats[] => {
    const categoryMap = new Map<string, { amount: number; count: number }>();
    
    transactions.forEach(transaction => {
      const existing = categoryMap.get(transaction.category) || { amount: 0, count: 0 };
      categoryMap.set(transaction.category, {
        amount: existing.amount + transaction.amount,
        count: existing.count + 1,
      });
    });

    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
    ];

    return Array.from(categoryMap.entries()).map(([category, data], index) => ({
      category,
      amount: data.amount,
      count: data.count,
      color: colors[index % colors.length],
    }));
  };

  const getMonthlyData = (): MonthlyData[] => {
    const monthlyMap = new Map<string, number>();
    
    transactions.forEach(transaction => {
      const monthKey = format(startOfMonth(transaction.date), 'MMM yyyy');
      const existing = monthlyMap.get(monthKey) || 0;
      monthlyMap.set(monthKey, existing + transaction.amount);
    });

    return Array.from(monthlyMap.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  };

  const getTotalExpense = (): number => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getThisMonthExpense = (): number => {
    const thisMonth = format(new Date(), 'MMM yyyy');
    return transactions
      .filter(transaction => format(startOfMonth(transaction.date), 'MMM yyyy') === thisMonth)
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    importTransactions,
    getCategoryStats,
    getMonthlyData,
    getTotalExpense,
    getThisMonthExpense,
  };
};