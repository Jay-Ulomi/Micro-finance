import api from "./config";

// Types
export interface Repayment {
  id: string;
  loanId: string;
  borrowerId: string;
  borrowerName: string;
  installmentNumber: number;
  dueDate: string;
  scheduledAmount: number;
  principalAmount: number;
  interestAmount: number;
  feesAmount?: number;
  paidAmount: number;
  paidDate?: string;
  paymentMethod?: "cash" | "bank_transfer" | "mobile_money" | "check" | "automatic";
  status: "pending" | "paid" | "partial" | "overdue" | "missed" | "waived";
  reference?: string;
  notes?: string;
  lateFee?: number;
  penaltyAmount?: number;
  balanceAfterPayment: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepaymentData {
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  scheduledAmount: number;
  principalAmount: number;
  interestAmount: number;
  feesAmount?: number;
  notes?: string;
}

export interface RepaymentReceipt {
  id: string;
  repaymentId: string;
  receiptNumber: string;
  borrowerName: string;
  loanId: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  generatedAt: string;
  generatedBy: string;
}

export interface RepaymentsResponse {
  repayments: Repayment[];
  total: number;
  page: number;
  limit: number;
}

export interface RepaymentStatistics {
  totalRepayments: number;
  totalAmount: number;
  overdueRepayments: number;
  overdueAmount: number;
  paidThisMonth: number;
  paidThisMonthAmount: number;
  collectionRate: number;
  averagePaymentDelay: number;
}

export interface CollectionSheet {
  id: string;
  loanOfficerId: string;
  loanOfficerName: string;
  date: string;
  area: string;
  borrowers: {
    borrowerId: string;
    borrowerName: string;
    loanId: string;
    dueAmount: number;
    collectedAmount: number;
    status: "collected" | "partial" | "not_collected" | "not_available";
    notes?: string;
  }[];
  totalDue: number;
  totalCollected: number;
  status: "draft" | "submitted" | "approved";
  createdAt: string;
  updatedAt: string;
}

// API Functions
export const repaymentsApi = {
  // Basic CRUD operations
  async getRepayments(
    params: {
      page?: number;
      limit?: number;
      loanId?: string;
      borrowerId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      loanOfficer?: string;
      paymentMethod?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<RepaymentsResponse> {
    const response = await api.get("/repayments", { params });
    return response.data;
  },

  async getRepayment(id: string): Promise<Repayment> {
    const response = await api.get(`/repayments/${id}`);
    return response.data;
  },

  async createRepayment(data: CreateRepaymentData): Promise<Repayment> {
    const response = await api.post("/repayments", data);
    return response.data;
  },

  async updateRepayment(id: string, data: Partial<Repayment>): Promise<Repayment> {
    const response = await api.put(`/repayments/${id}`, data);
    return response.data;
  },

  async deleteRepayment(id: string): Promise<void> {
    await api.delete(`/repayments/${id}`);
  },

  // Payment processing
  async processPayment(
    repaymentId: string,
    data: {
      paidAmount: number;
      paidDate: string;
      paymentMethod: "cash" | "bank_transfer" | "mobile_money" | "check";
      reference?: string;
      notes?: string;
    },
  ): Promise<Repayment> {
    const response = await api.post(`/repayments/${repaymentId}/process`, data);
    return response.data;
  },

  async reversePayment(repaymentId: string, reason: string): Promise<Repayment> {
    const response = await api.post(`/repayments/${repaymentId}/reverse`, { reason });
    return response.data;
  },

  async waiveRepayment(
    repaymentId: string,
    data: {
      waivedAmount: number;
      reason: string;
      notes?: string;
    },
  ): Promise<Repayment> {
    const response = await api.post(`/repayments/${repaymentId}/waive`, data);
    return response.data;
  },

  // Statistics and reports
  async getRepaymentStatistics(): Promise<RepaymentStatistics> {
    const response = await api.get("/repayments/statistics");
    return response.data;
  },

  async getOverdueRepayments(
    params: {
      loanId?: string;
      borrowerId?: string;
      daysOverdue?: number;
    } = {},
  ): Promise<Repayment[]> {
    const response = await api.get("/repayments/overdue", { params });
    return response.data;
  },

  async getRepaymentHistory(loanId: string): Promise<Repayment[]> {
    const response = await api.get(`/loans/${loanId}/repayments`);
    return response.data;
  },

  async getBorrowerRepaymentHistory(borrowerId: string): Promise<Repayment[]> {
    const response = await api.get(`/borrowers/${borrowerId}/repayments`);
    return response.data;
  },

  // Receipts
  async getRepaymentReceipt(id: string): Promise<RepaymentReceipt> {
    const response = await api.get(`/repayments/${id}/receipt`);
    return response.data;
  },

  async generateReceiptPDF(id: string): Promise<Blob> {
    const response = await api.get(`/repayments/${id}/receipt/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },

  async generateBulkReceipts(repaymentIds: string[]): Promise<Blob> {
    const response = await api.post(
      "/repayments/bulk-receipts",
      { repaymentIds },
      { responseType: "blob" },
    );
    return response.data;
  },

  // Collection sheets
  async getCollectionSheets(
    params: {
      loanOfficerId?: string;
      date?: string;
      status?: string;
    } = {},
  ): Promise<CollectionSheet[]> {
    const response = await api.get("/collection-sheets", { params });
    return response.data;
  },

  async createCollectionSheet(data: {
    loanOfficerId: string;
    date: string;
    area: string;
    borrowerIds: string[];
  }): Promise<CollectionSheet> {
    const response = await api.post("/collection-sheets", data);
    return response.data;
  },

  async updateCollectionSheet(
    id: string,
    data: Partial<CollectionSheet>,
  ): Promise<CollectionSheet> {
    const response = await api.put(`/collection-sheets/${id}`, data);
    return response.data;
  },

  async submitCollectionSheet(id: string): Promise<CollectionSheet> {
    const response = await api.post(`/collection-sheets/${id}/submit`);
    return response.data;
  },

  async approveCollectionSheet(id: string, data: { notes?: string }): Promise<CollectionSheet> {
    const response = await api.post(`/collection-sheets/${id}/approve`, data);
    return response.data;
  },

  // Bulk operations
  async bulkProcessPayments(
    payments: {
      repaymentId: string;
      paidAmount: number;
      paidDate: string;
      paymentMethod: string;
      reference?: string;
    }[],
  ): Promise<{ processed: number; failed: number; errors: any[] }> {
    const response = await api.post("/repayments/bulk-process", { payments });
    return response.data;
  },

  async bulkWaiveRepayments(
    repaymentIds: string[],
    data: {
      waivedAmount: number;
      reason: string;
      notes?: string;
    },
  ): Promise<void> {
    await api.post("/repayments/bulk-waive", { repaymentIds, ...data });
  },

  // Reminders and notifications
  async sendPaymentReminders(
    repaymentIds: string[],
    method: "sms" | "email" | "both",
  ): Promise<{
    sent: number;
    failed: number;
  }> {
    const response = await api.post("/repayments/send-reminders", { repaymentIds, method });
    return response.data;
  },

  async schedulePaymentReminders(data: {
    repaymentIds: string[];
    reminderDate: string;
    method: "sms" | "email" | "both";
    message?: string;
  }): Promise<void> {
    await api.post("/repayments/schedule-reminders", data);
  },

  // Export and reporting
  async exportRepayments(format: "csv" | "excel" | "pdf", filters?: any): Promise<Blob> {
    const response = await api.get("/repayments/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  async getCollectionReport(params: {
    startDate: string;
    endDate: string;
    loanOfficerId?: string;
    area?: string;
  }): Promise<any> {
    const response = await api.get("/repayments/collection-report", { params });
    return response.data;
  },

  async getPerformanceReport(params: {
    startDate: string;
    endDate: string;
    groupBy?: "day" | "week" | "month";
  }): Promise<any> {
    const response = await api.get("/repayments/performance-report", { params });
    return response.data;
  },
};
