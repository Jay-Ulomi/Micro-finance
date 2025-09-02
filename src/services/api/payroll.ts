import api from "./config";

// Types
export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  department: string;
  position: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  employmentStatus: 'active' | 'inactive' | 'terminated' | 'on_leave';
  hireDate: string;
  terminationDate?: string;
  salary: number;
  currency: string;
  payFrequency: 'weekly' | 'bi_weekly' | 'monthly';
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    routingNumber?: string;
  };
  taxInformation?: {
    taxId: string;
    taxExemptions: number;
    filingStatus: 'single' | 'married' | 'head_of_household';
  };
  benefits?: {
    healthInsurance: boolean;
    retirementPlan: boolean;
    lifeInsurance: boolean;
    disabilityInsurance: boolean;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  department: string;
  position: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  hireDate: string;
  salary: number;
  currency: string;
  payFrequency: 'weekly' | 'bi_weekly' | 'monthly';
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    routingNumber?: string;
  };
  taxInformation?: {
    taxId: string;
    taxExemptions: number;
    filingStatus: 'single' | 'married' | 'head_of_household';
  };
  benefits?: {
    healthInsurance: boolean;
    retirementPlan: boolean;
    lifeInsurance: boolean;
    disabilityInsurance: boolean;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  notes?: string;
}

export interface PayrollPeriod {
  id: string;
  periodName: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  employeeCount: number;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayrollPeriodData {
  periodName: string;
  startDate: string;
  endDate: string;
  payDate: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  periodId: string;
  periodName: string;
  payDate: string;
  regularHours: number;
  overtimeHours: number;
  regularRate: number;
  overtimeRate: number;
  grossPay: number;
  deductions: {
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    healthInsurance: number;
    retirementPlan: number;
    other: number;
  };
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'check' | 'cash';
  paymentReference?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayrollRecordData {
  employeeId: string;
  periodId: string;
  regularHours: number;
  overtimeHours: number;
  regularRate: number;
  overtimeRate: number;
  deductions: {
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    healthInsurance: number;
    retirementPlan: number;
    other: number;
  };
  notes?: string;
}

export interface PayrollStatistics {
  totalEmployees: number;
  activeEmployees: number;
  totalPayroll: number;
  averageSalary: number;
  payrollThisMonth: number;
  totalDeductions: number;
  totalNetPay: number;
  pendingPayroll: number;
  completedPayroll: number;
}

export interface PayrollResponse {
  records: PayrollRecord[];
  total: number;
  page: number;
  limit: number;
}

// API Functions
export const payrollApi = {
  // Employee management
  async getEmployees(params: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    position?: string;
    employmentType?: string;
    employmentStatus?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ employees: Employee[]; total: number; page: number; limit: number }> {
    const response = await api.get("/payroll/employees", { params });
    return response.data;
  },

  async getEmployee(id: string): Promise<Employee> {
    const response = await api.get(`/payroll/employees/${id}`);
    return response.data;
  },

  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    const response = await api.post("/payroll/employees", data);
    return response.data;
  },

  async updateEmployee(id: string, data: Partial<CreateEmployeeData>): Promise<Employee> {
    const response = await api.put(`/payroll/employees/${id}`, data);
    return response.data;
  },

  async deleteEmployee(id: string): Promise<void> {
    await api.delete(`/payroll/employees/${id}`);
  },

  async terminateEmployee(id: string, data: {
    terminationDate: string;
    reason: string;
    notes?: string;
  }): Promise<Employee> {
    const response = await api.put(`/payroll/employees/${id}/terminate`, data);
    return response.data;
  },

  // Payroll periods
  async getPayrollPeriods(params: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ periods: PayrollPeriod[]; total: number; page: number; limit: number }> {
    const response = await api.get("/payroll/periods", { params });
    return response.data;
  },

  async getPayrollPeriod(id: string): Promise<PayrollPeriod> {
    const response = await api.get(`/payroll/periods/${id}`);
    return response.data;
  },

  async createPayrollPeriod(data: CreatePayrollPeriodData): Promise<PayrollPeriod> {
    const response = await api.post("/payroll/periods", data);
    return response.data;
  },

  async updatePayrollPeriod(id: string, data: Partial<CreatePayrollPeriodData>): Promise<PayrollPeriod> {
    const response = await api.put(`/payroll/periods/${id}`, data);
    return response.data;
  },

  async deletePayrollPeriod(id: string): Promise<void> {
    await api.delete(`/payroll/periods/${id}`);
  },

  async processPayrollPeriod(id: string): Promise<PayrollPeriod> {
    const response = await api.post(`/payroll/periods/${id}/process`);
    return response.data;
  },

  async completePayrollPeriod(id: string): Promise<PayrollPeriod> {
    const response = await api.post(`/payroll/periods/${id}/complete`);
    return response.data;
  },

  async cancelPayrollPeriod(id: string, data: { reason: string }): Promise<PayrollPeriod> {
    const response = await api.post(`/payroll/periods/${id}/cancel`, data);
    return response.data;
  },

  // Payroll records
  async getPayrollRecords(params: {
    page?: number;
    limit?: number;
    employeeId?: string;
    periodId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<PayrollResponse> {
    const response = await api.get("/payroll/records", { params });
    return response.data;
  },

  async getPayrollRecord(id: string): Promise<PayrollRecord> {
    const response = await api.get(`/payroll/records/${id}`);
    return response.data;
  },

  async createPayrollRecord(data: CreatePayrollRecordData): Promise<PayrollRecord> {
    const response = await api.post("/payroll/records", data);
    return response.data;
  },

  async updatePayrollRecord(id: string, data: Partial<CreatePayrollRecordData>): Promise<PayrollRecord> {
    const response = await api.put(`/payroll/records/${id}`, data);
    return response.data;
  },

  async deletePayrollRecord(id: string): Promise<void> {
    await api.delete(`/payroll/records/${id}`);
  },

  async processPayrollRecord(id: string): Promise<PayrollRecord> {
    const response = await api.post(`/payroll/records/${id}/process`);
    return response.data;
  },

  async payPayrollRecord(id: string, data: {
    paymentMethod: 'bank_transfer' | 'check' | 'cash';
    paymentReference?: string;
    notes?: string;
  }): Promise<PayrollRecord> {
    const response = await api.post(`/payroll/records/${id}/pay`, data);
    return response.data;
  },

  // Bulk operations
  async bulkCreatePayrollRecords(periodId: string, data: {
    employeeIds: string[];
    regularHours: number;
    overtimeHours: number;
    regularRate: number;
    overtimeRate: number;
    deductions: {
      federalTax: number;
      stateTax: number;
      socialSecurity: number;
      medicare: number;
      healthInsurance: number;
      retirementPlan: number;
      other: number;
    };
  }): Promise<{
    created: number;
    failed: number;
    errors: any[];
  }> {
    const response = await api.post("/payroll/records/bulk-create", { periodId, ...data });
    return response.data;
  },

  async bulkProcessPayrollRecords(recordIds: string[]): Promise<{
    processed: number;
    failed: number;
    errors: any[];
  }> {
    const response = await api.post("/payroll/records/bulk-process", { recordIds });
    return response.data;
  },

  async bulkPayPayrollRecords(recordIds: string[], data: {
    paymentMethod: 'bank_transfer' | 'check' | 'cash';
    paymentReference?: string;
  }): Promise<{
    paid: number;
    failed: number;
    errors: any[];
  }> {
    const response = await api.post("/payroll/records/bulk-pay", { recordIds, ...data });
    return response.data;
  },

  // Statistics and reports
  async getPayrollStatistics(): Promise<PayrollStatistics> {
    const response = await api.get("/payroll/statistics");
    return response.data;
  },

  async getPayrollByDepartment(params: {
    startDate: string;
    endDate: string;
  }): Promise<{
    department: string;
    employeeCount: number;
    totalGrossPay: number;
    totalDeductions: number;
    totalNetPay: number;
  }[]> {
    const response = await api.get("/payroll/by-department", { params });
    return response.data;
  },

  async getPayrollTrends(params: {
    startDate: string;
    endDate: string;
    groupBy: 'month' | 'quarter' | 'year';
  }): Promise<{
    period: string;
    totalGrossPay: number;
    totalDeductions: number;
    totalNetPay: number;
    employeeCount: number;
  }[]> {
    const response = await api.get("/payroll/trends", { params });
    return response.data;
  },

  // Export
  async exportPayrollRecords(format: 'csv' | 'excel' | 'pdf', filters?: any): Promise<Blob> {
    const response = await api.get("/payroll/records/export", {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  async exportPayrollPeriod(periodId: string, format: 'csv' | 'excel' | 'pdf'): Promise<Blob> {
    const response = await api.get(`/payroll/periods/${periodId}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },

  async exportEmployeePayroll(employeeId: string, params: {
    startDate: string;
    endDate: string;
    format: 'csv' | 'excel' | 'pdf';
  }): Promise<Blob> {
    const response = await api.get(`/payroll/employees/${employeeId}/export`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // Reports
  async getPayrollReport(params: {
    startDate: string;
    endDate: string;
    reportType: 'summary' | 'detailed' | 'tax';
    department?: string;
  }): Promise<any> {
    const response = await api.get("/payroll/reports", { params });
    return response.data;
  },

  async getTaxReport(params: {
    year: number;
    quarter?: number;
    employeeId?: string;
  }): Promise<any> {
    const response = await api.get("/payroll/tax-reports", { params });
    return response.data;
  },

  async getEmployeeReport(params: {
    startDate: string;
    endDate: string;
    employeeId?: string;
    department?: string;
  }): Promise<any> {
    const response = await api.get("/payroll/employee-reports", { params });
    return response.data;
  },
};
