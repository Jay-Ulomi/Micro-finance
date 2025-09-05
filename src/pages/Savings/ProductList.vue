<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Savings Products</h1>
        <p class="text-sm text-gray-600">Manage savings product configurations and settings</p>
      </div>
      <div class="flex space-x-3">
        <button @click="createProduct" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Savings Product
        </button>
        <button @click="createSusuProduct" class="btn btn-secondary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add SUSU Collector Product
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-primary-600">{{ savingsProducts.length }}</div>
          <div class="text-sm text-gray-600">Total Products</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-green-600">{{ activeProductsCount }}</div>
          <div class="text-sm text-gray-600">Active Products</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-blue-600">{{ averageInterestRate.toFixed(2) }}%</div>
          <div class="text-sm text-gray-600">Average Interest Rate</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Savings Products</h3>
        <div class="flex space-x-2">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search products..." 
            class="form-input w-64" 
          />
          <select v-model="statusFilter" class="form-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="card-body">
        <div v-if="filteredProducts.length === 0" class="text-center py-8">
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p class="text-gray-600 mb-4">No savings products found</p>
          <button @click="createProduct" class="btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Create First Product
          </button>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Interest Rate</th>
                <th>Interest Method</th>
                <th>Posting Frequency</th>
                <th>Min. Balance</th>
                <th>Overdraft</th>
                <th>Branches</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id">
                <td>
                  <div>
                    <div class="font-medium text-gray-900">{{ product.productName }}</div>
                    <div v-if="product.description" class="text-sm text-gray-500">{{ product.description.substring(0, 50) }}{{ product.description.length > 50 ? '...' : '' }}</div>
                  </div>
                </td>
                <td>
                  <span class="text-green-600 font-medium">{{ product.interestRate }}%</span>
                </td>
                <td>
                  <span class="capitalize">{{ product.interestMethod.replace('-', ' ') }}</span>
                </td>
                <td>
                  <span class="capitalize">{{ product.interestPostingFrequency }}</span>
                </td>
                <td>
                  <span class="text-gray-900">${{ product.minimumBalanceForInterest?.toLocaleString() || '0' }}</span>
                </td>
                <td>
                  <span :class="product.allowOverdraft === 'yes' ? 'badge badge-success' : 'badge badge-secondary'">
                    {{ product.allowOverdraft === 'yes' ? 'Allowed' : 'Not Allowed' }}
                  </span>
                </td>
                <td>
                  <span class="text-sm text-gray-600">{{ product.selectedBranches?.length || 0 }} branches</span>
                </td>
                <td>
                  <span :class="product.status === 'active' ? 'badge badge-success' : 'badge badge-secondary'">
                    {{ product.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="flex space-x-2">
                    <button @click="viewProduct(product)" class="btn btn-sm btn-outline">
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button @click="editProduct(product)" class="btn btn-sm btn-outline">
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button @click="toggleProductStatus(product)" class="btn btn-sm" :class="product.status === 'active' ? 'btn-warning' : 'btn-success'">
                      {{ product.status === 'active' ? 'Deactivate' : 'Activate' }}
                    </button>
                    <button @click="deleteProduct(product)" class="btn btn-sm btn-danger">
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Product Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDetailsModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Savings Product Details
                </h3>
                <div v-if="selectedProduct" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Product Name</label>
                      <p class="text-sm text-gray-900">{{ selectedProduct.productName }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Interest Rate</label>
                      <p class="text-sm text-gray-900">{{ selectedProduct.interestRate }}% per annum</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Interest Method</label>
                      <p class="text-sm text-gray-900 capitalize">{{ selectedProduct.interestMethod?.replace('-', ' ') }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Posting Frequency</label>
                      <p class="text-sm text-gray-900 capitalize">{{ selectedProduct.interestPostingFrequency }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Min. Balance for Interest</label>
                      <p class="text-sm text-gray-900">${{ selectedProduct.minimumBalanceForInterest?.toLocaleString() || '0' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Allow Overdraft</label>
                      <p class="text-sm text-gray-900">{{ selectedProduct.allowOverdraft === 'yes' ? 'Yes' : 'No' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Min. Balance for Withdrawal</label>
                      <p class="text-sm text-gray-900">${{ selectedProduct.minimumBalanceForWithdrawal?.toLocaleString() || 'No minimum' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Allow Duplicate Transactions</label>
                      <p class="text-sm text-gray-900">{{ selectedProduct.allowDuplicateTransactions === 'yes' ? 'Yes' : 'No' }}</p>
                    </div>
                  </div>
                  
                  <!-- Additional Settings -->
                  <div v-if="selectedProduct.accountOpeningFee || selectedProduct.monthlyMaintenanceFee || selectedProduct.maxDailyWithdrawalLimit || selectedProduct.maxAccountBalance">
                    <h4 class="font-medium text-gray-900 mb-2">Additional Settings</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div v-if="selectedProduct.accountOpeningFee">
                        <label class="block text-sm font-medium text-gray-700">Account Opening Fee</label>
                        <p class="text-sm text-gray-900">${{ selectedProduct.accountOpeningFee?.toLocaleString() || '0' }}</p>
                      </div>
                      <div v-if="selectedProduct.monthlyMaintenanceFee">
                        <label class="block text-sm font-medium text-gray-700">Monthly Maintenance Fee</label>
                        <p class="text-sm text-gray-900">${{ selectedProduct.monthlyMaintenanceFee?.toLocaleString() || '0' }}</p>
                      </div>
                      <div v-if="selectedProduct.maxDailyWithdrawalLimit">
                        <label class="block text-sm font-medium text-gray-700">Max Daily Withdrawal</label>
                        <p class="text-sm text-gray-900">${{ selectedProduct.maxDailyWithdrawalLimit?.toLocaleString() || 'No limit' }}</p>
                      </div>
                      <div v-if="selectedProduct.maxAccountBalance">
                        <label class="block text-sm font-medium text-gray-700">Max Account Balance</label>
                        <p class="text-sm text-gray-900">${{ selectedProduct.maxAccountBalance?.toLocaleString() || 'No limit' }}</p>
                      </div>
                    </div>
                  </div>

                  <div v-if="selectedProduct.description">
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <p class="text-sm text-gray-900">{{ selectedProduct.description }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Available Branches</label>
                    <p class="text-sm text-gray-900">{{ selectedProduct.selectedBranches?.length || 0 }} branches selected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="editProduct(selectedProduct)" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Edit Product
            </button>
            <button type="button" @click="closeDetailsModal" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";

// Types
interface SavingsProduct {
  id: string;
  productName: string;
  allowDuplicateTransactions: string;
  interestRate: number;
  interestMethod: string;
  interestPostingFrequency: string;
  minimumBalanceForInterest: number;
  allowOverdraft: string;
  minimumBalanceForWithdrawal: number;
  selectedBranches: string[];
  accountOpeningFee?: number;
  monthlyMaintenanceFee?: number;
  maxDailyWithdrawalLimit?: number;
  maxAccountBalance?: number;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Reactive data
const router = useRouter();
const searchQuery = ref("");
const statusFilter = ref("");
const showDetailsModal = ref(false);
const selectedProduct = ref<SavingsProduct | null>(null);

// Mock data for savings products
const savingsProducts = ref<SavingsProduct[]>([
  {
    id: "sp-1",
    productName: "Regular Savings",
    allowDuplicateTransactions: "no",
    interestRate: 4.25,
    interestMethod: "pro-rata",
    interestPostingFrequency: "monthly",
    minimumBalanceForInterest: 100,
    allowOverdraft: "no",
    minimumBalanceForWithdrawal: 50,
    selectedBranches: ["branch-1", "branch-2"],
    accountOpeningFee: 10,
    monthlyMaintenanceFee: 2,
    description: "Standard savings account for regular customers",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "sp-2",
    productName: "Premium Savings",
    allowDuplicateTransactions: "no",
    interestRate: 5.75,
    interestMethod: "last-balance",
    interestPostingFrequency: "quarterly",
    minimumBalanceForInterest: 1000,
    allowOverdraft: "yes",
    minimumBalanceForWithdrawal: 500,
    selectedBranches: ["branch-1", "branch-3"],
    accountOpeningFee: 25,
    monthlyMaintenanceFee: 5,
    maxDailyWithdrawalLimit: 5000,
    description: "Premium savings account with higher interest rates and overdraft facility",
    status: "active",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20"
  },
  {
    id: "sp-3",
    productName: "Basic Savings",
    allowDuplicateTransactions: "yes",
    interestRate: 2.50,
    interestMethod: "pro-rata",
    interestPostingFrequency: "monthly",
    minimumBalanceForInterest: 0,
    allowOverdraft: "no",
    minimumBalanceForWithdrawal: 0,
    selectedBranches: ["branch-1"],
    accountOpeningFee: 0,
    description: "Basic savings account with no minimum balance requirements",
    status: "inactive",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01"
  },
  {
    id: "sp-4",
    productName: "Goal Savings",
    allowDuplicateTransactions: "no",
    interestRate: 6.00,
    interestMethod: "last-balance",
    interestPostingFrequency: "annually",
    minimumBalanceForInterest: 500,
    allowOverdraft: "no",
    minimumBalanceForWithdrawal: 100,
    selectedBranches: ["branch-2", "branch-3", "branch-4"],
    accountOpeningFee: 15,
    monthlyMaintenanceFee: 0,
    maxAccountBalance: 50000,
    description: "Savings account designed for specific financial goals with higher interest rates",
    status: "active",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-10"
  }
]);

// Computed properties
const filteredProducts = computed(() => {
  let products = savingsProducts.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    products = products.filter(product => 
      product.productName.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    products = products.filter(product => product.status === statusFilter.value);
  }

  return products;
});

const activeProductsCount = computed(() => {
  return savingsProducts.value.filter(p => p.status === 'active').length;
});

const averageInterestRate = computed(() => {
  const activeProducts = savingsProducts.value.filter(p => p.status === 'active');
  if (activeProducts.length === 0) return 0;
  const totalRate = activeProducts.reduce((sum, p) => sum + p.interestRate, 0);
  return totalRate / activeProducts.length;
});

// Methods
const createProduct = () => {
  router.push("/savings/products/create");
};

const createSusuProduct = () => {
  router.push("/savings/products/create-susu");
};

const viewProduct = (product: SavingsProduct) => {
  selectedProduct.value = product;
  showDetailsModal.value = true;
};

const editProduct = (product: SavingsProduct) => {
  router.push(`/savings/products/edit/${product.id}`);
};

const toggleProductStatus = (product: SavingsProduct) => {
  const newStatus = product.status === 'active' ? 'inactive' : 'active';
  const action = newStatus === 'active' ? 'activate' : 'deactivate';
  
  if (confirm(`Are you sure you want to ${action} "${product.productName}"?`)) {
    product.status = newStatus;
    product.updatedAt = new Date().toISOString().split('T')[0];
    alert(`Product "${product.productName}" has been ${action}d successfully!`);
  }
};

const deleteProduct = (product: SavingsProduct) => {
  if (confirm(`Are you sure you want to delete "${product.productName}"? This action cannot be undone.`)) {
    const index = savingsProducts.value.findIndex(p => p.id === product.id);
    if (index > -1) {
      savingsProducts.value.splice(index, 1);
      alert(`Product "${product.productName}" has been deleted successfully!`);
    }
  }
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedProduct.value = null;
};

defineOptions({
  name: "SavingsProductList",
});
</script>