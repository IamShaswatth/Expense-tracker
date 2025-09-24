export interface SMSTransaction {
  amount: number;
  merchant: string;
  date: Date;
  transactionId: string;
  upiId?: string;
  bankName?: string;
  rawMessage: string;
}

// Common UPI SMS patterns from different banks and payment apps
const SMS_PATTERNS = [
  // HDFC Bank
  {
    pattern: /Rs\.?\s*(\d+(?:,\d+)*(?:\.\d{2})?)\s+(?:debited|paid)\s+.*?(?:to|at)\s+([^.]+?)(?:\s+on\s+(\d{2}\/\d{2}\/\d{4}))?\s+.*?UPI.*?Ref\s*(?:No|#)?\s*:?\s*(\w+)/i,
    bank: 'HDFC'
  },
  // SBI
  {
    pattern: /Rs\.?\s*(\d+(?:,\d+)*(?:\.\d{2})?)\s+(?:debited|sent)\s+.*?(?:to|at)\s+([^.]+?).*?UPI.*?(?:Ref|TXN)\s*(?:No|ID|#)?\s*:?\s*(\w+)/i,
    bank: 'SBI'
  },
  // ICICI Bank
  {
    pattern: /Rs\.?\s*(\d+(?:,\d+)*(?:\.\d{2})?)\s+(?:debited|paid)\s+.*?(?:to|at)\s+([^.]+?).*?UPI.*?(?:Ref|TRN)\s*(?:No|#)?\s*:?\s*(\w+)/i,
    bank: 'ICICI'
  },
  // Axis Bank
  {
    pattern: /Rs\.?\s*(\d+(?:,\d+)*(?:\.\d{2})?)\s+(?:debited|paid)\s+.*?(?:to|at)\s+([^.]+?).*?UPI.*?(?:Ref|TXN)\s*(?:No|#)?\s*:?\s*(\w+)/i,
    bank: 'Axis'
  },
  // Google Pay
  {
    pattern: /You\s+(?:paid|sent)\s+Rs\.?\s*(\d+(?:,\d+)*(?:\.\d{2})?)\s+to\s+([^.]+?).*?UPI.*?ID\s*:?\s*(\w+)/i,
    bank: 'Google Pay'
  },
  // PhonePe
  {
    pattern: /Rs\.?\s*(\d+(?:,\d+)*(?:\.\d{2})?)\s+(?:paid|sent)\s+to\s+([^.]+?).*?UPI.*?(?:Ref|TXN)\s*(?:No|ID|#)?\s*:?\s*(\w+)/i,
    bank: 'PhonePe'
  },
  // Paytm
  {
    pattern: /Rs\.?\s*(\d+(?:,\d+)*(?:\.\d{2})?)\s+(?:paid|sent)\s+to\s+([^.]+?).*?UPI.*?(?:Order|TXN)\s*(?:No|ID|#)?\s*:?\s*(\w+)/i,
    bank: 'Paytm'
  },
  // Generic UPI pattern
  {
    pattern: /(?:Rs\.?\s*|INR\s*)(\d+(?:,\d+)*(?:\.\d{2})?)\s+(?:debited|paid|sent).*?(?:to|at)\s+([^.]+?).*?UPI.*?(?:Ref|TXN|ID)\s*(?:No|#)?\s*:?\s*(\w+)/i,
    bank: 'Generic'
  }
];

export const parseSMSTransaction = (smsText: string): SMSTransaction | null => {
  // Clean the SMS text
  const cleanText = smsText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
  for (const { pattern, bank } of SMS_PATTERNS) {
    const match = cleanText.match(pattern);
    if (match) {
      const [, amountStr, merchant, dateStr, transactionId] = match;
      
      // Parse amount (remove commas and convert to number)
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      
      // Clean merchant name
      const cleanMerchant = merchant.trim().replace(/[^\w\s-]/g, '').trim();
      
      // Parse date or use current date
      let date = new Date();
      if (dateStr) {
        const [day, month, year] = dateStr.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      
      // Extract UPI ID if present
      const upiMatch = cleanText.match(/(\w+@\w+)/);
      const upiId = upiMatch ? upiMatch[1] : undefined;
      
      return {
        amount,
        merchant: cleanMerchant,
        date,
        transactionId,
        upiId,
        bankName: bank,
        rawMessage: smsText
      };
    }
  }
  
  return null;
};

export const extractMultipleTransactions = (smsMessages: string[]): SMSTransaction[] => {
  const transactions: SMSTransaction[] = [];
  
  for (const sms of smsMessages) {
    const transaction = parseSMSTransaction(sms);
    if (transaction) {
      transactions.push(transaction);
    }
  }
  
  // Remove duplicates based on transaction ID
  const uniqueTransactions = transactions.filter((transaction, index, self) => 
    index === self.findIndex(t => t.transactionId === transaction.transactionId)
  );
  
  // Sort by date (newest first)
  return uniqueTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Sample SMS messages for testing
export const SAMPLE_SMS_MESSAGES = [
  "Rs.450 debited from your HDFC Bank account for UPI payment to SWIGGY on 15/01/2024. UPI Ref No: 401234567890. Available balance: Rs.25,430",
  "You paid Rs.1,200 to ZOMATO via Google Pay UPI. Transaction ID: GP123456789. Your payment is successful.",
  "Rs.2,500 paid to BIGBASKET through PhonePe UPI. TXN ID: PP987654321. Thank you for using PhonePe!",
  "Rs.3,200 debited from ICICI Bank account for UPI payment to BSES DELHI on 14/01/2024. TRN No: IC456789123",
  "Rs.599 sent to NETFLIX via Paytm UPI. Order ID: PT789123456. Entertainment subscription renewed.",
  "Rs.850 debited for UPI payment to INDIAN OIL PETROL PUMP. SBI UPI Ref: SB234567890",
  "You paid Rs.1,800 to MYNTRA using UPI. Axis Bank TXN No: AX345678901. Happy shopping!",
  "Rs.299 paid to AIRTEL via UPI for mobile recharge. Transaction successful. Ref: AR567890123"
];
```