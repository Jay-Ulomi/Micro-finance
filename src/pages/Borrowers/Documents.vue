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
          <h1 class="text-2xl font-bold text-gray-900">Borrower Documents</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage documents for {{ borrowerName || 'selected borrower' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Coming Soon -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Document Management</h3>
        <p class="text-gray-500 mb-6">
          This feature is coming soon. You'll be able to upload, view, and manage
          borrower documents including ID cards, bank statements, and other required documents.
        </p>
        <div class="space-y-3">
          <button
            @click="$router.go(-1)"
            class="btn-primary"
          >
            Go Back
          </button>
          <p class="text-sm text-gray-400">
            Borrower ID: {{ $route.params.id || 'Not specified' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const borrowerId = computed(() => route.params.id as string);
const borrowerName = computed(() => {
  // In a real implementation, you would fetch the borrower name
  return borrowerId.value ? "Selected Borrower" : null;
});
</script>
