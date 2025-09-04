<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Principal Outstanding</h1>
          <p class="text-gray-600 mt-2">
            Outstanding principal balance for <strong>Open</strong> loans.
          </p>
        </div>
      </div>
    </div>

    <!-- Advanced Search Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Search Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <button
          @click="toggleAdvancedSearch"
          class="text-primary-600 hover:text-primary-800 font-medium text-sm"
        >
          Advanced Search: Click here to {{ showAdvancedSearch ? "Hide" : "Show" }}
        </button>
      </div>

      <!-- Advanced Search Content -->
      <div v-if="showAdvancedSearch" class="p-6">
        <div class="space-y-4">
          <!-- Additional filters can be added here -->
          <div class="text-sm text-gray-500">Advanced search options will be available here.</div>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Principal Outstanding</h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">{{ filteredLoans.length }} loans</span>
            <div class="flex items-center space-x-2">
              <button class="btn-secondary text-sm">Export Data</button>
              <button class="btn-secondary text-sm">Show/Hide Columns</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Controls -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, loan number..."
                class="form-input pl-10"
                @input="handleSearch"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Show</span>
            <select class="form-input w-20" v-model="pageSize">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span class="text-sm text-gray-500">entries</span>
          </div>
        </div>
      </div>

      <!-- Loan Data Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                View
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('borrowerName')"
              >
                <div class="flex items-center">
                  Name
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('loanNumber')"
              >
                <div class="flex items-center">
                  Loan#
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('releasedDate')"
              >
                <div class="flex items-center">
                  Released
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('maturityDate')"
              >
                <div class="flex items-center">
                  Maturity
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('principalAmount')"
              >
                <div class="flex items-center justify-end">
                  Principal
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('principalPaid')"
              >
                <div class="flex items-center justify-end">
                  Principal Paid
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('principalBalance')"
              >
                <div class="flex items-center justify-end">
                  Principal Balance
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('principalDueTillToday')"
              >
                <div class="flex items-center justify-end">
                  Principal Due Till Today
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('principalPaidTillToday')"
              >
                <div class="flex items-center justify-end">
                  Principal Paid Till Today
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('principalBalanceTillToday')"
              >
                <div class="flex items-center justify-end">
                  Principal Balance Till Today
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('status')"
              >
                <div class="flex items-center">
                  Status
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="12" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center">
                  <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
                  ></div>
                  <span class="ml-3 text-gray-500">Loading loans...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredLoans.length === 0">
              <td colspan="12" class="px-6 py-12 text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
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
                <h3 class="mt-2 text-sm font-medium text-gray-900">
                  No principal outstanding loans found
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria or filters.
                </p>
              </td>
            </tr>
            <tr
              v-else
              v-for="loan in paginatedLoans"
              :key="loan.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- View -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <router-link
                    :to="`/loans/${loan.id}`"
                    class="text-primary-600 hover:text-primary-800"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </router-link>
                  <button class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </button>
                </div>
              </td>
              <!-- Name -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div
                      class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center"
                    >
                      <span class="text-sm font-medium text-primary-700">
                        {{ loan.borrowerName.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ loan.borrowerName }}</div>
                  </div>
                </div>
              </td>
              <!-- Loan# -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-mono text-gray-900">{{ loan.loanNumber }}</div>
              </td>
              <!-- Released -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(loan.releasedDate) }}
              </td>
              <!-- Maturity -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(loan.maturityDate) }}
              </td>
              <!-- Principal -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <span class="font-medium">{{ formatCurrency(loan.principalAmount) }}</span>
              </td>
              <!-- Principal Paid -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <span class="font-medium text-green-600">{{
                  formatCurrency(loan.principalPaid)
                }}</span>
              </td>
              <!-- Principal Balance -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <span class="font-semibold text-gray-900">{{
                  formatCurrency(loan.principalBalance)
                }}</span>
              </td>
              <!-- Principal Due Till Today -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <span class="font-medium">{{ formatCurrency(loan.principalDueTillToday) }}</span>
              </td>
              <!-- Principal Paid Till Today -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <span class="font-medium text-green-600">{{
                  formatCurrency(loan.principalPaidTillToday)
                }}</span>
              </td>
              <!-- Principal Balance Till Today -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <span class="font-semibold text-gray-900">{{
                  formatCurrency(loan.principalBalanceTillToday)
                }}</span>
              </td>
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusClass(loan.status)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full mr-1.5"
                    :class="getStatusDotClass(loan.status)"
                  ></span>
                  {{ formatStatus(loan.status) }}
                </span>
              </td>
            </tr>
          </tbody>
          <!-- Summary Row -->
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="5" class="px-6 py-3 text-sm font-medium text-gray-900">Total</td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.principal) }}
              </td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.principalPaid) }}
              </td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.principalBalance) }}
              </td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.principalDueTillToday) }}
              </td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.principalPaidTillToday) }}
              </td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.principalBalanceTillToday) }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="text-sm text-gray-500">
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalLoans }} entries
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="btn-secondary text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>
            <div class="flex items-center space-x-1">
              <span class="text-sm text-gray-500">Page</span>
              <span class="text-sm font-medium text-gray-900">{{ currentPage }}</span>
              <span class="text-sm text-gray-500">of</span>
              <span class="text-sm font-medium text-gray-900">{{ totalPages }}</span>
            </div>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="btn-secondary text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              Next
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { service } from "@/services";

// Reactive data
const isLoading = ref(false);
const searchQuery = ref("");
const pageSize = ref(20);
const currentPage = ref(1);
const showAdvancedSearch = ref(false);
const sortField = ref("");
const sortDirection = ref("asc");

// Mock data for principal outstanding loans
const mockLoans = ref([
  {
    id: "1",
    borrowerName: "Mr. Josepj Ulomi",
    loanNumber: "1000001",
    releasedDate: "2025-02-09",
    maturityDate: "2025-02-10",
    principalAmount: 1000000,
    principalPaid: 0,
    principalBalance: 1000000,
    principalDueTillToday: 0,
    principalPaidTillToday: 0,
    principalBalanceTillToday: 0,
    status: "current",
  },
]);

// Computed properties
const filteredLoans = computed(() => {
  let loans = mockLoans.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    loans = loans.filter(
      (loan) =>
        loan.borrowerName.toLowerCase().includes(query) ||
        loan.loanNumber.toLowerCase().includes(query),
    );
  }

  // Apply sorting
  if (sortField.value) {
    loans = [...loans].sort((a, b) => {
      const aVal = a[sortField.value as keyof typeof a];
      const bVal = b[sortField.value as keyof typeof b];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection.value === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection.value === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }

  return loans;
});

const totalLoans = computed(() => filteredLoans.value.length);

const totalPages = computed(() => Math.ceil(totalLoans.value / pageSize.value));

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1);

const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalLoans.value));

const paginatedLoans = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredLoans.value.slice(start, end);
});

const totals = computed(() => {
  return filteredLoans.value.reduce(
    (acc, loan) => ({
      principal: acc.principal + loan.principalAmount,
      principalPaid: acc.principalPaid + loan.principalPaid,
      principalBalance: acc.principalBalance + loan.principalBalance,
      principalDueTillToday: acc.principalDueTillToday + loan.principalDueTillToday,
      principalPaidTillToday: acc.principalPaidTillToday + loan.principalPaidTillToday,
      principalBalanceTillToday: acc.principalBalanceTillToday + loan.principalBalanceTillToday,
    }),
    {
      principal: 0,
      principalPaid: 0,
      principalBalance: 0,
      principalDueTillToday: 0,
      principalPaidTillToday: 0,
      principalBalanceTillToday: 0,
    },
  );
});

// Methods
const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value;
};

const handleSearch = () => {
  currentPage.value = 1;
};

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    active: "Active",
    current: "Current",
    overdue: "Overdue",
    arrears: "Arrears",
    completed: "Completed",
    defaulted: "Defaulted",
  };
  return statusMap[status] || status;
};

const getStatusClass = (status: string) => {
  const statusClasses: { [key: string]: string } = {
    active: "bg-green-100 text-green-800",
    current: "bg-blue-100 text-blue-800",
    overdue: "bg-red-100 text-red-800",
    arrears: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    defaulted: "bg-gray-100 text-gray-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

const getStatusDotClass = (status: string) => {
  const dotClasses: { [key: string]: string } = {
    active: "bg-green-400",
    current: "bg-blue-400",
    overdue: "bg-red-400",
    arrears: "bg-yellow-400",
    completed: "bg-blue-400",
    defaulted: "bg-gray-400",
  };
  return dotClasses[status] || "bg-gray-400";
};

// Initialize
onMounted(() => {
  // Initialize any default data loading
});
</script>
