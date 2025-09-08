<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Chart of Account</h1>
        <p class="text-sm text-gray-600">Create a new account in your chart of accounts structure</p>
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

    <!-- Important Notice -->
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-6">
      <div class="flex items-start">
        <ExclamationTriangleIcon class="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
        <div class="text-sm text-amber-900">
          <p class="font-semibold mb-2">Please read this before using this page to create a chart of account</p>
          
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-amber-800">Bank Account:</h4>
              <p class="text-amber-700 text-xs leading-relaxed">
                If you are looking to add a bank account, please add it at 
                <router-link to="/accounting/chart-of-accounts/create" class="underline hover:text-amber-600">
                  Admin(top menu) → Accounting → Bank Accounts → Add Bank Account button
                </router-link>. 
                We will automatically create a chart of account for you and then you can select this bank account in various categories such as Add Loan, Add Loan Repayment, Add Expense, Add Other Income, and Add Savings Transaction.
              </p>
            </div>

            <div>
              <h4 class="font-medium text-amber-800">Taxes:</h4>
              <p class="text-amber-700 text-xs leading-relaxed">
                If you are looking to add a tax rate, please add it at 
                <router-link to="/settings/add-tax" class="underline hover:text-amber-600">
                  Admin(top menu) → Accounting → Taxes → Add Tax button
                </router-link>. 
                We will automatically create a chart of account for you and then you can select this tax in various categories such as Add Expense, and Add Other Income.
              </p>
            </div>

            <div>
              <h4 class="font-medium text-amber-800">Expense:</h4>
              <p class="text-amber-700 text-xs leading-relaxed">
                If you are looking to add a chart of account for an expense category such as Accommodation or Fuel Expenses, please add it at 
                <router-link to="/expenses/types/create" class="underline hover:text-amber-600">
                  Admin(top menu) → Expenses → Expense Types → Add Expense Type button
                </router-link>. 
                We will automatically create a chart of account for you and then you can either do a manual journal entry or use Expenses (left menu) to add an expense.
              </p>
            </div>

            <div>
              <h4 class="font-medium text-amber-800">Other Income:</h4>
              <p class="text-amber-700 text-xs leading-relaxed">
                If you are looking to add a chart of account for an other income category such as Rental Income or Collateral Sale, please add it at 
                <router-link to="/other-income/types/create" class="underline hover:text-amber-600">
                  Admin(top menu) → Other Income → Other Income Types → Add Other Income Type button
                </router-link>. 
                We will automatically create a chart of account for you and then you can either do a manual journal entry or use Other Income (left menu) to add an other income.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart of Account Form -->
    <form @submit.prevent="submitChartOfAccount" class="space-y-6">
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
              placeholder="Unique Code"
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

          <!-- Name -->
          <div>
            <label for="accountName" class="block text-sm font-medium text-gray-700 mb-1">
              Name <span class="text-red-500">*</span>
            </label>
            <input
              id="accountName"
              v-model="formData.name"
              type="text"
              required
              class="form-input"
              placeholder="Account Name"
            />
            <p class="mt-1 text-xs text-gray-500">Enter descriptive name for the account</p>
          </div>

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
              @change="updateCashFlowOptions"
            >
              <option value="">Select Account Type</option>
              
              <!-- Assets -->
              <optgroup label="Assets">
                <option value="cash-and-bank">Cash and Bank</option>
                <option value="current-asset">Current Asset</option>
                <option value="non-current-asset">Non-Current Asset</option>
                <option value="loan">Loan</option>
                <option value="lender-investment">Lender Investment</option>
                <option value="receivable">Receivable</option>
                <option value="account-receivable">Account Receivable</option>
              </optgroup>
              
              <!-- Liabilities -->
              <optgroup label="Liabilities">
                <option value="liability">Liability</option>
                <option value="payable">Payable</option>
                <option value="accounts-payable">Accounts Payable</option>
                <option value="borrower-saving-deposit">Borrower Saving Deposit</option>
                <option value="investor-deposit">Investor Deposit</option>
                <option value="merchant-borrowing">Merchant Borrowing</option>
                <option value="accumulated-depreciation">Accumulated Depreciation</option>
                <option value="accumulated-loan-impairment">Accumulated Loan Impairment</option>
              </optgroup>
              
              <!-- Equity -->
              <optgroup label="Equity">
                <option value="equity">Equity</option>
                <option value="retained-earning">Retained Earning</option>
              </optgroup>
              
              <!-- Revenue -->
              <optgroup label="Revenue">
                <option value="revenue-from-loan">Revenue from Loan</option>
                <option value="revenue-from-deposit">Revenue from Deposit</option>
                <option value="revenue-from-lender-investment">Revenue from Lender Investment</option>
                <option value="non-operating-revenue">Non-operating Revenue</option>
                <option value="subsidy">Subsidy</option>
              </optgroup>
              
              <!-- Expenses -->
              <optgroup label="Expenses">
                <option value="miscellaneous-expense">Miscellaneous Expense</option>
                <option value="expenses-on-deposit">Expenses on Deposit</option>
                <option value="expenses-on-borrowing">Expenses on Borrowing</option>
                <option value="non-operating-expense">Non-operating Expense</option>
                <option value="provision-for-loan-impairment">Provision for Loan Impairment</option>
                <option value="default-loan">Default Loan</option>
                <option value="restructured-loan">Restructured Loan</option>
                <option value="depreciation">Depreciation</option>
                <option value="asset-disposal">Asset Disposal</option>
                <option value="tax">Tax</option>
              </optgroup>
            </select>
          </div>

          <!-- Cash Flow Type -->
          <div>
            <label for="cashFlowType" class="block text-sm font-medium text-gray-700 mb-1">
              Cash Flow Type <span class="text-red-500">*</span>
            </label>
            <select
              id="cashFlowType"
              v-model="formData.cashFlowType"
              required
              class="form-input"
            >
              <option value="">Select Cash Flow Type</option>
              <option v-for="option in cashFlowOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
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

      <!-- Additional Settings -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Settings</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Bring Forward -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bring Forward Balance:</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="formData.bringForward"
                  :value="true"
                  class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Yes - Carry forward balance from previous period</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="formData.bringForward"
                  :value="false"
                  class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">No - Reset balance each period</span>
              </label>
            </div>
            <p class="mt-1 text-xs text-gray-500">Balance sheet accounts typically use "Yes", income statement accounts use "No"</p>
          </div>

          <!-- Account Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              class="form-input"
              placeholder="Enter account description or notes..."
            ></textarea>
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
              <XMarkIcon class="w-4 h-4 inline mr-1" />
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

      <!-- Account Preview -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Account Preview</h3>
        
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
              <dd class="font-medium text-gray-900">
                {{ getAccountTypeLabel(formData.accountType) || 'Not selected' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Account Group:</dt>
              <dd class="font-medium text-gray-900">
                {{ getAccountGroup(formData.accountType) || 'Not determined' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Cash Flow Type:</dt>
              <dd class="font-medium text-gray-900">
                {{ getCashFlowTypeLabel(formData.cashFlowType) || 'Not selected' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Currency:</dt>
              <dd class="font-medium text-gray-900">TZS (Tanzania Shilling)</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Bring Forward:</dt>
              <dd class="font-medium text-gray-900">
                {{ formData.bringForward === true ? 'Yes' : formData.bringForward === false ? 'No' : 'Not set' }}
              </dd>
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
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
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

// Cash flow options based on account type
const cashFlowOptions = ref([
  { value: 'operating-activities', label: 'Operating activities' },
  { value: 'investing-activities', label: 'Investing activities' },
  { value: 'financing-activities', label: 'Financing activities' },
  { value: 'non-operating-activities', label: 'Non-operating activities' },
  { value: 'cash-flow-from-taxes', label: 'Cash Flow from taxes' },
  { value: 'non-applicable', label: 'Non Applicable' },
])

// Form data
const formData = ref({
  code: '',
  name: '',
  accountType: '',
  cashFlowType: '',
  bringForward: true,
  description: '',
  accessBranches: ['branch-1'] // Default to Branch #1
})

// Form validation
const codeError = ref('')
const suggestedCode = ref('')

// Computed properties
const selectedBranchCount = computed(() => formData.value.accessBranches.length)

const isFormValid = computed(() => {
  return (
    formData.value.code &&
    formData.value.name &&
    formData.value.accountType &&
    formData.value.cashFlowType &&
    formData.value.bringForward !== null &&
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
    // Suggest next available code
    for (let i = code + 1; i <= 9999; i++) {
      if (!existingCodes.includes(i)) {
        suggestedCode.value = i.toString().padStart(4, '0')
        break
      }
    }
    return
  }
}

const useSuggestedCode = () => {
  formData.value.code = suggestedCode.value
  validateCode()
}

const updateCashFlowOptions = () => {
  // Reset cash flow type when account type changes
  formData.value.cashFlowType = ''
  
  // Could customize cash flow options based on account type if needed
  // For now, keep all options available
}

const selectAllBranches = () => {
  formData.value.accessBranches = availableBranches.value.map(b => b.id)
}

const clearAllBranches = () => {
  formData.value.accessBranches = []
}

const getAccountTypeLabel = (type: string): string => {
  const labels = {
    'cash-and-bank': 'Cash and Bank',
    'current-asset': 'Current Asset',
    'non-current-asset': 'Non-Current Asset',
    'loan': 'Loan',
    'lender-investment': 'Lender Investment',
    'receivable': 'Receivable',
    'account-receivable': 'Account Receivable',
    'liability': 'Liability',
    'payable': 'Payable',
    'accounts-payable': 'Accounts Payable',
    'borrower-saving-deposit': 'Borrower Saving Deposit',
    'investor-deposit': 'Investor Deposit',
    'merchant-borrowing': 'Merchant Borrowing',
    'accumulated-depreciation': 'Accumulated Depreciation',
    'accumulated-loan-impairment': 'Accumulated Loan Impairment',
    'equity': 'Equity',
    'retained-earning': 'Retained Earning',
    'revenue-from-loan': 'Revenue from Loan',
    'revenue-from-deposit': 'Revenue from Deposit',
    'revenue-from-lender-investment': 'Revenue from Lender Investment',
    'non-operating-revenue': 'Non-operating Revenue',
    'subsidy': 'Subsidy',
    'miscellaneous-expense': 'Miscellaneous Expense',
    'expenses-on-deposit': 'Expenses on Deposit',
    'expenses-on-borrowing': 'Expenses on Borrowing',
    'non-operating-expense': 'Non-operating Expense',
    'provision-for-loan-impairment': 'Provision for Loan Impairment',
    'default-loan': 'Default Loan',
    'restructured-loan': 'Restructured Loan',
    'depreciation': 'Depreciation',
    'asset-disposal': 'Asset Disposal',
    'tax': 'Tax',
  }
  return labels[type] || type
}

const getAccountGroup = (type: string): string => {
  if (!type) return ''
  
  const assetTypes = ['cash-and-bank', 'current-asset', 'non-current-asset', 'loan', 'lender-investment', 'receivable', 'account-receivable']
  const liabilityTypes = ['liability', 'payable', 'accounts-payable', 'borrower-saving-deposit', 'investor-deposit', 'merchant-borrowing', 'accumulated-depreciation', 'accumulated-loan-impairment']
  const equityTypes = ['equity', 'retained-earning']
  const revenueTypes = ['revenue-from-loan', 'revenue-from-deposit', 'revenue-from-lender-investment', 'non-operating-revenue', 'subsidy']
  const expenseTypes = ['miscellaneous-expense', 'expenses-on-deposit', 'expenses-on-borrowing', 'non-operating-expense', 'provision-for-loan-impairment', 'default-loan', 'restructured-loan', 'depreciation', 'asset-disposal', 'tax']
  
  if (assetTypes.includes(type)) return 'Assets'
  if (liabilityTypes.includes(type)) return 'Liabilities'
  if (equityTypes.includes(type)) return 'Equity'
  if (revenueTypes.includes(type)) return 'Revenue'
  if (expenseTypes.includes(type)) return 'Expenses'
  
  return 'Unknown'
}

const getCashFlowTypeLabel = (type: string): string => {
  const option = cashFlowOptions.value.find(opt => opt.value === type)
  return option ? option.label : type
}

const submitChartOfAccount = () => {
  if (!isFormValid.value) return

  const account = {
    ...formData.value,
    group: getAccountGroup(formData.value.accountType),
    currency: 'TZS',
    locked: false,
    timestamp: new Date().toISOString(),
  }

  console.log('Creating chart of account:', account)
  
  // Show success message
  alert(`Chart of Account created successfully!\nCode: ${formData.value.code}\nName: ${formData.value.name}\nType: ${getAccountTypeLabel(formData.value.accountType)}\nGroup: ${getAccountGroup(formData.value.accountType)}`)
  
  // Redirect to chart of accounts
  router.push('/accounting/chart-of-accounts')
}

const saveDraft = () => {
  console.log('Saving as draft:', formData.value)
  alert('Chart of account saved as draft!')
}

const resetForm = () => {
  formData.value = {
    code: '',
    name: '',
    accountType: '',
    cashFlowType: '',
    bringForward: true,
    description: '',
    accessBranches: ['branch-1']
  }
  codeError.value = ''
  suggestedCode.value = ''
}

const goBack = () => {
  router.push('/accounting/chart-of-accounts')
}

const showHelp = () => {
  alert('Add Chart of Account: Create custom accounts in your chart of accounts structure. For common account types like Bank Accounts, Taxes, Expenses, and Other Income, consider using the specialized creation pages for better integration.')
}

defineOptions({
  name: "AddChartOfAccount",
})
</script>