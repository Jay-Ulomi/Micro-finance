import api from "./config";

// Types
export interface Collateral {
  id: string;
  collateralNumber: string;
  borrowerId: string;
  borrowerName: string;
  loanId?: string;
  collateralType: "real_estate" | "vehicle" | "equipment" | "jewelry" | "securities" | "other";
  description: string;
  value: number;
  currency: string;
  location: string;
  ownershipDocument: string;
  status: "registered" | "pledged" | "released" | "seized" | "sold";
  registrationDate: string;
  pledgeDate?: string;
  releaseDate?: string;
  documents: string[];
  appraisalDate?: string;
  appraisedValue?: number;
  appraiser?: string;
  insurancePolicy?: string;
  insuranceValue?: number;
  insuranceExpiry?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollateralData {
  borrowerId: string;
  loanId?: string;
  collateralType: "real_estate" | "vehicle" | "equipment" | "jewelry" | "securities" | "other";
  description: string;
  value: number;
  currency: string;
  location: string;
  ownershipDocument: string;
  documents: string[];
  appraisalDate?: string;
  appraisedValue?: number;
  appraiser?: string;
  insurancePolicy?: string;
  insuranceValue?: number;
  insuranceExpiry?: string;
  notes?: string;
}

export interface CollateralAppraisal {
  id: string;
  collateralId: string;
  appraiserName: string;
  appraiserLicense: string;
  appraisalDate: string;
  appraisedValue: number;
  marketValue: number;
  forcedSaleValue: number;
  condition: "excellent" | "good" | "fair" | "poor";
  remarks: string;
  documents: string[];
  validUntil: string;
  createdAt: string;
}

export interface CreateCollateralAppraisalData {
  collateralId: string;
  appraiserName: string;
  appraiserLicense: string;
  appraisalDate: string;
  appraisedValue: number;
  marketValue: number;
  forcedSaleValue: number;
  condition: "excellent" | "good" | "fair" | "poor";
  remarks: string;
  documents: string[];
  validUntil: string;
}

export interface CollateralResponse {
  collaterals: Collateral[];
  total: number;
  page: number;
  limit: number;
}

export interface CollateralStatistics {
  totalCollaterals: number;
  totalValue: number;
  pledgedCollaterals: number;
  pledgedValue: number;
  releasedCollaterals: number;
  seizedCollaterals: number;
  averageValue: number;
  expiringInsurance: number;
}

// API Functions
export const collateralApi = {
  // Basic CRUD operations
  async getCollaterals(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      borrowerId?: string;
      loanId?: string;
      collateralType?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<CollateralResponse> {
    const response = await api.get("/collaterals", { params });
    return response.data;
  },

  async getCollateral(id: string): Promise<Collateral> {
    const response = await api.get(`/collaterals/${id}`);
    return response.data;
  },

  async createCollateral(data: CreateCollateralData): Promise<Collateral> {
    const response = await api.post("/collaterals", data);
    return response.data;
  },

  async updateCollateral(id: string, data: Partial<CreateCollateralData>): Promise<Collateral> {
    const response = await api.put(`/collaterals/${id}`, data);
    return response.data;
  },

  async deleteCollateral(id: string): Promise<void> {
    await api.delete(`/collaterals/${id}`);
  },

  // Collateral workflow
  async pledgeCollateral(
    id: string,
    data: {
      loanId: string;
      pledgeDate: string;
      notes?: string;
    },
  ): Promise<Collateral> {
    const response = await api.put(`/collaterals/${id}/pledge`, data);
    return response.data;
  },

  async releaseCollateral(
    id: string,
    data: {
      releaseDate: string;
      reason: string;
      notes?: string;
    },
  ): Promise<Collateral> {
    const response = await api.put(`/collaterals/${id}/release`, data);
    return response.data;
  },

  async seizeCollateral(
    id: string,
    data: {
      seizureDate: string;
      reason: string;
      notes?: string;
    },
  ): Promise<Collateral> {
    const response = await api.put(`/collaterals/${id}/seize`, data);
    return response.data;
  },

  async sellCollateral(
    id: string,
    data: {
      saleDate: string;
      salePrice: number;
      buyer: string;
      notes?: string;
    },
  ): Promise<Collateral> {
    const response = await api.put(`/collaterals/${id}/sell`, data);
    return response.data;
  },

  // Appraisals
  async getCollateralAppraisals(collateralId: string): Promise<CollateralAppraisal[]> {
    const response = await api.get(`/collaterals/${collateralId}/appraisals`);
    return response.data;
  },

  async createCollateralAppraisal(
    data: CreateCollateralAppraisalData,
  ): Promise<CollateralAppraisal> {
    const response = await api.post("/collaterals/appraisals", data);
    return response.data;
  },

  async updateCollateralAppraisal(
    id: string,
    data: Partial<CreateCollateralAppraisalData>,
  ): Promise<CollateralAppraisal> {
    const response = await api.put(`/collaterals/appraisals/${id}`, data);
    return response.data;
  },

  async deleteCollateralAppraisal(id: string): Promise<void> {
    await api.delete(`/collaterals/appraisals/${id}`);
  },

  // Documents
  async uploadCollateralDocument(
    collateralId: string,
    formData: FormData,
  ): Promise<{ documentUrl: string }> {
    const response = await api.post(`/collaterals/${collateralId}/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getCollateralDocuments(collateralId: string): Promise<any[]> {
    const response = await api.get(`/collaterals/${collateralId}/documents`);
    return response.data;
  },

  async deleteCollateralDocument(collateralId: string, documentId: string): Promise<void> {
    await api.delete(`/collaterals/${collateralId}/documents/${documentId}`);
  },

  // Statistics and reports
  async getCollateralStatistics(): Promise<CollateralStatistics> {
    const response = await api.get("/collaterals/statistics");
    return response.data;
  },

  async getBorrowerCollaterals(borrowerId: string): Promise<Collateral[]> {
    const response = await api.get(`/collaterals/borrower/${borrowerId}`);
    return response.data;
  },

  async getLoanCollaterals(loanId: string): Promise<Collateral[]> {
    const response = await api.get(`/collaterals/loan/${loanId}`);
    return response.data;
  },

  // Bulk operations
  async bulkUpdateCollaterals(
    collateralIds: string[],
    updates: Partial<CreateCollateralData>,
  ): Promise<void> {
    await api.put("/collaterals/bulk-update", { collateralIds, updates });
  },

  async bulkReleaseCollaterals(
    collateralIds: string[],
    data: {
      releaseDate: string;
      reason: string;
      notes?: string;
    },
  ): Promise<void> {
    await api.put("/collaterals/bulk-release", { collateralIds, ...data });
  },

  // Export
  async exportCollaterals(format: "csv" | "excel" | "pdf", filters?: any): Promise<Blob> {
    const response = await api.get("/collaterals/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  // Reports
  async getCollateralReport(params: {
    startDate: string;
    endDate: string;
    reportType: "summary" | "detailed" | "appraisal";
    collateralType?: string;
    status?: string;
  }): Promise<any> {
    const response = await api.get("/collaterals/reports", { params });
    return response.data;
  },

  async getInsuranceExpiryReport(params: { startDate: string; endDate: string }): Promise<any> {
    const response = await api.get("/collaterals/insurance-expiry-report", { params });
    return response.data;
  },

  async getAppraisalExpiryReport(params: { startDate: string; endDate: string }): Promise<any> {
    const response = await api.get("/collaterals/appraisal-expiry-report", { params });
    return response.data;
  },
};
