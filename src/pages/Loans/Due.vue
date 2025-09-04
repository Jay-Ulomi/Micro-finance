<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Due Loans</h1>
          <p class="text-gray-600 mt-2">
            Open loans that have due schedule dates between selected dates. You can use this page to
            see loans due today.
          </p>
        </div>
      </div>
    </div>

    <!-- Filter and Search Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Filter Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Filter Loans</h3>
        <p class="text-sm text-gray-500 mt-1">Set your search criteria to find specific loans</p>
      </div>

      <!-- Filter Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Column - Date Range -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                <svg
                  class="w-4 h-4 inline mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"
                  />
                </svg>
                Date Range
              </label>
              <div class="flex items-center space-x-3">
                <div class="flex-1">
                  <DatePicker
                    v-model="filters.startDate"
                    placeholder="Start date"
                    @change="handleDateChange"
                  />
                </div>
                <div class="flex-shrink-0">
                  <span class="text-gray-400 font-medium">to</span>
                </div>
                <div class="flex-1">
                  <DatePicker
                    v-model="filters.endDate"
                    placeholder="End date"
                    @change="handleDateChange"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Filter Options -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                <svg
                  class="w-4 h-4 inline mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                  />
                </svg>
                Filter Options
              </label>
              <div class="space-y-3">
                <label class="flex items-start">
                  <input
                    v-model="filters.includeZeroAmounts"
                    type="checkbox"
                    class="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div class="ml-3">
                    <span class="text-sm font-medium text-gray-700">Include zero amounts</span>
                    <p class="text-xs text-gray-500">
                      Include due loans with zero pending due amounts
                    </p>
                  </div>
                </label>
                <label class="flex items-start">
                  <input
                    v-model="filters.includePenalties"
                    type="checkbox"
                    class="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div class="ml-3">
                    <span class="text-sm font-medium text-gray-700">Include penalties</span>
                    <p class="text-xs text-gray-500">
                      Include loans where system generated penalty is added between the above dates
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <button
                @click="searchLoans"
                class="btn-primary flex items-center"
                :disabled="isLoading"
              >
                <svg
                  v-if="!isLoading"
                  class="w-4 h-4 mr-2"
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
                <svg
                  v-if="isLoading"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ isLoading ? "Searching..." : "Search Loans" }}
              </button>
              <button @click="resetFilters" class="btn-secondary flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Filters
              </button>
            </div>
            <div class="text-sm text-gray-500">{{ filteredLoans.length }} loans found</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Due Loans</h3>
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
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Loan#
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Principal
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Due
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Paid
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                PastDue
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amortization
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                PendingDue
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                NextDue
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Payment
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
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
                <h3 class="mt-2 text-sm font-medium text-gray-900">No due loans found</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria or date range.
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
                <router-link
                  :to="`/loans/${loan.id}`"
                  class="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium text-sm transition-colors duration-150"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  View
                </router-link>
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
              <!-- Principal -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <span class="font-medium">{{ formatCurrency(loan.principalAmount) }}</span>
              </td>
              <!-- Total Due -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <span class="font-semibold text-gray-900">{{ formatCurrency(loan.totalDue) }}</span>
              </td>
              <!-- Paid -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <span class="font-medium text-green-600">{{ formatCurrency(loan.totalPaid) }}</span>
              </td>
              <!-- PastDue -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                <span
                  class="font-medium"
                  :class="loan.pastDue > 0 ? 'text-red-600' : 'text-gray-500'"
                >
                  {{ formatCurrency(loan.pastDue) }}
                </span>
              </td>
              <!-- Amortization -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <span class="font-medium">{{ formatCurrency(loan.amortization) }}</span>
              </td>
              <!-- PendingDue -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                <span
                  class="font-semibold"
                  :class="loan.pendingDue > 0 ? 'text-orange-600' : 'text-gray-500'"
                >
                  {{ formatCurrency(loan.pendingDue) }}
                </span>
              </td>
              <!-- NextDue -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"
                    />
                  </svg>
                  {{ formatDate(loan.nextDueDate) }}
                </div>
              </td>
              <!-- Last Payment -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div v-if="loan.lastPaymentDate" class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"
                    />
                  </svg>
                  {{ formatDate(loan.lastPaymentDate) }}
                </div>
                <span v-else class="text-gray-400">-</span>
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
              <td colspan="3" class="px-6 py-3 text-sm font-medium text-gray-900">Total</td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.principal) }}
              </td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.totalDue) }}
              </td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.paid) }}
              </td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.pastDue) }}
              </td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.amortization) }}
              </td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totals.pendingDue) }}
              </td>
              <td colspan="3"></td>
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
import DatePicker from "@/components/DatePicker.vue";

// Reactive data
const isLoading = ref(false);
const searchQuery = ref("");
const pageSize = ref(20);
const currentPage = ref(1);

// Filters
const filters = ref({
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  includeZeroAmounts: false,
  includePenalties: false,
});

// Mock data for demonstration
const loans = ref([
  {
    id: "1",
    borrowerName: "John Doe",
    loanNumber: "LN001",
    principalAmount: 100000,
    totalDue: 120000,
    totalPaid: 20000,
    pastDue: 5000,
    amortization: 10000,
    pendingDue: 100000,
    nextDueDate: "2024-01-15",
    lastPaymentDate: "2023-12-15",
    status: "active",
  },
  {
    id: "2",
    borrowerName: "Jane Smith",
    loanNumber: "LN002",
    principalAmount: 50000,
    totalDue: 60000,
    totalPaid: 10000,
    pastDue: 0,
    amortization: 5000,
    pendingDue: 50000,
    nextDueDate: "2024-01-20",
    lastPaymentDate: "2023-12-20",
    status: "active",
  },
]);

// Computed properties
const filteredLoans = computed(() => {
  let result = loans.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (loan) =>
        loan.borrowerName.toLowerCase().includes(query) ||
        loan.loanNumber.toLowerCase().includes(query),
    );
  }

  // Apply date range filter
  if (filters.value.startDate && filters.value.endDate) {
    result = result.filter((loan) => {
      const nextDue = new Date(loan.nextDueDate);
      const startDate = new Date(filters.value.startDate);
      const endDate = new Date(filters.value.endDate);
      return nextDue >= startDate && nextDue <= endDate;
    });
  }

  // Apply zero amounts filter
  if (!filters.value.includeZeroAmounts) {
    result = result.filter((loan) => loan.pendingDue > 0);
  }

  return result;
});

const totalLoans = computed(() => filteredLoans.value.length);

const totalPages = computed(() => Math.ceil(totalLoans.value / pageSize.value));

const paginatedLoans = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredLoans.value.slice(start, end);
});

const startIndex = computed(() => {
  if (totalLoans.value === 0) return 0;
  return (currentPage.value - 1) * pageSize.value + 1;
});

const endIndex = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalLoans.value);
});

const totals = computed(() => {
  return filteredLoans.value.reduce(
    (acc, loan) => ({
      principal: acc.principal + loan.principalAmount,
      totalDue: acc.totalDue + loan.totalDue,
      paid: acc.paid + loan.totalPaid,
      pastDue: acc.pastDue + loan.pastDue,
      amortization: acc.amortization + loan.amortization,
      pendingDue: acc.pendingDue + loan.pendingDue,
    }),
    {
      principal: 0,
      totalDue: 0,
      paid: 0,
      pastDue: 0,
      amortization: 0,
      pendingDue: 0,
    },
  );
});

// Methods
const searchLoans = async () => {
  isLoading.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In a real app, you would call the API here
    console.log("Searching loans with filters:", filters.value);
  } catch (error) {
    console.error("Error searching loans:", error);
  } finally {
    isLoading.value = false;
  }
};

const resetFilters = () => {
  filters.value = {
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    includeZeroAmounts: false,
    includePenalties: false,
  };
  searchQuery.value = "";
  currentPage.value = 1;
};

const handleSearch = () => {
  currentPage.value = 1;
};

const handleDateChange = () => {
  currentPage.value = 1;
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    active: "Active",
    overdue: "Overdue",
    completed: "Completed",
    defaulted: "Defaulted",
  };
  return statusMap[status] || status;
};

const getStatusClass = (status: string) => {
  const statusClasses: { [key: string]: string } = {
    active: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    defaulted: "bg-gray-100 text-gray-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

const getStatusDotClass = (status: string) => {
  const dotClasses: { [key: string]: string } = {
    active: "bg-green-400",
    overdue: "bg-red-400",
    completed: "bg-blue-400",
    defaulted: "bg-gray-400",
  };
  return dotClasses[status] || "bg-gray-400";
};

// Initialize
onMounted(() => {
  // Set default dates to today
  const today = new Date().toISOString().split("T")[0];
  filters.value.startDate = today;
  filters.value.endDate = today;
});
</script>
