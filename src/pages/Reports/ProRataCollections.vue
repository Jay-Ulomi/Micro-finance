<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Pro-Rata Collections Monthly</h1>
      <p class="text-sm text-gray-600 mt-2">
        This page shows the pro-rata collections on a monthly basis. It does not count any payments made.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
        <h3 class="text-lg font-semibold text-gray-900">Filter Pro-Rata Collections Monthly</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Loan Products</label>
            <input 
              type="date" 
              v-model="filterDate"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Loan Status Filters</label>
            <div class="flex flex-wrap gap-2">
              <span v-for="status in loanStatuses" :key="status.key" 
                    :class="getStatusBadgeClass(status.key)"
                    class="px-2 py-1 text-xs rounded-full cursor-pointer border-2"
                    @click="toggleStatus(status.key)">
                {{ status.name }}
              </span>
            </div>
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

    <!-- Pro-Rata Collections Results -->
    <div v-if="reportGenerated" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Product
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Until Today
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  7th Sep - 30th Sep
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oct
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nov
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dec
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jan
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feb
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mar
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apr
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  May
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jun
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jul
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aug
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sep
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oct
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="product in proRataData" :key="product.id">
                <!-- Product Header -->
                <tr class="bg-gray-50 font-medium">
                  <td colspan="15" class="px-3 py-2 text-sm text-gray-900">{{ product.name }}</td>
                </tr>
                
                <!-- Principal Projection -->
                <tr>
                  <td class="px-3 py-2 text-sm text-gray-700 pl-6">Principal Projection</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.principal.untilToday) }}</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.principal.currentMonth) }}</td>
                  <td v-for="month in product.projections.principal.futureMonths" :key="month" 
                      class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                </tr>
                
                <!-- Interest Projection -->
                <tr>
                  <td class="px-3 py-2 text-sm text-gray-700 pl-6">Interest Projection</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.interest.untilToday) }}</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.interest.currentMonth) }}</td>
                  <td v-for="month in product.projections.interest.futureMonths" :key="month" 
                      class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                </tr>
                
                <!-- Fees Projection -->
                <tr>
                  <td class="px-3 py-2 text-sm text-gray-700 pl-6">Fees Projection</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.fees.untilToday) }}</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.fees.currentMonth) }}</td>
                  <td v-for="month in product.projections.fees.futureMonths" :key="month" 
                      class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                </tr>
                
                <!-- Penalty Projection -->
                <tr>
                  <td class="px-3 py-2 text-sm text-gray-700 pl-6">Penalty Projection</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.penalty.untilToday) }}</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.penalty.currentMonth) }}</td>
                  <td v-for="month in product.projections.penalty.futureMonths" :key="month" 
                      class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                </tr>
                
                <!-- Total Projection -->
                <tr class="bg-blue-50">
                  <td class="px-3 py-2 text-sm font-medium text-gray-900 pl-6">Total Projection</td>
                  <td class="px-3 py-2 text-sm text-right font-medium text-gray-900">{{ formatCurrency(product.projections.total.untilToday) }}</td>
                  <td class="px-3 py-2 text-sm text-right font-medium text-gray-900">{{ formatCurrency(product.projections.total.currentMonth) }}</td>
                  <td v-for="month in product.projections.total.futureMonths" :key="month" 
                      class="px-3 py-2 text-sm text-right font-medium text-gray-900">{{ formatCurrency(month) }}</td>
                </tr>
                
                <!-- Pending Due -->
                <tr>
                  <td class="px-3 py-2 text-sm text-gray-700 pl-6">Pending Due</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.pendingDue) }}</td>
                  <td colspan="13"></td>
                </tr>
              </template>
              
              <!-- Grand Total Section -->
              <tr class="bg-gray-100 font-bold border-t-2">
                <td class="px-3 py-2 text-sm text-gray-900">Total</td>
                <td colspan="14"></td>
              </tr>
              <tr class="bg-gray-100 font-bold">
                <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Principal Projection</td>
                <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(totals.principal.untilToday) }}</td>
                <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(totals.principal.currentMonth) }}</td>
                <td v-for="month in totals.principal.futureMonths" :key="month" 
                    class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
              </tr>
              <tr class="bg-gray-100 font-bold">
                <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Interest Projection</td>
                <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(totals.interest.untilToday) }}</td>
                <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(totals.interest.currentMonth) }}</td>
                <td v-for="month in totals.interest.futureMonths" :key="month" 
                    class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
              </tr>
              <tr class="bg-gray-100 font-bold">
                <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Fees Projection</td>
                <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(totals.fees.untilToday) }}</td>
                <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(totals.fees.currentMonth) }}</td>
                <td v-for="month in totals.fees.futureMonths" :key="month" 
                    class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
              </tr>
              <tr class="bg-gray-100 font-bold">
                <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Penalty Projection</td>
                <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(totals.penalty.untilToday) }}</td>
                <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(totals.penalty.currentMonth) }}</td>
                <td v-for="month in totals.penalty.futureMonths" :key="month" 
                    class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
              </tr>
              <tr class="bg-blue-100 font-bold">
                <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Projection</td>
                <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(totals.total.untilToday) }}</td>
                <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(totals.total.currentMonth) }}</td>
                <td v-for="month in totals.total.futureMonths" :key="month" 
                    class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
              </tr>
              <tr class="bg-gray-100 font-bold">
                <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Pending Due</td>
                <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(totals.pendingDue) }}</td>
                <td colspan="13"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p class="text-sm text-blue-800">
            <strong>Note:</strong> This report shows pro-rata collections projections and does not include any actual payments made by borrowers.
          </p>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500">No data available. Please generate the report to view pro-rata collections projections.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface MonthlyProjection {
  untilToday: number;
  currentMonth: number;
  futureMonths: number[];
}

interface ProRataData {
  id: string;
  name: string;
  projections: {
    principal: MonthlyProjection;
    interest: MonthlyProjection;
    fees: MonthlyProjection;
    penalty: MonthlyProjection;
    total: MonthlyProjection;
  };
  pendingDue: number;
}

const filterDate = ref('2025-09-06');
const reportGenerated = ref(true); // Show data by default based on your example

const selectedStatuses = ref<string[]>([]);

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

const proRataData = ref<ProRataData[]>([
  {
    id: '1',
    name: 'Personal Loan',
    projections: {
      principal: {
        untilToday: 800000,
        currentMonth: 66666.67,
        futureMonths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      interest: {
        untilToday: 40000,
        currentMonth: 3333.33,
        futureMonths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      fees: {
        untilToday: 0,
        currentMonth: 0,
        futureMonths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      penalty: {
        untilToday: 0,
        currentMonth: 0,
        futureMonths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      total: {
        untilToday: 840000,
        currentMonth: 70000,
        futureMonths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    pendingDue: 0
  }
]);

const totals = computed(() => {
  const totals = {
    principal: { untilToday: 0, currentMonth: 0, futureMonths: new Array(13).fill(0) },
    interest: { untilToday: 0, currentMonth: 0, futureMonths: new Array(13).fill(0) },
    fees: { untilToday: 0, currentMonth: 0, futureMonths: new Array(13).fill(0) },
    penalty: { untilToday: 0, currentMonth: 0, futureMonths: new Array(13).fill(0) },
    total: { untilToday: 0, currentMonth: 0, futureMonths: new Array(13).fill(0) },
    pendingDue: 0
  };

  proRataData.value.forEach(product => {
    totals.principal.untilToday += product.projections.principal.untilToday;
    totals.principal.currentMonth += product.projections.principal.currentMonth;
    totals.interest.untilToday += product.projections.interest.untilToday;
    totals.interest.currentMonth += product.projections.interest.currentMonth;
    totals.fees.untilToday += product.projections.fees.untilToday;
    totals.fees.currentMonth += product.projections.fees.currentMonth;
    totals.penalty.untilToday += product.projections.penalty.untilToday;
    totals.penalty.currentMonth += product.projections.penalty.currentMonth;
    totals.total.untilToday += product.projections.total.untilToday;
    totals.total.currentMonth += product.projections.total.currentMonth;
    totals.pendingDue += product.pendingDue;

    product.projections.principal.futureMonths.forEach((month, index) => {
      totals.principal.futureMonths[index] += month;
    });
    product.projections.interest.futureMonths.forEach((month, index) => {
      totals.interest.futureMonths[index] += month;
    });
    product.projections.fees.futureMonths.forEach((month, index) => {
      totals.fees.futureMonths[index] += month;
    });
    product.projections.penalty.futureMonths.forEach((month, index) => {
      totals.penalty.futureMonths[index] += month;
    });
    product.projections.total.futureMonths.forEach((month, index) => {
      totals.total.futureMonths[index] += month;
    });
  });

  return totals;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
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

const toggleStatus = (statusKey: string) => {
  const index = selectedStatuses.value.indexOf(statusKey);
  if (index > -1) {
    selectedStatuses.value.splice(index, 1);
  } else {
    selectedStatuses.value.push(statusKey);
  }
};

const generateReport = () => {
  console.log('Generating pro-rata collections report with filters:', {
    filterDate: filterDate.value,
    selectedStatuses: selectedStatuses.value,
  });
  reportGenerated.value = true;
};
</script>

<style scoped>
@media print {
  .no-print {
    display: none;
  }
}
</style>