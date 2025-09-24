import React, { useState } from 'react';
import { MessageSquare, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { parseSMSTransaction, extractMultipleTransactions, SAMPLE_SMS_MESSAGES, SMSTransaction } from '../utils/smsParser';
import { categorizeTransaction } from '../utils/transactionSimulator';
import { Transaction } from '../types';

interface SMSImporterProps {
  onTransactionsImported: (transactions: Transaction[]) => void;
}

export const SMSImporter: React.FC<SMSImporterProps> = ({ onTransactionsImported }) => {
  const [smsText, setSmsText] = useState('');
  const [parsedTransactions, setParsedTransactions] = useState<SMSTransaction[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleParseSMS = () => {
    const lines = smsText.split('\n').filter(line => line.trim());
    const transactions = extractMultipleTransactions(lines);
    setParsedTransactions(transactions);
    setShowResults(true);
  };

  const handleUseSampleData = () => {
    const transactions = extractMultipleTransactions(SAMPLE_SMS_MESSAGES);
    setParsedTransactions(transactions);
    setShowResults(true);
    setSmsText(SAMPLE_SMS_MESSAGES.join('\n\n'));
  };

  const handleImportTransactions = () => {
    const transactions: Transaction[] = parsedTransactions.map(sms => ({
      id: `sms_${sms.transactionId}_${Date.now()}`,
      amount: sms.amount,
      description: `Payment to ${sms.merchant}`,
      merchant: sms.merchant,
      category: categorizeTransaction(sms.merchant, sms.merchant),
      date: sms.date,
      upiId: sms.upiId || `${sms.merchant.toLowerCase().replace(/\s+/g, '')}@upi`,
      transactionId: sms.transactionId,
    }));

    onTransactionsImported(transactions);
    setSmsText('');
    setParsedTransactions([]);
    setShowResults(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Import from SMS</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your UPI transaction SMS messages (one per line)
          </label>
          <textarea
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            placeholder="Paste your SMS messages here...&#10;&#10;Example:&#10;Rs.450 debited from your HDFC Bank account for UPI payment to SWIGGY on 15/01/2024. UPI Ref No: 401234567890"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleParseSMS}
            disabled={!smsText.trim()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FileText className="w-4 h-4" />
            Parse SMS
          </button>
          
          <button
            onClick={handleUseSampleData}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Use Sample Data
          </button>
        </div>

        {showResults && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">
              Parsed Transactions ({parsedTransactions.length})
            </h3>
            
            {parsedTransactions.length > 0 ? (
              <>
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                  {parsedTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium">{transaction.merchant}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {transaction.bankName}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {transaction.date.toLocaleDateString()} • ID: {transaction.transactionId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">₹{transaction.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleImportTransactions}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Import {parsedTransactions.length} Transactions
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <span>No valid UPI transactions found in the provided SMS messages.</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Copy UPI transaction SMS messages from your phone</li>
          <li>• Paste them in the text area above (one message per line)</li>
          <li>• Click "Parse SMS" to extract transaction details</li>
          <li>• Review the parsed transactions and click "Import"</li>
          <li>• Supports HDFC, SBI, ICICI, Axis, Google Pay, PhonePe, Paytm</li>
        </ul>
      </div>
    </div>
  );
};