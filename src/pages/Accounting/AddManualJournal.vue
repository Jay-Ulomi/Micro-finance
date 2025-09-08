<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Manual Journal</h1>
        <p class="text-sm text-gray-600 mt-1">Create a new manual journal entry</p>
      </div>
      <div class="flex space-x-3">
        <button @click="goBack" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Back
        </button>
        <button @click="saveTemplate" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <BookmarkIcon class="w-4 h-4 mr-2" />
          Save Template
        </button>
      </div>
    </div>

    <!-- Journal Form -->
    <form @submit.prevent="submitJournal" class="space-y-8">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Journal Information</h2>
          <p class="text-sm text-gray-600">
            Enter the journal details and accounting basis for this manual entry.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Narration -->
          <div class="md:col-span-2">
            <label for="narration" class="form-label">
              Narration <span class="text-red-500">*</span>
            </label>
            <textarea
              id="narration"
              v-model="journal.narration"
              rows="3"
              placeholder="Enter journal narration..."
              class="form-input"
              :class="{ 'border-red-300': errors.narration }"
              required
            ></textarea>
            <div class="flex items-center mt-2">
              <input
                v-model="journal.defaultNarrationToLines"
                type="checkbox"
                id="defaultNarration"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="defaultNarration" class="ml-2 text-sm text-gray-600">
                Default narration to journal line description?
              </label>
            </div>
            <p v-if="errors.narration" class="form-error">{{ errors.narration }}</p>
          </div>
          
          <!-- Journal Date -->
          <div>
            <label for="journalDate" class="form-label">
              Journal Date <span class="text-red-500">*</span>
            </label>
            <input
              id="journalDate"
              v-model="journal.date"
              type="date"
              class="form-input"
              :class="{ 'border-red-300': errors.date }"
              required
            />
            <p v-if="errors.date" class="form-error">{{ errors.date }}</p>
          </div>

          <!-- Accounting Basis -->
          <div>
            <label class="form-label">
              Accounting Basis
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="journal.accountingBasis"
                  type="radio"
                  value="accrual"
                  class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Accrual Basis Only</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="journal.accountingBasis"
                  type="radio"
                  value="cash_and_accrual"
                  class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Cash and Accrual Basis</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Journal Lines -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-lg font-semibold text-gray-900">Journal Lines</h2>
            <button
              type="button"
              @click="addJournalLine"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <PlusIcon class="w-4 h-4 mr-1" />
              Add Line
            </button>
          </div>
          <p class="text-sm text-gray-600">
            Add journal lines with debits and credits. Total debits must equal total credits.
          </p>
        </div>

        <!-- Journal Lines Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account <span class="text-red-500">*</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Rate
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit Amount
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Amount
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="journal.lines.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <DocumentTextIcon class="w-12 h-12 text-gray-300 mb-2" />
                    <p>No journal lines added yet</p>
                    <p class="text-xs">Click "Add Line" to create your first journal entry</p>
                  </div>
                </td>
              </tr>
              
              <tr v-for="(line, index) in journal.lines" :key="index" class="hover:bg-gray-50">
                <!-- Description -->
                <td class="px-4 py-3">
                  <input
                    v-model="line.description"
                    type="text"
                    :placeholder="journal.defaultNarrationToLines ? journal.narration : 'Line description...'"
                    class="form-input text-sm"
                    :class="{ 'border-red-300': errors[`lines.${index}.description`] }"
                  />
                </td>
                
                <!-- Account -->
                <td class="px-4 py-3">
                  <select
                    v-model="line.account"
                    class="form-input text-sm"
                    :class="{ 'border-red-300': errors[`lines.${index}.account`] }"
                    required
                  >
                    <option value="">Select Account</option>
                    <optgroup v-for="group in groupedAccounts" :key="group.name" :label="group.name">
                      <option v-for="account in group.accounts" :key="account.code" :value="account.code">
                        {{ account.code }} - {{ account.name }}
                      </option>
                    </optgroup>
                  </select>
                </td>
                
                <!-- Tax Rate -->
                <td class="px-4 py-3">
                  <select
                    v-model="line.taxRate"
                    class="form-input text-sm"
                    @change="calculateTax(index)"
                  >
                    <option value="">No Tax</option>
                    <option v-for="tax in taxRates" :key="tax.id" :value="tax.id">
                      {{ tax.name }} ({{ tax.rate }}%)
                    </option>
                  </select>
                </td>
                
                <!-- Debit Amount -->
                <td class="px-4 py-3">
                  <input
                    v-model="line.debitAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="form-input text-sm text-right"
                    :class="{ 'border-red-300': errors[`lines.${index}.amount`] }"
                    @input="onDebitChange(index)"
                  />
                </td>
                
                <!-- Credit Amount -->
                <td class="px-4 py-3">
                  <input
                    v-model="line.creditAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="form-input text-sm text-right"
                    :class="{ 'border-red-300': errors[`lines.${index}.amount`] }"
                    @input="onCreditChange(index)"
                  />
                </td>
                
                <!-- Actions -->
                <td class="px-4 py-3 text-center">
                  <button
                    type="button"
                    @click="removeJournalLine(index)"
                    class="text-red-600 hover:text-red-900"
                    title="Remove Line"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="mt-4 border-t border-gray-200 pt-4">
          <div class="flex justify-end space-x-8">
            <div class="text-sm">
              <span class="font-medium text-gray-700">Subtotal:</span>
              <span class="ml-2 text-gray-900">{{ formatCurrency(subtotalDebit) }}</span>
              <span class="ml-4 text-gray-900">{{ formatCurrency(subtotalCredit) }}</span>
            </div>
            <div class="text-sm font-medium">
              <span class="text-gray-700">TOTAL:</span>
              <span class="ml-2 text-gray-900">{{ formatCurrency(totalDebit) }}</span>
              <span class="ml-4 text-gray-900">{{ formatCurrency(totalCredit) }}</span>
            </div>
          </div>
          
          <!-- Balance Check -->
          <div class="flex justify-end mt-2">
            <div class="text-sm" :class="isBalanced ? 'text-green-600' : 'text-red-600'">
              <span class="font-medium">
                {{ isBalanced ? '✓ Balanced' : '⚠ Not Balanced' }}
              </span>
              <span class="ml-2">
                Difference: {{ formatCurrency(Math.abs(totalDebit - totalCredit)) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Optional Fields -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Optional Fields</h2>
          <p class="text-sm text-gray-600">
            Link this journal to borrowers, loans, savings accounts, or investors and attach supporting documents.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Upload Files -->
          <div class="md:col-span-2">
            <label class="form-label">
              Upload Invoice/Receipt/Files
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div class="space-y-1 text-center">
                <CloudArrowUpIcon class="mx-auto h-12 w-12 text-gray-400" />
                <div class="flex text-sm text-gray-600">
                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.xls"
                      class="sr-only"
                      @change="handleFileUpload"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">
                  PDF, PNG, JPG, DOC, DOCX, XLS, XLSX up to 10MB each
                </p>
              </div>
            </div>
            
            <!-- Uploaded Files List -->
            <div v-if="journal.attachments.length > 0" class="mt-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
              <div class="space-y-2">
                <div
                  v-for="(file, index) in journal.attachments"
                  :key="index"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div class="flex items-center">
                    <DocumentIcon class="w-4 h-4 text-gray-400 mr-2" />
                    <span class="text-sm text-gray-900">{{ file.name }}</span>
                    <span class="text-xs text-gray-500 ml-2">({{ formatFileSize(file.size) }})</span>
                  </div>
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Link to Borrower -->
          <div>
            <label for="linkedBorrower" class="form-label">
              Link to Borrower
            </label>
            <select
              id="linkedBorrower"
              v-model="journal.linkedBorrower"
              class="form-input"
            >
              <option value="">Select Borrower</option>
              <option v-for="borrower in borrowers" :key="borrower.id" :value="borrower.id">
                {{ borrower.name }} ({{ borrower.id }})
              </option>
            </select>
          </div>
          
          <!-- Link to Loan -->
          <div>
            <label for="linkedLoan" class="form-label">
              Link to Loan
            </label>
            <select
              id="linkedLoan"
              v-model="journal.linkedLoan"
              class="form-input"
              :disabled="!journal.linkedBorrower"
            >
              <option value="">Select Loan</option>
              <option v-for="loan in filteredLoans" :key="loan.id" :value="loan.id">
                {{ loan.loanNumber }} - {{ formatCurrency(loan.amount) }}
              </option>
            </select>
          </div>
          
          <!-- Link to Savings Account -->
          <div>
            <label for="linkedSavings" class="form-label">
              Link to Savings Account
            </label>
            <select
              id="linkedSavings"
              v-model="journal.linkedSavings"
              class="form-input"
              :disabled="!journal.linkedBorrower"
            >
              <option value="">Select Savings Account</option>
              <option v-for="savings in filteredSavings" :key="savings.id" :value="savings.id">
                {{ savings.accountNumber }} - {{ formatCurrency(savings.balance) }}
              </option>
            </select>
          </div>
          
          <!-- Link to Investor -->
          <div>
            <label for="linkedInvestor" class="form-label">
              Link to Investor
            </label>
            <select
              id="linkedInvestor"
              v-model="journal.linkedInvestor"
              class="form-input"
            >
              <option value="">Select Investor</option>
              <option v-for="investor in investors" :key="investor.id" :value="investor.id">
                {{ investor.name }} ({{ investor.id }})
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Save Options -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              v-model="journal.saveAsDraft"
              type="checkbox"
              id="saveAsDraft"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="saveAsDraft" class="ml-2 text-sm font-medium text-gray-700">
              Save as draft?
            </label>
          </div>
          
          <div class="flex space-x-3">
            <button
              type="button"
              @click="previewJournal"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <EyeIcon class="w-4 h-4 mr-2" />
              Preview
            </button>
            <button
              type="submit"
              :disabled="!canSubmit || isSubmitting"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isSubmitting">{{ journal.saveAsDraft ? 'Saving...' : 'Posting...' }}</span>
              <span v-else>
                <CheckIcon class="w-4 h-4 mr-2 inline" />
                {{ journal.saveAsDraft ? 'Save Draft' : 'Post Journal' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>

    <!-- Preview Modal -->
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closePreview"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Journal Preview</h3>
          <button @click="closePreview" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-600">Narration:</p>
            <p class="font-medium">{{ journal.narration }}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-600">Date:</p>
            <p class="font-medium">{{ formatDate(journal.date) }}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-600 mb-2">Journal Lines:</p>
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 py-2 text-left">Description</th>
                    <th class="px-3 py-2 text-left">Account</th>
                    <th class="px-3 py-2 text-right">Debit</th>
                    <th class="px-3 py-2 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="line in journal.lines" :key="line.account" class="border-t">
                    <td class="px-3 py-2">{{ line.description || journal.narration }}</td>
                    <td class="px-3 py-2">{{ getAccountName(line.account) }}</td>
                    <td class="px-3 py-2 text-right">{{ line.debitAmount ? formatCurrency(line.debitAmount) : '-' }}</td>
                    <td class="px-3 py-2 text-right">{{ line.creditAmount ? formatCurrency(line.creditAmount) : '-' }}</td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50 font-medium">
                  <tr>
                    <td colspan="2" class="px-3 py-2">Total</td>
                    <td class="px-3 py-2 text-right">{{ formatCurrency(totalDebit) }}</td>
                    <td class="px-3 py-2 text-right">{{ formatCurrency(totalCredit) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="closePreview" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Close</button>
          <button @click="submitFromPreview" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {{ journal.saveAsDraft ? 'Save Draft' : 'Post Journal' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  BookmarkIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  EyeIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive data
const journal = ref({
  narration: '',
  defaultNarrationToLines: false,
  date: new Date().toISOString().split('T')[0],
  accountingBasis: 'accrual',
  lines: [],
  attachments: [],
  linkedBorrower: '',
  linkedLoan: '',
  linkedSavings: '',
  linkedInvestor: '',
  saveAsDraft: false
})

const errors = ref({})
const showPreview = ref(false)
const isSubmitting = ref(false)

// Chart of Accounts data
const chartOfAccounts = ref([
  // Assets
  { code: '1010', name: 'Cash', group: 'Assets' },
  { code: '1110', name: 'Lender Investments', group: 'Assets' },
  { code: '1210', name: 'Gross Loans - Principal', group: 'Assets' },
  { code: '1310', name: 'Receivable - Interest on Loans', group: 'Assets' },
  { code: '1320', name: 'Receivable - Fee and Commission on Loans', group: 'Assets' },
  { code: '1330', name: 'Receivable - Penalty on Loans', group: 'Assets' },
  { code: '1340', name: 'Receivable - Revenue on Borrower Saving Deposits', group: 'Assets' },
  { code: '1350', name: 'Receivable - Revenue on Investor Deposits', group: 'Assets' },
  { code: '1360', name: 'Receivable - Non-operating Revenue', group: 'Assets' },
  { code: '1510', name: 'Current Assets', group: 'Assets' },
  { code: '1610', name: 'Non-current Asset', group: 'Assets' },
  { code: '1611', name: 'Accumulated Depreciation and Amortization', group: 'Assets' },

  // Liabilities
  { code: '2010', name: 'Payable - On Borrower Saving Deposits', group: 'Liabilities' },
  { code: '2020', name: 'Payable - On Investor Deposits', group: 'Liabilities' },
  { code: '2030', name: 'Payable - On Merchant Borrowings', group: 'Liabilities' },
  { code: '2040', name: 'Payable - Payroll Expenses', group: 'Liabilities' },
  { code: '2050', name: 'Payable - Non-operating Expenses', group: 'Liabilities' },
  { code: '2060', name: 'Payable - Miscellaneous Expenses', group: 'Liabilities' },
  { code: '2070', name: 'Payable - Fee and Commission on Loans', group: 'Liabilities' },
  { code: '2110', name: 'Current Liabilities', group: 'Liabilities' },
  { code: '2310', name: 'Borrower Saving Deposits', group: 'Liabilities' },
  { code: '2410', name: 'Investor Deposits', group: 'Liabilities' },
  { code: '2610', name: 'Accumulated Loan Impairment', group: 'Liabilities' },
  { code: '2810', name: 'Income Tax Liability', group: 'Liabilities' },

  // Equity
  { code: '3010', name: 'Branch Equity', group: 'Equity' },
  { code: '3110', name: 'Retained Earnings (previous years)', group: 'Equity' },

  // Revenue
  { code: '4010', name: 'Interest on Loans', group: 'Revenue' },
  { code: '4020', name: 'Fee and Commission on Loans', group: 'Revenue' },
  { code: '4030', name: 'Penalty on Loans', group: 'Revenue' },
  { code: '4050', name: 'Revenue from Defaulted Loans - Principal', group: 'Revenue' },
  { code: '4060', name: 'Revenue from Restructured Loans', group: 'Revenue' },
  { code: '4210', name: 'Revenue from Borrower Saving Deposits', group: 'Revenue' },
  { code: '4310', name: 'Revenue from Investor Deposits', group: 'Revenue' },
  { code: '4510', name: 'Non-operating Revenue', group: 'Revenue' },
  { code: '4610', name: 'Subsidy', group: 'Revenue' },

  // Expenses
  { code: '5110', name: 'Provision for Impairment - Loan Principal', group: 'Expenses' },
  { code: '5111', name: 'Provision for Impairment - Interest on Loans', group: 'Expenses' },
  { code: '5112', name: 'Provision for Impairment - Fees and Commission on Loans', group: 'Expenses' },
  { code: '5113', name: 'Provision for Impairment - Penalty on Loans', group: 'Expenses' },
  { code: '5120', name: 'Default - Loan Principal', group: 'Expenses' },
  { code: '5121', name: 'Default - Interest on Loans', group: 'Expenses' },
  { code: '5122', name: 'Default - Fees and Commission on Loans', group: 'Expenses' },
  { code: '5123', name: 'Default - Penalty on Loans', group: 'Expenses' },
  { code: '5130', name: 'Depreciation and Amortization Expenses', group: 'Expenses' },
  { code: '5140', name: 'Restructured - Loan Principal', group: 'Expenses' },
  { code: '5141', name: 'Restructured - Interest on Loans', group: 'Expenses' },
  { code: '5142', name: 'Restructured - Fees and Commission on Loans', group: 'Expenses' },
  { code: '5143', name: 'Restructured - Penalty on Loans', group: 'Expenses' },
  { code: '5150', name: 'Loss (or Gain) on Asset Disposal', group: 'Expenses' },
  { code: '5210', name: 'Payroll Expenses', group: 'Expenses' },
  { code: '5230', name: 'Exchange Rate Losses (Gains)', group: 'Expenses' },
  { code: '5310', name: 'Expenses on Borrower Saving Deposits', group: 'Expenses' },
  { code: '5410', name: 'Expenses on Investor Deposits', group: 'Expenses' },
  { code: '5510', name: 'Expense on Merchant Borrowings', group: 'Expenses' },
  { code: '5610', name: 'Non-operating Expenses', group: 'Expenses' },
  { code: '5710', name: 'Income Tax Expense', group: 'Expenses' }
])

// Tax rates data
const taxRates = ref([
  { id: 'vat_18', name: 'VAT', rate: 18 },
  { id: 'service_tax_5', name: 'Service Tax', rate: 5 },
  { id: 'withholding_10', name: 'Withholding Tax', rate: 10 }
])

// Sample data for linking
const borrowers = ref([
  { id: 'B001', name: 'John Doe' },
  { id: 'B002', name: 'Jane Smith' },
  { id: 'B003', name: 'Mike Johnson' }
])

const loans = ref([
  { id: 'L001', borrowerId: 'B001', loanNumber: 'LN-2024-001', amount: 500000 },
  { id: 'L002', borrowerId: 'B001', loanNumber: 'LN-2024-002', amount: 250000 },
  { id: 'L003', borrowerId: 'B002', loanNumber: 'LN-2024-003', amount: 1000000 }
])

const savingsAccounts = ref([
  { id: 'S001', borrowerId: 'B001', accountNumber: 'SA-001', balance: 150000 },
  { id: 'S002', borrowerId: 'B002', accountNumber: 'SA-002', balance: 75000 }
])

const investors = ref([
  { id: 'I001', name: 'Investment Group A' },
  { id: 'I002', name: 'Investment Group B' }
])

// Computed properties
const groupedAccounts = computed(() => {
  const groups = ['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses']
  return groups.map(group => ({
    name: group,
    accounts: chartOfAccounts.value.filter(account => account.group === group)
  }))
})

const filteredLoans = computed(() => {
  if (!journal.value.linkedBorrower) return []
  return loans.value.filter(loan => loan.borrowerId === journal.value.linkedBorrower)
})

const filteredSavings = computed(() => {
  if (!journal.value.linkedBorrower) return []
  return savingsAccounts.value.filter(savings => savings.borrowerId === journal.value.linkedBorrower)
})

const subtotalDebit = computed(() => {
  return journal.value.lines.reduce((sum, line) => sum + (parseFloat(line.debitAmount) || 0), 0)
})

const subtotalCredit = computed(() => {
  return journal.value.lines.reduce((sum, line) => sum + (parseFloat(line.creditAmount) || 0), 0)
})

const totalDebit = computed(() => {
  // Add any tax calculations here if needed
  return subtotalDebit.value
})

const totalCredit = computed(() => {
  // Add any tax calculations here if needed
  return subtotalCredit.value
})

const isBalanced = computed(() => {
  return Math.abs(totalDebit.value - totalCredit.value) < 0.01
})

const canSubmit = computed(() => {
  return (
    journal.value.narration.trim() &&
    journal.value.date &&
    journal.value.lines.length > 0 &&
    journal.value.lines.every(line => line.account && (line.debitAmount || line.creditAmount)) &&
    isBalanced.value
  )
})

// Watch for default narration changes
watch(() => journal.value.defaultNarrationToLines, (newValue) => {
  if (newValue && journal.value.narration) {
    journal.value.lines.forEach(line => {
      if (!line.description) {
        line.description = journal.value.narration
      }
    })
  }
})

// Methods
const addJournalLine = () => {
  journal.value.lines.push({
    description: journal.value.defaultNarrationToLines ? journal.value.narration : '',
    account: '',
    taxRate: '',
    debitAmount: null,
    creditAmount: null
  })
}

const removeJournalLine = (index) => {
  journal.value.lines.splice(index, 1)
}

const onDebitChange = (index) => {
  const line = journal.value.lines[index]
  if (line.debitAmount) {
    line.creditAmount = null
  }
}

const onCreditChange = (index) => {
  const line = journal.value.lines[index]
  if (line.creditAmount) {
    line.debitAmount = null
  }
}

const calculateTax = (index) => {
  const line = journal.value.lines[index]
  if (line.taxRate) {
    const tax = taxRates.value.find(t => t.id === line.taxRate)
    if (tax && (line.debitAmount || line.creditAmount)) {
      const amount = line.debitAmount || line.creditAmount
      const taxAmount = amount * (tax.rate / 100)
      // Add tax line logic here if needed
    }
  }
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    if (file.size <= 10 * 1024 * 1024) { // 10MB limit
      journal.value.attachments.push(file)
    } else {
      alert(`File ${file.name} is too large. Maximum size is 10MB.`)
    }
  })
}

const removeFile = (index) => {
  journal.value.attachments.splice(index, 1)
}

const getAccountName = (code) => {
  const account = chartOfAccounts.value.find(acc => acc.code === code)
  return account ? `${account.code} - ${account.name}` : code
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount || 0))
}

const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const validateForm = () => {
  errors.value = {}
  
  if (!journal.value.narration.trim()) {
    errors.value.narration = 'Narration is required'
  }
  
  if (!journal.value.date) {
    errors.value.date = 'Journal date is required'
  }
  
  journal.value.lines.forEach((line, index) => {
    if (!line.account) {
      errors.value[`lines.${index}.account`] = 'Account is required'
    }
    
    if (!line.debitAmount && !line.creditAmount) {
      errors.value[`lines.${index}.amount`] = 'Either debit or credit amount is required'
    }
  })
  
  return Object.keys(errors.value).length === 0
}

const previewJournal = () => {
  if (validateForm()) {
    showPreview.value = true
  }
}

const closePreview = () => {
  showPreview.value = false
}

const submitFromPreview = () => {
  closePreview()
  submitJournal()
}

const submitJournal = async () => {
  if (!validateForm() || !canSubmit.value) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    const formData = {
      ...journal.value,
      totalDebit: totalDebit.value,
      totalCredit: totalCredit.value,
      isBalanced: isBalanced.value,
      status: journal.value.saveAsDraft ? 'Draft' : 'Posted'
    }
    
    console.log('Submitting journal:', formData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Success message and redirect
    alert(`Journal ${journal.value.saveAsDraft ? 'saved as draft' : 'posted'} successfully!`)
    router.push('/accounting/manual-journal')
  } catch (error) {
    console.error('Error submitting journal:', error)
    alert('Error submitting journal. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  if (confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
    router.back()
  }
}

const saveTemplate = () => {
  const template = {
    narration: journal.value.narration,
    accountingBasis: journal.value.accountingBasis,
    lines: journal.value.lines.map(line => ({
      description: line.description,
      account: line.account,
      taxRate: line.taxRate
    }))
  }
  console.log('Saving template:', template)
  alert('Journal template saved successfully!')
}

defineOptions({
  name: "AddManualJournal",
})

// Initialize
onMounted(() => {
  // Add initial journal lines
  addJournalLine()
  addJournalLine()
})
</script>

<style scoped>
@media print {
  .btn,
  button {
    display: none !important;
  }
}

/* File upload hover effects */
.border-dashed:hover {
  border-color: #6b7280;
}

/* Balance indicators */
.text-green-600 {
  color: #059669;
}

.text-red-600 {
  color: #dc2626;
}

/* Custom scrollbar for modals */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>