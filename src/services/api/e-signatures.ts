import api from "./config";

// Types
export interface ESignature {
  id: string;
  documentId: string;
  documentName: string;
  documentType: 'loan_agreement' | 'kyc_document' | 'contract' | 'policy' | 'other';
  signerId: string;
  signerName: string;
  signerEmail: string;
  signerRole: 'borrower' | 'guarantor' | 'witness' | 'officer' | 'manager';
  signatureStatus: 'pending' | 'signed' | 'declined' | 'expired';
  signatureMethod: 'electronic' | 'digital' | 'biometric';
  signatureData?: string; // Base64 encoded signature image
  signedAt?: string;
  declinedAt?: string;
  declinedReason?: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateESignatureData {
  documentId: string;
  documentName: string;
  documentType: 'loan_agreement' | 'kyc_document' | 'contract' | 'policy' | 'other';
  signerId: string;
  signerName: string;
  signerEmail: string;
  signerRole: 'borrower' | 'guarantor' | 'witness' | 'officer' | 'manager';
  signatureMethod: 'electronic' | 'digital' | 'biometric';
  expiresAt: string;
  notes?: string;
}

export interface ESignatureDocument {
  id: string;
  documentName: string;
  documentType: 'loan_agreement' | 'kyc_document' | 'contract' | 'policy' | 'other';
  documentUrl: string;
  documentHash: string;
  fileSize: number;
  mimeType: string;
  status: 'draft' | 'pending_signatures' | 'fully_signed' | 'expired' | 'cancelled';
  requiredSignatures: number;
  completedSignatures: number;
  expiresAt: string;
  relatedEntity?: {
    type: 'loan' | 'borrower' | 'investment' | 'contract';
    id: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateESignatureDocumentData {
  documentName: string;
  documentType: 'loan_agreement' | 'kyc_document' | 'contract' | 'policy' | 'other';
  documentUrl: string;
  documentHash: string;
  fileSize: number;
  mimeType: string;
  expiresAt: string;
  relatedEntity?: {
    type: 'loan' | 'borrower' | 'investment' | 'contract';
    id: string;
  };
}

export interface ESignatureTemplate {
  id: string;
  templateName: string;
  templateType: 'loan_agreement' | 'kyc_document' | 'contract' | 'policy' | 'other';
  description: string;
  templateUrl: string;
  signatureFields: {
    fieldId: string;
    fieldName: string;
    fieldType: 'signature' | 'initial' | 'date' | 'text' | 'checkbox';
    required: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  }[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateESignatureTemplateData {
  templateName: string;
  templateType: 'loan_agreement' | 'kyc_document' | 'contract' | 'policy' | 'other';
  description: string;
  templateUrl: string;
  signatureFields: {
    fieldId: string;
    fieldName: string;
    fieldType: 'signature' | 'initial' | 'date' | 'text' | 'checkbox';
    required: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  }[];
}

export interface ESignatureStatistics {
  totalDocuments: number;
  pendingSignatures: number;
  completedSignatures: number;
  expiredSignatures: number;
  declinedSignatures: number;
  averageSigningTime: number;
  documentsThisMonth: number;
  signaturesThisMonth: number;
}

export interface ESignatureResponse {
  signatures: ESignature[];
  total: number;
  page: number;
  limit: number;
}

// API Functions
export const eSignaturesApi = {
  // E-Signature management
  async getESignatures(params: {
    page?: number;
    limit?: number;
    documentId?: string;
    signerId?: string;
    signerRole?: string;
    signatureStatus?: string;
    signatureMethod?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<ESignatureResponse> {
    const response = await api.get("/e-signatures", { params });
    return response.data;
  },

  async getESignature(id: string): Promise<ESignature> {
    const response = await api.get(`/e-signatures/${id}`);
    return response.data;
  },

  async createESignature(data: CreateESignatureData): Promise<ESignature> {
    const response = await api.post("/e-signatures", data);
    return response.data;
  },

  async updateESignature(id: string, data: Partial<CreateESignatureData>): Promise<ESignature> {
    const response = await api.put(`/e-signatures/${id}`, data);
    return response.data;
  },

  async deleteESignature(id: string): Promise<void> {
    await api.delete(`/e-signatures/${id}`);
  },

  // Signature workflow
  async signDocument(id: string, data: {
    signatureData: string; // Base64 encoded signature image
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  }): Promise<ESignature> {
    const response = await api.post(`/e-signatures/${id}/sign`, data);
    return response.data;
  },

  async declineSignature(id: string, data: {
    declinedReason: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  }): Promise<ESignature> {
    const response = await api.post(`/e-signatures/${id}/decline`, data);
    return response.data;
  },

  async resendSignatureRequest(id: string): Promise<ESignature> {
    const response = await api.post(`/e-signatures/${id}/resend`);
    return response.data;
  },

  async extendSignatureExpiry(id: string, data: {
    newExpiryDate: string;
    reason: string;
  }): Promise<ESignature> {
    const response = await api.post(`/e-signatures/${id}/extend`, data);
    return response.data;
  },

  // E-Signature documents
  async getESignatureDocuments(params: {
    page?: number;
    limit?: number;
    documentType?: string;
    status?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ documents: ESignatureDocument[]; total: number; page: number; limit: number }> {
    const response = await api.get("/e-signatures/documents", { params });
    return response.data;
  },

  async getESignatureDocument(id: string): Promise<ESignatureDocument> {
    const response = await api.get(`/e-signatures/documents/${id}`);
    return response.data;
  },

  async createESignatureDocument(data: CreateESignatureDocumentData): Promise<ESignatureDocument> {
    const response = await api.post("/e-signatures/documents", data);
    return response.data;
  },

  async updateESignatureDocument(id: string, data: Partial<CreateESignatureDocumentData>): Promise<ESignatureDocument> {
    const response = await api.put(`/e-signatures/documents/${id}`, data);
    return response.data;
  },

  async deleteESignatureDocument(id: string): Promise<void> {
    await api.delete(`/e-signatures/documents/${id}`);
  },

  async uploadESignatureDocument(formData: FormData): Promise<{ documentUrl: string; documentHash: string }> {
    const response = await api.post("/e-signatures/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async downloadESignatureDocument(id: string): Promise<Blob> {
    const response = await api.get(`/e-signatures/documents/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async getSignedDocument(id: string): Promise<Blob> {
    const response = await api.get(`/e-signatures/documents/${id}/signed`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // E-Signature templates
  async getESignatureTemplates(params: {
    templateType?: string;
    isActive?: boolean;
  } = {}): Promise<ESignatureTemplate[]> {
    const response = await api.get("/e-signatures/templates", { params });
    return response.data;
  },

  async getESignatureTemplate(id: string): Promise<ESignatureTemplate> {
    const response = await api.get(`/e-signatures/templates/${id}`);
    return response.data;
  },

  async createESignatureTemplate(data: CreateESignatureTemplateData): Promise<ESignatureTemplate> {
    const response = await api.post("/e-signatures/templates", data);
    return response.data;
  },

  async updateESignatureTemplate(id: string, data: Partial<CreateESignatureTemplateData>): Promise<ESignatureTemplate> {
    const response = await api.put(`/e-signatures/templates/${id}`, data);
    return response.data;
  },

  async deleteESignatureTemplate(id: string): Promise<void> {
    await api.delete(`/e-signatures/templates/${id}`);
  },

  async activateESignatureTemplate(id: string): Promise<ESignatureTemplate> {
    const response = await api.post(`/e-signatures/templates/${id}/activate`);
    return response.data;
  },

  async deactivateESignatureTemplate(id: string): Promise<ESignatureTemplate> {
    const response = await api.post(`/e-signatures/templates/${id}/deactivate`);
    return response.data;
  },

  // Bulk operations
  async bulkCreateESignatures(signatures: CreateESignatureData[]): Promise<{
    created: number;
    failed: number;
    errors: any[];
  }> {
    const response = await api.post("/e-signatures/bulk-create", { signatures });
    return response.data;
  },

  async bulkResendSignatureRequests(signatureIds: string[]): Promise<{
    sent: number;
    failed: number;
    errors: any[];
  }> {
    const response = await api.post("/e-signatures/bulk-resend", { signatureIds });
    return response.data;
  },

  async bulkExtendSignatureExpiry(signatureIds: string[], data: {
    newExpiryDate: string;
    reason: string;
  }): Promise<void> {
    await api.put("/e-signatures/bulk-extend", { signatureIds, ...data });
  },

  // Statistics and reports
  async getESignatureStatistics(): Promise<ESignatureStatistics> {
    const response = await api.get("/e-signatures/statistics");
    return response.data;
  },

  async getESignatureByDocumentType(params: {
    startDate: string;
    endDate: string;
  }): Promise<{
    documentType: string;
    count: number;
    completed: number;
    pending: number;
    expired: number;
    declined: number;
  }[]> {
    const response = await api.get("/e-signatures/by-document-type", { params });
    return response.data;
  },

  async getESignatureBySignerRole(params: {
    startDate: string;
    endDate: string;
  }): Promise<{
    signerRole: string;
    count: number;
    completed: number;
    pending: number;
    expired: number;
    declined: number;
  }[]> {
    const response = await api.get("/e-signatures/by-signer-role", { params });
    return response.data;
  },

  async getESignatureTrends(params: {
    startDate: string;
    endDate: string;
    groupBy: 'day' | 'week' | 'month';
  }): Promise<{
    period: string;
    documents: number;
    signatures: number;
    completed: number;
    expired: number;
  }[]> {
    const response = await api.get("/e-signatures/trends", { params });
    return response.data;
  },

  // Export
  async exportESignatures(format: 'csv' | 'excel' | 'pdf', filters?: any): Promise<Blob> {
    const response = await api.get("/e-signatures/export", {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  async exportESignatureDocuments(format: 'csv' | 'excel' | 'pdf', filters?: any): Promise<Blob> {
    const response = await api.get("/e-signatures/documents/export", {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  // Reports
  async getESignatureReport(params: {
    startDate: string;
    endDate: string;
    reportType: 'summary' | 'detailed' | 'compliance';
    documentType?: string;
    signerRole?: string;
  }): Promise<any> {
    const response = await api.get("/e-signatures/reports", { params });
    return response.data;
  },

  async getComplianceReport(params: {
    startDate: string;
    endDate: string;
    documentType?: string;
  }): Promise<any> {
    const response = await api.get("/e-signatures/compliance-reports", { params });
    return response.data;
  },

  // Validation
  async validateSignature(id: string): Promise<{
    isValid: boolean;
    validationDetails: {
      documentHash: string;
      signatureHash: string;
      timestamp: string;
      certificateValid: boolean;
      certificateExpiry: string;
    };
  }> {
    const response = await api.get(`/e-signatures/${id}/validate`);
    return response.data;
  },

  async getSignatureAuditTrail(id: string): Promise<{
    signatureId: string;
    events: {
      event: string;
      timestamp: string;
      user: string;
      ipAddress: string;
      userAgent: string;
      location?: string;
      details: any;
    }[];
  }> {
    const response = await api.get(`/e-signatures/${id}/audit-trail`);
    return response.data;
  },
};
