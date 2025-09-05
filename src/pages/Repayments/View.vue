<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-2xl font-bold text-gray-900">View Repayments</h1>
            <a href="#" class="text-sm text-primary-600 hover:text-primary-800">Help</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <button class="btn-secondary w-full sm:w-auto">Export Data for this page</button>
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <button class="btn-secondary">Export Data for all pages</button>
        <button class="btn-secondary">Bulk Delete</button>
        <button class="btn-secondary">Show/Hide Columns</button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Controls -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="relative w-full sm:w-80">
            <input
              v-model="searchQuery"
              placeholder="Search repayments"
              class="form-input pl-10 w-full"
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
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Show</span>
            <select v-model="pageSize" class="form-input w-20">
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span class="text-sm text-gray-500">entries</span>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Collection Date
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
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Collected By
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Method
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Receipt
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="8" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center">
                  <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
                  ></div>
                  <span class="ml-3 text-gray-500">Loading repayments...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredRepayments.length === 0">
              <td colspan="8" class="px-6 py-12 text-center">
                <p class="text-gray-600">
                  No data found. To add a repayment, visit
                  <router-link to="/loans" class="text-primary-600 hover:text-primary-800"
                    >Loans</router-link
                  >
                  (left menu) ---
                  <router-link to="/loans" class="text-primary-600 hover:text-primary-800"
                    >View All Loans</router-link
                  >
                  --- View --- Add Repayment
                </p>
              </td>
            </tr>
            <tr v-else v-for="r in paginatedRepayments" :key="r.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-primary-600 hover:text-primary-800 text-sm">View</button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ formatDate(r.collectionDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ r.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{{ r.loanNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ r.collectedBy }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ r.method }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                {{ formatCurrency(r.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="6" class="px-6 py-3 text-sm font-medium text-gray-900">&nbsp;</td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totalAmount) }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between text-sm">
          <div class="text-gray-500">
            Showing {{ startIndex }} to {{ endIndex }} of {{ total }} entries
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="prev"
              :disabled="currentPage === 1"
              class="btn-secondary text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              Previous
            </button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              @click="next"
              :disabled="currentPage === totalPages"
              class="btn-secondary text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
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
import { ref, computed } from "vue";

const isLoading = ref(false);
const searchQuery = ref("");
const pageSize = ref(20);
const currentPage = ref(1);

// Mock empty
const repayments = ref<
  Array<{
    id: string;
    collectionDate: string;
    name: string;
    loanNumber: string;
    collectedBy: string;
    method: string;
    amount: number;
  }>
>([]);

const filteredRepayments = computed(() => {
  let rows = repayments.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    rows = rows.filter(
      (r) => r.name.toLowerCase().includes(q) || r.loanNumber.toLowerCase().includes(q),
    );
  }
  return rows;
});

const total = computed(() => filteredRepayments.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, total.value));
const paginatedRepayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRepayments.value.slice(start, start + pageSize.value);
});
const totalAmount = computed(() => filteredRepayments.value.reduce((s, r) => s + r.amount, 0));

const prev = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const next = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
</script>
