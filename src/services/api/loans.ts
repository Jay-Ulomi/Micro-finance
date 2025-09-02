import api from "./config";

// Types
export interface Loan {
  id: string;
  borrowerId: string;
  borrowerName: string;
  loanType: "personal" | "business" | "agricultural" | "microfinance" | "emergency";
  loanCategory: "secured" | "unsecured";
  applicationDate: string;
  requestedAmount: number;
  approvedAmount?: number;
  interestRate: number;
  loanTerm: number; // in months
  repaymentFrequency: "weekly" | "bi-weekly" | "monthly" | "quarterly";
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "disbursed"
    | "active"
    | "completed"
    | "defaulted"
    | "written_off";
  purpose: string;
  collateral?: {
    type: string;
    description: string;
    value: number;
    documents: string[];
  };
  guarantors?: {
    id: string;
    name: string;
    relationship: string;
    contact: string;
  }[];
  loanOfficer: string;
  applicationDocuments: string[];
  approvalDocuments?: string[];
  disbursementDate?: string;
  firstPaymentDate?: string;
  maturityDate?: string;
  totalInterest: number;
  totalAmount: number;
  outstandingBalance: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  paymentHistory: PaymentRecord[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanData {
  borrowerId: string;
  loanType: "personal" | "business" | "agricultural" | "microfinance" | "emergency";
  loanCategory: "secured" | "unsecured";
  requestedAmount: number;
  interestRate: number;
  loanTerm: number;
  repaymentFrequency: "weekly" | "bi-weekly" | "monthly" | "quarterly";
  purpose: string;
  collateral?: {
    type: string;
    description: string;
    value: number;
    documents: string[];
  };
  guarantors?: {
    name: string;
    relationship: string;
    contact: string;
  }[];
  loanOfficer: string;
  applicationDocuments: string[];
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  paymentDate: string;
  amount: number;
  principal: number;
  interest: number;
  fees?: number;
  balance: number;
  status: "paid" | "partial" | "overdue" | "missed";
  paymentMethod: "cash" | "bank_transfer" | "mobile_money" | "check";
  reference?: string;
  notes?: string;
}

export interface LoansResponse {
  loans: Loan[];
  total: number;
  page: number;
  limit: number;
}

export interface LoanStatistics {
  totalLoans: number;
  activeLoans: number;
  pendingApproval: number;
  disbursedThisMonth: number;
  totalDisbursed: number;
  totalOutstanding: number;
  overdueLoans: number;
  defaultRate: number;
  averageLoanAmount: number;
  averageInterestRate: number;
}

export interface LoanSchedule {
  id: string;
  loanId: string;
  installments: {
    installmentNumber: number;
    dueDate: string;
    principal: number;
    interest: number;
    total: number;
    balance: number;
    status: "pending" | "paid" | "overdue" | "partial";
  }[];
}

// API Functions
export const loansApi = {
  // Basic CRUD operations
  async getLoans(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      borrowerId?: string;
      loanType?: string;
      loanOfficer?: string;
      dateFrom?: string;
      dateTo?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<LoansResponse> {
    const response = await api.get("/loans", { params });
    return response.data;
  },

  async getLoan(id: string): Promise<Loan> {
    const response = await api.get(`/loans/${id}`);
    return response.data;
  },

  async createLoan(data: CreateLoanData): Promise<Loan> {
    const response = await api.post("/loans", data);
    return response.data;
  },

  async updateLoan(id: string, data: Partial<CreateLoanData>): Promise<Loan> {
    const response = await api.put(`/loans/${id}`, data);
    return response.data;
  },

  async deleteLoan(id: string): Promise<void> {
    await api.delete(`/loans/${id}`);
  },

  // Loan workflow
  async submitLoanApplication(id: string): Promise<Loan> {
    const response = await api.put(`/loans/${id}/submit`);
    return response.data;
  },

  async approveLoan(
    id: string,
    data: { approvedAmount?: number; notes?: string; conditions?: string[] },
  ): Promise<Loan> {
    const response = await api.put(`/loans/${id}/approve`, data);
    return response.data;
  },

  async rejectLoan(id: string, data: { reason: string; notes?: string }): Promise<Loan> {
    const response = await api.put(`/loans/${id}/reject`, data);
    return response.data;
  },

  async disburseLoan(
    id: string,
    data: { disbursementDate: string; disbursementMethod: string; notes?: string },
  ): Promise<Loan> {
    const response = await api.put(`/loans/${id}/disburse`, data);
    return response.data;
  },

  async closeLoan(
    id: string,
    data: { closureDate: string; closureReason: string; notes?: string },
  ): Promise<Loan> {
    const response = await api.put(`/loans/${id}/close`, data);
    return response.data;
  },

  async writeOffLoan(
    id: string,
    data: { writeOffDate: string; writeOffReason: string; amount: number; notes?: string },
  ): Promise<Loan> {
    const response = await api.put(`/loans/${id}/write-off`, data);
    return response.data;
  },

  // Statistics
  async getLoanStatistics(): Promise<LoanStatistics> {
    const response = await api.get("/loans/statistics");
    return response.data;
  },

  async getBorrowerLoanHistory(borrowerId: string): Promise<Loan[]> {
    const response = await api.get(`/loans/borrower/${borrowerId}/history`);
    return response.data;
  },

  // Documents
  async uploadLoanDocument(loanId: string, formData: FormData): Promise<{ documentUrl: string }> {
    const response = await api.post(`/loans/${loanId}/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getLoanDocuments(loanId: string): Promise<any[]> {
    const response = await api.get(`/loans/${loanId}/documents`);
    return response.data;
  },

  async deleteLoanDocument(loanId: string, documentId: string): Promise<void> {
    await api.delete(`/loans/${loanId}/documents/${documentId}`);
  },

  // Payment schedule
  async generateLoanSchedule(loanId: string): Promise<LoanSchedule> {
    const response = await api.post(`/loans/${loanId}/schedule`);
    return response.data;
  },

  async getLoanSchedule(loanId: string): Promise<LoanSchedule> {
    const response = await api.get(`/loans/${loanId}/schedule`);
    return response.data;
  },

  async updateLoanSchedule(loanId: string, schedule: Partial<LoanSchedule>): Promise<LoanSchedule> {
    const response = await api.put(`/loans/${loanId}/schedule`, schedule);
    return response.data;
  },

  // Payments
  async recordPayment(
    loanId: string,
    data: {
      paymentDate: string;
      amount: number;
      paymentMethod: "cash" | "bank_transfer" | "mobile_money" | "check";
      reference?: string;
      notes?: string;
    },
  ): Promise<PaymentRecord> {
    const response = await api.post(`/loans/${loanId}/payments`, data);
    return response.data;
  },

  async getPaymentHistory(loanId: string): Promise<PaymentRecord[]> {
    const response = await api.get(`/loans/${loanId}/payments`);
    return response.data;
  },

  async updatePayment(
    loanId: string,
    paymentId: string,
    data: Partial<PaymentRecord>,
  ): Promise<PaymentRecord> {
    const response = await api.put(`/loans/${loanId}/payments/${paymentId}`, data);
    return response.data;
  },

  async deletePayment(loanId: string, paymentId: string): Promise<void> {
    await api.delete(`/loans/${loanId}/payments/${paymentId}`);
  },

  // Bulk operations
  async bulkUpdateLoans(loanIds: string[], updates: Partial<CreateLoanData>): Promise<void> {
    await api.put("/loans/bulk-update", { loanIds, updates });
  },

  async bulkApproveLoans(
    loanIds: string[],
    data: { approvedAmounts?: Record<string, number>; notes?: string },
  ): Promise<void> {
    await api.put("/loans/bulk-approve", { loanIds, ...data });
  },

  async bulkDisburseLoans(
    loanIds: string[],
    data: { disbursementDate: string; disbursementMethod: string },
  ): Promise<void> {
    await api.put("/loans/bulk-disburse", { loanIds, ...data });
  },

  // Reports
  async exportLoans(format: "csv" | "excel" | "pdf", filters?: any): Promise<Blob> {
    const response = await api.get("/loans/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  async getLoanPerformanceReport(loanId: string): Promise<any> {
    const response = await api.get(`/loans/${loanId}/performance-report`);
    return response.data;
  },

  // Risk assessment
  async assessLoanRisk(loanId: string): Promise<{
    riskScore: number;
    riskLevel: "low" | "medium" | "high";
    factors: string[];
    recommendations: string[];
  }> {
    const response = await api.post(`/loans/${loanId}/risk-assessment`);
    return response.data;
  },

  async updateRiskAssessment(
    loanId: string,
    data: {
      riskScore: number;
      riskLevel: "low" | "medium" | "high";
      notes?: string;
    },
  ): Promise<void> {
    await api.put(`/loans/${loanId}/risk-assessment`, data);
  },
};
