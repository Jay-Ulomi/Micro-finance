<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Branch Capital</h1>
        <p class="text-sm text-gray-600">Record capital deposits and withdrawals for branch equity</p>
      </div>
      <div class="flex space-x-3">
        <button @click="goBack" class="btn btn-secondary">
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Back
        </button>
        <button @click="showHelp" class="btn btn-secondary">
          <QuestionMarkCircleIcon class="w-4 h-4 mr-2" />
          Help
        </button>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start">
        <InformationCircleIcon class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
        <div class="text-sm text-blue-900">
          <p class="font-semibold mb-2">Instructions:</p>
          <ul class="list-disc list-inside space-y-1">
            <li><strong>Deposit:</strong> To deposit money into the branch, type the amount here</li>
            <li><strong>Withdrawal:</strong> To withdraw money from the branch, type the amount in negative (e.g., -10000 means you withdrew 10,000 from the branch)</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Transaction Form -->
    <form @submit.prevent="submitTransaction" class="space-y-6">
      <!-- Branch Selection -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Select Branch</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select the Branch to whom the Equity Applies
            </label>
            <div class="space-y-2">
              <label
                v-for="branch in availableBranches"
                :key="branch.id"
                class="flex items-center p-4 border rounded-lg cursor-pointer transition-all"
                :class="[
                  selectedBranch === branch.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <input
                  type="radio"
                  v-model="selectedBranch"
                  :value="branch.id"
                  class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div class="ml-3 flex-1">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900">
                      {{ branch.name }} ({{ branch.currency }})
                    </span>
                    <span class="text-sm text-gray-500">
                      Current Balance: {{ formatCurrency(branch.currentBalance) }}
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">{{ branch.code }}</span>
                </div>
              </label>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              <ExclamationCircleIcon class="w-3 h-3 inline mr-1" />
              You will only see the branches above to which you have access to.
            </p>
          </div>
        </div>
      </div>

      <!-- Transaction Details -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Transaction Details</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Transaction Date -->
          <div>
            <label for="transactionDate" class="block text-sm font-medium text-gray-700 mb-1">
              Transaction Date <span class="text-red-500">*</span>
            </label>
            <input
              id="transactionDate"
              v-model="formData.transactionDate"
              type="date"
              required
              class="form-input"
              placeholder="dd/mm/yyyy"
            />
            <p class="mt-1 text-xs text-gray-500">dd/mm/yyyy</p>
          </div>

          <!-- Equity Amount -->
          <div>
            <label for="equityAmount" class="block text-sm font-medium text-gray-700 mb-1">
              Equity Amount <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">TZS</span>
              <input
                id="equityAmount"
                v-model.number="formData.equityAmount"
                type="number"
                required
                step="0.01"
                class="form-input pl-12"
                :class="{
                  'text-green-600': formData.equityAmount > 0,
                  'text-red-600': formData.equityAmount < 0
                }"
                placeholder="0.00"
                @input="updateTransactionType"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">Number or decimal only</p>
            
            <!-- Transaction Type Indicator -->
            <div v-if="formData.equityAmount !== 0" class="mt-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="transactionTypeClass"
              >
                <component :is="transactionTypeIcon" class="w-3 h-3 mr-1" />
                {{ transactionTypeLabel }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="md:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              class="form-input"
              placeholder="Enter transaction description..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Accounting Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Accounting</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select your financial account for journal entry:
            </label>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Account Type -->
              <div>
                <label for="accountType" class="block text-sm font-medium text-gray-700 mb-1">
                  Account Type <span class="text-red-500">*</span>
                </label>
                <select
                  id="accountType"
                  v-model="formData.accountType"
                  required
                  class="form-input"
                  @change="updateAccountOptions"
                >
                  <option value="">Select Account Type</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                </select>
              </div>

              <!-- Account -->
              <div>
                <label for="account" class="block text-sm font-medium text-gray-700 mb-1">
                  Account <span class="text-red-500">*</span>
                </label>
                <select
                  id="account"
                  v-model="formData.account"
                  required
                  class="form-input"
                  :disabled="!formData.accountType"
                >
                  <option value="">Select Account</option>
                  <option v-for="account in accountOptions" :key="account.id" :value="account.id">
                    {{ account.name }} - {{ account.accountNumber }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mt-2 flex items-center text-xs text-gray-500">
              <InformationCircleIcon class="w-3 h-3 mr-1" />
              <span>
                <router-link to="/accounting/bank-accounts" class="text-blue-600 hover:text-blue-800 underline">
                  Add/Edit Bank Accounts
                </router-link>
                . To bulk reconcile past entries with bank accounts, please visit 
                <router-link to="/accounting/reconcile" class="text-blue-600 hover:text-blue-800 underline">
                  Accounting → Reconcile Entries
                </router-link>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Summary -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Transaction Summary</h3>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <dl class="space-y-2">
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Branch:</dt>
              <dd class="font-medium text-gray-900">
                {{ selectedBranchName || 'Not selected' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Transaction Type:</dt>
              <dd class="font-medium" :class="transactionTypeClass">
                {{ transactionTypeLabel }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Amount:</dt>
              <dd class="font-medium" :class="formData.equityAmount >= 0 ? 'text-green-600' : 'text-red-600'">
                TZS {{ formatCurrency(Math.abs(formData.equityAmount || 0)) }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Date:</dt>
              <dd class="font-medium text-gray-900">
                {{ formData.transactionDate ? formatDate(formData.transactionDate) : 'Not set' }}
              </dd>
            </div>
            <div v-if="selectedBranch" class="pt-2 mt-2 border-t border-gray-200">
              <div class="flex justify-between text-sm">
                <dt class="text-gray-600">Current Balance:</dt>
                <dd class="font-medium text-gray-900">
                  TZS {{ formatCurrency(getCurrentBalance()) }}
                </dd>
              </div>
              <div class="flex justify-between text-sm">
                <dt class="text-gray-600">New Balance:</dt>
                <dd class="font-bold text-lg" :class="getNewBalance() >= 0 ? 'text-green-600' : 'text-red-600'">
                  TZS {{ formatCurrency(getNewBalance()) }}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3">
        <button type="button" @click="resetForm" class="btn btn-secondary">
          <ArrowPathIcon class="w-4 h-4 mr-2" />
          Reset
        </button>
        <button type="button" @click="saveDraft" class="btn btn-secondary">
          <DocumentDuplicateIcon class="w-4 h-4 mr-2" />
          Save as Draft
        </button>
        <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
          <CheckIcon class="w-4 h-4 mr-2" />
          Submit Transaction
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Mock data for available branches
const availableBranches = ref([
  { id: 'branch-1', name: 'Branch #1', code: 'BR001', currency: 'TZS', currentBalance: 5000000 },
  { id: 'branch-2', name: 'Branch #2', code: 'BR002', currency: 'TZS', currentBalance: 3000000 },
  { id: 'branch-3', name: 'Branch #3', code: 'BR003', currency: 'TZS', currentBalance: 2000000 },
])

// Mock data for accounts
const cashAccounts = [
  { id: 'cash-1', name: 'Cash', accountNumber: 'CASH001' },
  { id: 'cash-2', name: 'Petty Cash', accountNumber: 'PETTY001' },
]

const bankAccounts = [
  { id: 'bank-1', name: 'CRDB Bank', accountNumber: '001234567' },
  { id: 'bank-2', name: 'NMB Bank', accountNumber: '002345678' },
  { id: 'bank-3', name: 'TPB Bank', accountNumber: '003456789' },
  { id: 'bank-4', name: 'Equity Bank', accountNumber: '004567890' },
]

// Form data
const selectedBranch = ref('')
const formData = ref({
  transactionDate: new Date().toISOString().split('T')[0],
  equityAmount: 0,
  description: '',
  accountType: '',
  account: '',
})

// Computed properties
const selectedBranchName = computed(() => {
  const branch = availableBranches.value.find(b => b.id === selectedBranch.value)
  return branch ? branch.name : ''
})

const transactionTypeLabel = computed(() => {
  if (formData.value.equityAmount > 0) return 'Deposit'
  if (formData.value.equityAmount < 0) return 'Withdrawal'
  return 'No transaction'
})

const transactionTypeClass = computed(() => {
  if (formData.value.equityAmount > 0) return 'text-green-600 bg-green-100'
  if (formData.value.equityAmount < 0) return 'text-red-600 bg-red-100'
  return 'text-gray-600 bg-gray-100'
})

const transactionTypeIcon = computed(() => {
  return formData.value.equityAmount >= 0 ? ArrowUpIcon : ArrowDownIcon
})

const accountOptions = computed(() => {
  if (formData.value.accountType === 'cash') return cashAccounts
  if (formData.value.accountType === 'bank') return bankAccounts
  return []
})

const isFormValid = computed(() => {
  return (
    selectedBranch.value &&
    formData.value.transactionDate &&
    formData.value.equityAmount !== 0 &&
    formData.value.accountType &&
    formData.value.account
  )
})

// Methods
const getCurrentBalance = () => {
  const branch = availableBranches.value.find(b => b.id === selectedBranch.value)
  return branch ? branch.currentBalance : 0
}

const getNewBalance = () => {
  return getCurrentBalance() + (formData.value.equityAmount || 0)
}

const updateTransactionType = () => {
  // Auto-update based on amount
}

const updateAccountOptions = () => {
  formData.value.account = ''
}

const submitTransaction = () => {
  if (!isFormValid.value) return

  const transaction = {
    branchId: selectedBranch.value,
    ...formData.value,
    timestamp: new Date().toISOString(),
  }

  console.log('Submitting transaction:', transaction)
  
  // Show success message
  alert(`Transaction successful! ${transactionTypeLabel.value} of TZS ${formatCurrency(Math.abs(formData.value.equityAmount))} has been recorded.`)
  
  // Redirect to branch equity page
  router.push('/accounting/branch-equity')
}

const saveDraft = () => {
  console.log('Saving as draft:', {
    branchId: selectedBranch.value,
    ...formData.value,
  })
  alert('Transaction saved as draft!')
}

const resetForm = () => {
  selectedBranch.value = ''
  formData.value = {
    transactionDate: new Date().toISOString().split('T')[0],
    equityAmount: 0,
    description: '',
    accountType: '',
    account: '',
  }
}

const goBack = () => {
  router.push('/accounting/branch-equity')
}

const showHelp = () => {
  alert('Add Branch Capital: Use this form to record deposits (positive amounts) or withdrawals (negative amounts) for branch equity. All transactions will be recorded in the accounting journal.')
}

// Utility functions
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number): string => {
  return Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

defineOptions({
  name: "AddBranchCapital",
})
</script>