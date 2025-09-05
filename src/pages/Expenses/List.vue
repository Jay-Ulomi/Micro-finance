<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View Expenses</h1>
        <p class="text-sm text-gray-600">Manage and track all business expenses</p>
      </div>
      <div class="flex space-x-3">
        <button @click="showHelp" class="btn btn-secondary">
          <QuestionMarkCircleIcon class="w-4 h-4 mr-2" />
          Help
        </button>
        <button @click="exportExpenses" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="addExpense" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Expense
        </button>
      </div>
    </div>

    <!-- Filter Expenses Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Filter Expenses</h3>
      
      <!-- Expense Categories -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in expenseCategories"
            :key="category"
            @click="toggleCategory(category)"
            :class="[
              'px-3 py-2 text-sm rounded-lg border transition-colors',
              selectedCategories.includes(category)
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Date and Bank Account Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- From Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date:</label>
          <input
            v-model="filters.fromDate"
            type="date"
            class="form-input"
            placeholder="dd/mm/yyyy"
            @change="filterExpenses"
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
            @change="filterExpenses"
          />
        </div>

        <!-- Bank Accounts -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Bank Accounts:</label>
          <select v-model="filters.bankAccount" class="form-input" @change="filterExpenses">
            <option value="">Select Bank Account</option>
            <option value="cash">Cash</option>
            <option value="crdb-001">CRDB Bank - 001234567</option>
            <option value="nb-002">NMB Bank - 002345678</option>
            <option value="tpb-003">TPB Bank - 003456789</option>
            <option value="equity-004">Equity Bank - 004567890</option>
          </select>
        </div>
      </div>

      <!-- Search Button -->
      <div class="flex justify-start">
        <button @click="searchRecords" class="btn btn-primary">
          <MagnifyingGlassIcon class="w-4 h-4 mr-2" />
          Search records
        </button>
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

    <!-- Expenses Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('date')">
                <div class="flex items-center">
                  Date
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('type')">
                <div class="flex items-center">
                  Type
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('amount')">
                <div class="flex items-center">
                  Amount
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Files
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recurring
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredExpenses.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="text-center">
                  <CurrencyDollarIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No expenses found</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    No expense records found for the selected criteria. Adjust your filters or add a new expense.
                  </p>
                  <div class="mt-6">
                    <button @click="addExpense" class="btn btn-primary">
                      <PlusIcon class="w-4 h-4 mr-2" />
                      Add Expense
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-for="expense in paginatedExpenses" :key="expense.id" class="hover:bg-gray-50">
              <!-- Action -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button @click="viewExpense(expense.id)" class="text-blue-600 hover:text-blue-900">
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button @click="editExpense(expense.id)" class="text-yellow-600 hover:text-yellow-900">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button @click="deleteExpense(expense.id)" class="text-red-600 hover:text-red-900">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
              
              <!-- Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <CalendarDaysIcon class="w-4 h-4 mr-2 text-gray-400" />
                  {{ formatDate(expense.date) }}
                </div>
              </td>
              
              <!-- Type -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getCategoryColor(expense.type)">
                  {{ expense.type }}
                </span>
              </td>
              
              <!-- Amount -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                <div class="flex items-center">
                  <CurrencyDollarIcon class="w-4 h-4 mr-1 text-gray-400" />
                  TZS {{ formatCurrency(expense.amount) }}
                </div>
              </td>
              
              <!-- Description -->
              <td class="px-6 py-4 text-sm text-gray-900">
                <div class="max-w-xs truncate" :title="expense.description">
                  {{ expense.description }}
                </div>
              </td>
              
              <!-- Files -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div v-if="expense.files && expense.files.length > 0" class="flex items-center">
                  <DocumentIcon class="w-4 h-4 mr-1 text-gray-400" />
                  <button @click="viewFiles(expense.id)" class="text-blue-600 hover:text-blue-900">
                    {{ expense.files.length }} file(s)
                  </button>
                </div>
                <span v-else class="text-gray-400">No files</span>
              </td>
              
              <!-- Recurring -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="expense.recurring" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <ArrowPathIcon class="w-3 h-3 mr-1" />
                  {{ expense.recurringFrequency }}
                </span>
                <span v-else class="text-gray-400">No</span>
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
  QuestionMarkCircleIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  DocumentIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Expense categories
const expenseCategories = [
  'Accommodation',
  'Advertising and Promotion',
  'Auto Expenses',
  'Bank/Finance Charges',
  'Cell Phone',
  'Computer Hardware',
  'Computer Software',
  'Insurance',
  'Leasing Payments',
  'Legal and Professional Fees',
  'Miscellaneous',
  'Office Equipment',
  'Office Rent',
  'Postage',
  'Printing',
  'Stationery',
  'Subscriptions',
  'Travel'
]

// Reactive data
const selectedCategories = ref<string[]>([])
const entriesPerPage = ref(20)
const currentPage = ref(1)
const sortField = ref('')
const sortDirection = ref('asc')

// Filters
const filters = ref({
  fromDate: '',
  toDate: '',
  bankAccount: ''
})

// Mock expense data (empty for now as shown in UI)
const expenses = ref([])

// Computed properties
const filteredExpenses = computed(() => {
  let filtered = expenses.value

  // Filter by selected categories
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(expense => 
      selectedCategories.value.includes(expense.type)
    )
  }

  // Filter by date range
  if (filters.value.fromDate) {
    filtered = filtered.filter(expense => expense.date >= filters.value.fromDate)
  }
  if (filters.value.toDate) {
    filtered = filtered.filter(expense => expense.date <= filters.value.toDate)
  }

  // Filter by bank account
  if (filters.value.bankAccount) {
    filtered = filtered.filter(expense => expense.bankAccount === filters.value.bankAccount)
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

const totalRecords = computed(() => filteredExpenses.value.length)
const totalPages = computed(() => Math.ceil(totalRecords.value / entriesPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * entriesPerPage.value, totalRecords.value))

const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value
  const end = start + entriesPerPage.value
  return filteredExpenses.value.slice(start, end)
})

// Methods
const toggleCategory = (category: string) => {
  const index = selectedCategories.value.indexOf(category)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(category)
  }
  filterExpenses()
}

const filterExpenses = () => {
  currentPage.value = 1
}

const searchRecords = () => {
  console.log('Searching expenses with filters:', {
    categories: selectedCategories.value,
    ...filters.value
  })
  filterExpenses()
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
  alert('Help functionality will be implemented here')
}

const exportExpenses = () => {
  console.log('Exporting all expenses')
}

const exportCurrentPage = () => {
  console.log('Exporting current page')
}

const exportAllPages = () => {
  console.log('Exporting all pages')
}

const addExpense = () => {
  router.push('/expenses/create')
}

const viewExpense = (id: string) => {
  router.push(`/expenses/${id}`)
}

const editExpense = (id: string) => {
  router.push(`/expenses/${id}/edit`)
}

const deleteExpense = (id: string) => {
  if (confirm('Are you sure you want to delete this expense?')) {
    console.log('Deleting expense:', id)
  }
}

const viewFiles = (id: string) => {
  console.log('Viewing files for expense:', id)
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
  return amount.toLocaleString('en-US')
}

const getCategoryColor = (category: string): string => {
  const colors = {
    'Accommodation': 'bg-blue-100 text-blue-800',
    'Advertising and Promotion': 'bg-purple-100 text-purple-800',
    'Auto Expenses': 'bg-green-100 text-green-800',
    'Bank/Finance Charges': 'bg-red-100 text-red-800',
    'Cell Phone': 'bg-indigo-100 text-indigo-800',
    'Computer Hardware': 'bg-gray-100 text-gray-800',
    'Computer Software': 'bg-cyan-100 text-cyan-800',
    'Insurance': 'bg-orange-100 text-orange-800',
    'Leasing Payments': 'bg-pink-100 text-pink-800',
    'Legal and Professional Fees': 'bg-yellow-100 text-yellow-800',
    'Office Equipment': 'bg-emerald-100 text-emerald-800',
    'Office Rent': 'bg-violet-100 text-violet-800',
    'Travel': 'bg-teal-100 text-teal-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

defineOptions({
  name: "ExpensesList",
});

// Initialize
onMounted(() => {
  // Load initial data
})
</script>
