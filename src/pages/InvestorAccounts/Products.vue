<template>
  <div class="space-y-6">
    <!-- Page header with Back button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button @click="goBack" class="btn btn-outline btn-sm">
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Back to Admin
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Investor Account Products</h1>
          <p class="text-sm text-gray-600">Manage investment account products and their configurations</p>
        </div>
      </div>
      <div class="flex space-x-3">
        <button @click="exportProducts" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="createProduct" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Create Product
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="card">
      <div class="card-body">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Search:</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products by name, branch, or interest rate..."
                class="form-input pl-10"
              />
              <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Branch:</label>
            <select v-model="branchFilter" class="form-input">
              <option value="">All Branches</option>
              <option value="branch1">Branch #1</option>
              <option value="branch2">Branch #2</option>
              <option value="branch3">Branch #3</option>
              <option value="headquarters">Headquarters</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Statistics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-blue-600">{{ totalProducts }}</div>
          <div class="text-sm text-gray-600">Total Products</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-green-600">{{ activeProducts }}</div>
          <div class="text-sm text-gray-600">Active Products</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-orange-600">{{ averageInterestRate.toFixed(2) }}%</div>
          <div class="text-sm text-gray-600">Avg Interest Rate</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-purple-600">{{ branchesCount }}</div>
          <div class="text-sm text-gray-600">Branches</div>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <CubeIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 mb-4 font-medium">No investor account products found.</p>
          <button @click="createProduct" class="btn btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Create First Product
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Investor Account Product
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Branch Access
                </th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Interest Rate Per Annum
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Interest Posting Frequency
                </th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Minimum Balance for Interest Rate({{ currency }})
                </th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Minimum Balance for Withdrawals({{ currency }})
                </th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <BanknotesIcon class="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.productName }}</div>
                      <div class="text-sm text-gray-500">Code: {{ product.productCode }}</div>
                      <span v-if="product.isActive" class="badge badge-sm badge-success">Active</span>
                      <span v-else class="badge badge-sm badge-danger">Inactive</span>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900">{{ product.branchName }}</div>
                    <div class="text-gray-500">{{ product.branchCode }}</div>
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <div class="text-lg font-bold" :class="getInterestRateClass(product.interestRate)">
                    {{ product.interestRate.toFixed(2) }}%
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ product.compoundingType }}
                  </div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-sm">
                    <div class="font-medium">Every {{ product.postingFrequency }} {{ product.postingPeriod }}</div>
                    <div class="text-gray-500 text-xs">
                      Next: {{ formatDate(product.nextPostingDate) }}
                    </div>
                  </div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="text-sm font-medium">
                    {{ product.minBalanceForInterest === 0 ? '0' : formatCurrency(product.minBalanceForInterest) }}
                  </div>
                  <div v-if="product.hasMinimumBalance" class="text-xs text-orange-600">
                    Required
                  </div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="text-sm font-medium">
                    {{ product.minBalanceForWithdrawal === null ? 'N/A' : formatCurrency(product.minBalanceForWithdrawal) }}
                  </div>
                  <div v-if="product.withdrawalRestriction" class="text-xs text-red-600">
                    Restricted
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <div class="flex justify-center space-x-1">
                    <button
                      @click="viewProduct(product)"
                      class="btn btn-xs btn-outline"
                      title="View Details"
                    >
                      <EyeIcon class="w-3 h-3" />
                    </button>
                    <button
                      @click="editProduct(product)"
                      class="btn btn-xs btn-primary"
                      title="Edit"
                    >
                      <PencilIcon class="w-3 h-3" />
                    </button>
                    <button
                      @click="duplicateProduct(product)"
                      class="btn btn-xs btn-info"
                      title="Duplicate"
                    >
                      <DocumentDuplicateIcon class="w-3 h-3" />
                    </button>
                    <button
                      @click="toggleProductStatus(product)"
                      :class="product.isActive ? 'btn btn-xs btn-warning' : 'btn btn-xs btn-success'"
                      :title="product.isActive ? 'Deactivate' : 'Activate'"
                    >
                      <component :is="product.isActive ? PauseIcon : PlayIcon" class="w-3 h-3" />
                    </button>
                    <button
                      @click="deleteProduct(product)"
                      class="btn btn-xs btn-danger"
                      title="Delete"
                    >
                      <TrashIcon class="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredProducts.length > 0" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredProducts.length) }} of
            {{ filteredProducts.length }} entries
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="btn btn-sm btn-secondary"
            >
              Previous
            </button>
            <button
              @click="currentPage++"
              :disabled="endIndex >= filteredProducts.length"
              class="btn btn-sm btn-secondary"
            >
              Next
            </button>
          </div>
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
  PlusIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  BanknotesIcon,
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  PauseIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";

// Types
interface InvestorAccountProduct {
  id: string;
  productName: string;
  productCode: string;
  branchName: string;
  branchCode: string;
  interestRate: number;
  compoundingType: string;
  postingFrequency: number;
  postingPeriod: string;
  nextPostingDate: Date;
  minBalanceForInterest: number;
  minBalanceForWithdrawal: number | null;
  hasMinimumBalance: boolean;
  withdrawalRestriction: boolean;
  isActive: boolean;
}

// Reactive data
const router = useRouter();
const searchQuery = ref("");
const branchFilter = ref("");
const currentPage = ref(1);
const entriesPerPage = ref(10);
const currency = ref("TZS");

// Mock data
const products = ref<InvestorAccountProduct[]>([
  {
    id: "1",
    productName: "In Product",
    productCode: "INP001",
    branchName: "Branch #1",
    branchCode: "BR001",
    interestRate: 2.0,
    compoundingType: "Simple",
    postingFrequency: 1,
    postingPeriod: "month",
    nextPostingDate: new Date("2024-10-01"),
    minBalanceForInterest: 0,
    minBalanceForWithdrawal: null,
    hasMinimumBalance: false,
    withdrawalRestriction: false,
    isActive: true,
  },
  {
    id: "2",
    productName: "Premium Investment",
    productCode: "PRM001",
    branchName: "Branch #2",
    branchCode: "BR002",
    interestRate: 3.5,
    compoundingType: "Compound",
    postingFrequency: 3,
    postingPeriod: "months",
    nextPostingDate: new Date("2024-12-01"),
    minBalanceForInterest: 100000,
    minBalanceForWithdrawal: 50000,
    hasMinimumBalance: true,
    withdrawalRestriction: true,
    isActive: true,
  },
  {
    id: "3",
    productName: "Fixed Deposit Plus",
    productCode: "FDP001",
    branchName: "Branch #3",
    branchCode: "BR003",
    interestRate: 4.5,
    compoundingType: "Compound",
    postingFrequency: 6,
    postingPeriod: "months",
    nextPostingDate: new Date("2025-01-01"),
    minBalanceForInterest: 500000,
    minBalanceForWithdrawal: null,
    hasMinimumBalance: true,
    withdrawalRestriction: true,
    isActive: true,
  },
  {
    id: "4",
    productName: "Standard Savings",
    productCode: "STD001",
    branchName: "Headquarters",
    branchCode: "HQ001",
    interestRate: 1.5,
    compoundingType: "Simple",
    postingFrequency: 1,
    postingPeriod: "month",
    nextPostingDate: new Date("2024-10-01"),
    minBalanceForInterest: 10000,
    minBalanceForWithdrawal: 5000,
    hasMinimumBalance: true,
    withdrawalRestriction: false,
    isActive: true,
  },
  {
    id: "5",
    productName: "High Yield Investment",
    productCode: "HYI001",
    branchName: "Branch #1",
    branchCode: "BR001",
    interestRate: 5.0,
    compoundingType: "Compound",
    postingFrequency: 12,
    postingPeriod: "months",
    nextPostingDate: new Date("2025-09-01"),
    minBalanceForInterest: 1000000,
    minBalanceForWithdrawal: 100000,
    hasMinimumBalance: true,
    withdrawalRestriction: true,
    isActive: true,
  },
  {
    id: "6",
    productName: "Flexible Saver",
    productCode: "FLX001",
    branchName: "Branch #2",
    branchCode: "BR002",
    interestRate: 1.0,
    compoundingType: "Simple",
    postingFrequency: 1,
    postingPeriod: "month",
    nextPostingDate: new Date("2024-10-01"),
    minBalanceForInterest: 0,
    minBalanceForWithdrawal: 0,
    hasMinimumBalance: false,
    withdrawalRestriction: false,
    isActive: false,
  },
]);

// Computed properties
const filteredProducts = computed(() => {
  let result = products.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (product) =>
        product.productName.toLowerCase().includes(query) ||
        product.productCode.toLowerCase().includes(query) ||
        product.branchName.toLowerCase().includes(query) ||
        product.interestRate.toString().includes(query),
    );
  }

  if (branchFilter.value) {
    result = result.filter((product) => {
      if (branchFilter.value === "branch1") return product.branchCode === "BR001";
      if (branchFilter.value === "branch2") return product.branchCode === "BR002";
      if (branchFilter.value === "branch3") return product.branchCode === "BR003";
      if (branchFilter.value === "headquarters") return product.branchCode === "HQ001";
      return true;
    });
  }

  return result;
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(startIndex.value, endIndex.value);
});

const totalProducts = computed(() => products.value.length);

const activeProducts = computed(() => {
  return products.value.filter((product) => product.isActive).length;
});

const averageInterestRate = computed(() => {
  if (products.value.length === 0) return 0;
  const sum = products.value.reduce((acc, product) => acc + product.interestRate, 0);
  return sum / products.value.length;
});

const branchesCount = computed(() => {
  const uniqueBranches = new Set(products.value.map((product) => product.branchCode));
  return uniqueBranches.size;
});

// Methods
const goBack = () => {
  router.back();
};

const getInterestRateClass = (rate: number): string => {
  if (rate >= 4) return "text-green-600";
  if (rate >= 2) return "text-blue-600";
  return "text-gray-600";
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString();
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const exportProducts = () => {
  const csvContent = [
    "Product Name,Product Code,Branch,Interest Rate,Compounding Type,Posting Frequency,Min Balance for Interest,Min Balance for Withdrawal,Status",
    ...filteredProducts.value.map(
      (product) =>
        `"${product.productName}","${product.productCode}","${product.branchName}",${product.interestRate},"${product.compoundingType}","Every ${product.postingFrequency} ${product.postingPeriod}",${product.minBalanceForInterest},${product.minBalanceForWithdrawal || "N/A"},"${product.isActive ? "Active" : "Inactive"}"`,
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `investor_products_export_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const createProduct = () => {
  router.push("/investor-accounts/create-product");
};

const viewProduct = (product: InvestorAccountProduct) => {
  alert(`View details for product: ${product.productName}`);
};

const editProduct = (product: InvestorAccountProduct) => {
  router.push(`/investor-accounts/products/${product.id}/edit`);
};

const duplicateProduct = (product: InvestorAccountProduct) => {
  if (confirm(`Duplicate product "${product.productName}"?`)) {
    const newProduct: InvestorAccountProduct = {
      ...product,
      id: Date.now().toString(),
      productName: `${product.productName} (Copy)`,
      productCode: `${product.productCode}_COPY`,
    };
    products.value.push(newProduct);
    alert("Product duplicated successfully!");
  }
};

const toggleProductStatus = (product: InvestorAccountProduct) => {
  const action = product.isActive ? "deactivate" : "activate";
  if (confirm(`Are you sure you want to ${action} "${product.productName}"?`)) {
    product.isActive = !product.isActive;
    alert(`Product ${action}d successfully!`);
  }
};

const deleteProduct = (product: InvestorAccountProduct) => {
  if (confirm(`Are you sure you want to delete "${product.productName}"? This action cannot be undone.`)) {
    const index = products.value.findIndex((p) => p.id === product.id);
    if (index > -1) {
      products.value.splice(index, 1);
      alert("Product deleted successfully!");
    }
  }
};

defineOptions({
  name: "InvestorAccountProducts",
});
</script>