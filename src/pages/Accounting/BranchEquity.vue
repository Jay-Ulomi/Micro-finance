<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Branch Equity</h1>
        <p class="text-sm text-gray-600">Track equity position and capital movements by branch</p>
      </div>
      <div class="flex space-x-3">
        <button @click="showHelp" class="btn btn-secondary">
          <QuestionMarkCircleIcon class="w-4 h-4 mr-2" />
          Help
        </button>
        <button @click="exportEquity" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="printEquity" class="btn btn-secondary">
          <PrinterIcon class="w-4 h-4 mr-2" />
          Print
        </button>
        <button @click="addBranchCapital" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Branch Capital
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Filter Branch Equity</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- From Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date:</label>
          <input
            v-model="filters.fromDate"
            type="date"
            class="form-input"
            placeholder="dd/mm/yyyy"
            @change="filterEquity"
          />
        </div>

        <!-- To Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Date:</label>
          <input
            v-model="filters.toDate"
            type="date"
            class="form-input"
            placeholder="dd/mm/yyyy"
            @change="filterEquity"
          />
        </div>

        <!-- From Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Amount:</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">TZS</span>
            <input
              v-model.number="filters.fromAmount"
              type="number"
              class="form-input pl-12"
              placeholder="0.00"
              step="0.01"
              min="0"
              @input="filterEquity"
            />
          </div>
        </div>

        <!-- To Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Amount:</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">TZS</span>
            <input
              v-model.number="filters.toAmount"
              type="number"
              class="form-input pl-12"
              placeholder="0.00"
              step="0.01"
              min="0"
              @input="filterEquity"
            />
          </div>
        </div>
      </div>

      <!-- Additional Filters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Branch Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Branch:</label>
          <select v-model="filters.branch" class="form-input" @change="filterEquity">
            <option value="">All Branches</option>
            <option value="main">Main Branch</option>
            <option value="north">North Branch</option>
            <option value="south">South Branch</option>
            <option value="east">East Branch</option>
            <option value="west">West Branch</option>
          </select>
        </div>

        <!-- Equity Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Equity Type:</label>
          <select v-model="filters.equityType" class="form-input" @change="filterEquity">
            <option value="">All Types</option>
            <option value="share-capital">Share Capital</option>
            <option value="retained-earnings">Retained Earnings</option>
            <option value="reserves">Reserves</option>
            <option value="donations">Donations & Grants</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status:</label>
          <select v-model="filters.status" class="form-input" @change="filterEquity">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <!-- Search Button -->
      <div class="flex justify-between items-center">
        <button @click="searchRecords" class="btn btn-primary">
          <MagnifyingGlassIcon class="w-4 h-4 mr-2" />
          Search records
        </button>
        <button @click="resetFilters" class="btn btn-secondary">
          <ArrowPathIcon class="w-4 h-4 mr-2" />
          Reset filters
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase">Total Equity</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalEquity) }}</p>
          </div>
          <BuildingLibraryIcon class="w-8 h-8 text-blue-500" />
        </div>
        <p class="text-xs text-gray-600 mt-2">Across all branches</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase">Share Capital</p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalShareCapital) }}</p>
          </div>
          <CurrencyDollarIcon class="w-8 h-8 text-green-500" />
        </div>
        <p class="text-xs text-gray-600 mt-2">{{ shareCapitalPercentage }}% of total</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase">Retained Earnings</p>
            <p class="text-2xl font-bold text-indigo-600">{{ formatCurrency(totalRetainedEarnings) }}</p>
          </div>
          <ChartBarIcon class="w-8 h-8 text-indigo-500" />
        </div>
        <p class="text-xs text-gray-600 mt-2">{{ retainedEarningsPercentage }}% of total</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase">Active Branches</p>
            <p class="text-2xl font-bold text-purple-600">{{ activeBranches }}</p>
          </div>
          <HomeModernIcon class="w-8 h-8 text-purple-500" />
        </div>
        <p class="text-xs text-gray-600 mt-2">With equity records</p>
      </div>
    </div>

    <!-- Branch Equity Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 class="text-lg font-medium text-gray-900">Branch Equity Details</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('date')">
                <div class="flex items-center">
                  Date
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('shareCapital')">
                <div class="flex items-center justify-end">
                  Share Capital
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('retainedEarnings')">
                <div class="flex items-center justify-end">
                  Retained Earnings
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('reserves')">
                <div class="flex items-center justify-end">
                  Reserves
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('donations')">
                <div class="flex items-center justify-end">
                  Donations/Grants
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('totalEquity')">
                <div class="flex items-center justify-end">
                  Total Equity
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredEquity.length === 0">
              <td colspan="10" class="px-6 py-12 text-center">
                <div class="text-center">
                  <BuildingLibraryIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No equity records found</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Adjust your filters or add new equity records to see data here.
                  </p>
                  <div class="mt-6">
                    <button @click="addEquityRecord" class="btn btn-primary">
                      <PlusIcon class="w-4 h-4 mr-2" />
                      Add Equity Record
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-for="equity in paginatedEquity" :key="equity.id" class="hover:bg-gray-50">
              <!-- Branch -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <HomeModernIcon class="w-5 h-5 mr-2 text-gray-400" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ equity.branchName }}</div>
                    <div class="text-xs text-gray-500">{{ equity.branchCode }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(equity.date) }}
              </td>
              
              <!-- Type -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getTypeColor(equity.type)">
                  {{ equity.type }}
                </span>
              </td>
              
              <!-- Share Capital -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                {{ formatCurrency(equity.shareCapital) }}
              </td>
              
              <!-- Retained Earnings -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-mono"
                  :class="equity.retainedEarnings >= 0 ? 'text-gray-900' : 'text-red-600'">
                {{ formatCurrency(equity.retainedEarnings) }}
              </td>
              
              <!-- Reserves -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                {{ formatCurrency(equity.reserves) }}
              </td>
              
              <!-- Donations/Grants -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                {{ formatCurrency(equity.donations) }}
              </td>
              
              <!-- Total Equity -->
              <td class="px-6 py-4 whitespace-nowrap text-right font-mono">
                <span class="text-sm font-semibold"
                      :class="equity.totalEquity >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatCurrency(equity.totalEquity) }}
                </span>
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusColor(equity.status)">
                  <span class="w-1.5 h-1.5 mr-1.5 rounded-full"
                        :class="getStatusDotColor(equity.status)"></span>
                  {{ equity.status }}
                </span>
              </td>
              
              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div class="flex items-center justify-center space-x-2">
                  <button @click="viewEquity(equity.id)" class="text-blue-600 hover:text-blue-900">
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button @click="editEquity(equity.id)" class="text-yellow-600 hover:text-yellow-900">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button @click="printEquityRecord(equity.id)" class="text-gray-600 hover:text-gray-900">
                    <PrinterIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <!-- Table Footer with Totals -->
          <tfoot class="bg-gray-50 font-semibold">
            <tr>
              <td colspan="3" class="px-6 py-3 text-sm text-gray-900">
                Totals
              </td>
              <td class="px-6 py-3 text-sm text-gray-900 text-right font-mono">
                {{ formatCurrency(columnTotals.shareCapital) }}
              </td>
              <td class="px-6 py-3 text-sm text-right font-mono"
                  :class="columnTotals.retainedEarnings >= 0 ? 'text-gray-900' : 'text-red-600'">
                {{ formatCurrency(columnTotals.retainedEarnings) }}
              </td>
              <td class="px-6 py-3 text-sm text-gray-900 text-right font-mono">
                {{ formatCurrency(columnTotals.reserves) }}
              </td>
              <td class="px-6 py-3 text-sm text-gray-900 text-right font-mono">
                {{ formatCurrency(columnTotals.donations) }}
              </td>
              <td class="px-6 py-3 text-sm text-right font-mono"
                  :class="columnTotals.totalEquity >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(columnTotals.totalEquity) }}
              </td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200">
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

    <!-- Equity Movement Chart -->
    <div v-if="showChart" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Equity Movement Analysis</h3>
      <div class="h-64 flex items-center justify-center text-gray-500">
        <ChartBarIcon class="w-12 h-12 mr-2" />
        Equity movement chart would be displayed here
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
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChevronUpDownIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  HomeModernIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive data
const entriesPerPage = ref(10)
const currentPage = ref(1)
const sortField = ref('')
const sortDirection = ref('asc')
const showChart = ref(false)

// Filters
const filters = ref({
  fromDate: '',
  toDate: '',
  fromAmount: null as number | null,
  toAmount: null as number | null,
  branch: '',
  equityType: '',
  status: ''
})

// Mock equity data
const branchEquity = ref([
  {
    id: 1,
    branchName: 'Main Branch',
    branchCode: 'MB001',
    date: '2025-09-01',
    type: 'Monthly',
    shareCapital: 5000000,
    retainedEarnings: 2500000,
    reserves: 1000000,
    donations: 500000,
    totalEquity: 9000000,
    status: 'Active'
  },
  {
    id: 2,
    branchName: 'North Branch',
    branchCode: 'NB001',
    date: '2025-09-01',
    type: 'Monthly',
    shareCapital: 3000000,
    retainedEarnings: 1500000,
    reserves: 750000,
    donations: 250000,
    totalEquity: 5500000,
    status: 'Active'
  },
  {
    id: 3,
    branchName: 'South Branch',
    branchCode: 'SB001',
    date: '2025-09-01',
    type: 'Monthly',
    shareCapital: 2500000,
    retainedEarnings: -500000,
    reserves: 500000,
    donations: 100000,
    totalEquity: 2600000,
    status: 'Active'
  }
])

// Computed properties
const filteredEquity = computed(() => {
  let filtered = [...branchEquity.value]

  // Filter by date range
  if (filters.value.fromDate) {
    filtered = filtered.filter(equity => equity.date >= filters.value.fromDate)
  }
  if (filters.value.toDate) {
    filtered = filtered.filter(equity => equity.date <= filters.value.toDate)
  }

  // Filter by amount range
  if (filters.value.fromAmount !== null) {
    filtered = filtered.filter(equity => equity.totalEquity >= filters.value.fromAmount!)
  }
  if (filters.value.toAmount !== null) {
    filtered = filtered.filter(equity => equity.totalEquity <= filters.value.toAmount!)
  }

  // Filter by branch
  if (filters.value.branch) {
    filtered = filtered.filter(equity => 
      equity.branchCode.toLowerCase().includes(filters.value.branch.toLowerCase())
    )
  }

  // Filter by status
  if (filters.value.status) {
    filtered = filtered.filter(equity => 
      equity.status.toLowerCase() === filters.value.status.toLowerCase()
    )
  }

  // Apply sorting
  if (sortField.value) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection.value === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal)
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
      }

      return 0
    })
  }

  return filtered
})

const totalRecords = computed(() => filteredEquity.value.length)
const totalPages = computed(() => Math.ceil(totalRecords.value / entriesPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * entriesPerPage.value, totalRecords.value))

const paginatedEquity = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value
  const end = start + entriesPerPage.value
  return filteredEquity.value.slice(start, end)
})

// Summary calculations
const totalEquity = computed(() => {
  return filteredEquity.value.reduce((sum, equity) => sum + equity.totalEquity, 0)
})

const totalShareCapital = computed(() => {
  return filteredEquity.value.reduce((sum, equity) => sum + equity.shareCapital, 0)
})

const totalRetainedEarnings = computed(() => {
  return filteredEquity.value.reduce((sum, equity) => sum + equity.retainedEarnings, 0)
})

const shareCapitalPercentage = computed(() => {
  if (totalEquity.value === 0) return 0
  return Math.round((totalShareCapital.value / totalEquity.value) * 100)
})

const retainedEarningsPercentage = computed(() => {
  if (totalEquity.value === 0) return 0
  return Math.round((Math.abs(totalRetainedEarnings.value) / totalEquity.value) * 100)
})

const activeBranches = computed(() => {
  return new Set(filteredEquity.value.map(e => e.branchCode)).size
})

const columnTotals = computed(() => {
  return {
    shareCapital: filteredEquity.value.reduce((sum, e) => sum + e.shareCapital, 0),
    retainedEarnings: filteredEquity.value.reduce((sum, e) => sum + e.retainedEarnings, 0),
    reserves: filteredEquity.value.reduce((sum, e) => sum + e.reserves, 0),
    donations: filteredEquity.value.reduce((sum, e) => sum + e.donations, 0),
    totalEquity: filteredEquity.value.reduce((sum, e) => sum + e.totalEquity, 0),
  }
})

// Methods
const filterEquity = () => {
  currentPage.value = 1
  showChart.value = true
}

const searchRecords = () => {
  console.log('Searching equity records with filters:', filters.value)
  filterEquity()
}

const resetFilters = () => {
  filters.value = {
    fromDate: '',
    toDate: '',
    fromAmount: null,
    toAmount: null,
    branch: '',
    equityType: '',
    status: ''
  }
  filterEquity()
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const showHelp = () => {
  alert('Branch Equity: Track and analyze equity positions across all branches including share capital, retained earnings, reserves, and donations.')
}

const exportEquity = () => {
  console.log('Exporting branch equity data')
}

const printEquity = () => {
  window.print()
}

const addEquityRecord = () => {
  router.push('/accounting/branch-equity/create')
}

const addBranchCapital = () => {
  router.push('/accounting/branch-equity/create')
}

const viewEquity = (id: number) => {
  router.push(`/accounting/branch-equity/${id}`)
}

const editEquity = (id: number) => {
  router.push(`/accounting/branch-equity/${id}/edit`)
}

const printEquityRecord = (id: number) => {
  console.log('Printing equity record:', id)
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
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatCurrency = (amount: number): string => {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return amount < 0 ? `(${formatted})` : formatted
}

const getTypeColor = (type: string): string => {
  const colors = {
    'Monthly': 'bg-blue-100 text-blue-800',
    'Quarterly': 'bg-purple-100 text-purple-800',
    'Annual': 'bg-green-100 text-green-800',
    'Adjustment': 'bg-orange-100 text-orange-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

const getStatusColor = (status: string): string => {
  const colors = {
    'Active': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Closed': 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusDotColor = (status: string): string => {
  const colors = {
    'Active': 'bg-green-500',
    'Pending': 'bg-yellow-500',
    'Closed': 'bg-gray-500',
  }
  return colors[status] || 'bg-gray-500'
}

defineOptions({
  name: "BranchEquity",
})

// Initialize
onMounted(() => {
  // Load initial data
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