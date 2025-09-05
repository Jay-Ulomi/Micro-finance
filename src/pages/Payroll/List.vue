<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View Payroll</h1>
        <p class="text-sm text-gray-600">Manage staff payroll, payments, and payslips</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportPayroll" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="processPayroll" class="btn btn-primary">
          <CalculatorIcon class="w-4 h-4 mr-2" />
          Process Payroll
        </button>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search Staff</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name or employee ID..."
                class="form-input pl-10"
              />
              <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select v-model="departmentFilter" class="form-input">
              <option value="">All Departments</option>
              <option value="management">Management</option>
              <option value="operations">Operations</option>
              <option value="finance">Finance</option>
              <option value="hr">Human Resources</option>
              <option value="it">IT</option>
              <option value="sales">Sales</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pay Period</label>
            <select v-model="periodFilter" class="form-input">
              <option value="">All Periods</option>
              <option value="current">Current Month</option>
              <option value="last">Last Month</option>
              <option value="q1">Q1 2024</option>
              <option value="q2">Q2 2024</option>
              <option value="q3">Q3 2024</option>
              <option value="q4">Q4 2024</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Payroll Statistics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-blue-600">{{ totalEmployees }}</div>
          <div class="text-sm text-gray-600">Total Employees</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-green-600">{{ currency }}{{ currentMonthTotal.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Current Month Total</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-orange-600">{{ pendingPayments }}</div>
          <div class="text-sm text-gray-600">Pending Payments</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-purple-600">{{ currency }}{{ averageSalary.toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Average Salary</div>
        </div>
      </div>
    </div>

    <!-- Payroll Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Staff Payroll Records</h3>
        <div class="flex items-center space-x-2">
          <button @click="toggleView" class="btn btn-sm btn-outline">
            <component :is="viewMode === 'grid' ? Squares2X2Icon : ListBulletIcon" class="w-4 h-4 mr-1" />
            {{ viewMode === 'grid' ? 'List View' : 'Grid View' }}
          </button>
        </div>
      </div>

      <div class="card-body">
        <div v-if="filteredPayroll.length === 0" class="text-center py-12">
          <BanknotesIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 mb-4 font-medium">No payroll records found.</p>
          <button @click="processPayroll" class="btn btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Process First Payroll
          </button>
        </div>

        <!-- List View -->
        <div v-else-if="viewMode === 'list'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Staff</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Last Pay Date</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Last Gross Amount{{ currency }}</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Last Total Deductions{{ currency }}</th>
                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Last Paid Amount{{ currency }}</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Last Payslip</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">View/Modify</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="employee in paginatedPayroll" :key="employee.id" class="hover:bg-gray-50">
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                        v-if="employee.avatar"
                        class="h-10 w-10 rounded-full"
                        :src="employee.avatar"
                        :alt="employee.name"
                      />
                      <div
                        v-else
                        class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                      >
                        <span class="text-sm font-medium text-gray-600">
                          {{ getInitials(employee.name) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ employee.name }}</div>
                      <div class="text-sm text-gray-500">{{ employee.employeeId }}</div>
                      <div class="text-xs text-gray-400">{{ employee.department }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <div v-if="employee.lastPayDate" class="text-sm">
                    <div class="font-medium">{{ formatDate(employee.lastPayDate) }}</div>
                    <div class="text-gray-500 text-xs">{{ getDaysAgo(employee.lastPayDate) }}</div>
                  </div>
                  <div v-else class="text-gray-400 text-sm">
                    No payment yet
                  </div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div v-if="employee.lastGrossAmount" class="text-sm font-bold text-gray-900">
                    {{ formatCurrency(employee.lastGrossAmount) }}
                  </div>
                  <div v-else class="text-gray-400 text-sm">-</div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div v-if="employee.lastDeductions" class="text-sm">
                    <div class="font-bold text-red-600">
                      {{ formatCurrency(employee.lastDeductions) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ getDeductionPercentage(employee).toFixed(1) }}% of gross
                    </div>
                  </div>
                  <div v-else class="text-gray-400 text-sm">-</div>
                </td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  <div v-if="employee.lastPaidAmount" class="text-sm">
                    <div class="font-bold text-green-600">
                      {{ formatCurrency(employee.lastPaidAmount) }}
                    </div>
                    <span v-if="employee.paymentStatus === 'paid'" class="badge badge-xs badge-success">
                      Paid
                    </span>
                    <span v-else-if="employee.paymentStatus === 'pending'" class="badge badge-xs badge-warning">
                      Pending
                    </span>
                    <span v-else class="badge badge-xs badge-danger">
                      Failed
                    </span>
                  </div>
                  <div v-else class="text-gray-400 text-sm">-</div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <button
                    v-if="employee.lastPayslip"
                    @click="downloadPayslip(employee)"
                    class="btn btn-xs btn-outline"
                  >
                    <DocumentTextIcon class="w-3 h-3 mr-1" />
                    Download
                  </button>
                  <span v-else class="text-gray-400 text-sm">Not available</span>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <div class="flex justify-center space-x-1">
                    <button
                      @click="viewPayroll(employee)"
                      class="btn btn-xs btn-primary"
                      title="View All Payroll"
                    >
                      <EyeIcon class="w-3 h-3 mr-1" />
                      View All Payroll
                    </button>
                    <button
                      @click="editPayroll(employee)"
                      class="btn btn-xs btn-warning"
                      title="Edit"
                    >
                      <PencilIcon class="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Grid View -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="employee in paginatedPayroll"
            :key="employee.id"
            class="card hover:shadow-lg transition-shadow"
          >
            <div class="card-body">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                  <img
                    v-if="employee.avatar"
                    class="h-12 w-12 rounded-full"
                    :src="employee.avatar"
                    :alt="employee.name"
                  />
                  <div
                    v-else
                    class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <span class="text-lg font-medium text-gray-600">
                      {{ getInitials(employee.name) }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <h4 class="font-medium text-gray-900">{{ employee.name }}</h4>
                    <p class="text-sm text-gray-500">{{ employee.employeeId }}</p>
                    <p class="text-xs text-gray-400">{{ employee.department }}</p>
                  </div>
                </div>
                <span
                  v-if="employee.paymentStatus"
                  :class="getPaymentStatusClass(employee.paymentStatus)"
                  class="badge badge-sm"
                >
                  {{ employee.paymentStatus }}
                </span>
              </div>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Last Pay Date:</span>
                  <span class="font-medium">
                    {{ employee.lastPayDate ? formatDate(employee.lastPayDate) : 'N/A' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Gross Amount:</span>
                  <span class="font-bold text-gray-900">
                    {{ employee.lastGrossAmount ? formatCurrency(employee.lastGrossAmount) : '-' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Deductions:</span>
                  <span class="font-bold text-red-600">
                    {{ employee.lastDeductions ? formatCurrency(employee.lastDeductions) : '-' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Net Pay:</span>
                  <span class="font-bold text-green-600">
                    {{ employee.lastPaidAmount ? formatCurrency(employee.lastPaidAmount) : '-' }}
                  </span>
                </div>
              </div>

              <div class="mt-4 flex space-x-2">
                <button @click="viewPayroll(employee)" class="btn btn-sm btn-primary flex-1">
                  View All
                </button>
                <button
                  v-if="employee.lastPayslip"
                  @click="downloadPayslip(employee)"
                  class="btn btn-sm btn-outline"
                >
                  <DocumentTextIcon class="w-4 h-4" />
                </button>
                <button @click="editPayroll(employee)" class="btn btn-sm btn-warning">
                  <PencilIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  DocumentArrowDownIcon,
  CalculatorIcon,
  MagnifyingGlassIcon,
  BanknotesIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/vue/24/outline";

// Types
interface PayrollRecord {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  avatar?: string;
  lastPayDate?: Date;
  lastGrossAmount?: number;
  lastDeductions?: number;
  lastPaidAmount?: number;
  lastPayslip?: string;
  paymentStatus?: "paid" | "pending" | "failed";
  position: string;
  bankAccount: string;
}

// Reactive data
const router = useRouter();
const searchQuery = ref("");
const departmentFilter = ref("");
const periodFilter = ref("");
const currentPage = ref(1);
const entriesPerPage = ref(10);
const viewMode = ref<"list" | "grid">("list");
const currency = ref("TZS");

// Mock data
const payrollRecords = ref<PayrollRecord[]>([
  {
    id: "1",
    name: "Edwin Simon",
    employeeId: "EMP001",
    department: "Management",
    lastPayDate: new Date("2024-08-31"),
    lastGrossAmount: 3500000,
    lastDeductions: 525000,
    lastPaidAmount: 2975000,
    lastPayslip: "payslip-2024-08.pdf",
    paymentStatus: "paid",
    position: "CEO",
    bankAccount: "****1234",
  },
  {
    id: "2",
    name: "Joseph Ulomi",
    employeeId: "EMP002",
    department: "Finance",
    lastPayDate: new Date("2024-08-31"),
    lastGrossAmount: 2500000,
    lastDeductions: 375000,
    lastPaidAmount: 2125000,
    lastPayslip: "payslip-2024-08.pdf",
    paymentStatus: "paid",
    position: "Finance Manager",
    bankAccount: "****5678",
  },
  {
    id: "3",
    name: "Mary Kilimanjaro",
    employeeId: "EMP003",
    department: "Operations",
    lastPayDate: new Date("2024-08-31"),
    lastGrossAmount: 1800000,
    lastDeductions: 270000,
    lastPaidAmount: 1530000,
    lastPayslip: "payslip-2024-08.pdf",
    paymentStatus: "paid",
    position: "Operations Manager",
    bankAccount: "****9012",
  },
  {
    id: "4",
    name: "John Mwanza",
    employeeId: "EMP004",
    department: "IT",
    lastPayDate: new Date("2024-08-31"),
    lastGrossAmount: 2000000,
    lastDeductions: 300000,
    lastPaidAmount: 1700000,
    lastPayslip: "payslip-2024-08.pdf",
    paymentStatus: "pending",
    position: "IT Specialist",
    bankAccount: "****3456",
  },
  {
    id: "5",
    name: "Grace Nyerere",
    employeeId: "EMP005",
    department: "HR",
    lastPayDate: new Date("2024-08-31"),
    lastGrossAmount: 1500000,
    lastDeductions: 225000,
    lastPaidAmount: 1275000,
    lastPayslip: "payslip-2024-08.pdf",
    paymentStatus: "paid",
    position: "HR Manager",
    bankAccount: "****7890",
  },
  {
    id: "6",
    name: "Ahmed Hassan",
    employeeId: "EMP006",
    department: "Sales",
    lastPayDate: new Date("2024-08-31"),
    lastGrossAmount: 1200000,
    lastDeductions: 180000,
    lastPaidAmount: 1020000,
    paymentStatus: "paid",
    position: "Sales Representative",
    bankAccount: "****2345",
  },
  {
    id: "7",
    name: "Fatima Ali",
    employeeId: "EMP007",
    department: "Operations",
    position: "Junior Officer",
    bankAccount: "****6789",
  },
  {
    id: "8",
    name: "Peter Mushi",
    employeeId: "EMP008",
    department: "Finance",
    lastPayDate: new Date("2024-07-31"),
    lastGrossAmount: 1000000,
    lastDeductions: 150000,
    lastPaidAmount: 850000,
    lastPayslip: "payslip-2024-07.pdf",
    paymentStatus: "failed",
    position: "Accountant",
    bankAccount: "****0123",
  },
]);

// Computed properties
const filteredPayroll = computed(() => {
  let result = payrollRecords.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.employeeId.toLowerCase().includes(query),
    );
  }

  if (departmentFilter.value) {
    result = result.filter(
      (employee) => employee.department.toLowerCase() === departmentFilter.value,
    );
  }

  // Period filter logic would go here

  return result;
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedPayroll = computed(() => {
  return filteredPayroll.value.slice(startIndex.value, endIndex.value);
});

const totalEmployees = computed(() => payrollRecords.value.length);

const currentMonthTotal = computed(() => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  return payrollRecords.value
    .filter((emp) => {
      if (!emp.lastPayDate) return false;
      return (
        emp.lastPayDate.getMonth() === currentMonth &&
        emp.lastPayDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, emp) => sum + (emp.lastPaidAmount || 0), 0);
});

const pendingPayments = computed(() => {
  return payrollRecords.value.filter((emp) => emp.paymentStatus === "pending").length;
});

const averageSalary = computed(() => {
  const employeesWithSalary = payrollRecords.value.filter((emp) => emp.lastGrossAmount);
  if (employeesWithSalary.length === 0) return 0;
  const total = employeesWithSalary.reduce((sum, emp) => sum + (emp.lastGrossAmount || 0), 0);
  return Math.round(total / employeesWithSalary.length);
});

// Methods
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysAgo = (date: Date): string => {
  const diff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString();
};

const getDeductionPercentage = (employee: PayrollRecord): number => {
  if (!employee.lastGrossAmount || !employee.lastDeductions) return 0;
  return (employee.lastDeductions / employee.lastGrossAmount) * 100;
};

const getPaymentStatusClass = (status: string): string => {
  const classes: { [key: string]: string } = {
    paid: "badge-success",
    pending: "badge-warning",
    failed: "badge-danger",
  };
  return classes[status] || "badge-secondary";
};

const toggleView = () => {
  viewMode.value = viewMode.value === "list" ? "grid" : "list";
};

const exportPayroll = () => {
  const csvContent = [
    "Name,Employee ID,Department,Position,Last Pay Date,Gross Amount,Deductions,Net Pay,Status",
    ...filteredPayroll.value.map(
      (employee) =>
        `"${employee.name}","${employee.employeeId}","${employee.department}","${employee.position}","${employee.lastPayDate?.toISOString() || ""}",${employee.lastGrossAmount || 0},${employee.lastDeductions || 0},${employee.lastPaidAmount || 0},"${employee.paymentStatus || ""}"`,
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `payroll_export_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const processPayroll = () => {
  router.push("/payroll/create");
};

const viewPayroll = (employee: PayrollRecord) => {
  router.push(`/payroll/staff/${employee.id}`);
};

const editPayroll = (employee: PayrollRecord) => {
  router.push(`/payroll/edit/${employee.id}`);
};

const downloadPayslip = (employee: PayrollRecord) => {
  alert(`Download payslip: ${employee.lastPayslip}`);
};

defineOptions({
  name: "PayrollList",
});
</script>