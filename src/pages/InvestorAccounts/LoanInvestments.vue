<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View All Loan Investments</h1>
        <p class="text-sm text-gray-600">Monitor and manage loan investment portfolios</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportInvestments" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="newInvestment" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          New Investment
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              v-model="filters.accountNumber"
              type="text"
              placeholder="Search by account#"
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
              <option value="active">Active</option>
              <option value="matured">Matured</option>
              <option value="defaulted">Defaulted</option>
              <option value="repaid">Repaid</option>
              <option value="restructured">Restructured</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Investment Status</label>
            <select v-model="filters.status" class="form-input">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Principal Range</label>
            <div class="flex space-x-2">
              <input
                v-model.number="filters.minPrincipal"
                type="number"
                step="0.01"
                class="form-input"
                placeholder="Min"
              />
              <input
                v-model.number="filters.maxPrincipal"
                type="number"
                step="0.01"
                class="form-input"
                placeholder="Max"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Investment Date</label>
            <div class="flex space-x-2">
              <input v-model="filters.fromDate" type="date" class="form-input" />
              <input v-model="filters.toDate" type="date" class="form-input" />
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="resetFilters" class="btn btn-secondary">Reset</button>
          <button @click="searchInvestments" class="btn btn-primary">Search</button>
        </div>
      </div>
    </div>

    <!-- Investment Statistics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-blue-600">{{ totalInvestments }}</div>
          <div class="text-sm text-gray-600">Total Investments</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-green-600">${{ totalPrincipal.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Total Principal</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-orange-600">${{ totalInterestEarned.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Interest Earned</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-purple-600">{{ averageROI.toFixed(2) }}%</div>
          <div class="text-sm text-gray-600">Average ROI</div>
        </div>
      </div>
    </div>

    <!-- Investments Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Loan Investments</h3>
        <div class="flex items-center space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search account"
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
        <div v-if="filteredInvestments.length === 0" class="text-center py-12">
          <BanknotesIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 mb-4 font-medium">No loan investments found.</p>
          <button @click="newInvestment" class="btn btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Create First Investment
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">View</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Business</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Account#</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Loan#</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Principal Investment</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Principal Repaid</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Interest Earned</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Interest Paid</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Loan Status</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Receipt</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="investment in paginatedInvestments" :key="investment.id" class="hover:bg-gray-50">
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <button @click="viewInvestment(investment)" class="btn btn-xs btn-primary">
                    <EyeIcon class="w-3 h-3" />
                  </button>
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    >
                      <span class="text-sm font-medium text-blue-700">
                        {{ getInitials(investment.name) }}
                      </span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-medium text-gray-900 truncate">{{ investment.name }}</div>
                      <div class="text-sm text-gray-500 truncate">{{ investment.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-sm">
                    <div class="font-medium">{{ investment.business }}</div>
                    <div class="text-gray-500">{{ investment.industry }}</div>
                  </div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap font-mono text-sm">{{ investment.accountNumber }}</td>
                <td class="px-3 py-4 whitespace-nowrap font-mono text-sm">{{ investment.loanNumber }}</td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="font-bold text-gray-900">
                    ${{ investment.principalInvestment.toLocaleString() }}
                  </div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="font-bold" :class="getRepaymentClass(investment)">
                    ${{ investment.principalRepaid.toLocaleString() }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ getRepaymentPercentage(investment).toFixed(1) }}%
                  </div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="font-bold text-green-600">
                    ${{ investment.interestEarned.toLocaleString() }}
                  </div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="font-bold" :class="getInterestPaidClass(investment)">
                    ${{ investment.interestPaid.toLocaleString() }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ getInterestPaidPercentage(investment).toFixed(1) }}%
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <span :class="getLoanStatusClass(investment.loanStatus)" class="badge">
                    {{ investment.loanStatus }}
                  </span>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <span :class="getInvestmentStatusClass(investment.status)" class="badge">
                    {{ investment.status }}
                  </span>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <button @click="viewReceipt(investment)" class="btn btn-xs btn-outline">
                    <DocumentTextIcon class="w-3 h-3" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredInvestments.length > 0" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredInvestments.length) }} of
            {{ filteredInvestments.length }} entries
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
              :disabled="endIndex >= filteredInvestments.length"
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
  DocumentArrowDownIcon,
  ChevronDownIcon,
  EyeIcon,
  DocumentTextIcon,
  BanknotesIcon,
} from "@heroicons/vue/24/outline";

// Types
interface LoanInvestment {
  id: string;
  name: string;
  email: string;
  business: string;
  industry: string;
  accountNumber: string;
  loanNumber: string;
  principalInvestment: number;
  principalRepaid: number;
  interestEarned: number;
  interestPaid: number;
  loanStatus: "active" | "matured" | "defaulted" | "repaid" | "restructured";
  status: "active" | "completed" | "pending" | "cancelled";
  investmentDate: Date;
  maturityDate: Date;
  interestRate: number;
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
  accountNumber: "",
  loanNumber: "",
  loanStatus: "",
  status: "",
  minPrincipal: null as number | null,
  maxPrincipal: null as number | null,
  fromDate: "",
  toDate: "",
});

// Mock data
const loanInvestments = ref<LoanInvestment[]>([
  {
    id: "1",
    name: "John Anderson",
    email: "john.anderson@andersonholdings.com",
    business: "Anderson Holdings Ltd",
    industry: "Real Estate",
    accountNumber: "ACC001234",
    loanNumber: "LN2024001",
    principalInvestment: 100000,
    principalRepaid: 75000,
    interestEarned: 12000,
    interestPaid: 9000,
    loanStatus: "active",
    status: "active",
    investmentDate: new Date("2024-01-15"),
    maturityDate: new Date("2025-01-15"),
    interestRate: 12,
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@chenvc.com",
    business: "Chen Venture Capital",
    industry: "Venture Capital",
    accountNumber: "ACC005678",
    loanNumber: "LN2024002",
    principalInvestment: 250000,
    principalRepaid: 250000,
    interestEarned: 30000,
    interestPaid: 30000,
    loanStatus: "repaid",
    status: "completed",
    investmentDate: new Date("2024-02-20"),
    maturityDate: new Date("2024-08-20"),
    interestRate: 14,
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "m.rodriguez@rodriguezfg.com",
    business: "Rodriguez Financial Group",
    industry: "Financial Services",
    accountNumber: "ACC009876",
    loanNumber: "LN2024003",
    principalInvestment: 175000,
    principalRepaid: 125000,
    interestEarned: 18000,
    interestPaid: 12000,
    loanStatus: "active",
    status: "active",
    investmentDate: new Date("2024-03-10"),
    maturityDate: new Date("2025-03-10"),
    interestRate: 11.5,
  },
  {
    id: "4",
    name: "Emily Johnson",
    email: "emily.johnson@johnsonassets.com",
    business: "Johnson Asset Management",
    industry: "Asset Management",
    accountNumber: "ACC543210",
    loanNumber: "LN2024004",
    principalInvestment: 50000,
    principalRepaid: 0,
    interestEarned: 4000,
    interestPaid: 0,
    loanStatus: "defaulted",
    status: "active",
    investmentDate: new Date("2024-01-28"),
    maturityDate: new Date("2024-07-28"),
    interestRate: 15,
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@kiminnovation.com",
    business: "Kim Innovation Fund",
    industry: "Technology",
    accountNumber: "ACC111222",
    loanNumber: "LN2024005",
    principalInvestment: 300000,
    principalRepaid: 100000,
    interestEarned: 22000,
    interestPaid: 7000,
    loanStatus: "restructured",
    status: "active",
    investmentDate: new Date("2023-11-05"),
    maturityDate: new Date("2025-05-05"),
    interestRate: 10,
  },
  {
    id: "6",
    name: "Lisa Thompson",
    email: "lisa.thompson@thompsonwealth.com",
    business: "Thompson Wealth Partners",
    industry: "Wealth Management",
    accountNumber: "ACC333444",
    loanNumber: "LN2024006",
    principalInvestment: 80000,
    principalRepaid: 80000,
    interestEarned: 9600,
    interestPaid: 9600,
    loanStatus: "matured",
    status: "completed",
    investmentDate: new Date("2024-03-25"),
    maturityDate: new Date("2024-09-25"),
    interestRate: 13,
  },
]);

// Computed properties
const filteredInvestments = computed(() => {
  let result = loanInvestments.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (investment) =>
        investment.name.toLowerCase().includes(query) ||
        investment.business.toLowerCase().includes(query) ||
        investment.accountNumber.toLowerCase().includes(query) ||
        investment.loanNumber.toLowerCase().includes(query) ||
        investment.email.toLowerCase().includes(query),
    );
  }

  if (filters.value.name) {
    const query = filters.value.name.toLowerCase();
    result = result.filter((investment) => investment.name.toLowerCase().includes(query));
  }

  if (filters.value.business) {
    const query = filters.value.business.toLowerCase();
    result = result.filter((investment) => investment.business.toLowerCase().includes(query));
  }

  if (filters.value.accountNumber) {
    result = result.filter((investment) =>
      investment.accountNumber.toLowerCase().includes(filters.value.accountNumber.toLowerCase()),
    );
  }

  if (filters.value.loanNumber) {
    result = result.filter((investment) =>
      investment.loanNumber.toLowerCase().includes(filters.value.loanNumber.toLowerCase()),
    );
  }

  if (filters.value.loanStatus) {
    result = result.filter((investment) => investment.loanStatus === filters.value.loanStatus);
  }

  if (filters.value.status) {
    result = result.filter((investment) => investment.status === filters.value.status);
  }

  if (filters.value.minPrincipal !== null) {
    result = result.filter(
      (investment) => investment.principalInvestment >= filters.value.minPrincipal!,
    );
  }

  if (filters.value.maxPrincipal !== null) {
    result = result.filter(
      (investment) => investment.principalInvestment <= filters.value.maxPrincipal!,
    );
  }

  if (filters.value.fromDate) {
    const fromDate = new Date(filters.value.fromDate);
    result = result.filter((investment) => investment.investmentDate >= fromDate);
  }

  if (filters.value.toDate) {
    const toDate = new Date(filters.value.toDate);
    toDate.setHours(23, 59, 59);
    result = result.filter((investment) => investment.investmentDate <= toDate);
  }

  return result;
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedInvestments = computed(() => {
  return filteredInvestments.value.slice(startIndex.value, endIndex.value);
});

const totalInvestments = computed(() => filteredInvestments.value.length);

const totalPrincipal = computed(() => {
  return filteredInvestments.value.reduce(
    (sum, investment) => sum + investment.principalInvestment,
    0,
  );
});

const totalInterestEarned = computed(() => {
  return filteredInvestments.value.reduce(
    (sum, investment) => sum + investment.interestEarned,
    0,
  );
});

const averageROI = computed(() => {
  if (totalPrincipal.value === 0) return 0;
  return (totalInterestEarned.value / totalPrincipal.value) * 100;
});

// Methods
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getRepaymentClass = (investment: LoanInvestment): string => {
  const percentage = getRepaymentPercentage(investment);
  if (percentage >= 100) return "text-green-600";
  if (percentage >= 50) return "text-blue-600";
  if (percentage > 0) return "text-orange-600";
  return "text-red-600";
};

const getRepaymentPercentage = (investment: LoanInvestment): number => {
  if (investment.principalInvestment === 0) return 0;
  return (investment.principalRepaid / investment.principalInvestment) * 100;
};

const getInterestPaidClass = (investment: LoanInvestment): string => {
  const percentage = getInterestPaidPercentage(investment);
  if (percentage >= 100) return "text-green-600";
  if (percentage >= 50) return "text-blue-600";
  return "text-orange-600";
};

const getInterestPaidPercentage = (investment: LoanInvestment): number => {
  if (investment.interestEarned === 0) return 0;
  return (investment.interestPaid / investment.interestEarned) * 100;
};

const getLoanStatusClass = (status: string): string => {
  const classes: { [key: string]: string } = {
    active: "badge-primary",
    matured: "badge-success",
    defaulted: "badge-danger",
    repaid: "badge-info",
    restructured: "badge-warning",
  };
  return classes[status] || "badge-secondary";
};

const getInvestmentStatusClass = (status: string): string => {
  const classes: { [key: string]: string } = {
    active: "badge-primary",
    completed: "badge-success",
    pending: "badge-warning",
    cancelled: "badge-danger",
  };
  return classes[status] || "badge-secondary";
};

const resetFilters = () => {
  filters.value = {
    name: "",
    business: "",
    accountNumber: "",
    loanNumber: "",
    loanStatus: "",
    status: "",
    minPrincipal: null,
    maxPrincipal: null,
    fromDate: "",
    toDate: "",
  };
  currentPage.value = 1;
};

const searchInvestments = () => {
  currentPage.value = 1;
};

const exportInvestments = () => {
  const csvContent = [
    "Name,Business,Account Number,Loan Number,Principal Investment,Principal Repaid,Interest Earned,Interest Paid,Loan Status,Investment Status,Investment Date,Maturity Date,Interest Rate",
    ...filteredInvestments.value.map(
      (investment) =>
        `"${investment.name}","${investment.business}","${investment.accountNumber}","${investment.loanNumber}",${investment.principalInvestment},${investment.principalRepaid},${investment.interestEarned},${investment.interestPaid},"${investment.loanStatus}","${investment.status}","${investment.investmentDate.toISOString().split("T")[0]}","${investment.maturityDate.toISOString().split("T")[0]}",${investment.interestRate}`,
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `loan_investments_export_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const newInvestment = () => {
  router.push("/investor-accounts/create");
};

const viewInvestment = (investment: LoanInvestment) => {
  alert(`View investment details: ${investment.loanNumber}`);
};

const viewReceipt = (investment: LoanInvestment) => {
  alert(`View receipt for investment: ${investment.loanNumber}`);
};

defineOptions({
  name: "LoanInvestmentsList",
});
</script>