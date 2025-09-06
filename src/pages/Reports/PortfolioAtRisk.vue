<template>
  <div class="p-6">
    <div class="mb-6">
      <div class="flex items-center space-x-2">
        <h1 class="text-2xl font-bold text-gray-900">Portfolio At Risk (PAR)</h1>
        <button 
          @click="showHelp = !showHelp"
          class="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
        >
          Help
        </button>
      </div>
      
      <!-- Help Section -->
      <div v-if="showHelp" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 class="text-sm font-semibold text-blue-800 mb-2">What is Portfolio At Risk (PAR)?</h3>
        <div class="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Portfolio At Risk (PAR)</strong> is the percentage of the gross loan portfolio that is at risk. 
            So, PAR 30 is the percentage of the gross loan portfolio for all open loans that is overdue by more than 30 days.
          </p>
          <p>
            <strong>Calculation:</strong> Total Principal Balance of Open Loans Overdue by X Number of Days divided by 
            Total Principal Outstanding of all Open Loans at a specific point in time.
          </p>
          <p>
            <strong>Usage:</strong> Generally PAR 90 loans are considered as bad loans. You can use this to keep enough 
            cash aside in case of future loan defaults. PAR values are often used in accounting to show the health of the 
            total loan portfolio.
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">To Date:</label>
            <input 
              type="date" 
              v-model="toDate"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">PAR Days (optional):</label>
            <input 
              type="number" 
              v-model="customParDays"
              placeholder="Enter number of days"
              min="1"
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

    <!-- PAR Report Results -->
    <div v-if="reportGenerated" class="mt-6 space-y-6">
      <!-- Branch Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ branchInfo.name }}</h2>
          
          <!-- PAR Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- PAR 30 Card -->
            <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium text-yellow-800">PAR 30 (Overdue more than 30 days)</h3>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div class="mb-2">
                <span class="text-3xl font-bold text-yellow-900">{{ formatPercentage(parData.par30.percentage) }}</span>
              </div>
              <p class="text-sm text-yellow-700">
                {{ formatCurrency(parData.par30.principalAtRisk) }} principal at risk from {{ parData.par30.numberOfLoans }} Loans
              </p>
              <div class="mt-2 w-full bg-yellow-200 rounded-full h-2">
                <div 
                  class="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
                  :style="{ width: `${Math.min(parData.par30.percentage, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- PAR 60 Card -->
            <div class="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium text-orange-800">PAR 60 (Overdue more than 60 days)</h3>
                <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
              <div class="mb-2">
                <span class="text-3xl font-bold text-orange-900">{{ formatPercentage(parData.par60.percentage) }}</span>
              </div>
              <p class="text-sm text-orange-700">
                {{ formatCurrency(parData.par60.principalAtRisk) }} principal at risk from {{ parData.par60.numberOfLoans }} Loans
              </p>
              <div class="mt-2 w-full bg-orange-200 rounded-full h-2">
                <div 
                  class="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                  :style="{ width: `${Math.min(parData.par60.percentage, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- PAR 90 Card -->
            <div class="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium text-red-800">PAR 90 (Overdue more than 90 days)</h3>
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div class="mb-2">
                <span class="text-3xl font-bold text-red-900">{{ formatPercentage(parData.par90.percentage) }}</span>
              </div>
              <p class="text-sm text-red-700">
                {{ formatCurrency(parData.par90.principalAtRisk) }} principal at risk from {{ parData.par90.numberOfLoans }} Loans
              </p>
              <div class="mt-2 w-full bg-red-200 rounded-full h-2">
                <div 
                  class="bg-red-600 h-2 rounded-full transition-all duration-300" 
                  :style="{ width: `${Math.min(parData.par90.percentage, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Custom PAR Card (if specified) -->
          <div v-if="customParDays && customParDays > 0" class="mt-6">
            <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium text-purple-800">PAR {{ customParDays }} (Overdue more than {{ customParDays }} days)</h3>
                <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
              <div class="mb-2">
                <span class="text-3xl font-bold text-purple-900">{{ formatPercentage(customParData.percentage) }}</span>
              </div>
              <p class="text-sm text-purple-700">
                {{ formatCurrency(customParData.principalAtRisk) }} principal at risk from {{ customParData.numberOfLoans }} Loans
              </p>
              <div class="mt-2 w-full bg-purple-200 rounded-full h-2">
                <div 
                  class="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                  :style="{ width: `${Math.min(customParData.percentage, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Portfolio Health Summary -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Portfolio Health Summary</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Risk Assessment -->
            <div class="space-y-4">
              <h4 class="text-sm font-medium text-gray-700">Risk Assessment</h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">PAR 30 Status:</span>
                  <span :class="getRiskStatusClass(parData.par30.percentage)">
                    {{ getRiskStatus(parData.par30.percentage) }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">PAR 60 Status:</span>
                  <span :class="getRiskStatusClass(parData.par60.percentage)">
                    {{ getRiskStatus(parData.par60.percentage) }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">PAR 90 Status:</span>
                  <span :class="getRiskStatusClass(parData.par90.percentage)">
                    {{ getRiskStatus(parData.par90.percentage) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Key Metrics -->
            <div class="space-y-4">
              <h4 class="text-sm font-medium text-gray-700">Key Metrics</h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total Portfolio Value:</span>
                  <span class="text-sm font-medium text-gray-900">{{ formatCurrency(portfolioMetrics.totalPortfolio) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total At Risk Amount:</span>
                  <span class="text-sm font-medium text-red-600">{{ formatCurrency(portfolioMetrics.totalAtRisk) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Healthy Portfolio:</span>
                  <span class="text-sm font-medium text-green-600">{{ formatCurrency(portfolioMetrics.healthyPortfolio) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
          
          <div class="space-y-4">
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p class="text-sm text-blue-800">
                <strong>Note:</strong> To see the loans included in the above figures, visit 
                <router-link to="/reports/loan-arrears" class="text-blue-600 underline hover:text-blue-700">
                  Reports (left menu) → Loan Arrears Aging Report
                </router-link>. 
                The total principal at risk above may not equal to the Total Principal Outstanding in the Loan Arrears Aging Report 
                as we treat restructured loans differently in both reports.
              </p>
            </div>

            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 class="text-sm font-medium text-yellow-800 mb-2">Industry Standards:</h4>
              <ul class="text-sm text-yellow-700 space-y-1">
                <li>• PAR 30 below 5% is considered excellent</li>
                <li>• PAR 60 below 3% indicates good collection practices</li>
                <li>• PAR 90 below 2% shows healthy portfolio management</li>
                <li>• PAR 90 above 10% indicates significant portfolio risk</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500">Please select a date and generate the PAR report.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface PARData {
  percentage: number;
  principalAtRisk: number;
  numberOfLoans: number;
}

interface PARReport {
  par30: PARData;
  par60: PARData;
  par90: PARData;
}

const showHelp = ref(false);
const toDate = ref('2025-09-05');
const customParDays = ref<number | null>(null);
const reportGenerated = ref(true); // Show data by default based on your example

const branchInfo = ref({
  name: 'Branch #1'
});

// Sample data matching your specification - all 0% as shown
const parData = ref<PARReport>({
  par30: {
    percentage: 0,
    principalAtRisk: 0,
    numberOfLoans: 0
  },
  par60: {
    percentage: 0,
    principalAtRisk: 0,
    numberOfLoans: 0
  },
  par90: {
    percentage: 0,
    principalAtRisk: 0,
    numberOfLoans: 0
  }
});

const customParData = ref<PARData>({
  percentage: 0,
  principalAtRisk: 0,
  numberOfLoans: 0
});

const portfolioMetrics = computed(() => {
  const totalAtRisk = parData.value.par30.principalAtRisk + 
                     parData.value.par60.principalAtRisk + 
                     parData.value.par90.principalAtRisk;
  
  // Assuming total portfolio (would come from API in real implementation)
  const totalPortfolio = 1000000; // Sample value
  const healthyPortfolio = totalPortfolio - totalAtRisk;

  return {
    totalPortfolio,
    totalAtRisk,
    healthyPortfolio
  };
});

const formatCurrency = (amount: number) => {
  // Using TZS prefix as shown in your specification
  return `TZS${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)}`;
};

const formatPercentage = (percentage: number) => {
  return `${percentage.toFixed(1)}%`;
};

const getRiskStatus = (percentage: number) => {
  if (percentage === 0) return 'Excellent';
  if (percentage <= 2) return 'Good';
  if (percentage <= 5) return 'Acceptable';
  if (percentage <= 10) return 'Concerning';
  return 'High Risk';
};

const getRiskStatusClass = (percentage: number) => {
  if (percentage === 0 || percentage <= 2) return 'text-sm font-medium text-green-600';
  if (percentage <= 5) return 'text-sm font-medium text-yellow-600';
  if (percentage <= 10) return 'text-sm font-medium text-orange-600';
  return 'text-sm font-medium text-red-600';
};

const generateReport = () => {
  console.log('Generating PAR report with filters:', {
    toDate: toDate.value,
    customParDays: customParDays.value,
  });
  
  reportGenerated.value = true;
  
  // Here you would typically fetch PAR data from your API
  // Calculate custom PAR if specified
  if (customParDays.value && customParDays.value > 0) {
    // In real implementation, this would be calculated based on the custom days
    customParData.value = {
      percentage: 0,
      principalAtRisk: 0,
      numberOfLoans: 0
    };
  }
};

const exportReport = () => {
  console.log('Exporting PAR report to Excel...');
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