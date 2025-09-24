import React from 'react';
import { TrendingUp, TrendingDown, Calendar, Wallet } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface StatsCardsProps {
  totalExpense: number;
  thisMonthExpense: number;
  transactionCount: number;
  avgTransaction: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ 
  totalExpense, 
  thisMonthExpense, 
  transactionCount, 
  avgTransaction 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Expenses</p>
            <h3 className="text-2xl font-bold">{formatINR(totalExpense)}</h3>
          </div>
          <Wallet className="w-8 h-8 text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">This Month</p>
            <h3 className="text-2xl font-bold">{formatINR(thisMonthExpense)}</h3>
          </div>
          <Calendar className="w-8 h-8 text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Transactions</p>
            <h3 className="text-2xl font-bold">{transactionCount}</h3>
          </div>
          <TrendingUp className="w-8 h-8 text-purple-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Avg Transaction</p>
            <h3 className="text-2xl font-bold">{formatINR(avgTransaction)}</h3>
          </div>
          <TrendingDown className="w-8 h-8 text-orange-200" />
        </div>
      </div>
    </div>
  );
};