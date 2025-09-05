<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Staff Transactions Report</h1>
        <p class="text-sm text-gray-600">Track staff activity and transaction entry performance</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportReport" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Report
        </button>
        <button @click="refreshReport" class="btn btn-primary">
          <ArrowPathIcon class="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Date Range</h2>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input 
              v-model="dateRange.fromDate" 
              type="date" 
              class="form-input"
              @change="updateReport"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Time</label>
            <input 
              v-model="dateRange.fromTime" 
              type="time" 
              class="form-input"
              @change="updateReport"
            />
          </div>
          <div class="flex items-center justify-center pt-6">
            <span class="text-sm text-gray-500 font-medium">till</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input 
              v-model="dateRange.toDate" 
              type="date" 
              class="form-input"
              @change="updateReport"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Time</label>
            <input 
              v-model="dateRange.toTime" 
              type="time" 
              class="form-input"
              @change="updateReport"
            />
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800">
            Staff who have entered transactions between 
            <strong>{{ formatDateRange() }}</strong> are shown below. 
            You can edit the dates above.
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-blue-600">{{ activeStaff }}</div>
          <div class="text-sm text-gray-600">Active Staff</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-green-600">{{ totalTransactions }}</div>
          <div class="text-sm text-gray-600">Total Transactions</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-purple-600">{{ averagePerStaff }}</div>
          <div class="text-sm text-gray-600">Avg per Staff</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-orange-600">${{ totalAmount.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Total Amount</div>
        </div>
      </div>
    </div>

    <!-- Staff Performance Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Staff Transaction Activity</h3>
        <div class="flex space-x-2">
          <select v-model="sortBy" @change="updateReport" class="form-select">
            <option value="transactions">Sort by Transactions</option>
            <option value="amount">Sort by Amount</option>
            <option value="name">Sort by Name</option>
            <option value="lastActivity">Sort by Last Activity</option>
          </select>
        </div>
      </div>
      
      <div class="card-body">
        <div v-if="staffReports.length === 0" class="text-center py-12">
          <UsersIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 mb-4">No staff transactions found in the selected date range.</p>
          <button @click="resetDateRange" class="btn btn-primary">
            Reset Date Range
          </button>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-left">Staff Member</th>
                <th class="text-center">Role</th>
                <th class="text-center">Transactions</th>
                <th class="text-right">Total Amount</th>
                <th class="text-center">Deposits</th>
                <th class="text-center">Withdrawals</th>
                <th class="text-center">Transfers</th>
                <th class="text-center">Last Activity</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="staff in sortedStaffReports" :key="staff.id" class="hover:bg-gray-50">
                <td>
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span class="text-sm font-medium text-blue-700">
                        {{ staff.initials }}
                      </span>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ staff.name }}</div>
                      <div class="text-sm text-gray-500">{{ staff.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <span :class="getRoleBadgeClass(staff.role)" class="badge">
                    {{ staff.role }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="font-bold text-lg">{{ staff.totalTransactions }}</div>
                  <div class="text-xs text-gray-500">transactions</div>
                </td>
                <td class="text-right">
                  <div class="font-medium text-gray-900">${{ staff.totalAmount.toLocaleString() }}</div>
                </td>
                <td class="text-center">
                  <div class="text-green-600 font-medium">{{ staff.deposits }}</div>
                </td>
                <td class="text-center">
                  <div class="text-red-600 font-medium">{{ staff.withdrawals }}</div>
                </td>
                <td class="text-center">
                  <div class="text-blue-600 font-medium">{{ staff.transfers }}</div>
                </td>
                <td class="text-center">
                  <div class="text-sm">{{ formatDateTime(staff.lastActivity) }}</div>
                </td>
                <td class="text-center">
                  <div class="flex justify-center space-x-1">
                    <button @click="viewStaffDetails(staff)" class="btn btn-xs btn-outline">
                      <EyeIcon class="w-3 h-3" />
                    </button>
                    <button @click="viewStaffTransactions(staff)" class="btn btn-xs btn-primary">
                      <DocumentTextIcon class="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 border-t-2 border-gray-200">
              <tr class="font-semibold">
                <td colspan="2" class="font-bold">Total</td>
                <td class="text-center font-bold">{{ totalTransactions }}</td>
                <td class="text-right font-bold">${{ totalAmount.toLocaleString() }}</td>
                <td class="text-center font-bold text-green-700">{{ totalDeposits }}</td>
                <td class="text-center font-bold text-red-700">{{ totalWithdrawals }}</td>
                <td class="text-center font-bold text-blue-700">{{ totalTransfers }}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Performance Chart -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Staff Performance Comparison</h3>
      </div>
      <div class="card-body">
        <div class="h-64 flex items-end justify-between space-x-2 p-4 bg-gray-50 rounded-lg">
          <div 
            v-for="staff in sortedStaffReports.slice(0, 10)" 
            :key="staff.id"
            class="flex flex-col items-center"
          >
            <div 
              :style="{ height: `${(staff.totalTransactions / maxTransactions) * 200}px` }"
              class="w-8 bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
              :title="`${staff.name}: ${staff.totalTransactions} transactions`"
            ></div>
            <div class="text-xs text-gray-600 mt-2 transform -rotate-45 origin-center">
              {{ staff.name.split(' ')[0] }}
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2 text-center">
          Transaction count by staff member (top 10 shown)
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { 
  DocumentArrowDownIcon,
  ArrowPathIcon,
  UsersIcon,
  EyeIcon,
  DocumentTextIcon
} from "@heroicons/vue/24/outline";

// Types
interface StaffReport {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  totalTransactions: number;
  totalAmount: number;
  deposits: number;
  withdrawals: number;
  transfers: number;
  lastActivity: Date;
}

// Reactive data
const router = useRouter();
const sortBy = ref("transactions");

const dateRange = ref({
  fromDate: "2020-09-04",
  fromTime: "00:00",
  toDate: "2025-09-04",
  toTime: "23:59"
});

// Mock staff data
const staffReports = ref<StaffReport[]>([
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    initials: "JS",
    role: "Manager",
    totalTransactions: 324,
    totalAmount: 156780,
    deposits: 198,
    withdrawals: 89,
    transfers: 37,
    lastActivity: new Date("2025-09-04 15:30")
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    initials: "SJ",
    role: "Teller",
    totalTransactions: 456,
    totalAmount: 203450,
    deposits: 278,
    withdrawals: 134,
    transfers: 44,
    lastActivity: new Date("2025-09-04 16:45")
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@company.com",
    initials: "MB",
    role: "Teller",
    totalTransactions: 289,
    totalAmount: 134567,
    deposits: 167,
    withdrawals: 92,
    transfers: 30,
    lastActivity: new Date("2025-09-04 14:20")
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    initials: "ED",
    role: "Loan Officer",
    totalTransactions: 198,
    totalAmount: 89450,
    deposits: 123,
    withdrawals: 56,
    transfers: 19,
    lastActivity: new Date("2025-09-04 13:15")
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@company.com",
    initials: "DW",
    role: "Supervisor",
    totalTransactions: 378,
    totalAmount: 189670,
    deposits: 234,
    withdrawals: 98,
    transfers: 46,
    lastActivity: new Date("2025-09-04 17:10")
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    initials: "LA",
    role: "Teller",
    totalTransactions: 267,
    totalAmount: 112890,
    deposits: 156,
    withdrawals: 78,
    transfers: 33,
    lastActivity: new Date("2025-09-04 12:45")
  }
]);

// Computed properties
const activeStaff = computed(() => staffReports.value.length);

const totalTransactions = computed(() => 
  staffReports.value.reduce((sum, staff) => sum + staff.totalTransactions, 0)
);

const totalAmount = computed(() => 
  staffReports.value.reduce((sum, staff) => sum + staff.totalAmount, 0)
);

const averagePerStaff = computed(() => 
  activeStaff.value > 0 ? Math.round(totalTransactions.value / activeStaff.value) : 0
);

const totalDeposits = computed(() => 
  staffReports.value.reduce((sum, staff) => sum + staff.deposits, 0)
);

const totalWithdrawals = computed(() => 
  staffReports.value.reduce((sum, staff) => sum + staff.withdrawals, 0)
);

const totalTransfers = computed(() => 
  staffReports.value.reduce((sum, staff) => sum + staff.transfers, 0)
);

const maxTransactions = computed(() => 
  Math.max(...staffReports.value.map(staff => staff.totalTransactions))
);

const sortedStaffReports = computed(() => {
  const sorted = [...staffReports.value];
  
  switch (sortBy.value) {
    case "transactions":
      return sorted.sort((a, b) => b.totalTransactions - a.totalTransactions);
    case "amount":
      return sorted.sort((a, b) => b.totalAmount - a.totalAmount);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "lastActivity":
      return sorted.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
    default:
      return sorted;
  }
});

// Methods
const formatDateRange = (): string => {
  const fromDate = new Date(`${dateRange.value.fromDate} ${dateRange.value.fromTime}`);
  const toDate = new Date(`${dateRange.value.toDate} ${dateRange.value.toTime}`);
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    }).toLowerCase();
  };
  
  return `${fromDate.toLocaleDateString('en-US', formatOptions)}, ${formatTime(fromDate)} - ${toDate.toLocaleDateString('en-US', formatOptions)}, ${formatTime(toDate)}`;
};

const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const getRoleBadgeClass = (role: string): string => {
  const classes: { [key: string]: string } = {
    "Manager": "badge-primary",
    "Supervisor": "badge-success",
    "Teller": "badge-info",
    "Loan Officer": "badge-warning"
  };
  return classes[role] || "badge-secondary";
};

const updateReport = () => {
  // In a real application, this would fetch new data based on the date range
  console.log("Updating report for date range:", dateRange.value);
};

const resetDateRange = () => {
  const today = new Date();
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  
  dateRange.value = {
    fromDate: monthAgo.toISOString().split('T')[0],
    fromTime: "00:00",
    toDate: today.toISOString().split('T')[0],
    toTime: "23:59"
  };
  updateReport();
};

const refreshReport = () => {
  // Simulate data refresh
  alert("Report refreshed with latest data");
  updateReport();
};

const exportReport = () => {
  // Generate CSV export
  const csvContent = [
    'Staff Name,Role,Total Transactions,Total Amount,Deposits,Withdrawals,Transfers,Last Activity',
    ...staffReports.value.map(staff => 
      `"${staff.name}","${staff.role}",${staff.totalTransactions},${staff.totalAmount},${staff.deposits},${staff.withdrawals},${staff.transfers},"${staff.lastActivity.toISOString()}"`
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `staff_transactions_report_${dateRange.value.fromDate}_to_${dateRange.value.toDate}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const viewStaffDetails = (staff: StaffReport) => {
  alert(`View detailed information for ${staff.name}`);
};

const viewStaffTransactions = (staff: StaffReport) => {
  alert(`View all transactions entered by ${staff.name}`);
};

onMounted(() => {
  updateReport();
});

defineOptions({
  name: "StaffTransactionsReport",
});
</script>