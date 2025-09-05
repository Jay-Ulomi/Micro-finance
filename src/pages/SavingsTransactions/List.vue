<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View Savings Transactions</h1>
        <p class="text-sm text-gray-600">Detailed transaction history for all savings accounts</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportTransactions" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="addTransaction" class="btn btn-primary">
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
          <span class="font-medium">Advanced Search: Click here to {{ showAdvancedSearch ? 'Hide' : 'Show' }}</span>
          <ChevronDownIcon 
            :class="['w-4 h-4 ml-2 transition-transform', showAdvancedSearch ? 'rotate-180' : '']" 
          />
        </button>
      </div>
      <div v-if="showAdvancedSearch" class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input v-model="filters.fromDate" type="date" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input v-model="filters.toDate" type="date" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">All Savings Products</label>
            <select v-model="filters.savingsProduct" class="form-input">
              <option value="">All Products</option>
              <option value="regular-savings">Regular Savings</option>
              <option value="premium-savings">Premium Savings</option>
              <option value="goal-savings">Goal Savings</option>
              <option value="susu-collector">SUSU Collector</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <select v-model="filters.client" class="form-input">
              <option value="">All Clients</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select v-model="filters.transactionType" class="form-input">
              <option value="">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer-in">Transfer In</option>
              <option value="transfer-out">Transfer Out</option>
              <option value="fee">Fee</option>
              <option value="interest">Interest</option>
              <option value="dividend">Dividend</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
            <div class="flex space-x-2">
              <input v-model.number="filters.minAmount" type="number" step="0.01" class="form-input" placeholder="Min" />
              <input v-model.number="filters.maxAmount" type="number" step="0.01" class="form-input" placeholder="Max" />
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="resetFilters" class="btn btn-secondary">Reset</button>
          <button @click="searchTransactions" class="btn btn-primary">Search</button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-green-600">${{ totalCredits.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Total Credits</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-red-600">${{ totalDebits.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Total Debits</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-blue-600">{{ filteredTransactions.length }}</div>
          <div class="text-xs text-gray-600">Total Transactions</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-gray-900">${{ netBalance.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Net Balance</div>
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Savings Transactions</h3>
        <div class="flex space-x-2">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search transactions" 
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
        <div v-if="filteredTransactions.length === 0" class="text-center py-12">
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p class="text-gray-600 mb-4 font-medium">No data found. No transactions found</p>
          <button @click="addTransaction" class="btn btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Add First Transaction
          </button>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-center">Action</th>
                <th class="text-left">Name</th>
                <th class="text-left">Account#</th>
                <th class="text-right">Ledger Balance</th>
                <th class="text-center">Date</th>
                <th class="text-center">Type</th>
                <th class="text-left">Description</th>
                <th class="text-right">Debit</th>
                <th class="text-right">Credit</th>
                <th class="text-center">Receipt</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="text-center">
                  <div class="flex justify-center space-x-1">
                    <button @click="viewTransaction(transaction)" class="btn btn-xs btn-outline">
                      <EyeIcon class="w-3 h-3" />
                    </button>
                    <button @click="editTransaction(transaction)" class="btn btn-xs btn-outline">
                      <PencilIcon class="w-3 h-3" />
                    </button>
                    <button @click="deleteTransaction(transaction)" class="btn btn-xs btn-danger">
                      <TrashIcon class="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td class="font-medium">
                  <button 
                    @click="viewClient(transaction)"
                    class="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {{ transaction.clientName }}
                  </button>
                </td>
                <td class="font-mono text-sm">
                  <button 
                    @click="viewAccount(transaction)"
                    class="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {{ transaction.accountNumber }}
                  </button>
                </td>
                <td class="text-right font-medium">
                  ${{ transaction.ledgerBalance.toLocaleString() }}
                </td>
                <td class="text-center text-sm">
                  <div>
                    <div>{{ formatDate(transaction.date) }}</div>
                    <div class="text-gray-500">{{ formatTime(transaction.date) }}</div>
                  </div>
                </td>
                <td class="text-center">
                  <span :class="getTransactionTypeClass(transaction.type)" class="badge">
                    {{ transaction.type }}
                  </span>
                </td>
                <td class="text-sm">
                  <div>{{ transaction.description }}</div>
                  <div v-if="transaction.reference" class="text-gray-500 text-xs">
                    Ref: {{ transaction.reference }}
                  </div>
                </td>
                <td class="text-right">
                  <span v-if="transaction.debit" class="font-medium text-red-600">
                    ${{ transaction.debit.toLocaleString() }}
                  </span>
                  <span v-else class="text-gray-400">0.00</span>
                </td>
                <td class="text-right">
                  <span v-if="transaction.credit" class="font-medium text-green-600">
                    ${{ transaction.credit.toLocaleString() }}
                  </span>
                  <span v-else class="text-gray-400">0.00</span>
                </td>
                <td class="text-center">
                  <button 
                    v-if="transaction.hasReceipt"
                    @click="viewReceipt(transaction)"
                    class="btn btn-xs btn-outline"
                  >
                    <DocumentTextIcon class="w-3 h-3" />
                  </button>
                  <span v-else class="text-gray-400">-</span>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 border-t-2 border-gray-200">
              <tr class="font-semibold">
                <td colspan="7" class="font-bold">Total</td>
                <td class="text-right text-red-700">${{ totalDebits.toLocaleString() }}</td>
                <td class="text-right text-green-700">${{ totalCredits.toLocaleString() }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredTransactions.length > 0" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredTransactions.length) }} of {{ filteredTransactions.length }} entries
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { 
  PlusIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon
} from "@heroicons/vue/24/outline";

// Types
interface SavingsTransaction {
  id: string;
  clientName: string;
  accountNumber: string;
  ledgerBalance: number;
  date: Date;
  type: string;
  description: string;
  debit: number;
  credit: number;
  reference?: string;
  hasReceipt: boolean;
  productType: string;
  clientId: string;
}

interface Client {
  id: string;
  name: string;
}

// Reactive data
const router = useRouter();
const searchQuery = ref("");
const entriesPerPage = ref(20);
const currentPage = ref(1);
const showAdvancedSearch = ref(false);

// Filters
const filters = ref({
  fromDate: "",
  toDate: "",
  savingsProduct: "",
  client: "",
  transactionType: "",
  minAmount: null as number | null,
  maxAmount: null as number | null
});

// Mock data
const clients = ref<Client[]>([
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
  { id: "4", name: "Alice Williams" },
  { id: "5", name: "Charlie Brown" }
]);

const transactions = ref<SavingsTransaction[]>([
  {
    id: "1",
    clientName: "John Doe",
    accountNumber: "SAV001234",
    ledgerBalance: 12030,
    date: new Date("2024-03-01 09:30"),
    type: "deposit",
    description: "Initial deposit to savings account",
    debit: 0,
    credit: 1000,
    reference: "DEP001",
    hasReceipt: true,
    productType: "regular-savings",
    clientId: "1"
  },
  {
    id: "2",
    clientName: "Jane Smith",
    accountNumber: "SAV005678",
    ledgerBalance: 19500,
    date: new Date("2024-03-01 14:15"),
    type: "deposit",
    description: "Monthly salary deposit",
    debit: 0,
    credit: 2500,
    reference: "SAL032024",
    hasReceipt: true,
    productType: "premium-savings",
    clientId: "2"
  },
  {
    id: "3",
    clientName: "John Doe",
    accountNumber: "SAV001234",
    ledgerBalance: 11530,
    date: new Date("2024-03-02 11:45"),
    type: "withdrawal",
    description: "ATM withdrawal",
    debit: 500,
    credit: 0,
    reference: "ATM789",
    hasReceipt: true,
    productType: "regular-savings",
    clientId: "1"
  },
  {
    id: "4",
    clientName: "Bob Johnson",
    accountNumber: "SAV009876",
    ledgerBalance: 10415,
    date: new Date("2024-03-02 16:20"),
    type: "interest",
    description: "Monthly interest credit",
    debit: 0,
    credit: 45,
    hasReceipt: false,
    productType: "goal-savings",
    clientId: "3"
  },
  {
    id: "5",
    clientName: "Alice Williams",
    accountNumber: "SAV543210",
    ledgerBalance: 6200,
    date: new Date("2024-03-03 10:00"),
    type: "fee",
    description: "Monthly maintenance fee",
    debit: 25,
    credit: 0,
    reference: "FEE032024",
    hasReceipt: true,
    productType: "susu-collector",
    clientId: "4"
  },
  {
    id: "6",
    clientName: "Charlie Brown",
    accountNumber: "SAV111222",
    ledgerBalance: 16700,
    date: new Date("2024-03-03 15:30"),
    type: "transfer-in",
    description: "Transfer from checking account",
    debit: 0,
    credit: 1500,
    reference: "TRF001",
    hasReceipt: true,
    productType: "regular-savings",
    clientId: "5"
  }
]);

// Computed properties
const filteredTransactions = computed(() => {
  let result = transactions.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(t => 
      t.clientName.toLowerCase().includes(query) ||
      t.accountNumber.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.type.toLowerCase().includes(query)
    );
  }

  if (filters.value.fromDate) {
    const fromDate = new Date(filters.value.fromDate);
    result = result.filter(t => t.date >= fromDate);
  }

  if (filters.value.toDate) {
    const toDate = new Date(filters.value.toDate);
    toDate.setHours(23, 59, 59);
    result = result.filter(t => t.date <= toDate);
  }

  if (filters.value.savingsProduct) {
    result = result.filter(t => t.productType === filters.value.savingsProduct);
  }

  if (filters.value.client) {
    result = result.filter(t => t.clientId === filters.value.client);
  }

  if (filters.value.transactionType) {
    result = result.filter(t => t.type === filters.value.transactionType);
  }

  if (filters.value.minAmount !== null) {
    result = result.filter(t => (t.debit + t.credit) >= filters.value.minAmount!);
  }

  if (filters.value.maxAmount !== null) {
    result = result.filter(t => (t.debit + t.credit) <= filters.value.maxAmount!);
  }

  return result;
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedTransactions = computed(() => {
  return filteredTransactions.value.slice(startIndex.value, endIndex.value);
});

const totalCredits = computed(() => {
  return filteredTransactions.value.reduce((sum, t) => sum + t.credit, 0);
});

const totalDebits = computed(() => {
  return filteredTransactions.value.reduce((sum, t) => sum + t.debit, 0);
});

const netBalance = computed(() => {
  return totalCredits.value - totalDebits.value;
});

// Methods
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const getTransactionTypeClass = (type: string) => {
  const classes: { [key: string]: string } = {
    deposit: "badge-success",
    credit: "badge-success", 
    withdrawal: "badge-danger",
    debit: "badge-danger",
    "transfer-in": "badge-info",
    "transfer-out": "badge-warning",
    fee: "badge-warning",
    interest: "badge-primary",
    dividend: "badge-secondary"
  };
  return classes[type] || "badge-secondary";
};

const resetFilters = () => {
  filters.value = {
    fromDate: "",
    toDate: "",
    savingsProduct: "",
    client: "",
    transactionType: "",
    minAmount: null,
    maxAmount: null
  };
  currentPage.value = 1;
};

const searchTransactions = () => {
  currentPage.value = 1;
  alert("Search applied with current filters");
};

const exportTransactions = () => {
  alert("Export functionality would generate PDF/Excel with filtered transactions");
};

const addTransaction = () => {
  alert("Add Transaction modal would open here");
};

const viewTransaction = (transaction: SavingsTransaction) => {
  alert(`View transaction details for ${transaction.id}`);
};

const editTransaction = (transaction: SavingsTransaction) => {
  alert(`Edit transaction ${transaction.id}`);
};

const deleteTransaction = (transaction: SavingsTransaction) => {
  if (confirm("Are you sure you want to delete this transaction?")) {
    const index = transactions.value.findIndex(t => t.id === transaction.id);
    if (index > -1) {
      transactions.value.splice(index, 1);
      alert("Transaction deleted successfully");
    }
  }
};

const viewClient = (transaction: SavingsTransaction) => {
  alert(`View client details for: ${transaction.clientName}`);
};

const viewAccount = (transaction: SavingsTransaction) => {
  alert(`View account details for: ${transaction.accountNumber}`);
};

const viewReceipt = (transaction: SavingsTransaction) => {
  alert(`View receipt for transaction: ${transaction.reference}`);
};

// Lifecycle
onMounted(() => {
  // Set default date range to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  filters.value.fromDate = firstDay.toISOString().split('T')[0];
  filters.value.toDate = today.toISOString().split('T')[0];
});

defineOptions({
  name: "SavingsTransactionsList",
});
</script>
