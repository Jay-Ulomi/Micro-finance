<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Loan Calculator</h1>
          <p class="text-gray-600 mt-2">
            You can use this page to calculate the loan value in case of customer inquiries. To add
            a loan into the system, visit
            <router-link to="/loans/apply" class="text-primary-600 hover:text-primary-800"
              >Loans (left menu)</router-link
            >
            →
            <router-link to="/loans/apply" class="text-primary-600 hover:text-primary-800"
              >Add Loan</router-link
            >.
          </p>
        </div>
      </div>
    </div>

    <!-- Calculator Form -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <!-- Loan Product Section -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Loan Product</label>
        <div class="relative">
          <input
            v-model="form.loanProduct"
            type="text"
            placeholder="Select loan product"
            class="form-input pr-10"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              class="h-4 w-4 text-gray-400"
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

      <!-- Loan Terms Section -->
      <div class="border-t border-gray-200 pt-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Loan Terms:</h3>

        <!-- Principal Section -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-red-600 mb-3">Principal:</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Principal Amount</label>
              <input
                v-model="form.principalAmount"
                type="number"
                placeholder="Principal Amount"
                class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Loan Release Date</label>
              <DatePicker
                v-model="form.loanReleaseDate"
                placeholder="dd/mm/yyyy"
                @change="handleDateChange"
              />
              <div v-if="!form.loanReleaseDate" class="mt-1 text-xs text-gray-500">
                Please fill in this field.
              </div>
            </div>
          </div>
        </div>

        <!-- Interest Section -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-red-600 mb-3">Interest:</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Interest Method</label>
              <select v-model="form.interestMethod" class="form-input">
                <option value="flat_rate">Flat Rate</option>
                <option value="declining_balance">Declining Balance</option>
                <option value="compound">Compound</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Interest Type</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="form.interestType"
                    type="radio"
                    value="percentage"
                    class="form-radio text-primary-600"
                  />
                  <span class="ml-2 text-sm text-gray-700"
                    >I want Interest to be percentage % based</span
                  >
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.interestType"
                    type="radio"
                    value="fixed_amount"
                    class="form-radio text-primary-600"
                  />
                  <span class="ml-2 text-sm text-gray-700"
                    >I want Interest to be a fixed amount Per Cycle</span
                  >
                </label>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Loan Interest %</label>
              <div class="flex">
                <input
                  v-model="form.interestRate"
                  type="number"
                  step="0.01"
                  placeholder="%"
                  class="form-input rounded-r-none"
                />
                <select v-model="form.interestPeriod" class="form-input rounded-l-none border-l-0">
                  <option value="per_day">Per Day</option>
                  <option value="per_week">Per Week</option>
                  <option value="per_month">Per Month</option>
                  <option value="per_year">Per Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Duration Section -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-red-600 mb-3">Duration:</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Loan Duration</label>
              <div class="flex items-center space-x-2">
                <button @click="decrementDuration" class="btn-secondary px-3 py-2">-</button>
                <input
                  v-model="form.loanDuration"
                  type="number"
                  min="1"
                  class="form-input text-center w-20"
                />
                <button @click="incrementDuration" class="btn-secondary px-3 py-2">+</button>
                <select v-model="form.durationUnit" class="form-input">
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Repayments Section -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-red-600 mb-3">Repayments:</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Repayment Cycle</label>
              <div class="flex">
                <input
                  v-model="form.repaymentCycle"
                  type="number"
                  min="1"
                  class="form-input rounded-r-none"
                />
                <select v-model="form.repaymentUnit" class="form-input rounded-l-none border-l-0">
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Number of Repayments</label
              >
              <div class="flex items-center space-x-2">
                <button @click="decrementRepayments" class="btn-secondary px-3 py-2">-</button>
                <input
                  v-model="form.numberOfRepayments"
                  type="number"
                  min="1"
                  class="form-input text-center w-20"
                />
                <button @click="incrementRepayments" class="btn-secondary px-3 py-2">+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Advance Settings -->
        <div class="mb-6">
          <button
            @click="toggleAdvanceSettings"
            class="text-primary-600 hover:text-primary-800 font-medium text-sm"
          >
            Advance Settings: {{ showAdvanceSettings ? "Hide" : "Show" }}
          </button>

          <div v-if="showAdvanceSettings" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">Advanced settings will be available here.</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center pt-6 border-t border-gray-200">
        <button @click="resetForm" class="btn-secondary">Reset</button>

        <button @click="calculateLoan" class="btn-primary" :disabled="isCalculating">
          <svg
            v-if="isCalculating"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isCalculating ? "Calculating..." : "Calculate" }}
        </button>
      </div>
    </div>

    <!-- Calculation Results -->
    <div v-if="calculationResults" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Calculation Results</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Principal Amount</h4>
          <p class="text-2xl font-bold text-gray-900">
            {{ formatCurrency(calculationResults.principalAmount) }}
          </p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Total Interest</h4>
          <p class="text-2xl font-bold text-gray-900">
            {{ formatCurrency(calculationResults.totalInterest) }}
          </p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Total Amount</h4>
          <p class="text-2xl font-bold text-gray-900">
            {{ formatCurrency(calculationResults.totalAmount) }}
          </p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Monthly Payment</h4>
          <p class="text-2xl font-bold text-gray-900">
            {{ formatCurrency(calculationResults.monthlyPayment) }}
          </p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Interest Rate</h4>
          <p class="text-2xl font-bold text-gray-900">{{ calculationResults.interestRate }}%</p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Loan Term</h4>
          <p class="text-2xl font-bold text-gray-900">{{ calculationResults.loanTerm }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import DatePicker from "@/components/DatePicker.vue";

// Reactive data
const isCalculating = ref(false);
const showAdvanceSettings = ref(false);
const calculationResults = ref(null);

// Form data
const form = ref({
  loanProduct: "",
  principalAmount: "",
  loanReleaseDate: "",
  interestMethod: "flat_rate",
  interestType: "percentage",
  interestRate: "",
  interestPeriod: "per_day",
  loanDuration: 1,
  durationUnit: "months",
  repaymentCycle: 1,
  repaymentUnit: "months",
  numberOfRepayments: 1,
});

// Methods
const toggleAdvanceSettings = () => {
  showAdvanceSettings.value = !showAdvanceSettings.value;
};

const handleDateChange = () => {
  // Handle date change if needed
};

const incrementDuration = () => {
  form.value.loanDuration++;
};

const decrementDuration = () => {
  if (form.value.loanDuration > 1) {
    form.value.loanDuration--;
  }
};

const incrementRepayments = () => {
  form.value.numberOfRepayments++;
};

const decrementRepayments = () => {
  if (form.value.numberOfRepayments > 1) {
    form.value.numberOfRepayments--;
  }
};

const calculateLoan = async () => {
  isCalculating.value = true;

  try {
    // Simulate calculation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock calculation results
    const principal = parseFloat(form.value.principalAmount) || 0;
    const interestRate = parseFloat(form.value.interestRate) || 0;
    const duration = form.value.loanDuration;

    const totalInterest = (principal * interestRate * duration) / 100;
    const totalAmount = principal + totalInterest;
    const monthlyPayment = totalAmount / form.value.numberOfRepayments;

    calculationResults.value = {
      principalAmount: principal,
      totalInterest: totalInterest,
      totalAmount: totalAmount,
      monthlyPayment: monthlyPayment,
      interestRate: interestRate,
      loanTerm: `${duration} ${form.value.durationUnit}`,
    };
  } catch (error) {
    console.error("Error calculating loan:", error);
  } finally {
    isCalculating.value = false;
  }
};

const resetForm = () => {
  form.value = {
    loanProduct: "",
    principalAmount: "",
    loanReleaseDate: "",
    interestMethod: "flat_rate",
    interestType: "percentage",
    interestRate: "",
    interestPeriod: "per_day",
    loanDuration: 1,
    durationUnit: "months",
    repaymentCycle: 1,
    repaymentUnit: "months",
    numberOfRepayments: 1,
  };
  calculationResults.value = null;
};

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};
</script>
