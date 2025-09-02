import api from "./config";

// Types
export interface Report {
  id: string;
  name: string;
  type: "financial" | "operational" | "compliance" | "risk" | "custom";
  category: string;
  description: string;
  parameters: ReportParameter[];
  schedule?: {
    frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
  };
  recipients: string[];
  format: "pdf" | "excel" | "csv";
  status: "active" | "inactive";
  lastGenerated?: string;
  nextGeneration?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportParameter {
  name: string;
  type: "string" | "number" | "date" | "boolean" | "select";
  label: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ReportExecution {
  id: string;
  reportId: string;
  reportName: string;
  parameters: Record<string, any>;
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
  fileUrl?: string;
  error?: string;
  generatedBy: string;
}

export interface DashboardWidget {
  id: string;
  name: string;
  type: "chart" | "table" | "metric" | "gauge";
  dataSource: string;
  parameters: Record<string, any>;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  refreshInterval?: number;
  visible: boolean;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// API Functions
export const reportsApi = {
  // Report management
  async getReports(
    params: {
      type?: string;
      category?: string;
      status?: string;
    } = {},
  ): Promise<Report[]> {
    const response = await api.get("/reports", { params });
    return response.data;
  },

  async getReport(id: string): Promise<Report> {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  async createReport(data: Partial<Report>): Promise<Report> {
    const response = await api.post("/reports", data);
    return response.data;
  },

  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    const response = await api.put(`/reports/${id}`, data);
    return response.data;
  },

  async deleteReport(id: string): Promise<void> {
    await api.delete(`/reports/${id}`);
  },

  // Report execution
  async executeReport(reportId: string, parameters: Record<string, any>): Promise<ReportExecution> {
    const response = await api.post(`/reports/${reportId}/execute`, { parameters });
    return response.data;
  },

  async getReportExecutions(
    params: {
      reportId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    } = {},
  ): Promise<{ executions: ReportExecution[]; total: number }> {
    const response = await api.get("/reports/executions", { params });
    return response.data;
  },

  async getReportExecution(id: string): Promise<ReportExecution> {
    const response = await api.get(`/reports/executions/${id}`);
    return response.data;
  },

  async downloadReportExecution(id: string): Promise<Blob> {
    const response = await api.get(`/reports/executions/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },

  // Predefined reports
  async getLoanPortfolioReport(params: {
    startDate: string;
    endDate: string;
    loanOfficer?: string;
    loanType?: string;
    status?: string;
  }): Promise<Blob> {
    const response = await api.get("/reports/loan-portfolio", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  async getBorrowerReport(params: {
    startDate: string;
    endDate: string;
    kycStatus?: string;
    loanOfficer?: string;
    country?: string;
  }): Promise<Blob> {
    const response = await api.get("/reports/borrowers", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  async getRepaymentReport(params: {
    startDate: string;
    endDate: string;
    loanOfficer?: string;
    status?: string;
    paymentMethod?: string;
  }): Promise<Blob> {
    const response = await api.get("/reports/repayments", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  async getSavingsReport(params: {
    startDate: string;
    endDate: string;
    accountType?: string;
    status?: string;
  }): Promise<Blob> {
    const response = await api.get("/reports/savings", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  async getInvestorReport(params: {
    startDate: string;
    endDate: string;
    investorType?: string;
    riskProfile?: string;
  }): Promise<Blob> {
    const response = await api.get("/reports/investors", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  async getFinancialReport(params: {
    startDate: string;
    endDate: string;
    reportType: "income_statement" | "balance_sheet" | "cash_flow" | "profit_loss";
  }): Promise<Blob> {
    const response = await api.get("/reports/financial", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  async getRiskReport(params: {
    startDate: string;
    endDate: string;
    riskType?: string;
  }): Promise<Blob> {
    const response = await api.get("/reports/risk", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  async getComplianceReport(params: {
    startDate: string;
    endDate: string;
    complianceType?: string;
  }): Promise<Blob> {
    const response = await api.get("/reports/compliance", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  // Dashboard management
  async getDashboards(): Promise<Dashboard[]> {
    const response = await api.get("/dashboards");
    return response.data;
  },

  async getDashboard(id: string): Promise<Dashboard> {
    const response = await api.get(`/dashboards/${id}`);
    return response.data;
  },

  async createDashboard(data: Partial<Dashboard>): Promise<Dashboard> {
    const response = await api.post("/dashboards", data);
    return response.data;
  },

  async updateDashboard(id: string, data: Partial<Dashboard>): Promise<Dashboard> {
    const response = await api.put(`/dashboards/${id}`, data);
    return response.data;
  },

  async deleteDashboard(id: string): Promise<void> {
    await api.delete(`/dashboards/${id}`);
  },

  async setDefaultDashboard(id: string): Promise<Dashboard> {
    const response = await api.put(`/dashboards/${id}/set-default`);
    return response.data;
  },

  // Widget management
  async createWidget(
    dashboardId: string,
    data: Partial<DashboardWidget>,
  ): Promise<DashboardWidget> {
    const response = await api.post(`/dashboards/${dashboardId}/widgets`, data);
    return response.data;
  },

  async updateWidget(
    dashboardId: string,
    widgetId: string,
    data: Partial<DashboardWidget>,
  ): Promise<DashboardWidget> {
    const response = await api.put(`/dashboards/${dashboardId}/widgets/${widgetId}`, data);
    return response.data;
  },

  async deleteWidget(dashboardId: string, widgetId: string): Promise<void> {
    await api.delete(`/dashboards/${dashboardId}/widgets/${widgetId}`);
  },

  // Widget data
  async getWidgetData(widgetId: string, parameters: Record<string, any> = {}): Promise<any> {
    const response = await api.get(`/widgets/${widgetId}/data`, { params: parameters });
    return response.data;
  },

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalCustomers: number;
    totalLoans: number;
    activeLoans: number;
    overdueLoans: number;
    totalDisbursed: number;
    totalCollected: number;
    monthlyDisbursements: number;
    monthlyCollections: number;
  }> {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  // Analytics
  async getAnalytics(params: {
    startDate: string;
    endDate: string;
    groupBy?: "day" | "week" | "month" | "quarter" | "year";
    metrics?: string[];
  }): Promise<any> {
    const response = await api.get("/analytics", { params });
    return response.data;
  },

  async getKPIs(): Promise<{
    totalLoans: number;
    totalBorrowers: number;
    totalSavings: number;
    totalInvestments: number;
    collectionRate: number;
    defaultRate: number;
    portfolioAtRisk: number;
    returnOnAssets: number;
  }> {
    const response = await api.get("/analytics/kpis");
    return response.data;
  },

  // Scheduled reports
  async getScheduledReports(): Promise<Report[]> {
    const response = await api.get("/reports/scheduled");
    return response.data;
  },

  async scheduleReport(reportId: string, schedule: Report["schedule"]): Promise<Report> {
    const response = await api.post(`/reports/${reportId}/schedule`, { schedule });
    return response.data;
  },

  async unscheduleReport(reportId: string): Promise<Report> {
    const response = await api.delete(`/reports/${reportId}/schedule`);
    return response.data;
  },

  // Report templates
  async getReportTemplates(): Promise<Report[]> {
    const response = await api.get("/reports/templates");
    return response.data;
  },

  async createReportFromTemplate(
    templateId: string,
    data: {
      name: string;
      description: string;
      parameters: Record<string, any>;
    },
  ): Promise<Report> {
    const response = await api.post(`/reports/templates/${templateId}/create`, data);
    return response.data;
  },
};
