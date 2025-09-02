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
          <h1 class="text-2xl font-bold text-gray-900">Send Message</h1>
          <p class="mt-1 text-sm text-gray-500">
            Send message to {{ borrowerName || "selected borrower" }}
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Message Center</h3>
        <p class="text-gray-500 mb-6">
          This feature is coming soon. You'll be able to send SMS and email messages to borrowers
          with templates, scheduling, and delivery tracking.
        </p>
        <div class="space-y-3">
          <button @click="$router.go(-1)" class="btn-primary">Go Back</button>
          <p class="text-sm text-gray-400">
            Borrower ID: {{ $route.params.id || "Not specified" }}
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
