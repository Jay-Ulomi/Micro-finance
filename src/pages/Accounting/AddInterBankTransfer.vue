<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Inter Bank Transfer</h1>
        <p class="text-sm text-gray-600">Transfer funds between bank accounts with automated journal entries</p>
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
          <p class="font-semibold mb-2">Automated Journal Entry</p>
          <p>You can use this page to transfer funds between bank accounts. The system will do an automated journal entry of Debit and Credit in the below selected bank accounts.</p>
        </div>
      </div>
    </div>

    <!-- Transfer Form -->
    <form @submit.prevent="submitTransfer" class="space-y-6">
      <!-- Branch Selection -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Select Branch</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select the Branch in which the Transfer will be shown
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
                      {{ branch.code }}
                    </span>
                  </div>
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

      <!-- Account Selection -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Select Accounts</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- From Bank Account -->
          <div>
            <label for="fromAccount" class="block text-sm font-medium text-gray-700 mb-2">
              From Bank Account <span class="text-red-500">*</span>
            </label>
            <select
              id="fromAccount"
              v-model="formData.fromAccount"
              required
              class="form-input"
              @change="validateAccounts"
            >
              <option value="">Select Account</option>
              <option value="cash">Cash</option>
              <option v-for="account in bankAccounts" :key="account.id" :value="account.id">
                {{ account.name }} - {{ account.accountNumber }}
              </option>
            </select>
            <div v-if="formData.fromAccount" class="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
              <div class="flex justify-between">
                <span>Available Balance:</span>
                <span class="font-mono">TZS {{ formatCurrency(getAccountBalance(formData.fromAccount)) }}</span>
              </div>
            </div>
          </div>

          <!-- To Bank Account -->
          <div>
            <label for="toAccount" class="block text-sm font-medium text-gray-700 mb-2">
              To Bank Account <span class="text-red-500">*</span>
            </label>
            <select
              id="toAccount"
              v-model="formData.toAccount"
              required
              class="form-input"
              @change="validateAccounts"
            >
              <option value="">Select Account</option>
              <option value="cash">Cash</option>
              <option v-for="account in bankAccounts" :key="account.id" :value="account.id">
                {{ account.name }} - {{ account.accountNumber }}
              </option>
            </select>
            <div v-if="formData.toAccount" class="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
              <div class="flex justify-between">
                <span>Current Balance:</span>
                <span class="font-mono">TZS {{ formatCurrency(getAccountBalance(formData.toAccount)) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Same Account Warning -->
        <div v-if="sameAccountSelected" class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div class="flex items-start">
            <ExclamationTriangleIcon class="w-5 h-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
            <div class="text-sm text-orange-800">
              <p class="font-medium">Same Account Selected</p>
              <p>You cannot transfer funds to the same account. Please select different accounts.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Transfer Details -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Transfer Details</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Transfer Date -->
          <div>
            <label for="transferDate" class="block text-sm font-medium text-gray-700 mb-1">
              Transfer Date <span class="text-red-500">*</span>
            </label>
            <input
              id="transferDate"
              v-model="formData.transferDate"
              type="date"
              required
              class="form-input"
              placeholder="dd/mm/yyyy"
            />
            <p class="mt-1 text-xs text-gray-500">dd/mm/yyyy</p>
          </div>

          <!-- Transfer Amount -->
          <div>
            <label for="transferAmount" class="block text-sm font-medium text-gray-700 mb-1">
              Transfer Amount <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">TZS</span>
              <input
                id="transferAmount"
                v-model.number="formData.transferAmount"
                type="number"
                required
                step="0.01"
                min="0.01"
                class="form-input pl-12"
                :class="{
                  'border-red-300 text-red-600': amountExceedsBalance,
                  'border-green-300 text-green-600': formData.transferAmount > 0 && !amountExceedsBalance
                }"
                placeholder="0.00"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">Number or decimal only</p>
            
            <!-- Insufficient Balance Warning -->
            <div v-if="amountExceedsBalance" class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
              <ExclamationTriangleIcon class="w-3 h-3 inline mr-1" />
              Insufficient balance in source account
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
              placeholder="Enter transfer description or reference..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Journal Entry Preview -->
      <div v-if="showJournalPreview" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Journal Entry Preview</h3>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Debit Entry -->
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 class="font-medium text-red-800 mb-2">Debit Entry</h4>
              <dl class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <dt class="text-gray-600">Account:</dt>
                  <dd class="font-medium text-red-700">{{ getAccountName(formData.toAccount) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-600">Amount:</dt>
                  <dd class="font-bold text-red-700">TZS {{ formatCurrency(formData.transferAmount || 0) }}</dd>
                </div>
              </dl>
            </div>

            <!-- Credit Entry -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-medium text-green-800 mb-2">Credit Entry</h4>
              <dl class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <dt class="text-gray-600">Account:</dt>
                  <dd class="font-medium text-green-700">{{ getAccountName(formData.fromAccount) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-600">Amount:</dt>
                  <dd class="font-bold text-green-700">TZS {{ formatCurrency(formData.transferAmount || 0) }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex justify-between text-sm font-medium">
              <span class="text-gray-600">Total Debits:</span>
              <span class="text-gray-900">TZS {{ formatCurrency(formData.transferAmount || 0) }}</span>
            </div>
            <div class="flex justify-between text-sm font-medium">
              <span class="text-gray-600">Total Credits:</span>
              <span class="text-gray-900">TZS {{ formatCurrency(formData.transferAmount || 0) }}</span>
            </div>
            <div class="flex justify-between text-sm font-bold text-green-600 pt-1">
              <span>Balance Check:</span>
              <span>✓ Balanced</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Transfer Summary -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Transfer Summary</h3>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <dl class="space-y-2">
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Branch:</dt>
              <dd class="font-medium text-gray-900">
                {{ selectedBranchName || 'Not selected' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">From Account:</dt>
              <dd class="font-medium text-gray-900">
                {{ getAccountName(formData.fromAccount) || 'Not selected' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">To Account:</dt>
              <dd class="font-medium text-gray-900">
                {{ getAccountName(formData.toAccount) || 'Not selected' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Transfer Amount:</dt>
              <dd class="font-bold text-lg text-blue-600">
                TZS {{ formatCurrency(formData.transferAmount || 0) }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Transfer Date:</dt>
              <dd class="font-medium text-gray-900">
                {{ formData.transferDate ? formatDate(formData.transferDate) : 'Not set' }}
              </dd>
            </div>
            <div v-if="formData.description" class="pt-2 mt-2 border-t border-gray-200">
              <div class="text-sm">
                <dt class="text-gray-600 mb-1">Description:</dt>
                <dd class="text-gray-900">{{ formData.description }}</dd>
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
        <button 
          type="submit" 
          class="btn btn-primary" 
          :disabled="!isFormValid"
          :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
        >
          <CheckIcon class="w-4 h-4 mr-2" />
          Submit Transfer
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
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Mock data for available branches
const availableBranches = ref([
  { id: 'branch-1', name: 'Branch #1', code: 'BR001', currency: 'TZS' },
  { id: 'branch-2', name: 'Branch #2', code: 'BR002', currency: 'TZS' },
  { id: 'branch-3', name: 'Branch #3', code: 'BR003', currency: 'TZS' },
])

// Mock data for bank accounts with balances
const bankAccounts = [
  { id: 'bank-1', name: 'CRDB Bank', accountNumber: '001234567', balance: 5000000 },
  { id: 'bank-2', name: 'NMB Bank', accountNumber: '002345678', balance: 3000000 },
  { id: 'bank-3', name: 'TPB Bank', accountNumber: '003456789', balance: 2500000 },
  { id: 'bank-4', name: 'Equity Bank', accountNumber: '004567890', balance: 1800000 },
]

const cashBalance = 750000

// Form data
const selectedBranch = ref('')
const formData = ref({
  fromAccount: '',
  toAccount: '',
  transferDate: new Date().toISOString().split('T')[0],
  transferAmount: 0,
  description: '',
})

// Computed properties
const selectedBranchName = computed(() => {
  const branch = availableBranches.value.find(b => b.id === selectedBranch.value)
  return branch ? branch.name : ''
})

const sameAccountSelected = computed(() => {
  return formData.value.fromAccount && formData.value.toAccount && 
         formData.value.fromAccount === formData.value.toAccount
})

const amountExceedsBalance = computed(() => {
  if (!formData.value.fromAccount || !formData.value.transferAmount) return false
  const availableBalance = getAccountBalance(formData.value.fromAccount)
  return formData.value.transferAmount > availableBalance
})

const showJournalPreview = computed(() => {
  return formData.value.fromAccount && formData.value.toAccount && 
         formData.value.transferAmount > 0 && !sameAccountSelected.value
})

const isFormValid = computed(() => {
  return (
    selectedBranch.value &&
    formData.value.fromAccount &&
    formData.value.toAccount &&
    formData.value.transferDate &&
    formData.value.transferAmount > 0 &&
    !sameAccountSelected.value &&
    !amountExceedsBalance.value
  )
})

// Methods
const getAccountBalance = (accountId: string): number => {
  if (accountId === 'cash') return cashBalance
  const account = bankAccounts.find(acc => acc.id === accountId)
  return account ? account.balance : 0
}

const getAccountName = (accountId: string): string => {
  if (!accountId) return ''
  if (accountId === 'cash') return 'Cash'
  const account = bankAccounts.find(acc => acc.id === accountId)
  return account ? `${account.name} - ${account.accountNumber}` : ''
}

const validateAccounts = () => {
  // Additional validation logic if needed
}

const submitTransfer = () => {
  if (!isFormValid.value) return

  // Generate reference number
  const referenceNumber = 'TXN' + Date.now().toString()

  const transfer = {
    branchId: selectedBranch.value,
    referenceNumber,
    ...formData.value,
    timestamp: new Date().toISOString(),
    status: 'pending'
  }

  console.log('Submitting transfer:', transfer)
  
  // Show success message
  alert(`Transfer submitted successfully!\nReference: ${referenceNumber}\nAmount: TZS ${formatCurrency(formData.value.transferAmount)} transferred from ${getAccountName(formData.value.fromAccount)} to ${getAccountName(formData.value.toAccount)}`)
  
  // Redirect to inter bank transfers page
  router.push('/accounting/inter-bank-transfers')
}

const saveDraft = () => {
  console.log('Saving as draft:', {
    branchId: selectedBranch.value,
    ...formData.value,
  })
  alert('Transfer saved as draft!')
}

const resetForm = () => {
  selectedBranch.value = ''
  formData.value = {
    fromAccount: '',
    toAccount: '',
    transferDate: new Date().toISOString().split('T')[0],
    transferAmount: 0,
    description: '',
  }
}

const goBack = () => {
  router.push('/accounting/inter-bank-transfers')
}

const showHelp = () => {
  alert('Add Inter Bank Transfer: Use this form to transfer funds between bank accounts. The system automatically creates balanced journal entries (Debit to destination account, Credit to source account).')
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
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

defineOptions({
  name: "AddInterBankTransfer",
})
</script>