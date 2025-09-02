import api from "./config";

// Types
export interface OtherIncome {
  id: string;
  incomeNumber: string;
  category: string;
  subcategory?: string;
  description: string;
  amount: number;
  currency: string;
  incomeDate: string;
  paymentMethod: "cash" | "bank_transfer" | "check" | "credit_card" | "mobile_money";
  payer?: string;
  payerContact?: string;
  reference?: string;
  status: "pending" | "confirmed" | "cancelled";
  confirmedBy?: string;
  confirmedAt?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  department: string;
  costCenter?: string;
  project?: string;
  notes?: string;
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOtherIncomeData {
  category: string;
  subcategory?: string;
  description: string;
  amount: number;
  currency: string;
  incomeDate: string;
  paymentMethod: "cash" | "bank_transfer" | "check" | "credit_card" | "mobile_money";
  payer?: string;
  payerContact?: string;
  reference?: string;
  department: string;
  costCenter?: string;
  project?: string;
  notes?: string;
  attachments?: string[];
}

export interface IncomeCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentCategoryId?: string;
  isActive: boolean;
  target?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomeCategoryData {
  name: string;
  code: string;
  description?: string;
  parentCategoryId?: string;
  target?: number;
}

export interface IncomeStatistics {
  totalIncome: number;
  totalAmount: number;
  pendingIncome: number;
  confirmedIncome: number;
  cancelledIncome: number;
  averageIncome: number;
  incomeThisMonth: number;
  amountThisMonth: number;
  topCategories: {
    category: string;
    amount: number;
    count: number;
  }[];
}

export interface IncomeResponse {
  income: OtherIncome[];
  total: number;
  page: number;
  limit: number;
}

// API Functions
export const otherIncomeApi = {
  // Income management
  async getOtherIncome(
    params: {
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
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<IncomeResponse> {
    const response = await api.get("/other-income", { params });
    return response.data;
  },

  async getOtherIncomeRecord(id: string): Promise<OtherIncome> {
    const response = await api.get(`/other-income/${id}`);
    return response.data;
  },

  async createOtherIncome(data: CreateOtherIncomeData): Promise<OtherIncome> {
    const response = await api.post("/other-income", data);
    return response.data;
  },

  async updateOtherIncome(id: string, data: Partial<CreateOtherIncomeData>): Promise<OtherIncome> {
    const response = await api.put(`/other-income/${id}`, data);
    return response.data;
  },

  async deleteOtherIncome(id: string): Promise<void> {
    await api.delete(`/other-income/${id}`);
  },

  // Income workflow
  async confirmIncome(id: string, data: { notes?: string }): Promise<OtherIncome> {
    const response = await api.post(`/other-income/${id}/confirm`, data);
    return response.data;
  },

  async cancelIncome(id: string, data: { reason: string; notes?: string }): Promise<OtherIncome> {
    const response = await api.post(`/other-income/${id}/cancel`, data);
    return response.data;
  },

  // Income categories
  async getIncomeCategories(): Promise<IncomeCategory[]> {
    const response = await api.get("/other-income/categories");
    return response.data;
  },

  async getIncomeCategory(id: string): Promise<IncomeCategory> {
    const response = await api.get(`/other-income/categories/${id}`);
    return response.data;
  },

  async createIncomeCategory(data: CreateIncomeCategoryData): Promise<IncomeCategory> {
    const response = await api.post("/other-income/categories", data);
    return response.data;
  },

  async updateIncomeCategory(
    id: string,
    data: Partial<CreateIncomeCategoryData>,
  ): Promise<IncomeCategory> {
    const response = await api.put(`/other-income/categories/${id}`, data);
    return response.data;
  },

  async deleteIncomeCategory(id: string): Promise<void> {
    await api.delete(`/other-income/categories/${id}`);
  },

  // File uploads
  async uploadIncomeAttachment(incomeId: string, file: File): Promise<{ attachmentUrl: string }> {
    const formData = new FormData();
    formData.append("attachment", file);

    const response = await api.post(`/other-income/${incomeId}/attachments`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Statistics and reports
  async getIncomeStatistics(): Promise<IncomeStatistics> {
    const response = await api.get("/other-income/statistics");
    return response.data;
  },

  async getIncomeByCategory(params: {
    startDate: string;
    endDate: string;
    category?: string;
  }): Promise<
    {
      category: string;
      amount: number;
      count: number;
      percentage: number;
    }[]
  > {
    const response = await api.get("/other-income/by-category", { params });
    return response.data;
  },

  async getIncomeByDepartment(params: {
    startDate: string;
    endDate: string;
    department?: string;
  }): Promise<
    {
      department: string;
      amount: number;
      count: number;
      percentage: number;
    }[]
  > {
    const response = await api.get("/other-income/by-department", { params });
    return response.data;
  },

  async getIncomeTrends(params: {
    startDate: string;
    endDate: string;
    groupBy: "day" | "week" | "month" | "quarter";
    category?: string;
    department?: string;
  }): Promise<
    {
      period: string;
      amount: number;
      count: number;
    }[]
  > {
    const response = await api.get("/other-income/trends", { params });
    return response.data;
  },

  // Bulk operations
  async bulkUpdateIncome(
    incomeIds: string[],
    updates: Partial<CreateOtherIncomeData>,
  ): Promise<void> {
    await api.put("/other-income/bulk-update", { incomeIds, updates });
  },

  async bulkConfirmIncome(incomeIds: string[], data: { notes?: string }): Promise<void> {
    await api.put("/other-income/bulk-confirm", { incomeIds, ...data });
  },

  async bulkCancelIncome(
    incomeIds: string[],
    data: { reason: string; notes?: string },
  ): Promise<void> {
    await api.put("/other-income/bulk-cancel", { incomeIds, ...data });
  },

  // Export
  async exportOtherIncome(format: "csv" | "excel" | "pdf", filters?: any): Promise<Blob> {
    const response = await api.get("/other-income/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  // Target management
  async getTargetByCategory(
    categoryId: string,
    params: {
      year: number;
      month?: number;
    },
  ): Promise<{
    target: number;
    achieved: number;
    remaining: number;
    percentage: number;
  }> {
    const response = await api.get(`/other-income/categories/${categoryId}/target`, { params });
    return response.data;
  },

  async updateTargetByCategory(
    categoryId: string,
    data: {
      year: number;
      month?: number;
      target: number;
    },
  ): Promise<void> {
    await api.put(`/other-income/categories/${categoryId}/target`, data);
  },

  async getTargetReport(params: { year: number; month?: number; department?: string }): Promise<
    {
      category: string;
      target: number;
      achieved: number;
      remaining: number;
      percentage: number;
    }[]
  > {
    const response = await api.get("/other-income/target-report", { params });
    return response.data;
  },
};
