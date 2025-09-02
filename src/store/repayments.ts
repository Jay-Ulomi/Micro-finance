import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { repaymentsApi } from "@/services/api/repayments";
import type { Repayment, CreateRepaymentData } from "@/types/Repayment";

export const useRepaymentsStore = defineStore("repayments", () => {
  const repayments = ref<Repayment[]>([]);
  const currentRepayment = ref<Repayment | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const currentPage = ref(1);
  const limit = ref(10);
  const loanFilter = ref("");
  const customerFilter = ref("");
  const statusFilter = ref("");
  const startDateFilter = ref("");
  const endDateFilter = ref("");

  const filteredRepayments = computed(() => {
    let filtered = repayments.value;

    if (loanFilter.value) {
      filtered = filtered.filter((repayment) => repayment.loanId === loanFilter.value);
    }

    if (customerFilter.value) {
      filtered = filtered.filter((repayment) => repayment.loan.customerId === customerFilter.value);
    }

    if (statusFilter.value) {
      filtered = filtered.filter((repayment) => repayment.status === statusFilter.value);
    }

    if (startDateFilter.value) {
      filtered = filtered.filter(
        (repayment) => new Date(repayment.paidAt) >= new Date(startDateFilter.value),
      );
    }

    if (endDateFilter.value) {
      filtered = filtered.filter(
        (repayment) => new Date(repayment.paidAt) <= new Date(endDateFilter.value),
      );
    }

    return filtered;
  });

  const getRepayments = async (
    params: {
      page?: number;
      limit?: number;
      loanId?: string;
      customerId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    } = {},
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await repaymentsApi.getRepayments({
        page: params.page || currentPage.value,
        limit: params.limit || limit.value,
        loanId: params.loanId || loanFilter.value,
        customerId: params.customerId || customerFilter.value,
        status: params.status || statusFilter.value,
        startDate: params.startDate || startDateFilter.value,
        endDate: params.endDate || endDateFilter.value,
      });

      repayments.value = response.repayments;
      total.value = response.total;
      currentPage.value = response.page;
      limit.value = response.limit;

      if (params.loanId !== undefined) loanFilter.value = params.loanId;
      if (params.customerId !== undefined) customerFilter.value = params.customerId;
      if (params.status !== undefined) statusFilter.value = params.status;
      if (params.startDate !== undefined) startDateFilter.value = params.startDate;
      if (params.endDate !== undefined) endDateFilter.value = params.endDate;

      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch repayments";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getRepayment = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const repayment = await repaymentsApi.getRepayment(id);
      currentRepayment.value = repayment;

      return repayment;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch repayment";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createRepayment = async (data: CreateRepaymentData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const repayment = await repaymentsApi.createRepayment(data);
      repayments.value.unshift(repayment);
      total.value += 1;

      return repayment;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to create repayment";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateRepayment = async (id: string, data: Partial<Repayment>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const updatedRepayment = await repaymentsApi.updateRepayment(id, data);

      const index = repayments.value.findIndex((r) => r.id === id);
      if (index !== -1) {
        repayments.value[index] = updatedRepayment;
      }

      if (currentRepayment.value?.id === id) {
        currentRepayment.value = updatedRepayment;
      }

      return updatedRepayment;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to update repayment";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteRepayment = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      await repaymentsApi.deleteRepayment(id);

      repayments.value = repayments.value.filter((r) => r.id !== id);
      total.value -= 1;

      if (currentRepayment.value?.id === id) {
        currentRepayment.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to delete repayment";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getRepaymentReceipt = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const receipt = await repaymentsApi.getRepaymentReceipt(id);
      return receipt;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch receipt";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const generateReceiptPDF = async (id: string): Promise<Blob> => {
    try {
      isLoading.value = true;
      error.value = null;

      const pdf = await repaymentsApi.generateReceiptPDF(id);
      return pdf;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to generate PDF";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getOverdueInstallments = async (loanId?: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const overdue = await repaymentsApi.getOverdueInstallments(loanId);
      return overdue;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch overdue installments";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getRepaymentHistory = async (loanId: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const history = await repaymentsApi.getRepaymentHistory(loanId);
      return history;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch repayment history";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const resetFilters = () => {
    loanFilter.value = "";
    customerFilter.value = "";
    statusFilter.value = "";
    startDateFilter.value = "";
    endDateFilter.value = "";
    currentPage.value = 1;
  };

  return {
    // State
    repayments,
    currentRepayment,
    isLoading,
    error,
    total,
    currentPage,
    limit,
    loanFilter,
    customerFilter,
    statusFilter,
    startDateFilter,
    endDateFilter,

    // Getters
    filteredRepayments,

    // Actions
    getRepayments,
    getRepayment,
    createRepayment,
    updateRepayment,
    deleteRepayment,
    getRepaymentReceipt,
    generateReceiptPDF,
    getOverdueInstallments,
    getRepaymentHistory,
    clearError,
    resetFilters,
  };
});
