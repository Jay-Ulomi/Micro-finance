<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Loan Arrears Aging Report</h1>
      <p class="text-sm text-gray-600 mt-2">
        The Loan Arrears Aging Report shows the days in arrears of the overdue amount until today. This is calculated from the loan schedule for loans that are Missed Repayment, Arrears, or Past Maturity. We look at the last loan schedule date where the balance was 0 and then calculate the number of days between that schedule date and today.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
        <h3 class="text-lg font-semibold text-gray-900">Filter Loans</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Show Loans Overdue until the following date:
            </label>
            <input 
              type="date" 
              v-model="overdueUntilDate"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Optional: Show Loans Overdue between the following days:
            </label>
            <div class="flex items-center space-x-2">
              <div>
                <label class="text-xs text-gray-500">Overdue From Days</label>
                <input 
                  type="number" 
                  v-model="overdueDaysFrom"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>
              <span class="text-gray-500">to</span>
              <div>
                <label class="text-xs text-gray-500">Overdue To Days</label>
                <input 
                  type="number" 
                  v-model="overdueDaysTo"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Optional: Select Loan Products and/or Loan officers:
          </label>
          
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-600">Loan Products</label>
              <div class="mt-2 flex flex-wrap gap-3">
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

            <div>
              <label class="text-sm font-medium text-gray-600">Loan Officers</label>
              <div class="mt-2 flex flex-wrap gap-3">
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
          </div>

          <div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p class="text-sm text-yellow-800">
              <strong>Please make sure</strong> the above selected loan products or loan officers are located in the below selected branches otherwise you will get no results
            </p>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            @click="generateReport"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>

    <!-- Report Results -->
    <div v-if="reportGenerated" class="mt-6 space-y-8">
      <!-- Aging Category Component -->
      <div 
        v-for="category in agingCategories" 
        :key="category.key"
        class="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ category.title }}
          </h3>

          <!-- Data Table Controls -->
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-700">Search loans</label>
                <input 
                  type="text" 
                  v-model="category.searchQuery"
                  placeholder="Search..."
                  class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <label class="text-sm text-gray-700">Show</label>
              <select 
                v-model="category.entriesPerPage"
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
                    Released Date
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Officer
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Product
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrower
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan#
                  </th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days in arrears
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overdue Principal
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overdue Interest
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overdue Fees
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overdue Penalty
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overdue Balance
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Principal Outstanding
                  </th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Payment
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Paid
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="category.data.length === 0">
                  <td colspan="15" class="px-4 py-8 text-center text-gray-500">
                    No data found. No loans found.
                  </td>
                </tr>
                <tr v-else v-for="loan in paginatedData(category)" :key="loan.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ formatDate(loan.releasedDate) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ loan.loanOfficer }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ loan.loanProduct }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ loan.borrower }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ loan.loanNumber }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900">
                    {{ loan.daysInArrears }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(loan.overduePrincipal) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(loan.overdueInterest) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(loan.overdueFees) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(loan.overduePenalty) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(loan.overdueBalance) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(loan.totalPrincipalOutstanding) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900">
                    {{ loan.lastPayment ? formatDate(loan.lastPayment) : '-' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(loan.totalPaid) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    <span :class="getStatusClass(loan.status)">
                      {{ loan.status }}
                    </span>
                  </td>
                </tr>
                <!-- Totals Row -->
                <tr v-if="category.data.length > 0" class="bg-gray-100 font-bold">
                  <td colspan="6" class="px-4 py-3 text-sm text-gray-900"></td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(category.totals.overduePrincipal) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(category.totals.overdueInterest) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(category.totals.overdueFees) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(category.totals.overduePenalty) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(category.totals.overdueBalance) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(category.totals.totalPrincipalOutstanding) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900"></td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(category.totals.totalPaid) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4">
            <div class="text-sm text-gray-700">
              Showing {{ getShowingText(category) }}
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="category.currentPage > 1 && (category.currentPage--)"
                :disabled="category.currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                @click="category.currentPage < getTotalPages(category) && (category.currentPage++)"
                :disabled="category.currentPage === getTotalPages(category) || getTotalPages(category) === 0"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface LoanArrearsData {
  id: string;
  releasedDate: string;
  loanOfficer: string;
  loanProduct: string;
  borrower: string;
  loanNumber: string;
  daysInArrears: number;
  overduePrincipal: number;
  overdueInterest: number;
  overdueFees: number;
  overduePenalty: number;
  overdueBalance: number;
  totalPrincipalOutstanding: number;
  lastPayment: string | null;
  totalPaid: number;
  status: string;
}

interface AgingCategory {
  key: string;
  title: string;
  data: LoanArrearsData[];
  searchQuery: string;
  entriesPerPage: number;
  currentPage: number;
  totals: {
    overduePrincipal: number;
    overdueInterest: number;
    overdueFees: number;
    overduePenalty: number;
    overdueBalance: number;
    totalPrincipalOutstanding: number;
    totalPaid: number;
  };
}

const currentDate = new Date();
const overdueUntilDate = ref(currentDate.toISOString().split('T')[0]);
const overdueDaysFrom = ref<number | null>(null);
const overdueDaysTo = ref<number | null>(null);

const selectedLoanProducts = ref<string[]>([]);
const selectedLoanOfficers = ref<string[]>([]);

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

const reportGenerated = ref(false);

const agingCategories = ref<AgingCategory[]>([
  {
    key: '1-30',
    title: 'Loans that are overdue between 1 and 30 days',
    data: [],
    searchQuery: '',
    entriesPerPage: 20,
    currentPage: 1,
    totals: {
      overduePrincipal: 0,
      overdueInterest: 0,
      overdueFees: 0,
      overduePenalty: 0,
      overdueBalance: 0,
      totalPrincipalOutstanding: 0,
      totalPaid: 0
    }
  },
  {
    key: '31-60',
    title: 'Loans that are overdue between 31 and 60 days',
    data: [],
    searchQuery: '',
    entriesPerPage: 20,
    currentPage: 1,
    totals: {
      overduePrincipal: 0,
      overdueInterest: 0,
      overdueFees: 0,
      overduePenalty: 0,
      overdueBalance: 0,
      totalPrincipalOutstanding: 0,
      totalPaid: 0
    }
  },
  {
    key: '61-90',
    title: 'Loans that are overdue between 61 and 90 days',
    data: [],
    searchQuery: '',
    entriesPerPage: 20,
    currentPage: 1,
    totals: {
      overduePrincipal: 0,
      overdueInterest: 0,
      overdueFees: 0,
      overduePenalty: 0,
      overdueBalance: 0,
      totalPrincipalOutstanding: 0,
      totalPaid: 0
    }
  },
  {
    key: '91-180',
    title: 'Loans that are overdue between 91 and 180 days',
    data: [],
    searchQuery: '',
    entriesPerPage: 20,
    currentPage: 1,
    totals: {
      overduePrincipal: 0,
      overdueInterest: 0,
      overdueFees: 0,
      overduePenalty: 0,
      overdueBalance: 0,
      totalPrincipalOutstanding: 0,
      totalPaid: 0
    }
  },
  {
    key: '180+',
    title: 'Loans that are overdue more than 180 days',
    data: [],
    searchQuery: '',
    entriesPerPage: 20,
    currentPage: 1,
    totals: {
      overduePrincipal: 0,
      overdueInterest: 0,
      overdueFees: 0,
      overduePenalty: 0,
      overdueBalance: 0,
      totalPrincipalOutstanding: 0,
      totalPaid: 0
    }
  }
]);

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

const getStatusClass = (status: string) => {
  const statusClasses = {
    'Active': 'text-green-600',
    'Arrears': 'text-red-600',
    'Past Maturity': 'text-orange-600',
    'Missed Repayment': 'text-yellow-600'
  };
  return statusClasses[status as keyof typeof statusClasses] || 'text-gray-600';
};

const paginatedData = (category: AgingCategory) => {
  const filteredData = category.data.filter(loan => {
    if (!category.searchQuery) return true;
    const searchLower = category.searchQuery.toLowerCase();
    return loan.borrower.toLowerCase().includes(searchLower) ||
           loan.loanNumber.toLowerCase().includes(searchLower) ||
           loan.loanOfficer.toLowerCase().includes(searchLower) ||
           loan.loanProduct.toLowerCase().includes(searchLower);
  });

  const startIndex = (category.currentPage - 1) * category.entriesPerPage;
  const endIndex = startIndex + category.entriesPerPage;
  return filteredData.slice(startIndex, endIndex);
};

const getTotalPages = (category: AgingCategory) => {
  const filteredCount = category.data.filter(loan => {
    if (!category.searchQuery) return true;
    const searchLower = category.searchQuery.toLowerCase();
    return loan.borrower.toLowerCase().includes(searchLower) ||
           loan.loanNumber.toLowerCase().includes(searchLower) ||
           loan.loanOfficer.toLowerCase().includes(searchLower) ||
           loan.loanProduct.toLowerCase().includes(searchLower);
  }).length;
  
  return Math.ceil(filteredCount / category.entriesPerPage);
};

const getShowingText = (category: AgingCategory) => {
  const filteredData = category.data.filter(loan => {
    if (!category.searchQuery) return true;
    const searchLower = category.searchQuery.toLowerCase();
    return loan.borrower.toLowerCase().includes(searchLower) ||
           loan.loanNumber.toLowerCase().includes(searchLower) ||
           loan.loanOfficer.toLowerCase().includes(searchLower) ||
           loan.loanProduct.toLowerCase().includes(searchLower);
  });

  if (filteredData.length === 0) {
    return '0 to 0 of 0 entries';
  }

  const startIndex = (category.currentPage - 1) * category.entriesPerPage;
  const endIndex = Math.min(startIndex + category.entriesPerPage, filteredData.length);
  const start = startIndex + 1;
  
  return `${start} to ${endIndex} of ${filteredData.length} entries`;
};

const generateReport = async () => {
  console.log('Generating loan arrears aging report with filters:', {
    overdueUntilDate: overdueUntilDate.value,
    overdueDaysFrom: overdueDaysFrom.value,
    overdueDaysTo: overdueDaysTo.value,
    selectedLoanProducts: selectedLoanProducts.value,
    selectedLoanOfficers: selectedLoanOfficers.value,
  });

  // Reset categories data
  agingCategories.value.forEach(category => {
    category.data = [];
    category.currentPage = 1;
    category.searchQuery = '';
  });

  reportGenerated.value = true;

  // Here you would typically fetch data from your API
  // For now, we'll show empty results as per your specification
};
</script>

<style scoped>
@media print {
  .no-print {
    display: none;
  }
}
</style>