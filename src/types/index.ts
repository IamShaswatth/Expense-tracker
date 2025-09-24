export interface Transaction {
  id: string;
  amount: number;
  description: string;
  merchant: string;
  category: string;
  date: Date;
  upiId: string;
  transactionId: string;
}

export interface CategoryStats {
  category: string;
  amount: number;
  count: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  amount: number;
}