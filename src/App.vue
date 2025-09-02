<template>
  <div id="app">
    <router-view />
    
    <!-- Global error toast -->
    <div
      v-if="globalError"
      class="fixed top-4 right-4 z-50 max-w-sm w-full bg-red-50 border border-red-200 rounded-md shadow-lg"
    >
      <div class="p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ globalError }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button
              @click="clearGlobalError"
              class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Global success toast -->
    <div
      v-if="globalSuccess"
      class="fixed top-4 right-4 z-50 max-w-sm w-full bg-green-50 border border-green-200 rounded-md shadow-lg"
    >
      <div class="p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-800">{{ globalSuccess }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button
              @click="clearGlobalSuccess"
              class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';

// Global state for notifications
const globalError = ref('');
const globalSuccess = ref('');

// Provide these functions to child components
provide('showError', (message: string) => {
  globalError.value = message;
  setTimeout(() => {
    globalError.value = '';
  }, 5000);
});

provide('showSuccess', (message: string) => {
  globalSuccess.value = message;
  setTimeout(() => {
    globalSuccess.value = '';
  }, 3000);
});

const clearGlobalError = () => {
  globalError.value = '';
};

const clearGlobalSuccess = () => {
  globalSuccess.value = '';
};
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Focus styles */
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>
