<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Microfinance Financial Reporting Standards - Ratios</h1>
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

    <!-- MFRS Ratios Results -->
    <div v-if="reportGenerated" class="mt-6 space-y-6">
      <!-- Profitability Ratios Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6 uppercase">Profitability Ratios</h2>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ratio no.
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Term
                  </th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formula
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calculation notes
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Use
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="ratio in profitabilityRatios" :key="ratio.id" class="hover:bg-gray-50">
                  <td class="px-4 py-4 text-sm font-medium text-gray-900">
                    {{ ratio.ratioNo }}
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-900">
                    {{ ratio.term }}
                  </td>
                  <td class="px-4 py-4 text-sm text-center font-medium text-gray-900">
                    <span :class="getRatioValueClass(ratio.value)">
                      {{ formatPercentage(ratio.value) }}
                    </span>
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-700">
                    <div class="font-mono text-xs bg-gray-50 p-2 rounded">
                      {{ ratio.formula }}
                    </div>
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-700 max-w-xs">
                    <div class="whitespace-normal">
                      {{ ratio.calculationNotes }}
                    </div>
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-700 max-w-sm">
                    <div class="whitespace-normal">
                      {{ ratio.use }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Additional Ratio Categories (if needed in future) -->
      <!-- Liquidity Ratios, Risk Ratios, etc. can be added here -->
      
      <!-- Summary and Notes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Report Summary</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="text-sm font-medium text-blue-800 mb-2">Portfolio Yield</h4>
              <p class="text-2xl font-bold text-blue-900">{{ formatPercentage(getSummaryValue('R1')) }}</p>
              <p class="text-xs text-blue-600">Revenue generation capability</p>
            </div>
            
            <div class="bg-red-50 p-4 rounded-lg">
              <h4 class="text-sm font-medium text-red-800 mb-2">Impairment Expense Ratio</h4>
              <p class="text-2xl font-bold text-red-900">{{ formatPercentage(getSummaryValue('R6')) }}</p>
              <p class="text-xs text-red-600">Credit loss proportion</p>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h4 class="text-sm font-medium text-green-800 mb-2">Operating Expense Ratio</h4>
              <p class="text-2xl font-bold text-green-900">{{ formatPercentage(getSummaryValue('R7')) }}</p>
              <p class="text-xs text-green-600">Operational efficiency measure</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 class="text-sm font-medium text-yellow-800 mb-2">Key Insights</h4>
              <ul class="text-sm text-yellow-700 space-y-1">
                <li>• All profitability ratios are currently at 0%, indicating potential data collection or calculation issues</li>
                <li>• Portfolio yield of 0% suggests no revenue recognition from the loan portfolio</li>
                <li>• Operating expense ratio of 0% may indicate incomplete cost allocation</li>
              </ul>
            </div>

            <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 class="text-sm font-medium text-blue-800 mb-2">MFRS Standards Notes</h4>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• Ratios are calculated using averaging to eliminate seasonal variations</li>
                <li>• Accrued interest receivable should be backed out if not received</li>
                <li>• Declining trends in efficiency ratios may reflect increasing average loan sizes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <p class="text-gray-500">Please select a date range and generate the report to view MFRS ratios.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface MFRSRatio {
  id: string;
  ratioNo: string;
  term: string;
  value: number;
  formula: string;
  calculationNotes: string;
  use: string;
  category: string;
}

const currentDate = new Date();
const lastYear = new Date();
lastYear.setFullYear(currentDate.getFullYear() - 1);

const dateFrom = ref(lastYear.toISOString().split('T')[0]);
const dateTo = ref(currentDate.toISOString().split('T')[0]);

const reportGenerated = ref(true); // Show data by default based on your example

const profitabilityRatios = ref<MFRSRatio[]>([
  {
    id: '1',
    ratioNo: 'R1',
    term: 'Portfolio yield',
    value: 0,
    formula: 'Interest, fees, and commissions in loan portfolio/ Gross loan portfolio',
    calculationNotes: 'MFRS assumes that accrued interest receivable is backed out or reversed if not received.\n\nAs the ratio is calculated using averaging, it eliminates the effect of seasonal highs and lows.',
    use: "Indicates the MFI's ability to generate cash from interest, fees, and commissions in the average gross loan portfolio. A decreasing trend means lower earnings in the portfolio, either from a change in product pricing, product portfolio composition, or foregone revenue due to rising arrears.",
    category: 'profitability'
  },
  {
    id: '2',
    ratioNo: 'R6',
    term: 'Impairment expense ratio',
    value: 0,
    formula: 'Impairment expense/ Gross loan portfolio',
    calculationNotes: 'This ratio can also be measured as a proportion of NPL30 with NPL30 in the denominator.',
    use: 'Measures the impairment expense as a proportion of the average gross portfolio, which represents the cost of credit-related losses or write-offs in the portfolio. Changes in this ratio may be due to changes in delinquency or to provisioning policies.',
    category: 'profitability'
  },
  {
    id: '3',
    ratioNo: 'R7',
    term: 'Operating expense ratio',
    value: 0,
    formula: 'Operating expense/ Gross loan portfolio',
    calculationNotes: '',
    use: "Measures the administrative and overhead costs incurred to deliver loans. Declining trend, while a sign of an MFI's improving efficiency, may also reflect a rising average loan size.",
    category: 'profitability'
  }
]);

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

const getRatioValueClass = (value: number) => {
  if (value === 0) return 'text-gray-600';
  if (value > 0 && value < 5) return 'text-red-600';
  if (value >= 5 && value < 15) return 'text-yellow-600';
  return 'text-green-600';
};

const getSummaryValue = (ratioNo: string) => {
  const ratio = profitabilityRatios.value.find(r => r.ratioNo === ratioNo);
  return ratio ? ratio.value : 0;
};

const generateReport = () => {
  console.log('Generating MFRS ratios report with filters:', {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
  });
  reportGenerated.value = true;
  
  // Here you would typically fetch MFRS ratios data from your API
  // For now, all ratios remain 0 as per your specification
};

const exportReport = () => {
  console.log('Exporting MFRS ratios report to Excel...');
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