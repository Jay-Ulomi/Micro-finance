<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Guarantors</h1>
          <p class="text-gray-600 mt-2">
            Here you can add guarantors for loans. These can be selected in the Add Loan page. You
            can also send sms or email to the guarantors.
          </p>
          <button class="btn-primary mt-4">Add Guarantor</button>
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
          <h3 class="text-lg font-medium text-gray-900">Guarantors</h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">{{ filteredGuarantors.length }} guarantors</span>
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
                placeholder="Search guarantors"
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

      <!-- Guarantors Data Table -->
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
                @click="sortBy('fullName')"
              >
                <div class="flex items-center">
                  Full Name
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
                @click="sortBy('business')"
              >
                <div class="flex items-center">
                  Business
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
                @click="sortBy('mobile')"
              >
                <div class="flex items-center">
                  Mobile
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
                @click="sortBy('email')"
              >
                <div class="flex items-center">
                  Email
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
                @click="sortBy('guarantorInLoans')"
              >
                <div class="flex items-center">
                  Guarantor in Loans#
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
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center">
                  <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
                  ></div>
                  <span class="ml-3 text-gray-500">Loading guarantors...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredGuarantors.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="text-center">
                  <p class="text-gray-500">
                    No data found.
                    <button class="text-primary-600 hover:text-primary-800 font-medium">
                      Click here to Add Guarantor
                    </button>
                  </p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="guarantor in paginatedGuarantors"
              :key="guarantor.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- View -->
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link
                  :to="`/guarantors/${guarantor.id}`"
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
              <!-- Full Name -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div
                      class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center"
                    >
                      <span class="text-sm font-medium text-primary-700">
                        {{ guarantor.fullName.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ guarantor.fullName }}</div>
                  </div>
                </div>
              </td>
              <!-- Business -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ guarantor.business }}
              </td>
              <!-- Mobile -->
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {{ guarantor.mobile }}
                </div>
              </td>
              <!-- Email -->
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
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {{ guarantor.email }}
                </div>
              </td>
              <!-- Guarantor in Loans# -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ guarantor.guarantorInLoans }} loans
                </span>
              </td>
              <!-- Action -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button class="text-primary-600 hover:text-primary-800">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button class="text-green-600 hover:text-green-800">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button class="text-blue-600 hover:text-blue-800">
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
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="text-sm text-gray-500">
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalGuarantors }} entries
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

// Mock data for guarantors (currently empty as shown in UI)
const mockGuarantors = ref([]);

// Computed properties
const filteredGuarantors = computed(() => {
  let guarantors = mockGuarantors.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    guarantors = guarantors.filter(
      (guarantor) =>
        guarantor.fullName.toLowerCase().includes(query) ||
        guarantor.business.toLowerCase().includes(query) ||
        guarantor.mobile.includes(query) ||
        guarantor.email.toLowerCase().includes(query),
    );
  }

  // Apply sorting
  if (sortField.value) {
    guarantors = [...guarantors].sort((a, b) => {
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

  return guarantors;
});

const totalGuarantors = computed(() => filteredGuarantors.value.length);

const totalPages = computed(() => Math.ceil(totalGuarantors.value / pageSize.value));

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1);

const endIndex = computed(() =>
  Math.min(currentPage.value * pageSize.value, totalGuarantors.value),
);

const paginatedGuarantors = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredGuarantors.value.slice(start, end);
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

// Initialize
onMounted(() => {
  // Initialize any default data loading
});
</script>
