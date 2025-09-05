<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Approve Loan Investments</h1>
        <p class="text-sm text-gray-600">Review and approve pending loan investment applications</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportApplications" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="bulkApprove" :disabled="selectedApplications.length === 0" class="btn btn-success">
          <CheckCircleIcon class="w-4 h-4 mr-2" />
          Bulk Approve ({{ selectedApplications.length }})
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
          <span class="font-medium"
            >Advanced Search: Click here to {{ showAdvancedSearch ? "Hide" : "Show" }}</span
          >
          <ChevronDownIcon
            :class="['w-4 h-4 ml-2 transition-transform', showAdvancedSearch ? 'rotate-180' : '']"
          />
        </button>
      </div>
      <div v-if="showAdvancedSearch" class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Investor Name</label>
            <input
              v-model="filters.name"
              type="text"
              placeholder="Search by name"
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Business</label>
            <input
              v-model="filters.business"
              type="text"
              placeholder="Search by business"
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Investor Unique#</label>
            <input
              v-model="filters.investorNumber"
              type="text"
              placeholder="Search by investor#"
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loan Number</label>
            <input
              v-model="filters.loanNumber"
              type="text"
              placeholder="Search by loan#"
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loan Status</label>
            <select v-model="filters.loanStatus" class="form-input">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="under-review">Under Review</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Investment Range</label>
            <div class="flex space-x-2">
              <input
                v-model.number="filters.minAmount"
                type="number"
                step="0.01"
                class="form-input"
                placeholder="Min"
              />
              <input
                v-model.number="filters.maxAmount"
                type="number"
                step="0.01"
                class="form-input"
                placeholder="Max"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
            <div class="flex space-x-2">
              <input v-model="filters.fromDate" type="date" class="form-input" />
              <input v-model="filters.toDate" type="date" class="form-input" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="filters.email"
              type="email"
              placeholder="Search by email"
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
            <input
              v-model="filters.mobile"
              type="text"
              placeholder="Search by mobile"
              class="form-input"
            />
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="resetFilters" class="btn btn-secondary">Reset</button>
          <button @click="searchApplications" class="btn btn-primary">Search</button>
        </div>
      </div>
    </div>

    <!-- Application Statistics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-orange-600">{{ pendingCount }}</div>
          <div class="text-sm text-gray-600">Pending Approval</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-blue-600">{{ underReviewCount }}</div>
          <div class="text-sm text-gray-600">Under Review</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-green-600">{{ approvedCount }}</div>
          <div class="text-sm text-gray-600">Approved Today</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-purple-600">${{ totalPendingAmount.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Total Pending</div>
        </div>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Investment Applications</h3>
        <div class="flex items-center space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="form-input w-64"
          />
          <label class="flex items-center text-sm">
            Show
            <select v-model="entriesPerPage" class="form-input mx-2">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            entries
          </label>
        </div>
      </div>

      <div class="card-body">
        <div v-if="filteredApplications.length === 0" class="text-center py-12">
          <ClipboardDocumentCheckIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 mb-4 font-medium">No investment applications found.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    @change="toggleSelectAll"
                    :checked="isAllSelected"
                    class="form-checkbox"
                  />
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Business</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Investor Unique#</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Loan#</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Investment Amount</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Comments</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Application Date</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Mobile</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Loan Status</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="application in paginatedApplications" :key="application.id" class="hover:bg-gray-50">
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <input
                    type="checkbox"
                    :value="application.id"
                    v-model="selectedApplications"
                    class="form-checkbox"
                    :disabled="application.loanStatus !== 'pending'"
                  />
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    >
                      <span class="text-sm font-medium text-blue-700">
                        {{ getInitials(application.name) }}
                      </span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-medium text-gray-900 truncate">{{ application.name }}</div>
                      <div class="text-sm text-gray-500">ID: {{ application.investorId }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-sm">
                    <div class="font-medium">{{ application.business }}</div>
                    <div class="text-gray-500">{{ application.industry }}</div>
                  </div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap font-mono text-sm">{{ application.investorNumber }}</td>
                <td class="px-3 py-4 whitespace-nowrap font-mono text-sm">{{ application.loanNumber }}</td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="font-bold text-lg">
                    ${{ application.investmentAmount.toLocaleString() }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ application.interestRate }}% p.a.
                  </div>
                </td>
                <td class="px-3 py-4 text-sm">
                  <div class="max-w-xs">
                    <p class="truncate" :title="application.comments">{{ application.comments }}</p>
                    <button
                      v-if="application.documents"
                      @click="viewDocuments(application)"
                      class="text-blue-600 hover:text-blue-800 text-xs mt-1"
                    >
                      <PaperClipIcon class="w-3 h-3 inline mr-1" />
                      {{ application.documents }} docs
                    </button>
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap text-sm">
                  <div class="font-medium">{{ formatDate(application.applicationDate) }}</div>
                  <div class="text-gray-500 text-xs">{{ formatTime(application.applicationDate) }}</div>
                </td>
                <td class="px-3 py-4 text-sm">
                  <a :href="`mailto:${application.email}`" class="text-blue-600 hover:text-blue-800">
                    {{ application.email }}
                  </a>
                </td>
                <td class="px-3 py-4 text-sm">
                  <a :href="`tel:${application.mobile}`" class="text-gray-900 hover:text-blue-600">
                    {{ application.mobile }}
                  </a>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <span :class="getLoanStatusClass(application.loanStatus)" class="badge">
                    {{ application.loanStatus }}
                  </span>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <div class="flex justify-center space-x-1">
                    <button
                      @click="viewDetails(application)"
                      class="btn btn-xs btn-outline"
                      title="View Details"
                    >
                      <EyeIcon class="w-3 h-3" />
                    </button>
                    <button
                      v-if="application.loanStatus === 'pending' || application.loanStatus === 'under-review'"
                      @click="approveApplication(application)"
                      class="btn btn-xs btn-success"
                      title="Approve"
                    >
                      <CheckIcon class="w-3 h-3" />
                    </button>
                    <button
                      v-if="application.loanStatus === 'pending' || application.loanStatus === 'under-review'"
                      @click="rejectApplication(application)"
                      class="btn btn-xs btn-danger"
                      title="Reject"
                    >
                      <XMarkIcon class="w-3 h-3" />
                    </button>
                    <button
                      v-if="application.loanStatus === 'pending'"
                      @click="markUnderReview(application)"
                      class="btn btn-xs btn-warning"
                      title="Mark Under Review"
                    >
                      <ClockIcon class="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredApplications.length > 0" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredApplications.length) }} of
            {{ filteredApplications.length }} entries
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
              :disabled="endIndex >= filteredApplications.length"
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
  DocumentArrowDownIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  PaperClipIcon,
} from "@heroicons/vue/24/outline";

// Types
interface LoanInvestmentApplication {
  id: string;
  investorId: string;
  name: string;
  business: string;
  industry: string;
  investorNumber: string;
  loanNumber: string;
  investmentAmount: number;
  interestRate: number;
  comments: string;
  applicationDate: Date;
  email: string;
  mobile: string;
  loanStatus: "pending" | "approved" | "rejected" | "under-review";
  documents?: number;
}

// Reactive data
const router = useRouter();
const searchQuery = ref("");
const entriesPerPage = ref(20);
const currentPage = ref(1);
const showAdvancedSearch = ref(false);
const selectedApplications = ref<string[]>([]);

// Filters
const filters = ref({
  name: "",
  business: "",
  investorNumber: "",
  loanNumber: "",
  loanStatus: "",
  minAmount: null as number | null,
  maxAmount: null as number | null,
  fromDate: "",
  toDate: "",
  email: "",
  mobile: "",
});

// Mock data
const loanApplications = ref<LoanInvestmentApplication[]>([
  {
    id: "1",
    investorId: "INV001",
    name: "John Anderson",
    business: "Anderson Holdings Ltd",
    industry: "Real Estate",
    investorNumber: "IN2024001",
    loanNumber: "LN2024101",
    investmentAmount: 150000,
    interestRate: 12.5,
    comments: "Looking to diversify portfolio with secured real estate loans",
    applicationDate: new Date("2024-09-03T10:30:00"),
    email: "john.anderson@andersonholdings.com",
    mobile: "+1-555-0123",
    loanStatus: "pending",
    documents: 3,
  },
  {
    id: "2",
    investorId: "INV002",
    name: "Sarah Chen",
    business: "Chen Venture Capital",
    industry: "Venture Capital",
    investorNumber: "IN2024002",
    loanNumber: "LN2024102",
    investmentAmount: 300000,
    interestRate: 14,
    comments: "Interested in short-term high-yield loans",
    applicationDate: new Date("2024-09-03T09:15:00"),
    email: "sarah.chen@chenvc.com",
    mobile: "+1-555-0124",
    loanStatus: "under-review",
    documents: 5,
  },
  {
    id: "3",
    investorId: "INV003",
    name: "Michael Rodriguez",
    business: "Rodriguez Financial Group",
    industry: "Financial Services",
    investorNumber: "IN2024003",
    loanNumber: "LN2024103",
    investmentAmount: 200000,
    interestRate: 11.5,
    comments: "Seeking stable returns with monthly interest payments",
    applicationDate: new Date("2024-09-02T14:20:00"),
    email: "m.rodriguez@rodriguezfg.com",
    mobile: "+1-555-0125",
    loanStatus: "pending",
    documents: 4,
  },
  {
    id: "4",
    investorId: "INV004",
    name: "Emily Johnson",
    business: "Johnson Asset Management",
    industry: "Asset Management",
    investorNumber: "IN2024004",
    loanNumber: "LN2024104",
    investmentAmount: 75000,
    interestRate: 13,
    comments: "First-time investor in loan portfolio",
    applicationDate: new Date("2024-09-02T11:00:00"),
    email: "emily.johnson@johnsonassets.com",
    mobile: "+1-555-0126",
    loanStatus: "approved",
    documents: 2,
  },
  {
    id: "5",
    investorId: "INV005",
    name: "David Kim",
    business: "Kim Innovation Fund",
    industry: "Technology",
    investorNumber: "IN2024005",
    loanNumber: "LN2024105",
    investmentAmount: 500000,
    interestRate: 15,
    comments: "Large investment for technology sector loans",
    applicationDate: new Date("2024-09-01T16:45:00"),
    email: "david.kim@kiminnovation.com",
    mobile: "+1-555-0127",
    loanStatus: "pending",
    documents: 6,
  },
  {
    id: "6",
    investorId: "INV006",
    name: "Lisa Thompson",
    business: "Thompson Wealth Partners",
    industry: "Wealth Management",
    investorNumber: "IN2024006",
    loanNumber: "LN2024106",
    investmentAmount: 100000,
    interestRate: 12,
    comments: "Conservative investment strategy preferred",
    applicationDate: new Date("2024-09-01T08:30:00"),
    email: "lisa.thompson@thompsonwealth.com",
    mobile: "+1-555-0128",
    loanStatus: "rejected",
    documents: 1,
  },
  {
    id: "7",
    investorId: "INV007",
    name: "Robert Brown",
    business: "Brown Capital Management",
    industry: "Investment Management",
    investorNumber: "IN2024007",
    loanNumber: "LN2024107",
    investmentAmount: 250000,
    interestRate: 13.5,
    comments: "Expanding loan investment portfolio",
    applicationDate: new Date("2024-08-31T13:00:00"),
    email: "robert.brown@browncap.com",
    mobile: "+1-555-0129",
    loanStatus: "pending",
    documents: 4,
  },
  {
    id: "8",
    investorId: "INV008",
    name: "Jennifer Wilson",
    business: "Wilson Investment Group",
    industry: "Private Equity",
    investorNumber: "IN2024008",
    loanNumber: "LN2024108",
    investmentAmount: 180000,
    interestRate: 12.75,
    comments: "Focus on SME loans with good track record",
    applicationDate: new Date("2024-08-30T10:15:00"),
    email: "jennifer.wilson@wilsoninvest.com",
    mobile: "+1-555-0130",
    loanStatus: "under-review",
    documents: 3,
  },
]);

// Computed properties
const filteredApplications = computed(() => {
  let result = loanApplications.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (application) =>
        application.name.toLowerCase().includes(query) ||
        application.business.toLowerCase().includes(query) ||
        application.investorNumber.toLowerCase().includes(query) ||
        application.loanNumber.toLowerCase().includes(query) ||
        application.email.toLowerCase().includes(query) ||
        application.mobile.includes(query),
    );
  }

  // Apply advanced filters
  if (filters.value.name) {
    const query = filters.value.name.toLowerCase();
    result = result.filter((application) => application.name.toLowerCase().includes(query));
  }

  if (filters.value.business) {
    const query = filters.value.business.toLowerCase();
    result = result.filter((application) => application.business.toLowerCase().includes(query));
  }

  if (filters.value.investorNumber) {
    result = result.filter((application) =>
      application.investorNumber.toLowerCase().includes(filters.value.investorNumber.toLowerCase()),
    );
  }

  if (filters.value.loanNumber) {
    result = result.filter((application) =>
      application.loanNumber.toLowerCase().includes(filters.value.loanNumber.toLowerCase()),
    );
  }

  if (filters.value.loanStatus) {
    result = result.filter((application) => application.loanStatus === filters.value.loanStatus);
  }

  if (filters.value.minAmount !== null) {
    result = result.filter(
      (application) => application.investmentAmount >= filters.value.minAmount!,
    );
  }

  if (filters.value.maxAmount !== null) {
    result = result.filter(
      (application) => application.investmentAmount <= filters.value.maxAmount!,
    );
  }

  if (filters.value.fromDate) {
    const fromDate = new Date(filters.value.fromDate);
    result = result.filter((application) => application.applicationDate >= fromDate);
  }

  if (filters.value.toDate) {
    const toDate = new Date(filters.value.toDate);
    toDate.setHours(23, 59, 59);
    result = result.filter((application) => application.applicationDate <= toDate);
  }

  if (filters.value.email) {
    const query = filters.value.email.toLowerCase();
    result = result.filter((application) => application.email.toLowerCase().includes(query));
  }

  if (filters.value.mobile) {
    result = result.filter((application) => application.mobile.includes(filters.value.mobile));
  }

  return result;
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedApplications = computed(() => {
  return filteredApplications.value.slice(startIndex.value, endIndex.value);
});

const pendingCount = computed(() => {
  return filteredApplications.value.filter((app) => app.loanStatus === "pending").length;
});

const underReviewCount = computed(() => {
  return filteredApplications.value.filter((app) => app.loanStatus === "under-review").length;
});

const approvedCount = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return filteredApplications.value.filter(
    (app) => app.loanStatus === "approved" && app.applicationDate >= today,
  ).length;
});

const totalPendingAmount = computed(() => {
  return filteredApplications.value
    .filter((app) => app.loanStatus === "pending")
    .reduce((sum, app) => sum + app.investmentAmount, 0);
});

const isAllSelected = computed(() => {
  const selectableApps = paginatedApplications.value.filter((app) => app.loanStatus === "pending");
  return (
    selectableApps.length > 0 &&
    selectableApps.every((app) => selectedApplications.value.includes(app.id))
  );
});

// Methods
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getLoanStatusClass = (status: string): string => {
  const classes: { [key: string]: string } = {
    pending: "badge-warning",
    approved: "badge-success",
    rejected: "badge-danger",
    "under-review": "badge-info",
  };
  return classes[status] || "badge-secondary";
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const resetFilters = () => {
  filters.value = {
    name: "",
    business: "",
    investorNumber: "",
    loanNumber: "",
    loanStatus: "",
    minAmount: null,
    maxAmount: null,
    fromDate: "",
    toDate: "",
    email: "",
    mobile: "",
  };
  currentPage.value = 1;
};

const searchApplications = () => {
  currentPage.value = 1;
};

const toggleSelectAll = () => {
  const selectableApps = paginatedApplications.value.filter((app) => app.loanStatus === "pending");
  if (isAllSelected.value) {
    selectedApplications.value = selectedApplications.value.filter(
      (id) => !selectableApps.map((app) => app.id).includes(id),
    );
  } else {
    const newSelections = selectableApps.map((app) => app.id);
    selectedApplications.value = [...new Set([...selectedApplications.value, ...newSelections])];
  }
};

const exportApplications = () => {
  const csvContent = [
    "Name,Business,Investor Number,Loan Number,Investment Amount,Interest Rate,Comments,Application Date,Email,Mobile,Status",
    ...filteredApplications.value.map(
      (application) =>
        `"${application.name}","${application.business}","${application.investorNumber}","${application.loanNumber}",${application.investmentAmount},${application.interestRate},"${application.comments}","${application.applicationDate.toISOString()}","${application.email}","${application.mobile}","${application.loanStatus}"`,
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `investment_applications_export_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const bulkApprove = () => {
  if (
    confirm(
      `Are you sure you want to approve ${selectedApplications.value.length} selected applications?`,
    )
  ) {
    loanApplications.value.forEach((app) => {
      if (selectedApplications.value.includes(app.id) && app.loanStatus === "pending") {
        app.loanStatus = "approved";
      }
    });
    selectedApplications.value = [];
    alert("Selected applications have been approved!");
  }
};

const approveApplication = (application: LoanInvestmentApplication) => {
  if (confirm(`Approve investment application for ${application.name}?`)) {
    application.loanStatus = "approved";
    alert("Application approved successfully!");
  }
};

const rejectApplication = (application: LoanInvestmentApplication) => {
  if (confirm(`Reject investment application for ${application.name}?`)) {
    application.loanStatus = "rejected";
    alert("Application rejected!");
  }
};

const markUnderReview = (application: LoanInvestmentApplication) => {
  application.loanStatus = "under-review";
  alert("Application marked as under review!");
};

const viewDetails = (application: LoanInvestmentApplication) => {
  alert(`View full details for application: ${application.loanNumber}`);
};

const viewDocuments = (application: LoanInvestmentApplication) => {
  alert(`View ${application.documents} documents for application: ${application.loanNumber}`);
};

defineOptions({
  name: "ApproveInvestmentsList",
});
</script>