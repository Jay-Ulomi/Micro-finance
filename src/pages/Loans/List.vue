<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Loans</h1>
        <p class="mt-1 text-sm text-gray-500">Manage loan applications and track loan status</p>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="refreshLoans" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
        <router-link to="/loans/apply" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Apply for Loan
        </router-link>
      </div>
    </div>

    <!-- Filters and search -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            class="form-input"
            placeholder="Search by loan number, borrower name..."
            @input="handleSearch"
          />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select id="status" v-model="statusFilter" class="form-input" @change="handleFilter">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label for="loanType" class="block text-sm font-medium text-gray-700 mb-1"
            >Loan Type</label
          >
          <select id="loanType" v-model="loanTypeFilter" class="form-input" @change="handleFilter">
            <option value="">All Types</option>
            <option value="business-loan">Business Loan</option>
            <option value="personal-loan">Personal Loan</option>
            <option value="agricultural-loan">Agricultural Loan</option>
            <option value="micro-loan">Micro Loan</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="resetFilters" class="btn-secondary w-full">Reset Filters</button>
        </div>
      </div>
    </div>

    <!-- Loans table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <div v-if="isLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="loans.length === 0" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No loans found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by applying for a new loan.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  View
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Released
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Loan#
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Principal
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Interest Rate
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Due
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Paid
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Balance
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Payment
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="loan in loans" :key="loan.id" class="hover:bg-gray-50">
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link :to="`/loans/${loan.id}`" class="text-blue-600 hover:text-blue-900">
                    View
                  </router-link>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ loan.loanReleaseDate ? formatDate(loan.loanReleaseDate) : "-" }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span class="text-blue-600 font-medium text-sm">
                        {{ loan.borrower.firstName.charAt(0)
                        }}{{ loan.borrower.lastName.charAt(0) }}
                      </span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ loan.borrower.firstName }} {{ loan.borrower.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">{{ loan.borrower.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span class="font-mono text-sm text-gray-900">{{ loan.loanNumber }}</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ formatCurrency(loan.principalAmount) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ loan.interestRate }}%
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ formatCurrency(calculateTotalDue(loan)) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ formatCurrency(loan.totalPaid || 0) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ formatCurrency(loan.outstandingBalance || 0) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ loan.lastPaymentDate ? formatDate(loan.lastPaymentDate) : "-" }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      {
                        'bg-yellow-100 text-yellow-800': loan.status === 'pending',
                        'bg-green-100 text-green-800': loan.status === 'approved',
                        'bg-blue-100 text-blue-800': loan.status === 'active',
                        'bg-red-100 text-red-800': loan.status === 'overdue',
                        'bg-gray-100 text-gray-800': loan.status === 'closed',
                      },
                    ]"
                  >
                    {{ formatStatus(loan.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, totalLoans) }} of {{ totalLoans }} results
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
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
import { service, type Loan } from "@/services";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

// Reactive data
const loans = ref<Loan[]>([]);
const isLoading = ref(false);
const searchQuery = ref("");
const statusFilter = ref("");
const loanTypeFilter = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalLoans = ref(0);

// Computed properties
// No need for client-side filtering since service handles it

// totalLoans is now managed by the service response

const totalPages = computed(() => {
  return Math.ceil(totalLoans.value / itemsPerPage.value);
});

// Methods
const loadLoans = async () => {
  try {
    isLoading.value = true;

    const response = await service.getLoansAsync({
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchQuery.value,
      status: statusFilter.value,
      loanType: loanTypeFilter.value,
    });

    loans.value = response.loans;
    totalLoans.value = response.total;
    isLoading.value = false;
  } catch (error) {
    console.error("Error loading loans:", error);
    isLoading.value = false;
  }
};

const refreshLoans = async () => {
  await loadLoans();
};

const handleSearch = async () => {
  currentPage.value = 1;
  await loadLoans();
};

const handleFilter = async () => {
  currentPage.value = 1;
  await loadLoans();
};

const resetFilters = async () => {
  searchQuery.value = "";
  statusFilter.value = "";
  loanTypeFilter.value = "";
  currentPage.value = 1;
  await loadLoans();
};

const changePage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    await loadLoans();
  }
};

const formatStatus = (status: string) => {
  return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatLoanType = (loanProduct: string) => {
  const types: { [key: string]: string } = {
    "business-loan": "Business Loan",
    "personal-loan": "Personal Loan",
    "agricultural-loan": "Agricultural Loan",
    "micro-loan": "Micro Loan",
  };
  return types[loanProduct] || loanProduct;
};

const calculateTotalDue = (loan: any) => {
  // Calculate total due based on interest method
  if (loan.interestMethod === "flat-rate") {
    // Flat rate: Principal + (Principal * Interest Rate * Duration in years)
    const durationInYears =
      loan.durationUnit === "months"
        ? loan.loanDuration / 12
        : loan.durationUnit === "weeks"
          ? loan.loanDuration / 52
          : loan.durationUnit === "days"
            ? loan.loanDuration / 365
            : loan.loanDuration;
    const interest = loan.principalAmount * (loan.interestRate / 100) * durationInYears;
    return loan.principalAmount + interest;
  } else {
    // For reducing balance or other methods, use a simplified calculation
    // This would typically be calculated based on the loan schedule
    const durationInYears =
      loan.durationUnit === "months"
        ? loan.loanDuration / 12
        : loan.durationUnit === "weeks"
          ? loan.loanDuration / 52
          : loan.durationUnit === "days"
            ? loan.loanDuration / 365
            : loan.loanDuration;
    const interest = loan.principalAmount * (loan.interestRate / 100) * durationInYears;
    return loan.principalAmount + interest;
  }
};

const approveLoan = async (loan: any) => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update loan status
    const index = loans.value.findIndex((l) => l.id === loan.id);
    if (index !== -1) {
      loans.value[index].status = "approved";
      loans.value[index].approvedAt = new Date().toISOString();
    }

    alert("Loan approved successfully");
  } catch (error) {
    alert("Failed to approve loan");
  }
};

const rejectLoan = async (loan: any) => {
  const reason = prompt("Please provide a reason for rejection:");
  if (reason) {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update loan status
      const index = loans.value.findIndex((l) => l.id === loan.id);
      if (index !== -1) {
        loans.value[index].status = "rejected";
        loans.value[index].rejectionReason = reason;
      }

      alert("Loan rejected successfully");
    } catch (error) {
      alert("Failed to reject loan");
    }
  }
};

const disburseLoan = async (loan: any) => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update loan status
    const index = loans.value.findIndex((l) => l.id === loan.id);
    if (index !== -1) {
      loans.value[index].status = "active";
      loans.value[index].disbursedAt = new Date().toISOString();
    }

    alert("Loan disbursed successfully");
  } catch (error) {
    alert("Failed to disburse loan");
  }
};

// Lifecycle
onMounted(async () => {
  await loadLoans();
});
</script>
