<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Bank Account</h1>
        <p class="text-sm text-gray-600">Create a new bank account in your chart of accounts</p>
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

    <!-- Bank Account Form -->
    <form @submit.prevent="submitBankAccount" class="space-y-6">
      <!-- Required Fields -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Required Fields:</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Code -->
          <div>
            <label for="accountCode" class="block text-sm font-medium text-gray-700 mb-1">
              Code <span class="text-red-500">*</span>
            </label>
            <input
              id="accountCode"
              v-model="formData.code"
              type="number"
              required
              min="1"
              max="9999"
              class="form-input"
              :class="{
                'border-red-300': codeError,
                'border-green-300': formData.code && !codeError
              }"
              placeholder="1011"
              @input="validateCode"
            />
            <p class="mt-1 text-xs text-gray-500">Code can be any number between 0001 and 9999</p>
            <div v-if="codeError" class="mt-1 text-xs text-red-600">
              {{ codeError }}
            </div>
            <div v-if="suggestedCode" class="mt-1 text-xs text-blue-600">
              <button type="button" @click="useSuggestedCode" class="underline hover:text-blue-800">
                Suggested code: {{ suggestedCode }} (click to use)
              </button>
            </div>
          </div>

          <!-- Bank Account Name -->
          <div>
            <label for="accountName" class="block text-sm font-medium text-gray-700 mb-1">
              Bank Account Name <span class="text-red-500">*</span>
            </label>
            <input
              id="accountName"
              v-model="formData.name"
              type="text"
              required
              class="form-input"
              placeholder="Account Name"
            />
            <p class="mt-1 text-xs text-gray-500">Enter descriptive name for the bank account</p>
          </div>
        </div>
      </div>

      <!-- Currency Information -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <InformationCircleIcon class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div class="text-sm text-blue-900">
            <p class="font-semibold mb-2">Currency</p>
            <p class="mb-2">You can not select currency as branches can have different currencies in the account. The system will assume that the branch currency is the currency of this chart of account.</p>
            <p class="mb-2">For this branch, this would be <strong>TZS</strong>.</p>
            <p class="text-xs">Please note that if your branches have different currencies, you will not be allowed to view consolidated accounting reports.</p>
          </div>
        </div>
      </div>

      <!-- Default Categories -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Set Default for the following Categories (optional)</h3>
        <p class="text-sm text-gray-600 mb-4">Click in the box above to select multiple categories. This bank will be auto selected for the above selected categories.</p>
        
        <div class="space-y-6">
          <!-- Add Loan -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Add Loan:</label>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <label v-for="loanType in loanTypes" :key="loanType.id" class="flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.defaultCategories.addLoan"
                  :value="loanType.id"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ loanType.label }}</span>
              </label>
            </div>
          </div>

          <!-- Add Repayment -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Add Repayment:</label>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <label v-for="repaymentType in repaymentTypes" :key="repaymentType.id" class="flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.defaultCategories.addRepayment"
                  :value="repaymentType.id"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ repaymentType.label }}</span>
              </label>
            </div>
          </div>

          <!-- Other Categories -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Expense -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Expense:</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.defaultCategories.expense"
                  value="add-expense"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Add Expense</span>
              </label>
            </div>

            <!-- Other Income -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Other Income:</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.defaultCategories.otherIncome"
                  value="add-other-income"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Add Other Income</span>
              </label>
            </div>

            <!-- Add Savings Transaction -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Add Savings Transaction:</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.defaultCategories.savingsTransaction"
                  value="savings-data"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Add Savings Transaction for Data</span>
              </label>
            </div>

            <!-- Add Investor Transaction -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Add Investor Transaction:</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.defaultCategories.investorTransaction"
                  value="in-product"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Add Investor Transaction for In Product</span>
              </label>
            </div>

            <!-- Branch Capital -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Branch Capital:</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.defaultCategories.branchCapital"
                  value="add-branch-capital"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Add Branch Capital</span>
              </label>
            </div>

            <!-- Payroll -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Payroll:</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.defaultCategories.payroll"
                  value="add-payroll"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Add Payroll</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Access to Branches -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Access to Branches</h3>
        <p class="text-sm text-gray-600 mb-4">Click in the box above to select multiple branches. To remove all branches with a single click, click on the x button on top right of the above box.</p>
        
        <div class="space-y-3">
          <!-- Select All / Clear All -->
          <div class="flex items-center space-x-4 pb-3 border-b border-gray-200">
            <button type="button" @click="selectAllBranches" class="text-sm text-blue-600 hover:text-blue-800">
              Select All
            </button>
            <button type="button" @click="clearAllBranches" class="text-sm text-gray-600 hover:text-gray-800">
              Clear All
            </button>
            <span class="text-sm text-gray-500">({{ selectedBranchCount }} selected)</span>
          </div>

          <!-- Branch Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <label v-for="branch in availableBranches" :key="branch.id" class="flex items-center p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                v-model="formData.accessBranches"
                :value="branch.id"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">{{ branch.name }}</div>
                <div class="text-xs text-gray-500">{{ branch.code }} - {{ branch.currency }}</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Account Summary -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Account Summary</h3>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <dl class="space-y-2">
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Account Code:</dt>
              <dd class="font-mono font-medium text-gray-900">
                {{ formData.code || 'Not set' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Account Name:</dt>
              <dd class="font-medium text-gray-900">
                {{ formData.name || 'Not set' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Account Type:</dt>
              <dd class="font-medium text-gray-900">Cash and Bank</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Currency:</dt>
              <dd class="font-medium text-gray-900">TZS (Tanzania Shilling)</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Default Categories:</dt>
              <dd class="font-medium text-gray-900">{{ selectedCategoriesCount }} selected</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Branch Access:</dt>
              <dd class="font-medium text-gray-900">{{ selectedBranchCount }} branches</dd>
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
          Create Account
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
  ArrowPathIcon,
  DocumentDuplicateIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Existing account codes (to check for duplicates)
const existingCodes = [
  1010, 1110, 1210, 1310, 1320, 1330, 1340, 1350, 1360, 1510, 1610, 1611,
  2010, 2020, 2030, 2040, 2050, 2060, 2070, 2110, 2310, 2410, 2610, 2810,
  3010, 3110, 4010, 4020, 4030, 4050, 4060, 4210, 4310, 4510, 4610,
  5110, 5111, 5112, 5113, 5120, 5121, 5122, 5123, 5130, 5140, 5141, 5142, 5143, 5150,
  5210, 5230, 5310, 5410, 5510, 5610, 5710
]

// Available branches
const availableBranches = ref([
  { id: 'branch-1', name: 'Branch #1', code: 'BR001', currency: 'TZS' },
  { id: 'branch-2', name: 'Branch #2', code: 'BR002', currency: 'TZS' },
  { id: 'branch-3', name: 'Branch #3', code: 'BR003', currency: 'TZS' },
  { id: 'branch-4', name: 'Branch #4', code: 'BR004', currency: 'TZS' },
])

// Loan types
const loanTypes = [
  { id: 'business-loan', label: 'Add Loan for Business Loan' },
  { id: 'overseas-worker-loan', label: 'Add Loan for Overseas Worker Loan' },
  { id: 'pensioner-loan', label: 'Add Loan for Pensioner Loan' },
  { id: 'personal-loan', label: 'Add Loan for Personal Loan' },
  { id: 'student-loan', label: 'Add Loan for Student Loan' },
]

// Repayment types
const repaymentTypes = [
  { id: 'business-repayment', label: 'Add Repayment for Business Loan' },
  { id: 'overseas-worker-repayment', label: 'Add Repayment for Overseas Worker Loan' },
  { id: 'pensioner-repayment', label: 'Add Repayment for Pensioner Loan' },
  { id: 'personal-repayment', label: 'Add Repayment for Personal Loan' },
  { id: 'student-repayment', label: 'Add Repayment for Student Loan' },
]

// Form data
const formData = ref({
  code: '',
  name: '',
  defaultCategories: {
    addLoan: [],
    addRepayment: [],
    expense: [],
    otherIncome: [],
    savingsTransaction: [],
    investorTransaction: [],
    branchCapital: [],
    payroll: [],
  },
  accessBranches: ['branch-1'] // Default to Branch #1 as shown in mockup
})

// Form validation
const codeError = ref('')
const suggestedCode = ref('')

// Computed properties
const selectedBranchCount = computed(() => formData.value.accessBranches.length)

const selectedCategoriesCount = computed(() => {
  let count = 0
  Object.values(formData.value.defaultCategories).forEach(category => {
    if (Array.isArray(category)) {
      count += category.length
    } else if (category.length > 0) {
      count += 1
    }
  })
  return count
})

const isFormValid = computed(() => {
  return (
    formData.value.code &&
    formData.value.name &&
    !codeError.value &&
    formData.value.accessBranches.length > 0
  )
})

// Methods
const validateCode = () => {
  const code = parseInt(formData.value.code)
  codeError.value = ''
  suggestedCode.value = ''

  if (!code) return

  if (code < 1 || code > 9999) {
    codeError.value = 'Code must be between 0001 and 9999'
    return
  }

  if (existingCodes.includes(code)) {
    codeError.value = 'This code is already in use'
    // Suggest next available code in the 1000s range for bank accounts
    for (let i = 1012; i <= 1099; i++) {
      if (!existingCodes.includes(i)) {
        suggestedCode.value = i.toString()
        break
      }
    }
    return
  }

  // Recommend bank account codes in 1000s range
  if (code < 1000 || code >= 2000) {
    suggestedCode.value = '1012' // First available after 1011
  }
}

const useSuggestedCode = () => {
  formData.value.code = suggestedCode.value
  validateCode()
}

const selectAllBranches = () => {
  formData.value.accessBranches = availableBranches.value.map(b => b.id)
}

const clearAllBranches = () => {
  formData.value.accessBranches = []
}

const submitBankAccount = () => {
  if (!isFormValid.value) return

  const account = {
    ...formData.value,
    accountType: 'Cash and Bank',
    group: 'Assets',
    cashFlowType: 'Investing activities',
    bringForward: true,
    locked: false,
    currency: 'TZS',
    timestamp: new Date().toISOString(),
  }

  console.log('Creating bank account:', account)
  
  // Show success message
  alert(`Bank Account created successfully!\nCode: ${formData.value.code}\nName: ${formData.value.name}\nBranch Access: ${selectedBranchCount.value} branches\nDefault Categories: ${selectedCategoriesCount.value} selected`)
  
  // Redirect to chart of accounts
  router.push('/accounting/chart-of-accounts')
}

const saveDraft = () => {
  console.log('Saving as draft:', formData.value)
  alert('Bank account saved as draft!')
}

const resetForm = () => {
  formData.value = {
    code: '',
    name: '',
    defaultCategories: {
      addLoan: [],
      addRepayment: [],
      expense: [],
      otherIncome: [],
      savingsTransaction: [],
      investorTransaction: [],
      branchCapital: [],
      payroll: [],
    },
    accessBranches: ['branch-1']
  }
  codeError.value = ''
  suggestedCode.value = ''
}

const goBack = () => {
  router.push('/accounting/chart-of-accounts')
}

const showHelp = () => {
  alert('Add Bank Account: Create a new bank account in your chart of accounts. Bank accounts are automatically classified as Cash and Bank assets with code range 1000-1999.')
}

defineOptions({
  name: "AddBankAccount",
})
</script>