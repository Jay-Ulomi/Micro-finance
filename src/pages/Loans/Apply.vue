<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Apply for Loan</h1>
      <p class="text-gray-600">Submit a new loan application</p>
    </div>

    <!-- Loan application form -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium">Loan Application Form</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitApplication" class="space-y-6">
          <!-- Customer Selection -->
          <div v-if="!selectedCustomerId" class="space-y-4">
            <h4 class="font-medium text-gray-900">Select Customer</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Search Customer</label>
                <input
                  v-model="customerSearch"
                  type="text"
                  class="form-input"
                  placeholder="Search by name, email, or customer ID"
                  @input="searchCustomers"
                />
              </div>
              <div>
                <label class="form-label">Choose Customer</label>
                <select v-model="selectedCustomerId" class="form-input">
                  <option value="">Choose a customer</option>
                  <option
                    v-for="customer in filteredCustomers"
                    :key="customer.id"
                    :value="customer.id"
                  >
                    {{ customer.firstName }} {{ customer.lastName }} -
                    {{ customer.customerId }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Customer search results -->
            <div
              v-if="customerSearch && filteredCustomers.length > 0"
              class="border border-gray-200 rounded-lg max-h-48 overflow-y-auto"
            >
              <div
                v-for="customer in filteredCustomers"
                :key="customer.id"
                @click="selectCustomer(customer)"
                class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ customer.firstName }} {{ customer.lastName }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ customer.email }} • {{ customer.customerId }}
                    </p>
                  </div>
                  <span
                    :class="getKycStatusClass(customer.kycStatus)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ customer.kycStatus }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Customer Info -->
          <div
            v-if="selectedCustomerId && selectedCustomer"
            class="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h4 class="font-medium text-blue-900 mb-2">Selected Customer</h4>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-900">
                  {{ selectedCustomer.firstName }}
                  {{ selectedCustomer.lastName }}
                </p>
                <p class="text-sm text-blue-700">
                  {{ selectedCustomer.email }} •
                  {{ selectedCustomer.customerId }}
                </p>
              </div>
              <button
                @click="selectedCustomerId = null"
                type="button"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                Change Customer
              </button>
            </div>
          </div>

          <!-- Loan Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label">Loan Type</label>
              <select v-model="form.loanType" class="form-input" required>
                <option value="">Select loan type</option>
                <option value="personal">Personal Loan</option>
                <option value="business">Business Loan</option>
                <option value="mortgage">Mortgage</option>
                <option value="vehicle">Vehicle Loan</option>
                <option value="education">Education Loan</option>
              </select>
            </div>

            <div>
              <label class="form-label">Loan Purpose</label>
              <input
                v-model="form.purpose"
                type="text"
                class="form-input"
                placeholder="e.g., Home renovation, Business expansion"
                required
              />
            </div>

            <div>
              <label class="form-label">Requested Amount</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >$</span
                >
                <input
                  v-model="form.amount"
                  type="number"
                  class="form-input pl-8"
                  placeholder="0.00"
                  min="100"
                  step="100"
                  required
                />
              </div>
            </div>

            <div>
              <label class="form-label">Loan Term (months)</label>
              <input
                v-model="form.term"
                type="number"
                class="form-input"
                placeholder="12"
                min="6"
                max="360"
                required
              />
            </div>

            <div>
              <label class="form-label">Interest Rate (%)</label>
              <input
                v-model="form.interestRate"
                type="number"
                class="form-input"
                placeholder="8.5"
                min="1"
                max="30"
                step="0.1"
                required
              />
            </div>

            <div>
              <label class="form-label">Monthly Income</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >$</span
                >
                <input
                  v-model="form.monthlyIncome"
                  type="number"
                  class="form-input pl-8"
                  placeholder="0.00"
                  min="0"
                  step="100"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Collateral Information -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">Collateral Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Collateral Type</label>
                <select v-model="form.collateral.type" class="form-input">
                  <option value="">No collateral</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="equipment">Equipment</option>
                  <option value="inventory">Inventory</option>
                  <option value="securities">Securities</option>
                </select>
              </div>

              <div v-if="form.collateral.type">
                <label class="form-label">Collateral Value</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >$</span
                  >
                  <input
                    v-model="form.collateral.value"
                    type="number"
                    class="form-input pl-8"
                    placeholder="0.00"
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <div v-if="form.collateral.type" class="md:col-span-2">
                <label class="form-label">Collateral Description</label>
                <textarea
                  v-model="form.collateral.description"
                  class="form-input"
                  rows="3"
                  placeholder="Describe the collateral in detail"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Guarantor Information -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">Guarantor Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Guarantor Name</label>
                <input
                  v-model="form.guarantor.name"
                  type="text"
                  class="form-input"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label class="form-label">Guarantor Phone</label>
                <input
                  v-model="form.guarantor.phone"
                  type="tel"
                  class="form-input"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label class="form-label">Guarantor Email</label>
                <input
                  v-model="form.guarantor.email"
                  type="email"
                  class="form-input"
                  placeholder="Email address"
                />
              </div>

              <div>
                <label class="form-label">Relationship</label>
                <select v-model="form.guarantor.relationship" class="form-input">
                  <option value="">Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="business_partner">Business Partner</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="space-y-4">
            <h4 class="form-label">Additional Information</h4>
            <textarea
              v-model="form.notes"
              class="form-input"
              rows="4"
              placeholder="Any additional information about the loan application..."
            ></textarea>
          </div>

          <!-- Loan Calculation Preview -->
          <div
            v-if="form.amount && form.term && form.interestRate"
            class="bg-gray-50 border border-gray-200 rounded-lg p-4"
          >
            <h4 class="font-medium text-gray-900 mb-3">Loan Calculation Preview</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Monthly Payment:</span>
                <p class="font-medium text-gray-900">
                  {{ formatCurrency(monthlyPayment) }}
                </p>
              </div>
              <div>
                <span class="text-gray-600">Total Interest:</span>
                <p class="font-medium text-gray-900">
                  {{ formatCurrency(totalInterest) }}
                </p>
              </div>
              <div>
                <span class="text-gray-600">Total Amount:</span>
                <p class="font-medium text-gray-900">
                  {{ formatCurrency(totalAmount) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-between pt-6 border-t border-gray-200">
            <router-link to="/loans" class="btn-secondary"> Cancel </router-link>
            <button
              type="submit"
              :disabled="!isFormValid || loansStore.isLoading"
              class="btn-primary"
            >
              <svg
                v-if="loansStore.isLoading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              {{ loansStore.isLoading ? "Submitting..." : "Submit Application" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLoansStore } from "@/store/loans";
import { useCustomersStore } from "@/store/customers";
import { formatCurrency } from "@/utils/formatCurrency";
import { calculateMonthlyPayment, calculateTotalAmount } from "@/utils/loanCalculator";
import DatePicker from "@/components/DatePicker.vue";
import type { Customer, CreateLoanData } from "@/types";

const route = useRoute();
const router = useRouter();
const loansStore = useLoansStore();
const customersStore = useCustomersStore();

// Global notification functions
const showSuccess = inject("showSuccess") as (message: string) => void;
const showError = inject("showError") as (message: string) => void;

const customerSearch = ref("");
const selectedCustomerId = ref("");
const selectedCustomer = ref<Customer | null>(null);
const filteredCustomers = ref<Customer[]>([]);

const form = reactive<
  CreateLoanData & { applicationDate: string; expectedDisbursementDate: string }
>({
  customerId: "",
  loanType: "",
  purpose: "",
  amount: 0,
  term: 12,
  interestRate: 8.5,
  monthlyIncome: 0,
  applicationDate: new Date().toISOString().split("T")[0],
  expectedDisbursementDate: "",
  collateral: {
    type: "",
    value: 0,
    description: "",
  },
  guarantor: {
    name: "",
    phone: "",
    email: "",
    relationship: "",
  },
  notes: "",
});

onMounted(async () => {
  // Check if customer ID is provided in query params
  const customerId = route.query.customerId as string;
  if (customerId) {
    try {
      await loadCustomer(customerId);
    } catch (error) {
      showError("Failed to load customer information");
    }
  }

  // Load customers for search
  await customersStore.getCustomers();
});

const loadCustomer = async (customerId: string) => {
  try {
    await customersStore.getCustomer(customerId);
    selectedCustomer.value = customersStore.currentCustomer;
    selectedCustomerId.value = customerId;
    form.customerId = customerId;
  } catch (error) {
    showError("Failed to load customer information");
  }
};

const searchCustomers = () => {
  if (!customerSearch.value.trim()) {
    filteredCustomers.value = [];
    return;
  }

  const query = customerSearch.value.toLowerCase();
  filteredCustomers.value = customersStore.customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(query) ||
      customer.lastName.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.customerId.toLowerCase().includes(query),
  );
};

const selectCustomer = (customer: Customer) => {
  selectedCustomer.value = customer;
  selectedCustomerId.value = customer.id;
  form.customerId = customer.id;
  customerSearch.value = "";
  filteredCustomers.value = [];
};

// Computed properties for loan calculations
const monthlyPayment = computed(() => {
  if (!form.amount || !form.term || !form.interestRate) return 0;
  return calculateMonthlyPayment(form.amount, form.interestRate, form.term);
});

const totalInterest = computed(() => {
  if (!monthlyPayment.value || !form.amount || !form.term) return 0;
  return monthlyPayment.value * form.term - form.amount;
});

const totalAmount = computed(() => {
  if (!form.amount || !totalInterest.value) return 0;
  return form.amount + totalInterest.value;
});

const isFormValid = computed(() => {
  return (
    form.customerId &&
    form.loanType &&
    form.purpose &&
    form.amount > 0 &&
    form.term > 0 &&
    form.interestRate > 0 &&
    form.monthlyIncome > 0
  );
});

const submitApplication = async () => {
  if (!isFormValid.value) return;

  try {
    const loan = await loansStore.createLoan(form);
    showSuccess("Loan application submitted successfully");
    router.push(`/loans/${loan.id}`);
  } catch (error) {
    showError("Failed to submit loan application");
  }
};

const getKycStatusClass = (status: string) => {
  const classes = {
    pending: "px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full",
    verified: "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full",
    rejected: "px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full",
  };
  return classes[status as keyof typeof classes] || classes.pending;
};
</script>
