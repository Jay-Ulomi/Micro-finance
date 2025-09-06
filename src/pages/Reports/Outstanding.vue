<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Outstanding Report</h1>
      <p class="text-sm text-gray-600 mt-2">
        This report shows the outstanding amounts as at the date selected below.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
        <div class="flex items-center space-x-4">
          <label class="text-sm font-medium text-gray-700">Select Report</label>
          <select v-model="selectedReportType" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="borrowers">Borrowers Report</option>
            <option value="loans">Loans Report</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Outstanding at</label>
            <input 
              type="date" 
              v-model="outstandingDate"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Borrower Name or Business Name or Group Name
            </label>
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Search borrower..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>
        </div>

        <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p class="text-sm text-blue-800">
            Only loans released on or below this date will be calculated. The outstanding amount will be calculated as total due (all time) - total payments received until the above date. Please note that penalties will only be calculated until the date selected above ({{ formatDate(outstandingDate) }}). This is because penalties after {{ formatDate(outstandingDate) }} are not outstanding as at {{ formatDate(outstandingDate) }} since they are only added if future amounts after {{ formatDate(outstandingDate) }} don't get paid on time.
          </p>
        </div>

        <div class="flex items-center space-x-6">
          <label class="flex items-center">
            <input 
              type="radio" 
              v-model="loanFilter" 
              value="open"
              class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            >
            <span class="ml-2 text-sm text-gray-700">Open Loans</span>
          </label>
          <label class="flex items-center">
            <input 
              type="radio" 
              v-model="loanFilter" 
              value="all"
              class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            >
            <span class="ml-2 text-sm text-gray-700">All Loans (incl. Open, Fully Paid, Default)</span>
          </label>
        </div>

        <div class="flex justify-end space-x-3">
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

    <div v-if="reportData.length > 0" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <div class="mb-4">
          <p class="text-sm text-gray-600">
            Outstanding at {{ formatDate(outstandingDate) }}
            <button @click="generateReport" class="ml-2 text-primary-600 hover:text-primary-700 text-sm">(change dates above)</button>
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ selectedReportType === 'borrowers' ? 'Borrower Name' : 'Loan Details' }}
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Principal
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fees
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penalty
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Data Rows -->
              <tr v-for="item in filteredReportData" :key="item.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ item.name }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(item.principal) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(item.interest) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(item.fees) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(item.penalty) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-medium text-gray-900">
                  {{ formatCurrency(item.total) }}
                </td>
              </tr>
              
              <!-- Totals Row -->
              <tr class="bg-gray-100 font-bold border-t-2 border-gray-300">
                <td class="px-4 py-3 text-sm text-gray-900">Total</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.principal) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.interest) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.fees) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.penalty) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(totals.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Cards -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 class="text-sm font-medium text-blue-800 mb-1">Total Principal Outstanding</h4>
            <p class="text-xl font-bold text-blue-900">{{ formatCurrency(totals.principal) }}</p>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 class="text-sm font-medium text-green-800 mb-1">Total Interest Outstanding</h4>
            <p class="text-xl font-bold text-green-900">{{ formatCurrency(totals.interest) }}</p>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 class="text-sm font-medium text-yellow-800 mb-1">Total Fees Outstanding</h4>
            <p class="text-xl font-bold text-yellow-900">{{ formatCurrency(totals.fees) }}</p>
          </div>
          
          <div class="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 class="text-sm font-medium text-red-800 mb-1">Total Penalty Outstanding</h4>
            <p class="text-xl font-bold text-red-900">{{ formatCurrency(totals.penalty) }}</p>
          </div>
        </div>

        <!-- Grand Total Card -->
        <div class="mt-4">
          <div class="bg-gray-100 p-6 rounded-lg border border-gray-300">
            <h4 class="text-lg font-medium text-gray-800 mb-2">Grand Total Outstanding</h4>
            <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(totals.total) }}</p>
            <p class="text-sm text-gray-600 mt-1">
              As at {{ formatDate(outstandingDate) }} • {{ filteredReportData.length }} {{ selectedReportType === 'borrowers' ? 'borrower(s)' : 'loan(s)' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500">No outstanding amounts found. Please adjust filters and generate the report.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface OutstandingReportData {
  id: string;
  name: string;
  principal: number;
  interest: number;
  fees: number;
  penalty: number;
  total: number;
  loanType: 'open' | 'closed';
}

const selectedReportType = ref('borrowers');
const outstandingDate = ref('2025-09-05');
const searchQuery = ref('');
const loanFilter = ref('open');

const reportData = ref<OutstandingReportData[]>([
  {
    id: '1',
    name: 'Josepj Ulomi - ADUINOLA',
    principal: 1000000,
    interest: 50000,
    fees: 0,
    penalty: 0,
    total: 1050000,
    loanType: 'open'
  }
]);

const filteredReportData = computed(() => {
  let filtered = reportData.value;

  // Filter by loan type
  if (loanFilter.value === 'open') {
    filtered = filtered.filter(item => item.loanType === 'open');
  }

  // Filter by search query
  if (searchQuery.value) {
    const searchLower = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
});

const totals = computed(() => {
  return filteredReportData.value.reduce((acc, item) => {
    return {
      principal: acc.principal + item.principal,
      interest: acc.interest + item.interest,
      fees: acc.fees + item.fees,
      penalty: acc.penalty + item.penalty,
      total: acc.total + item.total
    };
  }, {
    principal: 0,
    interest: 0,
    fees: 0,
    penalty: 0,
    total: 0
  });
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const generateReport = () => {
  console.log('Generating outstanding report with filters:', {
    selectedReportType: selectedReportType.value,
    outstandingDate: outstandingDate.value,
    searchQuery: searchQuery.value,
    loanFilter: loanFilter.value,
  });
  
  // Here you would typically fetch outstanding report data from your API
  // The data would be calculated based on the outstanding date
};

const exportReport = () => {
  console.log('Exporting outstanding report to Excel...');
};

const printReport = () => {
  window.print();
};
</script>

<style scoped>
@media print {
  .no-print {
    display: none;
  }
}
</style>