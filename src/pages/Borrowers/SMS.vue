<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Send SMS to All Borrowers</h1>
        <p class="text-sm text-gray-600 mt-1">Send bulk SMS messages to borrowers</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="text-center py-12">
        <div
          class="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4"
        >
          <svg
            class="w-8 h-8 text-yellow-600"
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
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Bulk SMS Messaging</h3>
        <p class="text-gray-600 mb-6">
          This page will allow you to send SMS messages to all borrowers or selected groups.
        </p>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-sm text-yellow-800">
            <strong>Features to implement:</strong> Message composer, recipient selection, template
            management, delivery tracking, and SMS history.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Send SMS to All Borrowers page component
</script>
