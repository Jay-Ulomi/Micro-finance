<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Savings Transactions</h1>
        <p class="text-sm text-gray-600">Track deposits, withdrawals, and transfers</p>
      </div>
      <button class="btn btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        New Transaction
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="text-center py-12 text-gray-500">
          <ArrowPathIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 class="text-lg font-medium">Savings Transactions Coming Soon</h3>
          <p class="text-sm">Transaction management will be implemented here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, ArrowPathIcon } from "@heroicons/vue/24/outline";

defineOptions({
  name: "SavingsTransactionsList",
});
</script>
