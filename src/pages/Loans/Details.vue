<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Loan Details</h1>
        <p class="text-gray-600">View and manage loan information</p>
      </div>
      <div class="flex space-x-3">
        <router-link :to="`/loans/${loanId}/edit`" class="btn-secondary">
          Edit Loan
        </router-link>
        <button @click="showWorkflowModal = true" class="btn-primary">
          Manage Workflow
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loansStore.isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Loan not found -->
    <div v-else-if="!loansStore.currentLoan" class="text-center py-8">
      <p class="text-gray-500">Loan not found</p>
      <router-link to="/loans" class="btn-primary mt-4">Back to Loans</router-link>
    </div>

    <!-- Loan details -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main loan information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Loan Summary -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium">Loan Summary</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="form-label">Loan Number</label>
                  <p class="text-gray-900 font-medium">{{ loansStore.currentLoan.loanNumber }}</p>
                </div>
                <div>
                  <label class="form-label">Customer</label>
                  <router-link
                    :to="`/customers/${loansStore.currentLoan.customerId}`"
                    class="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    {{ loansStore.currentLoan.customer.firstName }} {{ loansStore.currentLoan.customer.lastName }}
                  </router-link>
                </div>
                <div>
                  <label class="form-label">Loan Type</label>
                  <p class="text-gray-900">{{ loansStore.currentLoan.loanType }}</p>
                </div>
                <div>
                  <label class="form-label">Purpose</label>
                  <p class="text-gray-900">{{ loansStore.currentLoan.purpose }}</p>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="form-label">Status</label>
                  <span :class="getStatusClass(loansStore.currentLoan.status)" class="px-3 py-1 text-sm font-medium rounded-full">
                    {{ loansStore.currentLoan.status }}
                  </span>
                </div>
                <div>
                  <label class="form-label">Amount</label>
                  <p class="text-gray-900 font-medium">{{ formatCurrency(loansStore.currentLoan.amount) }}</p>
                </div>
                <div>
                  <label class="form-label">Term</label>
                  <p class="text-gray-900">{{ loansStore.currentLoan.term }} months</p>
                </div>
                <div>
                  <label class="form-label">Interest Rate</label>
                  <p class="text-gray-900">{{ loansStore.currentLoan.interestRate }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Schedule -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">Payment Schedule</h3>
              <button @click="generateSchedule" class="btn-secondary text-sm">
                Generate Schedule
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loansStore.currentLoan.schedule?.length" class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>Installment #</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="installment in loansStore.currentLoan.schedule" :key="installment.number">
                    <td class="text-sm text-gray-900">{{ installment.number }}</td>
                    <td class="text-sm text-gray-900">{{ formatDate(installment.dueDate) }}</td>
                    <td class="text-sm text-gray-900 font-medium">{{ formatCurrency(installment.amount) }}</td>
                    <td class="text-sm text-gray-900">{{ formatCurrency(installment.principal) }}</td>
                    <td class="text-sm text-gray-900">{{ formatCurrency(installment.interest) }}</td>
                    <td>
                      <span :class="getInstallmentStatusClass(installment.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ installment.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <p>No payment schedule generated yet</p>
              <button @click="generateSchedule" class="btn-primary mt-2">Generate Schedule</button>
            </div>
          </div>
        </div>

        <!-- Loan Documents -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium">Loan Documents</h3>
          </div>
          <div class="card-body">
            <div v-if="loansStore.currentLoan.documents?.length" class="space-y-3">
              <div v-for="doc in loansStore.currentLoan.documents" :key="doc.id" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ doc.documentType }}</p>
                    <p class="text-sm text-gray-500">{{ doc.filename }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="getDocumentStatusClass(doc.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ doc.status }}
                  </span>
                  <button @click="downloadDocument(doc.id)" class="text-primary-600 hover:text-primary-800">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-6 text-gray-500">
              <p>No documents uploaded yet</p>
            </div>

            <!-- Upload new document -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <h4 class="font-medium text-gray-900 mb-3">Upload New Document</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Document Type</label>
                  <select v-model="newDocument.type" class="form-input">
                    <option value="">Select type</option>
                    <option value="application_form">Application Form</option>
                    <option value="income_proof">Income Proof</option>
                    <option value="bank_statement">Bank Statement</option>
                    <option value="collateral_document">Collateral Document</option>
                    <option value="guarantor_document">Guarantor Document</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="form-label">Document File</label>
                  <input @change="handleFileUpload" type="file" class="form-input" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
                <div class="md:col-span-2">
                  <button @click="uploadDocument" :disabled="!newDocument.type || !newDocument.file" class="btn-primary">
                    Upload Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Loan Summary -->
        <div class="card">
          <div class="card-body space-y-4">
            <h4 class="font-medium text-gray-900">Loan Summary</h4>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Monthly Payment:</span>
                <span class="font-medium">{{ formatCurrency(monthlyPayment) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Interest:</span>
                <span class="font-medium">{{ formatCurrency(totalInterest) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Amount:</span>
                <span class="font-medium">{{ formatCurrency(totalAmount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Remaining Balance:</span>
                <span class="font-medium">{{ formatCurrency(remainingBalance) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Workflow Actions -->
        <div class="card">
          <div class="card-body space-y-3">
            <h4 class="font-medium text-gray-900">Workflow Actions</h4>
            <button
              v-if="canApprove"
              @click="approveLoan"
              class="btn-primary w-full"
            >
              Approve Loan
            </button>
            <button
              v-if="canReject"
              @click="rejectLoan"
              class="btn-secondary w-full"
            >
              Reject Loan
            </button>
            <button
              v-if="canDisburse"
              @click="disburseLoan"
              class="btn-primary w-full"
            >
              Disburse Loan
            </button>
            <button
              v-if="canClose"
              @click="closeLoan"
              class="btn-secondary w-full"
            >
              Close Loan
            </button>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-body space-y-3">
            <h4 class="font-medium text-gray-900">Quick Actions</h4>
            <button @click="exportLoanData" class="btn-secondary w-full">
              Export Data
            </button>
            <button @click="printLoanSummary" class="btn-secondary w-full">
              Print Summary
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Workflow Modal -->
    <div v-if="showWorkflowModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showWorkflowModal = false"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Manage Loan Workflow</h3>
            <div class="space-y-4">
              <div>
                <label class="form-label">Approved Amount</label>
                <input v-model="workflowData.approvedAmount" type="number" class="form-input" min="0" step="100" />
              </div>
              <div>
                <label class="form-label">Notes</label>
                <textarea v-model="workflowData.notes" class="form-input" rows="3" placeholder="Add notes about the decision..."></textarea>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="showWorkflowModal = false" class="btn-secondary sm:ml-3 sm:w-auto w-full">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLoansStore } from "@/store/loans";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import { calculateMonthlyPayment, calculateTotalAmount, calculateRemainingBalance } from "@/utils/loanCalculator";
import type { Loan } from "@/types";

const route = useRoute();
const router = useRouter();
const loansStore = useLoansStore();

// Global notification functions
const showSuccess = inject("showSuccess") as (message: string) => void;
const showError = inject("showError") as (message: string) => void;

const loanId = route.params.id as string;
const showWorkflowModal = ref(false);
const newDocument = reactive({
  type: "",
  file: null as File | null,
});

const workflowData = reactive({
  approvedAmount: 0,
  notes: "",
});

onMounted(async () => {
  if (loanId) {
    try {
      await loansStore.getLoan(loanId);
    } catch (error) {
      showError("Failed to load loan details");
    }
  }
});

// Computed properties
const monthlyPayment = computed(() => {
  const loan = loansStore.currentLoan;
  if (!loan) return 0;
  return calculateMonthlyPayment(loan.amount, loan.interestRate, loan.term);
});

const totalInterest = computed(() => {
  const loan = loansStore.currentLoan;
  if (!loan) return 0;
  return calculateTotalAmount(loan.amount, loan.interestRate, loan.term) - loan.amount;
});

const totalAmount = computed(() => {
  const loan = loansStore.currentLoan;
  if (!loan) return 0;
  return calculateTotalAmount(loan.amount, loan.interestRate, loan.term);
});

const remainingBalance = computed(() => {
  const loan = loansStore.currentLoan;
  if (!loan) return 0;
  return calculateRemainingBalance(loan);
});

// Workflow permissions
const canApprove = computed(() => {
  const loan = loansStore.currentLoan;
  return loan && loan.status === "pending";
});

const canReject = computed(() => {
  const loan = loansStore.currentLoan;
  return loan && loan.status === "pending";
});

const canDisburse = computed(() => {
  const loan = loansStore.currentLoan;
  return loan && loan.status === "approved";
});

const canClose = computed(() => {
  const loan = loansStore.currentLoan;
  return loan && loan.status === "disbursed";
});

// Helper functions
const getStatusClass = (status: string) => {
  const classes = {
    pending: "px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full",
    approved: "px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full",
    rejected: "px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full",
    disbursed: "px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full",
    closed: "px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full",
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

const getInstallmentStatusClass = (status: string) => {
  const classes = {
    pending: "px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full",
    paid: "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full",
    overdue: "px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full",
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

const getDocumentStatusClass = (status: string) => {
  const classes = {
    pending: "px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full",
    approved: "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full",
    rejected: "px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full",
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

// Actions
const generateSchedule = async () => {
  try {
    await loansStore.generateLoanSchedule(loanId);
    showSuccess("Payment schedule generated successfully");
  } catch (error) {
    showError("Failed to generate payment schedule");
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    newDocument.file = target.files[0];
  }
};

const uploadDocument = async () => {
  if (!newDocument.file || !newDocument.type) return;

  try {
    const formData = new FormData();
    formData.append("document", newDocument.file);
    formData.append("type", newDocument.type);

    await loansStore.uploadLoanDocument(loanId, formData);
    showSuccess("Document uploaded successfully");

    // Reset form
    newDocument.type = "";
    newDocument.file = null;
  } catch (error) {
    showError("Failed to upload document");
  }
};

const downloadDocument = (documentId: string) => {
  // Implementation for downloading document
  showSuccess("Document download started");
};

const approveLoan = async () => {
  try {
    await loansStore.approveLoan(loanId, { approvedAmount: workflowData.approvedAmount, notes: workflowData.notes });
    showSuccess("Loan approved successfully");
    showWorkflowModal.value = false;
  } catch (error) {
    showError("Failed to approve loan");
  }
};

const rejectLoan = async () => {
  try {
    await loansStore.rejectLoan(loanId, { notes: workflowData.notes });
    showSuccess("Loan rejected successfully");
    showWorkflowModal.value = false;
  } catch (error) {
    showError("Failed to reject loan");
  }
};

const disburseLoan = async () => {
  try {
    await loansStore.disburseLoan(loanId, { notes: workflowData.notes });
    showSuccess("Loan disbursed successfully");
    showWorkflowModal.value = false;
  } catch (error) {
    showError("Failed to disburse loan");
  }
};

const closeLoan = async () => {
  try {
    await loansStore.closeLoan(loanId, { notes: workflowData.notes });
    showSuccess("Loan closed successfully");
    showWorkflowModal.value = false;
  } catch (error) {
    showError("Failed to close loan");
  }
};

const exportLoanData = () => {
  // Implementation for exporting loan data
  showSuccess("Loan data exported successfully");
};

const printLoanSummary = () => {
  // Implementation for printing loan summary
  showSuccess("Printing loan summary");
};
</script>
