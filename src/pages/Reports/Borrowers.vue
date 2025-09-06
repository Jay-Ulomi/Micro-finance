<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Borrowers Report</h1>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
        <div class="flex items-center space-x-4">
          <label class="text-sm font-medium text-gray-700">Select Report</label>
          <select v-model="selectedReportType" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="borrowers">Borrowers Report</option>
          </select>
        </div>

        <div class="flex flex-wrap gap-4">
          <label class="flex items-center">
            <input type="checkbox" v-model="showDueLoans" class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
            <span class="ml-2 text-sm text-gray-700">Show Due Loans row</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="showPayments" class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
            <span class="ml-2 text-sm text-gray-700">Show Payments row</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="showNetDue" class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
            <span class="ml-2 text-sm text-gray-700">Show Net Due row</span>
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div class="flex items-center space-x-2">
              <input 
                type="date" 
                v-model="dateFrom"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
              <span class="text-gray-500">to</span>
              <input 
                type="date" 
                v-model="dateTo"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>
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
            From {{ formatDate(dateFrom) }} - {{ formatDate(dateTo) }}
            <button @click="generateReport" class="ml-2 text-primary-600 hover:text-primary-700 text-sm">(change dates above)</button>
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th rowspan="2" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrower
                </th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Num Loans Released
                </th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Principal Released
                </th>
                <th colspan="5" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l">
                  Amount Details
                </th>
              </tr>
              <tr>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l">
                  Principal
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fees
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penalty
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="borrower in reportData" :key="borrower.id">
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    {{ borrower.name }} - {{ borrower.businessName }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900">
                    {{ borrower.numLoans }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(borrower.principalReleased) }}
                  </td>
                  <td colspan="5" class="border-l"></td>
                </tr>
                
                <tr v-if="showDueLoans" class="bg-blue-50">
                  <td class="px-4 py-2 pl-8 text-sm text-gray-700">Due Loans:</td>
                  <td></td>
                  <td></td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700 border-l">
                    {{ formatCurrency(borrower.duePrincipal) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">
                    {{ formatCurrency(borrower.dueInterest) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">
                    {{ formatCurrency(borrower.dueFees) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">
                    {{ formatCurrency(borrower.duePenalty) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right font-medium text-gray-900">
                    {{ formatCurrency(borrower.dueTotal) }}
                  </td>
                </tr>
                
                <tr v-if="showPayments" class="bg-green-50">
                  <td class="px-4 py-2 pl-8 text-sm text-gray-700">
                    Payments({{ borrower.paymentsCount }}):
                  </td>
                  <td></td>
                  <td></td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700 border-l">
                    {{ formatCurrency(borrower.paymentsPrincipal) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">
                    {{ formatCurrency(borrower.paymentsInterest) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">
                    {{ formatCurrency(borrower.paymentsFees) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">
                    {{ formatCurrency(borrower.paymentsPenalty) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right font-medium text-gray-900">
                    {{ formatCurrency(borrower.paymentsTotal) }}
                  </td>
                </tr>
                
                <tr v-if="showNetDue" class="bg-yellow-50">
                  <td class="px-4 py-2 pl-8 text-sm text-gray-700">Net Due:</td>
                  <td></td>
                  <td></td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700 border-l">
                    {{ formatCurrency(borrower.netDuePrincipal) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">
                    {{ formatCurrency(borrower.netDueInterest) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">
                    {{ formatCurrency(borrower.netDueFees) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">
                    {{ formatCurrency(borrower.netDuePenalty) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right font-medium text-gray-900">
                    {{ formatCurrency(borrower.netDueTotal) }}
                  </td>
                </tr>
              </template>
              
              <tr class="bg-gray-100 font-bold">
                <td class="px-4 py-3 text-sm text-gray-900">Total</td>
                <td class="px-4 py-3 text-sm text-center text-gray-900">
                  {{ totals.numLoans }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.principalReleased) }}
                </td>
                <td colspan="5" class="border-l"></td>
              </tr>
              
              <tr v-if="showDueLoans" class="bg-blue-100 font-bold">
                <td class="px-4 py-2 pl-8 text-sm text-gray-900">Due Loans:</td>
                <td></td>
                <td></td>
                <td class="px-4 py-2 text-sm text-right text-gray-900 border-l">
                  {{ formatCurrency(totals.duePrincipal) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.dueInterest) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.dueFees) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.duePenalty) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.dueTotal) }}
                </td>
              </tr>
              
              <tr v-if="showPayments" class="bg-green-100 font-bold">
                <td class="px-4 py-2 pl-8 text-sm text-gray-900">
                  Payments({{ totals.paymentsCount }}):
                </td>
                <td></td>
                <td></td>
                <td class="px-4 py-2 text-sm text-right text-gray-900 border-l">
                  {{ formatCurrency(totals.paymentsPrincipal) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.paymentsInterest) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.paymentsFees) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.paymentsPenalty) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.paymentsTotal) }}
                </td>
              </tr>
              
              <tr v-if="showNetDue" class="bg-yellow-100 font-bold">
                <td class="px-4 py-2 pl-8 text-sm text-gray-900">Net Due:</td>
                <td></td>
                <td></td>
                <td class="px-4 py-2 text-sm text-right text-gray-900 border-l">
                  {{ formatCurrency(totals.netDuePrincipal) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.netDueInterest) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.netDueFees) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.netDuePenalty) }}
                </td>
                <td class="px-4 py-2 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.netDueTotal) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 text-sm text-gray-600">
          <p>** Principal At Risk is the Principal Released amount after deducting Principal Payments for the date range selected above</p>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500">No data available. Please select filters and generate the report.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface BorrowerReportData {
  id: string;
  name: string;
  businessName: string;
  numLoans: number;
  principalReleased: number;
  duePrincipal: number;
  dueInterest: number;
  dueFees: number;
  duePenalty: number;
  dueTotal: number;
  paymentsCount: number;
  paymentsPrincipal: number;
  paymentsInterest: number;
  paymentsFees: number;
  paymentsPenalty: number;
  paymentsTotal: number;
  netDuePrincipal: number;
  netDueInterest: number;
  netDueFees: number;
  netDuePenalty: number;
  netDueTotal: number;
}

const selectedReportType = ref('borrowers');
const showDueLoans = ref(true);
const showPayments = ref(true);
const showNetDue = ref(true);

const currentDate = new Date();
const fiveYearsAgo = new Date();
fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

const dateFrom = ref(fiveYearsAgo.toISOString().split('T')[0]);
const dateTo = ref(currentDate.toISOString().split('T')[0]);
const searchQuery = ref('');

const reportData = ref<BorrowerReportData[]>([
  {
    id: '1',
    name: 'Josepj Ulomi',
    businessName: 'ADUINOLA',
    numLoans: 1,
    principalReleased: 1000000,
    duePrincipal: 0,
    dueInterest: 0,
    dueFees: 0,
    duePenalty: 0,
    dueTotal: 0,
    paymentsCount: 0,
    paymentsPrincipal: 0,
    paymentsInterest: 0,
    paymentsFees: 0,
    paymentsPenalty: 0,
    paymentsTotal: 0,
    netDuePrincipal: 0,
    netDueInterest: 0,
    netDueFees: 0,
    netDuePenalty: 0,
    netDueTotal: 0,
  }
]);

const totals = computed(() => {
  return reportData.value.reduce((acc, borrower) => {
    return {
      numLoans: acc.numLoans + borrower.numLoans,
      principalReleased: acc.principalReleased + borrower.principalReleased,
      duePrincipal: acc.duePrincipal + borrower.duePrincipal,
      dueInterest: acc.dueInterest + borrower.dueInterest,
      dueFees: acc.dueFees + borrower.dueFees,
      duePenalty: acc.duePenalty + borrower.duePenalty,
      dueTotal: acc.dueTotal + borrower.dueTotal,
      paymentsCount: acc.paymentsCount + borrower.paymentsCount,
      paymentsPrincipal: acc.paymentsPrincipal + borrower.paymentsPrincipal,
      paymentsInterest: acc.paymentsInterest + borrower.paymentsInterest,
      paymentsFees: acc.paymentsFees + borrower.paymentsFees,
      paymentsPenalty: acc.paymentsPenalty + borrower.paymentsPenalty,
      paymentsTotal: acc.paymentsTotal + borrower.paymentsTotal,
      netDuePrincipal: acc.netDuePrincipal + borrower.netDuePrincipal,
      netDueInterest: acc.netDueInterest + borrower.netDueInterest,
      netDueFees: acc.netDueFees + borrower.netDueFees,
      netDuePenalty: acc.netDuePenalty + borrower.netDuePenalty,
      netDueTotal: acc.netDueTotal + borrower.netDueTotal,
    };
  }, {
    numLoans: 0,
    principalReleased: 0,
    duePrincipal: 0,
    dueInterest: 0,
    dueFees: 0,
    duePenalty: 0,
    dueTotal: 0,
    paymentsCount: 0,
    paymentsPrincipal: 0,
    paymentsInterest: 0,
    paymentsFees: 0,
    paymentsPenalty: 0,
    paymentsTotal: 0,
    netDuePrincipal: 0,
    netDueInterest: 0,
    netDueFees: 0,
    netDuePenalty: 0,
    netDueTotal: 0,
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

const generateReport = async () => {
  console.log('Generating report with filters:', {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    searchQuery: searchQuery.value,
    showDueLoans: showDueLoans.value,
    showPayments: showPayments.value,
    showNetDue: showNetDue.value,
  });
};

const exportReport = () => {
  console.log('Exporting report to Excel...');
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