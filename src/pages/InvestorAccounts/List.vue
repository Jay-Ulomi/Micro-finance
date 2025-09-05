<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View All Investor Accounts</h1>
        <p class="text-sm text-gray-600">Manage investment accounts, balances, and transactions</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportAccounts" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="openAccount" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Open Account
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
            <select v-model="filters.status" class="form-input">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Balance Range</label>
            <div class="flex space-x-2">
              <input
                v-model.number="filters.minBalance"
                type="number"
                step="0.01"
                class="form-input"
                placeholder="Min"
              />
              <input
                v-model.number="filters.maxBalance"
                type="number"
                step="0.01"
                class="form-input"
                placeholder="Max"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select v-model="filters.accountType" class="form-input">
              <option value="">All Types</option>
              <option value="investment">Investment Account</option>
              <option value="savings">Savings Account</option>
              <option value="portfolio">Portfolio Account</option>
              <option value="managed">Managed Account</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Last Transaction Date</label
            >
            <div class="flex space-x-2">
              <input v-model="filters.fromDate" type="date" class="form-input" />
              <input v-model="filters.toDate" type="date" class="form-input" />
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="resetFilters" class="btn btn-secondary">Reset</button>
          <button @click="searchAccounts" class="btn btn-primary">Search</button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-blue-600">{{ filteredAccounts.length }}</div>
          <div class="text-sm text-gray-600">Total Accounts</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-green-600">{{ activeAccounts }}</div>
          <div class="text-sm text-gray-600">Active Accounts</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-orange-600">${{ totalBalance.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Total Balance</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-purple-600">
            ${{ averageBalance.toLocaleString() }}
          </div>
          <div class="text-sm text-gray-600">Average Balance</div>
        </div>
      </div>
    </div>

    <!-- Accounts Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Investor Accounts</h3>
        <div class="flex space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search account"
            class="form-input w-64"
          />
          <select v-model="entriesPerPage" class="form-input">
            <option value="10">Show 10 entries</option>
            <option value="20">Show 20 entries</option>
            <option value="50">Show 50 entries</option>
            <option value="100">Show 100 entries</option>
          </select>
        </div>
      </div>

      <div class="card-body">
        <div v-if="filteredAccounts.length === 0" class="text-center py-12">
          <BuildingLibraryIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 mb-4 font-medium">No investor accounts found.</p>
          <button @click="openAccount" class="btn btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Open First Account
          </button>
        </div>

        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-center">Action</th>
                <th class="text-left">Name</th>
                <th class="text-left">Business</th>
                <th class="text-left">Account#</th>
                <th class="text-right">Balance</th>
                <th class="text-center">LastTransaction</th>
                <th class="text-center">Status</th>
                <th class="text-center">Type</th>
                <th class="text-center">Manage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in paginatedAccounts" :key="account.id" class="hover:bg-gray-50">
                <td class="text-center">
                  <div class="flex justify-center space-x-1">
                    <button @click="viewAccount(account)" class="btn btn-xs btn-primary">
                      <EyeIcon class="w-3 h-3" />
                    </button>
                    <button @click="viewTransactions(account)" class="btn btn-xs btn-outline">
                      <DocumentTextIcon class="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td class="font-medium">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                    >
                      <span class="text-sm font-medium text-blue-700">
                        {{ getInitials(account.holderName) }}
                      </span>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ account.holderName }}</div>
                      <div class="text-sm text-gray-500">{{ account.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="text-sm">
                    <div class="font-medium">{{ account.business }}</div>
                    <div class="text-gray-500">{{ account.industry }}</div>
                  </div>
                </td>
                <td class="font-mono text-sm">{{ account.accountNumber }}</td>
                <td class="text-right">
                  <div class="font-bold text-lg" :class="getBalanceClass(account.balance)">
                    ${{ account.balance.toLocaleString() }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ account.currency }}
                  </div>
                </td>
                <td class="text-center text-sm">
                  <div>
                    <div class="font-medium">{{ formatDate(account.lastTransaction.date) }}</div>
                    <div class="text-gray-500">{{ account.lastTransaction.type }}</div>
                    <div :class="getTransactionAmountClass(account.lastTransaction.amount)">
                      ${{ Math.abs(account.lastTransaction.amount).toLocaleString() }}
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <span :class="getAccountStatusClass(account.status)" class="badge">
                    {{ account.status }}
                  </span>
                </td>
                <td class="text-center">
                  <span :class="getAccountTypeClass(account.accountType)" class="badge">
                    {{ account.accountType }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="flex justify-center space-x-1">
                    <button @click="editAccount(account)" class="btn btn-xs btn-outline">
                      <PencilIcon class="w-3 h-3" />
                    </button>
                    <button @click="suspendAccount(account)" class="btn btn-xs btn-warning">
                      <PauseCircleIcon class="w-3 h-3" />
                    </button>
                    <button @click="closeAccount(account)" class="btn btn-xs btn-danger">
                      <XMarkIcon class="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredAccounts.length > 0" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredAccounts.length) }} of
            {{ filteredAccounts.length }} entries
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
              :disabled="endIndex >= filteredAccounts.length"
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
  BuildingLibraryIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
  EyeIcon,
  DocumentTextIcon,
  PencilIcon,
  PauseCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

// Types
interface LastTransaction {
  date: Date;
  type: string;
  amount: number;
}

interface InvestorAccount {
  id: string;
  holderName: string;
  email: string;
  business: string;
  industry: string;
  accountNumber: string;
  balance: number;
  currency: string;
  lastTransaction: LastTransaction;
  status: "active" | "inactive" | "suspended" | "closed";
  accountType: "investment" | "savings" | "portfolio" | "managed";
  openDate: Date;
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
  status: "",
  minBalance: null as number | null,
  maxBalance: null as number | null,
  accountType: "",
  fromDate: "",
  toDate: "",
});

// Mock data
const investorAccounts = ref<InvestorAccount[]>([
  {
    id: "1",
    holderName: "John Anderson",
    email: "john.anderson@andersonholdings.com",
    business: "Anderson Holdings Ltd",
    industry: "Real Estate",
    accountNumber: "ACC001234",
    balance: 275000,
    currency: "USD",
    lastTransaction: {
      date: new Date("2024-09-02"),
      type: "Investment Return",
      amount: 15000,
    },
    status: "active",
    accountType: "investment",
    openDate: new Date("2024-01-15"),
  },
  {
    id: "2",
    holderName: "Sarah Chen",
    email: "sarah.chen@chenvc.com",
    business: "Chen Venture Capital",
    industry: "Venture Capital",
    accountNumber: "ACC005678",
    balance: 520000,
    currency: "USD",
    lastTransaction: {
      date: new Date("2024-09-01"),
      type: "Deposit",
      amount: 75000,
    },
    status: "active",
    accountType: "portfolio",
    openDate: new Date("2024-02-20"),
  },
  {
    id: "3",
    holderName: "Michael Rodriguez",
    email: "m.rodriguez@rodriguezfg.com",
    business: "Rodriguez Financial Group",
    industry: "Financial Services",
    accountNumber: "ACC009876",
    balance: 145000,
    currency: "USD",
    lastTransaction: {
      date: new Date("2024-08-28"),
      type: "Withdrawal",
      amount: -25000,
    },
    status: "active",
    accountType: "managed",
    openDate: new Date("2024-03-10"),
  },
  {
    id: "4",
    holderName: "Emily Johnson",
    email: "emily.johnson@johnsonassets.com",
    business: "Johnson Asset Management",
    industry: "Asset Management",
    accountNumber: "ACC543210",
    balance: 68000,
    currency: "USD",
    lastTransaction: {
      date: new Date("2024-08-25"),
      type: "Fee Deduction",
      amount: -2000,
    },
    status: "inactive",
    accountType: "savings",
    openDate: new Date("2024-01-28"),
  },
  {
    id: "5",
    holderName: "David Kim",
    email: "david.kim@kiminnovation.com",
    business: "Kim Innovation Fund",
    industry: "Technology",
    accountNumber: "ACC111222",
    balance: 0,
    currency: "USD",
    lastTransaction: {
      date: new Date("2024-07-15"),
      type: "Account Closure",
      amount: -75000,
    },
    status: "closed",
    accountType: "investment",
    openDate: new Date("2023-11-05"),
  },
  {
    id: "6",
    holderName: "Lisa Thompson",
    email: "lisa.thompson@thompsonwealth.com",
    business: "Thompson Wealth Partners",
    industry: "Wealth Management",
    accountNumber: "ACC333444",
    balance: 25000,
    currency: "USD",
    lastTransaction: {
      date: new Date("2024-08-30"),
      type: "Interest Credit",
      amount: 500,
    },
    status: "suspended",
    accountType: "savings",
    openDate: new Date("2024-03-25"),
  },
]);

// Computed properties
const filteredAccounts = computed(() => {
  let result = investorAccounts.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (account) =>
        account.holderName.toLowerCase().includes(query) ||
        account.business.toLowerCase().includes(query) ||
        account.accountNumber.toLowerCase().includes(query) ||
        account.email.toLowerCase().includes(query),
    );
  }

  if (filters.value.name) {
    const query = filters.value.name.toLowerCase();
    result = result.filter((account) => account.holderName.toLowerCase().includes(query));
  }

  if (filters.value.business) {
    const query = filters.value.business.toLowerCase();
    result = result.filter((account) => account.business.toLowerCase().includes(query));
  }

  if (filters.value.accountNumber) {
    result = result.filter((account) =>
      account.accountNumber.toLowerCase().includes(filters.value.accountNumber.toLowerCase()),
    );
  }

  if (filters.value.status) {
    result = result.filter((account) => account.status === filters.value.status);
  }

  if (filters.value.minBalance !== null) {
    result = result.filter((account) => account.balance >= filters.value.minBalance!);
  }

  if (filters.value.maxBalance !== null) {
    result = result.filter((account) => account.balance <= filters.value.maxBalance!);
  }

  if (filters.value.accountType) {
    result = result.filter((account) => account.accountType === filters.value.accountType);
  }

  if (filters.value.fromDate) {
    const fromDate = new Date(filters.value.fromDate);
    result = result.filter((account) => account.lastTransaction.date >= fromDate);
  }

  if (filters.value.toDate) {
    const toDate = new Date(filters.value.toDate);
    toDate.setHours(23, 59, 59);
    result = result.filter((account) => account.lastTransaction.date <= toDate);
  }

  return result;
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedAccounts = computed(() => {
  return filteredAccounts.value.slice(startIndex.value, endIndex.value);
});

const activeAccounts = computed(() => {
  return filteredAccounts.value.filter((account) => account.status === "active").length;
});

const totalBalance = computed(() => {
  return filteredAccounts.value.reduce((sum, account) => sum + account.balance, 0);
});

const averageBalance = computed(() => {
  const activeAccountsList = filteredAccounts.value.filter(
    (account) => account.status === "active",
  );
  return activeAccountsList.length > 0
    ? Math.round(totalBalance.value / activeAccountsList.length)
    : 0;
});

// Methods
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getBalanceClass = (balance: number): string => {
  if (balance > 100000) return "text-green-600";
  if (balance > 50000) return "text-blue-600";
  if (balance > 0) return "text-gray-900";
  return "text-red-600";
};

const getTransactionAmountClass = (amount: number): string => {
  return amount >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium";
};

const getAccountStatusClass = (status: string): string => {
  const classes: { [key: string]: string } = {
    active: "badge-success",
    inactive: "badge-warning",
    suspended: "badge-danger",
    closed: "badge-secondary",
  };
  return classes[status] || "badge-secondary";
};

const getAccountTypeClass = (type: string): string => {
  const classes: { [key: string]: string } = {
    investment: "badge-primary",
    savings: "badge-info",
    portfolio: "badge-success",
    managed: "badge-warning",
  };
  return classes[type] || "badge-secondary";
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const resetFilters = () => {
  filters.value = {
    name: "",
    business: "",
    accountNumber: "",
    status: "",
    minBalance: null,
    maxBalance: null,
    accountType: "",
    fromDate: "",
    toDate: "",
  };
  currentPage.value = 1;
};

const searchAccounts = () => {
  currentPage.value = 1;
};

const exportAccounts = () => {
  const csvContent = [
    "Holder Name,Business,Account Number,Balance,Status,Account Type,Last Transaction Date,Last Transaction Type,Last Transaction Amount",
    ...filteredAccounts.value.map(
      (account) =>
        `"${account.holderName}","${account.business}","${account.accountNumber}",${account.balance},"${account.status}","${account.accountType}","${account.lastTransaction.date.toISOString().split("T")[0]}","${account.lastTransaction.type}",${account.lastTransaction.amount}`,
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `investor_accounts_export_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const openAccount = () => {
  router.push("/investor-accounts/create");
};

const viewAccount = (account: InvestorAccount) => {
  alert(`View account details: ${account.accountNumber}`);
};

const viewTransactions = (account: InvestorAccount) => {
  alert(`View transaction history for: ${account.accountNumber}`);
};

const editAccount = (account: InvestorAccount) => {
  alert(`Edit account: ${account.accountNumber}`);
};

const suspendAccount = (account: InvestorAccount) => {
  if (confirm(`Suspend account ${account.accountNumber} for ${account.holderName}?`)) {
    account.status = "suspended";
    alert("Account suspended successfully!");
  }
};

const closeAccount = (account: InvestorAccount) => {
  if (
    confirm(
      `Close account ${account.accountNumber} for ${account.holderName}? This action cannot be undone.`,
    )
  ) {
    account.status = "closed";
    account.balance = 0;
    alert("Account closed successfully!");
  }
};

defineOptions({
  name: "InvestorAccountsList",
});
</script>
