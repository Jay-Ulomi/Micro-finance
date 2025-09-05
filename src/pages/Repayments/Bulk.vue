<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 class="text-2xl font-bold text-gray-900">Add Bulk Repayments</h1>
      <p class="text-gray-600 mt-2">
        You can use this page to add bulk repayments. Please be careful that you select the right
        loan. You can enter as many rows as you like.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Row
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Loan
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Method
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Collection Date
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Collected By
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description (optional)
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Accounting: Cash/Bank
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(row, idx) in rows" :key="row.id">
              <td class="px-4 py-2 text-sm text-gray-900">{{ idx + 1 }}</td>
              <td class="px-4 py-2">
                <input
                  v-model="row.loan"
                  placeholder="Choose Loan or Search by Borrower Name"
                  class="form-input w-72"
                />
                <div class="text-xs text-primary-600 mt-1 cursor-pointer">Set Default</div>
              </td>
              <td class="px-4 py-2 w-40">
                <input
                  v-model.number="row.amount"
                  type="number"
                  placeholder="Amount"
                  class="form-input"
                />
              </td>
              <td class="px-4 py-2 w-40">
                <select v-model="row.method" class="form-input">
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                  <option value="Mobile Money">Mobile Money</option>
                </select>
                <div class="text-xs text-primary-600 mt-1 cursor-pointer">Set Default</div>
              </td>
              <td class="px-4 py-2 w-48">
                <input
                  v-model="row.collectionDate"
                  type="date"
                  placeholder="dd/mm/yyyy"
                  class="form-input"
                />
                <div class="text-xs text-primary-600 mt-1 cursor-pointer">Set Default</div>
              </td>
              <td class="px-4 py-2 w-48">
                <input v-model="row.collectedBy" placeholder="edwin simon" class="form-input" />
                <div class="text-xs text-primary-600 mt-1 cursor-pointer">Set Default</div>
              </td>
              <td class="px-4 py-2 w-64">
                <input v-model="row.description" placeholder="Description" class="form-input" />
              </td>
              <td class="px-4 py-2 w-40">
                <select v-model="row.accounting" class="form-input">
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                </select>
                <div class="text-xs text-primary-600 mt-1 cursor-pointer">Set Default</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <button @click="addRow" class="btn-secondary">Add Row</button>
        <div class="flex items-center gap-3">
          <button class="btn-secondary">Reset</button>
          <button class="btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface BulkRow {
  id: string;
  loan: string;
  amount: number;
  method: string;
  collectionDate: string;
  collectedBy: string;
  description: string;
  accounting: string;
}

const makeRow = (): BulkRow => ({
  id: Math.random().toString(36).slice(2),
  loan: "",
  amount: 0,
  method: "Cash",
  collectionDate: "",
  collectedBy: "edwin simon",
  description: "",
  accounting: "Cash",
});

const rows = ref<BulkRow[]>(Array.from({ length: 15 }, () => makeRow()));

const addRow = () => rows.value.push(makeRow());
</script>
