<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Bulk Transactions</h1>
        <p class="text-sm text-gray-600">You can use this page to add bulk savings transactions. Please be careful that you select the right savings account. You can enter as many rows as you like.</p>
      </div>
      <div class="flex space-x-3">
        <button @click="makeFullscreen" class="btn btn-secondary">
          <ArrowsPointingOutIcon class="w-4 h-4 mr-2" />
          To make this page fullscreen, click here
        </button>
        <button @click="saveBulkTransactions" class="btn btn-primary">
          <CheckIcon class="w-4 h-4 mr-2" />
          Save All Transactions
        </button>
      </div>
    </div>

    <!-- Bulk Transaction Form -->
    <div class="card">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th class="text-center w-16">Row</th>
                <th class="text-left w-48">Savings</th>
                <th class="text-right w-32">Amount</th>
                <th class="text-center w-32">Type</th>
                <th class="text-center w-36">Date</th>
                <th class="text-center w-32">Time</th>
                <th class="text-left w-48">Description (optional)</th>
                <th class="text-center w-40">Accounting: Cash/Bank</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, index) in transactions" :key="index + 1" class="hover:bg-gray-50">
                <td class="text-center font-bold">{{ index + 1 }}</td>
                
                <!-- Savings Account Selection -->
                <td>
                  <select v-model="transaction.savingsAccount" class="form-input w-full text-sm">
                    <option value="">Select Account</option>
                    <option v-for="account in savingsAccounts" :key="account.id" :value="account.id">
                      {{ account.clientName }} - {{ account.accountNumber }}
                    </option>
                  </select>
                  <div v-if="index === 0" class="mt-1">
                    <button @click="setDefaultSavings" class="text-xs text-blue-600 hover:text-blue-800">
                      Set Default
                    </button>
                  </div>
                </td>

                <!-- Amount -->
                <td>
                  <input 
                    v-model.number="transaction.amount" 
                    type="number" 
                    step="0.01" 
                    placeholder="Amount"
                    class="form-input w-full text-sm text-right"
                  />
                  <div v-if="index === 0" class="mt-1">
                    <button @click="setDefaultAmount" class="text-xs text-blue-600 hover:text-blue-800">
                      Set Default
                    </button>
                  </div>
                </td>

                <!-- Transaction Type -->
                <td>
                  <select v-model="transaction.type" class="form-input w-full text-sm">
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="transfer">Transfer</option>
                    <option value="fee">Fee</option>
                    <option value="interest">Interest</option>
                  </select>
                  <div v-if="index === 0" class="mt-1">
                    <button @click="setDefaultType" class="text-xs text-blue-600 hover:text-blue-800">
                      Set Default
                    </button>
                  </div>
                </td>

                <!-- Date -->
                <td>
                  <input 
                    v-model="transaction.date" 
                    type="date" 
                    class="form-input w-full text-sm"
                  />
                  <div v-if="index === 0" class="mt-1">
                    <button @click="setDefaultDate" class="text-xs text-blue-600 hover:text-blue-800">
                      Set Default
                    </button>
                  </div>
                </td>

                <!-- Time -->
                <td>
                  <input 
                    v-model="transaction.time" 
                    type="time" 
                    class="form-input w-full text-sm"
                  />
                  <div v-if="index === 0" class="mt-1">
                    <button @click="setDefaultTime" class="text-xs text-blue-600 hover:text-blue-800">
                      Set Default
                    </button>
                  </div>
                </td>

                <!-- Description -->
                <td>
                  <input 
                    v-model="transaction.description" 
                    type="text" 
                    placeholder="Description"
                    class="form-input w-full text-sm"
                  />
                  <div v-if="index === 0" class="mt-1">
                    <button @click="setDefaultDescription" class="text-xs text-blue-600 hover:text-blue-800">
                      Set Default
                    </button>
                  </div>
                </td>

                <!-- Cash/Bank -->
                <td>
                  <select v-model="transaction.accounting" class="form-input w-full text-sm">
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                    <option value="check">Check</option>
                    <option value="transfer">Transfer</option>
                  </select>
                  <div v-if="index === 0" class="mt-1">
                    <button @click="setDefaultAccounting" class="text-xs text-blue-600 hover:text-blue-800">
                      Set Default
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex justify-between items-center">
          <div class="flex space-x-3">
            <button @click="addMoreRows" class="btn btn-secondary">
              <PlusIcon class="w-4 h-4 mr-2" />
              Add More Rows
            </button>
            <button @click="clearAll" class="btn btn-outline">
              <XMarkIcon class="w-4 h-4 mr-2" />
              Clear All
            </button>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              Total Rows: <span class="font-medium">{{ transactions.length }}</span>
            </div>
            <div class="text-sm text-gray-600">
              Valid Transactions: <span class="font-medium">{{ validTransactions }}</span>
            </div>
            <div class="text-sm text-gray-600">
              Total Amount: <span class="font-medium text-green-600">${{ totalAmount.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Summary -->
    <div v-if="validationErrors.length > 0" class="card border-red-200 bg-red-50">
      <div class="card-body">
        <div class="flex items-start">
          <ExclamationTriangleIcon class="w-5 h-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 class="font-medium text-red-900 mb-2">Please fix the following issues:</h3>
            <ul class="list-disc list-inside text-sm text-red-800 space-y-1">
              <li v-for="error in validationErrors" :key="error">{{ error }}</li>
            </ul>
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
  XMarkIcon,
  CheckIcon,
  ArrowsPointingOutIcon,
  ExclamationTriangleIcon
} from "@heroicons/vue/24/outline";

// Types
interface BulkTransaction {
  savingsAccount: string;
  amount: number | null;
  type: string;
  date: string;
  time: string;
  description: string;
  accounting: string;
}

interface SavingsAccount {
  id: string;
  clientName: string;
  accountNumber: string;
  balance: number;
}

// Reactive data
const router = useRouter();

// Mock savings accounts data
const savingsAccounts = ref<SavingsAccount[]>([
  { id: "1", clientName: "John Doe", accountNumber: "SAV001234", balance: 12030 },
  { id: "2", clientName: "Jane Smith", accountNumber: "SAV005678", balance: 19500 },
  { id: "3", clientName: "Bob Johnson", accountNumber: "SAV009876", balance: 10415 },
  { id: "4", clientName: "Alice Williams", accountNumber: "SAV543210", balance: 6200 },
  { id: "5", clientName: "Charlie Brown", accountNumber: "SAV111222", balance: 16700 },
  { id: "6", clientName: "David Wilson", accountNumber: "SAV777888", balance: 8950 },
  { id: "7", clientName: "Emma Davis", accountNumber: "SAV999000", balance: 14300 },
  { id: "8", clientName: "Frank Miller", accountNumber: "SAV444555", balance: 22100 }
]);

// Initialize with 14 rows as shown in the original
const transactions = ref<BulkTransaction[]>(
  Array.from({ length: 14 }, () => ({
    savingsAccount: "",
    amount: null,
    type: "deposit",
    date: new Date().toISOString().split('T')[0],
    time: "23:15",
    description: "Description",
    accounting: "cash"
  }))
);

// Computed properties
const validTransactions = computed(() => {
  return transactions.value.filter(t => 
    t.savingsAccount && 
    t.amount !== null && 
    t.amount > 0 && 
    t.date && 
    t.time
  ).length;
});

const totalAmount = computed(() => {
  return transactions.value
    .filter(t => t.amount !== null && t.amount > 0)
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const validationErrors = computed(() => {
  const errors: string[] = [];
  
  transactions.value.forEach((transaction, index) => {
    const rowNumber = index + 1;
    
    if (!transaction.savingsAccount && (transaction.amount || transaction.description !== "Description")) {
      errors.push(`Row ${rowNumber}: Please select a savings account`);
    }
    
    if (transaction.savingsAccount && (!transaction.amount || transaction.amount <= 0)) {
      errors.push(`Row ${rowNumber}: Please enter a valid amount`);
    }
    
    if (transaction.savingsAccount && !transaction.date) {
      errors.push(`Row ${rowNumber}: Please select a date`);
    }
    
    if (transaction.savingsAccount && !transaction.time) {
      errors.push(`Row ${rowNumber}: Please enter a time`);
    }
  });
  
  return errors;
});

// Methods
const setDefaultSavings = () => {
  const firstRow = transactions.value[0];
  if (firstRow.savingsAccount) {
    for (let i = 1; i < transactions.value.length; i++) {
      transactions.value[i].savingsAccount = firstRow.savingsAccount;
    }
  }
};

const setDefaultAmount = () => {
  const firstRow = transactions.value[0];
  if (firstRow.amount !== null) {
    for (let i = 1; i < transactions.value.length; i++) {
      transactions.value[i].amount = firstRow.amount;
    }
  }
};

const setDefaultType = () => {
  const firstRow = transactions.value[0];
  for (let i = 1; i < transactions.value.length; i++) {
    transactions.value[i].type = firstRow.type;
  }
};

const setDefaultDate = () => {
  const firstRow = transactions.value[0];
  if (firstRow.date) {
    for (let i = 1; i < transactions.value.length; i++) {
      transactions.value[i].date = firstRow.date;
    }
  }
};

const setDefaultTime = () => {
  const firstRow = transactions.value[0];
  if (firstRow.time) {
    for (let i = 1; i < transactions.value.length; i++) {
      transactions.value[i].time = firstRow.time;
    }
  }
};

const setDefaultDescription = () => {
  const firstRow = transactions.value[0];
  if (firstRow.description) {
    for (let i = 1; i < transactions.value.length; i++) {
      transactions.value[i].description = firstRow.description;
    }
  }
};

const setDefaultAccounting = () => {
  const firstRow = transactions.value[0];
  for (let i = 1; i < transactions.value.length; i++) {
    transactions.value[i].accounting = firstRow.accounting;
  }
};

const addMoreRows = () => {
  const newRows = Array.from({ length: 5 }, () => ({
    savingsAccount: "",
    amount: null,
    type: "deposit",
    date: new Date().toISOString().split('T')[0],
    time: "23:15",
    description: "Description",
    accounting: "cash"
  }));
  transactions.value.push(...newRows);
};

const clearAll = () => {
  if (confirm("Are you sure you want to clear all transaction data?")) {
    transactions.value.forEach(transaction => {
      transaction.savingsAccount = "";
      transaction.amount = null;
      transaction.type = "deposit";
      transaction.date = new Date().toISOString().split('T')[0];
      transaction.time = "23:15";
      transaction.description = "Description";
      transaction.accounting = "cash";
    });
  }
};

const makeFullscreen = () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
};

const saveBulkTransactions = () => {
  if (validationErrors.value.length > 0) {
    alert("Please fix all validation errors before saving.");
    return;
  }
  
  if (validTransactions.value === 0) {
    alert("Please enter at least one valid transaction.");
    return;
  }
  
  if (confirm(`Save ${validTransactions.value} transactions with total amount of $${totalAmount.value.toLocaleString()}?`)) {
    // Here you would normally send the data to your backend API
    const validTransactionData = transactions.value.filter(t => 
      t.savingsAccount && 
      t.amount !== null && 
      t.amount > 0 && 
      t.date && 
      t.time
    );
    
    console.log("Saving bulk transactions:", validTransactionData);
    alert(`Successfully saved ${validTransactions.value} transactions!`);
    
    // Navigate back to transactions list
    router.push("/savings-transactions");
  }
};

// Initialize default values
onMounted(() => {
  // Set current date and time defaults
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  
  transactions.value.forEach(transaction => {
    transaction.time = currentTime;
  });
});

defineOptions({
  name: "BulkAddSavingsTransactions",
});
</script>