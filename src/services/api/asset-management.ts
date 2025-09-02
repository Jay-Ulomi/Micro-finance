import api from "./config";

// Types
export interface Asset {
  id: string;
  assetNumber: string;
  assetName: string;
  category: "furniture" | "equipment" | "vehicle" | "building" | "land" | "technology" | "other";
  subcategory?: string;
  description: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  currency: string;
  supplier?: string;
  warrantyExpiry?: string;
  location: string;
  department: string;
  assignedTo?: string;
  assignedToName?: string;
  status: "active" | "inactive" | "maintenance" | "disposed" | "lost" | "stolen";
  condition: "excellent" | "good" | "fair" | "poor";
  depreciationMethod: "straight_line" | "declining_balance" | "sum_of_years";
  usefulLife: number; // in years
  salvageValue: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  maintenanceInterval?: number; // in months
  insurancePolicy?: string;
  insuranceValue?: number;
  insuranceExpiry?: string;
  notes?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetData {
  assetName: string;
  category: "furniture" | "equipment" | "vehicle" | "building" | "land" | "technology" | "other";
  subcategory?: string;
  description: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate: string;
  purchasePrice: number;
  currency: string;
  supplier?: string;
  warrantyExpiry?: string;
  location: string;
  department: string;
  assignedTo?: string;
  condition: "excellent" | "good" | "fair" | "poor";
  depreciationMethod: "straight_line" | "declining_balance" | "sum_of_years";
  usefulLife: number;
  salvageValue: number;
  maintenanceInterval?: number;
  insurancePolicy?: string;
  insuranceValue?: number;
  insuranceExpiry?: string;
  notes?: string;
  attachments?: string[];
}

export interface AssetCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentCategoryId?: string;
  isActive: boolean;
  defaultDepreciationMethod: "straight_line" | "declining_balance" | "sum_of_years";
  defaultUsefulLife: number;
  defaultSalvageValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetCategoryData {
  name: string;
  code: string;
  description?: string;
  parentCategoryId?: string;
  defaultDepreciationMethod: "straight_line" | "declining_balance" | "sum_of_years";
  defaultUsefulLife: number;
  defaultSalvageValue: number;
}

export interface AssetMaintenance {
  id: string;
  assetId: string;
  assetName: string;
  maintenanceType: "preventive" | "corrective" | "emergency" | "inspection";
  description: string;
  maintenanceDate: string;
  nextMaintenanceDate?: string;
  cost: number;
  currency: string;
  performedBy: string;
  vendor?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  completedBy?: string;
  completedAt?: string;
  notes?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetMaintenanceData {
  assetId: string;
  maintenanceType: "preventive" | "corrective" | "emergency" | "inspection";
  description: string;
  maintenanceDate: string;
  nextMaintenanceDate?: string;
  cost: number;
  currency: string;
  performedBy: string;
  vendor?: string;
  notes?: string;
  attachments?: string[];
}

export interface AssetDisposal {
  id: string;
  assetId: string;
  assetName: string;
  disposalDate: string;
  disposalMethod: "sale" | "donation" | "scrap" | "trade_in" | "loss" | "theft";
  disposalValue: number;
  currency: string;
  buyer?: string;
  reason: string;
  approvedBy: string;
  approvedAt: string;
  notes?: string;
  attachments: string[];
  createdAt: string;
}

export interface CreateAssetDisposalData {
  assetId: string;
  disposalDate: string;
  disposalMethod: "sale" | "donation" | "scrap" | "trade_in" | "loss" | "theft";
  disposalValue: number;
  currency: string;
  buyer?: string;
  reason: string;
  notes?: string;
  attachments?: string[];
}

export interface AssetStatistics {
  totalAssets: number;
  totalValue: number;
  activeAssets: number;
  inactiveAssets: number;
  maintenanceRequired: number;
  warrantyExpiring: number;
  insuranceExpiring: number;
  averageValue: number;
  totalDepreciation: number;
  netBookValue: number;
}

export interface AssetResponse {
  assets: Asset[];
  total: number;
  page: number;
  limit: number;
}

// API Functions
export const assetManagementApi = {
  // Asset management
  async getAssets(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      status?: string;
      department?: string;
      location?: string;
      assignedTo?: string;
      condition?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<AssetResponse> {
    const response = await api.get("/assets", { params });
    return response.data;
  },

  async getAsset(id: string): Promise<Asset> {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },

  async createAsset(data: CreateAssetData): Promise<Asset> {
    const response = await api.post("/assets", data);
    return response.data;
  },

  async updateAsset(id: string, data: Partial<CreateAssetData>): Promise<Asset> {
    const response = await api.put(`/assets/${id}`, data);
    return response.data;
  },

  async deleteAsset(id: string): Promise<void> {
    await api.delete(`/assets/${id}`);
  },

  // Asset workflow
  async assignAsset(
    id: string,
    data: {
      assignedTo: string;
      assignedDate: string;
      notes?: string;
    },
  ): Promise<Asset> {
    const response = await api.put(`/assets/${id}/assign`, data);
    return response.data;
  },

  async unassignAsset(id: string, data: { notes?: string }): Promise<Asset> {
    const response = await api.put(`/assets/${id}/unassign`, data);
    return response.data;
  },

  async updateAssetStatus(
    id: string,
    data: {
      status: "active" | "inactive" | "maintenance" | "disposed" | "lost" | "stolen";
      notes?: string;
    },
  ): Promise<Asset> {
    const response = await api.put(`/assets/${id}/status`, data);
    return response.data;
  },

  async updateAssetCondition(
    id: string,
    data: {
      condition: "excellent" | "good" | "fair" | "poor";
      notes?: string;
    },
  ): Promise<Asset> {
    const response = await api.put(`/assets/${id}/condition`, data);
    return response.data;
  },

  // Asset categories
  async getAssetCategories(): Promise<AssetCategory[]> {
    const response = await api.get("/assets/categories");
    return response.data;
  },

  async getAssetCategory(id: string): Promise<AssetCategory> {
    const response = await api.get(`/assets/categories/${id}`);
    return response.data;
  },

  async createAssetCategory(data: CreateAssetCategoryData): Promise<AssetCategory> {
    const response = await api.post("/assets/categories", data);
    return response.data;
  },

  async updateAssetCategory(
    id: string,
    data: Partial<CreateAssetCategoryData>,
  ): Promise<AssetCategory> {
    const response = await api.put(`/assets/categories/${id}`, data);
    return response.data;
  },

  async deleteAssetCategory(id: string): Promise<void> {
    await api.delete(`/assets/categories/${id}`);
  },

  // Asset maintenance
  async getAssetMaintenance(
    params: {
      page?: number;
      limit?: number;
      assetId?: string;
      maintenanceType?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<{ maintenance: AssetMaintenance[]; total: number; page: number; limit: number }> {
    const response = await api.get("/assets/maintenance", { params });
    return response.data;
  },

  async getAssetMaintenanceRecord(id: string): Promise<AssetMaintenance> {
    const response = await api.get(`/assets/maintenance/${id}`);
    return response.data;
  },

  async createAssetMaintenance(data: CreateAssetMaintenanceData): Promise<AssetMaintenance> {
    const response = await api.post("/assets/maintenance", data);
    return response.data;
  },

  async updateAssetMaintenance(
    id: string,
    data: Partial<CreateAssetMaintenanceData>,
  ): Promise<AssetMaintenance> {
    const response = await api.put(`/assets/maintenance/${id}`, data);
    return response.data;
  },

  async deleteAssetMaintenance(id: string): Promise<void> {
    await api.delete(`/assets/maintenance/${id}`);
  },

  async completeMaintenance(
    id: string,
    data: {
      completedBy: string;
      completedAt: string;
      notes?: string;
    },
  ): Promise<AssetMaintenance> {
    const response = await api.post(`/assets/maintenance/${id}/complete`, data);
    return response.data;
  },

  // Asset disposal
  async getAssetDisposals(
    params: {
      page?: number;
      limit?: number;
      assetId?: string;
      disposalMethod?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<{ disposals: AssetDisposal[]; total: number; page: number; limit: number }> {
    const response = await api.get("/assets/disposals", { params });
    return response.data;
  },

  async getAssetDisposal(id: string): Promise<AssetDisposal> {
    const response = await api.get(`/assets/disposals/${id}`);
    return response.data;
  },

  async createAssetDisposal(data: CreateAssetDisposalData): Promise<AssetDisposal> {
    const response = await api.post("/assets/disposals", data);
    return response.data;
  },

  async approveAssetDisposal(id: string, data: { notes?: string }): Promise<AssetDisposal> {
    const response = await api.post(`/assets/disposals/${id}/approve`, data);
    return response.data;
  },

  // Depreciation
  async calculateDepreciation(
    assetId: string,
    params: {
      asOfDate: string;
    },
  ): Promise<{
    assetId: string;
    assetName: string;
    purchasePrice: number;
    currentValue: number;
    accumulatedDepreciation: number;
    netBookValue: number;
    depreciationThisPeriod: number;
  }> {
    const response = await api.get(`/assets/${assetId}/depreciation`, { params });
    return response.data;
  },

  async processDepreciation(params: { asOfDate: string; assetIds?: string[] }): Promise<{
    processed: number;
    failed: number;
    errors: any[];
  }> {
    const response = await api.post("/assets/process-depreciation", params);
    return response.data;
  },

  // Statistics and reports
  async getAssetStatistics(): Promise<AssetStatistics> {
    const response = await api.get("/assets/statistics");
    return response.data;
  },

  async getAssetByCategory(): Promise<
    {
      category: string;
      count: number;
      totalValue: number;
      averageValue: number;
    }[]
  > {
    const response = await api.get("/assets/by-category");
    return response.data;
  },

  async getAssetByDepartment(): Promise<
    {
      department: string;
      count: number;
      totalValue: number;
      averageValue: number;
    }[]
  > {
    const response = await api.get("/assets/by-department");
    return response.data;
  },

  async getAssetByLocation(): Promise<
    {
      location: string;
      count: number;
      totalValue: number;
      averageValue: number;
    }[]
  > {
    const response = await api.get("/assets/by-location");
    return response.data;
  },

  async getMaintenanceSchedule(params: {
    startDate: string;
    endDate: string;
    assetId?: string;
  }): Promise<AssetMaintenance[]> {
    const response = await api.get("/assets/maintenance-schedule", { params });
    return response.data;
  },

  async getWarrantyExpiryReport(params: { startDate: string; endDate: string }): Promise<Asset[]> {
    const response = await api.get("/assets/warranty-expiry-report", { params });
    return response.data;
  },

  async getInsuranceExpiryReport(params: { startDate: string; endDate: string }): Promise<Asset[]> {
    const response = await api.get("/assets/insurance-expiry-report", { params });
    return response.data;
  },

  // Bulk operations
  async bulkUpdateAssets(assetIds: string[], updates: Partial<CreateAssetData>): Promise<void> {
    await api.put("/assets/bulk-update", { assetIds, updates });
  },

  async bulkAssignAssets(
    assetIds: string[],
    data: {
      assignedTo: string;
      assignedDate: string;
      notes?: string;
    },
  ): Promise<void> {
    await api.put("/assets/bulk-assign", { assetIds, ...data });
  },

  async bulkUpdateAssetStatus(
    assetIds: string[],
    data: {
      status: "active" | "inactive" | "maintenance" | "disposed" | "lost" | "stolen";
      notes?: string;
    },
  ): Promise<void> {
    await api.put("/assets/bulk-status", { assetIds, ...data });
  },

  // Export
  async exportAssets(format: "csv" | "excel" | "pdf", filters?: any): Promise<Blob> {
    const response = await api.get("/assets/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  async exportAssetMaintenance(format: "csv" | "excel" | "pdf", filters?: any): Promise<Blob> {
    const response = await api.get("/assets/maintenance/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  async exportAssetDisposals(format: "csv" | "excel" | "pdf", filters?: any): Promise<Blob> {
    const response = await api.get("/assets/disposals/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  // Reports
  async getAssetReport(params: {
    startDate: string;
    endDate: string;
    reportType: "summary" | "detailed" | "depreciation";
    category?: string;
    department?: string;
  }): Promise<any> {
    const response = await api.get("/assets/reports", { params });
    return response.data;
  },

  async getMaintenanceReport(params: {
    startDate: string;
    endDate: string;
    maintenanceType?: string;
    assetId?: string;
  }): Promise<any> {
    const response = await api.get("/assets/maintenance-reports", { params });
    return response.data;
  },

  async getDisposalReport(params: {
    startDate: string;
    endDate: string;
    disposalMethod?: string;
  }): Promise<any> {
    const response = await api.get("/assets/disposal-reports", { params });
    return response.data;
  },
};
