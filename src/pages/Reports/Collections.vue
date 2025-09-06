<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Collections Report</h1>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div class="space-y-3">
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

    <div v-if="reportGenerated" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th rowspan="2" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Status
                </th>
                <th rowspan="2" class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l">
                  
                </th>
                <th colspan="5" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-b">
                  Amount Details
                </th>
              </tr>
              <tr>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-l">
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
              <template v-for="status in loanStatuses" :key="status.key">
                <!-- Gross Due Row -->
                <tr class="hover:bg-gray-50">
                  <td rowspan="3" class="px-6 py-4 text-sm font-medium text-gray-900 border-r align-top">
                    {{ status.name }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 border-l">
                    Gross Due
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 border-l">
                    {{ formatCurrency(status.grossDue.principal) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(status.grossDue.interest) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(status.grossDue.fees) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(status.grossDue.penalty) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-medium text-gray-900">
                    {{ formatCurrency(status.grossDue.total) }}
                  </td>
                </tr>
                
                <!-- Paid Row -->
                <tr class="bg-green-50">
                  <td class="px-4 py-3 text-sm text-gray-700 border-l">
                    Paid
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 border-l">
                    {{ formatCurrency(status.paid.principal) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(status.paid.interest) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(status.paid.fees) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(status.paid.penalty) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-medium text-gray-900">
                    {{ formatCurrency(status.paid.total) }}
                  </td>
                </tr>
                
                <!-- Net Due Row -->
                <tr class="bg-blue-50">
                  <td class="px-4 py-3 text-sm text-gray-700 border-l">
                    Net Due
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 border-l">
                    {{ formatCurrency(status.netDue.principal) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(status.netDue.interest) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(status.netDue.fees) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(status.netDue.penalty) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-medium text-gray-900">
                    {{ formatCurrency(status.netDue.total) }}
                  </td>
                </tr>
              </template>
              
              <!-- Grand Totals Section -->
              <tr class="bg-gray-100 font-bold border-t-2 border-gray-300">
                <td rowspan="3" class="px-6 py-4 text-sm font-bold text-gray-900 border-r align-top">
                  Grand Total
                </td>
                <td class="px-4 py-3 text-sm font-bold text-gray-900 border-l">
                  Gross Due
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900 border-l">
                  {{ formatCurrency(grandTotals.grossDue.principal) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.grossDue.interest) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.grossDue.fees) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.grossDue.penalty) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.grossDue.total) }}
                </td>
              </tr>
              
              <tr class="bg-green-100 font-bold">
                <td class="px-4 py-3 text-sm font-bold text-gray-900 border-l">
                  Paid
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900 border-l">
                  {{ formatCurrency(grandTotals.paid.principal) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.paid.interest) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.paid.fees) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.paid.penalty) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.paid.total) }}
                </td>
              </tr>
              
              <tr class="bg-blue-100 font-bold">
                <td class="px-4 py-3 text-sm font-bold text-gray-900 border-l">
                  Net Due
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900 border-l">
                  {{ formatCurrency(grandTotals.netDue.principal) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.netDue.interest) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.netDue.fees) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.netDue.penalty) }}
                </td>
                <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                  {{ formatCurrency(grandTotals.netDue.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p class="text-sm text-yellow-800">
            <strong>**Please note</strong> that the above might not show the actual money released to borrowers since it may include restructured loans or overridden due amount loans where the due amount is less than the principal amount.
          </p>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500">No data available. Please select date range and generate the report.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface CollectionAmounts {
  principal: number;
  interest: number;
  fees: number;
  penalty: number;
  total: number;
}

interface LoanStatusCollection {
  key: string;
  name: string;
  grossDue: CollectionAmounts;
  paid: CollectionAmounts;
  netDue: CollectionAmounts;
}

const currentDate = new Date();
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

const dateFrom = ref(firstDayOfMonth.toISOString().split('T')[0]);
const dateTo = ref(currentDate.toISOString().split('T')[0]);

const reportGenerated = ref(false);

const loanStatuses = ref<LoanStatusCollection[]>([
  {
    key: 'open-loans',
    name: 'Open Loans (On Schedule)',
    grossDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    paid: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    netDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 }
  },
  {
    key: 'missed-repayment',
    name: 'Missed Repayment Loans',
    grossDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    paid: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    netDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 }
  },
  {
    key: 'arrears',
    name: 'Arrears Loans',
    grossDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    paid: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    netDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 }
  },
  {
    key: 'past-maturity',
    name: 'Past Maturity Loans',
    grossDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    paid: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    netDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 }
  },
  {
    key: 'fully-paid',
    name: 'Fully Paid Loans',
    grossDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    paid: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    netDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 }
  },
  {
    key: 'default',
    name: 'Default Loans',
    grossDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    paid: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    netDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 }
  },
  {
    key: 'restructured',
    name: 'Restructured Loans',
    grossDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    paid: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    netDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 }
  }
]);

const grandTotals = computed(() => {
  const totals = {
    grossDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    paid: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 },
    netDue: { principal: 0, interest: 0, fees: 0, penalty: 0, total: 0 }
  };

  loanStatuses.value.forEach(status => {
    totals.grossDue.principal += status.grossDue.principal;
    totals.grossDue.interest += status.grossDue.interest;
    totals.grossDue.fees += status.grossDue.fees;
    totals.grossDue.penalty += status.grossDue.penalty;
    totals.grossDue.total += status.grossDue.total;

    totals.paid.principal += status.paid.principal;
    totals.paid.interest += status.paid.interest;
    totals.paid.fees += status.paid.fees;
    totals.paid.penalty += status.paid.penalty;
    totals.paid.total += status.paid.total;

    totals.netDue.principal += status.netDue.principal;
    totals.netDue.interest += status.netDue.interest;
    totals.netDue.fees += status.netDue.fees;
    totals.netDue.penalty += status.netDue.penalty;
    totals.netDue.total += status.netDue.total;
  });

  return totals;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const generateReport = async () => {
  console.log('Generating collections report with filters:', {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
  });

  reportGenerated.value = true;
  
  // Here you would typically fetch data from your API
  // For now, all amounts remain 0 as per your specification
};

const exportReport = () => {
  console.log('Exporting collections report to Excel...');
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