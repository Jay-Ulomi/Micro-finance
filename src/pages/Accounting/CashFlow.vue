<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Cash Flow Statement</h1>
        <p class="text-sm text-gray-600">Monitor cash inflows and outflows</p>
      </div>
      <div class="flex space-x-3">
        <button @click="showHelp" class="btn btn-secondary">
          <QuestionMarkCircleIcon class="w-4 h-4 mr-2" />
          Help
        </button>
        <button @click="exportCashFlow" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="printCashFlow" class="btn btn-primary">
          <PrinterIcon class="w-4 h-4 mr-2" />
          Print
        </button>
      </div>
    </div>

    <!-- Settings Notice -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start">
        <InformationCircleIcon class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
        <div class="text-sm text-blue-900">
          To select default settings below, please visit 
          <router-link to="/settings" class="font-medium underline hover:text-blue-700">
            Admin → Accounting → Settings
          </router-link>
        </div>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Select Date Range</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date:</label>
          <input
            v-model="filters.fromDate"
            type="date"
            class="form-input"
            @change="filterCashFlow"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Date:</label>
          <input
            v-model="filters.toDate"
            type="date"
            class="form-input"
            @change="filterCashFlow"
          />
        </div>

        <div class="flex items-end">
          <button @click="generateReport" class="btn btn-primary w-full">
            <ChartBarIcon class="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      <!-- Quick Date Range Buttons -->
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="range in quickRanges"
          :key="range.label"
          @click="setQuickRange(range)"
          class="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          {{ range.label }}
        </button>
      </div>

      <!-- Compare with Past Periods -->
      <div class="mt-4">
        <label class="flex items-center">
          <input
            v-model="comparePeriods"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-700">Compare with Past Periods</span>
        </label>
      </div>
    </div>

    <!-- Cash Flow Statement -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200" ref="cashFlowReport">
      <!-- Report Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-900">Cash Flow Statement</h2>
        <p class="text-sm text-gray-600 mt-1">
          {{ formatDate(filters.fromDate) }} to {{ formatDate(filters.toDate) }}
        </p>
      </div>

      <!-- Cash Flow Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount (TZS)
              </th>
              <th v-if="comparePeriods" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Previous Period
              </th>
              <th v-if="comparePeriods" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change %
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Receipts Section -->
            <tr class="bg-green-50">
              <td colspan="4" class="px-6 py-3 text-sm font-semibold text-green-900">
                RECEIPTS
              </td>
            </tr>
            <tr v-for="receipt in cashFlowData.receipts" :key="receipt.id">
              <td class="px-6 py-3 text-sm text-gray-900 pl-10">
                {{ receipt.description }}
              </td>
              <td class="px-6 py-3 text-sm text-gray-900 text-right font-mono">
                {{ formatCurrency(receipt.amount) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-3 text-sm text-gray-500 text-right font-mono">
                {{ formatCurrency(receipt.previousAmount) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-3 text-sm text-right">
                <span :class="getChangeClass(receipt.change)">
                  {{ formatPercentage(receipt.change) }}
                </span>
              </td>
            </tr>
            <tr class="bg-green-100 font-semibold">
              <td class="px-6 py-3 text-sm text-green-900">
                Total Receipts (A)
              </td>
              <td class="px-6 py-3 text-sm text-green-900 text-right font-mono">
                {{ formatCurrency(totalReceipts) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-3 text-sm text-green-900 text-right font-mono">
                {{ formatCurrency(previousTotalReceipts) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-3 text-sm text-right">
                <span :class="getChangeClass(receiptsChange)">
                  {{ formatPercentage(receiptsChange) }}
                </span>
              </td>
            </tr>

            <!-- Blank Row -->
            <tr>
              <td colspan="4" class="px-6 py-2"></td>
            </tr>

            <!-- Payments Section -->
            <tr class="bg-red-50">
              <td colspan="4" class="px-6 py-3 text-sm font-semibold text-red-900">
                PAYMENTS
              </td>
            </tr>
            <tr v-for="payment in cashFlowData.payments" :key="payment.id">
              <td class="px-6 py-3 text-sm text-gray-900 pl-10">
                {{ payment.description }}
              </td>
              <td class="px-6 py-3 text-sm text-gray-900 text-right font-mono">
                {{ formatCurrency(payment.amount) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-3 text-sm text-gray-500 text-right font-mono">
                {{ formatCurrency(payment.previousAmount) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-3 text-sm text-right">
                <span :class="getChangeClass(payment.change)">
                  {{ formatPercentage(payment.change) }}
                </span>
              </td>
            </tr>
            <tr class="bg-red-100 font-semibold">
              <td class="px-6 py-3 text-sm text-red-900">
                Total Payments (B)
              </td>
              <td class="px-6 py-3 text-sm text-red-900 text-right font-mono">
                {{ formatCurrency(totalPayments) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-3 text-sm text-red-900 text-right font-mono">
                {{ formatCurrency(previousTotalPayments) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-3 text-sm text-right">
                <span :class="getChangeClass(paymentsChange)">
                  {{ formatPercentage(paymentsChange) }}
                </span>
              </td>
            </tr>

            <!-- Blank Row -->
            <tr>
              <td colspan="4" class="px-6 py-2"></td>
            </tr>

            <!-- Net Cash Flow -->
            <tr class="bg-gray-100 font-bold">
              <td class="px-6 py-3 text-sm text-gray-900">
                Total Cash Balance (A) - (B)
              </td>
              <td class="px-6 py-3 text-sm text-right font-mono"
                  :class="netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(netCashFlow) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-3 text-sm text-right font-mono"
                  :class="previousNetCashFlow >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(previousNetCashFlow) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-3 text-sm text-right">
                <span :class="getChangeClass(netCashFlowChange)">
                  {{ formatPercentage(netCashFlowChange) }}
                </span>
              </td>
            </tr>

            <!-- Previous Balance -->
            <tr>
              <td class="px-6 py-3 text-sm text-gray-700">
                Previous Balance
                <span class="text-gray-500 ml-2">Balance at {{ formatDate(getPreviousDate()) }}</span>
              </td>
              <td class="px-6 py-3 text-sm text-gray-900 text-right font-mono">
                {{ formatCurrency(previousBalance) }}
              </td>
              <td v-if="comparePeriods" colspan="2"></td>
            </tr>

            <!-- Total Balance -->
            <tr class="bg-blue-100 font-bold text-lg">
              <td class="px-6 py-4 text-blue-900">
                Total Balance
                <span class="text-sm font-normal text-blue-700 ml-2">Balance at {{ formatDate(filters.toDate) }}</span>
              </td>
              <td class="px-6 py-4 text-right font-mono"
                  :class="totalBalance >= 0 ? 'text-blue-900' : 'text-red-600'">
                {{ formatCurrency(totalBalance) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-4 text-right font-mono text-blue-700">
                {{ formatCurrency(previousPeriodTotalBalance) }}
              </td>
              <td v-if="comparePeriods" class="px-6 py-4 text-right">
                <span :class="getChangeClass(totalBalanceChange)">
                  {{ formatPercentage(totalBalanceChange) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary Statistics -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p class="text-xs text-gray-500 uppercase">Cash Inflow Ratio</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ cashInflowRatio }}%
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase">Cash Outflow Ratio</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ cashOutflowRatio }}%
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase">Operating Cash Flow</p>
            <p class="text-lg font-semibold" :class="operatingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'">
              TZS {{ formatCurrency(operatingCashFlow) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase">Cash Conversion Cycle</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ cashConversionCycle }} days
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cash Flow Chart -->
    <div v-if="showChart" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Cash Flow Trend</h3>
      <div class="h-64 flex items-center justify-center text-gray-500">
        <ChartBarIcon class="w-12 h-12 mr-2" />
        Chart visualization would be displayed here
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  QuestionMarkCircleIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  InformationCircleIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Quick date ranges
const quickRanges = [
  { label: 'Today', days: 0 },
  { label: 'Yesterday', days: -1 },
  { label: 'Last 7 Days', days: -7 },
  { label: 'Last 30 Days', days: -30 },
  { label: 'This Month', days: 'thisMonth' },
  { label: 'Last Month', days: 'lastMonth' },
  { label: 'This Quarter', days: 'thisQuarter' },
  { label: 'Last Quarter', days: 'lastQuarter' },
  { label: 'This Year', days: 'thisYear' },
  { label: 'Last Year', days: 'lastYear' },
]

// Reactive data
const comparePeriods = ref(false)
const showChart = ref(false)
const previousBalance = ref(0)

// Filters
const filters = ref({
  fromDate: new Date().toISOString().split('T')[0],
  toDate: new Date().toISOString().split('T')[0],
})

// Mock cash flow data based on the provided example
const cashFlowData = ref({
  receipts: [
    { id: 1, description: 'Loan Repayments (Principal)', amount: 0, previousAmount: 0, change: 0 },
    { id: 2, description: 'Loan Interest Income', amount: 0, previousAmount: 0, change: 0 },
    { id: 3, description: 'Loan Fees', amount: 0, previousAmount: 0, change: 0 },
    { id: 4, description: 'Savings Deposits', amount: 0, previousAmount: 0, change: 0 },
    { id: 5, description: 'Investor Deposits', amount: 0, previousAmount: 0, change: 0 },
    { id: 6, description: 'Other Income', amount: 0, previousAmount: 0, change: 0 },
  ],
  payments: [
    { id: 1, description: 'Loans Released (Principal)', amount: 1000000, previousAmount: 800000, change: 25 },
    { id: 2, description: 'Savings Withdrawals', amount: 0, previousAmount: 0, change: 0 },
    { id: 3, description: 'Investor Withdrawals', amount: 0, previousAmount: 0, change: 0 },
    { id: 4, description: 'Operating Expenses', amount: 0, previousAmount: 0, change: 0 },
    { id: 5, description: 'Payroll', amount: 0, previousAmount: 0, change: 0 },
    { id: 6, description: 'Other Expenses', amount: 0, previousAmount: 0, change: 0 },
  ]
})

// Computed properties
const totalReceipts = computed(() => {
  return cashFlowData.value.receipts.reduce((sum, item) => sum + item.amount, 0)
})

const totalPayments = computed(() => {
  return cashFlowData.value.payments.reduce((sum, item) => sum + item.amount, 0)
})

const netCashFlow = computed(() => {
  return totalReceipts.value - totalPayments.value
})

const totalBalance = computed(() => {
  return previousBalance.value + netCashFlow.value
})

const previousTotalReceipts = computed(() => {
  return cashFlowData.value.receipts.reduce((sum, item) => sum + item.previousAmount, 0)
})

const previousTotalPayments = computed(() => {
  return cashFlowData.value.payments.reduce((sum, item) => sum + item.previousAmount, 0)
})

const previousNetCashFlow = computed(() => {
  return previousTotalReceipts.value - previousTotalPayments.value
})

const previousPeriodTotalBalance = computed(() => {
  return previousBalance.value + previousNetCashFlow.value
})

const receiptsChange = computed(() => {
  if (previousTotalReceipts.value === 0) return 0
  return ((totalReceipts.value - previousTotalReceipts.value) / previousTotalReceipts.value) * 100
})

const paymentsChange = computed(() => {
  if (previousTotalPayments.value === 0) return 0
  return ((totalPayments.value - previousTotalPayments.value) / previousTotalPayments.value) * 100
})

const netCashFlowChange = computed(() => {
  if (previousNetCashFlow.value === 0) return 0
  return ((netCashFlow.value - previousNetCashFlow.value) / Math.abs(previousNetCashFlow.value)) * 100
})

const totalBalanceChange = computed(() => {
  if (previousPeriodTotalBalance.value === 0) return 0
  return ((totalBalance.value - previousPeriodTotalBalance.value) / Math.abs(previousPeriodTotalBalance.value)) * 100
})

const cashInflowRatio = computed(() => {
  const total = totalReceipts.value + totalPayments.value
  if (total === 0) return 0
  return Math.round((totalReceipts.value / total) * 100)
})

const cashOutflowRatio = computed(() => {
  const total = totalReceipts.value + totalPayments.value
  if (total === 0) return 0
  return Math.round((totalPayments.value / total) * 100)
})

const operatingCashFlow = computed(() => {
  // Simplified calculation - would be more complex in real implementation
  return netCashFlow.value
})

const cashConversionCycle = computed(() => {
  // Mock calculation - would need actual data in real implementation
  return 45
})

// Methods
const filterCashFlow = () => {
  // Trigger data refresh based on date range
  generateReport()
}

const generateReport = () => {
  console.log('Generating cash flow report for:', filters.value)
  // In a real app, this would fetch data from the backend
  showChart.value = true
}

const setQuickRange = (range: any) => {
  const today = new Date()
  let fromDate = new Date()
  let toDate = new Date()

  if (typeof range.days === 'number') {
    if (range.days === 0) {
      // Today
      fromDate = today
      toDate = today
    } else if (range.days === -1) {
      // Yesterday
      fromDate = new Date(today.setDate(today.getDate() - 1))
      toDate = fromDate
    } else {
      // Last X days
      fromDate = new Date(today.setDate(today.getDate() + range.days))
      toDate = new Date()
    }
  } else {
    // Handle month/quarter/year ranges
    switch (range.days) {
      case 'thisMonth':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1)
        toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break
      case 'lastMonth':
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        toDate = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      case 'thisQuarter':
        const quarter = Math.floor(today.getMonth() / 3)
        fromDate = new Date(today.getFullYear(), quarter * 3, 1)
        toDate = new Date(today.getFullYear(), quarter * 3 + 3, 0)
        break
      case 'thisYear':
        fromDate = new Date(today.getFullYear(), 0, 1)
        toDate = new Date(today.getFullYear(), 11, 31)
        break
      case 'lastYear':
        fromDate = new Date(today.getFullYear() - 1, 0, 1)
        toDate = new Date(today.getFullYear() - 1, 11, 31)
        break
    }
  }

  filters.value.fromDate = fromDate.toISOString().split('T')[0]
  filters.value.toDate = toDate.toISOString().split('T')[0]
  generateReport()
}

const showHelp = () => {
  alert('Cash Flow help: This report shows all cash inflows and outflows for the selected period.')
}

const exportCashFlow = () => {
  console.log('Exporting cash flow report')
  // Implement CSV/Excel export
}

const printCashFlow = () => {
  window.print()
}

const getPreviousDate = () => {
  const date = new Date(filters.value.fromDate)
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
}

// Utility functions
const formatDate = (date: string): string => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number): string => {
  return Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatPercentage = (value: number): string => {
  if (!value || !isFinite(value)) return '0%'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

const getChangeClass = (change: number): string => {
  if (change > 0) return 'text-green-600 font-medium'
  if (change < 0) return 'text-red-600 font-medium'
  return 'text-gray-500'
}

defineOptions({
  name: "CashFlow",
})

// Initialize
onMounted(() => {
  // Set default date range to current year
  const today = new Date()
  filters.value.fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
  filters.value.toDate = today.toISOString().split('T')[0]
})
</script>

<style scoped>
@media print {
  .btn,
  button {
    display: none !important;
  }
  
  .bg-blue-50 {
    display: none !important;
  }
}
</style>