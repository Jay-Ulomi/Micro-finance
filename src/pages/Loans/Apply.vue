<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Create New Loan</h1>
        <p class="mt-1 text-sm text-gray-500">Apply for a new loan for a borrower</p>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="saveDraft" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Save Draft
        </button>
        <button @click="previewLoan" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Preview
        </button>
      </div>
    </div>

    <form @submit.prevent="submitLoan" class="space-y-8">
      <!-- Loan Product & Borrower Selection -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Loan Product & Borrower</h3>
          <p class="mt-1 text-sm text-gray-500">
            Select the loan product and borrower for this application
          </p>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Loan Product -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Loan Product</label>
              <div class="flex space-x-2">
                <select v-model="loanForm.loanProduct" class="form-input flex-1" required>
                  <option value="">Select Loan Product</option>
                  <option value="business-loan">Business Loan</option>
                  <option value="personal-loan">Personal Loan</option>
                  <option value="agricultural-loan">Agricultural Loan</option>
                  <option value="micro-loan">Micro Loan</option>
                </select>
                <button type="button" @click="addLoanProduct" class="btn-secondary">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Borrower -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Borrower</label>
              <div class="flex space-x-2">
                <select v-model="loanForm.borrowerId" class="form-input flex-1" required>
                  <option value="">Select Borrower</option>
                  <option v-for="borrower in borrowers" :key="borrower.id" :value="borrower.id">
                    {{ borrower.firstName }} {{ borrower.lastName }} - {{ borrower.uniqueNumber }}
                  </option>
                </select>
                <button type="button" @click="addBorrower" class="btn-secondary">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Loan Number -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Loan #</label>
              <div class="flex space-x-2">
                <input
                  v-model="loanForm.loanNumber"
                  type="text"
                  class="form-input flex-1"
                  placeholder="1000002"
                  required
                />
                <button type="button" @click="generateLoanNumber" class="btn-secondary">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Disbursed By</label>
              <div class="flex space-x-2">
                <select v-model="loanForm.disbursedBy" class="form-input flex-1" required>
                  <option value="">Select Method</option>
                  <option value="cash">Cash</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                </select>
                <button type="button" @click="addDisbursementMethod" class="btn-secondary">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loan Terms -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Loan Terms</h3>
          <p class="mt-1 text-sm text-gray-500">Required fields for loan calculation</p>
        </div>
        <div class="space-y-6">
          <!-- Principal Amount -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Principal Amount</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >$</span
                >
                <input
                  v-model.number="loanForm.principalAmount"
                  type="number"
                  step="0.01"
                  class="form-input pl-8"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Loan Release Date</label>
              <input v-model="loanForm.loanReleaseDate" type="date" class="form-input" required />
            </div>
          </div>

          <!-- Interest Settings -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">Interest Settings</h4>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Interest Method</label>
                <select v-model="loanForm.interestMethod" class="form-input" required>
                  <option value="">Select Method</option>
                  <option value="flat-rate">Flat Rate</option>
                  <option value="reducing-balance">Reducing Balance</option>
                  <option value="interest-only">Interest Only</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Interest Type</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="loanForm.interestType"
                      type="radio"
                      value="percentage"
                      class="form-radio"
                    />
                    <span class="ml-2 text-sm">Percentage % based</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="loanForm.interestType"
                      type="radio"
                      value="fixed-amount"
                      class="form-radio"
                    />
                    <span class="ml-2 text-sm">Fixed amount per cycle</span>
                  </label>
                </div>
              </div>

              <div v-if="loanForm.interestType === 'percentage'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Loan Interest %</label>
                <div class="flex space-x-2">
                  <input
                    v-model.number="loanForm.interestRate"
                    type="number"
                    step="0.01"
                    class="form-input flex-1"
                    placeholder="0.00"
                  />
                  <span class="flex items-center text-sm text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div
              v-if="loanForm.interestType === 'percentage'"
              class="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Interest Period</label>
                <select v-model="loanForm.interestPeriod" class="form-input">
                  <option value="daily">Per Day</option>
                  <option value="weekly">Per Week</option>
                  <option value="monthly">Per Month</option>
                  <option value="yearly">Per Year</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Duration -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">Duration</h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Loan Duration</label>
                <div class="flex space-x-2">
                  <input
                    v-model.number="loanForm.loanDuration"
                    type="number"
                    class="form-input flex-1"
                    placeholder="1"
                    required
                  />
                  <select v-model="loanForm.durationUnit" class="form-input w-24">
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Repayments -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Repayments</h3>
          <p class="mt-1 text-sm text-gray-500">Configure repayment schedule and cycles</p>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Repayment Cycle</label>
              <div class="flex space-x-2">
                <select v-model="loanForm.repaymentCycle" class="form-input flex-1" required>
                  <option value="">Select Cycle</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                <button type="button" @click="addRepaymentCycle" class="btn-secondary">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Number of Repayments</label
              >
              <input
                v-model.number="loanForm.numberOfRepayments"
                type="number"
                class="form-input"
                placeholder="1"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Advance Settings -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Advance Settings</h3>
              <p class="mt-1 text-sm text-gray-500">Optional fields for advanced configuration</p>
            </div>
            <button
              type="button"
              @click="showAdvanceSettings = !showAdvanceSettings"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              {{ showAdvanceSettings ? "Hide" : "Show" }}
            </button>
          </div>
        </div>
        <div v-if="showAdvanceSettings" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Decimal Places</label>
              <select v-model="loanForm.decimalPlaces" class="form-input">
                <option value="2">Round Off to 2 Decimal Places</option>
                <option value="0">Round Off to 0 Decimal Places</option>
                <option value="4">Round Off to 4 Decimal Places</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Interest Start Date</label
              >
              <input v-model="loanForm.interestStartDate" type="date" class="form-input" />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >First Repayment Date</label
              >
              <input v-model="loanForm.firstRepaymentDate" type="date" class="form-input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >First Repayment Amount</label
              >
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >$</span
                >
                <input
                  v-model.number="loanForm.firstRepaymentAmount"
                  type="number"
                  step="0.01"
                  class="form-input pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="loanForm.calculateFirstRepaymentProRata"
                  type="checkbox"
                  class="form-checkbox"
                />
                <span class="ml-2 text-sm">Calculate first repayment on pro-rata basis</span>
              </label>
            </div>

            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="loanForm.adjustFeesInFirstRepayment"
                  type="checkbox"
                  class="form-checkbox"
                />
                <span class="ml-2 text-sm">Adjust fees in first repayment on pro-rata basis</span>
              </label>
            </div>

            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="loanForm.doNotAdjustRemainingRepayments"
                  type="checkbox"
                  class="form-checkbox"
                />
                <span class="ml-2 text-sm"
                  >Do not adjust remaining repayments (Flat-Rate and Interest-Only)</span
                >
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Automated Payments -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Automated Payments</h3>
              <p class="mt-1 text-sm text-gray-500">
                Automatically add due payments on schedule dates
              </p>
            </div>
            <button
              type="button"
              @click="showAutomatedPayments = !showAutomatedPayments"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              {{ showAutomatedPayments ? "Hide" : "Show" }}
            </button>
          </div>
        </div>
        <div v-if="showAutomatedPayments" class="space-y-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-800">
              If you select Yes below, the system will automatically add due payments on the
              schedule dates for this loan. This is useful if you expect to receive payments on time
              for this loan.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Add Automatic Payments</label
              >
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="loanForm.addAutomaticPayments"
                    type="radio"
                    value="no"
                    class="form-radio"
                  />
                  <span class="ml-2 text-sm">No</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="loanForm.addAutomaticPayments"
                    type="radio"
                    value="yes"
                    class="form-radio"
                  />
                  <span class="ml-2 text-sm">Yes</span>
                </label>
              </div>
            </div>

            <div v-if="loanForm.addAutomaticPayments === 'yes'">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Time to Post Between</label
              >
              <div class="flex space-x-2">
                <input
                  v-model="loanForm.automatedPaymentStartTime"
                  type="time"
                  class="form-input"
                />
                <span class="flex items-center text-sm text-gray-500">and</span>
                <input v-model="loanForm.automatedPaymentEndTime" type="time" class="form-input" />
              </div>
            </div>
          </div>

          <div
            v-if="loanForm.addAutomaticPayments === 'yes'"
            class="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cash/Bank Account</label>
              <div class="flex space-x-2">
                <select v-model="loanForm.automatedPaymentAccount" class="form-input flex-1">
                  <option value="">Select Account</option>
                  <option value="cash">Cash</option>
                  <option value="bank-account-1">Bank Account 1</option>
                  <option value="bank-account-2">Bank Account 2</option>
                </select>
                <button type="button" @click="addBankAccount" class="btn-secondary">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loan Fees -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Loan Fees</h3>
          <p class="mt-1 text-sm text-gray-500">Add any additional fees for this loan</p>
        </div>
        <div>
          <div v-if="loanFees.length === 0" class="text-center py-8">
            <svg
              class="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <p class="text-gray-600 mb-4">There are no fees in your account</p>
            <button type="button" @click="addLoanFee" class="btn-primary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Loan Fee
            </button>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(fee, index) in loanFees"
              :key="index"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ fee.name }}</p>
                <p class="text-sm text-gray-600">${{ fee.amount }}</p>
              </div>
              <button
                type="button"
                @click="removeLoanFee(index)"
                class="text-red-600 hover:text-red-700"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <button type="button" @click="addLoanFee" class="btn-secondary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Another Fee
            </button>
          </div>
        </div>
      </div>

      <!-- Loan Status & Other Settings -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Loan Status & Other Settings</h3>
          <p class="mt-1 text-sm text-gray-500">Configure loan status and additional settings</p>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Loan Status</label>
              <div class="flex space-x-2">
                <select v-model="loanForm.loanStatus" class="form-input flex-1" required>
                  <option value="">Select Status</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="disbursed">Disbursed</option>
                </select>
                <button type="button" @click="addLoanStatus" class="btn-secondary">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Guarantors</label>
              <div class="flex space-x-2">
                <select v-model="loanForm.guarantorId" class="form-input flex-1">
                  <option value="">Select Guarantor (Optional)</option>
                  <option v-for="borrower in borrowers" :key="borrower.id" :value="borrower.id">
                    {{ borrower.firstName }} {{ borrower.lastName }} - {{ borrower.uniqueNumber }}
                  </option>
                </select>
                <button type="button" @click="addGuarantor" class="btn-secondary">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Loan Title</label>
              <input
                v-model="loanForm.loanTitle"
                type="text"
                class="form-input"
                placeholder="Useful for investors to identify loans"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Accounting: Cash/Bank Account</label
              >
              <div class="flex space-x-2">
                <select v-model="loanForm.accountingAccount" class="form-input flex-1">
                  <option value="">Select Account</option>
                  <option value="cash">Cash</option>
                  <option value="bank-account-1">Bank Account 1</option>
                  <option value="bank-account-2">Bank Account 2</option>
                </select>
                <button type="button" @click="addBankAccount" class="btn-secondary">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="loanForm.description"
              class="form-input"
              rows="3"
              placeholder="Additional loan details..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex items-center justify-end space-x-4">
        <button type="button" @click="cancelLoan" class="btn-secondary">Cancel</button>
        <button type="submit" :disabled="isSubmitting" class="btn-primary">
          <svg
            v-if="isSubmitting"
            class="w-4 h-4 mr-2 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {{ isSubmitting ? "Creating Loan..." : "Create Loan" }}
        </button>
      </div>
    </form>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex">
        <svg
          class="w-5 h-5 text-green-400 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <p class="text-green-800">{{ successMessage }}</p>
      </div>
    </div>

    <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg
          class="w-5 h-5 text-red-400 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <p class="text-red-800">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { service } from "@/services";

// Types
interface LoanForm {
  loanProduct: string;
  borrowerId: string;
  loanNumber: string;
  disbursedBy: string;
  principalAmount: number;
  loanReleaseDate: string;
  interestMethod: string;
  interestType: string;
  interestRate: number;
  interestPeriod: string;
  loanDuration: number;
  durationUnit: string;
  repaymentCycle: string;
  numberOfRepayments: number;
  decimalPlaces: string;
  interestStartDate: string;
  firstRepaymentDate: string;
  firstRepaymentAmount: number;
  calculateFirstRepaymentProRata: boolean;
  adjustFeesInFirstRepayment: boolean;
  doNotAdjustRemainingRepayments: boolean;
  addAutomaticPayments: string;
  automatedPaymentStartTime: string;
  automatedPaymentEndTime: string;
  automatedPaymentAccount: string;
  loanStatus: string;
  guarantorId: string;
  loanTitle: string;
  description: string;
  accountingAccount: string;
}

interface LoanFee {
  name: string;
  amount: number;
}

// Reactive data
const router = useRouter();

// Form data
const loanForm = ref<LoanForm>({
  loanProduct: "",
  borrowerId: "",
  loanNumber: "",
  disbursedBy: "",
  principalAmount: 0,
  loanReleaseDate: "",
  interestMethod: "",
  interestType: "percentage",
  interestRate: 0,
  interestPeriod: "monthly",
  loanDuration: 1,
  durationUnit: "months",
  repaymentCycle: "",
  numberOfRepayments: 1,
  decimalPlaces: "2",
  interestStartDate: "",
  firstRepaymentDate: "",
  firstRepaymentAmount: 0,
  calculateFirstRepaymentProRata: false,
  adjustFeesInFirstRepayment: false,
  doNotAdjustRemainingRepayments: false,
  addAutomaticPayments: "no",
  automatedPaymentStartTime: "",
  automatedPaymentEndTime: "",
  automatedPaymentAccount: "",
  loanStatus: "",
  guarantorId: "",
  loanTitle: "",
  description: "",
  accountingAccount: "",
});

// State
const borrowers = ref<any[]>([]);
const loanFees = ref<LoanFee[]>([]);
const showAdvanceSettings = ref(false);
const showAutomatedPayments = ref(false);
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Methods
const generateLoanNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  loanForm.value.loanNumber = `1000${timestamp}`;
};

const addLoanProduct = () => {
  alert("Add/Edit Loan Products page would open here");
};

const addBorrower = () => {
  router.push("/borrowers/create");
};

const addDisbursementMethod = () => {
  alert("Add/Edit Disbursed By page would open here");
};

const addRepaymentCycle = () => {
  alert("Add Repayment Cycle page would open here");
};

const addLoanFee = () => {
  const name = prompt("Enter fee name:");
  const amount = prompt("Enter fee amount:");
  if (name && amount) {
    loanFees.value.push({
      name,
      amount: parseFloat(amount),
    });
  }
};

const removeLoanFee = (index: number) => {
  loanFees.value.splice(index, 1);
};

const addLoanStatus = () => {
  alert("Add/Edit Loan Status page would open here");
};

const addGuarantor = () => {
  alert("Add/Edit Guarantors page would open here");
};

const addBankAccount = () => {
  alert("Add/Edit Bank Accounts page would open here");
};

const saveDraft = () => {
  // Save draft functionality
  alert("Draft saved successfully!");
};

const previewLoan = () => {
  // Preview loan functionality
  alert("Loan preview would open here");
};

const submitLoan = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Reset form
    loanForm.value = {
      loanProduct: "",
      borrowerId: "",
      loanNumber: "",
      disbursedBy: "",
      principalAmount: 0,
      loanReleaseDate: "",
      interestMethod: "",
      interestType: "percentage",
      interestRate: 0,
      interestPeriod: "monthly",
      loanDuration: 1,
      durationUnit: "months",
      repaymentCycle: "",
      numberOfRepayments: 1,
      decimalPlaces: "2",
      interestStartDate: "",
      firstRepaymentDate: "",
      firstRepaymentAmount: 0,
      calculateFirstRepaymentProRata: false,
      adjustFeesInFirstRepayment: false,
      doNotAdjustRemainingRepayments: false,
      addAutomaticPayments: "no",
      automatedPaymentStartTime: "",
      automatedPaymentEndTime: "",
      automatedPaymentAccount: "",
      loanStatus: "",
      guarantorId: "",
      loanTitle: "",
      description: "",
      accountingAccount: "",
    };

    loanFees.value = [];

    successMessage.value = "Loan created successfully!";

    // Redirect to loan details or list
    setTimeout(() => {
      router.push("/loans");
    }, 2000);
  } catch (error) {
    errorMessage.value = "Failed to create loan. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const cancelLoan = () => {
  if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
    router.push("/loans");
  }
};

// Lifecycle
onMounted(async () => {
  try {
    // Load borrowers data
    const response = await service.getBorrowersAsync({ limit: 100 });
    borrowers.value = response.borrowers;

    // Set default dates
    const today = new Date().toISOString().split("T")[0];
    loanForm.value.loanReleaseDate = today;
    loanForm.value.interestStartDate = today;

    // Generate initial loan number
    generateLoanNumber();
  } catch (error) {
    console.error("Error loading borrowers:", error);
    alert("Failed to load borrowers data");
  }
});
</script>
