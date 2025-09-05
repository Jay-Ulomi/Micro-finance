<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Other Income</h1>
        <p class="text-sm text-gray-600">Create a new other income record</p>
      </div>
      <div class="flex space-x-3">
        <button @click="showHelp" class="btn btn-secondary">
          <QuestionMarkCircleIcon class="w-4 h-4 mr-2" />
          Help
        </button>
        <button @click="goBack" class="btn btn-secondary">
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Back
        </button>
      </div>
    </div>

    <form @submit.prevent="submitIncome" class="space-y-6">
      <!-- Required Fields Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Required Fields:</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Type <span class="text-red-500">*</span>
            </label>
            <select v-model="incomeForm.type" class="form-input" required>
              <option value="">Select Income Type</option>
              <option v-for="category in incomeCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <div class="mt-2 flex items-center space-x-2">
              <button type="button" @click="showAddEditType" class="text-blue-600 hover:text-blue-800 text-sm">
                Add/Edit
              </button>
            </div>
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Amount <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500 text-sm">TZS</span>
              <input
                v-model.number="incomeForm.amount"
                type="number"
                step="0.01"
                class="form-input pl-12"
                placeholder="0.00"
                required
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">Number or decimal only</p>
          </div>

          <!-- Transaction Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Transaction Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="incomeForm.date"
              type="date"
              class="form-input"
              required
            />
            <p class="text-xs text-gray-500 mt-1">dd/mm/yyyy</p>
          </div>
        </div>
      </div>

      <!-- Optional Fields: Link Other Income to a Loan -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Optional Fields: Link Other Income to a Loan</h2>
          <p class="text-sm text-gray-600">
            If this income is for a specific loan, you can select the loan below. This income will then show in the View Loan Details page for the below selected loan.
          </p>
          <p class="text-sm text-gray-600 mt-2">
            If this income is not related to any loan, then leave the below empty.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Link to Loan</label>
          <select v-model="incomeForm.linkedLoanId" class="form-input">
            <option value="">Select Loan (Optional)</option>
            <option v-for="loan in availableLoans" :key="loan.id" :value="loan.id">
              {{ loan.borrowerName }} - {{ loan.loanId }} (TZS {{ formatCurrency(loan.amount) }})
            </option>
          </select>
        </div>
      </div>

      <!-- Optional Fields: Other -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Optional Fields: Other</h2>
        </div>

        <!-- Is Other Income Recurring -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">Is Other Income Recurring?</label>
          <div class="flex items-center space-x-6">
            <label class="flex items-center">
              <input
                v-model="incomeForm.isRecurring"
                type="radio"
                :value="false"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">No</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="incomeForm.isRecurring"
                type="radio"
                :value="true"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">Yes</span>
            </label>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            If you select Yes, then the Other Income will be automatically added by system every month.
          </p>
        </div>

        <!-- Recurring Income Settings -->
        <div v-if="incomeForm.isRecurring" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 class="text-sm font-medium text-green-900 mb-3">Add Recurring Other Income</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-green-700 mb-1">Frequency</label>
              <select v-model="incomeForm.recurringFrequency" class="form-input">
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-green-700 mb-1">Next Due Date</label>
              <input
                v-model="incomeForm.nextDueDate"
                type="date"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="incomeForm.description"
            rows="4"
            class="form-input"
            placeholder="Enter income description..."
          ></textarea>
        </div>

        <!-- Invoice/Receipt -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Invoice/Receipt</label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
              <div class="flex text-sm text-gray-600">
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    ref="fileInput"
                    type="file"
                    class="sr-only"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    @change="handleFileUpload"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">PDF, JPG, PNG, DOC up to 10MB</p>
            </div>
          </div>
          
          <!-- Selected Files -->
          <div v-if="selectedFiles.length > 0" class="mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
            <div class="space-y-2">
              <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                <div class="flex items-center">
                  <DocumentIcon class="h-5 w-5 text-gray-400 mr-2" />
                  <span class="text-sm text-gray-900">{{ file.name }}</span>
                  <span class="text-xs text-gray-500 ml-2">({{ formatFileSize(file.size) }})</span>
                </div>
                <button type="button" @click="removeFile(index)" class="text-red-600 hover:text-red-800">
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div v-else class="mt-2 text-sm text-gray-500">
            No file chosen
          </div>
        </div>
      </div>

      <!-- Accounting Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Accounting:</h2>
          <p class="text-sm text-gray-600">Select your financial account for journal entry:</p>
        </div>

        <!-- Cash/Bank Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Cash/Bank</label>
          <select v-model="incomeForm.accountingAccount" class="form-input" required>
            <option value="">Select Account</option>
            <option value="cash">Cash</option>
            <option value="crdb-001">CRDB Bank - 001234567</option>
            <option value="nb-002">NMB Bank - 002345678</option>
            <option value="tpb-003">TPB Bank - 003456789</option>
            <option value="equity-004">Equity Bank - 004567890</option>
          </select>
          <div class="mt-2">
            <button type="button" @click="manageBankAccounts" class="text-blue-600 hover:text-blue-800 text-sm">
              Add/Edit Bank Accounts
            </button>
            <span class="text-gray-400 mx-2">•</span>
            <router-link to="/accounting/reconcile" class="text-blue-600 hover:text-blue-800 text-sm">
              To bulk reconcile past entries with bank accounts, please visit Accounting(left menu) → Reconcile Entries
            </router-link>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            All required fields must be completed before saving.
          </div>
          <div class="flex space-x-3">
            <button type="button" @click="resetForm" class="btn btn-secondary">
              <ArrowPathIcon class="w-4 h-4 mr-2" />
              Reset Form
            </button>
            <button type="button" @click="saveAsDraft" class="btn btn-secondary">
              <DocumentTextIcon class="w-4 h-4 mr-2" />
              Save as Draft
            </button>
            <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
              <CheckIcon class="w-4 h-4 mr-2" />
              Add Other Income
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  QuestionMarkCircleIcon,
  ArrowLeftIcon,
  DocumentIcon,
  XMarkIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Income categories
const incomeCategories = [
  'Business Income',
  'Capital Gains',
  'Collateral Sale',
  'Dividends',
  'Farming and Fishing Income',
  'Grants',
  'Interest Received',
  'Lump-Sum Distributions',
  'Membership Fee',
  'Motor Vehicle Sale',
  'Passive Activities',
  'Rental Income and Expenses',
  'Renting Residential and Vacation Property',
  'Securities Sale',
  'Stock Options'
]

// Mock loans data
const availableLoans = ref([
  {
    id: 'L001',
    loanId: 'L001',
    borrowerName: 'John Doe',
    amount: 50000
  },
  {
    id: 'L002',
    loanId: 'L002',
    borrowerName: 'Jane Smith',
    amount: 75000
  },
  {
    id: 'L003',
    loanId: 'L003',
    borrowerName: 'Michael Johnson',
    amount: 100000
  }
])

// Form data
const incomeForm = ref({
  type: '',
  amount: null,
  date: '',
  linkedLoanId: '',
  isRecurring: false,
  recurringFrequency: 'monthly',
  nextDueDate: '',
  description: '',
  accountingAccount: 'cash'
})

// File handling
const selectedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement>()

// Computed properties
const isFormValid = computed(() => {
  return incomeForm.value.type && 
         incomeForm.value.amount && 
         incomeForm.value.date && 
         incomeForm.value.accountingAccount
})

// Methods
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    selectedFiles.value.push(...newFiles)
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US')
}

const showHelp = () => {
  alert(`Add Other Income Help:

Required Fields:
• Type: Select the category of income
• Amount: Enter amount in numbers or decimals only
• Transaction Date: Select the date in dd/mm/yyyy format

Optional Fields:
• Link to Loan: Connect this income to a specific loan
• Is Other Income Recurring: Set up automatic monthly income
• Description: Add details about the income
• Invoice/Receipt: Upload supporting documents

Accounting:
• Select the cash/bank account for the journal entry`)
}

const showAddEditType = () => {
  alert('Add/Edit income types functionality will be implemented here')
}

const manageBankAccounts = () => {
  router.push('/settings/bank-accounts')
}

const goBack = () => {
  router.back()
}

const resetForm = () => {
  incomeForm.value = {
    type: '',
    amount: null,
    date: '',
    linkedLoanId: '',
    isRecurring: false,
    recurringFrequency: 'monthly',
    nextDueDate: '',
    description: '',
    accountingAccount: 'cash'
  }
  selectedFiles.value = []
}

const saveAsDraft = () => {
  console.log('Saving other income as draft:', {
    ...incomeForm.value,
    files: selectedFiles.value
  })
  alert('Other income saved as draft')
}

const submitIncome = () => {
  if (!isFormValid.value) {
    alert('Please fill in all required fields')
    return
  }

  const incomeData = {
    ...incomeForm.value,
    files: selectedFiles.value
  }

  console.log('Submitting other income:', incomeData)
  alert('Other income added successfully!')
  router.push('/other-income')
}

// Initialize form with current date
onMounted(() => {
  const today = new Date()
  incomeForm.value.date = today.toISOString().split('T')[0]
  
  // Set next due date to next month if recurring is enabled
  const nextMonth = new Date(today)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  incomeForm.value.nextDueDate = nextMonth.toISOString().split('T')[0]
})
</script>