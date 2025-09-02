import api from "./config";

// Types
export interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  parentAccountId?: string;
  level: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChartOfAccountData {
  accountCode: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  parentAccountId?: string;
  description?: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: string;
  reference?: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted' | 'reversed';
  postedBy?: string;
  postedAt?: string;
  reversedBy?: string;
  reversedAt?: string;
  reversalReason?: string;
  lineItems: JournalEntryLine[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
  reference?: string;
}

export interface CreateJournalEntryData {
  entryDate: string;
  reference?: string;
  description: string;
  lineItems: {
    accountId: string;
    debit: number;
    credit: number;
    description?: string;
    reference?: string;
  }[];
}

export interface TrialBalance {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  debitBalance: number;
  creditBalance: number;
  netBalance: number;
}

export interface IncomeStatement {
  period: string;
  revenue: {
    totalRevenue: number;
    items: {
      accountId: string;
      accountName: string;
      amount: number;
    }[];
  };
  expenses: {
    totalExpenses: number;
    items: {
      accountId: string;
      accountName: string;
      amount: number;
    }[];
  };
  netIncome: number;
}

export interface BalanceSheet {
  period: string;
  assets: {
    currentAssets: {
      total: number;
      items: {
        accountId: string;
        accountName: string;
        amount: number;
      }[];
    };
    fixedAssets: {
      total: number;
      items: {
        accountId: string;
        accountName: string;
        amount: number;
      }[];
    };
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: {
      total: number;
      items: {
        accountId: string;
        accountName: string;
        amount: number;
      }[];
    };
    longTermLiabilities: {
      total: number;
      items: {
        accountId: string;
        accountName: string;
        amount: number;
      }[];
    };
    totalLiabilities: number;
  };
  equity: {
    total: number;
    items: {
      accountId: string;
      accountName: string;
      amount: number;
    }[];
  };
  totalLiabilitiesAndEquity: number;
}

export interface CashFlowStatement {
  period: string;
  operatingActivities: {
    netIncome: number;
    adjustments: {
      depreciation: number;
      loanLossProvision: number;
      other: number;
    };
    changesInWorkingCapital: {
      accountsReceivable: number;
      inventory: number;
      accountsPayable: number;
      other: number;
    };
    netCashFromOperations: number;
  };
  investingActivities: {
    purchaseOfAssets: number;
    saleOfAssets: number;
    loansMade: number;
    loansCollected: number;
    netCashFromInvesting: number;
  };
  financingActivities: {
    borrowings: number;
    repayments: number;
    equityContributions: number;
    dividends: number;
    netCashFromFinancing: number;
  };
  netChangeInCash: number;
  beginningCash: number;
  endingCash: number;
}

// API Functions
export const accountingApi = {
  // Chart of Accounts
  async getChartOfAccounts(): Promise<ChartOfAccount[]> {
    const response = await api.get("/accounting/chart-of-accounts");
    return response.data;
  },

  async getChartOfAccount(id: string): Promise<ChartOfAccount> {
    const response = await api.get(`/accounting/chart-of-accounts/${id}`);
    return response.data;
  },

  async createChartOfAccount(data: CreateChartOfAccountData): Promise<ChartOfAccount> {
    const response = await api.post("/accounting/chart-of-accounts", data);
    return response.data;
  },

  async updateChartOfAccount(id: string, data: Partial<CreateChartOfAccountData>): Promise<ChartOfAccount> {
    const response = await api.put(`/accounting/chart-of-accounts/${id}`, data);
    return response.data;
  },

  async deleteChartOfAccount(id: string): Promise<void> {
    await api.delete(`/accounting/chart-of-accounts/${id}`);
  },

  async deactivateChartOfAccount(id: string): Promise<ChartOfAccount> {
    const response = await api.put(`/accounting/chart-of-accounts/${id}/deactivate`);
    return response.data;
  },

  // Journal Entries
  async getJournalEntries(params: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    accountId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ entries: JournalEntry[]; total: number; page: number; limit: number }> {
    const response = await api.get("/accounting/journal-entries", { params });
    return response.data;
  },

  async getJournalEntry(id: string): Promise<JournalEntry> {
    const response = await api.get(`/accounting/journal-entries/${id}`);
    return response.data;
  },

  async createJournalEntry(data: CreateJournalEntryData): Promise<JournalEntry> {
    const response = await api.post("/accounting/journal-entries", data);
    return response.data;
  },

  async updateJournalEntry(id: string, data: Partial<CreateJournalEntryData>): Promise<JournalEntry> {
    const response = await api.put(`/accounting/journal-entries/${id}`, data);
    return response.data;
  },

  async deleteJournalEntry(id: string): Promise<void> {
    await api.delete(`/accounting/journal-entries/${id}`);
  },

  async postJournalEntry(id: string): Promise<JournalEntry> {
    const response = await api.post(`/accounting/journal-entries/${id}/post`);
    return response.data;
  },

  async reverseJournalEntry(id: string, data: { reason: string }): Promise<JournalEntry> {
    const response = await api.post(`/accounting/journal-entries/${id}/reverse`, data);
    return response.data;
  },

  // Financial Statements
  async getTrialBalance(params: {
    asOfDate: string;
    accountType?: string;
  }): Promise<TrialBalance[]> {
    const response = await api.get("/accounting/trial-balance", { params });
    return response.data;
  },

  async getIncomeStatement(params: {
    startDate: string;
    endDate: string;
  }): Promise<IncomeStatement> {
    const response = await api.get("/accounting/income-statement", { params });
    return response.data;
  },

  async getBalanceSheet(params: {
    asOfDate: string;
  }): Promise<BalanceSheet> {
    const response = await api.get("/accounting/balance-sheet", { params });
    return response.data;
  },

  async getCashFlowStatement(params: {
    startDate: string;
    endDate: string;
  }): Promise<CashFlowStatement> {
    const response = await api.get("/accounting/cash-flow-statement", { params });
    return response.data;
  },

  // Account Balances
  async getAccountBalance(accountId: string, params: {
    asOfDate: string;
  }): Promise<{
    accountId: string;
    accountName: string;
    debitBalance: number;
    creditBalance: number;
    netBalance: number;
  }> {
    const response = await api.get(`/accounting/accounts/${accountId}/balance`, { params });
    return response.data;
  },

  async getAccountHistory(accountId: string, params: {
    startDate: string;
    endDate: string;
    page?: number;
    limit?: number;
  }): Promise<{
    transactions: {
      date: string;
      reference: string;
      description: string;
      debit: number;
      credit: number;
      balance: number;
    }[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get(`/accounting/accounts/${accountId}/history`, { params });
    return response.data;
  },

  // Period Management
  async getAccountingPeriods(): Promise<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'open' | 'closed' | 'locked';
    closedBy?: string;
    closedAt?: string;
  }[]> {
    const response = await api.get("/accounting/periods");
    return response.data;
  },

  async createAccountingPeriod(data: {
    name: string;
    startDate: string;
    endDate: string;
  }): Promise<any> {
    const response = await api.post("/accounting/periods", data);
    return response.data;
  },

  async closeAccountingPeriod(periodId: string): Promise<any> {
    const response = await api.post(`/accounting/periods/${periodId}/close`);
    return response.data;
  },

  async lockAccountingPeriod(periodId: string): Promise<any> {
    const response = await api.post(`/accounting/periods/${periodId}/lock`);
    return response.data;
  },

  // Export
  async exportTrialBalance(params: {
    asOfDate: string;
    format: 'pdf' | 'excel' | 'csv';
  }): Promise<Blob> {
    const response = await api.get("/accounting/trial-balance/export", {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  async exportIncomeStatement(params: {
    startDate: string;
    endDate: string;
    format: 'pdf' | 'excel' | 'csv';
  }): Promise<Blob> {
    const response = await api.get("/accounting/income-statement/export", {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  async exportBalanceSheet(params: {
    asOfDate: string;
    format: 'pdf' | 'excel' | 'csv';
  }): Promise<Blob> {
    const response = await api.get("/accounting/balance-sheet/export", {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  async exportCashFlowStatement(params: {
    startDate: string;
    endDate: string;
    format: 'pdf' | 'excel' | 'csv';
  }): Promise<Blob> {
    const response = await api.get("/accounting/cash-flow-statement/export", {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // Reports
  async getGeneralLedger(params: {
    startDate: string;
    endDate: string;
    accountId?: string;
    format?: 'pdf' | 'excel' | 'csv';
  }): Promise<Blob> {
    const response = await api.get("/accounting/general-ledger", {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  async getJournalReport(params: {
    startDate: string;
    endDate: string;
    status?: string;
    format?: 'pdf' | 'excel' | 'csv';
  }): Promise<Blob> {
    const response = await api.get("/accounting/journal-report", {
      params,
      responseType: 'blob'
    });
    return response.data;
  },
};
