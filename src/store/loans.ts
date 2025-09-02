import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { loansApi } from "@/services/api/loans";
import type { Loan, CreateLoanData } from "@/types/Loan";

export const useLoansStore = defineStore("loans", () => {
  const loans = ref<Loan[]>([]);
  const currentLoan = ref<Loan | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const currentPage = ref(1);
  const limit = ref(10);
  const searchQuery = ref("");
  const statusFilter = ref("");
  const customerFilter = ref("");

  const filteredLoans = computed(() => {
    let filtered = loans.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (loan) =>
          loan.loanNumber.toLowerCase().includes(query) ||
          loan.customer.firstName.toLowerCase().includes(query) ||
          loan.customer.lastName.toLowerCase().includes(query) ||
          loan.purpose.toLowerCase().includes(query),
      );
    }

    if (statusFilter.value) {
      filtered = filtered.filter((loan) => loan.status === statusFilter.value);
    }

    if (customerFilter.value) {
      filtered = filtered.filter((loan) => loan.customerId === customerFilter.value);
    }

    return filtered;
  });

  const getLoans = async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      customerId?: string;
    } = {},
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await loansApi.getLoans({
        page: params.page || currentPage.value,
        limit: params.limit || limit.value,
        search: params.search || searchQuery.value,
        status: params.status || statusFilter.value,
        customerId: params.customerId || customerFilter.value,
      });

      loans.value = response.loans;
      total.value = response.total;
      currentPage.value = response.page;
      limit.value = response.limit;

      if (params.search !== undefined) searchQuery.value = params.search;
      if (params.status !== undefined) statusFilter.value = params.status;
      if (params.customerId !== undefined) customerFilter.value = params.customerId;

      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch loans";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getLoan = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const loan = await loansApi.getLoan(id);
      currentLoan.value = loan;

      return loan;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch loan";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createLoan = async (data: CreateLoanData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const loan = await loansApi.createLoan(data);
      loans.value.unshift(loan);
      total.value += 1;

      return loan;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to create loan";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateLoan = async (id: string, data: Partial<Loan>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const updatedLoan = await loansApi.updateLoan(id, data);

      const index = loans.value.findIndex((l) => l.id === id);
      if (index !== -1) {
        loans.value[index] = updatedLoan;
      }

      if (currentLoan.value?.id === id) {
        currentLoan.value = updatedLoan;
      }

      return updatedLoan;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to update loan";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteLoan = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      await loansApi.deleteLoan(id);

      loans.value = loans.value.filter((l) => l.id !== id);
      total.value -= 1;

      if (currentLoan.value?.id === id) {
        currentLoan.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to delete loan";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const approveLoan = async (id: string, data: { approvedAmount?: number; notes?: string }) => {
    try {
      isLoading.value = true;
      error.value = null;

      const updatedLoan = await loansApi.approveLoan(id, data);

      const index = loans.value.findIndex((l) => l.id === id);
      if (index !== -1) {
        loans.value[index] = updatedLoan;
      }

      if (currentLoan.value?.id === id) {
        currentLoan.value = updatedLoan;
      }

      return updatedLoan;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to approve loan";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const rejectLoan = async (id: string, data: { reason: string }) => {
    try {
      isLoading.value = true;
      error.value = null;

      const updatedLoan = await loansApi.rejectLoan(id, data);

      const index = loans.value.findIndex((l) => l.id === id);
      if (index !== -1) {
        loans.value[index] = updatedLoan;
      }

      if (currentLoan.value?.id === id) {
        currentLoan.value = updatedLoan;
      }

      return updatedLoan;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to reject loan";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const disburseLoan = async (id: string, data: { disbursementDate: string; notes?: string }) => {
    try {
      isLoading.value = true;
      error.value = null;

      const updatedLoan = await loansApi.disburseLoan(id, data);

      const index = loans.value.findIndex((l) => l.id === id);
      if (index !== -1) {
        loans.value[index] = updatedLoan;
      }

      if (currentLoan.value?.id === id) {
        currentLoan.value = updatedLoan;
      }

      return updatedLoan;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to disburse loan";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const closeLoan = async (id: string, data: { closureDate: string; notes?: string }) => {
    try {
      isLoading.value = true;
      error.value = null;

      const updatedLoan = await loansApi.closeLoan(id, data);

      const index = loans.value.findIndex((l) => l.id === id);
      if (index !== -1) {
        loans.value[index] = updatedLoan;
      }

      if (currentLoan.value?.id === id) {
        currentLoan.value = updatedLoan;
      }

      return updatedLoan;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to close loan";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const uploadLoanDocument = async (loanId: string, formData: FormData) => {
    try {
      isLoading.value = true;
      error.value = null;

      await loansApi.uploadLoanDocument(loanId, formData);

      // Refresh loan data to get updated documents
      await getLoan(loanId);
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to upload document";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const generateLoanSchedule = async (loanId: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const updatedLoan = await loansApi.generateLoanSchedule(loanId);

      const index = loans.value.findIndex((l) => l.id === loanId);
      if (index !== -1) {
        loans.value[index] = updatedLoan;
      }

      if (currentLoan.value?.id === loanId) {
        currentLoan.value = updatedLoan;
      }

      return updatedLoan;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to generate loan schedule";
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
    statusFilter.value = "";
    customerFilter.value = "";
    currentPage.value = 1;
  };

  return {
    // State
    loans,
    currentLoan,
    isLoading,
    error,
    total,
    currentPage,
    limit,
    searchQuery,
    statusFilter,
    customerFilter,

    // Getters
    filteredLoans,

    // Actions
    getLoans,
    getLoan,
    createLoan,
    updateLoan,
    deleteLoan,
    approveLoan,
    rejectLoan,
    disburseLoan,
    closeLoan,
    uploadLoanDocument,
    generateLoanSchedule,
    clearError,
    resetFilters,
  };
});
