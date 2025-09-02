import api from "./config";

// Types
export interface SavingsAccount {
  id: string;
  accountNumber: string;
  borrowerId: string;
  borrowerName: string;
  accountType: 'regular' | 'fixed_deposit' | 'recurring' | 'goal_based';
  balance: number;
  interestRate: number;
  minimumBalance: number;
  status: 'active' | 'dormant' | 'closed' | 'frozen';
  openedDate: string;
  maturityDate?: string;
  lastTransactionDate?: string;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInterestEarned: number;
  nextInterestCalculation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingsAccountData {
  borrowerId: string;
  accountType: 'regular' | 'fixed_deposit' | 'recurring' | 'goal_based';
  initialDeposit: number;
  interestRate: number;
  minimumBalance?: number;
  maturityDate?: string;
  goalAmount?: number;
  notes?: string;
}

export interface SavingsTransaction {
  id: string;
  accountId: string;
  accountNumber: string;
  borrowerId: string;
  borrowerName: string;
  transactionType: 'deposit' | 'withdrawal' | 'interest' | 'fee' | 'transfer_in' | 'transfer_out';
  amount: number;
  balance: number;
  reference?: string;
  description?: string;
  transactionDate: string;
  processedBy: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  notes?: string;
  createdAt: string;
}

export interface CreateSavingsTransactionData {
  accountId: string;
  transactionType: 'deposit' | 'withdrawal' | 'fee' | 'transfer_in' | 'transfer_out';
  amount: number;
  reference?: string;
  description?: string;
  transactionDate: string;
  notes?: string;
}

export interface SavingsResponse {
  accounts: SavingsAccount[];
  total: number;
  page: number;
  limit: number;
}

export interface SavingsStatistics {
  totalAccounts: number;
  totalBalance: number;
  activeAccounts: number;
  depositsThisMonth: number;
  withdrawalsThisMonth: number;
  interestPaidThisMonth: number;
  averageBalance: number;
  newAccountsThisMonth: number;
}

export interface InterestCalculation {
  accountId: string;
  accountNumber: string;
  borrowerName: string;
  balance: number;
  interestRate: number;
  interestEarned: number;
  calculationDate: string;
  period: string;
}

// API Functions
export const savingsApi = {
  // Account management
  async getSavingsAccounts(params: {
    page?: number;
    limit?: number;
    search?: string;
    borrowerId?: string;
    accountType?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<SavingsResponse> {
    const response = await api.get("/savings/accounts", { params });
    return response.data;
  },

  async getSavingsAccount(id: string): Promise<SavingsAccount> {
    const response = await api.get(`/savings/accounts/${id}`);
    return response.data;
  },

  async createSavingsAccount(data: CreateSavingsAccountData): Promise<SavingsAccount> {
    const response = await api.post("/savings/accounts", data);
    return response.data;
  },

  async updateSavingsAccount(id: string, data: Partial<CreateSavingsAccountData>): Promise<SavingsAccount> {
    const response = await api.put(`/savings/accounts/${id}`, data);
    return response.data;
  },

  async closeSavingsAccount(id: string, data: { closureDate: string; reason: string; notes?: string }): Promise<SavingsAccount> {
    const response = await api.put(`/savings/accounts/${id}/close`, data);
    return response.data;
  },

  async freezeSavingsAccount(id: string, data: { reason: string; notes?: string }): Promise<SavingsAccount> {
    const response = await api.put(`/savings/accounts/${id}/freeze`, data);
    return response.data;
  },

  async unfreezeSavingsAccount(id: string, data: { notes?: string }): Promise<SavingsAccount> {
    const response = await api.put(`/savings/accounts/${id}/unfreeze`, data);
    return response.data;
  },

  // Transactions
  async getSavingsTransactions(params: {
    page?: number;
    limit?: number;
    accountId?: string;
    borrowerId?: string;
    transactionType?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ transactions: SavingsTransaction[]; total: number; page: number; limit: number }> {
    const response = await api.get("/savings/transactions", { params });
    return response.data;
  },

  async getSavingsTransaction(id: string): Promise<SavingsTransaction> {
    const response = await api.get(`/savings/transactions/${id}`);
    return response.data;
  },

  async createSavingsTransaction(data: CreateSavingsTransactionData): Promise<SavingsTransaction> {
    const response = await api.post("/savings/transactions", data);
    return response.data;
  },

  async updateSavingsTransaction(id: string, data: Partial<SavingsTransaction>): Promise<SavingsTransaction> {
    const response = await api.put(`/savings/transactions/${id}`, data);
    return response.data;
  },

  async reverseSavingsTransaction(id: string, reason: string): Promise<SavingsTransaction> {
    const response = await api.post(`/savings/transactions/${id}/reverse`, { reason });
    return response.data;
  },

  // Deposit and withdrawal
  async deposit(accountId: string, data: {
    amount: number;
    reference?: string;
    description?: string;
    transactionDate: string;
    notes?: string;
  }): Promise<SavingsTransaction> {
    const response = await api.post(`/savings/accounts/${accountId}/deposit`, data);
    return response.data;
  },

  async withdraw(accountId: string, data: {
    amount: number;
    reference?: string;
    description?: string;
    transactionDate: string;
    notes?: string;
  }): Promise<SavingsTransaction> {
    const response = await api.post(`/savings/accounts/${accountId}/withdraw`, data);
    return response.data;
  },

  async transfer(data: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    reference?: string;
    description?: string;
    transactionDate: string;
    notes?: string;
  }): Promise<{ fromTransaction: SavingsTransaction; toTransaction: SavingsTransaction }> {
    const response = await api.post("/savings/transfer", data);
    return response.data;
  },

  // Interest calculation
  async calculateInterest(accountId: string, data: {
    calculationDate: string;
    period: string;
  }): Promise<InterestCalculation> {
    const response = await api.post(`/savings/accounts/${accountId}/calculate-interest`, data);
    return response.data;
  },

  async processInterest(accountId: string, data: {
    interestAmount: number;
    calculationDate: string;
    period: string;
  }): Promise<SavingsTransaction> {
    const response = await api.post(`/savings/accounts/${accountId}/process-interest`, data);
    return response.data;
  },

  async bulkProcessInterest(data: {
    calculationDate: string;
    period: string;
    accountIds?: string[];
  }): Promise<{ processed: number; failed: number; errors: any[] }> {
    const response = await api.post("/savings/bulk-process-interest", data);
    return response.data;
  },

  // Statistics and reports
  async getSavingsStatistics(): Promise<SavingsStatistics> {
    const response = await api.get("/savings/statistics");
    return response.data;
  },

  async getAccountStatement(accountId: string, params: {
    startDate: string;
    endDate: string;
    format?: 'pdf' | 'excel';
  }): Promise<Blob> {
    const response = await api.get(`/savings/accounts/${accountId}/statement`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  async getBorrowerSavingsHistory(borrowerId: string): Promise<SavingsAccount[]> {
    const response = await api.get(`/savings/borrower/${borrowerId}/history`);
    return response.data;
  },

  // Bulk operations
  async bulkUpdateAccounts(accountIds: string[], updates: Partial<CreateSavingsAccountData>): Promise<void> {
    await api.put("/savings/accounts/bulk-update", { accountIds, updates });
  },

  async bulkCloseAccounts(accountIds: string[], data: {
    closureDate: string;
    reason: string;
    notes?: string;
  }): Promise<void> {
    await api.put("/savings/accounts/bulk-close", { accountIds, ...data });
  },

  // Export
  async exportSavingsAccounts(format: 'csv' | 'excel' | 'pdf', filters?: any): Promise<Blob> {
    const response = await api.get("/savings/accounts/export", {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  async exportSavingsTransactions(format: 'csv' | 'excel' | 'pdf', filters?: any): Promise<Blob> {
    const response = await api.get("/savings/transactions/export", {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  // Reports
  async getSavingsReport(params: {
    startDate: string;
    endDate: string;
    reportType: 'summary' | 'detailed' | 'interest';
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<any> {
    const response = await api.get("/savings/reports", { params });
    return response.data;
  },

  async getMaturityReport(params: {
    startDate: string;
    endDate: string;
    accountType?: string;
  }): Promise<any> {
    const response = await api.get("/savings/maturity-report", { params });
    return response.data;
  },
};
