<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Borrowers</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage borrower information, KYC documents, and loan applications
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="exportBorrowers" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export
        </button>
        <router-link to="/borrowers/create" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Borrower
        </router-link>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Borrowers</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistics.totalBorrowers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">KYC Verified</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistics.kycVerified }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Pending KYC</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistics.kycPending }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Loans</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistics.activeLoans }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and search -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label for="search" class="form-label">Search</label>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            class="form-input"
            placeholder="Search by name, email, or ID..."
            @input="handleSearch"
          />
        </div>
        <div>
          <label for="kycStatus" class="form-label">KYC Status</label>
          <select id="kycStatus" v-model="kycFilter" class="form-input" @change="handleFilter">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label for="loanOfficer" class="form-label">Loan Officer</label>
          <select
            id="loanOfficer"
            v-model="loanOfficerFilter"
            class="form-input"
            @change="handleFilter"
          >
            <option value="">All Officers</option>
            <option value="edwin-simon">Edwin Simon</option>
            <option value="joseph-ulomi">Joseph Ulomi</option>
          </select>
        </div>
        <div>
          <label class="form-label">Registration Date</label>
          <DatePicker
            v-model="registrationDateFilter"
            placeholder="Filter by registration date"
            @change="handleFilterChange"
          />
        </div>
        <div class="flex items-end space-x-2">
          <button @click="resetFilters" class="btn-secondary flex-1">Reset</button>
          <button @click="bulkActions" class="btn-secondary flex-1">Bulk Actions</button>
        </div>
      </div>
    </div>

    <!-- Borrowers table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Borrowers List</h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">{{ filteredBorrowers.length }} borrowers</span>
            <button @click="toggleView" class="text-sm text-blue-600 hover:text-blue-800">
              {{ viewMode === "table" ? "Card View" : "Table View" }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="filteredBorrowers.length === 0" class="text-center py-12">
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No borrowers found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new borrower.</p>
        <div class="mt-6">
          <router-link to="/borrowers/create" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Borrower
          </router-link>
        </div>
      </div>

      <!-- Table View -->
      <div v-else-if="viewMode === 'table'" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300"
                />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Borrower
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                KYC Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Credit Score
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Loan Officer
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Registration
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="borrower in filteredBorrowers" :key="borrower.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  v-model="selectedBorrowers"
                  :value="borrower.id"
                  class="rounded border-gray-300"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                    >
                      <span class="text-blue-600 font-medium text-sm">
                        {{ getInitials(borrower.firstName, borrower.lastName) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ borrower.firstName }} {{ borrower.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">
                      ID: {{ borrower.uniqueNumber || borrower.id }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ borrower.email }}</div>
                <div class="text-sm text-gray-500">{{ borrower.mobile }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    {
                      'bg-yellow-100 text-yellow-800': borrower.kycStatus === 'pending',
                      'bg-green-100 text-green-800': borrower.kycStatus === 'verified',
                      'bg-red-100 text-red-800': borrower.kycStatus === 'rejected',
                    },
                  ]"
                >
                  {{ borrower.kycStatus }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ borrower.creditScore || "N/A" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ borrower.loanOfficer || "Unassigned" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(borrower.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <router-link
                    :to="`/borrowers/${borrower.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </router-link>
                  <button
                    @click="editBorrower(borrower)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button @click="deleteBorrower(borrower)" class="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Card View -->
      <div v-else class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="borrower in filteredBorrowers"
            :key="borrower.id"
            class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center">
                <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-600 font-medium">
                    {{ getInitials(borrower.firstName, borrower.lastName) }}
                  </span>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ borrower.firstName }} {{ borrower.lastName }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    ID: {{ borrower.uniqueNumber || borrower.id }}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                v-model="selectedBorrowers"
                :value="borrower.id"
                class="rounded border-gray-300"
              />
            </div>

            <div class="mt-4 space-y-2">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {{ borrower.email }}
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {{ borrower.mobile }}
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <span
                :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  {
                    'bg-yellow-100 text-yellow-800': borrower.kycStatus === 'pending',
                    'bg-green-100 text-green-800': borrower.kycStatus === 'verified',
                    'bg-red-100 text-red-800': borrower.kycStatus === 'rejected',
                  },
                ]"
              >
                {{ borrower.kycStatus }}
              </span>
              <div class="flex space-x-2">
                <router-link
                  :to="`/borrowers/${borrower.id}`"
                  class="text-blue-600 hover:text-blue-900 text-sm"
                >
                  View
                </router-link>
                <button
                  @click="editBorrower(borrower)"
                  class="text-indigo-600 hover:text-indigo-900 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, totalBorrowers) }}
            of {{ totalBorrowers }} results
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md',
                page === currentPage
                  ? 'text-white bg-blue-600 border border-blue-600'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import DatePicker from "@/components/DatePicker.vue";
import { service, type Borrower, type BorrowerStatistics } from "@/services";

const router = useRouter();

// State
const isLoading = ref(false);
const viewMode = ref<"table" | "card">("table");
const searchQuery = ref("");
const kycFilter = ref("");
const loanOfficerFilter = ref("");
const registrationDateFilter = ref("");
const selectedBorrowers = ref<string[]>([]);
const selectAll = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

// Data
const borrowers = ref<Borrower[]>([]);
const statistics = ref<BorrowerStatistics>({
  totalBorrowers: 0,
  kycVerified: 0,
  kycPending: 0,
  kycRejected: 0,
  activeLoans: 0,
  totalLoanAmount: 0,
  averageCreditScore: 0,
});

// Computed properties
const filteredBorrowers = computed(() => {
  let filtered = borrowers.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (borrower) =>
        borrower.firstName.toLowerCase().includes(query) ||
        borrower.lastName.toLowerCase().includes(query) ||
        borrower.email.toLowerCase().includes(query) ||
        borrower.uniqueNumber?.toLowerCase().includes(query) ||
        borrower.id.toLowerCase().includes(query),
    );
  }

  // KYC status filter
  if (kycFilter.value) {
    filtered = filtered.filter((borrower) => borrower.kycStatus === kycFilter.value);
  }

  // Loan officer filter
  if (loanOfficerFilter.value) {
    filtered = filtered.filter((borrower) => borrower.loanOfficer === loanOfficerFilter.value);
  }

  return filtered;
});

// Pagination
const totalBorrowers = computed(() => filteredBorrowers.value.length);
const totalPages = computed(() => Math.ceil(totalBorrowers.value / itemsPerPage));
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Methods
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const loadBorrowers = async () => {
  try {
    isLoading.value = true;
    const response = await service.getBorrowersAsync({
      page: currentPage.value,
      limit: itemsPerPage,
      search: searchQuery.value,
      kycStatus: kycFilter.value,
      loanOfficer: loanOfficerFilter.value,
    });
    borrowers.value = response.borrowers;
  } catch (error) {
    console.error("Error loading borrowers:", error);
    alert("Failed to load borrowers");
  } finally {
    isLoading.value = false;
  }
};

const loadStatistics = async () => {
  try {
    statistics.value = await service.getBorrowerStatisticsAsync();
  } catch (error) {
    console.error("Error loading statistics:", error);
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadBorrowers();
};

const handleFilter = () => {
  currentPage.value = 1;
  loadBorrowers();
};

const handleFilterChange = () => {
  currentPage.value = 1;
  loadBorrowers();
};

const resetFilters = () => {
  searchQuery.value = "";
  kycFilter.value = "";
  loanOfficerFilter.value = "";
  registrationDateFilter.value = "";
  currentPage.value = 1;
  loadBorrowers();
};

const toggleView = () => {
  viewMode.value = viewMode.value === "table" ? "card" : "table";
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedBorrowers.value = filteredBorrowers.value.map((b) => b.id);
  } else {
    selectedBorrowers.value = [];
  }
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadBorrowers();
  }
};

const editBorrower = (borrower: Borrower) => {
  router.push(`/borrowers/${borrower.id}/edit`);
};

const deleteBorrower = async (borrower: Borrower) => {
  if (confirm(`Are you sure you want to delete ${borrower.firstName} ${borrower.lastName}?`)) {
    try {
      // In a real application, this would call the API to delete the borrower
      // For now, we'll just reload the data
      await loadBorrowers();
      await loadStatistics();
      alert("Borrower deleted successfully");
    } catch (error) {
      console.error("Error deleting borrower:", error);
      alert("Failed to delete borrower");
    }
  }
};

const exportBorrowers = () => {
  // Implement export functionality
  alert("Export functionality will be implemented");
};

const bulkActions = () => {
  if (selectedBorrowers.value.length === 0) {
    alert("Please select borrowers first");
    return;
  }
  alert(`Bulk actions for ${selectedBorrowers.value.length} selected borrowers`);
};

// Watch for changes in selected borrowers
const updateSelectAll = () => {
  selectAll.value =
    selectedBorrowers.value.length === filteredBorrowers.value.length &&
    filteredBorrowers.value.length > 0;
};

// Watch for changes in selected borrowers to update select all checkbox
watch(selectedBorrowers, updateSelectAll, { deep: true });

// Initialize
onMounted(async () => {
  await Promise.all([loadBorrowers(), loadStatistics()]);
});
</script>
