<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Fees Report</h1>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div class="flex items-center space-x-2">
              <div>
                <label class="text-xs text-gray-500">From Date</label>
                <input 
                  type="date" 
                  v-model="dateFrom"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>
              <span class="text-gray-500 mt-5">to</span>
              <div>
                <label class="text-xs text-gray-500">To Date</label>
                <input 
                  type="date" 
                  v-model="dateTo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>
            </div>
          </div>

          <div class="flex items-end">
            <div class="flex space-x-3">
              <button
                @click="generateReport"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Generate Report
              </button>
              <button
                @click="exportReport"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Export to Excel
              </button>
              <button
                @click="printReport"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Results -->
    <div v-if="reportGenerated" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <!-- No Active Fees Message -->
        <div v-if="feesData.length === 0" class="text-center py-8">
          <div class="mb-4">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-gray-500 text-lg mb-4">
            There are no active fees in the account.
          </p>
          <button
            @click="navigateToAddFees"
            class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Click here to add fees
          </button>
        </div>

        <!-- Fees Data Table -->
        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrower
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan#
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Released
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principal
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fees Due
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee Paid
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fees Pending
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <!-- Data Rows -->
                <tr v-for="fee in feesData" :key="fee.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ fee.borrowerName }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ fee.loanNumber }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(fee.released) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(fee.principal) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(fee.feesDue) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(fee.feePaid) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    <span :class="fee.feesPending > 0 ? 'text-red-600 font-medium' : 'text-gray-900'">
                      {{ formatCurrency(fee.feesPending) }}
                    </span>
                  </td>
                </tr>

                <!-- Totals Row -->
                <tr v-if="feesData.length > 0" class="bg-gray-100 font-bold border-t-2 border-gray-300">
                  <td colspan="2" class="px-4 py-3 text-sm text-gray-900">Total</td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(totals.released) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(totals.principal) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(totals.feesDue) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(totals.feePaid) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    <span :class="totals.feesPending > 0 ? 'text-red-600 font-medium' : 'text-gray-900'">
                      {{ formatCurrency(totals.feesPending) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Additional Information -->
          <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-blue-800">
                  This report shows fee-related information for loans within the selected date range. Fees pending are highlighted in red.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500">Please select a date range and generate the report to view fees information.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface FeesData {
  id: string;
  borrowerName: string;
  loanNumber: string;
  released: number;
  principal: number;
  feesDue: number;
  feePaid: number;
  feesPending: number;
}

const currentDate = new Date();
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

const dateFrom = ref(firstDayOfMonth.toISOString().split('T')[0]);
const dateTo = ref(currentDate.toISOString().split('T')[0]);

const reportGenerated = ref(true); // Show by default to display the "no fees" message

// Empty array to show "no active fees" message as per your specification
const feesData = ref<FeesData[]>([]);

// Example data structure for when fees exist (commented out to show the no-fees state)
// const feesData = ref<FeesData[]>([
//   {
//     id: '1',
//     borrowerName: 'John Doe',
//     loanNumber: 'L001',
//     released: 100000,
//     principal: 90000,
//     feesDue: 5000,
//     feePaid: 2000,
//     feesPending: 3000
//   }
// ]);

const totals = computed(() => {
  return feesData.value.reduce((acc, fee) => {
    return {
      released: acc.released + fee.released,
      principal: acc.principal + fee.principal,
      feesDue: acc.feesDue + fee.feesDue,
      feePaid: acc.feePaid + fee.feePaid,
      feesPending: acc.feesPending + fee.feesPending
    };
  }, {
    released: 0,
    principal: 0,
    feesDue: 0,
    feePaid: 0,
    feesPending: 0
  });
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const generateReport = () => {
  console.log('Generating fees report with filters:', {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
  });
  reportGenerated.value = true;
  
  // Here you would typically fetch fees data from your API
  // For now, we maintain empty array to show the "no active fees" message
};

const exportReport = () => {
  console.log('Exporting fees report to Excel...');
};

const printReport = () => {
  window.print();
};

const navigateToAddFees = () => {
  // Navigate to the add fees page
  // This would typically use Vue Router
  console.log('Navigating to add fees page...');
  // Example: router.push('/fees/add');
};
</script>

<style scoped>
@media print {
  .no-print {
    display: none;
  }
}
</style>