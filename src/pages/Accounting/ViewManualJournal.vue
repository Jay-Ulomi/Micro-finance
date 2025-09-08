<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View Manual Journal</h1>
        <p class="text-sm text-gray-600">View and manage manual journal entries</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportData" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="createJournal" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Create Journal
        </button>
      </div>
    </div>

    <!-- Account Selection -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Select Accounts</h3>
      
      <!-- Account Selection Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
        <label v-for="account in chartOfAccounts" :key="account.code" 
               class="flex items-start space-x-2 p-2 hover:bg-white rounded transition-colors">
          <input 
            type="checkbox" 
            :value="account.code"
            v-model="selectedAccounts"
            class="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div class="flex-1 min-w-0">
            <div class="text-xs font-mono text-gray-600">{{ account.code }}</div>
            <div class="text-xs text-gray-900 truncate">{{ account.name }}</div>
          </div>
        </label>
      </div>
      
      <div class="mt-4 flex flex-wrap gap-2">
        <button @click="selectAll" class="text-xs btn btn-secondary">Select All</button>
        <button @click="clearSelection" class="text-xs btn btn-secondary">Clear All</button>
        <button @click="selectAssets" class="text-xs btn btn-secondary">Assets</button>
        <button @click="selectLiabilities" class="text-xs btn btn-secondary">Liabilities</button>
        <button @click="selectEquity" class="text-xs btn btn-secondary">Equity</button>
        <button @click="selectRevenue" class="text-xs btn btn-secondary">Revenue</button>
        <button @click="selectExpenses" class="text-xs btn btn-secondary">Expenses</button>
      </div>
    </div>

    <!-- Journal Narration -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Journal Narration</h3>
      <textarea
        v-model="journalNarration"
        rows="3"
        placeholder="Enter journal narration to filter by description..."
        class="form-textarea w-full"
      ></textarea>
      <p class="text-xs text-gray-500 mt-2">
        Only staff who have entered manual journals in your entire account are shown
      </p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            v-model="fromDate"
            type="date"
            placeholder="dd/mm/yyyy"
            class="form-input w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            v-model="toDate"
            type="date"
            placeholder="dd/mm/yyyy"
            class="form-input w-full"
          />
        </div>
        
        <!-- Amount Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Amount</label>
          <input
            v-model="fromAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            class="form-input w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Amount</label>
          <input
            v-model="toAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            class="form-input w-full"
          />
        </div>
      </div>

      <!-- Journal Status -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Journal Status</label>
        <div class="flex flex-wrap gap-4">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="showPostedJournals"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Posted Journals</span>
          </label>
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="showDraftJournals"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Draft Journals</span>
          </label>
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="showDeletedJournals"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Deleted Journals</span>
          </label>
        </div>
      </div>

      <!-- Search Posted Journal -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Search Posted Journal</label>
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posted journal..."
            class="form-input pl-10 w-full"
          />
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="mt-6 flex flex-wrap gap-3">
        <button @click="applyFilters" class="btn btn-primary">
          <FunnelIcon class="w-4 h-4 mr-2" />
          Apply Filters
        </button>
        <button @click="clearFilters" class="btn btn-secondary">
          <XMarkIcon class="w-4 h-4 mr-2" />
          Clear Filters
        </button>
        <button @click="saveFilterPreset" class="btn btn-secondary">
          <BookmarkIcon class="w-4 h-4 mr-2" />
          Save Preset
        </button>
      </div>
    </div>

    <!-- Results Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Table Controls -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-700">Show</span>
              <select v-model="entriesPerPage" class="form-select text-sm">
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
              </select>
              <span class="text-sm text-gray-700">entries</span>
            </div>
            <div class="text-sm text-gray-600">
              Total: {{ totalRecords }} journals
            </div>
          </div>
          <div class="text-sm text-gray-600">
            Balance: TZS {{ formatCurrency(totalDebitAmount - totalCreditAmount) }}
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('narration')">
                <div class="flex items-center">
                  Narration
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('branch')">
                <div class="flex items-center">
                  Branch
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('date')">
                <div class="flex items-center">
                  Date
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('debitAmount')">
                <div class="flex items-center justify-end">
                  Debit Amount
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('creditAmount')">
                <div class="flex items-center justify-end">
                  Credit Amount
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Download
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- No Results -->
            <tr v-if="filteredJournals.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="text-center">
                  <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No journal entries found</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    No manual journal entries match your current filter criteria.
                  </p>
                  <div class="mt-6">
                    <button @click="createJournal" class="btn btn-primary">
                      <PlusIcon class="w-4 h-4 mr-2" />
                      Create First Journal
                    </button>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Journal Entries -->
            <tr v-for="journal in paginatedJournals" :key="journal.id" class="hover:bg-gray-50">
              <!-- Narration -->
              <td class="px-6 py-4">
                <div class="max-w-xs">
                  <div class="text-sm font-medium text-gray-900 truncate">{{ journal.narration }}</div>
                  <div class="text-xs text-gray-500">{{ journal.reference }}</div>
                  <div class="mt-1">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          :class="getStatusColor(journal.status)">
                      {{ journal.status }}
                    </span>
                  </div>
                </div>
              </td>
              
              <!-- Branch -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ journal.branch }}</div>
              </td>
              
              <!-- Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(journal.date) }}</div>
                <div class="text-xs text-gray-500">{{ journal.createdBy }}</div>
              </td>
              
              <!-- Debit Amount -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="text-sm font-medium text-gray-900">
                  {{ journal.debitAmount > 0 ? formatCurrency(journal.debitAmount) : '-' }}
                </div>
              </td>
              
              <!-- Credit Amount -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="text-sm font-medium text-gray-900">
                  {{ journal.creditAmount > 0 ? formatCurrency(journal.creditAmount) : '-' }}
                </div>
              </td>
              
              <!-- Download -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button @click="downloadJournal(journal.id)" 
                        class="text-blue-600 hover:text-blue-900">
                  <ArrowDownTrayIcon class="w-4 h-4" />
                </button>
              </td>
              
              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button 
                    @click="viewJournal(journal.id)" 
                    class="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="journal.status === 'Draft'"
                    @click="editJournal(journal.id)" 
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Edit"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="journal.status !== 'Deleted'"
                    @click="deleteJournal(journal.id)" 
                    class="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary Footer -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between text-sm">
          <div class="flex space-x-8">
            <div>
              <span class="font-medium text-gray-700">Total Debit:</span>
              <span class="text-gray-900 ml-2">TZS {{ formatCurrency(totalDebitAmount) }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Total Credit:</span>
              <span class="text-gray-900 ml-2">TZS {{ formatCurrency(totalCreditAmount) }}</span>
            </div>
            <div :class="totalDebitAmount === totalCreditAmount ? 'text-green-600' : 'text-red-600'">
              <span class="font-medium">Difference:</span>
              <span class="ml-2">TZS {{ formatCurrency(Math.abs(totalDebitAmount - totalCreditAmount)) }}</span>
            </div>
          </div>
        </div>
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
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  BookmarkIcon,
  ChevronUpDownIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive data
const selectedAccounts = ref<string[]>([])
const journalNarration = ref('')
const fromDate = ref('')
const toDate = ref('')
const fromAmount = ref<number | null>(null)
const toAmount = ref<number | null>(null)
const showPostedJournals = ref(true)
const showDraftJournals = ref(true)
const showDeletedJournals = ref(false)
const searchQuery = ref('')
const entriesPerPage = ref(20)
const currentPage = ref(1)
const sortField = ref('date')
const sortDirection = ref('desc')

// Chart of Accounts data
const chartOfAccounts = ref([
  // Assets
  { code: '1010', name: 'Cash', group: 'Assets' },
  { code: '1110', name: 'Lender Investments', group: 'Assets' },
  { code: '1210', name: 'Gross Loans - Principal', group: 'Assets' },
  { code: '1310', name: 'Receivable - Interest on Loans', group: 'Assets' },
  { code: '1320', name: 'Receivable - Fee and Commission on Loans', group: 'Assets' },
  { code: '1330', name: 'Receivable - Penalty on Loans', group: 'Assets' },
  { code: '1340', name: 'Receivable - Revenue on Borrower Saving Deposits', group: 'Assets' },
  { code: '1350', name: 'Receivable - Revenue on Investor Deposits', group: 'Assets' },
  { code: '1360', name: 'Receivable - Non-operating Revenue', group: 'Assets' },
  { code: '1510', name: 'Current Assets', group: 'Assets' },
  { code: '1610', name: 'Non-current Asset', group: 'Assets' },
  { code: '1611', name: 'Accumulated Depreciation and Amortization', group: 'Assets' },

  // Liabilities
  { code: '2010', name: 'Payable - On Borrower Saving Deposits', group: 'Liabilities' },
  { code: '2020', name: 'Payable - On Investor Deposits', group: 'Liabilities' },
  { code: '2030', name: 'Payable - On Merchant Borrowings', group: 'Liabilities' },
  { code: '2040', name: 'Payable - Payroll Expenses', group: 'Liabilities' },
  { code: '2050', name: 'Payable - Non-operating Expenses', group: 'Liabilities' },
  { code: '2060', name: 'Payable - Miscellaneous Expenses', group: 'Liabilities' },
  { code: '2070', name: 'Payable - Fee and Commission on Loans', group: 'Liabilities' },
  { code: '2110', name: 'Current Liabilities', group: 'Liabilities' },
  { code: '2310', name: 'Borrower Saving Deposits', group: 'Liabilities' },
  { code: '2410', name: 'Investor Deposits', group: 'Liabilities' },
  { code: '2610', name: 'Accumulated Loan Impairment', group: 'Liabilities' },
  { code: '2810', name: 'Income Tax Liability', group: 'Liabilities' },

  // Equity
  { code: '3010', name: 'Branch Equity', group: 'Equity' },
  { code: '3110', name: 'Retained Earnings (previous years)', group: 'Equity' },

  // Revenue
  { code: '4010', name: 'Interest on Loans', group: 'Revenue' },
  { code: '4020', name: 'Fee and Commission on Loans', group: 'Revenue' },
  { code: '4030', name: 'Penalty on Loans', group: 'Revenue' },
  { code: '4050', name: 'Revenue from Defaulted Loans - Principal', group: 'Revenue' },
  { code: '4060', name: 'Revenue from Restructured Loans', group: 'Revenue' },
  { code: '4210', name: 'Revenue from Borrower Saving Deposits', group: 'Revenue' },
  { code: '4310', name: 'Revenue from Investor Deposits', group: 'Revenue' },
  { code: '4510', name: 'Non-operating Revenue', group: 'Revenue' },
  { code: '4610', name: 'Subsidy', group: 'Revenue' },

  // Expenses
  { code: '5110', name: 'Provision for Impairment - Loan Principal', group: 'Expenses' },
  { code: '5111', name: 'Provision for Impairment - Interest on Loans', group: 'Expenses' },
  { code: '5112', name: 'Provision for Impairment - Fees and Commission on Loans', group: 'Expenses' },
  { code: '5113', name: 'Provision for Impairment - Penalty on Loans', group: 'Expenses' },
  { code: '5120', name: 'Default - Loan Principal', group: 'Expenses' },
  { code: '5121', name: 'Default - Interest on Loans', group: 'Expenses' },
  { code: '5122', name: 'Default - Fees and Commission on Loans', group: 'Expenses' },
  { code: '5123', name: 'Default - Penalty on Loans', group: 'Expenses' },
  { code: '5130', name: 'Depreciation and Amortization Expenses', group: 'Expenses' },
  { code: '5140', name: 'Restructured - Loan Principal', group: 'Expenses' },
  { code: '5141', name: 'Restructured - Interest on Loans', group: 'Expenses' },
  { code: '5142', name: 'Restructured - Fees and Commission on Loans', group: 'Expenses' },
  { code: '5143', name: 'Restructured - Penalty on Loans', group: 'Expenses' },
  { code: '5150', name: 'Loss (or Gain) on Asset Disposal', group: 'Expenses' },
  { code: '5210', name: 'Payroll Expenses', group: 'Expenses' },
  { code: '5230', name: 'Exchange Rate Losses (Gains)', group: 'Expenses' },
  { code: '5310', name: 'Expenses on Borrower Saving Deposits', group: 'Expenses' },
  { code: '5410', name: 'Expenses on Investor Deposits', group: 'Expenses' },
  { code: '5510', name: 'Expense on Merchant Borrowings', group: 'Expenses' },
  { code: '5610', name: 'Non-operating Expenses', group: 'Expenses' },
  { code: '5710', name: 'Income Tax Expense', group: 'Expenses' }
])

// Sample journal entries data
const journalEntries = ref([
  {
    id: 'MJ-2024-001',
    narration: 'Initial capital injection',
    reference: 'REF-001',
    branch: 'Main Branch',
    date: '2024-01-15',
    debitAmount: 1000000,
    creditAmount: 0,
    status: 'Posted',
    createdBy: 'John Doe'
  },
  {
    id: 'MJ-2024-002',
    narration: 'Equipment purchase',
    reference: 'REF-002',
    branch: 'Main Branch',
    date: '2024-01-16',
    debitAmount: 0,
    creditAmount: 500000,
    status: 'Posted',
    createdBy: 'Jane Smith'
  },
  {
    id: 'MJ-2024-003',
    narration: 'Loan disbursement adjustment',
    reference: 'REF-003',
    branch: 'Branch A',
    date: '2024-01-17',
    debitAmount: 250000,
    creditAmount: 250000,
    status: 'Draft',
    createdBy: 'Mike Johnson'
  }
])

// Computed properties
const filteredJournals = computed(() => {
  let filtered = [...journalEntries.value]

  // Apply status filters
  filtered = filtered.filter(journal => {
    if (journal.status === 'Posted' && !showPostedJournals.value) return false
    if (journal.status === 'Draft' && !showDraftJournals.value) return false
    if (journal.status === 'Deleted' && !showDeletedJournals.value) return false
    return true
  })

  // Apply date filters
  if (fromDate.value) {
    filtered = filtered.filter(journal => new Date(journal.date) >= new Date(fromDate.value))
  }
  if (toDate.value) {
    filtered = filtered.filter(journal => new Date(journal.date) <= new Date(toDate.value))
  }

  // Apply amount filters
  if (fromAmount.value !== null) {
    filtered = filtered.filter(journal => 
      Math.max(journal.debitAmount, journal.creditAmount) >= fromAmount.value!
    )
  }
  if (toAmount.value !== null) {
    filtered = filtered.filter(journal => 
      Math.max(journal.debitAmount, journal.creditAmount) <= toAmount.value!
    )
  }

  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(journal =>
      journal.narration.toLowerCase().includes(query) ||
      journal.reference.toLowerCase().includes(query) ||
      journal.branch.toLowerCase().includes(query) ||
      journal.createdBy.toLowerCase().includes(query)
    )
  }

  // Apply narration filter
  if (journalNarration.value) {
    const narration = journalNarration.value.toLowerCase()
    filtered = filtered.filter(journal =>
      journal.narration.toLowerCase().includes(narration)
    )
  }

  // Apply sorting
  if (sortField.value) {
    filtered.sort((a, b) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]

      if (sortField.value === 'date') {
        const aDate = new Date(aVal).getTime()
        const bDate = new Date(bVal).getTime()
        return sortDirection.value === 'asc' ? aDate - bDate : bDate - aDate
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection.value === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal)
      }

      return 0
    })
  }

  return filtered
})

const totalRecords = computed(() => filteredJournals.value.length)
const totalPages = computed(() => Math.ceil(totalRecords.value / entriesPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * entriesPerPage.value, totalRecords.value))

const paginatedJournals = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value
  const end = start + entriesPerPage.value
  return filteredJournals.value.slice(start, end)
})

const totalDebitAmount = computed(() => 
  filteredJournals.value.reduce((sum, journal) => sum + journal.debitAmount, 0)
)

const totalCreditAmount = computed(() => 
  filteredJournals.value.reduce((sum, journal) => sum + journal.creditAmount, 0)
)

// Methods
const selectAll = () => {
  selectedAccounts.value = chartOfAccounts.value.map(account => account.code)
}

const clearSelection = () => {
  selectedAccounts.value = []
}

const selectAssets = () => {
  selectedAccounts.value = chartOfAccounts.value
    .filter(account => account.group === 'Assets')
    .map(account => account.code)
}

const selectLiabilities = () => {
  selectedAccounts.value = chartOfAccounts.value
    .filter(account => account.group === 'Liabilities')
    .map(account => account.code)
}

const selectEquity = () => {
  selectedAccounts.value = chartOfAccounts.value
    .filter(account => account.group === 'Equity')
    .map(account => account.code)
}

const selectRevenue = () => {
  selectedAccounts.value = chartOfAccounts.value
    .filter(account => account.group === 'Revenue')
    .map(account => account.code)
}

const selectExpenses = () => {
  selectedAccounts.value = chartOfAccounts.value
    .filter(account => account.group === 'Expenses')
    .map(account => account.code)
}

const applyFilters = () => {
  currentPage.value = 1
  console.log('Applying filters:', {
    selectedAccounts: selectedAccounts.value,
    journalNarration: journalNarration.value,
    dateRange: { from: fromDate.value, to: toDate.value },
    amountRange: { from: fromAmount.value, to: toAmount.value },
    status: {
      posted: showPostedJournals.value,
      draft: showDraftJournals.value,
      deleted: showDeletedJournals.value
    },
    search: searchQuery.value
  })
}

const clearFilters = () => {
  selectedAccounts.value = []
  journalNarration.value = ''
  fromDate.value = ''
  toDate.value = ''
  fromAmount.value = null
  toAmount.value = null
  showPostedJournals.value = true
  showDraftJournals.value = true
  showDeletedJournals.value = false
  searchQuery.value = ''
  currentPage.value = 1
}

const saveFilterPreset = () => {
  const preset = {
    selectedAccounts: selectedAccounts.value,
    journalNarration: journalNarration.value,
    dateRange: { from: fromDate.value, to: toDate.value },
    amountRange: { from: fromAmount.value, to: toAmount.value },
    status: {
      posted: showPostedJournals.value,
      draft: showDraftJournals.value,
      deleted: showDeletedJournals.value
    },
    search: searchQuery.value
  }
  console.log('Saving filter preset:', preset)
  alert('Filter preset saved successfully!')
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getStatusColor = (status: string): string => {
  const colors = {
    'Posted': 'bg-green-100 text-green-800',
    'Draft': 'bg-yellow-100 text-yellow-800',
    'Deleted': 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount))
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const createJournal = () => {
  router.push('/accounting/manual-journal/create')
}

const viewJournal = (journalId: string) => {
  router.push(`/accounting/manual-journal/${journalId}/view`)
}

const editJournal = (journalId: string) => {
  router.push(`/accounting/manual-journal/${journalId}/edit`)
}

const deleteJournal = (journalId: string) => {
  if (confirm('Are you sure you want to delete this journal entry?')) {
    console.log('Deleting journal:', journalId)
    // Implementation would go here
  }
}

const downloadJournal = (journalId: string) => {
  console.log('Downloading journal:', journalId)
  // Implementation would go here
}

const exportData = () => {
  console.log('Exporting journal data')
  // Implementation would go here
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

defineOptions({
  name: "ViewManualJournal",
})

// Initialize
onMounted(() => {
  // Load initial data if needed
  applyFilters()
})
</script>

<style scoped>
@media print {
  .btn,
  button {
    display: none !important;
  }
}

/* Custom scrollbar for account selection */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>