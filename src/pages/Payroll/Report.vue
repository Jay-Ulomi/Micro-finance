<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Payroll Report</h1>
        <p class="text-sm text-gray-600">Generate detailed payroll reports with date range and staff filters</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportReport" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="printReport" class="btn btn-secondary">
          <PrinterIcon class="w-4 h-4 mr-2" />
          Print
        </button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Date Range</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- From Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            v-model="filters.fromDate"
            type="date"
            class="form-input"
            @change="updateReport"
          />
        </div>

        <!-- To Date -->
        <div class="flex items-center">
          <span class="text-sm text-gray-500 mr-2 mt-6">to</span>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            v-model="filters.toDate"
            type="date"
            class="form-input"
            @change="updateReport"
          />
        </div>
      </div>

      <!-- Staff Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Staff Selection</label>
          <div class="flex space-x-2">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-blue-700">ES</span>
                </div>
                <span class="text-sm font-medium text-blue-900">edwin simon</span>
                <button @click="removeStaff('edwin')" class="text-blue-600 hover:text-blue-800">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
              <div class="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-green-700">JU</span>
                </div>
                <span class="text-sm font-medium text-green-900">Joseph Ulomi</span>
                <button @click="removeStaff('joseph')" class="text-green-600 hover:text-green-800">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bank Account Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bank Account (Paid from)</label>
          <select v-model="filters.bankAccount" class="form-input" @change="updateReport">
            <option value="">Select Bank Account</option>
            <option value="cash">Cash</option>
            <option value="crdb-001">CRDB Bank - 001234567</option>
            <option value="nb-002">NMB Bank - 002345678</option>
            <option value="tpb-003">TPB Bank - 003456789</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Gross Amount -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CurrencyDollarIcon class="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium text-gray-500">Total Gross Amount</p>
            <p class="text-lg font-semibold text-gray-900">TZS {{ formatCurrency(summary.totalGross) }}</p>
          </div>
        </div>
      </div>

      <!-- Total Deductions Amount -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <MinusCircleIcon class="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium text-gray-500">Total Deductions Amount</p>
            <p class="text-lg font-semibold text-gray-900">TZS {{ formatCurrency(summary.totalDeductions) }}</p>
          </div>
        </div>
      </div>

      <!-- Total Net Amount -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <BanknotesIcon class="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium text-gray-500">Total Net Amount</p>
            <p class="text-lg font-semibold text-gray-900">TZS {{ formatCurrency(summary.totalNet) }}</p>
          </div>
        </div>
      </div>

      <!-- Total Paid Amount -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon class="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium text-gray-500">Total Paid Amount</p>
            <p class="text-lg font-semibold text-gray-900">TZS {{ formatCurrency(summary.totalPaid) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Controls -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button @click="searchPayroll" class="btn btn-primary">
          <MagnifyingGlassIcon class="w-4 h-4 mr-2" />
          Search payroll
        </button>
        
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Show</span>
          <select v-model="entriesPerPage" class="form-input mx-2">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="text-sm text-gray-500">entries</span>
        </div>
      </div>
    </div>

    <!-- Payroll Report Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pay Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pay Period
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gross
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deductions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recurring
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payslip
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="payrollData.length === 0">
              <td colspan="10" class="px-6 py-12 text-center">
                <div class="text-center">
                  <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No payroll data</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    No payroll records found for the selected criteria. Adjust your filters and try again.
                  </p>
                </div>
              </td>
            </tr>
            <tr v-for="payroll in paginatedPayroll" :key="payroll.id" class="hover:bg-gray-50">
              <!-- Pay Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(payroll.payDate) }}
              </td>
              
              <!-- Staff -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-600">
                        {{ payroll.staff.split(' ').map(n => n[0]).join('') }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ payroll.staff }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Pay Period -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ payroll.payPeriod }}
              </td>
              
              <!-- Gross -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                TZS {{ formatCurrency(payroll.gross) }}
              </td>
              
              <!-- Deductions -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-mono">
                TZS {{ formatCurrency(payroll.deductions) }}
              </td>
              
              <!-- Net -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-mono">
                TZS {{ formatCurrency(payroll.net) }}
              </td>
              
              <!-- Paid -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="payroll.paid" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircleIcon class="w-3 h-3 mr-1" />
                  Paid
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <ClockIcon class="w-3 h-3 mr-1" />
                  Pending
                </span>
              </td>
              
              <!-- Recurring -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="payroll.recurring" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <ArrowPathIcon class="w-3 h-3 mr-1" />
                  Yes
                </span>
                <span v-else class="text-sm text-gray-400">No</span>
              </td>
              
              <!-- Payslip -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="downloadPayslip(payroll.id)" class="text-blue-600 hover:text-blue-900 text-sm font-medium">
                  <DocumentArrowDownIcon class="w-4 h-4 inline mr-1" />
                  Download
                </button>
              </td>
              
              <!-- Action -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button @click="viewPayroll(payroll.id)" class="text-blue-600 hover:text-blue-900">
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button @click="editPayroll(payroll.id)" class="text-yellow-600 hover:text-yellow-900">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button @click="deletePayroll(payroll.id)" class="text-red-600 hover:text-red-900">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="text-sm text-gray-500">
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalRecords }} entries
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="btn btn-secondary text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              Previous
            </button>
            <div class="flex items-center space-x-1">
              <span class="text-sm text-gray-500">Page</span>
              <span class="text-sm font-medium text-gray-900">{{ currentPage }}</span>
              <span class="text-sm text-gray-500">of</span>
              <span class="text-sm font-medium text-gray-900">{{ totalPages }}</span>
            </div>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="btn btn-secondary text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  DocumentArrowDownIcon,
  PrinterIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  MinusCircleIcon,
  BanknotesIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive data
const entriesPerPage = ref(20)
const currentPage = ref(1)

// Filters
const filters = ref({
  fromDate: '',
  toDate: '',
  bankAccount: 'cash',
  selectedStaff: ['edwin simon', 'Joseph Ulomi']
})

// Summary data
const summary = ref({
  totalGross: 0,
  totalDeductions: 0,
  totalNet: 0,
  totalPaid: 0
})

// Mock payroll data (empty for now as shown in the UI)
const payrollData = ref([])

// Computed properties
const totalRecords = computed(() => payrollData.value.length)
const totalPages = computed(() => Math.ceil(totalRecords.value / entriesPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * entriesPerPage.value, totalRecords.value))

const paginatedPayroll = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value
  const end = start + entriesPerPage.value
  return payrollData.value.slice(start, end)
})

// Methods
const updateReport = () => {
  // Recalculate summary and filter data
  console.log('Updating report with filters:', filters.value)
}

const searchPayroll = () => {
  console.log('Searching payroll with current filters')
  updateReport()
}

const removeStaff = (staffKey: string) => {
  if (staffKey === 'edwin') {
    filters.value.selectedStaff = filters.value.selectedStaff.filter(s => s !== 'edwin simon')
  } else if (staffKey === 'joseph') {
    filters.value.selectedStaff = filters.value.selectedStaff.filter(s => s !== 'Joseph Ulomi')
  }
  updateReport()
}

const exportReport = () => {
  console.log('Exporting payroll report')
}

const printReport = () => {
  console.log('Printing payroll report')
}

const downloadPayslip = (payrollId: string) => {
  console.log('Downloading payslip for:', payrollId)
}

const viewPayroll = (payrollId: string) => {
  router.push(`/payroll/view/${payrollId}`)
}

const editPayroll = (payrollId: string) => {
  router.push(`/payroll/edit/${payrollId}`)
}

const deletePayroll = (payrollId: string) => {
  if (confirm('Are you sure you want to delete this payroll record?')) {
    console.log('Deleting payroll:', payrollId)
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US')
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Initialize
onMounted(() => {
  // Load initial data
  updateReport()
})
</script>