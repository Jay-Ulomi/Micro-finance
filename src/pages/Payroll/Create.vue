<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Payroll</h1>
        <p class="text-sm text-gray-600">
          If you want to add/delete rows or change the field names, please visit
          <router-link to="/admin/payroll/templates" class="text-blue-600 hover:text-blue-800">
            Admin(top menu) → Payroll → Payroll Templates → Edit Template
          </router-link>
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="goBack" class="btn btn-secondary">
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button @click="savePayroll" class="btn btn-primary" :disabled="!isFormValid">
          <DocumentPlusIcon class="w-4 h-4 mr-2" />
          Save Payroll
        </button>
      </div>
    </div>

    <form @submit.prevent="savePayroll" class="space-y-6">
      <!-- Employee Information -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Employee Information</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
              <select v-model="payrollData.employeeName" class="form-input" required>
                <option value="">Select Employee</option>
                <option value="edwin simon">edwin simon</option>
                <option value="Joseph Ulomi">Joseph Ulomi</option>
                <option value="Mary Kilimanjaro">Mary Kilimanjaro</option>
                <option value="John Mwanza">John Mwanza</option>
                <option value="Grace Nyerere">Grace Nyerere</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Employee Number</label>
              <input
                v-model="payrollData.employeeNumber"
                type="text"
                class="form-input"
                readonly
                placeholder="Auto-filled based on employee"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payroll Date</label>
              <input
                v-model="payrollData.payrollDate"
                type="date"
                class="form-input"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                v-model="payrollData.businessName"
                type="text"
                class="form-input"
                readonly
                value="DPSL Company Limited"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Earnings -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Earnings</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div v-for="earning in earnings" :key="earning.id" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ earning.description }}</label>
                <input
                  v-model="earning.description"
                  type="text"
                  class="form-input"
                  :readonly="earning.isDefault"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div class="flex">
                  <input
                    v-model.number="earning.amount"
                    type="number"
                    step="0.01"
                    class="form-input"
                    @input="calculateTotals"
                  />
                  <button
                    v-if="!earning.isDefault"
                    @click="removeEarning(earning.id)"
                    type="button"
                    class="ml-2 btn btn-xs btn-danger"
                  >
                    <TrashIcon class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <button @click="addEarning" type="button" class="btn btn-sm btn-outline">
              <PlusIcon class="w-4 h-4 mr-1" />
              Add Earning
            </button>
          </div>
        </div>
      </div>

      <!-- Deductions -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Deductions</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div v-for="deduction in deductions" :key="deduction.id" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ deduction.description }}</label>
                <input
                  v-model="deduction.description"
                  type="text"
                  class="form-input"
                  :readonly="deduction.isDefault"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div class="flex">
                  <input
                    v-model.number="deduction.amount"
                    type="number"
                    step="0.01"
                    class="form-input"
                    @input="calculateTotals"
                  />
                  <button
                    v-if="!deduction.isDefault"
                    @click="removeDeduction(deduction.id)"
                    type="button"
                    class="ml-2 btn btn-xs btn-danger"
                  >
                    <TrashIcon class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <button @click="addDeduction" type="button" class="btn btn-sm btn-outline">
              <PlusIcon class="w-4 h-4 mr-1" />
              Add Deduction
            </button>
          </div>
        </div>
      </div>

      <!-- Payroll Summary -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Payroll Summary</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-medium text-green-700">Total Pay</h4>
              <p class="text-2xl font-bold text-green-800">{{ formatCurrency(totalPay) }}</p>
            </div>
            <div class="bg-red-50 p-4 rounded-lg">
              <h4 class="font-medium text-red-700">Total Deductions</h4>
              <p class="text-2xl font-bold text-red-800">{{ formatCurrency(totalDeductions) }}</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-medium text-blue-700">Net Pay</h4>
              <p class="text-2xl font-bold text-blue-800">{{ formatCurrency(netPay) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Net Pay Distribution -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Net Pay Distribution</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select v-model="payrollData.paymentMethod" class="form-input">
                <option value="">Select Method</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="mobile">Mobile Money</option>
              </select>
            </div>
            <div v-if="payrollData.paymentMethod === 'bank'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <select v-model="payrollData.bankName" class="form-input">
                <option value="">Select Bank</option>
                <option value="NMB Bank">NMB Bank</option>
                <option value="CRDB Bank">CRDB Bank</option>
                <option value="NBC Bank">NBC Bank</option>
                <option value="Equity Bank">Equity Bank</option>
                <option value="Stanbic Bank">Stanbic Bank</option>
              </select>
            </div>
            <div v-if="payrollData.paymentMethod === 'bank'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                v-model="payrollData.accountNumber"
                type="text"
                class="form-input"
                placeholder="Enter account number"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                v-model="payrollData.description"
                type="text"
                class="form-input"
                placeholder="Payment description"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
              <input
                v-model.number="payrollData.paidAmount"
                type="number"
                step="0.01"
                class="form-input"
                :placeholder="netPay.toString()"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Comments</label>
              <textarea
                v-model="payrollData.comments"
                class="form-textarea"
                rows="3"
                placeholder="Additional comments..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Recurring Payroll -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">🔄 Recurring Payroll (optional)</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Is the Payroll Recurring?</label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="payrollData.isRecurring"
                    type="radio"
                    :value="false"
                    class="form-radio"
                  />
                  <span class="ml-2">No</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="payrollData.isRecurring"
                    type="radio"
                    :value="true"
                    class="form-radio"
                  />
                  <span class="ml-2">Yes</span>
                </label>
              </div>
              <p class="text-sm text-gray-600 mt-2">
                If you select Yes, then the Payroll will be automatically added by system every week or month.
              </p>
            </div>

            <div v-if="payrollData.isRecurring" class="space-y-4">
              <h4 class="font-medium">Add Recurring Payroll</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">From:</label>
                  <input
                    v-model="payrollData.recurringFrom"
                    type="date"
                    class="form-input"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Frequency:</label>
                  <select v-model="payrollData.recurringFrequency" class="form-input">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Email & Accounting Notes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Email Notification -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Email Notification</h3>
          </div>
          <div class="card-body">
            <div class="bg-orange-50 border border-orange-200 rounded-md p-4">
              <div class="flex">
                <ExclamationTriangleIcon class="w-5 h-5 text-orange-400 mt-0.5 mr-3" />
                <div>
                  <p class="text-sm text-orange-700">
                    You can not send payslips to the staff's email address. There are no verified email accounts available to use.
                  </p>
                  <button class="text-orange-600 hover:text-orange-800 text-sm font-medium mt-1">
                    Click here to create email accounts.
                  </button>
                </div>
              </div>
            </div>
            <button @click="manageEmailAccounts" class="btn btn-outline mt-3">
              <EnvelopeIcon class="w-4 h-4 mr-2" />
              Add/Edit Email Accounts
            </button>
          </div>
        </div>

        <!-- Accounting -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Accounting</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-600 mb-3">
                  Please select the bank account from which the funds were paid. This will allow the system to make the proper journal entry.
                </p>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Cash/Bank</label>
                  <select v-model="payrollData.paymentAccount" class="form-input">
                    <option value="cash">Cash</option>
                    <option value="nmb-20501000123">NMB Bank - 20501000123</option>
                    <option value="crdb-01J1234567890">CRDB Bank - 01J1234567890</option>
                    <option value="nbc-011103456789">NBC Bank - 011103456789</option>
                  </select>
                </div>
              </div>
              <button @click="manageBankAccounts" class="btn btn-outline">
                <BuildingLibraryIcon class="w-4 h-4 mr-2" />
                Add/Edit Bank Accounts
              </button>
              <p class="text-xs text-gray-500">
                To bulk reconcile past entries with bank accounts, please visit Accounting(left menu) → Reconcile Entries
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Fields -->
      <div class="card">
        <div class="card-body text-center">
          <button @click="addCustomFields" type="button" class="btn btn-outline">
            <PlusIcon class="w-4 h-4 mr-2" />
            Click here to add custom fields on this page
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowLeftIcon,
  DocumentPlusIcon,
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  BuildingLibraryIcon,
} from "@heroicons/vue/24/outline";

// Types
interface EarningItem {
  id: string;
  description: string;
  amount: number;
  isDefault: boolean;
}

interface DeductionItem {
  id: string;
  description: string;
  amount: number;
  isDefault: boolean;
}

interface PayrollData {
  employeeName: string;
  employeeNumber: string;
  payrollDate: string;
  businessName: string;
  paymentMethod: string;
  bankName: string;
  accountNumber: string;
  description: string;
  paidAmount: number;
  comments: string;
  isRecurring: boolean;
  recurringFrom: string;
  recurringFrequency: string;
  paymentAccount: string;
}

// Reactive data
const router = useRouter();

const payrollData = ref<PayrollData>({
  employeeName: "",
  employeeNumber: "",
  payrollDate: "",
  businessName: "DPSL Company Limited",
  paymentMethod: "",
  bankName: "",
  accountNumber: "",
  description: "",
  paidAmount: 0,
  comments: "",
  isRecurring: false,
  recurringFrom: "",
  recurringFrequency: "monthly",
  paymentAccount: "cash",
});

const earnings = ref<EarningItem[]>([
  { id: "1", description: "Basic Pay", amount: 0, isDefault: true },
  { id: "2", description: "Overtime", amount: 0, isDefault: true },
  { id: "3", description: "Paid Leaves", amount: 0, isDefault: true },
  { id: "4", description: "Transport Allowance", amount: 0, isDefault: true },
  { id: "5", description: "Medical Allowance", amount: 0, isDefault: true },
  { id: "6", description: "Bonus", amount: 0, isDefault: true },
  { id: "7", description: "Other Allowance", amount: 0, isDefault: true },
]);

const deductions = ref<DeductionItem[]>([
  { id: "1", description: "Pension", amount: 0, isDefault: true },
  { id: "2", description: "Health Insurance", amount: 0, isDefault: true },
  { id: "3", description: "Unpaid Leave", amount: 0, isDefault: true },
  { id: "4", description: "Tax Deduction", amount: 0, isDefault: true },
  { id: "5", description: "Salary Loan", amount: 0, isDefault: true },
]);

// Computed properties
const totalPay = computed(() => {
  return earnings.value.reduce((sum, earning) => sum + (earning.amount || 0), 0);
});

const totalDeductions = computed(() => {
  return deductions.value.reduce((sum, deduction) => sum + (deduction.amount || 0), 0);
});

const netPay = computed(() => {
  return totalPay.value - totalDeductions.value;
});

const isFormValid = computed(() => {
  return payrollData.value.employeeName && payrollData.value.payrollDate && totalPay.value > 0;
});

// Employee data mapping
const employeeData: { [key: string]: string } = {
  "edwin simon": "EMP001",
  "Joseph Ulomi": "EMP002",
  "Mary Kilimanjaro": "EMP003",
  "John Mwanza": "EMP004",
  "Grace Nyerere": "EMP005",
};

// Watchers
watch(() => payrollData.value.employeeName, (newName) => {
  if (newName) {
    payrollData.value.employeeNumber = employeeData[newName] || "";
  }
});

watch(netPay, (newNetPay) => {
  if (!payrollData.value.paidAmount || payrollData.value.paidAmount === 0) {
    payrollData.value.paidAmount = newNetPay;
  }
});

// Methods
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString();
};

const addEarning = () => {
  const newId = Math.random().toString(36).substr(2, 9);
  earnings.value.push({
    id: newId,
    description: "New Earning",
    amount: 0,
    isDefault: false,
  });
};

const removeEarning = (id: string) => {
  earnings.value = earnings.value.filter((earning) => earning.id !== id);
  calculateTotals();
};

const addDeduction = () => {
  const newId = Math.random().toString(36).substr(2, 9);
  deductions.value.push({
    id: newId,
    description: "New Deduction",
    amount: 0,
    isDefault: false,
  });
};

const removeDeduction = (id: string) => {
  deductions.value = deductions.value.filter((deduction) => deduction.id !== id);
  calculateTotals();
};

const calculateTotals = () => {
  // Trigger reactivity
  earnings.value = [...earnings.value];
  deductions.value = [...deductions.value];
};

const goBack = () => {
  router.back();
};

const savePayroll = () => {
  if (!isFormValid.value) {
    alert("Please fill in all required fields");
    return;
  }

  const payrollRecord = {
    ...payrollData.value,
    earnings: earnings.value,
    deductions: deductions.value,
    totalPay: totalPay.value,
    totalDeductions: totalDeductions.value,
    netPay: netPay.value,
  };

  console.log("Saving payroll:", payrollRecord);
  alert("Payroll saved successfully!");
  router.push("/payroll");
};

const manageEmailAccounts = () => {
  router.push("/admin/email-accounts");
};

const manageBankAccounts = () => {
  router.push("/admin/bank-accounts");
};

const addCustomFields = () => {
  alert("Custom fields functionality will be implemented here");
};

defineOptions({
  name: "PayrollCreate",
});
</script>
