import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { customersApi } from "@/api/customers";
import type { Customer, CreateCustomerData } from "@/types/Customer";

export const useCustomersStore = defineStore("customers", () => {
  const customers = ref<Customer[]>([]);
  const currentCustomer = ref<Customer | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const currentPage = ref(1);
  const limit = ref(10);
  const searchQuery = ref("");
  const kycFilter = ref("");

  const filteredCustomers = computed(() => {
    let filtered = customers.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(query) ||
          customer.lastName.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.customerId.toLowerCase().includes(query),
      );
    }

    if (kycFilter.value) {
      filtered = filtered.filter((customer) => customer.kycStatus === kycFilter.value);
    }

    return filtered;
  });

  const getCustomers = async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      kycStatus?: string;
    } = {},
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await customersApi.getCustomers({
        page: params.page || currentPage.value,
        limit: params.limit || limit.value,
        search: params.search || searchQuery.value,
        kycStatus: params.kycStatus || kycFilter.value,
      });

      customers.value = response.customers;
      total.value = response.total;
      currentPage.value = response.page;
      limit.value = response.limit;

      if (params.search !== undefined) searchQuery.value = params.search;
      if (params.kycStatus !== undefined) kycFilter.value = params.kycStatus;

      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch customers";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getCustomer = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const customer = await customersApi.getCustomer(id);
      currentCustomer.value = customer;

      return customer;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch customer";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createCustomer = async (data: CreateCustomerData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const newCustomer: Customer = {
        id: `customer_${Date.now()}`,
        customerId: `CUST${String(customers.value.length + 1).padStart(3, "0")}`,
        ...data,
        kycStatus: "pending" as any,
        kycDocuments: [],
        creditScore: Math.floor(Math.random() * 300) + 500, // Random credit score
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      customers.value.unshift(newCustomer);
      total.value += 1;

      return newCustomer;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to create customer";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const updatedCustomer = await customersApi.updateCustomer(id, data);

      const index = customers.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        customers.value[index] = updatedCustomer;
      }

      if (currentCustomer.value?.id === id) {
        currentCustomer.value = updatedCustomer;
      }

      return updatedCustomer;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to update customer";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      await customersApi.deleteCustomer(id);

      customers.value = customers.value.filter((c) => c.id !== id);
      total.value -= 1;

      if (currentCustomer.value?.id === id) {
        currentCustomer.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to delete customer";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const uploadKycDocument = async (customerId: string, formData: FormData) => {
    try {
      isLoading.value = true;
      error.value = null;

      await customersApi.uploadKycDocument(customerId, formData);

      // Refresh customer data to get updated documents
      await getCustomer(customerId);
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to upload document";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const verifyKycDocument = async (customerId: string, documentId: string, status: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      await customersApi.verifyKycDocument(customerId, documentId, status);

      // Refresh customer data
      await getCustomer(customerId);
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to verify document";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateKycStatus = async (customerId: string, status: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      await customersApi.updateKycStatus(customerId, status);

      // Update customer in list
      const index = customers.value.findIndex((c) => c.id === customerId);
      if (index !== -1) {
        customers.value[index].kycStatus = status as any;
      }

      // Update current customer if it's the same one
      if (currentCustomer.value?.id === customerId) {
        currentCustomer.value.kycStatus = status as any;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to update KYC status";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const resetFilters = () => {
    searchQuery.value = "";
    kycFilter.value = "";
    currentPage.value = 1;
  };

  return {
    // State
    customers,
    currentCustomer,
    isLoading,
    error,
    total,
    currentPage,
    limit,
    searchQuery,
    kycFilter,

    // Getters
    filteredCustomers,

    // Actions
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    uploadKycDocument,
    verifyKycDocument,
    updateKycStatus,
    clearError,
    resetFilters,
  };
});
