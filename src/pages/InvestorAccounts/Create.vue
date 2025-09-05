<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Investor Account</h1>
        <p class="text-sm text-gray-600">
          Create a new investor account with product selection and custom fields
        </p>
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Investor Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Investor <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="investorSearchQuery"
                  @input="filterInvestors"
                  @focus="showInvestorDropdown = true"
                  type="text"
                  placeholder="Search for investor..."
                  class="form-input pr-10"
                  required
                />
                <ChevronDownIcon class="w-5 h-5 text-gray-400 absolute right-3 top-3" />

                <!-- Investor Dropdown -->
                <div
                  v-if="showInvestorDropdown"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  <div
                    v-for="investor in filteredInvestors"
                    :key="investor.id"
                    @click="selectInvestor(investor)"
                    class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  >
                    <div class="flex items-center">
                      <div
                        class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                      >
                        <span class="text-sm font-medium text-blue-700">
                          {{ getInitials(investor.fullName) }}
                        </span>
                      </div>
                      <div>
                        <div class="font-medium text-gray-900">{{ investor.fullName }}</div>
                        <div class="text-sm text-gray-500">
                          {{ investor.business }} • {{ investor.email }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="filteredInvestors.length === 0" class="p-3 text-gray-500 text-center">
                    No investors found
                  </div>
                </div>
              </div>

              <!-- Selected Investor Display -->
              <div v-if="selectedInvestor" class="mt-2 p-3 bg-blue-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                    >
                      <span class="text-sm font-medium text-blue-700">
                        {{ getInitials(selectedInvestor.fullName) }}
                      </span>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ selectedInvestor.fullName }}</div>
                      <div class="text-sm text-gray-500">{{ selectedInvestor.business }}</div>
                    </div>
                  </div>
                  <button
                    @click="clearInvestor"
                    type="button"
                    class="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Investor Product Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Investor Product <span class="text-red-500">*</span>
              </label>
              <div class="flex space-x-2">
                <select v-model="form.investorProductId" class="form-input flex-1" required>
                  <option value="">Select Investor Product</option>
                  <option v-for="product in investorProducts" :key="product.id" :value="product.id">
                    {{ product.name }}
                  </option>
                </select>
                <button @click="openProductModal" type="button" class="btn btn-outline">
                  <PlusIcon class="w-4 h-4 mr-1" />
                  Add/Edit
                </button>
              </div>
            </div>

            <!-- Account Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Investor Account # <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.accountNumber"
                type="text"
                placeholder="1000001"
                class="form-input"
                required
              />
              <p class="text-xs text-gray-500 mt-1">Auto-generated if left empty</p>
            </div>

            <!-- Initial Balance -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Initial Balance </label>
              <div class="relative">
                <span class="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  v-model.number="form.initialBalance"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="form-input pl-8"
                />
              </div>
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
          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"> Description </label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Enter account description..."
              class="form-input"
            ></textarea>
          </div>

          <!-- Custom Fields Section -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Custom Fields</h3>
              <button @click="addCustomField" type="button" class="btn btn-outline btn-sm">
                <PlusIcon class="w-4 h-4 mr-1" />
                Add Custom Field
              </button>
            </div>

            <div
              v-if="form.customFields.length === 0"
              class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"
            >
              <p class="text-gray-500 mb-4">No custom fields added yet</p>
              <button @click="addCustomField" type="button" class="btn btn-outline">
                <PlusIcon class="w-4 h-4 mr-2" />
                Click here to add custom fields on this page
              </button>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(field, index) in form.customFields"
                :key="index"
                class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
              >
                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    v-model="field.name"
                    type="text"
                    placeholder="Field name"
                    class="form-input"
                  />
                  <input
                    v-model="field.value"
                    type="text"
                    placeholder="Field value"
                    class="form-input"
                  />
                </div>
                <button
                  @click="removeCustomField(index)"
                  type="button"
                  class="text-red-500 hover:text-red-700"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
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
            <button type="button" @click="goBack" class="btn btn-outline">Cancel</button>
            <button type="submit" :disabled="!isFormValid" class="btn btn-primary">
              <CheckIcon class="w-4 h-4 mr-2" />
              Add Investor Account
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
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center mb-4">
          <CheckCircleIcon class="w-8 h-8 text-green-500 mr-3" />
          <h3 class="text-lg font-medium text-gray-900">Success!</h3>
          <button
            @click="showSuccessModal = false"
            class="ml-auto text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <p class="text-gray-600 mb-4">
          Investor Account has been created: <strong>{{ form.accountNumber }}</strong>
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="goBackToAccounts" class="btn btn-secondary">Back to Accounts</button>
          <button @click="viewAccount" class="btn btn-primary">View Account</button>
        </div>
      </div>
    </div>

    <!-- Investor Product Modal -->
    <div
      v-if="showProductModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Add/Edit Investor Products</h3>
          <button @click="closeProductModal" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="product in investorProducts"
            :key="product.id"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
          >
            <div>
              <div class="font-medium">{{ product.name }}</div>
              <div class="text-sm text-gray-500">{{ product.description }}</div>
            </div>
            <div class="flex space-x-2">
              <button @click="editProduct(product)" class="btn btn-xs btn-outline">
                <PencilIcon class="w-3 h-3" />
              </button>
              <button @click="deleteProduct(product.id)" class="btn btn-xs btn-danger">
                <TrashIcon class="w-3 h-3" />
              </button>
            </div>
          </div>

          <button @click="addNewProduct" class="btn btn-outline w-full">
            <PlusIcon class="w-4 h-4 mr-2" />
            Add New Product
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/vue/24/outline";

// Types
interface Investor {
  id: string;
  fullName: string;
  business: string;
  email: string;
  mobile: string;
}

interface InvestorProduct {
  id: string;
  name: string;
  description: string;
  interestRate: number;
  minBalance: number;
}

interface CustomField {
  name: string;
  value: string;
}

interface InvestorAccountForm {
  investorId: string;
  investorProductId: string;
  accountNumber: string;
  initialBalance: number;
  description: string;
  customFields: CustomField[];
}

// Reactive data
const router = useRouter();
const showInvestorDropdown = ref(false);
const investorSearchQuery = ref("");
const selectedInvestor = ref<Investor | null>(null);
const showSuccessModal = ref(false);
const showProductModal = ref(false);

const form = ref<InvestorAccountForm>({
  investorId: "",
  investorProductId: "",
  accountNumber: "",
  initialBalance: 0,
  description: "",
  customFields: [],
});

// Mock data
const investors = ref<Investor[]>([
  {
    id: "1",
    fullName: "John Anderson",
    business: "Anderson Holdings Ltd",
    email: "john.anderson@andersonholdings.com",
    mobile: "+1-555-0123",
  },
  {
    id: "2",
    fullName: "Sarah Chen",
    business: "Chen Venture Capital",
    email: "sarah.chen@chenvc.com",
    mobile: "+1-555-0234",
  },
  {
    id: "3",
    fullName: "Michael Rodriguez",
    business: "Rodriguez Financial Group",
    email: "m.rodriguez@rodriguezfg.com",
    mobile: "+1-555-0345",
  },
  {
    id: "4",
    fullName: "Emily Johnson",
    business: "Johnson Asset Management",
    email: "emily.johnson@johnsonassets.com",
    mobile: "+1-555-0456",
  },
]);

const investorProducts = ref<InvestorProduct[]>([
  {
    id: "1",
    name: "Premium Investment Account",
    description: "High-yield investment account with 5.5% annual interest",
    interestRate: 5.5,
    minBalance: 10000,
  },
  {
    id: "2",
    name: "Standard Investment Account",
    description: "Standard investment account with 3.2% annual interest",
    interestRate: 3.2,
    minBalance: 1000,
  },
  {
    id: "3",
    name: "Portfolio Management Account",
    description: "Managed portfolio account with 4.8% annual interest",
    interestRate: 4.8,
    minBalance: 5000,
  },
]);

const filteredInvestors = ref<Investor[]>([...investors.value]);

// Computed properties
const isFormValid = computed(() => {
  return (
    form.value.investorId !== "" &&
    form.value.investorProductId !== "" &&
    form.value.accountNumber !== ""
  );
});

const validationErrors = computed(() => {
  const errors: string[] = [];

  if (!form.value.investorId) {
    errors.push("Investor selection is required");
  }

  if (!form.value.investorProductId) {
    errors.push("Investor Product selection is required");
  }

  if (!form.value.accountNumber.trim()) {
    errors.push("Account Number is required");
  }

  if (form.value.initialBalance < 0) {
    errors.push("Initial balance cannot be negative");
  }

  return errors;
});

// Methods
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const filterInvestors = () => {
  if (!investorSearchQuery.value) {
    filteredInvestors.value = [...investors.value];
    return;
  }

  const query = investorSearchQuery.value.toLowerCase();
  filteredInvestors.value = investors.value.filter(
    (investor) =>
      investor.fullName.toLowerCase().includes(query) ||
      investor.business.toLowerCase().includes(query) ||
      investor.email.toLowerCase().includes(query),
  );
};

const selectInvestor = (investor: Investor) => {
  selectedInvestor.value = investor;
  form.value.investorId = investor.id;
  showInvestorDropdown.value = false;
  investorSearchQuery.value = "";
};

const clearInvestor = () => {
  selectedInvestor.value = null;
  form.value.investorId = "";
};

const addCustomField = () => {
  form.value.customFields.push({ name: "", value: "" });
};

const removeCustomField = (index: number) => {
  form.value.customFields.splice(index, 1);
};

const openProductModal = () => {
  showProductModal.value = true;
};

const closeProductModal = () => {
  showProductModal.value = false;
};

const addNewProduct = () => {
  // Navigate to create product page
  router.push("/investor-accounts/create-product");
};

const editProduct = (product: InvestorProduct) => {
  // Navigate to edit product page
  alert(`Edit product: ${product.name}`);
};

const deleteProduct = (productId: string) => {
  if (confirm("Are you sure you want to delete this product?")) {
    const index = investorProducts.value.findIndex((p) => p.id === productId);
    if (index > -1) {
      investorProducts.value.splice(index, 1);
    }
  }
};

const generateAccountNumber = () => {
  if (!form.value.accountNumber) {
    // Generate account number based on current count + 1
    const nextNumber = 1000000 + investorProducts.value.length + 1;
    form.value.accountNumber = nextNumber.toString();
  }
};

const resetForm = () => {
  if (confirm("Are you sure you want to reset the form? All entered data will be lost.")) {
    form.value = {
      investorId: "",
      investorProductId: "",
      accountNumber: "",
      initialBalance: 0,
      description: "",
      customFields: [],
    };
    selectedInvestor.value = null;
    investorSearchQuery.value = "";
    filteredInvestors.value = [...investors.value];
  }
};

const goBack = () => {
  router.push("/investor-accounts");
};

const goBackToAccounts = () => {
  showSuccessModal.value = false;
  router.push("/investor-accounts");
};

const viewAccount = () => {
  showSuccessModal.value = false;
  // Navigate to account details
  alert(`View account: ${form.value.accountNumber}`);
};

const submitForm = () => {
  if (!isFormValid.value) {
    alert("Please fix validation errors before submitting");
    return;
  }

  // Generate account number if not provided
  generateAccountNumber();

  // Prepare form data
  const accountData = {
    ...form.value,
    createdAt: new Date(),
    status: "active",
  };

  // In a real application, you would send this to your backend API
  console.log("Submitting investor account:", accountData);

  // Show success modal
  showSuccessModal.value = true;
};

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    showInvestorDropdown.value = false;
  }
};

// Add event listener for clicking outside
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  generateAccountNumber();
});

defineOptions({
  name: "CreateInvestorAccount",
});
</script>
