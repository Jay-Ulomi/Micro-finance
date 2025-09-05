<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Savings Report</h1>
        <p class="mt-1 text-sm text-gray-500">
          Detailed report showing individual client savings accounts and their transaction summaries
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportReport" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Report
        </button>
        <button @click="addSavingsAccount" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Savings Account
        </button>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Date Range</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input v-model="dateRange.fromDate" type="date" class="form-input" @change="updateDateRange" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Time</label>
          <input v-model="dateRange.fromTime" type="time" class="form-input" @change="updateDateRange" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input v-model="dateRange.toDate" type="date" class="form-input" @change="updateDateRange" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Time</label>
          <input v-model="dateRange.toTime" type="time" class="form-input" @change="updateDateRange" />
        </div>
      </div>
      <div class="mt-4">
        <p class="text-sm text-gray-600">
          {{ dateRangeDescription }}
        </p>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-3">
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-green-600">${{ totalDeposits.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Deposits</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-blue-600">${{ totalTransferIn.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Transfer In</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-red-600">${{ totalWithdrawals.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Withdrawals</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-orange-600">${{ totalFees.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Fees</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-purple-600">${{ totalInterest.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Interest</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-indigo-600">${{ totalDividends.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Dividends</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-yellow-600">${{ totalTransferOut.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Transfer Out</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-pink-600">${{ totalCommissions.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Commissions</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-3">
          <div class="text-lg font-bold text-gray-900">${{ totalBalance.toLocaleString() }}</div>
          <div class="text-xs text-gray-600">Total Balance</div>
        </div>
      </div>
    </div>

    <!-- Main Report Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Savings Accounts</h3>
        <div class="flex space-x-2">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search savings" 
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
        <div v-if="filteredAccounts.length === 0" class="text-center py-12">
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
          <p class="text-gray-600 mb-4 font-medium">No data found. No savings accounts found.</p>
          <button @click="addSavingsAccount" class="btn btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Add First Savings Account
          </button>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-left">Client</th>
                <th class="text-left">Savings Product</th>
                <th class="text-left">Savings Account #</th>
                <th class="text-right">Deposits</th>
                <th class="text-right">Transfer In</th>
                <th class="text-right">Withdrawals</th>
                <th class="text-right">Fees</th>
                <th class="text-right">Interest</th>
                <th class="text-right">Dividends</th>
                <th class="text-right">Transfer Out</th>
                <th class="text-right">Commissions</th>
                <th class="text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in paginatedAccounts" :key="account.id" class="hover:bg-gray-50">
                <td class="font-medium">
                  <button 
                    @click="viewClientDetails(account)"
                    class="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {{ account.clientName }}
                  </button>
                </td>
                <td class="text-gray-900">{{ account.productName }}</td>
                <td class="font-mono text-sm">
                  <button 
                    @click="viewAccountDetails(account)"
                    class="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {{ account.accountNumber }}
                  </button>
                </td>
                <td class="text-right text-green-600 font-medium">
                  ${{ account.deposits.toLocaleString() }}
                </td>
                <td class="text-right text-blue-600 font-medium">
                  ${{ account.transferIn.toLocaleString() }}
                </td>
                <td class="text-right text-red-600 font-medium">
                  ${{ account.withdrawals.toLocaleString() }}
                </td>
                <td class="text-right text-orange-600 font-medium">
                  ${{ account.fees.toLocaleString() }}
                </td>
                <td class="text-right text-purple-600 font-medium">
                  ${{ account.interest.toLocaleString() }}
                </td>
                <td class="text-right text-indigo-600 font-medium">
                  ${{ account.dividends.toLocaleString() }}
                </td>
                <td class="text-right text-yellow-600 font-medium">
                  ${{ account.transferOut.toLocaleString() }}
                </td>
                <td class="text-right text-pink-600 font-medium">
                  ${{ account.commissions.toLocaleString() }}
                </td>
                <td class="text-right font-bold text-gray-900">
                  ${{ account.balance.toLocaleString() }}
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 border-t-2 border-gray-200">
              <tr class="font-semibold">
                <td colspan="3" class="font-bold">Total</td>
                <td class="text-right text-green-700">${{ totalDeposits.toLocaleString() }}</td>
                <td class="text-right text-blue-700">${{ totalTransferIn.toLocaleString() }}</td>
                <td class="text-right text-red-700">${{ totalWithdrawals.toLocaleString() }}</td>
                <td class="text-right text-orange-700">${{ totalFees.toLocaleString() }}</td>
                <td class="text-right text-purple-700">${{ totalInterest.toLocaleString() }}</td>
                <td class="text-right text-indigo-700">${{ totalDividends.toLocaleString() }}</td>
                <td class="text-right text-yellow-700">${{ totalTransferOut.toLocaleString() }}</td>
                <td class="text-right text-pink-700">${{ totalCommissions.toLocaleString() }}</td>
                <td class="text-right font-bold text-gray-900 text-lg">${{ totalBalance.toLocaleString() }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredAccounts.length > 0" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredAccounts.length) }} of {{ filteredAccounts.length }} entries
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

    <!-- Account Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Clients by Balance -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Top Clients by Balance</h3>
        </div>
        <div class="card-body">
          <div v-if="topClientsByBalance.length === 0" class="text-center py-4">
            <p class="text-gray-600">No account data available</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="(account, index) in topClientsByBalance" :key="account.id" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {{ index + 1 }}
                </div>
                <div>
                  <div class="font-medium">{{ account.clientName }}</div>
                  <div class="text-sm text-gray-600">{{ account.accountNumber }} - {{ account.productName }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-green-600">${{ account.balance.toLocaleString() }}</div>
                <div class="text-sm text-gray-500">Balance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Summary -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Account Summary</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Accounts</span>
              <span class="font-medium">{{ accounts.length }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Active Accounts</span>
              <span class="font-medium text-green-600">{{ activeAccountsCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Average Balance</span>
              <span class="font-medium">${{ averageBalance.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Largest Account</span>
              <span class="font-medium text-green-600">${{ largestAccountBalance.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Interest Earned</span>
              <span class="font-medium text-purple-600">${{ totalInterest.toLocaleString() }}</span>
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
  DocumentArrowDownIcon,
  PlusIcon
} from "@heroicons/vue/24/outline";

// Types
interface SavingsAccountReport {
  id: string;
  clientName: string;
  productName: string;
  accountNumber: string;
  deposits: number;
  transferIn: number;
  withdrawals: number;
  fees: number;
  interest: number;
  dividends: number;
  transferOut: number;
  commissions: number;
  balance: number;
  status: string;
}

// Reactive data
const router = useRouter();
const searchQuery = ref("");
const entriesPerPage = ref(20);
const currentPage = ref(1);

// Date range
const dateRange = ref({
  fromDate: "2020-09-04",
  fromTime: "00:00",
  toDate: "2025-09-04", 
  toTime: "23:59"
});

// Mock account data
const accounts = ref<SavingsAccountReport[]>([
  {
    id: "1",
    clientName: "John Doe",
    productName: "Regular Savings",
    accountNumber: "SAV001234",
    deposits: 15000,
    transferIn: 2500,
    withdrawals: 5000,
    fees: 25,
    interest: 450,
    dividends: 120,
    transferOut: 1000,
    commissions: 15,
    balance: 12030,
    status: "active"
  },
  {
    id: "2",
    clientName: "Jane Smith",
    productName: "Premium Savings",
    accountNumber: "SAV005678",
    deposits: 25000,
    transferIn: 3000,
    withdrawals: 8000,
    fees: 50,
    interest: 875,
    dividends: 200,
    transferOut: 1500,
    commissions: 25,
    balance: 19500,
    status: "active"
  },
  {
    id: "3",
    clientName: "Bob Johnson",
    productName: "Goal Savings",
    accountNumber: "SAV009876",
    deposits: 12000,
    transferIn: 1500,
    withdrawals: 3000,
    fees: 15,
    interest: 360,
    dividends: 80,
    transferOut: 500,
    commissions: 10,
    balance: 10415,
    status: "active"
  },
  {
    id: "4",
    clientName: "Alice Williams",
    productName: "SUSU Collector",
    accountNumber: "SAV543210",
    deposits: 8000,
    transferIn: 1000,
    withdrawals: 2500,
    fees: 40,
    interest: 120,
    dividends: 0,
    transferOut: 300,
    commissions: 80,
    balance: 6200,
    status: "active"
  },
  {
    id: "5",
    clientName: "Charlie Brown",
    productName: "Regular Savings",
    accountNumber: "SAV111222",
    deposits: 20000,
    transferIn: 5000,
    withdrawals: 7000,
    fees: 30,
    interest: 600,
    dividends: 150,
    transferOut: 2000,
    commissions: 20,
    balance: 16700,
    status: "active"
  }
]);

// Computed properties
const dateRangeDescription = computed(() => {
  const fromDate = new Date(`${dateRange.value.fromDate} ${dateRange.value.fromTime}`);
  const toDate = new Date(`${dateRange.value.toDate} ${dateRange.value.toTime}`);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short',
      year: '2-digit'
    });
  };
  
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  return `Savings accounts which have transactions between ${formatDate(fromDate)}, ${formatTime(dateRange.value.fromTime)} - ${formatDate(toDate)}, ${formatTime(dateRange.value.toTime)} are shown below. You can edit the dates above.`;
});

const filteredAccounts = computed(() => {
  if (!searchQuery.value) return accounts.value;
  
  const query = searchQuery.value.toLowerCase();
  return accounts.value.filter(account => 
    account.clientName.toLowerCase().includes(query) ||
    account.productName.toLowerCase().includes(query) ||
    account.accountNumber.toLowerCase().includes(query)
  );
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedAccounts = computed(() => {
  return filteredAccounts.value.slice(startIndex.value, endIndex.value);
});

const totalDeposits = computed(() => {
  return filteredAccounts.value.reduce((sum, a) => sum + a.deposits, 0);
});

const totalTransferIn = computed(() => {
  return filteredAccounts.value.reduce((sum, a) => sum + a.transferIn, 0);
});

const totalWithdrawals = computed(() => {
  return filteredAccounts.value.reduce((sum, a) => sum + a.withdrawals, 0);
});

const totalFees = computed(() => {
  return filteredAccounts.value.reduce((sum, a) => sum + a.fees, 0);
});

const totalInterest = computed(() => {
  return filteredAccounts.value.reduce((sum, a) => sum + a.interest, 0);
});

const totalDividends = computed(() => {
  return filteredAccounts.value.reduce((sum, a) => sum + a.dividends, 0);
});

const totalTransferOut = computed(() => {
  return filteredAccounts.value.reduce((sum, a) => sum + a.transferOut, 0);
});

const totalCommissions = computed(() => {
  return filteredAccounts.value.reduce((sum, a) => sum + a.commissions, 0);
});

const totalBalance = computed(() => {
  return filteredAccounts.value.reduce((sum, a) => sum + a.balance, 0);
});

const topClientsByBalance = computed(() => {
  return [...accounts.value]
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);
});

const activeAccountsCount = computed(() => {
  return accounts.value.filter(a => a.status === 'active').length;
});

const averageBalance = computed(() => {
  if (accounts.value.length === 0) return 0;
  return totalBalance.value / accounts.value.length;
});

const largestAccountBalance = computed(() => {
  return Math.max(...accounts.value.map(a => a.balance));
});

// Methods
const updateDateRange = () => {
  console.log('Date range updated:', dateRange.value);
};

const exportReport = () => {
  alert('Export functionality would generate PDF/Excel report with all account details');
};

const addSavingsAccount = () => {
  router.push('/savings/create');
};

const viewClientDetails = (account: SavingsAccountReport) => {
  alert(`View client details for: ${account.clientName}\n\nThis would show borrower profile and all their accounts.`);
};

const viewAccountDetails = (account: SavingsAccountReport) => {
  alert(`View account details for: ${account.accountNumber}\n\nThis would show transaction history and account details.`);
};

// Lifecycle
onMounted(() => {
  console.log('Savings Report loaded');
});

defineOptions({
  name: "SavingsReport",
});
</script>