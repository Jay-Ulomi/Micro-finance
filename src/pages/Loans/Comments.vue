<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Loan Comments</h1>
        </div>
      </div>
    </div>

    <!-- Filter Comments Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Filter Comments</h3>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <DatePicker
              v-model="filters.fromDate"
              placeholder="From Date"
              @change="handleDateChange"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <DatePicker v-model="filters.toDate" placeholder="To Date" @change="handleDateChange" />
          </div>
        </div>

        <div class="flex justify-between items-center">
          <button @click="searchComments" class="btn-primary" :disabled="isLoading">
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

          <button @click="resetFilters" class="btn-secondary">
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
      </div>
    </div>

    <!-- Data Management Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center space-x-4">
          <button class="btn-secondary">Export Data for this page</button>
          <button class="btn-secondary">Export Data for all pages</button>
          <button class="btn-secondary">Show/Hide Columns</button>
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

    <!-- Comments Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Table Controls -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search comments"
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
        </div>
      </div>

      <!-- Comments Data Table -->
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
                @click="sortBy('date')"
              >
                <div class="flex items-center">
                  Date
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
                @click="sortBy('staff')"
              >
                <div class="flex items-center">
                  Staff
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
                @click="sortBy('comments')"
              >
                <div class="flex items-center">
                  Comments
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
                @click="sortBy('borrower')"
              >
                <div class="flex items-center">
                  Borrower
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
                @click="sortBy('loan')"
              >
                <div class="flex items-center">
                  Loan
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
              <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center">
                  <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
                  ></div>
                  <span class="ml-3 text-gray-500">Loading comments...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredComments.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <div class="text-center">
                  <p class="text-gray-500">No data found. No comments found.</p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="comment in paginatedComments"
              :key="comment.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- View -->
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link
                  :to="`/comments/${comment.id}`"
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
              <!-- Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-2 text-gray-400"
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
                  {{ formatDate(comment.date) }}
                </div>
              </td>
              <!-- Staff -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div
                      class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center"
                    >
                      <span class="text-sm font-medium text-primary-700">
                        {{ comment.staff.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ comment.staff }}</div>
                  </div>
                </div>
              </td>
              <!-- Comments -->
              <td class="px-6 py-4 text-sm text-gray-900">
                <div class="max-w-xs truncate">
                  {{ comment.comments }}
                </div>
              </td>
              <!-- Borrower -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-6 w-6">
                    <div class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-600">
                        {{ comment.borrower.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-2">
                    <div class="text-sm font-medium text-gray-900">{{ comment.borrower }}</div>
                  </div>
                </div>
              </td>
              <!-- Loan -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="text-sm font-mono">{{ comment.loan }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="text-sm text-gray-500">
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalComments }} entries
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
  fromDate: "",
  toDate: "",
});

// Mock data for loan comments (currently empty as shown in UI)
const mockComments = ref([]);

// Computed properties
const filteredComments = computed(() => {
  let comments = mockComments.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    comments = comments.filter(
      (comment) =>
        comment.staff.toLowerCase().includes(query) ||
        comment.comments.toLowerCase().includes(query) ||
        comment.borrower.toLowerCase().includes(query) ||
        comment.loan.toLowerCase().includes(query),
    );
  }

  // Apply date filters
  if (filters.value.fromDate) {
    comments = comments.filter((comment) => comment.date >= filters.value.fromDate);
  }
  if (filters.value.toDate) {
    comments = comments.filter((comment) => comment.date <= filters.value.toDate);
  }

  // Apply sorting
  if (sortField.value) {
    comments = [...comments].sort((a, b) => {
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

  return comments;
});

const totalComments = computed(() => filteredComments.value.length);

const totalPages = computed(() => Math.ceil(totalComments.value / pageSize.value));

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1);

const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalComments.value));

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredComments.value.slice(start, end);
});

// Methods
const searchComments = async () => {
  isLoading.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Searching comments with filters:", filters.value);
  } catch (error) {
    console.error("Error searching comments:", error);
  } finally {
    isLoading.value = false;
  }
};

const resetFilters = () => {
  filters.value = {
    fromDate: "",
    toDate: "",
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
const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Initialize
onMounted(() => {
  // Initialize any default data loading
});
</script>
