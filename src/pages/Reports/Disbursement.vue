<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Disbursement Report</h1>
      <p class="text-sm text-gray-600 mt-2">
        The Disbursement Report shows the money that has been released to borrowers.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
        <!-- Date Range and Basic Filters -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div class="space-y-2">
              <div>
                <label class="text-xs text-gray-500">From Date</label>
                <input 
                  type="date" 
                  v-model="dateFrom"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Borrower Name or Business Name</label>
            <input 
              type="text" 
              v-model="borrowerName"
              placeholder="Search borrower..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Loan#</label>
            <input 
              type="text" 
              v-model="loanNumber"
              placeholder="Enter loan number..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>
        </div>

        <!-- Loan Products -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Loan Products</label>
          <div class="flex flex-wrap gap-3">
            <label v-for="product in loanProducts" :key="product.id" class="flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedLoanProducts" 
                :value="product.id"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              >
              <span class="ml-2 text-sm text-gray-700">{{ product.name }}</span>
            </label>
          </div>
        </div>

        <!-- Loan Officers -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Loan Officers</label>
          <div class="flex flex-wrap gap-3">
            <label v-for="officer in loanOfficers" :key="officer.id" class="flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedLoanOfficers" 
                :value="officer.id"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              >
              <span class="ml-2 text-sm text-gray-700">{{ officer.name }}</span>
            </label>
          </div>
        </div>

        <!-- Loan Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Loan Status</label>
          <div class="flex flex-wrap gap-2">
            <span v-for="status in loanStatuses" :key="status.key" 
                  :class="getStatusBadgeClass(status.key)"
                  class="px-2 py-1 text-xs rounded-full cursor-pointer border-2"
                  @click="toggleStatus(status.key)">
              {{ status.name }}
            </span>
          </div>
        </div>

        <!-- Payment Methods -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Payment Methods</label>
          <div class="flex flex-wrap gap-3">
            <label v-for="method in paymentMethods" :key="method.id" class="flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedPaymentMethods" 
                :value="method.id"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              >
              <span class="ml-2 text-sm text-gray-700">{{ method.name }}</span>
            </label>
          </div>
        </div>

        <!-- Repayment Frequency -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Repayment Frequency</label>
          <div class="flex flex-wrap gap-3">
            <label v-for="frequency in repaymentFrequencies" :key="frequency.id" class="flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedRepaymentFrequencies" 
                :value="frequency.id"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              >
              <span class="ml-2 text-sm text-gray-700">{{ frequency.name }}</span>
            </label>
          </div>
        </div>

        <!-- Additional Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Additional Options</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="selectEarlySettlement"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                >
                <span class="ml-2 text-sm text-gray-700">Select Early Settlement</span>
              </label>
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="showOriginalRestructuredOnly"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                >
                <span class="ml-2 text-sm text-gray-700">If a loan has been restructured, show the original restructured loan only</span>
              </label>
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="excludeUnreleasedLoans"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                >
                <span class="ml-2 text-sm text-gray-700">Do not include loans that have not been released</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Bank Accounts:</label>
            <select v-model="selectedBankAccount" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Select Bank Account</option>
              <option value="cash">Cash</option>
              <option value="bank1">Main Bank Account</option>
              <option value="bank2">Secondary Bank Account</option>
            </select>
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

    <!-- Report Results -->
    <div v-if="reportGenerated" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <!-- Search and Pagination Controls -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <label class="text-sm text-gray-700">Search loans</label>
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Search..."
                class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700">Show</label>
            <select 
              v-model="entriesPerPage"
              class="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <label class="text-sm text-gray-700">entries</label>
          </div>
        </div>

        <!-- Data Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disbursed Date
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Product
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan#
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest Rate
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disbursed
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Account (Released)
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Totals Row -->
              <tr class="bg-gray-100 font-bold">
                <td colspan="7" class="px-4 py-3 text-sm text-gray-900"></td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.disbursed) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.outstanding) }}
                </td>
                <td colspan="2" class="px-4 py-3 text-sm text-gray-900"></td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="loan in paginatedData" :key="loan.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-center">
                  <button class="text-primary-600 hover:text-primary-700 text-xs underline">
                    View
                  </button>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ formatDate(loan.disbursedDate) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ loan.borrowerName }} - {{ loan.businessName }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ loan.loanProduct }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ loan.loanNumber }}
                </td>
                <td class="px-4 py-3 text-sm text-center text-gray-900">
                  {{ loan.interestRate }}
                </td>
                <td class="px-4 py-3 text-sm text-center text-gray-900">
                  {{ loan.duration }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(loan.disbursed) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900">
                  {{ formatCurrency(loan.outstanding) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  <span :class="getStatusDisplayClass(loan.status)">
                    {{ loan.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ loan.bankAccount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Info -->
        <div class="mt-4 text-sm text-gray-700">
          Showing {{ getShowingText() }}
        </div>
      </div>
    </div>

    <div v-else class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500">No data available. Please apply filters and generate the report.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface DisbursementData {
  id: string;
  disbursedDate: string;
  borrowerName: string;
  businessName: string;
  loanProduct: string;
  loanNumber: string;
  interestRate: string;
  duration: string;
  disbursed: number;
  outstanding: number;
  status: string;
  bankAccount: string;
}

const currentDate = new Date();
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

const dateFrom = ref(firstDayOfMonth.toISOString().split('T')[0]);
const dateTo = ref(currentDate.toISOString().split('T')[0]);
const borrowerName = ref('');
const loanNumber = ref('');

const selectedLoanProducts = ref<string[]>([]);
const selectedLoanOfficers = ref<string[]>([]);
const selectedStatuses = ref<string[]>([]);
const selectedPaymentMethods = ref<string[]>([]);
const selectedRepaymentFrequencies = ref<string[]>([]);
const selectedBankAccount = ref('');

const selectEarlySettlement = ref(false);
const showOriginalRestructuredOnly = ref(false);
const excludeUnreleasedLoans = ref(false);

const searchQuery = ref('');
const entriesPerPage = ref(20);
const currentPage = ref(1);

const reportGenerated = ref(true); // Show data by default based on your example

const loanProducts = ref([
  { id: 'business-loan', name: 'Business Loan' },
  { id: 'overseas-worker-loan', name: 'Overseas Worker Loan' },
  { id: 'pensioner-loan', name: 'Pensioner Loan' },
  { id: 'personal-loan', name: 'Personal Loan' },
  { id: 'student-loan', name: 'Student Loan' }
]);

const loanOfficers = ref([
  { id: 'edwin-simon', name: 'edwin simon' },
  { id: 'joseph-ulomi', name: 'Joseph Ulomi' }
]);

const loanStatuses = ref([
  { key: 'processing', name: 'Processing' },
  { key: 'open', name: 'Open' },
  { key: 'current', name: 'Current' },
  { key: 'due-today', name: 'Due Today' },
  { key: 'missed', name: 'Missed Repayment' },
  { key: 'arrears', name: 'Arrears' },
  { key: 'past-maturity', name: 'Past Maturity' },
  { key: 'restructured', name: 'Restructured' },
  { key: 'fully-paid', name: 'Fully Paid' },
  { key: 'defaulted', name: 'Defaulted' },
  { key: 'credit-counseling', name: 'Credit Counseling' },
  { key: 'collection-agency', name: 'Collection Agency' },
  { key: 'sequestrate', name: 'Sequestrate' },
  { key: 'debt-review', name: 'Debt Review' },
  { key: 'fraud', name: 'Fraud' },
  { key: 'investigation', name: 'Investigation' },
  { key: 'legal', name: 'Legal' },
  { key: 'write-off', name: 'Write-Off' },
  { key: 'denied', name: 'Denied' },
  { key: 'not-taken-up', name: 'Not Taken Up' }
]);

const paymentMethods = ref([
  { id: 'cash', name: 'Cash' },
  { id: 'cheque', name: 'Cheque' },
  { id: 'wire-transfer', name: 'Wire Transfer' },
  { id: 'online-transfer', name: 'Online Transfer' }
]);

const repaymentFrequencies = ref([
  { id: 'daily', name: 'Daily' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'biweekly', name: 'Biweekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'bimonthly', name: 'Bimonthly' },
  { id: 'quarterly', name: 'Quarterly' },
  { id: 'every-4-months', name: 'Every 4 Months' },
  { id: 'semi-annual', name: 'Semi-Annual' },
  { id: 'every-9-months', name: 'Every 9 Months' },
  { id: 'yearly', name: 'Yearly' },
  { id: 'lump-sum', name: 'Lump-Sum' }
]);

const disbursementData = ref<DisbursementData[]>([
  {
    id: '1',
    disbursedDate: '2025-09-02',
    borrowerName: 'Josepj Ulomi',
    businessName: 'ADUINOLA',
    loanProduct: 'Personal Loan',
    loanNumber: '',
    interestRate: '5%/Loan',
    duration: '6 Months',
    disbursed: 1000000,
    outstanding: 1050000,
    status: 'Current',
    bankAccount: 'Cash'
  }
]);

const totals = computed(() => {
  return disbursementData.value.reduce((acc, loan) => {
    return {
      disbursed: acc.disbursed + loan.disbursed,
      outstanding: acc.outstanding + loan.outstanding
    };
  }, {
    disbursed: 0,
    outstanding: 0
  });
});

const filteredData = computed(() => {
  return disbursementData.value.filter(loan => {
    if (searchQuery.value) {
      const searchLower = searchQuery.value.toLowerCase();
      return loan.borrowerName.toLowerCase().includes(searchLower) ||
             loan.businessName.toLowerCase().includes(searchLower) ||
             loan.loanProduct.toLowerCase().includes(searchLower) ||
             loan.loanNumber.toLowerCase().includes(searchLower);
    }
    return true;
  });
});

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * entriesPerPage.value;
  const endIndex = startIndex + entriesPerPage.value;
  return filteredData.value.slice(startIndex, endIndex);
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

const getStatusBadgeClass = (statusKey: string) => {
  const isSelected = selectedStatuses.value.includes(statusKey);
  const baseClasses = 'border-2 transition-all duration-200 hover:shadow-md';
  
  if (isSelected) {
    return `${baseClasses} bg-primary-100 text-primary-800 border-primary-300`;
  }

  const statusClasses = {
    'processing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'open': 'bg-green-100 text-green-800 border-green-200',
    'current': 'bg-blue-100 text-blue-800 border-blue-200',
    'due-today': 'bg-orange-100 text-orange-800 border-orange-200',
    'missed': 'bg-red-100 text-red-800 border-red-200',
    'arrears': 'bg-red-100 text-red-800 border-red-200',
    'past-maturity': 'bg-red-100 text-red-800 border-red-200',
    'restructured': 'bg-purple-100 text-purple-800 border-purple-200',
    'fully-paid': 'bg-green-100 text-green-800 border-green-200',
    'defaulted': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  
  return `${baseClasses} ${statusClasses[statusKey as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800 border-gray-200'}`;
};

const getStatusDisplayClass = (status: string) => {
  const statusClasses = {
    'Current': 'text-blue-600 font-medium',
    'Open': 'text-green-600 font-medium',
    'Arrears': 'text-red-600 font-medium',
    'Past Maturity': 'text-orange-600 font-medium',
    'Fully Paid': 'text-green-600 font-medium',
    'Defaulted': 'text-gray-600 font-medium'
  };
  return statusClasses[status as keyof typeof statusClasses] || 'text-gray-600';
};

const toggleStatus = (statusKey: string) => {
  const index = selectedStatuses.value.indexOf(statusKey);
  if (index > -1) {
    selectedStatuses.value.splice(index, 1);
  } else {
    selectedStatuses.value.push(statusKey);
  }
};

const getShowingText = () => {
  if (filteredData.value.length === 0) {
    return '0 to 0 of 0 entries';
  }

  const startIndex = (currentPage.value - 1) * entriesPerPage.value;
  const endIndex = Math.min(startIndex + entriesPerPage.value, filteredData.value.length);
  const start = startIndex + 1;
  
  return `${start} to ${endIndex} of ${filteredData.value.length} entries`;
};

const generateReport = () => {
  console.log('Generating disbursement report with filters:', {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    borrowerName: borrowerName.value,
    loanNumber: loanNumber.value,
    selectedLoanProducts: selectedLoanProducts.value,
    selectedLoanOfficers: selectedLoanOfficers.value,
    selectedStatuses: selectedStatuses.value,
    selectedPaymentMethods: selectedPaymentMethods.value,
    selectedRepaymentFrequencies: selectedRepaymentFrequencies.value,
    selectedBankAccount: selectedBankAccount.value,
    selectEarlySettlement: selectEarlySettlement.value,
    showOriginalRestructuredOnly: showOriginalRestructuredOnly.value,
    excludeUnreleasedLoans: excludeUnreleasedLoans.value,
  });
  reportGenerated.value = true;
};

const exportReport = () => {
  console.log('Exporting disbursement report to Excel...');
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