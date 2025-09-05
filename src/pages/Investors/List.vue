<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View Investors</h1>
        <p class="text-sm text-gray-600">Manage investor relationships, KYC, and investment portfolios</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportInvestors" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="addInvestor" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Investor
        </button>
      </div>
    </div>

    <!-- Advanced Search -->
    <div class="card">
      <div class="card-header">
        <button 
          @click="showAdvancedSearch = !showAdvancedSearch"
          class="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span class="font-medium">Advanced Search: Click here to {{ showAdvancedSearch ? 'Hide' : 'Show' }}</span>
          <ChevronDownIcon 
            :class="['w-4 h-4 ml-2 transition-transform', showAdvancedSearch ? 'rotate-180' : '']" 
          />
        </button>
      </div>
      <div v-if="showAdvancedSearch" class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Investor Name</label>
            <input v-model="filters.name" type="text" placeholder="Search by name" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Business</label>
            <input v-model="filters.business" type="text" placeholder="Search by business" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Unique ID</label>
            <input v-model="filters.uniqueId" type="text" placeholder="Search by unique ID" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input v-model="filters.mobile" type="text" placeholder="Search by mobile" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="filters.email" type="email" placeholder="Search by email" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
            <select v-model="filters.kycStatus" class="form-input">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Investment Range</label>
            <div class="flex space-x-2">
              <input v-model.number="filters.minInvestment" type="number" step="0.01" class="form-input" placeholder="Min" />
              <input v-model.number="filters.maxInvestment" type="number" step="0.01" class="form-input" placeholder="Max" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
            <div class="flex space-x-2">
              <input v-model="filters.fromDate" type="date" class="form-input" />
              <input v-model="filters.toDate" type="date" class="form-input" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Investment Type</label>
            <select v-model="filters.investmentType" class="form-input">
              <option value="">All Types</option>
              <option value="equity">Equity</option>
              <option value="debt">Debt</option>
              <option value="hybrid">Hybrid</option>
              <option value="preferred">Preferred</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="resetFilters" class="btn btn-secondary">Reset</button>
          <button @click="searchInvestors" class="btn btn-primary">Search</button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-blue-600">{{ filteredInvestors.length }}</div>
          <div class="text-sm text-gray-600">Total Investors</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-green-600">{{ verifiedInvestors }}</div>
          <div class="text-sm text-gray-600">KYC Verified</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-orange-600">${{ totalInvestment.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Total Investment</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-purple-600">${{ averageInvestment.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Avg Investment</div>
        </div>
      </div>
    </div>

    <!-- Investors Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Investors</h3>
        <div class="flex space-x-2">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search investors" 
            class="form-input w-64" 
          />
          <select v-model="entriesPerPage" class="form-select">
            <option value="10">Show 10 entries</option>
            <option value="20">Show 20 entries</option>
            <option value="50">Show 50 entries</option>
            <option value="100">Show 100 entries</option>
          </select>
        </div>
      </div>

      <div class="card-body">
        <div v-if="filteredInvestors.length === 0" class="text-center py-12">
          <UserGroupIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 mb-4 font-medium">No investors found.</p>
          <button @click="addInvestor" class="btn btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Add First Investor
          </button>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-center">View</th>
                <th class="text-left">Full Name</th>
                <th class="text-left">Business</th>
                <th class="text-left">Unique#</th>
                <th class="text-left">Mobile</th>
                <th class="text-left">Email</th>
                <th class="text-center">KYC Status</th>
                <th class="text-right">Investment</th>
                <th class="text-center">Type</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="investor in paginatedInvestors" :key="investor.id" class="hover:bg-gray-50">
                <td class="text-center">
                  <button @click="viewInvestor(investor)" class="btn btn-xs btn-primary">
                    <EyeIcon class="w-3 h-3" />
                  </button>
                </td>
                <td class="font-medium">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span class="text-sm font-medium text-blue-700">
                        {{ getInitials(investor.fullName) }}
                      </span>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ investor.fullName }}</div>
                      <div class="text-sm text-gray-500">{{ investor.title }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="text-sm">
                    <div class="font-medium">{{ investor.business }}</div>
                    <div class="text-gray-500">{{ investor.industry }}</div>
                  </div>
                </td>
                <td class="font-mono text-sm">{{ investor.uniqueId }}</td>
                <td class="text-sm">
                  <a :href="`tel:${investor.mobile}`" class="text-blue-600 hover:text-blue-800">
                    {{ investor.mobile }}
                  </a>
                </td>
                <td class="text-sm">
                  <a :href="`mailto:${investor.email}`" class="text-blue-600 hover:text-blue-800 break-all">
                    {{ investor.email }}
                  </a>
                </td>
                <td class="text-center">
                  <span :class="getKycStatusClass(investor.kycStatus)" class="badge">
                    {{ investor.kycStatus }}
                  </span>
                </td>
                <td class="text-right">
                  <div class="font-medium">${{ investor.totalInvestment.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500">{{ investor.investmentCount }} investments</div>
                </td>
                <td class="text-center">
                  <span :class="getInvestmentTypeClass(investor.investmentType)" class="badge">
                    {{ investor.investmentType }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="flex justify-center space-x-1">
                    <button @click="editInvestor(investor)" class="btn btn-xs btn-outline">
                      <PencilIcon class="w-3 h-3" />
                    </button>
                    <button @click="viewPortfolio(investor)" class="btn btn-xs btn-info">
                      <ChartBarIcon class="w-3 h-3" />
                    </button>
                    <button @click="deleteInvestor(investor)" class="btn btn-xs btn-danger">
                      <TrashIcon class="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredInvestors.length > 0" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredInvestors.length) }} of {{ filteredInvestors.length }} entries
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
              :disabled="endIndex >= filteredInvestors.length"
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
  PlusIcon,
  UserGroupIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon
} from "@heroicons/vue/24/outline";

// Types
interface Investor {
  id: string;
  fullName: string;
  title: string;
  business: string;
  industry: string;
  uniqueId: string;
  mobile: string;
  email: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  totalInvestment: number;
  investmentCount: number;
  investmentType: 'equity' | 'debt' | 'hybrid' | 'preferred';
  registrationDate: Date;
}

// Reactive data
const router = useRouter();
const searchQuery = ref("");
const entriesPerPage = ref(20);
const currentPage = ref(1);
const showAdvancedSearch = ref(false);

// Filters
const filters = ref({
  name: "",
  business: "",
  uniqueId: "",
  mobile: "",
  email: "",
  kycStatus: "",
  minInvestment: null as number | null,
  maxInvestment: null as number | null,
  fromDate: "",
  toDate: "",
  investmentType: ""
});

// Mock data
const investors = ref<Investor[]>([
  {
    id: "1",
    fullName: "John Anderson",
    title: "CEO",
    business: "Anderson Holdings Ltd",
    industry: "Real Estate",
    uniqueId: "INV001234",
    mobile: "+1-555-0123",
    email: "john.anderson@andersonholdings.com",
    kycStatus: "verified",
    totalInvestment: 250000,
    investmentCount: 3,
    investmentType: "equity",
    registrationDate: new Date("2024-01-15")
  },
  {
    id: "2",
    fullName: "Sarah Chen",
    title: "Managing Partner",
    business: "Chen Venture Capital",
    industry: "Venture Capital",
    uniqueId: "INV005678",
    mobile: "+1-555-0234",
    email: "sarah.chen@chenvc.com",
    kycStatus: "verified",
    totalInvestment: 500000,
    investmentCount: 5,
    investmentType: "equity",
    registrationDate: new Date("2024-02-20")
  },
  {
    id: "3",
    fullName: "Michael Rodriguez",
    title: "Investment Director",
    business: "Rodriguez Financial Group",
    industry: "Financial Services",
    uniqueId: "INV009876",
    mobile: "+1-555-0345",
    email: "m.rodriguez@rodriguezfg.com",
    kycStatus: "pending",
    totalInvestment: 150000,
    investmentCount: 2,
    investmentType: "debt",
    registrationDate: new Date("2024-03-10")
  },
  {
    id: "4",
    fullName: "Emily Johnson",
    title: "Portfolio Manager",
    business: "Johnson Asset Management",
    industry: "Asset Management",
    uniqueId: "INV543210",
    mobile: "+1-555-0456",
    email: "emily.johnson@johnsonassets.com",
    kycStatus: "verified",
    totalInvestment: 320000,
    investmentCount: 4,
    investmentType: "hybrid",
    registrationDate: new Date("2024-01-28")
  },
  {
    id: "5",
    fullName: "David Kim",
    title: "Founder",
    business: "Kim Innovation Fund",
    industry: "Technology",
    uniqueId: "INV111222",
    mobile: "+1-555-0567",
    email: "david.kim@kiminnovation.com",
    kycStatus: "expired",
    totalInvestment: 75000,
    investmentCount: 1,
    investmentType: "equity",
    registrationDate: new Date("2023-11-05")
  },
  {
    id: "6",
    fullName: "Lisa Thompson",
    title: "Investment Advisor",
    business: "Thompson Wealth Partners",
    industry: "Wealth Management",
    uniqueId: "INV333444",
    mobile: "+1-555-0678",
    email: "lisa.thompson@thompsonwealth.com",
    kycStatus: "rejected",
    totalInvestment: 0,
    investmentCount: 0,
    investmentType: "preferred",
    registrationDate: new Date("2024-03-25")
  }
]);

// Computed properties
const filteredInvestors = computed(() => {
  let result = investors.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(investor => 
      investor.fullName.toLowerCase().includes(query) ||
      investor.business.toLowerCase().includes(query) ||
      investor.uniqueId.toLowerCase().includes(query) ||
      investor.email.toLowerCase().includes(query) ||
      investor.mobile.includes(query)
    );
  }

  if (filters.value.name) {
    const query = filters.value.name.toLowerCase();
    result = result.filter(investor => investor.fullName.toLowerCase().includes(query));
  }

  if (filters.value.business) {
    const query = filters.value.business.toLowerCase();
    result = result.filter(investor => investor.business.toLowerCase().includes(query));
  }

  if (filters.value.uniqueId) {
    result = result.filter(investor => investor.uniqueId.toLowerCase().includes(filters.value.uniqueId.toLowerCase()));
  }

  if (filters.value.mobile) {
    result = result.filter(investor => investor.mobile.includes(filters.value.mobile));
  }

  if (filters.value.email) {
    const query = filters.value.email.toLowerCase();
    result = result.filter(investor => investor.email.toLowerCase().includes(query));
  }

  if (filters.value.kycStatus) {
    result = result.filter(investor => investor.kycStatus === filters.value.kycStatus);
  }

  if (filters.value.minInvestment !== null) {
    result = result.filter(investor => investor.totalInvestment >= filters.value.minInvestment!);
  }

  if (filters.value.maxInvestment !== null) {
    result = result.filter(investor => investor.totalInvestment <= filters.value.maxInvestment!);
  }

  if (filters.value.fromDate) {
    const fromDate = new Date(filters.value.fromDate);
    result = result.filter(investor => investor.registrationDate >= fromDate);
  }

  if (filters.value.toDate) {
    const toDate = new Date(filters.value.toDate);
    toDate.setHours(23, 59, 59);
    result = result.filter(investor => investor.registrationDate <= toDate);
  }

  if (filters.value.investmentType) {
    result = result.filter(investor => investor.investmentType === filters.value.investmentType);
  }

  return result;
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedInvestors = computed(() => {
  return filteredInvestors.value.slice(startIndex.value, endIndex.value);
});

const verifiedInvestors = computed(() => {
  return filteredInvestors.value.filter(investor => investor.kycStatus === 'verified').length;
});

const totalInvestment = computed(() => {
  return filteredInvestors.value.reduce((sum, investor) => sum + investor.totalInvestment, 0);
});

const averageInvestment = computed(() => {
  const count = filteredInvestors.value.filter(investor => investor.totalInvestment > 0).length;
  return count > 0 ? Math.round(totalInvestment.value / count) : 0;
});

// Methods
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getKycStatusClass = (status: string): string => {
  const classes: { [key: string]: string } = {
    pending: "badge-warning",
    verified: "badge-success",
    rejected: "badge-danger",
    expired: "badge-secondary"
  };
  return classes[status] || "badge-secondary";
};

const getInvestmentTypeClass = (type: string): string => {
  const classes: { [key: string]: string } = {
    equity: "badge-primary",
    debt: "badge-info",
    hybrid: "badge-success",
    preferred: "badge-warning"
  };
  return classes[type] || "badge-secondary";
};

const resetFilters = () => {
  filters.value = {
    name: "",
    business: "",
    uniqueId: "",
    mobile: "",
    email: "",
    kycStatus: "",
    minInvestment: null,
    maxInvestment: null,
    fromDate: "",
    toDate: "",
    investmentType: ""
  };
  currentPage.value = 1;
};

const searchInvestors = () => {
  currentPage.value = 1;
};

const exportInvestors = () => {
  const csvContent = [
    'Full Name,Business,Unique ID,Mobile,Email,KYC Status,Total Investment,Investment Count,Investment Type,Registration Date',
    ...filteredInvestors.value.map(investor => 
      `"${investor.fullName}","${investor.business}","${investor.uniqueId}","${investor.mobile}","${investor.email}","${investor.kycStatus}",${investor.totalInvestment},${investor.investmentCount},"${investor.investmentType}","${investor.registrationDate.toISOString().split('T')[0]}"`
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `investors_export_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const addInvestor = () => {
  router.push("/investors/create");
};

const viewInvestor = (investor: Investor) => {
  router.push(`/investors/${investor.id}`);
};

const editInvestor = (investor: Investor) => {
  alert(`Edit investor: ${investor.fullName}`);
};

const viewPortfolio = (investor: Investor) => {
  alert(`View investment portfolio for ${investor.fullName}`);
};

const deleteInvestor = (investor: Investor) => {
  if (confirm(`Are you sure you want to delete investor "${investor.fullName}"?`)) {
    const index = investors.value.findIndex(i => i.id === investor.id);
    if (index > -1) {
      investors.value.splice(index, 1);
      alert("Investor deleted successfully!");
    }
  }
};

defineOptions({
  name: "InvestorsList",
});
</script>
