<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Approve Repayments</h1>
      </div>
    </div>

    <!-- Advanced Search -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <button
          @click="toggleAdvanced"
          class="text-primary-600 hover:text-primary-800 font-medium text-sm"
        >
          Advanced Search: Click here to {{ showAdvanced ? "Hide" : "Show" }}
        </button>
      </div>
      <div v-if="showAdvanced" class="p-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">All Staff</label>
        <input
          v-model="filters.staff"
          placeholder="Click in the box above to select multiple staff"
          class="form-input w-full"
        />
        <div class="mt-4 flex items-center gap-3">
          <button class="btn-primary">Search!</button>
          <button class="btn-secondary">Reset!</button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <button class="btn-primary">Approve Payments</button>
      <div class="ml-auto flex items-center gap-2">
        <button class="btn-secondary">Delete Payments</button>
        <button class="btn-secondary">Show/Hide Columns</button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="relative w-80">
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
                class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <input type="checkbox" class="form-checkbox" />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
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
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Staff
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Edit Date
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
                  <span class="ml-3 text-gray-500">Loading repayments...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredRows.length === 0">
              <td colspan="10" class="px-6 py-12 text-center text-gray-600">
                No pending repayments found for approval. To restrict staff so they can only add
                payments for approval, visit Admin(top menu) --- Staff --- Edit. There, check
                Restrict Add/Edit Repayments for Approval.
              </td>
            </tr>
            <tr v-else v-for="r in paginatedRows" :key="r.id">
              <td class="px-3 py-2"><input type="checkbox" class="form-checkbox" /></td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button class="text-primary-600 hover:text-primary-800">View</button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                {{ formatCurrency(r.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ formatDate(r.collectionDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ r.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{{ r.loanNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ r.collectedBy }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ r.method }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ r.staff }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatDate(r.editDate) }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td></td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900">&nbsp;</td>
              <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(totalAmount) }}
              </td>
              <td colspan="7"></td>
            </tr>
          </tfoot>
        </table>
      </div>

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

const showAdvanced = ref(false);
const filters = ref({ staff: "" });
const searchQuery = ref("");
const isLoading = ref(false);
const pageSize = ref(50);
const currentPage = ref(1);

const rows = ref<
  Array<{
    id: string;
    amount: number;
    collectionDate: string;
    name: string;
    loanNumber: string;
    collectedBy: string;
    method: string;
    staff: string;
    editDate: string;
  }>
>([]);

const toggleAdvanced = () => (showAdvanced.value = !showAdvanced.value);

const filteredRows = computed(() => {
  let r = rows.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    r = r.filter((x) => x.name.toLowerCase().includes(q) || x.loanNumber.toLowerCase().includes(q));
  }
  if (filters.value.staff) {
    r = r.filter((x) => x.staff.toLowerCase().includes(filters.value.staff.toLowerCase()));
  }
  return r;
});

const total = computed(() => filteredRows.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, total.value));
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRows.value.slice(start, start + pageSize.value);
});
const totalAmount = computed(() => filteredRows.value.reduce((s, r) => s + r.amount, 0));

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
