import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatINR, formatDateTime } from '../utils/formatters';
import { Search, Filter, Calendar } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(transactions.map(t => t.category))];
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'Food': 'bg-orange-100 text-orange-800',
      'Groceries': 'bg-green-100 text-green-800',
      'Electricity': 'bg-yellow-100 text-yellow-800',
      'Utilities': 'bg-blue-100 text-blue-800',
      'Transportation': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Shopping': 'bg-indigo-100 text-indigo-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Electronics': 'bg-gray-100 text-gray-800',
      'Others': 'bg-gray-100 text-gray-600',
    };
    return colors[category] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-medium text-gray-900">{transaction.merchant}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                  {transaction.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{transaction.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateTime(transaction.date)}
                </span>
                <span>ID: {transaction.transactionId}</span>
                <span>{transaction.upiId}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-red-600">-{formatINR(transaction.amount)}</p>
            </div>
          </div>
        ))}
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};