<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.go(-1)"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Borrower Details</h1>
          <p class="mt-1 text-sm text-gray-500">View and manage borrower information</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button v-if="!isEditing" @click="startEditing" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
        <button v-if="isEditing" @click="saveChanges" :disabled="isSaving" class="btn-primary">
          <svg v-if="isSaving" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {{ isSaving ? "Saving..." : "Save Changes" }}
        </button>
        <button v-if="isEditing" @click="cancelEditing" class="btn-secondary">Cancel</button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg
          class="w-5 h-5 text-red-400 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-red-800">Error loading borrower</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Borrower details -->
    <div v-else-if="borrower" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Personal Information</h2>
            <span
              :class="[
                'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                {
                  'bg-yellow-100 text-yellow-800': borrower.kycStatus === 'pending',
                  'bg-green-100 text-green-800': borrower.kycStatus === 'verified',
                  'bg-red-100 text-red-800': borrower.kycStatus === 'rejected',
                },
              ]"
            >
              {{ borrower.kycStatus }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                v-if="isEditing"
                v-model="editForm.firstName"
                type="text"
                class="form-input"
                :class="{ 'border-red-300': errors.firstName }"
              />
              <p v-else class="text-sm text-gray-900 py-2">{{ borrower.firstName }}</p>
              <p v-if="errors.firstName" class="text-sm text-red-600 mt-1">
                {{ errors.firstName }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                v-if="isEditing"
                v-model="editForm.lastName"
                type="text"
                class="form-input"
                :class="{ 'border-red-300': errors.lastName }"
              />
              <p v-else class="text-sm text-gray-900 py-2">{{ borrower.lastName }}</p>
              <p v-if="errors.lastName" class="text-sm text-red-600 mt-1">{{ errors.lastName }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-if="isEditing"
                v-model="editForm.email"
                type="email"
                class="form-input"
                :class="{ 'border-red-300': errors.email }"
              />
              <p v-else class="text-sm text-gray-900 py-2">{{ borrower.email }}</p>
              <p v-if="errors.email" class="text-sm text-red-600 mt-1">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input
                v-if="isEditing"
                v-model="editForm.mobile"
                type="tel"
                class="form-input"
                :class="{ 'border-red-300': errors.mobile }"
              />
              <p v-else class="text-sm text-gray-900 py-2">{{ borrower.mobile }}</p>
              <p v-if="errors.mobile" class="text-sm text-red-600 mt-1">{{ errors.mobile }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Unique Number</label>
              <input
                v-if="isEditing"
                v-model="editForm.uniqueNumber"
                type="text"
                class="form-input"
              />
              <p v-else class="text-sm text-gray-900 py-2">
                {{ borrower.uniqueNumber || "Not set" }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Credit Score</label>
              <input
                v-if="isEditing"
                v-model.number="editForm.creditScore"
                type="number"
                class="form-input"
                min="0"
                max="850"
              />
              <p v-else class="text-sm text-gray-900 py-2">
                {{ borrower.creditScore || "Not set" }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <DatePicker
                v-if="isEditing"
                v-model="editForm.dateOfBirth"
                placeholder="Select date of birth"
                format="yyyy-MM-dd"
              />
              <p v-else class="text-sm text-gray-900 py-2">
                {{ borrower.dateOfBirth ? formatDate(borrower.dateOfBirth) : "Not set" }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Working Status</label>
              <select v-if="isEditing" v-model="editForm.workingStatus" class="form-input">
                <option value="">Select status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
              </select>
              <p v-else class="text-sm text-gray-900 py-2">
                {{
                  borrower.workingStatus ? formatWorkingStatus(borrower.workingStatus) : "Not set"
                }}
              </p>
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              v-if="isEditing"
              v-model="editForm.address"
              rows="3"
              class="form-input"
              placeholder="Enter full address"
            ></textarea>
            <p v-else class="text-sm text-gray-900 py-2">{{ borrower.address || "Not set" }}</p>
          </div>
        </div>

        <!-- Loan Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Loan Information</h2>

          <div v-if="borrowerLoans.length > 0" class="space-y-4">
            <div
              v-for="loan in borrowerLoans"
              :key="loan.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-medium text-gray-900">{{ loan.loanType }} Loan</h3>
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    {
                      'bg-blue-100 text-blue-800': loan.status === 'active',
                      'bg-yellow-100 text-yellow-800': loan.status === 'under_review',
                      'bg-green-100 text-green-800': loan.status === 'approved',
                      'bg-red-100 text-red-800': loan.status === 'rejected',
                    },
                  ]"
                >
                  {{ loan.status }}
                </span>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">Amount</p>
                  <p class="font-medium">
                    {{ formatCurrency(loan.approvedAmount || loan.requestedAmount) }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">Interest Rate</p>
                  <p class="font-medium">{{ loan.interestRate }}%</p>
                </div>
                <div>
                  <p class="text-gray-500">Term</p>
                  <p class="font-medium">{{ loan.loanTerm }} months</p>
                </div>
                <div>
                  <p class="text-gray-500">Outstanding</p>
                  <p class="font-medium">{{ formatCurrency(loan.outstandingBalance) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <svg
              class="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <p>No loans found for this borrower</p>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Borrower Photo -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <span class="text-2xl font-bold text-blue-600">
                {{ getInitials(borrower.firstName, borrower.lastName) }}
              </span>
            </div>
            <button v-if="isEditing" class="text-sm text-blue-600 hover:text-blue-800">
              Change Photo
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Registration Date</span>
              <span class="text-sm font-medium">{{ formatDate(borrower.createdAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Last Updated</span>
              <span class="text-sm font-medium">{{ formatDate(borrower.updatedAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Loan Officer</span>
              <span class="text-sm font-medium">{{ borrower.loanOfficer || "Unassigned" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Total Loans</span>
              <span class="text-sm font-medium">{{ borrowerLoans.length }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div class="space-y-3">
            <button @click="createNewLoan" class="w-full btn-primary text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Loan
            </button>
            <button @click="viewDocuments" class="w-full btn-secondary text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Documents
            </button>
            <button @click="sendMessage" class="w-full btn-secondary text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import DatePicker from "@/components/DatePicker.vue";
import { service, type Borrower, type Loan } from "@/services";

const route = useRoute();
const router = useRouter();

// State
const isLoading = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const error = ref("");
const borrower = ref<Borrower | null>(null);
const borrowerLoans = ref<Loan[]>([]);

// Edit form
const editForm = ref({
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  uniqueNumber: "",
  creditScore: 0,
  dateOfBirth: "",
  workingStatus: "",
  address: "",
});

// Validation errors
const errors = ref<Record<string, string>>({});

// Computed
const borrowerId = computed(() => route.params.id as string);

// Methods
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatWorkingStatus = (status: string) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const loadBorrower = async () => {
  try {
    isLoading.value = true;
    error.value = "";

    const borrowerData = await service.getBorrowerAsync(borrowerId.value);
    if (!borrowerData) {
      error.value = "Borrower not found";
      return;
    }

    borrower.value = borrowerData;

    // Load borrower's loans
    const loansResponse = await service.getLoansAsync({
      borrowerId: borrowerId.value,
      limit: 100,
    });
    borrowerLoans.value = loansResponse.loans;
  } catch (err) {
    console.error("Error loading borrower:", err);
    error.value = "Failed to load borrower information";
  } finally {
    isLoading.value = false;
  }
};

const startEditing = () => {
  if (!borrower.value) return;

  editForm.value = {
    firstName: borrower.value.firstName,
    lastName: borrower.value.lastName,
    email: borrower.value.email,
    mobile: borrower.value.mobile,
    uniqueNumber: borrower.value.uniqueNumber || "",
    creditScore: borrower.value.creditScore || 0,
    dateOfBirth: borrower.value.dateOfBirth || "",
    workingStatus: borrower.value.workingStatus || "",
    address: borrower.value.address || "",
  };

  isEditing.value = true;
  errors.value = {};
};

const cancelEditing = () => {
  isEditing.value = false;
  errors.value = {};
};

const validateForm = () => {
  errors.value = {};

  if (!editForm.value.firstName.trim()) {
    errors.value.firstName = "First name is required";
  }

  if (!editForm.value.lastName.trim()) {
    errors.value.lastName = "Last name is required";
  }

  if (!editForm.value.email.trim()) {
    errors.value.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.value.email)) {
    errors.value.email = "Please enter a valid email address";
  }

  if (!editForm.value.mobile.trim()) {
    errors.value.mobile = "Mobile number is required";
  }

  return Object.keys(errors.value).length === 0;
};

const saveChanges = async () => {
  if (!validateForm()) return;

  try {
    isSaving.value = true;

    // In a real application, this would call the API to update the borrower
    // For now, we'll just update the local data
    if (borrower.value) {
      Object.assign(borrower.value, {
        ...editForm.value,
        updatedAt: new Date().toISOString(),
      });
    }

    isEditing.value = false;
    alert("Borrower information updated successfully");
  } catch (err) {
    console.error("Error saving borrower:", err);
    alert("Failed to update borrower information");
  } finally {
    isSaving.value = false;
  }
};

const createNewLoan = () => {
  router.push(`/loans/create?borrowerId=${borrowerId.value}`);
};

const viewDocuments = () => {
  router.push(`/borrowers/${borrowerId.value}/documents`);
};

const sendMessage = () => {
  router.push(`/borrowers/${borrowerId.value}/messages`);
};

// Initialize
onMounted(() => {
  loadBorrower();
});
</script>
