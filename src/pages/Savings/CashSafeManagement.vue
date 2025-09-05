<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Cash Safe Management</h1>
        <p class="mt-1 text-sm text-gray-500">
          Often cooperatives that accept savings accounts have cash safes for storage of notes and coins. 
          These are given to the tellers for daily use. Below you can add cash safes, and vaults. 
          Then you can add tellers (from registered staff) who will disburse that cash to people visiting the branch. 
          This will help keep a track of how much balance is remaining with tellers at end of day.
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="addCashSafe" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Cash Safe
        </button>
        <button @click="addTeller" class="btn btn-secondary">
          <UserPlusIcon class="w-4 h-4 mr-2" />
          Add Teller
        </button>
        <button @click="recordTransfer" class="btn btn-secondary">
          <ArrowsRightLeftIcon class="w-4 h-4 mr-2" />
          Record Transfer
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-primary-600">{{ totalCashBalance.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Total Cash Balance</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-green-600">{{ activeTellers }}</div>
          <div class="text-sm text-gray-600">Active Tellers</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-blue-600">{{ cashSafes.length }}</div>
          <div class="text-sm text-gray-600">Cash Safes</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-orange-600">{{ todayTransactions }}</div>
          <div class="text-sm text-gray-600">Today's Transactions</div>
        </div>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Date Range</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input v-model="filters.fromDate" type="date" class="form-input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Time</label>
          <input v-model="filters.fromTime" type="time" class="form-input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input v-model="filters.toDate" type="date" class="form-input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Time</label>
          <input v-model="filters.toTime" type="time" class="form-input" />
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">SOURCES:</label>
          <select v-model="filters.source" class="form-input">
            <option value="">All Sources</option>
            <option v-for="safe in cashSafes" :key="safe.id" :value="safe.id">
              {{ safe.name }} ({{ safe.type }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">TELLERS:</label>
          <select v-model="filters.teller" class="form-input">
            <option value="">All Tellers</option>
            <option v-for="teller in tellers" :key="teller.id" :value="teller.id">
              {{ teller.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">TRANSACTIONS:</label>
          <select v-model="filters.transactionType" class="form-input">
            <option value="">All Transaction Types</option>
            <option value="allocation">Allocation</option>
            <option value="return">Return</option>
            <option value="transfer">Transfer</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end space-x-3">
        <button @click="resetFilters" class="btn btn-secondary">
          Reset Filters
        </button>
        <button @click="applyFilters" class="btn btn-primary">
          Apply Filters
        </button>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Transactions</h3>
        <div class="flex space-x-2">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search transactions..." 
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
        <div v-if="filteredTransactions.length === 0" class="text-center py-8">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p class="text-gray-600 mb-4">No data found. No transactions accounts found.</p>
          <button @click="recordTransfer" class="btn btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Record First Transaction
          </button>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>To</th>
                <th>Notes Transferred</th>
                <th>Coins Transferred</th>
                <th>Description</th>
                <th>Staff</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
                <td>
                  <div>
                    <div class="font-medium">{{ formatDate(transaction.date) }}</div>
                    <div class="text-sm text-gray-500">{{ formatTime(transaction.date) }}</div>
                  </div>
                </td>
                <td>
                  <span class="font-medium">{{ transaction.from }}</span>
                </td>
                <td>
                  <span class="font-medium">{{ transaction.to }}</span>
                </td>
                <td>
                  <span class="text-green-600">${{ transaction.notesAmount.toLocaleString() }}</span>
                </td>
                <td>
                  <span class="text-blue-600">${{ transaction.coinsAmount.toFixed(2) }}</span>
                </td>
                <td>
                  <div>
                    <div class="text-sm">{{ transaction.description }}</div>
                    <span :class="getTransactionTypeClass(transaction.type)" class="badge mt-1">
                      {{ transaction.type }}
                    </span>
                  </div>
                </td>
                <td>{{ transaction.staff }}</td>
                <td>
                  <div class="flex space-x-2">
                    <button @click="viewTransaction(transaction)" class="btn btn-sm btn-outline">
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button @click="editTransaction(transaction)" class="btn btn-sm btn-outline">
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button @click="deleteTransaction(transaction)" class="btn btn-sm btn-danger">
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
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

    <!-- Cash Safe & Teller Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Cash Safes -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Cash Safes & Vaults</h3>
          <button @click="addCashSafe" class="btn btn-sm btn-primary">
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>
        <div class="card-body">
          <div v-if="cashSafes.length === 0" class="text-center py-4">
            <p class="text-gray-600">No cash safes configured</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="safe in cashSafes" :key="safe.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div class="font-medium">{{ safe.name }}</div>
                <div class="text-sm text-gray-600">
                  Type: {{ safe.type }} | Balance: ${{ safe.balance.toLocaleString() }}
                </div>
              </div>
              <div class="flex space-x-2">
                <button @click="editCashSafe(safe)" class="btn btn-sm btn-outline">
                  <PencilIcon class="w-3 h-3" />
                </button>
                <button @click="viewCashSafeHistory(safe)" class="btn btn-sm btn-outline">
                  <ClockIcon class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Tellers -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Active Tellers</h3>
          <button @click="addTeller" class="btn btn-sm btn-primary">
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>
        <div class="card-body">
          <div v-if="tellers.length === 0" class="text-center py-4">
            <p class="text-gray-600">No active tellers</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="teller in tellers" :key="teller.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div class="font-medium">{{ teller.name }}</div>
                <div class="text-sm text-gray-600">
                  Cash: ${{ teller.cashBalance.toLocaleString() }} | Status: 
                  <span :class="teller.isActive ? 'text-green-600' : 'text-gray-500'">
                    {{ teller.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2">
                <button @click="viewTellerActivity(teller)" class="btn btn-sm btn-outline">
                  <ChartBarIcon class="w-3 h-3" />
                </button>
                <button @click="endOfDay(teller)" class="btn btn-sm btn-warning">
                  EOD
                </button>
              </div>
            </div>
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
  UserPlusIcon, 
  ArrowsRightLeftIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  ChartBarIcon
} from "@heroicons/vue/24/outline";

// Types
interface CashTransaction {
  id: string;
  date: Date;
  from: string;
  to: string;
  notesAmount: number;
  coinsAmount: number;
  description: string;
  type: string;
  staff: string;
}

interface CashSafe {
  id: string;
  name: string;
  type: string;
  balance: number;
  branch: string;
}

interface Teller {
  id: string;
  name: string;
  cashBalance: number;
  isActive: boolean;
  assignedSafe: string;
}

// Reactive data
const router = useRouter();
const searchQuery = ref("");
const entriesPerPage = ref(20);
const currentPage = ref(1);

// Filter state
const filters = ref({
  fromDate: "",
  fromTime: "00:00",
  toDate: "",
  toTime: "23:59",
  source: "",
  teller: "",
  transactionType: ""
});

// Mock data
const transactions = ref<CashTransaction[]>([
  {
    id: "1",
    date: new Date("2024-03-01 09:00"),
    from: "Main Vault",
    to: "Teller 1 - John Doe",
    notesAmount: 5000,
    coinsAmount: 250.50,
    description: "Morning cash allocation",
    type: "allocation",
    staff: "Admin"
  },
  {
    id: "2",
    date: new Date("2024-03-01 17:30"),
    from: "Teller 1 - John Doe",
    to: "Main Vault",
    notesAmount: 3500,
    coinsAmount: 180.25,
    description: "End of day return",
    type: "return",
    staff: "John Doe"
  },
  {
    id: "3",
    date: new Date("2024-03-02 09:15"),
    from: "Main Vault",
    to: "Teller 2 - Jane Smith",
    notesAmount: 4000,
    coinsAmount: 200.00,
    description: "Morning cash allocation",
    type: "allocation",
    staff: "Admin"
  }
]);

const cashSafes = ref<CashSafe[]>([
  {
    id: "1",
    name: "Main Vault",
    type: "Vault",
    balance: 50000,
    branch: "Branch #1"
  },
  {
    id: "2",
    name: "Secondary Safe",
    type: "Safe",
    balance: 15000,
    branch: "Branch #1"
  }
]);

const tellers = ref<Teller[]>([
  {
    id: "1",
    name: "John Doe",
    cashBalance: 1500,
    isActive: true,
    assignedSafe: "Main Vault"
  },
  {
    id: "2",
    name: "Jane Smith",
    cashBalance: 3800,
    isActive: true,
    assignedSafe: "Main Vault"
  },
  {
    id: "3",
    name: "Bob Johnson",
    cashBalance: 0,
    isActive: false,
    assignedSafe: "Secondary Safe"
  }
]);

// Computed properties
const totalCashBalance = computed(() => {
  return cashSafes.value.reduce((sum, safe) => sum + safe.balance, 0) +
         tellers.value.reduce((sum, teller) => sum + teller.cashBalance, 0);
});

const activeTellers = computed(() => {
  return tellers.value.filter(t => t.isActive).length;
});

const todayTransactions = computed(() => {
  const today = new Date().toDateString();
  return transactions.value.filter(t => t.date.toDateString() === today).length;
});

const filteredTransactions = computed(() => {
  let result = transactions.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(t => 
      t.from.toLowerCase().includes(query) ||
      t.to.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.staff.toLowerCase().includes(query)
    );
  }

  if (filters.value.source) {
    result = result.filter(t => 
      t.from.includes(filters.value.source) || t.to.includes(filters.value.source)
    );
  }

  if (filters.value.teller) {
    result = result.filter(t => 
      t.from.includes(filters.value.teller) || t.to.includes(filters.value.teller)
    );
  }

  if (filters.value.transactionType) {
    result = result.filter(t => t.type === filters.value.transactionType);
  }

  return result;
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedTransactions = computed(() => {
  return filteredTransactions.value.slice(startIndex.value, endIndex.value);
});

// Methods
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
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
    allocation: "badge-primary",
    return: "badge-secondary",
    transfer: "badge-info",
    deposit: "badge-success",
    withdrawal: "badge-warning"
  };
  return classes[type] || "badge-secondary";
};

const resetFilters = () => {
  filters.value = {
    fromDate: "",
    fromTime: "00:00",
    toDate: "",
    toTime: "23:59",
    source: "",
    teller: "",
    transactionType: ""
  };
};

const applyFilters = () => {
  // Filter logic is handled by computed property
  currentPage.value = 1;
  alert("Filters applied!");
};

const addCashSafe = () => {
  alert("Add Cash Safe modal would open here");
};

const addTeller = () => {
  alert("Add Teller modal would open here");
};

const recordTransfer = () => {
  alert("Record Transfer modal would open here");
};

const viewTransaction = (transaction: CashTransaction) => {
  alert(`View transaction details for ${transaction.id}`);
};

const editTransaction = (transaction: CashTransaction) => {
  alert(`Edit transaction ${transaction.id}`);
};

const deleteTransaction = (transaction: CashTransaction) => {
  if (confirm(`Are you sure you want to delete this transaction?`)) {
    const index = transactions.value.findIndex(t => t.id === transaction.id);
    if (index > -1) {
      transactions.value.splice(index, 1);
    }
  }
};

const editCashSafe = (safe: CashSafe) => {
  alert(`Edit cash safe: ${safe.name}`);
};

const viewCashSafeHistory = (safe: CashSafe) => {
  alert(`View history for: ${safe.name}`);
};

const viewTellerActivity = (teller: Teller) => {
  alert(`View activity for teller: ${teller.name}`);
};

const endOfDay = (teller: Teller) => {
  if (confirm(`Perform end of day for ${teller.name}?`)) {
    alert(`End of day process initiated for ${teller.name}`);
  }
};

// Lifecycle
onMounted(() => {
  // Set default date range to today
  const today = new Date().toISOString().split('T')[0];
  filters.value.fromDate = today;
  filters.value.toDate = today;
});

defineOptions({
  name: "CashSafeManagement",
});
</script>