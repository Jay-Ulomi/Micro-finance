<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Loans</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage loan applications and track loan status
        </p>
      </div>
      <router-link to="/loans/apply" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Apply for Loan
      </router-link>
    </div>

    <!-- Filters and search -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label for="search" class="form-label">Search</label>
            <input
              id="search"
              v-model="loansStore.searchQuery"
              type="text"
              class="form-input"
              placeholder="Search by loan number, customer name..."
              @input="handleSearch"
            />
          </div>
          <div>
            <label for="status" class="form-label">Status</label>
            <select
              id="status"
              v-model="loansStore.statusFilter"
              class="form-input"
              @change="handleFilter"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="disbursed">Disbursed</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label for="loanType" class="form-label">Loan Type</label>
            <select
              id="loanType"
              v-model="loanTypeFilter"
              class="form-input"
              @change="handleFilter"
            >
              <option value="">All Types</option>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="mortgage">Mortgage</option>
              <option value="vehicle">Vehicle</option>
              <option value="education">Education</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="resetFilters" class="btn-secondary w-full">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loans table -->
    <div class="card">
      <div class="card-body">
        <div v-if="loansStore.isLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <div v-else-if="loansStore.filteredLoans.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No loans found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by applying for a new loan.
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Loan Number</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="loan in loansStore.filteredLoans" :key="loan.id">
                <td>
                  <span class="font-mono text-sm text-gray-900">{{ loan.loanNumber }}</span>
                </td>
                <td>
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span class="text-primary-600 font-medium text-sm">
                        {{ loan.customer.firstName.charAt(0) }}{{ loan.customer.lastName.charAt(0) }}
                      </span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ loan.customer.firstName }} {{ loan.customer.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">{{ loan.customer.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ loan.loanType }}
                  </span>
                </td>
                <td>
                  <div class="text-sm font-medium text-gray-900">{{ formatCurrency(loan.amount) }}</div>
                  <div class="text-sm text-gray-500">{{ loan.term }} months</div>
                </td>
                <td>
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      {
                        'bg-yellow-100 text-yellow-800': loan.status === 'pending',
                        'bg-blue-100 text-blue-800': loan.status === 'under_review',
                        'bg-green-100 text-green-800': loan.status === 'approved',
                        'bg-purple-100 text-purple-800': loan.status === 'disbursed',
                        'bg-indigo-100 text-indigo-800': loan.status === 'active',
                        'bg-red-100 text-red-800': loan.status === 'overdue',
                        'bg-gray-100 text-gray-800': loan.status === 'closed'
                      }
                    ]"
                  >
                    {{ formatStatus(loan.status) }}
                  </span>
                </td>
                <td>
                  <div class="text-sm text-gray-900">{{ formatDate(loan.createdAt) }}</div>
                </td>
                <td>
                  <div class="flex space-x-2">
                    <router-link
                      :to="`/loans/${loan.id}`"
                      class="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      View
                    </router-link>
                    <button
                      v-if="loan.status === 'pending'"
                      @click="approveLoan(loan)"
                      class="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Approve
                    </button>
                    <button
                      v-if="loan.status === 'pending'"
                      @click="rejectLoan(loan)"
                      class="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Reject
                    </button>
                    <button
                      v-if="loan.status === 'approved'"
                      @click="disburseLoan(loan)"
                      class="text-purple-600 hover:text-purple-900 text-sm font-medium"
                    >
                      Disburse
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="loansStore.total > loansStore.limit" class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ (loansStore.currentPage - 1) * loansStore.limit + 1 }} to
            {{ Math.min(loansStore.currentPage * loansStore.limit, loansStore.total) }} of
            {{ loansStore.total }} results
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(loansStore.currentPage - 1)"
              :disabled="loansStore.currentPage === 1"
              class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="changePage(loansStore.currentPage + 1)"
              :disabled="loansStore.currentPage * loansStore.limit >= loansStore.total"
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
import { ref, onMounted, inject } from 'vue';
import { useLoansStore } from '@/store/loans';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

const loansStore = useLoansStore();
const loanTypeFilter = ref('');

const showSuccess = inject('showSuccess') as (message: string) => void;
const showError = inject('showError') as (message: string) => void;

onMounted(async () => {
  await loansStore.getLoans();
});

const handleSearch = () => {
  loansStore.getLoans();
};

const handleFilter = () => {
  loansStore.getLoans();
};

const resetFilters = () => {
  loanTypeFilter.value = '';
  loansStore.resetFilters();
  loansStore.getLoans();
};

const changePage = (page: number) => {
  loansStore.getLoans({ page });
};

const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const approveLoan = async (loan: any) => {
  try {
    await loansStore.approveLoan(loan.id, { notes: 'Approved by loan officer' });
    showSuccess('Loan approved successfully');
  } catch (error) {
    showError('Failed to approve loan');
  }
};

const rejectLoan = async (loan: any) => {
  const reason = prompt('Please provide a reason for rejection:');
  if (reason) {
    try {
      await loansStore.rejectLoan(loan.id, { reason });
      showSuccess('Loan rejected successfully');
    } catch (error) {
      showError('Failed to reject loan');
    }
  }
};

const disburseLoan = async (loan: any) => {
  try {
    await loansStore.disburseLoan(loan.id, { 
      disbursementDate: new Date().toISOString().split('T')[0],
      notes: 'Loan disbursed successfully'
    });
    showSuccess('Loan disbursed successfully');
  } catch (error) {
    showError('Failed to disburse loan');
  }
};
</script>
