<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Asset Management - Non-Current Assets</h1>
        <p class="text-sm text-gray-600">Create a new asset record</p>
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

    <form @submit.prevent="submitAsset" class="space-y-6">
      <!-- Required Fields Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Required Fields:</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Asset Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Asset Type <span class="text-red-500">*</span>
            </label>
            <select v-model="assetForm.type" class="form-input" required>
              <option value="">Select Asset Type</option>
              <option v-for="category in assetCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <div class="mt-2 flex items-center space-x-2">
              <button type="button" @click="showAddEditType" class="text-purple-600 hover:text-purple-800 text-sm">
                Add/Edit
              </button>
            </div>
          </div>

          <!-- Asset Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Asset Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="assetForm.date"
              type="date"
              class="form-input"
              required
            />
            <p class="text-xs text-gray-500 mt-1">Date when asset was acquired/registered</p>
          </div>

          <!-- Asset Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Asset Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="assetForm.name"
              type="text"
              class="form-input"
              placeholder="Enter asset name"
              required
            />
          </div>
        </div>
      </div>

      <!-- Purchase vs Opening Value Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Is this a Purchase Asset or Opening Value Asset? <span class="text-red-500">*</span>
          </label>
          <div class="flex items-center space-x-6">
            <label class="flex items-center">
              <input
                v-model="assetForm.valueType"
                type="radio"
                value="purchase"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                required
              />
              <span class="ml-2 text-sm text-gray-700">Purchase Asset</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="assetForm.valueType"
                type="radio"
                value="opening"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                required
              />
              <span class="ml-2 text-sm text-gray-700">Opening Value Asset</span>
            </label>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            <p v-if="assetForm.valueType === 'purchase'">
              Purchase Asset: Asset acquired during this accounting period
            </p>
            <p v-if="assetForm.valueType === 'opening'">
              Opening Value Asset: Asset owned from previous accounting periods
            </p>
          </div>
        </div>

        <!-- Purchase/Opening Value Amount -->
        <div v-if="assetForm.valueType">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ assetForm.valueType === 'purchase' ? 'Purchase' : 'Opening' }} Value <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500 text-sm">TZS</span>
            <input
              v-model.number="assetForm.value"
              type="number"
              step="0.01"
              class="form-input pl-12"
              placeholder="0.00"
              required
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">Number or decimal only</p>
        </div>
      </div>

      <!-- Depreciation Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Depreciation:</h2>
          <p class="text-sm text-gray-600">Track asset depreciation over time</p>
        </div>

        <!-- Depreciation Method -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Depreciation Method</label>
          <select v-model="assetForm.depreciationMethod" class="form-input">
            <option value="straight-line">Straight Line</option>
            <option value="declining-balance">Declining Balance</option>
            <option value="units-of-production">Units of Production</option>
            <option value="sum-of-years">Sum of Years' Digits</option>
          </select>
        </div>

        <!-- Depreciation Rate -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Depreciation Rate (% per year)</label>
          <input
            v-model.number="assetForm.depreciationRate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            class="form-input"
            placeholder="10.00"
          />
          <p class="text-xs text-gray-500 mt-1">Annual depreciation percentage</p>
        </div>

        <!-- Depreciation Schedule -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-md font-medium text-gray-900">Depreciation Schedule</h3>
            <button type="button" @click="addDepreciationRow" class="btn btn-sm btn-secondary">
              <PlusIcon class="w-4 h-4 mr-1" />
              Add Year
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Beginning Value</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Depreciation Amount</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ending Value</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, index) in depreciationSchedule" :key="index">
                  <td class="px-4 py-2 text-sm text-gray-900">{{ row.year }}</td>
                  <td class="px-4 py-2">
                    <input
                      v-model.number="row.beginningValue"
                      type="number"
                      step="0.01"
                      class="form-input w-full text-sm"
                      @input="updateDepreciationRow(index)"
                    />
                  </td>
                  <td class="px-4 py-2">
                    <input
                      v-model.number="row.depreciationAmount"
                      type="number"
                      step="0.01"
                      class="form-input w-full text-sm"
                      @input="updateDepreciationRow(index)"
                    />
                  </td>
                  <td class="px-4 py-2">
                    <input
                      v-model.number="row.endingValue"
                      type="number"
                      step="0.01"
                      class="form-input w-full text-sm"
                      readonly
                    />
                  </td>
                  <td class="px-4 py-2">
                    <button 
                      type="button" 
                      @click="removeDepreciationRow(index)" 
                      class="text-red-600 hover:text-red-800"
                      :disabled="depreciationSchedule.length === 1"
                    >
                      <XMarkIcon class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Is Asset Sold Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-3">Is Asset Sold?</label>
          <div class="flex items-center space-x-6">
            <label class="flex items-center">
              <input
                v-model="assetForm.isSold"
                type="radio"
                :value="false"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">No</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="assetForm.isSold"
                type="radio"
                :value="true"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">Yes</span>
            </label>
          </div>
        </div>

        <!-- Sold Asset Details -->
        <div v-if="assetForm.isSold" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 class="text-sm font-medium text-red-900 mb-3">Sold Asset Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-red-700 mb-1">Sale Date</label>
              <input
                v-model="assetForm.saleDate"
                type="date"
                class="form-input"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-red-700 mb-1">Sale Amount</label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500 text-sm">TZS</span>
                <input
                  v-model.number="assetForm.saleAmount"
                  type="number"
                  step="0.01"
                  class="form-input pl-12"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-red-700 mb-1">Buyer Name/Details</label>
              <input
                v-model="assetForm.buyerDetails"
                type="text"
                class="form-input"
                placeholder="Enter buyer information"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Optional Fields Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Optional Fields:</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Serial Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input
              v-model="assetForm.serialNumber"
              type="text"
              class="form-input"
              placeholder="Enter serial number"
            />
          </div>

          <!-- Brand -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              v-model="assetForm.brand"
              type="text"
              class="form-input"
              placeholder="Enter brand name"
            />
          </div>

          <!-- Model -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              v-model="assetForm.model"
              type="text"
              class="form-input"
              placeholder="Enter model"
            />
          </div>

          <!-- Physical Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Physical Location</label>
            <input
              v-model="assetForm.location"
              type="text"
              class="form-input"
              placeholder="Enter physical location"
            />
          </div>

          <!-- Condition -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select v-model="assetForm.condition" class="form-input">
              <option value="">Select Condition</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>

          <!-- Warranty Expiry -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Warranty Expiry Date</label>
            <input
              v-model="assetForm.warrantyExpiry"
              type="date"
              class="form-input"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="assetForm.description"
            rows="4"
            class="form-input"
            placeholder="Enter asset description..."
          ></textarea>
        </div>

        <!-- Invoice/Receipt/Photos -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Invoice/Receipt/Photos</label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
              <div class="flex text-sm text-gray-600">
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                  <span>Upload files</span>
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
              <p class="text-xs text-gray-500">PDF, JPG, PNG, DOC up to 10MB each</p>
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
            No files chosen
          </div>
        </div>
      </div>

      <!-- Accounting Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Accounting:</h2>
          <p class="text-sm text-gray-600">Select your financial account for journal entry:</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cash/Bank</label>
          <select v-model="assetForm.accountingAccount" class="form-input" required>
            <option value="">Select Account</option>
            <option value="cash">Cash</option>
            <option value="crdb-001">CRDB Bank - 001234567</option>
            <option value="nb-002">NMB Bank - 002345678</option>
            <option value="tpb-003">TPB Bank - 003456789</option>
            <option value="equity-004">Equity Bank - 004567890</option>
          </select>
          <div class="mt-2">
            <button type="button" @click="manageBankAccounts" class="text-purple-600 hover:text-purple-800 text-sm">
              Add/Edit Bank Accounts
            </button>
            <span class="text-gray-400 mx-2">•</span>
            <router-link to="/accounting/reconcile" class="text-purple-600 hover:text-purple-800 text-sm">
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
              Add Asset
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  QuestionMarkCircleIcon,
  ArrowLeftIcon,
  DocumentIcon,
  XMarkIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CheckIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Asset categories
const assetCategories = [
  'Buildings and Structures',
  'Computer Equipment',
  'Furniture and Fixtures',
  'Land',
  'Leasehold Improvements',
  'Machinery and Equipment',
  'Motor Vehicles',
  'Office Equipment',
  'Other Tangible Assets',
  'Patents and Trademarks',
  'Plant and Equipment',
  'Software and Licenses',
  'Tools and Equipment',
  'Intangible Assets'
]

interface DepreciationRow {
  year: number
  beginningValue: number | null
  depreciationAmount: number | null
  endingValue: number | null
}

// Form data
const assetForm = ref({
  type: '',
  date: '',
  name: '',
  valueType: '',
  value: null,
  depreciationMethod: 'straight-line',
  depreciationRate: null,
  isSold: false,
  saleDate: '',
  saleAmount: null,
  buyerDetails: '',
  serialNumber: '',
  brand: '',
  model: '',
  location: '',
  condition: '',
  warrantyExpiry: '',
  description: '',
  accountingAccount: 'cash'
})

// Depreciation schedule
const depreciationSchedule = ref<DepreciationRow[]>([
  {
    year: 1,
    beginningValue: null,
    depreciationAmount: null,
    endingValue: null
  }
])

// File handling
const selectedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement>()

// Computed properties
const isFormValid = computed(() => {
  return assetForm.value.type && 
         assetForm.value.date && 
         assetForm.value.name && 
         assetForm.value.valueType &&
         assetForm.value.value && 
         assetForm.value.accountingAccount
})

// Methods
const addDepreciationRow = () => {
  const lastRow = depreciationSchedule.value[depreciationSchedule.value.length - 1]
  depreciationSchedule.value.push({
    year: lastRow.year + 1,
    beginningValue: null,
    depreciationAmount: null,
    endingValue: null
  })
}

const removeDepreciationRow = (index: number) => {
  if (depreciationSchedule.value.length > 1) {
    depreciationSchedule.value.splice(index, 1)
    // Renumber years
    depreciationSchedule.value.forEach((row, idx) => {
      row.year = idx + 1
    })
  }
}

const updateDepreciationRow = (index: number) => {
  const row = depreciationSchedule.value[index]
  if (row.beginningValue !== null && row.depreciationAmount !== null) {
    row.endingValue = row.beginningValue - row.depreciationAmount
  }
}

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

const showHelp = () => {
  alert(`Add Asset Management Help:

Required Fields:
• Asset Type: Select the category of asset
• Asset Date: Date when asset was acquired/registered
• Asset Name: Name/identifier for the asset
• Purchase/Opening Value: Determine if it's a new purchase or existing asset
• Value: Enter the monetary value

Depreciation:
• Track asset depreciation over multiple years
• Add/remove depreciation schedule rows as needed
• System calculates ending value automatically

Optional Fields:
• Serial Number, Brand, Model: For physical asset identification
• Physical Location: Where the asset is located
• Condition: Current state of the asset
• Warranty Expiry: Important for maintenance planning
• Description: Additional details about the asset
• Files: Upload invoices, receipts, or photos

Sold Assets:
• Mark assets as sold and track sale details
• Record sale date, amount, and buyer information

Accounting:
• Select the cash/bank account for the journal entry`)
}

const showAddEditType = () => {
  alert('Add/Edit asset types functionality will be implemented here')
}

const manageBankAccounts = () => {
  router.push('/settings/bank-accounts')
}

const goBack = () => {
  router.back()
}

const resetForm = () => {
  assetForm.value = {
    type: '',
    date: '',
    name: '',
    valueType: '',
    value: null,
    depreciationMethod: 'straight-line',
    depreciationRate: null,
    isSold: false,
    saleDate: '',
    saleAmount: null,
    buyerDetails: '',
    serialNumber: '',
    brand: '',
    model: '',
    location: '',
    condition: '',
    warrantyExpiry: '',
    description: '',
    accountingAccount: 'cash'
  }
  depreciationSchedule.value = [{
    year: 1,
    beginningValue: null,
    depreciationAmount: null,
    endingValue: null
  }]
  selectedFiles.value = []
}

const saveAsDraft = () => {
  console.log('Saving asset as draft:', {
    ...assetForm.value,
    depreciationSchedule: depreciationSchedule.value,
    files: selectedFiles.value
  })
  alert('Asset saved as draft')
}

const submitAsset = () => {
  if (!isFormValid.value) {
    alert('Please fill in all required fields')
    return
  }

  const assetData = {
    ...assetForm.value,
    depreciationSchedule: depreciationSchedule.value,
    files: selectedFiles.value
  }

  console.log('Submitting asset:', assetData)
  alert('Asset added successfully!')
  router.push('/asset-management')
}

// Watch for value changes to auto-populate first depreciation row
watch([() => assetForm.value.value, () => assetForm.value.depreciationRate], () => {
  if (assetForm.value.value && assetForm.value.depreciationRate && depreciationSchedule.value.length > 0) {
    const firstRow = depreciationSchedule.value[0]
    firstRow.beginningValue = assetForm.value.value
    firstRow.depreciationAmount = Math.round((assetForm.value.value * assetForm.value.depreciationRate / 100) * 100) / 100
    updateDepreciationRow(0)
  }
})

// Initialize form with current date
onMounted(() => {
  const today = new Date()
  assetForm.value.date = today.toISOString().split('T')[0]
})
</script>