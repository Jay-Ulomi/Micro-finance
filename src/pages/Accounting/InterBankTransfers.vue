<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Inter Bank Transfers</h1>
        <p class="text-sm text-gray-600">Manage transfers between bank accounts and cash</p>
      </div>
      <div class="flex space-x-3">
        <button @click="showHelp" class="btn btn-secondary">
          <QuestionMarkCircleIcon class="w-4 h-4 mr-2" />
          Help
        </button>
        <button @click="exportTransfers" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="addTransfer" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Transfer
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Filter Transfers</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <!-- Select Bank Account (From) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Bank Account</label>
          <select v-model="filters.fromAccount" class="form-input" @change="filterTransfers">
            <option value="">All Accounts</option>
            <option value="cash">Cash</option>
            <option v-for="account in bankAccounts" :key="account.id" :value="account.id">
              {{ account.name }} - {{ account.accountNumber }}
            </option>
          </select>
        </div>

        <!-- Select Bank Account (To) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Bank Account</label>
          <select v-model="filters.toAccount" class="form-input" @change="filterTransfers">
            <option value="">All Accounts</option>
            <option value="cash">Cash</option>
            <option v-for="account in bankAccounts" :key="account.id" :value="account.id">
              {{ account.name }} - {{ account.accountNumber }}
            </option>
          </select>
        </div>

        <!-- From Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date:</label>
          <input
            v-model="filters.fromDate"
            type="date"
            class="form-input"
            placeholder="dd/mm/yyyy"
            @change="filterTransfers"
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
            @change="filterTransfers"
          />
        </div>

        <!-- From Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Amount</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">TZS</span>
            <input
              v-model.number="filters.fromAmount"
              type="number"
              class="form-input pl-12"
              placeholder="0.00"
              step="0.01"
              min="0"
              @input="filterTransfers"
            />
          </div>
        </div>

        <!-- To Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Amount</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">TZS</span>
            <input
              v-model.number="filters.toAmount"
              type="number"
              class="form-input pl-12"
              placeholder="0.00"
              step="0.01"
              min="0"
              @input="filterTransfers"
            />
          </div>
        </div>
      </div>

      <!-- Additional Filters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Branch Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Branch:</label>
          <select v-model="filters.branch" class="form-input" @change="filterTransfers">
            <option value="">All Branches</option>
            <option value="main">Main Branch</option>
            <option value="north">North Branch</option>
            <option value="south">South Branch</option>
            <option value="east">East Branch</option>
            <option value="west">West Branch</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status:</label>
          <select v-model="filters.status" class="form-input" @change="filterTransfers">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Transfer Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Transfer Type:</label>
          <select v-model="filters.transferType" class="form-input" @change="filterTransfers">
            <option value="">All Types</option>
            <option value="bank-to-bank">Bank to Bank</option>
            <option value="bank-to-cash">Bank to Cash</option>
            <option value="cash-to-bank">Cash to Bank</option>
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
            <p class="text-xs text-gray-500 uppercase">Total Transfers</p>
            <p class="text-2xl font-bold text-gray-900">{{ filteredTransfers.length }}</p>
          </div>
          <ArrowsRightLeftIcon class="w-8 h-8 text-blue-500" />
        </div>
        <p class="text-xs text-gray-600 mt-2">This period</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase">Total Amount</p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalTransferAmount) }}</p>
          </div>
          <CurrencyDollarIcon class="w-8 h-8 text-green-500" />
        </div>
        <p class="text-xs text-gray-600 mt-2">TZS transferred</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase">Completed</p>
            <p class="text-2xl font-bold text-blue-600">{{ completedTransfers }}</p>
          </div>
          <CheckCircleIcon class="w-8 h-8 text-blue-500" />
        </div>
        <p class="text-xs text-gray-600 mt-2">{{ completedPercentage }}% success rate</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase">Pending</p>
            <p class="text-2xl font-bold text-orange-600">{{ pendingTransfers }}</p>
          </div>
          <ClockIcon class="w-8 h-8 text-orange-500" />
        </div>
        <p class="text-xs text-gray-600 mt-2">Awaiting processing</p>
      </div>
    </div>

    <!-- Controls Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center space-x-4">
          <button @click="exportCurrentPage" class="btn btn-secondary text-sm">
            Export Current Page
          </button>
          <button @click="exportAllPages" class="btn btn-secondary text-sm">
            Export All Pages
          </button>
        </div>
        
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

    <!-- Transfers Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('branch')">
                <div class="flex items-center">
                  Branch
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('fromAccount')">
                <div class="flex items-center">
                  From Bank Account
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('toAccount')">
                <div class="flex items-center">
                  To Bank Account
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('transferAmount')">
                <div class="flex items-center justify-end">
                  Transfer Amount
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('transferDate')">
                <div class="flex items-center">
                  Transfer Date
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredTransfers.length === 0">
              <td colspan="8" class="px-6 py-12 text-center">
                <div class="text-center">
                  <ArrowsRightLeftIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No transfers found</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    No transfer records found for the selected criteria. Adjust your filters or create a new transfer.
                  </p>
                  <div class="mt-6">
                    <button @click="addTransfer" class="btn btn-primary">
                      <PlusIcon class="w-4 h-4 mr-2" />
                      Add Transfer
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-for="transfer in paginatedTransfers" :key="transfer.id" class="hover:bg-gray-50">
              <!-- Action -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button @click="viewTransfer(transfer.id)" class="text-blue-600 hover:text-blue-900">
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button @click="editTransfer(transfer.id)" class="text-yellow-600 hover:text-yellow-900" 
                          :disabled="transfer.status === 'completed'">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button @click="printTransfer(transfer.id)" class="text-gray-600 hover:text-gray-900">
                    <PrinterIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
              
              <!-- Branch -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <HomeModernIcon class="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ transfer.branchName }}</div>
                    <div class="text-xs text-gray-500">{{ transfer.branchCode }}</div>
                  </div>
                </div>
              </td>
              
              <!-- From Account -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <component :is="getAccountIcon(transfer.fromAccountType)" class="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ transfer.fromAccountName }}</div>
                    <div class="text-xs text-gray-500">{{ transfer.fromAccountNumber }}</div>
                  </div>
                </div>
              </td>
              
              <!-- To Account -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <component :is="getAccountIcon(transfer.toAccountType)" class="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ transfer.toAccountName }}</div>
                    <div class="text-xs text-gray-500">{{ transfer.toAccountNumber }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Transfer Amount -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                <div class="flex items-center justify-end">
                  <CurrencyDollarIcon class="w-4 h-4 mr-1 text-gray-400" />
                  TZS {{ formatCurrency(transfer.transferAmount) }}
                </div>
              </td>
              
              <!-- Transfer Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <CalendarDaysIcon class="w-4 h-4 mr-2 text-gray-400" />
                  {{ formatDate(transfer.transferDate) }}
                </div>
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusColor(transfer.status)">
                  <span class="w-1.5 h-1.5 mr-1.5 rounded-full"
                        :class="getStatusDotColor(transfer.status)"></span>
                  {{ transfer.status }}
                </span>
              </td>
              
              <!-- Reference -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="text-sm font-mono text-gray-600">
                  {{ transfer.referenceNumber }}
                </span>
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

    <!-- Transfer Analytics -->
    <div v-if="showAnalytics" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Transfer Analytics</h3>
      <div class="h-64 flex items-center justify-center text-gray-500">
        <ChartBarIcon class="w-12 h-12 mr-2" />
        Transfer analytics chart would be displayed here
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
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChevronUpDownIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  PrinterIcon,
  HomeModernIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Mock bank accounts
const bankAccounts = [
  { id: 'bank-1', name: 'CRDB Bank', accountNumber: '001234567' },
  { id: 'bank-2', name: 'NMB Bank', accountNumber: '002345678' },
  { id: 'bank-3', name: 'TPB Bank', accountNumber: '003456789' },
  { id: 'bank-4', name: 'Equity Bank', accountNumber: '004567890' },
]

// Reactive data
const entriesPerPage = ref(20)
const currentPage = ref(1)
const sortField = ref('')
const sortDirection = ref('asc')
const showAnalytics = ref(false)

// Filters
const filters = ref({
  fromAccount: '',
  toAccount: '',
  fromDate: '',
  toDate: '',
  fromAmount: null as number | null,
  toAmount: null as number | null,
  branch: '',
  status: '',
  transferType: ''
})

// Mock transfer data
const transfers = ref([
  {
    id: 1,
    branchName: 'Main Branch',
    branchCode: 'MB001',
    fromAccountName: 'CRDB Bank',
    fromAccountNumber: '001234567',
    fromAccountType: 'bank',
    toAccountName: 'Cash',
    toAccountNumber: 'CASH001',
    toAccountType: 'cash',
    transferAmount: 500000,
    transferDate: '2025-09-05',
    status: 'completed',
    referenceNumber: 'TXN001234567'
  },
  {
    id: 2,
    branchName: 'North Branch',
    branchCode: 'NB001',
    fromAccountName: 'Cash',
    fromAccountNumber: 'CASH001',
    fromAccountType: 'cash',
    toAccountName: 'NMB Bank',
    toAccountNumber: '002345678',
    toAccountType: 'bank',
    transferAmount: 250000,
    transferDate: '2025-09-04',
    status: 'pending',
    referenceNumber: 'TXN001234568'
  },
  {
    id: 3,
    branchName: 'South Branch',
    branchCode: 'SB001',
    fromAccountName: 'TPB Bank',
    fromAccountNumber: '003456789',
    fromAccountType: 'bank',
    toAccountName: 'Equity Bank',
    toAccountNumber: '004567890',
    toAccountType: 'bank',
    transferAmount: 1000000,
    transferDate: '2025-09-03',
    status: 'completed',
    referenceNumber: 'TXN001234569'
  }
])

// Computed properties
const filteredTransfers = computed(() => {
  let filtered = [...transfers.value]

  // Apply filters
  if (filters.value.fromAccount) {
    filtered = filtered.filter(t => 
      t.fromAccountName.toLowerCase().includes(filters.value.fromAccount.toLowerCase()) ||
      t.fromAccountType === filters.value.fromAccount
    )
  }

  if (filters.value.toAccount) {
    filtered = filtered.filter(t => 
      t.toAccountName.toLowerCase().includes(filters.value.toAccount.toLowerCase()) ||
      t.toAccountType === filters.value.toAccount
    )
  }

  if (filters.value.fromDate) {
    filtered = filtered.filter(t => t.transferDate >= filters.value.fromDate)
  }

  if (filters.value.toDate) {
    filtered = filtered.filter(t => t.transferDate <= filters.value.toDate)
  }

  if (filters.value.fromAmount !== null) {
    filtered = filtered.filter(t => t.transferAmount >= filters.value.fromAmount!)
  }

  if (filters.value.toAmount !== null) {
    filtered = filtered.filter(t => t.transferAmount <= filters.value.toAmount!)
  }

  if (filters.value.branch) {
    filtered = filtered.filter(t => 
      t.branchCode.toLowerCase().includes(filters.value.branch.toLowerCase())
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(t => t.status === filters.value.status)
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

const totalRecords = computed(() => filteredTransfers.value.length)
const totalPages = computed(() => Math.ceil(totalRecords.value / entriesPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * entriesPerPage.value, totalRecords.value))

const paginatedTransfers = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value
  const end = start + entriesPerPage.value
  return filteredTransfers.value.slice(start, end)
})

// Summary calculations
const totalTransferAmount = computed(() => {
  return filteredTransfers.value.reduce((sum, transfer) => sum + transfer.transferAmount, 0)
})

const completedTransfers = computed(() => {
  return filteredTransfers.value.filter(t => t.status === 'completed').length
})

const pendingTransfers = computed(() => {
  return filteredTransfers.value.filter(t => t.status === 'pending').length
})

const completedPercentage = computed(() => {
  if (filteredTransfers.value.length === 0) return 0
  return Math.round((completedTransfers.value / filteredTransfers.value.length) * 100)
})

// Methods
const filterTransfers = () => {
  currentPage.value = 1
  showAnalytics.value = true
}

const searchRecords = () => {
  console.log('Searching transfers with filters:', filters.value)
  filterTransfers()
}

const resetFilters = () => {
  filters.value = {
    fromAccount: '',
    toAccount: '',
    fromDate: '',
    toDate: '',
    fromAmount: null,
    toAmount: null,
    branch: '',
    status: '',
    transferType: ''
  }
  filterTransfers()
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
  alert('Inter Bank Transfers: Manage and track all transfers between bank accounts and cash across your branches.')
}

const exportTransfers = () => {
  console.log('Exporting transfers data')
}

const exportCurrentPage = () => {
  console.log('Exporting current page')
}

const exportAllPages = () => {
  console.log('Exporting all pages')
}

const addTransfer = () => {
  router.push('/accounting/inter-bank-transfers/create')
}

const viewTransfer = (id: number) => {
  router.push(`/accounting/inter-bank-transfers/${id}`)
}

const editTransfer = (id: number) => {
  router.push(`/accounting/inter-bank-transfers/${id}/edit`)
}

const printTransfer = (id: number) => {
  console.log('Printing transfer:', id)
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
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getAccountIcon = (accountType: string) => {
  return accountType === 'cash' ? BanknotesIcon : BuildingLibraryIcon
}

const getStatusColor = (status: string): string => {
  const colors = {
    'completed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'failed': 'bg-red-100 text-red-800',
    'cancelled': 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusDotColor = (status: string): string => {
  const colors = {
    'completed': 'bg-green-500',
    'pending': 'bg-yellow-500',
    'failed': 'bg-red-500',
    'cancelled': 'bg-gray-500',
  }
  return colors[status] || 'bg-gray-500'
}

defineOptions({
  name: "InterBankTransfers",
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
}
</style>