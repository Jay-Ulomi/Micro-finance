import api from "./config";

// Types
export interface Expense {
  id: string;
  expenseNumber: string;
  category: string;
  subcategory?: string;
  description: string;
  amount: number;
  currency: string;
  expenseDate: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'mobile_money';
  vendor?: string;
  vendorContact?: string;
  receiptNumber?: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  paidBy?: string;
  paidAt?: string;
  department: string;
  costCenter?: string;
  project?: string;
  notes?: string;
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseData {
  category: string;
  subcategory?: string;
  description: string;
  amount: number;
  currency: string;
  expenseDate: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'mobile_money';
  vendor?: string;
  vendorContact?: string;
  receiptNumber?: string;
  department: string;
  costCenter?: string;
  project?: string;
  notes?: string;
  attachments?: string[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentCategoryId?: string;
  isActive: boolean;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseCategoryData {
  name: string;
  code: string;
  description?: string;
  parentCategoryId?: string;
  budget?: number;
}

export interface ExpenseReport {
  id: string;
  reportNumber: string;
  employeeId: string;
  employeeName: string;
  period: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  paidBy?: string;
  paidAt?: string;
  expenses: Expense[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseReportData {
  employeeId: string;
  period: string;
  startDate: string;
  endDate: string;
  expenses: string[]; // expense IDs
  notes?: string;
}

export interface ExpenseStatistics {
  totalExpenses: number;
  totalAmount: number;
  pendingExpenses: number;
  approvedExpenses: number;
  rejectedExpenses: number;
  paidExpenses: number;
  averageExpense: number;
  expensesThisMonth: number;
  amountThisMonth: number;
  topCategories: {
    category: string;
    amount: number;
    count: number;
  }[];
}

export interface ExpenseResponse {
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
}

// API Functions
export const expensesApi = {
  // Expense management
  async getExpenses(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    department?: string;
    startDate?: string;
    endDate?: string;
    createdBy?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<ExpenseResponse> {
    const response = await api.get("/expenses", { params });
    return response.data;
  },

  async getExpense(id: string): Promise<Expense> {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  async createExpense(data: CreateExpenseData): Promise<Expense> {
    const response = await api.post("/expenses", data);
    return response.data;
  },

  async updateExpense(id: string, data: Partial<CreateExpenseData>): Promise<Expense> {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },

  async deleteExpense(id: string): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },

  // Expense workflow
  async submitExpense(id: string): Promise<Expense> {
    const response = await api.post(`/expenses/${id}/submit`);
    return response.data;
  },

  async approveExpense(id: string, data: { notes?: string }): Promise<Expense> {
    const response = await api.post(`/expenses/${id}/approve`, data);
    return response.data;
  },

  async rejectExpense(id: string, data: { reason: string; notes?: string }): Promise<Expense> {
    const response = await api.post(`/expenses/${id}/reject`, data);
    return response.data;
  },

  async payExpense(id: string, data: {
    paymentDate: string;
    paymentMethod: string;
    reference?: string;
    notes?: string;
  }): Promise<Expense> {
    const response = await api.post(`/expenses/${id}/pay`, data);
    return response.data;
  },

  // Expense categories
  async getExpenseCategories(): Promise<ExpenseCategory[]> {
    const response = await api.get("/expenses/categories");
    return response.data;
  },

  async getExpenseCategory(id: string): Promise<ExpenseCategory> {
    const response = await api.get(`/expenses/categories/${id}`);
    return response.data;
  },

  async createExpenseCategory(data: CreateExpenseCategoryData): Promise<ExpenseCategory> {
    const response = await api.post("/expenses/categories", data);
    return response.data;
  },

  async updateExpenseCategory(id: string, data: Partial<CreateExpenseCategoryData>): Promise<ExpenseCategory> {
    const response = await api.put(`/expenses/categories/${id}`, data);
    return response.data;
  },

  async deleteExpenseCategory(id: string): Promise<void> {
    await api.delete(`/expenses/categories/${id}`);
  },

  // Expense reports
  async getExpenseReports(params: {
    page?: number;
    limit?: number;
    employeeId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ reports: ExpenseReport[]; total: number; page: number; limit: number }> {
    const response = await api.get("/expenses/reports", { params });
    return response.data;
  },

  async getExpenseReport(id: string): Promise<ExpenseReport> {
    const response = await api.get(`/expenses/reports/${id}`);
    return response.data;
  },

  async createExpenseReport(data: CreateExpenseReportData): Promise<ExpenseReport> {
    const response = await api.post("/expenses/reports", data);
    return response.data;
  },

  async updateExpenseReport(id: string, data: Partial<CreateExpenseReportData>): Promise<ExpenseReport> {
    const response = await api.put(`/expenses/reports/${id}`, data);
    return response.data;
  },

  async deleteExpenseReport(id: string): Promise<void> {
    await api.delete(`/expenses/reports/${id}`);
  },

  async submitExpenseReport(id: string): Promise<ExpenseReport> {
    const response = await api.post(`/expenses/reports/${id}/submit`);
    return response.data;
  },

  async approveExpenseReport(id: string, data: { notes?: string }): Promise<ExpenseReport> {
    const response = await api.post(`/expenses/reports/${id}/approve`, data);
    return response.data;
  },

  async rejectExpenseReport(id: string, data: { reason: string; notes?: string }): Promise<ExpenseReport> {
    const response = await api.post(`/expenses/reports/${id}/reject`, data);
    return response.data;
  },

  async payExpenseReport(id: string, data: {
    paymentDate: string;
    paymentMethod: string;
    reference?: string;
    notes?: string;
  }): Promise<ExpenseReport> {
    const response = await api.post(`/expenses/reports/${id}/pay`, data);
    return response.data;
  },

  // File uploads
  async uploadExpenseReceipt(expenseId: string, file: File): Promise<{ receiptUrl: string }> {
    const formData = new FormData();
    formData.append('receipt', file);
    
    const response = await api.post(`/expenses/${expenseId}/receipt`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async uploadExpenseAttachment(expenseId: string, file: File): Promise<{ attachmentUrl: string }> {
    const formData = new FormData();
    formData.append('attachment', file);
    
    const response = await api.post(`/expenses/${expenseId}/attachments`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Statistics and reports
  async getExpenseStatistics(): Promise<ExpenseStatistics> {
    const response = await api.get("/expenses/statistics");
    return response.data;
  },

  async getExpenseByCategory(params: {
    startDate: string;
    endDate: string;
    category?: string;
  }): Promise<{
    category: string;
    amount: number;
    count: number;
    percentage: number;
  }[]> {
    const response = await api.get("/expenses/by-category", { params });
    return response.data;
  },

  async getExpenseByDepartment(params: {
    startDate: string;
    endDate: string;
    department?: string;
  }): Promise<{
    department: string;
    amount: number;
    count: number;
    percentage: number;
  }[]> {
    const response = await api.get("/expenses/by-department", { params });
    return response.data;
  },

  async getExpenseTrends(params: {
    startDate: string;
    endDate: string;
    groupBy: 'day' | 'week' | 'month' | 'quarter';
    category?: string;
    department?: string;
  }): Promise<{
    period: string;
    amount: number;
    count: number;
  }[]> {
    const response = await api.get("/expenses/trends", { params });
    return response.data;
  },

  // Bulk operations
  async bulkUpdateExpenses(expenseIds: string[], updates: Partial<CreateExpenseData>): Promise<void> {
    await api.put("/expenses/bulk-update", { expenseIds, updates });
  },

  async bulkApproveExpenses(expenseIds: string[], data: { notes?: string }): Promise<void> {
    await api.put("/expenses/bulk-approve", { expenseIds, ...data });
  },

  async bulkRejectExpenses(expenseIds: string[], data: { reason: string; notes?: string }): Promise<void> {
    await api.put("/expenses/bulk-reject", { expenseIds, ...data });
  },

  async bulkPayExpenses(expenseIds: string[], data: {
    paymentDate: string;
    paymentMethod: string;
    reference?: string;
  }): Promise<void> {
    await api.put("/expenses/bulk-pay", { expenseIds, ...data });
  },

  // Export
  async exportExpenses(format: 'csv' | 'excel' | 'pdf', filters?: any): Promise<Blob> {
    const response = await api.get("/expenses/export", {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  async exportExpenseReports(format: 'csv' | 'excel' | 'pdf', filters?: any): Promise<Blob> {
    const response = await api.get("/expenses/reports/export", {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  // Budget management
  async getBudgetByCategory(categoryId: string, params: {
    year: number;
    month?: number;
  }): Promise<{
    budget: number;
    spent: number;
    remaining: number;
    percentage: number;
  }> {
    const response = await api.get(`/expenses/categories/${categoryId}/budget`, { params });
    return response.data;
  },

  async updateBudgetByCategory(categoryId: string, data: {
    year: number;
    month?: number;
    budget: number;
  }): Promise<void> {
    await api.put(`/expenses/categories/${categoryId}/budget`, data);
  },

  async getBudgetReport(params: {
    year: number;
    month?: number;
    department?: string;
  }): Promise<{
    category: string;
    budget: number;
    spent: number;
    remaining: number;
    percentage: number;
  }[]> {
    const response = await api.get("/expenses/budget-report", { params });
    return response.data;
  },
};
