<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">At a Glance Report</h1>
      <p class="text-sm text-gray-600 mt-2">
        You can use this page to see an overview of your branch.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
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

    <!-- At a Glance Report Results -->
    <div v-if="reportGenerated" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  No.
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Value
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Borrower Information -->
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">1</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  Number of Registered Borrowers as at {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.registeredBorrowers }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">2</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  Number of Active Borrowers as at {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.activeBorrowers }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">3</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  Principal Portfolio Disbursed (cumulative)
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.principalPortfolioDisbursed) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">4</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  No. of Fully Paid Loans from {{ formatDate(dateFrom) }} to {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.fullyPaidLoans }}
                </td>
              </tr>

              <!-- Open Loans Section -->
              <tr class="bg-blue-50 hover:bg-blue-100">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">5</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">Open Loans</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900"></td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">5a</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">
                  No. of Open Loans as at {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.openLoans.numberOfOpenLoans }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">5b</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">
                  No. of Open Loans Created from {{ formatDate(dateFrom) }} to {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.openLoans.numberOfOpenLoansCreated }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">5c</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">
                  Opening Balance as at {{ formatDate(dateFrom) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.openLoans.openingBalance) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">5d</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">
                  Closing Balance as at {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.openLoans.closingBalance) }}
                </td>
              </tr>

              <!-- Outstanding Balances -->
              <tr class="hover:bg-gray-50 bg-yellow-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">6</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  Total Outstanding Balance (All Loans) as at {{ formatDate(dateTo) }}***
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-bold">
                  {{ formatCurrency(reportData.totalOutstandingAllLoans) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50 bg-yellow-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">7</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  Total Outstanding Balance (Open Loans) as at {{ formatDate(dateTo) }}***
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-bold">
                  {{ formatCurrency(reportData.totalOutstandingOpenLoans) }}
                </td>
              </tr>

              <!-- Payments Section -->
              <tr class="bg-green-50 hover:bg-green-100">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">8</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                  Payments from {{ formatDate(dateFrom) }} to {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900"></td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">8a</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">Principal</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.payments.principal) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">8b</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">Interest</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.payments.interest) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">8c</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">Non-Deductable Fees</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.payments.nonDeductableFees) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">8c</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">Deductable Fees</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.payments.deductableFees) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">8d</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">Penalty</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.payments.penalty) }}
                </td>
              </tr>

              <!-- Recovery Rates -->
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">9</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  Recovery Rate (All Loans) as at {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.recoveryRateAllLoans }}%
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">10</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  Recovery Rate (Open Loans) as at {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.recoveryRateOpenLoans }}%
                </td>
              </tr>

              <!-- Portfolio at Risk Section -->
              <tr class="bg-red-50 hover:bg-red-100">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">11</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                  Portfolio at Risk as at {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900"></td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">11a</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">PAR 30</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.portfolioAtRisk.par30 }}%
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">11b</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">PAR 60</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.portfolioAtRisk.par60 }}%
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">11c</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">PAR 90</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.portfolioAtRisk.par90 }}%
                </td>
              </tr>

              <!-- Default Loans -->
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">12</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  No. of Default Loans from {{ formatDate(dateFrom) }} to {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.numberOfDefaultLoans }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">13</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  % of Default Loans from {{ formatDate(dateFrom) }} to {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ reportData.percentageOfDefaultLoans }}%
                </td>
              </tr>

              <!-- Default Loans Outstanding Section -->
              <tr class="bg-gray-50 hover:bg-gray-100">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">14</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                  Default Loans Outstanding as at {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900"></td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">14a</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">Principal</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.defaultLoansOutstanding.principal) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">14b</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">Interest</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.defaultLoansOutstanding.interest) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">14c</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">Fees</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.defaultLoansOutstanding.fees) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600 pl-8">14d</td>
                <td class="px-4 py-3 text-sm text-gray-900 pl-8">Penalty</td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.defaultLoansOutstanding.penalty) }}
                </td>
              </tr>

              <!-- Final Metrics -->
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">15</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  Amount of Past Due as at {{ formatDate(dateTo) }}
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.amountOfPastDue) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">16</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  Amount of Portfolio at Risk (PAR 90)
                </td>
                <td class="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {{ formatCurrency(reportData.amountOfPortfolioAtRiskPAR90) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Important Notes -->
        <div class="mt-6 space-y-4">
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p class="text-sm text-yellow-800">
              <strong>*** Important Note:</strong> The Total Outstanding Balance (All Loans) and Total Outstanding Balance (Open Loans) only counts penalties due until the To Date ({{ formatDate(dateTo) }}) selected above. This is because penalties after {{ formatDate(dateTo) }} are not outstanding as at {{ formatDate(dateTo) }} since they are only added if future amounts after {{ formatDate(dateTo) }} don't get paid on time.
            </p>
          </div>

          <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p class="text-sm text-blue-800">
              <strong>Definition:</strong> All Loans includes Open, Fully Paid, and Default loans.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500">Please select a date range and generate the at-a-glance report.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface AtGlanceReportData {
  registeredBorrowers: number;
  activeBorrowers: number;
  principalPortfolioDisbursed: number;
  fullyPaidLoans: number;
  openLoans: {
    numberOfOpenLoans: number;
    numberOfOpenLoansCreated: number;
    openingBalance: number;
    closingBalance: number;
  };
  totalOutstandingAllLoans: number;
  totalOutstandingOpenLoans: number;
  payments: {
    principal: number;
    interest: number;
    nonDeductableFees: number;
    deductableFees: number;
    penalty: number;
  };
  recoveryRateAllLoans: string;
  recoveryRateOpenLoans: number;
  portfolioAtRisk: {
    par30: number;
    par60: number;
    par90: number;
  };
  numberOfDefaultLoans: number;
  percentageOfDefaultLoans: number;
  defaultLoansOutstanding: {
    principal: number;
    interest: number;
    fees: number;
    penalty: number;
  };
  amountOfPastDue: number;
  amountOfPortfolioAtRiskPAR90: number;
}

const dateFrom = ref('2024-09-05');
const dateTo = ref('2025-09-05');
const reportGenerated = ref(true); // Show data by default based on your example

const reportData = ref<AtGlanceReportData>({
  registeredBorrowers: 1,
  activeBorrowers: 1,
  principalPortfolioDisbursed: 1000000,
  fullyPaidLoans: 0,
  openLoans: {
    numberOfOpenLoans: 1,
    numberOfOpenLoansCreated: 1,
    openingBalance: 0,
    closingBalance: 0
  },
  totalOutstandingAllLoans: 1050000,
  totalOutstandingOpenLoans: 1050000,
  payments: {
    principal: 0,
    interest: 0,
    nonDeductableFees: 0,
    deductableFees: 0,
    penalty: 0
  },
  recoveryRateAllLoans: '', // Empty as shown in your specification
  recoveryRateOpenLoans: 0,
  portfolioAtRisk: {
    par30: 0,
    par60: 0,
    par90: 0
  },
  numberOfDefaultLoans: 0,
  percentageOfDefaultLoans: 0,
  defaultLoansOutstanding: {
    principal: 0,
    interest: 0,
    fees: 0,
    penalty: 0
  },
  amountOfPastDue: 0,
  amountOfPortfolioAtRiskPAR90: 0
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
  console.log('Generating at-a-glance report with filters:', {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
  });
  reportGenerated.value = true;
  
  // Here you would typically fetch at-a-glance report data from your API
};

const exportReport = () => {
  console.log('Exporting at-a-glance report to Excel...');
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