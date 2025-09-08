<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Chart of Accounts</h1>
        <p class="text-sm text-gray-600">Manage your accounting structure and account categories</p>
      </div>
      <div class="flex space-x-3">
        <button @click="showHelp" class="btn btn-secondary">
          <QuestionMarkCircleIcon class="w-4 h-4 mr-2" />
          Help
        </button>
        <button @click="exportChart" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="addAccount" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Account
        </button>
      </div>
    </div>

    <!-- Account Categories Overview -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Account Categories</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Revenue -->
        <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div class="text-2xl font-bold text-green-600 mb-1">{{ categoryData.revenue.count }}</div>
          <div class="text-sm font-medium text-green-800 mb-2">Revenue</div>
          <div class="space-y-1 text-xs text-green-700">
            <div v-for="subcategory in categoryData.revenue.subcategories" :key="subcategory.name">
              {{ subcategory.name }}
            </div>
          </div>
        </div>

        <!-- Expenses -->
        <div class="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <div class="text-2xl font-bold text-red-600 mb-1">{{ categoryData.expenses.count }}</div>
          <div class="text-sm font-medium text-red-800 mb-2">Expenses</div>
          <div class="space-y-1 text-xs text-red-700">
            <div v-for="subcategory in categoryData.expenses.subcategories" :key="subcategory.name">
              {{ subcategory.name }}
            </div>
          </div>
        </div>

        <!-- Assets -->
        <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="text-2xl font-bold text-blue-600 mb-1">{{ categoryData.assets.count }}</div>
          <div class="text-sm font-medium text-blue-800 mb-2">Assets</div>
          <div class="space-y-1 text-xs text-blue-700">
            <div v-for="subcategory in categoryData.assets.subcategories" :key="subcategory.name">
              {{ subcategory.name }}
            </div>
          </div>
        </div>

        <!-- Liabilities -->
        <div class="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div class="text-2xl font-bold text-orange-600 mb-1">{{ categoryData.liabilities.count }}</div>
          <div class="text-sm font-medium text-orange-800 mb-2">Liabilities</div>
          <div class="space-y-1 text-xs text-orange-700">
            <div v-for="subcategory in categoryData.liabilities.subcategories" :key="subcategory.name">
              {{ subcategory.name }}
            </div>
          </div>
        </div>

        <!-- Equity -->
        <div class="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div class="text-2xl font-bold text-purple-600 mb-1">{{ categoryData.equity.count }}</div>
          <div class="text-sm font-medium text-purple-800 mb-2">Equity</div>
          <div class="space-y-1 text-xs text-purple-700">
            <div v-for="subcategory in categoryData.equity.subcategories" :key="subcategory.name">
              {{ subcategory.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Type Filter -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Filter Accounts</h3>
      
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          @click="selectedFilter = 'all'"
          :class="[
            'px-4 py-2 text-sm rounded-lg border transition-colors',
            selectedFilter === 'all'
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          ]"
        >
          All Accounts
        </button>
        <button
          v-for="(category, key) in categoryData"
          :key="key"
          @click="selectedFilter = key"
          :class="[
            'px-4 py-2 text-sm rounded-lg border transition-colors',
            selectedFilter === key
              ? `${getCategoryColor(key).bg} ${getCategoryColor(key).text} ${getCategoryColor(key).border}`
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Search -->
      <div class="max-w-md">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search accounts..."
            class="form-input pl-10"
            @input="filterAccounts"
          />
        </div>
      </div>
    </div>

    <!-- Accounts Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('code')">
                <div class="flex items-center">
                  Code
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('name')">
                <div class="flex items-center">
                  Name
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Group
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cash Flow Type
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bring Forward
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ledger
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredAccounts.length === 0">
              <td colspan="8" class="px-6 py-12 text-center">
                <div class="text-center">
                  <ChartBarIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No accounts found</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    No accounts match your current filter criteria.
                  </p>
                  <div class="mt-6">
                    <button @click="addAccount" class="btn btn-primary">
                      <PlusIcon class="w-4 h-4 mr-2" />
                      Add Account
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-for="account in paginatedAccounts" :key="account.code" class="hover:bg-gray-50">
              <!-- Code -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-mono font-medium text-gray-900">{{ account.code }}</div>
              </td>
              
              <!-- Name -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ account.name }}</div>
              </td>
              
              <!-- Type -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getGroupColor(account.group)">
                  {{ account.type }}
                </span>
              </td>
              
              <!-- Group -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ account.group }}
              </td>
              
              <!-- Cash Flow Type -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getCashFlowTypeColor(account.cashFlowType)">
                  {{ account.cashFlowType }}
                </span>
              </td>
              
              <!-- Bring Forward -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span v-if="account.bringForward" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckIcon class="w-3 h-3 mr-1" />
                  Yes
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <XMarkIcon class="w-3 h-3 mr-1" />
                  No
                </span>
              </td>
              
              <!-- Ledger -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button @click="viewLedger(account.code)" class="text-blue-600 hover:text-blue-900 text-sm font-medium">
                  View
                </button>
              </td>
              
              <!-- Action -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button 
                    v-if="!account.locked"
                    @click="editAccount(account.code)" 
                    class="text-yellow-600 hover:text-yellow-900"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    <LockClosedIcon class="w-3 h-3 mr-1" />
                    Locked
                  </span>
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

    <!-- Account Structure Help -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start">
        <InformationCircleIcon class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
        <div class="text-sm text-blue-900">
          <p class="font-semibold mb-2">Account Structure</p>
          <ul class="list-disc list-inside space-y-1">
            <li><strong>Assets (1xxx):</strong> Resources owned by the organization</li>
            <li><strong>Liabilities (2xxx):</strong> Obligations owed to others</li>
            <li><strong>Equity (3xxx):</strong> Owner's stake in the organization</li>
            <li><strong>Revenue (4xxx):</strong> Income earned from operations</li>
            <li><strong>Expenses (5xxx):</strong> Costs incurred in operations</li>
          </ul>
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
  ChartBarIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  LockClosedIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive data
const selectedFilter = ref('all')
const searchQuery = ref('')
const entriesPerPage = ref(25)
const currentPage = ref(1)
const sortField = ref('code')
const sortDirection = ref('asc')

// Category data structure
const categoryData = ref({
  revenue: {
    name: 'Revenue',
    count: 9,
    subcategories: [
      { name: 'Non-operating Revenue' },
      { name: 'Revenue from Deposit' },
      { name: 'Revenue from Lender Investment' },
      { name: 'Revenue from Loan' },
      { name: 'Subsidy' }
    ]
  },
  expenses: {
    name: 'Expenses',
    count: 24,
    subcategories: [
      { name: 'Asset Disposal' },
      { name: 'Default Loan' },
      { name: 'Depreciation' },
      { name: 'Exchange Rate Loss' },
      { name: 'Expenses on Borrowing' },
      { name: 'Expenses on Deposit' },
      { name: 'Miscellaneous Expense' },
      { name: 'Non-operating Expense' },
      { name: 'Provision for Loan Impairment' },
      { name: 'Restructured Loan' },
      { name: 'Tax' }
    ]
  },
  assets: {
    name: 'Assets',
    count: 12,
    subcategories: [
      { name: 'Account Receivable' },
      { name: 'Cash and Bank' },
      { name: 'Current Asset' },
      { name: 'Lender Investment' },
      { name: 'Loan' },
      { name: 'Non-Current Asset' },
      { name: 'Receivable' },
      { name: 'Taxes Paid on Purchase' }
    ]
  },
  liabilities: {
    name: 'Liabilities',
    count: 11,
    subcategories: [
      { name: 'Accounts Payable' },
      { name: 'Accumulated Depreciation' },
      { name: 'Accumulated Loan Impairment' },
      { name: 'Borrower Saving Deposit' },
      { name: 'Investor Deposit' },
      { name: 'Liability' },
      { name: 'Merchant Borrowing' },
      { name: 'Payable' },
      { name: 'Taxes Received on Sale' }
    ]
  },
  equity: {
    name: 'Equity',
    count: 2,
    subcategories: [
      { name: 'Equity' },
      { name: 'Retained Earning' }
    ]
  }
})

// Chart of Accounts data
const accounts = ref([
  // Assets
  { code: '1010', name: 'Cash', type: 'Cash and Bank', group: 'Assets', cashFlowType: 'Investing activities', bringForward: true, locked: true },
  { code: '1110', name: 'Lender Investments', type: 'Lender Investment', group: 'Assets', cashFlowType: 'Investing activities', bringForward: true, locked: true },
  { code: '1210', name: 'Gross Loans - Principal', type: 'Loan', group: 'Assets', cashFlowType: 'Operating activities', bringForward: true, locked: true },
  { code: '1310', name: 'Receivable - Interest on Loans', type: 'Receivable', group: 'Assets', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '1320', name: 'Receivable - Fee and Commission on Loans', type: 'Receivable', group: 'Assets', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '1330', name: 'Receivable - Penalty on Loans', type: 'Receivable', group: 'Assets', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '1340', name: 'Receivable - Revenue on Borrower Saving Deposits', type: 'Receivable', group: 'Assets', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '1350', name: 'Receivable - Revenue on Investor Deposits', type: 'Receivable', group: 'Assets', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '1360', name: 'Receivable - Non-operating Revenue', type: 'Receivable', group: 'Assets', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '1510', name: 'Current Assets', type: 'Current Asset', group: 'Assets', cashFlowType: 'Investing activities', bringForward: true, locked: true },
  { code: '1610', name: 'Non-current Asset', type: 'Non-Current Asset', group: 'Assets', cashFlowType: 'Investing activities', bringForward: true, locked: true },
  { code: '1611', name: 'Accumulated Depreciation and Amortization', type: 'Non-Current Asset', group: 'Assets', cashFlowType: 'Investing activities', bringForward: true, locked: true },

  // Liabilities
  { code: '2010', name: 'Payable - On Borrower Saving Deposits', type: 'Payable', group: 'Liabilities', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '2020', name: 'Payable - On Investor Deposits', type: 'Payable', group: 'Liabilities', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '2030', name: 'Payable - On Merchant Borrowings', type: 'Payable', group: 'Liabilities', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '2040', name: 'Payable - Payroll Expenses', type: 'Payable', group: 'Liabilities', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '2050', name: 'Payable - Non-operating Expenses', type: 'Payable', group: 'Liabilities', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '2060', name: 'Payable - Miscellaneous Expenses', type: 'Payable', group: 'Liabilities', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '2070', name: 'Payable - Fee and Commission on Loans', type: 'Payable', group: 'Liabilities', cashFlowType: 'Operating activities', bringForward: true, locked: true },
  { code: '2110', name: 'Current Liabilities', type: 'Liability', group: 'Liabilities', cashFlowType: 'Operating activities', bringForward: true, locked: true },
  { code: '2310', name: 'Borrower Saving Deposits', type: 'Borrower Saving Deposit', group: 'Liabilities', cashFlowType: 'Operating activities', bringForward: true, locked: true },
  { code: '2410', name: 'Investor Deposits', type: 'Investor Deposit', group: 'Liabilities', cashFlowType: 'Operating activities', bringForward: true, locked: true },
  { code: '2610', name: 'Accumulated Loan Impairment', type: 'Accumulated Loan Impairment', group: 'Liabilities', cashFlowType: 'Non Applicable', bringForward: true, locked: true },
  { code: '2810', name: 'Income Tax Liability', type: 'Liability', group: 'Liabilities', cashFlowType: 'Cash Flow from taxes', bringForward: true, locked: true },

  // Equity
  { code: '3010', name: 'Branch Equity', type: 'Equity', group: 'Equity', cashFlowType: 'Financing activities', bringForward: true, locked: true },
  { code: '3110', name: 'Retained Earnings (previous years)', type: 'Retained Earning', group: 'Equity', cashFlowType: 'Non Applicable', bringForward: true, locked: true },

  // Revenue
  { code: '4010', name: 'Interest on Loans', type: 'Revenue from Loan', group: 'Revenue', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '4020', name: 'Fee and Commission on Loans', type: 'Revenue from Loan', group: 'Revenue', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '4030', name: 'Penalty on Loans', type: 'Revenue from Loan', group: 'Revenue', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '4050', name: 'Revenue from Defaulted Loans - Principal', type: 'Revenue from Loan', group: 'Revenue', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '4060', name: 'Revenue from Restructured Loans', type: 'Revenue from Loan', group: 'Revenue', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '4210', name: 'Revenue from Borrower Saving Deposits', type: 'Revenue from Deposit', group: 'Revenue', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '4310', name: 'Revenue from Investor Deposits', type: 'Revenue from Deposit', group: 'Revenue', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '4510', name: 'Non-operating Revenue', type: 'Non-operating Revenue', group: 'Revenue', cashFlowType: 'Non-operating activities', bringForward: false, locked: true },
  { code: '4610', name: 'Subsidy', type: 'Subsidy', group: 'Revenue', cashFlowType: 'Financing activities', bringForward: false, locked: true },

  // Expenses
  { code: '5110', name: 'Provision for Impairment - Loan Principal', type: 'Provision for Loan Impairment', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5111', name: 'Provision for Impairment - Interest on Loans', type: 'Provision for Loan Impairment', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5112', name: 'Provision for Impairment - Fees and Commission on Loans', type: 'Provision for Loan Impairment', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5113', name: 'Provision for Impairment - Penalty on Loans', type: 'Provision for Loan Impairment', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5120', name: 'Default - Loan Principal', type: 'Default Loan', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5121', name: 'Default - Interest on Loans', type: 'Default Loan', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5122', name: 'Default - Fees and Commission on Loans', type: 'Default Loan', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5123', name: 'Default - Penalty on Loans', type: 'Default Loan', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5130', name: 'Depreciation and Amortization Expenses', type: 'Depreciation', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5140', name: 'Restructured - Loan Principal', type: 'Restructured Loan', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5141', name: 'Restructured - Interest on Loans', type: 'Restructured Loan', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5142', name: 'Restructured - Fees and Commission on Loans', type: 'Restructured Loan', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5143', name: 'Restructured - Penalty on Loans', type: 'Restructured Loan', group: 'Expenses', cashFlowType: 'Non Applicable', bringForward: false, locked: true },
  { code: '5150', name: 'Loss (or Gain) on Asset Disposal', type: 'Asset Disposal', group: 'Expenses', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '5210', name: 'Payroll Expenses', type: 'Miscellaneous Expense', group: 'Expenses', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '5230', name: 'Exchange Rate Losses (Gains)', type: 'Miscellaneous Expense', group: 'Expenses', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '5310', name: 'Expenses on Borrower Saving Deposits', type: 'Expenses on Deposit', group: 'Expenses', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '5410', name: 'Expenses on Investor Deposits', type: 'Expenses on Deposit', group: 'Expenses', cashFlowType: 'Operating activities', bringForward: false, locked: true },
  { code: '5510', name: 'Expense on Merchant Borrowings', type: 'Expenses on Borrowing', group: 'Expenses', cashFlowType: 'Financing activities', bringForward: false, locked: true },
  { code: '5610', name: 'Non-operating Expenses', type: 'Non-operating Expense', group: 'Expenses', cashFlowType: 'Non-operating activities', bringForward: false, locked: true },
  { code: '5710', name: 'Income Tax Expense', type: 'Tax', group: 'Expenses', cashFlowType: 'Cash Flow from taxes', bringForward: false, locked: true }
])

// Computed properties
const filteredAccounts = computed(() => {
  let filtered = [...accounts.value]

  // Filter by category
  if (selectedFilter.value !== 'all') {
    const filterGroup = selectedFilter.value === 'revenue' ? 'Revenue' :
                       selectedFilter.value === 'expenses' ? 'Expenses' :
                       selectedFilter.value === 'assets' ? 'Assets' :
                       selectedFilter.value === 'liabilities' ? 'Liabilities' :
                       selectedFilter.value === 'equity' ? 'Equity' : ''
    
    if (filterGroup) {
      filtered = filtered.filter(account => account.group === filterGroup)
    }
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(account => 
      account.code.toLowerCase().includes(query) ||
      account.name.toLowerCase().includes(query) ||
      account.type.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  if (sortField.value) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]

      if (sortField.value === 'code') {
        const aNum = parseInt(aVal)
        const bNum = parseInt(bVal)
        return sortDirection.value === 'asc' ? aNum - bNum : bNum - aNum
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

const totalRecords = computed(() => filteredAccounts.value.length)
const totalPages = computed(() => Math.ceil(totalRecords.value / entriesPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * entriesPerPage.value, totalRecords.value))

const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value
  const end = start + entriesPerPage.value
  return filteredAccounts.value.slice(start, end)
})

// Methods
const filterAccounts = () => {
  currentPage.value = 1
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getCategoryColor = (category: string) => {
  const colors = {
    revenue: { bg: 'bg-green-600', text: 'text-white', border: 'border-green-600' },
    expenses: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-600' },
    assets: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-600' },
    liabilities: { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-600' },
    equity: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-600' },
  }
  return colors[category] || { bg: 'bg-gray-600', text: 'text-white', border: 'border-gray-600' }
}

const getGroupColor = (group: string): string => {
  const colors = {
    'Assets': 'bg-blue-100 text-blue-800',
    'Liabilities': 'bg-orange-100 text-orange-800',
    'Equity': 'bg-purple-100 text-purple-800',
    'Revenue': 'bg-green-100 text-green-800',
    'Expenses': 'bg-red-100 text-red-800',
  }
  return colors[group] || 'bg-gray-100 text-gray-800'
}

const getCashFlowTypeColor = (cashFlowType: string): string => {
  const colors = {
    'Operating activities': 'bg-blue-100 text-blue-800',
    'Investing activities': 'bg-green-100 text-green-800',
    'Financing activities': 'bg-purple-100 text-purple-800',
    'Non-operating activities': 'bg-yellow-100 text-yellow-800',
    'Cash Flow from taxes': 'bg-red-100 text-red-800',
    'Non Applicable': 'bg-gray-100 text-gray-800',
  }
  return colors[cashFlowType] || 'bg-gray-100 text-gray-800'
}

const showHelp = () => {
  alert('Chart of Accounts: This shows your complete accounting structure organized by Assets, Liabilities, Equity, Revenue, and Expenses. System accounts are locked to maintain accounting integrity.')
}

const exportChart = () => {
  console.log('Exporting chart of accounts')
}

const addAccount = () => {
  router.push('/accounting/chart-of-accounts/create')
}

const viewLedger = (accountCode: string) => {
  router.push(`/accounting/ledger/${accountCode}`)
}

const editAccount = (accountCode: string) => {
  router.push(`/accounting/chart-of-accounts/${accountCode}/edit`)
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
  name: "ChartOfAccounts",
})

// Initialize
onMounted(() => {
  // Load data if needed
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