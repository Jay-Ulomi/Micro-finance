<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Approve Transactions</h1>
        <p class="text-sm text-gray-600">Review and approve pending savings transactions from staff members</p>
      </div>
      <div class="flex space-x-3">
        <button @click="bulkApprove" :disabled="selectedTransactions.length === 0" class="btn btn-success">
          <CheckIcon class="w-4 h-4 mr-2" />
          Bulk Approve ({{ selectedTransactions.length }})
        </button>
        <button @click="bulkReject" :disabled="selectedTransactions.length === 0" class="btn btn-danger">
          <XMarkIcon class="w-4 h-4 mr-2" />
          Bulk Reject ({{ selectedTransactions.length }})
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select v-model="filters.transactionType" class="form-input">
              <option value="">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
              <option value="interest">Interest</option>
              <option value="fee">Fee</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <input v-model="filters.client" type="text" placeholder="Search client name" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
            <div class="flex space-x-2">
              <input v-model.number="filters.minAmount" type="number" step="0.01" class="form-input" placeholder="Min" />
              <input v-model.number="filters.maxAmount" type="number" step="0.01" class="form-input" placeholder="Max" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
            <div class="relative">
              <input 
                v-model="staffSearchQuery"
                @input="filterStaff"
                @focus="showStaffDropdown = true"
                type="text" 
                placeholder="Click in the box above to select multiple staff"
                class="form-input pr-10"
              />
              <ChevronDownIcon class="w-5 h-5 text-gray-400 absolute right-3 top-3" />
              
              <!-- Staff Dropdown -->
              <div v-if="showStaffDropdown" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div v-for="staff in filteredStaff" :key="staff.id" class="p-2 hover:bg-gray-50 cursor-pointer">
                  <label class="flex items-center">
                    <input 
                      v-model="selectedStaff"
                      :value="staff.id"
                      type="checkbox"
                      class="form-checkbox"
                    />
                    <span class="ml-2">{{ staff.name }}</span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Selected Staff Tags -->
            <div v-if="selectedStaff.length > 0" class="flex flex-wrap gap-2 mt-2">
              <span 
                v-for="staffId in selectedStaff" 
                :key="staffId"
                class="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {{ getStaffName(staffId) }}
                <button @click="removeStaff(staffId)" class="ml-1 text-blue-600 hover:text-blue-800">
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="resetFilters" class="btn btn-secondary">Reset</button>
          <button @click="searchTransactions" class="btn btn-primary">Search</button>
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Pending Transactions</h3>
        <div class="flex space-x-2">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search transactions" 
            class="form-input w-64" 
          />
          <select v-model="entriesPerPage" class="form-select">
            <option value="10">Show 10 entries</option>
            <option value="25">Show 25 entries</option>
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-gray-600 mb-4 font-medium">No pending savings transactions found for approval.</p>
          <p class="text-sm text-gray-500 mb-4">
            To restrict staff so they can only add transactions for approval, visit 
            <span class="font-medium">Admin (top menu) → Staff → Edit</span>. 
            There, check <span class="font-medium">"Restrict Add/Edit Savings Transactions for Approval"</span>.
          </p>
          <button @click="goToStaffSettings" class="btn btn-primary">
            <CogIcon class="w-4 h-4 mr-2" />
            Configure Staff Permissions
          </button>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-center w-12">
                  <input 
                    type="checkbox"
                    :checked="areAllSelected"
                    @change="toggleSelectAll"
                    class="form-checkbox"
                  />
                </th>
                <th class="text-center">Action</th>
                <th class="text-right">Debit</th>
                <th class="text-right">Credit</th>
                <th class="text-center">Date</th>
                <th class="text-left">Name</th>
                <th class="text-left">Account#</th>
                <th class="text-left">Staff</th>
                <th class="text-center">Staff-Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="text-center">
                  <input 
                    type="checkbox"
                    :checked="selectedTransactions.includes(transaction.id)"
                    @change="toggleTransactionSelection(transaction.id)"
                    class="form-checkbox"
                  />
                </td>
                <td class="text-center">
                  <div class="flex justify-center space-x-1">
                    <button @click="approveTransaction(transaction)" class="btn btn-xs btn-success">
                      <CheckIcon class="w-3 h-3" />
                    </button>
                    <button @click="rejectTransaction(transaction)" class="btn btn-xs btn-danger">
                      <XMarkIcon class="w-3 h-3" />
                    </button>
                    <button @click="viewTransaction(transaction)" class="btn btn-xs btn-outline">
                      <EyeIcon class="w-3 h-3" />
                    </button>
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
                <td class="text-center text-sm">
                  <div>{{ formatDate(transaction.date) }}</div>
                  <div class="text-gray-500">{{ formatTime(transaction.date) }}</div>
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
                <td>
                  <div class="flex items-center">
                    <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      <span class="text-xs font-medium text-gray-600">
                        {{ getStaffInitials(transaction.staffId) }}
                      </span>
                    </div>
                    <div>
                      <div class="text-sm font-medium">{{ getStaffName(transaction.staffId) }}</div>
                      <div class="text-xs text-gray-500">{{ transaction.staffRole }}</div>
                    </div>
                  </div>
                </td>
                <td class="text-center text-sm">
                  <div>{{ formatDate(transaction.submittedAt) }}</div>
                  <div class="text-gray-500">{{ formatTime(transaction.submittedAt) }}</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { 
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
  EyeIcon,
  CogIcon
} from "@heroicons/vue/24/outline";

// Types
interface PendingTransaction {
  id: string;
  clientName: string;
  accountNumber: string;
  date: Date;
  type: string;
  description: string;
  debit: number;
  credit: number;
  staffId: string;
  staffRole: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface Staff {
  id: string;
  name: string;
  initials: string;
  role: string;
}

// Reactive data
const router = useRouter();
const searchQuery = ref("");
const entriesPerPage = ref(50);
const currentPage = ref(1);
const showAdvancedSearch = ref(false);
const showStaffDropdown = ref(false);
const staffSearchQuery = ref("");
const selectedStaff = ref<string[]>([]);
const selectedTransactions = ref<string[]>([]);

// Filters
const filters = ref({
  fromDate: "",
  toDate: "",
  transactionType: "",
  client: "",
  minAmount: null as number | null,
  maxAmount: null as number | null
});

// Mock staff data
const staff = ref<Staff[]>([
  { id: "1", name: "edwin simon", initials: "ES", role: "Teller" },
  { id: "2", name: "Joseph Ulomi", initials: "JU", role: "Loan Officer" },
  { id: "3", name: "Sarah Johnson", initials: "SJ", role: "Manager" },
  { id: "4", name: "Michael Brown", initials: "MB", role: "Teller" },
  { id: "5", name: "Emily Davis", initials: "ED", role: "Supervisor" }
]);

// Mock pending transactions data (empty by default as shown in the original)
const pendingTransactions = ref<PendingTransaction[]>([
  // Uncomment the below to see sample data:
  /*
  {
    id: "1",
    clientName: "John Doe",
    accountNumber: "SAV001234",
    date: new Date("2024-09-04 10:30"),
    type: "deposit",
    description: "Cash deposit pending approval",
    debit: 0,
    credit: 1500,
    staffId: "1",
    staffRole: "Teller",
    submittedAt: new Date("2024-09-04 10:32"),
    status: 'pending'
  },
  {
    id: "2",
    clientName: "Jane Smith",
    accountNumber: "SAV005678",
    date: new Date("2024-09-04 11:15"),
    type: "withdrawal",
    description: "Cash withdrawal pending approval",
    debit: 750,
    credit: 0,
    staffId: "2",
    staffRole: "Loan Officer",
    submittedAt: new Date("2024-09-04 11:18"),
    status: 'pending'
  }
  */
]);

// Computed properties
const filteredStaff = computed(() => {
  if (!staffSearchQuery.value) return staff.value;
  return staff.value.filter(s => 
    s.name.toLowerCase().includes(staffSearchQuery.value.toLowerCase())
  );
});

const filteredTransactions = computed(() => {
  let result = pendingTransactions.value.filter(t => t.status === 'pending');

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(t => 
      t.clientName.toLowerCase().includes(query) ||
      t.accountNumber.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
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

  if (filters.value.transactionType) {
    result = result.filter(t => t.type === filters.value.transactionType);
  }

  if (filters.value.client) {
    const query = filters.value.client.toLowerCase();
    result = result.filter(t => t.clientName.toLowerCase().includes(query));
  }

  if (selectedStaff.value.length > 0) {
    result = result.filter(t => selectedStaff.value.includes(t.staffId));
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

const areAllSelected = computed(() => {
  return paginatedTransactions.value.length > 0 && 
    paginatedTransactions.value.every(t => selectedTransactions.value.includes(t.id));
});

// Methods
const getStaffName = (staffId: string): string => {
  return staff.value.find(s => s.id === staffId)?.name || 'Unknown';
};

const getStaffInitials = (staffId: string): string => {
  return staff.value.find(s => s.id === staffId)?.initials || '?';
};

const filterStaff = () => {
  // Filter is handled by computed property
};

const removeStaff = (staffId: string) => {
  const index = selectedStaff.value.indexOf(staffId);
  if (index > -1) {
    selectedStaff.value.splice(index, 1);
  }
};

const toggleSelectAll = () => {
  if (areAllSelected.value) {
    // Deselect all current page items
    paginatedTransactions.value.forEach(t => {
      const index = selectedTransactions.value.indexOf(t.id);
      if (index > -1) {
        selectedTransactions.value.splice(index, 1);
      }
    });
  } else {
    // Select all current page items
    paginatedTransactions.value.forEach(t => {
      if (!selectedTransactions.value.includes(t.id)) {
        selectedTransactions.value.push(t.id);
      }
    });
  }
};

const toggleTransactionSelection = (transactionId: string) => {
  const index = selectedTransactions.value.indexOf(transactionId);
  if (index > -1) {
    selectedTransactions.value.splice(index, 1);
  } else {
    selectedTransactions.value.push(transactionId);
  }
};

const resetFilters = () => {
  filters.value = {
    fromDate: "",
    toDate: "",
    transactionType: "",
    client: "",
    minAmount: null,
    maxAmount: null
  };
  selectedStaff.value = [];
  staffSearchQuery.value = "";
  currentPage.value = 1;
};

const searchTransactions = () => {
  currentPage.value = 1;
  showStaffDropdown.value = false;
};

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

const approveTransaction = (transaction: PendingTransaction) => {
  if (confirm(`Approve transaction of $${(transaction.debit + transaction.credit).toLocaleString()} for ${transaction.clientName}?`)) {
    transaction.status = 'approved';
    selectedTransactions.value = selectedTransactions.value.filter(id => id !== transaction.id);
    alert("Transaction approved successfully!");
  }
};

const rejectTransaction = (transaction: PendingTransaction) => {
  const reason = prompt("Please provide a reason for rejection:");
  if (reason) {
    transaction.status = 'rejected';
    selectedTransactions.value = selectedTransactions.value.filter(id => id !== transaction.id);
    alert("Transaction rejected successfully!");
  }
};

const viewTransaction = (transaction: PendingTransaction) => {
  alert(`View transaction details for ${transaction.id}`);
};

const viewClient = (transaction: PendingTransaction) => {
  alert(`View client details for: ${transaction.clientName}`);
};

const viewAccount = (transaction: PendingTransaction) => {
  alert(`View account details for: ${transaction.accountNumber}`);
};

const bulkApprove = () => {
  if (selectedTransactions.value.length === 0) return;
  
  if (confirm(`Approve ${selectedTransactions.value.length} selected transactions?`)) {
    selectedTransactions.value.forEach(id => {
      const transaction = pendingTransactions.value.find(t => t.id === id);
      if (transaction) {
        transaction.status = 'approved';
      }
    });
    selectedTransactions.value = [];
    alert("Selected transactions approved successfully!");
  }
};

const bulkReject = () => {
  if (selectedTransactions.value.length === 0) return;
  
  const reason = prompt("Please provide a reason for bulk rejection:");
  if (reason) {
    selectedTransactions.value.forEach(id => {
      const transaction = pendingTransactions.value.find(t => t.id === id);
      if (transaction) {
        transaction.status = 'rejected';
      }
    });
    selectedTransactions.value = [];
    alert("Selected transactions rejected successfully!");
  }
};

const goToStaffSettings = () => {
  alert("Navigate to Admin → Staff → Edit to configure transaction approval restrictions");
};

// Close staff dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    showStaffDropdown.value = false;
  }
};

// Add event listener for clicking outside
document.addEventListener('click', handleClickOutside);

defineOptions({
  name: "ApproveTransactions",
});
</script>