<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Tax</h1>
        <p class="text-sm text-gray-600">Configure tax settings for your system</p>
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

    <!-- Tax Form -->
    <form @submit.prevent="submitTax" class="space-y-6">
      <!-- Required Fields -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Required Fields:</h3>
        
        <div class="space-y-6">
          <!-- Tax Name -->
          <div>
            <label for="taxName" class="block text-sm font-medium text-gray-700 mb-1">
              Tax Name <span class="text-red-500">*</span>
            </label>
            <input
              id="taxName"
              v-model="formData.taxName"
              type="text"
              required
              class="form-input"
              placeholder="Name"
            />
            <p class="mt-1 text-xs text-gray-500">Enter descriptive name for the tax</p>
          </div>

          <!-- Tax Type -->
          <div>
            <label for="taxType" class="block text-sm font-medium text-gray-700 mb-1">
              Tax Type <span class="text-red-500">*</span>
            </label>
            <select
              id="taxType"
              v-model="formData.taxType"
              required
              class="form-input"
            >
              <option value="">Select Tax Type</option>
              <option value="vat">VAT (Value Added Tax)</option>
              <option value="income-tax">Income Tax</option>
              <option value="service-tax">Service Tax</option>
              <option value="withholding-tax">Withholding Tax</option>
              <option value="customs-duty">Customs Duty</option>
              <option value="excise-tax">Excise Tax</option>
              <option value="property-tax">Property Tax</option>
              <option value="other">Other</option>
            </select>
            <p class="mt-1 text-xs text-gray-500">Select the type of tax being configured</p>
          </div>
        </div>
      </div>

      <!-- Tax Amount Configuration -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Tax Amount Type</h3>
        
        <div class="space-y-4">
          <!-- Tax Amount Type Selection -->
          <div class="space-y-3">
            <label class="flex items-center p-4 border rounded-lg cursor-pointer transition-all"
                   :class="[
                     formData.taxAmountType === 'percentage'
                       ? 'border-blue-500 bg-blue-50'
                       : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                   ]">
              <input
                type="radio"
                v-model="formData.taxAmountType"
                value="percentage"
                class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">
                  I want Tax to be percentage % based
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Tax will be calculated as a percentage of the base amount
                </div>
              </div>
            </label>

            <label class="flex items-center p-4 border rounded-lg cursor-pointer transition-all"
                   :class="[
                     formData.taxAmountType === 'fixed'
                       ? 'border-blue-500 bg-blue-50'
                       : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                   ]">
              <input
                type="radio"
                v-model="formData.taxAmountType"
                value="fixed"
                class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">
                  I want Tax to be a fixed amount
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Tax will be a fixed amount regardless of the base amount
                </div>
              </div>
            </label>
          </div>

          <!-- Tax Amount Input -->
          <div v-if="formData.taxAmountType" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Percentage Amount -->
            <div v-if="formData.taxAmountType === 'percentage'">
              <label for="taxPercentage" class="block text-sm font-medium text-gray-700 mb-1">
                Tax Amount % <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="taxPercentage"
                  v-model.number="formData.taxPercentage"
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  max="100"
                  class="form-input pr-8"
                  placeholder="0.00"
                />
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
              </div>
              <p class="mt-1 text-xs text-gray-500">Enter percentage value (0-100)</p>
            </div>

            <!-- Fixed Amount -->
            <div v-if="formData.taxAmountType === 'fixed'">
              <label for="taxAmount" class="block text-sm font-medium text-gray-700 mb-1">
                Tax Amount <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">TZS</span>
                <input
                  id="taxAmount"
                  v-model.number="formData.taxFixedAmount"
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  class="form-input pl-12"
                  placeholder="0.00"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">Enter fixed tax amount in TZS</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tax Calculation Settings -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Calculation of Tax: Decimal Places</h3>
        
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="formData.decimalPlaces"
                value="2"
                class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Round Off to 2 Decimal Places</span>
            </label>
          </div>
          
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="formData.decimalPlaces"
                value="0"
                class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Round Off to Whole Number (0 Decimal Places)</span>
            </label>
          </div>
          
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="formData.decimalPlaces"
                value="4"
                class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Round Off to 4 Decimal Places</span>
            </label>
          </div>
        </div>

        <!-- Tax Calculation Preview -->
        <div v-if="formData.taxAmountType && (formData.taxPercentage > 0 || formData.taxFixedAmount > 0)" 
             class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-900 mb-3">Tax Calculation Preview</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Sample Base Amount:</span>
              <span class="font-mono">TZS 1,000.00</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tax Calculation:</span>
              <span class="font-mono">{{ getTaxCalculationPreview() }}</span>
            </div>
            <div class="flex justify-between font-medium">
              <span class="text-gray-900">Tax Amount:</span>
              <span class="font-mono">TZS {{ formatCurrency(getPreviewTaxAmount()) }}</span>
            </div>
            <div class="flex justify-between font-medium">
              <span class="text-gray-900">Total Amount:</span>
              <span class="font-mono">TZS {{ formatCurrency(1000 + getPreviewTaxAmount()) }}</span>
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

      <!-- Tax Summary -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Tax Configuration Summary</h3>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <dl class="space-y-2">
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Tax Name:</dt>
              <dd class="font-medium text-gray-900">
                {{ formData.taxName || 'Not set' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Tax Type:</dt>
              <dd class="font-medium text-gray-900">
                {{ getTaxTypeLabel(formData.taxType) || 'Not selected' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Amount Type:</dt>
              <dd class="font-medium text-gray-900">
                {{ formData.taxAmountType === 'percentage' ? 'Percentage Based' : 
                   formData.taxAmountType === 'fixed' ? 'Fixed Amount' : 'Not selected' }}
              </dd>
            </div>
            <div v-if="formData.taxAmountType === 'percentage'" class="flex justify-between text-sm">
              <dt class="text-gray-600">Tax Rate:</dt>
              <dd class="font-medium text-gray-900">
                {{ formData.taxPercentage || 0 }}%
              </dd>
            </div>
            <div v-if="formData.taxAmountType === 'fixed'" class="flex justify-between text-sm">
              <dt class="text-gray-600">Tax Amount:</dt>
              <dd class="font-medium text-gray-900">
                TZS {{ formatCurrency(formData.taxFixedAmount || 0) }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-600">Decimal Places:</dt>
              <dd class="font-medium text-gray-900">
                {{ formData.decimalPlaces || '2' }} decimal places
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
          Create Tax
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
  XMarkIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Available branches
const availableBranches = ref([
  { id: 'branch-1', name: 'Branch #1', code: 'BR001', currency: 'TZS' },
  { id: 'branch-2', name: 'Branch #2', code: 'BR002', currency: 'TZS' },
  { id: 'branch-3', name: 'Branch #3', code: 'BR003', currency: 'TZS' },
  { id: 'branch-4', name: 'Branch #4', code: 'BR004', currency: 'TZS' },
])

// Form data
const formData = ref({
  taxName: '',
  taxType: '',
  taxAmountType: '',
  taxPercentage: 0,
  taxFixedAmount: 0,
  decimalPlaces: '2', // Default to 2 decimal places
  accessBranches: ['branch-1'] // Default to Branch #1 as shown in mockup
})

// Computed properties
const selectedBranchCount = computed(() => formData.value.accessBranches.length)

const isFormValid = computed(() => {
  const hasBasicFields = formData.value.taxName && formData.value.taxType && formData.value.taxAmountType
  const hasAmountValue = formData.value.taxAmountType === 'percentage' 
    ? formData.value.taxPercentage > 0 
    : formData.value.taxAmountType === 'fixed' 
      ? formData.value.taxFixedAmount > 0 
      : false
  const hasBranchAccess = formData.value.accessBranches.length > 0
  
  return hasBasicFields && hasAmountValue && hasBranchAccess
})

// Methods
const selectAllBranches = () => {
  formData.value.accessBranches = availableBranches.value.map(b => b.id)
}

const clearAllBranches = () => {
  formData.value.accessBranches = []
}

const getTaxTypeLabel = (type: string): string => {
  const types = {
    'vat': 'VAT (Value Added Tax)',
    'income-tax': 'Income Tax',
    'service-tax': 'Service Tax',
    'withholding-tax': 'Withholding Tax',
    'customs-duty': 'Customs Duty',
    'excise-tax': 'Excise Tax',
    'property-tax': 'Property Tax',
    'other': 'Other'
  }
  return types[type] || type
}

const getTaxCalculationPreview = (): string => {
  if (formData.value.taxAmountType === 'percentage') {
    return `1,000.00 × ${formData.value.taxPercentage}%`
  } else if (formData.value.taxAmountType === 'fixed') {
    return `Fixed Amount`
  }
  return ''
}

const getPreviewTaxAmount = (): number => {
  let taxAmount = 0
  
  if (formData.value.taxAmountType === 'percentage') {
    taxAmount = (1000 * formData.value.taxPercentage) / 100
  } else if (formData.value.taxAmountType === 'fixed') {
    taxAmount = formData.value.taxFixedAmount
  }
  
  // Apply decimal places rounding
  const decimalPlaces = parseInt(formData.value.decimalPlaces)
  return Math.round(taxAmount * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
}

const formatCurrency = (amount: number): string => {
  const decimalPlaces = parseInt(formData.value.decimalPlaces)
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  })
}

const submitTax = () => {
  if (!isFormValid.value) return

  const tax = {
    ...formData.value,
    calculatedTaxAmount: getPreviewTaxAmount(),
    timestamp: new Date().toISOString(),
  }

  console.log('Creating tax:', tax)
  
  // Show success message
  const amountDisplay = formData.value.taxAmountType === 'percentage' 
    ? `${formData.value.taxPercentage}%`
    : `TZS ${formatCurrency(formData.value.taxFixedAmount)}`
  
  alert(`Tax created successfully!\nName: ${formData.value.taxName}\nType: ${getTaxTypeLabel(formData.value.taxType)}\nAmount: ${amountDisplay}\nBranch Access: ${selectedBranchCount.value} branches`)
  
  // Redirect to settings or tax list
  router.push('/settings')
}

const saveDraft = () => {
  console.log('Saving as draft:', formData.value)
  alert('Tax configuration saved as draft!')
}

const resetForm = () => {
  formData.value = {
    taxName: '',
    taxType: '',
    taxAmountType: '',
    taxPercentage: 0,
    taxFixedAmount: 0,
    decimalPlaces: '2',
    accessBranches: ['branch-1']
  }
}

const goBack = () => {
  router.push('/settings')
}

const showHelp = () => {
  alert('Add Tax: Configure tax settings including percentage or fixed amount taxes, decimal place rounding, and branch access control. This tax configuration will be used throughout the system for calculations.')
}

defineOptions({
  name: "AddTax",
})
</script>