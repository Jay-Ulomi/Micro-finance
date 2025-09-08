<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Cash Flow Monthly</h1>
        <p class="text-sm text-gray-600">Multi-period cash flow comparison</p>
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

    <!-- Date Range and Period Filter -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Select Date Range & Periods</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date:</label>
          <input
            v-model="filters.fromDate"
            type="date"
            class="form-input"
            @change="generateReport"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Date:</label>
          <input
            v-model="filters.toDate"
            type="date"
            class="form-input"
            @change="generateReport"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Number of Periods:</label>
          <select v-model="numberOfPeriods" @change="generateReport" class="form-input">
            <option :value="3">3 periods</option>
            <option :value="5">5 periods</option>
            <option :value="6">6 periods</option>
            <option :value="12">12 periods</option>
          </select>
        </div>

        <div class="flex items-end">
          <button @click="generateReport" class="btn btn-primary w-full">
            <ChartBarIcon class="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>
    </div>

    <!-- Multi-Period Cash Flow Statement -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200" ref="cashFlowReport">
      <!-- Report Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-900">Cash Flow Statement</h2>
        <div class="flex items-center justify-between mt-1">
          <p class="text-sm text-gray-600">
            {{ formatDate(filters.fromDate) }} to {{ formatDate(filters.toDate) }}
          </p>
          <p class="text-sm font-medium text-blue-600">
            {{ numberOfPeriods }} periods
          </p>
        </div>
      </div>

      <!-- Cash Flow Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Description
              </th>
              <th v-for="period in periods" :key="period.id" 
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                <div>{{ period.label }}</div>
                <div class="text-gray-400 font-normal">{{ period.dateRange }}</div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Receipts Section -->
            <tr class="bg-green-50">
              <td class="sticky left-0 z-10 bg-green-50 px-6 py-3 text-sm font-semibold text-green-900 border-r border-gray-200">
                RECEIPTS
              </td>
              <td v-for="period in periods" :key="period.id" colspan="1" class="px-6 py-3"></td>
            </tr>
            <tr v-for="receipt in receiptCategories" :key="receipt.id">
              <td class="sticky left-0 z-10 bg-white px-6 py-3 text-sm text-gray-900 pl-10 border-r border-gray-200">
                {{ receipt.description }}
              </td>
              <td v-for="period in periods" :key="`${receipt.id}-${period.id}`" 
                  class="px-6 py-3 text-sm text-gray-900 text-right font-mono">
                {{ formatCurrency(getAmount(receipt.id, period.id, 'receipts')) }}
              </td>
            </tr>
            <tr class="bg-green-100 font-semibold">
              <td class="sticky left-0 z-10 bg-green-100 px-6 py-3 text-sm text-green-900 border-r border-gray-200">
                Total Receipts (A)
              </td>
              <td v-for="period in periods" :key="`total-receipts-${period.id}`" 
                  class="px-6 py-3 text-sm text-green-900 text-right font-mono">
                {{ formatCurrency(getTotalReceipts(period.id)) }}
              </td>
            </tr>

            <!-- Blank Row -->
            <tr>
              <td class="sticky left-0 z-10 bg-white border-r border-gray-200" colspan="1"></td>
              <td v-for="period in periods" :key="`blank-1-${period.id}`" class="px-6 py-2"></td>
            </tr>

            <!-- Payments Section -->
            <tr class="bg-red-50">
              <td class="sticky left-0 z-10 bg-red-50 px-6 py-3 text-sm font-semibold text-red-900 border-r border-gray-200">
                PAYMENTS
              </td>
              <td v-for="period in periods" :key="`payments-header-${period.id}`" colspan="1" class="px-6 py-3"></td>
            </tr>
            <tr v-for="payment in paymentCategories" :key="payment.id">
              <td class="sticky left-0 z-10 bg-white px-6 py-3 text-sm text-gray-900 pl-10 border-r border-gray-200">
                {{ payment.description }}
              </td>
              <td v-for="period in periods" :key="`${payment.id}-${period.id}`" 
                  class="px-6 py-3 text-sm text-gray-900 text-right font-mono">
                {{ formatCurrency(getAmount(payment.id, period.id, 'payments')) }}
              </td>
            </tr>
            <tr class="bg-red-100 font-semibold">
              <td class="sticky left-0 z-10 bg-red-100 px-6 py-3 text-sm text-red-900 border-r border-gray-200">
                Total Payments (B)
              </td>
              <td v-for="period in periods" :key="`total-payments-${period.id}`" 
                  class="px-6 py-3 text-sm text-red-900 text-right font-mono">
                {{ formatCurrency(getTotalPayments(period.id)) }}
              </td>
            </tr>

            <!-- Blank Row -->
            <tr>
              <td class="sticky left-0 z-10 bg-white border-r border-gray-200" colspan="1"></td>
              <td v-for="period in periods" :key="`blank-2-${period.id}`" class="px-6 py-2"></td>
            </tr>

            <!-- Net Cash Flow -->
            <tr class="bg-gray-100 font-bold">
              <td class="sticky left-0 z-10 bg-gray-100 px-6 py-3 text-sm text-gray-900 border-r border-gray-200">
                Total Cash Balance (A) - (B)
              </td>
              <td v-for="period in periods" :key="`net-cash-${period.id}`" 
                  class="px-6 py-3 text-sm text-right font-mono"
                  :class="getNetCashFlow(period.id) >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrencyWithParentheses(getNetCashFlow(period.id)) }}
              </td>
            </tr>

            <!-- Previous Balance -->
            <tr>
              <td class="sticky left-0 z-10 bg-white px-6 py-3 text-sm text-gray-700 border-r border-gray-200">
                Previous Balance
              </td>
              <td v-for="period in periods" :key="`prev-balance-${period.id}`" 
                  class="px-6 py-3 text-sm text-gray-500">
                <div>Balance at {{ getPreviousBalanceDate(period) }}</div>
                <div class="text-gray-900 font-mono">{{ formatCurrency(getPreviousBalance(period.id)) }}</div>
              </td>
            </tr>

            <!-- Total Balance -->
            <tr class="bg-blue-100 font-bold text-lg">
              <td class="sticky left-0 z-10 bg-blue-100 px-6 py-4 text-blue-900 border-r border-gray-200">
                Total Balance
              </td>
              <td v-for="period in periods" :key="`total-balance-${period.id}`" 
                  class="px-6 py-4">
                <div class="text-xs font-normal text-blue-700">Balance at {{ period.endDate }}</div>
                <div class="text-right font-mono mt-1"
                     :class="getTotalBalance(period.id) >= 0 ? 'text-blue-900' : 'text-red-600'">
                  {{ formatCurrencyWithParentheses(getTotalBalance(period.id)) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary Statistics -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-xs text-gray-500 uppercase">Average Monthly Cash Flow</p>
            <p class="text-lg font-semibold" :class="averageCashFlow >= 0 ? 'text-green-600' : 'text-red-600'">
              TZS {{ formatCurrency(Math.abs(averageCashFlow)) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase">Total Period Movement</p>
            <p class="text-lg font-semibold" :class="totalMovement >= 0 ? 'text-green-600' : 'text-red-600'">
              TZS {{ formatCurrency(Math.abs(totalMovement)) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase">Cash Flow Trend</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ cashFlowTrend }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Trend Chart -->
    <div v-if="showChart" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Cash Flow Trend Analysis</h3>
      <div class="h-64 flex items-center justify-center text-gray-500">
        <ChartBarIcon class="w-12 h-12 mr-2" />
        Monthly cash flow trend chart would be displayed here
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

// Reactive data
const numberOfPeriods = ref(5)
const showChart = ref(false)

// Filters
const filters = ref({
  fromDate: '2025-04-01',
  toDate: '2025-09-06',
})

// Categories
const receiptCategories = [
  { id: 'loan-repayments', description: 'Loan Repayments (Principal)' },
  { id: 'loan-interest', description: 'Loan Interest Income' },
  { id: 'loan-fees', description: 'Loan Fees' },
  { id: 'savings-deposits', description: 'Savings Deposits' },
  { id: 'investor-deposits', description: 'Investor Deposits' },
  { id: 'other-income', description: 'Other Income' },
]

const paymentCategories = [
  { id: 'loans-released', description: 'Loans Released (Principal)' },
  { id: 'savings-withdrawals', description: 'Savings Withdrawals' },
  { id: 'investor-withdrawals', description: 'Investor Withdrawals' },
  { id: 'operating-expenses', description: 'Operating Expenses' },
  { id: 'payroll', description: 'Payroll' },
  { id: 'other-expenses', description: 'Other Expenses' },
]

// Mock data for periods - this would be calculated based on date range
const periods = computed(() => {
  const result = []
  const endDate = new Date(filters.value.toDate)
  
  for (let i = 0; i < numberOfPeriods.value; i++) {
    const periodEnd = new Date(endDate.getFullYear(), endDate.getMonth() - i, 0)
    const periodStart = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1)
    
    result.unshift({
      id: `period-${i}`,
      label: periodEnd.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      dateRange: `${periodStart.getDate()}${getOrdinalSuffix(periodStart.getDate())} ${periodStart.toLocaleDateString('en-US', { month: 'short' })} ${periodStart.getFullYear().toString().slice(-2)} - ${periodEnd.getDate()}${getOrdinalSuffix(periodEnd.getDate())} ${periodEnd.toLocaleDateString('en-US', { month: 'short' })} ${periodEnd.getFullYear().toString().slice(-2)}`,
      startDate: periodStart.toISOString().split('T')[0],
      endDate: `${periodEnd.getDate()}/${(periodEnd.getMonth() + 1).toString().padStart(2, '0')}/${periodEnd.getFullYear()}`,
    })
  }
  
  // Add current period if it's partial
  const currentPeriodEnd = new Date(filters.value.toDate)
  const currentPeriodStart = new Date(currentPeriodEnd.getFullYear(), currentPeriodEnd.getMonth(), 1)
  
  result.push({
    id: 'current-period',
    label: 'Current Period',
    dateRange: `${currentPeriodStart.getDate()}${getOrdinalSuffix(currentPeriodStart.getDate())} ${currentPeriodStart.toLocaleDateString('en-US', { month: 'short' })} ${currentPeriodStart.getFullYear().toString().slice(-2)} - ${currentPeriodEnd.getDate()}${getOrdinalSuffix(currentPeriodEnd.getDate())} ${currentPeriodEnd.toLocaleDateString('en-US', { month: 'short' })} ${currentPeriodEnd.getFullYear().toString().slice(-2)}`,
    startDate: currentPeriodStart.toISOString().split('T')[0],
    endDate: `${currentPeriodEnd.getDate().toString().padStart(2, '0')}/${(currentPeriodEnd.getMonth() + 1).toString().padStart(2, '0')}/${currentPeriodEnd.getFullYear()}`,
  })
  
  return result
})

// Mock cash flow data - in real app this would come from backend
const cashFlowData = ref({
  'current-period': {
    receipts: {},
    payments: {
      'loans-released': 1000000,
    }
  }
})

// Methods
const getAmount = (categoryId: string, periodId: string, type: 'receipts' | 'payments'): number => {
  const periodData = cashFlowData.value[periodId]
  if (!periodData) return 0
  return periodData[type]?.[categoryId] || 0
}

const getTotalReceipts = (periodId: string): number => {
  let total = 0
  receiptCategories.forEach(category => {
    total += getAmount(category.id, periodId, 'receipts')
  })
  return total
}

const getTotalPayments = (periodId: string): number => {
  let total = 0
  paymentCategories.forEach(category => {
    total += getAmount(category.id, periodId, 'payments')
  })
  return total
}

const getNetCashFlow = (periodId: string): number => {
  return getTotalReceipts(periodId) - getTotalPayments(periodId)
}

const getPreviousBalance = (periodId: string): number => {
  // In real app, this would be calculated from previous periods
  return 0
}

const getTotalBalance = (periodId: string): number => {
  return getPreviousBalance(periodId) + getNetCashFlow(periodId)
}

const getPreviousBalanceDate = (period: any): string => {
  const date = new Date(period.startDate)
  date.setDate(date.getDate() - 1)
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
}

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

// Computed properties
const averageCashFlow = computed(() => {
  let total = 0
  let count = 0
  periods.value.forEach(period => {
    total += getNetCashFlow(period.id)
    count++
  })
  return count > 0 ? total / count : 0
})

const totalMovement = computed(() => {
  let total = 0
  periods.value.forEach(period => {
    total += getNetCashFlow(period.id)
  })
  return total
})

const cashFlowTrend = computed(() => {
  const firstPeriod = periods.value[0]
  const lastPeriod = periods.value[periods.value.length - 1]
  
  const firstFlow = getNetCashFlow(firstPeriod.id)
  const lastFlow = getNetCashFlow(lastPeriod.id)
  
  if (lastFlow > firstFlow) return 'Improving ↑'
  if (lastFlow < firstFlow) return 'Declining ↓'
  return 'Stable →'
})

// Methods
const generateReport = () => {
  console.log('Generating multi-period cash flow report')
  showChart.value = true
  // In real app, fetch data from backend
}

const showHelp = () => {
  alert('Cash Flow Monthly: This report shows cash flow across multiple monthly periods for trend analysis.')
}

const exportCashFlow = () => {
  console.log('Exporting multi-period cash flow report')
  // Implement CSV/Excel export
}

const printCashFlow = () => {
  window.print()
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
  if (amount === 0) return '0'
  return Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatCurrencyWithParentheses = (amount: number): string => {
  const formatted = formatCurrency(Math.abs(amount))
  return amount < 0 ? `(${formatted})` : formatted
}

defineOptions({
  name: "CashFlowMonthly",
})

// Initialize
onMounted(() => {
  generateReport()
})
</script>

<style scoped>
/* Make the first column sticky for horizontal scrolling */
.sticky {
  position: sticky;
}

/* Custom scrollbar for the table */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
}

@media print {
  .btn,
  button {
    display: none !important;
  }
  
  .bg-blue-50 {
    display: none !important;
  }
  
  .sticky {
    position: static !important;
  }
}
</style>