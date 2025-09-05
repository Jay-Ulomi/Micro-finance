

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Investor Account Product</h1>
        <p class="text-sm text-gray-600">Configure a new investment account product with interest and withdrawal settings</p>
      </div>
      <button @click="goBack" class="btn btn-secondary">
        <ArrowLeftIcon class="w-4 h-4 mr-2" />
        Back to Investor Accounts
      </button>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Required Fields -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title text-red-600">Required Fields:</h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Investor Account Product Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.productName"
                type="text"
                placeholder="Investor Account Product Name"
                class="form-input"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Optional Fields -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Optional Fields:</h2>
        </div>
        <div class="card-body space-y-6">
          <!-- Duplicate Transactions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Allow Duplicate Transactions with same date, time, and amount?
            </label>
            <div class="flex space-x-4 mb-3">
              <label class="flex items-center">
                <input
                  v-model="form.allowDuplicates"
                  :value="true"
                  type="radio"
                  class="form-radio"
                />
                <span class="ml-2">Yes</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.allowDuplicates"
                  :value="false"
                  type="radio"
                  class="form-radio"
                />
                <span class="ml-2">No</span>
              </label>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">
                If you select <strong>No</strong> above, you can not add duplicate transactions. This is useful for error checking.
                Let's say you deposit $100 on 12th March 2017 at 11AM to John's investor account. If you try to deposit another transaction
                for $100 on 12th March 2017 at 11AM for John, the system will give you an error.
              </p>
            </div>
          </div>

          <!-- Interest Settings -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Investor Account Interest:</h3>

            <div class="p-3 bg-yellow-50 rounded-lg mb-4">
              <p class="text-sm text-yellow-800">
                ​The system will not add the interest in the past. It will only add interest from current date. We are assuming that when you add
                a investor account with transactions, you will already be having the interest calculated from before and the transactions will be added.
                So we do not add interest in the past to avoid conflict.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate Per Annum %
                </label>
                <input
                  v-model.number="form.interestRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Number or decimal only"
                  class="form-input"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Interest Method
                </label>
                <select v-model="form.interestMethod" class="form-input">
                  <option value="">Select Interest Method</option>
                  <option value="last-balance">Last Investor Account Balance</option>
                  <option value="pro-rata">Pro-Rata Basis</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">
                  Here you can select Last Investor Account Balance or Pro-Rata Basis. The Last Investor Account Balance method will calculate the interest on the last balance.
                  However, Pro-Rata Basis will look at the balance for each day and calculate interest for those days only.
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Interest Posting Frequency on Investor Accounts
                </label>
                <select v-model="form.interestFrequency" class="form-input">
                  <option value="">Select Frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semi-annually">Semi-Annually</option>
                  <option value="annually">Annually</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">
                  When should Interest be added to Investor Account?
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Balance for Interest Rate
                </label>
                <input
                  v-model.number="form.minBalanceForInterest"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  class="form-input"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Interest rate will only be calculated if the balance in the investor account is more than or equal to the minimum balance above
                </p>
              </div>
            </div>
          </div>

          <!-- Withdrawal Settings -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Investor Account Withdrawal:</h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Allow Investor Accounts to be Overdrawn
                </label>
                <div class="flex space-x-4 mb-3">
                  <label class="flex items-center">
                    <input
                      v-model="form.allowOverdraft"
                      :value="true"
                      type="radio"
                      class="form-radio"
                    />
                    <span class="ml-2">Yes</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="form.allowOverdraft"
                      :value="false"
                      type="radio"
                      class="form-radio"
                    />
                    <span class="ml-2">No</span>
                  </label>
                </div>
                <div class="p-3 bg-blue-50 rounded-lg">
                  <p class="text-sm text-blue-800">
                    If you select <strong>Yes</strong> above, you will be able to withdraw money from the investor's investor account in excess of what the account holds.
                    The balance will show negative in that case.
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Balance for Withdrawal
                </label>
                <input
                  v-model.number="form.minBalanceForWithdrawal"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Numbers only"
                  class="form-input"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Leave the above empty if withdrawal should be allowed on any balance. If you type value, then withdrawal transaction will only be allowed if the balance in the investor account is more than or equal to the minimum balance above.
                </p>
              </div>
            </div>
          </div>

          <!-- Branch Access -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Branches:</h3>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Access to Branch
              </label>
              <div class="relative">
                <input
                  v-model="branchSearchQuery"
                  @input="filterBranches"
                  @focus="showBranchDropdown = true"
                  type="text"
                  placeholder="Branch #1"
                  class="form-input pr-10"
                />
                <ChevronDownIcon class="w-5 h-5 text-gray-400 absolute right-3 top-3" />

                <!-- Branch Dropdown -->
                <div v-if="showBranchDropdown" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div v-for="branch in filteredBranches" :key="branch.id" class="p-2 hover:bg-gray-50 cursor-pointer">
                    <label class="flex items-center">
                      <input
                        v-model="selectedBranches"
                        :value="branch.id"
                        type="checkbox"
                        class="form-checkbox"
                      />
                      <span class="ml-2">{{ branch.name }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Selected Branch Tags -->
              <div v-if="selectedBranches.length > 0" class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="branchId in selectedBranches"
                  :key="branchId"
                  class="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {{ getBranchName(branchId) }}
                  <button @click="removeBranch(branchId)" class="ml-1 text-blue-600 hover:text-blue-800">
                    <XMarkIcon class="w-3 h-3" />
                  </button>
                </span>
              </div>

              <div class="p-3 bg-red-50 rounded-lg mt-3">
                <p class="text-sm text-red-800">
                  <strong>Warning:</strong> Click in the box above to select multiple branches. If you do not select any branch,
                  then this investor product will not be available to any branch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="card">
        <div class="card-body">
          <div class="flex justify-end space-x-3">
            <button type="button" @click="resetForm" class="btn btn-secondary">
              <ArrowPathIcon class="w-4 h-4 mr-2" />
              Reset Form
            </button>
            <button type="button" @click="goBack" class="btn btn-outline">
              Cancel
            </button>
            <button type="submit" :disabled="!isFormValid" class="btn btn-primary">
              <CheckIcon class="w-4 h-4 mr-2" />
              Add Investor Account Product
            </button>
          </div>
        </div>
      </div>
    </form>

    <!-- Validation Errors -->
    <div v-if="validationErrors.length > 0" class="card border-red-200 bg-red-50">
      <div class="card-body">
        <div class="flex items-start">
          <ExclamationTriangleIcon class="w-5 h-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 class="font-medium text-red-900 mb-2">Please fix the following issues:</h3>
            <ul class="list-disc list-inside text-sm text-red-800 space-y-1">
              <li v-for="error in validationErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center mb-4">
          <CheckCircleIcon class="w-8 h-8 text-green-500 mr-3" />
          <h3 class="text-lg font-medium text-gray-900">Success!</h3>
          <button @click="showSuccessModal = false" class="ml-auto text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <p class="text-gray-600 mb-4">
          Investor Account Product has been added: <strong>{{ form.productName }}</strong>
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="goBackToAdmin" class="btn btn-secondary">
            Back to Admin
          </button>
          <button @click="viewProducts" class="btn btn-primary">
            View Products
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from "@heroicons/vue/24/outline";

// Types
interface Branch {
  id: string;
  name: string;
}

interface InvestorAccountProductForm {
  productName: string;
  allowDuplicates: boolean;
  interestRate: number | null;
  interestMethod: string;
  interestFrequency: string;
  minBalanceForInterest: number;
  allowOverdraft: boolean;
  minBalanceForWithdrawal: number | null;
}

// Reactive data
const router = useRouter();
const showBranchDropdown = ref(false);
const branchSearchQuery = ref("");
const selectedBranches = ref<string[]>([]);
const showSuccessModal = ref(false);

const form = ref<InvestorAccountProductForm>({
  productName: "",
  allowDuplicates: false,
  interestRate: null,
  interestMethod: "",
  interestFrequency: "",
  minBalanceForInterest: 0,
  allowOverdraft: false,
  minBalanceForWithdrawal: null
});

// Mock branches data
const branches = ref<Branch[]>([
  { id: "1", name: "Branch #1 - Main Office" },
  { id: "2", name: "Branch #2 - Downtown" },
  { id: "3", name: "Branch #3 - Airport" },
  { id: "4", name: "Branch #4 - Shopping Mall" },
  { id: "5", name: "Branch #5 - Industrial Area" }
]);

const filteredBranches = ref<Branch[]>([...branches.value]);

// Computed properties
const isFormValid = computed(() => {
  return form.value.productName.trim() !== "" && selectedBranches.value.length > 0;
});

const validationErrors = computed(() => {
  const errors: string[] = [];

  if (!form.value.productName.trim()) {
    errors.push("Product Name is required");
  }

  if (selectedBranches.value.length === 0) {
    errors.push("At least one branch must be selected");
  }

  if (form.value.interestRate !== null && form.value.interestRate < 0) {
    errors.push("Interest rate cannot be negative");
  }

  if (form.value.minBalanceForInterest < 0) {
    errors.push("Minimum balance for interest cannot be negative");
  }

  if (form.value.minBalanceForWithdrawal !== null && form.value.minBalanceForWithdrawal < 0) {
    errors.push("Minimum balance for withdrawal cannot be negative");
  }

  return errors;
});

// Methods
const filterBranches = () => {
  if (!branchSearchQuery.value) {
    filteredBranches.value = [...branches.value];
    return;
  }

  const query = branchSearchQuery.value.toLowerCase();
  filteredBranches.value = branches.value.filter(branch =>
    branch.name.toLowerCase().includes(query)
  );
};

const getBranchName = (branchId: string): string => {
  return branches.value.find(branch => branch.id === branchId)?.name || 'Unknown Branch';
};

const removeBranch = (branchId: string) => {
  const index = selectedBranches.value.indexOf(branchId);
  if (index > -1) {
    selectedBranches.value.splice(index, 1);
  }
};

const resetForm = () => {
  if (confirm("Are you sure you want to reset the form? All entered data will be lost.")) {
    form.value = {
      productName: "",
      allowDuplicates: false,
      interestRate: null,
      interestMethod: "",
      interestFrequency: "",
      minBalanceForInterest: 0,
      allowOverdraft: false,
      minBalanceForWithdrawal: null
    };
    selectedBranches.value = [];
    branchSearchQuery.value = "";
    filteredBranches.value = [...branches.value];
  }
};

const goBack = () => {
  router.push("/investor-accounts");
};

const goBackToAdmin = () => {
  showSuccessModal.value = false;
  router.push("/settings"); // Assuming admin settings page
};

const viewProducts = () => {
  showSuccessModal.value = false;
  // Navigate to investor account products list page
  alert("Navigate to Investor Account Products list");
};

const submitForm = () => {
  if (!isFormValid.value) {
    alert("Please fix validation errors before submitting");
    return;
  }

  // Prepare form data
  const productData = {
    ...form.value,
    branches: selectedBranches.value.map(id => ({
      id,
      name: getBranchName(id)
    })),
    createdAt: new Date()
  };

  // In a real application, you would send this to your backend API
  console.log("Submitting investor account product:", productData);

  // Show success modal
  showSuccessModal.value = true;
};

// Close branch dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    showBranchDropdown.value = false;
  }
};

// Add event listener for clicking outside
document.addEventListener('click', handleClickOutside);

// Set default branch selection
selectedBranches.value = ["1"]; // Default to Branch #1

defineOptions({
  name: "CreateInvestorAccountProduct",
});
</script>
