<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Daily Report</h1>
      <p class="text-sm text-gray-600 mt-2">
        You can use this page to view daily report for the current branch.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input 
              type="date" 
              v-model="selectedDate"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Table Headings Style:</label>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input 
                  type="radio" 
                  v-model="tableStyle" 
                  value="vertical"
                  class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                >
                <span class="ml-2 text-sm text-gray-700">Vertical</span>
              </label>
              <label class="flex items-center">
                <input 
                  type="radio" 
                  v-model="tableStyle" 
                  value="horizontal"
                  class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                >
                <span class="ml-2 text-sm text-gray-700">Horizontal</span>
              </label>
            </div>
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

    <!-- Daily Report Results -->
    <div v-if="reportGenerated" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <!-- Vertical Layout (Default) -->
        <div v-if="tableStyle === 'vertical'" class="space-y-6">
          <!-- Branch Information -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Branch Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">Branch</span>
                <span class="text-sm text-gray-900">{{ dailyData.branch }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">Opening cash balance</span>
                <span class="text-sm text-gray-900" :class="getAmountClass(dailyData.openingCashBalance)">
                  {{ formatCurrency(dailyData.openingCashBalance) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Due Loans Information -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Due Loans on {{ formatDate(selectedDate) }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">Number of Due Loans</span>
                <span class="text-sm text-gray-900">{{ dailyData.numberOfDueLoans }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">Borrowers Due</span>
                <span class="text-sm text-gray-900">{{ dailyData.borrowersDue }}</span>
              </div>
            </div>
          </div>

          <!-- Expected Collections -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Expected Collection on {{ formatDate(selectedDate) }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="item in expectedCollections" :key="item.key" 
                   class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">{{ item.label }}</span>
                <span class="text-sm text-gray-900">{{ formatCurrency(item.value) }}</span>
              </div>
            </div>
          </div>

          <!-- Actual Collections for Due Loans -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Actual Collections on {{ formatDate(selectedDate) }} for loans due on {{ formatDate(selectedDate) }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="item in actualCollectionsDue" :key="item.key" 
                   class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">{{ item.label }}</span>
                <span class="text-sm text-gray-900">{{ formatCurrency(item.value) }}</span>
              </div>
            </div>
          </div>

          <!-- Actual Collections for All Loans -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Actual Collections for all loans on {{ formatDate(selectedDate) }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="item in actualCollectionsAll" :key="item.key" 
                   class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">{{ item.label }}</span>
                <span class="text-sm text-gray-900">{{ formatCurrency(item.value) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Statistics -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Statistics</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="item in paymentStatistics" :key="item.key" 
                   class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">{{ item.label }}</span>
                <span class="text-sm text-gray-900">{{ item.value }}</span>
              </div>
            </div>
          </div>

          <!-- Loan Operations -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Loan Operations on {{ formatDate(selectedDate) }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="item in loanOperations" :key="item.key" 
                   class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">{{ item.label }}</span>
                <span class="text-sm text-gray-900">
                  {{ item.isCurrency ? formatCurrency(item.value) : item.value }}
                </span>
              </div>
            </div>
          </div>

          <!-- Loan Status Summary -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Loan Status Summary on {{ formatDate(selectedDate) }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="item in loanStatusSummary" :key="item.key" 
                   class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">{{ item.label }}</span>
                <span class="text-sm text-gray-900">{{ item.value }}</span>
              </div>
            </div>
          </div>

          <!-- Closing Balance -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Closing Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">Closing Cash Balance</span>
                <span class="text-sm text-gray-900" :class="getAmountClass(dailyData.closingCashBalance)">
                  {{ formatCurrency(dailyData.closingCashBalance) }}
                </span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">Next Day Expected Collection</span>
                <span class="text-sm text-gray-900">{{ formatCurrency(dailyData.nextDayExpectedCollection) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Horizontal Layout -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in horizontalTableData" :key="item.key" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  {{ item.label }}
                </td>
                <td class="px-6 py-4 text-sm text-right text-gray-900" :class="item.isAmount ? getAmountClass(item.value) : ''">
                  {{ item.isCurrency ? formatCurrency(item.value) : item.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500">Please select a date and generate the daily report.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface DailyReportData {
  branch: string;
  openingCashBalance: number;
  numberOfDueLoans: number;
  borrowersDue: number;
  closingCashBalance: number;
  nextDayExpectedCollection: number;
  unpaidLoanDueAmount: number;
  totalNumberOfCollections: number;
  numberOfOpenLoansGiven: number;
  loanAmountDisbursed: number;
  pendingDueAmount: number;
}

const currentDate = new Date();
const selectedDate = ref(currentDate.toISOString().split('T')[0]);
const tableStyle = ref('vertical');
const reportGenerated = ref(true); // Show data by default based on your example

const dailyData = ref<DailyReportData>({
  branch: 'Branch #1',
  openingCashBalance: -1000000,
  numberOfDueLoans: 0,
  borrowersDue: 0,
  closingCashBalance: -1000000,
  nextDayExpectedCollection: 0,
  unpaidLoanDueAmount: 0,
  totalNumberOfCollections: 0,
  numberOfOpenLoansGiven: 0,
  loanAmountDisbursed: 0,
  pendingDueAmount: 0
});

const expectedCollections = ref([
  { key: 'expectedPrincipal', label: 'Expected Principal Collection', value: 0 },
  { key: 'expectedInterest', label: 'Expected Interest Collection', value: 0 },
  { key: 'expectedFees', label: 'Expected Fees Collection', value: 0 },
  { key: 'expectedPenalty', label: 'Expected Penalty Collection', value: 0 },
  { key: 'expectedWithoutNonDeductable', label: 'Expected Collection without Non-Deductable Fees', value: 0 },
  { key: 'expectedWithoutDeductable', label: 'Expected Collection without Deductable Fees', value: 0 },
  { key: 'expectedWithoutTotalFees', label: 'Expected Collection without Total Fees', value: 0 },
  { key: 'totalExpectedCollection', label: 'Total Expected Collection incl. Deductable and Non-Deductable Fees', value: 0 }
]);

const actualCollectionsDue = ref([
  { key: 'actualPrincipalDue', label: 'Actual Principal Collections for loans due', value: 0 },
  { key: 'actualInterestDue', label: 'Actual Interest Collections for loans due', value: 0 },
  { key: 'actualFeesDue', label: 'Actual Fees Collections for loans due', value: 0 },
  { key: 'actualPenaltyDue', label: 'Actual Penalty Collections for loans due', value: 0 },
  { key: 'actualWithoutNonDeductableDue', label: 'Actual Collections for loans due without Non-Deductable Fees', value: 0 },
  { key: 'actualWithoutDeductableDue', label: 'Actual Collections for loans due without Deductable Fees', value: 0 },
  { key: 'actualWithoutTotalFeesDue', label: 'Actual Principal Collections for loans due without Total Fees', value: 0 },
  { key: 'totalActualCollectionDue', label: 'Actual Collections for loans due incl. Deductable and Non-Deductable Fees', value: 0 }
]);

const actualCollectionsAll = ref([
  { key: 'actualPrincipalAll', label: 'Actual Principal Collections for all loans', value: 0 },
  { key: 'actualInterestAll', label: 'Actual Interest Collections for all loans', value: 0 },
  { key: 'actualFeesAll', label: 'Actual Fees Collections for all loans', value: 0 },
  { key: 'actualPenaltyAll', label: 'Actual Penalty Collections for all loans', value: 0 },
  { key: 'actualWithoutNonDeductableAll', label: 'Actual Collections for all loans without Non-Deductable Fees', value: 0 },
  { key: 'actualWithoutDeductableAll', label: 'Actual Collections for all loans without Deductable Fees', value: 0 },
  { key: 'actualWithoutTotalFeesAll', label: 'Actual Principal Collections for all loans without Total Fees', value: 0 },
  { key: 'totalActualCollectionAll', label: 'Actual Collections for all loans incl. Deductable and Non-Deductable Fees', value: 0 }
]);

const paymentStatistics = ref([
  { key: 'totalCollections', label: 'Total Number of Collections', value: 0 },
  { key: 'borrowersWhoPaid', label: 'Number of Borrowers with due loans who paid', value: 0 },
  { key: 'borrowersWhoDidNotPay', label: 'Number of Borrowers with due loans who did not pay', value: 0 },
  { key: 'borrowersPaidAllLoans', label: 'Number of Borrowers Paid for all loans', value: 0 },
  { key: 'unpaidLoanDue', label: 'Unpaid Loan Due Amount', value: 0 }
]);

const loanOperations = ref([
  { key: 'openLoans', label: 'Number of Open Loans given', value: 0, isCurrency: false },
  { key: 'loanAmountDisbursed', label: 'Loan Amount Disbursed', value: 0, isCurrency: true },
  { key: 'pendingDue', label: 'Pending Due for Loans Due until + Balance for Past Maturity Loans', value: 0, isCurrency: true }
]);

const loanStatusSummary = ref([
  { key: 'processingLoans', label: 'Number of Processing Loans', value: 0 },
  { key: 'fullyPaidLoans', label: 'Number of Fully Paid Loans', value: 0 },
  { key: 'defaultLoans', label: 'Number of Default Loans', value: 0 },
  { key: 'restructuredLoans', label: 'Number of Restructured Loans', value: 0 },
  { key: 'notTakenUpLoans', label: 'Number of Not Taken Up Loans', value: 0 },
  { key: 'deniedLoans', label: 'Number of Denied Loans set', value: 0 }
]);

const horizontalTableData = computed(() => {
  const allData: any[] = [
    { key: 'branch', label: 'Branch', value: dailyData.value.branch, isCurrency: false, isAmount: false },
    { key: 'openingCash', label: 'Opening cash balance', value: dailyData.value.openingCashBalance, isCurrency: true, isAmount: true },
    { key: 'numberOfDue', label: `Number of Due Loans on ${formatDate(selectedDate.value)}`, value: dailyData.value.numberOfDueLoans, isCurrency: false, isAmount: false },
  ];

  // Add expected collections
  expectedCollections.value.forEach(item => {
    allData.push({
      key: item.key,
      label: item.label,
      value: item.value,
      isCurrency: true,
      isAmount: false
    });
  });

  // Add actual collections due
  actualCollectionsDue.value.forEach(item => {
    allData.push({
      key: item.key,
      label: item.label,
      value: item.value,
      isCurrency: true,
      isAmount: false
    });
  });

  // Add unpaid loan due amount
  allData.push({
    key: 'unpaidLoanDue',
    label: `Unpaid Loan Due Amount on ${formatDate(selectedDate.value)}`,
    value: dailyData.value.unpaidLoanDueAmount,
    isCurrency: true,
    isAmount: false
  });

  // Add actual collections all
  actualCollectionsAll.value.forEach(item => {
    allData.push({
      key: item.key,
      label: item.label,
      value: item.value,
      isCurrency: true,
      isAmount: false
    });
  });

  // Add remaining metrics
  paymentStatistics.value.forEach(item => {
    allData.push({
      key: item.key,
      label: `${item.label} on ${formatDate(selectedDate.value)}`,
      value: item.value,
      isCurrency: false,
      isAmount: false
    });
  });

  loanOperations.value.forEach(item => {
    allData.push({
      key: item.key,
      label: `${item.label} on ${formatDate(selectedDate.value)}`,
      value: item.value,
      isCurrency: item.isCurrency,
      isAmount: item.isCurrency
    });
  });

  loanStatusSummary.value.forEach(item => {
    allData.push({
      key: item.key,
      label: `${item.label} on ${formatDate(selectedDate.value)}`,
      value: item.value,
      isCurrency: false,
      isAmount: false
    });
  });

  // Add closing information
  allData.push(
    {
      key: 'closingCash',
      label: `Closing Cash Balance on ${formatDate(selectedDate.value)}`,
      value: dailyData.value.closingCashBalance,
      isCurrency: true,
      isAmount: true
    },
    {
      key: 'nextDayExpected',
      label: 'Next Day Expected Collection',
      value: dailyData.value.nextDayExpectedCollection,
      isCurrency: true,
      isAmount: false
    }
  );

  return allData;
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

const getAmountClass = (amount: number) => {
  return amount < 0 ? 'text-red-600 font-medium' : 'text-gray-900';
};

const generateReport = () => {
  console.log('Generating daily report for:', {
    selectedDate: selectedDate.value,
    tableStyle: tableStyle.value,
  });
  reportGenerated.value = true;
  
  // Here you would typically fetch daily report data from your API
  // For now, all amounts remain as specified in your example
};

const exportReport = () => {
  console.log('Exporting daily report to Excel...');
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