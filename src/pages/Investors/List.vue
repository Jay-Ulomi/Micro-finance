<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Investors</h1>
        <p class="text-sm text-gray-600">Manage investor relationships and KYC</p>
      </div>
      <button class="btn btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Investor
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="text-center py-12 text-gray-500">
          <UserGroupIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 class="text-lg font-medium">Investors Coming Soon</h3>
          <p class="text-sm">Investor management will be implemented here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, UserGroupIcon } from "@heroicons/vue/24/outline";

defineOptions({
  name: "InvestorsList",
});
</script>
