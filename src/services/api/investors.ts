import api from "./config";

// Types
export interface Investor {
  id: string;
  investorCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  investorType: "individual" | "institutional" | "corporate";
  riskProfile: "conservative" | "moderate" | "aggressive";
  investmentLimit: number;
  currentInvestment: number;
  availableBalance: number;
  status: "active" | "inactive" | "suspended";
  registrationDate: string;
  lastActivityDate?: string;
  documents: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvestorData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  investorType: "individual" | "institutional" | "corporate";
  riskProfile: "conservative" | "moderate" | "aggressive";
  investmentLimit: number;
  documents?: string[];
  notes?: string;
}

export interface InvestorAccount {
  id: string;
  accountNumber: string;
  investorId: string;
  investorName: string;
  accountType: "investment" | "dividend" | "capital";
  balance: number;
  currency: string;
  status: "active" | "frozen" | "closed";
  openedDate: string;
  lastTransactionDate?: string;
  totalInvested: number;
  totalWithdrawn: number;
  totalDividends: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvestorAccountData {
  investorId: string;
  accountType: "investment" | "dividend" | "capital";
  initialBalance: number;
  currency: string;
  notes?: string;
}

export interface Investment {
  id: string;
  investmentNumber: string;
  investorId: string;
  investorName: string;
  loanId: string;
  borrowerName: string;
  investmentAmount: number;
  interestRate: number;
  investmentDate: string;
  maturityDate: string;
  status: "active" | "matured" | "cancelled" | "defaulted";
  expectedReturn: number;
  actualReturn?: number;
  riskLevel: "low" | "medium" | "high";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvestmentData {
  investorId: string;
  loanId: string;
  investmentAmount: number;
  interestRate: number;
  investmentDate: string;
  maturityDate: string;
  riskLevel: "low" | "medium" | "high";
  notes?: string;
}

export interface Dividend {
  id: string;
  investmentId: string;
  investorId: string;
  investorName: string;
  amount: number;
  dividendDate: string;
  period: string;
  status: "pending" | "paid" | "reinvested";
  paymentMethod?: "bank_transfer" | "check" | "reinvest";
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateDividendData {
  investmentId: string;
  amount: number;
  dividendDate: string;
  period: string;
  status: "pending" | "paid" | "reinvested";
  paymentMethod?: "bank_transfer" | "check" | "reinvest";
  reference?: string;
  notes?: string;
}

export interface InvestorsResponse {
  investors: Investor[];
  total: number;
  page: number;
  limit: number;
}

export interface InvestorStatistics {
  totalInvestors: number;
  activeInvestors: number;
  totalInvestment: number;
  totalDividendsPaid: number;
  averageInvestment: number;
  newInvestorsThisMonth: number;
  totalReturn: number;
  averageReturn: number;
}

// API Functions
export const investorsApi = {
  // Investor management
  async getInvestors(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      investorType?: string;
      riskProfile?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<InvestorsResponse> {
    const response = await api.get("/investors", { params });
    return response.data;
  },

  async getInvestor(id: string): Promise<Investor> {
    const response = await api.get(`/investors/${id}`);
    return response.data;
  },

  async createInvestor(data: CreateInvestorData): Promise<Investor> {
    const response = await api.post("/investors", data);
    return response.data;
  },

  async updateInvestor(id: string, data: Partial<CreateInvestorData>): Promise<Investor> {
    const response = await api.put(`/investors/${id}`, data);
    return response.data;
  },

  async deleteInvestor(id: string): Promise<void> {
    await api.delete(`/investors/${id}`);
  },

  async suspendInvestor(id: string, data: { reason: string; notes?: string }): Promise<Investor> {
    const response = await api.put(`/investors/${id}/suspend`, data);
    return response.data;
  },

  async activateInvestor(id: string, data: { notes?: string }): Promise<Investor> {
    const response = await api.put(`/investors/${id}/activate`, data);
    return response.data;
  },

  // Investor accounts
  async getInvestorAccounts(
    params: {
      investorId?: string;
      accountType?: string;
      status?: string;
    } = {},
  ): Promise<InvestorAccount[]> {
    const response = await api.get("/investors/accounts", { params });
    return response.data;
  },

  async getInvestorAccount(id: string): Promise<InvestorAccount> {
    const response = await api.get(`/investors/accounts/${id}`);
    return response.data;
  },

  async createInvestorAccount(data: CreateInvestorAccountData): Promise<InvestorAccount> {
    const response = await api.post("/investors/accounts", data);
    return response.data;
  },

  async updateInvestorAccount(
    id: string,
    data: Partial<CreateInvestorAccountData>,
  ): Promise<InvestorAccount> {
    const response = await api.put(`/investors/accounts/${id}`, data);
    return response.data;
  },

  async closeInvestorAccount(
    id: string,
    data: { closureDate: string; reason: string; notes?: string },
  ): Promise<InvestorAccount> {
    const response = await api.put(`/investors/accounts/${id}/close`, data);
    return response.data;
  },

  // Investments
  async getInvestments(
    params: {
      page?: number;
      limit?: number;
      investorId?: string;
      loanId?: string;
      status?: string;
      riskLevel?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<{ investments: Investment[]; total: number; page: number; limit: number }> {
    const response = await api.get("/investments", { params });
    return response.data;
  },

  async getInvestment(id: string): Promise<Investment> {
    const response = await api.get(`/investments/${id}`);
    return response.data;
  },

  async createInvestment(data: CreateInvestmentData): Promise<Investment> {
    const response = await api.post("/investments", data);
    return response.data;
  },

  async updateInvestment(id: string, data: Partial<CreateInvestmentData>): Promise<Investment> {
    const response = await api.put(`/investments/${id}`, data);
    return response.data;
  },

  async cancelInvestment(
    id: string,
    data: { reason: string; notes?: string },
  ): Promise<Investment> {
    const response = await api.put(`/investments/${id}/cancel`, data);
    return response.data;
  },

  async matureInvestment(
    id: string,
    data: { actualReturn: number; notes?: string },
  ): Promise<Investment> {
    const response = await api.put(`/investments/${id}/mature`, data);
    return response.data;
  },

  // Dividends
  async getDividends(
    params: {
      page?: number;
      limit?: number;
      investorId?: string;
      investmentId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<{ dividends: Dividend[]; total: number; page: number; limit: number }> {
    const response = await api.get("/dividends", { params });
    return response.data;
  },

  async getDividend(id: string): Promise<Dividend> {
    const response = await api.get(`/dividends/${id}`);
    return response.data;
  },

  async createDividend(data: CreateDividendData): Promise<Dividend> {
    const response = await api.post("/dividends", data);
    return response.data;
  },

  async updateDividend(id: string, data: Partial<CreateDividendData>): Promise<Dividend> {
    const response = await api.put(`/dividends/${id}`, data);
    return response.data;
  },

  async payDividend(
    id: string,
    data: {
      paymentDate: string;
      paymentMethod: "bank_transfer" | "check" | "reinvest";
      reference?: string;
      notes?: string;
    },
  ): Promise<Dividend> {
    const response = await api.post(`/dividends/${id}/pay`, data);
    return response.data;
  },

  async bulkPayDividends(
    dividendIds: string[],
    data: {
      paymentDate: string;
      paymentMethod: "bank_transfer" | "check" | "reinvest";
      reference?: string;
    },
  ): Promise<{ processed: number; failed: number; errors: any[] }> {
    const response = await api.post("/dividends/bulk-pay", { dividendIds, ...data });
    return response.data;
  },

  // Statistics and reports
  async getInvestorStatistics(): Promise<InvestorStatistics> {
    const response = await api.get("/investors/statistics");
    return response.data;
  },

  async getInvestorPortfolio(investorId: string): Promise<{
    totalInvestment: number;
    activeInvestments: number;
    totalReturn: number;
    averageReturn: number;
    investments: Investment[];
  }> {
    const response = await api.get(`/investors/${investorId}/portfolio`);
    return response.data;
  },

  async getInvestmentPerformance(investmentId: string): Promise<{
    investment: Investment;
    dividends: Dividend[];
    totalDividends: number;
    returnRate: number;
  }> {
    const response = await api.get(`/investments/${investmentId}/performance`);
    return response.data;
  },

  // Bulk operations
  async bulkUpdateInvestors(
    investorIds: string[],
    updates: Partial<CreateInvestorData>,
  ): Promise<void> {
    await api.put("/investors/bulk-update", { investorIds, updates });
  },

  async bulkSuspendInvestors(
    investorIds: string[],
    data: { reason: string; notes?: string },
  ): Promise<void> {
    await api.put("/investors/bulk-suspend", { investorIds, ...data });
  },

  // Export
  async exportInvestors(format: "csv" | "excel" | "pdf", filters?: any): Promise<Blob> {
    const response = await api.get("/investors/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  async exportInvestments(format: "csv" | "excel" | "pdf", filters?: any): Promise<Blob> {
    const response = await api.get("/investments/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  async exportDividends(format: "csv" | "excel" | "pdf", filters?: any): Promise<Blob> {
    const response = await api.get("/dividends/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  // Reports
  async getInvestorReport(params: {
    startDate: string;
    endDate: string;
    reportType: "summary" | "detailed" | "performance";
    investorId?: string;
  }): Promise<any> {
    const response = await api.get("/investors/reports", { params });
    return response.data;
  },

  async getDividendReport(params: {
    startDate: string;
    endDate: string;
    status?: string;
    investorId?: string;
  }): Promise<any> {
    const response = await api.get("/dividends/reports", { params });
    return response.data;
  },

  async getMaturityReport(params: {
    startDate: string;
    endDate: string;
    status?: string;
  }): Promise<any> {
    const response = await api.get("/investments/maturity-report", { params });
    return response.data;
  },
};
