import api from "./config";
import type { Customer, CreateCustomerData } from "@/types/Customer";

export interface CustomersResponse {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
}

export const customersApi = {
  async getCustomers(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      kycStatus?: string;
    } = {}
  ): Promise<CustomersResponse> {
    const response = await api.get("/customers", { params });
    return response.data;
  },

  async getCustomer(id: string): Promise<Customer> {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  async createCustomer(data: CreateCustomerData): Promise<Customer> {
    const response = await api.post("/customers", data);
    return response.data;
  },

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },

  async uploadKycDocument(
    customerId: string,
    formData: FormData
  ): Promise<void> {
    await api.post(`/customers/${customerId}/kyc-documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async verifyKycDocument(
    customerId: string,
    documentId: string,
    status: string
  ): Promise<void> {
    await api.put(`/customers/${customerId}/kyc-documents/${documentId}`, {
      status,
    });
  },

  async updateKycStatus(customerId: string, status: string): Promise<void> {
    await api.put(`/customers/${customerId}/kyc-status`, { status });
  },
};
