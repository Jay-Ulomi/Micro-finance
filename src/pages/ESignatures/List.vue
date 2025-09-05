<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">View E-Signatures</h1>
        <p class="text-sm text-gray-600">Manage electronic signature requests and documents</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportSignatures" class="btn btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="createSignatureRequest" class="btn btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          New Request
        </button>
      </div>
    </div>

    <!-- Advanced Search -->
    <div class="card">
      <div class="card-header">
        <button
          @click="showAdvancedSearch = !showAdvancedSearch"
          class="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span class="font-medium"
            >Advanced Search: Click here to {{ showAdvancedSearch ? "Hide" : "Show" }}</span
          >
          <ChevronDownIcon
            :class="['w-4 h-4 ml-2 transition-transform', showAdvancedSearch ? 'rotate-180' : '']"
          />
        </button>
      </div>
      <div v-if="showAdvancedSearch" class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Signer Name</label>
            <input
              v-model="filters.name"
              type="text"
              placeholder="Search by name"
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select v-model="filters.type" class="form-input">
              <option value="">All Types</option>
              <option value="loan-agreement">Loan Agreement</option>
              <option value="investment-contract">Investment Contract</option>
              <option value="account-opening">Account Opening</option>
              <option value="kyc-document">KYC Document</option>
              <option value="policy-agreement">Policy Agreement</option>
              <option value="amendment">Amendment</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="filters.status" class="form-input">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="signed">Signed</option>
              <option value="expired">Expired</option>
              <option value="declined">Declined</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sent Date</label>
            <div class="flex space-x-2">
              <input v-model="filters.fromDate" type="date" class="form-input" />
              <input v-model="filters.toDate" type="date" class="form-input" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Signed Date</label>
            <div class="flex space-x-2">
              <input v-model="filters.signedFromDate" type="date" class="form-input" />
              <input v-model="filters.signedToDate" type="date" class="form-input" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="filters.email"
              type="email"
              placeholder="Search by email"
              class="form-input"
            />
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="resetFilters" class="btn btn-secondary">Reset</button>
          <button @click="searchSignatures" class="btn btn-primary">Search</button>
        </div>
      </div>
    </div>

    <!-- E-Signature Statistics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-orange-600">{{ pendingCount }}</div>
          <div class="text-sm text-gray-600">Pending Signatures</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-green-600">{{ signedCount }}</div>
          <div class="text-sm text-gray-600">Completed</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-red-600">{{ expiredCount }}</div>
          <div class="text-sm text-gray-600">Expired</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center p-4">
          <div class="text-2xl font-bold text-blue-600">{{ completionRate.toFixed(1) }}%</div>
          <div class="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>
    </div>

    <!-- E-Signatures Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">E-Signature Requests</h3>
        <div class="flex items-center space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search E-Signatures"
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
        <div v-if="filteredSignatures.length === 0" class="text-center py-12">
          <DocumentTextIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 mb-4 font-medium">No e-signature requests found.</p>
          <button @click="createSignatureRequest" class="btn btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Create First Request
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Sent</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Signed Date</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Original File</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Signed File</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="signature in paginatedSignatures" :key="signature.id" class="hover:bg-gray-50">
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    >
                      <span class="text-sm font-medium text-indigo-700">
                        {{ getInitials(signature.signerName) }}
                      </span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-medium text-gray-900 truncate">{{ signature.signerName }}</div>
                      <div class="text-sm text-gray-500 truncate">{{ signature.signerEmail }}</div>
                      <div v-if="signature.organization" class="text-xs text-gray-400 truncate">
                        {{ signature.organization }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap text-sm">
                  <div class="font-medium">{{ formatDate(signature.sentDate) }}</div>
                  <div class="text-gray-500 text-xs">{{ formatTime(signature.sentDate) }}</div>
                  <div class="text-xs text-gray-400">
                    by {{ signature.senderName }}
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap text-sm">
                  <div v-if="signature.signedDate">
                    <div class="font-medium">{{ formatDate(signature.signedDate) }}</div>
                    <div class="text-gray-500 text-xs">{{ formatTime(signature.signedDate) }}</div>
                  </div>
                  <div v-else class="text-gray-400">
                    Not signed
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <button
                    @click="downloadOriginal(signature)"
                    class="btn btn-xs btn-outline"
                    title="Download Original"
                  >
                    <ArrowDownTrayIcon class="w-3 h-3 mr-1" />
                    {{ signature.originalFileName }}
                  </button>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ formatFileSize(signature.originalFileSize) }}
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <button
                    v-if="signature.signedFileName"
                    @click="downloadSigned(signature)"
                    class="btn btn-xs btn-success"
                    title="Download Signed"
                  >
                    <ArrowDownTrayIcon class="w-3 h-3 mr-1" />
                    {{ signature.signedFileName }}
                  </button>
                  <div v-else class="text-gray-400 text-xs">
                    Not available
                  </div>
                  <div v-if="signature.signedFileSize" class="text-xs text-gray-500 mt-1">
                    {{ formatFileSize(signature.signedFileSize) }}
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <span :class="getDocumentTypeClass(signature.documentType)" class="badge">
                    {{ signature.documentType }}
                  </span>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <span :class="getStatusClass(signature.status)" class="badge">
                    {{ signature.status }}
                  </span>
                  <div v-if="signature.status === 'pending' && signature.expiryDate" class="text-xs text-orange-600 mt-1">
                    Expires {{ formatDate(signature.expiryDate) }}
                  </div>
                </td>
                <td class="px-3 py-4 text-center whitespace-nowrap">
                  <div class="flex justify-center space-x-1">
                    <button
                      @click="viewDetails(signature)"
                      class="btn btn-xs btn-outline"
                      title="View Details"
                    >
                      <EyeIcon class="w-3 h-3" />
                    </button>
                    <button
                      v-if="signature.status === 'pending'"
                      @click="sendReminder(signature)"
                      class="btn btn-xs btn-info"
                      title="Send Reminder"
                    >
                      <BellIcon class="w-3 h-3" />
                    </button>
                    <button
                      @click="resendRequest(signature)"
                      class="btn btn-xs btn-warning"
                      title="Resend"
                    >
                      <ArrowPathIcon class="w-3 h-3" />
                    </button>
                    <button
                      v-if="signature.status === 'pending'"
                      @click="cancelRequest(signature)"
                      class="btn btn-xs btn-danger"
                      title="Cancel"
                    >
                      <XMarkIcon class="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredSignatures.length > 0" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredSignatures.length) }} of
            {{ filteredSignatures.length }} entries
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
              :disabled="endIndex >= filteredSignatures.length"
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
  PlusIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  EyeIcon,
  BellIcon,
  ArrowPathIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";

// Types
interface ESignatureRequest {
  id: string;
  signerName: string;
  signerEmail: string;
  organization?: string;
  sentDate: Date;
  signedDate?: Date;
  expiryDate?: Date;
  originalFileName: string;
  originalFileSize: number;
  signedFileName?: string;
  signedFileSize?: number;
  documentType: string;
  status: "pending" | "signed" | "expired" | "declined" | "cancelled";
  senderName: string;
  requestId: string;
}

// Reactive data
const router = useRouter();
const searchQuery = ref("");
const entriesPerPage = ref(20);
const currentPage = ref(1);
const showAdvancedSearch = ref(false);

// Filters
const filters = ref({
  name: "",
  type: "",
  status: "",
  fromDate: "",
  toDate: "",
  signedFromDate: "",
  signedToDate: "",
  email: "",
});

// Mock data
const eSignatures = ref<ESignatureRequest[]>([
  {
    id: "1",
    signerName: "John Anderson",
    signerEmail: "john.anderson@andersonholdings.com",
    organization: "Anderson Holdings Ltd",
    sentDate: new Date("2024-09-01T10:30:00"),
    signedDate: new Date("2024-09-03T14:20:00"),
    originalFileName: "loan-agreement-001.pdf",
    originalFileSize: 2048576,
    signedFileName: "loan-agreement-001-signed.pdf",
    signedFileSize: 2156789,
    documentType: "loan-agreement",
    status: "signed",
    senderName: "Admin User",
    requestId: "REQ001",
  },
  {
    id: "2",
    signerName: "Sarah Chen",
    signerEmail: "sarah.chen@chenvc.com",
    organization: "Chen Venture Capital",
    sentDate: new Date("2024-09-02T09:15:00"),
    expiryDate: new Date("2024-09-16T09:15:00"),
    originalFileName: "investment-contract-002.pdf",
    originalFileSize: 1536000,
    documentType: "investment-contract",
    status: "pending",
    senderName: "Investment Manager",
    requestId: "REQ002",
  },
  {
    id: "3",
    signerName: "Michael Rodriguez",
    signerEmail: "m.rodriguez@rodriguezfg.com",
    organization: "Rodriguez Financial Group",
    sentDate: new Date("2024-08-28T16:45:00"),
    signedDate: new Date("2024-08-30T11:30:00"),
    originalFileName: "account-opening-form.pdf",
    originalFileSize: 1024000,
    signedFileName: "account-opening-form-signed.pdf",
    signedFileSize: 1087654,
    documentType: "account-opening",
    status: "signed",
    senderName: "Account Manager",
    requestId: "REQ003",
  },
  {
    id: "4",
    signerName: "Emily Johnson",
    signerEmail: "emily.johnson@johnsonassets.com",
    organization: "Johnson Asset Management",
    sentDate: new Date("2024-08-25T14:20:00"),
    expiryDate: new Date("2024-08-22T14:20:00"),
    originalFileName: "kyc-verification.pdf",
    originalFileSize: 756000,
    documentType: "kyc-document",
    status: "expired",
    senderName: "Compliance Officer",
    requestId: "REQ004",
  },
  {
    id: "5",
    signerName: "David Kim",
    signerEmail: "david.kim@kiminnovation.com",
    organization: "Kim Innovation Fund",
    sentDate: new Date("2024-08-20T11:00:00"),
    originalFileName: "policy-agreement.pdf",
    originalFileSize: 512000,
    documentType: "policy-agreement",
    status: "declined",
    senderName: "Legal Team",
    requestId: "REQ005",
  },
  {
    id: "6",
    signerName: "Lisa Thompson",
    signerEmail: "lisa.thompson@thompsonwealth.com",
    organization: "Thompson Wealth Partners",
    sentDate: new Date("2024-09-04T08:30:00"),
    expiryDate: new Date("2024-09-18T08:30:00"),
    originalFileName: "amendment-contract.pdf",
    originalFileSize: 384000,
    documentType: "amendment",
    status: "pending",
    senderName: "Contract Manager",
    requestId: "REQ006",
  },
  {
    id: "7",
    signerName: "Robert Brown",
    signerEmail: "robert.brown@browncap.com",
    organization: "Brown Capital Management",
    sentDate: new Date("2024-09-01T15:00:00"),
    originalFileName: "loan-modification.pdf",
    originalFileSize: 1280000,
    documentType: "loan-agreement",
    status: "cancelled",
    senderName: "Loan Officer",
    requestId: "REQ007",
  },
  {
    id: "8",
    signerName: "Jennifer Wilson",
    signerEmail: "jennifer.wilson@wilsoninvest.com",
    organization: "Wilson Investment Group",
    sentDate: new Date("2024-08-30T13:45:00"),
    signedDate: new Date("2024-09-02T10:15:00"),
    originalFileName: "investor-agreement.pdf",
    originalFileSize: 1792000,
    signedFileName: "investor-agreement-signed.pdf",
    signedFileSize: 1856432,
    documentType: "investment-contract",
    status: "signed",
    senderName: "Investment Advisor",
    requestId: "REQ008",
  },
]);

// Computed properties
const filteredSignatures = computed(() => {
  let result = eSignatures.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (signature) =>
        signature.signerName.toLowerCase().includes(query) ||
        signature.signerEmail.toLowerCase().includes(query) ||
        signature.originalFileName.toLowerCase().includes(query) ||
        signature.documentType.toLowerCase().includes(query) ||
        signature.requestId.toLowerCase().includes(query),
    );
  }

  // Apply advanced filters
  if (filters.value.name) {
    const query = filters.value.name.toLowerCase();
    result = result.filter((signature) => signature.signerName.toLowerCase().includes(query));
  }

  if (filters.value.type) {
    result = result.filter((signature) => signature.documentType === filters.value.type);
  }

  if (filters.value.status) {
    result = result.filter((signature) => signature.status === filters.value.status);
  }

  if (filters.value.fromDate) {
    const fromDate = new Date(filters.value.fromDate);
    result = result.filter((signature) => signature.sentDate >= fromDate);
  }

  if (filters.value.toDate) {
    const toDate = new Date(filters.value.toDate);
    toDate.setHours(23, 59, 59);
    result = result.filter((signature) => signature.sentDate <= toDate);
  }

  if (filters.value.signedFromDate) {
    const fromDate = new Date(filters.value.signedFromDate);
    result = result.filter(
      (signature) => signature.signedDate && signature.signedDate >= fromDate,
    );
  }

  if (filters.value.signedToDate) {
    const toDate = new Date(filters.value.signedToDate);
    toDate.setHours(23, 59, 59);
    result = result.filter((signature) => signature.signedDate && signature.signedDate <= toDate);
  }

  if (filters.value.email) {
    const query = filters.value.email.toLowerCase();
    result = result.filter((signature) => signature.signerEmail.toLowerCase().includes(query));
  }

  return result;
});

const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => startIndex.value + entriesPerPage.value);

const paginatedSignatures = computed(() => {
  return filteredSignatures.value.slice(startIndex.value, endIndex.value);
});

const pendingCount = computed(() => {
  return filteredSignatures.value.filter((sig) => sig.status === "pending").length;
});

const signedCount = computed(() => {
  return filteredSignatures.value.filter((sig) => sig.status === "signed").length;
});

const expiredCount = computed(() => {
  return filteredSignatures.value.filter((sig) => sig.status === "expired").length;
});

const completionRate = computed(() => {
  if (filteredSignatures.value.length === 0) return 0;
  return (signedCount.value / filteredSignatures.value.length) * 100;
});

// Methods
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getDocumentTypeClass = (type: string): string => {
  const classes: { [key: string]: string } = {
    "loan-agreement": "badge-primary",
    "investment-contract": "badge-success",
    "account-opening": "badge-info",
    "kyc-document": "badge-warning",
    "policy-agreement": "badge-secondary",
    "amendment": "badge-purple",
  };
  return classes[type] || "badge-secondary";
};

const getStatusClass = (status: string): string => {
  const classes: { [key: string]: string } = {
    pending: "badge-warning",
    signed: "badge-success",
    expired: "badge-danger",
    declined: "badge-danger",
    cancelled: "badge-secondary",
  };
  return classes[status] || "badge-secondary";
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const resetFilters = () => {
  filters.value = {
    name: "",
    type: "",
    status: "",
    fromDate: "",
    toDate: "",
    signedFromDate: "",
    signedToDate: "",
    email: "",
  };
  currentPage.value = 1;
};

const searchSignatures = () => {
  currentPage.value = 1;
};

const exportSignatures = () => {
  const csvContent = [
    "Signer Name,Email,Organization,Sent Date,Signed Date,Document Type,Status,Original File,Signed File,Sender",
    ...filteredSignatures.value.map(
      (signature) =>
        `"${signature.signerName}","${signature.signerEmail}","${signature.organization || ""}","${signature.sentDate.toISOString()}","${signature.signedDate?.toISOString() || ""}","${signature.documentType}","${signature.status}","${signature.originalFileName}","${signature.signedFileName || ""}","${signature.senderName}"`,
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `e_signatures_export_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const createSignatureRequest = () => {
  router.push("/e-signatures/create");
};

const downloadOriginal = (signature: ESignatureRequest) => {
  alert(`Download original file: ${signature.originalFileName}`);
};

const downloadSigned = (signature: ESignatureRequest) => {
  alert(`Download signed file: ${signature.signedFileName}`);
};

const viewDetails = (signature: ESignatureRequest) => {
  alert(`View details for request: ${signature.requestId}`);
};

const sendReminder = (signature: ESignatureRequest) => {
  if (confirm(`Send reminder to ${signature.signerName}?`)) {
    alert("Reminder sent successfully!");
  }
};

const resendRequest = (signature: ESignatureRequest) => {
  if (confirm(`Resend signature request to ${signature.signerName}?`)) {
    alert("Request resent successfully!");
  }
};

const cancelRequest = (signature: ESignatureRequest) => {
  if (confirm(`Cancel signature request for ${signature.signerName}?`)) {
    signature.status = "cancelled";
    alert("Request cancelled successfully!");
  }
};

defineOptions({
  name: "ESignaturesList",
});
</script>