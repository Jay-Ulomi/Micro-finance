import api from "./config";

// Types
export interface Borrower {
  id: string;
  firstName: string;
  lastName: string;
  middleLastName?: string;
  businessName?: string;
  email: string;
  mobile: string;
  uniqueNumber?: string;
  setCustomUniqueNumber?: boolean;
  gender?: "male" | "female" | "other";
  title?: "Mr" | "Mrs" | "Ms" | "Dr" | "Prof";
  dateOfBirth?: string;
  address?: string;
  city?: string;
  province?: string;
  zipcode?: string;
  landline?: string;
  workingStatus?: "employed" | "self-employed" | "unemployed" | "student" | "retired";
  creditScore?: number;
  borrowerPhoto?: string;
  borrowerFiles?: string[];
  description?: string;
  loanOfficer?: string;
  country: string;
  kycStatus: "pending" | "verified" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface CreateBorrowerData {
  firstName: string;
  lastName: string;
  middleLastName?: string;
  businessName?: string;
  email: string;
  mobile: string;
  uniqueNumber?: string;
  setCustomUniqueNumber?: boolean;
  gender?: "male" | "female" | "other";
  title?: "Mr" | "Mrs" | "Ms" | "Dr" | "Prof";
  dateOfBirth?: string;
  address?: string;
  city?: string;
  province?: string;
  zipcode?: string;
  landline?: string;
  workingStatus?: "employed" | "self-employed" | "unemployed" | "student" | "retired";
  creditScore?: number;
  description?: string;
  loanOfficer?: string;
  country: string;
}

export interface BorrowersResponse {
  borrowers: Borrower[];
  total: number;
  page: number;
  limit: number;
}

export interface BorrowerStatistics {
  totalBorrowers: number;
  kycVerified: number;
  kycPending: number;
  kycRejected: number;
  activeLoans: number;
  totalLoanAmount: number;
  averageCreditScore: number;
}

export interface BorrowerGroup {
  id: string;
  name: string;
  description?: string;
  groupType: "individual" | "business" | "community";
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBorrowerGroupData {
  name: string;
  description?: string;
  groupType: "individual" | "business" | "community";
  memberIds?: string[];
}

// API Functions
export const borrowersApi = {
  // Basic CRUD operations
  async getBorrowers(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      kycStatus?: string;
      loanOfficer?: string;
      country?: string;
      workingStatus?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<BorrowersResponse> {
    const response = await api.get("/borrowers", { params });
    return response.data;
  },

  async getBorrower(id: string): Promise<Borrower> {
    const response = await api.get(`/borrowers/${id}`);
    return response.data;
  },

  async createBorrower(data: CreateBorrowerData): Promise<Borrower> {
    const response = await api.post("/borrowers", data);
    return response.data;
  },

  async updateBorrower(id: string, data: Partial<CreateBorrowerData>): Promise<Borrower> {
    const response = await api.put(`/borrowers/${id}`, data);
    return response.data;
  },

  async deleteBorrower(id: string): Promise<void> {
    await api.delete(`/borrowers/${id}`);
  },

  // Statistics
  async getBorrowerStatistics(): Promise<BorrowerStatistics> {
    const response = await api.get("/borrowers/statistics");
    return response.data;
  },

  // File uploads
  async uploadBorrowerPhoto(borrowerId: string, file: File): Promise<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await api.post(`/borrowers/${borrowerId}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async uploadBorrowerFiles(borrowerId: string, files: File[]): Promise<{ fileUrls: string[] }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post(`/borrowers/${borrowerId}/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // KYC operations
  async updateKycStatus(
    borrowerId: string,
    status: "pending" | "verified" | "rejected",
    reason?: string,
  ): Promise<void> {
    await api.put(`/borrowers/${borrowerId}/kyc-status`, { status, reason });
  },

  async getKycDocuments(borrowerId: string): Promise<any[]> {
    const response = await api.get(`/borrowers/${borrowerId}/kyc-documents`);
    return response.data;
  },

  async uploadKycDocument(borrowerId: string, formData: FormData): Promise<void> {
    await api.post(`/borrowers/${borrowerId}/kyc-documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Bulk operations
  async bulkUpdateBorrowers(
    borrowerIds: string[],
    updates: Partial<CreateBorrowerData>,
  ): Promise<void> {
    await api.put("/borrowers/bulk-update", { borrowerIds, updates });
  },

  async bulkDeleteBorrowers(borrowerIds: string[]): Promise<void> {
    await api.delete("/borrowers/bulk-delete", { data: { borrowerIds } });
  },

  async bulkAssignLoanOfficer(borrowerIds: string[], loanOfficerId: string): Promise<void> {
    await api.put("/borrowers/bulk-assign-officer", { borrowerIds, loanOfficerId });
  },

  // Export
  async exportBorrowers(format: "csv" | "excel" | "pdf", filters?: any): Promise<Blob> {
    const response = await api.get("/borrowers/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  // Groups
  async getBorrowerGroups(): Promise<BorrowerGroup[]> {
    const response = await api.get("/borrowers/groups");
    return response.data;
  },

  async createBorrowerGroup(data: CreateBorrowerGroupData): Promise<BorrowerGroup> {
    const response = await api.post("/borrowers/groups", data);
    return response.data;
  },

  async updateBorrowerGroup(
    id: string,
    data: Partial<CreateBorrowerGroupData>,
  ): Promise<BorrowerGroup> {
    const response = await api.put(`/borrowers/groups/${id}`, data);
    return response.data;
  },

  async deleteBorrowerGroup(id: string): Promise<void> {
    await api.delete(`/borrowers/groups/${id}`);
  },

  async addBorrowersToGroup(groupId: string, borrowerIds: string[]): Promise<void> {
    await api.post(`/borrowers/groups/${groupId}/members`, { borrowerIds });
  },

  async removeBorrowersFromGroup(groupId: string, borrowerIds: string[]): Promise<void> {
    await api.delete(`/borrowers/groups/${groupId}/members`, { data: { borrowerIds } });
  },

  // Communication
  async sendSmsToBorrowers(
    borrowerIds: string[],
    message: string,
  ): Promise<{ sent: number; failed: number }> {
    const response = await api.post("/borrowers/sms", { borrowerIds, message });
    return response.data;
  },

  async sendEmailToBorrowers(
    borrowerIds: string[],
    subject: string,
    message: string,
    attachments?: File[],
  ): Promise<{ sent: number; failed: number }> {
    const formData = new FormData();
    formData.append("borrowerIds", JSON.stringify(borrowerIds));
    formData.append("subject", subject);
    formData.append("message", message);

    if (attachments) {
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await api.post("/borrowers/email", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Invitations
  async inviteBorrowers(
    emails: string[],
    message?: string,
  ): Promise<{ sent: number; failed: number }> {
    const response = await api.post("/borrowers/invite", { emails, message });
    return response.data;
  },

  async getInvitationStatus(invitationId: string): Promise<any> {
    const response = await api.get(`/borrowers/invitations/${invitationId}`);
    return response.data;
  },
};
