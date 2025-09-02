<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.go(-1)"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create New Loan</h1>
          <p class="mt-1 text-sm text-gray-500">
            Apply for a new loan for {{ borrowerName || "selected borrower" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Coming Soon -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <svg
          class="mx-auto h-16 w-16 text-gray-400 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Loan Application Form</h3>
        <p class="text-gray-500 mb-6">
          This feature is coming soon. You'll be able to create loan applications with detailed
          forms, document uploads, and approval workflows.
        </p>
        <div class="space-y-3">
          <button @click="$router.go(-1)" class="btn-primary">Go Back</button>
          <p class="text-sm text-gray-400">
            Borrower ID: {{ $route.query.borrowerId || "Not specified" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { service } from "@/services";

const route = useRoute();
const borrowerId = computed(() => route.query.borrowerId as string);
const borrowerName = computed(() => {
  // In a real implementation, you would fetch the borrower name
  return borrowerId.value ? "Selected Borrower" : null;
});
</script>
