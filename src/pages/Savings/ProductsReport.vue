<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Savings Products Report</h1>
        <p class="mt-1 text-sm text-gray-500">
          Comprehensive report showing transaction summaries for all savings products
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportReport" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Report
        </button>
        <button @click="viewTransactions" class="btn btn-primary">
          <EyeIcon class="w-4 h-4 mr-2" />
          View Savings Transactions
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
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
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
    </div>

    <!-- Main Report Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Savings Products</h3>
        <div class="flex space-x-2">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search:" 
            class="form-input w-64" 
          />
          <button @click="refreshReport" class="btn btn-primary">
            <ArrowPathIcon class="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div class="card-body">
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="text-gray-600 mb-4 font-medium">No data available in table</p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p class="text-sm text-blue-800 mb-2">
              To view transactions for a savings product, visit <strong>View Savings Transactions</strong> (left menu).
            </p>
            <p class="text-sm text-blue-800">
              On top of the page, click on <strong>Advanced Search: Click here to Show</strong>. 
              Select the From Date and To Date and the savings product in All Savings Products and click Search.
            </p>
          </div>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-left">Savings Product</th>
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
              <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="font-medium">
                  <button 
                    @click="viewProductDetails(product)"
                    class="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {{ product.name }}
                  </button>
                </td>
                <td class="text-right text-green-600 font-medium">
                  ${{ product.deposits.toLocaleString() }}
                </td>
                <td class="text-right text-blue-600 font-medium">
                  ${{ product.transferIn.toLocaleString() }}
                </td>
                <td class="text-right text-red-600 font-medium">
                  ${{ product.withdrawals.toLocaleString() }}
                </td>
                <td class="text-right text-orange-600 font-medium">
                  ${{ product.fees.toLocaleString() }}
                </td>
                <td class="text-right text-purple-600 font-medium">
                  ${{ product.interest.toLocaleString() }}
                </td>
                <td class="text-right text-indigo-600 font-medium">
                  ${{ product.dividends.toLocaleString() }}
                </td>
                <td class="text-right text-yellow-600 font-medium">
                  ${{ product.transferOut.toLocaleString() }}
                </td>
                <td class="text-right text-pink-600 font-medium">
                  ${{ product.commissions.toLocaleString() }}
                </td>
                <td class="text-right font-bold text-gray-900">
                  ${{ product.balance.toLocaleString() }}
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 border-t-2 border-gray-200">
              <tr class="font-semibold">
                <td class="font-bold">Total</td>
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
      </div>
    </div>

    <!-- Product Performance Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Performing Products -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Top Performing Products</h3>
        </div>
        <div class="card-body">
          <div v-if="topPerformingProducts.length === 0" class="text-center py-4">
            <p class="text-gray-600">No product data available</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="(product, index) in topPerformingProducts" :key="product.id" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {{ index + 1 }}
                </div>
                <div>
                  <div class="font-medium">{{ product.name }}</div>
                  <div class="text-sm text-gray-600">{{ product.accountsCount }} accounts</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-green-600">${{ product.balance.toLocaleString() }}</div>
                <div class="text-sm text-gray-500">Balance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Volume Analysis -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Transaction Volume Analysis</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Most Active Product</span>
              <span class="font-medium">{{ mostActiveProduct?.name || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Highest Deposits</span>
              <span class="font-medium text-green-600">${{ highestDeposits.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Withdrawals</span>
              <span class="font-medium text-red-600">${{ totalWithdrawals.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Net Growth</span>
              <span :class="netGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
                ${{ Math.abs(netGrowth).toLocaleString() }} {{ netGrowth >= 0 ? '↑' : '↓' }}
              </span>
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
  EyeIcon,
  ArrowPathIcon
} from "@heroicons/vue/24/outline";

// Types
interface ProductReportData {
  id: string;
  name: string;
  deposits: number;
  transferIn: number;
  withdrawals: number;
  fees: number;
  interest: number;
  dividends: number;
  transferOut: number;
  commissions: number;
  balance: number;
  accountsCount: number;
}

// Reactive data
const router = useRouter();
const searchQuery = ref("");

// Date range
const dateRange = ref({
  fromDate: "2020-09-04",
  fromTime: "00:00",
  toDate: "2025-09-04", 
  toTime: "23:59"
});

// Mock product data
const products = ref<ProductReportData[]>([
  {
    id: "1",
    name: "Regular Savings",
    deposits: 125000,
    transferIn: 15000,
    withdrawals: 45000,
    fees: 850,
    interest: 5200,
    dividends: 2100,
    transferOut: 8000,
    commissions: 125,
    balance: 94325,
    accountsCount: 245
  },
  {
    id: "2", 
    name: "Premium Savings",
    deposits: 89000,
    transferIn: 12000,
    withdrawals: 28000,
    fees: 1200,
    interest: 7800,
    dividends: 3200,
    transferOut: 5500,
    commissions: 200,
    commissions: 200,
    balance: 78500,
    accountsCount: 128
  },
  {
    id: "3",
    name: "Goal Savings",
    deposits: 67000,
    transferIn: 8500,
    withdrawals: 18000,
    fees: 450,
    interest: 4100,
    dividends: 1800,
    transferOut: 3200,
    commissions: 75,
    balance: 59775,
    accountsCount: 89
  },
  {
    id: "4",
    name: "SUSU Collector",
    deposits: 34000,
    transferIn: 5000,
    withdrawals: 12000,
    fees: 680,
    interest: 1200,
    dividends: 0,
    transferOut: 2100,
    commissions: 340,
    balance: 25080,
    accountsCount: 156
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
  
  return `Savings Products which have transactions between ${formatDate(fromDate)}, ${formatTime(dateRange.value.fromTime)} - ${formatDate(toDate)}, ${formatTime(dateRange.value.toTime)} are shown below. You can edit the dates above.`;
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  
  const query = searchQuery.value.toLowerCase();
  return products.value.filter(product => 
    product.name.toLowerCase().includes(query)
  );
});

const totalDeposits = computed(() => {
  return filteredProducts.value.reduce((sum, p) => sum + p.deposits, 0);
});

const totalTransferIn = computed(() => {
  return filteredProducts.value.reduce((sum, p) => sum + p.transferIn, 0);
});

const totalWithdrawals = computed(() => {
  return filteredProducts.value.reduce((sum, p) => sum + p.withdrawals, 0);
});

const totalFees = computed(() => {
  return filteredProducts.value.reduce((sum, p) => sum + p.fees, 0);
});

const totalInterest = computed(() => {
  return filteredProducts.value.reduce((sum, p) => sum + p.interest, 0);
});

const totalDividends = computed(() => {
  return filteredProducts.value.reduce((sum, p) => sum + p.dividends, 0);
});

const totalTransferOut = computed(() => {
  return filteredProducts.value.reduce((sum, p) => sum + p.transferOut, 0);
});

const totalCommissions = computed(() => {
  return filteredProducts.value.reduce((sum, p) => sum + p.commissions, 0);
});

const totalBalance = computed(() => {
  return filteredProducts.value.reduce((sum, p) => sum + p.balance, 0);
});

const topPerformingProducts = computed(() => {
  return [...products.value]
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);
});

const mostActiveProduct = computed(() => {
  return products.value.reduce((max, product) => {
    const activity = product.deposits + product.withdrawals + product.transferIn + product.transferOut;
    const maxActivity = max.deposits + max.withdrawals + max.transferIn + max.transferOut;
    return activity > maxActivity ? product : max;
  }, products.value[0]);
});

const highestDeposits = computed(() => {
  return Math.max(...products.value.map(p => p.deposits));
});

const netGrowth = computed(() => {
  const inflow = totalDeposits.value + totalTransferIn.value + totalInterest.value + totalDividends.value;
  const outflow = totalWithdrawals.value + totalTransferOut.value + totalFees.value + totalCommissions.value;
  return inflow - outflow;
});

// Methods
const updateDateRange = () => {
  console.log('Date range updated:', dateRange.value);
};

const refreshReport = () => {
  alert('Report refreshed with current date range');
};

const exportReport = () => {
  alert('Export functionality would generate PDF/Excel report');
};

const viewTransactions = () => {
  router.push('/savings-transactions');
};

const viewProductDetails = (product: ProductReportData) => {
  alert(`View detailed transactions for: ${product.name}\n\nThis would open the Savings Transactions page with this product pre-selected.`);
};

// Lifecycle
onMounted(() => {
  console.log('Savings Products Report loaded');
});

defineOptions({
  name: "SavingsProductsReport",
});
</script>