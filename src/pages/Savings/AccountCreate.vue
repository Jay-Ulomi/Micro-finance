<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Savings Account</h1>
        <p class="mt-1 text-sm text-gray-500">Create a new savings account for a borrower</p>
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
        <button @click="previewAccount" class="btn-secondary">
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

    <form @submit.prevent="submitAccount" class="space-y-8">
      <!-- Account Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Account Information</h3>
          <p class="mt-1 text-sm text-gray-500">Basic savings account details</p>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Borrower Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Borrower <span class="text-red-500">*</span></label>
              <div class="flex space-x-2">
                <select v-model="accountForm.borrowerId" class="form-input flex-1" required>
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

            <!-- Savings Product -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Savings Product <span class="text-red-500">*</span></label>
              <div class="flex space-x-2">
                <select v-model="accountForm.savingsProduct" class="form-input flex-1" required>
                  <option value="">Select Savings Product</option>
                  <option v-for="product in savingsProducts" :key="product.id" :value="product.id">
                    {{ product.productName }} - {{ product.interestRate }}%
                  </option>
                </select>
                <button type="button" @click="addSavingsProduct" class="btn-secondary">
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
            <!-- Account Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <div class="flex space-x-2">
                <input
                  v-model="accountForm.accountNumber"
                  type="text"
                  class="form-input flex-1"
                  placeholder="Auto-generated"
                  readonly
                />
                <button type="button" @click="generateAccountNumber" class="btn-secondary">
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

            <!-- Opening Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Opening Date <span class="text-red-500">*</span></label>
              <input v-model="accountForm.openingDate" type="date" class="form-input" required />
            </div>
          </div>

          <!-- Initial Deposit -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Initial Deposit Amount</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  v-model.number="accountForm.initialDeposit"
                  type="number"
                  step="0.01"
                  class="form-input pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>

            <!-- Account Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Account Status <span class="text-red-500">*</span></label>
              <select v-model="accountForm.accountStatus" class="form-input" required>
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="dormant">Dormant</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Account Settings</h3>
          <p class="mt-1 text-sm text-gray-500">Configure account-specific preferences</p>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Nominated Amount -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nominated Amount</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  v-model.number="accountForm.nominatedAmount"
                  type="number"
                  step="0.01"
                  class="form-input pl-8"
                  placeholder="Optional target amount"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">Target savings goal for this account</p>
            </div>

            <!-- Interest Calculation -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Calculate Interest</label>
              <div class="flex space-x-6">
                <label class="flex items-center">
                  <input
                    v-model="accountForm.calculateInterest"
                    type="radio"
                    value="yes"
                    class="form-radio"
                  />
                  <span class="ml-2 text-sm">Yes</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="accountForm.calculateInterest"
                    type="radio"
                    value="no"
                    class="form-radio"
                  />
                  <span class="ml-2 text-sm">No</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Account Preferences -->
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="accountForm.enableSMSAlerts"
                  type="checkbox"
                  class="form-checkbox"
                />
                <span class="ml-2 text-sm">Enable SMS alerts for transactions</span>
              </label>
            </div>

            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="accountForm.enableEmailAlerts"
                  type="checkbox"
                  class="form-checkbox"
                />
                <span class="ml-2 text-sm">Enable email alerts for transactions</span>
              </label>
            </div>

            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="accountForm.allowOnlineAccess"
                  type="checkbox"
                  class="form-checkbox"
                />
                <span class="ml-2 text-sm">Allow online account access</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Accounting Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Accounting Information</h3>
          <p class="mt-1 text-sm text-gray-500">Configure accounting and ledger details</p>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Cash/Bank Account -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cash/Bank Account for Initial Deposit</label>
              <div class="flex space-x-2">
                <select v-model="accountForm.cashBankAccount" class="form-input flex-1">
                  <option value="">Select Account</option>
                  <option value="cash">Cash</option>
                  <option value="bank-account-1">Bank Account 1</option>
                  <option value="bank-account-2">Bank Account 2</option>
                  <option value="bank-account-3">Bank Account 3</option>
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

            <!-- Branch -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Branch <span class="text-red-500">*</span></label>
              <select v-model="accountForm.branchId" class="form-input" required>
                <option value="">Select Branch</option>
                <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                  {{ branch.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Additional Information</h3>
              <p class="mt-1 text-sm text-gray-500">Optional account details and notes</p>
            </div>
            <button
              type="button"
              @click="showAdditionalInfo = !showAdditionalInfo"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              {{ showAdditionalInfo ? "Hide" : "Show" }}
            </button>
          </div>
        </div>
        <div v-if="showAdditionalInfo" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Account Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Account Title</label>
              <input
                v-model="accountForm.accountTitle"
                type="text"
                class="form-input"
                placeholder="Descriptive account name"
              />
            </div>

            <!-- Reference Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
              <input
                v-model="accountForm.referenceNumber"
                type="text"
                class="form-input"
                placeholder="External reference"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              v-model="accountForm.notes"
              class="form-input"
              rows="3"
              placeholder="Additional notes about this savings account..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex items-center justify-end space-x-4">
        <button type="button" @click="cancelAccount" class="btn-secondary">Cancel</button>
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
          {{ isSubmitting ? "Creating Account..." : "Create Savings Account" }}
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

// Types
interface SavingsAccountForm {
  borrowerId: string;
  savingsProduct: string;
  accountNumber: string;
  openingDate: string;
  initialDeposit: number;
  accountStatus: string;
  nominatedAmount: number;
  calculateInterest: string;
  enableSMSAlerts: boolean;
  enableEmailAlerts: boolean;
  allowOnlineAccess: boolean;
  cashBankAccount: string;
  branchId: string;
  accountTitle: string;
  referenceNumber: string;
  notes: string;
}

interface Borrower {
  id: string;
  firstName: string;
  lastName: string;
  uniqueNumber: string;
}

interface SavingsProduct {
  id: string;
  productName: string;
  interestRate: number;
}

interface Branch {
  id: string;
  name: string;
}

// Reactive data
const router = useRouter();

// Form data
const accountForm = ref<SavingsAccountForm>({
  borrowerId: "",
  savingsProduct: "",
  accountNumber: "",
  openingDate: "",
  initialDeposit: 0,
  accountStatus: "active",
  nominatedAmount: 0,
  calculateInterest: "yes",
  enableSMSAlerts: true,
  enableEmailAlerts: false,
  allowOnlineAccess: true,
  cashBankAccount: "",
  branchId: "",
  accountTitle: "",
  referenceNumber: "",
  notes: "",
});

// State
const borrowers = ref<Borrower[]>([]);
const savingsProducts = ref<SavingsProduct[]>([
  { id: "sp-1", productName: "Regular Savings", interestRate: 4.25 },
  { id: "sp-2", productName: "Premium Savings", interestRate: 5.75 },
  { id: "sp-3", productName: "Basic Savings", interestRate: 2.50 },
  { id: "sp-4", productName: "Goal Savings", interestRate: 6.00 },
]);

const branches = ref<Branch[]>([
  { id: "branch-1", name: "Branch #1" },
  { id: "branch-2", name: "Branch #2" },
  { id: "branch-3", name: "Branch #3" },
  { id: "branch-4", name: "Branch #4" },
]);

const showAdditionalInfo = ref(false);
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Methods
const generateAccountNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  accountForm.value.accountNumber = `SAV${timestamp}`;
};

const addBorrower = () => {
  router.push("/borrowers/create");
};

const addSavingsProduct = () => {
  router.push("/savings/products/create");
};

const addBankAccount = () => {
  alert("Add/Edit Bank Accounts page would open here");
};

const saveDraft = () => {
  // Save draft functionality
  alert("Draft saved successfully!");
};

const previewAccount = () => {
  // Preview account functionality
  alert("Account preview would open here");
};

const submitAccount = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Validate required fields
    if (!accountForm.value.borrowerId) {
      throw new Error("Please select a borrower");
    }

    if (!accountForm.value.savingsProduct) {
      throw new Error("Please select a savings product");
    }

    if (!accountForm.value.openingDate) {
      throw new Error("Opening date is required");
    }

    if (!accountForm.value.accountStatus) {
      throw new Error("Please select an account status");
    }

    if (!accountForm.value.branchId) {
      throw new Error("Please select a branch");
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    successMessage.value = `Savings account ${accountForm.value.accountNumber} created successfully!`;

    // Redirect to savings accounts list
    setTimeout(() => {
      router.push("/savings");
    }, 2000);
  } catch (error: any) {
    errorMessage.value = error.message || "Failed to create savings account. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const cancelAccount = () => {
  if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
    router.push("/savings");
  }
};

// Lifecycle
onMounted(async () => {
  try {
    // Mock borrowers data - in real app this would come from API
    borrowers.value = [
      { id: "1", firstName: "John", lastName: "Doe", uniqueNumber: "BRW001" },
      { id: "2", firstName: "Jane", lastName: "Smith", uniqueNumber: "BRW002" },
      { id: "3", firstName: "Bob", lastName: "Johnson", uniqueNumber: "BRW003" },
      { id: "4", firstName: "Alice", lastName: "Williams", uniqueNumber: "BRW004" },
    ];

    // Set default values
    const today = new Date().toISOString().split("T")[0];
    accountForm.value.openingDate = today;
    accountForm.value.branchId = "branch-1";
    accountForm.value.cashBankAccount = "cash";

    // Generate initial account number
    generateAccountNumber();
  } catch (error) {
    console.error("Error loading data:", error);
  }
});
</script>