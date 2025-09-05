<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Collateral Register</h1>
        <button class="btn-primary flex items-center" @click="$router.push('/collateral/create')">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Collateral
        </button>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <button class="text-primary-600 hover:text-primary-800 font-medium text-sm">
          Advanced Search: Click here to Show
        </button>
        <div class="flex items-center gap-2">
          <button class="btn-secondary">Export Data for all pages</button>
          <button class="btn-secondary">Show/Hide Columns</button>
        </div>
      </div>

      <!-- Table controls -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="relative w-64">
            <input
              v-model="query"
              placeholder="Search collateral"
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
          <div class="flex items-center gap-2 text-sm">
            <span class="text-gray-500">Show</span>
            <select v-model.number="pageSize" class="form-input w-20">
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span class="text-gray-500">entries</span>
          </div>
        </div>
      </div>

      <!-- Table -->
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
                Borrower
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Model
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Serial Number
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Condition
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredRows.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">No collateral found.</td>
            </tr>
            <tr v-else v-for="row in paginatedRows" :key="row.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
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
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ row.borrower }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ row.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ row.model }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ row.serialNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ row.status }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ row.condition }}</td>
            </tr>
          </tbody>
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
            <span>{{ currentPage }}</span>
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
import { PlusIcon } from "@heroicons/vue/24/outline";
import { ref, computed } from "vue";

defineOptions({ name: "CollateralList" });

const query = ref("");
const pageSize = ref(20);
const currentPage = ref(1);

// Mock data to match screenshot
const rows = ref([
  {
    id: "1",
    borrower: "Mr. Josepj Ulomi",
    name: "Land",
    model: "",
    serialNumber: "",
    status: "Collateral with Borrower",
    condition: "",
  },
]);

const filteredRows = computed(() => {
  const q = query.value.toLowerCase();
  return rows.value.filter(
    (r) =>
      r.borrower.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.serialNumber.toLowerCase().includes(q),
  );
});

const total = computed(() => filteredRows.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, total.value));
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRows.value.slice(start, start + pageSize.value);
});

const prev = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const next = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
</script>
