<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View Asset Management</h1>
        <p class="text-sm text-gray-600">Track and manage company assets, purchases, and sales</p>
      </div>
      <div class="flex space-x-3">
        <button @click="showHelp" class="btn btn-secondary">
          <QuestionMarkCircleIcon class="w-4 h-4 mr-2" />
          Help
        </button>
        <button @click="exportAssets" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="addAsset" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Asset
        </button>
      </div>
    </div>

    <!-- Filter Asset Management Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Filter Asset Management</h3>
      
      <!-- Asset Categories -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in assetCategories"
            :key="category"
            @click="toggleCategory(category)"
            :class="[
              'px-3 py-2 text-sm rounded-lg border transition-colors',
              selectedCategories.includes(category)
                ? 'bg-purple-100 border-purple-300 text-purple-700'
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Filters Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <!-- From Opening/Purchase Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Opening/Purchase Date:</label>
          <input
            v-model="filters.fromOpeningDate"
            type="date"
            class="form-input"
            placeholder="dd/mm/yyyy"
            @change="filterAssets"
          />
        </div>

        <!-- To Opening/Purchase Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Opening/Purchase Date:</label>
          <input
            v-model="filters.toOpeningDate"
            type="date"
            class="form-input"
            placeholder="dd/mm/yyyy"
            @change="filterAssets"
          />
        </div>

        <!-- From Sold Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Sold Date:</label>
          <input
            v-model="filters.fromSoldDate"
            type="date"
            class="form-input"
            placeholder="dd/mm/yyyy"
            @change="filterAssets"
          />
        </div>

        <!-- To Sold Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Sold Date:</label>
          <input
            v-model="filters.toSoldDate"
            type="date"
            class="form-input"
            placeholder="dd/mm/yyyy"
            @change="filterAssets"
          />
        </div>

        <!-- Bank Accounts (Purchase) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bank Accounts (Purchase):</label>
          <select v-model="filters.purchaseBankAccount" class="form-input" @change="filterAssets">
            <option value="">Select Bank Account</option>
            <option value="cash">Cash</option>
            <option value="crdb-001">CRDB Bank - 001234567</option>
            <option value="nb-002">NMB Bank - 002345678</option>
            <option value="tpb-003">TPB Bank - 003456789</option>
            <option value="equity-004">Equity Bank - 004567890</option>
          </select>
        </div>

        <!-- Bank Accounts (Sold) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bank Accounts (Sold):</label>
          <select v-model="filters.soldBankAccount" class="form-input" @change="filterAssets">
            <option value="">Select Bank Account</option>
            <option value="cash">Cash</option>
            <option value="crdb-001">CRDB Bank - 001234567</option>
            <option value="nb-002">NMB Bank - 002345678</option>
            <option value="tpb-003">TPB Bank - 003456789</option>
            <option value="equity-004">Equity Bank - 004567890</option>
          </select>
        </div>
      </div>

      <!-- Search Button -->
      <div class="flex justify-start">
        <button @click="searchRecords" class="btn btn-primary">
          <MagnifyingGlassIcon class="w-4 h-4 mr-2" />
          Search records
        </button>
      </div>
    </div>

    <!-- Controls Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center space-x-4">
          <button @click="exportCurrentPage" class="btn btn-secondary text-sm">
            Export Current Page
          </button>
          <button @click="exportAllPages" class="btn btn-secondary text-sm">
            Export All Pages
          </button>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Show</span>
          <select v-model="entriesPerPage" class="form-input mx-2">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="text-sm text-gray-500">entries</span>
        </div>
      </div>
    </div>

    <!-- Asset Management Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('type')">
                <div class="flex items-center">
                  Type
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('purchaseValue')">
                <div class="flex items-center">
                  Purchase Or Opening Value
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('openingPrice')">
                <div class="flex items-center">
                  Opening/Purchase Price
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('purchaseDate')">
                <div class="flex items-center">
                  Purchase/Opening Date
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bank Account (Purchase)
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sold
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('soldDate')">
                <div class="flex items-center">
                  Sold Date
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy('soldPrice')">
                <div class="flex items-center">
                  Sold Price
                  <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bank Account (Sold)
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredAssets.length === 0">
              <td colspan="10" class="px-6 py-12 text-center">
                <div class="text-center">
                  <BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    No asset records found for the selected criteria. Adjust your filters or add a new asset.
                  </p>
                  <div class="mt-6">
                    <button @click="addAsset" class="btn btn-primary">
                      <PlusIcon class="w-4 h-4 mr-2" />
                      Add Asset
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-for="asset in paginatedAssets" :key="asset.id" class="hover:bg-gray-50">
              <!-- Action -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button @click="viewAsset(asset.id)" class="text-blue-600 hover:text-blue-900">
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button @click="editAsset(asset.id)" class="text-yellow-600 hover:text-yellow-900">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button v-if="!asset.sold" @click="sellAsset(asset.id)" class="text-green-600 hover:text-green-900">
                    <TagIcon class="w-4 h-4" />
                  </button>
                  <button @click="deleteAsset(asset.id)" class="text-red-600 hover:text-red-900">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
              
              <!-- Type -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getCategoryColor(asset.type)">
                  {{ asset.type }}
                </span>
              </td>
              
              <!-- Purchase Or Opening Value -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                <div class="flex items-center">
                  <CurrencyDollarIcon class="w-4 h-4 mr-1 text-gray-400" />
                  TZS {{ formatCurrency(asset.purchaseValue) }}
                </div>
              </td>
              
              <!-- Opening/Purchase Price -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                <div class="flex items-center">
                  <CurrencyDollarIcon class="w-4 h-4 mr-1 text-gray-400" />
                  TZS {{ formatCurrency(asset.openingPrice) }}
                </div>
              </td>
              
              <!-- Purchase/Opening Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <CalendarDaysIcon class="w-4 h-4 mr-2 text-gray-400" />
                  {{ formatDate(asset.purchaseDate) }}
                </div>
              </td>
              
              <!-- Bank Account (Purchase) -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <BuildingLibraryIcon class="w-4 h-4 mr-1 text-gray-400" />
                  <span class="capitalize">{{ asset.purchaseBankAccount }}</span>
                </div>
              </td>
              
              <!-- Sold -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="asset.sold" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircleIcon class="w-3 h-3 mr-1" />
                  Yes
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <XMarkIcon class="w-3 h-3 mr-1" />
                  No
                </span>
              </td>
              
              <!-- Sold Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div v-if="asset.soldDate" class="flex items-center">
                  <CalendarDaysIcon class="w-4 h-4 mr-2 text-gray-400" />
                  {{ formatDate(asset.soldDate) }}
                </div>
                <span v-else class="text-gray-400">N/A</span>
              </td>
              
              <!-- Sold Price -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                <div v-if="asset.soldPrice" class="flex items-center">
                  <CurrencyDollarIcon class="w-4 h-4 mr-1 text-green-400" />
                  <span class="text-green-600">TZS {{ formatCurrency(asset.soldPrice) }}</span>
                </div>
                <span v-else class="text-gray-400">N/A</span>
              </td>
              
              <!-- Bank Account (Sold) -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div v-if="asset.soldBankAccount" class="flex items-center">
                  <BuildingLibraryIcon class="w-4 h-4 mr-1 text-gray-400" />
                  <span class="capitalize">{{ asset.soldBankAccount }}</span>
                </div>
                <span v-else class="text-gray-400">N/A</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="text-sm text-gray-500">
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalRecords }} entries
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="btn btn-secondary text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              Previous
            </button>
            <div class="flex items-center space-x-1">
              <span class="text-sm text-gray-500">Page</span>
              <span class="text-sm font-medium text-gray-900">{{ currentPage }}</span>
              <span class="text-sm text-gray-500">of</span>
              <span class="text-sm font-medium text-gray-900">{{ totalPages }}</span>
            </div>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="btn btn-secondary text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  QuestionMarkCircleIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  BuildingOfficeIcon,
  EyeIcon,
  PencilIcon,
  TagIcon,
  TrashIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Asset categories
const assetCategories = [
  'Bank Balance',
  'Brand',
  'Building',
  'Cash',
  'Copyright',
  'Equipments',
  'Furniture',
  'Goodwill',
  'Land',
  'Machinery',
  'Patents',
  'Plant',
  'Receivables',
  'Trademark'
]

// Reactive data
const selectedCategories = ref<string[]>([])
const entriesPerPage = ref(20)
const currentPage = ref(1)
const sortField = ref('')
const sortDirection = ref('asc')

// Filters
const filters = ref({
  fromOpeningDate: '',
  toOpeningDate: '',
  fromSoldDate: '',
  toSoldDate: '',
  purchaseBankAccount: '',
  soldBankAccount: ''
})

// Mock asset data (empty for now as shown in UI)
const assets = ref([])

// Computed properties
const filteredAssets = computed(() => {
  let filtered = assets.value

  // Filter by selected categories
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(asset => 
      selectedCategories.value.includes(asset.type)
    )
  }

  // Filter by opening/purchase date range
  if (filters.value.fromOpeningDate) {
    filtered = filtered.filter(asset => asset.purchaseDate >= filters.value.fromOpeningDate)
  }
  if (filters.value.toOpeningDate) {
    filtered = filtered.filter(asset => asset.purchaseDate <= filters.value.toOpeningDate)
  }

  // Filter by sold date range
  if (filters.value.fromSoldDate) {
    filtered = filtered.filter(asset => asset.soldDate && asset.soldDate >= filters.value.fromSoldDate)
  }
  if (filters.value.toSoldDate) {
    filtered = filtered.filter(asset => asset.soldDate && asset.soldDate <= filters.value.toSoldDate)
  }

  // Filter by purchase bank account
  if (filters.value.purchaseBankAccount) {
    filtered = filtered.filter(asset => asset.purchaseBankAccount === filters.value.purchaseBankAccount)
  }

  // Filter by sold bank account
  if (filters.value.soldBankAccount) {
    filtered = filtered.filter(asset => asset.soldBankAccount === filters.value.soldBankAccount)
  }

  // Apply sorting
  if (sortField.value) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection.value === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal)
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
      }

      return 0
    })
  }

  return filtered
})

const totalRecords = computed(() => filteredAssets.value.length)
const totalPages = computed(() => Math.ceil(totalRecords.value / entriesPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * entriesPerPage.value, totalRecords.value))

const paginatedAssets = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value
  const end = start + entriesPerPage.value
  return filteredAssets.value.slice(start, end)
})

// Methods
const toggleCategory = (category: string) => {
  const index = selectedCategories.value.indexOf(category)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(category)
  }
  filterAssets()
}

const filterAssets = () => {
  currentPage.value = 1
}

const searchRecords = () => {
  console.log('Searching assets with filters:', {
    categories: selectedCategories.value,
    ...filters.value
  })
  filterAssets()
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const showHelp = () => {
  alert('Help functionality for Asset Management will be implemented here')
}

const exportAssets = () => {
  console.log('Exporting all assets')
}

const exportCurrentPage = () => {
  console.log('Exporting current page')
}

const exportAllPages = () => {
  console.log('Exporting all pages')
}

const addAsset = () => {
  router.push('/asset-management/create')
}

const viewAsset = (id: string) => {
  router.push(`/asset-management/${id}`)
}

const editAsset = (id: string) => {
  router.push(`/asset-management/${id}/edit`)
}

const sellAsset = (id: string) => {
  if (confirm('Mark this asset as sold?')) {
    console.log('Selling asset:', id)
    // Here you would update the asset's sold status
  }
}

const deleteAsset = (id: string) => {
  if (confirm('Are you sure you want to delete this asset?')) {
    console.log('Deleting asset:', id)
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Utility functions
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US')
}

const getCategoryColor = (category: string): string => {
  const colors = {
    'Bank Balance': 'bg-blue-100 text-blue-800',
    'Brand': 'bg-purple-100 text-purple-800',
    'Building': 'bg-orange-100 text-orange-800',
    'Cash': 'bg-green-100 text-green-800',
    'Copyright': 'bg-indigo-100 text-indigo-800',
    'Equipments': 'bg-gray-100 text-gray-800',
    'Furniture': 'bg-amber-100 text-amber-800',
    'Goodwill': 'bg-pink-100 text-pink-800',
    'Land': 'bg-emerald-100 text-emerald-800',
    'Machinery': 'bg-red-100 text-red-800',
    'Patents': 'bg-violet-100 text-violet-800',
    'Plant': 'bg-teal-100 text-teal-800',
    'Receivables': 'bg-cyan-100 text-cyan-800',
    'Trademark': 'bg-rose-100 text-rose-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

defineOptions({
  name: "AssetManagementList",
});

// Initialize
onMounted(() => {
  // Load initial data
})
</script>
