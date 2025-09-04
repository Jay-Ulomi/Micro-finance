<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Approve Loans</h1>
          <p class="text-gray-600 mt-2">
            To add/edit loan statuses, please visit
            <a href="#" class="text-primary-600 hover:text-primary-800"
              >Admin(top menu)→ Loans Manage Loan Status and Approvals</a
            >. There you can also give permission to staff members on which loan status they can
            approve.
            <a href="#" class="text-primary-600 hover:text-primary-800"
              >Click here to watch a video on how it works</a
            >.
          </p>
        </div>
      </div>
    </div>

    <!-- Processing Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-red-200 bg-red-50">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Processing</h3>
          <button @click="toggleSection('processing')" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="expandedSections.processing" class="p-6">
        <div class="text-center py-8">
          <p class="text-gray-500">No loans found.</p>
        </div>
        <div class="text-right text-sm text-gray-500">
          Processing - 0 loans (not including child loans) - No Loans.
        </div>
      </div>
    </div>

    <!-- Open Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-red-200 bg-red-50">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Open</h3>
          <button @click="toggleSection('open')" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="expandedSections.open" class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Pie Chart -->
          <div class="flex items-center justify-center">
            <div class="relative w-48 h-48">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <!-- Background circle -->
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="8" />
                <!-- Current loans slice -->
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  stroke-width="8"
                  stroke-dasharray="251.2"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">1</div>
                  <div class="text-sm text-gray-500">Current</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Legend -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-gray-900">Open</h4>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                  <span class="text-sm text-gray-700">Current - 1 loans</span>
                </div>
                <button class="text-primary-600 hover:text-primary-800 text-sm font-medium">
                  Change
                </button>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full bg-yellow-500 mr-3"></div>
                  <span class="text-sm text-gray-700">Due Today - 0 loans</span>
                </div>
                <span class="text-sm text-gray-500">No Loans</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full bg-cyan-500 mr-3"></div>
                  <span class="text-sm text-gray-700">Missed Repayment - 0 loans</span>
                </div>
                <span class="text-sm text-gray-500">No Loans</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full bg-red-500 mr-3"></div>
                  <span class="text-sm text-gray-700">Arrears - 0 loans</span>
                </div>
                <span class="text-sm text-gray-500">No Loans</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full bg-purple-500 mr-3"></div>
                  <span class="text-sm text-gray-700">Past Maturity - 0 loans</span>
                </div>
                <span class="text-sm text-gray-500">No Loans</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Defaulted Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-red-200 bg-red-50">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Defaulted</h3>
          <button @click="toggleSection('defaulted')" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="expandedSections.defaulted" class="p-6">
        <div class="text-center py-8">
          <p class="text-gray-500">No loans found.</p>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
              <span class="text-sm text-gray-700"
                >Defaulted - 0 loans (not including child loans)</span
              >
            </div>
            <span class="text-sm text-gray-500">No Loans</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-full bg-cyan-500 mr-3"></div>
              <span class="text-sm text-gray-700">Credit Counseling - 0 loans</span>
            </div>
            <span class="text-sm text-gray-500">No Loans</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-full bg-yellow-500 mr-3"></div>
              <span class="text-sm text-gray-700">Collection Agency - 0 loans</span>
            </div>
            <span class="text-sm text-gray-500">No Loans</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-full bg-pink-500 mr-3"></div>
              <span class="text-sm text-gray-700">Sequestrate - 0 loans</span>
            </div>
            <span class="text-sm text-gray-500">No Loans</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-full bg-purple-500 mr-3"></div>
              <span class="text-sm text-gray-700">Debt Review - 0 loans</span>
            </div>
            <span class="text-sm text-gray-500">No Loans</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-full bg-indigo-500 mr-3"></div>
              <span class="text-sm text-gray-700">Fraud - 0 loans</span>
            </div>
            <span class="text-sm text-gray-500">No Loans</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-full bg-gray-800 mr-3"></div>
              <span class="text-sm text-gray-700">Investigation - 0 loans</span>
            </div>
            <span class="text-sm text-gray-500">No Loans</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-full bg-red-600 mr-3"></div>
              <span class="text-sm text-gray-700">Legal - 0 loans</span>
            </div>
            <span class="text-sm text-gray-500">No Loans</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-full bg-red-800 mr-3"></div>
              <span class="text-sm text-gray-700">Write-Off - 0 loans</span>
            </div>
            <span class="text-sm text-gray-500">No Loans</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Denied Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-red-200 bg-red-50">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Denied</h3>
          <button @click="toggleSection('denied')" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="expandedSections.denied" class="p-6">
        <div class="text-center py-8">
          <p class="text-gray-500">No loans found.</p>
        </div>
        <div class="text-right text-sm text-gray-500">
          Denied - 0 loans (not including child loans) - No Loans.
        </div>
      </div>
    </div>

    <!-- Not Taken Up Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-red-200 bg-red-50">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Not Taken Up</h3>
          <button @click="toggleSection('notTakenUp')" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="expandedSections.notTakenUp" class="p-6">
        <div class="text-center py-8">
          <p class="text-gray-500">No loans found.</p>
        </div>
        <div class="text-right text-sm text-gray-500">
          Not Taken Up - 0 loans (not including child loans) - No Loans.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// Reactive data
const expandedSections = ref({
  processing: true,
  open: true,
  defaulted: true,
  denied: true,
  notTakenUp: true,
});

// Methods
const toggleSection = (section: string) => {
  expandedSections.value[section as keyof typeof expandedSections.value] =
    !expandedSections.value[section as keyof typeof expandedSections.value];
};

// Initialize
onMounted(() => {
  // Initialize any default data loading
});
</script>
