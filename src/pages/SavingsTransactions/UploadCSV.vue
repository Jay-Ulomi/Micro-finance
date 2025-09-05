<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Upload Transactions from CSV file</h1>
        <p class="text-sm text-gray-600">Step 1: Upload File</p>
      </div>
      <button @click="goBack" class="btn btn-secondary">
        <ArrowLeftIcon class="w-4 h-4 mr-2" />
        Back to Transactions
      </button>
    </div>

    <!-- Instructions -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Instructions</h2>
      </div>
      <div class="card-body">
        <p class="text-gray-700 mb-4">
          If you have Savings Transactions data in an Excel or CSV file, you can import the data using this page.
        </p>

        <!-- Excel to CSV Instructions -->
        <div class="mb-6">
          <h3 class="font-semibold text-gray-900 mb-3">How to convert Excel file to CSV</h3>
          <ol class="list-decimal list-inside space-y-1 text-sm text-gray-700 ml-4">
            <li>Open your excel file.</li>
            <li>Click on File and Save as.</li>
            <li>Select where you would like to save the file (like your desktop or a drive).</li>
            <li>In the File Name area, name your document.</li>
            <li>In the Save as Type area, select CSV(Comma Delimited) from the pull down menu.</li>
            <li>Besides CSV (comma delimited), there is CSV (Macintosh) and CSV (MS-DOS) formats available. Do not save the file as these formats.</li>
            <li>Click Save.</li>
            <li>You may receive one or two warning about the formatting of .csv, click yes.</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- File Format Requirements -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Prepare your Savings Transactions file:</h2>
      </div>
      <div class="card-body">
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Required Columns -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">Required Columns</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-800">Allowed Values</h4>
                <div class="mt-2 space-y-3 text-sm">
                  <div>
                    <strong>Savings Account Number:</strong>
                    <p class="text-gray-600">Unique Savings Account Number. If you don't enter a savings account number, a Savings column will be added in Step 2 so you can select the corresponding savings account for each transaction.</p>
                  </div>
                  
                  <div>
                    <strong>Type:</strong>
                    <div class="mt-1">
                      <p class="text-green-700 font-medium">Credit Types:</p>
                      <ul class="list-disc list-inside text-gray-600 ml-4">
                        <li>Deposit</li>
                        <li>Interest</li>
                        <li>Dividend</li>
                        <li>Transfer In</li>
                      </ul>
                      <p class="text-red-700 font-medium mt-2">Debit Types:</p>
                      <ul class="list-disc list-inside text-gray-600 ml-4">
                        <li>Withdrawal</li>
                        <li>Bank Fees</li>
                        <li>Transfer Out</li>
                        <li>Commission</li>
                      </ul>
                      <p class="text-blue-600 hover:text-blue-800 cursor-pointer mt-1">Add/Edit Types</p>
                    </div>
                  </div>
                  
                  <div>
                    <strong>Date:</strong>
                    <p class="text-gray-600">Date when the savings transaction was entered. Must be in dd/mm/yyyy format</p>
                  </div>
                  
                  <div>
                    <strong>Time:</strong>
                    <p class="text-gray-600">Time when the savings transaction was entered. Must be in 24 hour format such as 16:35 or 09:10</p>
                  </div>
                  
                  <div>
                    <strong>Amount:</strong>
                    <p class="text-gray-600">Numbers or Decimals only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Optional Columns -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">Optional Columns</h3>
            <div class="space-y-4 text-sm">
              <div>
                <h4 class="font-medium text-gray-800">Allowed Values</h4>
                <div class="mt-2 space-y-3">
                  <div>
                    <strong>Description:</strong>
                    <p class="text-gray-600">Any</p>
                  </div>
                  
                  <div>
                    <strong>Accounting:</strong>
                    <div class="mt-1">
                      <p class="font-medium">Allowed Values</p>
                      <p class="text-gray-600">Cash/Bank</p>
                      <ul class="list-disc list-inside text-gray-600 ml-4 mt-1">
                        <li>Cash</li>
                      </ul>
                      <p class="text-blue-600 hover:text-blue-800 cursor-pointer mt-1">Add/Edit Bank Accounts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-semibold text-blue-900 mb-3">Tips:</h3>
          <ul class="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>
              <button @click="downloadSample" class="text-blue-600 hover:text-blue-800 underline">
                Click here to download a sample file.
              </button>
            </li>
            <li>Savings Transactions will be uploaded in Branch #1 since you are currently logged into this branch.</li>
            <li>It is advisable that you have a savings account number column in the savings transactions file otherwise you will have to manually select the savings account number for each transaction.</li>
            <li>Please delete commas and currency symbols in the Amount column. Only have numbers or decimals in the Amount column.</li>
            <li>The Date column must have dates in the dd/mm/yyyy format.</li>
            <li>You can upload a maximum of 100000 entries in 1 file. If you have more entries, please split them into multiple files.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Upload Configuration -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Upload Configuration</h2>
      </div>
      <div class="card-body space-y-6">
        <!-- Options -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Select the options that apply to all transactions in the file:</h3>
          
          <!-- Savings Account Number Option -->
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Do you have Savings Account Number column in the transactions file?
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input 
                    v-model="uploadConfig.hasSavingsAccountColumn" 
                    :value="false" 
                    type="radio" 
                    class="form-radio"
                  />
                  <span class="ml-2">No</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="uploadConfig.hasSavingsAccountColumn" 
                    :value="true" 
                    type="radio" 
                    class="form-radio"
                  />
                  <span class="ml-2">Yes</span>
                </label>
              </div>
              <p class="text-xs text-gray-600 mt-1">
                If you select No above, a Savings Account Number column will be added in Step 2 so you can select the corresponding savings account number for each transaction.
              </p>
            </div>

            <!-- Maximum Fields Info -->
            <div class="p-3 bg-yellow-50 rounded-md">
              <h4 class="font-medium text-yellow-900 mb-1">Maximum Fields Allowed in File:</h4>
              <p class="text-sm text-yellow-800">
                <span v-if="!uploadConfig.hasSavingsAccountColumn">
                  If you select No above, you can upload a maximum of 100,000 fields in 1 file.
                </span>
                <span v-else>
                  If you select Yes above, you can upload approximately 2,000,000 fields (maximum of 100,000 rows) in 1 file.
                </span>
              </p>
            </div>
          </div>

          <!-- Save Options -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Save options:
            </label>
            <p class="text-xs text-gray-600 mb-2">Save options on this page</p>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input 
                  v-model="uploadConfig.saveOptions" 
                  :value="false" 
                  type="radio" 
                  class="form-radio"
                />
                <span class="ml-2">No</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="uploadConfig.saveOptions" 
                  :value="true" 
                  type="radio" 
                  class="form-radio"
                />
                <span class="ml-2">Yes</span>
              </label>
            </div>
            <p class="text-xs text-gray-600 mt-1">
              If you select Yes above, the options you have selected on this page will be saved so when you load this page again for this branch, the options will be preselected. This will save you time from entering them again.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- File Upload -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Upload your file:</h2>
      </div>
      <div class="card-body space-y-4">
        <!-- Columns Separator -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Columns Separated By (optional)
          </label>
          <input 
            v-model="uploadConfig.columnSeparator" 
            type="text" 
            placeholder="Leave empty for auto-detect"
            class="form-input w-64"
          />
          <p class="text-xs text-gray-600 mt-1">
            Leave this empty so the system can auto detect. Only select this, if after uploading, you are seeing all the data in 1 column on Step 2.
          </p>
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV File (.csv)
          </label>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <input
                ref="fileInput"
                type="file"
                accept=".csv,.txt"
                @change="handleFileSelect"
                class="hidden"
              />
              <div 
                @click="$refs.fileInput.click()"
                @dragover.prevent="dragOver = true"
                @dragleave="dragOver = false"
                @drop.prevent="handleFileDrop"
                :class="[
                  'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                ]"
              >
                <CloudArrowUpIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600 mb-2">
                  {{ selectedFile ? selectedFile.name : 'Click to select CSV file or drag and drop' }}
                </p>
                <p class="text-xs text-gray-500">
                  Supports CSV files up to {{ maxFileSize }}MB
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- File Preview -->
        <div v-if="selectedFile" class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Selected File:</h4>
            <div class="text-sm text-gray-700">
              <p><strong>Name:</strong> {{ selectedFile.name }}</p>
              <p><strong>Size:</strong> {{ formatFileSize(selectedFile.size) }}</p>
              <p><strong>Type:</strong> {{ selectedFile.type || 'text/csv' }}</p>
            </div>
          </div>

          <!-- CSV Preview -->
          <div v-if="csvPreview.length > 0" class="space-y-2">
            <h4 class="font-medium text-gray-900">File Preview (First 5 rows):</h4>
            <div class="overflow-x-auto bg-white border rounded-lg">
              <table class="table">
                <thead>
                  <tr>
                    <th v-for="(header, index) in csvHeaders" :key="index" class="text-left text-xs">
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in csvPreview.slice(0, 5)" :key="index">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="text-xs">
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-xs text-gray-600">
              Total rows detected: {{ csvPreview.length }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button @click="resetUpload" class="btn btn-secondary">
            <XMarkIcon class="w-4 h-4 mr-2" />
            Reset
          </button>
          <button 
            @click="proceedToStep2" 
            :disabled="!selectedFile || csvPreview.length === 0"
            class="btn btn-primary"
          >
            <ArrowRightIcon class="w-4 h-4 mr-2" />
            Proceed to Step 2
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { 
  ArrowLeftIcon,
  CloudArrowUpIcon,
  ArrowRightIcon,
  XMarkIcon
} from "@heroicons/vue/24/outline";

// Types
interface UploadConfig {
  hasSavingsAccountColumn: boolean;
  saveOptions: boolean;
  columnSeparator: string;
}

// Reactive data
const router = useRouter();
const fileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const csvPreview = ref<string[][]>([]);
const csvHeaders = ref<string[]>([]);
const dragOver = ref(false);
const maxFileSize = 50; // MB

const uploadConfig = reactive<UploadConfig>({
  hasSavingsAccountColumn: false,
  saveOptions: false,
  columnSeparator: ""
});

// Methods
const goBack = () => {
  router.push("/savings-transactions");
};

const downloadSample = () => {
  const sampleCSV = [
    'Savings Account Number,Type,Date,Time,Amount,Description,Accounting',
    'SAV001234,Deposit,01/03/2024,09:30,1000.00,Initial deposit,Cash',
    'SAV005678,Deposit,01/03/2024,14:15,2500.00,Monthly salary,Bank',
    'SAV001234,Withdrawal,02/03/2024,11:45,500.00,ATM withdrawal,Cash',
    'SAV009876,Interest,02/03/2024,16:20,45.00,Monthly interest,Bank'
  ].join('\n');

  const blob = new Blob([sampleCSV], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sample_savings_transactions.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleFileDrop = (event: DragEvent) => {
  dragOver.value = false;
  const file = event.dataTransfer?.files[0];
  if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
    processFile(file);
  } else {
    alert('Please select a valid CSV file.');
  }
};

const processFile = (file: File) => {
  if (file.size > maxFileSize * 1024 * 1024) {
    alert(`File size exceeds ${maxFileSize}MB limit.`);
    return;
  }

  selectedFile.value = file;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    parseCSV(text);
  };
  reader.readAsText(file);
};

const parseCSV = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) return;
  
  const separator = uploadConfig.columnSeparator || ',';
  const rows = lines.map(line => 
    line.split(separator).map(cell => cell.trim().replace(/^"|"$/g, ''))
  );
  
  if (rows.length > 0) {
    csvHeaders.value = rows[0];
    csvPreview.value = rows.slice(1);
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const resetUpload = () => {
  selectedFile.value = null;
  csvPreview.value = [];
  csvHeaders.value = [];
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const proceedToStep2 = () => {
  if (!selectedFile.value) return;
  
  // Save configuration if requested
  if (uploadConfig.saveOptions) {
    localStorage.setItem('csvUploadConfig', JSON.stringify(uploadConfig));
  }
  
  // In a real application, you would navigate to Step 2 with the parsed data
  // For now, we'll show a success message
  alert(`File processed successfully! 
    
File: ${selectedFile.value.name}
Rows: ${csvPreview.value.length}
Has Account Numbers: ${uploadConfig.hasSavingsAccountColumn ? 'Yes' : 'No'}

Ready to proceed to Step 2 for data mapping and import.`);
};

defineOptions({
  name: "UploadCSVSavingsTransactions",
});
</script>