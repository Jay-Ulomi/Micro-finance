<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View Staff Payroll</h1>
        <p class="text-sm text-gray-600">
          <span v-if="staffName" class="font-medium">{{ staffName }} - {{ staffId }}</span>
          <span v-else>Select a staff member to view payroll history</span>
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="goBack" class="btn btn-secondary">
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Back
        </button>
        <button @click="exportPayroll" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="printPayroll" class="btn btn-primary">
          <PrinterIcon class="w-4 h-4 mr-2" />
          Print
        </button>
      </div>
    </div>

    <!-- Date Range and Bank Account Filter -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Date Range</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              v-model="filters.fromDate"
              type="date"
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <div class="flex items-center space-x-2">
              <span class="text-gray-500">to</span>
              <input
                v-model="filters.toDate"
                type="date"
                class="form-input"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bank Account (Paid from)</label>
            <select v-model="filters.bankAccount" class="form-input">
              <option value="">Select Bank Account</option>
              <option value="cash">Cash</option>
              <option value="nmb">NMB Bank - 20501000123</option>
              <option value="crdb">CRDB Bank - 01J1234567890</option>
              <option value="nbc">NBC Bank - 011103456789</option>
              <option value="equity">Equity Bank - 3001234567890</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="applyFilters" class="btn btn-primary">
            <FunnelIcon class="w-4 h-4 mr-2" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Payroll Summary Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card bg-blue-50 border-blue-200">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-600">Total Gross</p>
              <p class="text-xs text-blue-500">Amount{{ currency }}</p>
            </div>
            <BanknotesIcon class="w-8 h-8 text-blue-400" />
          </div>
          <p class="text-2xl font-bold text-blue-700 mt-2">{{ formatCurrency(totalGross) }}</p>
        </div>
      </div>

      <div class="card bg-red-50 border-red-200">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-red-600">Total Deductions</p>
              <p class="text-xs text-red-500">Amount {{ currency }}</p>
            </div>
            <MinusCircleIcon class="w-8 h-8 text-red-400" />
          </div>
          <p class="text-2xl font-bold text-red-700 mt-2">{{ formatCurrency(totalDeductions) }}</p>
        </div>
      </div>

      <div class="card bg-green-50 border-green-200">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-600">Total Net</p>
              <p class="text-xs text-green-500">Amount {{ currency }}</p>
            </div>
            <CheckCircleIcon class="w-8 h-8 text-green-400" />
          </div>
          <p class="text-2xl font-bold text-green-700 mt-2">{{ formatCurrency(totalNet) }}</p>
        </div>
      </div>

      <div class="card bg-purple-50 border-purple-200">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-purple-600">Total Paid</p>
              <p class="text-xs text-purple-500">Amount {{ currency }}</p>
            </div>
            <CreditCardIcon class="w-8 h-8 text-purple-400" />
          </div>
          <p class="text-2xl font-bold text-purple-700 mt-2">{{ formatCurrency(totalPaid) }}</p>
        </div>
      </div>
    </div>

    <!-- Payroll History Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Payroll History</h3>
        <div class="flex items-center space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search payroll"
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
        <div v-if="filteredPayroll.length === 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Date</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Period</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Recurring</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payslip</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td colspan="4" class="px-3 py-4 text-right text-gray-400">0.00</td>
                <td colspan="2" class="px-3 py-4 text-right text-gray-400">0.00</td>
                <td colspan="3" class="px-3 py-4 text-right text-gray-400">0.00</td>
              </tr>
              <tr>
                <td colspan="9" class="px-3 py-4 text-center text-gray-500">
                  No data found. No payroll found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Pay Date</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Pay Period</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Gross</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Deductions</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Net</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Paid</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Recurring</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Payslip</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="payroll in paginatedPayroll" :key="payroll.id" class="hover:bg-gray-50">
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <div class="text-sm">
                    <div class="font-medium">{{ formatDate(payroll.payDate) }}</div>
                    <div class="text-xs text-gray-500">{{ getDayOfWeek(payroll.payDate) }}</div>
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <div class="text-sm">
                    <div class="font-medium">{{ payroll.payPeriod }}</div>
                    <div class="text-xs text-gray-500">{{ payroll.month }} {{ payroll.year }}</div>
                  </div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-900">
                    {{ formatCurrency(payroll.grossAmount) }}
                  </div>
                  <div v-if="payroll.basicSalary" class="text-xs text-gray-500">
                    Basic: {{ formatCurrency(payroll.basicSalary) }}
                  </div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="text-sm font-bold text-red-600">
                    {{ formatCurrency(payroll.deductions) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ getDeductionBreakdown(payroll) }}
                  </div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="text-sm font-bold text-blue-600">
                    {{ formatCurrency(payroll.netAmount) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ ((payroll.netAmount / payroll.grossAmount) * 100).toFixed(1) }}% of gross
                  </div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div class="text-sm font-bold text-green-600">
                    {{ formatCurrency(payroll.paidAmount) }}
                  </div>
                  <span v-if="payroll.paymentStatus === 'paid'" class="badge badge-xs badge-success">
                    Paid
                  </span>
                  <span v-else-if="payroll.paymentStatus === 'partial'" class="badge badge-xs badge-warning">
                    Partial
                  </span>
                  <span v-else class="badge badge-xs badge-danger">
                    Unpaid
                  </span>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <span v-if="payroll.isRecurring" class="badge badge-sm badge-info">
                    Yes
                  </span>
                  <span v-else class="badge badge-sm badge-secondary">
                    No
                  </span>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <button
                    v-if="payroll.payslipUrl"
                    @click="downloadPayslip(payroll)"
                    class="btn btn-xs btn-outline"
                  >
                    <DocumentTextIcon class="w-3 h-3 mr-1" />
                    Download
                  </button>
                  <button
                    v-else
                    @click="generatePayslip(payroll)"
                    class="btn btn-xs btn-secondary"
                  >
                    Generate
                  </button>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <div class="flex justify-center space-x-1">
                    <button
                      @click="viewDetails(payroll)"
                      class="btn btn-xs btn-primary"
                      title="View Details"
                    >
                      <EyeIcon class="w-3 h-3" />
                    </button>
                    <button
                      @click="editPayroll(payroll)"
                      class="btn btn-xs btn-warning"
                      title="Edit"
                    >
                      <PencilIcon class="w-3 h-3" />
                    </button>
                    <button
                      v-if="payroll.paymentStatus !== 'paid'"
                      @click="markAsPaid(payroll)"
                      class="btn btn-xs btn-success"
                      title="Mark as Paid"
                    >
                      <CheckIcon class="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Totals Row -->
              <tr class="bg-gray-100 font-bold">
                <td colspan="2" class="px-3 py-3 text-right">Totals:</td>
                <td class="px-3 py-3 text-right text-gray-900">{{ formatCurrency(totalGross) }}</td>
                <td class="px-3 py-3 text-right text-red-600">{{ formatCurrency(totalDeductions) }}</td>
                <td class="px-3 py-3 text-right text-blue-600">{{ formatCurrency(totalNet) }}</td>
                <td class="px-3 py-3 text-right text-green-600">{{ formatCurrency(totalPaid) }}</td>
                <td colspan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredPayroll.length > 0" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredPayroll.length) }} of
            {{ filteredPayroll.length }} entries
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
              :disabled="endIndex >= filteredPayroll.length"
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
import { useRouter, useRoute } from "vue-router";
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  FunnelIcon,
  BanknotesIcon,
  MinusCircleIcon,
  CheckCircleIcon,
  CreditCardIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";

// Types
interface PayrollDetail {
  id: string;
  payDate: Date;
  payPeriod: string;
  month: string;
  year: number;
  grossAmount: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netAmount: number;
  paidAmount: number;
  paymentStatus: "paid" | "partial" | "unpaid";
  isRecurring: boolean;
  payslipUrl?: string;
  bankAccount?: string;
  paye?: number;
  nssf?: number;
  healthInsurance?: number;
  otherDeductions?: number;
}

// Reactive data
const router = useRouter();
const route = useRoute();
const searchQuery = ref("");
const entriesPerPage = ref(20);
const currentPage = ref(1);
const currency = ref("TZS");

// Staff Information
const staffName = ref("");
const staffId = ref("");

// Filters
const filters = ref({
  fromDate: "",
  toDate: "",
  bankAccount: "",
});

// Mock payroll data
const payrollHistory = ref<PayrollDetail[]>([
  {
    id: "1",
    payDate: new Date("2024-08-31"),
    payPeriod: "August 2024",
    month: "August",
    year: 2024,
    grossAmount: 3500000,
    basicSalary: 3000000,
    allowances: 500000,
    deductions: 525000,
    netAmount: 2975000,
    paidAmount: 2975000,
    paymentStatus: "paid",
    isRecurring: true,
    payslipUrl: "payslip-2024-08.pdf",
    bankAccount: "nmb",
    paye: 300000,
    nssf: 175000,
    healthInsurance: 50000,
    otherDeductions: 0,
  },
  {
    id: "2",
    payDate: new Date("2024-07-31"),
    payPeriod: "July 2024",
    month: "July",
    year: 2024,
    grossAmount: 3500000,
    basicSalary: 3000000,
    allowances: 500000,
    deductions: 525000,
    netAmount: 2975000,
    paidAmount: 2975000,
    paymentStatus: "paid",
    isRecurring: true,
    payslipUrl: "payslip-2024-07.pdf",
    bankAccount: "nmb",
    paye: 300000,
    nssf: 175000,
    healthInsurance: 50000,
    otherDeductions: 0,
  },
  {
    id: "3",
    payDate: new Date("2024-06-30"),
    payPeriod: "June 2024",
    month: "June",
    year: 2024,
    grossAmount: 3500000,
    basicSalary: 3000000,
    allowances: 500000,
    deductions: 525000,
    netAmount: 2975000,
    paidAmount: 2975000,
    paymentStatus: "paid",
    isRecurring: true,
    payslipUrl: "payslip-2024-06.pdf",
    bankAccount: "nmb",
    paye: 300000,
    nssf: 175000,
    healthInsurance: 50000,
    otherDeductions: 0,
  },
  {
    id: "4",
    payDate: new Date("2024-05-31"),
    payPeriod: "May 2024",
    month: "May",
    year: 2024,
    grossAmount: 3500000,
    basicSalary: 3000000,
    allowances: 500000,
    deductions: 525000,
    netAmount: 2975000,
    paidAmount: 1500000,
    paymentStatus: "partial",
    isRecurring: true,
    bankAccount: "cash",
    paye: 300000,
    nssf: 175000,
    healthInsurance: 50000,
    otherDeductions: 0,
  },
]);

// Computed properties
const filteredPayroll = computed(() => {
  let result = payrollHistory.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (payroll) =>
        payroll.payPeriod.toLowerCase().includes(query) ||
        payroll.month.toLowerCase().includes(query),
    );
  }

  if (filters.value.fromDate) {
    const fromDate = new Date(filters.value.fromDate);
    result = result.filter((payroll) => payroll.payDate >= fromDate);
  }

  if (filters.value.toDate) {
    const toDate = new Date(filters.value.toDate);
    result = result.filter((payroll) => payroll.payDate <= toDate);
  }

  if (filters.value.bankAccount) {
    result = result.filter((payroll) => payroll.bankAccount === filters.value.bankAccount);
  }

  return result;
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedPayroll = computed(() => {
  return filteredPayroll.value.slice(startIndex.value, endIndex.value);
});

const totalGross = computed(() => {
  return filteredPayroll.value.reduce((sum, payroll) => sum + payroll.grossAmount, 0);
});

const totalDeductions = computed(() => {
  return filteredPayroll.value.reduce((sum, payroll) => sum + payroll.deductions, 0);
});

const totalNet = computed(() => {
  return filteredPayroll.value.reduce((sum, payroll) => sum + payroll.netAmount, 0);
});

const totalPaid = computed(() => {
  return filteredPayroll.value.reduce((sum, payroll) => sum + payroll.paidAmount, 0);
});

// Methods
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString();
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDayOfWeek = (date: Date): string => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

const getDeductionBreakdown = (payroll: PayrollDetail): string => {
  const parts: string[] = [];
  if (payroll.paye) parts.push(`PAYE: ${(payroll.paye / 1000).toFixed(0)}k`);
  if (payroll.nssf) parts.push(`NSSF: ${(payroll.nssf / 1000).toFixed(0)}k`);
  if (payroll.healthInsurance) parts.push(`Health: ${(payroll.healthInsurance / 1000).toFixed(0)}k`);
  return parts.join(", ");
};

const goBack = () => {
  router.back();
};

const applyFilters = () => {
  currentPage.value = 1;
};

const exportPayroll = () => {
  const csvContent = [
    "Pay Date,Pay Period,Gross Amount,Deductions,Net Amount,Paid Amount,Status,Bank Account",
    ...filteredPayroll.value.map(
      (payroll) =>
        `"${payroll.payDate.toISOString()}","${payroll.payPeriod}",${payroll.grossAmount},${payroll.deductions},${payroll.netAmount},${payroll.paidAmount},"${payroll.paymentStatus}","${payroll.bankAccount || ""}"`,
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${staffId.value}_payroll_history_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const printPayroll = () => {
  window.print();
};

const downloadPayslip = (payroll: PayrollDetail) => {
  alert(`Download payslip: ${payroll.payslipUrl}`);
};

const generatePayslip = (payroll: PayrollDetail) => {
  alert(`Generate payslip for ${payroll.payPeriod}`);
};

const viewDetails = (payroll: PayrollDetail) => {
  alert(`View details for ${payroll.payPeriod}`);
};

const editPayroll = (payroll: PayrollDetail) => {
  router.push(`/payroll/edit/${payroll.id}`);
};

const markAsPaid = (payroll: PayrollDetail) => {
  if (confirm(`Mark ${payroll.payPeriod} as paid?`)) {
    payroll.paymentStatus = "paid";
    payroll.paidAmount = payroll.netAmount;
    alert("Marked as paid successfully!");
  }
};

// Lifecycle
onMounted(() => {
  // Get staff info from route params or query
  const staffIdParam = route.params.staffId || route.query.staffId;
  if (staffIdParam) {
    staffId.value = staffIdParam as string;
    // In real app, fetch staff details from API
    staffName.value = "Edwin Simon"; // Mock data
  }
});

defineOptions({
  name: "StaffPayrollView",
});
</script>