<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View Loan Details</h1>
        <p class="text-gray-600">Comprehensive loan information and management</p>
      </div>
      <div class="flex space-x-3">
        <button @click="editLoan" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
        <button @click="deleteLoan" class="btn-danger">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Loan not found -->
    <div v-else-if="!loan" class="text-center py-8">
      <p class="text-gray-500">Loan not found</p>
      <router-link to="/loans" class="btn-primary mt-4">Back to Loans</router-link>
    </div>

    <!-- Loan details -->
    <div v-else class="space-y-6">
      <!-- Borrower Information Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-bold text-xl">
                {{ loan.borrower.firstName.charAt(0) }}{{ loan.borrower.lastName.charAt(0) }}
              </span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">
                Mr. {{ loan.borrower.firstName }} {{ loan.borrower.lastName }}
              </h2>
              <p class="text-lg font-mono text-gray-600">{{ loan.loanNumber }}</p>
              <div class="flex items-center space-x-2 mt-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Health Meter
                </span>
              </div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button @click="moveBorrower" class="btn-secondary text-sm">
              Move Borrower to Another Branch
            </button>
          </div>
        </div>

        <!-- Borrower Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-500">Create Date:</label>
              <p class="text-gray-900">{{ formatDate(loan.createdAt) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">ADUINOLA, Employee</label>
              <p class="text-gray-900">Age: {{ calculateAge(loan.borrower.dateOfBirth) }} years</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Loan Officer:</label>
              <p class="text-gray-900">{{ loan.loanOfficer }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-500">Address:</label>
              <p class="text-gray-900">{{ loan.borrower.address }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">City:</label>
              <p class="text-gray-900">{{ loan.borrower.city }}, {{ loan.borrower.country }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Province:</label>
              <p class="text-gray-900">{{ loan.borrower.province }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Zipcode:</label>
              <p class="text-gray-900">{{ loan.borrower.zipcode }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-500">Email:</label>
              <div class="flex items-center space-x-2">
                <p class="text-gray-900">{{ loan.borrower.email }}</p>
                <button @click="sendEmail" class="text-primary-600 hover:text-primary-800 text-sm">
                  Send Email
                </button>
              </div>
              <button @click="sendPDFFiles" class="text-primary-600 hover:text-primary-800 text-sm">
                Send PDF Files for E-Signature
              </button>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Mobile:</label>
              <div class="flex items-center space-x-2">
                <p class="text-gray-900">{{ loan.borrower.mobile }}</p>
                <button @click="sendSMS" class="text-primary-600 hover:text-primary-800 text-sm">
                  Send SMS
                </button>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Landline:</label>
              <p class="text-gray-900">{{ loan.borrower.landline || "N/A" }}</p>
            </div>
            <div>
              <button
                @click="addRestriction"
                class="text-primary-600 hover:text-primary-800 text-sm"
              >
                Add/Edit Restriction on Borrower
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loan Summary Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-primary-600">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Loan#
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Released
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Maturity
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                >
                  Principal
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Interest Rate
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                >
                  Interest
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                >
                  Fees
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                >
                  Penalty
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                >
                  Due
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                >
                  Paid
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                >
                  Balance
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <!-- Loan# -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ loan.loanNumber }}</span>
                    <button class="text-gray-400 hover:text-gray-600">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>

                <!-- Released -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{
                    loan.loanReleaseDate
                      ? formatDate(loan.loanReleaseDate)
                      : formatDate(loan.createdAt)
                  }}
                </td>

                <!-- Maturity -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div>{{ formatDate(loan.maturityDate) }}</div>
                    <button class="text-xs text-gray-500 hover:text-gray-700 mt-1">Override</button>
                  </div>
                </td>

                <!-- Principal -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ formatCurrency(loan.principalAmount) }}
                </td>

                <!-- Interest Rate -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div>{{ loan.interestRate }}%/Loan</div>
                    <button class="text-xs text-gray-500 hover:text-gray-700 mt-1">
                      Adjust in middle
                    </button>
                  </div>
                </td>

                <!-- Interest -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ formatCurrency(loan.totalInterest) }}
                </td>

                <!-- Fees -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ formatCurrency(loan.totalFees) }}
                </td>

                <!-- Penalty -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ formatCurrency(loan.totalPenalties) }}
                </td>

                <!-- Due -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div>
                    <div>{{ formatCurrency(calculateTotalDue(loan)) }}</div>
                    <button class="text-xs text-gray-500 hover:text-gray-700 mt-1">Override</button>
                  </div>
                </td>

                <!-- Paid -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div>
                    <div>{{ formatCurrency(loan.totalPaid || 0) }}</div>
                    <button
                      class="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded mt-1"
                    >
                      Add Repayment
                    </button>
                  </div>
                </td>

                <!-- Balance -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div>
                    <div>
                      {{ formatCurrency(loan.outstandingBalance || calculateTotalDue(loan)) }}
                    </div>
                    <button class="text-xs text-gray-500 hover:text-gray-700 mt-1">
                      Make it zero
                    </button>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                  >
                    {{ formatStatus(loan.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="border-b border-gray-200">
          <!-- Desktop Navigation (hidden on mobile) -->
          <nav class="hidden lg:flex -mb-px px-6 overflow-x-auto" aria-label="Tabs">
            <div class="flex space-x-4 min-w-max">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm flex-shrink-0',
                ]"
              >
                {{ tab.name }}
              </button>
            </div>
          </nav>

          <!-- Tablet Navigation (horizontal scroll) -->
          <nav class="hidden md:flex lg:hidden -mb-px px-6 overflow-x-auto" aria-label="Tabs">
            <div class="flex space-x-6 min-w-max">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-shrink-0',
                ]"
              >
                {{ tab.name }}
              </button>
            </div>
          </nav>

          <!-- Mobile Navigation (dropdown) -->
          <div class="md:hidden px-4 py-3">
            <div class="relative">
              <select
                v-model="activeTab"
                class="form-input w-full appearance-none bg-white pr-10"
                @change="activeTab = $event.target.value"
              >
                <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
                  {{ tab.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Repayments Tab -->
          <div v-if="activeTab === 'repayments'" class="space-y-6">
            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3">
              <button class="btn-primary">Add Repayment</button>
              <button class="btn-secondary">Show/Hide Columns</button>
              <button class="btn-secondary">Bulk Delete</button>
            </div>

            <!-- Search and Filter Controls -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search repayments"
                    class="form-input"
                    v-model="repaymentSearch"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Show</span>
                  <select class="form-input" v-model="repaymentPageSize">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span class="text-sm text-gray-500">entries</span>
                  <button class="btn-secondary ml-4">Export Data</button>
                </div>
              </div>
            </div>

            <!-- Repayments Table -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-blue-600">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Collection Date
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Collected By
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Method
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Amount
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Action
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Receipt
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                      <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                        No repayments found
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-50">
                    <tr>
                      <td colspan="3" class="px-6 py-3 text-sm font-medium text-gray-900">Total</td>
                      <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">0.00</td>
                      <td colspan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Pagination -->
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">Showing 0 to 0 of 0 entries</div>
              <div class="flex gap-2">
                <button class="btn-secondary" disabled>Previous</button>
                <button class="btn-secondary" disabled>Next</button>
              </div>
            </div>
          </div>

          <!-- Loan Terms Tab -->
          <div v-else-if="activeTab === 'loan-terms'" class="space-y-6">
            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3">
              <div class="relative">
                <button class="btn-primary">
                  Loan Statement
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <button class="btn-primary">Loan Applications/Agreements</button>
              <div class="relative">
                <button class="btn-secondary">
                  Restructure Loan on
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <div class="relative">
                <button class="btn-secondary">
                  Edit Loan
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <button class="btn-secondary">Copy Loan</button>
              <button class="btn-danger">Delete Loan</button>
            </div>

            <!-- Loan Overview -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Loan Overview</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Loan Status</label>
                  <p class="text-gray-900 font-medium">{{ formatStatus(loan.status) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Loan Application ID</label>
                  <p class="text-gray-900 font-medium">{{ loan.loanNumber }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Loan Product</label>
                  <p class="text-primary-600 hover:text-primary-800 cursor-pointer">
                    {{ formatLoanType(loan.loanType) }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Loan Reminders</label>
                  <p class="text-gray-900">
                    None
                    <span class="text-primary-600 hover:text-primary-800 cursor-pointer"
                      >Set loan reminders</span
                    >
                  </p>
                </div>
              </div>
            </div>

            <!-- Loan Terms Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="bg-gray-800 text-white px-6 py-3 rounded-t-lg">
                <h3 class="text-lg font-medium">Loan Terms</h3>
              </div>
              <div class="p-6 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="text-sm font-medium text-gray-500">Disbursed By</label>
                      <p class="text-gray-900">{{ loan.disbursedBy || "Cash" }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Principal Amount</label>
                      <p class="text-gray-900 font-medium">
                        {{ formatCurrency(loan.principalAmount) }}
                      </p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Loan Release Date</label>
                      <p class="text-gray-900">
                        {{
                          loan.loanReleaseDate
                            ? formatDate(loan.loanReleaseDate)
                            : formatDate(loan.createdAt)
                        }}
                      </p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Loan Interest Method</label>
                      <p class="text-gray-900">{{ loan.interestMethod || "Interest-Only" }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Loan Interest</label>
                      <p class="text-gray-900">{{ loan.interestRate }}%/Loan (Nominal APR: 0%)</p>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <label class="text-sm font-medium text-gray-500">Loan Duration</label>
                      <p class="text-gray-900">
                        {{ loan.loanTerm }}
                        {{ loan.repaymentFrequency === "monthly" ? "Months" : "Weeks" }}
                      </p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Repayment Cycle</label>
                      <p class="text-gray-900">
                        {{ formatRepaymentFrequency(loan.repaymentFrequency) }}
                      </p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Number of Repayments</label>
                      <p class="text-gray-900">{{ loan.numberOfRepayments || 1 }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Decimal Places</label>
                      <p class="text-gray-900">Round Off to 2 Decimal Places</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Interest Start Date</label>
                      <p class="text-gray-900">
                        {{
                          loan.interestStartDate
                            ? formatDate(loan.interestStartDate)
                            : formatDate(loan.createdAt)
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="bg-gray-800 text-white px-6 py-3 rounded-t-lg">
                <h3 class="text-lg font-medium">Description</h3>
              </div>
              <div class="p-6">
                <div>
                  <label class="text-sm font-medium text-gray-500">Description</label>
                  <p class="text-gray-900">{{ loan.description || "None" }}</p>
                </div>
              </div>
            </div>

            <!-- Accounting Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="bg-gray-800 text-white px-6 py-3 rounded-t-lg">
                <h3 class="text-lg font-medium">Accounting</h3>
              </div>
              <div class="p-6">
                <div>
                  <label class="text-sm font-medium text-gray-500"
                    >Source of Principal Amount</label
                  >
                  <p class="text-gray-900">{{ loan.disbursedBy || "Cash" }}</p>
                </div>
              </div>
            </div>

            <!-- Loan Status History Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="bg-gray-800 text-white px-6 py-3 rounded-t-lg">
                <h3 class="text-lg font-medium">Loan Status History</h3>
              </div>
              <div class="p-6">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                      >
                        {{ formatStatus(loan.status) }}
                      </span>
                      <span class="ml-3 text-gray-900"
                        >{{
                          loan.loanReleaseDate
                            ? formatDate(loan.loanReleaseDate)
                            : formatDate(loan.createdAt)
                        }}
                        {{ formatTime(loan.createdAt) }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="mt-4">
                  <button class="btn-secondary text-sm">Update Loan Status Dates and Times</button>
                </div>
              </div>
            </div>

            <!-- Audit Trail -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600 space-y-1">
                <p>
                  Loan added on {{ formatDate(loan.createdAt) }} {{ formatTime(loan.createdAt) }}
                </p>
                <p>
                  Loan last edited on {{ formatDate(loan.updatedAt) }}
                  {{ formatTime(loan.updatedAt) }} by {{ loan.loanOfficer }}
                </p>
              </div>
            </div>
          </div>

          <!-- Loan Schedule Tab -->
          <div v-else-if="activeTab === 'loan-schedule'" class="space-y-6">
            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3">
              <div class="relative">
                <button class="btn-primary">
                  Original Loan Schedule
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <div class="relative">
                <button class="btn-primary">
                  Adjusted Loan Schedule
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <div class="relative">
                <button class="btn-secondary">
                  Edit Schedule
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <button class="btn-secondary">Early Settlement</button>
              <button class="btn-secondary">Add Disbursement</button>
            </div>

            <!-- Principal Balance Header -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div class="text-right">
                <span class="text-sm font-medium text-gray-500">Principal Balance: </span>
                <span class="text-lg font-bold text-gray-900">{{
                  formatCurrency(loan.principalAmount)
                }}</span>
              </div>
            </div>

            <!-- Loan Schedule Table -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-green-600">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        #
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Principal
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Interest
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Fees
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Penalty
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Due
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Paid
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Pending Due
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Total Due
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Principal Due
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Principal Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <!-- Today Row -->
                    <tr class="bg-blue-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatDate(new Date().toISOString()) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Today</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>

                    <!-- Maturity Row -->
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatDate(loan.maturityDate) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Maturity</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {{ formatCurrency(loan.principalAmount) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {{ formatCurrency(loan.totalInterest) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {{ formatCurrency(loan.totalFees) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {{ formatCurrency(loan.totalPenalties) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {{ formatCurrency(calculateTotalDue(loan)) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {{ formatCurrency(calculateTotalDue(loan)) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {{ formatCurrency(calculateTotalDue(loan)) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {{ formatCurrency(loan.principalAmount) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        0
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Summary Rows -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Total Due -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-red-600 px-4 py-2">
                  <h3 class="text-sm font-medium text-white">Total Due</h3>
                </div>
                <div class="p-4 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Principal:</span>
                    <span class="text-gray-900">{{ formatCurrency(loan.principalAmount) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Interest:</span>
                    <span class="text-gray-900">{{ formatCurrency(loan.totalInterest) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Fees:</span>
                    <span class="text-gray-900">{{ formatCurrency(loan.totalFees) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Penalty:</span>
                    <span class="text-gray-900">{{ formatCurrency(loan.totalPenalties) }}</span>
                  </div>
                  <div class="flex justify-between text-sm font-medium border-t pt-2">
                    <span class="text-gray-500">Total:</span>
                    <span class="text-gray-900">{{ formatCurrency(calculateTotalDue(loan)) }}</span>
                  </div>
                </div>
              </div>

              <!-- Total Paid -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-green-600 px-4 py-2">
                  <h3 class="text-sm font-medium text-white">Total Paid</h3>
                </div>
                <div class="p-4 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Principal:</span>
                    <span class="text-gray-900">0</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Interest:</span>
                    <span class="text-gray-900">0</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Fees:</span>
                    <span class="text-gray-900">0</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Penalty:</span>
                    <span class="text-gray-900">0</span>
                  </div>
                  <div class="flex justify-between text-sm font-medium border-t pt-2">
                    <span class="text-gray-500">Total:</span>
                    <span class="text-gray-900">0</span>
                  </div>
                </div>
              </div>

              <!-- Total Pending Due -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gray-600 px-4 py-2">
                  <h3 class="text-sm font-medium text-white">Total Pending Due</h3>
                </div>
                <div class="p-4 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Principal:</span>
                    <span class="text-gray-900">{{ formatCurrency(loan.principalAmount) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Interest:</span>
                    <span class="text-gray-900">{{ formatCurrency(loan.totalInterest) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Fees:</span>
                    <span class="text-gray-900">{{ formatCurrency(loan.totalFees) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Penalty:</span>
                    <span class="text-gray-900">{{ formatCurrency(loan.totalPenalties) }}</span>
                  </div>
                  <div class="flex justify-between text-sm font-medium border-t pt-2">
                    <span class="text-gray-500">Total:</span>
                    <span class="text-gray-900">{{ formatCurrency(calculateTotalDue(loan)) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Explanations -->
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div class="text-sm text-gray-600">
                <p>
                  <strong>Principal Balance:</strong> The above Principal Balance column is
                  calculated as follows: Any collection date that is less than or equal to today's
                  date, total principal is reduced by the principal payments only. Any collection
                  date after today's date, the total principal is reduced by the total principal due
                  until the collection date.
                </p>
              </div>
              <div class="text-sm text-gray-600">
                <p>
                  <strong>Branch Holidays:</strong> If you don't want schedule to be generated on
                  holidays or Fridays/Saturdays/Sundays, visit
                  <span class="text-primary-600 hover:text-primary-800 cursor-pointer"
                    >Branch Holidays</span
                  >.
                </p>
              </div>
            </div>
          </div>

          <!-- Pending Dues Tab -->
          <div v-else-if="activeTab === 'pending-dues'" class="space-y-6">
            <!-- Introduction -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p class="text-gray-600">
                Here you can see the pending due amounts for all-time, until today, and pro-rata
                basis.
              </p>
            </div>

            <!-- Based on Loan Terms -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-gray-800 text-white px-6 py-3">
                <h3 class="text-lg font-medium">Based on Loan Terms:</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Principal
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Interest
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fees
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Penalty
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr class="bg-red-100">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-800">
                        Total Due
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                        {{ formatCurrency(loan.principalAmount) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                        {{ formatCurrency(loan.totalInterest) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                        {{ formatCurrency(loan.totalFees) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                        {{ formatCurrency(loan.totalPenalties) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                        {{ formatCurrency(calculateTotalDue(loan)) }}
                      </td>
                    </tr>
                    <tr class="bg-green-100">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-800">
                        Total Paid
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                        0
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                        0
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                        0
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                        0
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                        0
                      </td>
                    </tr>
                    <tr class="bg-gray-100">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        Balance
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        {{ formatCurrency(loan.principalAmount) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        {{ formatCurrency(loan.totalInterest) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        {{ formatCurrency(loan.totalFees) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        {{ formatCurrency(loan.totalPenalties) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        {{ formatCurrency(calculateTotalDue(loan)) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Based on Loan Schedule -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-gray-800 text-white px-6 py-3">
                <h3 class="text-lg font-medium">Based on Loan Schedule:</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Principal
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Interest
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fees
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Penalty
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr class="bg-red-100">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-800">
                        Due till {{ formatDate(loan.maturityDate) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                        {{ formatCurrency(loan.principalAmount) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                        {{ formatCurrency(loan.totalInterest) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                        {{ formatCurrency(loan.totalFees) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                        {{ formatCurrency(loan.totalPenalties) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                        {{ formatCurrency(calculateTotalDue(loan)) }}
                      </td>
                    </tr>
                    <tr class="bg-green-100">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-800">
                        Paid till {{ formatDate(loan.maturityDate) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                        0
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                        0
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                        0
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                        0
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                        0
                      </td>
                    </tr>
                    <tr class="bg-gray-100">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        Balance till {{ formatDate(loan.maturityDate) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        {{ formatCurrency(loan.principalAmount) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        {{ formatCurrency(loan.totalInterest) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        {{ formatCurrency(loan.totalFees) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        {{ formatCurrency(loan.totalPenalties) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        {{ formatCurrency(calculateTotalDue(loan)) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pro-Rata Basis -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-gray-800 text-white px-6 py-3">
                <h3 class="text-lg font-medium">Pro-Rata Basis:</h3>
              </div>
              <div class="p-6">
                <div class="flex items-center gap-3 mb-4">
                  <input type="date" v-model="proRataDate" class="form-input" />
                  <button class="btn-primary">Go</button>
                </div>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Principal
                        </th>
                        <th
                          class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Interest
                        </th>
                        <th
                          class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Fees
                        </th>
                        <th
                          class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Penalty
                        </th>
                        <th
                          class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr class="bg-red-100">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-800">
                          Due till {{ formatDate(proRataDate) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                          {{
                            formatCurrency(
                              calculateProRataAmount(loan.principalAmount, proRataDate),
                            )
                          }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                          {{
                            formatCurrency(calculateProRataAmount(loan.totalInterest, proRataDate))
                          }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                          {{ formatCurrency(loan.totalFees) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                          {{ formatCurrency(loan.totalPenalties) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800 text-right">
                          {{ formatCurrency(calculateProRataTotal(loan, proRataDate)) }}
                        </td>
                      </tr>
                      <tr class="bg-green-100">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-800">
                          Paid till {{ formatDate(proRataDate) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                          0
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                          0
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                          0
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                          0
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800 text-right">
                          0
                        </td>
                      </tr>
                      <tr class="bg-gray-100">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          Balance till {{ formatDate(proRataDate) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                          {{
                            formatCurrency(
                              calculateProRataAmount(loan.principalAmount, proRataDate),
                            )
                          }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                          {{
                            formatCurrency(calculateProRataAmount(loan.totalInterest, proRataDate))
                          }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                          {{ formatCurrency(loan.totalFees) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                          {{ formatCurrency(loan.totalPenalties) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                          {{ formatCurrency(calculateProRataTotal(loan, proRataDate)) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Early Settlement Button -->
            <div class="text-center">
              <button class="btn-secondary">Early Settlement</button>
            </div>
          </div>

          <!-- Penalty Settings Tab -->
          <div v-else-if="activeTab === 'penalty-settings'" class="space-y-6">
            <!-- Introduction -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p class="text-gray-600 mb-4">
                This loan is currently using the {{ formatLoanType(loan.loanType) }} penalty
                settings. To add/edit penalty settings, you can do one of the following:
              </p>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <span class="text-gray-700"
                    >1. <strong>{{ formatLoanType(loan.loanType) }} Penalty:</strong></span
                  >
                  <span class="text-gray-600"
                    >Click here if you would like to edit the
                    {{ formatLoanType(loan.loanType) }} penalty settings. In this case all loans in
                    this loan product will be affected.</span
                  >
                  <span class="text-primary-600 hover:text-primary-800 cursor-pointer font-medium"
                    >Click here</span
                  >
                </div>
                <div class="text-center text-gray-500 font-medium">OR</div>
                <div class="flex items-center gap-3">
                  <span class="text-gray-700">2. <strong>Individual Penalty:</strong></span>
                  <span class="text-gray-600"
                    >Click here if you would like to add penalty settings just for this loan. Only
                    this loan will be affected.</span
                  >
                  <span class="text-primary-600 hover:text-primary-800 cursor-pointer font-medium"
                    >Click here</span
                  >
                </div>
              </div>
            </div>

            <!-- Current Penalty Settings -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-primary-600 text-white px-6 py-3">
                <h3 class="text-lg font-medium text-center">
                  {{ formatLoanType(loan.loanType) }} Penalty - System Generated
                </h3>
              </div>
              <div class="p-6 space-y-6">
                <!-- Late Repayment Penalty -->
                <div>
                  <h4 class="text-lg font-medium text-gray-900 mb-2">Late Repayment Penalty</h4>
                  <p class="text-red-600 font-medium">Late Repayment Penalty is Disabled</p>
                </div>

                <!-- After Maturity Date Penalty -->
                <div>
                  <h4 class="text-lg font-medium text-gray-900 mb-2">
                    After Maturity Date Penalty
                  </h4>
                  <p class="text-red-600 font-medium">After Maturity Date Penalty is Disabled</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Loan Collateral Tab -->
          <div v-else-if="activeTab === 'loan-collateral'" class="space-y-6">
            <!-- Add Collateral Button -->
            <div class="flex justify-start">
              <button class="btn-secondary">Add Collateral</button>
            </div>

            <!-- Collateral Summary -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Collateral Summary</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="text-sm font-medium text-gray-500">Total Collateral Value</label>
                  <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(2000000) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500"
                    >Total Loan Principal to Value (LTV) Ratio</label
                  >
                  <p class="text-2xl font-bold text-gray-900">50%</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500"
                    >Total Loan Outstanding to Value (LTV) Ratio</label
                  >
                  <p class="text-2xl font-bold text-gray-900">52.50%</p>
                </div>
              </div>
            </div>

            <!-- Collateral Items -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="p-6">
                <h3 class="text-xl font-bold text-green-600 mb-4">Land</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="text-sm font-medium text-gray-500">Current Status</label>
                    <p class="text-gray-900">Collateral with Borrower</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Value</label>
                    <p class="text-gray-900 font-medium">{{ formatCurrency(2000000) }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Type</label>
                    <p class="text-gray-900">Real estate</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Register Date</label>
                    <p class="text-gray-900">{{ formatDate(new Date().toISOString()) }}</p>
                  </div>
                </div>

                <!-- History Section -->
                <div class="border-t pt-6">
                  <h4 class="text-lg font-medium text-red-600 mb-4">History:</h4>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Collateral with Borrower
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ formatDate(new Date().toISOString()) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3">
              <button class="btn-secondary">Edit</button>
              <button class="btn-secondary">Transfer to another loan</button>
              <button class="btn-danger">Delete</button>
            </div>
          </div>

          <!-- Expenses Tab -->
          <div v-else-if="activeTab === 'expenses'" class="space-y-6">
            <!-- Introduction -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p class="text-gray-600">
                You can add expenses here related to this loan that is not included in the loan
                schedule.
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center">
              <div class="flex gap-3">
                <button class="btn-secondary">Add Expense</button>
                <button class="btn-secondary">Show/Hide Columns</button>
              </div>
              <button class="btn-secondary">Export Data</button>
            </div>

            <!-- Search and Controls -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search expenses"
                    class="form-input"
                    v-model="expenseSearch"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Show</span>
                  <select class="form-input" v-model="expensePageSize">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span class="text-sm text-gray-500">entries</span>
                </div>
              </div>
            </div>

            <!-- Expenses Table -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-blue-600">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Action
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Date
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Type
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Amount
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Description
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Files
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                      <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                        No expenses found
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-50">
                    <tr>
                      <td colspan="3" class="px-6 py-3 text-sm font-medium text-gray-900">Total</td>
                      <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">0.00</td>
                      <td colspan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Pagination -->
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">Showing 0 to 0 of 0 entries</div>
              <div class="flex gap-2">
                <button class="btn-secondary" disabled>Previous</button>
                <button class="btn-secondary" disabled>Next</button>
              </div>
            </div>
          </div>

          <!-- Other Income Tab -->
          <div v-else-if="activeTab === 'other-income'" class="space-y-6">
            <!-- Introduction -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p class="text-gray-600">
                You can add other income here related to this loan that is not included in the loan
                schedule such as down payment, and membership fees.
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center">
              <div class="flex gap-3">
                <button class="btn-secondary">Add Other Income</button>
                <button class="btn-secondary">Show/Hide Columns</button>
              </div>
              <button class="btn-secondary">Export Data</button>
            </div>

            <!-- Search and Controls -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search other income"
                    class="form-input"
                    v-model="incomeSearch"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Show</span>
                  <select class="form-input" v-model="incomePageSize">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span class="text-sm text-gray-500">entries</span>
                </div>
              </div>
            </div>

            <!-- Other Income Table -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-blue-600">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Date
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Type
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Amount
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Description
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Files
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Recurring
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Action
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Receipt
                        <svg
                          class="w-4 h-4 inline ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                      <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                        No other income found
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-50">
                    <tr>
                      <td colspan="2" class="px-6 py-3 text-sm font-medium text-gray-900">Total</td>
                      <td class="px-6 py-3 text-sm font-medium text-gray-900 text-right">0.00</td>
                      <td colspan="5"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Pagination -->
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">Showing 0 to 0 of 0 entries</div>
              <div class="flex gap-2">
                <button class="btn-secondary" disabled>Previous</button>
                <button class="btn-secondary" disabled>Next</button>
              </div>
            </div>
          </div>

          <!-- Loan Comments Tab -->
          <div v-else-if="activeTab === 'loan-comments'" class="space-y-6">
            <!-- Action Buttons -->
            <div class="flex justify-between items-center">
              <button class="btn-secondary">Add Comments</button>
              <div class="relative">
                <button class="btn-primary">
                  Print Comments
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Comments Content -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p class="text-gray-500 text-lg">No Comments found.</p>
            </div>
          </div>

          <!-- Audit Logs Tab -->
          <div v-else-if="activeTab === 'audit-logs'" class="space-y-6">
            <!-- Information Box -->
            <div class="bg-gray-100 rounded-lg p-4 flex items-start gap-3">
              <svg
                class="w-6 h-6 text-gray-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
              <div class="text-sm text-gray-600">
                <p>
                  <strong>Please note</strong> that you can view the audit logs for the last 12
                  months only. To view logs for other loans, please visit
                  <span class="text-primary-600 hover:text-primary-800 cursor-pointer"
                    >Admin (top menu)</span
                  >
                  →
                  <span class="text-primary-600 hover:text-primary-800 cursor-pointer"
                    >Manage Staff</span
                  >
                  →
                  <span class="text-primary-600 hover:text-primary-800 cursor-pointer"
                    >Audit Management</span
                  >.
                </p>
              </div>
            </div>

            <!-- Controls -->
            <div class="flex justify-between items-center">
              <button class="btn-secondary">Export Data for this page</button>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">Show</span>
                <select class="form-input" v-model="auditPageSize">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span class="text-sm text-gray-500">entries</span>
              </div>
            </div>

            <!-- Audit Logs Table -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-blue-600">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Time
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Logged in Branch
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Staff
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Message
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Action
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        IP
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatDate(new Date().toISOString()) }}
                        {{ formatTime(new Date().toISOString()) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Branch #1</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Joseph Ulomi
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Collateral</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Added Collateral (Land) to Loan# {{ loan.loanNumber }} for Mr.
                        {{ loan.borrower.firstName }} {{ loan.borrower.lastName }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Add</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        102.218.31.111
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button class="text-primary-600 hover:text-primary-800">
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatDate(loan.createdAt) }} {{ formatTime(loan.createdAt) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Branch #1</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Joseph Ulomi
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Loans</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Added Loan# {{ loan.loanNumber }} for Mr. {{ loan.borrower.firstName }}
                        {{ loan.borrower.lastName }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Add</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        197.250.51.138
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button class="text-primary-600 hover:text-primary-800">
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pagination -->
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">Showing 1 to 2 of 2 entries</div>
              <div class="flex gap-2">
                <button class="btn-secondary" disabled>Previous</button>
                <button class="btn-primary">1</button>
                <button class="btn-secondary" disabled>Next</button>
              </div>
            </div>
          </div>

          <!-- Other Tabs Content -->
          <div v-else class="text-center py-8 text-gray-500">
            <p>{{ tabs.find((t) => t.id === activeTab)?.name }} content will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { service, type Loan } from "@/services";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";

const route = useRoute();
const router = useRouter();

// Reactive data
const loan = ref<Loan | null>(null);
const isLoading = ref(false);
const activeTab = ref("repayments");
const repaymentSearch = ref("");
const repaymentPageSize = ref(20);
const repaymentCurrentPage = ref(1);
const proRataDate = ref(new Date().toISOString().split("T")[0]);
const expenseSearch = ref("");
const expensePageSize = ref(20);
const incomeSearch = ref("");
const incomePageSize = ref(20);
const auditPageSize = ref(20);

// Tabs configuration
const tabs = [
  { id: "repayments", name: "Repayments" },
  { id: "loan-terms", name: "Loan Terms" },
  { id: "loan-schedule", name: "Loan Schedule" },
  { id: "pending-dues", name: "Pending Dues" },
  { id: "penalty-settings", name: "Penalty Settings" },
  { id: "loan-collateral", name: "Loan Collateral" },
  { id: "expenses", name: "Expenses" },
  { id: "other-income", name: "Other Income" },
  { id: "loan-files", name: "Loan Files" },
  { id: "loan-comments", name: "Loan Comments" },
  { id: "audit-logs", name: "Audit Logs" },
];

// Mock repayments data
const repayments = ref([
  // Empty for now - will be populated from service
]);

// Computed properties
const filteredRepayments = computed(() => {
  let filtered = repayments.value;

  if (repaymentSearch.value) {
    const query = repaymentSearch.value.toLowerCase();
    filtered = filtered.filter(
      (repayment) =>
        repayment.reference?.toLowerCase().includes(query) ||
        repayment.paymentMethod?.toLowerCase().includes(query),
    );
  }

  const start = (repaymentCurrentPage.value - 1) * repaymentPageSize.value;
  const end = start + repaymentPageSize.value;
  return filtered.slice(start, end);
});

const totalRepaymentPages = computed(() => {
  return Math.ceil(repayments.value.length / repaymentPageSize.value);
});

// Methods
const loadLoan = async () => {
  try {
    isLoading.value = true;
    const loanId = route.params.id as string;
    const response = await service.getLoanAsync(loanId);
    loan.value = response;
  } catch (error) {
    console.error("Error loading loan:", error);
  } finally {
    isLoading.value = false;
  }
};

const calculateAge = (dateOfBirth: string) => {
  if (!dateOfBirth) return "N/A";
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateTotalDue = (loan: Loan) => {
  return (loan.principalAmount || 0) + (loan.totalInterest || 0) + (loan.totalFees || 0);
};

const formatStatus = (status: string) => {
  return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatLoanType = (loanType: string) => {
  const types: { [key: string]: string } = {
    business: "Business Loan",
    personal: "Personal Loan",
    agricultural: "Agricultural Loan",
    microfinance: "Micro Loan",
    emergency: "Emergency Loan",
  };
  return types[loanType] || loanType;
};

const formatRepaymentFrequency = (frequency: string) => {
  const frequencies: { [key: string]: string } = {
    weekly: "Weekly",
    "bi-weekly": "Bi-weekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
  };
  return frequencies[frequency] || frequency;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const calculateProRataAmount = (amount: number, targetDate: string) => {
  if (!loan.value || !targetDate) return 0;

  const startDate = new Date(loan.value.createdAt);
  const endDate = new Date(loan.value.maturityDate);
  const currentDate = new Date(targetDate);

  // Calculate total days in loan term
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate days from start to target date
  const daysElapsed = Math.ceil(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Calculate pro-rata amount
  const proRataRatio = Math.min(Math.max(daysElapsed / totalDays, 0), 1);
  return Math.round(amount * proRataRatio * 100) / 100;
};

const calculateProRataTotal = (loan: Loan, targetDate: string) => {
  const principal = calculateProRataAmount(loan.principalAmount, targetDate);
  const interest = calculateProRataAmount(loan.totalInterest, targetDate);
  const fees = loan.totalFees || 0;
  const penalties = loan.totalPenalties || 0;

  return principal + interest + fees + penalties;
};

const getStatusClass = (status: string) => {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    active: "bg-blue-100 text-blue-800",
    overdue: "bg-red-100 text-red-800",
    closed: "bg-gray-100 text-gray-800",
    current: "bg-green-100 text-green-800",
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

const getRepaymentStatusClass = (status: string) => {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    partial: "bg-orange-100 text-orange-800",
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

// Action methods
const editLoan = () => {
  router.push(`/loans/${route.params.id}/edit`);
};

const deleteLoan = () => {
  if (confirm("Are you sure you want to delete this loan?")) {
    // Implement delete logic
    console.log("Delete loan");
  }
};

const moveBorrower = () => {
  console.log("Move borrower to another branch");
};

const sendEmail = () => {
  console.log("Send email");
};

const sendPDFFiles = () => {
  console.log("Send PDF files for e-signature");
};

const sendSMS = () => {
  console.log("Send SMS");
};

const addRestriction = () => {
  console.log("Add/Edit restriction on borrower");
};

const overridePrincipal = () => {
  console.log("Override principal");
};

const adjustInterest = () => {
  console.log("Adjust interest in middle");
};

const overrideDue = () => {
  console.log("Override due amount");
};

const makeZero = () => {
  console.log("Make paid amount zero");
};

const viewReceipt = (repaymentId: string) => {
  console.log("View receipt for repayment:", repaymentId);
};

// Lifecycle
onMounted(async () => {
  await loadLoan();
});
</script>
