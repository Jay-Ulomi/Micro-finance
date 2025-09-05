<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Savings Product</h1>
        <p class="mt-1 text-sm text-gray-500">Create a new savings product with interest and withdrawal settings</p>
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
        <button @click="previewProduct" class="btn-secondary">
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

    <form @submit.prevent="submitProduct" class="space-y-8">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Basic Information</h3>
          <p class="mt-1 text-sm text-gray-500">Required fields for savings product</p>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Savings Product Name <span class="text-red-500">*</span></label>
            <input
              v-model="productForm.productName"
              type="text"
              class="form-input"
              placeholder="Enter savings product name"
              required
            />
          </div>

          <!-- Duplicate Transactions Setting -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Allow Duplicate Transactions with same date, time, and amount?</label>
            <div class="flex space-x-6">
              <label class="flex items-center">
                <input
                  v-model="productForm.allowDuplicateTransactions"
                  type="radio"
                  value="yes"
                  class="form-radio"
                />
                <span class="ml-2 text-sm">Yes</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="productForm.allowDuplicateTransactions"
                  type="radio"
                  value="no"
                  class="form-radio"
                />
                <span class="ml-2 text-sm">No</span>
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              If you select No above, you can not add duplicate transactions. This is useful for error checking. 
              Let's say you deposit $100 on 12th March 2017 at 11AM to John's savings account. If you try to deposit 
              another transaction for $100 on 12th March 2017 at 11AM for John, the system will give you an error.
            </p>
          </div>
        </div>
      </div>

      <!-- Savings Interest Settings -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Savings Interest</h3>
          <p class="mt-1 text-sm text-gray-500">Configure interest calculation settings</p>
        </div>

        <!-- Information Box -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p class="text-sm text-blue-800">
            The system will not add the interest in the past. It will only add interest from current date. 
            We are assuming that when you add a savings account with transactions, you will already be having 
            the interest calculated from before and the transactions will be added. So we do not add interest 
            in the past to avoid conflict.
          </p>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Interest Rate Per Annum %</label>
              <div class="flex space-x-2">
                <input
                  v-model.number="productForm.interestRate"
                  type="number"
                  step="0.01"
                  class="form-input flex-1"
                  placeholder="Number or decimal only"
                />
                <span class="flex items-center text-sm text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Interest Method</label>
              <select v-model="productForm.interestMethod" class="form-input">
                <option value="">Select Method</option>
                <option value="last-balance">Last Savings Balance</option>
                <option value="pro-rata">Pro-Rata Basis</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                Last Savings Balance method will calculate the interest on the last balance. 
                However, Pro-Rata Basis will look at the balance for each day and calculate interest for those days only.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Interest Posting Frequency on Savings Accounts</label>
              <select v-model="productForm.interestPostingFrequency" class="form-input">
                <option value="">When should Interest be added to Saving Account?</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Balance for Interest Rate</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  v-model.number="productForm.minimumBalanceForInterest"
                  type="number"
                  step="0.01"
                  class="form-input pl-8"
                  placeholder="0"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Interest rate will only be calculated if the balance in the savings account is more than or equal to the minimum balance above
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Savings Withdrawal Settings -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Savings Withdrawal</h3>
          <p class="mt-1 text-sm text-gray-500">Configure withdrawal limitations and overdraft settings</p>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Allow Savings Account to be Overdrawn</label>
            <div class="flex space-x-6">
              <label class="flex items-center">
                <input
                  v-model="productForm.allowOverdraft"
                  type="radio"
                  value="yes"
                  class="form-radio"
                />
                <span class="ml-2 text-sm">Yes</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="productForm.allowOverdraft"
                  type="radio"
                  value="no"
                  class="form-radio"
                />
                <span class="ml-2 text-sm">No</span>
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              If you select Yes above, you will be able to withdraw money from the borrower's savings account 
              in excess of what the account holds. The balance will show negative in that case.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Balance for Withdrawal</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                v-model.number="productForm.minimumBalanceForWithdrawal"
                type="number"
                step="0.01"
                class="form-input pl-8"
                placeholder="Leave empty if no minimum required"
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Leave the above empty if withdrawal should be allowed on any balance. If you type value, 
              then withdrawal transaction will only be allowed if the balance in the savings account 
              is more than or equal to the minimum balance above.
            </p>
          </div>
        </div>
      </div>

      <!-- Branch Access -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Access to Branch</h3>
          <p class="mt-1 text-sm text-gray-500">Select which branches can use this savings product</p>
        </div>
        
        <!-- Warning Message -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p class="text-sm text-yellow-800">
            <strong>Warning:</strong> Click in the box below to select multiple branches. If you do not select any branch, 
            then this savings product will not be available to any branch.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Branches</label>
          <div class="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
            <label v-for="branch in availableBranches" :key="branch.id" class="flex items-center">
              <input
                v-model="productForm.selectedBranches"
                type="checkbox"
                :value="branch.id"
                class="form-checkbox"
              />
              <span class="ml-2 text-sm">{{ branch.name }}</span>
            </label>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Select one or more branches that will have access to this savings product.
          </p>
        </div>
      </div>

      <!-- Additional Settings -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Additional Settings</h3>
              <p class="mt-1 text-sm text-gray-500">Optional configuration settings</p>
            </div>
            <button
              type="button"
              @click="showAdditionalSettings = !showAdditionalSettings"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              {{ showAdditionalSettings ? "Hide" : "Show" }}
            </button>
          </div>
        </div>
        <div v-if="showAdditionalSettings" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Account Opening Fee</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  v-model.number="productForm.accountOpeningFee"
                  type="number"
                  step="0.01"
                  class="form-input pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Monthly Maintenance Fee</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  v-model.number="productForm.monthlyMaintenanceFee"
                  type="number"
                  step="0.01"
                  class="form-input pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Maximum Daily Withdrawal Limit</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  v-model.number="productForm.maxDailyWithdrawalLimit"
                  type="number"
                  step="0.01"
                  class="form-input pl-8"
                  placeholder="Leave empty for no limit"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Maximum Account Balance</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  v-model.number="productForm.maxAccountBalance"
                  type="number"
                  step="0.01"
                  class="form-input pl-8"
                  placeholder="Leave empty for no limit"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
            <textarea
              v-model="productForm.description"
              class="form-input"
              rows="3"
              placeholder="Additional product details and terms..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex items-center justify-end space-x-4">
        <button type="button" @click="cancelProduct" class="btn-secondary">Cancel</button>
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
          {{ isSubmitting ? "Creating Product..." : "Create Savings Product" }}
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
interface SavingsProductForm {
  productName: string;
  allowDuplicateTransactions: string;
  interestRate: number;
  interestMethod: string;
  interestPostingFrequency: string;
  minimumBalanceForInterest: number;
  allowOverdraft: string;
  minimumBalanceForWithdrawal: number;
  selectedBranches: string[];
  accountOpeningFee: number;
  monthlyMaintenanceFee: number;
  maxDailyWithdrawalLimit: number;
  maxAccountBalance: number;
  description: string;
}

interface Branch {
  id: string;
  name: string;
}

// Reactive data
const router = useRouter();

// Form data
const productForm = ref<SavingsProductForm>({
  productName: "",
  allowDuplicateTransactions: "no",
  interestRate: 0,
  interestMethod: "",
  interestPostingFrequency: "",
  minimumBalanceForInterest: 0,
  allowOverdraft: "no",
  minimumBalanceForWithdrawal: 0,
  selectedBranches: [],
  accountOpeningFee: 0,
  monthlyMaintenanceFee: 0,
  maxDailyWithdrawalLimit: 0,
  maxAccountBalance: 0,
  description: "",
});

// State
const availableBranches = ref<Branch[]>([
  { id: "branch-1", name: "Branch #1" },
  { id: "branch-2", name: "Branch #2" },
  { id: "branch-3", name: "Branch #3" },
  { id: "branch-4", name: "Branch #4" },
]);

const showAdditionalSettings = ref(false);
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Methods
const saveDraft = () => {
  // Save draft functionality
  alert("Draft saved successfully!");
};

const previewProduct = () => {
  // Preview product functionality
  alert("Product preview would open here");
};

const submitProduct = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Validate required fields
    if (!productForm.value.productName) {
      throw new Error("Product name is required");
    }

    if (productForm.value.selectedBranches.length === 0) {
      throw new Error("At least one branch must be selected");
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    successMessage.value = "Savings product created successfully!";

    // Redirect to products list
    setTimeout(() => {
      router.push("/savings/products");
    }, 2000);
  } catch (error: any) {
    errorMessage.value = error.message || "Failed to create savings product. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const cancelProduct = () => {
  if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
    router.push("/savings/products");
  }
};

// Lifecycle
onMounted(() => {
  // Set default branch selection
  productForm.value.selectedBranches = ["branch-1"];
});
</script>