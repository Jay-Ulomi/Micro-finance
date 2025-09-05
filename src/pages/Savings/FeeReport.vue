<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Savings Fee Report</h1>
        <p class="mt-1 text-sm text-gray-500">
          Track and analyze savings account fees including monthly, opening, withdrawal, and bank fees
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportReport" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Report
        </button>
        <button @click="addManualFee" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Manual Fee
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
      <div class="mt-4 flex justify-between items-center">
        <p class="text-sm text-gray-600">
          {{ dateRangeDescription }}
        </p>
        <button @click="refreshReport" class="btn btn-primary">
          <ArrowPathIcon class="w-4 h-4 mr-2" />
          Refresh Report
        </button>
      </div>
    </div>

    <!-- Fee Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-green-600">${{ totalMonthlyOpeningFees.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Monthly/Opening Fees</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-blue-600">${{ totalWithdrawalFees.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Withdrawal Fees</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-orange-600">${{ totalBankFees.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Bank Fees</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-primary-600">${{ totalAllFees.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Total Fees</div>
        </div>
      </div>
    </div>

    <!-- Savings Fees Report -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Savings Fees</h3>
        <div class="flex space-x-2">
          <select v-model="feeTypeFilter" class="form-select" @change="filterFees">
            <option value="all">All Fee Types</option>
            <option value="monthly">Monthly Fees</option>
            <option value="opening">Opening Fees</option>
            <option value="withdrawal">Withdrawal Fees</option>
            <option value="bank">Bank Fees</option>
          </select>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search fees..." 
            class="form-input w-64" 
          />
        </div>
      </div>

      <div class="card-body">
        <!-- Monthly or Opening Savings Fees -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-medium text-gray-900">Monthly or Opening Savings Fees</h4>
            <button @click="addMonthlyFee" class="btn btn-sm btn-outline">
              <PlusIcon class="w-4 h-4 mr-1" />
              Add Fee
            </button>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <table class="table w-full">
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-right">Amount</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="monthlyOpeningFees.length === 0">
                  <td colspan="3" class="text-center py-4 text-gray-500">
                    There are no monthly or opening savings fees in your account.
                  </td>
                </tr>
                <tr v-for="fee in filteredMonthlyOpeningFees" :key="fee.id" class="border-t">
                  <td class="py-2">
                    <div>
                      <div class="font-medium">{{ fee.name }}</div>
                      <div class="text-sm text-gray-500">{{ fee.description }}</div>
                    </div>
                  </td>
                  <td class="py-2 text-right font-medium text-green-600">
                    ${{ fee.amount.toLocaleString() }}
                  </td>
                  <td class="py-2 text-center">
                    <div class="flex justify-center space-x-1">
                      <button @click="viewFeeDetails(fee)" class="btn btn-xs btn-outline">
                        <EyeIcon class="w-3 h-3" />
                      </button>
                      <button @click="editFee(fee)" class="btn btn-xs btn-outline">
                        <PencilIcon class="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Withdrawal Savings Fees -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-medium text-gray-900">Withdrawal Savings Fees</h4>
            <button @click="addWithdrawalFee" class="btn btn-sm btn-outline">
              <PlusIcon class="w-4 h-4 mr-1" />
              Add Fee
            </button>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <table class="table w-full">
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-right">Amount</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="withdrawalFees.length === 0">
                  <td colspan="3" class="text-center py-4 text-gray-500">
                    There are no withdrawal savings fees in your account.
                  </td>
                </tr>
                <tr v-for="fee in filteredWithdrawalFees" :key="fee.id" class="border-t">
                  <td class="py-2">
                    <div>
                      <div class="font-medium">{{ fee.name }}</div>
                      <div class="text-sm text-gray-500">{{ fee.description }}</div>
                    </div>
                  </td>
                  <td class="py-2 text-right font-medium text-blue-600">
                    ${{ fee.amount.toLocaleString() }}
                  </td>
                  <td class="py-2 text-center">
                    <div class="flex justify-center space-x-1">
                      <button @click="viewFeeDetails(fee)" class="btn btn-xs btn-outline">
                        <EyeIcon class="w-3 h-3" />
                      </button>
                      <button @click="editFee(fee)" class="btn btn-xs btn-outline">
                        <PencilIcon class="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Manually Added Bank Savings Fees -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-medium text-gray-900">Manually Added Bank Savings Fees</h4>
            <button @click="addBankFee" class="btn btn-sm btn-outline">
              <PlusIcon class="w-4 h-4 mr-1" />
              Add Bank Fee
            </button>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <table class="table w-full">
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-right">Amount</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2 font-medium">Bank Fees</td>
                  <td class="py-2 text-right font-medium text-orange-600">
                    ${{ totalBankFees.toLocaleString() }}
                  </td>
                  <td class="py-2 text-center">
                    <button @click="viewBankFeesBreakdown" class="btn btn-xs btn-outline">
                      <EyeIcon class="w-3 h-3" />
                    </button>
                  </td>
                </tr>
                <tr v-for="fee in filteredBankFees" :key="fee.id" class="border-t">
                  <td class="py-2 pl-6">
                    <div>
                      <div class="font-medium">{{ fee.name }}</div>
                      <div class="text-sm text-gray-500">{{ fee.description }}</div>
                    </div>
                  </td>
                  <td class="py-2 text-right font-medium text-orange-600">
                    ${{ fee.amount.toLocaleString() }}
                  </td>
                  <td class="py-2 text-center">
                    <div class="flex justify-center space-x-1">
                      <button @click="viewFeeDetails(fee)" class="btn btn-xs btn-outline">
                        <EyeIcon class="w-3 h-3" />
                      </button>
                      <button @click="editFee(fee)" class="btn btn-xs btn-outline">
                        <PencilIcon class="w-3 h-3" />
                      </button>
                      <button @click="deleteFee(fee)" class="btn btn-xs btn-danger">
                        <TrashIcon class="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Total Summary -->
        <div class="border-t pt-6">
          <div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-primary-800">Total</span>
              <span class="text-2xl font-bold text-primary-900">
                ${{ totalAllFees.toLocaleString() }}
              </span>
            </div>
            <div class="mt-2 text-sm text-primary-700">
              Total fees collected in the selected date range
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Fee Breakdown Chart -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Fee Distribution</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Fee Type Chart Placeholder -->
          <div class="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <ChartPieIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-600">Fee Distribution Chart</p>
            <p class="text-sm text-gray-500 mt-1">Visual breakdown by fee type</p>
          </div>
          
          <!-- Trend Chart Placeholder -->
          <div class="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <ChartBarIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-600">Monthly Fee Trends</p>
            <p class="text-sm text-gray-500 mt-1">Fee collection over time</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { 
  PlusIcon,
  DocumentArrowDownIcon, 
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartPieIcon,
  ChartBarIcon
} from "@heroicons/vue/24/outline";

// Types
interface SavingsFee {
  id: string;
  name: string;
  amount: number;
  type: 'monthly' | 'opening' | 'withdrawal' | 'bank';
  description: string;
  date: Date;
  accountId?: string;
  accountName?: string;
}

// Reactive data
const searchQuery = ref("");
const feeTypeFilter = ref("all");

// Date range
const dateRange = ref({
  fromDate: "2005-09-04",
  fromTime: "00:00",
  toDate: "2025-09-04", 
  toTime: "23:59"
});

// Mock fees data
const monthlyOpeningFees = ref<SavingsFee[]>([
  {
    id: "1",
    name: "Account Opening Fee",
    amount: 25.00,
    type: 'opening',
    description: "One-time account opening fee",
    date: new Date("2024-03-01"),
    accountId: "SAV001",
    accountName: "John Doe - Regular Savings"
  },
  {
    id: "2", 
    name: "Monthly Maintenance Fee",
    amount: 5.00,
    type: 'monthly',
    description: "Monthly account maintenance",
    date: new Date("2024-03-01"),
    accountId: "SAV002",
    accountName: "Jane Smith - Premium Savings"
  }
]);

const withdrawalFees = ref<SavingsFee[]>([
  {
    id: "3",
    name: "ATM Withdrawal Fee",
    amount: 2.50,
    type: 'withdrawal',
    description: "Fee for ATM withdrawal",
    date: new Date("2024-03-02"),
    accountId: "SAV001",
    accountName: "John Doe - Regular Savings"
  },
  {
    id: "4",
    name: "Over-limit Withdrawal Fee", 
    amount: 15.00,
    type: 'withdrawal',
    description: "Fee for exceeding withdrawal limit",
    date: new Date("2024-03-03"),
    accountId: "SAV003",
    accountName: "Bob Johnson - Goal Savings"
  }
]);

const bankFees = ref<SavingsFee[]>([
  {
    id: "5",
    name: "Wire Transfer Fee",
    amount: 20.00,
    type: 'bank',
    description: "Outgoing wire transfer fee",
    date: new Date("2024-03-01"),
    accountId: "SAV002",
    accountName: "Jane Smith - Premium Savings"
  },
  {
    id: "6",
    name: "Check Processing Fee",
    amount: 3.00,
    type: 'bank', 
    description: "Check processing and clearing fee",
    date: new Date("2024-03-02"),
    accountId: "SAV001",
    accountName: "John Doe - Regular Savings"
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
  
  return `Savings Fees which have transactions between ${formatDate(fromDate)}, ${formatTime(dateRange.value.fromTime)} - ${formatDate(toDate)}, ${formatTime(dateRange.value.toTime)} are shown below. You can edit the dates above.`;
});

const totalMonthlyOpeningFees = computed(() => {
  return monthlyOpeningFees.value.reduce((sum, fee) => sum + fee.amount, 0);
});

const totalWithdrawalFees = computed(() => {
  return withdrawalFees.value.reduce((sum, fee) => sum + fee.amount, 0);
});

const totalBankFees = computed(() => {
  return bankFees.value.reduce((sum, fee) => sum + fee.amount, 0);
});

const totalAllFees = computed(() => {
  return totalMonthlyOpeningFees.value + totalWithdrawalFees.value + totalBankFees.value;
});

const filteredMonthlyOpeningFees = computed(() => {
  return monthlyOpeningFees.value.filter(fee => 
    feeTypeFilter.value === 'all' || 
    feeTypeFilter.value === 'monthly' || 
    feeTypeFilter.value === 'opening'
  );
});

const filteredWithdrawalFees = computed(() => {
  return withdrawalFees.value.filter(fee => 
    feeTypeFilter.value === 'all' || feeTypeFilter.value === 'withdrawal'
  );
});

const filteredBankFees = computed(() => {
  return bankFees.value.filter(fee => 
    feeTypeFilter.value === 'all' || feeTypeFilter.value === 'bank'
  );
});

// Methods
const updateDateRange = () => {
  // Trigger report refresh when date range changes
  console.log('Date range updated:', dateRange.value);
};

const refreshReport = () => {
  alert('Report refreshed with new date range');
};

const filterFees = () => {
  // Filtering is handled by computed properties
  console.log('Filtering by:', feeTypeFilter.value);
};

const exportReport = () => {
  alert('Export report functionality would generate PDF/Excel here');
};

const addManualFee = () => {
  alert('Add Manual Fee modal would open here');
};

const addMonthlyFee = () => {
  alert('Add Monthly/Opening Fee modal would open here');
};

const addWithdrawalFee = () => {
  alert('Add Withdrawal Fee modal would open here');
};

const addBankFee = () => {
  alert('Add Bank Fee modal would open here');
};

const viewFeeDetails = (fee: SavingsFee) => {
  alert(`View details for: ${fee.name} - $${fee.amount}`);
};

const editFee = (fee: SavingsFee) => {
  alert(`Edit fee: ${fee.name}`);
};

const deleteFee = (fee: SavingsFee) => {
  if (confirm(`Are you sure you want to delete "${fee.name}"?`)) {
    // Remove from appropriate array based on type
    if (fee.type === 'bank') {
      const index = bankFees.value.findIndex(f => f.id === fee.id);
      if (index > -1) bankFees.value.splice(index, 1);
    }
    alert(`Fee "${fee.name}" deleted successfully`);
  }
};

const viewBankFeesBreakdown = () => {
  alert('Bank fees breakdown modal would show detailed list');
};

// Lifecycle
onMounted(() => {
  // Set default date range if needed
  console.log('Savings Fee Report loaded');
});

defineOptions({
  name: "SavingsFeeReport",
});
</script>