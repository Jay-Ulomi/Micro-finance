<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button @click="goBack" class="btn btn-secondary">
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Back to Investors
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ investor?.fullName || 'Investor Details' }}</h1>
          <p class="text-sm text-gray-600">Complete investor profile and investment portfolio</p>
        </div>
      </div>
      <div class="flex space-x-3">
        <button @click="exportProfile" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Profile
        </button>
        <button @click="editInvestor" class="btn btn-primary">
          <PencilIcon class="w-4 h-4 mr-2" />
          Edit Investor
        </button>
      </div>
    </div>

    <!-- Investor Overview -->
    <div class="card">
      <div class="card-body">
        <div class="flex items-start space-x-6">
          <!-- Profile Photo -->
          <div class="flex-shrink-0">
            <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-blue-700">
                {{ getInitials(investor?.fullName || '') }}
              </span>
            </div>
          </div>
          
          <!-- Basic Information -->
          <div class="flex-1">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd class="text-sm text-gray-900">{{ investor?.fullName }}</dd>
                  </div>
                  <div v-if="investor?.title">
                    <dt class="text-sm font-medium text-gray-500">Title</dt>
                    <dd class="text-sm text-gray-900">{{ investor.title }}</dd>
                  </div>
                  <div v-if="investor?.business">
                    <dt class="text-sm font-medium text-gray-500">Business</dt>
                    <dd class="text-sm text-gray-900">{{ investor.business }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Unique ID</dt>
                    <dd class="text-sm font-mono text-gray-900">{{ investor?.uniqueId }}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                    <dd class="text-sm text-gray-900">
                      <a :href="`mailto:${investor?.email}`" class="text-blue-600 hover:text-blue-800">
                        {{ investor?.email }}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mobile</dt>
                    <dd class="text-sm text-gray-900">
                      <a :href="`tel:${investor?.mobile}`" class="text-blue-600 hover:text-blue-800">
                        {{ investor?.mobile }}
                      </a>
                    </dd>
                  </div>
                  <div v-if="investor?.address">
                    <dt class="text-sm font-medium text-gray-500">Address</dt>
                    <dd class="text-sm text-gray-900">{{ investor?.address }}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Investment Summary</h3>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Total Investment</dt>
                    <dd class="text-lg font-bold text-green-600">${{ investor?.totalInvestment?.toLocaleString() }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Active Investments</dt>
                    <dd class="text-sm text-gray-900">{{ investor?.investmentCount }} investments</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">KYC Status</dt>
                    <dd>
                      <span :class="getKycStatusClass(investor?.kycStatus || '')" class="badge">
                        {{ investor?.kycStatus }}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Investment Type</dt>
                    <dd>
                      <span :class="getInvestmentTypeClass(investor?.investmentType || '')" class="badge">
                        {{ investor?.investmentType }}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button @click="addInvestment" class="card hover:shadow-md transition-shadow cursor-pointer">
        <div class="card-body text-center p-4">
          <PlusCircleIcon class="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div class="text-sm font-medium text-gray-900">Add Investment</div>
        </div>
      </button>
      <button @click="updateKyc" class="card hover:shadow-md transition-shadow cursor-pointer">
        <div class="card-body text-center p-4">
          <ShieldCheckIcon class="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div class="text-sm font-medium text-gray-900">Update KYC</div>
        </div>
      </button>
      <button @click="sendMessage" class="card hover:shadow-md transition-shadow cursor-pointer">
        <div class="card-body text-center p-4">
          <ChatBubbleLeftRightIcon class="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div class="text-sm font-medium text-gray-900">Send Message</div>
        </div>
      </button>
      <button @click="generateReport" class="card hover:shadow-md transition-shadow cursor-pointer">
        <div class="card-body text-center p-4">
          <ChartBarIcon class="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div class="text-sm font-medium text-gray-900">Generate Report</div>
        </div>
      </button>
    </div>

    <!-- Investment Portfolio -->
    <div class="card">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <h3 class="card-title">Investment Portfolio</h3>
          <div class="flex space-x-2">
            <select v-model="portfolioFilter" class="form-select">
              <option value="all">All Investments</option>
              <option value="active">Active</option>
              <option value="matured">Matured</option>
              <option value="pending">Pending</option>
            </select>
            <button @click="refreshPortfolio" class="btn btn-sm btn-secondary">
              <ArrowPathIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div v-if="filteredInvestments.length === 0" class="text-center py-8">
          <ChartPieIcon class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p class="text-gray-600">No investments found</p>
          <button @click="addInvestment" class="btn btn-primary mt-3">
            <PlusIcon class="w-4 h-4 mr-2" />
            Add First Investment
          </button>
        </div>
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-left">Investment ID</th>
                <th class="text-left">Product</th>
                <th class="text-right">Amount</th>
                <th class="text-center">Date</th>
                <th class="text-center">Maturity</th>
                <th class="text-right">Returns</th>
                <th class="text-center">Status</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="investment in filteredInvestments" :key="investment.id" class="hover:bg-gray-50">
                <td class="font-mono text-sm">{{ investment.id }}</td>
                <td>
                  <div>
                    <div class="font-medium">{{ investment.productName }}</div>
                    <div class="text-xs text-gray-500">{{ investment.productType }}</div>
                  </div>
                </td>
                <td class="text-right font-medium">${{ investment.amount.toLocaleString() }}</td>
                <td class="text-center text-sm">{{ formatDate(investment.investmentDate) }}</td>
                <td class="text-center text-sm">{{ formatDate(investment.maturityDate) }}</td>
                <td class="text-right">
                  <div class="font-medium text-green-600">+${{ investment.returns.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500">{{ investment.returnRate }}%</div>
                </td>
                <td class="text-center">
                  <span :class="getInvestmentStatusClass(investment.status)" class="badge">
                    {{ investment.status }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="flex justify-center space-x-1">
                    <button @click="viewInvestment(investment)" class="btn btn-xs btn-outline">
                      <EyeIcon class="w-3 h-3" />
                    </button>
                    <button @click="editInvestment(investment)" class="btn btn-xs btn-primary">
                      <PencilIcon class="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 border-t-2">
              <tr class="font-semibold">
                <td colspan="2" class="font-bold">Total Portfolio</td>
                <td class="text-right font-bold">${{ totalInvestmentAmount.toLocaleString() }}</td>
                <td></td>
                <td></td>
                <td class="text-right font-bold text-green-700">+${{ totalReturns.toLocaleString() }}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- KYC Documents -->
    <div class="card">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <h3 class="card-title">KYC Documents & Verification</h3>
          <button @click="uploadDocument" class="btn btn-sm btn-primary">
            <DocumentPlusIcon class="w-4 h-4 mr-2" />
            Upload Document
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="document in kycDocuments" :key="document.id" class="border rounded-lg p-4">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-medium text-gray-900">{{ document.name }}</h4>
                <p class="text-sm text-gray-500">{{ document.type }}</p>
              </div>
              <span :class="getDocumentStatusClass(document.status)" class="badge">
                {{ document.status }}
              </span>
            </div>
            <div class="text-xs text-gray-500 mb-3">
              Uploaded: {{ formatDate(document.uploadDate) }}
            </div>
            <div class="flex space-x-2">
              <button @click="viewDocument(document)" class="btn btn-xs btn-outline flex-1">
                <EyeIcon class="w-3 h-3 mr-1" />
                View
              </button>
              <button @click="downloadDocument(document)" class="btn btn-xs btn-secondary flex-1">
                <ArrowDownTrayIcon class="w-3 h-3 mr-1" />
                Download
              </button>
            </div>
          </div>
          
          <!-- Add Document Placeholder -->
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-gray-400 cursor-pointer" @click="uploadDocument">
            <DocumentPlusIcon class="w-8 h-8 text-gray-400 mb-2" />
            <p class="text-sm text-gray-600 font-medium">Add New Document</p>
            <p class="text-xs text-gray-500">Click to upload</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Recent Activity</h3>
      </div>
      <div class="card-body">
        <div class="flow-root">
          <ul class="-mb-8">
            <li v-for="(activity, index) in recentActivities" :key="activity.id" class="relative pb-8">
              <div v-if="index !== recentActivities.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
              <div class="relative flex space-x-3">
                <div>
                  <span :class="getActivityIconClass(activity.type)" class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                    <component :is="getActivityIcon(activity.type)" class="w-4 h-4" />
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div>
                    <div class="text-sm">
                      <span class="font-medium text-gray-900">{{ activity.description }}</span>
                    </div>
                    <p class="mt-0.5 text-sm text-gray-500">
                      {{ formatDateTime(activity.timestamp) }}
                    </p>
                  </div>
                  <div v-if="activity.details" class="mt-2 text-sm text-gray-700">
                    {{ activity.details }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { 
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  PencilIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ChartPieIcon,
  PlusIcon,
  EyeIcon,
  ArrowPathIcon,
  DocumentPlusIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  DocumentCheckIcon,
  UserIcon
} from "@heroicons/vue/24/outline";

// Types
interface Investment {
  id: string;
  productName: string;
  productType: string;
  amount: number;
  investmentDate: Date;
  maturityDate: Date;
  returns: number;
  returnRate: number;
  status: 'active' | 'matured' | 'pending';
}

interface KycDocument {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: Date;
}

interface Activity {
  id: string;
  type: 'investment' | 'kyc' | 'profile' | 'message';
  description: string;
  details?: string;
  timestamp: Date;
}

interface Investor {
  id: string;
  fullName: string;
  title?: string;
  business: string;
  industry: string;
  uniqueId: string;
  mobile: string;
  email: string;
  address?: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  totalInvestment: number;
  investmentCount: number;
  investmentType: 'equity' | 'debt' | 'hybrid' | 'preferred';
  registrationDate: Date;
}

// Reactive data
const router = useRouter();
const route = useRoute();
const portfolioFilter = ref('all');

// Mock investor data (in real app, would fetch based on route params)
const investor = ref<Investor>({
  id: "1",
  fullName: "John Anderson",
  title: "CEO",
  business: "Anderson Holdings Ltd",
  industry: "Real Estate",
  uniqueId: "INV001234",
  mobile: "+1-555-0123",
  email: "john.anderson@andersonholdings.com",
  address: "123 Business District, Dar es Salaam, Tanzania",
  kycStatus: "verified",
  totalInvestment: 250000,
  investmentCount: 3,
  investmentType: "equity",
  registrationDate: new Date("2024-01-15")
});

const investments = ref<Investment[]>([
  {
    id: "INV2024001",
    productName: "Growth Fund Alpha",
    productType: "Equity Fund",
    amount: 100000,
    investmentDate: new Date("2024-01-15"),
    maturityDate: new Date("2026-01-15"),
    returns: 12500,
    returnRate: 12.5,
    status: "active"
  },
  {
    id: "INV2024002",
    productName: "Fixed Income Bond",
    productType: "Government Bond",
    amount: 75000,
    investmentDate: new Date("2024-02-20"),
    maturityDate: new Date("2025-02-20"),
    returns: 6750,
    returnRate: 9.0,
    status: "active"
  },
  {
    id: "INV2024003",
    productName: "Tech Startup Fund",
    productType: "Venture Capital",
    amount: 75000,
    investmentDate: new Date("2024-03-10"),
    maturityDate: new Date("2027-03-10"),
    returns: 0,
    returnRate: 15.0,
    status: "pending"
  }
]);

const kycDocuments = ref<KycDocument[]>([
  {
    id: "1",
    name: "National ID",
    type: "Identity Document",
    status: "approved",
    uploadDate: new Date("2024-01-10")
  },
  {
    id: "2",
    name: "Proof of Address",
    type: "Utility Bill",
    status: "approved",
    uploadDate: new Date("2024-01-12")
  },
  {
    id: "3",
    name: "Bank Statement",
    type: "Financial Document",
    status: "pending",
    uploadDate: new Date("2024-03-01")
  }
]);

const recentActivities = ref<Activity[]>([
  {
    id: "1",
    type: "investment",
    description: "New investment added",
    details: "Tech Startup Fund - $75,000",
    timestamp: new Date("2024-03-10 14:30")
  },
  {
    id: "2",
    type: "kyc",
    description: "KYC document uploaded",
    details: "Bank Statement submitted for review",
    timestamp: new Date("2024-03-01 09:15")
  },
  {
    id: "3",
    type: "profile",
    description: "Profile updated",
    details: "Contact information modified",
    timestamp: new Date("2024-02-25 16:20")
  },
  {
    id: "4",
    type: "investment",
    description: "Investment matured",
    details: "Fixed Income Bond - Returns: $6,750",
    timestamp: new Date("2024-02-20 10:00")
  }
]);

// Computed properties
const filteredInvestments = computed(() => {
  if (portfolioFilter.value === 'all') return investments.value;
  return investments.value.filter(inv => inv.status === portfolioFilter.value);
});

const totalInvestmentAmount = computed(() => {
  return filteredInvestments.value.reduce((sum, inv) => sum + inv.amount, 0);
});

const totalReturns = computed(() => {
  return filteredInvestments.value.reduce((sum, inv) => sum + inv.returns, 0);
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

const getInvestmentStatusClass = (status: string): string => {
  const classes: { [key: string]: string } = {
    active: "badge-success",
    matured: "badge-primary",
    pending: "badge-warning"
  };
  return classes[status] || "badge-secondary";
};

const getDocumentStatusClass = (status: string): string => {
  const classes: { [key: string]: string } = {
    pending: "badge-warning",
    approved: "badge-success", 
    rejected: "badge-danger"
  };
  return classes[status] || "badge-secondary";
};

const getActivityIconClass = (type: string): string => {
  const classes: { [key: string]: string } = {
    investment: "bg-green-500 text-white",
    kyc: "bg-blue-500 text-white",
    profile: "bg-purple-500 text-white",
    message: "bg-yellow-500 text-white"
  };
  return classes[type] || "bg-gray-500 text-white";
};

const getActivityIcon = (type: string) => {
  const icons: { [key: string]: any } = {
    investment: BanknotesIcon,
    kyc: DocumentCheckIcon,
    profile: UserIcon,
    message: ChatBubbleLeftRightIcon
  };
  return icons[type] || UserIcon;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const goBack = () => {
  router.push("/investors");
};

const exportProfile = () => {
  alert("Export investor profile to PDF");
};

const editInvestor = () => {
  router.push(`/investors/${route.params.id}/edit`);
};

const addInvestment = () => {
  alert("Add new investment for this investor");
};

const updateKyc = () => {
  alert("Update KYC status and documents");
};

const sendMessage = () => {
  alert("Send message to investor");
};

const generateReport = () => {
  alert("Generate investment report");
};

const refreshPortfolio = () => {
  alert("Portfolio data refreshed");
};

const viewInvestment = (investment: Investment) => {
  alert(`View investment details: ${investment.productName}`);
};

const editInvestment = (investment: Investment) => {
  alert(`Edit investment: ${investment.productName}`);
};

const uploadDocument = () => {
  alert("Upload new KYC document");
};

const viewDocument = (document: KycDocument) => {
  alert(`View document: ${document.name}`);
};

const downloadDocument = (document: KycDocument) => {
  alert(`Download document: ${document.name}`);
};

onMounted(() => {
  // In real app, fetch investor data based on route.params.id
  console.log("Loading investor details for ID:", route.params.id);
});

defineOptions({
  name: "InvestorDetails",
});
</script>