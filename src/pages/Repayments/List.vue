<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Repayments</h1>
        <p class="text-gray-600">Manage loan repayments and track payment history</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">Record Repayment</button>
    </div>

    <!-- Filters and Search -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="form-label">Search</label>
            <input
              v-model="searchQuery"
              type="text"
              class="form-input"
              placeholder="Search by loan number, customer name..."
              @input="handleSearch"
            />
          </div>

          <div>
            <label class="form-label">Loan</label>
            <select v-model="loanFilter" class="form-input" @change="handleFilterChange">
              <option value="">All Loans</option>
              <option v-for="loan in availableLoans" :key="loan.id" :value="loan.id">
                {{ loan.loanNumber }} - {{ loan.customer.firstName }}
                {{ loan.customer.lastName }}
              </option>
            </select>
          </div>

          <div>
            <label class="form-label">Status</label>
            <select v-model="statusFilter" class="form-input" @change="handleFilterChange">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label class="form-label">Date Range</label>
            <div class="flex space-x-2">
              <input
                v-model="startDateFilter"
                type="date"
                class="form-input flex-1"
                @change="handleFilterChange"
              />
              <input
                v-model="endDateFilter"
                type="date"
                class="form-input flex-1"
                @change="handleFilterChange"
              />
            </div>
          </div>

          <div class="flex items-end">
            <button @click="resetFilters" class="btn-secondary w-full">Reset</button>
          </div>
        </div>

        <div class="flex items-center justify-between mt-4">
          <button @click="resetFilters" class="btn-secondary">Clear All Filters</button>
          <div class="text-sm text-gray-600">{{ repaymentsStore.total }} repayments found</div>
        </div>
      </div>
    </div>

    <!-- Repayments Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="repaymentsStore.isLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <div v-else-if="repaymentsStore.filteredRepayments.length === 0" class="text-center py-8">
          <div
            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No repayments found</h3>
          <p class="text-gray-500 mb-4">
            Try adjusting your filters or create a new repayment record.
          </p>
          <button @click="showCreateModal = true" class="btn-primary">Record Repayment</button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Loan</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="repayment in repaymentsStore.filteredRepayments" :key="repayment.id">
                <td class="text-sm text-gray-900">{{ repayment.id }}</td>
                <td class="text-sm text-gray-900">
                  <router-link
                    :to="`/loans/${repayment.loanId}`"
                    class="text-primary-600 hover:text-primary-800"
                  >
                    {{ repayment.loan.loanNumber }}
                  </router-link>
                </td>
                <td class="text-sm text-gray-900">
                  <router-link
                    :to="`/customers/${repayment.loan.customerId}`"
                    class="text-primary-600 hover:text-primary-800"
                  >
                    {{ repayment.loan.customer.firstName }}
                    {{ repayment.loan.customer.lastName }}
                  </router-link>
                </td>
                <td class="text-sm text-gray-900 font-medium">
                  {{ formatCurrency(repayment.amount) }}
                </td>
                <td class="text-sm text-gray-900">
                  {{ repayment.paymentMethod }}
                </td>
                <td>
                  <span
                    :class="getStatusClass(repayment.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ repayment.status }}
                  </span>
                </td>
                <td class="text-sm text-gray-900">
                  {{ formatDate(repayment.paidAt) }}
                </td>
                <td class="text-sm text-gray-900">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewRepayment(repayment.id)"
                      class="text-primary-600 hover:text-primary-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="generateReceipt(repayment.id)"
                      class="text-green-600 hover:text-green-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="editRepayment(repayment.id)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteRepayment(repayment.id)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="repaymentsStore.total > repaymentsStore.limit"
          class="mt-6 flex items-center justify-between"
        >
          <div class="text-sm text-gray-700">
            Showing
            {{ (repaymentsStore.currentPage - 1) * repaymentsStore.limit + 1 }}
            to
            {{
              Math.min(repaymentsStore.currentPage * repaymentsStore.limit, repaymentsStore.total)
            }}
            of {{ repaymentsStore.total }} results
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="changePage(repaymentsStore.currentPage - 1)"
              :disabled="repaymentsStore.currentPage <= 1"
              class="btn-secondary px-3 py-1"
            >
              Previous
            </button>

            <span class="text-sm text-gray-700">
              Page {{ repaymentsStore.currentPage }} of
              {{ Math.ceil(repaymentsStore.total / repaymentsStore.limit) }}
            </span>

            <button
              @click="changePage(repaymentsStore.currentPage + 1)"
              :disabled="
                repaymentsStore.currentPage >=
                Math.ceil(repaymentsStore.total / repaymentsStore.limit)
              "
              class="btn-secondary px-3 py-1"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Repayment Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="closeModal"
        ></div>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ showEditModal ? "Edit Repayment" : "Record New Repayment" }}
            </h3>

            <form @submit.prevent="submitRepayment" class="space-y-4">
              <div>
                <label class="form-label">Loan</label>
                <select v-model="form.loanId" class="form-input" required>
                  <option value="">Select a loan</option>
                  <option v-for="loan in availableLoans" :key="loan.id" :value="loan.id">
                    {{ loan.loanNumber }} - {{ loan.customer.firstName }}
                    {{ loan.customer.lastName }}
                  </option>
                </select>
              </div>

              <div>
                <label class="form-label">Amount</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >$</span
                  >
                  <input
                    v-model="form.amount"
                    type="number"
                    class="form-input pl-8"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="form-label">Payment Method</label>
                <select v-model="form.paymentMethod" class="form-input" required>
                  <option value="">Select payment method</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="mobile_payment">Mobile Payment</option>
                </select>
              </div>

              <div>
                <label class="form-label">Payment Date</label>
                <input v-model="form.paidAt" type="date" class="form-input" required />
              </div>

              <div>
                <label class="form-label">Reference Number</label>
                <input
                  v-model="form.referenceNumber"
                  type="text"
                  class="form-input"
                  placeholder="Transaction reference"
                />
              </div>

              <div>
                <label class="form-label">Notes</label>
                <textarea
                  v-model="form.notes"
                  class="form-input"
                  rows="3"
                  placeholder="Additional notes..."
                ></textarea>
              </div>
            </form>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="submitRepayment"
              :disabled="repaymentsStore.isLoading"
              class="btn-primary sm:ml-3 sm:w-auto w-full"
            >
              {{ repaymentsStore.isLoading ? "Saving..." : showEditModal ? "Update" : "Create" }}
            </button>
            <button @click="closeModal" class="btn-secondary sm:mt-0 sm:w-auto w-full mt-3">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { useRepaymentsStore } from "@/store/repayments";
import { useLoansStore } from "@/store/loans";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import DatePicker from "@/components/DatePicker.vue";
import type { Repayment, CreateRepaymentData } from "@/types";

const router = useRouter();
const repaymentsStore = useRepaymentsStore();
const loansStore = useLoansStore();

// Global notification functions
const showSuccess = inject("showSuccess") as (message: string) => void;
const showError = inject("showError") as (message: string) => void;

const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingRepaymentId = ref("");

const searchQuery = ref("");
const loanFilter = ref("");
const statusFilter = ref("");
const startDateFilter = ref("");
const endDateFilter = ref("");

const form = reactive<CreateRepaymentData>({
  loanId: "",
  amount: 0,
  paymentMethod: "",
  paidAt: new Date().toISOString().split("T")[0],
  referenceNumber: "",
  notes: "",
});

onMounted(async () => {
  await Promise.all([repaymentsStore.getRepayments(), loansStore.getLoans()]);
});

const availableLoans = computed(() => {
  return loansStore.loans.filter((loan) => loan.status === "disbursed");
});

// Event handlers
const handleSearch = () => {
  repaymentsStore.getRepayments({
    loanId: loanFilter.value,
    status: statusFilter.value,
    startDate: startDateFilter.value,
    endDate: endDateFilter.value,
  });
};

const handleFilterChange = () => {
  repaymentsStore.getRepayments({
    loanId: loanFilter.value,
    status: statusFilter.value,
    startDate: startDateFilter.value,
    endDate: endDateFilter.value,
  });
};

const resetFilters = () => {
  searchQuery.value = "";
  loanFilter.value = "";
  statusFilter.value = "";
  startDateFilter.value = "";
  endDateFilter.value = "";
  repaymentsStore.resetFilters();
  repaymentsStore.getRepayments();
};

const changePage = (page: number) => {
  repaymentsStore.getRepayments({ page });
};

// Actions
const viewRepayment = (id: string) => {
  // Navigate to repayment details or show in modal
  showSuccess("Viewing repayment details");
};

const editRepayment = (id: string) => {
  editingRepaymentId.value = id;
  const repayment = repaymentsStore.repayments.find((r) => r.id === id);
  if (repayment) {
    form.loanId = repayment.loanId;
    form.amount = repayment.amount;
    form.paymentMethod = repayment.paymentMethod;
    form.paidAt = repayment.paidAt.split("T")[0];
    form.referenceNumber = repayment.referenceNumber || "";
    form.notes = repayment.notes || "";
    showEditModal.value = true;
  }
};

const deleteRepayment = async (id: string) => {
  if (confirm("Are you sure you want to delete this repayment?")) {
    try {
      await repaymentsStore.deleteRepayment(id);
      showSuccess("Repayment deleted successfully");
    } catch (error) {
      showError("Failed to delete repayment");
    }
  }
};

const generateReceipt = async (id: string) => {
  try {
    const pdf = await repaymentsStore.generateReceiptPDF(id);

    // Create download link
    const url = window.URL.createObjectURL(pdf);
    const link = document.createElement("a");
    link.href = url;
    link.download = `repayment-receipt-${id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
    showSuccess("Receipt generated successfully");
  } catch (error) {
    showError("Failed to generate receipt");
  }
};

const submitRepayment = async () => {
  try {
    if (showEditModal.value) {
      await repaymentsStore.updateRepayment(editingRepaymentId.value, form);
      showSuccess("Repayment updated successfully");
    } else {
      await repaymentsStore.createRepayment(form);
      showSuccess("Repayment recorded successfully");
    }
    closeModal();
    repaymentsStore.getRepayments();
  } catch (error) {
    showError(showEditModal.value ? "Failed to update repayment" : "Failed to create repayment");
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingRepaymentId.value = "";
  // Reset form
  Object.assign(form, {
    loanId: "",
    amount: 0,
    paymentMethod: "",
    paidAt: new Date().toISOString().split("T")[0],
    referenceNumber: "",
    notes: "",
  });
};

const getStatusClass = (status: string) => {
  const classes = {
    pending: "px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full",
    completed: "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full",
    failed: "px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full",
    cancelled: "px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full",
  };
  return classes[status as keyof typeof classes] || classes.pending;
};
</script>
