<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View Investor Transactions</h1>
        <p class="text-sm text-gray-600">Track and manage all investor account transactions</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportTransactions" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="newTransaction" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          New Transaction
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              v-model="filters.accountNumber"
              type="text"
              placeholder="Search by account#"
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <select v-model="filters.product" class="form-input">
              <option value="">All Products</option>
              <option value="investment">Investment Account</option>
              <option value="savings">Savings Account</option>
              <option value="portfolio">Portfolio Management</option>
              <option value="fixedDeposit">Fixed Deposit</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select v-model="filters.type" class="form-input">
              <option value="">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="interest">Interest Credit</option>
              <option value="fee">Fee Deduction</option>
              <option value="transfer">Transfer</option>
              <option value="dividend">Dividend</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div class="flex space-x-2">
              <input v-model="filters.fromDate" type="date" class="form-input" />
              <input v-model="filters.toDate" type="date" class="form-input" />
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="resetFilters" class="btn btn-secondary">Reset</button>
          <button @click="searchTransactions" class="btn btn-primary">Search</button>
        </div>
      </div>
    </div>

    <!-- Transaction Statistics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-blue-600">{{ totalTransactions }}</div>
          <div class="text-sm text-gray-600">Total Transactions</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-green-600">${{ totalCredits.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Total Credits</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-red-600">${{ totalDebits.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Total Debits</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-purple-600">${{ netFlow.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Net Flow</div>
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Investor Transactions</h3>
        <div class="flex items-center space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search transactions"
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
        <div v-if="filteredTransactions.length === 0" class="text-center py-12">
          <CreditCardIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 mb-4 font-medium">No transactions found.</p>
          <button @click="newTransaction" class="btn btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Create First Transaction
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Account#</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Product</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Balance</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Description</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Debit</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Credit</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Receipt</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    >
                      <span class="text-sm font-medium text-blue-700">
                        {{ getInitials(transaction.name) }}
                      </span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-medium text-gray-900 truncate">{{ transaction.name }}</div>
                      <div class="text-sm text-gray-500 truncate">{{ transaction.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap font-mono text-sm">{{ transaction.accountNumber }}</td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <span :class="getProductClass(transaction.product)" class="badge badge-sm">
                    {{ transaction.product }}
                  </span>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="font-bold" :class="getBalanceClass(transaction.balance)">
                    ${{ transaction.balance.toLocaleString() }}
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap text-sm">
                  <div class="font-medium">{{ formatDate(transaction.date) }}</div>
                  <div class="text-gray-500 text-xs">{{ formatTime(transaction.date) }}</div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <span :class="getTransactionTypeClass(transaction.type)" class="badge">
                    {{ transaction.type }}
                  </span>
                </td>
                <td class="px-3 py-4 text-sm">
                  <div class="max-w-xs truncate">{{ transaction.description }}</div>
                  <div v-if="transaction.reference" class="text-gray-500 text-xs">
                    Ref: {{ transaction.reference }}
                  </div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div v-if="transaction.debit > 0" class="font-bold text-red-600">
                    ${{ transaction.debit.toLocaleString() }}
                  </div>
                  <div v-else class="text-gray-400">-</div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div v-if="transaction.credit > 0" class="font-bold text-green-600">
                    ${{ transaction.credit.toLocaleString() }}
                  </div>
                  <div v-else class="text-gray-400">-</div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <button @click="viewReceipt(transaction)" class="btn btn-xs btn-outline">
                    <DocumentTextIcon class="w-3 h-3" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredTransactions.length > 0" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredTransactions.length) }} of
            {{ filteredTransactions.length }} entries
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
              :disabled="endIndex >= filteredTransactions.length"
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
  DocumentTextIcon,
  CreditCardIcon,
} from "@heroicons/vue/24/outline";

// Types
interface InvestorTransaction {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  product: string;
  balance: number;
  date: Date;
  type: "deposit" | "withdrawal" | "interest" | "fee" | "transfer" | "dividend";
  description: string;
  debit: number;
  credit: number;
  reference?: string;
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
  accountNumber: "",
  product: "",
  type: "",
  minAmount: null as number | null,
  maxAmount: null as number | null,
  fromDate: "",
  toDate: "",
});

// Mock data
const investorTransactions = ref<InvestorTransaction[]>([
  {
    id: "1",
    name: "John Anderson",
    email: "john.anderson@andersonholdings.com",
    accountNumber: "ACC001234",
    product: "Investment",
    balance: 275000,
    date: new Date("2024-09-02T10:30:00"),
    type: "deposit",
    description: "Investment capital deposit",
    debit: 0,
    credit: 50000,
    reference: "DEP2024090201",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@chenvc.com",
    accountNumber: "ACC005678",
    product: "Portfolio",
    balance: 520000,
    date: new Date("2024-09-01T14:15:00"),
    type: "interest",
    description: "Monthly interest credit",
    debit: 0,
    credit: 6250,
    reference: "INT2024090101",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "m.rodriguez@rodriguezfg.com",
    accountNumber: "ACC009876",
    product: "Savings",
    balance: 145000,
    date: new Date("2024-08-31T09:45:00"),
    type: "withdrawal",
    description: "Partial withdrawal for business expansion",
    debit: 25000,
    credit: 0,
    reference: "WTH2024083101",
  },
  {
    id: "4",
    name: "Emily Johnson",
    email: "emily.johnson@johnsonassets.com",
    accountNumber: "ACC543210",
    product: "Fixed Deposit",
    balance: 68000,
    date: new Date("2024-08-30T16:20:00"),
    type: "fee",
    description: "Account management fee",
    debit: 150,
    credit: 0,
    reference: "FEE2024083001",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@kiminnovation.com",
    accountNumber: "ACC111222",
    product: "Investment",
    balance: 300000,
    date: new Date("2024-08-29T11:00:00"),
    type: "dividend",
    description: "Quarterly dividend payment",
    debit: 0,
    credit: 12000,
    reference: "DIV2024082901",
  },
  {
    id: "6",
    name: "Lisa Thompson",
    email: "lisa.thompson@thompsonwealth.com",
    accountNumber: "ACC333444",
    product: "Portfolio",
    balance: 25000,
    date: new Date("2024-08-28T13:30:00"),
    type: "transfer",
    description: "Transfer from savings to investment portfolio",
    debit: 0,
    credit: 10000,
    reference: "TRF2024082801",
  },
  {
    id: "7",
    name: "John Anderson",
    email: "john.anderson@andersonholdings.com",
    accountNumber: "ACC001234",
    product: "Investment",
    balance: 225000,
    date: new Date("2024-08-27T08:45:00"),
    type: "interest",
    description: "Investment returns",
    debit: 0,
    credit: 3500,
    reference: "INT2024082701",
  },
  {
    id: "8",
    name: "Sarah Chen",
    email: "sarah.chen@chenvc.com",
    accountNumber: "ACC005678",
    product: "Portfolio",
    balance: 513750,
    date: new Date("2024-08-26T15:00:00"),
    type: "deposit",
    description: "Additional investment",
    debit: 0,
    credit: 100000,
    reference: "DEP2024082601",
  },
  {
    id: "9",
    name: "Michael Rodriguez",
    email: "m.rodriguez@rodriguezfg.com",
    accountNumber: "ACC009876",
    product: "Savings",
    balance: 170000,
    date: new Date("2024-08-25T10:20:00"),
    type: "transfer",
    description: "Internal transfer between accounts",
    debit: 5000,
    credit: 0,
    reference: "TRF2024082501",
  },
  {
    id: "10",
    name: "Emily Johnson",
    email: "emily.johnson@johnsonassets.com",
    accountNumber: "ACC543210",
    product: "Fixed Deposit",
    balance: 68150,
    date: new Date("2024-08-24T12:10:00"),
    type: "interest",
    description: "Fixed deposit interest",
    debit: 0,
    credit: 850,
    reference: "INT2024082401",
  },
]);

// Computed properties
const filteredTransactions = computed(() => {
  let result = investorTransactions.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (transaction) =>
        transaction.name.toLowerCase().includes(query) ||
        transaction.accountNumber.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.reference?.toLowerCase().includes(query) ||
        transaction.email.toLowerCase().includes(query),
    );
  }

  if (filters.value.name) {
    const query = filters.value.name.toLowerCase();
    result = result.filter((transaction) => transaction.name.toLowerCase().includes(query));
  }

  if (filters.value.accountNumber) {
    result = result.filter((transaction) =>
      transaction.accountNumber.toLowerCase().includes(filters.value.accountNumber.toLowerCase()),
    );
  }

  if (filters.value.product) {
    result = result.filter(
      (transaction) => transaction.product.toLowerCase() === filters.value.product.toLowerCase(),
    );
  }

  if (filters.value.type) {
    result = result.filter((transaction) => transaction.type === filters.value.type);
  }

  if (filters.value.minAmount !== null) {
    result = result.filter((transaction) => {
      const amount = Math.max(transaction.debit, transaction.credit);
      return amount >= filters.value.minAmount!;
    });
  }

  if (filters.value.maxAmount !== null) {
    result = result.filter((transaction) => {
      const amount = Math.max(transaction.debit, transaction.credit);
      return amount <= filters.value.maxAmount!;
    });
  }

  if (filters.value.fromDate) {
    const fromDate = new Date(filters.value.fromDate);
    result = result.filter((transaction) => transaction.date >= fromDate);
  }

  if (filters.value.toDate) {
    const toDate = new Date(filters.value.toDate);
    toDate.setHours(23, 59, 59);
    result = result.filter((transaction) => transaction.date <= toDate);
  }

  return result;
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedTransactions = computed(() => {
  return filteredTransactions.value.slice(startIndex.value, endIndex.value);
});

const totalTransactions = computed(() => filteredTransactions.value.length);

const totalCredits = computed(() => {
  return filteredTransactions.value.reduce((sum, transaction) => sum + transaction.credit, 0);
});

const totalDebits = computed(() => {
  return filteredTransactions.value.reduce((sum, transaction) => sum + transaction.debit, 0);
});

const netFlow = computed(() => totalCredits.value - totalDebits.value);

// Methods
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getProductClass = (product: string): string => {
  const productLower = product.toLowerCase();
  if (productLower.includes("investment")) return "badge-primary";
  if (productLower.includes("portfolio")) return "badge-success";
  if (productLower.includes("savings")) return "badge-info";
  if (productLower.includes("fixed")) return "badge-warning";
  return "badge-secondary";
};

const getBalanceClass = (balance: number): string => {
  if (balance > 100000) return "text-green-600";
  if (balance > 50000) return "text-blue-600";
  if (balance > 0) return "text-gray-900";
  return "text-red-600";
};

const getTransactionTypeClass = (type: string): string => {
  const classes: { [key: string]: string } = {
    deposit: "badge-success",
    withdrawal: "badge-danger",
    interest: "badge-info",
    fee: "badge-warning",
    transfer: "badge-secondary",
    dividend: "badge-primary",
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

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const resetFilters = () => {
  filters.value = {
    name: "",
    accountNumber: "",
    product: "",
    type: "",
    minAmount: null,
    maxAmount: null,
    fromDate: "",
    toDate: "",
  };
  currentPage.value = 1;
};

const searchTransactions = () => {
  currentPage.value = 1;
};

const exportTransactions = () => {
  const csvContent = [
    "Name,Account Number,Product,Balance,Date,Type,Description,Reference,Debit,Credit",
    ...filteredTransactions.value.map(
      (transaction) =>
        `"${transaction.name}","${transaction.accountNumber}","${transaction.product}",${transaction.balance},"${transaction.date.toISOString()}","${transaction.type}","${transaction.description}","${transaction.reference || ""}",${transaction.debit},${transaction.credit}`,
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `investor_transactions_export_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const newTransaction = () => {
  router.push("/investor-accounts/create");
};

const viewReceipt = (transaction: InvestorTransaction) => {
  alert(`View receipt for transaction: ${transaction.reference}`);
};

defineOptions({
  name: "InvestorTransactionsList",
});
</script>