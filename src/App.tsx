import React from 'react';
import { RefreshCw, CreditCard, BarChart3, Zap } from 'lucide-react';
import { useTransactions } from './hooks/useTransactions';
import { StatsCards } from './components/StatsCards';
import { ExpenseCharts } from './components/ExpenseCharts';
import { TransactionList } from './components/TransactionList';
import { SMSImporter } from './components/SMSImporter';

function App() {
  const {
    transactions,
    loading,
    error,
    fetchTransactions,
    importTransactions,
    getCategoryStats,
    getMonthlyData,
    getTotalExpense,
    getThisMonthExpense,
  } = useTransactions();

  const categoryStats = getCategoryStats();
  const monthlyData = getMonthlyData();
  const totalExpense = getTotalExpense();
  const thisMonthExpense = getThisMonthExpense();
  const avgTransaction = transactions.length > 0 ? totalExpense / transactions.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ExpenseTracker</h1>
                <p className="text-sm text-gray-600">Smart UPI Expense Management</p>
              </div>
            </div>
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Syncing...' : 'Sync UPI'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-6">
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-blue-600 animate-pulse" />
              <div className="text-center">
                <p className="text-blue-700 font-medium">Fetching UPI Transactions...</p>
                <p className="text-blue-600 text-sm">Connecting to banking APIs and analyzing spending patterns</p>
              </div>
            </div>
          </div>
        )}

        {/* SMS Importer */}
        <SMSImporter onTransactionsImported={importTransactions} />

        {/* Stats Cards */}
        <StatsCards 
          totalExpense={totalExpense}
          thisMonthExpense={thisMonthExpense}
          transactionCount={transactions.length}
          avgTransaction={avgTransaction}
        />

        {transactions.length > 0 && (
          <>
            {/* Charts */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Expense Analytics</h2>
              </div>
              <ExpenseCharts categoryStats={categoryStats} monthlyData={monthlyData} />
            </div>

            {/* Transaction List */}
            <TransactionList transactions={transactions} />
          </>
        )}

        {transactions.length === 0 && !loading && (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-600 mb-4">Click "Sync UPI" to fetch your recent transactions</p>
            <button
              onClick={fetchTransactions}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
