<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Monthly Report</h1>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">6 months ending</label>
            <input 
              type="date" 
              v-model="endingDate"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
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

    <!-- Monthly Report Results -->
    <div v-if="reportGenerated" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th v-for="month in monthlyPeriods" :key="month.key" 
                    class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ month.label }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Principal Balance Row -->
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                  Principal Balance
                </td>
                <td v-for="month in monthlyPeriods" :key="month.key" 
                    class="px-4 py-4 text-sm text-center text-gray-900">
                  {{ formatCurrency(getMetricValue('principalBalance', month.key)) }}
                </td>
              </tr>

              <!-- Principal Received Row -->
              <tr class="hover:bg-gray-50 bg-green-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                  Principal Received
                </td>
                <td v-for="month in monthlyPeriods" :key="month.key" 
                    class="px-4 py-4 text-sm text-center text-gray-900">
                  {{ formatCurrency(getMetricValue('principalReceived', month.key)) }}
                </td>
              </tr>

              <!-- Interest Received Row -->
              <tr class="hover:bg-gray-50 bg-blue-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                  Interest Received
                </td>
                <td v-for="month in monthlyPeriods" :key="month.key" 
                    class="px-4 py-4 text-sm text-center text-gray-900">
                  {{ formatCurrency(getMetricValue('interestReceived', month.key)) }}
                </td>
              </tr>

              <!-- Fees Received Row -->
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                  Fees Received
                </td>
                <td v-for="month in monthlyPeriods" :key="month.key" 
                    class="px-4 py-4 text-sm text-center text-gray-900">
                  {{ formatCurrency(getMetricValue('feesReceived', month.key)) }}
                </td>
              </tr>

              <!-- Penalty Received Row -->
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                  Penalty Received
                </td>
                <td v-for="month in monthlyPeriods" :key="month.key" 
                    class="px-4 py-4 text-sm text-center text-gray-900">
                  {{ formatCurrency(getMetricValue('penaltyReceived', month.key)) }}
                </td>
              </tr>

              <!-- Total Received Row -->
              <tr class="hover:bg-gray-50 bg-yellow-50 font-medium">
                <td class="px-4 py-4 text-sm font-bold text-gray-900">
                  Total Received
                </td>
                <td v-for="month in monthlyPeriods" :key="month.key" 
                    class="px-4 py-4 text-sm text-center font-bold text-gray-900">
                  {{ formatCurrency(getMetricValue('totalReceived', month.key)) }}
                </td>
              </tr>

              <!-- New Loans Row -->
              <tr class="hover:bg-gray-50 bg-purple-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                  New Loans
                </td>
                <td v-for="month in monthlyPeriods" :key="month.key" 
                    class="px-4 py-4 text-sm text-center text-gray-900">
                  <span :class="getMetricValue('newLoans', month.key) > 0 ? 'font-medium text-purple-600' : ''">
                    {{ getMetricValue('newLoans', month.key) }}
                  </span>
                </td>
              </tr>

              <!-- Number of Repayments Row -->
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                  Number of Repayments
                </td>
                <td v-for="month in monthlyPeriods" :key="month.key" 
                    class="px-4 py-4 text-sm text-center text-gray-900">
                  {{ getMetricValue('numberOfRepayments', month.key) }}
                </td>
              </tr>

              <!-- Pending Due Row -->
              <tr class="hover:bg-gray-50 bg-red-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                  Pending Due
                </td>
                <td v-for="month in monthlyPeriods" :key="month.key" 
                    class="px-4 py-4 text-sm text-center text-gray-900">
                  {{ formatCurrency(getMetricValue('pendingDue', month.key)) }}
                </td>
              </tr>

              <!-- Number of Fully Paid Loans Row -->
              <tr class="hover:bg-gray-50 bg-green-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                  Number of Fully Paid Loans
                </td>
                <td v-for="month in monthlyPeriods" :key="month.key" 
                    class="px-4 py-4 text-sm text-center text-gray-900">
                  {{ getMetricValue('numberOfFullyPaidLoans', month.key) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Cards -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 class="text-sm font-medium text-blue-800 mb-2">Total New Loans (6 months)</h4>
            <p class="text-2xl font-bold text-blue-900">{{ getTotalNewLoans() }}</p>
            <p class="text-xs text-blue-600">Loans originated in period</p>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 class="text-sm font-medium text-green-800 mb-2">Total Collections (6 months)</h4>
            <p class="text-2xl font-bold text-green-900">{{ formatCurrency(getTotalCollections()) }}</p>
            <p class="text-xs text-green-600">All receipts combined</p>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 class="text-sm font-medium text-purple-800 mb-2">Total Repayments (6 months)</h4>
            <p class="text-2xl font-bold text-purple-900">{{ getTotalRepayments() }}</p>
            <p class="text-xs text-purple-600">Payment transactions</p>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h4 class="text-sm font-medium text-gray-800 mb-2">Report Period Information</h4>
          <p class="text-sm text-gray-600">
            This report covers 6 months ending {{ formatDate(endingDate) }}. Each column represents a complete month's activity. 
            The most recent period ({{ monthlyPeriods[0]?.label }}) shows 1 new loan, while all other metrics remain at zero.
          </p>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500">Please select an ending date and generate the monthly report.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface MonthlyData {
  [key: string]: {
    principalBalance: number;
    principalReceived: number;
    interestReceived: number;
    feesReceived: number;
    penaltyReceived: number;
    totalReceived: number;
    newLoans: number;
    numberOfRepayments: number;
    pendingDue: number;
    numberOfFullyPaidLoans: number;
  };
}

const currentDate = new Date();
const endingDate = ref(currentDate.toISOString().split('T')[0]);
const reportGenerated = ref(true); // Show data by default based on your example

// Sample data matching your specification
const monthlyData = ref<MonthlyData>({
  'sep2025': {
    principalBalance: 0,
    principalReceived: 0,
    interestReceived: 0,
    feesReceived: 0,
    penaltyReceived: 0,
    totalReceived: 0,
    newLoans: 1,
    numberOfRepayments: 0,
    pendingDue: 0,
    numberOfFullyPaidLoans: 0
  },
  'aug2025': {
    principalBalance: 0,
    principalReceived: 0,
    interestReceived: 0,
    feesReceived: 0,
    penaltyReceived: 0,
    totalReceived: 0,
    newLoans: 0,
    numberOfRepayments: 0,
    pendingDue: 0,
    numberOfFullyPaidLoans: 0
  },
  'jul2025': {
    principalBalance: 0,
    principalReceived: 0,
    interestReceived: 0,
    feesReceived: 0,
    penaltyReceived: 0,
    totalReceived: 0,
    newLoans: 0,
    numberOfRepayments: 0,
    pendingDue: 0,
    numberOfFullyPaidLoans: 0
  },
  'jun2025': {
    principalBalance: 0,
    principalReceived: 0,
    interestReceived: 0,
    feesReceived: 0,
    penaltyReceived: 0,
    totalReceived: 0,
    newLoans: 0,
    numberOfRepayments: 0,
    pendingDue: 0,
    numberOfFullyPaidLoans: 0
  },
  'may2025': {
    principalBalance: 0,
    principalReceived: 0,
    interestReceived: 0,
    feesReceived: 0,
    penaltyReceived: 0,
    totalReceived: 0,
    newLoans: 0,
    numberOfRepayments: 0,
    pendingDue: 0,
    numberOfFullyPaidLoans: 0
  },
  'apr2025': {
    principalBalance: 0,
    principalReceived: 0,
    interestReceived: 0,
    feesReceived: 0,
    penaltyReceived: 0,
    totalReceived: 0,
    newLoans: 0,
    numberOfRepayments: 0,
    pendingDue: 0,
    numberOfFullyPaidLoans: 0
  }
});

const monthlyPeriods = computed(() => {
  const endDate = new Date(endingDate.value);
  const periods = [];
  
  for (let i = 0; i < 6; i++) {
    const periodDate = new Date(endDate);
    periodDate.setMonth(periodDate.getMonth() - i);
    
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const month = periodDate.getMonth();
    const year = periodDate.getFullYear();
    const monthName = monthNames[month];
    
    // Handle partial month for current period
    let label: string;
    if (i === 0) {
      const day = endDate.getDate();
      const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
      label = `1st ${monthName}-${day}${suffix} ${monthName}`;
    } else {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      label = `1st ${monthName}-${daysInMonth}${getDaySuffix(daysInMonth)} ${monthName}`;
    }
    
    periods.push({
      key: `${monthName.toLowerCase()}${year}`,
      label: label,
      month: month,
      year: year
    });
  }
  
  return periods;
});

const getDaySuffix = (day: number) => {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const getMetricValue = (metric: string, periodKey: string) => {
  const data = monthlyData.value[periodKey];
  if (!data) return 0;
  return (data as any)[metric] || 0;
};

const getTotalNewLoans = () => {
  return monthlyPeriods.value.reduce((total, period) => {
    return total + getMetricValue('newLoans', period.key);
  }, 0);
};

const getTotalCollections = () => {
  return monthlyPeriods.value.reduce((total, period) => {
    return total + getMetricValue('totalReceived', period.key);
  }, 0);
};

const getTotalRepayments = () => {
  return monthlyPeriods.value.reduce((total, period) => {
    return total + getMetricValue('numberOfRepayments', period.key);
  }, 0);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
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
  console.log('Generating monthly report ending:', endingDate.value);
  reportGenerated.value = true;
  
  // Here you would typically fetch monthly report data from your API
  // The data structure would be rebuilt based on the new ending date
};

const exportReport = () => {
  console.log('Exporting monthly report to Excel...');
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