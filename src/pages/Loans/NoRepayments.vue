<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">No Repayments</h1>
          <p class="text-gray-600 mt-2">
            Loans that have not received any payments since the start of the loan. You can also
            search for no payments made in the dates selected below.
          </p>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Search Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          Search Loans with No Repayments in the following Date Range
        </h3>
      </div>

      <!-- Search Content -->
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
                    v-model="filters.fromDate"
                    placeholder="From Date"
                    @change="handleDateChange"
                  />
                </div>
                <div class="flex-shrink-0">
                  <span class="text-gray-400 font-medium">to</span>
                </div>
                <div class="flex-1">
                  <DatePicker
                    v-model="filters.toDate"
                    placeholder="To Date"
                    @change="handleDateChange"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Filters -->
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
                Additional Filters
              </label>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >All Loans Status</label
                  >
                  <select v-model="filters.loanStatus" class="form-input">
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="overdue">Overdue</option>
                    <option value="arrears">Arrears</option>
                    <option value="completed">Completed</option>
                    <option value="defaulted">Defaulted</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >All Loan Officers</label
                  >
                  <select v-model="filters.loanOfficer" class="form-input">
                    <option value="">All Officers</option>
                    <option value="edwin-simon">Edwin Simon</option>
                    <option value="joseph-ulomi">Joseph Ulomi</option>
                    <option value="mary-johnson">Mary Johnson</option>
                    <option value="david-wilson">David Wilson</option>
                  </select>
                </div>
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
                {{ isLoading ? "Searching..." : "Search!" }}
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
                Reset!
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
          <h3 class="text-lg font-medium text-gray-900">No Repayments</h3>
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
                @click="sortBy('totalDue')"
              >
                <div class="flex items-center justify-end">
                  Total Due
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
                @click="sortBy('totalPaid')"
              >
                <div class="flex items-center justify-end">
                  Paid
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
                @click="sortBy('pastDue')"
              >
                <div class="flex items-center justify-end">
                  PastDue
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
                @click="sortBy('amortization')"
              >
                <div class="flex items-center justify-end">
                  Amortization
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
                @click="sortBy('pendingDue')"
              >
                <div class="flex items-center justify-end">
                  PendingDue
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
              <td colspan="10" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center">
                  <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
                  ></div>
                  <span class="ml-3 text-gray-500">Loading loans...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredLoans.length === 0">
              <td colspan="10" class="px-6 py-12 text-center">
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
                  No loans with zero repayments found
                </h3>
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
                <span class="font-medium text-gray-500">0</span>
              </td>
              <!-- PastDue -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                <span class="font-medium text-gray-500">0</span>
              </td>
              <!-- Amortization -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <span class="font-medium text-gray-500">0</span>
              </td>
              <!-- PendingDue -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                <span class="font-semibold text-gray-500">0</span>
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
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">0.00</td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">0.00</td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">0.00</td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">0.00</td>
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
import DatePicker from "@/components/DatePicker.vue";

// Reactive data
const isLoading = ref(false);
const searchQuery = ref("");
const pageSize = ref(20);
const currentPage = ref(1);
const sortField = ref("");
const sortDirection = ref("asc");

// Filters
const filters = ref({
  fromDate: new Date().toISOString().split("T")[0],
  toDate: new Date().toISOString().split("T")[0],
  loanStatus: "",
  loanOfficer: "",
});

// Mock data for loans with no repayments
const mockLoans = ref([
  {
    id: "1",
    borrowerName: "Mr. Josepj Ulomi",
    loanNumber: "1000001",
    principalAmount: 1000000,
    totalDue: 1050000,
    totalPaid: 0,
    pastDue: 0,
    amortization: 0,
    pendingDue: 0,
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

  // Apply status filter
  if (filters.value.loanStatus) {
    loans = loans.filter((loan) => loan.status === filters.value.loanStatus);
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
      totalDue: acc.totalDue + loan.totalDue,
      paid: 0,
      pastDue: 0,
      amortization: 0,
      pendingDue: 0,
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
    console.log("Searching loans with no repayments with filters:", filters.value);
  } catch (error) {
    console.error("Error searching loans:", error);
  } finally {
    isLoading.value = false;
  }
};

const resetFilters = () => {
  filters.value = {
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
    loanStatus: "",
    loanOfficer: "",
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
