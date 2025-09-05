<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Upload Other Income - CSV file</h1>
        <p class="text-sm text-gray-600">Import other income data from Excel or CSV files</p>
      </div>
      <div class="flex space-x-3">
        <button @click="downloadSampleFile" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Download Sample
        </button>
        <button @click="goBack" class="btn btn-secondary">
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Back
        </button>
      </div>
    </div>

    <!-- Step 1: Upload File -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Step 1: Upload File</h2>
      <p class="text-sm text-gray-600 mb-6">
        If you have other income data in an Excel or CSV file, you can import the data using this page.
      </p>

      <!-- How to convert Excel to CSV -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-3">How to convert Excel file to CSV</h3>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <ol class="list-decimal list-inside space-y-2 text-sm text-blue-900">
            <li>Open your excel file.</li>
            <li>Click on File and Save as.</li>
            <li>Select where you would like to save the file (like your desktop or a drive).</li>
            <li>In the File Name area, name your document.</li>
            <li>In the Save as Type area, select <strong>CSV(Comma Delimited)</strong> from the pull down menu.</li>
            <li>Besides CSV (comma delimited), there is CSV (Macintosh) and CSV (MS-DOS) formats available. <strong>Do not save the file as these formats.</strong></li>
            <li>Click Save.</li>
            <li>You may receive one or two warning about the formatting of .csv, click yes.</li>
          </ol>
        </div>
      </div>

      <!-- Prepare your other income file -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-3">Prepare your other income file:</h3>
        <p class="text-sm text-gray-600 mb-4">
          You must have <strong>Other Income Type</strong>, <strong>Other Income Amount</strong> and <strong>Other Income Date</strong> column in your other income file. Rest of the below columns are optional.
        </p>

        <!-- Required Columns Table -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-gray-900 mb-3">Required Columns</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Column Name
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allowed Values
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">Other Income Type</td>
                  <td class="px-4 py-4 text-sm text-gray-600">
                    <div class="space-y-1">
                      <div v-for="type in incomeTypes" :key="type" class="text-xs">{{ type }}</div>
                      <button @click="showAddEditTypes" class="text-blue-600 hover:text-blue-800 text-xs mt-2">
                        Add/Edit Other Income Type
                      </button>
                    </div>
                  </td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">Other Income Amount</td>
                  <td class="px-4 py-4 text-sm text-gray-600">Numbers or Decimals only</td>
                </tr>
                <tr>
                  <td class="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">Other Income Date</td>
                  <td class="px-4 py-4 text-sm text-gray-600">dd/mm/yyyy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Optional Columns Table -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-gray-900 mb-3">Optional Columns</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Column Name
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allowed Values
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">Link to Loan</td>
                  <td class="px-4 py-4 text-sm text-gray-600">Unique Loan Number</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">Is Other Income Recurring?</td>
                  <td class="px-4 py-4 text-sm text-gray-600">
                    <div>
                      <p>Yes or No. If you select Yes, then the Other Income will be automatically added by system every month.</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">Description</td>
                  <td class="px-4 py-4 text-sm text-gray-600">Any</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Add Recurring Other Income Section -->
        <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 class="text-md font-medium text-green-900 mb-3">Add Recurring Other Income</h4>
          <p class="text-sm text-green-800 mb-3">
            If you select Yes in <strong>Is Other Income Recurring?</strong> field above, then you must specify the period below when the other income should be automatically added by the system:
          </p>
          
          <!-- Recurring Options -->
          <div class="space-y-4">
            <!-- Weekly -->
            <div>
              <h5 class="text-sm font-medium text-green-900 mb-1">Weekly:</h5>
              <div class="text-xs text-green-800 space-y-1">
                <div v-for="day in weeklyOptions" :key="day">{{ day }}</div>
              </div>
            </div>

            <!-- Every First and Third Week -->
            <div>
              <h5 class="text-sm font-medium text-green-900 mb-1">Every First and Third Week of Month:</h5>
              <div class="text-xs text-green-800 space-y-1">
                <div v-for="day in firstThirdWeekOptions" :key="day">{{ day }}</div>
              </div>
            </div>

            <!-- Every Second and Fourth Week -->
            <div>
              <h5 class="text-sm font-medium text-green-900 mb-1">Every Second and Fourth Week of Month:</h5>
              <div class="text-xs text-green-800 space-y-1">
                <div v-for="day in secondFourthWeekOptions" :key="day">{{ day }}</div>
              </div>
            </div>

            <!-- Monthly -->
            <div>
              <h5 class="text-sm font-medium text-green-900 mb-1">Monthly:</h5>
              <div class="grid grid-cols-4 gap-1 text-xs text-green-800">
                <div v-for="day in monthlyOptions" :key="day">{{ day }}</div>
              </div>
            </div>

            <!-- Custom -->
            <div>
              <h5 class="text-sm font-medium text-green-900 mb-1">Custom:</h5>
              <div class="text-xs text-green-800">
                15th and 30th of every month
              </div>
            </div>
          </div>
        </div>

        <!-- Accounting Section -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-gray-900 mb-3">Accounting</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Column Name
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allowed Values
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">Source of Funds for Other Income Amount</td>
                  <td class="px-4 py-4 text-sm text-gray-600">
                    <div class="space-y-1">
                      <div class="text-sm">Cash</div>
                      <button @click="manageBankAccounts" class="text-blue-600 hover:text-blue-800 text-sm">
                        Add/Edit Bank Accounts
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-3">Tips:</h3>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <ul class="space-y-2 text-sm text-yellow-900">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>
                <button @click="downloadSampleFile" class="text-blue-600 hover:text-blue-800 underline">
                  Click here to download a sample file.
                </button>
              </span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Other Income will be uploaded in Branch #1 since you are currently logged into this branch.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>You can upload a maximum of <strong>4500 entries</strong> in 1 file. If you have more entries, please split them into multiple files.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Upload Section -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Upload your file:</h3>
        
        <!-- Column Separator -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Columns Separated By (optional)
          </label>
          <select v-model="columnSeparator" class="form-input w-64">
            <option value="">Auto Detect</option>
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">
            Leave this empty so the system can auto detect. Only select this, if after uploading, you are seeing all the data in 1 column on Step 2.
          </p>
        </div>

        <!-- File Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV File(.csv)
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
              <div class="flex text-sm text-gray-600">
                <label for="csv-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                  <span>Upload CSV file</span>
                  <input
                    id="csv-upload"
                    ref="csvFileInput"
                    type="file"
                    class="sr-only"
                    accept=".csv"
                    @change="handleFileUpload"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">CSV files up to 10MB</p>
            </div>
          </div>
          
          <!-- Selected File -->
          <div v-if="selectedFile" class="mt-4">
            <div class="flex items-center justify-between bg-green-50 px-3 py-2 rounded-md border border-green-200">
              <div class="flex items-center">
                <DocumentIcon class="h-5 w-5 text-green-600 mr-2" />
                <span class="text-sm text-green-900">{{ selectedFile.name }}</span>
                <span class="text-xs text-green-700 ml-2">({{ formatFileSize(selectedFile.size) }})</span>
              </div>
              <button type="button" @click="removeFile" class="text-red-600 hover:text-red-800">
                <XMarkIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div v-else class="mt-2 text-sm text-gray-500">
            No file chosen
          </div>
        </div>

        <!-- Upload Button -->
        <div class="flex justify-start">
          <button 
            @click="uploadFile" 
            :disabled="!selectedFile" 
            class="btn btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': !selectedFile }"
          >
            <CloudArrowUpIcon class="w-4 h-4 mr-2" />
            Upload and Continue to Step 2
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  DocumentArrowDownIcon,
  ArrowLeftIcon,
  DocumentIcon,
  XMarkIcon,
  CloudArrowUpIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Income types
const incomeTypes = [
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

// Recurring options
const weeklyOptions = [
  'Monday of every week',
  'Tuesday of every week',
  'Wednesday of every week',
  'Thursday of every week',
  'Friday of every week',
  'Saturday of every week',
  'Sunday of every week'
]

const firstThirdWeekOptions = [
  'Monday of every first and third week in a month',
  'Tuesday of every first and third week in a month',
  'Wednesday of every first and third week in a month',
  'Thursday of every first and third week in a month',
  'Friday of every first and third week in a month',
  'Saturday of every first and third week in a month',
  'Sunday of every first and third week in a month'
]

const secondFourthWeekOptions = [
  'Monday of every second and fourth week in a month',
  'Tuesday of every second and fourth week in a month',
  'Wednesday of every second and fourth week in a month',
  'Thursday of every second and fourth week in a month',
  'Friday of every second and fourth week in a month',
  'Saturday of every second and fourth week in a month',
  'Sunday of every second and fourth week in a month'
]

const monthlyOptions = [
  '1st of every month', '2nd of every month', '3rd of every month', '4th of every month',
  '5th of every month', '6th of every month', '7th of every month', '8th of every month',
  '9th of every month', '10th of every month', '11th of every month', '12th of every month',
  '13th of every month', '14th of every month', '15th of every month', '16th of every month',
  '17th of every month', '18th of every month', '19th of every month', '20th of every month',
  '21st of every month', '22nd of every month', '23rd of every month', '24th of every month',
  '25th of every month', '26th of every month', '27nd of every month', '28th of every month',
  '29th of every month', '30th of every month', '31th of every month', 'End of every month'
]

// Form data
const columnSeparator = ref('')
const selectedFile = ref<File | null>(null)
const csvFileInput = ref<HTMLInputElement>()

// Methods
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const removeFile = () => {
  selectedFile.value = null
  if (csvFileInput.value) {
    csvFileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadSampleFile = () => {
  // Create sample CSV content
  const sampleData = [
    ['Other Income Type', 'Other Income Amount', 'Other Income Date', 'Link to Loan', 'Is Other Income Recurring?', 'Description', 'Source of Funds for Other Income Amount'],
    ['Business Income', '5000', '01/01/2024', 'L001', 'No', 'Monthly business revenue', 'Cash'],
    ['Interest Received', '250.50', '15/01/2024', '', 'Yes', 'Bank interest payment', 'Cash'],
    ['Grants', '10000', '01/02/2024', 'L002', 'No', 'Government grant', 'Cash']
  ]
  
  const csvContent = sampleData.map(row => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'other_income_sample.csv'
  link.click()
  window.URL.revokeObjectURL(url)
}

const showAddEditTypes = () => {
  alert('Add/Edit Other Income Types functionality will be implemented here')
}

const manageBankAccounts = () => {
  router.push('/settings/bank-accounts')
}

const goBack = () => {
  router.back()
}

const uploadFile = () => {
  if (!selectedFile.value) {
    alert('Please select a CSV file to upload')
    return
  }

  console.log('Uploading file:', {
    file: selectedFile.value,
    separator: columnSeparator.value || 'auto-detect'
  })

  // Simulate file processing
  alert(`File "${selectedFile.value.name}" uploaded successfully! Proceeding to Step 2...`)
  
  // Here you would typically navigate to Step 2 or process the file
  router.push('/other-income/upload/step2')
}
</script>